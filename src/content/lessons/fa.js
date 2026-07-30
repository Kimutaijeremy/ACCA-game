// FA lessons (Brief §6.3, quality rubric Execution Order §5). Seeded from the WP2a
// pilots; append new lessons as clean object literals. Validated by src/engine/lessons.js.

export const FA_LESSONS = [
  {
    "conceptId": "FA-26",
    "title": "Depreciation methods and the annual charge",
    "syllabusYear": "2026",
    "shape": "double-entry",
    "story": "Wanjiku buys a fridge for KES 40,000. Unlike the sodas inside it, the fridge is not for resale — it will earn sales for years. The accruals concept insists its cost be matched against those years, not dumped into the month she bought it. That spreading is **depreciation**. It is not a valuation and not a cash payment; it is last year’s asset being turned, slice by slice, into this year’s expense. Each slice needs a home in the books, and depreciation has a fixed double entry that never changes, whatever the method.",
    "keypoints": [
      {
        "title": "Depreciation — the two methods",
        "body": "**Straight-line**: (cost − residual value) ÷ useful life — equal slices every year.\n**Reducing balance**: a fixed % of the carrying amount each year — big slices early, shrinking after.\n**Carrying amount = cost − accumulated depreciation** = unexpired cost, NOT market value. Land is not depreciated; buildings are."
      },
      {
        "title": "The double entry (identical for either method)",
        "body": "Each year:\n  **Dr Depreciation expense** (statement of profit or loss)\n  **Cr Accumulated depreciation** (a contra-asset in the statement of financial position)\nThe asset’s original cost is never touched; accumulated depreciation builds up beside it, and the difference is the carrying amount."
      }
    ],
    "worked": {
      "prompt": "The fridge costs KES 40,000, has an estimated residual value of KES 4,000 and a useful life of 6 years. Using straight-line, give the annual charge, the journal, and the carrying amount at the end of year 2.",
      "steps": [
        "Annual charge = (40,000 − 4,000) ÷ 6 = 36,000 ÷ 6 = KES 6,000 per year.",
        "Each year-end journal: Dr Depreciation expense 6,000 / Cr Accumulated depreciation 6,000.",
        "After 2 years: accumulated depreciation = 2 × 6,000 = 12,000.",
        "Carrying amount = cost 40,000 − accumulated 12,000 = KES 28,000 (what is left to charge, not what a buyer would pay)."
      ],
      "answer": "KES 6,000 a year; Dr Depreciation expense / Cr Accumulated depreciation 6,000; carrying amount KES 28,000 at the end of year 2."
    },
    "compression": "Depreciation matches an asset’s cost to the years it serves — straight-line in equal slices or reducing-balance in shrinking ones — booked every year as Dr depreciation expense, Cr accumulated depreciation, leaving a carrying amount that is unexpired cost, not market value.",
    "forwardPointer": "Depreciation returns in FR as the **revaluation model** and **impairment** (FR-S01, FR-S02): the carrying amount you compute here is exactly where FR starts when it lets the asset be revalued or written down.",
    "rateFlags": [
      "Useful life and residual value are management estimates, not statutory figures — review them at each annual syllabus/standards check."
    ]
  },
  {
    "conceptId": "FA-22",
    "title": "Cost and net realisable value",
    "syllabusYear": "2026",
    "shape": "treatment",
    "story": "At year end Wanjiku counts the stock still on her shelves. Most of it is fine. But one crate of sodas got water-damaged in the rains, and a line of sweets has passed the fashion for them — she will have to slash the price to shift them. She paid good money for all of it. The question the accounts force on her is blunt: carry the stock at what it cost, or at what it can now actually fetch? Prudence answers: never carry stock above what it can bring in. That is the lower-of-cost-and-NRV rule — and the trap is that it is applied line by line, not to the pile as a whole.",
    "keypoints": [
      {
        "title": "Inventory at the lower of cost and NRV (IAS 2)",
        "body": "Inventory is valued at the **lower of cost and net realisable value**.\n  **NRV = expected selling price − costs to complete − costs to sell.**\nPrudence: an asset is never carried above what it can realise. If NRV < cost, write the item down to NRV (the write-down raises cost of sales and lowers profit); if NRV ≥ cost, leave it at cost."
      },
      {
        "title": "Apply it item by item — not to the total",
        "body": "The rule is applied to each line (or group of similar items) **separately**. You may NOT offset a profit expected on one line against a loss on another by comparing total cost with total NRV — that would hide the loss the standard is designed to surface."
      }
    ],
    "worked": {
      "prompt": "Three inventory lines at year end. A: cost 10,000, NRV 12,000. B: cost 8,000, NRV 5,000. C: cost 6,000, NRV 6,500. At what total should inventory be carried?",
      "steps": [
        "Line A: lower of 10,000 and 12,000 = 10,000.",
        "Line B: lower of 8,000 and 5,000 = 5,000 (a write-down of 3,000 hits cost of sales).",
        "Line C: lower of 6,000 and 6,500 = 6,000.",
        "Total = 10,000 + 5,000 + 6,000 = KES 21,000.",
        "Contrast the wrong way: total cost 24,000 vs total NRV 23,500 would say 23,500 — hiding B’s loss behind A’s expected profit. Item-by-item gives the prudent 21,000."
      ],
      "answer": "KES 21,000, applying the lower of cost and NRV line by line — not the KES 23,500 a total-versus-total comparison would wrongly give."
    },
    "compression": "Value inventory at the lower of cost and net realisable value (selling price less costs to complete and sell), applied item by item so a loss on one line is never buried under a profit expected on another.",
    "forwardPointer": "The same prudence and lower-of rule return in FR for inventories and, at Skills level, for biological assets (FR-S15).",
    "rateFlags": []
  },
  {
    "conceptId": "FA-63",
    "title": "Liquidity and efficiency ratios",
    "syllabusYear": "2026",
    "shape": "interpretation",
    "story": "Wanjiku Ltd is profitable — and nearly misses payroll. Profit is opinion; cash is fact, and the two diverge. When she asks the bank for an overdraft, the manager does not care about her profit alone; he wants to know whether she can pay her bills as they fall due. He reaches for liquidity and efficiency ratios — the reader’s toolkit for short-term health. On their own the numbers say nothing; against last year, or against a rival, they start to talk.",
    "keypoints": [
      {
        "title": "Liquidity ratios",
        "body": "**Current ratio = current assets ÷ current liabilities** — can short-term assets cover short-term debts?\n**Quick (acid-test) ratio = (current assets − inventory) ÷ current liabilities** — the same test with the slowest asset stripped out, for businesses that cannot sell stock quickly."
      },
      {
        "title": "Efficiency ratios and the cash operating cycle",
        "body": "**Inventory days = inventory ÷ cost of sales × 365.**\n**Receivables days = receivables ÷ credit sales × 365.**\n**Payables days = payables ÷ credit purchases × 365.**\n**Cash operating cycle = inventory days + receivables days − payables days** — the days between paying for stock and collecting from customers. Longer cycle → more cash tied up."
      },
      {
        "title": "A ratio alone says nothing",
        "body": "Always interpret against a benchmark — prior year or a competitor. A high current ratio can mean healthy cover OR idle cash and bloated, unsellable inventory. The number raises the question; the comparison and context answer it."
      }
    ],
    "worked": {
      "prompt": "Wanjiku Ltd: current assets KES 300,000 (including inventory 120,000), current liabilities 150,000, cost of sales 600,000. Compute the current ratio, the quick ratio, and inventory days, and say what they suggest.",
      "steps": [
        "Current ratio = 300,000 ÷ 150,000 = 2.0 (KES 2 of current assets per KES 1 of current liabilities).",
        "Quick ratio = (300,000 − 120,000) ÷ 150,000 = 180,000 ÷ 150,000 = 1.2.",
        "Inventory days = 120,000 ÷ 600,000 × 365 ≈ 73 days of stock held.",
        "Reading: cover looks comfortable (quick ratio above 1), but ~73 days of inventory is a lot for a bakery/retail mix — worth comparing with last year to see if stock is piling up."
      ],
      "answer": "Current 2.0, quick 1.2, inventory ~73 days — solid short-term cover, but the inventory days invite a comparison before drawing conclusions."
    },
    "compression": "Liquidity ratios (current, and quick with inventory stripped out) test whether short-term assets cover short-term debts; efficiency ratios turn inventory, receivables and payables into days to reveal the cash operating cycle — and no ratio means anything until compared with last year or a rival.",
    "forwardPointer": "In FR this interpretation becomes an art (FR-S08); in FM the working-capital cycle becomes a lever to manage (FM-S02). It also sits beside MA’s performance measures (MA-61). This lesson is the on-ramp.",
    "rateFlags": [
      "Ratios use a 365-day year here; some syllabi/answers use 360 — confirm the convention at the annual check."
    ]
  },
  {
    "conceptId": "FA-13",
    "title": "Books of prime entry",
    "syllabusYear": "2026",
    "shape": "process",
    "story": "Not every part of accounting gets a hero. This one is about filing — and it is exactly the kind of unglamorous plumbing the whole system stands on. By her third month Wanjiku records dozens of transactions a day: credit sales, a crate a customer sends back, sodas bought on account, a batch returned to the distributor, cash taken, the odd correction. If she tried to post each one straight into the ledger as it happened, she would drown, and errors would scatter everywhere. So accounting inserts a calm first step: an intake desk. Every transaction is first written into a **book of prime entry** — sorted by type — and only later posted, in tidy totals, into the ledger. There is no drama here. But get the intake wrong and every number downstream — the trial balance, the statements, the audit — inherits the mess.",
    "keypoints": [
      {
        "title": "The seven books of prime entry (the intake, before the ledger)",
        "body": "• **Sales day book** — credit sales (goods sold on account).\n• **Sales returns day book** — goods customers send back (credit notes you issue to them).\n• **Purchases day book** — credit purchases of goods for resale.\n• **Purchases returns day book** — goods you return to suppliers (credit notes you receive).\n• **Cash book** — all money in and out through bank/cash.\n• **Petty cash book** — small cash payments, run on the imprest system.\n• **The journal** — everything odd: corrections, year-end adjustments, opening entries, non-routine items.\nThey are books of **prime (first) entry** — a listing stage, NOT yet the double-entry ledger."
      },
      {
        "title": "The flow: document → prime entry → ledger",
        "body": "Source document (invoice, receipt, till roll) → the right book of prime entry → posted, in **totals**, to the **general (nominal) ledger**. Individual customer and supplier balances are kept alongside in the **memorandum (subsidiary) receivables and payables ledgers**. You post periodic totals, not one transaction at a time — that is the whole point of the intake."
      }
    ],
    "worked": {
      "prompt": "Into which book of prime entry does each go? (a) sold goods on credit to a neighbouring shop; (b) a customer returns goods bought on credit; (c) bought a crate of sodas on credit from the distributor; (d) returned a spoiled batch to the distributor; (e) paid the electricity bill by M-Pesa; (f) recorded the year-end depreciation charge; (g) bought postage stamps with a few shillings from the float.",
      "steps": [
        "(a) Credit sale of goods → sales day book.",
        "(b) Goods coming back from a credit customer → sales returns day book.",
        "(c) Credit purchase of goods for resale → purchases day book.",
        "(d) Goods sent back to a credit supplier → purchases returns day book.",
        "(e) Payment of money out → cash book (payments side).",
        "(f) A year-end adjustment, not a routine trade transaction → the journal.",
        "(g) A small cash payment from the float → petty cash book."
      ],
      "answer": "Sales day book; sales returns day book; purchases day book; purchases returns day book; cash book; the journal; petty cash book — the seven in turn. Note that (f) goes to the journal precisely because it fits none of the routine day books; that is what the journal is for."
    },
    "compression": "Every transaction lands first in a book of prime entry — sales and purchases day books (and their returns day books) for credit trade, the cash and petty cash books for money, the journal for everything odd — and is then posted in totals to the nominal ledger, with customer and supplier detail kept in memorandum ledgers.",
    "forwardPointer": "These books post into the nominal ledger (FA-14) and, once summed, must prove themselves in the trial balance (FA-39); the orderly intake they impose is the beginning of the audit trail that AA later relies on.",
    "rateFlags": []
  }
  ,
  {
    conceptId: 'FA-04',
    title: 'The elements — assets, liabilities, equity, income, expenses',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'Before Wanjiku can record a single transaction, accounting needs five words to mean exactly one '
      + 'thing each. Everything else in the whole of FA — and later FR — is built from these five '
      + 'definitions. Get them precise now and the rest of the paper has somewhere to stand; leave them '
      + 'vague and every statement you build later wobbles.',
    keypoints: [
      {
        title: 'The five elements',
        body:
          '• **Asset** — a resource the business **controls** from a past event, expected to bring future '
          + 'economic benefit (cash, inventory, the fridge, money customers owe).\n'
          + '• **Liability** — a **present obligation** from a past event, expected to cause an outflow '
          + '(a supplier bill, a loan).\n'
          + '• **Equity** — the **residual**: assets minus liabilities. What the business owes its owner.\n'
          + '• **Income** — increases in economic benefit (revenue, gains).\n'
          + '• **Expenses** — decreases in economic benefit (costs, losses).',
      },
      {
        title: 'Equity is a residual, not a thing you can point to',
        body:
          'You never measure equity directly — it is whatever is left when liabilities are taken from '
          + 'assets. That is why capital, profit and drawings all flow through it, and why the accounting '
          + 'equation (next concept) can never break.',
      },
    ],
    worked: {
      prompt:
        'Classify each for Wanjiku Ltd as asset, liability, equity, income or expense: (a) cash in the '
        + 'till; (b) a supplier’s unpaid bill; (c) the owner’s capital; (d) a cash sale; (e) rent paid.',
      steps: [
        '(a) Cash — a resource controlled → asset.',
        '(b) Unpaid supplier bill — a present obligation → liability.',
        '(c) Owner’s capital — what the business owes the owner → equity.',
        '(d) Cash sale — an increase in economic benefit → income.',
        '(e) Rent paid — a decrease in economic benefit → expense.',
      ],
      answer: 'Asset: cash. Liability: the supplier bill. Equity: capital. Income: the sale. Expense: rent.',
    },
    compression:
      'Five definitions underlie everything: assets (controlled resources), liabilities (present '
      + 'obligations), equity (the residual, assets minus liabilities), income (benefit up) and expenses '
      + '(benefit down).',
    forwardPointer:
      'These five definitions are sharpened in FR’s Conceptual Framework (FR-S11), where recognition and '
      + 'measurement of each element are examined in full.',
    rateFlags: [],
  },
  {
    conceptId: 'FA-05',
    title: 'The accounting equation',
    syllabusYear: '2026',
    shape: 'double-entry',
    story:
      'Ask Wanjiku whose money is in the till and she will say hers — obviously. Accounting flatly '
      + 'disagrees, and the disagreement is the foundation of the entire subject. It treats the business '
      + 'as a **separate entity** from Wanjiku herself: the stall holds the money, but it **owes that '
      + 'money back to her**. Her stake is **capital** — and here is the shock most students never '
      + 'cleanly recover from: capital is a debt the business owes its owner. From that one idea comes an '
      + 'equation that has held after every transaction ever recorded, anywhere, forever.',
    keypoints: [
      {
        title: 'The accounting equation',
        body:
          '**Assets = Capital + Liabilities.**\n'
          + '• **Assets** — what the business owns or controls.\n'
          + '• **Liabilities** — what it owes outsiders.\n'
          + '• **Capital** — what it owes the owner; it **grows** with profit and new capital, **shrinks** '
          + 'with losses and drawings.\n'
          + 'It holds after every transaction — all of double entry is bookkeeping for this one identity.',
      },
      {
        title: 'Duality — every transaction keeps it balanced',
        body:
          'Every transaction has **two equal and opposite effects**, so the equation never trembles. Buy '
          + 'stock for cash and one asset simply becomes another. This two-sidedness is **duality** — the '
          + 'secret of double entry, met here before a single debit.',
      },
    ],
    worked: {
      prompt:
        'Show the equation after each step: (1) Wanjiku pays in KES 20,000 capital; (2) she buys stock '
        + 'for KES 12,000 cash.',
      steps: [
        'Start: Assets (cash 20,000) = Capital 20,000 + Liabilities 0. ✓',
        'Buy stock for cash: cash −12,000, inventory +12,000. Assets = cash 8,000 + inventory 12,000 = 20,000.',
        'Equation after step 2: Assets 20,000 = Capital 20,000 + Liabilities 0. Still balanced — one asset became another.',
      ],
      answer:
        'After both steps: Assets 20,000 (cash 8,000 + inventory 12,000) = Capital 20,000 + Liabilities 0. '
        + 'The equation held through every step.',
    },
    compression:
      'Assets = Capital + Liabilities: the business is a separate entity that owes its owner (capital) '
      + 'and its outsiders (liabilities), and every transaction’s two equal effects keep the equation '
      + 'balanced — the seed of double entry.',
    forwardPointer:
      'This identity becomes double-entry bookkeeping (FA-11, debits and credits) and, at year end, '
      + 'stands upright as the statement of financial position (FA-46).',
    rateFlags: [],
  }
  ,
  {
    conceptId: 'FA-11',
    title: 'Duality and the double-entry principle',
    syllabusYear: '2026',
    shape: 'double-entry',
    story:
      'Debit sounds like a loss and credit like a gain — the words leak in from bank statements, where '
      + 'they mean the opposite of what they mean here. Wanjiku has to unlearn that on day one. In '
      + 'bookkeeping, **debit** and **credit** are not good and bad; they are simply the **left** and '
      + '**right** sides of an account. Every transaction touches two accounts, one on each side, by '
      + 'equal amounts — because the accounting equation it feeds must never tip. That two-sidedness is '
      + 'duality, and it is the entire mechanism of double entry.',
    keypoints: [
      {
        title: 'Debits and credits — the directions (DEAD CLIC)',
        body:
          'Debit = left, credit = right; neither is "good" or "bad".\n'
          + '**Debits increase: Expenses, Assets, Drawings.**\n'
          + '**Credits increase: Liabilities, Income, Capital.**\n'
          + '(Each of those decreases on the opposite side.) The mnemonic is **DEAD CLIC**.',
      },
      {
        title: 'Total debits always equal total credits',
        body:
          'Because every transaction has two equal and opposite effects, the debits and credits of the '
          + 'whole system are always equal. That built-in balance is the self-check the trial balance '
          + 'later relies on — and it is duality (from FA-05) wearing a uniform.',
      },
    ],
    worked: {
      prompt:
        'Give the two entries for each: (a) Wanjiku buys inventory for KES 12,000 cash; (b) she makes a '
        + 'credit sale of KES 9,000.',
      steps: [
        '(a) Inventory (an asset) rises → Dr Inventory 12,000. Cash (an asset) falls → Cr Cash 12,000.',
        '(a) Debits 12,000 = Credits 12,000. ✓',
        '(b) A receivable (asset) rises → Dr Receivables 9,000. Sales (income) rises → Cr Sales 9,000.',
        '(b) Debits 9,000 = Credits 9,000. ✓',
      ],
      answer:
        '(a) Dr Inventory / Cr Cash 12,000. (b) Dr Receivables / Cr Sales 9,000. Every time, one debit '
        + 'and one credit of equal size.',
    },
    compression:
      'Debit and credit are just left and right, not bad and good; every transaction posts an equal '
      + 'debit and credit (DEAD CLIC — Debits: Expenses, Assets, Drawings; Credits: Liabilities, Income, '
      + 'Capital), so total debits always equal total credits.',
    forwardPointer:
      'These entries reach the ledger through the books of prime entry (FA-13) and the nominal ledger '
      + '(FA-14), and their built-in balance is what the trial balance (FA-39) later proves.',
    rateFlags: [],
  }
];

export default FA_LESSONS;
