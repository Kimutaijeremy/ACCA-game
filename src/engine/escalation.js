// escalation.js — what a committed miss triggers (Brief Amendment 01, clauses F and G).
//
// Both are overlay-based (clause E): they open a teaching surface OVER the running set with the
// position already advanced, so closing the overlay continues to the next question. Neither ever
// changes position — that guarantee lives in session.openOverlay.
//
//   Clause F — on a MISS, after the answer is committed, reveal the NUTSHELL (formula or statement
//              only). No full lesson is offered here. Then continue the set.
//   Clause G — 3 misses on the SAME concept with the SAME diagnosed cause FORCE the full lesson.
//              The learner is routed in (an overlay opens) — never asked.
//
// A correct answer opens nothing. F and G are mutually exclusive for a given answer: a miss opens
// either the nutshell (F) or, once the escalation threshold is met, the forced lesson (G).
//
// SCOPE: clauses F and G only. This module does not diagnose the cause (that is §6.5 / diagnose.js —
// the caller passes the diagnosed cause in), assemble sets (B–D), pick items for freshness (H), or
// name storage keys (I). It decides the overlay and nothing else.

import { openOverlay, OVERLAY_SURFACES, answerCurrent } from './session.js';

// Clause G threshold: the 3rd same-concept, same-cause miss forces the lesson.
export const ESCALATION_MISS_THRESHOLD = 3;

export const MISS_OUTCOME = Object.freeze({
  CONTINUE: 'continue', // correct answer — no overlay
  NUTSHELL: 'nutshell', // clause F
  LESSON: 'lesson',     // clause G — forced full lesson
});

/**
 * Count committed misses for one (conceptId, cause) pair in a list of responses. Only wrong answers
 * count, and an undiagnosed miss (cause == null) is never matched — escalation needs a real cause.
 */
export function sameConceptCauseMisses(responses, conceptId, cause) {
  if (cause == null) return 0;
  return responses.filter(
    (r) => r && r.correct === false && r.conceptId === conceptId && r.cause === cause,
  ).length;
}

/**
 * Decide what a JUST-COMMITTED answer triggers, and return the session with the right overlay opened.
 * Call this AFTER session.answerCurrent (so `session.responses` already includes this answer, and the
 * position has already advanced to the next question).
 *
 * @param {object} session   - the session AFTER answerCurrent
 * @param {object} committed  - { conceptId, cause, correct, nutshellRef?, lessonRef? }
 * @param {object} [opts]      - { priorMisses?: number, now?: number }
 *        priorMisses: same-(concept,cause) misses from BEFORE this session (from the attempt log),
 *        so escalation can carry across sessions. Defaults to 0 (in-session only).
 * @returns {{ outcome: string, tally: number, session: object }}
 */
export function resolveAfterAnswer(session, committed, opts = {}) {
  const { conceptId, cause, correct } = committed;

  // A correct answer reveals nothing and continues.
  if (correct) return { outcome: MISS_OUTCOME.CONTINUE, tally: 0, session };

  const inSession = sameConceptCauseMisses(session.responses, conceptId, cause);
  const tally = (opts.priorMisses ?? 0) + inSession;

  // Clause G — same concept, same diagnosed cause, threshold met: force the full lesson. Routed in
  // as an overlay; the learner is not asked.
  if (cause != null && tally >= ESCALATION_MISS_THRESHOLD) {
    const ref = committed.lessonRef ?? { conceptId, cause, forced: true };
    return {
      outcome: MISS_OUTCOME.LESSON,
      tally,
      session: openOverlay(session, OVERLAY_SURFACES.LESSON, { ...ref, forced: true }, opts.now),
    };
  }

  // Clause F — reveal the nutshell (formula or statement only), no lesson offered, then continue.
  const ref = committed.nutshellRef ?? { conceptId };
  return {
    outcome: MISS_OUTCOME.NUTSHELL,
    tally,
    session: openOverlay(session, OVERLAY_SURFACES.NUTSHELL, { ...ref, offersLesson: false }, opts.now),
  };
}

/**
 * Convenience: commit an answer (clause E) and resolve F/G in one step. The response must carry
 * `correct`, `conceptId` and the diagnosed `cause` (plus optional nutshellRef / lessonRef).
 * @returns {{ outcome: string, tally: number, session: object }}
 */
export function answerAndResolve(session, response, opts = {}) {
  const advanced = answerCurrent(session, response, opts.now);
  return resolveAfterAnswer(
    advanced,
    {
      conceptId: response.conceptId,
      cause: response.cause,
      correct: response.correct,
      nutshellRef: response.nutshellRef,
      lessonRef: response.lessonRef,
    },
    opts,
  );
}
