// lessons.js — the lesson content model and its validator (Brief §6.3).
//
// Every concept node's lesson contains, in order: a Lesson (story beat in the Wanjiku voice,
// keypoint boxes for the load-bearing formulas/rules, one worked example, and the one-breath
// compression), and — for Knowledge-level lessons — a forward pointer naming where the concept
// matures. This module does not author lessons; it defines their shape and checks it, so the
// allocation matrix (§6.4) can count a real "lesson section" and nothing ships half-built.

export const LESSON_SHAPES = ['theory', 'calculation', 'double-entry', 'treatment', 'interpretation'];

/**
 * Validate one lesson object. Throws on any missing load-bearing part.
 * @param {object} L
 */
export function validateLesson(L) {
  const need = (cond, msg) => { if (!cond) throw new Error(`lesson ${L?.conceptId ?? '?'}: ${msg}`); };
  need(L && typeof L === 'object', 'not an object');
  need(typeof L.conceptId === 'string' && L.conceptId, 'conceptId required');
  need(typeof L.title === 'string' && L.title, 'title (real syllabus name) required');
  need(typeof L.syllabusYear === 'string' && L.syllabusYear, 'syllabusYear required');
  need(typeof L.story === 'string' && L.story.trim().length >= 120, 'story beat too thin');

  need(Array.isArray(L.keypoints) && L.keypoints.length >= 1, 'at least one keypoint box required');
  for (const k of L.keypoints) {
    need(k && typeof k.title === 'string' && k.title, 'keypoint needs a title');
    need(typeof k.body === 'string' && k.body.trim().length > 0, 'keypoint needs a body');
  }

  need(L.worked && typeof L.worked === 'object', 'one worked example required');
  need(typeof L.worked.prompt === 'string' && L.worked.prompt, 'worked example needs a prompt');
  need(Array.isArray(L.worked.steps) && L.worked.steps.length >= 1, 'worked example needs steps');
  need(typeof L.worked.answer === 'string' && L.worked.answer, 'worked example needs an answer');

  need(typeof L.compression === 'string' && L.compression.trim().length > 0, 'one-breath compression required');
  // Knowledge lessons MUST close with a forward pointer naming where the concept matures.
  need(typeof L.forwardPointer === 'string' && L.forwardPointer.trim().length > 0, 'forward pointer required');

  need(Array.isArray(L.rateFlags), 'rateFlags must be an array (may be empty)');
  return true;
}

/** Index an array of lessons by conceptId, validating each. */
export function indexLessons(lessons) {
  const byId = new Map();
  for (const L of lessons) {
    validateLesson(L);
    if (byId.has(L.conceptId)) throw new Error(`duplicate lesson for ${L.conceptId}`);
    byId.set(L.conceptId, L);
  }
  return byId;
}

/** Count of lesson sections per concept — the shape allocation.js consumes for the lesson floor. */
export function lessonSectionCounts(lessons) {
  const counts = {};
  for (const L of lessons) counts[L.conceptId] = (counts[L.conceptId] ?? 0) + 1;
  return counts;
}
