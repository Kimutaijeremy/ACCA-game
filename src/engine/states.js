// states.js — the five mastery states, the difficulty rungs, the evidence rules and the
// review/decay schedule. This module is pure configuration and vocabulary; the logic that
// *applies* these rules to the attempt log lives in derive.js.
//
// Brief §6.2 (mastery states, evidence rules, decay) and §6.3 (difficulty rungs).

// ---------------------------------------------------------------------------
// The mastery ladder. Order matters: index is the rank used for promotion/decay.
// ---------------------------------------------------------------------------
export const STATES = ['Unvisited', 'Exposed', 'Understood', 'Practised', 'Competent', 'Mastered'];

export const STATE = Object.freeze({
  UNVISITED: 'Unvisited',
  EXPOSED: 'Exposed',
  UNDERSTOOD: 'Understood',
  PRACTISED: 'Practised',
  COMPETENT: 'Competent',
  MASTERED: 'Mastered',
});

/** Rank (0..5) of a state name. Higher = more mastery. */
export function rank(state) {
  const i = STATES.indexOf(state);
  if (i < 0) throw new Error(`Unknown mastery state: ${state}`);
  return i;
}

/** State name for a rank. */
export function stateAtRank(r) {
  if (r < 0 || r >= STATES.length) throw new Error(`Rank out of range: ${r}`);
  return STATES[r];
}

// ---------------------------------------------------------------------------
// Difficulty rungs (Brief §6.3). Every attempt-log entry that is an *item* carries one.
// 'lesson' is not a rung — lesson completion is a separate kind of evidence event (Exposed).
// ---------------------------------------------------------------------------
export const RUNGS = Object.freeze({
  CONCEPT_CHECK: 'concept-check',
  GUIDED: 'guided',
  STANDARD: 'standard',
  STRETCH: 'stretch',
  INTEGRATED: 'integrated', // interleaved / mixed-topic packs
  SEALED: 'sealed', // sealed-simulation items — never counted toward practice promotion
});

export const RUNG_LIST = [
  RUNGS.CONCEPT_CHECK,
  RUNGS.GUIDED,
  RUNGS.STANDARD,
  RUNGS.STRETCH,
  RUNGS.INTEGRATED,
  RUNGS.SEALED,
];

// ---------------------------------------------------------------------------
// Evidence rules (Brief §6.2). These are thresholds; derive.js reads the attempt log
// against them. Kept as data so the dashboard can state the rule on screen and so the
// rules are auditable in one place.
// ---------------------------------------------------------------------------
export const EVIDENCE = Object.freeze({
  // Understood: concept-check set passed — at least 2 of 3 recognition/explanation items
  // correct, UNSCAFFOLDED.
  understood: { rung: RUNGS.CONCEPT_CHECK, window: 3, needCorrect: 2, scaffoldAllowed: false },

  // Practised: at least 3 guided applications correct; hints and worked steps permitted.
  practised: { rung: RUNGS.GUIDED, needCorrect: 3, scaffoldAllowed: true },

  // Competent: last 5 unscaffolded Standard items at 80%+ within item time budgets, no hints.
  competent: {
    rung: RUNGS.STANDARD,
    window: 5,
    minCorrectFraction: 0.8, // 4 of 5
    scaffoldAllowed: false,
    requireWithinBudget: true,
  },

  // Mastered: 80%+ on Stretch and Integrated items, including at least one mixed-topic
  // (integrated) appearance and one timed appearance, across at least two sessions
  // separated by 72+ hours.
  mastered: {
    rungs: [RUNGS.STRETCH, RUNGS.INTEGRATED],
    minCorrectFraction: 0.8,
    requireIntegratedAppearance: true,
    requireTimedAppearance: true,
    requireDistinctSessions: 2,
    requireSessionGapMs: 72 * 60 * 60 * 1000, // 72 hours
  },
});

// ---------------------------------------------------------------------------
// Review schedule and decay (Brief §6.2).
// "Each state above Exposed carries a review interval." A failed due review drops the
// concept one state and queues its remediation.
// ---------------------------------------------------------------------------
const DAY = 24 * 60 * 60 * 1000;

export const REVIEW_INTERVALS_MS = Object.freeze({
  [STATE.UNDERSTOOD]: [3 * DAY],
  [STATE.PRACTISED]: [7 * DAY],
  [STATE.COMPETENT]: [14 * DAY],
  // Mastered reviews lengthen: 30 days, then 90 days thereafter.
  [STATE.MASTERED]: [30 * DAY, 90 * DAY],
});

/** True if a state schedules reviews at all (everything above Exposed). */
export function hasReviews(state) {
  return rank(state) >= rank(STATE.UNDERSTOOD);
}

/**
 * The review interval to apply on entering/renewing a state.
 * @param {string} state
 * @param {number} passIndex - how many successful reviews already completed at this state
 */
export function reviewIntervalMs(state, passIndex = 0) {
  const schedule = REVIEW_INTERVALS_MS[state];
  if (!schedule) return null;
  return schedule[Math.min(passIndex, schedule.length - 1)];
}

// Time budget for display / withinBudget classification (Brief §6.3): 1.2 min per mark at
// Knowledge level, 1.8 at Skills. Exposed here for item authoring in later WPs.
export const TIME_BUDGET_MIN_PER_MARK = Object.freeze({ knowledge: 1.2, skills: 1.8 });
