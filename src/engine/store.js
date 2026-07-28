// store.js — persistence for learner state.
//
// The new engine keeps its state under its OWN key namespace ('pt_v4_*'), completely separate
// from the v3 app's keys ('pt_stats', 'pt_nodes', ...). This is deliberate (Brief §3, §7):
// the migration reads the v3 keys but never overwrites them, so Jeremy's original learning
// history stays intact on his phone and rollback is trivial.
//
// A KV store is any object with getItem(k)/setItem(k,v)/removeItem(k) returning/accepting
// strings — browser localStorage satisfies this directly; MemoryStore covers Node and tests.

export const KEYS = Object.freeze({
  STATE: 'pt_v4_state',
  BACKUP: 'pt_v4_state_backup',
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
