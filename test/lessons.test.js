// Pilot-lesson tests (Brief §6.3): the five pilots are structurally complete, reference real
// concepts, and stress five different shapes.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLesson, indexLessons, lessonSectionCounts } from '../src/engine/lessons.js';
import { PILOT_LESSONS } from '../src/content/pilot-lessons.js';
import { loadGraphFromSpec } from '../src/engine/node-loader.js';

const graph = loadGraphFromSpec();

test('all six pilot lessons validate (story, keypoints, worked example, compression, forward pointer)', () => {
  assert.equal(PILOT_LESSONS.length, 6);
  for (const L of PILOT_LESSONS) assert.doesNotThrow(() => validateLesson(L));
  assert.doesNotThrow(() => indexLessons(PILOT_LESSONS));
});

test('each pilot references a real, live concept in the frozen graph', () => {
  for (const L of PILOT_LESSONS) {
    const c = graph.get(L.conceptId);
    assert.ok(c, `${L.conceptId} not in graph`);
    assert.equal(c.stub, false, `${L.conceptId} is a stub`);
    // the lesson title matches the concept's real syllabus name (naming policy §11)
    assert.equal(L.title, c.name);
  }
});

test('the pilots deliberately span the required shapes', () => {
  const shapes = PILOT_LESSONS.map((L) => L.shape);
  for (const required of ['theory', 'calculation', 'double-entry']) {
    assert.ok(shapes.includes(required), `missing required shape: ${required}`);
  }
  // BT theory, MA calculation, FA double-entry are explicitly present
  assert.equal(PILOT_LESSONS.find((L) => L.conceptId === 'BT-04').shape, 'theory');
  assert.equal(PILOT_LESSONS.find((L) => L.conceptId === 'MA-11').shape, 'calculation');
  assert.equal(PILOT_LESSONS.find((L) => L.conceptId === 'FA-26').shape, 'double-entry');
  // six distinct shapes in all — incl. a deliberately dry 'process' concept (FA-13)
  assert.equal(new Set(shapes).size, 6);
  assert.equal(PILOT_LESSONS.find((L) => L.conceptId === 'FA-13').shape, 'process');
});

test("a forward pointer names where the concept matures, honouring the graph's growth edges", () => {
  const fa26 = PILOT_LESSONS.find((L) => L.conceptId === 'FA-26');
  // FA-26 grows into FR revaluation/impairment; the pointer should say so
  assert.match(fa26.forwardPointer, /FR/);
  assert.ok(graph.get('FA-26').grows_into.includes('FR-S01'));
});

test('lessonSectionCounts feeds the allocation lesson floor', () => {
  const counts = lessonSectionCounts(PILOT_LESSONS);
  assert.equal(counts['BT-04'], 1);
  assert.equal(counts['FA-63'], 1);
  assert.equal(counts['FA-13'], 1);
  assert.equal(Object.keys(counts).length, 6);
});
