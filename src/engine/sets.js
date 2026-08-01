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
const PER_CONCEPT_IN_SET = 2; // no single concept dominates a set

// Per-area set-composition TARGETS. Important finding (confirmed 2026-08-01 against the ACCA
// 2025-26 study guides for FBT/BT and FMA/MA): **ACCA publishes NO per-syllabus-area weighting for
// the objective-test section of these exams.** Both guides state only that "questions will assess
// all parts of the syllabus" — 100% compulsory, sampled across the breadth. So there is no official
// table to drop in; every table here (FA included) is a CONSTRUCTED breadth-based target, refined by
// the one official area-level signal the guides do give: the fixed Section B structure.
//
// FA/FFA — the brief's objective-item distribution target, per 35 (Brief §6.4).
export const FA_AREA_WEIGHTS = Object.freeze({ A: 2, B: 2, C: 4, D: 10, E: 7, F: 6, G: 2, H: 2 });
// BT/FBT — Section A = 46 OT questions across all six areas; Section B = 6 four-mark MTQs, ONE per
// area (all six equally examined there). Target /46: breadth-led (A the largest area), every area
// represented, ethics (F) held above its small size given its exam prominence + guaranteed MTQ.
export const BT_AREA_WEIGHTS = Object.freeze({ A: 11, B: 8, C: 9, D: 9, E: 4, F: 5 });
// MA/FMA — Section A = 35 OT questions across all six areas; Section B = 3 ten-mark MTQs fixed on
// D (Budgeting), E (Standard costing), F (Performance measurement). Target /35: cost accounting (C)
// and budgeting (D) are the Section-A heavyweights; E and F lifted above their size to reflect their
// guaranteed Section B marks; A and B the lighter introductory/technique areas.
export const MA_AREA_WEIGHTS = Object.freeze({ A: 4, B: 4, C: 9, D: 7, E: 6, F: 5 });

const AREA_WEIGHTS_BY_PAPER = { FA: FA_AREA_WEIGHTS, BT: BT_AREA_WEIGHTS, MA: MA_AREA_WEIGHTS };

/**
 * Per-area set-composition target for a paper. Returns the constructed target table (above); falls
 * back to a by-concept-count breadth proxy only for a paper with no table yet (e.g. future papers).
 * These are targets, not official ACCA weightings — none is published; see the note above.
 * @returns {{ [areaLetter:string]: number }}
 */
export function defaultAreaWeights(graph, paper) {
  if (AREA_WEIGHTS_BY_PAPER[paper]) return { ...AREA_WEIGHTS_BY_PAPER[paper] };
  const w = {};
  for (const cid of graph.conceptsForPaper(paper)) {
    const a = graph.get(cid).outcome.split(' ')[1][0];
    w[a] = (w[a] ?? 0) + 1;
  }
  return w;
}

/** Distribute `total` across keys by weight, largest-remainder rounding so it sums exactly. */
function largestRemainder(keys, weights, total) {
  const wsum = keys.reduce((s, k) => s + (weights[k] > 0 ? weights[k] : 0), 0) || keys.length;
  const alloc = {};
  const rem = [];
  let used = 0;
  for (const k of keys) {
    const q = total * ((weights[k] > 0 ? weights[k] : (wsum === keys.length ? 1 : 0)) / wsum);
    alloc[k] = Math.floor(q);
    used += alloc[k];
    rem.push([k, q - alloc[k]]);
  }
  rem.sort((a, b) => b[1] - a[1]);
  for (let i = 0, left = total - used; i < rem.length && left > 0; i += 1, left -= 1) alloc[rem[i][0]] += 1;
  return alloc;
}

/**
 * Assemble a mixed set of `size` items drawn to the exam's AREA weighting (not round-robin across
 * concepts), biased within each area toward topics short of completion so thin areas still finish.
 * @param {object[]} items - the paper's authored items (any rung; only practice rungs are used)
 * @param {object} opts
 * @param {object} opts.rng - from makeRng(seed)
 * @param {number} [opts.size]
 * @param {(item:object)=>string} opts.areaOf - the syllabus area letter for an item
 * @param {{[area:string]:number}} opts.areaWeights - target weight per area (see defaultAreaWeights)
 * @param {(item:object)=>number} [opts.shortfallOf] - >=0; higher = topic more short of completion
 * @returns {{items, areaTarget, areaActual, examShaped}}
 */
export function assembleSet(items, opts = {}) {
  const { rng, size = SET_SIZE, areaOf, areaWeights = {}, shortfallOf = () => 0 } = opts;
  const practice = items.filter((it) => PRACTICE.includes(it.rung));
  if (!practice.length) return { items: [], areaTarget: {}, areaActual: {}, examShaped: true };

  const byArea = new Map();
  for (const it of practice) {
    const a = areaOf(it);
    if (!byArea.has(a)) byArea.set(a, []);
    byArea.get(a).push(it);
  }
  const areas = [...byArea.keys()];

  // Target counts over the areas that actually have items (renormalised), summing to `size`.
  const target = largestRemainder(areas, areaWeights, size);
  for (const a of areas) target[a] = Math.min(target[a], byArea.get(a).length);

  const picked = [];
  const used = new Set();
  const perConcept = new Map();
  // Higher shortfall first (drive thin/incomplete topics toward completion), rng jitter to vary sets.
  const order = (pool) => pool
    .filter((it) => !used.has(it.id))
    .sort((x, y) => (shortfallOf(y) - shortfallOf(x)) || (rng.unit() - 0.5));
  const take = (it) => {
    const c = it.conceptIds[0];
    if ((perConcept.get(c) ?? 0) >= PER_CONCEPT_IN_SET) return false;
    used.add(it.id); perConcept.set(c, (perConcept.get(c) ?? 0) + 1); picked.push(it); return true;
  };

  for (const a of areas) {
    let n = target[a];
    for (const it of order(byArea.get(a))) { if (n <= 0) break; if (take(it)) n -= 1; }
  }
  // Fill any shortfall (an area couldn't meet its target) from the rest, still shortfall-biased.
  if (picked.length < size) {
    for (const it of order(practice)) { if (picked.length >= size) break; take(it); }
  }
  // Last resort: relax the per-concept cap only if genuinely starved.
  if (picked.length < size) {
    for (const it of practice) {
      if (picked.length >= size) break;
      if (!used.has(it.id)) { used.add(it.id); picked.push(it); }
    }
  }

  const areaActual = {};
  for (const it of picked) { const a = areaOf(it); areaActual[a] = (areaActual[a] ?? 0) + 1; }
  const examShaped = areas.every((a) => Math.abs((areaActual[a] ?? 0) - (target[a] ?? 0)) <= 1);
  return { items: picked, areaTarget: target, areaActual, examShaped };
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
  if (comp.complete) return comp.stale ? `${title} — complete · needs revision` : `${title} — complete ✓`;
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
 * @param {Map<string,object>} [states] - derived concept states; if given, a completed topic whose
 *   concepts have a review due is marked `stale` ("complete · needs revision"). Latch is unaffected.
 * @returns {{paper, total, complete, stale, paperComplete, topics: object[]}}
 */
export function paperTopicSummary(logRecords, graph, syllabus, paper, states = null) {
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
    const comp = topicCompletion(attempts);
    // Stale = completed but a concept's review has fallen due underneath (decay). Access is kept.
    const stale = comp.complete && !!states && [...cids].some((c) => states.get(c)?.due === true);
    return { topicId: sub, ...comp, stale };
  });
  const complete = topics.filter((t) => t.complete).length;
  return {
    paper, total: subs.length, complete,
    stale: topics.filter((t) => t.stale).length,
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
