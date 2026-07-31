// topics/index.js — aggregate every paper's topic pages and index them (Amendment A6).
// A topic page is the teaching unit for BT/MA/FA (one per syllabus sub-area). Concepts remain the
// tagging spine, so a concept's topic is looked up by its outcome (see topicIdForConcept in the
// engine) — this module just holds and indexes the pages.

import { BT_TOPICS } from './bt.js';
import { MA_TOPICS } from './ma.js';
import { FA_TOPICS } from './fa.js';
import { indexTopics } from '../../engine/topics.js';

export const TOPICS_BY_PAPER = Object.freeze({ BT: BT_TOPICS, MA: MA_TOPICS, FA: FA_TOPICS });

export const ALL_TOPICS = [...BT_TOPICS, ...MA_TOPICS, ...FA_TOPICS];

// Index (also validates every page and rejects duplicate topic ids).
const _byId = indexTopics(ALL_TOPICS);

/** The topic page for a sub-area id (e.g. "FA A3"), or null. */
export function topicById(topicId) {
  return _byId.get(topicId) ?? null;
}

/** True if a sub-area has an authored topic page. */
export function hasTopic(topicId) {
  return _byId.has(topicId);
}

/** Authored topic ids for a paper (or all). */
export function authoredTopicIds(paper = null) {
  const arr = paper ? (TOPICS_BY_PAPER[paper] ?? []) : ALL_TOPICS;
  return arr.map((T) => T.topicId);
}
