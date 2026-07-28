// Allocation-matrix tests (Brief §6.4). In WP1 the banks are empty and the report MUST fail
// loudly; with synthetic content the floors and the concentration cap behave correctly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, buildPaperMatrix } from '../src/engine/allocation.js';
import { loadGraphFromSpec, loadSyllabusOutcomes } from '../src/engine/node-loader.js';

const graph = loadGraphFromSpec();
const syllabus = loadSyllabusOutcomes();

test('empty content: three matrices, every sub-area below every floor, report fails loudly', () => {
  const report = buildReport(syllabus, graph, {});
  assert.equal(report.allGreen, false, 'the WP1 report must not be green while banks are empty');
  assert.equal(report.papers.length, 3);

  for (const p of report.papers) {
    assert.equal(p.green, false);
    assert.equal(p.bankTotal, 0);
    assert.equal(p.failingSubareaCount, p.subareaCount, 'every sub-area fails');
    for (const row of p.rows) {
      assert.equal(row.lessonSections, 0);
      assert.equal(row.practiceCount, 0);
      assert.equal(row.sealedPoolCount, 0);
      // all three floors registered as failed
      assert.deepEqual(Object.values(row.floors), [false, false, false]);
      assert.ok(row.concepts.length >= 1, 'every sub-area still maps to at least one concept');
    }
  }
});

test('sub-area counts match the frozen syllabus (BT 38, MA 25, FA 34)', () => {
  const byPaper = Object.fromEntries(buildReport(syllabus, graph, {}).papers.map((p) => [p.paper, p]));
  assert.equal(byPaper.BT.subareaCount, 38);
  assert.equal(byPaper.MA.subareaCount, 25);
  assert.equal(byPaper.FA.subareaCount, 34);
  assert.equal(byPaper.FA.conceptCount, 65);
});

test('a fully-stocked sub-area turns green; its neighbours stay red', () => {
  // FA E1 is served by concept FA-39 ("The trial balance").
  const target = 'FA-39';
  const content = {
    lessonSections: { [target]: 1 },
    items: [
      { conceptIds: [target], rung: 'concept-check' },
      { conceptIds: [target], rung: 'standard' },
      { conceptIds: [target], rung: 'standard' },
      { conceptIds: [target], rung: 'stretch', sealed: true }, // a sealed-pool item
    ],
  };
  const fa = buildPaperMatrix('FA', syllabus.subareas.FA, graph, content);
  const e1 = fa.rows.find((r) => r.subarea === 'FA E1');
  assert.equal(e1.green, true, 'FA E1 meets lesson≥1, ≥3 practice over ≥2 rungs, ≥1 sealed');
  assert.equal(e1.rungsCovered, 2);
  // the paper as a whole is still not green — the other sub-areas are empty
  assert.equal(fa.green, false);
});

test('the concentration cap flags a concept exceeding 8% of the practice bank', () => {
  // 10 practice items, 9 of them on one concept → 90% >> 8%.
  const hog = 'FA-05';
  const items = [];
  for (let i = 0; i < 9; i++) items.push({ conceptIds: [hog], rung: 'standard' });
  items.push({ conceptIds: ['FA-39'], rung: 'standard' });
  const fa = buildPaperMatrix('FA', syllabus.subareas.FA, graph, { items });
  assert.equal(fa.bankTotal, 10);
  assert.ok(fa.capViolations.some((v) => v.conceptId === hog && v.share > 0.08));
  assert.equal(fa.green, false, 'a cap violation fails the paper');
});
