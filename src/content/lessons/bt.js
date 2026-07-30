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
    "forwardPointer": "This matrix grows up in SBL, where the same power/interest map governs board-level decisions and every stakeholder-conflict question in strategic governance.",
    "rateFlags": []
  }
];

export default BT_LESSONS;
