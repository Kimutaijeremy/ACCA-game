// lessons/index.js — aggregate every paper's lessons and index them.
// Add a paper's lessons in its own file (bt.js / ma.js / fa.js / …); this file just combines them.

import { BT_LESSONS } from './bt.js';
import { MA_LESSONS } from './ma.js';
import { FA_LESSONS } from './fa.js';
import { indexLessons } from '../../engine/lessons.js';

export const LESSONS_BY_PAPER = Object.freeze({ BT: BT_LESSONS, MA: MA_LESSONS, FA: FA_LESSONS });

export const ALL_LESSONS = [...BT_LESSONS, ...MA_LESSONS, ...FA_LESSONS];

// Index (also validates every lesson and rejects duplicates).
const _byId = indexLessons(ALL_LESSONS);

/** The lesson object for a concept id, or null. */
export function lessonForConcept(conceptId) {
  return _byId.get(conceptId) ?? null;
}

/** True if a concept has an authored lesson — the "built" predicate for progress/allocation. */
export function hasLesson(conceptId) {
  return _byId.has(conceptId);
}

/** Concept ids with a lesson, for a paper (or all). */
export function authoredConceptIds(paper = null) {
  const arr = paper ? (LESSONS_BY_PAPER[paper] ?? []) : ALL_LESSONS;
  return arr.map((L) => L.conceptId);
}
