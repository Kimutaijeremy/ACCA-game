// diagnosis-demo.mjs — ten worked diagnoses in plain language, so the routing can be sanity-
// checked by reading, not by counting green tests. Run: node tools/diagnosis-demo.mjs
//
// Each case is a realistic ACCA item, the wrong option the learner chose, and what the engine
// concludes: the cause, its confidence, and the repair queued. Two cases make the three layers
// disagree so the micro-probe fires; one falls back to conceptual-plus-practice.

import { diagnose, resolveProbe } from '../src/engine/diagnose.js';

const CAUSE_LABEL = {
  knowledge_gap: 'knowledge gap',
  conceptual_misunderstanding: 'conceptual misunderstanding',
  calculation_error: 'calculation error',
  requirement_misread: 'requirement misread',
  incorrect_treatment: 'incorrect treatment',
  careless_slip: 'careless slip',
  transfer_failure: 'transfer failure',
};
const SOURCE_PHRASE = {
  distractor: 'the tagged wrong answer',
  'distractor+pattern': 'the wrong answer and the history agreeing',
  pattern: 'the pattern in the attempt history',
  probe: 'a one-question micro-probe',
  default: 'no confident signal → safe default',
};

const CASES = [
  {
    title: 'High-low method (MA) — arithmetic slip',
    question: "A bakery's electricity was KES 32,000 at 900 trays and KES 24,000 at 500 trays. Variable cost per tray?",
    options: { A: 'KES 20 (correct)', B: 'KES 16', C: 'KES 35.60', D: 'KES 8' },
    chose: 'B',
    item: { distractors: { B: 'calculation_error', C: 'conceptual_misunderstanding', D: 'calculation_error' } },
    attempt: { rung: 'standard' },
  },
  {
    title: 'Depreciation entry (FA) — wrong debits/credits',
    question: 'Annual depreciation on the fridge is KES 6,000. Which journal is correct?',
    options: {
      A: 'Dr Depreciation expense, Cr Accumulated depreciation (correct)',
      B: 'Dr Accumulated depreciation, Cr Depreciation expense',
      C: 'Dr Fridge (cost), Cr Bank',
      D: 'Dr Depreciation expense, Cr Bank',
    },
    chose: 'B',
    item: { distractors: { B: 'incorrect_treatment', C: 'incorrect_treatment', D: 'incorrect_treatment' } },
    attempt: { rung: 'standard' },
  },
  {
    title: 'Depreciation (FA) — answered the wrong question',
    question: 'Fridge cost 40,000, residual 4,000, life 6 years, straight-line, now 2 years old. Its CARRYING AMOUNT?',
    options: { A: 'KES 28,000 (correct)', B: 'KES 6,000', C: 'KES 12,000', D: 'KES 40,000' },
    chose: 'B',
    item: { distractors: { B: 'requirement_misread', C: 'conceptual_misunderstanding', D: 'conceptual_misunderstanding' } },
    attempt: { rung: 'standard' },
  },
  {
    title: 'Lower of cost and NRV (FA) — untyped item, first checkpoint',
    question: 'Inventory is valued at the lower of cost and ______?',
    options: { A: 'net realisable value (correct)', B: 'selling price', C: 'replacement cost', D: 'market value' },
    chose: 'B',
    item: { untyped: true, distractors: {} },
    attempt: { rung: 'concept-check' },
  },
  {
    title: 'Quick ratio (FA) — untyped, but the history speaks',
    question: 'Current assets 300,000 (incl. inventory 120,000), current liabilities 150,000. Quick ratio?',
    options: { A: '1.2 (correct)', B: '2.0', C: '0.8', D: '1.5' },
    chose: 'B',
    item: { untyped: true, distractors: {} },
    attempt: { rung: 'standard' },
    prior: [{ rung: 'guided', correct: true }],
  },
  {
    title: 'Mixed pack (FA) — right alone, wrong when interleaved',
    question: 'A mixed pack combines a disposal, a depreciation charge and a ratio in one scenario.',
    options: { A: 'correct combined answer', B: 'used carrying amount from the wrong year', C: '…', D: '…' },
    chose: 'B',
    item: { untyped: true, distractors: {} },
    attempt: { rung: 'integrated' },
    prior: [{ rung: 'standard', correct: true }],
  },
  {
    title: 'Stakeholders (BT) — fine untimed, wrong on the clock',
    question: 'Place KRA on Mendelow’s matrix (timed section).',
    options: { A: 'key player (correct)', B: 'keep informed', C: 'keep satisfied', D: 'minimal effort' },
    chose: 'B',
    item: { untyped: true, distractors: {} },
    attempt: { rung: 'standard', timed: true },
    prior: [{ rung: 'standard', correct: true, timed: false }],
  },
  {
    title: 'High-low (MA) — fast and wrong on a mastered-ish concept',
    question: 'Quick high-low split (learner is at Competent on this concept).',
    options: { A: 'correct', B: 'flipped the subtraction', C: '…', D: '…' },
    chose: 'B',
    item: { untyped: true, distractors: {} },
    attempt: { rung: 'standard', timeMs: 5000 },
    context: { conceptState: 'Competent', budgetMs: 24000 },
  },
  {
    title: 'CONFLICT → micro-probe → resolves (FA NRV)',
    question: 'Concept-check on NRV, with a wrong option that looks like an arithmetic slip.',
    options: { A: 'net realisable value (correct)', B: 'a mis-added figure', C: '…', D: '…' },
    chose: 'B',
    item: { distractors: { B: 'calculation_error' } }, // says calculation error…
    attempt: { rung: 'concept-check' }, // …but concept-check says knowledge gap
    probeResolvesTo: 'knowledge_gap',
  },
  {
    title: 'CONFLICT → micro-probe → inconclusive → conceptual-plus-practice (FA depreciation)',
    question: 'Standard depreciation item; wrong option is a treatment error, but the learner was fine at Guided.',
    options: { A: 'correct', B: 'reversed the entry', C: '…', D: '…' },
    chose: 'B',
    item: { distractors: { B: 'incorrect_treatment' } }, // says incorrect treatment…
    attempt: { rung: 'standard' },
    prior: [{ rung: 'guided', correct: true }], // …but pattern says conceptual
    probeResolvesTo: null, // probe inconclusive
  },
];

