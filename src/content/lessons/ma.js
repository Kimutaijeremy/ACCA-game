// MA lessons (Brief §6.3, quality rubric Execution Order §5). Seeded from the WP2a
// pilots; append new lessons as clean object literals. Validated by src/engine/lessons.js.

export const MA_LESSONS = [
  {
    "conceptId": "MA-11",
    "title": "The high-low method",
    "syllabusYear": "2026",
    "shape": "calculation",
    "story": "Wanjiku opens a small bakery behind the shop — mandazi and bread. The first bill that puzzles her is electricity. In a quiet month it costs less; in a busy month, more — but it never falls to zero, because the fridge and the lights run regardless. This is a **semi-variable cost**: a fixed standing charge plus a variable amount that rises with how much she bakes. To budget, and later to price a single mandazi, she must split that one bill into its fixed and variable halves. With only the monthly totals to go on, the high-low method does it from just two data points — the busiest month and the quietest.",
    "keypoints": [
      {
        "title": "High-low method",
        "body": "Take the **highest and lowest activity** levels (not the highest and lowest cost):\n  Variable cost per unit = (cost at highest activity − cost at lowest activity) ÷ (highest units − lowest units)\nThen, at either level:\n  Fixed cost = total cost − (variable cost per unit × units)\nCrude but everywhere — and the exam’s favourite warm-up."
      },
      {
        "title": "Two traps",
        "body": "Pick the extreme **activity** rows, even if another row has a higher cost. And if the cost structure changes over the range (a **stepped** fixed cost — say a second oven switched on) or a row is a one-off outlier, high-low quietly lies: it assumes one straight line across the whole range."
      }
    ],
    "worked": {
      "prompt": "Two months of the bakery’s electricity: a busy month baked 900 trays and cost KES 32,000; a quiet month baked 500 trays and cost KES 24,000. Split the bill, then predict the cost of a month baking 700 trays.",
      "steps": [
        "Variable cost per tray = (32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20 per tray.",
        "Fixed cost = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000 per month (check at the low point: 24,000 − 20×500 = 14,000 ✓).",
        "Forecast at 700 trays = fixed 14,000 + variable (20 × 700) = 14,000 + 14,000 = KES 28,000."
      ],
      "answer": "Variable KES 20/tray, fixed KES 14,000/month; a 700-tray month should cost about KES 28,000."
    },
    "compression": "Split a mixed cost from its highest and lowest activity levels: variable per unit is the change in cost over the change in units, and fixed is whatever is left once the variable part is stripped out at either level.",
    "forwardPointer": "When two points aren’t enough, linear regression (MA-12) fits a line through all of them; and the fixed/variable split you make here is what every flexible budget and cost variance later depends on.",
    "rateFlags": []
  }
  ,
  {
    conceptId: 'MA-06',
    title: 'Cost classification by nature, function and traceability',
    syllabusYear: '2026',
    shape: 'process',
    story:
      'The moment Wanjiku starts baking rather than only reselling, one question she never had to ask '
      + 'in retail arrives: what does a single mandazi actually cost? To answer it she has to sort every '
      + 'shilling she spends into kinds. The flour she can point to in the batch. The baker’s wages she '
      + 'can point to. But the rent, the supervisor, the electricity for the whole building — those are '
      + 'real costs that attach to no single mandazi. Sorting costs correctly is dull, but every costing '
      + 'method later stands on getting this sort right.',
    keypoints: [
      {
        title: 'Three ways to classify the same cost',
        body:
          '**By nature** — what the cost IS: **materials**, **labour**, or **expenses (overheads)**.\n'
          + '**By function** — what part of the business it serves: **production** costs versus '
          + '**non-production** costs (administration, selling & distribution, and finance costs).\n'
          + '**By traceability** — **direct** or **indirect** (next box). Every shilling carries all '
          + 'three labels at once — flour is materials, production, and direct.',
      },
      {
        title: 'Direct vs indirect (traceability), and prime cost',
        body:
          '**Direct costs** can be traced to one unit: **direct materials** (flour in the batch), '
          + '**direct labour** (the baker’s wages), direct expenses. Their total is the **prime cost**.\n'
          + '**Indirect costs = overheads**: real costs that cannot be traced to one unit — rent, the '
          + 'supervisor, building electricity.',
      },
      {
        title: 'Product costs vs period costs',
        body:
          '**Product costs** attach to the units made and sit in inventory until the units sell (materials, '
          + 'labour, production overhead). **Period costs** are charged in full to the period they arise in '
          + '(office rent, selling costs). The split decides what lands in closing inventory versus profit.',
      },
    ],
    worked: {
      prompt:
        'Classify each bakery cost as direct or indirect, and say whether it is part of prime cost: '
        + '(a) flour; (b) the baker’s wages; (c) the bakery’s rent; (d) the supervisor’s salary.',
      steps: [
        '(a) Flour — direct material → part of prime cost.',
        '(b) Baker’s wages — direct labour → part of prime cost.',
        '(c) Rent — indirect (overhead) → not prime cost.',
        '(d) Supervisor — indirect labour (overhead) → not prime cost.',
      ],
      answer:
        'Prime cost = flour + baker’s wages (the direct costs). Rent and the supervisor are overheads '
        + 'that must be attached to units by a separate step later.',
    },
    compression:
      'Costs are classified by traceability — direct (traceable to a unit; their total is prime cost) vs '
      + 'indirect/overheads — and by timing — product costs (into inventory) vs period costs (expensed '
      + 'now).',
    forwardPointer:
      'The overheads separated here are the ones that must be absorbed into unit cost (MA-23, MA-24), and '
      + 'the direct/indirect split is the fork between absorption and marginal costing.',
    rateFlags: [],
  },
  {
    conceptId: 'MA-07',
    title: 'Cost behaviour — fixed, variable, semi-variable, stepped',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'Classifying costs tells Wanjiku what a cost IS. Cost behaviour tells her what a cost DOES when she '
      + 'bakes more or less. This is the difference between a budget that survives contact with reality '
      + 'and one that does not — because some costs move with output and some sit still, and treating one '
      + 'like the other is how a bakery quietly prices itself into a loss.',
    keypoints: [
      {
        title: 'The four cost behaviours',
        body:
          '• **Fixed** — flat in total, whatever the output (rent). Falls **per unit** as volume rises.\n'
          + '• **Variable** — flat **per unit**, rising in total with output (flour).\n'
          + '• **Stepped fixed** — flat, then jumps at a threshold (one supervisor per eight bakers).\n'
          + '• **Semi-variable** — a fixed standing charge plus a variable part (electricity).',
      },
      {
        title: 'The relevant range, and the split that follows',
        body:
          'These patterns hold only within the **relevant range** — the band of activity the business '
          + 'actually operates in. And a **semi-variable** cost hides a fixed part and a variable part '
          + 'inside one bill, so before you can budget it you must split it (the next concept).',
      },
    ],
    worked: {
      prompt:
        'For each, name the behaviour and say what happens to the cost PER UNIT as Wanjiku bakes more: '
        + '(a) bakery rent; (b) flour; (c) the electricity bill.',
      steps: [
        '(a) Rent — fixed: total unchanged, so cost per mandazi FALLS as volume rises.',
        '(b) Flour — variable: cost per mandazi stays the same; total rises.',
        '(c) Electricity — semi-variable: a fixed standing charge (per-unit share falls) plus a variable part (per-unit share steady).',
      ],
      answer:
        'Rent is fixed (per-unit falls), flour is variable (per-unit steady), electricity is '
        + 'semi-variable (a bit of both) — and the semi-variable one must be split before budgeting.',
    },
    compression:
      'Costs behave as fixed (flat in total, falling per unit), variable (flat per unit, rising in '
      + 'total), stepped fixed (jumps at thresholds) or semi-variable (fixed + variable) — all within a '
      + 'relevant range.',
    forwardPointer:
      'Semi-variable costs are split into their fixed and variable halves by the high-low method (MA-11); '
      + 'cost behaviour then drives CVP analysis and the flexing of budgets (MA-43).',
    rateFlags: [],
  }
  ,
  {
    conceptId: 'MA-01',
    title: 'Purpose of management accounting information',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'Financial accounting can tell Wanjiku exactly what last month cost, to the last shilling. It '
      + 'cannot tell her whether to open the bakery. That gap is the whole reason a second kind of '
      + 'accounting exists. Financial accounting faces backwards and speaks to outsiders under fixed '
      + 'rules; management accounting faces forwards and speaks only to the manager, with no prescribed '
      + 'format at all — because its single test is not "is it correct to a standard?" but "did it help '
      + 'you decide?"',
    keypoints: [
      {
        title: 'What management accounting is for',
        body:
          'It produces information to **plan** (set targets and budgets), **control** (compare actual '
          + 'against plan and correct the difference), and **decide** (choose between options) — always '
          + 'for managers inside the business, always pointed at the next choice.',
      },
      {
        title: 'How it differs from financial accounting',
        body:
          '**Financial accounting**: backward-looking, for outsiders, in a fixed format set by law and '
          + 'IFRS. **Management accounting**: forward-looking, for the manager, in whatever format helps '
          + '— no external rules, no audit, no prescribed layout. Its only test is usefulness to a decision.',
      },
    ],
    worked: {
      prompt:
        'Which kind of accounting answers each? (a) What was the stall’s profit last year? (b) Should '
        + 'Wanjiku open the bakery? (c) What price should a new mandazi be? (d) What must the published '
        + 'accounts show the tax authority?',
      steps: [
        '(a) A record of the past for outsiders → financial accounting.',
        '(b) A forward choice between options → management accounting.',
        '(c) A pricing decision about the future → management accounting.',
        '(d) External reporting under fixed rules → financial accounting.',
      ],
      answer: 'Financial accounting answers (a) and (d); management accounting answers (b) and (c) — the forward choices.',
    },
    compression:
      'Management accounting produces information to plan, control and decide, for managers inside the '
      + 'business — forward-looking and format-free, unlike backward-looking, rule-bound financial '
      + 'accounting; its only test is whether it helped the decision.',
    forwardPointer:
      'This splits into the planning-control-decision cycle (MA-03) and the cost techniques that feed '
      + 'it (MA-02 onward) — the machinery the rest of the paper builds.',
    rateFlags: [],
  }
];

export default MA_LESSONS;
