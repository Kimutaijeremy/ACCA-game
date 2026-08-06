# Paper Trail — Build Brief

**Phase 1: BT, MA and FA as validation of the whole architecture**

| | |
|---|---|
| Version | 1.0 — supersedes all earlier Paper Trail specs and blueprints |
| Date | 28 July 2026 |
| Owner | Jeremy |
| Executor | Claude Code |
| Status | Approved. Build from this document. |

> **Correction, 28 July 2026 (post-WP1 check).** Sections 0 and 2 originally named the deployed
> repository `paper-trail` at `kimutaijeremy.github.io/paper-trail`. No such repository exists.
> The live app is the repository **`ACCA-game`**, served from `main` at
> **`https://kimutaijeremy.github.io/ACCA-game/`**. Corrected inline below on Jeremy's
> instruction. The live app stays at that address; it is not to be renamed or moved. The local
> working folder remains `C:\Users\user\dev\paper-trail`.

---

## 0. Read this first

This is the only instruction document. It absorbs the Learning System Specification, the
concept graph review, the migration rules and the work plan. Nothing else needs to be read
for context.

**Two data files travel with it:**

| File | What it is | Rule |
|---|---|---|
| `concepts.json` | The concept graph: 191 live concepts, 38 stub nodes, 273 edges. Validated. | **Frozen. Do not edit.** Authoritative. |
| `paper-trail-progress.json` | Jeremy's real v3 export from the live app. | Test fixture for the migration. |

`build_graph.py` also travels with it — it re-validates the graph and must keep passing.

Place all four under `spec/` in the repo. Read this brief in full before writing any code.

**The existing app:** Paper Trail PWA v3.1, a single-file `index.html` (~1,497 lines), browser
localStorage, deployed to GitHub Pages at `kimutaijeremy.github.io/ACCA-game`, installed on
Jeremy's phone. It is a good foundation pointing in a different direction from this brief.
Expect substantial engine rebuild, not incremental patching.

**Source material:** `OneDrive/Documents/ACCA/ACCA story.docx` (Wanjiku Volume I, the narrative
spine) and `OneDrive/Documents/ACCA/ACCA Exam companion.docx` (Volume II, exam mechanics).
Both are read-only inputs.

---

## 1. What you are building

Not a question bank with teaching attached. A **complete primary learning system**.

> **The standard.** A genuinely new ACCA student, no prior accounting background, with every
> textbook, course and revision platform taken away, using only this game: learns the complete
> Knowledge-level syllabus inside it, practises it progressively, has weaknesses diagnosed and
> repaired, retains knowledge over time, and sits realistic simulated exams — without another
> resource filling fundamental gaps.

The official ACCA study guide is the **minimum coverage specification**, never the whole
learning design.

**Honest calibration, stated so nothing over-promises:** fully built, a diligent sole-resource
student should average roughly 60–65% at Knowledge level. Passing consistently; not distinction
level. Two caps no game removes — written answers are self-marked against checklists, and the
real exam's on-screen answer workspace is not simulated.

**Why BT, MA and FA specifically:** they are the validation phase. If the architecture genuinely
teaches, diagnoses, remediates, tracks mastery and assesses on these three papers — proven at the
gate in Section 9 — it scales to the qualification. If it does not, nothing new is built until it
does.

---

## 2. Decisions already made — do not re-ask

1. **The concept graph is built.** Do not author one. `concepts.json` is signed off and frozen.
2. **Location:** `C:\Users\user\dev\paper-trail`. **First check whether
   `github.com/Kimutaijeremy/ACCA-game` already exists** — the live app is served from GitHub
   Pages, so it does. If it exists, clone it. If not, init and create it. Never a fresh repo
   that orphans the deployed one. HTTPS via Git Credential Manager for pushes;
   `core.filemode false`.
3. **Content depth:** Wanjiku Volume I is the narrative spine and voice — characters, worked
   examples, the one-breath compressions. Your own ACCA knowledge supplies depth. The official
   ACCA study guide is the coverage authority and outranks both. Volume II supplies exam mechanics.
   Where a fact depends on a current rate, threshold or standard, flag it in item metadata for the
   annual syllabus check rather than guessing.
