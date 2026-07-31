# Paper Trail — BUILD STATUS

*Read at the start of every session, after `spec/PAPER_TRAIL_EXECUTION_ORDER.md`. Update after
every unit of work. This is the handoff between sessions and the report to Jeremy.*

Last updated: 2026-07-31 (DESIGN CHANGE **Amendment A6** — topic pages + sets of 10 + 8/10 gate +
Teach Me This; teaching-layer conversion done, engine/UI next) · Working branch:
`rebuild/wp1-foundation`; Pages `main` at published commit `31e3fd8` (live app = the v4.1.0 drill
runner, unaffected by A6 branch work so far). · Tests: 78 node + drill smoke + browser harness +
Section 8 pre-flight green.

---

## 0. Publishing log

- **2026-07-31 — DRILL RUNNER PUBLISHED & VERIFIED LIVE.** commit `31e3fd8` on `main` (SW
  `papertrail-v4.1.0`). Questions are now answerable on the phone: read a lesson → practise its
  questions → the concept climbs the mastery states, with a diagnosed cause + repair on wrong
  answers. Options are shuffled per serve (position never predicts the answer). Section 8 pre-flight
  green, browser harness green, `npm run drill:smoke` green (real UI, phone viewport: read→Exposed,
  3 concept-checks→Understood, wrong→diagnosis, attempts logged), `npm run live-smoke` green on the
  deployed URL. URL unchanged; v1 history intact; only `papertrail:v4:` written.
- **2026-07-30 — FIRST CUTOVER, PUBLISHED & VERIFIED LIVE.** commit `c164113` on `main`.
  Section 8 pre-flight all green (`npm run preflight`); browser harness + 60 node tests green;
  live smoke on a phone viewport with v3 data seeded passed (`npm run live-smoke`). The new app is
  live at `https://kimutaijeremy.github.io/ACCA-game/` — URL unchanged; his v1 history (streak
  3/10, three FA topics) migrated intact; only `papertrail:v4:` written, old `pt_*` keys read-only.

## 0A. Amendment A6 — redesign in progress (BT/MA/FA)

Teaching layer collapses to **topic pages** (one per sub-area); **questions become the main event**
as mixed **sets of ten**; completion/unlock by the **8/10 rule**; **Teach Me This** (grounded Claude
API via Vercel). Concept graph, item model, diagnosis, mastery states, review and decay all kept as
the spine underneath. FR/AA keep full lessons. Specs amended & committed (`2db59b8`).

**A6 build checklist:**
- [x] Specs amended (Execution Order, Brief, Validation Protocol) and committed.
- [x] **Topic-page model** (`src/engine/topics.js`) + **12 topic pages** converting the 15 concepts
  (`src/content/topics/{bt,ma,fa}.js`): BT 3 (A1, A2, A3), MA 3 (A1, A3, B2), FA 6 (A3, C1, C2, D3,
  D5, H2). 6 topic tests green. Old concept lessons kept (not discarded; FR/AA use that model).
