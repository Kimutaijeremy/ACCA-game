// Sets-of-ten + completion tests (Amendment A6). Sets draw across the whole paper; a topic
// completes when 8 of the last 10 questions tagged to it are correct across >=2 sessions (latched).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assembleSet, topicCompletion, topicHint, paperTopicSummary, rollingAverage,
  defaultAreaWeights, FA_AREA_WEIGHTS,
} from '../src/engine/sets.js';
import { makeRng } from '../src/engine/rng.js';
import { ITEMS_BY_PAPER } from '../src/content/items/index.js';
import { loadGraphFromSpec, loadSyllabusOutcomes } from '../src/engine/node-loader.js';
import { LearnerStore, MemoryStore, MemoryLogAdapter } from '../src/engine/store.js';

const graph = loadGraphFromSpec();
const syllabus = loadSyllabusOutcomes();
const areaOf = (it) => graph.get(it.conceptIds[0]).outcome.split(' ')[1][0];
const buildSet = (paper, seed, extra = {}) => assembleSet(ITEMS_BY_PAPER[paper], {
  rng: makeRng(seed), size: 10, areaOf, areaWeights: defaultAreaWeights(graph, paper), ...extra,
});

test('assembleSet draws ten distinct items', () => {
  const { items } = buildSet('FA', 42);
  assert.equal(items.length, 10);
  assert.equal(new Set(items.map((i) => i.id)).size, 10, 'items are distinct');
});

test('assembleSet still reaches ten even when a paper has few concepts (BT)', () => {
  const { items } = buildSet('BT', 7);
  assert.equal(items.length, 10);
  assert.equal(new Set(items.map((i) => i.id)).size, 10);
});

test('assembleSet is deterministic for a seed', () => {
  const a = buildSet('MA', 99).items.map((i) => i.id);
  const b = buildSet('MA', 99).items.map((i) => i.id);
  assert.deepEqual(a, b);
});

test('sets are drawn to the area weighting, not round-robin', () => {
  // FA authored areas are A, C, D, H. D (weight 10) must get more airtime than A (weight 2).
  // Aggregate over several seeds to see the weighting, not a single draw.
  const tally = {};
  for (let seed = 1; seed <= 20; seed += 1) {
    for (const it of buildSet('FA', seed).items) { const a = areaOf(it); tally[a] = (tally[a] ?? 0) + 1; }
  }
  assert.ok((tally.D ?? 0) > (tally.A ?? 0), `D should outweigh A (got D=${tally.D}, A=${tally.A})`);
  // and a single set reports whether it was exam-shaped
  assert.equal(typeof buildSet('FA', 3).examShaped, 'boolean');
});

test('within an area, selection is biased toward topics short of completion', () => {
  // Give FA-63 (area H) a big shortfall; with H items present it should be preferred within H.
  const shortfallOf = (it) => (it.conceptIds.includes('FA-63') ? 100 : 0);
  let seen = 0;
  for (let seed = 1; seed <= 10; seed += 1) {
    if (buildSet('FA', seed, { shortfallOf }).items.some((i) => i.conceptIds.includes('FA-63'))) seen += 1;
  }
  assert.ok(seen >= 8, `high-shortfall topic should appear in most sets (got ${seen}/10)`);
});

test('defaultAreaWeights: FA uses the exam table; BT/MA weight by concept count', () => {
  assert.deepEqual(defaultAreaWeights(graph, 'FA'), FA_AREA_WEIGHTS);
  const bt = defaultAreaWeights(graph, 'BT');
  assert.equal(bt.A, 14); // 14 BT concepts in area A
  assert.equal(bt.E, 5);
});

const S1 = 's1'; const S2 = 's2';
const att = (correct, sessionId) => ({ correct, sessionId });

test('a topic needs 10 attempts, 8 correct, across 2 sessions', () => {
  // 9 correct in one session → not complete (fewer than 10 and one session)
  assert.equal(topicCompletion(Array.from({ length: 9 }, () => att(true, S1))).complete, false);
  // 10 correct but ONE session → not complete
  assert.equal(topicCompletion(Array.from({ length: 10 }, () => att(true, S1))).complete, false);
  // 10 with 7 correct across 2 sessions → not complete
  const seven = [...Array.from({ length: 7 }, () => att(true, S1)), ...Array.from({ length: 3 }, () => att(false, S2))];
  assert.equal(topicCompletion(seven).complete, false);
  // 10 with 8 correct across 2 sessions → complete
  const eight = [...Array.from({ length: 5 }, () => att(true, S1)), ...Array.from({ length: 3 }, () => att(true, S2)), att(false, S2), att(false, S2)];
  assert.equal(topicCompletion(eight).complete, true);
});