4. **Node count:** all 191 concepts stand. Fine granularity is deliberate — it is what lets the
   diagnostic engine route remediation precisely.
5. **Cold-start topics:** the six Skills topics with no Knowledge-level parent are accepted as
   designed gaps, handled when those papers are built.

---

## 3. Jeremy's data — non-negotiable

The live app holds his only learning history in browser localStorage on his phone.

- **Keep the deployed origin identical.** Changing the URL orphans his data permanently.
- **Never publish to the branch GitHub Pages serves.** Work on a branch. Publishing is his to
  approve, once, at cutover.
- **Never take an action that could discard learner progress** without asking first.

---

## 4. Standing authorization

**Do these without asking:** create, read, edit and delete files inside the repo; all local git
operations including branches and commits; create the GitHub repo and push to non-Pages branches;
install dependencies; run tests and builds; read the Wanjiku documents and the v3.1 app.

**Ask only for:** publishing to the live site; anything that writes outside the repo folder,
especially OneDrive; anything that could discard learner progress; a genuine architectural fork
this brief does not settle.

**Otherwise:** if this brief answers it, follow it. If you must assume, assume, log the assumption,
and carry on. Batch real questions to the end of a work package — never interrupt mid-build.

---

## 5. How to report

Plain language. Minimise abbreviations and jargon. Describe work in terms of what Jeremy can now
do, not internal mechanics. State any action he must take himself, plainly and separately.

---

## 6. The specification

### 6.1 The concept graph — the spine

The unit of learning is the **concept**, not the pack and not the paper.

- Each node: identifier, name, definition, syllabus outcome reference.
- Edges: `prerequisites` / `prerequisite_of` (within and across papers), `grows_into` (cross-paper
  maturation — FA depreciation into FR's revaluation model; MA discounted cash flow into FM
  investment appraisal), `integrates_with` (examined together).
- **Papers are views over the graph.** Learner state lives on concepts. This is what lets FR read
  the player's FA states directly when FR is built — no paper is an isolated course.
- Concept ids are **permanent keys**. Every lesson, item, mastery state and review record
  references them. Changes after this point are versioned amendments.

**Contents of `concepts.json`:** BT 60, MA 66, FA 65 = 191 live concepts; 38 stub landing nodes
(FR 17, PM 14, FM 7) with no Phase 1 content; 273 edges. Validation passes with zero errors: no
dangling edges, no prerequisite cycles, no concept depending on a paper that does not exist, and
every sub-area of all three official study guides carries at least one concept.

**Known finding — six cold-start topics** have no Knowledge-level parent anywhere: leases
(FR-S03), income taxes (FR-S14), environmental accounting (PM-S05), pricing decisions (PM-S09),
business valuations (FM-S05), currency and interest-rate risk (FM-S06). They genuinely begin at
Skills level. Not a defect; recorded so those papers get a longer runway when built.

### 6.2 Mastery states, evidence rules and decay

Five states per concept. Movement requires **logged evidence, never impressions.**

| State | Evidence rule |
|---|---|
| Exposed | The concept's lesson section completed. |
| Understood | Concept-check set passed: at least 2 of 3 recognition or explanation items correct, unscaffolded. |
| Practised | At least 3 guided applications correct; hints and worked steps permitted. |
| Competent | Last 5 unscaffolded Standard items at 80%+ within item time budgets, no hints used. |
| Mastered | 80%+ on Stretch and Integrated items, including at least one mixed-topic appearance and one timed appearance, across at least two sessions separated by 72+ hours. |

**Scheduler and decay.** Each state above Exposed carries a review interval — defaults: Understood
3 days, Practised 7, Competent 14, Mastered 30 then 90. Due concepts inject review items into the
next session's warm-up. **A failed due review drops the concept one state and queues its
remediation.** This is what keeps the dashboard honest over time: knowledge that fades is shown
fading.

