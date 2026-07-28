// index.js — the engine's public surface. Import from here.
//
// The engine core is pure and environment-agnostic: it operates on the concept graph and the
// attempt log, and derives everything else. Persistence and file loading are thin adapters
// (store.js, node-loader.js) so the same engine runs under Node tests and in the browser PWA.

export { loadGraph, ConceptGraph } from './concepts.js';
export {
  STATES, STATE, RUNGS, RUNG_LIST, EVIDENCE, REVIEW_INTERVALS_MS,
  rank, stateAtRank, hasReviews, reviewIntervalMs, TIME_BUDGET_MIN_PER_MARK,
} from './states.js';
export {
  AttemptLog, validateRecord, normaliseRecord, CAUSES, EVENT_KIND,
} from './log.js';
export { deriveConcept, deriveAll } from './derive.js';
export {
  MemoryStore, KEYS, STATE_SCHEMA, emptyState, loadState, saveState,
  defaultStore, readV3FromStore,
} from './store.js';
export {
  planMigration, applyMigration, rollbackMigration,
} from './migrate.js';
export {
  buildPaperMatrix, buildReport, formatReport, FLOORS, CONCENTRATION_CAP, FA_DISTRIBUTION_TARGET,
} from './allocation.js';
