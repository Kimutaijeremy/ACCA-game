// live-smoke.mjs — load the LIVE deployed app at phone viewport with Jeremy's v3 data seeded,
// to verify the real cutover end to end (CDN + service worker + migration). Run: node tools/live-smoke.mjs
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadV3Fixture } from '../src/engine/node-loader.js';

const URL = 'https://kimutaijeremy.github.io/ACCA-game/';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const V3 = loadV3Fixture();
const out = (s = '') => process.stdout.write(s + '\n');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await ctx.addInitScript((v3) => {
  localStorage.setItem('pt_stats', JSON.stringify(v3.stats));
  localStorage.setItem('pt_streak', JSON.stringify(v3.streak));
  localStorage.setItem('pt_nodes', JSON.stringify(v3.nodes));
}, V3);
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(e.message));
try {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction('window.__PT__ !== undefined', { timeout: 20000 });
  await page.waitForSelector('.card');
  const info = await page.evaluate(() => {
    const m = window.__PT__.store.loadMeta();
    return { streak: m.streak, topics: m.v1History.topics.length, hasFA: /Financial Accounting/.test(document.body.textContent) };
  });
  out(`LIVE ${URL}`);
  out(`  booted, console errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  out(`  migration: streak ${info.streak.cur}/${info.streak.best}, v1 topics ${info.topics}`);
  out(`  home shows Financial Accounting: ${info.hasFA}`);
  await page.screenshot({ path: join(ROOT, 'docs/screens/live-home.png') });
  const ok = errs.length === 0 && info.streak.cur === 3 && info.topics === 3 && info.hasFA;
  out(ok ? '\nLIVE SMOKE PASS — the deployed app boots and migrates on a phone viewport' : '\nLIVE SMOKE FAIL');
  process.exitCode = ok ? 0 : 1;
} finally { await browser.close(); }
