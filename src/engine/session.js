// session.js — the practice session as a persisted, resumable object (Brief Amendment 01, clause E).
//
// A session is a plain, serialisable object carrying a POSITION INDEX into an ordered set of items.
// Everything here is pure: each operation returns a NEW session, so the persisted object is the only
// state and "where am I in this set" is always answerable from it.
//
// Clause E, in four guarantees this module enforces structurally:
//   1. Session state is a persisted object with a position index          (createSession / position)
//   2. Every teaching surface opens as an OVERLAY, never a route change    (openOverlay / closeOverlay
//        return a session with position and responses UNCHANGED)
//   3. Resume returns to question n+1 — the next unanswered item           (resume)
//   4. A control that restarts a set is never labelled as continuing one   (restart vs resume;
//        CONTROL_LABELS, assertControlLabelsHonest)
//
// SCOPE: clause E only. This module does NOT assemble Section A/B sets (clauses B–D), decide what a
// miss reveals (clause F), escalate to a lesson (clause G), pick items for freshness (clause H), or
// name storage keys (clause I). It takes an already-ordered list of item ids and manages movement,
// overlays and persistence over it. `kind` is recorded verbatim and acted on by no one here.

export const SESSION_SCHEMA = 'paper-trail/session/v1';

export const SESSION_STATUS = Object.freeze({ ACTIVE: 'active', COMPLETE: 'complete' });

// The teaching surfaces a set can open. Each is an OVERLAY over the running set — opening one never
// changes position. (Which surface a miss opens is clause F/G, deferred; this only models "open one".)
export const OVERLAY_SURFACES = Object.freeze({
  NUTSHELL: 'nutshell',
  GO_DEEPER: 'goDeeper',
  LESSON: 'lesson',
});
const OVERLAY_VALUES = new Set(Object.values(OVERLAY_SURFACES));

// Fixed control labels. `restart` must never read as a continuation — that was the v3.1 bug: a
// "restart" control presented as if it resumed. assertControlLabelsHonest() makes that impossible to
// ship silently, and a test asserts it.
export const CONTROL_LABELS = Object.freeze({
  resume: 'Resume',
  restart: 'Start over',
});
const CONTINUE_WORDS = /\b(resume|continue|carry on|keep going|pick up)\b/i;

/** Deep clone of a plain session object. Sessions are JSON data, so this is exact. */
function clone(session) {
  return structuredClone(session);
}

function computeStatus(itemIds, position) {
  return position >= itemIds.length ? SESSION_STATUS.COMPLETE : SESSION_STATUS.ACTIVE;
}

/**
 * Start a fresh session over an ordered list of item ids.
 * @param {{ id?:string, paperId:string, kind?:string, itemIds:string[], now?:number }} spec
 */
export function createSession({ id, paperId, kind = 'drill', itemIds, now = Date.now() } = {}) {
  if (!paperId || typeof paperId !== 'string') throw new Error('createSession: paperId required');
  if (!Array.isArray(itemIds)) throw new Error('createSession: itemIds must be an array');
  const ids = itemIds.map(String);
  return {
    schema: SESSION_SCHEMA,
    id: id ?? `sess-${now}-${Math.random().toString(36).slice(2, 8)}`,
    paperId,
    kind,
    itemIds: ids,
    position: 0, // index of the CURRENT (next-unanswered) item; invariant: position === responses.length
    responses: [],
    overlay: null,
    status: computeStatus(ids, 0),
    startedAt: now,
    updatedAt: now,
  };
}

/** True once every item has been answered. */
export function isComplete(session) {
  return session.status === SESSION_STATUS.COMPLETE;
}

/** The id of the current (next-unanswered) item, or null if the set is complete. */
export function currentItemId(session) {
  return isComplete(session) ? null : session.itemIds[session.position];
}

