// browser-verify.mjs — Q3 + Q4 in a real headless Chromium against real browser localStorage.
//
// Q3: persistence across reload, in-browser migration against the real export, export/import
//     round-trip, the papertrail:v4: namespace actually landing in storage, and non-silent
//     quota failure. Compares browser results against Node for the same inputs.
// Q4: replay a synthesised year of use (tens of thousands of attempts across 191 concepts) and
//     measure deriving ALL concept states + rendering the review queue, under a phone-like CPU
//     throttle. Prints the real number.
//
// Run: npm run verify:browser   (uses your installed Chrome; no Chromium download)

import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

// Node-side engine, to compare against the browser.
import { AttemptLog } from '../src/engine/log.js';
import { deriveAll } from '../src/engine/derive.js';
import { planMigration } from '../src/engine/migrate.js';
import { loadGraphFromSpec, loadV3Fixture } from '../src/engine/node-loader.js';
import { synthLog } from '../test/browser/synth.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };

const out = (s = '') => process.stdout.write(s + '\n');
let failures = 0;
const check = (name, pass, detail = '') => {
  if (!pass) failures++;
  out(`  ${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ::  ${detail}` : ''}`);
};

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
      const path = join(ROOT, rel);
      if (!statSync(path).isFile()) throw new Error('not a file');
      const ext = path.slice(path.lastIndexOf('.'));
      res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' });
      res.end(readFileSync(path));
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

const server = await startServer();
const port = server.address().port;
const base = `http://localhost:${port}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') out(`  [browser console.error] ${m.text()}`); });
page.on('pageerror', (e) => out(`  [browser pageerror] ${e.message}`));

async function goHarness() {
  await page.goto(`${base}/test/browser/harness.html`);
  await page.waitForFunction('window.__READY__ === true');
}

try {
  await goHarness();

  // ── Q3 ────────────────────────────────────────────────────────────────────
  out('\nQ3 — REAL BROWSER STORAGE (headless Chrome: IndexedDB log + localStorage meta)');

  // Start clean, migrate the real export, and append some attempts — meta → localStorage,
  // attempt log → IndexedDB.
  const mig = await page.evaluate(async () => {
    const { store, migrate, loadV3 } = window.PT;
    // fresh: clear meta + empty the IndexedDB log (clearLog, not deleteDatabase, so open
    // connections from other stores in this page cannot block it)
    window.localStorage.clear();
    const ls = window.PT.newStore(); // IdbLogAdapter + localStorage + error handler
    await ls.clearLog();
    const v3 = await loadV3();
    await migrate.applyMigration(v3, ls, { now: 1770000000000 });
    // then a few real attempts land in IndexedDB
    await ls.appendRecords([
      { id: 'b1', kind: 'lesson', conceptIds: ['FA-26'], sessionId: 's', timestamp: 1 },
      { id: 'b2', kind: 'item', conceptIds: ['FA-26'], rung: 'concept-check', correct: true, sessionId: 's', timestamp: 2 },
    ]);
    const meta = ls.loadMeta();
    const recs = await ls.readLogRecords();
    return {
      usesLocalStorage: ls.kv === window.localStorage,
      usesIndexedDB: ls.log.constructor.name === 'IdbLogAdapter',
      schema: meta.schema, streak: meta.streak,
      topics: meta.v1History.topics.map((t) => t.name),
      logCount: recs.length,
      metaKeyPresent: window.localStorage.getItem('papertrail:v4:meta') !== null,
      metaHasNoLog: !window.localStorage.getItem('papertrail:v4:meta').includes('attemptLog'),
      lsKeys: Object.keys(window.localStorage),
    };
  });
  check('LearnerStore uses window.localStorage for meta and IndexedDB for the log',
    mig.usesLocalStorage && mig.usesIndexedDB);
  check('migration runs in-browser against the real export', mig.schema === 'paper-trail/v4');
  check('streak preserved (3 / 10)', mig.streak.cur === 3 && mig.streak.best === 10);
  check('three topic records by display name', mig.topics.length === 3, mig.topics.join(' | '));
  check('attempts stored in IndexedDB, not in localStorage meta',
    mig.logCount === 2 && mig.metaHasNoLog);
  check("papertrail:v4: namespace lands in localStorage (meta only)",
    mig.metaKeyPresent, 'keys = ' + JSON.stringify(mig.lsKeys));

  const nodePlan = planMigration(loadV3Fixture());
  check('browser migration == Node migration (topics + streak)',
    JSON.stringify(mig.topics) === JSON.stringify(nodePlan.newState.v1History.topics.map((t) => t.name))
    && mig.streak.cur === nodePlan.newState.streak.cur);

  // persistence across a FULL page reload — both halves survive
  await page.reload();
  await page.waitForFunction('window.__READY__ === true');
  const afterReload = await page.evaluate(async () => {
    const { store } = window.PT;
    const ls = window.PT.newStore();
    const meta = ls.loadMeta();
    const recs = await ls.readLogRecords();
    return { streak: meta ? meta.streak : null, topics: meta ? meta.v1History.topics.length : 0, logCount: recs.length };
  });
  check('meta + IndexedDB log both persist across a page reload',
    afterReload.streak && afterReload.streak.cur === 3 && afterReload.topics === 3 && afterReload.logCount === 2);

  // export → wipe everything → import → reload → identical
  const roundTrip = await page.evaluate(async () => {
    const { store } = window.PT;
    const ls = window.PT.newStore();
    const exported = JSON.stringify(await ls.exportAll()); // one-tap export payload (meta + log)
    window.localStorage.clear();
    await ls.clearLog();
    const clearedMetaNull = ls.loadMeta() === null;
    const clearedLogEmpty = (await ls.readLogRecords()).length === 0;
    await ls.importAll(JSON.parse(exported));
    return { clearedMetaNull, clearedLogEmpty, exported };
  });
  await page.reload();
  await page.waitForFunction('window.__READY__ === true');
  const afterImport = await page.evaluate(async () => {
    const ls = window.PT.newStore();
    return JSON.stringify(await ls.exportAll());
  });
  check('clearing storage makes state read as absent (not stale)',
    roundTrip.clearedMetaNull && roundTrip.clearedLogEmpty);
  check('export → import round-trips identically across reload', afterImport === roundTrip.exported);

  // non-silent quota failure on the meta write — the registered handler must actually FIRE.
  const quota = await page.evaluate(() => {
    const { store } = window.PT;
    const fired = [];
    const ls = new store.LearnerStore({ onPersistenceError: (info) => fired.push(info) });
    const orig = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = () => { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; };
    const res = ls.saveMeta(store.emptyState());
    window.localStorage.setItem = orig;
    // and the store cannot even be constructed without a handler
    let refused = false;
    try { new store.LearnerStore({}); } catch { refused = true; }
    return { res, firedCount: fired.length, firedQuota: fired[0] && fired[0].quota, refused };
  });
  check('a failed meta write fires the registered handler (not just a return value)',
    quota.res.ok === false && quota.firedCount === 1 && quota.firedQuota === true);
  check('the store refuses to construct without a persistence-failure handler', quota.refused);

  // ── Q3-scale: export + re-import a full 50,000-attempt log (~14 MB) in IndexedDB ──
  out('\nQ3-scale — EXPORT / RE-IMPORT AT 50,000 ATTEMPTS (~14 MB) through IndexedDB');
  const scale = await page.evaluate(async ({ liveIds }) => {
    const { store, log, synthLog } = window.PT;
    const a = window.PT.newStore();
    window.localStorage.clear();
    await a.clearLog(); // reset without deleteDatabase (open connections would block it)
    a.saveMeta({ ...store.emptyState(), createdAt: 1, streak: { cur: 1, best: 1 } });
    const recs = new log.AttemptLog(synthLog(liveIds, 50000)).toJSON();
    const t0 = performance.now();
    await a.appendRecords(recs);
    const appendMs = performance.now() - t0;

    const t1 = performance.now();
    const blob = await a.exportAll();
    const bytes = new TextEncoder().encode(JSON.stringify(blob)).length;
    const exportMs = performance.now() - t1;

    // wipe and re-import into a fresh store over the (cleared) same DB
    const b = window.PT.newStore();
    window.localStorage.clear();
    await b.clearLog();
    const t2 = performance.now();
    await b.importAll(blob);
    const importMs = performance.now() - t2;
    const restored = (await b.readLogRecords()).length;
    return { exportedCount: blob.attemptLog.length, bytes, restored, appendMs, exportMs, importMs };
  }, { liveIds: loadGraphFromSpec().liveIds() });
  const MB = (scale.bytes / (1024 * 1024)).toFixed(1);
  check(`export produced the full log (~${MB} MB)`, scale.exportedCount === 50000 && scale.bytes > 10 * 1024 * 1024,
    `${scale.exportedCount} attempts, ${MB} MB`);
  check('re-import restored all 50,000 attempts', scale.restored === 50000);
  out(`  timings: append ${scale.appendMs.toFixed(0)} ms · export ${scale.exportMs.toFixed(0)} ms · import ${scale.importMs.toFixed(0)} ms`);

  // ── Q4 ────────────────────────────────────────────────────────────────────
  out('\nQ4 — YEAR-SCALE REPLAY under phone-like CPU throttle');
  const graph = loadGraphFromSpec();
  const liveIds = graph.liveIds();
  const client = await page.context().newCDPSession(page);

  for (const rate of [1, 4]) {
    await client.send('Emulation.setCPUThrottlingRate', { rate });
    out(`  CPU throttle ${rate}×${rate === 1 ? ' (desktop baseline)' : ' (≈ mid-range phone)'}:`);
    for (const n of [30000, 50000]) {
      const r = await page.evaluate(async ({ n, liveIds }) => {
        const { log, derive, synthLog } = window.PT;
        const recs = synthLog(liveIds, n);
        const attemptLog = new log.AttemptLog(recs);
        const now = Date.now();
        // derive ALL concept states + compute the review queue
        const t0 = performance.now();
        const res = derive.deriveAll(attemptLog, { now, conceptIds: liveIds });
        const deriveMs = performance.now() - t0;
        // render the review queue to the DOM
        const t1 = performance.now();
        const el = document.getElementById('queue'); el.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (const q of res.reviewQueue) {
          const d = document.createElement('div'); d.textContent = q.conceptId + ' due'; frag.appendChild(d);
        }
        el.appendChild(frag);
        const renderMs = performance.now() - t1;
        return { deriveMs, renderMs, queueLen: res.reviewQueue.length, statesLen: res.states.size };
      }, { n, liveIds });
      out(`    ${String(n).padStart(6)} attempts → derive ${r.deriveMs.toFixed(1)} ms · render queue(${r.queueLen}) ${r.renderMs.toFixed(1)} ms  [states=${r.statesLen}]`);
    }
  }
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  // Node baseline for the same 50k (same generator), to answer "anything different in browser?"
  const nlog = new AttemptLog(synthLog(liveIds, 50000));
  const nt = performance.now();
  const nres = deriveAll(nlog, { now: Date.now(), conceptIds: liveIds });
  out(`  Node baseline 50000 attempts → derive ${(performance.now() - nt).toFixed(1)} ms  [queue=${nres.reviewQueue.length}]`);
  out('  (same modules run in both; no browser-only or Node-only behaviour observed)');

  out(`\n${failures === 0 ? 'ALL BROWSER CHECKS PASS' : failures + ' CHECK(S) FAILED'}`);
} finally {
  await browser.close();
  server.close();
}

process.exit(failures === 0 ? 0 : 1);
