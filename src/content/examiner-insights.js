// examiner-insights.js — evidence mined from ACCA examiners' reports (Amendment A6, 2026-08-01).
//
// ACCA publishes an examiner's report per paper each Sep–Aug year, naming where candidates
// consistently go wrong. That is real evidence — better than reasoned judgement — so we use it two
// ways (per Jeremy, 2026-08-01):
//   1. EMPHASIS NUDGE: concepts an examiner repeatedly flags get a small within-area selection boost
//      in set assembly (a nudge — it does NOT change the constructed area-weight tables in sets.js).
//   2. NAMED TRAPS: the specific mistakes examiners keep reporting are built into the questions as
//      tagged distractors, and into the topic pages' "Go deeper" layers as named traps. Being warned
//      about the exact error the examiner sees every sitting is the highest-value use.
//
// This file is the source-of-record: which reports were used, and every trap taken from them.
// Reports used (most recent complete year available, September 2024 – August 2025):
//   BT/FBT : https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/fbt_s24_a25_examiners_report.pdf
//   MA/FMA : https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/fma_ma_s24_a25_examiners_report.pdf
//   FA/FFA : https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/ffa_fa_s24_a25_examiners_report.pdf

export const EXAMINER_REPORTS = Object.freeze([
  { paper: 'BT', period: 'Sep 2024 – Aug 2025', url: 'https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/fbt_s24_a25_examiners_report.pdf' },
  { paper: 'MA', period: 'Sep 2024 – Aug 2025', url: 'https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/fma_ma_s24_a25_examiners_report.pdf' },
  { paper: 'FA', period: 'Sep 2024 – Aug 2025', url: 'https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/ffa_fa_s24_a25_examiners_report.pdf' },
]);

// Named traps applied to BUILT topics this pass. Each: the concept it lands on, the topic page whose
// Go deeper layer names it, the item id(s) that encode it as a tagged distractor, and the report.
export const APPLIED_TRAPS = Object.freeze([
  {
    conceptId: 'BT-04', topicId: 'BT A2', report: 'BT Sep24–Aug25 Ex1',
    trap: 'Power and interest are judged from the STAKEHOLDER’s leverage over this organisation. A customer or supplier who can easily switch (has alternatives) has HIGH power but LOW interest → keep satisfied — not "low power" because they are only one of many.',
    itemIds: ['BT-04-EX1'],
  },
  {
    conceptId: 'BT-01', topicId: 'BT A1', report: 'MA Sep24–Aug25 Ex6',
    trap: 'Measuring a not-for-profit / public body is hard for TWO reasons at once: it has multiple, often conflicting objectives, AND the value of its outputs is hard to measure when services are not sold at a market price. Candidates wrongly pick only one — hence value for money (the three Es), not profit.',
    itemIds: ['BT-01-EX1'],
  },
  {
    conceptId: 'FA-04', topicId: 'FA A3', report: 'FA Sep24–Aug25 Ex5',
    trap: 'The statement of financial position shows assets, liabilities and equity AS AT a point in time; the statement of profit or loss shows performance FOR a period. Do not say the SOFP shows performance.',
    itemIds: ['FA-04-EX1'],
  },
  {
    conceptId: 'FA-11', topicId: 'FA C1', report: 'FA Sep24–Aug25 Ex1 & Ex6',
    trap: 'In the bank/cash general ledger, receipts are DEBITS (increase the balance) and payments are CREDITS. A customer cheque that is returned/dishonoured/cancelled must be REVERSED — credited — because the original receipt was a debit. (A bank error, or a cheque not yet presented, is a reconciliation item, not a ledger entry.)',
    itemIds: ['FA-11-EX1'],
  },
  {
    conceptId: 'FA-63', topicId: 'FA H2', report: 'FA Sep24–Aug25 Ex2',
    trap: 'ROCE = profit margin × asset turnover. Given ROCE and asset turnover, profit margin = ROCE ÷ asset turnover (a fall in margin can hide behind a rising ROCE). Candidates who cannot decompose ROCE get stuck. (Profitability sits beside the liquidity/efficiency ratios on this page.)',
    itemIds: [],
  },
]);

// Traps recorded for areas NOT yet built — carried so they are not lost when those topics are authored.
export const PENDING_TRAPS = Object.freeze([
  { paper: 'MA', area: 'C', topic: 'Joint & by-products', report: 'MA Ex3', trap: 'By-products are NOT costed separately; their revenue is deducted from joint costs before apportioning to main products. Joint products are identified at the separation point.' },
  { paper: 'MA', area: 'C', topic: 'Service/operation costing', report: 'MA Ex2', trap: 'Cost per composite unit (e.g. passenger-km) = total cost ÷ total composite units; build the composite unit first (journeys × km × average passengers).' },
  { paper: 'MA', area: 'B', topic: 'Statistics / index numbers', report: 'MA Ex1/Ex4', trap: 'Number-entry (constructed-response) calculation questions are a consistent weakness — coefficient of variation = σ ÷ mean; compound interest A = P(1+r)^n then subtract P for interest only.' },
  { paper: 'MA', area: 'E/F', topic: 'Variances / marginal costing profit', report: 'MA Ex5', trap: 'Actual profit = standard contribution on actual sales ± variances − budgeted fixed overhead; watch the sign of each variance (favourable adds, adverse deducts).' },
  { paper: 'FA', area: 'E', topic: 'Bank reconciliation', report: 'FA Ex6', trap: 'Separate ledger adjustments (bank charges omitted, dishonoured cheque) from reconciliation items (bank error, unpresented/uncredited cheques). Only the former change the cash book.' },
  { paper: 'FA', area: 'G', topic: 'Consolidation', report: 'FA Sec B', trap: 'Add parent + subsidiary assets/liabilities in FULL (100%) even for a partial holding; eliminate the investment and intra-group items; exclude the subsidiary’s pre-acquisition retained earnings and its share capital.' },
]);

// Cross-paper exam-technique traps (apply everywhere; surfaced in Go deeper).
export const TECHNIQUE_TRAPS = Object.freeze([
  'In true/false or multiple-response questions, do NOT assume there must be a mix — all the statements can be true (or all false). Judge each on its own.',
  'Finish the whole calculation before choosing an answer, and sanity-check that the result is reasonable; number-entry questions are where marks are most often lost.',
]);

/** Concepts an examiner report flags — used for the within-area emphasis nudge (not a re-weighting). */
export const EXAMINER_FLAGGED_CONCEPTS = Object.freeze(
  [...new Set(APPLIED_TRAPS.map((t) => t.conceptId))],
);
