// derive.js — turn the attempt log into mastery state, review schedule and queues.
//
// This is the one place mastery state is computed, and it computes it ONLY by folding the
// attempt log in chronological order (Brief §6.2, §6.8, §6.9): "every figure must be
// recomputable from the attempt log. No number without a derivation. States are never
// written directly."
//
// Two forces act on a concept as the log is folded:
//   PROMOTION — evidence rules (§6.2) raise the state one rung at a time.
//   DECAY     — a failed *due* review drops the state one rung and queues remediation.
// A due review is detected purely from the schedule: an item attempt on a concept whose
// review has come due. No external flag is trusted, so decay is fully auditable.

import {
  STATE, rank, stateAtRank, EVIDENCE, hasReviews, reviewIntervalMs,
} from './states.js';
import { EVENT_KIND } from './log.js';

const R = {
  UNVISITED: rank(STATE.UNVISITED),
  EXPOSED: rank(STATE.EXPOSED),
  UNDERSTOOD: rank(STATE.UNDERSTOOD),
  PRACTISED: rank(STATE.PRACTISED),
  COMPETENT: rank(STATE.COMPETENT),
  MASTERED: rank(STATE.MASTERED),
};

// Which evidence window gates which state rank. Used to reset the right windows on decay:
// when a concept drops to newRank, every window gating a rank above newRank is cleared, so
// the lost level must be genuinely re-earned rather than restored from stale evidence.
const WINDOW_GATES = {
  cc: R.UNDERSTOOD,
  guidedCorrect: R.PRACTISED,
  std: R.COMPETENT,
  mastery: R.MASTERED,
};

function freshAcc() {
  return {
    rankVal: R.UNVISITED,
    lessonDone: false,
    cc: [], // last up-to-3 unscaffolded concept-check correctness booleans
    guidedCorrect: 0, // count of correct guided applications (hints allowed)
    std: [], // last up-to-5 unscaffolded standard attempts {correct, withinBudget}
    mastery: [], // stretch/integrated qualifying attempts
    reviewDueAt: null,
    passIndex: 0, // successful reviews completed at the current state
    remediation: [], // queued remediation entries
    reviewsPassed: 0,
    reviewsFailed: 0,
    itemAttempts: 0,
    firstExposureAt: null,
    lastActivityAt: null,
    enteredStateAt: { [STATE.UNVISITED]: null },
  };
}

function clearWindowsAbove(acc, newRank) {
  if (WINDOW_GATES.cc > newRank) acc.cc = [];
  if (WINDOW_GATES.guidedCorrect > newRank) acc.guidedCorrect = 0;
  if (WINDOW_GATES.std > newRank) acc.std = [];
  if (WINDOW_GATES.mastery > newRank) acc.mastery = [];
}

// --- evidence predicates: is there enough evidence to enter the given rank right now? ---

function meetsUnderstood(acc) {
  const e = EVIDENCE.understood;
  if (acc.cc.length < e.window) return false;
  const window = acc.cc.slice(-e.window);
  return window.filter(Boolean).length >= e.needCorrect;
}

function meetsPractised(acc) {
  return acc.guidedCorrect >= EVIDENCE.practised.needCorrect;
}

function meetsCompetent(acc) {
  const e = EVIDENCE.competent;
  if (acc.std.length < e.window) return false;
  const window = acc.std.slice(-e.window);
  if (e.requireWithinBudget && !window.every((a) => a.withinBudget === true)) return false;
  const correct = window.filter((a) => a.correct).length;
  return correct / e.window >= e.minCorrectFraction;
}

function meetsMastered(acc) {
  const e = EVIDENCE.mastered;
  const at = acc.mastery;
  if (at.length === 0) return false;
  const correct = at.filter((a) => a.correct).length;
  if (correct / at.length < e.minCorrectFraction) return false;
  if (e.requireIntegratedAppearance && !at.some((a) => a.integrated)) return false;
  if (e.requireTimedAppearance && !at.some((a) => a.timed)) return false;
  const sessions = new Set(at.map((a) => a.sessionId));
  if (sessions.size < e.requireDistinctSessions) return false;
  const times = at.map((a) => a.timestamp);
  if (Math.max(...times) - Math.min(...times) < e.requireSessionGapMs) return false;
  return true;
}