/**
 * Where a returning learner lands: question n+1, the next unanswered item. Pure — it never mutates
 * and never resets. This is RESUME, and it is a different operation from restart().
 * @returns {{ done:boolean, position:number, itemId:(string|null) }}
 */
export function resume(session) {
  if (isComplete(session)) return { done: true, position: session.position, itemId: null };
  return { done: false, position: session.position, itemId: session.itemIds[session.position] };
}

/**
 * Answer the current item and advance to the next. Returns a NEW session. The overlay is left as the
 * caller set it (answering the set is independent of any open teaching surface).
 * @param {object} session
 * @param {object} response - caller's record for this item (itemId is stamped from position)
 * @param {number} [now]
 */
export function answerCurrent(session, response = {}, now = Date.now()) {
  if (isComplete(session)) throw new Error('answerCurrent: the set is already complete');
  const next = clone(session);
  const itemId = session.itemIds[session.position];
  next.responses.push({ ...response, itemId });
  next.position += 1;
  next.status = computeStatus(next.itemIds, next.position);
  next.updatedAt = now;
  return next;
}

/**
 * Open a teaching surface as an OVERLAY over the running set. Returns a NEW session whose position,
 * responses and status are UNCHANGED — opening the nutshell / go-deeper / lesson is never a route
 * change and never advances or resets the set. This is the structural half of clause E's overlay rule.
 */
export function openOverlay(session, surface, ref = null, now = Date.now()) {
  if (!OVERLAY_VALUES.has(surface)) {
    throw new Error(`openOverlay: unknown teaching surface '${surface}'`);
  }
  const next = clone(session);
  next.overlay = { surface, ref };
  next.updatedAt = now;
  // position, responses, status deliberately untouched.
  return next;
}

/** Close whatever overlay is open. Position and responses are, again, untouched. */
export function closeOverlay(session, now = Date.now()) {
  const next = clone(session);
  next.overlay = null;
  next.updatedAt = now;
  return next;
}

/** True if a teaching surface is currently overlaid on the set. */
export function overlayOpen(session) {
  return session.overlay != null;
}

/**
 * Begin the SAME set again from question one. Returns a NEW session at position 0 with no responses.
 * This is RESTART — deliberately a separate function from resume(), so a "restart" control can never
 * be wired to the resume path.
 */
export function restart(session, now = Date.now()) {
  return createSession({ paperId: session.paperId, kind: session.kind, itemIds: session.itemIds, now });
}

/** The honest label for a session control ('resume' | 'restart'). */
export function labelFor(action) {
  const label = CONTROL_LABELS[action];
  if (!label) throw new Error(`labelFor: unknown control '${action}'`);
  return label;
}

/**
 * Guard the v3.1 bug out of existence: resume and restart must have distinct labels, and the restart
 * control must not read as a continuation. Throws if the labels are ever set dishonestly. Called by
 * the test suite; safe to call at startup too.
 */
export function assertControlLabelsHonest() {
  const { resume: r, restart: s } = CONTROL_LABELS;
  if (r === s) throw new Error('resume and restart must not share a label');
  if (CONTINUE_WORDS.test(s)) {
    throw new Error(`restart control must not be labelled as continuing a set: '${s}'`);
  }
  return true;
}

// ── Persistence helpers ─────────────────────────────────────────────────────
// A session is small and rides in meta (like flags/sets/deeperOpens), so it survives an app restart
// and exports with everything. These thin wrappers use LearnerStore's meta helpers.

/** Persist the active session. @returns the store's save result. */
export function saveSession(store, session) {
  return store.saveSession(session);
}

/** Load the persisted session, or null. */
export function loadSession(store) {
  return store.loadSession();
}

/** Round-trip serialisation (identity for plain sessions; a seam if the shape ever needs migrating). */
export function toJSON(session) {
  return clone(session);
}
export function fromJSON(obj) {
  if (!obj || obj.schema !== SESSION_SCHEMA) throw new Error('not a ' + SESSION_SCHEMA + ' session');
  return clone(obj);
}
