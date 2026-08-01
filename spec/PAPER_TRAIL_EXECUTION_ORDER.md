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

Three papers — FA, MA, BT — each **live on his phone**, each with a full set of **topic pages**
(one per syllabus sub-area), **many mixed exam-format question sets of ten**, and a sealed
simulation pool. Every topic complete under the 8-of-last-10 rule (§4A), so every paper complete and the
next unlocked. Plus the dashboard and readiness layer, and Gate G-PT1 passed.

Not "specified." Not "on a branch." Live, on the phone, usable.

### 1A. The design — reminder-and-drill, not teach-from-scratch  *(Amendment A6, 31 July 2026)*

Jeremy has studied BT, MA and FA. He needs **reminding and drilling, not teaching from zero.** For
these three papers the teaching layer collapses and questions become the main event. *(Amendment A6
supersedes A5's per-concept lesson unit for BT/MA/FA; the concept graph, item model, diagnosis,
mastery states, review and decay all keep running underneath — see §1B. FR and AA keep full teaching
lessons; see §1C.)*

**Topic pages replace per-concept lessons (BT, MA, FA).** One page per syllabus **sub-area**
(~38 BT, ~25 MA, ~34 FA), each holding, and no more:
- **the topic in a nutshell** — about one page, no story;
- **what it takes to answer an exam question on it** — the traps, the format, what examiners look for;
- **ONE worked example**, every step shown, nothing skipped.
Keep the Wanjiku voice light. Drop the length. The topic page is deliberately thinner than the old
lesson — the audit (§6) is amended to test exactly that.

**Questions are the main event.** Mixed **sets of ten**, drawn across the *whole paper*, never
blocked by topic. Many sets. Each set is scored **out of 10**, with a **rolling average per paper**
shown, and the "where you slip" diagnosis (brief §6.5) kept. Parameterized generators wherever a
question is calculational (numbers regenerate per attempt — anti-memorisation).

**Sets are drawn to a per-area target, not round-robin** *(2026-07-31; weightings confirmed
2026-08-01; brief §6.4)*. ACCA publishes **no** per-area OT weighting for FBT/BT, FMA/MA (or FFA/FA)
— confirmed against the 2025-26 study guides ("assess all parts of the syllabus"). So each paper has
a **constructed breadth-based target** in `src/engine/sets.js`, refined by the fixed Section B areas
(FA A2/B2/C4/D10/E7/F6/G2/H2; BT A11/B8/C9/D9/E4/F5; MA A4/B4/C9/D7/E6/F5). Within each area, bias
toward topics short of their ten completion questions, so thin areas still reach completion. After a
set, report how close each topic is and — once the paper's bank is representative — whether the set
was exam-shaped.

### 1B. What is kept, running underneath  *(Amendment A6)*

Throw nothing away. The **concept graph stays the tagging spine**: every question still tags to one
or more concepts. Coverage/allocation matrices, the seven-cause **diagnosis engine**, the five
**mastery states**, **review scheduling** and **decay** all keep running on the concept tags — they
power reviews and diagnosis. The change is only the *teaching layer* and the *visible completion
gate*; the engine beneath is untouched.

### 1C. FR and AA keep full teaching lessons  *(Amendment A6)*

This teaching-layer collapse is **BT/MA/FA only**. FR and AA — when their tracks begin — keep the
full teaching lessons of the old rubric (§5, retained below as the "full-lesson rubric"). A
one-page summary cannot teach consolidation from zero, which is exactly the destination.

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
- Adding a runtime paid API or public billable endpoint to Phase 1. "Go deeper" is pre-generated,
  shipped content (§7A) — free, offline, no keys. (A live API is revisited only for FR written-answer
  marking, when FR is built — never silently.) Should that ever change, no secret goes in the app
  bundle, in git, or anywhere the phone can read it.

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

## 4. Build tracks and publishing cadence  (Amendment A2, 30 July 2026)

**Amendment A2 supersedes the FA-first ordering.** BT, MA and FA are authored **equally, in
parallel, as three independent tracks with no priority between them.** Nothing waits for anything.
Publish **continuously — roughly every 15–20 lessons across all three papers combined** — subject
to Section 8's pre-flight checklist each time.

A paper track is **done** when: every one of its concepts (per `concepts.json` — FA 65, MA 66,
BT 60) is covered by a **topic page** meeting Section 5; its question banks meet the paper's
allocation matrix with every floor green, the 8% concentration cap enforced, and (FA) the
accounting-equation cap of two items and thickened areas G and H per brief §6.4; **every topic is
complete under the 8-of-last-10 rule** (§4A); its sealed pool is sized for six simulations; the dashboard
and both readiness numbers work for it; and it is published and verified from the phone home screen.
When all three are done, **run Gate G-PT1** in full.

**Partial-content handling:** every paper, at every moment, displays honestly — built concepts
against total (Section 4A), never broken, never an empty shell that looks like a failure.

### Track 4 — FR (do not start without Jeremy's go-ahead)
FR is his real destination, but it is **not in the graph as live concepts** — only 17 stub nodes.
Slice 4 therefore requires extending `concepts.json` with full FR concepts first, which is a graph
amendment and a change of scope beyond Phase 1. Report readiness to start it; do not begin it.

