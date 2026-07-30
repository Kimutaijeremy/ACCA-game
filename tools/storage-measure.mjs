// storage-measure.mjs — MEASURE storage before deciding anything (Jeremy's Item 2).
// Reports, in a real headless Chrome:
//   - serialised size of the attempt log at 10k / 25k / 50k attempts
//   - the attempt count / byte size at which a localStorage write starts failing
//   - write latency at 10k / 25k / 50k, CPU-throttled to ~mid-range phone
// No storage architecture is changed here — this only produces the numbers.
//
// Run: npm run measure:storage

import http from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const out = (s = '') => process.stdout.write(s + '\n');
const kb = (b) => (b / 1024).toFixed(0) + ' KB';
const mb = (b) => (b / (1024 * 1024)).toFixed(2) + ' MB';

const server = await new Promise((resolve) => {
  const s = http.createServer((req, res) => {
    try {
      const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
      const p = join(ROOT, rel);
      if (!statSync(p).isFile()) throw 0;
      res.writeHead(200, { 'content-type': MIME[p.slice(p.lastIndexOf('.'))] ?? 'application/octet-stream' });
      res.end(readFileSync(p));
    } catch { res.writeHead(404); res.end('nf'); }
  });
  s.listen(0, () => resolve(s));
});
const port = server.address().port;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/test/browser/harness.html`);
await page.waitForFunction('window.__READY__ === true');

try {
  const liveIds = await page.evaluate(async () => (await window.PT.loadGraph()).liveIds());

  out('STORAGE MEASUREMENT (headless Chrome, real localStorage)\n');

  // 1. Serialised size of the attempt log at realistic scales.
  out('1. Serialised size of the learner state (attempt log dominates):');
  const sizes = await page.evaluate(({ liveIds }) => {
    const { store, log, synthLog } = window.PT;
    const enc = new TextEncoder();
    const rows = [];
    for (const n of [10000, 25000, 50000]) {
      const st = store.emptyState();
      st.attemptLog = new log.AttemptLog(synthLog(liveIds, n)).toJSON();
      const bytes = enc.encode(JSON.stringify(st)).length;
      rows.push({ n, bytes, perAttempt: bytes / n });
    }
    return rows;
  }, { liveIds });
  for (const r of sizes) out(`   ${String(r.n).padStart(6)} attempts → ${mb(r.bytes)} (${kb(r.bytes)}), ~${r.perAttempt.toFixed(0)} bytes/attempt`);

  // 2. The point at which a localStorage write fails (quota). Scan real saves on clean storage.
  out('\n2. Write-failure point (localStorage quota, clean origin):');
  const fail = await page.evaluate(({ liveIds }) => {
    const { store, log, synthLog } = window.PT;
    const enc = new TextEncoder();
    window.localStorage.clear();
    let lastOk = null;
    for (let n = 5000; n <= 200000; n += 5000) {
      const st = store.emptyState();
      st.attemptLog = new log.AttemptLog(synthLog(liveIds, n)).toJSON();
      const json = JSON.stringify(st);
      const bytes = enc.encode(json).length;
      // measure raw localStorage capacity for the OLD single-blob approach (the evidence that
      // justified moving the log to IndexedDB) — write the blob directly, not via the store.
      let ok = true; let quota = false;
      try { window.localStorage.setItem('__pt_probe__', json); }
      catch (e) { ok = false; quota = store.isQuotaError(e); }
      if (!ok) return { firstFailN: n, firstFailBytes: bytes, quota, lastOk };
      lastOk = { n, bytes };
      window.localStorage.removeItem('__pt_probe__');
    }
    return { firstFailN: null, lastOk };
  }, { liveIds });
  if (fail.firstFailN) {
    out(`   largest write that SUCCEEDED : ${String(fail.lastOk.n).padStart(6)} attempts (${mb(fail.lastOk.bytes)})`);
    out(`   first write that FAILED      : ${String(fail.firstFailN).padStart(6)} attempts (${mb(fail.firstFailBytes)})  quota=${fail.quota}`);
  } else {
    out(`   no failure up to 200000 attempts (${mb(fail.lastOk.bytes)}) — localStorage did not reject`);
  }

  // 3. Write latency, CPU-throttled to ~mid-range phone.
  out('\n3. Write latency (JSON.stringify + localStorage.setItem), 4x CPU throttle (~phone):');
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const lat = await page.evaluate(({ liveIds }) => {
    const { store, log, synthLog } = window.PT;
    const rows = [];
    for (const n of [10000, 25000, 50000]) {
      window.localStorage.clear();
      const st = store.emptyState();
      st.attemptLog = new log.AttemptLog(synthLog(liveIds, n)).toJSON();
      const t0 = performance.now();
      let ok = true; let quota = false;
      try { window.localStorage.setItem('__pt_probe__', JSON.stringify(st)); }
      catch (e) { ok = false; quota = store.isQuotaError(e); }
      const ms = performance.now() - t0;
      rows.push({ n, ms, ok, quota });
      window.localStorage.clear();
    }
    return rows;
  }, { liveIds });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  for (const r of lat) {
    out(`   ${String(r.n).padStart(6)} attempts → ${r.ok ? r.ms.toFixed(1) + ' ms' : 'WRITE FAILED (quota=' + r.quota + ')'}`);
  }
} finally {
  await browser.close();
  server.close();
}