**Decay through neglect (not only through failure).** Missed reviews must decay, not only failed
ones — otherwise never attempting a review would preserve Mastered indefinitely, and avoiding study
would protect the dashboard. Rule: **a concept whose review is overdue by more than one full
interval drops one state, and drops one further state at each subsequent interval that passes
without evidence.** Evidence for the lost state is wiped, exactly as on a failed review. Decay
stops at Exposed. No attempt need be logged for this to happen — the passage of time alone drives
it.

**Evidence-wipe rule (on any decay).** When a concept drops — by failed review or by neglect — the
accumulated evidence for every state *above* the new one is wiped, so the lost level must be
genuinely re-earned, not restored from stale attempts. This is required because the promotion
rules read rolling windows (e.g. "last 5 unscaffolded Standard items at 80%+"). Without the wipe, a
concept dropped from Competent to Practised would still hold five passing Standard items in its
window and would spring straight back to Competent on the very next read — oscillating between
states instead of decaying.

**Audit guarantee (restated).** Because decay now depends on elapsed time as well as attempts,
derived state is a function of **(log, current date)**, not the log alone. Nothing is ever written
directly: every level, review date and wipe is recomputed by replaying the attempt log against a
date. The guarantee is therefore: **the same log evaluated at the same date reproduces every level
identically.**

### 6.3 The teaching layer — topic pages (BT/MA/FA), then drill  *(rewritten by Amendment A6, 31 July 2026)*

**Amendment A6 collapses the teaching layer for BT, MA and FA** — Jeremy has studied all three and
needs reminding and drilling, not first-teaching. (FR and AA keep full teaching lessons — §6.3B.)

**Topic pages.** The teaching unit is the **syllabus sub-area (a "topic")**, not the concept: one
page per sub-area (~38 BT, ~25 MA, ~34 FA). Each holds, and no more:
1. **the topic in a nutshell** — about one page, no story beat;
2. **exam readiness** — the traps, the required format, and what examiners look for;
3. **ONE worked example**, every step shown, nothing skipped.
Wanjiku voice, kept light. See Execution Order §5A for the rubric.

**The concept graph stays the tagging spine.** Concepts are no longer the teaching unit but remain
the **tags**: every question tags to one or more concepts, and a topic's concepts are those whose
outcome falls in that sub-area. Coverage matrices (§6.4), the diagnosis engine (§6.5), mastery
states, review and decay (§6.2) all keep running on those tags.

**Questions are the main event — mixed sets of ten.** The learner's primary loop is **sets of 10
items drawn across the whole paper, never blocked by topic**. Many sets. Each set is scored out of
10, with a **rolling average per paper** shown and the "where you slip" diagnosis kept.

**Difficulty rungs (per item, still tagged):** Concept-check → Guided (scaffolded) → Standard (exam
level) → Stretch → Integrated/Mixed → Sealed simulation. A set of ten is itself a mixed pack.

**Anti-memorisation:** parameterized templates wherever a question is calculational — numbers
regenerate per attempt; **option order is shuffled per serve** so position never predicts the answer.

**Time budgets displayed on every item:** 1.2 minutes per mark at Knowledge level, 1.8 at Skills.

### 6.3B FR and AA — full teaching lessons (retained)

FR and AA teach from scratch, so when their tracks begin they use the **full-lesson** model of the
pre-A6 rubric (Execution Order §5B): story beat, keypoint boxes, one worked example, one-breath
compression, forward pointer — the concept as the teaching unit, authored with its question set.

### 6.4 Coverage and allocation — completeness is mechanical

Per paper, produce and publish an **allocation matrix**: every study-guide outcome ×
(concepts, topic-page reference, item count per rung, sealed-pool count, share of bank).

**Per-topic (sub-area) floors — breadth and depth both:**
- a **topic page** covering the sub-area *(Amendment A6: one page per sub-area, not one lesson per concept)*
- at least three practice items spanning at least two rungs
- at least one sealed-pool item

