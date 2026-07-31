// topics.js — the TOPIC-PAGE model and its validator (Brief §6.3, Amendment A6).
//
// For BT/MA/FA the teaching unit is the syllabus SUB-AREA (a "topic"), not the concept: Jeremy has
// studied these papers and needs reminding and drilling, not teaching from scratch. A topic page is
// deliberately thin — three parts, no more:
//   1. nutshell      — the topic in about a page, no story beat;
//   2. examReadiness — the traps, the required format, what examiners look for;
//   3. worked        — ONE worked example, every step shown.
// The Wanjiku voice is kept light. Concepts remain the TAGGING SPINE (questions tag to concepts);
// a topic's concepts are those whose outcome falls in its sub-area. FR/AA keep full lessons and use
// lessons.js instead (Execution Order §1C / §5B).

export const TEACHING_PAPERS = new Set(['BT', 'MA', 'FA']); // papers that use topic pages (Amendment A6)

/**
 * Validate one topic page. Throws on any missing load-bearing part.
 * @param {object} T
 */
export function validateTopic(T) {
  const need = (cond, msg) => { if (!cond) throw new Error(`topic ${T?.topicId ?? '?'}: ${msg}`); };
  need(T && typeof T === 'object', 'not an object');
  need(typeof T.topicId === 'string' && /^[A-Z]{2} [A-Z]\d+$/.test(T.topicId), 'topicId must be a sub-area code like "FA A3"');
  need(typeof T.paper === 'string' && T.topicId.startsWith(T.paper + ' '), 'paper must prefix the topicId');
  need(TEACHING_PAPERS.has(T.paper), `topic pages are BT/MA/FA only, got ${T.paper}`);
  need(typeof T.title === 'string' && T.title.trim().length > 0, 'title required');
  need(typeof T.syllabusYear === 'string' && T.syllabusYear, 'syllabusYear required');

  // Nutshell: substantial but bounded — "about a page". Enforce a floor; the rubric/audit guards
  // the ceiling (it must stay a reminder, not a lesson).
  need(typeof T.nutshell === 'string' && T.nutshell.trim().length >= 120, 'nutshell too thin');
  need(typeof T.examReadiness === 'string' && T.examReadiness.trim().length >= 60,
    'examReadiness required (traps, format, what examiners want)');

  need(T.worked && typeof T.worked === 'object', 'one worked example required');
  need(typeof T.worked.prompt === 'string' && T.worked.prompt, 'worked example needs a prompt');
  need(Array.isArray(T.worked.steps) && T.worked.steps.length >= 1, 'worked example needs steps (every one shown)');
  need(typeof T.worked.answer === 'string' && T.worked.answer, 'worked example needs an answer');

  need(Array.isArray(T.rateFlags), 'rateFlags must be an array (may be empty)');
  return true;
}

/** Index topic pages by topicId, validating each and rejecting duplicates. */
export function indexTopics(topics) {
  const byId = new Map();
  for (const T of topics) {
    validateTopic(T);
    if (byId.has(T.topicId)) throw new Error(`duplicate topic page for ${T.topicId}`);
    byId.set(T.topicId, T);
  }
  return byId;
}

/** The topic id (sub-area) a concept belongs to, from the graph — its outcome. */
export function topicIdForConcept(graph, conceptId) {
  const c = graph.get(conceptId);
  return c ? c.outcome : null;
}
