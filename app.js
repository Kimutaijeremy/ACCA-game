// app.js — Paper Trail app shell (phone-first). Renders what exists honestly over the engine.
// No build step: this module imports the engine and content directly and is served static.

import {
  loadGraph, LearnerStore, deriveAll, deriveConcept, readV3FromStore, applyMigration, paperStatuses,
  instantiate, diagnose, REMEDIATION,
} from './src/engine/index.js';
import {
  LESSONS_BY_PAPER, lessonForConcept, hasLesson,
} from './src/content/lessons/index.js';
import { conceptComplete, hasQuestionSet, itemsForConcept } from './src/content/items/index.js';

// Human-readable names for the seven diagnostic causes (Brief §6.5) — shown when an answer is wrong.
const CAUSE_LABEL = {
  knowledge_gap: 'Knowledge gap',
  conceptual_misunderstanding: 'Conceptual mix-up',
  calculation_error: 'Calculation slip',
  requirement_misread: 'Misread the requirement',
  incorrect_treatment: 'Wrong accounting treatment',
  careless_slip: 'Careless slip',
  transfer_failure: 'Trouble transferring to a new context',
};
// Order a concept's set is served in: recognition first, then application, exam level, then stretch.
const RUNG_ORDER = ['concept-check', 'guided', 'standard', 'stretch'];
const RUNG_LABEL = { 'concept-check': 'Concept check', guided: 'Guided', standard: 'Standard', stretch: 'Stretch' };

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
    window.__PT__ = {
      store, graph, refreshStates: async () => { await refreshStates(); route(); },
      curItem: () => (drill ? drill.instance : null), // test hook: current served question
      stateOf,
    };
  } catch (e) {
    app.innerHTML = `<div class="banner">The app failed to load: ${esc(e.message)}</div>`;
  }
}
let errorProfile = {}; // diagnosed-cause tally across wrong attempts (Brief §6.8 error-cause profile)
let attemptTally = { attempts: 0, correct: 0 };
async function refreshStates() {
  const log = await store.readLogRecords();
  states = deriveAll(log, { now: Date.now(), conceptIds: graph.liveIds() }).states;
  errorProfile = {}; attemptTally = { attempts: 0, correct: 0 };
  for (const r of log) {
    if (r.kind !== 'item') continue;
    attemptTally.attempts += 1;
    if (r.correct) attemptTally.correct += 1;
    else if (r.cause) errorProfile[r.cause] = (errorProfile[r.cause] || 0) + 1;
  }
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
    + '<p class="muted small">Papers open as you master what comes before them. Read a lesson, then practise its questions to move it up the mastery states. Simulated exams are still being built.</p>'
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
    + `<button class="btn block" data-act="read" data-id="${id}" ${read ? 'disabled' : ''}>${read ? 'Lesson read ✓' : 'Mark this lesson as read'}</button>`
    + (hasQuestionSet(id)
      ? `<button class="btn ghost block" data-act="drill" data-id="${id}">Practise — ${itemsForConcept(id).length} questions</button>`
        + (read ? '' : '<p class="muted small">Read the lesson first — your state moves up as you answer.</p>')
      : '<p><span class="pill">Questions coming</span></p>');
}

