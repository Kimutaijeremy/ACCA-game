// Migration tests — driven against Jeremy's REAL v3 export fixture (Brief §7).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planMigration, applyMigration, rollbackMigration } from '../src/engine/migrate.js';
import { MemoryStore, MemoryLogAdapter, LearnerStore, KEYS, loadMeta } from '../src/engine/store.js';
import { AttemptLog } from '../src/engine/log.js';

const newStore = (kv) => new LearnerStore({
  logAdapter: new MemoryLogAdapter(), kv: kv ?? new MemoryStore(), onPersistenceError: () => {},
});
import { deriveAll } from '../src/engine/derive.js';
import { loadV3Fixture, loadGraphFromSpec } from '../src/engine/node-loader.js';

const V3 = loadV3Fixture();

test('the real fixture migrates as history only, creating zero concept states', () => {
  const plan = planMigration(V3);
  assert.equal(plan.ok, true);

  // streak is real and carries forward
  assert.deepEqual(plan.newState.streak, { cur: 3, best: 10 });

  // three topic records, by DISPLAY NAME, with the right counts
  const t = plan.newState.v1History.topics;
  assert.equal(t.length, 3);
  assert.deepEqual(t.map((x) => x.name), [
    'Double entry & the equation',
    'Adjustments & period end',
    'Trial balance to statements',
  ]);
  assert.deepEqual(t.map((x) => [x.seen, x.correct]), [[14, 12], [10, 9], [10, 9]]);
  assert.deepEqual(plan.newState.v1History.totals, { seen: 34, correct: 30 });

  // no internal FA1/FA2/FA3 key leaks into the history panel
  const serialized = JSON.stringify(plan.newState.v1History);
  assert.ok(!/\bFA[123]\b/.test(serialized), 'internal node keys must never surface');

  // timestamps preserved (best-effort, positional to FA nodes)
  assert.equal(t[0].lastAttemptAt, 1785189715880);

  // THE RULE: zero concept states, empty attempt log
  assert.equal(plan.newState.attemptLog.length, 0);
  assert.equal(plan.summary.conceptStatesCreated, 0);
});

test('after migration every concept is Unvisited (no mastery derived from v3)', () => {
  const plan = planMigration(V3);
  const graph = loadGraphFromSpec();
  const { states } = deriveAll(new AttemptLog(plan.newState.attemptLog), {
    now: Date.now(),
    conceptIds: graph.liveIds(),
  });
  const nonUnvisited = [...states.values()].filter((s) => s.state !== 'Unvisited');
  assert.equal(nonUnvisited.length, 0, 'every one of the 191 concepts starts unvisited');
  assert.equal(states.size, graph.liveIds().length);
});

test('apply writes v4 meta and never touches the v3 keys', async () => {
  // A KV that already holds the live v3 app data.
  const kv = new MemoryStore({
    pt_stats: JSON.stringify(V3.stats),
    pt_streak: JSON.stringify(V3.streak),
    pt_nodes: JSON.stringify(V3.nodes),
  });
  const before = kv.getItem('pt_stats');
  const store = newStore(kv);

  const res = await applyMigration(V3, store, { now: 1_800_000_000_000 });
  assert.equal(res.applied, true);

  const saved = loadMeta(kv);
  assert.equal(saved.schema, 'paper-trail/v4');
  assert.deepEqual(saved.streak, { cur: 3, best: 10 });
  assert.equal(saved.createdAt, 1_800_000_000_000);
  // the attempt log store is left empty — migration creates zero attempts
  assert.equal((await store.readLogRecords()).length, 0);

  // v3 keys are byte-for-byte untouched
  assert.equal(kv.getItem('pt_stats'), before);
  assert.equal(kv.getItem('pt_nodes'), JSON.stringify(V3.nodes));
});

test('rollback removes migrated meta when there was none before', async () => {
  const kv = new MemoryStore();
  const store = newStore(kv);
  await applyMigration(V3, store);
  assert.ok(loadMeta(kv) !== null);

  const rb = rollbackMigration(store);
  assert.equal(rb.hadBackup, false);
  assert.equal(loadMeta(kv), null, 'meta removed; app returns to pre-migration');
  assert.equal(kv.getItem(KEYS.META_BACKUP), null);
});

test('rollback restores the prior v4 meta when one existed', async () => {
  const kv = new MemoryStore();
  const store = newStore(kv);
  // an earlier v4 meta exists
  const earlier = { schema: 'paper-trail/v4', createdAt: 1, streak: { cur: 9, best: 9 }, v1History: null };
  kv.setItem(KEYS.META, JSON.stringify(earlier));

  await applyMigration(V3, store);
  assert.deepEqual(loadMeta(kv).streak, { cur: 3, best: 10 }, 'migration overwrote');

  rollbackMigration(store);
  assert.deepEqual(loadMeta(kv).streak, { cur: 9, best: 9 }, 'prior meta restored exactly');
});

test('migration is idempotent — applying twice does not duplicate history or double the streak', async () => {
  const kv = new MemoryStore();
  const store = newStore(kv);
  await applyMigration(V3, store, { now: 1000 });
  const s1 = loadMeta(kv);
  await applyMigration(V3, store, { now: 2000 });
  const s2 = loadMeta(kv);

  // streak is copied, never accumulated
  assert.deepEqual(s2.streak, s1.streak);
  assert.deepEqual(s2.streak, { cur: 3, best: 10 });
  // history panel is rebuilt from v3.stats each time — same three topics, not six
  assert.equal(s2.v1History.topics.length, 3);
  assert.deepEqual(s2.v1History.topics, s1.v1History.topics);
  assert.deepEqual(s2.v1History.totals, { seen: 34, correct: 30 });
  // still zero attempts in the log
  assert.equal((await store.readLogRecords()).length, 0);
});

test('tolerates a v3 file with keys missing or empty', () => {
  const p1 = planMigration({});
  assert.equal(p1.ok, true);
  assert.deepEqual(p1.newState.streak, { cur: 0, best: 0 });
  assert.equal(p1.newState.v1History.topics.length, 0);

  const p2 = planMigration({ v: 3, stats: {}, streak: { cur: 2, best: 5 }, nodes: {} });
  assert.equal(p2.newState.v1History.topics.length, 0);
  assert.deepEqual(p2.newState.streak, { cur: 2, best: 5 });

  const p3 = planMigration({ v: 2, stats: V3.stats });
  assert.ok(p3.warnings.some((w) => /version is 2/.test(w)));

  assert.throws(() => planMigration(null), /not an object/);
});
