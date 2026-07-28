// node-loader.js — Node-only helpers to read the frozen spec files from disk.
// The browser build fetches these instead; keeping the reads here keeps the engine core pure.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadGraph } from './concepts.js';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SPEC_DIR = join(HERE, '..', '..', 'spec');

export function readJSON(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function loadConceptsJSON() {
  return readJSON(join(SPEC_DIR, 'concepts.json'));
}

export function loadGraphFromSpec() {
  return loadGraph(loadConceptsJSON());
}

export function loadSyllabusOutcomes() {
  return readJSON(join(SPEC_DIR, 'syllabus-outcomes.json'));
}

export function loadV3Fixture() {
  return readJSON(join(SPEC_DIR, 'paper-trail-progress.json'));
}
