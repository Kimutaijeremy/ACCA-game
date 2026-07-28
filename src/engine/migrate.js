// migrate.js — migrate Jeremy's v3 export into the new engine (Brief §7).
//
// THE RULE (§7): the v3 data carries no item ids, no concept tags, no timing and no scaffold
// flags. It therefore cannot satisfy any evidence rule in §6.2. We migrate it as HISTORY ONLY:
//   - preserve the streak (real, carries forward);
//   - preserve the three topic records with counts and timestamps as a read-only
//     "v1 history" panel, using their DISPLAY NAMES, never the FA1/FA2/FA3 keys;
//   - create ZERO concept states — every concept starts unvisited;
//   - the FA desk badge becomes a history line, not COMPLETE (a UI consequence of the above).
//
// This is a small, well-bounded job. It is NOT a general schema-mapping layer. It provides a
// dry run (plan only, no writes) and a rollback path, and tolerates a v3 file whose keys are
// missing or empty.

import { emptyState, saveState, loadState, KEYS, STATE_SCHEMA } from './store.js';

/** Natural sort for FA-style node keys: FA1, FA2, ... FA10. */
function faOrder(a, b) {
  const na = parseInt(a.replace(/^\D+/, ''), 10);
  const nb = parseInt(b.replace(/^\D+/, ''), 10);
  return na - nb;
}

/**
 * Build the migration plan from a v3 export object, without writing anything.
 * Pure and side-effect free — this is the dry run.
 *
 * @param {object} v3 - a v3 export (keys v, stats, streak, nodes, custom, papers, cr, packs, ethics)
 * @returns {{ ok: boolean, warnings: string[], newState: object, summary: object }}
 */
export function planMigration(v3) {
  const warnings = [];
  if (!v3 || typeof v3 !== 'object') {
    throw new Error('v3 export is not an object');
  }
  if (v3.v != null && v3.v !== 3) {
    warnings.push(`export version is ${v3.v}, expected 3 — proceeding as history-only anyway`);
  }

  // --- streak: real, carries forward ---
  const streakSrc = v3.streak && typeof v3.streak === 'object' ? v3.streak : {};
  const streak = {
    cur: Number.isFinite(streakSrc.cur) ? streakSrc.cur : 0,
    best: Number.isFinite(streakSrc.best) ? streakSrc.best : 0,
  };
  if (!v3.streak) warnings.push('no streak in export — defaulting to {cur:0, best:0}');

  // --- v1 history: topic records BY DISPLAY NAME, counts + best-effort timestamps ---
  const statEntries = v3.stats && typeof v3.stats === 'object' ? Object.entries(v3.stats) : [];
  if (statEntries.length === 0) warnings.push('no topic stats in export — v1 history will be empty');

  // Timestamps live on the FA* nodes (their keys are internal and must NEVER surface). We pair
  // them positionally with the display-named stat entries, in FA order, as a best effort.
  const faNodes = Object.entries(v3.nodes && typeof v3.nodes === 'object' ? v3.nodes : {})
    .filter(([k, val]) => /^FA\d+$/.test(k) && val && Number.isFinite(val.last))
    .sort((a, b) => faOrder(a[0], b[0]));

  const topics = statEntries.map(([name, st], i) => ({
    name, // display name only — internal keys never stored here
    seen: st && Number.isFinite(st.s) ? st.s : 0,
    correct: st && Number.isFinite(st.c) ? st.c : 0,
    lastAttemptAt: faNodes[i] ? faNodes[i][1].last : null,
  }));

  const totals = topics.reduce(
    (acc, t) => ({ seen: acc.seen + t.seen, correct: acc.correct + t.correct }),
    { seen: 0, correct: 0 },
  );

  const v1History = {
    migratedFrom: 'v3',
    migratedAt: null, // stamped at apply time
    note: 'Read-only history from the v1 app. It does not count toward mastery — every concept starts fresh.',
    topics,
    totals,
  };

  // --- new state: EMPTY attempt log → zero concept states ---
  const newState = emptyState();
  newState.streak = streak;
  newState.v1History = v1History;
  // attemptLog stays [] — no mastery is derived from v3 (THE RULE).

  const summary = {
    streak,
    topicCount: topics.length,
    totals,
    conceptStatesCreated: 0, // always zero
    droppedV3Keys: ['nodes.mastered flags', 'papers.passed flags', 'custom', 'cr', 'packs', 'ethics']
      .filter(() => true),
    note: 'v3 mastery/passed flags are intentionally not migrated (§7).',
  };

  return { ok: true, warnings, newState, summary };
}

/**
 * Apply the migration: write the new state, backing up any prior new-engine state so the
 * migration is reversible. The v3 keys are NOT touched.
 *
 * @param {object} v3
 * @param {object} store - KV store
 * @param {object} [opts]
 * @param {number} [opts.now] - timestamp to stamp migratedAt with
 * @returns {{ plan: object, applied: boolean, backedUp: boolean }}
 */
export function applyMigration(v3, store, opts = {}) {
  const now = opts.now ?? Date.now();
  const plan = planMigration(v3);

  // Back up any existing v4 state before overwriting, so rollback can restore it exactly.
  const prior = store.getItem(KEYS.STATE);
  let backedUp = false;
  if (prior != null) {
    store.setItem(KEYS.BACKUP, prior);
    backedUp = true;
  } else {
    store.removeItem(KEYS.BACKUP); // no prior state → backup means "there was nothing"
  }

  const state = plan.newState;
  state.createdAt = now;
  state.v1History.migratedAt = now;
  saveState(state, store);

  return { plan, applied: true, backedUp };
}

/**
 * Roll back the most recent migration: restore the backed-up prior state, or if there was no
 * prior state, remove the migrated state entirely. The v3 keys were never altered, so after
 * rollback the app is exactly as it was before the migration ran.
 *
 * @param {object} store
 * @returns {{ restored: boolean, hadBackup: boolean }}
 */
export function rollbackMigration(store) {
  const backup = store.getItem(KEYS.BACKUP);
  if (backup != null) {
    store.setItem(KEYS.STATE, backup);
    store.removeItem(KEYS.BACKUP);
    return { restored: true, hadBackup: true };
  }
  // No backup → the migration created state where there was none. Remove it.
  store.removeItem(KEYS.STATE);
  return { restored: true, hadBackup: false };
}

export { STATE_SCHEMA };
