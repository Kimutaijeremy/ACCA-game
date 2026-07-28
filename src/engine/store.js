// store.js — persistence for learner state.
//
// The new engine keeps its state under a DISTINCTIVE, app-specific, versioned namespace
// ('papertrail:v4:*'). This matters because browser storage on GitHub Pages is keyed to the
// ORIGIN (kimutaijeremy.github.io), not the path — every project served from that account
// shares one localStorage. A generic prefix could collide with a future project; the fully
// spelled-out 'papertrail:v4:' cannot.
//
// It is also completely separate from the v3 app's keys ('pt_stats', 'pt_nodes', ...), so the
// migration (Brief §3, §7) reads the v3 keys but never overwrites them: Jeremy's original
// learning history stays intact on his phone and rollback is trivial.
//
// A KV store is any object with getItem(k)/setItem(k,v)/removeItem(k) returning/accepting
// strings — browser localStorage satisfies this directly; MemoryStore covers Node and tests.

export const KEY_PREFIX = 'papertrail:v4:';

export const KEYS = Object.freeze({
  STATE: KEY_PREFIX + 'state',
  BACKUP: KEY_PREFIX + 'state_backup',
});

export const STATE_SCHEMA = 'paper-trail/v4';

export class MemoryStore {
  constructor(initial = {}) {
    this.map = new Map(Object.entries(initial));
  }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

/** Return the browser localStorage, or a MemoryStore fallback when unavailable. */
export function defaultStore() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return new MemoryStore();
}

/** A blank learner-state object. The attempt log is the single source of truth; everything
 *  else here is either raw history (streak, v1History) or metadata. */
export function emptyState() {
  return {
    schema: STATE_SCHEMA,
    createdAt: null,
    streak: { cur: 0, best: 0 },
    v1History: null, // populated by migration; read-only "v1 history" panel
    attemptLog: [], // canonical event list (see log.js)
  };
}

export function loadState(store = defaultStore()) {
  const raw = store.getItem(KEYS.STATE);
  if (raw == null) return null;
  try {
    const s = JSON.parse(raw);
    if (s && s.schema === STATE_SCHEMA) return s;
    return null;
  } catch {
    return null;
  }
}

export function saveState(state, store = defaultStore()) {
  if (!state || state.schema !== STATE_SCHEMA) {
    throw new Error('refusing to save a state that is not ' + STATE_SCHEMA);
  }
  store.setItem(KEYS.STATE, JSON.stringify(state));
  return state;
}

/**
 * True if an error looks like a browser storage-quota failure. localStorage throws
 * QuotaExceededError (name, or legacy code 22 / Firefox code 1014) when a write won't fit.
 */
export function isQuotaError(err) {
  if (!err) return false;
  return err.name === 'QuotaExceededError'
    || err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || err.code === 22 || err.code === 1014;
}

/**
 * Persist state, reporting failure instead of throwing or swallowing it. A write can fail when
 * the browser's storage quota is exceeded or storage is disabled. We NEVER fail silently: the
 * caller gets { ok:false, ... } so the UI can warn the learner and prompt an export. (Eviction —
 * the OS clearing storage later — cannot be caught at write time; the guard for that is the
 * one-tap export + off-device backup, Brief §6.9.)
 * @returns {{ ok: true } | { ok: false, quota: boolean, error: Error }}
 */
export function trySaveState(state, store = defaultStore()) {
  try {
    saveState(state, store);
    return { ok: true };
  } catch (error) {
    return { ok: false, quota: isQuotaError(error), error };
  }
}

/**
 * Read a v3 export straight from the live app's own localStorage keys, reconstructing the
 * same bundle the v3 exporter produces. Used at cutover to migrate in place without an
 * export/import round-trip. Returns null if no v3 data is present.
 */
export function readV3FromStore(store = defaultStore()) {
  const get = (k, f) => {
    const raw = store.getItem(k);
    if (raw == null) return f;
    try { return JSON.parse(raw); } catch { return f; }
  };
  if (store.getItem('pt_stats') == null && store.getItem('pt_nodes') == null) return null;
  return {
    v: 3,
    stats: get('pt_stats', {}),
    streak: get('pt_streak', { cur: 0, best: 0 }),
    nodes: get('pt_nodes', {}),
    custom: get('pt_custom', []),
    papers: get('pt_papers', {}),
    cr: get('pt_cr', {}),
    packs: get('pt_packs', []),
    ethics: get('pt_ethics', false),
  };
}
