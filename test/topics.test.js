// Topic-page tests (Brief §6.3, Amendment A6). Topic pages are the teaching unit for BT/MA/FA:
// one per sub-area, thin by design, over concepts that remain the tagging spine.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTopic, indexTopics, topicIdForConcept } from '../src/engine/topics.js';
import { ALL_TOPICS, TOPICS_BY_PAPER, topicById, hasTopic } from '../src/content/topics/index.js';
import { loadGraphFromSpec, loadSyllabusOutcomes } from '../src/engine/node-loader.js';
import { itemsForConcept } from '../src/content/items/index.js';

const graph = loadGraphFromSpec();
const syllabus = loadSyllabusOutcomes();

test('every topic page validates (nutshell, exam readiness, one worked example)', () => {
  assert.ok(ALL_TOPICS.length >= 12);
  for (const T of ALL_TOPICS) assert.doesNotThrow(() => validateTopic(T), T.topicId);
  assert.doesNotThrow(() => indexTopics(ALL_TOPICS)); // rejects duplicates
});

test('every topic id is a real syllabus sub-area for its paper', () => {
  for (const T of ALL_TOPICS) {
    const subs = syllabus.subareas[T.paper] ?? [];
    assert.ok(subs.includes(T.topicId), `${T.topicId} not a real ${T.paper} sub-area`);
  }
});

test('topic pages are BT/MA/FA only, and thinner than the old lessons', () => {
  for (const T of ALL_TOPICS) {
    assert.ok(['BT', 'MA', 'FA'].includes(T.paper));
    // A reminder page, not a full lesson: nutshell is bounded. (Guards against re-growing a lesson.)
    assert.ok(T.nutshell.length <= 1800, `${T.topicId} nutshell too long for a reminder page`);
  }
});

test('every authored concept maps to an authored topic page (teaching layer covers the tags)', () => {
  const authored = ['BT-01', 'BT-03', 'BT-04', 'BT-05', 'MA-01', 'MA-06', 'MA-07', 'MA-11',
    'FA-04', 'FA-05', 'FA-11', 'FA-13', 'FA-22', 'FA-26', 'FA-63'];
  for (const cid of authored) {
    const tid = topicIdForConcept(graph, cid);
    assert.ok(hasTopic(tid), `concept ${cid} → topic ${tid} has no page`);
    // and that topic has questions behind it (concepts are the tagging spine)
    assert.ok(itemsForConcept(cid).length > 0, `${cid} has no items`);
  }
});

test('multi-concept sub-areas are one page covering all their concepts', () => {
  // BT A2 = BT-03 + BT-04; MA A3 = MA-06 + MA-07; FA A3 = FA-04 + FA-05
  for (const [tid, concepts] of [['BT A2', ['BT-03', 'BT-04']], ['MA A3', ['MA-06', 'MA-07']], ['FA A3', ['FA-04', 'FA-05']]]) {
    assert.ok(hasTopic(tid), `${tid} page missing`);
    for (const c of concepts) assert.equal(topicIdForConcept(graph, c), tid);
  }
});

test('TOPICS_BY_PAPER counts line up with the conversion (BT 3, MA 3, FA 6)', () => {
  assert.equal(TOPICS_BY_PAPER.BT.length, 3);
  assert.equal(TOPICS_BY_PAPER.MA.length, 3);
  assert.equal(TOPICS_BY_PAPER.FA.length, 6);
});
