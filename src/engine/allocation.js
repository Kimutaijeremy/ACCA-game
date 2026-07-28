// allocation.js — the coverage guarantee (Brief §6.4).
//
// "Completeness is mechanical." Per paper we build an allocation matrix: every study-guide
// sub-area x (concepts, lesson sections, item count per rung, sealed-pool count, share of
// bank). Three per-sub-area FLOORS and one concentration CAP are checked. Any sub-area failing
// any floor fails the build. This is the structural guarantee that the v1 failure — half the
// FA bank on one concept, whole topics missing — cannot recur.
//
// In WP1 there are no lessons and no items, so every cell reads zero and every floor fails.
// THAT IS CORRECT (Brief WP1): the report must fail loudly while the banks are empty.

const PRACTICE_RUNGS = ['concept-check', 'guided', 'standard', 'stretch', 'integrated'];

// Per-sub-area floors (Brief §6.4): breadth and depth both.
export const FLOORS = Object.freeze({
  lessonSections: 1, // at least one lesson section
  practiceItems: 3, // at least three practice items...
  practiceRungs: 2, // ...spanning at least two rungs
  sealedItems: 1, // at least one sealed-pool item
});

export const CONCENTRATION_CAP = 0.08; // no concept exceeds 8% of a paper's practice bank

// FA objective-item distribution target (Brief §6.4), per 35 items, scaled to the full bank.
// Reference metadata for item authoring in WP3 — not a WP1 gate.
export const FA_DISTRIBUTION_TARGET = Object.freeze({
  A: 2, B: 2, C: 4, D: 10, E: 7, F: 6, G: 2, H: 2,
});

// A concept's outcome covers a sub-area if it equals it or names it (spanning outcomes such
// as "BT A3-A9" name several). Mirrors build_graph.py's coverage test.
function outcomeCovers(subarea, outcome) {
  return subarea === outcome || outcome.includes(subarea);
}

/**
 * Build the allocation matrix and floor/cap report for one paper.
 *
 * @param {string} paper - e.g. 'FA'
 * @param {string[]} subareas - authoritative sub-area list for this paper (syllabus-outcomes.json)
 * @param {ConceptGraph} graph
 * @param {object} content - authored content index (empty in WP1)
 *   content.lessonSections : { [conceptId]: number }
 *   content.items          : [{ conceptIds:[...], rung, sealed?:boolean }]
 * @returns {object} paper report
 */
