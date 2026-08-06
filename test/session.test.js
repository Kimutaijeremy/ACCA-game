// Session tests (Brief Amendment 01, clause E): a persisted, resumable set with a position index,
// teaching surfaces as overlays that never move the position, resume → question n+1, and restart
// kept distinct — in name and label — from resume.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSession, currentItemId, answerCurrent, resume, restart, isComplete,
  openOverlay, closeOverlay, overlayOpen, OVERLAY_SURFACES,
  CONTROL_LABELS, labelFor, assertControlLabelsHonest, toJSON, fromJSON, SESSION_SCHEMA,
} from '../src/engine/session.js';
import { MemoryStore, MemoryLogAdapter, LearnerStore, STATE_SCHEMA } from '../src/engine/store.js';

const IDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
const newSession = () => createSession({ paperId: 'FA', kind: 'sectionA', itemIds: IDS, now: 1000 });

function freshStore() {
  return new LearnerStore({
    logAdapter: new MemoryLogAdapter(),
    kv: new MemoryStore(),
    onPersistenceError: () => {},
  });
}

test('a new session has a position index starting at the first question', () => {
  const s = newSession();
  assert.equal(s.schema, SESSION_SCHEMA);
  assert.equal(s.position, 0);
  assert.equal(s.responses.length, 0);
  assert.equal(currentItemId(s), 'q1');
  assert.equal(isComplete(s), false);
});

test('answering advances the position one question at a time', () => {
  let s = newSession();
  s = answerCurrent(s, { correct: true });
  assert.equal(s.position, 1);
  assert.equal(s.responses.length, 1);
  assert.equal(s.responses[0].itemId, 'q1'); // itemId stamped from position, not trusted from caller
  assert.equal(currentItemId(s), 'q2');
});

test('resume returns to question n+1 — the next unanswered item, not the start', () => {
  let s = newSession();
  s = answerCurrent(s, { correct: true });   // q1 done
  s = answerCurrent(s, { correct: false });  // q2 done
  const r = resume(s);                        // two answered ⇒ resume at the third
  assert.equal(r.done, false);
  assert.equal(r.position, 2);
  assert.equal(r.itemId, 'q3');
});

test('answering the last item completes the set; resume reports done', () => {
  let s = newSession();
  for (const _ of IDS) s = answerCurrent(s, { correct: true });
  assert.equal(isComplete(s), true);
  assert.equal(currentItemId(s), null);
  assert.deepEqual(resume(s), { done: true, position: 5, itemId: null });
  assert.throws(() => answerCurrent(s, { correct: true }), /already complete/);
});

test('opening a teaching surface is an OVERLAY — position and responses are untouched', () => {
  let s = newSession();
  s = answerCurrent(s, { correct: true }); // at q2
  const beforePos = s.position;
  const beforeResponses = JSON.stringify(s.responses);

  const withNutshell = openOverlay(s, OVERLAY_SURFACES.NUTSHELL);
  assert.equal(overlayOpen(withNutshell), true);
  assert.equal(withNutshell.overlay.surface, 'nutshell');
  // the overlay changed nothing about where we are in the set
  assert.equal(withNutshell.position, beforePos);
  assert.equal(JSON.stringify(withNutshell.responses), beforeResponses);
  assert.equal(currentItemId(withNutshell), 'q2');

  const closed = closeOverlay(withNutshell);
  assert.equal(overlayOpen(closed), false);
  assert.equal(closed.position, beforePos);
  assert.equal(currentItemId(closed), 'q2');
});

test('opening go-deeper mid-set, then resuming, still lands on the same next question', () => {
  let s = newSession();
  s = answerCurrent(s, { correct: false }); // at q2
  s = openOverlay(s, OVERLAY_SURFACES.GO_DEEPER, { conceptId: 'FA-11' });
  const r = resume(s);
  assert.equal(r.itemId, 'q2'); // the overlay did not advance or reset the set
  assert.equal(r.position, 1);
});

test('an unknown teaching surface is rejected', () => {
  assert.throws(() => openOverlay(newSession(), 'sidebar'), /unknown teaching surface/);
});

test('restart begins the same set from question one — distinct from resume', () => {
  let s = newSession();
  s = answerCurrent(s, { correct: true });
  s = answerCurrent(s, { correct: true }); // position 2

  const again = restart(s);
  assert.equal(again.position, 0);
  assert.equal(again.responses.length, 0);
  assert.equal(currentItemId(again), 'q1');
  assert.deepEqual(again.itemIds, s.itemIds); // same set...
  assert.notEqual(again.id, s.id);            // ...but a new attempt

  // resume on the original is unaffected — it still points at question n+1
  assert.equal(resume(s).itemId, 'q3');
});

test('a restart control is never labelled as if it continues a set (the v3.1 bug)', () => {
  assert.equal(assertControlLabelsHonest(), true);
  assert.notEqual(CONTROL_LABELS.resume, CONTROL_LABELS.restart);
  assert.doesNotMatch(CONTROL_LABELS.restart, /resume|continue|carry on|keep going|pick up/i);
  assert.equal(labelFor('resume'), 'Resume');
  assert.equal(labelFor('restart'), 'Start over');
  assert.throws(() => labelFor('continue'), /unknown control/);
});

test('a session persists and reloads across a store round-trip (survives restart)', () => {
  const store = freshStore();
  let s = newSession();
  s = answerCurrent(s, { correct: true });
  s = openOverlay(s, OVERLAY_SURFACES.NUTSHELL);
  assert.equal(store.saveSession(s).ok, true);

  const loaded = store.loadSession();
  assert.equal(loaded.position, 1);
  assert.equal(loaded.responses[0].itemId, 'q1');
  assert.equal(loaded.overlay.surface, 'nutshell');
  assert.equal(resume(loaded).itemId, 'q2');

  store.clearSession();
  assert.equal(store.loadSession(), null);
});

test('the active session exports with everything and clears cleanly', async () => {
  const store = freshStore();
  const s = answerCurrent(newSession(), { correct: false });
  store.saveSession(s);
  const blob = await store.exportAll();
  assert.equal(blob.schema, STATE_SCHEMA);
  assert.equal(blob.session.position, 1);
});

test('session serialisation round-trips and rejects a foreign blob', () => {
  const s = answerCurrent(newSession(), { correct: true });
  assert.deepEqual(fromJSON(toJSON(s)), s);
  assert.throws(() => fromJSON({ schema: 'something-else' }), /not a paper-trail\/session/);
});
