// FA question sets (Brief §6.3–6.5). One set per authored concept to the per-concept floor —
// EXCEPT FA-05 (the accounting equation), which is capped at two items in the whole FA bank
// (Brief §6.4): it is deliberately under-weighted and its mastery is shown through the concepts it
// feeds. FA-11, FA-26 and FA-63 are calculation-shaped, so each includes a PARAMETERIZED generator
// (numbers regenerate per attempt). Every wrong option encodes a diagnostic cause. Answerable from
// the concept's lesson alone.

export const FA_ITEMS = [
  // ============================ FA-04 — the five elements ============================
  {
    id: 'FA-04-CC1', conceptIds: ['FA-04'], rung: 'concept-check', marks: 1,
    stem: 'Which is the lesson’s definition of an ASSET?',
    options: [
      { id: 'a', text: 'A resource the business controls from a past event, expected to bring future economic benefit' },
      { id: 'b', text: 'A present obligation from a past event, expected to cause an outflow' },
      { id: 'c', text: 'Anything the business has paid cash for this year' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'An asset is a controlled resource from a past event bringing future benefit; option b defines a liability.',
  },
  {
    id: 'FA-04-CC2', conceptIds: ['FA-04'], rung: 'concept-check', marks: 1,
    stem: 'Equity is best described as:',
    options: [
      { id: 'a', text: 'The residual — assets minus liabilities' },
      { id: 'b', text: 'The total of all the cash the business holds' },
      { id: 'c', text: 'A present obligation to outsiders' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Equity is the residual (assets − liabilities), never measured directly.',
  },
  {
    id: 'FA-04-CC3', conceptIds: ['FA-04'], rung: 'concept-check', marks: 1,
    stem: 'Rent paid by the business is which element?',
    options: [
      { id: 'a', text: 'An expense — a decrease in economic benefit' },
      { id: 'b', text: 'A liability — a present obligation' },
      { id: 'c', text: 'Income — an increase in economic benefit' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Rent paid decreases economic benefit → an expense.',
  },
  {
    id: 'FA-04-G1', conceptIds: ['FA-04'], rung: 'guided', marks: 1,
    stem: 'Money that customers owe Wanjiku for goods already delivered is which element?',
    options: [
      { id: 'a', text: 'An asset — a resource she controls, expected to bring future benefit (cash)' },
      { id: 'b', text: 'A liability — because it involves other people' },
      { id: 'c', text: 'Income — because it came from a sale' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Does she control a future benefit, or owe an outflow?', 'A receivable is a controlled resource → an asset.'],
    rationale: 'A receivable is a controlled resource expected to bring cash → an asset.',
  },
  {
    id: 'FA-04-G2', conceptIds: ['FA-04'], rung: 'guided', marks: 1,
    stem: 'A supplier’s unpaid bill for goods already received is which element, and why?',
    options: [
      { id: 'a', text: 'A liability — a present obligation from a past event, expected to cause an outflow' },
      { id: 'b', text: 'An expense — because buying goods is a cost' },
      { id: 'c', text: 'Equity — because it is money owed' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['An unpaid bill is something owed to an outsider.', 'A present obligation causing a future outflow → a liability.'],
    rationale: 'An unpaid supplier bill is a present obligation → a liability (equity is what is owed to the owner).',
  },
  {
    id: 'FA-04-G3', conceptIds: ['FA-04'], rung: 'guided', marks: 1,
    stem: 'Why does the lesson say equity is "not a thing you can point to"?',
    options: [
      { id: 'a', text: 'Because it is never measured directly — it is whatever is left when liabilities are taken from assets' },
      { id: 'b', text: 'Because equity is always exactly zero' },
      { id: 'c', text: 'Because equity is a physical asset kept in the safe' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    scaffold: ['Equity is defined as a residual.', 'A residual is calculated, not observed directly.'],
    rationale: 'Equity is a residual (assets − liabilities); capital, profit and drawings all flow through it.',
  },
  {
    id: 'FA-04-S1', conceptIds: ['FA-04'], rung: 'standard', marks: 1,
    stem: 'Which row classifies all three items correctly?',
    options: [
      { id: 'a', text: 'Cash = asset; a bank loan = liability; a cash sale = income' },
      { id: 'b', text: 'Cash = income; a bank loan = expense; a cash sale = asset' },
      { id: 'c', text: 'Cash = asset; a bank loan = expense; a cash sale = equity' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Cash is an asset, a loan a liability, a sale is income.',
  },
  {
    id: 'FA-04-S2', conceptIds: ['FA-04'], rung: 'standard', marks: 1,
    stem: 'Which statement about income and expenses is correct per the lesson?',
    options: [
      { id: 'a', text: 'Income is an increase in economic benefit; expenses are a decrease' },
      { id: 'b', text: 'Income is a resource controlled; expenses are a present obligation' },
      { id: 'c', text: 'Income and expenses are both residuals' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Income = benefit up; expenses = benefit down.',
  },
  {
    id: 'FA-04-S3', conceptIds: ['FA-04'], rung: 'standard', marks: 1,
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
    id: 'FA-04-ST1', conceptIds: ['FA-04'], rung: 'stretch', marks: 2,
    stem: 'Wanjiku receives KES 5,000 today from a customer for goods she will deliver next month. Using only the five definitions, what has she recognised now?',
    options: [
      { id: 'a', text: 'An asset (the cash received) and a liability (a present obligation to deliver the goods) — not income yet, because the benefit has not been earned' },
      { id: 'b', text: 'Income of KES 5,000, because cash has arrived' },
      { id: 'c', text: 'Only an expense, because she must now do work' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'Cash in is an asset; the duty to deliver is a present obligation (liability). Income is not yet an increase in benefit until earned.',
  },

  // ============================ FA-05 — the accounting equation (CAPPED: max 2 items) ============================
  {
    id: 'FA-05-CC1', conceptIds: ['FA-05'], rung: 'concept-check', marks: 1,
    stem: 'The accounting equation is:',
    options: [
      { id: 'a', text: 'Assets = Capital + Liabilities' },
      { id: 'b', text: 'Assets = Capital − Liabilities' },
      { id: 'c', text: 'Capital = Assets + Liabilities' },
    ],
    answerId: 'a',
    distractors: { b: 'careless_slip', c: 'conceptual_misunderstanding' },
    rationale: 'Assets = Capital + Liabilities — the business owes its owner (capital) and outsiders (liabilities).',
  },
  {
    id: 'FA-05-S1', conceptIds: ['FA-05'], rung: 'standard', marks: 1,
    stem: 'A business has assets of KES 50,000 and liabilities of KES 18,000. What is capital, and why does the equation still hold after the owner takes KES 2,000 of drawings in cash?',
    options: [
      { id: 'a', text: 'Capital = KES 32,000; drawings cut both cash (an asset) and capital by KES 2,000, so both sides fall by 2,000 and stay equal' },
      { id: 'b', text: 'Capital = KES 68,000; drawings raise capital because the owner is involved' },
      { id: 'c', text: 'Capital = KES 32,000; drawings break the equation because only one side changes' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Capital = 50,000 − 18,000 = 32,000. Drawings reduce cash and capital equally (duality), so the equation stays balanced.',
  },

  // ============================ FA-11 — duality & double entry (parameterized) ============================
  {
    id: 'FA-11-CC1', conceptIds: ['FA-11'], rung: 'concept-check', marks: 1,
    stem: 'In bookkeeping, "debit" and "credit" mean:',
    options: [
      { id: 'a', text: 'The left and right sides of an account — neither is "good" or "bad"' },
      { id: 'b', text: 'A loss and a gain respectively' },
      { id: 'c', text: 'Money out of the bank and money into the bank' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Debit = left, credit = right; the bank-statement meaning is the opposite and must be unlearned.',
  },
  {
    id: 'FA-11-CC2', conceptIds: ['FA-11'], rung: 'concept-check', marks: 1,
    stem: 'Under DEAD CLIC, a DEBIT increases which of these?',
    options: [
      { id: 'a', text: 'Expenses, Assets and Drawings' },
      { id: 'b', text: 'Liabilities, Income and Capital' },
      { id: 'c', text: 'Only cash at bank' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'DEAD: Debits increase Expenses, Assets, Drawings. CLIC: Credits increase Liabilities, Income, Capital.',
  },
  {
    id: 'FA-11-CC3', conceptIds: ['FA-11'], rung: 'concept-check', marks: 1,
    stem: 'Why do total debits always equal total credits across the whole system?',
    options: [
      { id: 'a', text: 'Because every transaction has two equal and opposite effects (duality)' },
      { id: 'b', text: 'Because an accountant checks and forces them to match each night' },
      { id: 'c', text: 'Because debits are always larger, then rounded down' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Duality — equal and opposite effects — makes the debits and credits balance automatically.',
  },
  {
    id: 'FA-11-G1', conceptIds: ['FA-11'], rung: 'guided', marks: 1,
    stem: 'Wanjiku buys inventory for KES 12,000 cash. What are the two entries?',
    options: [
      { id: 'a', text: 'Dr Inventory 12,000 / Cr Cash 12,000' },
      { id: 'b', text: 'Dr Cash 12,000 / Cr Inventory 12,000' },
      { id: 'c', text: 'Dr Inventory 12,000 / Cr Sales 12,000' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    scaffold: ['Inventory (asset) rises → debit it (DEAD).', 'Cash (asset) falls → credit it.'],
    rationale: 'Inventory up = Dr; cash down = Cr. Option b reverses the sides; c uses the wrong account.',
  },
  {
    id: 'FA-11-G2', conceptIds: ['FA-11'], rung: 'guided', marks: 1,
    stem: 'Wanjiku makes a credit sale of KES 9,000. What are the two entries?',
    options: [
      { id: 'a', text: 'Dr Receivables 9,000 / Cr Sales 9,000' },
      { id: 'b', text: 'Dr Sales 9,000 / Cr Receivables 9,000' },
      { id: 'c', text: 'Dr Cash 9,000 / Cr Sales 9,000' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    scaffold: ['A receivable (asset) rises → debit it.', 'Sales (income) rises → credit it (CLIC).'],
    rationale: 'Receivable up = Dr, income up = Cr. Option c wrongly treats a credit sale as a cash sale.',
  },
  {
    id: 'FA-11-G3', conceptIds: ['FA-11'], rung: 'guided', marks: 1,
    stem: 'Which increase is recorded with a CREDIT?',
    options: [
      { id: 'a', text: 'An increase in a liability (e.g. a loan taken out)' },
      { id: 'b', text: 'An increase in an asset (e.g. cash received)' },
      { id: 'c', text: 'An increase in an expense (e.g. rent paid)' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['CLIC: Credits increase Liabilities, Income, Capital.', 'Assets and expenses increase on the debit side.'],
    rationale: 'Liabilities increase with a credit (CLIC); assets and expenses increase with a debit (DEAD).',
  },
  {
    // Parameterized standard item — transaction and amount regenerate per attempt.
    id: 'FA-11-S1', conceptIds: ['FA-11'], rung: 'standard', marks: 1,
    generate: (rng) => {
      const amt = rng.step(3000, 30000, 1000);
      const money = amt.toLocaleString('en-KE');
      const txns = [
        { desc: `buys inventory for KES ${money} in cash`, dr: 'Inventory', cr: 'Cash', wDr: 'Cash', wCr: 'Inventory' },
        { desc: `pays rent of KES ${money} in cash`, dr: 'Rent expense', cr: 'Cash', wDr: 'Cash', wCr: 'Rent expense' },
        { desc: `receives KES ${money} cash as new capital from the owner`, dr: 'Cash', cr: 'Capital', wDr: 'Capital', wCr: 'Cash' },
        { desc: `takes out a bank loan of KES ${money} in cash`, dr: 'Cash', cr: 'Loan', wDr: 'Loan', wCr: 'Cash' },
      ];
      const t = rng.pick(txns);
      return {
        stem: `The business ${t.desc}. Which is the correct double entry?`,
        options: [
          { id: 'a', text: `Dr ${t.dr} ${money} / Cr ${t.cr} ${money}` },
          { id: 'b', text: `Dr ${t.wDr} ${money} / Cr ${t.wCr} ${money}` },
          { id: 'c', text: `Dr ${t.dr} ${money} / Cr ${t.dr} ${money}` },
        ],
        answerId: 'a',
        distractors: { b: 'conceptual_misunderstanding', c: 'careless_slip' },
        rationale: `Correct: Dr ${t.dr} / Cr ${t.cr}. Option b reverses the debit and credit (DEAD CLIC confusion); option c debits and credits the same account, so nothing balances.`,
      };
    },
  },
  {
    id: 'FA-11-S2', conceptIds: ['FA-11'], rung: 'standard', marks: 1,
    stem: 'An entry reads "Dr Rent expense / Cr Cash 4,000". Which statement is correct?',
    options: [
      { id: 'a', text: 'An expense increases (debit, DEAD) and cash decreases (credit); debits equal credits at 4,000' },
      { id: 'b', text: 'The entry is wrong because an expense should be credited' },
      { id: 'c', text: 'The entry is wrong because cash paid should be debited' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Expense up = Dr, cash down = Cr — the entry is correct and balanced.',
  },
  {
    id: 'FA-11-S3', conceptIds: ['FA-11'], rung: 'standard', marks: 1,
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
  {
    id: 'FA-11-ST1', conceptIds: ['FA-11'], rung: 'stretch', marks: 2,
    stem: 'Wanjiku repays KES 6,000 of a bank loan in cash. Using only DEAD CLIC, give the entry and explain each side.',
    options: [
      { id: 'a', text: 'Dr Loan 6,000 (a liability decreases — the opposite side to CLIC) / Cr Cash 6,000 (an asset decreases — the opposite side to DEAD)' },
      { id: 'b', text: 'Dr Cash 6,000 / Cr Loan 6,000, because cash is involved' },
      { id: 'c', text: 'Dr Loan 6,000 / Cr Capital 6,000, because it reduces what she owes' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    rationale: 'A liability decreasing is debited (opposite of CLIC); cash decreasing is credited (opposite of DEAD).',
  },

  // ============================ FA-13 — books of prime entry ============================
  {
    id: 'FA-13-CC1', conceptIds: ['FA-13'], rung: 'concept-check', marks: 1,
    stem: 'A book of prime entry is:',
    options: [
      { id: 'a', text: 'The first listing stage where a transaction is recorded, before it is posted to the ledger' },
      { id: 'b', text: 'The double-entry ledger itself' },
      { id: 'c', text: 'The published financial statements' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Books of prime (first) entry are the intake/listing stage — NOT yet the double-entry ledger.',
  },
  {
    id: 'FA-13-CC2', conceptIds: ['FA-13'], rung: 'concept-check', marks: 1,
    stem: 'How many books of prime entry does the lesson list?',
    options: [
      { id: 'a', text: 'Seven' },
      { id: 'b', text: 'Five' },
      { id: 'c', text: 'Three' },
    ],
    answerId: 'a',
    distractors: { b: 'knowledge_gap', c: 'knowledge_gap' },
    rationale: 'Seven: sales and sales returns day books, purchases and purchases returns day books, cash book, petty cash book, and the journal.',
  },
  {
    id: 'FA-13-CC3', conceptIds: ['FA-13'], rung: 'concept-check', marks: 1,
    stem: 'Which book of prime entry handles corrections, year-end adjustments and other non-routine items?',
    options: [
      { id: 'a', text: 'The journal' },
      { id: 'b', text: 'The cash book' },
      { id: 'c', text: 'The sales day book' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'The journal takes everything odd — corrections, adjustments, opening and non-routine entries.',
  },
  {
    id: 'FA-13-G1', conceptIds: ['FA-13'], rung: 'guided', marks: 1,
    stem: 'A customer returns goods she had bought on credit. Which book of prime entry records this?',
    options: [
      { id: 'a', text: 'The sales returns day book' },
      { id: 'b', text: 'The purchases returns day book' },
      { id: 'c', text: 'The sales day book' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['Whose goods are coming back — a customer’s or a supplier’s?', 'Goods coming back FROM a credit customer → sales returns day book.'],
    rationale: 'Goods returned by a credit customer go to the sales returns day book (a credit note you issue).',
  },
  {
    id: 'FA-13-G2', conceptIds: ['FA-13'], rung: 'guided', marks: 1,
    stem: 'Wanjiku buys a small item of postage with a few shillings from the office float. Which book?',
    options: [
      { id: 'a', text: 'The petty cash book' },
      { id: 'b', text: 'The cash book' },
      { id: 'c', text: 'The purchases day book' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    scaffold: ['A very small cash payment from a float has its own book.', 'The petty cash book, run on the imprest system.'],
    rationale: 'Small cash payments from the float go to the petty cash book (imprest system).',
  },
  {
    id: 'FA-13-G3', conceptIds: ['FA-13'], rung: 'guided', marks: 1,
    stem: 'After a transaction is written into a day book, how is it posted to the ledger?',
    options: [
      { id: 'a', text: 'In periodic TOTALS to the general (nominal) ledger, with individual balances kept in memorandum ledgers' },
      { id: 'b', text: 'One transaction at a time, directly into the financial statements' },
      { id: 'c', text: 'It is never posted; the day book is the final record' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    scaffold: ['The whole point of the intake is to avoid posting every item singly.', 'Post totals to the nominal ledger; keep customer/supplier detail in memorandum ledgers.'],
    rationale: 'Day books are posted in totals to the nominal ledger; memorandum ledgers hold the individual balances.',
  },
  {
    id: 'FA-13-S1', conceptIds: ['FA-13'], rung: 'standard', marks: 1,
    stem: 'Match each transaction to its book: (i) credit purchase of sodas for resale; (ii) a spoiled batch returned to the distributor; (iii) the electricity bill paid by M-Pesa.',
    options: [
      { id: 'a', text: '(i) purchases day book; (ii) purchases returns day book; (iii) cash book' },
      { id: 'b', text: '(i) sales day book; (ii) sales returns day book; (iii) petty cash book' },
      { id: 'c', text: '(i) purchases day book; (ii) sales returns day book; (iii) the journal' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Credit purchase → purchases day book; goods returned to a supplier → purchases returns day book; money paid out → cash book.',
  },
  {
    id: 'FA-13-S2', conceptIds: ['FA-13'], rung: 'standard', marks: 1,
    stem: 'Which statement about the intake flow is correct?',
    options: [
      { id: 'a', text: 'Source document → book of prime entry → posted in totals to the nominal ledger' },
      { id: 'b', text: 'Nominal ledger → book of prime entry → source document' },
      { id: 'c', text: 'Source document → nominal ledger → book of prime entry' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'The flow is document → prime entry → ledger (in totals).',
  },
  {
    id: 'FA-13-S3', conceptIds: ['FA-13'], rung: 'standard', marks: 1,
    stem: 'Why is the year-end depreciation charge recorded in the journal rather than a day book?',
    options: [
      { id: 'a', text: 'Because it is a non-routine adjustment that fits none of the routine day books — which is exactly what the journal is for' },
      { id: 'b', text: 'Because depreciation is a credit sale' },
      { id: 'c', text: 'Because depreciation is a cash payment' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Depreciation is a year-end adjustment, not a routine trade transaction, so it goes to the journal.',
  },
  {
    id: 'FA-13-ST1', conceptIds: ['FA-13'], rung: 'stretch', marks: 2,
    stem: 'A bookkeeper posts every single credit sale straight into the nominal ledger, one at a time, skipping the sales day book. Using only this lesson, what has been lost?',
    options: [
      { id: 'a', text: 'The calm intake/listing stage — errors now scatter across the ledger and the point of posting periodic totals (not one item at a time) is defeated' },
      { id: 'b', text: 'Nothing — the day book is optional decoration' },
      { id: 'c', text: 'The double entry, because a nominal ledger cannot record sales at all' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'Skipping the day book removes the sorted intake and total-posting; errors scatter, which is the mess the intake exists to prevent.',
  },

  // ============================ FA-22 — cost and net realisable value ============================
  {
    id: 'FA-22-CC1', conceptIds: ['FA-22'], rung: 'concept-check', marks: 1,
    stem: 'Under IAS 2, inventory is valued at:',
    options: [
      { id: 'a', text: 'The lower of cost and net realisable value' },
      { id: 'b', text: 'The higher of cost and net realisable value' },
      { id: 'c', text: 'Always its original cost' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Prudence: inventory is carried at the LOWER of cost and NRV, never above what it can realise.',
  },
  {
    id: 'FA-22-CC2', conceptIds: ['FA-22'], rung: 'concept-check', marks: 1,
    stem: 'Net realisable value (NRV) is:',
    options: [
      { id: 'a', text: 'Expected selling price − costs to complete − costs to sell' },
      { id: 'b', text: 'Original purchase cost + a mark-up' },
      { id: 'c', text: 'Selling price + costs to sell' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'careless_slip' },
    rationale: 'NRV = expected selling price less costs to complete and costs to sell.',
  },
  {
    id: 'FA-22-CC3', conceptIds: ['FA-22'], rung: 'concept-check', marks: 1,
    stem: 'The lower-of-cost-and-NRV rule is applied:',
    options: [
      { id: 'a', text: 'Item by item (or by group of similar items), not to the total pile' },
      { id: 'b', text: 'Only to the grand total of all inventory' },
      { id: 'c', text: 'Only once every five years' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'knowledge_gap' },
    rationale: 'It is applied line by line so a loss on one line is not hidden by a profit expected on another.',
  },
  {
    id: 'FA-22-G1', conceptIds: ['FA-22'], rung: 'guided', marks: 1,
    stem: 'A line of stock cost KES 8,000 but, water-damaged, can now fetch only KES 5,000 net. At what value is it carried, and what is the effect?',
    options: [
      { id: 'a', text: 'KES 5,000 — a write-down of KES 3,000 that raises cost of sales and lowers profit' },
      { id: 'b', text: 'KES 8,000 — cost is always kept' },
      { id: 'c', text: 'KES 13,000 — cost plus NRV' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'careless_slip' },
    scaffold: ['Compare cost (8,000) with NRV (5,000): take the lower.', 'The fall from 8,000 to 5,000 is the write-down.'],
    rationale: 'NRV 5,000 < cost 8,000 → carry at 5,000; the 3,000 write-down hits cost of sales.',
  },
  {
    id: 'FA-22-G2', conceptIds: ['FA-22'], rung: 'guided', marks: 1,
    stem: 'A line cost KES 6,000 and its NRV is KES 6,500. At what value is it carried?',
    options: [
      { id: 'a', text: 'KES 6,000 — cost, because NRV is higher' },
      { id: 'b', text: 'KES 6,500 — NRV, because it is the latest figure' },
      { id: 'c', text: 'KES 500 — the difference' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    scaffold: ['Take the lower of cost (6,000) and NRV (6,500).', 'When NRV ≥ cost, no write-down — leave it at cost.'],
    rationale: 'NRV ≥ cost, so the item stays at cost 6,000; you never write inventory UP to NRV.',
  },
  {
    id: 'FA-22-G3', conceptIds: ['FA-22'], rung: 'guided', marks: 1,
    stem: 'Why does the standard forbid comparing TOTAL cost with TOTAL NRV across all lines?',
    options: [
      { id: 'a', text: 'Because a profit expected on one line would offset (hide) a loss on another — the very loss the rule is designed to surface' },
      { id: 'b', text: 'Because totals are harder to add up' },
      { id: 'c', text: 'Because NRV cannot be measured for a group' },
    ],
    answerId: 'a',
    distractors: { b: 'knowledge_gap', c: 'conceptual_misunderstanding' },
    scaffold: ['Think about what a total-vs-total comparison lets one line do to another.', 'It lets an expected profit bury a loss — prudence forbids this.'],
    rationale: 'Total-vs-total lets a profit on one line offset a loss on another, hiding the loss prudence wants surfaced.',
  },
  {
    id: 'FA-22-S1', conceptIds: ['FA-22'], rung: 'standard', marks: 2,
    stem: 'Three lines: A cost 10,000 / NRV 12,000; B cost 8,000 / NRV 5,000; C cost 6,000 / NRV 6,500. At what total should inventory be carried?',
    options: [
      { id: 'a', text: 'KES 21,000' },
      { id: 'b', text: 'KES 23,500' },
      { id: 'c', text: 'KES 24,000' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Line by line: 10,000 + 5,000 + 6,000 = 21,000. 23,500 is the wrong total-vs-total answer; 24,000 ignores NRV entirely.',
  },
  {
    id: 'FA-22-S2', conceptIds: ['FA-22'], rung: 'standard', marks: 1,
    stem: 'Goods cost KES 20,000. To sell them Wanjiku must first repair them for KES 3,000 and pay KES 1,000 selling costs; they will then fetch KES 21,000. What is NRV, and how is the stock carried?',
    options: [
      { id: 'a', text: 'NRV = 21,000 − 3,000 − 1,000 = 17,000; carried at 17,000 (lower than cost)' },
      { id: 'b', text: 'NRV = 21,000; carried at 20,000 (cost, being lower)' },
      { id: 'c', text: 'NRV = 21,000 + 3,000 + 1,000 = 25,000; carried at 20,000' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'careless_slip' },
    rationale: 'NRV = selling price − costs to complete − costs to sell = 21,000 − 3,000 − 1,000 = 17,000 < cost 20,000 → carry at 17,000.',
  },
  {
    id: 'FA-22-S3', conceptIds: ['FA-22'], rung: 'standard', marks: 1,
    stem: 'Which situation triggers a write-down of an inventory line?',
    options: [
      { id: 'a', text: 'When NRV falls below cost — the item is written down to NRV' },
      { id: 'b', text: 'When NRV rises above cost — the item is written up to NRV' },
      { id: 'c', text: 'Whenever the item has been held for more than a month, regardless of value' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'knowledge_gap' },
    rationale: 'A write-down happens only when NRV < cost; you never write inventory up above cost.',
  },
  {
    id: 'FA-22-ST1', conceptIds: ['FA-22'], rung: 'stretch', marks: 2,
    stem: 'One line shows an expected profit of KES 2,000 (cost 10,000, NRV 12,000) and another an expected loss of KES 4,000 (cost 9,000, NRV 5,000). A junior nets them to a KES 2,000 loss and reduces total inventory by 2,000. Using only this lesson, what is wrong and what is correct?',
    options: [
      { id: 'a', text: 'Wrong: profits are not anticipated and cannot offset a loss. Correct: line A stays at cost 10,000 and line B is written down to 5,000 — the 4,000 loss is recognised in full, the 2,000 profit ignored' },
      { id: 'b', text: 'Correct as done — netting to a 2,000 loss is exactly what prudence requires' },
      { id: 'c', text: 'Wrong: both lines should be written up to their NRVs and the difference taken to profit' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Line by line: A at cost 10,000 (no profit anticipated), B written down to 5,000 (full 4,000 loss). Netting hides B’s loss.',
  },

  // ============================ FA-26 — depreciation (parameterized) ============================
  {
    id: 'FA-26-CC1', conceptIds: ['FA-26'], rung: 'concept-check', marks: 1,
    stem: 'Depreciation is best described as:',
    options: [
      { id: 'a', text: 'Spreading an asset’s cost over the years it serves — matching cost to benefit' },
      { id: 'b', text: 'Revaluing the asset to its current market price each year' },
      { id: 'c', text: 'A cash payment made each year for the asset' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Depreciation matches cost to the years served; it is neither a valuation nor a cash payment.',
  },
  {
    id: 'FA-26-CC2', conceptIds: ['FA-26'], rung: 'concept-check', marks: 1,
    stem: 'The straight-line annual charge is:',
    options: [
      { id: 'a', text: '(cost − residual value) ÷ useful life' },
      { id: 'b', text: 'cost ÷ useful life' },
      { id: 'c', text: 'a fixed % of the carrying amount each year' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Straight-line = (cost − residual) ÷ life. Option c describes reducing balance.',
  },
  {
    id: 'FA-26-CC3', conceptIds: ['FA-26'], rung: 'concept-check', marks: 1,
    stem: 'Carrying amount equals:',
    options: [
      { id: 'a', text: 'Cost − accumulated depreciation (unexpired cost, NOT market value)' },
      { id: 'b', text: 'What a buyer would currently pay for the asset' },
      { id: 'c', text: 'Cost + accumulated depreciation' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'careless_slip' },
    rationale: 'Carrying amount = cost − accumulated depreciation = unexpired cost, not market value.',
  },
  {
    id: 'FA-26-G1', conceptIds: ['FA-26'], rung: 'guided', marks: 2,
    stem: 'A fridge costs KES 40,000, has residual value KES 4,000 and a useful life of 6 years. What is the straight-line annual charge?',
    options: [
      { id: 'a', text: 'KES 6,000' },
      { id: 'b', text: 'KES 6,667' },
      { id: 'c', text: 'KES 7,333' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'calculation_error' },
    scaffold: ['Subtract residual from cost: 40,000 − 4,000 = 36,000.', 'Divide by useful life: 36,000 ÷ 6.'],
    rationale: '(40,000 − 4,000) ÷ 6 = 6,000. Option b forgets to subtract residual (40,000 ÷ 6).',
  },
  {
    id: 'FA-26-G2', conceptIds: ['FA-26'], rung: 'guided', marks: 1,
    stem: 'The annual depreciation charge is KES 6,000. What is the year-end double entry?',
    options: [
      { id: 'a', text: 'Dr Depreciation expense 6,000 / Cr Accumulated depreciation 6,000' },
      { id: 'b', text: 'Dr Accumulated depreciation 6,000 / Cr Depreciation expense 6,000' },
      { id: 'c', text: 'Dr Depreciation expense 6,000 / Cr Asset cost 6,000' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    scaffold: ['The expense increases (debit).', 'The contra-asset "accumulated depreciation" increases (credit); original cost is never touched.'],
    rationale: 'Dr Depreciation expense / Cr Accumulated depreciation. Option c wrongly reduces the asset’s original cost.',
  },
  {
    id: 'FA-26-G3', conceptIds: ['FA-26'], rung: 'guided', marks: 2,
    stem: 'With an annual charge of KES 6,000 on a KES 40,000 fridge, what is the carrying amount at the end of year 2?',
    options: [
      { id: 'a', text: 'KES 28,000' },
      { id: 'b', text: 'KES 34,000' },
      { id: 'c', text: 'KES 12,000' },
    ],
    answerId: 'a',
    distractors: { b: 'calculation_error', c: 'requirement_misread' },
    scaffold: ['Accumulated depreciation after 2 years = 2 × 6,000 = 12,000.', 'Carrying amount = cost 40,000 − 12,000.'],
    rationale: 'Cost 40,000 − accumulated 12,000 = 28,000. Option c gives the accumulated depreciation, not the carrying amount.',
  },
  {
    // Parameterized standard item — cost, life and residual regenerate; the split stays clean.
    id: 'FA-26-S1', conceptIds: ['FA-26'], rung: 'standard', marks: 2,
    generate: (rng) => {
      const annual = rng.step(2000, 8000, 500); // clean annual charge
      const life = rng.pick([4, 5, 6, 8]);
      const residual = rng.step(1000, 6000, 500);
      const cost = annual * life + residual;
      const money = (n) => `KES ${n.toLocaleString('en-KE')}`;
      // Distractors always distinct: forgetting residual is strictly ABOVE the true charge
      // (cost/life > (cost−residual)/life); dividing by life+1 is strictly BELOW it. So c < a < b.
      const forgotResidual = Math.round(cost / life); // ignores residual (> annual)
      const wrongLife = Math.round((cost - residual) / (life + 1)); // divides by life+1 (< annual)
      return {
        stem: `An asset costs ${money(cost)}, has a residual value of ${money(residual)} and a useful life of ${life} years. What is the straight-line annual depreciation charge?`,
        options: [
          { id: 'a', text: money(annual) },
          { id: 'b', text: money(forgotResidual) },
          { id: 'c', text: money(wrongLife) },
        ],
        answerId: 'a',
        distractors: { b: 'incorrect_treatment', c: 'calculation_error' },
        rationale: `(${money(cost)} − ${money(residual)}) ÷ ${life} = ${money(annual)}. Option b forgets to subtract residual; option c divides by too many years (life + 1).`,
      };
    },
  },
  {
    id: 'FA-26-S2', conceptIds: ['FA-26'], rung: 'standard', marks: 1,
    stem: 'Which statement about the two depreciation methods is correct?',
    options: [
      { id: 'a', text: 'Straight-line gives equal charges each year; reducing balance gives big charges early that shrink over time' },
      { id: 'b', text: 'Reducing balance gives equal charges; straight-line gives shrinking charges' },
      { id: 'c', text: 'Both methods use a different double entry from each other' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    rationale: 'Straight-line = equal slices; reducing balance = big-then-shrinking. The double entry is identical for both.',
  },
  {
    id: 'FA-26-S3', conceptIds: ['FA-26'], rung: 'standard', marks: 1,
    stem: 'Which asset is NOT depreciated?',
    options: [
      { id: 'a', text: 'Land' },
      { id: 'b', text: 'A building' },
      { id: 'c', text: 'A delivery van' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'Land is not depreciated; buildings and vehicles are.',
  },
  {
    id: 'FA-26-ST1', conceptIds: ['FA-26'], rung: 'stretch', marks: 2,
    stem: 'After 2 years the fridge (cost 40,000, charge 6,000/yr) has a carrying amount of KES 28,000, but a dealer offers only KES 15,000 for it. Using only this lesson, is that a problem for the carrying amount, and why?',
    options: [
      { id: 'a', text: 'No — carrying amount is unexpired cost (cost − accumulated depreciation), NOT market value, so the KES 15,000 offer does not by itself change it' },
      { id: 'b', text: 'Yes — the fridge must immediately be written down to KES 15,000 because that is what it would fetch' },
      { id: 'c', text: 'Yes — depreciation must be recalculated so the carrying amount equals the KES 15,000 offer' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'incorrect_treatment' },
    rationale: 'Carrying amount is unexpired cost, not market value; this lesson does not equate the two (impairment/revaluation come later in FR).',
  },

  // ============================ FA-63 — liquidity & efficiency ratios (parameterized) ============================
  {
    id: 'FA-63-CC1', conceptIds: ['FA-63'], rung: 'concept-check', marks: 1,
    stem: 'The current ratio is:',
    options: [
      { id: 'a', text: 'current assets ÷ current liabilities' },
      { id: 'b', text: 'current liabilities ÷ current assets' },
      { id: 'c', text: '(current assets − inventory) ÷ current liabilities' },
    ],
    answerId: 'a',
    distractors: { b: 'careless_slip', c: 'conceptual_misunderstanding' },
    rationale: 'Current ratio = current assets ÷ current liabilities. Option c is the quick ratio.',
  },
  {
    id: 'FA-63-CC2', conceptIds: ['FA-63'], rung: 'concept-check', marks: 1,
    stem: 'The quick (acid-test) ratio differs from the current ratio by:',
    options: [
      { id: 'a', text: 'Stripping out inventory — the slowest current asset — from the top line' },
      { id: 'b', text: 'Adding inventory twice' },
      { id: 'c', text: 'Using non-current instead of current liabilities' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'Quick ratio = (current assets − inventory) ÷ current liabilities — inventory removed.',
  },
  {
    id: 'FA-63-CC3', conceptIds: ['FA-63'], rung: 'concept-check', marks: 1,
    stem: 'The cash operating cycle is:',
    options: [
      { id: 'a', text: 'inventory days + receivables days − payables days' },
      { id: 'b', text: 'inventory days + receivables days + payables days' },
      { id: 'c', text: 'receivables days − inventory days − payables days' },
    ],
    answerId: 'a',
    distractors: { b: 'calculation_error', c: 'conceptual_misunderstanding' },
    rationale: 'Cash operating cycle = inventory days + receivables days − payables days.',
  },
  {
    id: 'FA-63-G1', conceptIds: ['FA-63'], rung: 'guided', marks: 2,
    stem: 'Current assets KES 300,000 (including inventory 120,000); current liabilities KES 150,000. What is the current ratio?',
    options: [
      { id: 'a', text: '2.0' },
      { id: 'b', text: '1.2' },
      { id: 'c', text: '0.5' },
    ],
    answerId: 'a',
    distractors: { b: 'requirement_misread', c: 'careless_slip' },
    scaffold: ['Current ratio uses ALL current assets over current liabilities.', '300,000 ÷ 150,000.'],
    rationale: '300,000 ÷ 150,000 = 2.0. Option b is the quick ratio; option c inverts the fraction.',
  },
  {
    id: 'FA-63-G2', conceptIds: ['FA-63'], rung: 'guided', marks: 2,
    stem: 'Using the same figures (current assets 300,000, inventory 120,000, current liabilities 150,000), what is the quick ratio?',
    options: [
      { id: 'a', text: '1.2' },
      { id: 'b', text: '2.0' },
      { id: 'c', text: '0.8' },
    ],
    answerId: 'a',
    distractors: { b: 'requirement_misread', c: 'calculation_error' },
    scaffold: ['Strip inventory from the top: 300,000 − 120,000 = 180,000.', '180,000 ÷ 150,000.'],
    rationale: '(300,000 − 120,000) ÷ 150,000 = 1.2. Option b forgets to strip inventory.',
  },
  {
    id: 'FA-63-G3', conceptIds: ['FA-63'], rung: 'guided', marks: 2,
    stem: 'Inventory KES 120,000 and cost of sales KES 600,000. What is inventory days (365-day year)?',
    options: [
      { id: 'a', text: 'About 73 days' },
      { id: 'b', text: 'About 5 days' },
      { id: 'c', text: 'About 183 days' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'calculation_error' },
    scaffold: ['Inventory days = inventory ÷ cost of sales × 365.', '120,000 ÷ 600,000 × 365.'],
    rationale: '120,000 ÷ 600,000 × 365 ≈ 73 days. Option b divides cost of sales by inventory then forgets ×365.',
  },
  {
    // Parameterized standard item — balance-sheet figures regenerate; the ratio stays clean.
    id: 'FA-63-S1', conceptIds: ['FA-63'], rung: 'standard', marks: 2,
    generate: (rng) => {
      const cl = rng.step(50000, 200000, 10000);
      const ratio = rng.pick([1.5, 2, 2.5]);
      const ca = Math.round(ratio * cl);
      const inventory = rng.step(10000, Math.max(10000, Math.floor(ca * 0.5 / 5000) * 5000), 5000);
      const money = (n) => `KES ${n.toLocaleString('en-KE')}`;
      const quick = Math.round(((ca - inventory) / cl) * 100) / 100;
      const inverted = Math.round((cl / ca) * 100) / 100;
      return {
        stem: `A business has current assets of ${money(ca)} (including inventory of ${money(inventory)}) and current liabilities of ${money(cl)}. What is the CURRENT ratio?`,
        options: [
          { id: 'a', text: ratio.toFixed(1) },
          { id: 'b', text: quick.toFixed(2) },
          { id: 'c', text: inverted.toFixed(2) },
        ],
        answerId: 'a',
        distractors: { b: 'requirement_misread', c: 'careless_slip' },
        rationale: `${money(ca)} ÷ ${money(cl)} = ${ratio.toFixed(1)}. Option b strips inventory (that is the QUICK ratio); option c inverts the fraction.`,
      };
    },
  },
  {
    id: 'FA-63-S2', conceptIds: ['FA-63'], rung: 'standard', marks: 1,
    stem: 'A firm’s current ratio is a high 3.0. Why does the lesson say this number alone "says nothing"?',
    options: [
      { id: 'a', text: 'Because it could mean healthy cover OR idle cash and bloated, unsellable inventory — only a comparison with last year or a rival tells which' },
      { id: 'b', text: 'Because a current ratio above 1 is always a sign of failure' },
      { id: 'c', text: 'Because the current ratio cannot be calculated without profit figures' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'knowledge_gap' },
    rationale: 'A ratio raises the question; the benchmark answers it — a high current ratio is ambiguous on its own.',
  },
  {
    id: 'FA-63-S3', conceptIds: ['FA-63'], rung: 'standard', marks: 2,
    stem: 'Receivables KES 90,000, credit sales KES 730,000. What is receivables days (365-day year), and what does a longer figure imply for cash?',
    options: [
      { id: 'a', text: 'About 45 days; a longer figure means cash is collected more slowly, so more cash is tied up' },
      { id: 'b', text: 'About 8 days; a longer figure means cash is collected faster' },
      { id: 'c', text: 'About 45 days; receivables days has no effect on cash' },
    ],
    answerId: 'a',
    distractors: { b: 'calculation_error', c: 'conceptual_misunderstanding' },
    rationale: '90,000 ÷ 730,000 × 365 ≈ 45 days; a longer cycle ties up more cash (per the lesson).',
  },
  {
    id: 'FA-63-ST1', conceptIds: ['FA-63'], rung: 'stretch', marks: 2,
    stem: 'Wanjiku Ltd’s inventory days rise from 40 to 73 while its current ratio also rises from 1.6 to 2.2. Using only this lesson, why might the "improved" current ratio actually be a warning?',
    options: [
      { id: 'a', text: 'The rising current ratio may simply reflect stock piling up unsold (inventory days almost doubling) — bloated, slow inventory inflates current assets without improving real liquidity' },
      { id: 'b', text: 'A higher current ratio is always unambiguously good, so there is no warning' },
      { id: 'c', text: 'The quick ratio must have risen by exactly the same amount, confirming health' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'transfer_failure' },
    rationale: 'The lesson warns a high current ratio can mean bloated unsellable inventory; the jump in inventory days points exactly there.',
  },

  // Examiner-report traps (FFA/FA Sep 2024–Aug 2025). See src/content/examiner-insights.js.
  {
    id: 'FA-04-EX1', conceptIds: ['FA-04'], rung: 'standard', marks: 1,
    stem: 'Which statement is correct about the two primary statements?',
    options: [
      { id: 'a', text: 'The statement of financial position shows assets, liabilities and equity AS AT a point in time; the statement of profit or loss shows performance FOR a period.' },
      { id: 'b', text: 'The statement of financial position shows performance for the period.' },
      { id: 'c', text: 'The statement of profit or loss shows the position as at a point in time.' },
    ],
    answerId: 'a',
    distractors: { b: 'conceptual_misunderstanding', c: 'conceptual_misunderstanding' },
    rationale: 'SOFP = position "as at" a date (A, L, E); SOPL = performance "for the year ended" (income, expenses). Examiners report candidates confusing the two. (FA Sep24–Aug25 Ex5.)',
  },
  {
    id: 'FA-11-EX1', conceptIds: ['FA-11'], rung: 'standard', marks: 1,
    stem: 'A customer’s cheque, previously recorded as received in the cash book (bank general ledger), is returned unpaid by the bank. What is the correcting entry in the cash book?',
    options: [
      { id: 'a', text: 'Credit the bank ledger — reverse the original debit, since the money did not arrive' },
      { id: 'b', text: 'Debit the bank ledger again — the cheque was still received' },
      { id: 'c', text: 'No entry — a returned cheque is only a bank-reconciliation item' },
    ],
    answerId: 'a',
    distractors: { b: 'incorrect_treatment', c: 'conceptual_misunderstanding' },
    rationale: 'Receipts are debits in the cash book, so a dishonoured receipt is reversed with a CREDIT. A returned cheque is a genuine ledger adjustment, not merely a reconciliation item (that is a bank error or an unpresented cheque). (FA Sep24–Aug25 Ex1 & Ex6.)',
  },
];

export default FA_ITEMS;
