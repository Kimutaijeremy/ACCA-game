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
    "story": "Not every part of accounting gets a hero. This one is about filing — and it is exactly the kind of unglamorous plumbing the whole system stands on. By her third month Wanjiku records dozens of transactions a day: credit sales, cash taken, sodas bought on account, the odd correction. If she tried to post each one straight into the ledger as it happened, she would drown, and errors would scatter everywhere. So accounting inserts a calm first step: an intake desk. Every transaction is first written into a **book of prime entry** — sorted by type — and only later posted, in tidy totals, into the ledger. There is no drama here. But get the intake wrong and every number downstream — the trial balance, the statements, the audit — inherits the mess.",
    "keypoints": [
      {
        "title": "The five books of prime entry (the intake, before the ledger)",
        "body": "• **Sales day book** — credit sales (goods sold on account).\n• **Purchases day book** — credit purchases of goods for resale.\n• **Cash book** — all money in and out through bank/cash.\n• **Petty cash book** — small cash payments, run on the imprest system.\n• **The journal** — everything odd: corrections, year-end adjustments, opening entries, non-routine items.\nThey are books of **prime (first) entry** — a listing stage, NOT yet the double-entry ledger."
      },
      {
        "title": "The flow: document → prime entry → ledger",
        "body": "Source document (invoice, receipt, till roll) → the right book of prime entry → posted, in **totals**, to the **general (nominal) ledger**. Individual customer and supplier balances are kept alongside in the **memorandum (subsidiary) receivables and payables ledgers**. You post periodic totals, not one transaction at a time — that is the whole point of the intake."
      }
    ],
    "worked": {
      "prompt": "Into which book of prime entry does each go? (a) sold goods on credit to a neighbouring shop; (b) paid the electricity bill by M-Pesa; (c) bought a crate of sodas on credit from the distributor; (d) recorded the year-end depreciation charge; (e) bought postage stamps with a few shillings from the float.",
      "steps": [
        "(a) Credit sale of goods → sales day book.",
        "(b) Payment of money out → cash book (payments side).",
        "(c) Credit purchase of goods for resale → purchases day book.",
        "(d) A year-end adjustment, not a routine trade transaction → the journal.",
        "(e) A small cash payment from the float → petty cash book."
      ],
      "answer": "Sales day book; cash book; purchases day book; the journal; petty cash book. Note that (d) goes to the journal precisely because it fits none of the routine day books — that is what the journal is for."
    },
    "compression": "Every transaction lands first in a book of prime entry — sales and purchases day books for credit trade, the cash and petty cash books for money, the journal for everything odd — and is then posted in totals to the nominal ledger, with customer and supplier detail kept in memorandum ledgers.",
    "forwardPointer": "These books post into the nominal ledger (FA-14) and, once summed, must prove themselves in the trial balance (FA-39); the orderly intake they impose is the beginning of the audit trail that AA later relies on.",
    "rateFlags": []
  }
];

export default FA_LESSONS;