test('completion latches: later wrong answers do not un-complete a topic', () => {
  const attempts = [
    ...Array.from({ length: 5 }, () => att(true, S1)),
    ...Array.from({ length: 5 }, () => att(true, S2)), // window now 10 correct across 2 sessions → latched
    ...Array.from({ length: 5 }, () => att(false, S2)), // then a bad run
  ];
  assert.equal(topicCompletion(attempts).complete, true);
});

test('topicHint reads like the spec example', () => {
  const comp = topicCompletion([...Array.from({ length: 6 }, () => att(true, S1)), att(false, S1), att(false, S1)]);
  assert.equal(comp.windowSize, 8);
  assert.equal(comp.windowCorrect, 6);
  assert.equal(topicHint('Depreciation', comp), 'Depreciation — 6 of last 8 correct, needs 2 more questions');
});

test('topicHint tells you to return in another session when that is the only blocker', () => {
  const comp = topicCompletion(Array.from({ length: 10 }, () => att(true, S1))); // 10/10 one session
  assert.match(topicHint('X', comp), /another session/);
});

test('paperTopicSummary completes one topic on its own questions and leaves the rest', () => {
  // 10 correct FA-26 (topic FA D5) attempts across two sessions
  const log = Array.from({ length: 10 }, (_, i) => ({
    kind: 'item', conceptIds: ['FA-26'], correct: true,
    sessionId: i < 5 ? S1 : S2, timestamp: 1000 + i,
  }));
  const sum = paperTopicSummary(log, graph, syllabus, 'FA');
  assert.equal(sum.total, syllabus.subareas.FA.length);
  const d5 = sum.topics.find((t) => t.topicId === 'FA D5');
  assert.equal(d5.complete, true);
  assert.equal(sum.complete, 1);
  assert.equal(sum.paperComplete, false); // one topic of 34
});

test('a completed topic whose concept has a due review is marked stale (needs revision), still complete', () => {
  const log = Array.from({ length: 10 }, (_, i) => ({
    kind: 'item', conceptIds: ['FA-26'], correct: true, sessionId: i < 5 ? S1 : S2, timestamp: 1000 + i,
  }));
  const states = new Map([['FA-26', { due: true }]]); // decayed underneath
  const sum = paperTopicSummary(log, graph, syllabus, 'FA', states);
  const d5 = sum.topics.find((t) => t.topicId === 'FA D5');
  assert.equal(d5.complete, true, 'latched — access not withdrawn');
  assert.equal(d5.stale, true, 'shown as needs revision');
  assert.equal(sum.stale, 1);
  assert.equal(topicHint('Depreciation', d5), 'Depreciation — complete · needs revision');
});

test('rollingAverage averages the last n set scores for a paper', () => {
  const sets = [
    { paper: 'FA', score: 6 }, { paper: 'MA', score: 10 },
    { paper: 'FA', score: 8 }, { paper: 'FA', score: 10 },
  ];
  assert.equal(rollingAverage(sets, 'FA'), (6 + 8 + 10) / 3);
  assert.equal(rollingAverage(sets, 'BT'), null);
});

test('the store persists set results and Go deeper opens in meta, exporting with everything', () => {
  const store = new LearnerStore({ kv: new MemoryStore(), logAdapter: new MemoryLogAdapter(), onPersistenceError() {} });
  store.addSetResult({ id: 'set1', paper: 'FA', score: 8, size: 10, at: 1 });
  store.addDeeperOpen({ id: 'd1', topicId: 'FA D5', at: 2 });
  assert.equal(store.setResults().length, 1);
  assert.equal(store.setResults()[0].score, 8);
  assert.equal(store.deeperOpens().length, 1);
  assert.equal(store.deeperOpens()[0].topicId, 'FA D5');
});
