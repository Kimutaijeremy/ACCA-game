// authoring.js — the AUTHORING_CONTRACT.md acceptance instrument (engine side).
//
// AUTHORING_CONTRACT.md defines "one concept authored" as four artifacts (lesson, one-line nutshell,
// rung-floor practice set, exactly one sealed item), plus a breadth-before-depth rule and the
// invariant that no sealed item is ever served in practice. This module makes each of those
// mechanically checkable so `npm run items:check` can be the acceptance gate, not a hand review.
//
// It authors nothing. It reads authored objects and reports whether they meet the contract.

import { RUNGS } from './states.js';
import { PER_CONCEPT_FLOORS, PRACTICE_RUNGS, ITEM_CAPS, questionSetReport } from './items.js';

// The floor set is cc3/g3/s3/st1 = 10 items; "expanded" means more than this (or, for a capped
// concept, more than its cap). Breadth-before-depth forbids expansion until a paper is fully authored.
export const FLOOR_TOTAL = Object.values(PER_CONCEPT_FLOORS).reduce((a, b) => a + b, 0);

// ── Nutshell: exactly one formula OR one statement, nothing longer ───────────
export const NUTSHELL_MAX_CHARS = 200;

/**
 * Validate a per-concept nutshell against the contract: present, single line, within the length
 * ceiling, and exactly one formula OR one statement (not two sentences, not a list).
 * @param {*} s
 * @returns {{ ok: boolean, reason?: string }}
 */
export function validateNutshell(s) {
  if (typeof s !== 'string') return { ok: false, reason: 'absent' };
  const t = s.trim();
  if (!t) return { ok: false, reason: 'empty' };
  if (t.length > NUTSHELL_MAX_CHARS) return { ok: false, reason: `too-long(${t.length}>${NUTSHELL_MAX_CHARS})` };
  if (/[\r\n]/.test(t)) return { ok: false, reason: 'multi-line' };

  // A formula is a single expression (has a relational or arithmetic operator) — one unit, allowed.
  const isFormula = /[=<>≤≥]|÷|×|(?:\s[+\-*/]\s)/.test(t);
  if (!isFormula) {
    // Otherwise it must be a single statement: at most one sentence terminator that actually ends a
    // sentence (followed by whitespace+capital/open-paren or end-of-string), and no list markers.
    const terminators = (t.match(/[.?!](?=\s+[A-Z(]|$)/g) || []).length;
    if (terminators > 1) return { ok: false, reason: 'more-than-one-statement' };
    if (/[;•]|(?:^|\s)[-*]\s/.test(t)) return { ok: false, reason: 'list-not-single-statement' };
  }
  return { ok: true };
}

// ── Sealed pool: the practice/sealed split, and the "never served" invariant ─
export function isSealed(item) {
  return item?.rung === RUNGS.SEALED;
}

/** The only items any practice path may draw from — everything except the sealed holdout. */
export function practicePool(items) {
  return items.filter((it) => !isSealed(it));
}

/** The sealed holdout — readiness measurement only, never served in practice. */
export function sealedPool(items) {
  return items.filter(isSealed);
}

/**
 * Given the items a serving path actually produced, return any sealed ones that leaked. The contract
 * (and G-PT1 #4) requires this to be empty for every practice path: Section A/B, drills, review
 * probes, freshness. Every such path MUST draw from practicePool(); this catches a path that didn't.
 */
export function sealedLeaks(servedItems) {
  return servedItems.filter(isSealed);
}

// ── Per-concept audit against the full contract ─────────────────────────────

/**
 * Audit one concept against AUTHORING_CONTRACT.md.
 * @param {object} a
 * @param {string} a.conceptId
 * @param {object|null} a.lesson - the lesson object (its `.nutshell` holds the one-line nutshell)
 * @param {object[]} a.items - all items tagged to this concept (any rung, incl. sealed)
 * @param {string} [a.lessonShape] - the lesson shape (decides the parameterized requirement)
 * @param {boolean} a.paperFullyAuthored - is every live concept in this paper authored to the floor?
 * @returns {object} the audit row (missing[] empty ⇒ accepted)
 */
export function auditConcept({ conceptId, lesson, items, lessonShape, paperFullyAuthored }) {
  const hasLesson = !!lesson;
  const nutshell = validateNutshell(lesson?.nutshell);
  const report = questionSetReport(conceptId, practicePool(items), { shape: lessonShape });
  const sealedCount = sealedPool(items).length;

  const floorTotal = report.capped ? report.cap : FLOOR_TOTAL;
  const overFloorBy = Math.max(0, report.practiceTotal != null
    ? report.practiceTotal - floorTotal
    : PRACTICE_RUNGS.reduce((n, r) => n + (report.byRung[r] ?? 0), 0) - floorTotal);
  const breadthViolation = overFloorBy > 0 && !paperFullyAuthored;

  const missing = [];
  if (!hasLesson) missing.push('lesson');
  if (!nutshell.ok) missing.push(`nutshell:${nutshell.reason}`);
  for (const m of report.missing) missing.push(m); // rung-floor / cap / parameterized shortfalls
  if (sealedCount < 1) missing.push(`sealed:${sealedCount}/1`);
  if (sealedCount > 1) missing.push(`sealed:${sealedCount}/1(too-many)`);
  if (breadthViolation) missing.push(`depth-before-breadth(+${overFloorBy})`);

  return {
    conceptId,
    hasLesson,
    nutshell,
    byRung: report.byRung,
    capped: !!report.capped,
    practiceTotal: report.practiceTotal ?? PRACTICE_RUNGS.reduce((n, r) => n + (report.byRung[r] ?? 0), 0),
    param: { needed: !!report.needsParameterized, present: !!report.hasParameterized },
    sealedCount,
    overFloorBy,
    breadthViolation,
    missing,
    accepted: missing.length === 0,
  };
}

/** Is a concept authored to the A5 FLOOR (lesson + rung floor)? Used to compute per-paper breadth. */
export function meetsFloor({ lesson, items, lessonShape, conceptId }) {
  if (!lesson) return false;
  return questionSetReport(conceptId, practicePool(items), { shape: lessonShape }).complete;
}
