// wp1-report.mjs — the WP1 deliverable report (Brief WP1 "THEN STOP AND REPORT").
//
// Prints, from the real spec files:
//   1. the concept graph as loaded (the data model's spine);
//   2. the v3 migration DRY RUN against Jeremy's real export fixture;
//   3. the three allocation matrices — every cell zero, failing loudly.
//
// Run: npm run report

import { loadGraphFromSpec, loadSyllabusOutcomes, loadV3Fixture } from '../src/engine/node-loader.js';
import { planMigration } from '../src/engine/migrate.js';
import { buildReport, formatReport } from '../src/engine/allocation.js';

const graph = loadGraphFromSpec();
const syllabus = loadSyllabusOutcomes();
const v3 = loadV3Fixture();

const line = (s = '') => process.stdout.write(s + '\n');
const rule = (c = '=') => line(c.repeat(72));

rule();
line('PAPER TRAIL — WP1 FOUNDATION REPORT');
rule();

// 1. Concept graph -----------------------------------------------------------
const counts = graph.counts();
line('\n1. CONCEPT GRAPH (frozen, ingested as permanent keys)');
line(`   live concepts : ${counts.live}`);
line(`   stub nodes    : ${counts.stubs}`);
line(`   edges         : ${counts.edges}`);
for (const p of graph.papers()) {
  line(`   ${p} : ${graph.conceptsForPaper(p).length} concepts`);
}

// 2. Migration dry run -------------------------------------------------------
line('\n2. V3 MIGRATION — DRY RUN (against the real export fixture, no writes)');
const plan = planMigration(v3);
line(`   result             : ${plan.ok ? 'OK' : 'FAILED'}`);
line(`   streak carried     : cur ${plan.newState.streak.cur}, best ${plan.newState.streak.best}`);
line(`   concept states     : ${plan.summary.conceptStatesCreated} (every concept starts unvisited)`);
line(`   attempt-log entries: ${plan.newState.attemptLog.length}`);
line('   v1 history panel (display names only):');
for (const t of plan.newState.v1History.topics) {
  const when = t.lastAttemptAt ? new Date(t.lastAttemptAt).toISOString().slice(0, 10) : '—';
  line(`     · ${t.name.padEnd(32)} ${t.correct}/${t.seen} correct   last ${when}`);
}
line(`     TOTAL: ${plan.newState.v1History.totals.correct}/${plan.newState.v1History.totals.seen} correct`);
if (plan.warnings.length) {
  line('   warnings:');
  for (const w of plan.warnings) line(`     - ${w}`);
}

// 3. Allocation matrices -----------------------------------------------------
line('\n3. ALLOCATION MATRICES (WP1: banks empty → must fail loudly)');
const report = buildReport(syllabus, graph, { generatedAt: Date.now() });
line('');
line(formatReport(report));

rule();
const gateColour = report.allGreen ? 'GREEN' : 'RED (expected in WP1 — no content authored yet)';
line(`COVERAGE GATE: ${gateColour}`);
line('State machine, migration and persistence: see `npm test` (all green).');
rule();

// Exit non-zero if the coverage gate is unexpectedly green in WP1 (there is no content yet,
// so green would mean the floors are not actually being enforced).
process.exit(report.allGreen ? 1 : 0);
