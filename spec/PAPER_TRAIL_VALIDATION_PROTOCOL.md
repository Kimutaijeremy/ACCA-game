# Paper Trail — Validation Protocol

**Gate G-PT2: how we will judge whether the content works**

| | |
|---|---|
| Version | 1.0 |
| Date | 30 July 2026 |
| Status | Pre-registered. Fixed before any lesson or item exists. |
| Relationship to the brief | Amendment to `PAPER_TRAIL_BUILD_BRIEF.md`. G-PT1 gates the engine; G-PT2 gates the content and the readiness claim. |
| Why it is written now | Criteria set after seeing results are not criteria. |

---

## 1. The claim that cannot be validated, and why it is recorded anyway

The brief states a calibration: *a diligent new ACCA student, using only this game, should average
roughly 60–65% at Knowledge level.*

**This is a design assumption, not a testable hypothesis, and it must never be reported as
validated.** Three reasons:

1. **There is one learner.** A percentage-of-students claim needs a cohort. With n=1 there is no
   distribution to estimate and no confidence interval to quote.
2. **The learner is not naive.** Jeremy has studied FA, attended FR teaching, and passed CBL. His
   results cannot test whether someone starting from zero could learn from this alone — the
   question the standard actually asks.
3. **Item statistics need many respondents.** Discrimination and difficulty indices, the normal
   tools for validating a question bank, are not computable from one person's attempts.

It stays in the documents as the target the build aims at. It does not graduate to a finding.

## 2. The holdout budget — the constraint that governs everything else

The sealed simulation pool is a frozen holdout. **Every simulation sat consumes it permanently**,
because exposed items can never again test unseen performance.

Pre-registered rules:

- **Pool size: six simulations per paper**, not four. Four supports only two qualifying readiness
  attempts; one failed pair exhausts the holdout and every later score is contaminated.
- **Attempt budget: two qualifying readiness attempts per paper.** A qualifying attempt is a
  simulation at 90%+ unexposed items.
- **Exhaustion is terminal, not renewable by reuse.** If both attempts are spent without meeting
  the readiness rule, no further readiness claim can be made for that paper until new sealed items
  are authored blind — written without reference to which items were previously failed.
- **The exposure ledger is public in the app**: remaining unexposed items per paper, and attempts
  remaining, shown before any simulation starts. The cost of sitting one should be visible before
  it is paid.

## 3. Tests that can be run with one learner

### Test A — Content sufficiency audit (the sole-resource standard, made checkable)

The standard says a student needs nothing but the game. That is auditable without any learner
performance at all.

- **Method:** random stratified sample of 60 items — 20 per paper, spread across rungs. For each
  item, trace every fact, rule and method it requires to a specific in-game lesson section.
- **Independence requirement:** run by a reviewer with no memory of authoring the content — a fresh
  session given only the lessons and the sampled items, asked whether each item is answerable from
  the lessons alone.
- **Pass:** 95% or more of sampled items fully traceable.
- **Fail:** below 95% means the content does not meet the sole-resource standard. Content is
  reworked before any readiness claim is made.
- **Runs:** after WP3.

### Test B — Structural fidelity of the sealed pool

Whether the pool resembles the real assessment, checked against published sources rather than
opinion.

- Distribution across syllabus areas matches the official study-guide weightings, within one item
  per area (FA's target table is in the brief, section 6.4).
- Format matches the real exam exactly: item counts, mark allocation, section structure, duration.
- Question style cross-checked against ACCA's specimen exams and published examiner guidance — the
  closest available ground truth on style and difficulty.
- **Pass:** every area within tolerance and format exact. **Fail:** pool re-blueprinted before use.
- **Runs:** after WP4, before any simulation is sat.

### Test C — Difficulty calibration, with the falsifier stated in advance

- **Expected band:** a learner who has reached Competent on most concepts of a paper should score
  **60–75%** on a qualifying simulation.
- **The falsifier:** a score of **85% or above is evidence the pool is too easy, not evidence of
  readiness.** It triggers a pool audit, and the score does not count toward readiness until the
  audit clears it.
- **The floor signal:** below 45% with most concepts at Competent means the mastery evidence rules
  are too generous — the engine is certifying competence that does not survive exam conditions.
  That sends the rules back for revision, not the learner.

### Test D — Personal exam readiness (unchanged from brief section 6.7)

Two consecutive qualifying simulations, each 90%+ unexposed, each 65% or above, completed within
time.

**Reported strictly as:** *"Jeremy, on this content, has met the readiness rule for paper X."*
Never as validation of the section 1 estimate, and never as a statement about students in general.

### Test E — Retention, which matters more than acquisition

The measure most systems skip, fully available with one learner and arguably the truest test of
whether the teaching worked.

- **Metric:** of concepts that reached Competent or above, the proportion that survive their first
  two due reviews without dropping a state.
- **Target: 70% or above.**
- **Below 70%:** either the review intervals are wrong or the lessons are shallow enough that
  performance was recall rather than understanding. Both are content and engine problems, and both
  are addressed before more content is authored.
- **Runs:** continuously, from the first review cycle onward.

## 4. Kill conditions — stated before results exist

| Trigger | Consequence |
|---|---|
| Test A below 95% | Content rework. No readiness claim permitted. |
| Test B outside tolerance | Sealed pool re-blueprinted before any simulation is sat. |
| Test C at 85%+ | Pool audit. Score withheld from readiness until cleared. |
| Test C below 45% with concepts at Competent | Mastery evidence rules revised. |
| Test E below 70% | Review intervals and lesson depth revisited before further authoring. |
| Holdout budget exhausted | No readiness claim for that paper until new items are authored blind. |

## 5. The only true arbiter, recorded for honesty

The single thing that would settle the estimate is **a real ACCA exam result** achieved having used
only this system. BT and MA are on-demand computer-based exams, so that evidence is available
whenever Jeremy chooses.

**No build decision depends on it, and the system's value does not rest on it.** The programme is
explicitly built for mastery of the qualification rather than for a sitting. This section exists so
the protocol is honest about the limit of what it can settle from inside the app: everything in
Section 3 measures the system against its own design, and only a real sitting measures it against
the world.

## 6. What each test does not tell us

- Test A measures whether content is sufficient, not whether it teaches well.
- Test B measures resemblance to the real exam, not equivalence to it.
- Tests C, D and E measure one person, on one attempt history, and generalise to nobody.
- No test here validates the 60–65% figure. That figure remains an assumption for as long as this
  system has one user.
