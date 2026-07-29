# Storage sizing — measurement and pending decision

Measured in real headless Chrome against real `localStorage` (`npm run measure:storage`).

## Numbers

| Attempt log | Serialised size | localStorage write |
|---|---|---|
| 10,000 | 2.59 MB | OK (~71 ms, 4× CPU throttle) |
| 15,000 | 3.91 MB | OK (largest that fit) |
| 20,000 | 5.23 MB | **FAILS — QuotaExceeded** |
| 25,000 | 6.55 MB | FAILS |
| 50,000 | 13.14 MB | FAILS |

- ~**276 bytes per attempt** (a full attempt record: ids, rung, timing, scaffold, distractor,
  cause, confidence, session, timestamp).
- Chrome's `localStorage` ceiling for this origin sits between **15k and 20k attempts (~5 MB)**.
- A sole-resource student at even ~20 attempts/day reaches that in **~2 years** — and the system
  is designed for retention *forever* across the whole qualification. **localStorage is not enough.**

## Consequence if left unchanged

The attempt log is the single source of truth and only grows (neglect decay means old records
still matter). Once it crosses ~5 MB, every save fails — and because saves now report failure
loudly, the learner would be blocked from persisting new work, not silently corrupted, but stuck.

## Decision — IMPLEMENTED (Jeremy approved 2026-07-29)

The **attempt log** now lives in **IndexedDB** (hundreds of MB–GB budgets, appended one record at
a time rather than rewriting a growing blob). The small **meta** (schema, createdAt, streak,
v1 history) stays in localStorage, cheap to rewrite. Pruning/capping the log was rejected: it would
break the auditability guarantee (every number recomputable from the full log) and the retention
goal.

As built (`store.js`):
- `LearnerStore` ties the two halves together: meta via a KV (localStorage), log via a pluggable
  async adapter — `IdbLogAdapter` in the browser, `MemoryLogAdapter` for Node/tests.
- Derived state is still recomputed from the (now IndexedDB-backed) log; no mastery is stored.
- `exportAll()` / `importAll()` produce/consume one JSON blob (meta + log), unchanged for the user.
- Meta writes report quota failure loudly (`trySaveMeta`) as a backstop.
- Verified in real headless Chrome (`npm run verify:browser`): migration, attempts landing in
  IndexedDB, both halves surviving a reload, export/import round-trip, and the namespace.
