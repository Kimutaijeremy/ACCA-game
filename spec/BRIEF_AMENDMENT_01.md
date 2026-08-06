# Brief Amendment 01 — Exam-shaped navigation, session state, freshness

**Amends:** `PAPER_TRAIL_BUILD_BRIEF.md` (primarily §1, §6.2–§6.4, §6.6, §6.9; §8 work packages).
**Date:** 2026-08-06.
**Status (updated 2026-08-06):** partially implemented.
- **Clauses E, F and G are IMPLEMENTED** — `src/engine/session.js` (E), `src/engine/escalation.js`
  (F, G), tests in `test/session.test.js` + `test/escalation.test.js` (119 tests green). Engine layer
  only; UI wiring lands with the navigation work.
- **Clauses A–D, H and I remain specification only** — built to under the **reordered work plan**
  (the WP1 → WP5 numbering was dropped from the brief on 2026-08-06). Nothing in those clauses has
  been built.
- **LW (clauses C, D) is deferred and variant-undecided** — see the note under clause D.

This amendment turns the practice surface from "topic pages plus mixed sets of ten" into a structure
that mirrors the real exam: **each paper has a Section A and a Section B**, and topic-blocked drilling
becomes an explicit minor option rather than the shape of the app. Where it changes a rule set by
Amendment A6 (topic pages, sets of ten, 8-of-last-10), the change is called out under that clause.

---

## A. Navigation — the exam is the shape of the app

Navigation becomes: **Papers → Paper → Section A or Section B.**

