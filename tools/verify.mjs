// verify.mjs — executed evidence for the four WP1 verification questions.
// Run: node tools/verify.mjs

import { MemoryStore, loadState } from '../src/engine/store.js';
import { applyMigration } from '../src/engine/migrate.js';
import { AttemptLog } from '../src/engine/log.js';
import { deriveAll } from '../src/engine/derive.js';
import { loadV3Fixture, loadGraphFromSpec } from '../src/engine/node-loader.js';

const line = (s = '') => process.stdout.write(s + '\n');
const V3 = loadV3Fixture();
const graph = loadGraphFromSpec();

// ── Q2: idempotency — apply the migration twice against the real export ──────
line('Q2 — MIGRATION IDEMPOTENCY (apply twice to the same store)');
const store = new MemoryStore();

applyMigration(V3, store, { now: 1000 });
const s1 = loadState(store);
line(`  after run 1: topics=${s1.v1History.topics.length}  streak=${JSON.stringify(s1.streak)}  attemptLog=${s1.attemptLog.length}  totals=${JSON.stringify(s1.v1History.totals)}`);

applyMigration(V3, store, { now: 2000 });
const s2 = loadState(store);
line(`  after run 2: topics=${s2.v1History.topics.length}  streak=${JSON.stringify(s2.streak)}  attemptLog=${s2.attemptLog.length}  totals=${JSON.stringify(s2.v1History.totals)}`);

// Compare the meaningful content (ignore the createdAt/migratedAt timestamps).
const strip = (s) => JSON.stringify({ streak: s.streak, topics: s.v1History.topics, totals: s.v1History.totals, log: s.attemptLog });
line(`  history/streak identical across runs: ${strip(s1) === strip(s2)}`);
line(`  streak double-counted?  ${s2.streak.cur !== s1.streak.cur ? 'YES (BUG)' : 'no'}`);
line(`  history duplicated?     ${s2.v1History.topics.length !== s1.v1History.topics.length ? 'YES (BUG)' : 'no'}`);
line('');

// ── Q4: performance — derive the whole graph from a large synthetic log ──────
line('Q4 — DERIVATION COST vs LOG SIZE (single full fold via deriveAll)');
const liveIds = graph.liveIds();
function synthLog(nRecords) {
  const recs = [];
  const base = Date.UTC(2026, 0, 1);
  for (let i = 0; i < nRecords; i++) {
    const cid = liveIds[i % liveIds.length];
    recs.push({
      id: 'x' + i,
      kind: 'item',
      conceptIds: [cid],
      rung: 'standard',
      correct: i % 5 !== 0,
      scaffold: false,
      withinBudget: true,
      timed: false,
      sessionId: 's' + (i >> 6),
      timestamp: base + i * 60000,
    });
  }
  return new AttemptLog(recs);
}

for (const n of [1000, 10000, 30000, 60000]) {
  const log = synthLog(n);
  const now = Date.now();
  // warm + measure a fold across all 191 concepts
  deriveAll(log, { now, conceptIds: liveIds });
  const t0 = performance.now();
  const runs = 5;
  for (let r = 0; r < runs; r++) deriveAll(log, { now, conceptIds: liveIds });
  const ms = (performance.now() - t0) / runs;
  line(`  ${String(n).padStart(6)} records → ${ms.toFixed(1)} ms per full derivation of all 191 concepts`);
}
