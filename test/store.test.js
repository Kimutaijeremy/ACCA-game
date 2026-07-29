// Persistence tests: the meta/log split, non-silent write failure, and the LearnerStore.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MemoryStore, MemoryLogAdapter, LearnerStore, trySaveMeta, saveMeta, loadMeta,
  isQuotaError, emptyState, KEY_PREFIX,
} from '../src/engine/store.js';

// A KV whose writes fail like a full browser localStorage.
class QuotaStore extends MemoryStore {
  setItem() { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; }
}

test('a failed meta write is reported, never swallowed', () => {
  const res = trySaveMeta(emptyState(), new QuotaStore());
  assert.equal(res.ok, false);
  assert.equal(res.quota, true);
  assert.equal(isQuotaError(res.error), true);
});

test('trySaveMeta reports success on a healthy store', () => {
  const kv = new MemoryStore();
  assert.deepEqual(trySaveMeta(emptyState(), kv), { ok: true });
  assert.ok(loadMeta(kv) !== null);
});

test('saveMeta throws directly for callers that want the exception', () => {
  assert.throws(() => saveMeta(emptyState(), new QuotaStore()), /quota/i);
});

test('state uses the distinctive papertrail:v4: namespace', () => {
  assert.equal(KEY_PREFIX, 'papertrail:v4:');
});

test('the attempt log lives in the log adapter, not in meta', async () => {
  const store = new LearnerStore(new MemoryLogAdapter(), new MemoryStore());
  store.saveMeta({ ...emptyState(), createdAt: 1 });
  await store.appendRecords([
    { id: 'a1', kind: 'lesson', conceptIds: ['FA-05'], sessionId: 's', timestamp: 10 },
    { id: 'a2', kind: 'item', conceptIds: ['FA-05'], rung: 'concept-check', correct: true, sessionId: 's', timestamp: 20 },
  ]);
  const recs = await store.readLogRecords();
  assert.equal(recs.length, 2);
  // meta in localStorage carries no attempt log
  const rawMeta = store.kv.getItem('papertrail:v4:meta');
  assert.ok(!rawMeta.includes('attemptLog'));
});

test('exportAll → importAll round-trips meta and the whole log', async () => {
  const a = new LearnerStore(new MemoryLogAdapter(), new MemoryStore());
  a.saveMeta({ ...emptyState(), createdAt: 5, streak: { cur: 3, best: 10 } });
  await a.appendRecords([
    { id: 'x1', kind: 'item', conceptIds: ['FA-05'], rung: 'standard', correct: true, sessionId: 's', timestamp: 1 },
    { id: 'x2', kind: 'item', conceptIds: ['FA-05'], rung: 'standard', correct: false, sessionId: 's', timestamp: 2 },
  ]);
  const blob = await a.exportAll();
  assert.equal(blob.attemptLog.length, 2);
  assert.deepEqual(blob.streak, { cur: 3, best: 10 });

  const b = new LearnerStore(new MemoryLogAdapter(), new MemoryStore());
  await b.importAll(blob);
  const back = await b.exportAll();
  assert.deepEqual(back, blob);
});
