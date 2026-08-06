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
  MemoryStore, MemoryLogAdapter, IdbLogAdapter, LearnerStore,
  KEYS, KEY_PREFIX, STATE_SCHEMA, DB_NAME, LOG_STORE,
  emptyState, metaOf, loadMeta, saveMeta, trySaveMeta, isQuotaError,
  defaultKV, defaultLogAdapter, readV3FromStore,
} from './store.js';
export {
  planMigration, applyMigration, rollbackMigration,
} from './migrate.js';
export {
  buildPaperMatrix, buildReport, formatReport, FLOORS, CONCENTRATION_CAP, FA_DISTRIBUTION_TARGET,
} from './allocation.js';
export {
  diagnose, resolveProbe, inferFromPattern, REMEDIATION, CONFIDENCE,
} from './diagnose.js';
export {
  validateFlag, normaliseFlag, openFlags, flagCounts, FLAG_REASONS, FLAG_TARGET_KINDS,
} from './flags.js';
export {
  validateLesson, indexLessons, lessonSectionCounts, LESSON_SHAPES,
} from './lessons.js';
export {
  validateItem, indexItems, instantiate, questionSetReport, itemsForAllocation,
  timeBudgetMs, PRACTICE_RUNGS, PER_CONCEPT_FLOORS, CALC_SHAPES, ITEM_CAPS,
} from './items.js';
export {
  validateTopic, indexTopics, topicIdForConcept, deeperSectionForConcept, TEACHING_PAPERS,
} from './topics.js';
export {
  createSession, currentItemId, answerCurrent, resume, restart, isComplete,
  openOverlay, closeOverlay, overlayOpen, saveSession, loadSession,
  labelFor, assertControlLabelsHonest, toJSON as sessionToJSON, fromJSON as sessionFromJSON,
  SESSION_SCHEMA, SESSION_STATUS, OVERLAY_SURFACES, CONTROL_LABELS,
} from './session.js';
export { mulberry32, makeRng, seedFromString } from './rng.js';
export {
  paperProgress, paperStatuses, paperStatusesByTopic, progressLabel,
} from './progress.js';
export {
  assembleSet, topicCompletion, topicHint, paperTopicSummary, rollingAverage,
  defaultAreaWeights, FA_AREA_WEIGHTS, BT_AREA_WEIGHTS, MA_AREA_WEIGHTS,
  SET_SIZE, TOPIC_WINDOW, TOPIC_NEED, TOPIC_MIN_SESSIONS,
} from './sets.js';
export {
  OPENS, LINEAGE_NOTES, KNOWN_PAPERS, CONTENT_TRACKS, parentsOf, rootPapers, validateLineage,
} from '../content/lineage.js';