function errorProfileHTML() {
  const entries = Object.entries(errorProfile).sort((a, b) => b[1] - a[1]);
  if (!attemptTally.attempts) return '';
  const pct = Math.round((attemptTally.correct / attemptTally.attempts) * 100);
  let html = `<h2>Your practice</h2><div class="hist"><div class="hrow"><span>Questions answered</span><b>${attemptTally.attempts}</b></div>`
    + `<div class="hrow"><span>Correct</span><b>${attemptTally.correct} (${pct}%)</b></div></div>`;
  if (entries.length) {
    html += '<h2>Where you slip</h2><p class="muted small">Diagnosed causes of your wrong answers — what to work on.</p><div class="hist">'
      + entries.map(([c, n]) => `<div class="hrow"><span>${esc(CAUSE_LABEL[c] || c)}</span><b>${n}</b></div>`).join('')
      + '</div>';
  }
  return html;
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
    + errorProfileHTML()
    + '<p class="muted small" style="margin-top:12px">Exam-readiness numbers appear here once the sealed simulation pools are built — no placeholder figures until then.</p>'
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

// ---------- drill runner ----------
// Serves a concept's questions one at a time, logs each attempt truthfully, diagnoses the wrong
// ones and routes to the repair, and lets you watch the concept climb the mastery states. Every
// number the engine derives comes from the attempt records this writes — nothing is set directly.
let drill = null;

function buildQueue(id) {
  const items = itemsForConcept(id).filter((it) => RUNG_ORDER.includes(it.rung));
  items.sort((a, b) => RUNG_ORDER.indexOf(a.rung) - RUNG_ORDER.indexOf(b.rung));
  return items;
}
function serveCurrent() {
  const item = drill.queue[drill.i];
  const seed = (Math.floor(Math.random() * 0x7fffffff)) >>> 0; // fresh numbers for parameterized items
  drill.instance = instantiate(item, seed);
  drill.shownAt = Date.now();
  drill.chosen = null;
  drill.usedHint = false;
  drill.phase = 'ask';
  drill.result = null;
}
function startDrill(id) {
  const queue = buildQueue(id);
  if (!queue.length) { location.hash = '#/concept/' + id; return; }
  drill = { id, queue, i: 0, correctCount: 0, answered: 0 };
  serveCurrent();
  route();
}

// A short, honest line about what the next mastery state needs — read from the derived evidence.
function nextStepHint(id) {
  const s = states.get(id);
  if (!s) return '';
  const e = s.evidence || {};
  switch (s.state) {
    case 'Unvisited': return 'Mark the lesson as read to start — then answers move you up.';
    case 'Exposed': {
      const answered = (e.conceptCheck || []).length; const right = (e.conceptCheck || []).filter(Boolean).length;
      return `To reach Understood: get 2 of 3 concept-checks right (so far ${right} right of ${answered} in the window).`;
    }
    case 'Understood': return `To reach Practised: 3 guided answers correct (so far ${e.guidedCorrect || 0} of 3).`;
    case 'Practised': {
      const w = e.standardWindow || []; const right = w.filter((a) => a.correct).length;
      return `To reach Competent: 4 of your last 5 Standard answers right, within the time budget (window ${right}/${w.length}).`;
    }
    case 'Competent': return 'To reach Mastered: stretch questions across two sessions at least 3 days apart.';
    default: return 'Mastered — keep it fresh with reviews when they fall due.';
  }
}

function screenDrill() {
  if (!drill) { location.hash = '#/'; return; }
  const id = drill.id; const c = graph.get(id); const inst = drill.instance;
  const head = headerHTML + bannerHTML()
    + `<a class="back" data-act="concept" data-id="${id}" href="#/concept/${id}">${esc(c.name)}</a>`
    + `<div class="eyebrow">${esc(c.paper)} · ${RUNG_LABEL[inst.rung]} · ${drill.i + 1} of ${drill.queue.length}</div>`
    + `<div class="rowbtns">${badge(stateOf(id))}<button class="flagbtn" data-act="flag" data-kind="item" data-id="${inst.itemId}">Flag</button></div>`;

  const opts = inst.options.map((o, idx) => {
    const label = String.fromCharCode(65 + idx); // A/B/C by POSITION, not by id (options are shuffled)
    let cls = 'opt';
    if (drill.phase === 'feedback') {
      if (o.id === inst.answerId) cls += ' correct';
      else if (o.id === drill.chosen) cls += ' wrong';
      else cls += ' dim';
    } else if (o.id === drill.chosen) cls += ' chosen';
    const dis = drill.phase === 'feedback' ? 'disabled' : '';
    return `<button class="${cls}" data-act="opt" data-opt="${o.id}" ${dis}><span class="ol">${label}</span>${inline(o.text)}</button>`;
  }).join('');

  let body = `<div class="qstem">${inline(inst.stem)}</div><div class="opts">${opts}</div>`;

  if (drill.phase === 'ask') {
    if (inst.scaffold && inst.scaffold.length) {
      body += drill.usedHint
        ? `<div class="hint"><div class="eyebrow">Hint</div><ol>${inst.scaffold.map((h) => `<li>${inline(h)}</li>`).join('')}</ol></div>`
        : '<button class="btn ghost small" data-act="hint">Show a hint</button>';
    }
    body += `<button class="btn block" data-act="check" ${drill.chosen ? '' : 'disabled'}>Check my answer</button>`;
  } else {
    const r = drill.result;
    const verdict = r.correct
      ? '<div class="verdict ok">✓ Correct</div>'
      : '<div class="verdict no">✗ Not quite</div>';
    let fb = verdict + `<div class="rationale">${inline(inst.rationale || '')}</div>`;
    if (!r.correct && r.diagnosis) {
      const d = r.diagnosis; const rem = REMEDIATION[d.cause] || {};
      const acts = (rem.actions || []).map((a) => `<li>${esc(a)}</li>`).join('');
      fb += `<div class="diag"><div class="eyebrow">Likely cause</div>`
        + `<div class="cause">${esc(CAUSE_LABEL[d.cause] || d.cause)}</div>`
        + (d.needsProbe ? '<p class="small muted">Best guess for now — a couple more answers will sharpen it.</p>' : '')
        + `<div class="eyebrow" style="margin-top:8px">The fix</div><ul>${acts}</ul>`
        + (rem.route === 'reopen_lesson' ? `<button class="btn ghost small" data-act="concept" data-id="${id}">Reopen the lesson</button>` : '')
        + '</div>';
    }
    if (r.promoted) {
      fb += `<div class="promote">▲ You’ve reached <b>${esc(r.newState)}</b></div>`;
    }
    const last = drill.i >= drill.queue.length - 1;
    fb += `<button class="btn block" data-act="next">${last ? 'Finish' : 'Next question'}</button>`;
    body += fb;
  }

  body += `<p class="progress" style="margin-top:14px">${esc(nextStepHint(id))}</p>`;
  app.innerHTML = head + body;
}

function chooseOption(oid) {
  if (!drill || drill.phase !== 'ask') return;
  drill.chosen = oid;
  screenDrill();
}
async function submitAnswer() {
  if (!drill || drill.phase !== 'ask' || !drill.chosen) return;
  const id = drill.id; const inst = drill.instance;
  const timeMs = Date.now() - drill.shownAt;
  const withinBudget = timeMs <= inst.budgetMs;
  const correct = drill.chosen === inst.answerId;

  // Diagnose BEFORE writing the new record, using the concept's prior attempts for pattern inference.
  let diagnosis = null;
  if (!correct) {
    const log = await store.readLogRecords();
    const prior = log.filter((r) => r.kind === 'item' && r.conceptIds.includes(id));
    diagnosis = diagnose({
      attempt: {
        correct: false, rung: inst.rung, distractor: drill.chosen,
        timeMs, withinBudget, timed: false, itemId: inst.itemId, conceptIds: inst.conceptIds,
      },
      item: { distractors: inst.distractors },
      prior,
      context: { conceptState: stateOf(id), budgetMs: inst.budgetMs },
    });
  }

  const prevRank = states.get(id)?.rank ?? 0;
  await store.appendRecords([{
    id: 'att-' + inst.itemId + '-' + Date.now(),
    kind: 'item', itemId: inst.itemId, conceptIds: inst.conceptIds,
    rung: inst.rung, scaffold: drill.usedHint === true,
    timeMs, withinBudget, timed: false, correct,
    distractor: correct ? null : drill.chosen,
    cause: diagnosis ? diagnosis.cause : null,
    confidence: diagnosis ? diagnosis.confidence : null,
    sessionId: SESSION, timestamp: Date.now(),
  }]);
  await refreshStates();

  const newRank = states.get(id)?.rank ?? 0;
  drill.answered += 1;
  if (correct) drill.correctCount += 1;
  drill.result = { correct, diagnosis, promoted: newRank > prevRank, newState: stateOf(id) };
  drill.phase = 'feedback';
  screenDrill();
}
function nextQuestion() {
  if (!drill) return;
  if (drill.i >= drill.queue.length - 1) { finishDrill(); return; }
  drill.i += 1;
  serveCurrent();
  screenDrill();
}
function finishDrill() {
  const id = drill.id; const c = graph.get(id);
  const { correctCount, answered } = drill;
  app.innerHTML = headerHTML + bannerHTML()
    + `<a class="back" data-act="paper" data-paper="${c.paper}" href="#/paper/${c.paper}">${esc(PAPER_NAMES[c.paper])}</a>`
    + '<div class="eyebrow">Practice complete</div>'
    + `<h1>${esc(c.name)}</h1>`
    + `<div class="rowbtns">${badge(stateOf(id))}</div>`
    + `<p>You got <b>${correctCount} of ${answered}</b> right this session.</p>`
    + `<p class="progress">${esc(nextStepHint(id))}</p>`
    + `<button class="btn block" data-act="drill" data-id="${id}">Practise again</button>`
    + `<button class="btn ghost block" data-act="concept" data-id="${id}">Back to the lesson</button>`;
  drill = null;
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
  if (h.startsWith('#/drill/')) {
    const id = h.slice(8);
    if (!drill || drill.id !== id) startDrill(id); else screenDrill();
    setNav('home');
  } else if (h.startsWith('#/paper/')) { screenPaper(h.slice(8)); setNav('home'); }
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
  else if (act === 'drill') {
    const id = t.getAttribute('data-id'); const target = '#/drill/' + id;
    if (location.hash === target) startDrill(id); else location.hash = target; // same hash won't fire hashchange
  } else if (act === 'opt') { chooseOption(t.getAttribute('data-opt')); }
  else if (act === 'hint') { if (drill) { drill.usedHint = true; screenDrill(); } }
  else if (act === 'check') { submitAnswer(); }
  else if (act === 'next') { nextQuestion(); }
});

boot();
