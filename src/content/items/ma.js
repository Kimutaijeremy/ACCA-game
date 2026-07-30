// MA question sets (Brief §6.3–6.5). One set per authored concept to the per-concept floor.
// MA-11 is calculation-shaped, so its set includes a PARAMETERIZED generator (the numbers
// regenerate per attempt — anti-memorisation, Brief §6.3). Every wrong option encodes a
// diagnostic cause. Answerable from the concept's lesson alone.

export const MA_ITEMS = [
  // ============================ MA-01 — purpose of management accounting ============================
  {
    id: 'MA-01-CC1', conceptIds: ['MA-01'], rung: 'concept-check', marks: 1,
    stem: 'Management accounting produces information mainly to help managers do which three things?',
    options: [
      { id: 'a', text: 'Plan, control and decide' },
      { id: 'b', text: 'Audit, publish and comply' },
      { id: 'c', text: 'Buy, sell and store' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Management accounting exists to plan, control and decide — always pointed at the next choice.',
  },
  {
    id: 'MA-01-CC2', conceptIds: ['MA-01'], rung: 'concept-check', marks: 1,
    stem: 'Which statement about management accounting is TRUE?',
    options: [
      { id: 'a', text: 'It is forward-looking and has no legally prescribed format' },
      { id: 'b', text: 'It is backward-looking and must follow IFRS' },
      { id: 'c', text: 'It is prepared for outsiders such as the tax authority' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Management accounting faces forwards, for managers, in any useful format — no external rules.',
  },
  {
    id: 'MA-01-CC3', conceptIds: ['MA-01'], rung: 'concept-check', marks: 1,
    stem: 'The lesson says the single test of management accounting information is:',
    options: [
      { id: 'a', text: 'Did it help you decide?' },
      { id: 'b', text: 'Is it correct to an external standard?' },
      { id: 'c', text: 'Has it been audited?' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Its only test is usefulness to a decision — not conformity to a standard or an audit.',
  },
  {
    id: 'MA-01-G1', conceptIds: ['MA-01'], rung: 'guided', marks: 1,
    stem: '"What was the stall’s profit last year, for the tax authority?" Which kind of accounting answers this?',
    options: [
      { id: 'a', text: 'Financial accounting — a record of the past for outsiders under fixed rules' },
      { id: 'b', text: 'Management accounting — a forward-looking choice for the manager' },
      { id: 'c', text: 'Neither — this is not an accounting question' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    scaffold: ['Ask: past or future? Insider or outsider?', 'A past record for an outsider under fixed rules → financial accounting.'],
    rationale: 'Reporting last year’s profit to the tax authority is external, backward-looking → financial accounting.',
  },
  {
    id: 'MA-01-G2', conceptIds: ['MA-01'], rung: 'guided', marks: 1,
    stem: '"Should Wanjiku open the bakery?" Which kind of accounting is this, and why?',
    options: [
      { id: 'a', text: 'Management accounting — it is a forward choice between options for the manager' },
      { id: 'b', text: 'Financial accounting — it concerns money, so it must follow IFRS' },
      { id: 'c', text: 'Financial accounting — because it will appear in next year’s published accounts' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Is this deciding about the future or recording the past?', 'A forward choice between options is what management accounting is for.'],
    rationale: 'Deciding whether to open the bakery is a forward choice → management accounting.',
  },
  {
    id: 'MA-01-G3', conceptIds: ['MA-01'], rung: 'guided', marks: 1,
    stem: 'The lesson says financial accounting "cannot tell her whether to open the bakery". Why not?',
    options: [
      { id: 'a', text: 'Because it faces backwards and reports what happened, while the decision is about the future' },
      { id: 'b', text: 'Because financial accounting is never about money' },
      { id: 'c', text: 'Because financial accounting is only for very large companies' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    scaffold: ['Financial accounting’s direction in time is the key.', 'A backward-facing record cannot answer a forward choice.'],
    rationale: 'Financial accounting is backward-looking; the decision is forward-looking — that is the gap management accounting fills.',
  },
  {
    id: 'MA-01-S1', conceptIds: ['MA-01'], rung: 'standard', marks: 1,
    stem: 'Which row correctly contrasts the two disciplines?',
    options: [
      { id: 'a', text: 'Financial: backward, outsiders, fixed format. Management: forward, managers, any useful format.' },
      { id: 'b', text: 'Financial: forward, managers, any format. Management: backward, outsiders, fixed format.' },
      { id: 'c', text: 'Financial: forward, outsiders, audited. Management: backward, managers, audited.' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Financial = backward/outsiders/fixed; management = forward/managers/flexible.',
  },
  {
    id: 'MA-01-S2', conceptIds: ['MA-01'], rung: 'standard', marks: 1,
    stem: 'A manager wants a one-off report comparing three suppliers’ prices to choose one. Which is TRUE?',
    options: [
      { id: 'a', text: 'This is management accounting; there is no prescribed format and no audit requirement' },
      { id: 'b', text: 'This is financial accounting and must be laid out per IFRS' },
      { id: 'c', text: 'It cannot be produced because there is no standard format for it' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'A forward decision report for a manager is management accounting — format-free by design.',
  },
  {
    id: 'MA-01-S3', conceptIds: ['MA-01'], rung: 'standard', marks: 1,
    stem: 'Which activity is NOT one of the three purposes of management accounting given in the lesson?',
    options: [
      { id: 'a', text: 'Preparing statutory accounts for publication' },
      { id: 'b', text: 'Setting targets and budgets (planning)' },
      { id: 'c', text: 'Comparing actual against plan and correcting the difference (control)' },
    ],
    answerId: 'a',
    distractors: { b: 'requirement_misread', c: 'requirement_misread' },
    rationale: 'Publishing statutory accounts is financial accounting; planning, control and decision are the management-accounting purposes.',
  },
  {
    id: 'MA-01-ST1', conceptIds: ['MA-01'], rung: 'stretch', marks: 2,
    stem: 'A bank demands Wanjiku’s year-end accounts before granting a loan; separately she builds a spreadsheet forecasting next year’s cash to decide the loan size. Using only this lesson, classify each and give the reason.',
    options: [
      { id: 'a', text: 'The year-end accounts are financial accounting (backward, for an outsider under fixed rules); the forecast is management accounting (forward, for her own decision, no prescribed format)' },
      { id: 'b', text: 'Both are financial accounting, because the bank sees both' },
      { id: 'c', text: 'Both are management accounting, because both involve the future in some way' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'Backward record for an outsider = financial; forward forecast for her own decision = management.',
  },

  // ============================ MA-06 — cost classification (nature/function/traceability) ============================
  {
    id: 'MA-06-CC1', conceptIds: ['MA-06'], rung: 'concept-check', marks: 1,
    stem: 'Classifying a cost "by nature" sorts it into which categories?',
    options: [
      { id: 'a', text: 'Materials, labour, or expenses (overheads)' },
      { id: 'b', text: 'Production or non-production' },
      { id: 'c', text: 'Direct or indirect' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'By nature = what the cost IS: materials, labour, or expenses. Production/non-production is by function; direct/indirect is by traceability.',
  },
  {
    id: 'MA-06-CC2', conceptIds: ['MA-06'], rung: 'concept-check', marks: 1,
    stem: 'Prime cost is the total of:',
    options: [
      { id: 'a', text: 'All direct costs (direct materials + direct labour + direct expenses)' },
      { id: 'b', text: 'All overheads (indirect costs)' },
      { id: 'c', text: 'All period costs charged to profit' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Prime cost = the sum of the direct costs; overheads are indirect and excluded.',
  },
  {
    id: 'MA-06-CC3', conceptIds: ['MA-06'], rung: 'concept-check', marks: 1,
    stem: 'A "period cost" is:',
    options: [
      { id: 'a', text: 'Charged in full to the period it arises in (e.g. office rent)' },
      { id: 'b', text: 'Held in inventory until the units sell' },
      { id: 'c', text: 'Always a direct material' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Period costs are expensed in the period they arise; product costs sit in inventory until sold.',
  },
  {
    id: 'MA-06-G1', conceptIds: ['MA-06'], rung: 'guided', marks: 1,
    stem: 'Flour used in a batch of mandazi is which of the following (give all that apply)?',
    options: [
      { id: 'a', text: 'Materials, production, and direct — a product cost carried in inventory' },
      { id: 'b', text: 'Labour, non-production, and indirect — a period cost' },
      { id: 'c', text: 'Expenses, production, and indirect — an overhead' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Every shilling carries all three labels — nature, function, traceability.', 'Flour: what it is (materials), what it serves (production), traceable to a unit? (direct).'],
    rationale: 'Flour is materials (nature), production (function), direct (traceability) — a product cost.',
  },
  {
    id: 'MA-06-G2', conceptIds: ['MA-06'], rung: 'guided', marks: 1,
    stem: 'The bakery supervisor’s salary is best classified as:',
    options: [
      { id: 'a', text: 'Indirect labour — an overhead, not part of prime cost' },
      { id: 'b', text: 'Direct labour — part of prime cost' },
      { id: 'c', text: 'A direct material' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Can the supervisor’s time be traced to one single mandazi?', 'No → indirect → overhead → excluded from prime cost.'],
    rationale: 'A supervisor oversees all output, traceable to no single unit → indirect labour (overhead).',
  },
  {
    id: 'MA-06-G3', conceptIds: ['MA-06'], rung: 'guided', marks: 1,
    stem: 'Classifying "by function" splits costs into:',
    options: [
      { id: 'a', text: 'Production costs versus non-production costs (administration, selling & distribution, finance)' },
      { id: 'b', text: 'Direct versus indirect costs' },
      { id: 'c', text: 'Fixed versus variable costs' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['"By function" asks what part of the business the cost serves.', 'Production vs non-production (admin, selling, finance).'],
    rationale: 'By function = production vs non-production (admin, selling & distribution, finance).',
  },
  {
    id: 'MA-06-S1', conceptIds: ['MA-06'], rung: 'standard', marks: 1,
    stem: 'Direct materials KES 30, direct labour KES 20, production overhead KES 15, office rent share KES 10. What is the prime cost per unit?',
    options: [
      { id: 'a', text: 'KES 50' },
      { id: 'b', text: 'KES 65' },
      { id: 'c', text: 'KES 75' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Prime cost = direct costs only = 30 + 20 = 50. Adding overhead (65) or everything (75) is wrong.',
  },
  {
    id: 'MA-06-S2', conceptIds: ['MA-06'], rung: 'standard', marks: 1,
    stem: 'Which cost would sit in CLOSING INVENTORY rather than being expensed this period?',
    options: [
      { id: 'a', text: 'Production overhead on units made but not yet sold (a product cost)' },
      { id: 'b', text: 'The office rent for the period (a period cost)' },
      { id: 'c', text: 'The selling commission for the period (a period cost)' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Product costs (materials, labour, production overhead) attach to units and stay in inventory until sold; period costs are expensed now.',
  },
  {
    id: 'MA-06-S3', conceptIds: ['MA-06'], rung: 'standard', marks: 1,
    stem: 'Which statement is correct about the three classifications?',
    options: [
      { id: 'a', text: 'Every cost carries a nature, a function and a traceability label at the same time' },
      { id: 'b', text: 'A cost must be classified by only one of the three schemes' },
      { id: 'c', text: 'Direct/indirect is the same distinction as production/non-production' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'The three schemes coexist — flour is materials, production and direct all at once.',
  },
  {
    id: 'MA-06-ST1', conceptIds: ['MA-06'], rung: 'stretch', marks: 2,
    stem: 'A quality inspector is paid to check every tray before it leaves the bakery. Using only this lesson, classify her wage by nature and traceability, and say whether it is part of prime cost.',
    options: [
      { id: 'a', text: 'By nature: labour. By traceability: indirect (it cannot be traced to one single mandazi) → an overhead, so NOT part of prime cost' },
      { id: 'b', text: 'By nature: materials. By traceability: direct → part of prime cost' },
      { id: 'c', text: 'By nature: expenses. By traceability: direct → part of prime cost' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'Inspection is labour, but spread across all output → indirect → overhead → excluded from prime cost.',
  },

  // ============================ MA-07 — cost behaviour ============================
  {
    id: 'MA-07-CC1', conceptIds: ['MA-07'], rung: 'concept-check', marks: 1,
    stem: 'A cost that stays flat in total whatever the output, but falls per unit as volume rises, is:',
    options: [
      { id: 'a', text: 'Fixed' },
      { id: 'b', text: 'Variable' },
      { id: 'c', text: 'Stepped fixed' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Fixed costs are flat in total; spread over more units, the per-unit cost falls.',
  },
  {
    id: 'MA-07-CC2', conceptIds: ['MA-07'], rung: 'concept-check', marks: 1,
    stem: 'A semi-variable cost is made up of:',
    options: [
      { id: 'a', text: 'A fixed standing charge plus a variable part' },
      { id: 'b', text: 'Only a variable part' },
      { id: 'c', text: 'Two separate fixed charges' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Semi-variable = fixed standing charge + variable element (e.g. electricity).',
  },
  {
    id: 'MA-07-CC3', conceptIds: ['MA-07'], rung: 'concept-check', marks: 1,
    stem: 'The "relevant range" is:',
    options: [
      { id: 'a', text: 'The band of activity the business actually operates in, over which the cost patterns hold' },
      { id: 'b', text: 'The range of prices the business charges customers' },
      { id: 'c', text: 'The list of costs that are relevant to a decision' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Cost behaviours hold only within the relevant range — the activity band the business actually operates in.',
  },
  {
    id: 'MA-07-G1', conceptIds: ['MA-07'], rung: 'guided', marks: 1,
    stem: 'Bakery rent is KES 12,000 a month. As Wanjiku bakes more mandazi, what happens to the rent per mandazi?',
    options: [
      { id: 'a', text: 'It falls, because a fixed total is spread over more units' },
      { id: 'b', text: 'It stays the same per unit' },
      { id: 'c', text: 'It rises, because total rent rises with output' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Rent total is fixed — it does not change with output.', 'Same total ÷ more units → smaller cost per unit.'],
    rationale: 'A fixed cost total is unchanged, so per-unit fixed cost falls as volume rises.',
  },
  {
    id: 'MA-07-G2', conceptIds: ['MA-07'], rung: 'guided', marks: 1,
    stem: 'Flour costs KES 3 per mandazi. As output rises, what happens to the flour cost per unit and in total?',
    options: [
      { id: 'a', text: 'Per unit stays flat at KES 3; total rises with output' },
      { id: 'b', text: 'Per unit falls; total stays flat' },
      { id: 'c', text: 'Per unit rises; total falls' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Flour is a variable cost.', 'Variable = flat per unit, rising in total.'],
    rationale: 'A variable cost is constant per unit and rises in total as output grows.',
  },
  {
    id: 'MA-07-G3', conceptIds: ['MA-07'], rung: 'guided', marks: 1,
    stem: 'Wanjiku must hire one supervisor for every eight bakers; the cost jumps each time she crosses a threshold. This behaviour is:',
    options: [
      { id: 'a', text: 'Stepped fixed — flat, then jumping at a threshold' },
      { id: 'b', text: 'Purely variable — rising smoothly with each baker' },
      { id: 'c', text: 'Semi-variable — a standing charge plus a variable part' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['The cost is flat for a while, then leaps at a capacity threshold.', 'Flat-then-jump is the stepped-fixed pattern.'],
    rationale: 'A cost that is flat then jumps at a threshold (one supervisor per eight bakers) is stepped fixed.',
  },
  {
    id: 'MA-07-S1', conceptIds: ['MA-07'], rung: 'standard', marks: 1,
    stem: 'Which statement about cost behaviour PER UNIT is correct?',
    options: [
      { id: 'a', text: 'Fixed cost per unit falls as output rises; variable cost per unit stays constant' },
      { id: 'b', text: 'Fixed cost per unit stays constant; variable cost per unit rises' },
      { id: 'c', text: 'Both fixed and variable cost per unit fall as output rises' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Fixed per unit falls (fixed total spread wider); variable per unit is constant.',
  },
  {
    id: 'MA-07-S2', conceptIds: ['MA-07'], rung: 'standard', marks: 1,
    stem: 'Why does the lesson insist a semi-variable cost must be SPLIT before it can be budgeted?',
    options: [
      { id: 'a', text: 'Because it hides a fixed part and a variable part inside one bill, which behave differently as output changes' },
      { id: 'b', text: 'Because semi-variable costs are always larger than fixed costs' },
      { id: 'c', text: 'Because it must be reclassified as a period cost first' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'A semi-variable bill mixes a fixed and a variable part; each moves differently with output, so it must be split (the next concept).',
  },
  {
    id: 'MA-07-S3', conceptIds: ['MA-07'], rung: 'standard', marks: 1,
    stem: 'Treating a fixed cost as if it were variable when pricing is dangerous because:',
    options: [
      { id: 'a', text: 'It misstates how cost per unit moves with output, so the business can price itself into a loss' },
      { id: 'b', text: 'Fixed and variable costs are actually identical, so it makes no difference' },
      { id: 'c', text: 'Fixed costs never appear in a budget at all' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'The lesson warns that confusing the two behaviours is how a bakery "quietly prices itself into a loss".',
  },
  {
    id: 'MA-07-ST1', conceptIds: ['MA-07'], rung: 'stretch', marks: 2,
    stem: 'A phone contract charges a flat KES 1,000 a month plus KES 2 per minute of calls. Using only this lesson, name the behaviour and describe what happens to the total and the per-minute cost as call minutes rise.',
    options: [
      { id: 'a', text: 'Semi-variable: total rises (the KES 2 part grows), and the average cost per minute falls as the fixed KES 1,000 is spread over more minutes' },
      { id: 'b', text: 'Purely fixed: total and per-minute cost both stay flat' },
      { id: 'c', text: 'Purely variable: total rises and the per-minute cost stays exactly KES 2 including the standing charge' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'A standing charge + per-minute rate is semi-variable; the fixed part spread over more minutes lowers the average per-minute cost.',
  },

  // ============================ MA-11 — high-low method (parameterized) ============================
  {
    id: 'MA-11-CC1', conceptIds: ['MA-11'], rung: 'concept-check', marks: 1,
    stem: 'The high-low method splits a semi-variable cost using which two data points?',
    options: [
      { id: 'a', text: 'The highest and lowest ACTIVITY levels' },
      { id: 'b', text: 'The highest and lowest COST levels' },
      { id: 'c', text: 'The first and last months of the year' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'High-low takes the highest and lowest activity levels — not the highest and lowest cost.',
  },
  {
    id: 'MA-11-CC2', conceptIds: ['MA-11'], rung: 'concept-check', marks: 1,
    stem: 'In the high-low method, variable cost per unit equals:',
    options: [
      { id: 'a', text: '(cost at highest activity − cost at lowest activity) ÷ (highest units − lowest units)' },
      { id: 'b', text: 'total cost ÷ total units' },
      { id: 'c', text: '(highest cost + lowest cost) ÷ 2' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Variable cost per unit is the change in cost over the change in activity between the two extreme activity levels.',
  },
  {
    id: 'MA-11-CC3', conceptIds: ['MA-11'], rung: 'concept-check', marks: 1,
    stem: 'The high-low method "quietly lies" when:',
    options: [
      { id: 'a', text: 'The cost structure changes over the range (e.g. a stepped fixed cost) or a chosen row is a one-off outlier' },
      { id: 'b', text: 'Activity is measured in units rather than in shillings' },
      { id: 'c', text: 'There are more than two months of data available' },
    ],
    answerId: 'a',
    distractors: { b: 'knowledge_gap', c: 'conceptual_misunderstanding' },
    rationale: 'High-low assumes one straight line; a stepped cost or an outlier breaks that assumption.',
  },
  {
    id: 'MA-11-G1', conceptIds: ['MA-11'], rung: 'guided', marks: 2,
    stem: 'Busy month: 900 trays cost KES 32,000. Quiet month: 500 trays cost KES 24,000. What is the variable cost per tray?',
    options: [
      { id: 'a', text: 'KES 20 per tray' },
      { id: 'b', text: 'KES 16 per tray' },
      { id: 'c', text: 'KES 35.56 per tray' },
    ],
    answerId: 'a',
    distractors: { b: 'calculation_error', c: 'incorrect_treatment' },
    scaffold: ['Cost change = 32,000 − 24,000 = 8,000. Activity change = 900 − 500 = 400.', 'Variable per unit = 8,000 ÷ 400.'],
    rationale: '(32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20 per tray.',
  },
  {
    id: 'MA-11-G2', conceptIds: ['MA-11'], rung: 'guided', marks: 2,
    stem: 'Continuing: variable cost is KES 20 per tray and the busy month made 900 trays at a total of KES 32,000. What is the monthly fixed cost?',
    options: [
      { id: 'a', text: 'KES 14,000' },
      { id: 'b', text: 'KES 18,000' },
      { id: 'c', text: 'KES 32,000' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    scaffold: ['Fixed = total cost − (variable per unit × units).', 'At the high point: 32,000 − (20 × 900) = 32,000 − 18,000.'],
    rationale: 'Fixed = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000.',
  },
  {
    id: 'MA-11-G3', conceptIds: ['MA-11'], rung: 'guided', marks: 2,
    stem: 'With fixed cost KES 14,000 and variable KES 20 per tray, what should a month baking 700 trays cost?',
    options: [
      { id: 'a', text: 'KES 28,000' },
      { id: 'b', text: 'KES 14,000' },
      { id: 'c', text: 'KES 34,000' },
    ],
    answerId: 'a',
    distractors: { b: 'requirement_misread', c: 'calculation_error' },
    scaffold: ['Total cost = fixed + (variable per unit × units).', '14,000 + (20 × 700) = 14,000 + 14,000.'],
    rationale: 'Total = 14,000 + (20 × 700) = 14,000 + 14,000 = KES 28,000.',
  },
  {
    // Parameterized standard item — the numbers regenerate per attempt so the split cannot be memorised.
    id: 'MA-11-S1', conceptIds: ['MA-11'], rung: 'standard', marks: 2,
    generate: (rng) => {
      const vc = rng.step(10, 40, 5); // true variable cost per unit
      const fixed = rng.step(6000, 20000, 1000); // true monthly fixed cost
      const lowU = rng.step(200, 500, 50);
      const highU = lowU + rng.step(200, 500, 50);
      const lowC = fixed + vc * lowU;
      const highC = fixed + vc * highU;
      const money = (n) => `KES ${Math.round(n).toLocaleString('en-KE')}`;
      // Distractors chosen so a, b, c are ALWAYS distinct: treating the whole high-month cost as
      // variable is strictly ABOVE vc (it carries fixed cost); adding the activity levels instead
      // of subtracting is strictly BELOW vc. So c < a < b, never colliding.
      const wrongTreatAllVariable = Math.round((highC / highU) * 100) / 100; // treats total as all variable (> vc)
      const wrongAddDenom = Math.round(((highC - lowC) / (highU + lowU)) * 100) / 100; // added the activity levels (< vc)
      return {
        stem: `Two months of electricity. Busy: ${highU} units cost ${money(highC)}. Quiet: ${lowU} units cost ${money(lowC)}. Using the high-low method, what is the variable cost per unit?`,
        options: [
          { id: 'a', text: `KES ${vc} per unit` },
          { id: 'b', text: `KES ${wrongTreatAllVariable} per unit` },
          { id: 'c', text: `KES ${wrongAddDenom} per unit` },
        ],
        answerId: 'a',
        distractors: { b: 'incorrect_treatment', c: 'calculation_error' },
        rationale: `(${money(highC)} − ${money(lowC)}) ÷ (${highU} − ${lowU}) = ${money(highC - lowC)} ÷ ${highU - lowU} = KES ${vc} per unit. Option b wrongly treats the whole high-month cost as variable; option c adds the activity levels in the denominator instead of subtracting.`,
      };
    },
  },
  {
    id: 'MA-11-S2', conceptIds: ['MA-11'], rung: 'standard', marks: 1,
    stem: 'A cost table shows the highest COST (KES 40,000) at 700 units, but a different month reached 900 units costing KES 38,000. Which rows should high-low use for the activity extremes?',
    options: [
      { id: 'a', text: 'The 900-unit and the lowest-unit rows — high-low uses activity extremes, not cost extremes' },
      { id: 'b', text: 'The KES 40,000 row and the KES 38,000 row — the two highest costs' },
      { id: 'c', text: 'Any two adjacent months' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Pick the extreme ACTIVITY rows even when another row has a higher cost — a stated trap.',
  },
  {
    id: 'MA-11-S3', conceptIds: ['MA-11'], rung: 'standard', marks: 2,
    stem: 'Variable cost is KES 25 per unit and fixed cost KES 10,000 per month. What is the forecast total cost of a 600-unit month?',
    options: [
      { id: 'a', text: 'KES 25,000' },
      { id: 'b', text: 'KES 15,000' },
      { id: 'c', text: 'KES 10,000' },
    ],
    answerId: 'a',
    distractors: { b: 'calculation_error', c: 'requirement_misread' },
    rationale: 'Total = 10,000 + (25 × 600) = 10,000 + 15,000 = KES 25,000.',
  },
  {
    id: 'MA-11-ST1', conceptIds: ['MA-11'], rung: 'stretch', marks: 2,
    stem: 'Between the quiet and busy months the bakery switched on a SECOND oven, adding KES 5,000 to monthly fixed cost. If you apply plain high-low across the two months anyway, what goes wrong?',
    options: [
      { id: 'a', text: 'High-low assumes one straight line across the range, so the KES 5,000 step is wrongly absorbed into the variable-cost-per-unit figure, overstating it' },
      { id: 'b', text: 'Nothing — high-low automatically detects and removes stepped fixed costs' },
      { id: 'c', text: 'The method simply cannot produce any number at all' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'A stepped fixed cost between the two points is smeared into the slope, so the variable rate is overstated — high-low "quietly lies".',
  },
];

export default MA_ITEMS;
