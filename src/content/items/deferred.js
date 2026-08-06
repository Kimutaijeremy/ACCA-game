// deferred.js — items authored but HELD BACK under AUTHORING_CONTRACT.md §3 (breadth before depth).
//
// Each is a surplus practice item (one standard above the per-concept floor) for a concept whose
// paper is not yet 100% authored to the minimum set. They are RECORDED here, not deleted: when the
// paper reaches breadth, move the item back into that paper's item file to re-expand the set.
//
// These are NOT part of ALL_ITEMS. So they are never served, never counted toward floors or caps,
// and never in the sealed pool. (The examiner-trap *-EX1 items were deliberately kept live instead —
// they ship as real items and are referenced by examiner-insights.js.)

export const DEFERRED_ITEMS = [
  {
    id: 'BT-01-S3', conceptIds: ['BT-01'], rung: 'standard', marks: 1,
    deferredReason: 'breadth-before-depth: surplus over BT-01 s:3 floor while BT < 100% authored',
    stem: 'Which statement is TRUE of a sole trader but FALSE of a limited liability company?',
    options: [
      { id: 'a', text: 'The owner is personally liable for the business’s debts' },
      { id: 'b', text: 'It exists to make a profit' },
      { id: 'c', text: 'It can be judged on value for money' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Unlimited (personal) liability is the sole trader’s feature; a company’s owners have limited liability.',
  },
  {
    id: 'BT-04-S3', conceptIds: ['BT-04'], rung: 'standard', marks: 1,
    deferredReason: 'breadth-before-depth: surplus over BT-04 s:3 floor while BT < 100% authored',
    stem: 'A neighbour who dislikes the queue outside has neither power over the stall nor much interest in it. Managing her with "minimal effort" is an example of:',
    options: [
      { id: 'a', text: 'Setting management effort by the quadrant, and prioritising higher-power/higher-interest claims first' },
      { id: 'b', text: 'Ignoring a key player, which the matrix warns against' },
      { id: 'c', text: 'Treating interest as more important than power in every case' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Low power + low interest → minimal effort; effort is allocated by quadrant.',
  },
  {
    id: 'FA-04-S3', conceptIds: ['FA-04'], rung: 'standard', marks: 1,
    deferredReason: 'breadth-before-depth: surplus over FA-04 s:3 floor while FA < 100% authored',
    stem: 'The owner’s capital in the business is which element?',
    options: [
      { id: 'a', text: 'Equity — what the business owes its owner' },
      { id: 'b', text: 'A liability to an outsider' },
      { id: 'c', text: 'An asset controlled by the owner' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Capital is part of equity — what the business owes the owner (a residual claim), distinct from liabilities owed to outsiders.',
  },
  {
    id: 'FA-11-S3', conceptIds: ['FA-11'], rung: 'standard', marks: 1,
    deferredReason: 'breadth-before-depth: surplus over FA-11 s:3 floor while FA < 100% authored',
    stem: 'If a bookkeeper debits KES 500 but forgets the matching credit, what has broken?',
    options: [
      { id: 'a', text: 'The duality of the transaction — total debits no longer equal total credits, so the trial balance will not agree' },
      { id: 'b', text: 'Nothing — a single-sided entry is allowed for small amounts' },
      { id: 'c', text: 'The accounting equation is unaffected because only one account changed' },
    ],
    answerId: 'a',
    distractors: { b: 'knowledge_gap', c: 'conceptual_misunderstanding' },
    rationale: 'Every transaction needs two equal sides; a missing credit breaks the built-in balance the trial balance relies on.',
  },
];

export default DEFERRED_ITEMS;
