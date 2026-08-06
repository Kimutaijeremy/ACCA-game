# Authoring Contract — what "one concept authored" means

**Purpose.** Fix, countably, the unit of authoring, so the remaining concepts can be batched by
anyone (or any session) without quality drift. This contract is the acceptance gate. It does not
start authoring — it defines *done*.

**Governs alongside:** `PAPER_TRAIL_BUILD_BRIEF.md` §6.3 / §6.4 / §6.6, `PAPER_TRAIL_EXECUTION_ORDER.md`
(parallel authoring A2, per-concept unit A5), and `PAPER_TRAIL_VALIDATION_PROTOCOL.md` (Test A).
Where a number here and the brief disagree, the brief's floor is the minimum and this contract may
only *add* to it.

---

## 1. The authored unit — four required artifacts per concept

A concept is **AUTHORED** only when **all four** exist, tagged to that concept id (the permanent key
from `concepts.json`). Anything short of four is "in progress", never "authored".

1. **Lesson** — the concept's teaching text (the Exposed surface), Wanjiku voice.
   - Rubric 7: no incomplete list stated as complete. Rubric 8: a distinct opening (no shared first
     sentence with any other lesson).
   - For BT/MA/FA the primary teaching surface is the topic page (Amendment A6); the per-concept
     lesson remains the readable/Exposed artifact and the escalation target for clause G.

2. **Nutshell** — **exactly one formula OR exactly one statement. Nothing longer.**
   - One line: a single equation/expression, *or* a single declarative sentence. No worked example,
     no second sentence, no list. This is the clause-F reveal-on-miss content, so its brevity is a
     hard constraint, not a style note.

3. **Practice item set, by rung** — meets the per-concept floor (`PER_CONCEPT_FLOORS` in
   `src/engine/items.js`), unchanged from Amendment A5:
   - **concept-check ≥ 3, guided ≥ 3, standard ≥ 3, stretch ≥ 1.**
   - Every objective item's wrong options are **engineered distractors tagged to a diagnostic cause**
     (§6.5 layer 1), or explicitly `untyped` where a cause cannot be encoded.
   - **Calculation-shaped concepts carry ≥ 1 parameterized generator** (seeded RNG, `rng.js`); each
     generator must produce valid items on ≥ 5 seeds.
   - **Cap exception:** the accounting equation (`FA-05`) is capped at **2 practice items total** and
     the four-rung floor is waived for it (brief §6.4, `ITEM_CAPS`). It is the only capped concept. The
     cap governs the **practice** bank only; FA-05 still carries its one sealed item (§1.4), which is
     **additional** to the cap (the sealed holdout is never served, so it cannot "drown" a set).

4. **Exactly one sealed item** — authored **at the same time** as the practice items above, tagged
   rung `sealed`, and placed in the sealed pool.
   - "At the same time" is part of the definition: a concept authored without its sealed item is **not
     authored**. Sealed items are never back-filled in a later pass — they are drafted from the same
     understanding that produced the practice set, so the holdout genuinely mirrors the teaching.
   - Exactly **1** per concept — not zero, not two.

## 2. The sealed item is never served in practice

Sealed items exist for readiness measurement only (brief §6.6). The invariant, to be verified
mechanically:

- A `sealed`-rung item is **excluded from every practice path**: Section A assembly, Section B
  assembly, single-topic drills, review probes, and freshness selection (Amendment 01 clause H).
- **No sealed item is reachable from any practice path, under any condition** — including empty banks,
  renormalised weights, or a concept whose only remaining unseen items are sealed. When practice would
  otherwise be starved, it serves nothing sealed; it reports the shortfall.
