// Lineage + completion tests (Execution Order §4A / Amendment A2). The load-bearing guard:
// partial content must never produce an unlock.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLineage, rootPapers } from '../src/content/lineage.js';
import { paperProgress, paperStatuses, progressLabel } from '../src/engine/progress.js';
import { loadGraphFromSpec } from '../src/engine/node-loader.js';

const graph = loadGraphFromSpec();

// helper: a derived-states map where the given FA concepts are Competent (rank 4)
function statesWithCompetent(paper, n) {
  const ids = graph.conceptsForPaper(paper);
  const m = new Map();
  ids.slice(0, n).forEach((id) => m.set(id, { rank: 4 }));
  return m;
}

test('lineage validates against grows_into where the child paper has nodes', () => {
  const v = validateLineage(graph);
  assert.equal(v.ok, true, v.errors.join('; '));
  assert.ok(v.checked.includes('FA→FR'));
  assert.ok(v.checked.includes('MA→PM'));
  assert.ok(v.checked.includes('MA→FM'));
  // FR→AA cannot be validated by edges — AA has no nodes; it is recorded as skipped, not failed.
  assert.ok(v.skipped.some((s) => s.startsWith('FR→AA')));
});

test('root papers (open from the start) are BT, MA, FA, LW, TX', () => {
  assert.deepEqual(rootPapers().sort(), ['BT', 'FA', 'LW', 'MA', 'TX']);
});

test('completion is measured against the FULL concept count, not authored lessons', () => {
  const built = new Set(graph.conceptsForPaper('FA').slice(0, 20)); // 20 lessons authored
  const states = statesWithCompetent('FA', 20); // and those 20 are Competent
  const prog = paperProgress('FA', graph, states, (id) => built.has(id));
  assert.equal(prog.total, 65);
  assert.equal(prog.built, 20);
  assert.equal(prog.competent, 20);
  assert.equal(prog.complete, false, '20/65 Competent is NOT a complete paper');
});

test('PARTIAL CONTENT NEVER UNLOCKS — 20/65 FA Competent leaves FR locked', () => {
  const states = statesWithCompetent('FA', 20);
  const statuses = paperStatuses(graph, states, () => true);
  const fr = statuses.find((s) => s.paper === 'FR');
  assert.equal(fr.locked, true);
  assert.match(fr.reason, /opens when you complete FA/);
});

test('completing FA (all 65 Competent) unlocks FR — which then shows "content not built yet"', () => {
  const states = statesWithCompetent('FA', 65); // every FA concept Competent
  assert.equal(paperProgress('FA', graph, states, () => true).complete, true);
  const statuses = paperStatuses(graph, states, () => true);
  const fr = statuses.find((s) => s.paper === 'FR');
  assert.equal(fr.locked, false, 'FR unlocks once FA is complete');
  assert.equal(fr.contentStatus, 'not-built'); // FR has no content track yet
  assert.equal(progressLabel(fr), 'FR — content not built yet');
});

test('LW and TX are open from the start but have no content', () => {
  const statuses = paperStatuses(graph, new Map(), () => false);
  for (const code of ['LW', 'TX']) {
    const s = statuses.find((x) => x.paper === code);
    assert.equal(s.locked, false);
    assert.equal(s.contentStatus, 'not-built');
    assert.equal(progressLabel(s), `${code} — content not built yet`);
  }
});

test('AA stays locked until FR completes (and FR has no content track, so AA stays locked now)', () => {
  const states = statesWithCompetent('FA', 65); // FA complete, FR unlocked but empty
  const statuses = paperStatuses(graph, states, () => true);
  const aa = statuses.find((s) => s.paper === 'AA');
  assert.equal(aa.locked, true);
  assert.match(aa.reason, /opens when you complete FR/);
});

test('build-progress label shows built against total for an open, in-build paper', () => {
  const built = new Set(graph.conceptsForPaper('FA').slice(0, 42));
  const statuses = paperStatuses(graph, new Map(), (id) => built.has(id));
  const fa = statuses.find((s) => s.paper === 'FA');
  assert.equal(progressLabel(fa), 'FA — 42 of 65 concepts available');
});