- The paper screen offers the two sections as the primary choices, named as the exam names them.
- **Topic-blocked practice is demoted** from the default loop (A6's "sets of ten across the whole
  paper") to an explicit, secondary **"drill one topic"** option — available, never the front door.
- Topic pages (§6.3) remain the teaching surface but are reached as overlays (clause E), not as a
  navigation tier of their own.

## B. Section A — objective items across the whole syllabus, by mark weight

Section A is **10 OTQs drawn across the WHOLE syllabus of the paper**, assembled by the allocation
matrix (§6.4):

- Sampled by **real mark weight** via the per-area target tables (`FA_/BT_/MA_AREA_WEIGHTS` in
  `src/engine/sets.js`) — **never uniformly random, never single-topic.**
- **No syllabus area appears more than twice in one set of 10.**
- Renormalises over areas that have authored items (as today), so partial content still produces a
  sensible, exam-shaped set.

*(Supersedes the framing of A6's "sets of ten" as the whole loop: the mixed set of ten is now
specifically **Section A**, and the whole-syllabus / mark-weight / max-twice rules are binding on it.)*

## C. Section B — whole MTQs at full mark value

Section B is **whole multi-task questions at their full mark value — never shrunk to fit a set.**

Per session:

| Paper | Section B composition |
|---|---|
| FA | 1 × 15 marks |
| MA | 2 × 10 marks |
| LW | 3 × 6 marks *(deferred — see note under clause D)* |

- **Timed at 1.2 minutes per mark.**
- **Rotation:**
  - **FA** rotates *consolidations* / *accounts preparation*.
  - **MA** rotates *budgeting* / *standard costing* / *performance measurement*.
  - **LW** shuffles across the syllabus.

## D. Exam formats of record

The formats the sections are measured against (all **2 hours**, **pass mark 50%**):

| Paper | Section A | Section B |
|---|---|---|
| FA | 35 × 2 marks | 2 × 15 marks |
| MA | 35 × 2 marks | 3 × 10 marks |
| LW | 25 × 2 marks + 20 × 1 mark | 5 × 6 marks |

These are the formats of record for readiness (§6.7) and for the sealed mock (§6.6). A practice
Section A (clause B, 10 OTQs) is a scaled sample of the format-of-record Section A; a practice
Section B (clause C) is a subset of the format-of-record Section B at full per-question value.

> **LW is deferred and variant-undecided (2026-08-06).** Jeremy has **not sat LW**. LW is live scope
> for him as a student, but **clauses C and D are DEFERRED for LW**: do **not** author LW syllabus,
> concept graph, or items. The LW lines recorded here — **Section A 25×2 + 20×1, Section B 5×6**, and
> the practice split **3×6** — are kept **for later reference only**. LW is additionally **blocked on
> a variant decision** (which LW variant Jeremy will sit); nothing LW proceeds until that is settled.
> FA and MA under clauses C/D are unaffected.

## E. Session state is a persisted, resumable object — teaching is always an overlay

> **IMPLEMENTED 2026-08-06** — `src/engine/session.js`, tests in `test/session.test.js`. The engine
> models the session object, the position index, overlay open/close (position untouched), `resume`
> (→ question n+1), and `restart` as a function and label distinct from resume. Wiring the app UI to
> these (overlays as real overlays, honest control labels on screen) lands with the navigation work.

Session state is a **persisted object carrying a position index**, not transient screen state.

- **Every teaching surface opens as an OVERLAY, never a route change** — the topic page (§6.3), the
  nutshell (clause F), the full lesson (clause G) all open over the running set and close back to it.
- **Resume returns to question _n+1_** — the next unanswered item, not the start.
- **A control that restarts a set must never be labelled as if it continues one.** Restart and resume
  are distinct actions with distinct labels.

> **This is a bug in v3.1** — a "restart" path presents as continuation — **and it is fixed in the
> new engine**, not patched in the old one.

## F. On a miss — nutshell after commit, then continue

> **IMPLEMENTED 2026-08-06** — `src/engine/escalation.js` (`resolveAfterAnswer` / `answerAndResolve`).
> A committed miss opens the **nutshell** overlay (ref flagged `offersLesson: false`); a correct
> answer opens nothing; the overlay never moves the set position, so closing it continues to the next
> question. Tests in `test/escalation.test.js`.

On a wrong answer:

- Reveal the **nutshell** — the formula or statement **only** — **AFTER the answer is committed**
  (never before; committing is final), then **continue the set.**
- The **full lesson is NOT offered here.** A miss inside a set costs one nutshell, not a detour.

## G. Escalation override — three same-cause misses force the lesson

> **IMPLEMENTED 2026-08-06** — `src/engine/escalation.js` (`ESCALATION_MISS_THRESHOLD = 3`). The 3rd
> same-concept, same-cause miss opens the **lesson** overlay with `forced: true` — the learner is
> routed in, never asked. Different causes or different concepts do not accumulate; an undiagnosed
> miss (cause null) never escalates; prior-session misses carry via `priorMisses`. Tests in
> `test/escalation.test.js`. (The cause is diagnosed by §6.5 / `diagnose.js` and passed in — this
> module decides the overlay only.)

If a learner records **3 misses on the same concept with the same diagnosed cause** (§6.5 causes):

- **Force the full lesson** — route them into it directly.
- **Do not ask.** No prompt, no offer; the escalation decides.

*(This is the one path from a set into the full teaching lesson; clause F's per-miss nutshell is the
default.)*

## H. Item freshness and the sealed pool

- **An item cannot repeat within 14 days OR until 40 other items have been served — whichever is
  later.** Both conditions must clear before an item is eligible again.
- **Calculation items regenerate via seeded RNG** (the existing parameterized generators), so a
  "repeat" is a fresh instance, not the same numbers.
- **The sealed mock pool NEVER appears in practice under any condition** — reaffirms §6.6. Sealed
  items are the readiness holdout only, unreachable from Section A, Section B, or topic drills.

## I. IndexedDB namespace — everything under `papertrail:`

- **Namespace all IndexedDB keys under `"papertrail:"`.** Storage is **shared across every project at
  `kimutaijeremy.github.io`**, so an un-namespaced key risks colliding with another app on the same
  origin.
- The WP1 engine already writes its v4 keys under `papertrail:v4:` (`src/engine/store.js`); this
  clause makes the `papertrail:` prefix binding for **every** IndexedDB key the app opens, including
  any carried over from the app shell, and forbids bare keys.

---

## Conflicts and supersessions to reconcile under the reordered work plan (not resolved here)

Recorded so the next work starts with eyes open — do not act on these now:

1. **The branch is already past the pristine WP1 stop point.** `rebuild/wp1-foundation` carries
   WP2a (diagnosis) and Amendments A2/A5/A6 (lineage unlocking, per-concept authoring, topic pages,
   drill runner, sets-of-ten). Implementing this amendment is a **course-correction over shipped
   surfaces**, not greenfield.
2. **Navigation (clause A/B) supersedes A6's default loop.** A6 made "sets of ten across the whole
   paper" the primary loop; this amendment keeps that engine but reframes it as **Section A** and adds
   **Section B**, demoting topic-blocked drilling. The A6 topic-page navigation tier is replaced by
   the overlay model (clause E).
3. **LW is deferred and variant-undecided (resolved 2026-08-06 — see the note under clause D).** LW
   clauses C/D do not proceed: no LW syllabus, graph, or items are authored, and LW is blocked on a
   variant decision. The LW format lines are retained for later. FA/MA/BT are unaffected.
4. **Section B needs whole MTQ items at full mark value.** The current bank is OTQ/short-item shaped
   (§6.3 rungs); full-value MTQs are a new item class the items work must author.
5. **8-of-last-10 completion (§6.4) is measured on topic questions.** With Section A drawing across
   the whole syllabus, the reordered work plan must confirm how completion signal accrues under the
   new navigation.

**Execution:** hold until Jeremy reviews. Then fold clauses A–D and F–I into the sections of
`PAPER_TRAIL_BUILD_BRIEF.md` and the Execution Order, and schedule under the reordered work plan.
Clause E is already implemented at the engine layer; its UI wiring schedules with the navigation
work. Not before.