- Acceptance requires an automated check proving zero sealed items reachable from practice (this is
  also G-PT1 gate #4). Sealed items appear **only** in a sealed simulation/mock.

## 3. Breadth before depth

**No concept in a paper receives an expanded item set until every concept in that paper has the
minimum set.**

- "Minimum set" = the §1.3 floor (cc3/g3/s3/st1, or the `FA-05` cap) **plus** its one sealed item.
- "Expanded" = any practice item beyond the floor for that concept.
- Countable rule, per paper *P*: expansion of any concept in *P* is permitted only once
  **`authored(P) == liveConcepts(P)`** — i.e. 100% of *P*'s live concepts are AUTHORED to the floor.
  Until then, every authoring hour in *P* goes to a not-yet-authored concept, never to deepening one
  that already meets the floor.
- This is the structural guarantee against the v1 failure (depth on a few concepts, whole areas
  empty). Depth is a post-breadth phase, scheduled by the reordered work plan.
- Papers are authored **in parallel** across BT/MA/FA (Execution Order A2); breadth-before-depth is
  measured **within each paper**, so a paper can reach 100% and begin depth while others are still at
  breadth.

## 4. A batch — countable definition

A **batch** is an explicitly named, closed set of concept ids authored to completion together.

- **Composition:** a batch names its concept ids up front (e.g. `["BT-06","MA-02","FA-07","BT-07",
  "MA-03"]`). Default size **5**; the size is whatever the list contains, and the list is fixed before
  work starts (no silent additions mid-batch).
- **Drawn breadth-first and in parallel:** every concept in a batch must be a **not-yet-authored**
  concept (§3), and the batch should span BT/MA/FA rather than deepen one paper (A2), except when a
  paper is being closed out to 100%.
- **A batch is DONE** when **every** concept in it is AUTHORED per §1 (all four artifacts) and the
  paper-level breadth rule (§3) is not violated.

## 5. Acceptance — what `items:check` must show for a batch to be accepted

A batch is accepted only when the completeness report shows, for **every** concept in the batch, a
line with **all** columns satisfied — and the report's batch summary is clean:

```
DONE  <concept>   lesson:✓  nutshell:✓(1)  cc:≥3  g:≥3  s:≥3  st:≥1  sealed:1  [param:✓ if calc]
...
BATCH <id>: N/N concepts DONE · nutshells 1/1 each · sealed 1/1 each · 0 sealed reachable in practice
PAPER breadth: BT x/60 · MA x/66 · FA x/65   (depth locked on any paper < 100%)
RESULT: ACCEPTED
```

Acceptance requires **all** of:
- `lesson:✓` and `nutshell:✓(1)` for each concept — the nutshell is present and is exactly one
  formula/statement (length-checked: single line, no second sentence/expression).
- rung floors met (`cc≥3 g≥3 s≥3 st≥1`, or the `FA-05` cap), calc concepts `param:✓`.
- `sealed:1` for each concept, and **`0 sealed reachable in practice`** (the §2 automated check).
- no per-paper breadth violation (§3): if any concept in the batch exceeds its floor while its paper
  is `< 100%` authored, the report reads `RESULT: REJECTED (depth before breadth)`.
- no concentration-cap regression that is *not* the expected small-bank artifact (brief §6.4, 8%).

> **Tooling note (not yet built).** `npm run items:check` today reports `lesson / cc / g / s / st /
> param`. This contract additionally requires the **`nutshell:✓(1)`** column, the **`sealed:1`**
> column, the **`0 sealed reachable in practice`** check, and the **PAPER breadth** line. Extending
> the checker to emit and enforce these is a prerequisite task under the reordered work plan; until it
> lands, a batch cannot be mechanically ACCEPTED, only hand-reviewed.

## 6. The real project cost

**Current: 15 of 191 live concepts authored** (`npm run items:check`, 2026-08-06):

| Paper | Live concepts | Authored | Remaining |
|---|---:|---:|---:|
| BT | 60 | 4 | **56** |
| MA | 66 | 4 | **62** |
| FA | 65 | 7 | **58** |
| **Total** | **191** | **15** | **176** |

**176 concepts remain.** Each is four artifacts — lesson, one-line nutshell, a full rung set with
engineered distractors (and a generator where calculational), and one sealed item — authored
together and accepted only against §5. At the default batch size of 5, that is roughly **36 batches**.
Two things are explicitly *not* yet counted in the 176 and are separate later phases: **depth**
(expansion beyond the floor, after each paper hits breadth) and the **FR/AA** full-lesson tracks
(not Knowledge-level scope). The 15 already authored predate this contract and must be **re-checked
against §1** — in particular each needs its one-line nutshell and its single sealed item confirmed or
added before they count as authored under this contract.

---

*Do not begin authoring on the strength of this document. It defines acceptance; the reordered work
plan schedules the work.*
