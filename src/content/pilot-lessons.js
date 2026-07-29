// pilot-lessons.js — five full-quality pilot lessons for WP2a format review (Brief §6.3).
//
// Voice and characters adapted from Wanjiku Volume I (the narrative spine): Wanjiku builds a
// business in Nairobi from a soda-and-sweets kibanda to a limited company; Otieno runs the stall;
// the soda distributor, the county askari and the Kenya Revenue Authority are recurring
// stakeholders. Each lesson: a story beat → keypoint boxes (the load-bearing formulas/rules) →
// one worked example → the one-breath compression → a forward pointer to where the concept
// matures. The five deliberately stress different shapes: theory, calculation, double entry,
// treatment/rule, and interpretation.

/** @type {import('../engine/lessons.js').default[]} */
export const PILOT_LESSONS = [
  // ── 1. BT theory ──────────────────────────────────────────────────────────
  {
    conceptId: 'BT-04',
    title: 'Stakeholder power, interest and conflict',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'Within a month of opening her kibanda near Gikomba, Wanjiku discovers she is surrounded by '
      + 'people who care what she does. Her customers want the lowest price. The soda distributor '
      + 'wants prompt payment or he stops delivering. The county askari wants the licence fee on '
      + 'time. The Kenya Revenue Authority wants its sales tax — a stakeholder, she is warned, with '
      + 'infinite patience. Her cousin wants her to turn the stall into a partnership. Every one of '
      + 'them affects, or is affected by, the business — and they want different, often conflicting, '
      + 'things. She cannot please them all at once. So the real skill is not keeping everyone happy; '
      + 'it is knowing whose claim to answer first. Mendelow gives her the map.',
    keypoints: [
      {
        title: "Stakeholders and Mendelow's matrix",
        body:
          'A **stakeholder** is anyone who affects or is affected by the organisation. Map each one on '
          + 'two axes — **power** (can they force your hand?) and **interest** (do they care about this '
          + 'decision?):\n'
          + '• High power + high interest → **key players**: manage closely.\n'
          + '• High power + low interest → **keep satisfied**.\n'
          + '• Low power + high interest → **keep informed**.\n'
          + '• Low power + low interest → **minimal effort**.\n'
          + 'The quadrant sets the management effort — nothing else.',
      },
      {
        title: 'Stakeholder conflict is resolved by priority, not by pleasing everyone',
        body:
          'Because claims conflict (customers want low prices; the distributor wants prompt, i.e. more '
          + 'expensive, payment), you cannot satisfy them all. You **prioritise** by power and interest, '
          + 'and accept that answering one claim disappoints another. That trade-off IS stakeholder '
          + 'management.',
      },
    ],
    worked: {
      prompt:
        "Place four of Wanjiku's stakeholders on Mendelow's matrix and state how she should manage "
        + 'each: (a) the Kenya Revenue Authority, (b) a single walk-up customer, (c) the sole soda '
        + 'distributor who supplies her street, (d) a neighbour who dislikes the queue outside.',
      steps: [
        'KRA — high power (can close her down), high interest (wants every sale taxed) → key player → manage closely, comply fully.',
        'A single customer — low power (one of hundreds), high interest (cares about price) → keep informed (fair prices, clear signage).',
        'The sole distributor — high power (only supplier on the street), lower day-to-day interest in her particular stall → keep satisfied (pay promptly to keep supply).',
        'The neighbour — low power, low interest → minimal effort (a courtesy, no more).',
      ],
      answer:
        'Key player: KRA. Keep satisfied: the distributor. Keep informed: the customer. Minimal '
        + 'effort: the neighbour. The same four names would sit in different quadrants for a different '
        + 'decision — the matrix is read per decision, not once forever.',
    },
    compression:
      'Stakeholders affect or are affected by the business, want conflicting things, and are managed '
      + 'by mapping their power against their interest — key players managed closely, the powerful kept '
      + 'satisfied, the interested kept informed, the rest minimal effort.',
    forwardPointer:
      'This matrix grows up in SBL, where the same power/interest map governs board-level decisions '
      + 'and every stakeholder-conflict question in strategic governance.',
    rateFlags: [],
  },

  // ── 2. MA calculation ─────────────────────────────────────────────────────
  {
    conceptId: 'MA-11',
    title: 'The high-low method',
    syllabusYear: '2026',
    shape: 'calculation',
    story:
      'Wanjiku opens a small bakery behind the shop — mandazi and bread. The first bill that puzzles '
      + 'her is electricity. In a quiet month it costs less; in a busy month, more — but it never '
      + 'falls to zero, because the fridge and the lights run regardless. This is a **semi-variable '
      + 'cost**: a fixed standing charge plus a variable amount that rises with how much she bakes. To '
      + 'budget, and later to price a single mandazi, she must split that one bill into its fixed and '
      + 'variable halves. With only the monthly totals to go on, the high-low method does it from just '
      + 'two data points — the busiest month and the quietest.',
    keypoints: [
      {
        title: 'High-low method',
        body:
          'Take the **highest and lowest activity** levels (not the highest and lowest cost):\n'
          + '  Variable cost per unit = (cost at highest activity − cost at lowest activity) ÷ '
          + '(highest units − lowest units)\n'
          + 'Then, at either level:\n'
          + '  Fixed cost = total cost − (variable cost per unit × units)\n'
          + 'Crude but everywhere — and the exam’s favourite warm-up.',
      },
      {
        title: 'Two traps',
        body:
          'Pick the extreme **activity** rows, even if another row has a higher cost. And if the cost '
          + 'structure changes over the range (a **stepped** fixed cost — say a second oven switched on) '
          + 'or a row is a one-off outlier, high-low quietly lies: it assumes one straight line across '
          + 'the whole range.',
      },
    ],
    worked: {
      prompt:
        'Two months of the bakery’s electricity: a busy month baked 900 trays and cost KES 32,000; a '
        + 'quiet month baked 500 trays and cost KES 24,000. Split the bill, then predict the cost of a '
        + 'month baking 700 trays.',
      steps: [
        'Variable cost per tray = (32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20 per tray.',
        'Fixed cost = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000 per month (check at the low point: 24,000 − 20×500 = 14,000 ✓).',
        'Forecast at 700 trays = fixed 14,000 + variable (20 × 700) = 14,000 + 14,000 = KES 28,000.',
      ],
      answer:
        'Variable KES 20/tray, fixed KES 14,000/month; a 700-tray month should cost about KES 28,000.',
    },
    compression:
      'Split a mixed cost from its highest and lowest activity levels: variable per unit is the change '
      + 'in cost over the change in units, and fixed is whatever is left once the variable part is '
      + 'stripped out at either level.',
    forwardPointer:
      'When two points aren’t enough, linear regression (MA-12) fits a line through all of them; and '
      + 'the fixed/variable split you make here is what every flexible budget and cost variance later '
      + 'depends on.',
    rateFlags: [],
  },

  // ── 3. FA double entry ────────────────────────────────────────────────────
  {
    conceptId: 'FA-26',
    title: 'Depreciation methods and the annual charge',
    syllabusYear: '2026',
    shape: 'double-entry',
    story:
      'Wanjiku buys a fridge for KES 40,000. Unlike the sodas inside it, the fridge is not for resale '
      + '— it will earn sales for years. The accruals concept insists its cost be matched against those '
      + 'years, not dumped into the month she bought it. That spreading is **depreciation**. It is not '
      + 'a valuation and not a cash payment; it is last year’s asset being turned, slice by slice, into '
      + 'this year’s expense. Each slice needs a home in the books, and depreciation has a fixed double '
      + 'entry that never changes, whatever the method.',
    keypoints: [
      {
        title: 'Depreciation — the two methods',
        body:
          '**Straight-line**: (cost − residual value) ÷ useful life — equal slices every year.\n'
          + '**Reducing balance**: a fixed % of the carrying amount each year — big slices early, '
          + 'shrinking after.\n'
          + '**Carrying amount = cost − accumulated depreciation** = unexpired cost, NOT market value. '
          + 'Land is not depreciated; buildings are.',
      },
      {
        title: 'The double entry (identical for either method)',
        body:
          'Each year:\n'
          + '  **Dr Depreciation expense** (statement of profit or loss)\n'
          + '  **Cr Accumulated depreciation** (a contra-asset in the statement of financial position)\n'
          + 'The asset’s original cost is never touched; accumulated depreciation builds up beside it, '
          + 'and the difference is the carrying amount.',
      },
    ],
    worked: {
      prompt:
        'The fridge costs KES 40,000, has an estimated residual value of KES 4,000 and a useful life '
        + 'of 6 years. Using straight-line, give the annual charge, the journal, and the carrying '
        + 'amount at the end of year 2.',
      steps: [
        'Annual charge = (40,000 − 4,000) ÷ 6 = 36,000 ÷ 6 = KES 6,000 per year.',
        'Each year-end journal: Dr Depreciation expense 6,000 / Cr Accumulated depreciation 6,000.',
        'After 2 years: accumulated depreciation = 2 × 6,000 = 12,000.',
        'Carrying amount = cost 40,000 − accumulated 12,000 = KES 28,000 (what is left to charge, not what a buyer would pay).',
      ],
      answer:
        'KES 6,000 a year; Dr Depreciation expense / Cr Accumulated depreciation 6,000; carrying '
        + 'amount KES 28,000 at the end of year 2.',
    },
    compression:
      'Depreciation matches an asset’s cost to the years it serves — straight-line in equal slices or '
      + 'reducing-balance in shrinking ones — booked every year as Dr depreciation expense, Cr '
      + 'accumulated depreciation, leaving a carrying amount that is unexpired cost, not market value.',
    forwardPointer:
      'Depreciation returns in FR as the **revaluation model** and **impairment** (FR-S01, FR-S02): '
      + 'the carrying amount you compute here is exactly where FR starts when it lets the asset be '
      + 'revalued or written down.',
    rateFlags: [
      'Useful life and residual value are management estimates, not statutory figures — review them '
      + 'at each annual syllabus/standards check.',
    ],
  },

  // ── 4. FA treatment / rule ────────────────────────────────────────────────
  {
    conceptId: 'FA-22',
    title: 'Cost and net realisable value',
    syllabusYear: '2026',
    shape: 'treatment',
    story:
      'At year end Wanjiku counts the stock still on her shelves. Most of it is fine. But one crate of '
      + 'sodas got water-damaged in the rains, and a line of sweets has passed the fashion for them — '
      + 'she will have to slash the price to shift them. She paid good money for all of it. The '
      + 'question the accounts force on her is blunt: carry the stock at what it cost, or at what it '
      + 'can now actually fetch? Prudence answers: never carry stock above what it can bring in. That '
      + 'is the lower-of-cost-and-NRV rule — and the trap is that it is applied line by line, not to '
      + 'the pile as a whole.',
    keypoints: [
      {
        title: 'Inventory at the lower of cost and NRV (IAS 2)',
        body:
          'Inventory is valued at the **lower of cost and net realisable value**.\n'
          + '  **NRV = expected selling price − costs to complete − costs to sell.**\n'
          + 'Prudence: an asset is never carried above what it can realise. If NRV < cost, write the '
          + 'item down to NRV (the write-down raises cost of sales and lowers profit); if NRV ≥ cost, '
          + 'leave it at cost.',
      },
      {
        title: 'Apply it item by item — not to the total',
        body:
          'The rule is applied to each line (or group of similar items) **separately**. You may NOT '
          + 'offset a profit expected on one line against a loss on another by comparing total cost with '
          + 'total NRV — that would hide the loss the standard is designed to surface.',
      },
    ],
    worked: {
      prompt:
        'Three inventory lines at year end. A: cost 10,000, NRV 12,000. B: cost 8,000, NRV 5,000. '
        + 'C: cost 6,000, NRV 6,500. At what total should inventory be carried?',
      steps: [
        'Line A: lower of 10,000 and 12,000 = 10,000.',
        'Line B: lower of 8,000 and 5,000 = 5,000 (a write-down of 3,000 hits cost of sales).',
        'Line C: lower of 6,000 and 6,500 = 6,000.',
        'Total = 10,000 + 5,000 + 6,000 = KES 21,000.',
        'Contrast the wrong way: total cost 24,000 vs total NRV 23,500 would say 23,500 — hiding B’s loss behind A’s expected profit. Item-by-item gives the prudent 21,000.',
      ],
      answer:
        'KES 21,000, applying the lower of cost and NRV line by line — not the KES 23,500 a total-'
        + 'versus-total comparison would wrongly give.',
    },
    compression:
      'Value inventory at the lower of cost and net realisable value (selling price less costs to '
      + 'complete and sell), applied item by item so a loss on one line is never buried under a '
      + 'profit expected on another.',
    forwardPointer:
      'The same prudence and lower-of rule return in FR for inventories and, at Skills level, for '
      + 'biological assets (FR-S15).',
    rateFlags: [],
  },

  // ── 5. FA interpretation / integration ────────────────────────────────────
  {
    conceptId: 'FA-63',
    title: 'Liquidity and efficiency ratios',
    syllabusYear: '2026',
    shape: 'interpretation',
    story:
      'Wanjiku Ltd is profitable — and nearly misses payroll. Profit is opinion; cash is fact, and the '
      + 'two diverge. When she asks the bank for an overdraft, the manager does not care about her '
      + 'profit alone; he wants to know whether she can pay her bills as they fall due. He reaches for '
      + 'liquidity and efficiency ratios — the reader’s toolkit for short-term health. On their own the '
      + 'numbers say nothing; against last year, or against a rival, they start to talk.',
    keypoints: [
      {
        title: 'Liquidity ratios',
        body:
          '**Current ratio = current assets ÷ current liabilities** — can short-term assets cover '
          + 'short-term debts?\n'
          + '**Quick (acid-test) ratio = (current assets − inventory) ÷ current liabilities** — the same '
          + 'test with the slowest asset stripped out, for businesses that cannot sell stock quickly.',
      },
      {
        title: 'Efficiency ratios and the cash operating cycle',
        body:
          '**Inventory days = inventory ÷ cost of sales × 365.**\n'
          + '**Receivables days = receivables ÷ credit sales × 365.**\n'
          + '**Payables days = payables ÷ credit purchases × 365.**\n'
          + '**Cash operating cycle = inventory days + receivables days − payables days** — the days '
          + 'between paying for stock and collecting from customers. Longer cycle → more cash tied up.',
      },
      {
        title: 'A ratio alone says nothing',
        body:
          'Always interpret against a benchmark — prior year or a competitor. A high current ratio can '
          + 'mean healthy cover OR idle cash and bloated, unsellable inventory. The number raises the '
          + 'question; the comparison and context answer it.',
      },
    ],
    worked: {
      prompt:
        'Wanjiku Ltd: current assets KES 300,000 (including inventory 120,000), current liabilities '
        + '150,000, cost of sales 600,000. Compute the current ratio, the quick ratio, and inventory '
        + 'days, and say what they suggest.',
      steps: [
        'Current ratio = 300,000 ÷ 150,000 = 2.0 (KES 2 of current assets per KES 1 of current liabilities).',
        'Quick ratio = (300,000 − 120,000) ÷ 150,000 = 180,000 ÷ 150,000 = 1.2.',
        'Inventory days = 120,000 ÷ 600,000 × 365 ≈ 73 days of stock held.',
        'Reading: cover looks comfortable (quick ratio above 1), but ~73 days of inventory is a lot for a bakery/retail mix — worth comparing with last year to see if stock is piling up.',
      ],
      answer:
        'Current 2.0, quick 1.2, inventory ~73 days — solid short-term cover, but the inventory days '
        + 'invite a comparison before drawing conclusions.',
    },
    compression:
      'Liquidity ratios (current, and quick with inventory stripped out) test whether short-term assets '
      + 'cover short-term debts; efficiency ratios turn inventory, receivables and payables into days to '
      + 'reveal the cash operating cycle — and no ratio means anything until compared with last year or a '
      + 'rival.',
    forwardPointer:
      'In FR this interpretation becomes an art (FR-S08); in FM the working-capital cycle becomes a '
      + 'lever to manage (FM-S02). It also sits beside MA’s performance measures (MA-61). This lesson is '
      + 'the on-ramp.',
    rateFlags: [
      'Ratios use a 365-day year here; some syllabi/answers use 360 — confirm the convention at the '
      + 'annual check.',
    ],
  },
];

export default PILOT_LESSONS;
