# Pilot lessons — WP2a format review

Five full-quality pilot lessons, in the Wanjiku voice, each stressing a different shape. This is the format to approve before the remaining 186 lessons (WP2b) are written against it. Generated from `src/content/pilot-lessons.js` — the content is data, this is just a readable view.

---

## Stakeholder power, interest and conflict
*BT-04 · shape: theory · syllabus 2026*

### Lesson
Within a month of opening her kibanda near Gikomba, Wanjiku discovers she is surrounded by people who care what she does. Her customers want the lowest price. The soda distributor wants prompt payment or he stops delivering. The county askari wants the licence fee on time. The Kenya Revenue Authority wants its sales tax — a stakeholder, she is warned, with infinite patience. Her cousin wants her to turn the stall into a partnership. Every one of them affects, or is affected by, the business — and they want different, often conflicting, things. She cannot please them all at once. So the real skill is not keeping everyone happy; it is knowing whose claim to answer first. Mendelow gives her the map.

> 🔑 **KEYPOINT — Stakeholders and Mendelow's matrix**
>
> A **stakeholder** is anyone who affects or is affected by the organisation. Map each one on two axes — **power** (can they force your hand?) and **interest** (do they care about this decision?):
> • High power + high interest → **key players**: manage closely.
> • High power + low interest → **keep satisfied**.
> • Low power + high interest → **keep informed**.
> • Low power + low interest → **minimal effort**.
> The quadrant sets the management effort — nothing else.

> 🔑 **KEYPOINT — Stakeholder conflict is resolved by priority, not by pleasing everyone**
>
> Because claims conflict (customers want low prices; the distributor wants prompt, i.e. more expensive, payment), you cannot satisfy them all. You **prioritise** by power and interest, and accept that answering one claim disappoints another. That trade-off IS stakeholder management.

### Worked example
**Place four of Wanjiku's stakeholders on Mendelow's matrix and state how she should manage each: (a) the Kenya Revenue Authority, (b) a single walk-up customer, (c) the sole soda distributor who supplies her street, (d) a neighbour who dislikes the queue outside.**

1. KRA — high power (can close her down), high interest (wants every sale taxed) → key player → manage closely, comply fully.
2. A single customer — low power (one of hundreds), high interest (cares about price) → keep informed (fair prices, clear signage).
3. The sole distributor — high power (only supplier on the street), lower day-to-day interest in her particular stall → keep satisfied (pay promptly to keep supply).
4. The neighbour — low power, low interest → minimal effort (a courtesy, no more).

**Answer.** Key player: KRA. Keep satisfied: the distributor. Keep informed: the customer. Minimal effort: the neighbour. The same four names would sit in different quadrants for a different decision — the matrix is read per decision, not once forever.

**In one breath.** Stakeholders affect or are affected by the business, want conflicting things, and are managed by mapping their power against their interest — key players managed closely, the powerful kept satisfied, the interested kept informed, the rest minimal effort.

**Where it matures →** This matrix grows up in SBL, where the same power/interest map governs board-level decisions and every stakeholder-conflict question in strategic governance.

---

## The high-low method
*MA-11 · shape: calculation · syllabus 2026*

### Lesson
Wanjiku opens a small bakery behind the shop — mandazi and bread. The first bill that puzzles her is electricity. In a quiet month it costs less; in a busy month, more — but it never falls to zero, because the fridge and the lights run regardless. This is a **semi-variable cost**: a fixed standing charge plus a variable amount that rises with how much she bakes. To budget, and later to price a single mandazi, she must split that one bill into its fixed and variable halves. With only the monthly totals to go on, the high-low method does it from just two data points — the busiest month and the quietest.

> 🔑 **KEYPOINT — High-low method**
>
> Take the **highest and lowest activity** levels (not the highest and lowest cost):
>   Variable cost per unit = (cost at highest activity − cost at lowest activity) ÷ (highest units − lowest units)
> Then, at either level:
>   Fixed cost = total cost − (variable cost per unit × units)
> Crude but everywhere — and the exam’s favourite warm-up.

