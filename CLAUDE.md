# CLAUDE.md — Paper Trail operating notes

This repo is the **ACCA-game** deployment (`github.com/Kimutaijeremy/ACCA-game`), cloned locally as
`dev/paper-trail` and worked on branch `rebuild/wp1-foundation`. The spec of record is
`spec/PAPER_TRAIL_BUILD_BRIEF.md`, amended by `spec/BRIEF_AMENDMENT_01.md`. Read both before building.
The Execution Order (`spec/PAPER_TRAIL_EXECUTION_ORDER.md`) is standing.

## Standing rules

- **Pushing is Jeremy's.** Do local git freely, but **do not push** except on his explicit
  per-session instruction. Pages serves `main` at its root, so **a push to `main` (or a Pages branch)
  publishes to the live site** — treat it as publishing, which the brief §4 says to ask for.
- **Never force-push. Never delete or rename the ACCA-game repo.**
- **Never commit a progress-export file** (`paper-trail-progress.json` is a spec *fixture*; a real
  learner export must not be committed — the repo is public).
- **Read-only inputs:** `OneDrive/Documents/ACCA/ACCA story.docx`, `ACCA Exam companion.docx`, and the
  v3.1 app. Never write outside the repo folder.
- **Verify, don't claim.** "Done" means the test/tool was run and the output pasted.

## True state established 2026-08-06

- **Branch topology.** `origin/main` and `origin/rebuild/wp1-foundation` are both at **`f466f4e`**
  (pushed this session). The branch carries far more than "WP1": the engine foundation, the
  seven-cause diagnosis engine, and Amendments A2/A5/A6 and 01. The "WP1 rebuild" work is **not lost** —
  it lives here, committed and pushed. There is no separate TEMP clone; this `dev/paper-trail` is it.
- **What is live.** GitHub Pages serves `main` root (`build_type: legacy`). Before this session's push
  the last successful build was `fca1d6e` (2026-08-01); the served app is the **rebuild** — a thin
  `index.html` shell loading `./app.js` as an ES module over the engine, **not** the old v3.1
  single-file app. Pushing `f466f4e` triggers a fresh build that also deploys `97437f8`'s batch-1
  authored content (content only, no engine change).
- **WP numbering dropped.** Brief §8 no longer uses WP1→WP5; it is an inventory of work bodies.
  A **reordered work plan** is coming from Jeremy in the next session — it sets sequence/priority.
- **Amendment 01.** Recorded (`spec/BRIEF_AMENDMENT_01.md`): exam-shaped navigation (Section A/B),
  session state, item freshness, `papertrail:` namespace, etc. **Clauses E, F, G are implemented**
  at the engine layer — E `src/engine/session.js`; F/G `src/engine/escalation.js` (nutshell-on-miss;
  3 same-concept same-cause misses force the lesson as an overlay). Clauses A–D, H, I are spec only.
  **LW (clauses C/D) is deferred and variant-undecided** — do not author LW syllabus, graph, or items;
  the LW format lines are retained for later.
- **Authoring contract.** `spec/AUTHORING_CONTRACT.md` defines "one concept authored" = lesson +
  one-line nutshell + rung floor set (cc3/g3/s3/st1) + exactly 1 sealed item, authored together;
  breadth-before-depth per paper; batch acceptance via `items:check`. **15/191 authored, 176 remain.**
  Do not start authoring on its strength — the reordered work plan schedules it.

## Verify commands

- `npm test` — full suite (**119 green** as of 2026-08-06, incl. session + escalation tests).
- `npm run report` — WP-style foundation report (migration dry-run + the three allocation matrices).
- `npm run items:check` — per-concept floors; `npm run ledger` — BUILD_STATUS ledger.

## Clause E (implemented) — session model contract

`src/engine/session.js`: a session is a persisted, serialisable object with a **position index**
(`position === responses.length`). `resume()` returns question **n+1** (next unanswered), never
resetting. `openOverlay`/`closeOverlay` model every teaching surface (nutshell, go-deeper, lesson) as
an **overlay** — they leave position and responses untouched (never a route change). `restart()` is a
**separate function** from resume, and `CONTROL_LABELS`/`assertControlLabelsHonest()` guarantee a
restart control is never labelled as a continuation (the v3.1 bug). Persistence rides in `meta`
(`store.saveSession`/`loadSession`/`clearSession`) and exports with everything. UI wiring is pending
and lands with the navigation work.
