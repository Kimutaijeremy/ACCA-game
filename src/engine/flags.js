// flags.js — Jeremy as the error-finder (Execution Order §7).
//
// A one-tap flag on any lesson or question — "this is wrong / this is confusing / this
// contradicts something" — writes to a review queue in learner state and exports with everything
// else. At the start of each session the flags in the exported review file are read and their
// targets fixed before any new authoring. This module defines the flag record and its validation;
// the store persists them (see store.js addFlag/flags), and the app surfaces the one-tap control.

export const FLAG_REASONS = Object.freeze(['wrong', 'confusing', 'contradiction']);
export const FLAG_TARGET_KINDS = Object.freeze(['lesson', 'item']);

/**
 * Validate a flag record. Throws on any violation.
 * A flag targets a lesson (by conceptId) or an item (by itemId), carries a reason, an optional
 * free-text note, a session id and a timestamp.
 */
export function validateFlag(f) {
  const bad = (m) => { throw new Error(`flag ${f?.id ?? '?'}: ${m}`); };
  if (!f || typeof f !== 'object') bad('not an object');
  if (!f.id || typeof f.id !== 'string') bad('id required');
  if (!f.target || !FLAG_TARGET_KINDS.includes(f.target.kind)) bad("target.kind must be 'lesson' or 'item'");
  if (f.target.kind === 'lesson' && !f.target.conceptId) bad('lesson flag needs target.conceptId');
  if (f.target.kind === 'item' && !f.target.itemId) bad('item flag needs target.itemId');
  if (!FLAG_REASONS.includes(f.reason)) bad(`reason must be one of ${FLAG_REASONS.join(', ')}`);
  if (f.note != null && typeof f.note !== 'string') bad('note must be a string');
  if (typeof f.sessionId !== 'string' || !f.sessionId) bad('sessionId required');
  if (!Number.isFinite(f.timestamp)) bad('timestamp required');
  return true;
}

/** Normalise a raw flag into the canonical shape (fills defaults). */
export function normaliseFlag(f) {
  validateFlag(f);
  return {
    id: f.id,
    target: { kind: f.target.kind, conceptId: f.target.conceptId ?? null, itemId: f.target.itemId ?? null },
    reason: f.reason,
    note: f.note ?? null,
    sessionId: f.sessionId,
    timestamp: f.timestamp,
    resolved: f.resolved ?? false,
  };
}

/** The open (unresolved) flags — the review queue that jumps ahead of new authoring. */
export function openFlags(flags = []) {
  return flags.filter((f) => !f.resolved);
}

/** Counts by reason, for BUILD_STATUS.md. */
export function flagCounts(flags = []) {
  const open = openFlags(flags);
  const byReason = Object.fromEntries(FLAG_REASONS.map((r) => [r, 0]));
  for (const f of open) byReason[f.reason] += 1;
  return { open: open.length, total: flags.length, byReason };
}
