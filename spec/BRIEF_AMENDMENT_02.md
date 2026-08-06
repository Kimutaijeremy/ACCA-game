# Brief Amendment 02 — Cross-paper retention queue

**Amends:** `PAPER_TRAIL_BUILD_BRIEF.md` (primarily §6.2 decay/review, §6.7 readiness, §6.8 dashboard),
and sits beside `BRIEF_AMENDMENT_01.md` (exam-shaped practice) and `AUTHORING_CONTRACT.md` (the sealed
item).
**Date:** 2026-08-06.
**Status:** RECORDED, NOT IMPLEMENTED. Nothing here is built. It is scheduled under the reordered work
plan, and clause M additionally depends on Amendment 01 clause H (freshness), which is itself not yet
built.

**Why this exists.** The system's purpose extends past *passing exams* to the **lifelong retention of
the whole qualification** — every paper, held together, for years. Amendment 01 is entirely
exam-shaped: it organises practice by paper, by section, by the shape of a sitting. That serves the
run-up to an exam; it does **not** serve retention once a paper is behind you. This amendment adds the
surface that does.

The engine already supports it: mastery **decay** (§6.2) runs per concept as a function of *(log,
date)* — failed reviews and neglect both push a concept down and put it back on the review queue
(`deriveAll` already returns that queue). This amendment defines the surface that consumes it.

---

## J. A daily review surface that ignores paper boundaries

- Take **every concept the decay engine reports as due today**, **across all authored papers**, and
  serve them as **one mixed set**.
- **Not per-paper. Not per-topic.** The queue is the union of everything due, drawn from the whole
  authored graph at once — BT, MA, FA (and every later paper as it is authored) interleaved.
- Due-ness is exactly the §6.2 review/decay signal (`deriveAll` review queue); this surface adds no
  new due-ness rule, it only presents the union.

## K. It is the default landing surface when anything is due

- When **anything is due**, the retention queue is what the app opens to. It is the front door.
- **Exam-shaped practice (Amendment 01 — Papers → Section A/B) is what you *choose* when nothing is
  due.** With an empty queue, the retention surface steps aside and offers exam practice instead.
- So the daily default flips with the queue: due items first, always; exam shaping is the elective
  once retention is clear. (This refines Amendment 01 clause A: the paper/section chooser is reached
  past the retention queue, not before it.)

## L. Set size is bounded by time, not count

- The set is sized by a **time budget, not an item count** — target **~20 minutes** at the **real mark
  budget** (1.2 min/mark at Knowledge level, per §6.3). Items are added until the budget is spent,
  not until a fixed N is reached.
- **Overflow carries to tomorrow**, **oldest-due first**: whatever does not fit today's budget is the
  front of tomorrow's queue, so nothing due is ever silently skipped and the longest-overdue concept
  is never starved behind newer ones.

## M. Freshness, and never the sealed pool

- Items for the retention queue are drawn under **Amendment 01 clause H freshness rules** (no repeat
  within 14 days or 40 intervening items; calculation items regenerate via seeded RNG).
- The queue **never draws from the sealed pool** (§6.6, `AUTHORING_CONTRACT.md` §2). Sealed items are
  the readiness holdout only; the retention surface, like every other practice path, draws from
  `practicePool()`.

## N. It keeps working when a paper is passed

- **Passing a paper does not remove its concepts from decay or from this queue.** A passed paper's
  concepts keep decaying and keep surfacing for review exactly as before — that is the whole point of
  retention.
- Readiness/pass state (§6.7) and retention are **independent**: passing is a milestone, not an exit.
  The dashboard (§6.8) must not treat a passed paper as "done" in a way that hides its due reviews;
  a passed paper with overdue concepts still contributes them to the daily queue.

---

## Relationship to Amendment 01 and open dependencies (not resolved here)

1. **Landing-surface precedence.** Clause K makes the retention queue the default over Amendment 01's
   paper/section chooser whenever anything is due. The reordered work plan must sequence this so the
   two navigation models compose cleanly (retention → then exam practice), not conflict.
2. **Depends on freshness (Amendment 01 H).** Clause M cannot be implemented before clause H exists.
3. **Depends on the decay engine (built) + review queue (`deriveAll`).** The due-ness source already
   exists; this surface consumes it. No new decay rule is introduced.
4. **Dashboard (§6.8).** Clause N requires the dashboard to distinguish "passed" from "nothing due",
   and to keep surfacing a passed paper's overdue concepts.
5. **Time budget vs empty banks.** Until breadth grows, the daily queue will be small; clause L's
   budget simply spends what is due. No special-casing needed, but the ~20-min target is aspirational
   until there is enough authored content to fill it.

**Execution:** hold until Jeremy reviews. Then fold clauses J–N into §6.2/§6.7/§6.8 and schedule under
the reordered work plan, after clause H. Not before.