function meetsRank(acc, targetRank) {
  switch (targetRank) {
    case R.EXPOSED: return acc.lessonDone === true;
    case R.UNDERSTOOD: return meetsUnderstood(acc);
    case R.PRACTISED: return meetsPractised(acc);
    case R.COMPETENT: return meetsCompetent(acc);
    case R.MASTERED: return meetsMastered(acc);
    default: return false;
  }
}

function enterState(acc, newRank, at) {
  acc.rankVal = newRank;
  const name = stateAtRank(newRank);
  acc.enteredStateAt[name] = at;
  if (hasReviews(name)) {
    acc.passIndex = 0;
    acc.reviewDueAt = at + reviewIntervalMs(name, 0);
  } else {
    acc.reviewDueAt = null;
  }
}

// Climb as many rungs as the current evidence supports, scheduling reviews on the way.
function promote(acc, at) {
  while (acc.rankVal < R.MASTERED && meetsRank(acc, acc.rankVal + 1)) {
    enterState(acc, acc.rankVal + 1, at);
  }
}

function feedEvidence(acc, rec) {
  if (rec.kind === EVENT_KIND.LESSON) {
    acc.lessonDone = true;
    return;
  }
  acc.itemAttempts += 1;
  switch (rec.rung) {
    case 'concept-check':
      if (!rec.scaffold) {
        acc.cc.push(rec.correct);
        if (acc.cc.length > EVIDENCE.understood.window) acc.cc.shift();
      }
      break;
    case 'guided':
      if (rec.correct) acc.guidedCorrect += 1;
      break;
    case 'standard':
      if (!rec.scaffold) {
        acc.std.push({ correct: rec.correct, withinBudget: rec.withinBudget });
        if (acc.std.length > EVIDENCE.competent.window) acc.std.shift();
      }
      break;
    case 'stretch':
    case 'integrated':
      acc.mastery.push({
        correct: rec.correct,
        integrated: rec.rung === 'integrated',
        timed: rec.timed === true,
        sessionId: rec.sessionId,
        timestamp: rec.timestamp,
      });
      break;
    // 'sealed' items never feed practice-path promotion (Brief §6.6).
    default:
      break;
  }
}

function applyDecay(acc, rec) {
  const fromRank = acc.rankVal;
  const newRank = Math.max(R.EXPOSED, fromRank - 1);
  acc.rankVal = newRank;
  clearWindowsAbove(acc, newRank);
  acc.reviewsFailed += 1;
  acc.remediation.push({
    reason: 'failed_review',
    cause: rec.cause ?? null,
    confidence: rec.confidence ?? null,
    fromState: stateAtRank(fromRank),
    toState: stateAtRank(newRank),
    at: rec.timestamp,
  });
  const newName = stateAtRank(newRank);
  acc.enteredStateAt[newName] = rec.timestamp;
  acc.passIndex = 0;
  acc.reviewDueAt = hasReviews(newName) ? rec.timestamp + reviewIntervalMs(newName, 0) : null;
}

/**
 * Fold the whole attempt log into per-concept accumulators.
 * @param {AttemptLog|Array} log
 * @returns {Map<string, object>} conceptId -> accumulator
 */