export function buildPaperMatrix(paper, subareas, graph, content = {}) {
  const lessonSections = content.lessonSections ?? {};
  const items = content.items ?? [];

  const paperConcepts = new Set(graph.conceptsForPaper(paper));

  // Partition this paper's items.
  const practiceItems = items.filter(
    (it) => !it.sealed && PRACTICE_RUNGS.includes(it.rung)
      && it.conceptIds.some((c) => paperConcepts.has(c)),
  );
  const sealedItems = items.filter(
    (it) => (it.sealed || it.rung === 'sealed')
      && it.conceptIds.some((c) => paperConcepts.has(c)),
  );

  const bankTotal = practiceItems.length;

  // Per-concept practice count, for the concentration cap.
  const perConceptPractice = new Map();
  for (const c of paperConcepts) perConceptPractice.set(c, 0);
  for (const it of practiceItems) {
    for (const c of it.conceptIds) {
      if (perConceptPractice.has(c)) {
        perConceptPractice.set(c, perConceptPractice.get(c) + 1);
      }
    }
  }

  // Map each sub-area to its concepts.
  const rows = subareas.map((sub) => {
    const concepts = graph
      .conceptsForPaper(paper)
      .filter((cid) => outcomeCovers(sub, graph.get(cid).outcome));
    const conceptSet = new Set(concepts);

    const rowPractice = practiceItems.filter((it) => it.conceptIds.some((c) => conceptSet.has(c)));
    const rowSealed = sealedItems.filter((it) => it.conceptIds.some((c) => conceptSet.has(c)));

    const itemsByRung = Object.fromEntries(PRACTICE_RUNGS.map((r) => [r, 0]));
    for (const it of rowPractice) itemsByRung[it.rung] += 1;
    const rungsCovered = PRACTICE_RUNGS.filter((r) => itemsByRung[r] > 0).length;

    const lessonCount = concepts.reduce((n, cid) => n + (lessonSections[cid] ?? 0), 0);
    const shareOfBank = bankTotal > 0 ? rowPractice.length / bankTotal : 0;

    const floors = {
      lesson: lessonCount >= FLOORS.lessonSections,
      practice: rowPractice.length >= FLOORS.practiceItems && rungsCovered >= FLOORS.practiceRungs,
      sealed: rowSealed.length >= FLOORS.sealedItems,
    };
    const failed = [];
    if (!floors.lesson) failed.push(`lesson<${FLOORS.lessonSections}`);
    if (!floors.practice) failed.push(`practice<${FLOORS.practiceItems}items/${FLOORS.practiceRungs}rungs`);
    if (!floors.sealed) failed.push(`sealed<${FLOORS.sealedItems}`);

    return {
      subarea: sub,
      concepts,
      lessonSections: lessonCount,
      itemsByRung,
      practiceCount: rowPractice.length,
      rungsCovered,
      sealedPoolCount: rowSealed.length,
      shareOfBank,
      floors,
      floorFailures: failed,
      green: failed.length === 0,
    };
  });

  // Concentration cap over the whole paper bank.
  const capViolations = [];
  if (bankTotal > 0) {
    for (const [cid, n] of perConceptPractice) {
      const share = n / bankTotal;
      if (share > CONCENTRATION_CAP) {
        capViolations.push({ conceptId: cid, share, count: n });
      }
    }
  }

  const failingRows = rows.filter((r) => !r.green);
  const green = failingRows.length === 0 && capViolations.length === 0;

  return {
    paper,
    subareaCount: subareas.length,
    conceptCount: paperConcepts.size,
    bankTotal,
    sealedTotal: sealedItems.length,
    rows,
    capViolations,
    green,
    failingSubareaCount: failingRows.length,
  };
}

/**
 * Build matrices for every paper and an overall pass/fail.
 * @param {object} syllabus - parsed syllabus-outcomes.json ({ subareas: {paper:[...]} })
 * @param {ConceptGraph} graph
 * @param {object} content
 */
export function buildReport(syllabus, graph, content = {}) {
  const papers = Object.keys(syllabus.subareas);
  const perPaper = papers.map((p) => buildPaperMatrix(p, syllabus.subareas[p], graph, content));
  const allGreen = perPaper.every((p) => p.green);
  return {
    generatedAt: content.generatedAt ?? null,
    syllabusYear: syllabus.syllabus_year ?? null,
    allGreen,
    papers: perPaper,
  };
}

/** Render the report as plain text (used by the WP1 report tool). */
export function formatReport(report) {
  const lines = [];
  lines.push('ALLOCATION MATRICES — coverage report');
  lines.push(`Overall: ${report.allGreen ? 'GREEN (all floors met)' : 'FAIL (floors unmet)'}`);
  lines.push('');
  for (const p of report.papers) {
    lines.push(`── ${p.paper} — ${p.conceptCount} concepts across ${p.subareaCount} sub-areas`);
    lines.push(`   practice bank: ${p.bankTotal} items · sealed pool: ${p.sealedTotal} items · `
      + `${p.green ? 'GREEN' : `FAIL (${p.failingSubareaCount}/${p.subareaCount} sub-areas below floor)`}`);
    for (const r of p.rows) {
      const mark = r.green ? 'ok ' : 'XX ';
      const detail = r.green ? '' : `  ← ${r.floorFailures.join(', ')}`;
      lines.push(`   ${mark}${r.subarea.padEnd(8)} concepts:${String(r.concepts.length).padStart(2)} `
        + `lesson:${r.lessonSections} practice:${r.practiceCount}(${r.rungsCovered}rungs) `
        + `sealed:${r.sealedPoolCount}${detail}`);
    }
    if (p.capViolations.length) {
      lines.push(`   CAP VIOLATIONS (>8% of bank): `
        + p.capViolations.map((v) => `${v.conceptId} ${(v.share * 100).toFixed(1)}%`).join(', '));
    }
    lines.push('');
  }
  return lines.join('\n');
}