- [x] **Sets-of-10 engine** (`src/engine/sets.js`) — `assembleSet` (10 items across the paper,
  round-robin over concepts, deterministic by seed), topic completion by the **8-of-last-10 rule**
  (refined: on a topic's own questions, ≥2 sessions, latched), `paperTopicSummary`, `topicHint`,
  `rollingAverage`. Store now holds `sets` + `teachUses` in meta (`addSetResult`/`addTeachUse`).
- [x] **Rewire lineage/progress** — `paperStatusesByTopic` (completion/unlock by the topic rule;
  concept mastery + decay keep running underneath). 10 new tests; 88 node tests green.
- [ ] **App UI rewire** — topic-page screen, sets-of-10 play screen, home showing topics-complete +
  rolling average; switch app to `paperStatusesByTopic`; then publish (Section 8) as the coherent A6
  experience. *(Live app still the v4.1.0 drill runner until this lands.)*
- [ ] **Teach Me This** — Vercel serverless function (`/api/teach`, key server-side only) + client
  thread; grounded in the topic page, worked example, missed question, correct answer, diagnosed
  cause; log every use; surface repeated-use topics as rewrite candidates.
- [ ] **Audit tooling** — Test A split into two numbers (answerable-from-page-alone; gap-closed-by-Teach-Me).

## 1. Current position

**Mode:** parallel authoring across BT, MA, FA — no priority (Order §4, Amendment A2). **The
authoring unit is now the CONCEPT: lesson + its question set, written together** (Order §1A / brief
§6.4, Amendment A5). No more lessons in isolation.
**Publishing:** continuous, gated on the Section 8 pre-flight. **First publish done.** Discipline:
author on the working branch; run `npm run preflight`; ff-merge to `main` and push to publish.

- Engine foundation: complete and live — attempt log (IndexedDB) as single source of truth, five
  mastery states by fold, neglect + failed-review decay, migration, allocation matrices, diagnosis
  engine, flag mechanism, lineage-gated unlocking, and the **phone-first app shell**.
- **Item model (new):** `src/engine/items.js` — MCQ + engineered distractor→cause model (feeds
  `diagnose.js` layer 1), parameterized generators (`rng.js`, mulberry32 seeded), per-concept
  allocation floor and the `conceptComplete` "done" predicate. Content in `src/content/items/{bt,ma,fa}.js`.
  Check with `npm run items:check`.
- **Concepts DONE: 15 of 191** (lesson + question set to floor) — BT 4/60, MA 4/66, FA 7/65.
  **142 practice items**, 4 parameterized generators (MA-11, FA-11, FA-26, FA-63).
- **Drill runner: LIVE (2026-07-31).** Questions are served, answered, logged, diagnosed, and drive
  the mastery states on the phone (app.js drill screen; options shuffled per serve so position never
  predicts the answer; dashboard shows a real diagnosed-cause error profile). `npm run drill:smoke`
  covers it in a real browser. Next: **resume authoring concepts (lesson + questions together) toward
  the 20-concept audit** (Order §6, now Test A per concept: items answerable from their lesson alone
  at 95%), then run the first independent audit, then publish the batch.

## 2. Ledger (mechanically derived — run `npm run ledger` for the full per-concept table)

| Paper | Concepts DONE | Practice items | Sealed | Track |
|---|---|---|---|---|
| BT | 4 / 60 | 40 | 0 / 6 sims | in build |
| MA | 4 / 66 | 40 | 0 / 6 sims | in build |
| FA | 7 / 65 | 62 | 0 / 6 sims | in build |
| **Total** | **15 / 191** | **142** | **0** | |

Done (lesson + question set): BT-01, BT-03, BT-04, BT-05; MA-01, MA-06, MA-07, MA-11; FA-04, FA-05
(capped, 2 items), FA-11, FA-13, FA-22, FA-26, FA-63. Per-concept floor cc3/g3/s3/st1; calc concepts
carry a parameterized generator.

## 3. Judgement calls made (Order §9)

- Deployed repo is **ACCA-game**, not `paper-trail` (brief's name was wrong); building inside it,
  origin unchanged. (2026-07-28)
- Attempt log moved to **IndexedDB**, meta in localStorage — measured localStorage caps at ~15k
  attempts. (2026-07-29)
- Storage namespace `papertrail:v4:` spelled out in full (shared-origin collision safety). (07-29)
- Neglect decay: overdue > one interval decays one state per interval; state = f(log, date). (07-29)
- Sealed pool **six** simulations (validation protocol §2 supersedes brief's four). (07-30)
- Lineage table (FA→FR, MA→PM/FM, FR→AA, BT→none, LW/TX open) in `src/content/lineage.js`;
  completion measured against full concepts.json count. (2026-07-30, Amendment A2)
- Copied the two order files into `spec/` rather than deleting the Downloads originals — deletion
  would be an out-of-repo write (never-list). (2026-07-30)
- Lesson data format kept as-is (renderable) — added a markup-lite renderer in the shell instead
  of reshaping the 12 lessons; format judged adequate for phone rendering (Order §6 point). (07-30)
- **Authoring unit changed to the concept (lesson + questions), Amendment A5.** Per-concept floor
  set at cc3/g3/s3/st1, derived from the §6.2 evidence rules so Understood/Practised/Competent are
  reachable from the set; integrated/sealed excluded (cross-concept). Documents were silent on exact
  per-concept counts (Order §9 → decide + log). (2026-07-30)
- **Accounting-equation cap honoured over the floor:** FA-05 gets 2 items, not the full floor
  (brief §6.4 caps it at 2 in the whole FA bank). Encoded as `ITEM_CAPS` in `items.js`. (2026-07-30)
- **`conceptComplete` (not `hasLesson`) is now the "built" predicate** for the paper-map count and
  lineage unlocking; `hasLesson` still gates whether a lesson is *readable*. (2026-07-30)
- **Options are shuffled at instantiation (seeded), not stored in fixed order.** Authoring put the
  correct option first everywhere; without a shuffle, position would predict the answer (violates
  anti-memorisation, brief §6.3). Option ids stay stable (they carry the distractor→cause map and
  are logged); only display order + the A/B/C label change per serve. (2026-07-31)
- App shell is a module-based single `index.html` importing the engine directly; no bundler/build
  step, so GitHub Pages serves it static. SW cutover: bump `CACHE` each release + page reload on
  controllerchange. Working branch → ff-merge to `main` at each publish. (2026-07-30)

## 4. Flagged uncertainties (rate/threshold/standard-dependent — never guessed)

- FA-26 depreciation: useful life & residual value are management estimates, not statutory —
  flagged in the lesson's `rateFlags`. Review at the annual September gate.
- FA-63 ratios: 365- vs 360-day convention — flagged in the lesson's `rateFlags`.
- (No sales-tax rate, tax threshold or current-standard citation authored yet.)

## 5. Blocked items

- None. (First publish is gated on the app UI shell, which is upcoming build work, not a blocker.)

## 6. Independent audit log (Order §6)

- **2026-07-30 — Jeremy-flagged content review (12 lessons).** He caught FA-13 listing five books
  of prime entry as complete when there are **seven** (omitting the sales returns and purchases
  returns day books). Fixed. Audited the other 11 for the same class (incomplete list stated as
  complete): found **MA-06** covered only traceability + timing while its title promises nature,
  function AND traceability — added the "by nature / by function" classification. The remaining 9
  lists are complete or honestly framed ("the main types"). Also: BT-03 opened on the same device
  as BT-04 → re-opened on a distinct device (rubric 8, new); FA-05 shared BT-01's founding device →
  re-opened. Two forward pointers named SBL (out of scope) → reworded to flag it plainly.
- The full independent audit (fresh session, phone-rendered) still triggers at the **first 20
  concepts**, and now explicitly checks rubric 7 (incomplete lists) and rubric 8 (distinct openings),
  **plus (Amendment A5) the per-concept sole-resource test**: the fresh reviewer answers each
  concept's items from its lesson alone (one rendered instance per generator, seed recorded) at the
  95% threshold, and verifies the keyed answers and distractor→cause tags.

## 7. Flags (Order §7)

- Open flags: 0 (review queue `docs/review-queue.json` empty — Jeremy has not flagged yet).

## 8. Questions for Jeremy (batched, non-blocking — work continues past these)

1. The whole build still lives on branch `rebuild/wp1-foundation`. That is fine until the first
   publish (which merges to `main`/Pages via the Section 8 checklist). Flagging so the branch name
   isn't a surprise at cutover; no action needed.
2. ~~The app can't yet let you ANSWER a question.~~ **RESOLVED 2026-07-31 — the drill runner is
   live.** You can now answer questions on the phone, see whether you were right, get the diagnosed
   cause + repair when wrong, and watch concepts climb the mastery states.
