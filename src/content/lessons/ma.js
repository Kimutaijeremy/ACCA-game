// MA lessons (Brief §6.3, quality rubric Execution Order §5). Seeded from the WP2a
// pilots; append new lessons as clean object literals. Validated by src/engine/lessons.js.

export const MA_LESSONS = [
  {
    "conceptId": "MA-11",
    "title": "The high-low method",
    "syllabusYear": "2026",
    "shape": "calculation",
    "story": "Wanjiku opens a small bakery behind the shop — mandazi and bread. The first bill that puzzles her is electricity. In a quiet month it costs less; in a busy month, more — but it never falls to zero, because the fridge and the lights run regardless. This is a **semi-variable cost**: a fixed standing charge plus a variable amount that rises with how much she bakes. To budget, and later to price a single mandazi, she must split that one bill into its fixed and variable halves. With only the monthly totals to go on, the high-low method does it from just two data points — the busiest month and the quietest.",
    "keypoints": [
      {
        "title": "High-low method",
        "body": "Take the **highest and lowest activity** levels (not the highest and lowest cost):\n  Variable cost per unit = (cost at highest activity − cost at lowest activity) ÷ (highest units − lowest units)\nThen, at either level:\n  Fixed cost = total cost − (variable cost per unit × units)\nCrude but everywhere — and the exam’s favourite warm-up."
      },
      {
        "title": "Two traps",
        "body": "Pick the extreme **activity** rows, even if another row has a higher cost. And if the cost structure changes over the range (a **stepped** fixed cost — say a second oven switched on) or a row is a one-off outlier, high-low quietly lies: it assumes one straight line across the whole range."
      }
    ],
    "worked": {
      "prompt": "Two months of the bakery’s electricity: a busy month baked 900 trays and cost KES 32,000; a quiet month baked 500 trays and cost KES 24,000. Split the bill, then predict the cost of a month baking 700 trays.",
      "steps": [
        "Variable cost per tray = (32,000 − 24,000) ÷ (900 − 500) = 8,000 ÷ 400 = KES 20 per tray.",
        "Fixed cost = 32,000 − (20 × 900) = 32,000 − 18,000 = KES 14,000 per month (check at the low point: 24,000 − 20×500 = 14,000 ✓).",
        "Forecast at 700 trays = fixed 14,000 + variable (20 × 700) = 14,000 + 14,000 = KES 28,000."
      ],
      "answer": "Variable KES 20/tray, fixed KES 14,000/month; a 700-tray month should cost about KES 28,000."
    },
    "compression": "Split a mixed cost from its highest and lowest activity levels: variable per unit is the change in cost over the change in units, and fixed is whatever is left once the variable part is stripped out at either level.",
    "forwardPointer": "When two points aren’t enough, linear regression (MA-12) fits a line through all of them; and the fixed/variable split you make here is what every flexible budget and cost variance later depends on.",
    "rateFlags": []
  }
];

export default MA_LESSONS;
