// store.js — persistence for learner state, split by size and growth pattern.
//
// Measured: a full attempt record is ~276 bytes, and Chrome's localStorage caps this origin at
// ~5 MB (writes fail past ~15–20k attempts). The attempt log is the single source of truth and
// only grows, so it CANNOT live in localStorage for a multi-year, retention-forever system.
//
// Therefore:
//   - the ATTEMPT LOG lives in IndexedDB (large budget, and appended one record at a time rather
//     than rewriting a growing blob on every save);
//   - the small META (schema, createdAt, streak, v1 history) lives in localStorage, cheap to
//     rewrite.
//
// Everything uses the DISTINCTIVE, versioned namespace 'papertrail:v4:' / DB 'papertrail-v4'.
// This matters because GitHub Pages storage is keyed to the ORIGIN (kimutaijeremy.github.io),
// shared across every project there — a generic prefix could collide with a future project.
//
// The engine core never imports this file; derivation runs on an in-memory AttemptLog. Storage
// is a thin adapter, so the same engine runs under Node (MemoryLogAdapter) and in the browser
// PWA (IdbLogAdapter). Async is confined to the log adapter; meta reads/writes stay synchronous.

import { normaliseRecord } from './log.js';
import { normaliseFlag } from './flags.js';

export const KEY_PREFIX = 'papertrail:v4:';
export const KEYS = Object.freeze({
  META: KEY_PREFIX + 'meta',
  META_BACKUP: KEY_PREFIX + 'meta_backup',
});
export const STATE_SCHEMA = 'paper-trail/v4';
export const DB_NAME = 'papertrail-v4';
export const LOG_STORE = 'attempts';

// ── KV (localStorage) for META ──────────────────────────────────────────────

export class MemoryStore {
  constructor(initial = {}) { this.map = new Map(Object.entries(initial)); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

/** The browser localStorage, or a MemoryStore fallback (Node/tests). */
export function defaultKV() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return new MemoryStore();
}

/** True if an error is a browser storage-quota failure. */
export function isQuotaError(err) {
  if (!err) return false;
  return err.name === 'QuotaExceededError'
    || err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || err.code === 22 || err.code === 1014;
}

/** A blank full-state blob — the shape of the one-tap export (meta + log together). */
export function emptyState() {
  return {
    schema: STATE_SCHEMA,
    createdAt: null,
    streak: { cur: 0, best: 0 },
    v1History: null,
    flags: [], // Jeremy's error-finder review queue (Order §7) — small, rides in meta
    sets: [], // set-of-ten results: session feedback + rolling average (Amendment A6). Small, in meta.
    teachUses: [], // "Teach Me This" usage log (Amendment A6, §7A) — thin-topic signal. Small, in meta.
    attemptLog: [],
  };
}

/** The small meta half of a state (everything except the attempt log). */
export function metaOf(state) {
  return {
    schema: state.schema, createdAt: state.createdAt,
    streak: state.streak, v1History: state.v1History,
    flags: state.flags ?? [],
    sets: state.sets ?? [],
    teachUses: state.teachUses ?? [],
  };
}

export function loadMeta(kv = defaultKV()) {
  const raw = kv.getItem(KEYS.META);
  if (raw == null) return null;
  try {
    const m = JSON.parse(raw);
    return m && m.schema === STATE_SCHEMA ? m : null;
  } catch { return null; }
}

export function saveMeta(meta, kv = defaultKV()) {
  if (!meta || meta.schema !== STATE_SCHEMA) {
    throw new Error('refusing to save meta that is not ' + STATE_SCHEMA);
  }
  kv.setItem(KEYS.META, JSON.stringify(metaOf(meta)));
  return meta;
}

/**
 * Persist meta, reporting failure instead of swallowing it. Meta is tiny, so quota failure here
 * is unlikely — but we still never fail silently, so the UI can warn + prompt an export.
 * @returns {{ ok: true } | { ok: false, quota: boolean, error: Error }}
 */
export function trySaveMeta(meta, kv = defaultKV()) {
  try { saveMeta(meta, kv); return { ok: true }; }
  catch (error) { return { ok: false, quota: isQuotaError(error), error }; }
}

// ── Log adapters (async) ────────────────────────────────────────────────────
// Interface: appendMany(records) → Promise, readAll() → Promise<records[]>, clear() → Promise.

/** In-memory adapter for Node and tests. */
export class MemoryLogAdapter {
  constructor(records = []) { this.records = records.slice(); }
  async appendMany(records) { for (const r of records) this.records.push(r); }
  async readAll() { return this.records.slice(); }
  async clear() { this.records = []; }
}

/** IndexedDB adapter — the real browser store. Appends one keyed record at a time. */
export class IdbLogAdapter {
  constructor(dbName = DB_NAME, storeName = LOG_STORE) {
    this.dbName = dbName; this.storeName = storeName; this._db = null;
  }
  async _open() {
    if (this._db) return this._db;
    this._db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this._db;
  }
  async _tx(mode, fn) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, mode);
      const store = tx.objectStore(this.storeName);
      let result;
      Promise.resolve(fn(store)).then((r) => { result = r; }).catch(reject);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  async appendMany(records) {
    return this._tx('readwrite', (store) => { for (const r of records) store.put(r); });
  }
  async readAll() {
    return this._tx('readonly', (store) => new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  }
  async clear() {
    return this._tx('readwrite', (store) => store.clear());
  }
  /** Close the connection (so a later indexedDB.deleteDatabase won't block). */
  close() {
    if (this._db) { this._db.close(); this._db = null; }
  }
}

/** IndexedDB adapter in the browser, MemoryLogAdapter otherwise. */
export function defaultLogAdapter() {
  if (typeof globalThis !== 'undefined' && globalThis.indexedDB) return new IdbLogAdapter();
  return new MemoryLogAdapter();
}

// ── LearnerStore: the one object the app talks to ───────────────────────────

/**
 * Ties the meta half (localStorage) and the log half (IndexedDB) together. The attempt log stays
 * the single source of truth; meta is only streak + read-only v1 history + schema/date.
 *
 * A persistence-failure HANDLER is mandatory: the store refuses to construct without one, and it
 * is CALLED (not merely returned) whenever a write fails — quota exceeded, storage disabled, an
 * IndexedDB error. This is the wiring that makes it impossible for a future UI to silently drop a
 * failed save: to use the store at all, you must register what happens when a write fails, and the
 * intended handler warns the learner and prompts a one-tap export (Brief §6.9).
 */
export class LearnerStore {
  constructor({ logAdapter, kv, onPersistenceError } = {}) {
    if (typeof onPersistenceError !== 'function') {
      throw new Error(
        'LearnerStore requires an onPersistenceError(info) handler — a failed write must never be '
        + 'silently dropped. Register one that warns the learner and prompts an export.',
      );
    }
    this.log = logAdapter ?? defaultLogAdapter();
    this.kv = kv ?? defaultKV();
    this.onPersistenceError = onPersistenceError;
  }

