# WP2a — diagnosis engine + five pilot lessons

Status: built and tested. This is the deliberate WP2a stop point — Jeremy reviews the lesson
**format** before the remaining 186 lessons (WP2b) are written against it.

## The seven-cause diagnosis engine (§6.5)

`src/engine/diagnose.js` — `diagnose({ attempt, item, prior, context })` returns a cause,
confidence, source and remediation route for a wrong attempt, across three honest layers:

1. **Engineered distractors** — a wrong option tagged with a cause; choosing it *is* the diagnosis
   (confidence 0.9). Untyped items fall through.
2. **Pattern inference** from the attempt log:
   - wrong at concept-check → knowledge gap
   - right at Guided, wrong at Standard → conceptual
   - right in Standard, wrong in mixed → transfer failure
   - right untimed, wrong timed → careless (exam conditions)
   - fast + wrong on a Competent concept → careless
   (confidence 0.6)
3. **Micro-probe** — when layers 1 and 2 conflict or are both silent, ONE follow-up
   (`resolveProbe`, confidence 0.8). Until it resolves, the cause defaults to
   **conceptual-plus-practice**, never a guess (confidence 0.3).

Every one of the seven causes has a remediation route (the §6.5 table); careless slip carries a
pacing flag, not content remediation. Diagnosed cause + confidence are exactly the fields the
attempt log already records, so a diagnosis is written once, with the attempt.

Read ten worked diagnoses in plain language in **`docs/diagnosis-demo.md`**
(`npm run diagnosis:demo`) — the routing sanity-checked by reading, not by test count.

## Six pilot lessons (§6.3)

`src/content/pilot-lessons.js` — full-quality, in the Wanjiku voice, each stressing a different
shape. Read them rendered in **`docs/pilot-lessons-preview.md`** (regenerate with
`npm run lessons:preview`).

| Concept | Lesson | Shape |
|---|---|---|
| BT-04 | Stakeholder power, interest and conflict | theory (Mendelow) |
| MA-11 | The high-low method | calculation |
| FA-26 | Depreciation methods and the annual charge | double entry |
| FA-22 | Cost and net realisable value | treatment / rule |
| FA-63 | Liquidity and efficiency ratios | interpretation / integration |
| FA-13 | Books of prime entry | process (deliberately dry — no natural story hook) |

Each has: a story beat, keypoint boxes (the load-bearing formulas/rules), one worked example, the
one-breath compression, and a forward pointer naming where the concept matures (FA-26 → FR
revaluation/impairment, etc.). `lessons.js` validates every required part is present, so the
allocation matrix can count a real lesson section and nothing ships half-built.

Tests: `test/diagnose.test.js`, `test/lessons.test.js` (part of the 47 green node tests).
