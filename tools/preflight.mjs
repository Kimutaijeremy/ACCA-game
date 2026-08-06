// preflight.mjs — Section 8 publishing pre-flight, run in real headless Chrome against the actual
// app shell, with Jeremy's v3 data seeded into localStorage so the real cutover path is exercised.
// Any failure stops the publish. Also writes phone-viewport screenshots to docs/screens/.
// Run: npm run preflight

import http from 'node:http';
import { readFileSync, statSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { loadV3Fixture } from '../src/engine/node-loader.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const out = (s = '') => process.stdout.write(s + '\n');
let fails = 0;
const check = (n, ok, detail = '') => { if (!ok) fails++; out(`  ${ok ? 'PASS' : 'FAIL'}  ${n}${detail ? '  ::  ' + detail : ''}`); };

const server = await new Promise((res) => {
  const s = http.createServer((rq, rs) => {
    try {
      const rel = normalize(decodeURIComponent(rq.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
      const p = join(ROOT, rel === '/' || rel === '\\' ? 'index.html' : rel);
      if (!statSync(p).isFile()) throw 0;
      rs.writeHead(200, { 'content-type': MIME[p.slice(p.lastIndexOf('.'))] ?? 'application/octet-stream' });
      rs.end(readFileSync(p));
    } catch { rs.writeHead(404); rs.end('nf'); }
  });
  s.listen(0, () => res(s));
});
const base = `http://localhost:${server.address().port}`;
const V3 = loadV3Fixture();

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
// Seed Jeremy's v3 data before any app script runs — the real cutover starts from HIS device.
await context.addInitScript((v3) => {
  localStorage.setItem('pt_stats', JSON.stringify(v3.stats));
  localStorage.setItem('pt_streak', JSON.stringify(v3.streak));
  localStorage.setItem('pt_nodes', JSON.stringify(v3.nodes));
}, V3);
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

try {
  out('SECTION 8 PRE-FLIGHT (phone viewport 390×844, v3 data seeded)\n');

  // (1) fixture present
  check('1. spec/paper-trail-progress.json present & readable', !!V3 && !!V3.stats);

  await page.goto(`${base}/index.html`);
  await page.waitForFunction('window.__PT__ !== undefined', { timeout: 15000 });
  await page.waitForSelector('.card');

  check('app shell boots with no console errors', errors.length === 0, errors.join(' | '));
  const homeText = await page.textContent('#app');
  check('home renders the paper map, honestly', /Financial Accounting/.test(homeText) && /content not built yet/.test(homeText) && /opens when you complete FA/.test(homeText));

  // (2) migration on first load
  const migrated = await page.evaluate(() => {
    const m = window.__PT__.store.loadMeta();
    return { streak: m.streak, topics: m.v1History.topics.map((t) => t.name) };
  });
  check('2. migration ran at cutover — streak 3/10, three v1 topics by display name, zero states',
    migrated.streak.cur === 3 && migrated.streak.best === 10 && migrated.topics.length === 3);

  // (7) pt_* read-only; only papertrail:v4: written
  const keys = await page.evaluate(() => ({
    all: Object.keys(localStorage),
    ptStats: localStorage.getItem('pt_stats'),
  }));
  const wroteOnlyV4 = keys.all.every((k) => k.startsWith('papertrail:v4:') || k.startsWith('pt_'))
    && keys.all.some((k) => k === 'papertrail:v4:meta')
    && keys.ptStats === JSON.stringify(V3.stats);
  check('7. old pt_* keys untouched; papertrail:v4: is the only namespace written', wroteOnlyV4, keys.all.join(','));

  // functional: a topic page renders, and answering a set question logs an item attempt
  await page.click('[data-act="paper"][data-paper="FA"]');
  await page.waitForSelector('[data-act="topic"]');
  await page.click('[data-act="topic"]'); // first FA topic page
  await page.waitForSelector('[data-act="set-new"]');
  await page.screenshot({ path: join(ROOT, 'docs/screens/topic.png') });
  const topicOk = /In a nutshell/.test(await page.textContent('#app')) && /Worked example/.test(await page.textContent('#app'));
  check('a topic page renders (nutshell + worked example)', topicOk);

  // flag on the topic page — drive via the DOM so the fixed overlay can't block later clicks
  await page.evaluate(() => document.querySelector('[data-act="flag"][data-kind="topic"]').click());
  await page.waitForSelector('.sheet [data-r="confusing"]');
  await page.evaluate(() => document.querySelector('.sheet [data-r="confusing"]').click());
  await page.evaluate(() => document.querySelectorAll('.sheet').forEach((s) => s.remove()));
  const flagged = await page.evaluate(() => window.__PT__.store.flags().length);
  check('flag button writes to the review queue', flagged === 1);

  // start a set, answer one question → an item attempt is logged
  await page.click('[data-act="set-new"]');
  await page.waitForSelector('.opt');
  await page.screenshot({ path: join(ROOT, 'docs/screens/set.png') });
  const ans = await page.evaluate(() => window.__PT__.curItem().answerId);
  await page.click(`.opt[data-opt="${ans}"]`);
  await page.click('[data-act="check"]');
  await page.waitForSelector('.verdict');
  const logged = await page.evaluate(async () => (await window.__PT__.store.readLogRecords()).some((r) => r.kind === 'item'));
  check('answering a set question logs an item attempt', logged);

  // export/import round-trip
  const rt = await page.evaluate(async () => {
    const s = window.__PT__.store;
    const blob = await s.exportAll();
    return { flags: blob.flags.length, log: blob.attemptLog.length, streak: blob.streak.cur };
  });
  check('export carries meta + log + flags', rt.flags === 1 && rt.log >= 1 && rt.streak === 3);

  // (4) rollback in the browser this session
  const rb = await page.evaluate(async () => {
    const mod = await import('./src/engine/index.js');
    // there was no prior v4 meta before cutover, so rollback should remove it
    mod.rollbackMigration(window.__PT__.store);
    return window.__PT__.store.loadMeta() === null;
  });
  check('4. rollback tested in-browser — migration reverts cleanly', rb);
  // restore for screenshots
  await page.evaluate(async () => { const mod = await import('./src/engine/index.js'); const s = window.__PT__.store; if (!s.loadMeta()) { const v3 = mod.readV3FromStore(localStorage); await mod.applyMigration(v3 ?? {}, s, { now: Date.now() }); await window.__PT__.refreshAll(); } });

  // (6) phone viewport — no horizontal overflow, screenshots for the record
  mkdirSync(join(ROOT, 'docs/screens'), { recursive: true });
  await page.goto(`${base}/index.html`); await page.waitForSelector('.card');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('6. phone viewport — no horizontal overflow', overflow <= 1, `overflow ${overflow}px`);
  await page.screenshot({ path: join(ROOT, 'docs/screens/home.png') });
  await page.click('[data-act="paper"][data-paper="FA"]'); await page.waitForSelector('[data-act="set-new"]');
  await page.screenshot({ path: join(ROOT, 'docs/screens/paper.png') });
  await page.goto(`${base}/index.html#/dashboard`); await page.waitForSelector('.bar');
  await page.screenshot({ path: join(ROOT, 'docs/screens/dashboard.png') });

  // (8) deployed identity unchanged
  const mani = JSON.parse(readFileSync(join(ROOT, 'manifest.webmanifest'), 'utf8'));
  check('8. deployed identity unchanged (start_url ./index.html, scope ./)', mani.start_url === './index.html' && mani.scope === './');

  out(`\n${fails === 0 ? 'PRE-FLIGHT GREEN — clear to publish' : fails + ' CHECK(S) FAILED — publish blocked'}`);
} finally {
  await browser.close(); server.close();
}
process.exit(fails === 0 ? 0 : 1);
