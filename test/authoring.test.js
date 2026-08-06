// Authoring-contract acceptance tests (AUTHORING_CONTRACT.md): the nutshell validator, the
// per-concept audit (four artifacts + breadth), and the mechanical proof that no sealed item is
// reachable from a practice path (assembleSet), even when the bank contains sealed items.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateNutshell, auditConcept, isSealed, practicePool, sealedPool, sealedLeaks, FLOOR_TOTAL,
} from '../src/engine/authoring.js';
import { assembleSet } from '../src/engine/sets.js';
import { makeRng } from '../src/engine/rng.js';

// ── nutshell: exactly one formula OR one statement, nothing longer ──
test('nutshell accepts a single formula', () => {
  assert.equal(validateNutshell('Assets = Capital + Liabilities').ok, true);
  assert.equal(validateNutshell('(cost − residual value) ÷ useful life').ok, true);
  assert.equal(validateNutshell('Current ratio = current assets ÷ current liabilities').ok, true);
});

test('nutshell accepts a single statement', () => {
  assert.equal(validateNutshell('Inventory is carried at the lower of cost and net realisable value').ok, true);
  assert.equal(validateNutshell('Depreciation spreads an asset’s cost over the years it serves.').ok, true);
});

test('nutshell rejects two statements, a list, multiple lines, over-length, and absence', () => {
  assert.equal(validateNutshell('Depreciation spreads cost. It is not a valuation.').ok, false);
  assert.equal(validateNutshell('cost; residual; life').ok, false);
  assert.equal(validateNutshell('line one\nline two').ok, false);
  assert.equal(validateNutshell('x'.repeat(201)).ok, false);
  assert.equal(validateNutshell('   ').ok, false);
  assert.equal(validateNutshell(undefined).reason, 'absent');
});

// ── sealed pool split ──
const item = (id, rung, conceptId = 'FA-04') => ({
  id, conceptIds: [conceptId], rung, marks: 1, stem: id,
  options: [{ id: 'a', text: 'x' }, { id: 'b', text: 'y' }, { id: 'c', text: 'z' }],
  answerId: 'a', distractors: { b: 'knowledge_gap' },
});

test('practicePool excludes sealed; sealedPool selects it', () => {
  const items = [item('i1', 'concept-check'), item('i2', 'standard'), item('s1', 'sealed')];
  assert.equal(practicePool(items).length, 2);
  assert.deepEqual(sealedPool(items).map((i) => i.id), ['s1']);
  assert.equal(isSealed(item('s2', 'sealed')), true);
});

// ── the mechanical invariant: assembleSet never serves a sealed item ──
test('assembleSet never serves a sealed item, even when the bank contains sealed items', () => {
  // A bank of practice items across two areas, plus sealed items tagged to the same concepts.
  const bank = [];
  for (let i = 0; i < 12; i += 1) bank.push(item(`p${i}`, ['concept-check', 'guided', 'standard', 'stretch'][i % 4], `FA-0${i % 3}`));
  for (let i = 0; i < 6; i += 1) bank.push(item(`SEAL${i}`, 'sealed', `FA-0${i % 3}`));

  const areaOf = (it) => it.conceptIds[0].slice(-1); // fake area letter from concept id
  let sawSealed = 0;
  for (const seed of [1, 2, 7, 13, 42, 99, 123, 777]) {
    const { items: served } = assembleSet(bank, {
      rng: makeRng(seed), size: 10, areaOf, areaWeights: { 0: 1, 1: 1, 2: 1 },
    });
    sawSealed += sealedLeaks(served).length;
  }
  assert.equal(sawSealed, 0);
});

// ── per-concept audit ──
const fullSet = (conceptId) => [
  ...[0, 1, 2].map((i) => item(`${conceptId}-cc${i}`, 'concept-check', conceptId)),
  ...[0, 1, 2].map((i) => item(`${conceptId}-g${i}`, 'guided', conceptId)),
  ...[0, 1, 2].map((i) => item(`${conceptId}-s${i}`, 'standard', conceptId)),
  item(`${conceptId}-st0`, 'stretch', conceptId),
];

test('a concept missing nutshell and sealed is reported as not accepted, with a precise gap list', () => {
  const a = auditConcept({
    conceptId: 'FA-04',
    lesson: { conceptId: 'FA-04' }, // no nutshell field
    items: fullSet('FA-04'),
    lessonShape: 'theory',
    paperFullyAuthored: false,
  });
  assert.equal(a.accepted, false);
  assert.equal(a.hasLesson, true);
  assert.equal(a.sealedCount, 0);
  assert.ok(a.missing.includes('nutshell:absent'));
  assert.ok(a.missing.includes('sealed:0/1'));
});

test('a fully-contract-compliant concept is accepted', () => {
  const items = [...fullSet('FA-04'), item('FA-04-SEAL', 'sealed', 'FA-04')];
  const a = auditConcept({
    conceptId: 'FA-04',
    lesson: { conceptId: 'FA-04', nutshell: 'Assets = Capital + Liabilities' },
    items,
    lessonShape: 'theory',
    paperFullyAuthored: false,
  });
  assert.deepEqual(a.missing, []);
  assert.equal(a.accepted, true);
  assert.equal(a.sealedCount, 1);
});

test('an over-floor set flags depth-before-breadth while its paper is unfinished, not once finished', () => {
  const items = [...fullSet('FA-04'), item('FA-04-sX', 'standard', 'FA-04'), item('FA-04-SEAL', 'sealed', 'FA-04')];
  const lesson = { conceptId: 'FA-04', nutshell: 'Assets = Capital + Liabilities' };
  const unfinished = auditConcept({ conceptId: 'FA-04', lesson, items, lessonShape: 'theory', paperFullyAuthored: false });
  assert.equal(unfinished.overFloorBy, 1);
  assert.equal(unfinished.breadthViolation, true);
  assert.ok(unfinished.missing.some((m) => m.startsWith('depth-before-breadth')));

  const finished = auditConcept({ conceptId: 'FA-04', lesson, items, lessonShape: 'theory', paperFullyAuthored: true });
  assert.equal(finished.breadthViolation, false);
  assert.equal(finished.accepted, true); // over-floor is allowed once breadth is met
});

test('FLOOR_TOTAL is the cc3/g3/s3/st1 sum', () => {
  assert.equal(FLOOR_TOTAL, 10);
});
