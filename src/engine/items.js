// items.js — the question/item model and its validator (Brief §6.3–6.5), plus the per-concept
// allocation floor that makes "a concept is done" mechanical.
//
// THE AUTHORING UNIT (standing order §1, amended 2026-07-30): a concept is not done until it has
// BOTH its lesson and its question set. A lesson with no questions cannot move a learner past
// Exposed, cannot feed the diagnosis engine, cannot decay, cannot unlock anything — it is a
// reading app. So every concept ships a set spanning the four practice rungs to its floor, and
// calculation-shaped concepts ship at least one PARAMETERIZED generator (numbers regenerate per
// attempt) rather than a fixed sum that can be memorised.
//
// Every wrong option is authored to encode a diagnostic cause (Brief §6.5 layer 1): choosing a
// distractor IS the diagnosis. Options whose wrongness cannot be pinned to one cause are left
// unmapped and fall through to pattern inference (diagnose.js layer 2) — that is allowed, not a
// defect, but it should be the exception.

import { RUNGS } from './states.js';
import { CAUSES } from './log.js';
import { makeRng, seedFromString } from './rng.js';

// The four practice rungs a single concept's set is authored across. 'integrated' is cross-concept
// (mixed packs draw four or more concepts, so a concept cannot be integrated with only itself) and
// 'sealed' is the frozen holdout — both are assembled separately, never part of one concept's set.
export const PRACTICE_RUNGS = [RUNGS.CONCEPT_CHECK, RUNGS.GUIDED, RUNGS.STANDARD, RUNGS.STRETCH];

// Per-concept floors — the new "done" definition. Derived from the §6.2 evidence rules so each
// mastery state is actually REACHABLE from the set: Understood needs 2-of-3 concept-check;
// Practised needs 3 guided; Competent reads the last 5 Standard (parameterized items refill that
// window with fresh numbers); a stretch item is the Mastered on-ramp.
export const PER_CONCEPT_FLOORS = Object.freeze({
  [RUNGS.CONCEPT_CHECK]: 3,
  [RUNGS.GUIDED]: 3,
  [RUNGS.STANDARD]: 3,
  [RUNGS.STRETCH]: 1,
});

// Lesson shapes whose questions are calculations, and therefore MUST include at least one
// parameterized generator (anti-memorisation, Brief §6.3). 'theory' and 'treatment' concepts are
// exempt — their items are recognition/judgement, not arithmetic.
export const CALC_SHAPES = new Set(['calculation', 'double-entry', 'interpretation']);

// Concepts under an authoring CAP that OVERRIDES the per-concept floor (Brief §6.4). The
// accounting equation may hold at most two items in the ENTIRE FA bank — it is deliberately
// under-weighted because the v1 bank drowned in it. Its mastery is demonstrated through the
// concepts it feeds (double entry, the statement of financial position), not through a bank of its
// own. A capped concept is "done" when it has its (capped) set and does not exceed the cap; the
// four-rung floor does not apply to it.
export const ITEM_CAPS = Object.freeze({ 'FA-05': 2 });

const KNOWLEDGE_MIN_PER_MARK = 1.2; // minutes per mark at Knowledge level (Brief §6.3)

/** Time budget for an item in ms (Brief §6.3: 1.2 min/mark at Knowledge level). */
export function timeBudgetMs(item, minPerMark = KNOWLEDGE_MIN_PER_MARK) {
  return Math.round((item.marks ?? 1) * minPerMark * 60 * 1000);
}

// --------------------------------------------------------------------------------------------
// Validation
// --------------------------------------------------------------------------------------------

/** Validate the concrete (rendered) shape of an MCQ item — the form the learner actually sees. */
function validateRendered(v, ctx) {
  const need = (cond, msg) => { if (!cond) throw new Error(`item ${ctx}: ${msg}`); };
  need(typeof v.stem === 'string' && v.stem.trim().length > 0, 'stem required');
  need(Array.isArray(v.options) && v.options.length >= 3, 'need >=3 options (>=2 distractors)');
  const ids = new Set();
  for (const o of v.options) {
    need(o && typeof o.id === 'string' && o.id, 'each option needs an id');
    need(!ids.has(o.id), `duplicate option id ${o.id}`);
    ids.add(o.id);
    need(typeof o.text === 'string' && o.text.trim().length > 0, `option ${o.id} needs text`);
  }
  need(ids.has(v.answerId), `answerId ${v.answerId} is not an option`);
  const wrong = [...ids].filter((id) => id !== v.answerId);
  const distractors = v.distractors ?? {};
  for (const [oid, cause] of Object.entries(distractors)) {
    need(ids.has(oid), `distractor ${oid} is not an option`);
    need(oid !== v.answerId, `distractor ${oid} is the correct answer`);
    need(CAUSES.includes(cause), `distractor ${oid} maps to unknown cause ${cause}`);
  }
  return { wrongCount: wrong.length, typedCount: Object.keys(distractors).length };
}

/**
 * Validate an authored item. Throws on any structural fault. For parameterized items the generator
 * is exercised with a fixed seed and its output validated, so a broken generator fails at load,
 * not in front of the learner.
 * @param {object} it
 */
