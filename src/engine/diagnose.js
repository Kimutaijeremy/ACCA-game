// diagnose.js — the seven-cause diagnostic engine (Brief §6.5).
//
// It answers, for a WRONG attempt, "why did this go wrong?" across three honest layers:
//   1. Engineered distractors — each wrong option on an item is authored to encode a specific
//      cause and tagged with it. Choosing a distractor IS the primary diagnosis. Items where a
//      cause cannot be encoded are 'untyped' and fall through to layer 2.
//   2. Pattern inference across the attempt log — signals from how the concept has behaved.
//   3. Micro-probe — when layers 1 and 2 disagree or are both silent, ONE short follow-up.
//
// The engine infers; it does not mind-read. Every diagnosis carries a classification confidence,
// and ambiguous cases default to conceptual-plus-practice rather than a guess.

import { CAUSES } from './log.js';

// Remediation routing (Brief §6.5). One route per cause.
export const REMEDIATION = Object.freeze({
  knowledge_gap: {
    route: 'reopen_lesson',
    actions: ['reopen the lesson section', 're-run the Understood check'],
    contentRemediation: true,
  },
  conceptual_misunderstanding: {
    route: 'contrast_minilesson',
    actions: ['contrast mini-lesson', 'paired discrimination items'],
    contentRemediation: true,
  },
  calculation_error: {
    route: 'calc_drill',
    actions: ['parameterized calculation drill set for that operation'],
    contentRemediation: true,
  },
  requirement_misread: {
    route: 'requirement_parsing',
    actions: ['requirement-parsing pack — command verbs and what they demand'],
    contentRemediation: true,
  },
  incorrect_treatment: {
    route: 'rule_card',
    actions: ['rule card', 'treatment-choice items'],
    contentRemediation: true,
  },
  careless_slip: {
    route: 'pacing_flag',
    actions: ['no content remediation', 'pacing flag', 'a variant resurfaces within 48 hours'],
    contentRemediation: false,
  },
  transfer_failure: {
    route: 'mixed_context',
    actions: ['mixed-context set for the concept'],
    contentRemediation: true,
  },
});

export const CONFIDENCE = Object.freeze({
  agreed: 0.95, // distractor and pattern agree
  distractor: 0.9, // distractor only
  probe: 0.8, // resolved by a micro-probe
  pattern: 0.6, // pattern inference only
  ambiguous: 0.3, // conflict or silence → conceptual-plus-practice default
});

// Default when nothing is confident enough: conceptual-plus-practice, not a guess.
const DEFAULT_CAUSE = 'conceptual_misunderstanding';

/**
 * Layer 2 — infer a cause from the attempt and the concept's prior attempts.
 * @returns {{cause:string, signal:string}|null}
 */
export function inferFromPattern(attempt, prior = [], context = {}) {
  // Wrong at concept-check → knowledge gap.
  if (attempt.rung === 'concept-check') {
    return { cause: 'knowledge_gap', signal: 'wrong_at_concept_check' };
  }
  // Right at Guided, wrong at Standard → conceptual.
  if (attempt.rung === 'standard' && prior.some((a) => a.rung === 'guided' && a.correct)) {
    return { cause: 'conceptual_misunderstanding', signal: 'guided_ok_standard_wrong' };
  }
  // Wrong only in mixed/unseen contexts → transfer failure.
  if (attempt.rung === 'integrated' && prior.some((a) => a.rung === 'standard' && a.correct)) {
    return { cause: 'transfer_failure', signal: 'ok_standard_wrong_mixed' };
  }
  // Right untimed, wrong timed → exam conditions (a pacing problem, not a knowledge one).
  if (attempt.timed && prior.some((a) => !a.timed && a.correct && a.rung === attempt.rung)) {
    return { cause: 'careless_slip', signal: 'untimed_ok_timed_wrong' };
  }
  // Fast, wrong, on a Competent concept → careless.
  const fast = isFast(attempt, context);
  if (fast && context.conceptState === 'Competent') {
    return { cause: 'careless_slip', signal: 'fast_wrong_when_competent' };
  }
  return null;
}

