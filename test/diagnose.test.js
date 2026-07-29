// Diagnosis-engine tests (Brief §6.5): the three layers, and the routing table.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnose, resolveProbe, REMEDIATION } from '../src/engine/diagnose.js';
import { CAUSES } from '../src/engine/log.js';

const wrong = (over = {}) => ({
  itemId: 'i1', conceptIds: ['FA-26'], rung: 'standard', correct: false,
  scaffold: false, timed: false, distractor: null, ...over,
});

test('layer 1: a tagged distractor IS the diagnosis (high confidence)', () => {
  const item = { distractors: { A: 'calculation_error', B: 'incorrect_treatment' } };
  const d = diagnose({ attempt: wrong({ distractor: 'A' }), item });
  assert.equal(d.cause, 'calculation_error');
  assert.equal(d.source, 'distractor');
  assert.ok(d.confidence >= 0.9);
  assert.equal(d.remediation.route, REMEDIATION.calculation_error.route);
});

test('layer 1 + layer 2 agree → highest confidence', () => {
  // wrong at concept-check (pattern → knowledge_gap) AND distractor tagged knowledge_gap
  const item = { distractors: { X: 'knowledge_gap' } };
  const d = diagnose({ attempt: wrong({ rung: 'concept-check', distractor: 'X' }), item });
  assert.equal(d.cause, 'knowledge_gap');
  assert.equal(d.agreement, 'agree');
  assert.ok(d.confidence >= 0.95);
});

test('layer 2 pattern: wrong at concept-check → knowledge gap', () => {
  const d = diagnose({ attempt: wrong({ rung: 'concept-check' }) });
  assert.equal(d.cause, 'knowledge_gap');
  assert.equal(d.source, 'pattern');
});

test('layer 2 pattern: right at guided, wrong at standard → conceptual', () => {
  const prior = [{ rung: 'guided', correct: true }];
  const d = diagnose({ attempt: wrong({ rung: 'standard' }), prior });
  assert.equal(d.cause, 'conceptual_misunderstanding');
  assert.equal(d.signal, 'guided_ok_standard_wrong');
});

test('layer 2 pattern: right in standard, wrong in mixed → transfer failure', () => {
  const prior = [{ rung: 'standard', correct: true }];
  const d = diagnose({ attempt: wrong({ rung: 'integrated' }), prior });
  assert.equal(d.cause, 'transfer_failure');
});

test('layer 2 pattern: right untimed, wrong timed → careless (exam conditions)', () => {
  const prior = [{ rung: 'standard', correct: true, timed: false }];
  const d = diagnose({ attempt: wrong({ rung: 'standard', timed: true }), prior });
  assert.equal(d.cause, 'careless_slip');
  assert.equal(d.signal, 'untimed_ok_timed_wrong');
});

test('layer 2 pattern: fast + wrong on a Competent concept → careless', () => {
  const d = diagnose({
    attempt: wrong({ rung: 'standard', timeMs: 5000 }),
    context: { conceptState: 'Competent', budgetMs: 24000 },
  });
  assert.equal(d.cause, 'careless_slip');
  assert.equal(d.signal, 'fast_wrong_when_competent');
});

test('conflict between layers → micro-probe, provisional conceptual-plus-practice (not a guess)', () => {
  // distractor says calculation_error; pattern (concept-check) says knowledge_gap
  const item = { distractors: { A: 'calculation_error' } };
  const d = diagnose({ attempt: wrong({ rung: 'concept-check', distractor: 'A' }), item });
  assert.equal(d.needsProbe, true);
  assert.equal(d.agreement, 'conflict');
  assert.equal(d.cause, 'conceptual_misunderstanding'); // safe default until the probe resolves
  assert.ok(d.confidence <= 0.4);
  assert.deepEqual(d.probe.candidates.sort(), ['calculation_error', 'knowledge_gap']);
});

test('both layers silent → micro-probe, default conceptual-plus-practice', () => {
  const item = { distractors: {}, untyped: true }; // untyped item, no distractor cause
  const d = diagnose({ attempt: wrong({ rung: 'guided', distractor: 'A' }), item });
  assert.equal(d.needsProbe, true);
  assert.equal(d.cause, 'conceptual_misunderstanding');
  assert.equal(d.source, 'default');
});

test('one micro-probe resolves the diagnosis at probe confidence', () => {
  const item = { distractors: {}, untyped: true };
  const d = diagnose({ attempt: wrong({ rung: 'guided' }), item });
  const resolved = resolveProbe(d, 'requirement_misread');
  assert.equal(resolved.cause, 'requirement_misread');
  assert.equal(resolved.source, 'probe');
  assert.equal(resolved.needsProbe, false);
  // an inconclusive probe keeps the safe default
  const still = resolveProbe(d, null);
  assert.equal(still.cause, 'conceptual_misunderstanding');
});

test('a correct attempt yields no diagnosis', () => {
  assert.equal(diagnose({ attempt: wrong({ correct: true }) }), null);
});

test('every cause has a remediation route (routing table complete)', () => {
  for (const c of CAUSES) {
    assert.ok(REMEDIATION[c] && REMEDIATION[c].route, `missing remediation for ${c}`);
  }
  // the careless slip route carries no content remediation, only a pacing flag
  assert.equal(REMEDIATION.careless_slip.contentRemediation, false);
});
