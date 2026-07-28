// The WP1 gate test: drive one concept through all five states, then back down via decay.
// Every assertion reads state that was DERIVED from the attempt log — nothing is set directly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AttemptLog } from '../src/engine/log.js';
import { deriveConcept, deriveAll } from '../src/engine/derive.js';
import { STATE } from '../src/engine/states.js';
import { item, lesson, resetSeq, DAY } from './helpers.js';

const C = 'FA-26'; // "Depreciation methods and the annual charge"

// Fold up to a given point and read the concept's state at `now`.
function stateOf(records, now) {
  const log = new AttemptLog(records);
  return deriveConcept(log, C, now).state;
}

test('a concept climbs Unvisited → Exposed → Understood → Practised → Competent → Mastered', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1, 9, 0, 0); // fixed base time
  const recs = [];

  // Unvisited: nothing logged yet.
  assert.equal(stateOf(recs, t0).valueOf(), STATE.UNVISITED);

  // Exposed: complete the lesson section.
  recs.push(lesson(C, { t: t0 }));
  assert.equal(stateOf(recs, t0), STATE.EXPOSED);

  // Understood: concept-check set passed — 3 unscaffolded, at least 2 correct.
  recs.push(item(C, 'concept-check', true, { t: t0 + 1 * 60000 }));
  recs.push(item(C, 'concept-check', false, { t: t0 + 2 * 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 3 * 60000 }));
  assert.equal(stateOf(recs, t0 + 4 * 60000), STATE.UNDERSTOOD);

  // Practised: at least 3 guided applications correct (hints permitted).
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 5 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 6 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 7 * 60000 }));
  assert.equal(stateOf(recs, t0 + 8 * 60000), STATE.PRACTISED);

  // Competent: last 5 unscaffolded Standard items at 80%+, all within budget, no hints.
  for (let i = 0; i < 5; i++) {
    recs.push(item(C, 'standard', true, { withinBudget: true, t: t0 + (10 + i) * 60000 }));
  }
  assert.equal(stateOf(recs, t0 + 16 * 60000), STATE.COMPETENT);

  // Mastered: 80%+ on Stretch/Integrated, incl. a mixed-topic and a timed appearance,
  // across two sessions separated by 72+ hours.
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sA', t: t0 + 20 * 60000 }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sA', t: t0 + 21 * 60000 }));
  // second session, more than 72h later
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sB', t: t0 + 4 * DAY }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sB', t: t0 + 4 * DAY + 60000 }));
  assert.equal(stateOf(recs, t0 + 4 * DAY + 2 * 60000), STATE.MASTERED);
});

test('a failed due review drops the concept one state and queues remediation', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1, 9, 0, 0);
  const recs = [];

  // Fast-path to Mastered (same construction as above).
  recs.push(lesson(C, { t: t0 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 2 * 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 3 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 4 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 5 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 6 * 60000 }));
  for (let i = 0; i < 5; i++) recs.push(item(C, 'standard', true, { withinBudget: true, t: t0 + (10 + i) * 60000 }));
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sA', t: t0 + 20 * 60000 }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sA', t: t0 + 21 * 60000 }));
  const tMastered = t0 + 4 * DAY;
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sB', t: tMastered }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sB', t: tMastered + 60000 }));

  // Entered Mastered → review due in 30 days. Fail it.
  const tFail1 = tMastered + 31 * DAY;
  recs.push(item(C, 'standard', false, { withinBudget: true, t: tFail1, cause: 'conceptual_misunderstanding' }));

  let d = deriveConcept(new AttemptLog(recs), C, tFail1 + 1);
  assert.equal(d.state, STATE.COMPETENT, 'Mastered → Competent on first failed review');
  assert.equal(d.reviewsFailed, 1);
  assert.equal(d.remediation.length, 1);
  assert.equal(d.remediation[0].reason, 'failed_review');
  assert.equal(d.remediation[0].cause, 'conceptual_misunderstanding');

  // The dropped level must be genuinely re-earned: the stale mastery evidence was cleared,
  // so the concept does not spring back to Mastered on the next read.
  assert.equal(d.evidence.masteryAttempts, 0, 'mastery window cleared on decay');

  // Keep failing due reviews: Competent → Practised → Understood → Exposed.
  const tFail2 = tFail1 + 15 * DAY; // Competent review interval is 14 days
  recs.push(item(C, 'standard', false, { withinBudget: true, t: tFail2 }));
  assert.equal(deriveConcept(new AttemptLog(recs), C, tFail2 + 1).state, STATE.PRACTISED);

  const tFail3 = tFail2 + 8 * DAY; // Practised review interval is 7 days
  recs.push(item(C, 'standard', false, { withinBudget: true, t: tFail3 }));
  assert.equal(deriveConcept(new AttemptLog(recs), C, tFail3 + 1).state, STATE.UNDERSTOOD);

  const tFail4 = tFail3 + 4 * DAY; // Understood review interval is 3 days
  recs.push(item(C, 'concept-check', false, { t: tFail4 }));
  const dEnd = deriveConcept(new AttemptLog(recs), C, tFail4 + 1);
  assert.equal(dEnd.state, STATE.EXPOSED, 'Understood → Exposed; no reviews below Understood');
  assert.equal(dEnd.reviewDueAt, null, 'Exposed schedules no further reviews');
  assert.equal(dEnd.reviewsFailed, 4);
  assert.equal(dEnd.remediation.length, 4);
});

