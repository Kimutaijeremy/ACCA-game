// Wiring tests (Amendment 01 E/F/G) for src/app/session-runner.js — the glue app.js calls. These
// prove the app's USE of session.js + escalation.js: persisted set, resume to n+1, overlays that
// don't move the position, nutshell-on-miss, forced lesson on the 3rd same-cause miss, and honest
// set-control labels. DOM-free and deterministic.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  startSet, loadSession, resume, commitAnswer, openTeaching, closeTeaching, restartSet, finishSet,
  currentItemId, isComplete, overlayOpen, OVERLAY_SURFACES, CONTROL_LABELS, MISS_OUTCOME,
  assertControlLabelsHonest,
} from '../src/app/session-runner.js';
import { MemoryStore, MemoryLogAdapter, LearnerStore } from '../src/engine/store.js';

function freshStore() {
  return new LearnerStore({ logAdapter: new MemoryLogAdapter(), kv: new MemoryStore(), onPersistenceError: () => {} });
}
const IDS = ['FA-04-CC1', 'FA-11-CC1', 'FA-22-CC1', 'FA-26-CC1', 'FA-63-CC1'];
const begin = (store) => startSet(store, { paperId: 'FA', itemIds: IDS, seeds: IDS.map((_, i) => i + 1), examShaped: true });
// a miss whose lifetime (concept,cause) tally we control
const missWith = (store, s, conceptId, cause, tally) =>
  commitAnswer(store, s, { conceptId, cause, correct: false, logMissesForCC: () => tally });

test('E: a fresh set persists with a position index at question one', () => {
  const store = freshStore();
  const s = begin(store);
  assert.equal(s.position, 0);
  assert.equal(currentItemId(s), 'FA-04-CC1');
  assert.equal(loadSession(store).id, s.id); // persisted (survives an app close)
  assert.deepEqual(s.seeds, [1, 2, 3, 4, 5]);
});

test('E: resume returns to question n+1 after a simulated app close', () => {
  const store = freshStore();
  let s = begin(store);
  s = commitAnswer(store, s, { conceptId: 'FA-04', cause: null, correct: true, logMissesForCC: () => 0 }).session;
  s = commitAnswer(store, s, { conceptId: 'FA-11', cause: null, correct: true, logMissesForCC: () => 0 }).session;
  // "reload": a fresh read of the persisted session
  const reloaded = loadSession(store);
  const r = resume(reloaded);
  assert.equal(r.done, false);
  assert.equal(r.position, 2);
  assert.equal(r.itemId, 'FA-22-CC1'); // question 3 = n+1, not the start
});

test('E: opening/closing a teaching overlay never moves the position or responses', () => {
  const store = freshStore();
  let s = begin(store);
  s = commitAnswer(store, s, { conceptId: 'FA-04', cause: null, correct: true, logMissesForCC: () => 0 }).session;
  const before = { pos: s.position, responses: JSON.stringify(s.responses) };
  s = openTeaching(store, s, OVERLAY_SURFACES.GO_DEEPER, { topicId: 'FA A3' });
  assert.equal(overlayOpen(s), true);
  assert.equal(s.position, before.pos);
  assert.equal(JSON.stringify(s.responses), before.responses);
  assert.equal(loadSession(store).overlay.surface, 'goDeeper'); // overlay persisted, not a route
  s = closeTeaching(store, s);
  assert.equal(overlayOpen(s), false);
  assert.equal(s.position, before.pos);
});

test('F: a committed wrong answer opens the per-concept nutshell overlay; correct opens nothing', () => {
  const store = freshStore();
  let s = begin(store);
  const ok = commitAnswer(store, s, { conceptId: 'FA-04', cause: 'careless_slip', correct: true, logMissesForCC: () => 0 });
  assert.equal(ok.outcome, MISS_OUTCOME.CONTINUE);
  assert.equal(overlayOpen(ok.session), false);

  const miss = missWith(store, ok.session, 'FA-11', 'conceptual_misunderstanding', 1);
  assert.equal(miss.outcome, MISS_OUTCOME.NUTSHELL);
  assert.equal(miss.session.overlay.surface, OVERLAY_SURFACES.NUTSHELL);
  assert.equal(miss.session.overlay.ref.conceptId, 'FA-11');
  assert.equal(miss.session.overlay.ref.offersLesson, false); // "no full lesson offered here"
});

test('G: the 3rd same-concept same-cause miss forces the lesson overlay, no prompt', () => {
  const store = freshStore();
  let s = begin(store);
  // three misses on FA-11/conceptual across the log (tally 1, 2, 3)
  let r = missWith(store, s, 'FA-11', 'conceptual_misunderstanding', 1);
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  r = missWith(store, r.session, 'FA-11', 'conceptual_misunderstanding', 2);
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  r = missWith(store, r.session, 'FA-11', 'conceptual_misunderstanding', 3);
  assert.equal(r.outcome, MISS_OUTCOME.LESSON);
  assert.equal(r.session.overlay.surface, OVERLAY_SURFACES.LESSON);
  assert.equal(r.session.overlay.ref.forced, true);
});

test('E: restart is distinct from resume, in operation and label', () => {
  const store = freshStore();
  let s = begin(store);
  s = commitAnswer(store, s, { conceptId: 'FA-04', cause: null, correct: true, logMissesForCC: () => 0 }).session;
  const again = restartSet(store, s);
  assert.equal(again.position, 0);
  assert.equal(again.responses.length, 0);
  assert.notEqual(again.id, s.id);
  // honest labels: restart must never read as continuing
  assert.equal(assertControlLabelsHonest(), true);
  assert.notEqual(CONTROL_LABELS.resume, CONTROL_LABELS.restart);
  assert.doesNotMatch(CONTROL_LABELS.restart, /resume|continue|carry on|keep going/i);
});

test('finishSet scores from responses and clears the persisted session', () => {
  const store = freshStore();
  let s = begin(store);
  s = commitAnswer(store, s, { conceptId: 'FA-04', cause: null, correct: true, logMissesForCC: () => 0 }).session;
  s = missWith(store, s, 'FA-11', 'conceptual_misunderstanding', 1).session;
  const res = finishSet(store, s);
  assert.deepEqual(res, { score: 1, size: 2, examShaped: true });
  assert.equal(loadSession(store), null);
});
