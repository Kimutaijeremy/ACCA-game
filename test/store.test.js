// Persistence tests, including the non-silent write-failure guarantee (quota / disabled storage).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MemoryStore, trySaveState, saveState, loadState, isQuotaError, emptyState, KEY_PREFIX,
} from '../src/engine/store.js';

// A store whose writes fail the way a full browser localStorage does.
class QuotaStore extends MemoryStore {
  setItem() {
    const e = new Error('The quota has been exceeded.');
    e.name = 'QuotaExceededError';
    throw e;
  }
}

test('a failed write is reported, never swallowed', () => {
  const res = trySaveState(emptyState(), new QuotaStore());
  assert.equal(res.ok, false);
  assert.equal(res.quota, true, 'quota failure is flagged so the UI can warn + prompt an export');
  assert.ok(res.error instanceof Error);
  assert.equal(isQuotaError(res.error), true);
});

test('trySaveState reports success on a healthy store', () => {
  const store = new MemoryStore();
  assert.deepEqual(trySaveState(emptyState(), store), { ok: true });
  assert.ok(loadState(store) !== null);
});

test('saveState still throws directly (callers that want the exception get it)', () => {
  assert.throws(() => saveState(emptyState(), new QuotaStore()), /quota/i);
});

test('state uses the distinctive papertrail:v4: namespace', () => {
  assert.equal(KEY_PREFIX, 'papertrail:v4:');
});
