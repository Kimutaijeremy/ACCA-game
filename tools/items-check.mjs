// items-check.mjs — the AUTHORING_CONTRACT.md acceptance instrument (standing order §1; upgraded
// 2026-08-06 to the full contract). Per authored concept it reports the four required artifacts —
// lesson, one-line nutshell, rung-floor practice set, exactly one sealed item — plus the
// breadth-before-depth flag, and it proves mechanically that no sealed item is reachable from a
// practice path. Run: npm run items:check
//
// A concept is ACCEPTED only when every column is satisfied. This is a gate: exit 1 if any authored
// concept is not accepted.

import { loadGraphFromSpec } from '../src/engine/node-loader.js';
import { LESSONS_BY_PAPER, lessonForConcept } from '../src/content/lessons/index.js';
import { ITEMS_BY_PAPER, itemsForConcept, ALL_ITEMS } from '../src/content/items/index.js';
import { auditConcept, meetsFloor, sealedPool, sealedLeaks } from '../src/engine/authoring.js';
import { assembleSet, FA_AREA_WEIGHTS, BT_AREA_WEIGHTS, MA_AREA_WEIGHTS } from '../src/engine/sets.js';
import { makeRng } from '../src/engine/rng.js';

const graph = loadGraphFromSpec();
const PAPERS = ['BT', 'MA', 'FA'];
const WEIGHTS = { BT: BT_AREA_WEIGHTS, MA: MA_AREA_WEIGHTS, FA: FA_AREA_WEIGHTS };
const line = (s = '') => process.stdout.write(s + '\n');

line('AUTHORING CONTRACT — acceptance report  (lesson · nutshell · rung floor · 1 sealed · breadth)\n');

let anyNotAccepted = false;
let acceptedCount = 0;
let floorCount = 0;
const paperBreadth = {};

for (const paper of PAPERS) {
  const live = graph.conceptsForPaper(paper);
  const authoredToFloor = live.filter((cid) => meetsFloor({
    conceptId: cid, lesson: lessonForConcept(cid), items: itemsForConcept(cid), lessonShape: lessonForConcept(cid)?.shape,
  }));
  const paperFullyAuthored = authoredToFloor.length === live.length;
  paperBreadth[paper] = { authored: authoredToFloor.length, live: live.length, full: paperFullyAuthored };
  floorCount += authoredToFloor.length;

  const lessons = LESSONS_BY_PAPER[paper] ?? [];
  line(`── ${paper} — ${lessons.length} authored concepts · breadth ${authoredToFloor.length}/${live.length}${paperFullyAuthored ? ' (100% — depth unlocked)' : ' (depth locked)'}`);
  for (const L of lessons) {
    const a = auditConcept({
      conceptId: L.conceptId,
      lesson: L,
      items: itemsForConcept(L.conceptId),
      lessonShape: L.shape,
      paperFullyAuthored,
    });
    if (a.accepted) acceptedCount += 1; else anyNotAccepted = true;
    const r = a.byRung;
    const rungs = a.capped
      ? `capped ${a.practiceTotal}`
      : `cc:${r['concept-check']} g:${r.guided} s:${r.standard} st:${r.stretch}${a.param.needed ? ` param:${a.param.present ? '✓' : '✗'}` : ''}`;
    const nut = a.nutshell.ok ? 'nutshell:✓(1)' : `nutshell:✗(${a.nutshell.reason})`;
    const mark = a.accepted ? 'ACCEPT' : 'REJECT';
    const miss = a.missing.length ? `  ← ${a.missing.join(', ')}` : '';
    line(`   ${mark} ${L.conceptId.padEnd(6)} lesson:${a.hasLesson ? '✓' : '✗'} ${nut} ${rungs} sealed:${a.sealedCount}${miss}`);
  }
  line('');
}

// ── Mechanical proof: no sealed item is reachable from a practice path ──────
// Inject a synthetic sealed item into a real paper's bank and assemble many sets; it must never be
// served. This exercises the exclusion even though the real bank currently holds zero sealed items.
const areaOf = (it) => graph.get(it.conceptIds[0]).outcome.split(' ')[1][0];
let probeLeaks = 0;
let realSealedServed = 0;
for (const paper of PAPERS) {
  const bank = ITEMS_BY_PAPER[paper];
  if (!bank.length) continue;
  const probe = {
    id: `PROBE-SEALED-${paper}`, conceptIds: [bank[0].conceptIds[0]], rung: 'sealed', marks: 1,
    stem: 'probe', options: [{ id: 'a', text: 'x' }, { id: 'b', text: 'y' }, { id: 'c', text: 'z' }],
    answerId: 'a', distractors: { b: 'knowledge_gap' },
  };
  const withProbe = [...bank, probe];
  for (const seed of [1, 2, 3, 7, 13, 42, 99, 123, 777, 5000]) {
    const { items: served } = assembleSet(withProbe, { rng: makeRng(seed), size: 10, areaOf, areaWeights: WEIGHTS[paper] });
    if (served.some((it) => it.id === probe.id)) probeLeaks += 1;
    realSealedServed += sealedLeaks(served).length;
  }
}

const totalSealed = ALL_ITEMS.filter((i) => i.rung === 'sealed').length;
const totalAuthored = PAPERS.reduce((n, p) => n + (LESSONS_BY_PAPER[p]?.length ?? 0), 0);

line('SEALED-POOL INTEGRITY');
line(`   sealed items authored (whole bank): ${totalSealed}`);
line(`   injected sealed-exclusion probe (3 papers × 10 seeds): ${probeLeaks === 0 ? 'PASS — probe never served' : `FAIL — ${probeLeaks} leaks`}`);
line(`   real sealed items served in the sweep: ${realSealedServed}`);
line(`   NOTE: review-probe and freshness (Amendment 01 H) paths are not built yet; when built they`);
line('         MUST draw from practicePool() — this probe extends to them then.\n');

line('PAPER BREADTH (authored to floor / live)');
for (const p of PAPERS) line(`   ${p}: ${paperBreadth[p].authored}/${paperBreadth[p].live}${paperBreadth[p].full ? '' : '  — depth locked'}`);
line('');

line(`SUMMARY: ${acceptedCount}/${totalAuthored} concepts ACCEPTED under the contract · ${floorCount} meet the A5 floor · sealed authored ${totalSealed} · sealed reachable in practice ${probeLeaks + realSealedServed}`);
line(anyNotAccepted || probeLeaks > 0
  ? 'RESULT: NOT ACCEPTED — see ← gaps above (this is expected until the contract artifacts are authored).'
  : 'RESULT: ACCEPTED — every authored concept meets AUTHORING_CONTRACT.md.');
process.exit(anyNotAccepted || probeLeaks > 0 ? 1 : 0);
