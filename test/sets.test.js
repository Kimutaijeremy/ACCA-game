// Sets-of-ten + completion tests (Amendment A6). Sets draw across the whole paper; a topic
// completes when 8 of the last 10 questions tagged to it are correct across >=2 sessions (latched).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assembleSet, topicCompletion, topicHint, paperTopicSummary, rollingAverage,
} from '../src/engine/sets.js';
import { makeRng } from '../src/engine/rng.js';
import { ITEMS_BY_PAPER } from '../src/content/items/index.js';
import { loadGraphFromSpec, loadSyllabusOutcomes } from '../src/engine/node-loader.js';
import { LearnerStore, MemoryStore, MemoryLogAdapter } from '../src/engine/store.js';

const graph = loadGraphFromSpec();
const syllabus = loadSyllabusOutcomes();

test('assembleSet draws ten distinct items spread across concepts', () => {
  const rng = makeRng(42);
  const set = assembleSet(ITEMS_BY_PAPER.FA, rng, 10);
  assert.equal(set.length, 10);
  assert.equal(new Set(set.map((i) => i.id)).size, 10, 'items are distinct');
  const concepts = new Set(set.map((i) => i.conceptIds[0]));
  assert.ok(concepts.size >= 5, `spread across concepts (got ${concepts.size})`);
});

test('assembleSet still reaches ten even when a paper has few concepts (BT)', () => {
  const set = assembleSet(ITEMS_BY_PAPER.BT, makeRng(7), 10);
  assert.equal(set.length, 10);
  assert.equal(new Set(set.map((i) => i.id)).size, 10);
});

test('assembleSet is deterministic for a seed', () => {
  const a = assembleSet(ITEMS_BY_PAPER.MA, makeRng(99), 10).map((i) => i.id);
  const b = assembleSet(ITEMS_BY_PAPER.MA, makeRng(99), 10).map((i) => i.id);
  assert.deepEqual(a, b);
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

test('rollingAverage averages the last n set scores for a paper', () => {
  const sets = [
    { paper: 'FA', score: 6 }, { paper: 'MA', score: 10 },
    { paper: 'FA', score: 8 }, { paper: 'FA', score: 10 },
  ];
  assert.equal(rollingAverage(sets, 'FA'), (6 + 8 + 10) / 3);
  assert.equal(rollingAverage(sets, 'BT'), null);
});

test('the store persists set results and Teach Me uses in meta, exporting with everything', () => {
  const store = new LearnerStore({ kv: new MemoryStore(), logAdapter: new MemoryLogAdapter(), onPersistenceError() {} });
  store.addSetResult({ id: 'set1', paper: 'FA', score: 8, size: 10, at: 1 });
  store.addTeachUse({ id: 't1', topicId: 'FA D5', at: 2 });
  assert.equal(store.setResults().length, 1);
  assert.equal(store.setResults()[0].score, 8);
  assert.equal(store.teachUses().length, 1);
  assert.equal(store.teachUses()[0].topicId, 'FA D5');
});