**Per-concept item floor — the coverage guarantee** *(Amendment A5, retained under A6)*. Concepts
are the tagging spine, and each authored concept still carries a question set of **concept-check ≥ 3,
guided ≥ 3, standard ≥ 3, stretch ≥ 1** so every tag has enough items for the sets to draw on and for
the underlying mastery states to be reachable. Calculation-shaped concepts include **≥ 1
parameterized generator**. Enforced mechanically (`npm run items:check`).

**Completion and unlocking — the 8-of-last-10 rule** *(Amendment A6, refined 2026-07-31; supersedes
concept-Competent completion for BT/MA/FA; see Execution Order §4A)*. The visible gate is measured on
each **topic's own questions**, from the attempt log — NOT on whole-set scores:
- A **topic is complete** when **8 of the learner's last 10 questions tagged to that topic are
  correct, spanning at least two different sessions.** (Set scores are session feedback only — a set
  of ten across ~34 topics gives a topic one or two items, too few to be a gate.) Completion
  **latches** once achieved.
- A **paper is complete** (and unlocks its descendants) when **every one of its topics is complete**.
- Show progress toward it (e.g. "6 of last 8 correct, needs 2 more questions").
- Concept mastery states and decay keep running underneath for reviews and diagnosis, but they are
  not the visible gate. (FR/AA revert to concept-mastery completion — they teach from scratch.)
- **Staleness on a completed topic** *(2026-07-31)*. Completion **latches** — a real pass does not
  expire, and you never lose FR because you forgot depreciation. But if a completed topic's concepts
  have **decayed** (a review has fallen due underneath), show it as **"complete · needs revision"**,
  not a clean tick. The tick stays (access is not withdrawn); the label warns.

**Set composition — exam-weighted, not round-robin** *(2026-07-31; weightings confirmed 2026-08-01)*.
A set of ten is drawn to a per-area **target**, NOT one item per concept round-robin (which would
give a one-concept area the same airtime as a ten-concept area — the v1 failure):
- **No official per-area OT weighting exists.** Confirmed against ACCA's 2025-26 study guides for
  **FBT/BT** and **FMA/MA**: both state only that "questions will assess **all parts of the
  syllabus**" (100% compulsory, sampled across the breadth). There is no published per-area
  percentage to adopt — so every target table here, FA's included, is a **constructed breadth-based
  target**, refined by the one area-level signal the guides do give: the **fixed Section B structure**.
- **FA/FFA** — the objective-item distribution table below (A2 B2 C4 D10 E7 F6 G2 H2 per 35).
- **BT/FBT** — target /46 (Section A is 46 OT questions): **A11 B8 C9 D9 E4 F5**. Breadth-led (A is
  the largest area); all six represented (Section B examines one MTQ per area); ethics (F) held above
  its small size for its exam prominence.
- **MA/FMA** — target /35 (Section A is 35 OT questions): **A4 B4 C9 D7 E6 F5**. Cost accounting (C)
  and budgeting (D) are the Section-A heavyweights; standard costing (E) and performance (F) lifted
  above their concept-count share to reflect their **guaranteed Section B MTQ marks**.
- Tables live in `src/engine/sets.js` (`FA_/BT_/MA_AREA_WEIGHTS`). They are targets, not official
  figures; refine against examiner-report emphasis over time (annual syllabus gate).
- Targets **renormalise over the areas that actually have authored items**, so partial content still
  produces sensible sets; the shape approaches the exam as more areas are authored.
- **Within each area, bias selection toward topics short of their ten completion questions**, so thin
  areas (consolidation, interpretation) still reach completion instead of stalling. Per-concept cap
  within a set so no single concept dominates.
- **Report both:** how close each topic is to completion (the progress hints), and **whether the set
  was exam-shaped** (actual area mix vs target).

**Accounting-equation cap (overrides the per-concept floor for one concept).** The accounting
equation may hold **at most two items in the entire FA bank** — deliberately under-weighted because
the v1 bank drowned in it; its mastery shows through the concepts it feeds. The four-rung floor does
not apply to it. It is the only capped concept.

**Concentration cap:** no concept exceeds 8% of a paper's practice bank.

