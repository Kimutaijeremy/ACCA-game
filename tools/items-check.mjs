// items-check.mjs — the "is this concept DONE?" report (standing order §1, amended 2026-07-30).
//
// A concept is done only with BOTH a lesson and a question set meeting the per-concept floor.
// This prints, per authored concept, its rung counts, whether a parameterized generator is
// present where required, and the overall complete/incomplete verdict. Run: npm run items:check

import { LESSONS_BY_PAPER } from '../src/content/lessons/index.js';
import { hasLesson } from '../src/content/lessons/index.js';
import {
  ALL_ITEMS, itemsForConcept, conceptQuestionReport, conceptComplete,
} from '../src/content/items/index.js';
import { instantiate } from '../src/engine/items.js';

const PAPERS = ['BT', 'MA', 'FA'];
let anyIncomplete = false;

console.log('CONCEPT COMPLETENESS — lesson + question set (per-concept floor cc3/g3/s3/st1)\n');

for (const paper of PAPERS) {
  const lessons = LESSONS_BY_PAPER[paper] ?? [];
  console.log(`── ${paper} — ${lessons.length} authored concepts`);
  for (const L of lessons) {
    const r = conceptQuestionReport(L.conceptId);
    const done = conceptComplete(L.conceptId);
    if (!done) anyIncomplete = true;
    const counts = r.capped
      ? `capped ${r.practiceTotal}/${r.cap}`
      : `cc:${r.byRung['concept-check']} g:${r.byRung.guided} s:${r.byRung.standard} st:${r.byRung.stretch}`
        + `${r.needsParameterized ? ` param:${r.hasParameterized ? '✓' : '✗'}` : ''}`;
    const mark = done ? 'DONE ' : 'INCMP';
    const miss = r.missing.length ? `  ← ${r.missing.join(', ')}` : '';
    console.log(`   ${mark} ${L.conceptId.padEnd(7)} lesson:${hasLesson(L.conceptId) ? '✓' : '✗'} ${counts}${miss}`);
  }
  console.log('');
}

// Exercise every parameterized generator across several seeds and confirm a valid instance.
let generators = 0;
for (const it of ALL_ITEMS) {
  if (typeof it.generate === 'function') {
    generators += 1;
    for (const seed of [1, 2, 3, 42, 1000]) {
      const inst = instantiate(it, seed);
      if (!inst.options.some((o) => o.id === inst.answerId)) {
        throw new Error(`${it.id}: seed ${seed} produced no valid answer option`);
      }
    }
  }
}

const doneCount = [...new Set(ALL_ITEMS.flatMap((i) => i.conceptIds))]
  .filter((c) => conceptComplete(c)).length;

console.log(`Total items: ${ALL_ITEMS.length} · parameterized generators: ${generators} (each exercised on 5 seeds, all valid)`);
console.log(`Concepts DONE (lesson + question set): ${doneCount}`);
console.log(anyIncomplete ? '\nRESULT: some concepts INCOMPLETE (see ← above).' : '\nRESULT: all authored concepts DONE.');
process.exit(anyIncomplete ? 1 : 0);
