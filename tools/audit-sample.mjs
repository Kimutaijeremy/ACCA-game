// audit-sample.mjs — emit everything authored for three FA concepts, verbatim, for external review.
// Reads the real lesson + item objects and prints them in full (no summarising). Parameterized items
// are shown as several seeded instances (that is their authored form). Writes out/audit-sample.md.
// Run: npm run audit:sample

import { mkdirSync, writeFileSync } from 'node:fs';
import { lessonForConcept } from '../src/content/lessons/index.js';
import { itemsForConcept } from '../src/content/items/index.js';
import { sealedPool, validateNutshell } from '../src/engine/authoring.js';
import { makeRng } from '../src/engine/rng.js';

// The three fullest FA sets: FA-04 and FA-11 carry 11 items (the most authored); FA-26 is the fullest
// calculation-shaped concept (a parameterized generator), so an external checker can verify the
// accounting both in the fixed items and across regenerated numbers.
const CONCEPTS = ['FA-04', 'FA-11', 'FA-26'];
const SEEDS = [1, 2, 3];

const out = [];
const w = (s = '') => out.push(s);

w('# Paper Trail — external audit sample (FA)');
w('');
w('Everything authored for three FA concepts, verbatim, for an external accounting check. Nothing is');
w('summarised. Parameterized items have no fixed numbers, so each is shown as several seeded instances');
w('(the exact form a learner sees); the numbers regenerate per attempt from the seed.');
w('');
w('**Concepts:** ' + CONCEPTS.join(', ') + ' — the three fullest FA sets (FA-04 and FA-11 have the most');
w('items; FA-26 is the fullest calculation concept).');
w('');
w('> **Two contract artifacts are absent for all three (and for all 15 authored concepts).** Per');
w('> `AUTHORING_CONTRACT.md`, each concept also requires a **one-line nutshell** and **exactly one');
w('> sealed item**. Neither has been authored yet (Batch 0 audit, 2026-08-06). They are marked');
w('> "NOT AUTHORED" below so the reviewer sees the true state.');
w('');
w('---');
w('');

function renderMcq(v) {
  w('- **Stem:** ' + v.stem);
  w('- **Options:**');
  for (const o of v.options) {
    const correct = o.id === v.answerId;
    const cause = (v.distractors ?? {})[o.id];
    const tag = correct ? ' ✅ **correct answer**' : (cause ? ` — distractor → diagnosed cause: \`${cause}\`` : ' — distractor (untyped: no encoded cause)');
    w(`  - \`${o.id}\`. ${o.text}${tag}`);
  }
  w('- **Correct answer:** `' + v.answerId + '`');
  if (v.rationale) w('- **Rationale:** ' + v.rationale);
}

for (const cid of CONCEPTS) {
  const L = lessonForConcept(cid);
  const items = itemsForConcept(cid).filter((i) => i.rung !== 'sealed');
  const sealed = sealedPool(itemsForConcept(cid));

  w(`## ${cid} — ${L?.title ?? '(no title)'}`);
  w('');
  w(`*Syllabus year:* ${L?.syllabusYear ?? '—'} · *lesson shape:* ${L?.shape ?? '—'} · *practice items:* ${items.length}`);
  w('');

  // ---- Lesson (verbatim) ----
  w('### Lesson');
  w('');
  if (!L) { w('> NOT AUTHORED — no lesson object.'); w(''); } else {
    w('**Story**');
    w('');
    w(L.story);
    w('');
    w('**Keypoints**');
    w('');
    for (const k of L.keypoints ?? []) w(`- **${k.title}** — ${k.body}`);
    w('');
    w('**Worked example**');
    w('');
    w('- *Prompt:* ' + L.worked.prompt);
    for (const [i, s] of (L.worked.steps ?? []).entries()) w(`- *Step ${i + 1}:* ${s}`);
    w('- *Answer:* ' + L.worked.answer);
    w('');
    w('**One-breath compression:** ' + L.compression);
    w('');
    w('**Forward pointer:** ' + L.forwardPointer);
    w('');
  }

  // ---- Nutshell (contract artifact 2) ----
  w('### Nutshell — one formula or one statement (AUTHORING_CONTRACT.md §1.2)');
  w('');
  const nut = validateNutshell(L?.nutshell);
  if (nut.ok) w('`' + L.nutshell + '`');
  else w(`> **NOT AUTHORED** — no per-concept nutshell exists (validator: ${nut.reason}).`);
  w('');

  // ---- Practice items (verbatim) ----
  w(`### Practice items (${items.length})`);
  w('');
  for (const it of items) {
    const isParam = typeof it.generate === 'function';
    w(`#### \`${it.id}\` — rung: ${it.rung}, marks: ${it.marks ?? 1}${isParam ? ' — PARAMETERIZED (numbers regenerate per attempt)' : ''}`);
    w('');
    if (it.scaffold?.length) { w('- **Scaffold (hints):** ' + it.scaffold.map((s) => `“${s}”`).join(' ')); }
    if (!isParam) {
      renderMcq(it);
      w('');
    } else {
      for (const seed of SEEDS) {
        w(`*Seeded instance (seed ${seed}):*`);
        renderMcq(it.generate(makeRng(seed)));
        w('');
      }
    }
  }

  // ---- Sealed item (contract artifact 4) ----
  w('### Sealed item — exactly one, never served in practice (AUTHORING_CONTRACT.md §1.4, §2)');
  w('');
  if (sealed.length) {
    for (const it of sealed) { w(`#### \`${it.id}\` — rung: sealed`); renderMcq(it); w(''); }
  } else {
    w('> **NOT AUTHORED** — zero sealed items exist for this concept (or anywhere in the bank).');
  }
  w('');
  w('---');
  w('');
}

mkdirSync('out', { recursive: true });
writeFileSync('out/audit-sample.md', out.join('\n'));
process.stdout.write(`Wrote out/audit-sample.md — ${CONCEPTS.join(', ')} (${out.length} lines)\n`);