export function validateItem(it) {
  const ctx = it?.id ?? '?';
  const need = (cond, msg) => { if (!cond) throw new Error(`item ${ctx}: ${msg}`); };
  need(it && typeof it === 'object', 'not an object');
  need(typeof it.id === 'string' && it.id, 'id required');
  need(Array.isArray(it.conceptIds) && it.conceptIds.length >= 1, 'conceptIds must be non-empty');
  need(PRACTICE_RUNGS.includes(it.rung) || it.rung === RUNGS.INTEGRATED || it.rung === RUNGS.SEALED,
    `rung must be a practice/integrated/sealed rung, got ${it.rung}`);
  need(Number.isInteger(it.marks) && it.marks >= 1, 'marks must be an integer >=1');
  // concept-check items are recognition/explanation and MUST be unscaffolded (§6.2 Understood).
  if (it.rung === RUNGS.CONCEPT_CHECK) {
    need(!it.scaffold || it.scaffold.length === 0, 'concept-check items must be unscaffolded');
  }
  if (it.scaffold != null) {
    need(Array.isArray(it.scaffold) && it.scaffold.every((s) => typeof s === 'string'),
      'scaffold must be an array of strings');
  }

  const parameterized = typeof it.generate === 'function';
  if (parameterized) {
    // Exercise the generator across a few seeds; every instance must be a valid MCQ.
    for (const seed of [1, 7, 99, 2718]) {
      let inst;
      try { inst = it.generate(makeRng(seed)); } catch (e) {
        throw new Error(`item ${ctx}: generator threw on seed ${seed}: ${e.message}`);
      }
      validateRendered(inst, `${ctx}@seed${seed}`);
    }
  } else {
    validateRendered(it, ctx);
  }
  return true;
}

/**
 * Instantiate an item for presentation. Static items return themselves; parameterized items are
 * rendered from a seed (the app logs the seed so the exact instance is reproducible for review and
 * audit). Always returns a concrete MCQ with an itemId, seed and time budget attached.
 */
export function instantiate(item, seed = seedFromString(item.id)) {
  const rendered = typeof item.generate === 'function'
    ? item.generate(makeRng(seed))
    : { stem: item.stem, options: item.options, answerId: item.answerId, distractors: item.distractors, rationale: item.rationale };
  return {
    itemId: item.id,
    conceptIds: item.conceptIds,
    rung: item.rung,
    marks: item.marks ?? 1,
    parameterized: typeof item.generate === 'function',
    seed,
    scaffold: item.scaffold ?? null,
    budgetMs: timeBudgetMs(item),
    stem: rendered.stem,
    options: rendered.options,
    answerId: rendered.answerId,
    distractors: rendered.distractors ?? {},
    rationale: rendered.rationale ?? item.rationale ?? null,
  };
}

/**
 * Index items by concept, validating each and rejecting duplicate ids. An item with several
 * conceptIds (an integrated item) is indexed under each.
 */
export function indexItems(items) {
  const seen = new Set();
  const byConcept = new Map();
  for (const it of items) {
    validateItem(it);
    if (seen.has(it.id)) throw new Error(`duplicate item id ${it.id}`);
    seen.add(it.id);
    for (const cid of it.conceptIds) {
      if (!byConcept.has(cid)) byConcept.set(cid, []);
      byConcept.get(cid).push(it);
    }
  }
  return byConcept;
}

// --------------------------------------------------------------------------------------------
// Per-concept allocation — the mechanical "done" check
// --------------------------------------------------------------------------------------------

/**
 * Report whether one concept's authored set meets the per-concept floor.
 * @param {string} conceptId
 * @param {object[]} items - items whose conceptIds include this concept (any rung)
 * @param {object} [opts] - { shape } the lesson's shape, to decide the parameterized requirement
 * @returns {{conceptId, byRung, floors, needsParameterized, hasParameterized, missing, complete}}
 */
export function questionSetReport(conceptId, items = [], opts = {}) {
  const byRung = Object.fromEntries(PRACTICE_RUNGS.map((r) => [r, 0]));
  let hasParameterized = false;
  for (const it of items) {
    if (byRung[it.rung] != null) byRung[it.rung] += 1;
    if (typeof it.generate === 'function') hasParameterized = true;
  }
  const practiceTotal = PRACTICE_RUNGS.reduce((n, r) => n + byRung[r], 0);
  const cap = ITEM_CAPS[conceptId];

  // Capped concept (e.g. the accounting equation): the four-rung floor does not apply; it is done
  // when it has a set and stays within its cap.
  if (cap != null) {
    const missing = [];
    if (practiceTotal < 1) missing.push('items:0/1(capped)');
    if (practiceTotal > cap) missing.push(`items:${practiceTotal}/${cap}(exceeds cap)`);
    return {
      conceptId, byRung, capped: true, cap, practiceTotal,
      needsParameterized: false, hasParameterized, missing, complete: missing.length === 0,
    };
  }

  const needsParameterized = CALC_SHAPES.has(opts.shape);
  const missing = [];
  for (const r of PRACTICE_RUNGS) {
    if (byRung[r] < PER_CONCEPT_FLOORS[r]) {
      missing.push(`${r}:${byRung[r]}/${PER_CONCEPT_FLOORS[r]}`);
    }
  }
  if (needsParameterized && !hasParameterized) missing.push('parameterized:0/1');

  return {
    conceptId,
    byRung,
    capped: false,
    floors: PER_CONCEPT_FLOORS,
    needsParameterized,
    hasParameterized,
    missing,
    complete: missing.length === 0,
  };
}

/** Flatten items into the shape allocation.js's paper matrix consumes ({conceptIds, rung, sealed}). */
export function itemsForAllocation(items) {
  return items.map((it) => ({
    conceptIds: it.conceptIds,
    rung: it.rung,
    sealed: it.rung === RUNGS.SEALED,
  }));
}
