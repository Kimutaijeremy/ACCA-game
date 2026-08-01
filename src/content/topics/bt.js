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
    deeper: [
      {
        heading: 'The four types, and why liability is the hinge',
        conceptIds: ['BT-01'],
        body:
          'Start from a simple question: if the business runs up a debt it cannot pay, whose money is at risk?\n'
          + '• **Sole trader** — one person owns and runs it. Cheap and instant to start, total control, keeps all profit. But the owner and the business are the *same legal person*, so **liability is unlimited**: creditors can pursue the owner’s house, car, savings.\n'
          + '• **Partnership** — two or more owners pool capital and skills and share profit by agreement. Still (in the ordinary form) *not* a separate legal person, so partners carry **unlimited liability**, and usually each is liable for the whole debt, not just their share.\n'
          + '• **Limited liability company** — the law treats the company as a **separate legal person** that can own assets, owe money and be sued in its own name. Because the company (not the owner) owes the debts, shareholders can lose only **what they paid for their shares** — that is limited liability. The price is more regulation: it must register, file and publish accounts.\n'
          + 'So the ladder from sole trader to company trades **simplicity and privacy** for **protection and access to capital**.',
      },
      {
        heading: 'Not-for-profit, and the three Es',
        conceptIds: ['BT-01'],
        body:
          'Some organisations do not exist to make a profit at all — a public hospital, a charity, a savings co-operative. Judging them on profit would be meaningless, so we judge **value for money**, broken into three Es:\n'
          + '• **Economy** — are the inputs bought cheaply enough? (Did the clinic pay a fair price for its drugs?)\n'
          + '• **Efficiency** — how much output per unit of input? (Patients treated per shilling.)\n'
          + '• **Effectiveness** — did it actually achieve its objective? (Did people get healthier?)\n'
          + 'A body can be economical and efficient yet ineffective — cheap, busy, and still not curing anyone — which is exactly why all three are needed together.',
      },
      {
        heading: 'What examiners keep flagging',
        conceptIds: ['BT-01'],
        body:
          '• **Measuring a not-for-profit body is hard for TWO reasons at once**, and candidates keep picking only one: it has **multiple, often conflicting objectives**, AND the **value of its outputs is hard to measure** when services are not sold at a market price. That double difficulty is precisely why such a body is judged on value for money (the three Es), not profit. *(FMA examiner’s report, Sep 2024–Aug 2025.)*',
      },
    ],
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
    deeper: [
      {
        heading: 'Who counts as a stakeholder, and the three groups',
        conceptIds: ['BT-03'],
        body:
          'A **stakeholder** is anyone who **affects, or is affected by**, the organisation — deliberately wide. It is not just owners; it reaches staff, customers, suppliers, lenders, government, neighbours, even a journalist who never bought anything.\n'
          + 'To make the crowd workable, sort by how close each sits to the business:\n'
          + '• **Internal** — inside it: employees, managers, the owner.\n'
          + '• **Connected** — bound by a contract or an investment: shareholders, customers, suppliers, lenders.\n'
          + '• **External** — outside, no contract, but still affecting or affected: government, the tax authority, the community, pressure groups.\n'
          + 'The point of sorting is that each group holds a **different claim** — staff want pay and security, customers want low prices, suppliers want prompt payment, lenders want their interest, government wants tax and compliance — and those claims pull against each other.',
      },
      {
        heading: 'Mendelow: managing the conflict by power and interest',
        conceptIds: ['BT-04'],
        body:
          'Because the claims conflict, you cannot please everyone; you must decide **whose claim to answer first**. Mendelow maps each stakeholder on two axes:\n'
          + '• **Power** — can they force your hand? (Can they close you, cut your supply, sack you?)\n'
          + '• **Interest** — do they care about *this* decision?\n'
          + 'The quadrant sets the effort:\n'
          + '• High power + high interest = **key players** — manage closely, involve them.\n'
          + '• High power + low interest = **keep satisfied** — don’t provoke them; they can act if roused.\n'
          + '• Low power + high interest = **keep informed** — they care but can’t compel; communicate.\n'
          + '• Low power + low interest = **minimal effort**.\n'
          + 'Two traps: (1) the matrix is read **per decision** — a stakeholder can move quadrants when the issue changes; (2) high-power/low-interest is *keep satisfied*, not *keep informed* (that is the low-power/high-interest box). The whole skill is prioritising, and accepting that satisfying one stakeholder disappoints another.',
      },
      {
        heading: 'What examiners keep flagging',
        conceptIds: ['BT-04'],
        body:
          '• **Judge power and interest from the stakeholder’s leverage over THIS organisation, not from their size.** A customer or supplier who can easily **switch** (they have alternatives) holds **HIGH power but LOW interest** → keep satisfied. In a reported question, a buyer who takes 20% of a company’s output but keeps several suppliers competing was **high power, low interest** — candidates wrongly read "one of many" as low power. *(BT examiner’s report, Sep 2024–Aug 2025, Example 1.)*',
      },
    ],
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
    deeper: [
      {
        heading: 'Political vs legal — the state acting, versus the rules it sets',
        conceptIds: ['BT-05'],
        body:
          'PESTEL splits the outside environment into six forces; the P and the L are the two the business cannot vote away.\n'
          + '**Political factors** are what government *does* as a matter of policy and can change with the political weather:\n'
          + '• **Fiscal policy** — taxation and government spending (a new sugar tax, a fuel subsidy).\n'
          + '• **Regulation and licensing** — permits and regimes a public authority imposes.\n'
          + '• **Trade rules** — tariffs, quotas, import bans.\n'
          + '• **Political stability** — whether the environment itself is predictable.\n'
          + '**Legal factors** are the binding rules of the game; breach carries penalties, so compliance is a cost and a constraint, not a choice:\n'
          + '• **Employment law** (minimum wage, unfair dismissal), **health & safety**, **data protection**, **consumer protection**, **competition (anti-trust) law**.\n'
          + 'The quick test: *is this the state choosing to act (policy) → political; or a standing rule the business must obey (statute) → legal?* A tax is political; a duty to secure customer data is legal. Some things touch both — a licensing regime is political in origin but enforced through legal duties.',
      },
    ],
    rateFlags: [
      'Specific taxes, thresholds and named statutes vary by year and jurisdiction — confirm against the current syllabus at the annual check.',
    ],
  },
  {
    topicId: 'BT A5', paper: 'BT', syllabusYear: '2026',
    title: 'Demand, supply and elasticity',
    nutshell:
      'Markets set price where **demand** meets **supply**.\n'
      + '• **Demand** slopes down: as price rises, quantity demanded falls. **Supply** slopes up: higher price, more supplied. **Equilibrium** is where they cross.\n'
      + '• **Movement vs shift:** a change in the good’s **own price** is a *movement along* the curve; a change in a **non-price factor** (income, tastes, the price of substitutes or complements) *shifts* the whole curve.\n'
      + '• **Price elasticity of demand (PED) = % change in quantity demanded ÷ % change in price** (take the size, ignore the minus sign).\n'
      + '  – PED **> 1 = elastic** (quantity reacts a lot); **< 1 = inelastic** (quantity barely moves).\n'
      + '  – Necessities with few substitutes are **inelastic**; luxuries with many substitutes are **elastic**.\n'
      + '• **Revenue rule:** if demand is **elastic**, *cut* price to raise revenue; if **inelastic**, *raise* price to raise revenue.',
    examReadiness:
      '• PED is usually negative — quote the magnitude and classify elastic (>1) / inelastic (<1).\n'
      + '• Link elasticity to revenue: inelastic → raise price; elastic → cut price.\n'
      + '• Trap: a change in the good’s own price is a movement ALONG demand, not a shift; only non-price factors shift it.',
    worked: {
      prompt: 'When price rises from $100 to $120, quantity demanded falls from 50 to 40 units. Find PED and say whether to raise or cut price to grow revenue.',
      steps: [
        '% change in quantity = (40 − 50) ÷ 50 = −20%.',
        '% change in price = (120 − 100) ÷ 100 = +20%.',
        'PED = −20% ÷ 20% = −1 → magnitude 1 (unit elastic).',
        'At elasticity 1 revenue is unchanged by small price moves; above 1 (elastic) you would cut price, below 1 (inelastic) you would raise it.',
      ],
      answer: 'PED = 1 (unit elastic). Elastic goods → cut price to raise revenue; inelastic → raise price.',
    },
    deeper: [
      {
        heading: 'How the market clears, and what elasticity tells a business',
        conceptIds: ['BT-09'],
        body:
          'Two forces meet in a market. **Demand** describes buyers: at a lower price they buy more, so the curve slopes down. **Supply** describes sellers: at a higher price they offer more, so it slopes up. Where the two cross is the **equilibrium** price and quantity — the point the market gravitates to.\n'
          + '**Movement vs shift** trips people up. If only the good’s **own price** changes, you slide *along* the existing demand curve (a movement). If something else changes — **income**, **tastes**, the price of a **substitute** or **complement** — the whole curve *shifts*: for a normal good, higher income shifts demand right.\n'
          + '**Elasticity** measures how sharply quantity responds. **PED = %ΔQ ÷ %ΔP.** Greater than 1 is **elastic** (buyers are sensitive — many substitutes, or a luxury); less than 1 is **inelastic** (buyers stuck — a necessity like salt). This drives pricing: with **inelastic** demand a firm can **raise** price and total revenue rises (quantity barely falls); with **elastic** demand raising price loses more sales than it gains in margin, so to grow revenue it should **cut** price. **Income elasticity** is related: normal goods are bought more as income rises; inferior goods less.',
      },
    ],
    rateFlags: [],
  },
];

export default BT_TOPICS;
