// sets.js — mixed exam-format sets of ten, and the visible completion gate (Amendment A6).
//
// Two things live here:
//   1. assembleSet — draw 10 items across the WHOLE paper, spread over concepts (hence topics),
//      never blocked by topic. A set is scored /10 as session feedback; it is NOT the gate.
//   2. Topic/paper completion by the 8-OF-LAST-10 rule (refined 2026-07-31): a topic is complete
//      when 8 of the learner's last 10 questions TAGGED TO THAT TOPIC are correct across >=2
//      sessions, read from the attempt log. It LATCHES once achieved. A paper is complete when all
//      its topics are — that is the unlock. Concept mastery/decay keep running underneath (§1B).

import { RUNGS } from './states.js';

export const SET_SIZE = 10;
export const TOPIC_WINDOW = 10;
export const TOPIC_NEED = 8;
export const TOPIC_MIN_SESSIONS = 2;

const PRACTICE = [RUNGS.CONCEPT_CHECK, RUNGS.GUIDED, RUNGS.STANDARD, RUNGS.STRETCH];

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Assemble a mixed set of `size` items drawn across a paper, spread over concepts (round-robin), so
 * position and topic never predict the answer. Takes the paper's authored items and a seeded rng.
 * @param {object[]} items - authored items for the paper (any rung; only practice rungs are used)
 * @param {object} rng - from makeRng(seed)
 * @param {number} [size]
 * @returns {object[]} up to `size` distinct items
 */
export function assembleSet(items, rng, size = SET_SIZE) {
  const practice = items.filter((it) => PRACTICE.includes(it.rung));
  const byConcept = new Map();
  for (const it of practice) {
    const c = it.conceptIds[0];
    if (!byConcept.has(c)) byConcept.set(c, []);
    byConcept.get(c).push(it);
  }
  const concepts = shuffle([...byConcept.keys()], rng);
  for (const c of concepts) shuffle(byConcept.get(c), rng);

  const picked = [];
  const used = new Set();
  let progressed = true;
  while (picked.length < size && progressed) {
    progressed = false;
    for (const c of concepts) {
      if (picked.length >= size) break;
      const pool = byConcept.get(c);
      const next = pool.find((it) => !used.has(it.id));
      if (next) { used.add(next.id); picked.push(next); progressed = true; }
    }
  }
  return picked;
}

/**
 * Completion for a single topic, from its own chronological attempts.
 * @param {{correct:boolean, sessionId:string}[]} attempts - item attempts tagged to this topic
 * @returns {{complete, attempts, windowCorrect, windowSize, sessions}}
 */
export function topicCompletion(attempts) {
  // Latch: complete iff at some point the last-10 window held >=8 correct across >=2 sessions.
  let latched = false;
  const w = [];
  for (const a of attempts) {
    w.push(a);
    if (w.length > TOPIC_WINDOW) w.shift();
    if (w.length >= TOPIC_WINDOW) {
      const correct = w.filter((x) => x.correct).length;
      const sessions = new Set(w.map((x) => x.sessionId)).size;
      if (correct >= TOPIC_NEED && sessions >= TOPIC_MIN_SESSIONS) { latched = true; break; }
    }
  }
  const cur = attempts.slice(-TOPIC_WINDOW);
  return {
    complete: latched,
    attempts: attempts.length,
    windowCorrect: cur.filter((x) => x.correct).length,
    windowSize: cur.length,
    sessions: new Set(cur.map((x) => x.sessionId)).size,
  };
}

/** A short progress line toward completion, e.g. "Depreciation — 6 of last 8 correct, needs 2 more questions". */
export function topicHint(title, comp) {
  if (comp.complete) return `${title} — complete ✓`;
  if (comp.windowSize < TOPIC_WINDOW) {
    const need = TOPIC_WINDOW - comp.windowSize;
    return `${title} — ${comp.windowCorrect} of last ${comp.windowSize} correct, needs ${need} more question${need > 1 ? 's' : ''}`;
  }
  if (comp.sessions < TOPIC_MIN_SESSIONS) {
    return `${title} — ${comp.windowCorrect} of last 10 correct; come back in another session to complete`;
  }
  return `${title} — ${comp.windowCorrect} of last 10 correct, need 8`;
}

/**
 * Per-topic completion for a whole paper, measured on each topic's own questions.
 * @param {object[]} logRecords - the full attempt log (array of records)
 * @param {ConceptGraph} graph
 * @param {object} syllabus - { subareas: { [paper]: string[] } }
 * @param {string} paper
 * @returns {{paper, total, complete, paperComplete, topics: object[]}}
 */
export function paperTopicSummary(logRecords, graph, syllabus, paper) {
  const subs = syllabus.subareas[paper] ?? [];
  const items = logRecords.filter((r) => r.kind === 'item');
  const conceptsByTopic = new Map(subs.map((s) => [s, new Set()]));
  for (const cid of graph.conceptsForPaper(paper)) {
    const sub = graph.get(cid).outcome;
    if (conceptsByTopic.has(sub)) conceptsByTopic.get(sub).add(cid);
  }
  const topics = subs.map((sub) => {
    const cids = conceptsByTopic.get(sub);
    const attempts = items
      .filter((r) => r.conceptIds.some((c) => cids.has(c)))
      .map((r) => ({ correct: r.correct, sessionId: r.sessionId, timestamp: r.timestamp }));
    return { topicId: sub, ...topicCompletion(attempts) };
  });
  const complete = topics.filter((t) => t.complete).length;
  return {
    paper, total: subs.length, complete,
    paperComplete: subs.length > 0 && complete === subs.length,
    topics,
  };
}

/** Rolling average set score for a paper (session feedback), over the last n sets. */
export function rollingAverage(setResults, paper, n = 5) {
  const scores = setResults.filter((s) => s.paper === paper).slice(-n).map((s) => s.score);
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
