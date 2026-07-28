// Graph-loading tests: the frozen concept graph loads, indexes and counts as specified.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGraphFromSpec } from '../src/engine/node-loader.js';

const graph = loadGraphFromSpec();

test('the frozen graph loads with the specified counts (191 live, 38 stub, 273 edges)', () => {
  const c = graph.counts();
  assert.equal(c.live, 191);
  assert.equal(c.stubs, 38);
  assert.equal(c.edges, 273);
});

test('the three Phase-1 papers carry BT 60, MA 66, FA 65 concepts', () => {
  assert.deepEqual(graph.papers(), ['BT', 'MA', 'FA']);
  assert.equal(graph.conceptsForPaper('BT').length, 60);
  assert.equal(graph.conceptsForPaper('MA').length, 66);
  assert.equal(graph.conceptsForPaper('FA').length, 65);
});

test('concept ids are permanent keys and every edge resolves', () => {
  // loadGraph throws on a dangling edge; reaching here means all edges resolved.
  assert.ok(graph.has('FA-26'));
  assert.equal(graph.get('FA-26').name, 'Depreciation methods and the annual charge');
  // a known grows_into edge (FA depreciation matures in FR)
  assert.ok(graph.get('FA-26').grows_into.includes('FR-S01'));
});
