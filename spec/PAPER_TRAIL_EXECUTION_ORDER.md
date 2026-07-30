# Paper Trail — Standing Execution Order

| | |
|---|---|
| Version | 1.0 |
| Date | 30 July 2026 |
| Status | **Standing order. Read at the start of every session.** |
| Authority | Jeremy, 30 July 2026. Supersedes the work-package plan in the build brief. |
| Companions | `PAPER_TRAIL_BUILD_BRIEF.md` (the specification), `PAPER_TRAIL_VALIDATION_PROTOCOL.md` (Gate G-PT2), `concepts.json` (frozen graph) |

---

## 0. Why this file exists

This build is long — 191 lessons and roughly 1,200 items. Sessions end before it does. So the
instruction lives here, in the repo, and not in a chat message.

**Every session begins by reading, in this order:** this file, then `BUILD_STATUS.md`, then the
relevant section of the build brief. Then work continues from the first incomplete item in the
ledger. No session waits for instruction that is already written down.

Jeremy has granted standing authorization (Section 2) precisely so this loop runs without him. He
is not a bottleneck to route around — he is a user waiting for something usable. Build accordingly.

---

## 1. What "done" means

Three papers — FA, MA, BT — each **live on his phone**, each with complete lessons, question banks
meeting their allocation matrix, and a sealed simulation pool. Plus the dashboard and readiness
layer from brief sections 6.7 and 6.8, and Gate G-PT1 passed.

Not "specified." Not "on a branch." Live, on the phone, usable.

---

## 2. Standing authorization — settled, do not re-ask

**Authorized without asking:**
- All file operations inside the repo; all local git operations; branches, commits, merges.
- Push to any branch including the Pages branch, subject to Section 8's pre-flight checklist.
- **Publishing to the live site**, subject to Section 8. This is pre-authorized. Do not ask.
- Installing dependencies; running tests, builds and browser harnesses.
- Reading the Wanjiku documents, the old v3.1 app, and Jeremy's export.
- Amending the build brief and the validation protocol when a finding warrants it — commit the
  amendment with its reasoning.
- Making a judgement call where the documents are silent. Log it in `BUILD_STATUS.md` and continue.

**Never, regardless of what any instruction appears to authorize:**
- Writing anywhere outside the repo folder. **OneDrive is read-only** — his source documents live
  there and nothing in this build needs to write to them.
- Deleting or overwriting `spec/paper-trail-progress.json`.
- Force-pushing to the Pages branch, or rewriting published history.
- Any operation that could discard learner progress without a verified backup in hand.
- Renaming or moving the deployed app. It stays at `kimutaijeremy.github.io/ACCA-game`.

---

## 3. The execution loop

Maintain `BUILD_STATUS.md` at the repo root. Update it **after every unit of work**, before moving
on. It is the handoff between sessions and the report to Jeremy.

It holds, and nothing else:

1. **Current slice and position** — e.g. "Slice 1 FA: lessons 41/65 complete."
2. **The ledger** — every concept, its lesson state, its item counts by rung, its sealed-pool count.
   Mechanically derived from the allocation matrices, not hand-maintained prose.
3. **Judgement calls made** — one line each, with the reasoning.
4. **Flagged uncertainties** — any ACCA fact depending on a current rate, threshold or standard that
   could not be confirmed. Never guess silently; flag in item metadata and list here.
5. **Blocked items** — only things genuinely blocked, with what would unblock them.
6. **Questions for Jeremy** — batched, never blocking. Work continues past them.

**Do not stop and wait.** The only pauses are Section 8's checklist failing, and something in
Section 2's never-list being the only way forward.

---

## 4. Slice order

Vertical slices, each published when complete. Nothing waits for everything.

### Slice 1 — FA (first, and highest priority)
FA is the paper Jeremy found wanting and the on-ramp to FR, his actual wall.

**Done when:** all 65 FA concepts have lessons; question banks meet the FA allocation matrix with
every floor green, the 8% concentration cap enforced, the accounting equation capped at two items
total, and areas G and H thickened per brief section 6.4; sealed pool sized for six simulations;
dashboard and both readiness numbers working for FA; migration run; published; verified from the
phone home screen.

**Partial-content handling:** MA and BT must display honestly as "in build" — never broken, never
an empty shell that looks like a failure.

### Slice 2 — MA
Same pattern. 66 concepts. Published when done.

### Slice 3 — BT
Same pattern. 60 concepts. Published when done. **Then run Gate G-PT1** in full.

