// BT topic pages (Brief §6.3, rubric Execution Order §5A — Amendment A6). One page per sub-area:
// nutshell + exam readiness + ONE worked example. Reminder tone, Wanjiku voice kept light.
// Converted from the BT concept lessons (BT-01, BT-03/04, BT-05); questions still tag to concepts.

export const BT_TOPICS = [
  {
    topicId: 'BT A1', paper: 'BT', syllabusYear: '2026',
    title: 'Business organisations and their objectives',
    nutshell:
      'The first thing to fix about any business is what it IS and what it is FOR.\n'
      + '• **Sole trader** — one owner, total control, **unlimited liability**, not a separate legal person.\n'
      + '• **Partnership** — two or more owners sharing capital and profit; usually unlimited liability.\n'
      + '• **Limited liability company** — a **separate legal person**; owners (shareholders) risk only what they invested.\n'
      + '• **Not-for-profit / public sector / co-operative** — exists for a purpose other than profit.\n'
      + 'Purpose sets the measure of success: a **profit-orientated** business is judged on **profit**; a '
      + '**not-for-profit / public body** on **value for money — the three Es: economy** (buy inputs cheaply), '
      + '**efficiency** (outputs per input), **effectiveness** (did it meet its objective?).',
    examReadiness:
      '• The load-bearing distinction is **separate legal personhood → limited liability** — that is what marks a company off from a sole trader or partnership.\n'
      + '• Trap: don’t confuse "unlimited liability" (owner personally liable for debts) with anything about raising capital.\n'
      + '• A public/NFP body is judged on the **three Es**, never on profit — know all three by name and what each means.\n'
      + '• Same question ("is it doing well?") is answered differently depending on purpose.',
    worked: {
      prompt: 'For each, name the organisation type and the right measure of success: (a) a one-woman kibanda; (b) the county health clinic; (c) Safaricom PLC.',
      steps: [
        '(a) Sole trader — judged on profit (and the owner’s drawings), with unlimited liability on her.',
        '(b) Public-sector body — judged on value for money (economy, efficiency, effectiveness), not profit.',
        '(c) Limited liability company — judged on profit and shareholder return; owners risk only their shares.',
      ],
      answer: 'Sole trader → profit; public clinic → value for money (the three Es); PLC → profit and shareholder return with limited liability.',
    },
    rateFlags: [],
  },
  {
    topicId: 'BT A2', paper: 'BT', syllabusYear: '2026',
    title: 'Stakeholders: classification, power and interest',
    nutshell:
      'A **stakeholder** is anyone who affects, or is affected by, the organisation. Two tools, both examinable.\n'
      + '**Classification into three groups:**\n'
      + '• **Internal** — inside the business: employees, managers, the owner.\n'
      + '• **Connected** — tied by contract or investment: shareholders, customers, suppliers, lenders.\n'
      + '• **External** — outside but still affected: government, KRA, the community, pressure groups.\n'
      + '**Mendelow’s matrix — map each on power × interest:**\n'
      + '• High power + high interest → **key players**: manage closely.\n'
      + '• High power + low interest → **keep satisfied**.\n'
      + '• Low power + high interest → **keep informed**.\n'
      + '• Low power + low interest → **minimal effort**.\n'
      + 'Claims conflict (customers want low prices; suppliers want prompt, costlier payment), so stakeholder '
      + 'management is **prioritising by power and interest**, not pleasing everyone.',
    examReadiness:
      '• Know BOTH schemes — the three-group classification AND the 2×2 matrix; questions test either.\n'
      + '• The classic trap: **high power, low interest → keep satisfied** (NOT "keep informed", which is low-power/high-interest).\n'
      + '• The matrix is read **per decision** — the same stakeholder can move quadrants when the decision changes.\n'
      + '• Conflict is resolved by priority; answering one claim will disappoint another.',
    worked: {
      prompt: 'Place four of Wanjiku’s stakeholders on Mendelow’s matrix and state how to manage each: (a) the Kenya Revenue Authority; (b) a single walk-up customer; (c) the sole soda distributor for her street; (d) a neighbour who dislikes the queue.',
      steps: [
        'KRA — high power (can close her down), high interest (wants every sale taxed) → key player → manage closely.',
        'A single customer — low power (one of hundreds), high interest (cares about price) → keep informed.',
        'The sole distributor — high power (only supplier), low day-to-day interest → keep satisfied (pay promptly).',
        'The neighbour — low power, low interest → minimal effort.',
      ],
      answer: 'Key player: KRA. Keep satisfied: the distributor. Keep informed: the customer. Minimal effort: the neighbour — but re-read the matrix for a different decision.',
    },
    rateFlags: [],
  },
  {
    topicId: 'BT A3', paper: 'BT', syllabusYear: '2026',
    title: 'Political and legal factors (PESTEL P & L)',
    nutshell:
      'The **P** and **L** of the PESTEL scan — the parts of the environment set by the state and the law, not by customers or rivals.\n'
      + '• **Political** — what government DOES: **fiscal policy** (tax and spending), **regulation and subsidies**, '
      + '**trade rules** (tariffs, import bans), **political stability**.\n'
      + '• **Legal** — the binding rules of the game, breach carrying penalties: **employment law**, **health & safety**, '
      + '**data protection**, **consumer protection**, **competition (anti-trust) law**.\n'
      + 'Neither is chosen by the business; both bind it. Ignore them and you plan for a world that no longer exists.',
    examReadiness:
      '• Sort each factor into political vs legal. Rule of thumb: **a tax or trade rule is political**; **a statute the business must obey is legal**.\n'
      + '• Trap: a sugar tax = political (fiscal policy); a duty to secure customer data = legal (data protection).\n'
      + '• Compliance is not optional — describe it as a **cost and a constraint the business plans around**.',
    worked: {
      prompt: 'Label each as political or legal: (a) a proposed sugar-drinks tax; (b) a new minimum-wage law; (c) the county’s trading-licence regime; (d) a duty to keep customers’ data secure.',
      steps: [
        '(a) A tax set by government policy → political.',
        '(b) A statute governing how she pays staff → legal (employment law).',
        '(c) Licensing imposed by a public authority → political (regulatory).',
        '(d) A legal obligation under data-protection law → legal.',
      ],
      answer: 'Political: the sugar tax and the licence regime. Legal: the minimum-wage law and the data-protection duty.',
    },
    rateFlags: [
      'Specific taxes, thresholds and named statutes vary by year and jurisdiction — confirm against the current syllabus at the annual check.',
    ],
  },
];

export default BT_TOPICS;
