// MA topic pages (Brief §6.3, rubric Execution Order §5A — Amendment A6). Converted from the MA
// concept lessons (MA-01; MA-06/07; MA-11). Questions still tag to concepts.

export const MA_TOPICS = [
  {
    topicId: 'MA A1', paper: 'MA', syllabusYear: '2026',
    title: 'The purpose of management accounting',
    nutshell:
      'Financial accounting tells you what last month cost, to the shilling. It cannot tell you whether to open the bakery. That gap is why management accounting exists.\n'
      + '**Management accounting produces information to:**\n'
      + '• **plan** — set targets and budgets;\n'
      + '• **control** — compare actual against plan and correct the difference;\n'
      + '• **decide** — choose between options.\n'
      + 'Always for managers **inside** the business, always pointed at the next choice. Its single test is not '
      + '"is it correct to a standard?" but **"did it help you decide?"**',
    examReadiness:
      '• Classify a scenario as financial vs management accounting. **Financial**: backward-looking, for outsiders, fixed format (law + IFRS), audited. **Management**: forward-looking, for the manager, any useful format, no external rules.\n'
      + '• Trap: management accounting has **no prescribed format and no audit** — a one-off decision report still counts.\n'
      + '• Publishing statutory accounts for the tax authority is financial accounting, not management accounting.',
    worked: {
      prompt: 'Which kind of accounting answers each? (a) What was the stall’s profit last year? (b) Should Wanjiku open the bakery? (c) What price for a new mandazi? (d) What must the published accounts show the tax authority?',
      steps: [
        '(a) A record of the past for outsiders → financial accounting.',
        '(b) A forward choice between options → management accounting.',
        '(c) A pricing decision about the future → management accounting.',
        '(d) External reporting under fixed rules → financial accounting.',
      ],
      answer: 'Financial answers (a) and (d); management answers (b) and (c) — the forward choices.',
    },
    rateFlags: [],
  },
  {
    topicId: 'MA A3', paper: 'MA', syllabusYear: '2026',
    title: 'Cost classification and cost behaviour',
    nutshell:
      'Before you can cost a single mandazi you must sort every shilling, and know how each cost MOVES with output.\n'
      + '**Classification (three labels at once):**\n'
      + '• **By nature** — materials, labour, or expenses (overheads).\n'
      + '• **By function** — production vs non-production (admin, selling & distribution, finance).\n'
      + '• **By traceability** — **direct** (traceable to one unit) vs **indirect (overheads)**. The total of direct costs is the **prime cost**.\n'
      + '**Product vs period:** product costs (materials, labour, production overhead) sit in **inventory** until sold; period costs (office rent, selling) are **expensed now**.\n'
      + '**Behaviour (how a cost moves with output):**\n'
      + '• **Fixed** — flat in total; **falls per unit** as volume rises.\n'
      + '• **Variable** — flat **per unit**; rises in total.\n'
      + '• **Stepped fixed** — flat, then jumps at a threshold.\n'
      + '• **Semi-variable** — a fixed standing charge plus a variable part.\n'
      + 'All only within the **relevant range**.',
    examReadiness:
      '• **Prime cost = direct costs only** — never add overheads or period costs to it.\n'
      + '• Per-unit behaviour is the favourite trap: **fixed cost per unit FALLS** as output rises; **variable cost per unit stays constant**.\n'
      + '• A **semi-variable** cost must be **split** before you can budget it (that’s the high-low method, topic B2).\n'
      + '• Product vs period decides what lands in closing inventory versus this period’s profit.',
    worked: {
      prompt: 'Classify each bakery cost as direct or indirect, and say whether it is part of prime cost: (a) flour; (b) the baker’s wages; (c) the bakery’s rent; (d) the supervisor’s salary.',
      steps: [
        '(a) Flour — direct material → part of prime cost.',
        '(b) Baker’s wages — direct labour → part of prime cost.',
        '(c) Rent — indirect (overhead) → not prime cost.',
        '(d) Supervisor — indirect labour (overhead) → not prime cost.',
      ],
      answer: 'Prime cost = flour + baker’s wages (the direct costs). Rent and the supervisor are overheads, attached to units by a later step.',
    },
    rateFlags: [],
  },
  {
    topicId: 'MA B2', paper: 'MA', syllabusYear: '2026',
    title: 'The high-low method',
    nutshell:
      'A **semi-variable** cost (a fixed standing charge plus a variable part — e.g. electricity) hides two behaviours in one bill. With only monthly totals, the high-low method splits it from just two data points.\n'
      + '**Take the highest and lowest ACTIVITY levels** (not the highest and lowest cost):\n'
      + '  **Variable cost per unit = (cost at highest activity − cost at lowest activity) ÷ (highest units − lowest units)**\n'
      + 'Then, at either level:\n'
      + '  **Fixed cost = total cost − (variable cost per unit × units)**\n'
      + 'Forecast any level as fixed + variable × units.',
    examReadiness:
      '• Pick the extreme **activity** rows even if another row has a higher **cost** — that swap is the commonest trap.\n'
      + '• High-low assumes **one straight line** across the range, so it "quietly lies" if there’s a **stepped fixed cost** or a one-off **outlier**.\n'
      + '• Show the working: change in cost ÷ change in activity, then back out the fixed cost at one point (and check at the other).',
    worked: {
      prompt: 'Busy month: 900 trays cost KES 32,000. Quiet month: 500 trays cost KES 24,000. Split the bill, then predict a 700-tray month.',
      steps: [
        'Variable per tray = (32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20.',
        'Fixed = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000 (check: 24,000 − 20×500 = 14,000 ✓).',
        'Forecast at 700 trays = 14,000 + (20 × 700) = 14,000 + 14,000 = KES 28,000.',
      ],
      answer: 'Variable KES 20/tray, fixed KES 14,000/month; a 700-tray month ≈ KES 28,000.',
    },
    rateFlags: [],
  },
];

export default MA_TOPICS;