---

## 4A. Unlocking, lineage and visibility  (Amendment A2, 30 July 2026; completion rule replaced by A6)

**Lineage-gated unlocking replaces "open everything."**

**The visible completion gate is the 8-of-last-10 rule** *(Amendment A6, 31 July 2026; refined
2026-07-31 — supersedes the concept-Competent completion rule below for BT/MA/FA)*:

- A **topic is COMPLETE** when **8 of the learner's last 10 questions tagged to that topic are
  correct, spanning at least two different sessions.** It is measured on the **topic's own
  questions** — items tagged to a concept in that sub-area — read from the **attempt log**, NOT on
  whole-set scores. (A set of ten spread across ~34 topics gives each topic only one or two items, so
  a set score cannot be the gate: it could complete a topic whose single question was wrong.)
  - **Latches:** once first achieved it stays complete; the underlying concept mastery and its decay
    (§1B) drive future reviews. Auditable as a fold of the topic's attempts: complete iff at some
    point the last-10 window held ≥ 8 correct across ≥ 2 sessions.
  - **Staleness, not expiry** *(2026-07-31)*: a completed topic never loses its unlock, but if its
    concepts have decayed (a review is due underneath) it is shown as **"complete · needs revision"**
    rather than a clean tick — the pass stands, the label warns.
  - **Two-session requirement:** 8/8 in a single sitting is not complete — a second session is
    required, so completion reflects retention, not one lucky run.
  - **Show progress toward it**, e.g. *"Depreciation — 6 of last 8 correct, needs 2 more questions."*
  - Measured against the paper's FULL sub-area list, never against how many topics are authored so
    far. **Partial content must never produce an unlock.**
- The **set score out of 10** stays as **session feedback** (and the rolling per-paper average); it
  is explicitly **not** the completion gate.
- A **paper is COMPLETE** when **every one of its topics is complete.** That is what unlocks the
  paper's descendants (the lineage table below).
- **Concept mastery states and decay keep running underneath** (§1B) — they drive reviews and
  diagnosis — but they are **not** the visible gate.
- **Exam readiness is separate and unlocks nothing.**
- A locked paper always **states why**: "opens when you complete FA" — never a bare LOCKED.
- *(FR/AA, when built, complete on the full-lesson design of §1C — their gate returns to concept
  mastery, since they teach from scratch. Rewire only BT/MA/FA to this rule.)*

**Paper lineage** — an explicit config table, kept in one file (`src/content/lineage.js`) so it
extends without touching engine code, and validated against `concepts.json`'s `grows_into` edges
where those exist. It is **not** derived from edges alone: AA, LW and TX have no nodes in the
graph, so edge-derivation cannot express their position.

| Paper | Opens |
|---|---|
| FA | FR |
| MA | PM, FM |
| FR | AA — AA audits the statements FR teaches; BT contributes ethics, governance and internal control but is not the gate |
| BT | nothing at Skills level |
| LW, TX | open from the start, no parent |

**Content-status, kept distinct from lock state:**
- **Open + built** — has topic pages and question sets; playable.
- **Open + "content not built yet"** — LW and TX now; FR, PM, FM, AA until their tracks are built.
  Visibly distinct from a locked paper and from a broken one.
- **Locked** — gated by lineage, showing its unlock reason.

**Build progress is visible.** Every paper shows **topics complete against its total** — e.g.
"FA — 9 of 34 topics complete" — plus how many topic pages are authored so far, so the app is
visibly growing, never ambiguous between finished and broken.

**What's new.** Because publishing is continuous, the app shows what has been added since Jeremy's
last visit — new lessons and question sets, by paper.

---

## 5. Quality rubric

### 5A. Topic-page rubric — BT, MA, FA  *(Amendment A6, 31 July 2026)*

Every **topic page** (one per sub-area) must satisfy all of these. This is what the audit in
Section 6 checks against for BT/MA/FA.

1. **Structure complete, and only this:** (a) the topic **in a nutshell** — about one page, no story
   beat; (b) **exam readiness** — the traps, the required format, and what examiners look for on this
   topic; (c) **ONE worked example** showing every arithmetic and posting step, nothing skipped.
2. **Reminder, not first-teaching:** pitched to refresh someone who has studied the paper, not to
   teach it from zero. Concise. (First-teaching depth is FR/AA only — §5B.)
3. **Phone-readable:** scannable on a narrow screen. Long unbroken prose blocks fail.
4. **Voice: Wanjiku, kept light.** The register of Volume I, but brief — a knowing reminder, not a
   story. Kenyan context only where it genuinely sharpens a point.
5. **Worked example fully shown:** every step visible. A jump from setup to answer fails.
6. **No list presented as complete is actually incomplete.** Every examinable member of any
   enumerated set must be present (e.g. all seven books of prime entry). A content failure, not a
   stylistic one. *(Rubric A4.)*
7. **Sole-resource-plus-Go-deeper:** the topic page carries what its questions need; where it
   deliberately cannot (it is thin by design), the **Go deeper** layer (§7A) must close the gap from
   the authored material. The audit reports both numbers separately (§6).

