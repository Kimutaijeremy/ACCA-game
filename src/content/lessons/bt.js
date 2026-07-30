// BT lessons (Brief §6.3, quality rubric Execution Order §5). Seeded from the WP2a
// pilots; append new lessons as clean object literals. Validated by src/engine/lessons.js.

export const BT_LESSONS = [
  {
    "conceptId": "BT-04",
    "title": "Stakeholder power, interest and conflict",
    "syllabusYear": "2026",
    "shape": "theory",
    "story": "Within a month of opening her kibanda near Gikomba, Wanjiku discovers she is surrounded by people who care what she does. Her customers want the lowest price. The soda distributor wants prompt payment or he stops delivering. The county askari wants the licence fee on time. The Kenya Revenue Authority wants its sales tax — a stakeholder, she is warned, with infinite patience. Her cousin wants her to turn the stall into a partnership. Every one of them affects, or is affected by, the business — and they want different, often conflicting, things. She cannot please them all at once. So the real skill is not keeping everyone happy; it is knowing whose claim to answer first. Mendelow gives her the map.",
    "keypoints": [
      {
        "title": "Stakeholders and Mendelow's matrix",
        "body": "A **stakeholder** is anyone who affects or is affected by the organisation. Map each one on two axes — **power** (can they force your hand?) and **interest** (do they care about this decision?):\n• High power + high interest → **key players**: manage closely.\n• High power + low interest → **keep satisfied**.\n• Low power + high interest → **keep informed**.\n• Low power + low interest → **minimal effort**.\nThe quadrant sets the management effort — nothing else."
      },
      {
        "title": "Stakeholder conflict is resolved by priority, not by pleasing everyone",
        "body": "Because claims conflict (customers want low prices; the distributor wants prompt, i.e. more expensive, payment), you cannot satisfy them all. You **prioritise** by power and interest, and accept that answering one claim disappoints another. That trade-off IS stakeholder management."
      }
    ],
    "worked": {
      "prompt": "Place four of Wanjiku's stakeholders on Mendelow's matrix and state how she should manage each: (a) the Kenya Revenue Authority, (b) a single walk-up customer, (c) the sole soda distributor who supplies her street, (d) a neighbour who dislikes the queue outside.",
      "steps": [
        "KRA — high power (can close her down), high interest (wants every sale taxed) → key player → manage closely, comply fully.",
        "A single customer — low power (one of hundreds), high interest (cares about price) → keep informed (fair prices, clear signage).",
        "The sole distributor — high power (only supplier on the street), lower day-to-day interest in her particular stall → keep satisfied (pay promptly to keep supply).",
        "The neighbour — low power, low interest → minimal effort (a courtesy, no more)."
      ],
      "answer": "Key player: KRA. Keep satisfied: the distributor. Keep informed: the customer. Minimal effort: the neighbour. The same four names would sit in different quadrants for a different decision — the matrix is read per decision, not once forever."
    },
    "compression": "Stakeholders affect or are affected by the business, want conflicting things, and are managed by mapping their power against their interest — key players managed closely, the powerful kept satisfied, the interested kept informed, the rest minimal effort.",
    "forwardPointer": "Within this Knowledge build, stakeholder analysis peaks here. The same power/interest map returns far beyond this phase — at Strategic Professional level (SBL), which is not part of the current build — governing board-level decisions and strategic stakeholder conflict.",
    "rateFlags": []
  }
  ,
  {
    conceptId: 'BT-01',
    title: 'Purpose and types of business organisation',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'Wanjiku takes KES 20,000 of her savings and opens a soda-and-sweets kibanda near Gikomba. '
      + 'In that one act she has chosen, without knowing the words, a type of business organisation: '
      + 'she is a **sole trader** — simple to start, total control, but **unlimited liability**: if the '
      + 'business owes, she owes, down to her own mattress. Her cousin suggests they join forces — that '
      + 'would be a **partnership**: shared capital, shared skill, and still unlimited liability. Down '
      + 'the road stands what she may one day become: a **limited liability company**, a separate legal '
      + 'person whose owners can lose only what they put in. And around her sit other species entirely — '
      + 'the county clinic, an NGO, a savings co-operative — organisations that do not exist to make a '
      + 'profit at all. The first lesson of the whole paper: what the organisation is FOR decides how you '
      + 'judge whether it is doing well.',
    keypoints: [
      {
        title: 'The main types of business organisation',
        body:
          '• **Sole trader** — one owner, total control, unlimited liability, not a separate legal person.\n'
          + '• **Partnership** — two or more owners sharing capital, profit and (usually) unlimited liability.\n'
          + '• **Limited liability company** — a **separate legal person**; owners (shareholders) risk only '
          + 'their investment.\n'
          + '• **Not-for-profit / public sector / co-operative** — exist for a purpose other than profit '
          + '(a service, a mission, mutual benefit).',
      },
      {
        title: 'Purpose sets the measure of success',
        body:
          'A **profit-orientated** business is judged on profit. A **not-for-profit or public body** is '
          + 'judged on **value for money — the three Es: economy** (buy inputs cheaply), **efficiency** '
          + '(outputs per input), **effectiveness** (did it achieve its objective?). Same question — is it '
          + 'doing well? — measured differently because the purpose differs.',
      },
    ],
    worked: {
      prompt:
        'For each, name the organisation type and the right measure of success: (a) Wanjiku’s one-woman '
        + 'kibanda; (b) the county health clinic next door; (c) Safaricom PLC.',
      steps: [
        '(a) Sole trader — judged on profit (and her own drawings), with unlimited liability on her.',
        '(b) Public sector body — judged on value for money (the three Es), not profit.',
        '(c) Limited liability company (public) — judged on profit and shareholder return; owners risk only their shares.',
      ],
      answer:
        'Sole trader → profit; public clinic → value for money (economy, efficiency, effectiveness); '
        + 'PLC → profit and shareholder return with limited liability.',
    },
    compression:
      'Businesses are sole traders, partnerships, limited companies, or not-for-profit/public bodies — '
      + 'and what the organisation exists for decides whether you judge it on profit or on value for '
      + 'money (economy, efficiency, effectiveness).',
    forwardPointer:
      'The reporting consequences of each type return in FA (FA-02): a company is a separate legal '
      + 'person that must publish, a sole trader is not — which is why the accounts differ.',
    rateFlags: [],
  },
  {
    conceptId: 'BT-03',
    title: 'Stakeholders and stakeholder classification',
    syllabusYear: '2026',
    shape: 'theory',
    story:
      'One slow afternoon Wanjiku turns over a receipt and starts a list on the back of it: everyone '
      + 'the stall has to answer to. It fills fast and comes out a jumble — Otieno, the distributor, '
      + 'the county, the customers, the bank that lent her the fridge money. A jumble is useless; what '
      + 'makes it workable is sorting it. Accounting sorts these people — stakeholders — by how close '
      + 'they sit to the business, into exactly three groups, before anyone tries to manage them.',
    keypoints: [
      {
        title: 'A stakeholder, and the three groups',
        body:
          'A **stakeholder** is anyone who affects or is affected by the organisation. They sort into:\n'
          + '• **Internal** — inside the business: employees, managers, and the owner herself.\n'
          + '• **Connected** — tied to it by a contract or investment: shareholders, customers, suppliers, '
          + 'lenders.\n'
          + '• **External** — outside, but still affecting or affected: government, the Kenya Revenue '
          + 'Authority, the local community, pressure groups.',
      },
      {
        title: 'Each holds a different claim',
        body:
          'Employees want pay and security; customers want low prices and quality; suppliers want prompt '
          + 'payment; lenders want their interest; government wants tax and compliance. These claims '
          + '**conflict** — which is the problem the next concept (power vs interest) is built to resolve.',
      },
    ],
    worked: {
      prompt:
        'Sort into internal / connected / external: (a) Otieno who runs the stall; (b) the soda '
        + 'distributor; (c) the Kenya Revenue Authority; (d) a regular customer.',
      steps: [
        '(a) Otieno — an employee → internal.',
        '(b) The distributor — a supplier under contract → connected.',
        '(c) KRA — government body outside the business → external.',
        '(d) A customer — tied by the sale → connected.',
      ],
      answer: 'Internal: Otieno. Connected: the distributor and the customer. External: KRA.',
    },
    compression:
      'Stakeholders — anyone who affects or is affected by the business — sort into internal (staff, '
      + 'owner), connected (shareholders, customers, suppliers, lenders) and external (government, '
      + 'community), each holding a different and often conflicting claim.',
    forwardPointer:
      'These groups are mapped by power and interest and prioritised next in BT-04 (Mendelow). Far '
      + 'beyond this Knowledge build — at Strategic Professional level (SBL), which this phase does not '
      + 'cover — the same idea returns as board-level governance.',
    rateFlags: [],
  }
];

export default BT_LESSONS;
