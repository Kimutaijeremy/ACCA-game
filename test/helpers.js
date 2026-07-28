// Shared test helpers: terse builders for attempt-log records.
export const DAY = 24 * 60 * 60 * 1000;

let seq = 0;
export function resetSeq() { seq = 0; }

export function item(conceptId, rung, correct, opts = {}) {
  seq += 1;
  return {
    id: 'i' + seq,
    kind: 'item',
    itemId: opts.itemId ?? 'item-' + seq,
    conceptIds: Array.isArray(conceptId) ? conceptId : [conceptId],
    rung,
    correct,
    scaffold: opts.scaffold ?? false,
    withinBudget: opts.withinBudget ?? true,
    timed: opts.timed ?? false,
    timeMs: opts.timeMs ?? 30000,
    distractor: opts.distractor ?? null,
    cause: opts.cause ?? null,
    confidence: opts.confidence ?? null,
    sessionId: opts.session ?? 's1',
    timestamp: opts.t ?? seq * 1000,
  };
}

export function lesson(conceptId, opts = {}) {
  seq += 1;
  return {
    id: 'l' + seq,
    kind: 'lesson',
    conceptIds: Array.isArray(conceptId) ? conceptId : [conceptId],
    sessionId: opts.session ?? 's1',
    timestamp: opts.t ?? seq * 1000,
  };
}