> 🔑 **KEYPOINT — Two traps**
>
> Pick the extreme **activity** rows, even if another row has a higher cost. And if the cost structure changes over the range (a **stepped** fixed cost — say a second oven switched on) or a row is a one-off outlier, high-low quietly lies: it assumes one straight line across the whole range.

### Worked example
**Two months of the bakery’s electricity: a busy month baked 900 trays and cost KES 32,000; a quiet month baked 500 trays and cost KES 24,000. Split the bill, then predict the cost of a month baking 700 trays.**

1. Variable cost per tray = (32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20 per tray.
2. Fixed cost = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000 per month (check at the low point: 24,000 − 20×500 = 14,000 ✓).
3. Forecast at 700 trays = fixed 14,000 + variable (20 × 700) = 14,000 + 14,000 = KES 28,000.

**Answer.** Variable KES 20/tray, fixed KES 14,000/month; a 700-tray month should cost about KES 28,000.

**In one breath.** Split a mixed cost from its highest and lowest activity levels: variable per unit is the change in cost over the change in units, and fixed is whatever is left once the variable part is stripped out at either level.

**Where it matures →** When two points aren’t enough, linear regression (MA-12) fits a line through all of them; and the fixed/variable split you make here is what every flexible budget and cost variance later depends on.

---

## Depreciation methods and the annual charge
*FA-26 · shape: double-entry · syllabus 2026*

### Lesson
Wanjiku buys a fridge for KES 40,000. Unlike the sodas inside it, the fridge is not for resale — it will earn sales for years. The accruals concept insists its cost be matched against those years, not dumped into the month she bought it. That spreading is **depreciation**. It is not a valuation and not a cash payment; it is last year’s asset being turned, slice by slice, into this year’s expense. Each slice needs a home in the books, and depreciation has a fixed double entry that never changes, whatever the method.

> 🔑 **KEYPOINT — Depreciation — the two methods**
>
> **Straight-line**: (cost − residual value) ÷ useful life — equal slices every year.
> **Reducing balance**: a fixed % of the carrying amount each year — big slices early, shrinking after.
> **Carrying amount = cost − accumulated depreciation** = unexpired cost, NOT market value. Land is not depreciated; buildings are.

> 🔑 **KEYPOINT — The double entry (identical for either method)**
>
> Each year:
>   **Dr Depreciation expense** (statement of profit or loss)
>   **Cr Accumulated depreciation** (a contra-asset in the statement of financial position)
> The asset’s original cost is never touched; accumulated depreciation builds up beside it, and the difference is the carrying amount.

### Worked example
**The fridge costs KES 40,000, has an estimated residual value of KES 4,000 and a useful life of 6 years. Using straight-line, give the annual charge, the journal, and the carrying amount at the end of year 2.**

1. Annual charge = (40,000 − 4,000) ÷ 6 = 36,000 ÷ 6 = KES 6,000 per year.
2. Each year-end journal: Dr Depreciation expense 6,000 / Cr Accumulated depreciation 6,000.
3. After 2 years: accumulated depreciation = 2 × 6,000 = 12,000.
4. Carrying amount = cost 40,000 − accumulated 12,000 = KES 28,000 (what is left to charge, not what a buyer would pay).

**Answer.** KES 6,000 a year; Dr Depreciation expense / Cr Accumulated depreciation 6,000; carrying amount KES 28,000 at the end of year 2.

**In one breath.** Depreciation matches an asset’s cost to the years it serves — straight-line in equal slices or reducing-balance in shrinking ones — booked every year as Dr depreciation expense, Cr accumulated depreciation, leaving a carrying amount that is unexpired cost, not market value.

**Where it matures →** Depreciation returns in FR as the **revaluation model** and **impairment** (FR-S01, FR-S02): the carrying amount you compute here is exactly where FR starts when it lets the asset be revalued or written down.

**Annual-check flags:**
- Useful life and residual value are management estimates, not statutory figures — review them at each annual syllabus/standards check.

---

## Cost and net realisable value
*FA-22 · shape: treatment · syllabus 2026*

### Lesson
At year end Wanjiku counts the stock still on her shelves. Most of it is fine. But one crate of sodas got water-damaged in the rains, and a line of sweets has passed the fashion for them — she will have to slash the price to shift them. She paid good money for all of it. The question the accounts force on her is blunt: carry the stock at what it cost, or at what it can now actually fetch? Prudence answers: never carry stock above what it can bring in. That is the lower-of-cost-and-NRV rule — and the trap is that it is applied line by line, not to the pile as a whole.

> 🔑 **KEYPOINT — Inventory at the lower of cost and NRV (IAS 2)**
>
> Inventory is valued at the **lower of cost and net realisable value**.
>   **NRV = expected selling price − costs to complete − costs to sell.**
> Prudence: an asset is never carried above what it can realise. If NRV < cost, write the item down to NRV (the write-down raises cost of sales and lowers profit); if NRV ≥ cost, leave it at cost.

> 🔑 **KEYPOINT — Apply it item by item — not to the total**
>
> The rule is applied to each line (or group of similar items) **separately**. You may NOT offset a profit expected on one line against a loss on another by comparing total cost with total NRV — that would hide the loss the standard is designed to surface.

### Worked example
**Three inventory lines at year end. A: cost 10,000, NRV 12,000. B: cost 8,000, NRV 5,000. C: cost 6,000, NRV 6,500. At what total should inventory be carried?**

1. Line A: lower of 10,000 and 12,000 = 10,000.
2. Line B: lower of 8,000 and 5,000 = 5,000 (a write-down of 3,000 hits cost of sales).
3. Line C: lower of 6,000 and 6,500 = 6,000.
4. Total = 10,000 + 5,000 + 6,000 = KES 21,000.
5. Contrast the wrong way: total cost 24,000 vs total NRV 23,500 would say 23,500 — hiding B’s loss behind A’s expected profit. Item-by-item gives the prudent 21,000.

**Answer.** KES 21,000, applying the lower of cost and NRV line by line — not the KES 23,500 a total-versus-total comparison would wrongly give.

**In one breath.** Value inventory at the lower of cost and net realisable value (selling price less costs to complete and sell), applied item by item so a loss on one line is never buried under a profit expected on another.

**Where it matures →** The same prudence and lower-of rule return in FR for inventories and, at Skills level, for biological assets (FR-S15).

---

## Liquidity and efficiency ratios
*FA-63 · shape: interpretation · syllabus 2026*

### Lesson
Wanjiku Ltd is profitable — and nearly misses payroll. Profit is opinion; cash is fact, and the two diverge. When she asks the bank for an overdraft, the manager does not care about her profit alone; he wants to know whether she can pay her bills as they fall due. He reaches for liquidity and efficiency ratios — the reader’s toolkit for short-term health. On their own the numbers say nothing; against last year, or against a rival, they start to talk.

> 🔑 **KEYPOINT — Liquidity ratios**
>
> **Current ratio = current assets ÷ current liabilities** — can short-term assets cover short-term debts?
> **Quick (acid-test) ratio = (current assets − inventory) ÷ current liabilities** — the same test with the slowest asset stripped out, for businesses that cannot sell stock quickly.

> 🔑 **KEYPOINT — Efficiency ratios and the cash operating cycle**
>
> **Inventory days = inventory ÷ cost of sales × 365.**
> **Receivables days = receivables ÷ credit sales × 365.**
> **Payables days = payables ÷ credit purchases × 365.**
> **Cash operating cycle = inventory days + receivables days − payables days** — the days between paying for stock and collecting from customers. Longer cycle → more cash tied up.

> 🔑 **KEYPOINT — A ratio alone says nothing**
>
> Always interpret against a benchmark — prior year or a competitor. A high current ratio can mean healthy cover OR idle cash and bloated, unsellable inventory. The number raises the question; the comparison and context answer it.

### Worked example
**Wanjiku Ltd: current assets KES 300,000 (including inventory 120,000), current liabilities 150,000, cost of sales 600,000. Compute the current ratio, the quick ratio, and inventory days, and say what they suggest.**

1. Current ratio = 300,000 ÷ 150,000 = 2.0 (KES 2 of current assets per KES 1 of current liabilities).
2. Quick ratio = (300,000 − 120,000) ÷ 150,000 = 180,000 ÷ 150,000 = 1.2.
3. Inventory days = 120,000 ÷ 600,000 × 365 ≈ 73 days of stock held.
4. Reading: cover looks comfortable (quick ratio above 1), but ~73 days of inventory is a lot for a bakery/retail mix — worth comparing with last year to see if stock is piling up.

**Answer.** Current 2.0, quick 1.2, inventory ~73 days — solid short-term cover, but the inventory days invite a comparison before drawing conclusions.

**In one breath.** Liquidity ratios (current, and quick with inventory stripped out) test whether short-term assets cover short-term debts; efficiency ratios turn inventory, receivables and payables into days to reveal the cash operating cycle — and no ratio means anything until compared with last year or a rival.

**Where it matures →** In FR this interpretation becomes an art (FR-S08); in FM the working-capital cycle becomes a lever to manage (FM-S02). It also sits beside MA’s performance measures (MA-61). This lesson is the on-ramp.

**Annual-check flags:**
- Ratios use a 365-day year here; some syllabi/answers use 360 — confirm the convention at the annual check.

---

## Books of prime entry
*FA-13 · shape: process · syllabus 2026*

### Lesson
Not every part of accounting gets a hero. This one is about filing — and it is exactly the kind of unglamorous plumbing the whole system stands on. By her third month Wanjiku records dozens of transactions a day: credit sales, cash taken, sodas bought on account, the odd correction. If she tried to post each one straight into the ledger as it happened, she would drown, and errors would scatter everywhere. So accounting inserts a calm first step: an intake desk. Every transaction is first written into a **book of prime entry** — sorted by type — and only later posted, in tidy totals, into the ledger. There is no drama here. But get the intake wrong and every number downstream — the trial balance, the statements, the audit — inherits the mess.

> 🔑 **KEYPOINT — The five books of prime entry (the intake, before the ledger)**
>
> • **Sales day book** — credit sales (goods sold on account).
> • **Purchases day book** — credit purchases of goods for resale.
> • **Cash book** — all money in and out through bank/cash.
> • **Petty cash book** — small cash payments, run on the imprest system.
> • **The journal** — everything odd: corrections, year-end adjustments, opening entries, non-routine items.
> They are books of **prime (first) entry** — a listing stage, NOT yet the double-entry ledger.

> 🔑 **KEYPOINT — The flow: document → prime entry → ledger**
>
> Source document (invoice, receipt, till roll) → the right book of prime entry → posted, in **totals**, to the **general (nominal) ledger**. Individual customer and supplier balances are kept alongside in the **memorandum (subsidiary) receivables and payables ledgers**. You post periodic totals, not one transaction at a time — that is the whole point of the intake.

### Worked example
**Into which book of prime entry does each go? (a) sold goods on credit to a neighbouring shop; (b) paid the electricity bill by M-Pesa; (c) bought a crate of sodas on credit from the distributor; (d) recorded the year-end depreciation charge; (e) bought postage stamps with a few shillings from the float.**

1. (a) Credit sale of goods → sales day book.
2. (b) Payment of money out → cash book (payments side).
3. (c) Credit purchase of goods for resale → purchases day book.
4. (d) A year-end adjustment, not a routine trade transaction → the journal.
5. (e) A small cash payment from the float → petty cash book.

**Answer.** Sales day book; cash book; purchases day book; the journal; petty cash book. Note that (d) goes to the journal precisely because it fits none of the routine day books — that is what the journal is for.

**In one breath.** Every transaction lands first in a book of prime entry — sales and purchases day books for credit trade, the cash and petty cash books for money, the journal for everything odd — and is then posted in totals to the nominal ledger, with customer and supplier detail kept in memorandum ledgers.

**Where it matures →** These books post into the nominal ledger (FA-14) and, once summed, must prove themselves in the trial balance (FA-39); the orderly intake they impose is the beginning of the audit trail that AA later relies on.