  loadMeta() { return loadMeta(this.kv); }

  /** Append a one-tap content flag to the review queue (rides in meta, exports with everything). */
  addFlag(rawFlag) {
    const flag = normaliseFlag(rawFlag);
    const meta = this.loadMeta() ?? emptyState();
    meta.flags = [...(meta.flags ?? []), flag];
    const res = this.saveMeta(meta);
    return res.ok ? flag : null;
  }

  /** All flags in learner state (the review queue). */
  flags() {
    return this.loadMeta()?.flags ?? [];
  }

  /** Record a finished set-of-ten result (session feedback + rolling average, Amendment A6). */
  addSetResult(result) {
    const meta = this.loadMeta() ?? emptyState();
    meta.sets = [...(meta.sets ?? []), result];
    const res = this.saveMeta(meta);
    return res.ok ? result : null;
  }

  /** All recorded set results. */
  setResults() { return this.loadMeta()?.sets ?? []; }

  /** Record a "Teach Me This" use (thin-topic signal, Amendment A6 §7A). */
  addTeachUse(use) {
    const meta = this.loadMeta() ?? emptyState();
    meta.teachUses = [...(meta.teachUses ?? []), use];
    const res = this.saveMeta(meta);
    return res.ok ? use : null;
  }

  /** All recorded Teach Me uses. */
  teachUses() { return this.loadMeta()?.teachUses ?? []; }

  saveMeta(meta) {
    const res = trySaveMeta(meta, this.kv);
    if (!res.ok) this.onPersistenceError({ op: 'saveMeta', quota: res.quota, error: res.error });
    return res;
  }

  /** Append attempt/lesson records (normalised + validated) to the log. */
  async appendRecords(rawRecords) {
    const recs = rawRecords.map(normaliseRecord);
    try {
      await this.log.appendMany(recs);
    } catch (error) {
      // A failed append means the attempt was not persisted — the loudest possible failure.
      this.onPersistenceError({ op: 'appendRecords', quota: isQuotaError(error), error });
      throw error;
    }
    return recs;
  }

  /** All log records, chronologically-sortable array (feed straight into new AttemptLog(...)). */
  async readLogRecords() { return this.log.readAll(); }

  async clearLog() { return this.log.clear(); }

  /** The one-tap export blob: meta + the full attempt log in one JSON object. */
  async exportAll() {
    const meta = this.loadMeta() ?? emptyState();
    const attemptLog = await this.readLogRecords();
    return { ...metaOf(meta), attemptLog };
  }

  /** Import a blob (from exportAll): replace meta and the whole log. */
  async importAll(blob) {
    if (!blob || blob.schema !== STATE_SCHEMA) throw new Error('not a ' + STATE_SCHEMA + ' export');
    this.saveMeta(blob);
    await this.clearLog();
    await this.appendRecords(blob.attemptLog ?? []);
    return blob;
  }
}

/**
 * Read a v3 export straight from the live app's own localStorage keys, reconstructing the same
 * bundle the v3 exporter produces. Used at cutover to migrate in place. Returns null if absent.
 */
export function readV3FromStore(kv = defaultKV()) {
  const get = (k, f) => {
    const raw = kv.getItem(k);
    if (raw == null) return f;
    try { return JSON.parse(raw); } catch { return f; }
  };
  if (kv.getItem('pt_stats') == null && kv.getItem('pt_nodes') == null) return null;
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
