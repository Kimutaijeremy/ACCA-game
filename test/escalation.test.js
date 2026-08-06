// Escalation tests (Brief Amendment 01, clauses F and G): nutshell-on-miss after commit, and the
// forced full lesson on the 3rd same-concept same-cause miss — both as overlays over a running set
// (clause E), never a route change, never asked.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveAfterAnswer, answerAndResolve, sameConceptCauseMisses,
  MISS_OUTCOME, ESCALATION_MISS_THRESHOLD,
} from '../src/engine/escalation.js';
import { createSession, resume, overlayOpen, closeOverlay, OVERLAY_SURFACES } from '../src/engine/session.js';

const IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
const newSession = () => createSession({ paperId: 'FA', kind: 'sectionA', itemIds: IDS, now: 1 });

// answer the current item as a miss on (concept, cause)
const miss = (s, concept, cause, opts) =>
  answerAndResolve(s, { correct: false, conceptId: concept, cause }, opts);
const hit = (s, concept, cause) =>
  answerAndResolve(s, { correct: true, conceptId: concept, cause });

test('F: a correct answer opens no overlay and just continues', () => {
  const r = hit(newSession(), 'FA-11', 'calculation_error');
  assert.equal(r.outcome, MISS_OUTCOME.CONTINUE);
  assert.equal(overlayOpen(r.session), false);
  assert.equal(r.session.position, 1); // advanced past the answered item
});

test('F: a miss reveals the nutshell AFTER commit, offering no lesson, then continues', () => {
  const r = miss(newSession(), 'FA-11', 'calculation_error');
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  assert.equal(overlayOpen(r.session), true);
  assert.equal(r.session.overlay.surface, OVERLAY_SURFACES.NUTSHELL);
  assert.equal(r.session.overlay.ref.offersLesson, false); // "No full lesson offered here."
  // the answer was committed (position advanced) and the overlay did not move it
  assert.equal(r.session.position, 1);
  assert.equal(r.session.responses[0].correct, false);
  // closing the nutshell continues to the next question
  const continued = closeOverlay(r.session);
  assert.equal(resume(continued).itemId, 'q2');
});

test('F: two same-cause misses both stay at the nutshell (below the threshold)', () => {
  let s = newSession();
  let r = miss(s, 'FA-11', 'calculation_error');
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  r = miss(closeOverlay(r.session), 'FA-11', 'calculation_error');
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  assert.equal(r.tally, 2);
});

test('G: the 3rd same-concept same-cause miss forces the full lesson as an overlay', () => {
  let s = newSession();
  let r = miss(s, 'FA-11', 'calculation_error');            // 1 → nutshell
  r = miss(closeOverlay(r.session), 'FA-11', 'calculation_error'); // 2 → nutshell
  r = miss(closeOverlay(r.session), 'FA-11', 'calculation_error'); // 3 → lesson
  assert.equal(r.outcome, MISS_OUTCOME.LESSON);
  assert.equal(r.tally, ESCALATION_MISS_THRESHOLD);
  assert.equal(overlayOpen(r.session), true);
  assert.equal(r.session.overlay.surface, OVERLAY_SURFACES.LESSON);
  assert.equal(r.session.overlay.ref.forced, true); // routed in, not asked
  assert.equal(r.session.overlay.ref.conceptId, 'FA-11');
});

test('G: misses on the same concept but DIFFERENT causes do not escalate', () => {
  let s = newSession();
  let r = miss(s, 'FA-11', 'calculation_error');
  r = miss(closeOverlay(r.session), 'FA-11', 'requirement_misread');
  r = miss(closeOverlay(r.session), 'FA-11', 'careless_slip');
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL); // three misses, three causes — no escalation
});

test('G: same cause but DIFFERENT concepts do not escalate', () => {
  let s = newSession();
  let r = miss(s, 'FA-11', 'calculation_error');
  r = miss(closeOverlay(r.session), 'FA-22', 'calculation_error');
  r = miss(closeOverlay(r.session), 'FA-26', 'calculation_error');
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
});

test('G: an undiagnosed miss (cause null) never escalates and never counts', () => {
  let s = newSession();
  let r = miss(s, 'FA-11', null);
  r = miss(closeOverlay(r.session), 'FA-11', null);
  r = miss(closeOverlay(r.session), 'FA-11', null);
  assert.equal(r.outcome, MISS_OUTCOME.NUTSHELL);
  assert.equal(r.tally, 0);
  assert.equal(sameConceptCauseMisses(r.session.responses, 'FA-11', null), 0);
});

test('G: prior misses from earlier sessions carry, so the count crosses sessions', () => {
  // two same-cause misses already in the attempt log; this session's first miss is the 3rd
  const r = miss(newSession(), 'FA-11', 'calculation_error', { priorMisses: 2 });
  assert.equal(r.outcome, MISS_OUTCOME.LESSON);
  assert.equal(r.tally, 3);
});

test('escalation overlays never move the set position (clause E invariant holds)', () => {
  let s = newSession();
  const r = miss(s, 'FA-11', 'calculation_error');
  // position advanced exactly once by the commit; the overlay added nothing
  assert.equal(r.session.position, 1);
  assert.equal(resume(closeOverlay(r.session)).position, 1);
});