test('a concept decays through pure neglect — no attempt logged, only time passing', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1, 9, 0, 0);
  const recs = [];
  // Climb to Mastered, then log NOTHING further.
  recs.push(lesson(C, { t: t0 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 2 * 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 3 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 4 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 5 * 60000 }));
  recs.push(item(C, 'guided', true, { scaffold: true, t: t0 + 6 * 60000 }));
  for (let i = 0; i < 5; i++) recs.push(item(C, 'standard', true, { withinBudget: true, t: t0 + (10 + i) * 60000 }));
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sA', t: t0 + 20 * 60000 }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sA', t: t0 + 21 * 60000 }));
  const tM = t0 + 4 * DAY; // second session, >72h later → Mastered here
  recs.push(item(C, 'stretch', true, { timed: true, session: 'sB', t: tM }));
  recs.push(item([C, 'FA-27'], 'integrated', true, { session: 'sB', t: tM + 60000 }));
  const log = new AttemptLog(recs);

  const masteredAt = tM + 60000;
  const dueAt = masteredAt + 30 * DAY; // Mastered review interval

  // Still Mastered while merely due but not yet overdue by a full further interval.
  assert.equal(deriveConcept(log, C, dueAt + 10 * DAY).state, STATE.MASTERED);
  assert.equal(deriveConcept(log, C, dueAt + 10 * DAY).due, true, 'due, but not yet decayed');

  // One full interval (30d) past due → drop to Competent (no attempt ever logged).
  const d1 = deriveConcept(log, C, dueAt + 31 * DAY);
  assert.equal(d1.state, STATE.COMPETENT);
  assert.equal(d1.reviewsMissed, 1);
  assert.equal(d1.remediation.at(-1).reason, 'neglect_decay');
  assert.equal(d1.evidence.masteryAttempts, 0, 'evidence for the lost state is wiped');

  // Far in the future with no study at all → all the way down to Exposed, never below.
  const dEnd = deriveConcept(log, C, dueAt + 400 * DAY);
  assert.equal(dEnd.state, STATE.EXPOSED);
  assert.equal(dEnd.due, false);
  assert.equal(dEnd.reviewDueAt, null, 'Exposed schedules no reviews, so decay halts there');
  assert.equal(dEnd.reviewsMissed, 4, 'Mastered → Competent → Practised → Understood → Exposed');
});

test('neglect decay is a function of (log, date): later date, lower state', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1);
  const recs = [
    lesson(C, { t: t0 }),
    item(C, 'concept-check', true, { t: t0 + 60000 }),
    item(C, 'concept-check', true, { t: t0 + 2 * 60000 }),
    item(C, 'concept-check', true, { t: t0 + 3 * 60000 }),
  ]; // Understood; review due 3 days out, interval 3 days
  const log = new AttemptLog(recs);
  const dueAt = t0 + 3 * 60000 + 3 * DAY;
  // within one further interval of grace: still Understood
  assert.equal(deriveConcept(log, C, dueAt + 2 * DAY).state, STATE.UNDERSTOOD);
  // more than one interval overdue → straight to Exposed (Understood has only Exposed below)
  assert.equal(deriveConcept(log, C, dueAt + 4 * DAY).state, STATE.EXPOSED);
});

test('a passed due review renews the interval without changing state', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1, 9, 0, 0);
  const recs = [];
  recs.push(lesson(C, { t: t0 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 2 * 60000 }));
  recs.push(item(C, 'concept-check', true, { t: t0 + 3 * 60000 }));
  // Understood → review due in 3 days. Pass it on day 4.
  const tReview = t0 + 4 * DAY;
  recs.push(item(C, 'concept-check', true, { t: tReview }));
  const d = deriveConcept(new AttemptLog(recs), C, tReview + 1);
  assert.equal(d.state, STATE.UNDERSTOOD, 'passing the review keeps the state');
  assert.equal(d.reviewsPassed, 1);
  assert.ok(d.reviewDueAt > tReview, 'the review interval was renewed forward');
});

test('a concept is due for review only once its scheduled time passes', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1, 9, 0, 0);
  const recs = [
    lesson(C, { t: t0 }),
    item(C, 'concept-check', true, { t: t0 + 60000 }),
    item(C, 'concept-check', true, { t: t0 + 2 * 60000 }),
    item(C, 'concept-check', true, { t: t0 + 3 * 60000 }),
  ];
  const log = new AttemptLog(recs);
  assert.equal(deriveConcept(log, C, t0 + 2 * DAY).due, false, 'not due before 3 days');
  assert.equal(deriveConcept(log, C, t0 + 4 * DAY).due, true, 'due after 3 days');
});

test('concept-checks alone do not promote without the lesson (ladder is strict)', () => {
  resetSeq();
  const t0 = 1_000_000;
  const recs = [
    item(C, 'concept-check', true, { t: t0 + 1 }),
    item(C, 'concept-check', true, { t: t0 + 2 }),
    item(C, 'concept-check', true, { t: t0 + 3 }),
  ];
  assert.equal(deriveConcept(new AttemptLog(recs), C, t0 + 10).state, STATE.UNVISITED);
});

test('deriveAll reports untouched concepts as Unvisited and lists the review queue', () => {
  resetSeq();
  const t0 = Date.UTC(2026, 6, 1);
  const recs = [
    lesson(C, { t: t0 }),
    item(C, 'concept-check', true, { t: t0 + 60000 }),
    item(C, 'concept-check', true, { t: t0 + 2 * 60000 }),
    item(C, 'concept-check', true, { t: t0 + 3 * 60000 }),
  ];
  const { states, reviewQueue } = deriveAll(new AttemptLog(recs), {
    now: t0 + 5 * DAY,
    conceptIds: [C, 'FA-01', 'FA-02'],
  });
  assert.equal(states.get('FA-01').state, STATE.UNVISITED);
  assert.equal(states.get(C).state, STATE.UNDERSTOOD);
  assert.equal(reviewQueue.length, 1);
  assert.equal(reviewQueue[0].conceptId, C);
});
