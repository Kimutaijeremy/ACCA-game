// Flag mechanism tests (Execution Order §7): one-tap flags ride in learner state and export.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFlag, openFlags, flagCounts } from '../src/engine/flags.js';
import { MemoryStore, MemoryLogAdapter, LearnerStore, emptyState } from '../src/engine/store.js';

const mk = () => new LearnerStore({ logAdapter: new MemoryLogAdapter(), kv: new MemoryStore(), onPersistenceError: () => {} });

test('a flag must target a lesson (conceptId) or an item (itemId) with a valid reason', () => {
  assert.doesNotThrow(() => validateFlag({
    id: 'f1', target: { kind: 'lesson', conceptId: 'FA-26' }, reason: 'confusing', sessionId: 's', timestamp: 1,
  }));
  assert.throws(() => validateFlag({ id: 'f2', target: { kind: 'lesson' }, reason: 'confusing', sessionId: 's', timestamp: 1 }), /conceptId/);
  assert.throws(() => validateFlag({ id: 'f3', target: { kind: 'item', itemId: 'i9' }, reason: 'nope', sessionId: 's', timestamp: 1 }), /reason/);
});

test('addFlag persists to the review queue and it survives export/import', async () => {
  const store = mk();
  store.saveMeta({ ...emptyState(), createdAt: 1 });
  store.addFlag({ id: 'f1', target: { kind: 'lesson', conceptId: 'FA-26' }, reason: 'wrong', note: 'residual value looks off', sessionId: 's', timestamp: 10 });
  store.addFlag({ id: 'f2', target: { kind: 'item', itemId: 'q7' }, reason: 'contradiction', sessionId: 's', timestamp: 20 });

  assert.equal(store.flags().length, 2);
  const blob = await store.exportAll();
  assert.equal(blob.flags.length, 2, 'flags export with everything else');

  const other = mk();
  await other.importAll(blob);
  assert.equal(other.flags().length, 2, 'flags restore on import');
  assert.equal(other.flags()[0].target.conceptId, 'FA-26');
});

test('openFlags / flagCounts drive the "fix before authoring" queue and BUILD_STATUS counts', () => {
  const flags = [
    { reason: 'wrong', resolved: false },
    { reason: 'confusing', resolved: false },
    { reason: 'wrong', resolved: true },
  ];
  assert.equal(openFlags(flags).length, 2);
  const c = flagCounts(flags);
  assert.equal(c.open, 2);
  assert.equal(c.total, 3);
  assert.equal(c.byReason.wrong, 1);
  assert.equal(c.byReason.confusing, 1);
});
