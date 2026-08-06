// review-short.mjs — emit ONLY the 15 nutshells and the 15 sealed items, verbatim, grouped by
// concept id. Nothing else. Writes out/review-short.md. Run: npm run review:short

import { mkdirSync, writeFileSync } from 'node:fs';
import { LESSONS_BY_PAPER, lessonForConcept } from '../src/content/lessons/index.js';
import { itemsForConcept } from '../src/content/items/index.js';

const ORDER = ['BT', 'FA', 'MA'];
const ids = ORDER.flatMap((p) => (LESSONS_BY_PAPER[p] ?? []).map((L) => L.conceptId).sort());

const out = [];
const w = (s = '') => out.push(s);

w('# Nutshells and sealed items — 15 authored concepts');
w('');

for (const cid of ids) {
  const L = lessonForConcept(cid);
  const sealed = itemsForConcept(cid).filter((i) => i.rung === 'sealed');
  w(`## ${cid}`);
  w('');
  w('**Nutshell:** ' + (L?.nutshell ?? '(none)'));
  w('');
  for (const it of sealed) {
    w(`**Sealed item (\`${it.id}\`):**`);
    w('- Stem: ' + it.stem);
    for (const o of it.options) {
      const correct = o.id === it.answerId;
      const cause = (it.distractors ?? {})[o.id];
      const tag = correct ? ' ✅ correct' : (cause ? ` → cause: ${cause}` : ' → distractor (untyped)');
      w(`  - ${o.id}. ${o.text}${tag}`);
    }
    w('- Correct answer: ' + it.answerId);
    if (it.rationale) w('- Rationale: ' + it.rationale);
  }
  w('');
}

mkdirSync('out', { recursive: true });
writeFileSync('out/review-short.md', out.join('\n'));
process.stdout.write(`Wrote out/review-short.md — ${ids.length} concepts\n`);