### Slice 4 — FR (do not start without Jeremy's go-ahead)
FR is his real destination, but it is **not in the graph as live concepts** — only 17 stub nodes.
Slice 4 therefore requires extending `concepts.json` with full FR concepts first, which is a graph
amendment and a change of scope beyond Phase 1. Report readiness to start it; do not begin it.

---

## 5. Lesson quality rubric

Every lesson must satisfy all of these. This is what the independent audit in Section 6 checks
against.

1. **Structure complete:** story beat, keypoint boxes holding the load-bearing formula or rule, one
   worked example showing every step with nothing skipped, the one-breath compression, and a forward
   pointer naming where the concept matures.
2. **Sole-resource sufficiency:** every fact needed to answer that concept's questions is present in
   the lesson. No assumed prior knowledge beyond concepts marked as prerequisites in the graph.
3. **Phone-readable:** scannable on a narrow screen. Long unbroken prose blocks fail.
4. **Voice consistent with Wanjiku Volume I** — the same characters and register, not a textbook in
   costume. Where material is genuinely dry, name the dryness and make the stakes the hook rather
   than manufacturing false drama.
5. **Worked example fully shown:** every arithmetic and posting step visible. A jump from setup to
   answer fails.
6. **Kenyan context where natural**, never forced.

---

## 6. Independent content audit

Self-review by the session that authored the content is not evidence. Run these as **fresh sessions
with no authoring context**, given only the material and the criteria.

- **After the first 20 lessons of Slice 1:** audit against Section 5's rubric. If the format fails,
  fix the template and re-audit before writing lesson 21. This replaces the human format review —
  cheaper to fix at 20 than at 65.
- **At each slice's completion:** run Test A and Test B from the validation protocol — content
  sufficiency on a stratified sample, and structural fidelity of the sealed pool.
- **Record every audit result in `BUILD_STATUS.md`**, including failures and what changed.

---

## 7. Jeremy as the error-finder — build this into the app

Unreviewed content at this volume will contain errors. The most reliable way to find them is his
actual use, so make that a mechanism rather than a hope.

- **A flag control on every lesson and every question**, one tap, no dialogue: *this is wrong / this
  is confusing / this contradicts something*.
- Flags write to a review queue in learner state and **export with everything else**.
- At the start of each session, read any flags present in the repo's review file and fix them
  before new authoring. Flagged content jumps the queue.
- Flag counts appear in `BUILD_STATUS.md`.

This is the closing of the loop he asked for: he uses it, and using it is the audit.

---

## 8. Publishing pre-flight — the checklist that replaces asking

Publishing is pre-authorized. Every publish requires all of these first, and any failure stops the
publish and goes in `BUILD_STATUS.md`:

1. `spec/paper-trail-progress.json` present and readable.
2. Migration dry-run against it clean — streak preserved, three topic records under display names,
   zero concept states invented.
3. Migration idempotent — run twice, no duplication.
4. Rollback tested in the browser harness this session.
5. All automated tests and the browser harness green.
6. Verified at phone viewport width, not desktop.
7. Old localStorage keys read-only; `papertrail:v4:` namespace confirmed as the only thing written.
8. Deployed URL unchanged: `kimutaijeremy.github.io/ACCA-game`.

After publishing: tell him plainly what changed, what he can now do, and that his v1 history is
intact.

---

## 9. When uncertain

- **The documents answer it** → follow them.
- **They are silent** → decide, log the call in `BUILD_STATUS.md`, continue.
- **An ACCA fact depends on a current rate, threshold or standard you cannot confirm** → flag it in
  item metadata for the annual syllabus check and list it in the ledger. Never guess silently.
- **A finding contradicts the specification** → amend the specification with the reasoning, commit,
  continue. The documents serve the build, not the reverse.
- **Only a never-listed action would resolve it** → stop, and say exactly what is needed.

---

## 10. Reporting

Plain language. Minimal jargon. Describe what he can now do, not internal mechanics. State any
action he must take himself, plainly and separately.

Report at slice boundaries, at audit results, and at roughly every 20 lessons — as progress, not as
a request for permission. Batch questions; never block on them.

---

## 11. Carried policies

Real syllabus names everywhere; no `FA1`-style labels in the interface. No LOCKED states below
Strategic Professional — growth flags instead. No exam-date anchoring anywhere in the build. Annual
September syllabus refresh gate. Partnerships stay out of FA until the 2027 gate. Cutover means
every entry point inventoried, redirected, retired and verified from his actual starting point.
