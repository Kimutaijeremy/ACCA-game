// FA topic pages (Brief §6.3, rubric Execution Order §5A — Amendment A6). Converted from the FA
// concept lessons (FA-04/05; FA-11; FA-13; FA-22; FA-26; FA-63). Questions still tag to concepts.

export const FA_TOPICS = [
  {
    topicId: 'FA A3', paper: 'FA', syllabusYear: '2026',
    title: 'The elements and the accounting equation',
    nutshell:
      'Everything in FA is built from five defined words and one identity.\n'
      + '**The five elements:**\n'
      + '• **Asset** — a resource the business controls from a past event, expected to bring future benefit.\n'
      + '• **Liability** — a present obligation from a past event, expected to cause an outflow.\n'
      + '• **Equity** — the **residual**: assets − liabilities (what the business owes its owner).\n'
      + '• **Income** — an increase in economic benefit; **Expense** — a decrease.\n'
      + '**The accounting equation: Assets = Capital + Liabilities.** The business is a **separate entity** that '
      + 'owes its owner (capital) and outsiders (liabilities). Capital **grows** with profit/new capital, **shrinks** '
      + 'with losses/drawings. Every transaction has **two equal and opposite effects (duality)**, so the equation never tips.',
    examReadiness:
      '• Know the definitions precisely — asset vs liability, and that **equity is a residual**, never measured directly.\n'
      + '• Trap: **capital is owed to the owner → it is equity, not a liability** to an outsider.\n'
      + '• Every transaction keeps A = C + L balanced; show both effects.\n'
      + '• The accounting equation is deliberately tested sparingly — expect it as recognition, not a whole question.',
    worked: {
      prompt: 'Show the equation after each step: (1) Wanjiku pays in KES 20,000 capital; (2) she buys stock for KES 12,000 cash.',
      steps: [
        'Start: Assets (cash 20,000) = Capital 20,000 + Liabilities 0. ✓',
        'Buy stock for cash: cash −12,000, inventory +12,000 → Assets = cash 8,000 + inventory 12,000 = 20,000.',
        'After step 2: Assets 20,000 = Capital 20,000 + Liabilities 0 — one asset became another, still balanced.',
      ],
      answer: 'Assets 20,000 (cash 8,000 + inventory 12,000) = Capital 20,000 + Liabilities 0. The equation held throughout.',
    },
    deeper: [
      {
        heading: 'The five elements, defined precisely',
        conceptIds: ['FA-04'],
        body:
          'Everything in FA is assembled from five words, so they must mean exactly one thing each.\n'
          + '• **Asset** — a resource the business **controls** as a result of a **past event**, from which **future economic benefit** is expected. Control and a past event both matter: goods you might buy next week are not yet an asset.\n'
          + '• **Liability** — a **present obligation** from a past event, expected to cause an **outflow** of benefit. An unpaid supplier bill qualifies; a plan to spend next year does not.\n'
          + '• **Equity** — the **residual**: assets − liabilities. You never measure it directly; it is what is left for the owner once outsiders are paid.\n'
          + '• **Income** — an increase in economic benefit (revenue, gains).\n'
          + '• **Expense** — a decrease in economic benefit (costs, losses).\n'
          + 'The commonest confusions: cash received in advance is an **asset plus a liability** (you owe the goods), not income yet; and **capital is equity, not a liability** — it is owed to the owner, who is the residual claimant, not an outside creditor.',
      },
      {
        heading: 'The accounting equation and duality',
        conceptIds: ['FA-05'],
        body:
          'The business is treated as a **separate entity** from its owner. So when Wanjiku puts in KES 20,000, the *business* holds the cash but **owes it back to her** — that stake is **capital**. Hence **Assets = Capital + Liabilities**: what the business controls equals what it owes the owner plus what it owes outsiders.\n'
          + 'Capital **rises** with profit and new capital, **falls** with losses and drawings. The equation has held after every transaction ever recorded because of **duality**: every transaction has **two equal and opposite effects**. Buy stock for cash and one asset (cash) simply becomes another (inventory) — totals unchanged. Take a loan and both an asset (cash) and a liability (the loan) rise by the same amount. This two-sidedness is the seed of double entry (topic C1) and why the statement of financial position always balances.',
      },
    ],
    rateFlags: [],
  },
  {
    topicId: 'FA C1', paper: 'FA', syllabusYear: '2026',
    title: 'Duality and the double-entry principle',
    nutshell:
      '**Debit and credit are just left and right** — not good and bad, and the opposite of what a bank statement means. Every transaction touches two accounts, one on each side, by equal amounts.\n'
      + '**DEAD CLIC** — which side increases what:\n'
      + '• **Debits increase: Expenses, Assets, Drawings.**\n'
      + '• **Credits increase: Liabilities, Income, Capital.**\n'
      + '(Each decreases on the opposite side.) Because every transaction has two equal effects, **total debits always equal total credits** — the balance the trial balance later relies on.',
    examReadiness:
      '• Be able to give the two entries for any transaction, e.g. Dr Inventory / Cr Cash for a cash purchase.\n'
      + '• Trap: unlearn the bank-statement meaning — a debit here is not "money out".\n'
      + '• A single-sided entry (a missing debit or credit) breaks duality and the trial balance will not agree.\n'
      + '• Watch reversed-entry distractors — the accounts are right but the sides are swapped.',
    worked: {
      prompt: 'Give the two entries for each: (a) buys inventory for KES 12,000 cash; (b) makes a credit sale of KES 9,000.',
      steps: [
        '(a) Inventory (asset) rises → Dr Inventory 12,000. Cash (asset) falls → Cr Cash 12,000. Debits = Credits ✓.',
        '(b) A receivable (asset) rises → Dr Receivables 9,000. Sales (income) rises → Cr Sales 9,000. ✓',
      ],
      answer: '(a) Dr Inventory / Cr Cash 12,000. (b) Dr Receivables / Cr Sales 9,000 — one debit and one credit of equal size each time.',
    },
    deeper: [
      {
        heading: 'Debits, credits, and DEAD CLIC',
        conceptIds: ['FA-11'],
        body:
          'First, unlearn the bank statement. There, "debit" means money leaving your account — because the bank is describing *its* books, where you are a liability to it. In your own bookkeeping, **debit just means the left side of an account and credit the right side**; neither is good or bad.\n'
          + 'Which side *increases* an account depends on what kind of account it is — **DEAD CLIC**:\n'
          + '• **DEAD** — **D**ebits increase **E**xpenses, **A**ssets, **D**rawings.\n'
          + '• **CLIC** — **C**redits increase **L**iabilities, **I**ncome, **C**apital.\n'
          + 'Each type decreases on the opposite side (an asset falls with a credit; a liability falls with a debit).\n'
          + 'To post a transaction, name the two accounts and ask, for each, "up or down, and what type?" Cash purchase of stock: inventory (asset) up → **Dr Inventory**; cash (asset) down → **Cr Cash**. Because every transaction moves two accounts by equal amounts, **total debits always equal total credits** — the self-check the trial balance later relies on. Watch two traps: a reversed entry (right accounts, wrong sides) and a one-sided entry (a missing half), which breaks the balance.',
      },
    ],
    rateFlags: [],
  },
  {
    topicId: 'FA C2', paper: 'FA', syllabusYear: '2026',
    title: 'Books of prime entry',
    nutshell:
      'Every transaction is first written into a **book of prime entry** — a sorted intake desk — then posted, in **totals**, to the ledger.\n'
      + '**The seven books:**\n'
      + '• **Sales day book** — credit sales.\n'
      + '• **Sales returns day book** — goods customers send back.\n'
      + '• **Purchases day book** — credit purchases.\n'
      + '• **Purchases returns day book** — goods returned to suppliers.\n'
      + '• **Cash book** — all money in and out.\n'
      + '• **Petty cash book** — small cash payments (imprest system).\n'
      + '• **The journal** — everything odd: corrections, year-end adjustments, opening and non-routine items.\n'
      + '**Flow:** source document → book of prime entry → posted in totals to the **nominal (general) ledger**, with individual balances kept in the **memorandum receivables/payables ledgers**.',
    examReadiness:
      '• Match a transaction to its book — the commonest question.\n'
      + '• Trap (a known content failure): there are **SEVEN** books — don’t forget the **sales returns** and **purchases returns** day books.\n'
      + '• Year-end adjustments (e.g. depreciation) go to the **journal**, because they fit none of the routine day books.\n'
      + '• Books of prime entry are a listing stage — NOT yet the double-entry ledger.',
    worked: {
      prompt: 'Into which book does each go? (a) sold goods on credit; (b) a customer returns credit-bought goods; (c) bought sodas on credit; (d) returned a spoiled batch to the supplier; (e) paid electricity by M-Pesa; (f) recorded year-end depreciation; (g) bought stamps from the float.',
      steps: [
        '(a) Credit sale → sales day book. (b) Return from a credit customer → sales returns day book.',
        '(c) Credit purchase → purchases day book. (d) Return to a supplier → purchases returns day book.',
        '(e) Money out → cash book. (f) Year-end adjustment → the journal. (g) Small cash from the float → petty cash book.',
      ],
      answer: 'The seven in turn — note (f) goes to the journal precisely because it fits none of the routine day books.',
    },
    deeper: [
      {
        heading: 'The intake desk: seven books, then the ledger',
        conceptIds: ['FA-13'],
        body:
          'If every transaction were posted straight into the double-entry ledger as it happened, errors would scatter everywhere. So accounting inserts a calm first step: each transaction is written first into a **book of prime entry** — sorted by type — and only later posted, in **totals**, to the ledger.\n'
          + 'There are **seven**:\n'
          + '• **Sales day book** — credit sales of goods.\n'
          + '• **Sales returns day book** — goods credit customers send back.\n'
          + '• **Purchases day book** — credit purchases of goods.\n'
          + '• **Purchases returns day book** — goods you return to suppliers.\n'
          + '• **Cash book** — all money in and out through bank/cash.\n'
          + '• **Petty cash book** — small cash payments, run on the imprest system.\n'
          + '• **The journal** — everything odd: corrections, year-end adjustments (e.g. depreciation), opening entries, non-routine items.\n'
          + 'The exam loves two things: forgetting the **two returns day books** (people wrongly say "five books"), and knowing the **flow** — source document → book of prime entry → posted in **totals** to the **nominal (general) ledger**, with individual customer/supplier balances kept alongside in the **memorandum receivables and payables ledgers**. A book of prime entry is a *listing* stage; it is not yet the double entry.',
      },
    ],
    rateFlags: [],
  },
  {
    topicId: 'FA D3', paper: 'FA', syllabusYear: '2026',
    title: 'Inventory: cost and net realisable value',
    nutshell:
      'Inventory is valued at the **lower of cost and net realisable value (IAS 2)** — prudence: never carry stock above what it can realise.\n'
      + '  **NRV = expected selling price − costs to complete − costs to sell.**\n'
      + 'If **NRV < cost**, write the item down to NRV (the write-down raises cost of sales and lowers profit). If **NRV ≥ cost**, leave it at cost — you never write inventory UP.\n'
      + 'Apply the rule **item by item** (or by group of similar items), never to the total pile.',
    examReadiness:
      '• The headline trap: apply lower-of **line by line**, NOT total cost vs total NRV — a total comparison lets a profit on one line hide a loss on another.\n'
      + '• NRV subtracts BOTH costs to complete AND costs to sell from selling price.\n'
      + '• A write-down hits cost of sales; you never revalue inventory above cost.',
    worked: {
      prompt: 'Three lines: A cost 10,000 / NRV 12,000; B cost 8,000 / NRV 5,000; C cost 6,000 / NRV 6,500. At what total is inventory carried?',
      steps: [
        'Line A: lower of 10,000 and 12,000 = 10,000.',
        'Line B: lower of 8,000 and 5,000 = 5,000 (a 3,000 write-down to cost of sales).',
        'Line C: lower of 6,000 and 6,500 = 6,000.',
        'Total = 10,000 + 5,000 + 6,000 = KES 21,000 — not the 23,500 a total-vs-total comparison would wrongly give.',
      ],
      answer: 'KES 21,000, applying lower of cost and NRV line by line.',
    },
    deeper: [
      {
        heading: 'Lower of cost and NRV — and why line by line',
        conceptIds: ['FA-22'],
        body:
          'Prudence says an asset is never carried above what it can actually realise. So inventory (IAS 2) is held at the **lower of cost and net realisable value**.\n'
          + '**NRV = expected selling price − costs to complete − costs to sell.** Subtract BOTH: if goods need a KES 3,000 repair and KES 1,000 to sell before fetching KES 21,000, NRV is KES 17,000, not 21,000.\n'
          + 'Then compare, per line: if **NRV < cost**, write the item down to NRV (the write-down increases cost of sales and lowers profit); if **NRV ≥ cost**, leave it at cost — you **never** write inventory *up* above cost.\n'
          + 'The rule is applied **item by item** (or by group of similar items), and this is the point examiners test. Comparing *total* cost with *total* NRV would let an expected profit on one line silently offset a loss on another — hiding exactly the loss prudence exists to surface. Line by line, a good line stays at cost and a bad line is written down, so every loss is recognised in full and no profit is anticipated.',
      },
    ],
    rateFlags: [],
  },
  {
    topicId: 'FA D5', paper: 'FA', syllabusYear: '2026',
    title: 'Depreciation',
    nutshell:
      'Depreciation spreads a non-current asset’s cost over the years it serves (accruals) — it is **not** a valuation or a cash payment.\n'
      + '**Two methods:**\n'
      + '• **Straight-line**: (cost − residual value) ÷ useful life — equal slices.\n'
      + '• **Reducing balance**: a fixed % of the carrying amount each year — big slices early, shrinking after.\n'
      + '**Carrying amount = cost − accumulated depreciation** = unexpired cost, NOT market value.\n'
      + '**The double entry (identical for either method):** **Dr Depreciation expense / Cr Accumulated depreciation.** The asset’s original cost is never touched.',
    examReadiness:
      '• Straight-line: **subtract residual value first** — the classic slip is dividing cost by life and forgetting residual.\n'
      + '• Carrying amount is unexpired cost, **not** what a buyer would pay; a low market offer does not by itself change it.\n'
      + '• **Land is not depreciated**; buildings and other assets are.\n'
      + '• The journal is the same whichever method — Dr expense, Cr accumulated depreciation.',
    worked: {
      prompt: 'A fridge costs KES 40,000, residual KES 4,000, useful life 6 years, straight-line. Give the annual charge, the journal, and the carrying amount at the end of year 2.',
      steps: [
        'Annual charge = (40,000 − 4,000) ÷ 6 = 36,000 ÷ 6 = KES 6,000.',
        'Each year-end: Dr Depreciation expense 6,000 / Cr Accumulated depreciation 6,000.',
        'After 2 years: accumulated = 12,000 → carrying amount = 40,000 − 12,000 = KES 28,000 (unexpired cost, not resale value).',
      ],
      answer: 'KES 6,000 a year; Dr Depreciation expense / Cr Accumulated depreciation; carrying amount KES 28,000 at end of year 2.',
    },
    deeper: [
      {
        heading: 'Depreciation: matching cost to years, not valuing the asset',
        conceptIds: ['FA-26'],
        body:
          'A fridge bought for KES 40,000 earns sales for years, so the accruals concept says match its cost against those years rather than dumping it all into the month of purchase. That spreading is **depreciation** — not a valuation, not a cash payment; last year’s asset turned, slice by slice, into this year’s expense.\n'
          + '**Straight-line:** (cost − residual value) ÷ useful life → equal slices. The classic slip is dividing cost by life and **forgetting to subtract residual** first.\n'
          + '**Reducing balance:** a fixed % of the carrying amount each year → big charges early, shrinking later.\n'
          + '**The double entry is the same for both:** **Dr Depreciation expense** (profit or loss) / **Cr Accumulated depreciation** (a contra-asset). The asset’s original cost account is **never** touched; accumulated depreciation builds up beside it.\n'
          + '**Carrying amount = cost − accumulated depreciation** = *unexpired cost*, i.e. how much is left to charge — **not** market value. So if a dealer offers less than the carrying amount, that alone does not change it (writing down to market is impairment, which is FR, later). And **land is not depreciated** (it does not get used up); buildings and equipment are.',
      },
    ],
    rateFlags: [
      'Useful life and residual value are management estimates, not statutory — review at the annual syllabus/standards check.',
    ],
  },
  {
    topicId: 'FA H2', paper: 'FA', syllabusYear: '2026',
    title: 'Liquidity and efficiency ratios',
    nutshell:
      'Profit is opinion; cash is fact. Liquidity and efficiency ratios read short-term health.\n'
      + '**Liquidity:**\n'
      + '• **Current ratio = current assets ÷ current liabilities.**\n'
      + '• **Quick (acid-test) = (current assets − inventory) ÷ current liabilities** — the slowest asset stripped out.\n'
      + '**Efficiency (turn balances into days):**\n'
      + '• **Inventory days = inventory ÷ cost of sales × 365.**\n'
      + '• **Receivables days = receivables ÷ credit sales × 365.**\n'
      + '• **Payables days = payables ÷ credit purchases × 365.**\n'
      + '• **Cash operating cycle = inventory days + receivables days − payables days** — longer cycle, more cash tied up.\n'
      + 'A ratio alone says nothing; interpret against last year or a rival.',
    examReadiness:
      '• Learn the formulas exactly — quick ratio removes inventory; the current ratio does not.\n'
      + '• Always interpret **against a benchmark**: a high current ratio can mean healthy cover OR idle cash and bloated, unsellable inventory.\n'
      + '• Watch the day convention — this build uses **365**; some answers use 360.\n'
      + '• The cash operating cycle SUBTRACTS payables days.',
    worked: {
      prompt: 'Current assets KES 300,000 (incl. inventory 120,000), current liabilities 150,000, cost of sales 600,000. Compute the current ratio, quick ratio and inventory days, and read them.',
      steps: [
        'Current ratio = 300,000 ÷ 150,000 = 2.0.',
        'Quick ratio = (300,000 − 120,000) ÷ 150,000 = 180,000 ÷ 150,000 = 1.2.',
        'Inventory days = 120,000 ÷ 600,000 × 365 ≈ 73 days.',
        'Reading: cover looks comfortable (quick above 1), but ~73 days of stock is a lot — compare with last year before concluding.',
      ],
      answer: 'Current 2.0, quick 1.2, inventory ~73 days — solid cover, but the inventory days invite a comparison.',
    },
    deeper: [
      {
        heading: 'Reading short-term health: liquidity, efficiency, and the cash cycle',
        conceptIds: ['FA-63'],
        body:
          'A business can be profitable and still run out of cash — profit is opinion, cash is fact — so lenders read liquidity and efficiency ratios.\n'
          + '**Liquidity — can short-term assets cover short-term debts?**\n'
          + '• **Current ratio = current assets ÷ current liabilities.**\n'
          + '• **Quick (acid-test) ratio = (current assets − inventory) ÷ current liabilities** — strips out the slowest asset, for businesses that cannot sell stock quickly.\n'
          + '**Efficiency — turn balances into days:**\n'
          + '• **Inventory days = inventory ÷ cost of sales × 365** (how long stock sits).\n'
          + '• **Receivables days = receivables ÷ credit sales × 365** (how long customers take to pay).\n'
          + '• **Payables days = payables ÷ credit purchases × 365** (how long you take to pay).\n'
          + '• **Cash operating cycle = inventory days + receivables days − payables days** — the gap between paying for stock and collecting from customers; longer means more cash tied up.\n'
          + 'The habit that scores marks: **a ratio alone says nothing.** A high current ratio can mean healthy cover OR idle cash and bloated, unsellable stock — only comparison with last year or a rival tells which. Always state the number *and* what it implies against a benchmark. (Note the day-count convention: 365 here, 360 in some answers.)',
      },
    ],
    rateFlags: [
      'Ratios use a 365-day year here; some syllabi/answers use 360 — confirm at the annual check.',
    ],
  },
];

export default FA_TOPICS;