const out = (s = '') => process.stdout.write(s + '\n');
out('# Diagnosis engine — ten worked cases');
out('');
out('Read this to sanity-check the *judgement*, not the test count. Each case: the question, the '
  + 'wrong answer chosen, the cause diagnosed, the confidence, and the repair queued.');
out('');

CASES.forEach((c, i) => {
  const attempt = { itemId: 'demo-' + (i + 1), conceptIds: ['demo'], correct: false, distractor: c.chose, scaffold: false, timed: false, ...c.attempt };
  let d = diagnose({ attempt, item: c.item, prior: c.prior ?? [], context: c.context ?? {} });

  out('---');
  out('');
  out(`### ${i + 1}. ${c.title}`);
  out(`**Q.** ${c.question}`);
  for (const [k, v] of Object.entries(c.options)) {
    out(`- ${k}) ${v}${k === c.chose ? '   ← **chosen (wrong)**' : ''}`);
  }
  out('');

  if (d.needsProbe) {
    const cand = d.probe.candidates.map((x) => CAUSE_LABEL[x]).join('  vs  ');
    out(`- Layers **disagree/are silent** — provisional call: *${CAUSE_LABEL[d.cause]}* (confidence ${d.confidence}, ${SOURCE_PHRASE[d.source]}).`);
    out(`- **Micro-probe fires** (one follow-up) to decide between: ${cand}.`);
    d = resolveProbe(d, c.probeResolvesTo);
    if (c.probeResolvesTo) {
      out(`- Probe resolves → **${CAUSE_LABEL[d.cause]}** (confidence ${d.confidence}, via ${SOURCE_PHRASE[d.source]}).`);
    } else {
      out(`- Probe **inconclusive** → falls back to **${CAUSE_LABEL[d.cause]} + practice** (confidence ${d.confidence}) — a safe default, not a guess.`);
    }
  } else {
    out(`- **Diagnosis: ${CAUSE_LABEL[d.cause]}** (confidence ${d.confidence}, from ${SOURCE_PHRASE[d.source]}).`);
  }
  out(`- **Repair queued:** ${d.remediation.actions.join('; ')}.`);
  out('');
});
