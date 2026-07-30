// items/index.js — aggregate every paper's question sets and expose the "done" predicate.
//
// A concept is DONE (standing order §1, amended 2026-07-30) only when it has BOTH a lesson and a
// question set meeting the per-concept floor. `hasLesson` alone means "readable" (Exposed);
// `conceptComplete` means "authored" — the unit that can actually move a learner and feed the
// diagnosis engine. Build-progress counts and unlock logic read `conceptComplete`, not `hasLesson`.

import { BT_ITEMS } from './bt.js';
import { MA_ITEMS } from './ma.js';
import { FA_ITEMS } from './fa.js';
import { indexItems, questionSetReport, itemsForAllocation } from '../../engine/items.js';
import { hasLesson, lessonForConcept } from '../lessons/index.js';

export const ITEMS_BY_PAPER = Object.freeze({ BT: BT_ITEMS, MA: MA_ITEMS, FA: FA_ITEMS });

export const ALL_ITEMS = [...BT_ITEMS, ...MA_ITEMS, ...FA_ITEMS];

// Index (also validates every item, exercises every generator, and rejects duplicate ids).
const _byConcept = indexItems(ALL_ITEMS);

/** Items whose conceptIds include this concept (any rung). */
export function itemsForConcept(conceptId) {
  return _byConcept.get(conceptId) ?? [];
}

/** The per-concept allocation report for a concept, using its lesson's shape. */
export function conceptQuestionReport(conceptId) {
  const L = lessonForConcept(conceptId);
  return questionSetReport(conceptId, itemsForConcept(conceptId), { shape: L?.shape });
}

/** True if a concept's question set meets its floor. */
export function hasQuestionSet(conceptId) {
  return conceptQuestionReport(conceptId).complete;
}

/** The authoring unit: a concept is DONE only with BOTH a lesson and a complete question set. */
export function conceptComplete(conceptId) {
  return hasLesson(conceptId) && hasQuestionSet(conceptId);
}

/** Every authored item flattened for the paper allocation matrix. */
export function allItemsForAllocation() {
  return itemsForAllocation(ALL_ITEMS);
}
