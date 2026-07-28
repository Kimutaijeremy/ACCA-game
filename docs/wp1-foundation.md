# WP1 — Foundation (engine data model, migration, allocation matrices)

Status: built and tested. This is the deliberate WP1 stop point (Brief §8). No lessons, no items.

## What is here

```
spec/                    frozen inputs (do not edit)
  concepts.json          the concept graph: 191 live, 38 stubs, 273 edges
  build_graph.py         re-validates + regenerates concepts.json (cross-platform)
  paper-trail-progress.json  Jeremy's real v3 export (migration fixture)
  syllabus-outcomes.json derived from build_graph's validated sub-area lists
src/engine/
  concepts.js            loads + indexes the frozen graph; ids are permanent keys
  states.js              the five states, rungs, evidence rules, review/decay schedule (§6.2)
  log.js                 the attempt log — the single source of truth (§6.9)
  derive.js              folds the log → mastery state, review schedule, queues (nothing written directly)
  store.js               persistence in a distinctive namespace (papertrail:v4:*); never touches v3 keys
  migrate.js             v3 → v4 migration: history only, dry-run + rollback (§7)
  allocation.js          allocation matrices, floors, 8% cap, loud-failure report (§6.4)
  node-loader.js         Node-only file reads (browser fetches instead)
  index.js               public API surface
test/                    node:test suites (run: npm test)
test/browser/            headless-Chromium harness (run: npm run verify:browser)
tools/wp1-report.mjs     the WP1 report (run: npm run report)
tools/browser-verify.mjs Q3/Q4 in real Chrome: persistence, in-browser migration,
                         export/import round-trip, namespace, quota, year-scale benchmark
tools/verify.mjs         Node-side idempotency + derivation-cost evidence
```

## Persistence, quota and eviction

Learner state is written with `trySaveState`, which **reports** a failed write instead of
throwing or swallowing it — a full quota returns `{ ok:false, quota:true }` so the UI can warn and
prompt an export. Storage can still be *evicted by the OS later* (nothing can catch that at write
time); the guard for that is the one-tap export + off-device backup (Brief §6.9). Clearing storage
makes state read as absent (a clean fresh start), never as stale/partial data.

## Performance (measured, real Chrome, 4× CPU throttle ≈ mid-range phone)

State is recomputed by replaying the log; there is **no memoization yet** and none is needed at
projected scale. A synthesised year of use — 50,000 attempts across all 191 concepts — derives
every concept state **and** the review queue in ~17 ms desktop / ~57 ms throttled; rendering the
queue adds a few ms. If it ever matters, the append-only log makes an incremental checkpoint cheap:
persist the fold accumulators up to timestamp *T*, then fold only records after *T*; a checkpoint
stays valid unless an import inserts a record earlier than *T*, which invalidates checkpoints at or
after the earliest inserted timestamp.

No third-party dependencies. Engine core is pure ES modules — runs under Node tests today and
directly in the browser PWA later, with no build step.

## The state machine (the crux WP1 exists to validate)

Mastery state is **never stored**. It is computed by folding the attempt log in
chronological order. Two forces act on each concept:

- **Promotion** — the §6.2 evidence rules raise state one rung at a time
  (lesson → concept-check set → guided ×3 → 5 standard @80% in-budget → stretch/integrated
  across two sessions 72h apart).
- **Decay** — a *due review* that is failed drops the state one rung, clears the evidence
  windows for the levels above the new state (so the lost level must be genuinely re-earned),
  and queues remediation. "Due" is derived purely from the schedule, so decay is auditable.

Review intervals: Understood 3d, Practised 7d, Competent 14d, Mastered 30d then 90d.

Ladder is strict: a concept cannot reach Understood without a logged lesson (Exposed), matching
the §6.3 topic-node order (lesson → check → drills). *(Logged assumption — see below.)*

## Migration (§7)

The v3 export is migrated as **history only**: streak preserved (cur 3 / best 10); the three FA
topics preserved by display name with counts and timestamps as a read-only "v1 history" panel;
**zero** concept states created; the attempt log starts empty. The v3 localStorage keys are read
but never modified, so rollback is exact and Jeremy's original data is untouched.

## Assumptions logged during WP1

1. **Repository name.** The brief names the deployed app `kimutaijeremy/paper-trail` at
   `kimutaijeremy.github.io/paper-trail`. No such repo exists. The live PWA is actually
   **`Kimutaijeremy/ACCA-game`**, served from `main` at
   `https://kimutaijeremy.github.io/ACCA-game/`. Per the brief's own rule ("Never a fresh repo
   that orphans the deployed one"), we cloned `ACCA-game` into `dev/paper-trail` and work on
   branch `rebuild/wp1-foundation`. **Cutover (WP5) must use the ACCA-game origin, not a new
   paper-trail repo.** Needs Jeremy's confirmation.
2. **v1 history timestamps** are paired positionally (stat entry *i* ↔ *i*-th FA node) because
   the v3 file links display names to internal keys only by order. Counts are exact; timestamps
   best-effort.
3. **Strict ladder** (lesson required before Understood), as above.
4. **Fixture size**: the brief says 1,975 bytes; the real file is 2,146 bytes. Content matches
   exactly (34 attempts / 30 correct; streak 3/10) — the difference is export formatting only.
