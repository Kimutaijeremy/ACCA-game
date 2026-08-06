// session-runner.js — the WIRING between the app UI and Amendment 01 clauses E, F and G. DOM-free on
// purpose: app.js is thin glue that renders, and this orchestration is unit-tested (test/session-
// runner.test.js) rather than only exercised in a browser.
//
//   Clause E — a practice set is a PERSISTED session (session.js): a position index, survives an app
//              close, resume returns to question n+1. Teaching surfaces open as overlays that never
//              move the position.
//   Clause F — a committed WRONG answer opens the per-concept nutshell overlay. A correct answer
//              opens nothing.
//   Clause G — 3 misses on the same concept with the same diagnosed cause force the lesson overlay
//              (escalation.js), no prompt.
//
// This module never touches content or the DOM: it sets overlay refs by conceptId and returns an
// outcome; app.js resolves conceptId → nutshell/lesson text and renders. Persistence goes through the
// LearnerStore's saveSession/loadSession/clearSession (session rides in meta, so it survives close).

import {
  createSession, currentItemId, resume as resumeSession, restart, isComplete,
  openOverlay, closeOverlay, overlayOpen, OVERLAY_SURFACES, CONTROL_LABELS, labelFor, assertControlLabelsHonest,
} from '../engine/session.js';
import { answerAndResolve, MISS_OUTCOME, sameConceptCauseMisses } from '../engine/escalation.js';

export {
  currentItemId, isComplete, overlayOpen, OVERLAY_SURFACES, CONTROL_LABELS, labelFor,
  assertControlLabelsHonest, MISS_OUTCOME,
};

const rndSeed = () => (Math.floor(Math.random() * 0x7fffffff)) >>> 0;

/**
 * Start a FRESH set and persist it. `seeds` (one per item) make a parameterized question reproduce
 * the same numbers across an app close; generated if not supplied. Returns the persisted session.
 */
export function startSet(store, { paperId, itemIds, seeds, examShaped = false, now = Date.now() }) {
  const s = createSession({ paperId, kind: 'set', itemIds, now });
  s.seeds = seeds ?? itemIds.map(rndSeed);
  s.examShaped = !!examShaped;
  store.saveSession(s);
  return s;
}

/** The persisted session (active or complete), or null. */
export function loadSession(store) {
  return store.loadSession();
}

/** The seed for the item at a position (for reproducible parameterized instances). */
export function seedAt(session, position = session.position) {
  return session.seeds?.[position] ?? rndSeed();
}

/** Where a returning learner lands: question n+1 (the next unanswered). Never resets. */
export function resume(session) {
  return resumeSession(session);
}

/**
 * Commit the current answer and decide the reveal. Advances the session (clause E) and, on a wrong
 * answer, opens the per-concept nutshell (clause F) or — at the escalation threshold — the full
 * lesson (clause G). A correct answer opens nothing.
 *
 * `logMissesForCC(conceptId, cause)` must return the TOTAL misses for that pair in the attempt log,
 * INCLUDING the attempt just logged (the log is the single source of truth). We derive priorMisses so
 * escalation.js counts each miss once across sessions.
 *
 * @returns {{ outcome: string, tally: number, session: object }}
 */
export function commitAnswer(store, session, { conceptId, cause, correct, logMissesForCC, now = Date.now() }) {
  const totalCC = (correct || cause == null) ? 0 : logMissesForCC(conceptId, cause);
  const inSetAfter = sameConceptCauseMisses(session.responses, conceptId, cause) + (correct ? 0 : 1);
  const priorMisses = Math.max(0, totalCC - inSetAfter);
  const res = answerAndResolve(session, {
    correct,
    conceptId,
    cause,
    nutshellRef: { conceptId, offersLesson: false }, // clause F: nutshell only, no lesson offered here
    lessonRef: { conceptId, forced: true },          // clause G: routed in, not asked
  }, { priorMisses, now });
  store.saveSession(res.session);
  return res;
}

/** Open a teaching surface as an overlay (position/responses untouched) and persist. */
export function openTeaching(store, session, surface, ref = null, now = Date.now()) {
  const s = openOverlay(session, surface, ref, now);
  store.saveSession(s);
  return s;
}

/** Close whatever overlay is open and persist. Position/responses untouched. */
export function closeTeaching(store, session, now = Date.now()) {
  const s = closeOverlay(session, now);
  store.saveSession(s);
  return s;
}

/** Begin the SAME set again from question one — a distinct operation (and label) from resume. */
export function restartSet(store, session, now = Date.now()) {
  const s = restart(session, now);
  s.seeds = (session.itemIds ?? []).map(rndSeed); // fresh numbers on a restart
  s.examShaped = session.examShaped;
  store.saveSession(s);
  return s;
}

/** Finish and clear the set; returns the score. */
export function finishSet(store, session) {
  const size = session.responses.length;
  const score = session.responses.filter((r) => r.correct).length;
  store.clearSession();
  return { score, size, examShaped: !!session.examShaped };
}
