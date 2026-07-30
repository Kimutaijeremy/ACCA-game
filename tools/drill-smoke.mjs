// drill-smoke.mjs — drives the REAL app UI in headless Chrome to prove the drill runner works
// end to end: read a lesson → answer its questions → watch the concept climb the mastery states →
// see a diagnosis on a wrong answer. This is the "does it actually work on a phone" check.
// Run: npm run drill:smoke

import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const out = (s = '') => process.stdout.write(s + '\n');
let failures = 0;
const check = (name, pass, detail = '') => { if (!pass) failures += 1; out(`  ${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ::  ${detail}` : ''}`); };

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const rel = normalize(decodeURIComponent(req.url.split('?')[0].split('#')[0])).replace(/^(\.\.[/\\])+/, '');
      const path = join(ROOT, rel === '/' || rel === '\\' ? 'index.html' : rel);
      if (!statSync(path).isFile()) throw new Error('nf');
      res.writeHead(200, { 'content-type': MIME[path.slice(path.lastIndexOf('.'))] ?? 'application/octet-stream' });
      res.end(readFileSync(path));
    } catch { res.writeHead(404); res.end('nf'); }
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

const server = await startServer();
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // phone viewport
page.on('pageerror', (e) => { failures += 1; out(`  [pageerror] ${e.message}`); });
page.on('console', (m) => { if (m.type() === 'error') out(`  [console.error] ${m.text()}`); });

// Answer the currently-served question; `mode` = 'correct' | 'wrong'.
async function answer(mode) {
  const answerId = await page.evaluate(() => window.__PT__.curItem().answerId);
  const optSel = mode === 'correct'
    ? `.opt[data-opt="${answerId}"]`
    : `.opt:not([data-opt="${answerId}"])`;
  await page.click(optSel);
  await page.click('[data-act="check"]');
  await page.waitForSelector('.verdict');
}

try {
  await page.goto(`${base}/index.html`);
  await page.waitForFunction('window.__PT__ !== undefined');

  out('\nDRILL RUNNER — real UI, phone viewport (390px)\n');

  // 1. Open a concept, read the lesson, open the drill.
  await page.goto(`${base}/index.html#/concept/BT-01`);
  await page.waitForSelector('[data-act="read"]');
  const before = await page.evaluate(() => window.__PT__.stateOf('BT-01'));
  check('concept starts Unvisited', before === 'Unvisited', before);

  await page.click('[data-act="read"]');
  await page.waitForFunction('window.__PT__.stateOf("BT-01") === "Exposed"');
  check('marking the lesson read → Exposed', true);

  await page.click('[data-act="drill"]');
  await page.waitForSelector('.opt');
  check('drill serves a question with options', (await page.$$('.opt')).length >= 3);

  // 2. Answer three concept-checks correctly → the concept should reach Understood.
  //    (Serve order is concept-check first; BT-01 has 3 of them.)
  for (let i = 0; i < 3; i += 1) {
    const rung = await page.evaluate(() => window.__PT__.curItem().rung);
    check(`question ${i + 1} is a concept-check`, rung === 'concept-check', rung);
    await answer('correct');
    await page.waitForSelector('.verdict.ok');
    await page.click('[data-act="next"]');
    await page.waitForSelector('.opt');
  }
  const afterCC = await page.evaluate(() => window.__PT__.stateOf('BT-01'));
  check('3 correct concept-checks → Understood (watched it happen)', afterCC === 'Understood', afterCC);

  // 3. Answer the next question (guided) WRONG → a diagnosis with a repair route must show.
  const rung = await page.evaluate(() => window.__PT__.curItem().rung);
  check('next question is guided', rung === 'guided', rung);
  await answer('wrong');
  await page.waitForSelector('.verdict.no');
  const diag = await page.evaluate(() => {
    const el = document.querySelector('.diag .cause');
    return { hasDiag: !!el, cause: el ? el.textContent : null, hasFix: !!document.querySelector('.diag ul li') };
  });
  check('wrong answer shows a diagnosed cause', diag.hasDiag, diag.cause);
  check('wrong answer shows a repair (the fix)', diag.hasFix);

  // 4. Confirm the attempts were actually logged (single source of truth).
  const logCount = await page.evaluate(async () => (await window.__PT__.store.readLogRecords()).filter((r) => r.kind === 'item').length);
  check('every answer was logged as an item attempt', logCount === 4, `${logCount} item records`);

  // 5. Position must NOT predict the answer — the correct option lands in varied slots across serves.
  const slotSpread = await page.evaluate(() => {
    // Re-instantiate one item across many seeds via the engine and record the answer's slot.
    return import('/src/engine/items.js').then(({ instantiate }) => import('/src/content/items/index.js').then(({ itemsForConcept }) => {
      const item = itemsForConcept('BT-01').find((i) => i.rung === 'concept-check');
      const slots = new Set();
      for (let seed = 1; seed <= 30; seed += 1) {
        const inst = instantiate(item, seed);
        slots.add(inst.options.findIndex((o) => o.id === inst.answerId));
      }
      return [...slots].sort();
    }));
  });
  check('correct answer appears in more than one position (shuffled)', Array.isArray(slotSpread) && slotSpread.length >= 2, JSON.stringify(slotSpread));

  out(`\n${failures === 0 ? 'ALL DRILL CHECKS PASS' : failures + ' CHECK(S) FAILED'}`);
} finally {
  await browser.close();
  server.close();
}
process.exit(failures === 0 ? 0 : 1);