function foldLog(log) {
  const records = Array.isArray(log) ? log : log.all();
  const accs = new Map();

  for (const rec of records) {
    for (const cid of rec.conceptIds) {
      let acc = accs.get(cid);
      if (!acc) { acc = freshAcc(); accs.set(cid, acc); }

      if (acc.firstExposureAt == null) acc.firstExposureAt = rec.timestamp;
      acc.lastActivityAt = rec.timestamp;

      // Is this item attempt a DUE review? Only items, only in a reviewable state, only once
      // the scheduled review time has passed.
      const isDueReview = rec.kind === EVENT_KIND.ITEM
        && acc.rankVal >= R.UNDERSTOOD
        && acc.reviewDueAt != null
        && rec.timestamp >= acc.reviewDueAt;

      if (isDueReview) {
        if (rec.correct) {
          // Review passed: renew the interval at this state, then let the attempt also count
          // as ordinary evidence.
          acc.reviewsPassed += 1;
          acc.passIndex += 1;
          const name = stateAtRank(acc.rankVal);
          acc.reviewDueAt = rec.timestamp + reviewIntervalMs(name, acc.passIndex);
          feedEvidence(acc, rec);
          promote(acc, rec.timestamp);
        } else {
          // Review failed: decay. The failing attempt does not also promote.
          applyDecay(acc, rec);
        }
      } else {
        feedEvidence(acc, rec);
        promote(acc, rec.timestamp);
      }
    }
  }
  return accs;
}

/** Public shape for one concept's derived state. */
function present(cid, acc, now) {
  if (!acc) {
    return {
      conceptId: cid,
      state: STATE.UNVISITED,
      rank: R.UNVISITED,
      reviewDueAt: null,
      due: false,
      remediation: [],
      reviewsPassed: 0,
      reviewsFailed: 0,
      itemAttempts: 0,
      firstExposureAt: null,
      lastActivityAt: null,
    };
  }
  const state = stateAtRank(acc.rankVal);
  const due = acc.reviewDueAt != null && hasReviews(state) && now >= acc.reviewDueAt;
  return {
    conceptId: cid,
    state,
    rank: acc.rankVal,
    reviewDueAt: acc.reviewDueAt,
    due,
    remediation: acc.remediation,
    reviewsPassed: acc.reviewsPassed,
    reviewsFailed: acc.reviewsFailed,
    itemAttempts: acc.itemAttempts,
    firstExposureAt: acc.firstExposureAt,
    lastActivityAt: acc.lastActivityAt,
    // evidence snapshot — lets the dashboard explain *why* a concept sits where it does
    evidence: {
      lessonDone: acc.lessonDone,
      conceptCheck: acc.cc.slice(),
      guidedCorrect: acc.guidedCorrect,
      standardWindow: acc.std.slice(),
      masteryAttempts: acc.mastery.length,
    },
  };
}

/**
 * Derive one concept's current state from the log.
 * @param {AttemptLog|Array} log
 * @param {string} conceptId
 * @param {number} now - evaluation time (ms epoch); affects only "is a review due" reads
 */
export function deriveConcept(log, conceptId, now = Date.now()) {
  const accs = foldLog(log);
  return present(conceptId, accs.get(conceptId), now);
}

/**
 * Derive every concept touched by the log, plus the dashboard queues.
 * @param {AttemptLog|Array} log
 * @param {object} [opts]
 * @param {number} [opts.now]
 * @param {string[]} [opts.conceptIds] - if given, also include these as Unvisited when untouched
 * @returns {{ states: Map<string,object>, reviewQueue: object[], remediationQueue: object[] }}
 */
export function deriveAll(log, opts = {}) {
  const now = opts.now ?? Date.now();
  const accs = foldLog(log);
  const states = new Map();

  const ids = new Set(accs.keys());
  for (const id of opts.conceptIds ?? []) ids.add(id);

  for (const id of ids) states.set(id, present(id, accs.get(id), now));

  const reviewQueue = [...states.values()]
    .filter((s) => s.due)
    .sort((a, b) => a.reviewDueAt - b.reviewDueAt);

  const remediationQueue = [...states.values()]
    .filter((s) => s.remediation.length > 0)
    .map((s) => ({ conceptId: s.conceptId, entries: s.remediation }));

  return { states, reviewQueue, remediationQueue };
}