### 5B. Full-lesson rubric — FR, AA only (retained)  *(the pre-A6 rubric)*

FR and AA teach from scratch (§1C) and keep the full-lesson rubric: story beat; keypoint boxes with
the load-bearing formula/rule; one worked example, every step shown; the one-breath compression; a
forward pointer; sole-resource sufficiency; phone-readable; consistent Wanjiku voice; Kenyan context
where natural; no incomplete-complete list; distinct opening across lessons.

---

## 6. Independent content audit

Self-review by the session that authored the content is not evidence. Run these as **fresh sessions
with no authoring context**, given only the material and the criteria.

- **After the first 20 topic pages (across the parallel tracks):** audit against Section 5A's
  topic-page rubric, in a fresh session with no authoring context. **The audit assesses the pages AS
  RENDERED IN THE APP ON A PHONE VIEWPORT — not as a markdown preview file.** Phone-readability
  (5A.3) cannot be judged from raw markup; the reviewer must see what Jeremy sees. If the format
  fails, fix the template, re-render the existing pages, and re-audit before writing more.
  *(Amendment A3.)* **The audit must also check rubric 5A.6 (no incomplete list stated as complete).**
  - **The sole-resource test — now two numbers, because topic pages are thin by design *(Amendment
    A6, 31 July 2026 — supersedes A5)*.** Topic pages are deliberately thinner than the old lessons,
    so Test A splits in two and **both numbers are reported separately in `BUILD_STATUS.md`:**
    1. **Answerable from the topic page alone.** The fresh reviewer is given, per topic, ONLY its
       topic page and the items tagged to its concepts (one rendered instance of every parameterized
       generator, seed recorded), and answers each item using nothing but that page. Record, per
       item: answerable from the page alone — yes/no; if no, the exact outside fact it needs; and
       whether the keyed answer and distractor→cause tags are correct.
    2. **Gap closed by the Go deeper layer.** For each item NOT answerable from the page alone, check
       whether the topic's **Go deeper** layer (§7A) — pre-generated, shipped content — supplies the
       missing fact. Report the fraction of gaps it closes.
    - There is **no single 95% pass line** now: a lower page-alone number is acceptable *by design*,
      provided the Go deeper layer closes the remainder. A topic where neither the page nor Go deeper
      makes its questions answerable is a **rewrite candidate** — surface it in `BUILD_STATUS.md`.
- **At each slice's completion:** run Test A and Test B from the validation protocol — content
  sufficiency on a stratified sample, and structural fidelity of the sealed pool.
- **Record every audit result in `BUILD_STATUS.md`**, including failures and what changed.

---

## 7. Jeremy as the error-finder — build this into the app

Unreviewed content at this volume will contain errors. The most reliable way to find them is his
actual use, so make that a mechanism rather than a hope.

- **A flag control on every topic page and every question**, one tap, no dialogue: *this is wrong /
  this is confusing / this contradicts something*.
- Flags write to a review queue in learner state and **export with everything else**.
- At the start of each session, read any flags present in the repo's review file and fix them
  before new authoring. Flagged content jumps the queue.
- Flag counts appear in `BUILD_STATUS.md`.

This is the closing of the loop he asked for: he uses it, and using it is the audit.

---

## 7A. "Go deeper" — pre-generated depth, shipped in the repo  *(Amendment A6; approach changed 2026-07-31)*

Because topic pages are thin, the learner needs a way to go deeper on the spot. **No live API, no
serverless function, no Vercel, no runtime cost, no public billable endpoint** *(supersedes the
earlier Claude-API-via-Vercel design; the serverless function, KV store, passphrase and daily caps
are cancelled).*

- **Pre-generated content.** Every topic page ships a **"Go deeper" layer** underneath it — a fuller
  explanation, for when the learner has blanked on the topic entirely — **authored at build time and
  stored in the repo like everything else.** Free at runtime, works offline, never rate-limited.
- **Placement:** a "Go deeper" control on **every topic page**, and after any failed question set.
- **Structured for linking.** The deeper layer is a set of sections; where a question set exposes a
  specific error, the **repair route links to the relevant part of that topic's deeper layer** (an
  in-app link into the shipped content) — it never calls anything live.
- **Log every open** (topic, timestamp) in learner state, exporting with everything else. **If the
  learner opens "Go deeper" on one topic repeatedly, that topic page is too thin** — surface such
  topics in `BUILD_STATUS.md` as **rewrite candidates**. (This is the signal the live version would
  have given, kept for free.)
- **The only place a live API is revisited is marking written answers at FR** (Skills level), which
  genuinely cannot be pre-generated. Out of scope now; decided when FR is built.

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

Real syllabus names everywhere; no `FA1`-style labels in the interface. Unlocking is
**lineage-gated** per Section 4A (Amendment A2 supersedes the earlier "open everything below
Strategic Professional"): locked papers show their unlock reason, never a bare LOCKED. No
exam-date anchoring anywhere in the build. Annual
September syllabus refresh gate. Partnerships stay out of FA until the 2027 gate. Cutover means
every entry point inventoried, redirected, retired and verified from his actual starting point.