**Any outcome failing any floor fails the build.** No topic can hide behind the total question
count. This is the structural guarantee that the v1 failure — half the FA bank on one concept,
whole topics missing — cannot recur.

**FA distribution target**, per 35 objective items, scaled to the full bank:

| Area | Items |
|---|---|
| A — Context and purpose of financial reporting | 2 |
| B — Qualitative characteristics | 2 |
| C — Double entry and accounting systems | 4 |
| D — Recording transactions and events | 10 |
| E — Preparing a trial balance | 7 |
| F — Basic financial statements | 6 |
| G — Simple consolidated statements | 2 |
| H — Interpretation | 2 |

Accounting equation: **maximum two items in the entire FA bank.** Areas G and H are deliberately
thickened relative to the old bank — they are the on-ramp to FR.

### 6.5 The diagnostic engine

**Seven causes:** knowledge gap, conceptual misunderstanding, calculation error, requirement
misread, incorrect treatment, careless slip, transfer failure.

**How the engine knows — three layers, honestly:**

1. **Engineered distractors.** Every objective item's wrong options are authored to encode a
   specific cause and tagged with it. Choosing a distractor *is* the primary diagnosis. Items
   where a cause cannot be encoded are tagged untyped and rely on layer 2.
2. **Pattern inference across the attempt log.** Wrong at concept-check → knowledge gap. Right at
   Guided, wrong at Standard → conceptual. Right untimed, wrong timed → exam conditions. Fast,
   wrong, on a Competent concept → careless. Wrong only in mixed or unseen contexts → transfer
   failure.
3. **Micro-probe.** When layers 1 and 2 disagree or are silent, one short follow-up — never more
   than one.

The engine infers; it does not mind-read. **Log classification confidence with every diagnosis.
Ambiguous cases default to conceptual-plus-practice rather than a guess.**

**Remediation routing:**

| Cause | Remediation |
|---|---|
| Knowledge gap | Reopen the lesson section; re-run the Understood check |
| Conceptual misunderstanding | Contrast mini-lesson plus paired discrimination items |
| Calculation error | Parameterized calculation drill set for that operation |
| Requirement misread | Requirement-parsing pack — command verbs and what they demand |
| Incorrect treatment | Rule card plus treatment-choice items |
| Careless slip | No content remediation; pacing flag; a variant resurfaces within 48 hours |
| Transfer failure | Mixed-context set for the concept |

### 6.6 The sealed simulation pool — a frozen holdout

- Per paper, a sealed pool sized for **six full simulations** (amended from four — see
  `PAPER_TRAIL_VALIDATION_PROTOCOL.md` §2: four supports only two qualifying readiness attempts, so
  one failed pair exhausts the holdout and every later score is contaminated; six leaves a margin).
  FA: six sets of the real structure (35 two-mark objective questions plus two 15-mark multi-task
  questions, two hours). BT and MA per their real structures from Volume II.
- **No sealed item is ever reachable from any practice path.** First exposure happens inside a
  simulation, on the real clock.
- Once an item appears in a simulation it is marked exposed. Future simulations prefer unexposed
  items. **Only simulations at 90%+ unexposed count toward exam readiness.**
- Simulations assemble from pack and timer mechanics to the paper's real section structure and time
  budget. A full mock engine with section navigation is out of scope.

### 6.7 Readiness — two numbers, never merged

- **Learning readiness** (per paper): **percentage of topics complete under the 8-of-last-10 rule** (§6.4,
  Amendment A6), alongside a green coverage matrix. *(Was "percentage of concepts at Competent"; the
  8/10 topic rule is now the visible gate for BT/MA/FA. FR/AA revert to concept-Competent.)*
- **Exam readiness** (per paper): two consecutive simulations, each 90%+ unseen items, each scored
  65%+, completed within time. Until that rule is met, not exam-ready — regardless of coverage.

A student can hold 100% coverage and zero exam readiness. **Show both, side by side, with the rule
stated on screen.**

### 6.8 The dashboard

