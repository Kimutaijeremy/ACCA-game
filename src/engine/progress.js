// progress.js — paper completion, lineage-gated unlocking, and build-progress (Order §4A / A2).
//
// The single guard this module exists to enforce: completion is measured against the paper's FULL
// concept count in the frozen graph, NEVER against how many lessons have been authored. Partial
// content can never produce an unlock.

import { rank, STATE } from './states.js';
import { OPENS, LINEAGE_NOTES, KNOWN_PAPERS, CONTENT_TRACKS, parentsOf, rootPapers } from '../content/lineage.js';

const COMPETENT_RANK = rank(STATE.COMPETENT);

/**
 * Build progress for one paper.
 * @param {string} paper
 * @param {ConceptGraph} graph
 * @param {Map<string,object>} states - derived states (deriveAll().states)
 * @param {(conceptId:string)=>boolean} hasLesson - is a lesson authored for this concept?
 */
export function paperProgress(paper, graph, states, hasLesson = () => false) {
  const concepts = graph.conceptsForPaper(paper); // the FULL count from concepts.json
  const total = concepts.length;
  let built = 0;
  let competent = 0;
  for (const id of concepts) {
    if (hasLesson(id)) built += 1;
    const s = states.get(id);
    if (s && s.rank >= COMPETENT_RANK) competent += 1;
  }
  // COMPLETE only when EVERY concept in the paper is Competent+ (against the full count).
  const complete = total > 0 && competent === total;
  return { paper, total, built, competent, complete };
}

/**
 * Full unlock + status picture for every known paper.
 * @returns {object[]} per-paper: { paper, locked, reason, contentStatus, progress }
 */
export function paperStatuses(graph, states, hasLesson = () => false) {
  const parents = parentsOf();
  const roots = new Set(rootPapers());

  // Completion of any paper that has concepts (needed to decide unlocks).
  const completeOf = {};
  for (const p of KNOWN_PAPERS) {
    const prog = graph.conceptsForPaper(p).length > 0 ? paperProgress(p, graph, states, hasLesson) : null;
    completeOf[p] = prog ? prog.complete : false; // papers with no live concepts never "complete" by content
  }

  return KNOWN_PAPERS.map((paper) => {
    const hasConcepts = graph.conceptsForPaper(paper).length > 0;
    const progress = hasConcepts ? paperProgress(paper, graph, states, hasLesson) : { paper, total: 0, built: 0, competent: 0, complete: false };

    // Lock state — roots are always open; descendants open only when ALL parents are complete.
    let locked = false;
    let reason = null;
    if (!roots.has(paper)) {
      const ps = parents[paper] ?? [];
      const unmet = ps.filter((p) => !completeOf[p]);
      if (unmet.length > 0) {
        locked = true;
        reason = `opens when you complete ${unmet.join(' and ')}`;
        if (LINEAGE_NOTES[paper]) reason += ` — ${LINEAGE_NOTES[paper]}`;
      }
    }

    // Content status (meaningful for OPEN papers; a locked paper shows its reason instead).
    let contentStatus;
    if (locked) contentStatus = 'locked';
    else if (CONTENT_TRACKS.includes(paper) && progress.built > 0) contentStatus = 'built';
    else contentStatus = 'not-built'; // "content not built yet" — LW, TX, and unlocked-but-empty papers

    return { paper, locked, reason, contentStatus, opens: OPENS[paper] ?? [], progress };
  });
}

/** One-line build-progress label per paper, e.g. "FA — 42 of 65 concepts available". */
export function progressLabel(status) {
  if (status.locked) return `${status.paper} — ${status.reason}`;
  if (status.contentStatus === 'not-built') return `${status.paper} — content not built yet`;
  return `${status.paper} — ${status.progress.built} of ${status.progress.total} concepts available`;
}
