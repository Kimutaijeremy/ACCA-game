// concepts.js — the concept graph, loaded and indexed.
//
// The concept graph (spec/concepts.json) is FROZEN and authoritative (Brief §0, §2.1).
// Concept ids are permanent keys: every lesson, item, mastery state and review record
// references them (Brief §6.1). This module does not author or mutate the graph — it only
// loads it and builds read-only indexes and views over it.
//
// Environment note: the engine core is kept pure and environment-agnostic. The caller
// supplies the parsed JSON (Node reads the file; the browser fetches it). See loadGraph().

/**
 * Build an indexed, queryable graph from the parsed concepts.json object.
 * @param {object} json - parsed contents of spec/concepts.json
 * @returns {ConceptGraph}
 */
export function loadGraph(json) {
  if (!json || !Array.isArray(json.concepts)) {
    throw new Error('concepts.json is malformed: expected a { concepts: [...] } object');
  }
  return new ConceptGraph(json);
}

export class ConceptGraph {
  constructor(json) {
    this.schemaVersion = json.schema_version ?? null;
    this.built = json.built ?? null;
    this.concepts = json.concepts;

    /** @type {Map<string, object>} concept id -> concept node */
    this.byId = new Map();
    for (const c of this.concepts) {
      if (this.byId.has(c.id)) {
        throw new Error(`Duplicate concept id in graph: ${c.id}`);
      }
      this.byId.set(c.id, c);
    }

    // Every edge target must resolve — the graph is validated, but the engine must never
    // silently trust it. A dangling edge here means the frozen file drifted from build_graph.py.
    for (const c of this.concepts) {
      for (const field of ['prerequisites', 'prerequisite_of', 'grows_into', 'integrates_with']) {
        for (const target of c[field] ?? []) {
          if (!this.byId.has(target)) {
            throw new Error(`Concept ${c.id}: ${field} points at missing node ${target}`);
          }
        }
      }
    }
  }

  /** A concept node by id, or undefined. */
  get(id) {
    return this.byId.get(id);
  }

  /** True if id is a real concept in the graph. */
  has(id) {
    return this.byId.has(id);
  }

  /** All live (non-stub) concept ids — the ones that carry Phase 1 content. */
  liveIds() {
    return this.concepts.filter((c) => !c.stub).map((c) => c.id);
  }

  /** All stub landing-node ids — Skills-level targets with no Phase 1 content. */
  stubIds() {
    return this.concepts.filter((c) => c.stub).map((c) => c.id);
  }

  /** Distinct paper codes present as live concepts, in first-seen order. */
  papers() {
    const seen = [];
    for (const c of this.concepts) {
      if (!c.stub && !seen.includes(c.paper)) seen.push(c.paper);
    }
    return seen;
  }

  /** Live concept ids for a paper, in graph order. */
  conceptsForPaper(paper) {
    return this.concepts.filter((c) => !c.stub && c.paper === paper).map((c) => c.id);
  }

  /** Prerequisite ids of a concept (may include cross-paper). */
  prerequisitesOf(id) {
    return [...(this.byId.get(id)?.prerequisites ?? [])];
  }

  /** Summary counts, for reports and sanity checks. */
  counts() {
    const live = this.liveIds().length;
    const stubs = this.stubIds().length;
    let edges = 0;
    for (const c of this.concepts) {
      edges += (c.prerequisites?.length ?? 0)
        + (c.grows_into?.length ?? 0)
        + (c.integrates_with?.length ?? 0);
    }
    return { live, stubs, edges };
  }
}
