// log.js — the attempt log: the single source of truth (Brief §6.9).
//
// "Every state and every dashboard number derives from it. States are never written directly."
//
// The log is an append-only, chronologically-ordered list of events. Two kinds of event:
//   - 'lesson' : a concept's lesson section was completed (evidence for Exposed).
//   - 'item'   : an item was attempted (all other evidence, diagnosis, timing, review).
//
// This module defines the record shape, validates it, and provides pure append helpers.
// It does not derive state — that is derive.js.

import { RUNG_LIST } from './states.js';

// The seven diagnostic causes (Brief §6.5). 'untyped' is not a cause — it marks an item whose
// wrong options could not encode a specific cause, to be resolved by pattern inference.
export const CAUSES = Object.freeze([
  'knowledge_gap',
  'conceptual_misunderstanding',
  'calculation_error',
  'requirement_misread',
  'incorrect_treatment',
  'careless_slip',
  'transfer_failure',
]);

export const EVENT_KIND = Object.freeze({ LESSON: 'lesson', ITEM: 'item' });

/**
 * Validate a single attempt-log record. Throws on any violation — a malformed log would
 * corrupt every derived number, so we fail loudly at the boundary.
 * @param {object} r
 */
export function validateRecord(r) {
  if (!r || typeof r !== 'object') throw new Error('log record must be an object');
  if (!r.id || typeof r.id !== 'string') throw new Error('log record needs a string id');
  if (r.kind !== EVENT_KIND.LESSON && r.kind !== EVENT_KIND.ITEM) {
    throw new Error(`log record ${r.id}: kind must be 'lesson' or 'item'`);
  }
  if (!Array.isArray(r.conceptIds) || r.conceptIds.length === 0) {
    throw new Error(`log record ${r.id}: conceptIds must be a non-empty array`);
  }
  if (typeof r.sessionId !== 'string' || !r.sessionId) {
    throw new Error(`log record ${r.id}: sessionId required`);
  }
  if (!Number.isFinite(r.timestamp)) {
    throw new Error(`log record ${r.id}: timestamp (ms epoch) required`);
  }

  if (r.kind === EVENT_KIND.ITEM) {
    if (!RUNG_LIST.includes(r.rung)) {
      throw new Error(`log record ${r.id}: rung must be one of ${RUNG_LIST.join(', ')}`);
    }
    if (typeof r.correct !== 'boolean') {
      throw new Error(`log record ${r.id}: correct (boolean) required for item`);
    }
    if (r.scaffold != null && typeof r.scaffold !== 'boolean') {
      throw new Error(`log record ${r.id}: scaffold must be boolean`);
    }
    if (r.cause != null && !CAUSES.includes(r.cause)) {
      throw new Error(`log record ${r.id}: unknown diagnosed cause ${r.cause}`);
    }
    if (r.confidence != null && (r.confidence < 0 || r.confidence > 1)) {
      throw new Error(`log record ${r.id}: confidence must be in [0,1]`);
    }
  }
  return true;
}

/**
 * Normalise a raw record into the canonical shape with defaults filled in.
 * Callers (the app, tests) provide the meaningful fields; this fixes the rest.
 */
export function normaliseRecord(r) {
  validateRecord(r);
  const base = {
    id: r.id,
    kind: r.kind,
    conceptIds: [...r.conceptIds],
    itemId: r.itemId ?? null,
    sessionId: r.sessionId,
    timestamp: r.timestamp,
  };
  if (r.kind === EVENT_KIND.ITEM) {
    return {
      ...base,
      rung: r.rung,
      scaffold: r.scaffold ?? false,
      timeMs: Number.isFinite(r.timeMs) ? r.timeMs : null,
      withinBudget: r.withinBudget ?? null,
      timed: r.timed ?? false,
      correct: r.correct,
      distractor: r.distractor ?? null,
      cause: r.cause ?? null,
      confidence: Number.isFinite(r.confidence) ? r.confidence : null,
      review: r.review ?? false, // true if this item was served as a due-review probe
    };
  }
  return base; // lesson event
}

/**
 * An append-only attempt log. Keeps records sorted by timestamp (ties broken by insertion
 * order) so derivation is a straightforward chronological fold.
 */
export class AttemptLog {
  constructor(records = []) {
    this.records = [];
    this._seq = 0;
    for (const r of records) this.append(r);
  }

  append(raw) {
    const rec = normaliseRecord(raw);
    rec._seq = this._seq++;
    // Insert keeping chronological order. Appends are usually already in order (O(1) tail),
    // but we tolerate out-of-order inserts (e.g. an imported/merged log).
    const n = this.records.length;
    if (n === 0 || this._before(this.records[n - 1], rec) !== false) {
      this.records.push(rec);
    } else {
      let lo = 0, hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (this._before(this.records[mid], rec)) lo = mid + 1;
        else hi = mid;
      }
      this.records.splice(lo, 0, rec);
    }
    return rec;
  }

  // true if a strictly precedes b in chronological (then insertion) order
  _before(a, b) {
    if (a.timestamp !== b.timestamp) return a.timestamp < b.timestamp;
    return a._seq < b._seq;
  }

  /** Records touching a given concept, in chronological order. */
  forConcept(conceptId) {
    return this.records.filter((r) => r.conceptIds.includes(conceptId));
  }

  /** All records, chronological. */
  all() {
    return this.records;
  }

  size() {
    return this.records.length;
  }

  /** Plain-array snapshot for persistence (drops internal _seq). */
  toJSON() {
    return this.records.map(({ _seq, ...rest }) => rest);
  }
}
