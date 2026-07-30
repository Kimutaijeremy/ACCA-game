// app.js — Paper Trail app shell (phone-first). Renders what exists honestly over the engine.
// No build step: this module imports the engine and content directly and is served static.

import {
  loadGraph, LearnerStore, deriveAll, readV3FromStore, applyMigration, paperStatuses,
} from './src/engine/index.js';
import {
  LESSONS_BY_PAPER, lessonForConcept, hasLesson,
} from './src/content/lessons/index.js';
import { conceptComplete } from './src/content/items/index.js';

const PAPER_NAMES = {
  BT: 'Business and Technology', MA: 'Management Accounting', FA: 'Financial Accounting',
  LW: 'Corporate and Business Law', TX: 'Taxation', FR: 'Financial Reporting',
  PM: 'Performance Management', FM: 'Financial Management', AA: 'Audit and Assurance',
};
const AREA_NAMES = { // FA study-guide areas, for section dividers
  A: 'Context & purpose', B: 'Qualitative characteristics', C: 'Double entry & systems',
  D: 'Recording transactions', E: 'Trial balance', F: 'Financial statements',
  G: 'Consolidations', H: 'Interpretation',
};

let graph, store, states;
const SESSION = 'app-' + Date.now();
const app = document.getElementById('app');

// ---------- tiny helpers ----------
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
function renderBody(text) {
  let html = ''; let list = false;
  for (const raw of String(text).split('\n')) {
    const t = raw.trim();
    if (t.startsWith('•')) { if (!list) { html += '<ul>'; list = true; } html += `<li>${inline(t.slice(1).trim())}</li>`; }
    else { if (list) { html += '</ul>'; list = false; } if (t) html += `<p>${inline(t)}</p>`; }
  }
  if (list) html += '</ul>';
  return html;
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
}
function download(name, obj) {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
let persistBanner = '';
function onPersistError(info) {
  persistBanner = info.quota
    ? 'Your device storage is full — new progress can’t be saved. Export now to keep it safe.'
    : 'Something stopped your progress saving. Export now to be safe.';
  route();
}

// ---------- boot ----------
async function boot() {
  try {
    graph = loadGraph(await (await fetch('./spec/concepts.json')).json());
    store = new LearnerStore({ onPersistenceError: onPersistError });
    // First cutover: migrate the v1 (v3) data once, only if there is no v4 state yet.
    if (!store.loadMeta()) {
      const v3 = readV3FromStore(window.localStorage);
      await applyMigration(v3 ?? {}, store, { now: Date.now() });
    }
    await refreshStates();
    buildNav();
    window.addEventListener('hashchange', route);
    route();
    // Test/introspection hook (harmless in production): used by tools/preflight.mjs.
    window.__PT__ = { store, graph, refreshStates: async () => { await refreshStates(); route(); } };
  } catch (e) {
    app.innerHTML = `<div class="banner">The app failed to load: ${esc(e.message)}</div>`;
  }
}
async function refreshStates() {
  const log = await store.readLogRecords();
  states = deriveAll(log, { now: Date.now(), conceptIds: graph.liveIds() }).states;
}
// A concept is "available" only when DONE — a lesson AND its question set (standing order §1).
const statuses = () => paperStatuses(graph, states, conceptComplete);
const stateOf = (id) => states.get(id)?.state ?? 'Unvisited';

// ---------- shared bits ----------
const headerHTML = '<header><span class="brand">PAPER TRAIL <span class="tick">✓</span></span>'
  + '<span class="sub">ACCA · Knowledge</span></header>';
function badge(state) {
  const cls = state.toLowerCase();
  return `<span class="badge ${cls}">${state === 'Unvisited' ? 'not started' : esc(state)}</span>`;
}
function bannerHTML() {
  if (!persistBanner) return '';
  return `<div class="banner">${esc(persistBanner)} <button class="btn ghost small" data-act="export">Export now</button></div>`;
}

// ---------- screens ----------
function screenHome() {
  const rows = statuses().map((s) => {
    const name = PAPER_NAMES[s.paper] ?? s.paper;
    if (s.locked) {
      return `<div class="card flat locked"><div class="row"><span class="nm">${esc(name)}</span>`
        + '<span class="badge">locked</span></div>'
        + `<div class="reason">${esc(s.reason)}</div></div>`;
    }
    if (s.contentStatus === 'not-built') {
      return `<div class="card flat empty"><div class="row"><span class="nm">${esc(name)}</span>`
        + '<span class="badge">open</span></div>'
        + '<div class="progress">content not built yet</div></div>';
    }
    const { built, total } = s.progress;
    const pct = total ? Math.round((built / total) * 100) : 0;
    return `<button class="card tap" data-act="paper" data-paper="${s.paper}"><div class="row">`
      + `<span class="nm">${esc(name)}</span><span class="progress">${built} / ${total}</span></div>`
      + `<div class="progress">${built} of ${total} concepts available${s.opens.length ? ' · grows into ' + s.opens.join(', ') : ''}</div>`
      + `<div class="bar"><i style="width:${pct}%"></i></div></button>`;
  }).join('');
  app.innerHTML = headerHTML + bannerHTML()
    + '<div class="eyebrow">Your papers</div><h1>Learn the ACCA, one concept at a time.</h1>'
    + '<p class="muted small">Papers open as you master what comes before them. Questions and simulated exams are being built — lessons are live now.</p>'
    + rows;
}

function screenPaper(paper) {
  const ids = graph.conceptsForPaper(paper);
  const st = statuses().find((s) => s.paper === paper);
  let lastArea = '';
  const rows = ids.map((id) => {
    const c = graph.get(id);
    const area = (c.outcome.split(' ')[1] || '')[0] || '';
    let head = '';
    if (area && area !== lastArea) {
      lastArea = area;
      head = `<div class="divider">Area ${area}${AREA_NAMES[area] ? ' — ' + AREA_NAMES[area] : ''}</div>`;
    }
    if (hasLesson(id)) {
      return head + `<button class="card tap" data-act="concept" data-id="${id}"><div class="row">`
        + `<span class="nm">${esc(c.name)}</span>${badge(stateOf(id))}</div></button>`;
    }
    return head + `<div class="card flat empty"><div class="row"><span class="nm muted">${esc(c.name)}</span>`
      + '<span class="progress">lesson coming</span></div></div>';
  }).join('');
  app.innerHTML = headerHTML + bannerHTML()
    + '<a class="back" data-act="home" href="#/">Papers</a>'
    + `<div class="eyebrow">${esc(paper)}</div><h1>${esc(PAPER_NAMES[paper])}</h1>`
    + `<p class="progress">${st.progress.built} of ${st.progress.total} concepts available</p>`
    + rows;
}

function screenConcept(id) {
  const c = graph.get(id); const L = lessonForConcept(id);
  if (!L) { location.hash = '#/paper/' + graph.get(id).paper; return; }
  const read = states.get(id) && states.get(id).state !== 'Unvisited';
  const keypoints = L.keypoints.map((k) => `<div class="keypoint"><div class="kt">${esc(k.title)}</div>${renderBody(k.body)}</div>`).join('');
  const steps = L.worked.steps.map((s) => `<li>${inline(s)}</li>`).join('');
  app.innerHTML = headerHTML + bannerHTML()
    + `<a class="back" data-act="paper" data-paper="${c.paper}" href="#/paper/${c.paper}">${esc(PAPER_NAMES[c.paper])}</a>`
    + `<div class="eyebrow">${esc(c.paper)} · ${esc(c.outcome)}</div><h1>${esc(c.name)}</h1>`
    + `<div class="rowbtns">${badge(stateOf(id))}`
    + `<button class="flagbtn" data-act="flag" data-kind="lesson" data-id="${id}">Flag</button></div>`
    + '<div class="eyebrow">Lesson</div>' + renderBody(L.story)
    + keypoints
    + `<div class="worked"><div class="eyebrow">Worked example</div><p><strong>${inline(L.worked.prompt)}</strong></p>`
    + `<ol>${steps}</ol><div class="answer"><strong>Answer.</strong> ${inline(L.worked.answer)}</div></div>`
    + `<p class="breath">In one breath: ${inline(L.compression)}</p>`
    + `<p class="forward">${inline(L.forwardPointer)}</p>`
    + '<div class="divider">Practice</div>'
    + '<p><span class="pill">Concept check — questions coming</span></p>'
    + `<button class="btn block" data-act="read" data-id="${id}" ${read ? 'disabled' : ''}>${read ? 'Lesson read ✓' : 'Mark this lesson as read'}</button>`;
}

function screenDashboard() {
  const ss = statuses();
  // build-progress bars (papers with a content track)
  const bars = ss.filter((s) => LESSONS_BY_PAPER[s.paper]).map((s) => {
    const { built, total } = s.progress; const pct = total ? Math.round((built / total) * 100) : 0;
    return `<div class="card flat"><div class="row"><span class="nm">${esc(PAPER_NAMES[s.paper])}</span>`
      + `<span class="progress">${built} / ${total}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  // concept-state tally across the concepts that have lessons
  const authored = [...Object.values(LESSONS_BY_PAPER)].flat().map((l) => l.conceptId);
  const tally = {};
  authored.forEach((id) => { const s = stateOf(id); tally[s] = (tally[s] || 0) + 1; });
  const tallyHTML = Object.entries(tally).map(([k, v]) => `<div class="hrow"><span>${esc(k === 'Unvisited' ? 'Not started' : k)}</span><b>${v}</b></div>`).join('')
    || '<p class="muted small">No lessons yet.</p>';
  // v1 history from migration
  const hist = store.loadMeta()?.v1History;
  let histHTML = '';
  if (hist && hist.topics.length) {
    histHTML = '<h2>Your v1 history</h2><p class="muted small">Carried over from the old app — a record, not counted toward mastery.</p><div class="hist">'
      + hist.topics.map((t) => `<div class="hrow"><span>${esc(t.name)}</span><b>${t.correct}/${t.seen}</b></div>`).join('')
      + `<div class="hrow"><span>Streak</span><b>${store.loadMeta().streak.cur} (best ${store.loadMeta().streak.best})</b></div></div>`;
  }
  app.innerHTML = headerHTML + bannerHTML()
    + '<a class="back" data-act="home" href="#/">Papers</a><div class="eyebrow">Dashboard</div><h1>Where you stand</h1>'
    + '<h2>Build progress</h2>' + bars
    + '<h2>Concept states</h2><div class="hist">' + tallyHTML + '</div>'
    + '<p class="muted small" style="margin-top:12px">Your error profile and exam-readiness numbers appear here once the question banks exist — no placeholder figures until then.</p>'
    + histHTML;
}

function screenData() {
  app.innerHTML = headerHTML + bannerHTML()
    + '<a class="back" data-act="home" href="#/">Papers</a><div class="eyebrow">Your data</div><h1>Back up & restore</h1>'
    + '<p class="muted small">Everything you do is saved on this device. Export a copy to keep it safe or move it.</p>'
    + '<button class="btn block" data-act="export">Export my progress</button>'
    + '<label class="btn ghost block" style="cursor:pointer">Import a backup<input id="imp" type="file" accept="application/json" hidden></label>'
    + '<p id="dmsg" class="muted small"></p>';
  const inp = document.getElementById('imp');
  if (inp) inp.addEventListener('change', importFile);
}

// ---------- actions ----------
async function markRead(id) {
  await store.appendRecords([{ id: 'les-' + id + '-' + Date.now(), kind: 'lesson', conceptIds: [id], sessionId: SESSION, timestamp: Date.now() }]);
  await refreshStates();
  route();
  toast('Lesson marked as read');
}
function openFlagSheet(kind, id) {
  const sheet = document.createElement('div'); sheet.className = 'sheet';
  sheet.innerHTML = '<div class="inner"><div class="eyebrow">Report a problem</div>'
    + '<p class="small muted">One tap — it reaches the author with your export.</p>'
    + '<button class="btn ghost block" data-r="wrong">This is wrong</button>'
    + '<button class="btn ghost block" data-r="confusing">This is confusing</button>'
    + '<button class="btn ghost block" data-r="contradiction">This contradicts something</button>'
    + '<button class="btn ghost block" data-r="">Cancel</button></div>';
  sheet.addEventListener('click', (e) => {
    const r = e.target.getAttribute && e.target.getAttribute('data-r');
    if (r === null) { if (e.target === sheet) sheet.remove(); return; }
    if (r) {
      store.addFlag({ id: 'flag-' + Date.now(), target: { kind, conceptId: kind === 'lesson' ? id : null, itemId: kind === 'item' ? id : null }, reason: r, sessionId: SESSION, timestamp: Date.now() });
      toast('Flagged — thank you');
    }
    sheet.remove();
  });
  document.body.appendChild(sheet);
}
async function exportState() { download('paper-trail-export.json', await store.exportAll()); toast('Exported'); }
function importFile(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = async () => {
    try {
      await store.importAll(JSON.parse(r.result));
      await refreshStates(); persistBanner = ''; route(); toast('Progress restored');
    } catch { const m = document.getElementById('dmsg'); if (m) { m.textContent = 'That file is not a Paper Trail export.'; } }
  };
  r.readAsText(f);
}

// ---------- routing ----------
function buildNav() {
  const nav = document.createElement('nav'); nav.className = 'tabs';
  nav.innerHTML = '<button data-act="home">Papers</button><button data-act="dashboard">Dashboard</button><button data-act="data">Data</button>';
  document.body.appendChild(nav);
}
function setNav(active) {
  document.querySelectorAll('nav.tabs button').forEach((b) => b.classList.toggle('on', b.getAttribute('data-act') === active));
}
function route() {
  const h = location.hash;
  if (h.startsWith('#/paper/')) { screenPaper(h.slice(8)); setNav('home'); }
  else if (h.startsWith('#/concept/')) { screenConcept(h.slice(10)); setNav('home'); }
  else if (h === '#/dashboard') { screenDashboard(); setNav('dashboard'); }
  else if (h === '#/data') { screenData(); setNav('data'); }
  else { screenHome(); setNav('home'); }
  window.scrollTo(0, 0);
}

// global click handling (delegation)
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const act = t.getAttribute('data-act');
  if (act === 'home') { e.preventDefault(); location.hash = '#/'; }
  else if (act === 'dashboard') { location.hash = '#/dashboard'; }
  else if (act === 'data') { location.hash = '#/data'; }
  else if (act === 'paper') { e.preventDefault(); location.hash = '#/paper/' + t.getAttribute('data-paper'); }
  else if (act === 'concept') { location.hash = '#/concept/' + t.getAttribute('data-id'); }
  else if (act === 'read') { markRead(t.getAttribute('data-id')); }
  else if (act === 'flag') { openFlagSheet(t.getAttribute('data-kind'), t.getAttribute('data-id')); }
  else if (act === 'export') { exportState(); }
});

boot();
