// set-smoke.mjs — drives the REAL A6 app UI in headless Chrome at a phone viewport: open a topic
// page, play a full set of ten, answer a mix, and confirm scoring, logging, diagnosis, the set
// result, and that the set is drawn to the exam's area weighting. Run: npm run set:smoke

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

try {
  await page.goto(`${base}/index.html`);
  await page.waitForFunction('window.__PT__ !== undefined');
  out('\nA6 SET RUNNER — real UI, phone viewport (390px)\n');

  // Home → FA paper → a topic page renders
  await page.goto(`${base}/index.html#/paper/FA`);
  await page.waitForSelector('[data-act="topic"]');
  await page.click('[data-act="topic"]');
  await page.waitForSelector('[data-act="set"]');
  const topicText = await page.textContent('#app');
  check('topic page shows nutshell + exam readiness + worked example',
    /In a nutshell/.test(topicText) && /Exam readiness/.test(topicText) && /Worked example/.test(topicText));
  check('topic page offers Go deeper', /Go deeper/i.test(topicText));
  // Go deeper reveals the pre-generated depth (no network), and logs the open
  await page.click('[data-act="deeper"]');
  await page.waitForSelector('.deepsec');
  check('Go deeper reveals shipped depth sections', (await page.$$('.deepsec')).length >= 1);
  check('a Go deeper open is logged', await page.evaluate(() => window.__PT__.store.deeperOpens().length >= 1));

  // Start a set of ten
  await page.goto(`${base}/index.html#/set/FA`);
  await page.waitForSelector('.opt');
  const total = await page.evaluate(() => window.__PT__ && document.querySelector('.eyebrow').textContent);
  check('a set of ten is served', /of 10/.test(total), total);

  // Answer all ten: alternate correct / wrong so we exercise scoring + diagnosis
  let sawDiagnosis = false;
  for (let i = 0; i < 10; i += 1) {
    await page.waitForSelector('.opt');
    const ans = await page.evaluate(() => window.__PT__.curItem().answerId);
    const wantCorrect = i % 2 === 0;
    const sel = wantCorrect ? `.opt[data-opt="${ans}"]` : `.opt:not([data-opt="${ans}"])`;
    await page.click(sel);
    await page.click('[data-act="check"]');
    await page.waitForSelector('.verdict');
    if (!wantCorrect && await page.$('.diag .cause')) sawDiagnosis = true;
    await page.click('[data-act="next"]');
  }
  await page.waitForSelector('text=/Set complete/');
  const done = await page.textContent('#app');
  check('set finishes with a score out of 10', /You scored \d+ \/ 10/.test(done), (done.match(/You scored[^<]*/) || [''])[0]);
  check('rolling average is labelled "across topics built so far"', /across topics built so far/.test(done));
  // FA is thin (6 of ~34 topics), so the exam-shaped verdict must be SUPPRESSED, not shown
  check('exam-shaped verdict suppressed while the bank is thin', /not yet representative/i.test(done) && !/this set was/.test(done),
    (done.match(/across topics built so far[^]*?(?=Topics)/) || [''])[0]);
  check('a wrong answer showed a diagnosed cause', sawDiagnosis);

  const st = await page.evaluate(async () => ({
    items: (await window.__PT__.store.readLogRecords()).filter((r) => r.kind === 'item').length,
    sets: window.__PT__.store.setResults().length,
  }));
  check('ten item attempts were logged', st.items === 10, `${st.items} items`);
  check('the set result was recorded', st.sets === 1);

  // Area weighting: aggregate several sets and confirm FA area D outweighs area A.
  const spread = await page.evaluate(async () => {
    const [{ assembleSet, defaultAreaWeights }, { ITEMS_BY_PAPER }] = await Promise.all([
      import('/src/engine/sets.js'), import('/src/content/items/index.js'),
    ]);
    const { makeRng } = await import('/src/engine/rng.js');
    const g = window.__PT__.graph;
    const areaOf = (it) => g.get(it.conceptIds[0]).outcome.split(' ')[1][0];
    const tally = {};
    for (let s = 1; s <= 20; s += 1) {
      const built = assembleSet(ITEMS_BY_PAPER.FA, { rng: makeRng(s), size: 10, areaOf, areaWeights: defaultAreaWeights(g, 'FA') });
      for (const it of built.items) { const a = areaOf(it); tally[a] = (tally[a] || 0) + 1; }
    }
    return tally;
  });
  check('sets are exam-weighted (FA area D outweighs area A)', (spread.D || 0) > (spread.A || 0), JSON.stringify(spread));

  out(`\n${failures === 0 ? 'ALL SET CHECKS PASS' : failures + ' CHECK(S) FAILED'}`);
} finally {
  await browser.close(); server.close();
}
process.exit(failures === 0 ? 0 : 1);
