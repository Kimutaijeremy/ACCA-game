# Paper Trail — BUILD STATUS

*Read at the start of every session, after `spec/PAPER_TRAIL_EXECUTION_ORDER.md`. Update after
every unit of work. This is the handoff between sessions and the report to Jeremy.*

Last updated: 2026-07-30 (FIRST PUBLISH) · Working branch: `rebuild/wp1-foundation`; Pages `main`
pinned at published commit. · Tests: 60 node + browser harness + Section 8 pre-flight green.

---

## 0. Publishing log

- **2026-07-30 — FIRST CUTOVER, PUBLISHED & VERIFIED LIVE.** commit `c164113` on `main`.
  Section 8 pre-flight all green (`npm run preflight`); browser harness + 60 node tests green;
  live smoke on a phone viewport with v3 data seeded passed (`npm run live-smoke`). The new app is
  live at `https://kimutaijeremy.github.io/ACCA-game/` — URL unchanged; his v1 history (streak
  3/10, three FA topics) migrated intact; only `papertrail:v4:` written, old `pt_*` keys read-only.

## 1. Current position

**Mode:** parallel authoring across BT, MA, FA — no priority (Order §4, Amendment A2).
**Publishing:** continuous, gated on the Section 8 pre-flight. **First publish done.** Discipline:
author on the working branch; run `npm run preflight`; ff-merge to `main` and push to publish.

- Engine foundation: complete and live — attempt log (IndexedDB) as single source of truth, five
  mastery states by fold, neglect + failed-review decay, migration, allocation matrices, diagnosis
  engine, flag mechanism, lineage-gated unlocking, and the **phone-first app shell**.
- Lessons: **12 of 191** authored (BT 3/60, MA 3/66, FA 6/65) — all live and readable on the phone.
  Next: continue in parallel toward the first **20-lesson independent audit** (Order §6/A3 — audit
  assesses lessons AS RENDERED IN THE APP ON A PHONE VIEWPORT).

## 2. Ledger (mechanically derived — run `npm run ledger` for the full per-concept table)

| Paper | Lessons | Items | Sealed | Track |
|---|---|---|---|---|
| BT | 3 / 60 | 0 | 0 / 6 sims | in build |
| MA | 3 / 66 | 0 | 0 / 6 sims | in build |
| FA | 6 / 65 | 0 | 0 / 6 sims | in build |
| **Total** | **12 / 191** | **0** | **0** | |

Authored so far: BT-01, BT-03, BT-04; MA-06, MA-07, MA-11; FA-04, FA-05, FA-13, FA-22, FA-26, FA-63.

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

- Not yet run. Triggers after the **first 20 lessons of the FA track** — a fresh session with no
  authoring context, against the Section 5 rubric; fix template before lesson 21 if it fails.

## 7. Flags (Order §7)

- Open flags: 0 (review queue `docs/review-queue.json` empty — Jeremy has not flagged yet).

## 8. Questions for Jeremy (batched, non-blocking — work continues past these)

1. The whole build still lives on branch `rebuild/wp1-foundation`. That is fine until the first
   publish (which merges to `main`/Pages via the Section 8 checklist). Flagging so the branch name
   isn't a surprise at cutover; no action needed.
