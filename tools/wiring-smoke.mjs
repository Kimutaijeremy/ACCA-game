// wiring-smoke.mjs — drives the REAL app UI to prove Amendment 01 clause E/F is wired, not just the
// engine modules: a set is a persisted session that survives a full page RELOAD and resumes at
// question n+1; the restart control reads honestly ("Start over", never "continue"); a miss opens the
// per-concept nutshell as an overlay with no route change. (Clause G escalation is covered
// deterministically by test/session-runner.test.js.) Run: npm run wiring:smoke

import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const out = (s = '') => process.stdout.write(s + '\n');
let failures = 0;
const check = (n, ok, d = '') => { if (!ok) failures += 1; out(`  ${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  ::  ' + d : ''}`); };

const server = await new Promise((r) => {
  const s = http.createServer((rq, rs) => {
    try {
      const rel = normalize(decodeURIComponent(rq.url.split('?')[0].split('#')[0])).replace(/^(\.\.[/\\])+/, '');
      const p = join(ROOT, rel === '/' || rel === '\\' ? 'index.html' : rel);
      if (!statSync(p).isFile()) throw 0;
      rs.writeHead(200, { 'content-type': MIME[p.slice(p.lastIndexOf('.'))] ?? 'application/octet-stream' });
      rs.end(readFileSync(p));
    } catch { rs.writeHead(404); rs.end('nf'); }
  });
  s.listen(0, () => r(s));
});
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => { failures += 1; out(`  [pageerror] ${e.message}`); });
page.on('console', (m) => { if (m.type() === 'error') out(`  [console.error] ${m.text()}`); });

const answerCurrent = async (correct) => {
  await page.waitForSelector('.opt');
  const ans = await page.evaluate(() => window.__PT__.curItem().answerId);
  await page.click(correct ? `.opt[data-opt="${ans}"]` : `.opt:not([data-opt="${ans}"])`);
  await page.click('[data-act="check"]');
  await page.waitForSelector('.verdict');
};
const advance = async () => {
  if (await page.$('.sheet.teach')) await page.click('[data-act="ov-continue"]');
  else await page.click('[data-act="next"]');
};

try {
  await page.goto(`${base}/index.html`);
  await page.waitForFunction('window.__PT__ !== undefined');
  out('\nAMENDMENT 01 WIRING — real UI (clauses E, F)\n');

  // Start a fresh FA set and answer two questions correctly (advance the position to 2).
  await page.goto(`${base}/index.html#/set/FA`);
  await answerCurrent(true); await advance();
  await answerCurrent(true); await advance();
  const posBefore = await page.evaluate(() => window.__PT__.curSession().position);
  const persistedBefore = await page.evaluate(() => window.__PT__.store.loadSession().position);
  check('E: after two answers the persisted session is at position 2', posBefore === 2 && persistedBefore === 2, `mem ${posBefore} / stored ${persistedBefore}`);

  // A FULL PAGE RELOAD — the set must survive the app closing.
  await page.reload();
  await page.waitForFunction('window.__PT__ !== undefined');
  await page.goto(`${base}/index.html#/paper/FA`);
  await page.waitForSelector('[data-act="set-resume"]');
  const resumeLabel = await page.textContent('[data-act="set-resume"]');
  check('E: after reload the paper offers Resume at question 3', /Resume/.test(resumeLabel) && /question 3 of 10/.test(resumeLabel), resumeLabel.trim());

  // Resume returns to question n+1 (question 3), not the start.
  await page.click('[data-act="set-resume"]');
  await page.waitForSelector('.opt');
  const posAfter = await page.evaluate(() => window.__PT__.curSession().position);
  const eyebrow = await page.textContent('.eyebrow');
  check('E: resume returns to question n+1 (position preserved across the reload)', posAfter === 2 && /question 3 of 10/.test(eyebrow), `${posAfter} · ${eyebrow.trim()}`);

  // The restart control is honest: labelled "Start over", never a continue/resume word.
  const restartLabel = (await page.textContent('[data-act="restart"]')).trim();
  check('E: the restart control reads "Start over", never as continuing', restartLabel === 'Start over' && !/continue|resume/i.test(restartLabel), restartLabel);

  // A miss opens the per-concept nutshell overlay, with no route change.
  const hashBeforeMiss = await page.evaluate(() => location.hash);
  await answerCurrent(false);
  const overlayNut = await page.$('.sheet.teach .nutshell');
  const hashDuringMiss = await page.evaluate(() => location.hash);
  check('F: a committed wrong answer opens the nutshell overlay', !!overlayNut);
  check('F/E: the overlay did not change the route', hashDuringMiss === hashBeforeMiss, `${hashBeforeMiss} → ${hashDuringMiss}`);
  const nutText = overlayNut ? (await overlayNut.textContent()).trim() : '';
  check('F: the overlay shows a per-concept nutshell (a formula or one statement)', nutText.length > 0 && nutText.length < 220, nutText.slice(0, 60));

  // Restarting from here begins the same set at question 1 — a distinct action from resume.
  await advance();
  await page.click('[data-act="restart"]');
  await page.waitForSelector('.opt');
  const posRestart = await page.evaluate(() => window.__PT__.curSession().position);
  check('E: restart begins the set again at question 1 (distinct from resume)', posRestart === 0, `position ${posRestart}`);

  out(`\n${failures === 0 ? 'ALL WIRING CHECKS PASS' : failures + ' CHECK(S) FAILED'}`);
} finally {
  await browser.close(); server.close();
}
process.exit(failures === 0 ? 0 : 1);
