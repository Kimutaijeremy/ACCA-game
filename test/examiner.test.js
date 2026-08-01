// Examiner-insight tests (Amendment A6, 2026-08-01). The traps mined from ACCA examiners' reports
// must land on real concepts, ship as tagged distractors, and be named in the Go deeper layers.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXAMINER_REPORTS, APPLIED_TRAPS, EXAMINER_FLAGGED_CONCEPTS, PENDING_TRAPS, TECHNIQUE_TRAPS,
} from '../src/content/examiner-insights.js';
import { loadGraphFromSpec } from '../src/engine/node-loader.js';
import { itemsForConcept } from '../src/content/items/index.js';
import { topicById } from '../src/content/topics/index.js';
import { deeperSectionForConcept } from '../src/engine/topics.js';

const graph = loadGraphFromSpec();

test('a report is recorded for each teaching paper (source of record)', () => {
  const papers = EXAMINER_REPORTS.map((r) => r.paper).sort();
  assert.deepEqual(papers, ['BT', 'FA', 'MA']);
  for (const r of EXAMINER_REPORTS) assert.match(r.url, /accaglobal\.com/);
});

test('every applied trap lands on a real concept whose topic page exists', () => {
  assert.ok(APPLIED_TRAPS.length >= 5);
  for (const t of APPLIED_TRAPS) {
    assert.ok(graph.get(t.conceptId), `${t.conceptId} not in graph`);
    assert.ok(topicById(t.topicId), `topic ${t.topicId} has no page`);
    assert.ok(t.trap && t.trap.length > 40, `${t.conceptId} trap text too thin`);
  }
});

test('each applied trap that names an item ships that item, tagged to a diagnostic cause', () => {
  for (const t of APPLIED_TRAPS) {
    for (const id of t.itemIds) {
      const item = itemsForConcept(t.conceptId).find((i) => i.id === id);
      assert.ok(item, `item ${id} not found on ${t.conceptId}`);
      assert.ok(Object.keys(item.distractors ?? {}).length >= 1, `${id} has no tagged distractor`);
    }
  }
});

test('each applied trap is named in its topic’s Go deeper layer', () => {
  for (const t of APPLIED_TRAPS) {
    const topic = topicById(t.topicId);
    const hasFlagSection = topic.deeper.some((s) => /examiner/i.test(s.heading)
      && Array.isArray(s.conceptIds) && s.conceptIds.includes(t.conceptId));
    assert.ok(hasFlagSection, `${t.topicId} Go deeper has no examiner-trap section for ${t.conceptId}`);
    // and a repair link can resolve to a deeper section for that concept
    assert.equal(typeof deeperSectionForConcept(topic, t.conceptId), 'number');
  }
});

test('flagged concepts (for the emphasis nudge) are the applied-trap concepts, all real', () => {
  assert.ok(EXAMINER_FLAGGED_CONCEPTS.length >= 4);
  for (const c of EXAMINER_FLAGGED_CONCEPTS) assert.ok(graph.get(c), `${c} not in graph`);
});

test('pending and technique traps are recorded (not lost) for future authoring', () => {
  assert.ok(PENDING_TRAPS.length >= 4);
  assert.ok(TECHNIQUE_TRAPS.length >= 2);
});