Per paper: the concept map coloured by mastery state; the allocation matrix with the player's
personal state per outcome; the running error-cause profile; the review queue of due concepts; the
readiness panel with both numbers and their rules.

**Auditability rule: every figure must be recomputable from the attempt log. No number without a
derivation.**

### 6.9 Data model

**The attempt log is the single source of truth.** Fields: item id, concept ids, rung, scaffold
use, time taken, correctness, distractor chosen, diagnosed cause, classification confidence,
session id, timestamp.

Every state and every dashboard number derives from it. **States are never written directly.**

Set results (score out of 10, the concepts/topics each set covered, timestamp) and **"Go deeper"
opens** are logged too, so topic completion (the 8-of-last-10 rule) and the rolling average are
recomputable, and thin topics are detectable.

Learner state — concept states, attempt log, set results, Go deeper opens, review schedule —
persists across sessions and papers, and **exports on demand in one tap.** The learning history gets
the same backup discipline as everything else Jeremy runs.

### 6.10 "Go deeper" — pre-generated depth, shipped in the repo  *(Amendment A6; approach changed 2026-07-31)*

Topic pages are deliberately thin, so the learner can go deeper on the spot — **without any runtime
cost.** *(The earlier Claude-API-via-Vercel design is cancelled: no serverless function, no KV, no
passphrase, no caps, no keys.)*

- **Pre-generated, shipped content.** Every topic page ships a **"Go deeper" layer** — a fuller
  explanation authored at build time and stored in the repo (`src/content/topics/…`, a `deeper`
  field of sections). **Free at runtime, works offline, never rate-limited.**
- **Where:** a "Go deeper" control on every topic page, and after any failed question set.
- **Repair links into it:** where a question set exposes a specific error, the repair route links to
  the relevant section of that topic's deeper layer — an in-app link into shipped content, never a
  live call.
- **Logged:** every open is logged (topic, timestamp) and exports with everything else. **Repeated
  opens on one topic flag that page as too thin — a rewrite candidate in `BUILD_STATUS.md`.**
- **Live API only later, only for FR written-answer marking**, which cannot be pre-generated. Not now.

---

## 7. Migration from v3

Jeremy's real export is `spec/paper-trail-progress.json`. Test against it.

**What it actually contains:** 1,975 bytes. Keys `v, stats, streak, nodes, custom, papers, cr,
packs, ethics`. Only three nodes hold data — FA1, FA2, FA3, totalling 34 attempts and 30 correct,
all within an 18-minute window on 27 July 2026. `cr`, `custom` and `packs` are empty. No paper is
flagged passed.

**The rule.** The v3 data carries no item ids, no concept tags, no timing and no scaffold flags.
It therefore cannot satisfy any evidence rule in Section 6.2. **Do not derive mastery states from
it.** Migrate as history only:

