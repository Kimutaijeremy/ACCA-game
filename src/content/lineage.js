// lineage.js — the paper lineage config (Execution Order §4A / Amendment A2).
//
// Kept in ONE file so it extends without touching engine code. It is validated against
// concepts.json's grows_into edges where the child paper has nodes, but it is NOT derived from
// edges alone: AA, LW and TX have no nodes in the graph, so edges cannot express their position.
//
// Lineage-gated unlocking: a paper is COMPLETE only when every one of its concepts (the FULL
// concepts.json count) is at Competent or above; completing a paper opens ONLY its descendants;
// a locked paper always shows why it is locked.

// What each parent paper OPENS when it is completed.
export const OPENS = Object.freeze({
  FA: ['FR'],
  MA: ['PM', 'FM'],
  FR: ['AA'],
  BT: [], // BT opens nothing at Skills level
});

// Human-readable notes shown/attached where the edge needs explaining.
export const LINEAGE_NOTES = Object.freeze({
  FR: 'AA audits the statements FR teaches; BT contributes ethics, governance and internal control but is not the gate.',
});

// Every paper the app knows about (for display + status), Knowledge → Skills → Professional-ish.
export const KNOWN_PAPERS = Object.freeze(['BT', 'MA', 'FA', 'LW', 'TX', 'FR', 'PM', 'FM', 'AA']);

// Papers whose Phase-1 content is being authored now. Others display "content not built yet".
export const CONTENT_TRACKS = Object.freeze(['BT', 'MA', 'FA']);

/** Map of descendant paper -> [parent papers that open it]. Derived from OPENS. */
export function parentsOf() {
  const parents = {};
  for (const [parent, children] of Object.entries(OPENS)) {
    for (const child of children) (parents[child] ??= []).push(parent);
  }
  return parents;
}

/** Papers with no parent — open from the start (BT, MA, FA, LW, TX). */
export function rootPapers() {
  const parents = parentsOf();
  return KNOWN_PAPERS.filter((p) => !parents[p]);
}

/**
 * Validate the lineage against the frozen graph: for every OPENS edge whose CHILD paper has live
 * or stub nodes, there must be at least one grows_into edge from a parent-paper concept into a
 * child-paper node. Edges whose child paper has no nodes (AA) are recorded as unvalidatable.
 */
export function validateLineage(graph) {
  const errors = [];
  const checked = [];
  const skipped = [];
  const paperOf = (id) => graph.get(id)?.paper;
  const hasNodes = (paper) => graph.concepts.some((c) => c.paper === paper);

  for (const [parent, children] of Object.entries(OPENS)) {
    for (const child of children) {
      if (!hasNodes(child)) { skipped.push(`${parent}→${child} (no ${child} nodes in graph)`); continue; }
      const edgeExists = graph.concepts.some(
        (c) => c.paper === parent && (c.grows_into ?? []).some((t) => paperOf(t) === child),
      );
      if (edgeExists) checked.push(`${parent}→${child}`);
      else errors.push(`${parent}→${child}: no grows_into edge from a ${parent} concept into a ${child} node`);
    }
  }
  return { ok: errors.length === 0, errors, checked, skipped };
}
