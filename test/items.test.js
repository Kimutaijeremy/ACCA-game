// Item-model tests (Brief §6.3–6.5, standing order §1 as amended): every authored concept is
// DONE (lesson + question set to the per-concept floor); every wrong option encodes a diagnostic
// cause the engine can read; parameterized generators regenerate valid instances; and the
// accounting-equation cap is honoured.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateItem, indexItems, instantiate, questionSetReport, itemsForAllocation,
  PER_CONCEPT_FLOORS, ITEM_CAPS,
} from '../src/engine/items.js';
import { CAUSES } from '../src/engine/log.js';
import { diagnose } from '../src/engine/diagnose.js';
import { makeRng } from '../src/engine/rng.js';
import {
  ALL_ITEMS, itemsForConcept, conceptComplete, conceptQuestionReport,
} from '../src/content/items/index.js';
import { ALL_LESSONS, LESSONS_BY_PAPER } from '../src/content/lessons/index.js';

test('every authored item validates, and ids are unique', () => {
  assert.ok(ALL_ITEMS.length >= 100);
  for (const it of ALL_ITEMS) assert.doesNotThrow(() => validateItem(it), `item ${it.id}`);
  assert.doesNotThrow(() => indexItems(ALL_ITEMS)); // rejects duplicate ids too
});

test('every distractor maps to a real diagnostic cause (feeds diagnose.js layer 1)', () => {
  for (const it of ALL_ITEMS) {
    if (typeof it.generate === 'function') continue; // generators checked separately
    for (const cause of Object.values(it.distractors ?? {})) {
      assert.ok(CAUSES.includes(cause), `item ${it.id}: bad cause ${cause}`);
    }
  }
});

test('choosing a tagged distractor yields that cause from the diagnosis engine', () => {
  // A standard-rung item with no prior attempts: layer-2 pattern inference stays silent, so the
  // engineered distractor is the sole diagnosis (layer 1).
  const item = ALL_ITEMS.find((i) => i.id === 'MA-06-S1'); // b -> incorrect_treatment
  const d = diagnose({
    attempt: { correct: false, rung: 'standard', distractor: 'b', itemId: item.id, conceptIds: ['MA-06'] },
    item: { distractors: item.distractors },
  });
  assert.equal(d.cause, 'incorrect_treatment');
  assert.equal(d.source, 'distractor');
});

test('every authored concept is DONE — lesson AND a question set meeting its floor', () => {
  for (const L of ALL_LESSONS) {
    assert.ok(conceptComplete(L.conceptId), `${L.conceptId} not done: ${conceptQuestionReport(L.conceptId).missing.join(', ')}`);
  }
});

test('the per-concept floor is enforced — dropping a rung fails the check', () => {
  const items = itemsForConcept('BT-01').filter((i) => i.rung !== 'stretch'); // remove the stretch item
  const r = questionSetReport('BT-01', items, { shape: 'theory' });
  assert.equal(r.complete, false);
  assert.ok(r.missing.some((m) => m.startsWith('stretch')));
});

test('calculation-shaped concepts include a parameterized generator', () => {
  for (const cid of ['MA-11', 'FA-26', 'FA-63', 'FA-11']) {
    const r = conceptQuestionReport(cid);
    assert.equal(r.needsParameterized, true, `${cid} should need a generator`);
    assert.equal(r.hasParameterized, true, `${cid} missing its generator`);
  }
});

test('parameterized generators produce a valid MCQ with a distinct correct option across seeds', () => {
  const gens = ALL_ITEMS.filter((i) => typeof i.generate === 'function');
  assert.ok(gens.length >= 4);
  for (const g of gens) {
    for (const seed of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]) {
      const inst = instantiate(g, seed);
      // answer exists
      assert.ok(inst.options.some((o) => o.id === inst.answerId), `${g.id}@${seed}: no answer option`);
      // option texts are distinct (no accidental duplicate numbers collapsing a distractor)
      const texts = new Set(inst.options.map((o) => o.text));
      assert.equal(texts.size, inst.options.length, `${g.id}@${seed}: duplicate option text`);
      // distractors reference real wrong options and real causes
      for (const [oid, cause] of Object.entries(inst.distractors)) {
        assert.notEqual(oid, inst.answerId, `${g.id}@${seed}: distractor is the answer`);
        assert.ok(CAUSES.includes(cause));
      }
    }
  }
});

test('the accounting-equation cap (Brief §6.4) is honoured: FA-05 has at most two PRACTICE items, plus its one sealed holdout, and is still DONE', () => {
  assert.equal(ITEM_CAPS['FA-05'], 2);
  const fa05 = itemsForConcept('FA-05');
  // The cap governs the PRACTICE bank (what can drown sets); the sealed holdout is a separate pool
  // and AUTHORING_CONTRACT.md still requires exactly one for every concept, FA-05 included.
  const practice = fa05.filter((i) => i.rung !== 'sealed');
  const sealed = fa05.filter((i) => i.rung === 'sealed');
  assert.ok(practice.length <= 2, 'FA-05 exceeds its two-item PRACTICE cap');
  assert.equal(sealed.length, 1, 'FA-05 still carries exactly one sealed holdout item');
  const r = conceptQuestionReport('FA-05');
  assert.equal(r.capped, true);
  assert.equal(r.complete, true, 'a capped concept with its set is done');
});

test('exceeding the cap fails the capped-concept check', () => {
  const three = [
    { id: 'X1', conceptIds: ['FA-05'], rung: 'concept-check', marks: 1 },
    { id: 'X2', conceptIds: ['FA-05'], rung: 'guided', marks: 1 },
    { id: 'X3', conceptIds: ['FA-05'], rung: 'standard', marks: 1 },
  ];
  const r = questionSetReport('FA-05', three, { shape: 'double-entry' });
  assert.equal(r.complete, false);
  assert.ok(r.missing.some((m) => m.includes('exceeds cap')));
});

test('a concept-check item may not carry scaffold; a broken generator fails at load', () => {
  assert.throws(() => validateItem({
    id: 'bad-cc', conceptIds: ['BT-01'], rung: 'concept-check', marks: 1,
    stem: 's', options: [{ id: 'a', text: 'a' }, { id: 'b', text: 'b' }, { id: 'c', text: 'c' }],
    answerId: 'a', scaffold: ['hint'],
  }), /unscaffolded/);
  assert.throws(() => validateItem({
    id: 'bad-gen', conceptIds: ['BT-01'], rung: 'standard', marks: 1,
    generate: () => ({ stem: 's', options: [{ id: 'a', text: 'a' }], answerId: 'a' }), // too few options
  }), /options/);
});

test('itemsForAllocation flattens to the paper-matrix shape', () => {
  const flat = itemsForAllocation(itemsForConcept('BT-04'));
  assert.ok(flat.length >= 10);
  for (const f of flat) {
    assert.ok(Array.isArray(f.conceptIds));
    assert.equal(typeof f.rung, 'string');
    assert.equal(typeof f.sealed, 'boolean');
  }
});

test('rng is deterministic for a given seed', () => {
  const a = makeRng(123); const b = makeRng(123);
  for (let i = 0; i < 20; i += 1) assert.equal(a.int(0, 1000), b.int(0, 1000));
});