- preserve the streak (current 3, best 10) — that is real and carries forward
- preserve the three topic records with counts and timestamps as a read-only "v1 history" panel,
  using their display names ("Double entry & the equation", "Adjustments & period end", "Trial
  balance to statements"), **never the FA1/FA2/FA3 keys**
- create **zero** concept states; every concept starts unvisited
- the FA desk badge becomes a history line, not COMPLETE

Needs a dry-run mode and a rollback path, and must handle a v3 file with keys missing or empty.
**Do not build a general schema-mapping layer** — this is a small, well-bounded job.

---

## 8. Build work

> **WP numbering dropped, 2026-08-06.** The original WP1 → WP5 sequence has been **overtaken**: the
> branch already carries the foundation, the seven-cause diagnosis engine, and several amendments
> (A2, A5, A6, and Amendment 01) that reorder and reshape the remaining work. Jeremy is issuing a
> **reordered work plan** in the next session. What follows is retained only as the *inventory* of
> work — bodies of work, not an ordered sequence. The old "run WP1, then stop" rule no longer governs;
> the foundation stop-point has already been passed and approved in practice.

The remaining work, as bodies rather than a numbered order:

- **Foundation** — *[built]* engine data model per 6.1, 6.2, 6.9: attempt log as single source of
  truth; five mastery states with the exact evidence rules; review scheduler with decay; every state
  derived from the log, never written directly. v3 migration per Section 7 with dry-run and rollback.
  The three allocation matrices per 6.4, failing loudly while cells are empty.
- **Diagnostics and lessons** — the seven-cause engine per 6.5, with engineered distractors and the
  remediation routing table; the teaching layer per 6.3.
- **Items** — practice banks against the allocation matrices, floors and caps enforced, calculation
  items as parameterized generators.
- **Sealed pools and readiness** — simulation pools unreachable from any practice path per 6.6; both
  readiness numbers per 6.7; the dashboard per 6.8.
- **Cutover** — inventory **every** entry point into the old app (home-screen icon, bookmarks, the
  desk screen, topic lists, any documented route), redirect each to the new system, retire the old
  path, verify from Jeremy's phone home screen — his actual starting point — **then ask him to
  approve publishing.**

The sequence and priority across these bodies are set by the forthcoming reordered work plan, not by
this section.

---

## 9. G-PT1 — the validation gate

Phase 1 is not done until all eight pass:

1. **Coverage** — all three allocation matrices green, including every per-outcome floor.
2. **State machine** — ten sampled concepts driven through all five states; the evidence log
   matches 6.2 exactly.
3. **Diagnosis** — a sample of thirty wrong answers: at least 80% receive a specific cause, and
   routing on inspection matches 6.5.
4. **Sealed-pool integrity** — automated verification that no sealed item is reachable from any
   practice path.
5. **Persistence** — full learner state survives app restart, and exports and imports cleanly.
6. **Dashboard audit** — ten sampled figures recomputed from the attempt log; all match.
7. **Simulation** — each paper's simulation runs end to end on the real structure and clock, and
   the readiness rule computes.
8. **Owner walk-through** — roughly thirty minutes against Section 10, finding no failure.

Pass: the architecture scales to the Skills ring, knowledge graph carried forward. Fail:
remediation before any new paper content is authored.

---

## 10. Owner walk-through — what Jeremy checks

1. BT, MA and FA fully open, real topic names, no AWAITING, no LOCKED anywhere.
2. Opening any concept: lesson → worked example → concept check → rungs, in order, forward pointer
   at the close.
3. Answering wrongly on purpose (choosing a tagged distractor) produces a specific diagnosed cause
   and the matching remediation route.
4. The dashboard shows the concept map, error profile, review queue, and both readiness numbers
   with their rules.
5. A previously cleared concept left past its interval appears in the review queue, and failing its
   review visibly drops its state.
6. A full FA simulation runs end to end on the real clock, and exam readiness updates only from
   qualifying simulations.
7. The v1 history line is present; fresh mastery state governs everything else.
8. One tap exports the full learner state.

---

## 11. Standing policies

- **Naming.** Real syllabus topic names everywhere. Paper-code-plus-number labels ("FA1", "FA3")
  are banned from the interface. Internal ids are never shown.
- **Unlocking.** Every paper through Skills level is open at all times. **No LOCKED state below
  Strategic Professional.** Where a growth line exists, show a bridge flag instead — FR "grows from
  FA", PM and FM "grow from MA", AA "grows from FR". Tapping always works.
- **No exam-date anchoring.** This system is built for mastery of the qualification. It makes
  Jeremy exam-ready whenever he chooses to sit. No build decision is sequenced around a sitting.
- **Annual syllabus refresh.** Every pack carries the syllabus year it was authored against. Each
  September, when ACCA's new study guides take effect, diff all banks against the change documents,
  update, and re-stamp. The 2027 Knowledge-level redesign — K1 replacing FA, adding payroll and
  full partnership accounting — enters through this gate when its study guides publish.
- **Partnerships note.** Detailed partnership accounting is correctly outside the current FA
  syllabus (concept only). Do not add it before the 2027 gate.

---

## 12. Out of scope

Strategic Professional population. LW, TX and the Skills ring beyond the stub nodes. The public
repository. The real CBE answer-workspace simulation. Human marking of written answers. A full mock
engine with section navigation. Author mode.