function isFast(attempt, context) {
  if (attempt.fast === true) return true;
  if (Number.isFinite(attempt.timeMs) && Number.isFinite(context.budgetMs)) {
    return attempt.timeMs < 0.5 * context.budgetMs;
  }
  return false;
}

function makeProbe(candidates) {
  // One short follow-up. The UI serves a single discrimination question whose answer selects
  // among the candidate causes. Never more than one is requested.
  return {
    kind: 'discrimination',
    candidates: candidates.filter(Boolean),
    prompt: 'One quick check to pin down the cause.',
  };
}

/**
 * Diagnose a wrong attempt.
 * @param {object} args
 * @param {object} args.attempt - the attempt record (must be correct===false)
 * @param {object} [args.item] - item def: { distractors: {optionId: cause}, untyped?: boolean }
 * @param {object[]} [args.prior] - prior attempts on the same concept, chronological
 * @param {object} [args.context] - { conceptState, budgetMs }
 * @returns {object|null} diagnosis, or null if the attempt was correct
 */
export function diagnose({ attempt, item = null, prior = [], context = {} }) {
  if (!attempt || attempt.correct) return null;

  // Layer 1 — engineered distractor.
  const tagged = item && item.distractors ? item.distractors[attempt.distractor] : undefined;
  const l1 = CAUSES.includes(tagged) ? tagged : null;

  // Layer 2 — pattern inference.
  const l2 = inferFromPattern(attempt, prior, context);

  const base = { itemId: attempt.itemId ?? null, conceptIds: attempt.conceptIds ?? [] };

  // Both layers speak.
  if (l1 && l2) {
    if (l1 === l2.cause) {
      return finish({ ...base, cause: l1, confidence: CONFIDENCE.agreed, source: 'distractor+pattern', agreement: 'agree', signal: l2.signal });
    }
    // Disagreement → micro-probe; provisionally conceptual-plus-practice, not a guess.
    return finish({
      ...base, cause: DEFAULT_CAUSE, confidence: CONFIDENCE.ambiguous, source: 'default',
      agreement: 'conflict', needsProbe: true, probe: makeProbe([l1, l2.cause]),
      candidates: [l1, l2.cause], signal: l2.signal,
    });
  }

  // Only the distractor speaks — the primary diagnosis.
  if (l1) return finish({ ...base, cause: l1, confidence: CONFIDENCE.distractor, source: 'distractor' });

  // Only the pattern speaks.
  if (l2) return finish({ ...base, cause: l2.cause, confidence: CONFIDENCE.pattern, source: 'pattern', signal: l2.signal });

  // Both silent → micro-probe; default conceptual-plus-practice until resolved.
  return finish({
    ...base, cause: DEFAULT_CAUSE, confidence: CONFIDENCE.ambiguous, source: 'default',
    needsProbe: true, probe: makeProbe(CAUSES.slice()),
  });
}

function finish(d) {
  return {
    agreement: null, needsProbe: false, probe: null, candidates: null, signal: null,
    ...d,
    remediation: REMEDIATION[d.cause],
  };
}

/**
 * Resolve a diagnosis with the outcome of its single micro-probe. Never call more than once —
 * the engine requests at most one probe.
 * @param {object} diagnosis
 * @param {string|null} resolvedCause - the cause the probe established, or null if inconclusive
 */
export function resolveProbe(diagnosis, resolvedCause) {
  if (resolvedCause && CAUSES.includes(resolvedCause)) {
    return finish({
      itemId: diagnosis.itemId, conceptIds: diagnosis.conceptIds,
      cause: resolvedCause, confidence: CONFIDENCE.probe, source: 'probe',
    });
  }
  // Inconclusive probe → keep the conceptual-plus-practice default (still not a guess).
  return finish({
    itemId: diagnosis.itemId, conceptIds: diagnosis.conceptIds,
    cause: DEFAULT_CAUSE, confidence: CONFIDENCE.ambiguous, source: 'default',
  });
}
