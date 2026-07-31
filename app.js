// app.js — Paper Trail app shell (phone-first), Amendment A6.
// Teaching layer = topic pages (one per sub-area). Main event = mixed sets of ten drawn to the
// exam's area weighting. Completion = the 8-of-last-10 topic rule. Concepts stay the tagging spine;
// diagnosis, mastery states, review and decay run underneath. No build step: this module imports
// the engine and content directly and is served static.

import {
  loadGraph, LearnerStore, deriveAll, readV3FromStore, applyMigration,
  paperStatusesByTopic, paperTopicSummary, assembleSet, rollingAverage, topicHint,
  defaultAreaWeights, topicIdForConcept, deeperSectionForConcept, instantiate, diagnose, REMEDIATION, makeRng,
} from './src/engine/index.js';
import { TOPICS_BY_PAPER, topicById, hasTopic } from './src/content/topics/index.js';
import { ITEMS_BY_PAPER, itemsForConcept } from './src/content/items/index.js';

const PAPER_NAMES = {
  BT: 'Business and Technology', MA: 'Management Accounting', FA: 'Financial Accounting',
  LW: 'Corporate and Business Law', TX: 'Taxation', FR: 'Financial Reporting',
  PM: 'Performance Management', FM: 'Financial Management', AA: 'Audit and Assurance',
};
const CAUSE_LABEL = {
  knowledge_gap: 'Knowledge gap', conceptual_misunderstanding: 'Conceptual mix-up',
  calculation_error: 'Calculation slip', requirement_misread: 'Misread the requirement',
  incorrect_treatment: 'Wrong accounting treatment', careless_slip: 'Careless slip',
  transfer_failure: 'Trouble transferring to a new context',
};

let graph, syllabus, store, states;
const SESSION = 'app-' + Date.now();
const app = document.getElementById('app');

// ---------- helpers ----------
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
    syllabus = await (await fetch('./spec/syllabus-outcomes.json')).json();
    store = new LearnerStore({ onPersistenceError: onPersistError });
    if (!store.loadMeta()) {
      const v3 = readV3FromStore(window.localStorage);
      await applyMigration(v3 ?? {}, store, { now: Date.now() });
    }
    await refreshAll();
    buildNav();
    window.addEventListener('hashchange', route);
    route();
    window.__PT__ = {
      store, graph, refreshAll: async () => { await refreshAll(); route(); },
      curItem: () => (play ? play.instance : null), stateOf,
    };
  } catch (e) {
    app.innerHTML = `<div class="banner">The app failed to load: ${esc(e.message)}</div>`;
  }
}

let logRecords = [];
let errorProfile = {};
let attemptTally = { attempts: 0, correct: 0 };
async function refreshAll() {
  logRecords = await store.readLogRecords();
  states = deriveAll(logRecords, { now: Date.now(), conceptIds: graph.liveIds() }).states;
  errorProfile = {}; attemptTally = { attempts: 0, correct: 0 };
  for (const r of logRecords) {
    if (r.kind !== 'item') continue;
    attemptTally.attempts += 1;
    if (r.correct) attemptTally.correct += 1;
    else if (r.cause) errorProfile[r.cause] = (errorProfile[r.cause] || 0) + 1;
  }
}
const statuses = () => paperStatusesByTopic(graph, syllabus, logRecords, hasTopic, states);
const stateOf = (id) => states.get(id)?.state ?? 'Unvisited';
const summaryFor = (paper) => paperTopicSummary(logRecords, graph, syllabus, paper, states);

// A set of ten can only be "exam-shaped" once the bank spans enough of the paper. Below that, the
// verdict is misleading, so we suppress it and say plainly how much is built. Judgement call: a
// paper's sets become representative once >=60% of its sub-areas have a topic page.
const REPRESENTATIVE_MIN = 0.6;
const topicsBuilt = (paper) => (TOPICS_BY_PAPER[paper] ?? []).length;
const topicsTotal = (paper) => (syllabus.subareas[paper] ?? []).length;
const isRepresentative = (paper) => topicsTotal(paper) > 0 && topicsBuilt(paper) / topicsTotal(paper) >= REPRESENTATIVE_MIN;
const builtLabel = (paper) => `${topicsBuilt(paper)} of ${topicsTotal(paper)} ${paper} topics built`;
function avgLabel(paper, { compact = false } = {}) {
  const avg = rollingAverage(store.setResults(), paper);
  if (avg == null) return compact ? 'no sets yet' : '';
  return compact ? `avg ${avg.toFixed(1)}/10 so far` : `rolling average ${avg.toFixed(1)}/10 across topics built so far`;
}

// ---------- shared bits ----------
const headerHTML = '<header><span class="brand">PAPER TRAIL <span class="tick">✓</span></span>'
  + '<span class="sub">ACCA · Knowledge</span></header>';
function bannerHTML() {
  if (!persistBanner) return '';
  return `<div class="banner">${esc(persistBanner)} <button class="btn ghost small" data-act="export">Export now</button></div>`;
}
function topicTitle(topicId) { return topicById(topicId)?.title ?? topicId; }

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
        + '<span class="badge">open</span></div><div class="progress">content not built yet</div></div>';
    }
    const { complete, total } = s.progress;
    const pct = total ? Math.round((complete / total) * 100) : 0;
    const avgTxt = avgLabel(s.paper, { compact: true });
    return `<button class="card tap" data-act="paper" data-paper="${s.paper}"><div class="row">`
      + `<span class="nm">${esc(name)}</span><span class="progress">${complete}/${total} topics</span></div>`
      + `<div class="progress">${complete} of ${total} topics complete${s.progress.stale ? ` · ${s.progress.stale} need revision` : ''} · ${avgTxt}`
      + `${s.opens.length ? ' · unlocks ' + s.opens.join(', ') : ''}</div>`
      + `<div class="bar"><i style="width:${pct}%"></i></div></button>`;
  }).join('');
  app.innerHTML = headerHTML + bannerHTML()
    + '<div class="eyebrow">Your papers</div><h1>Practise the ACCA, one set at a time.</h1>'
    + '<p class="muted small">Skim a topic to refresh it, then drill mixed sets of ten. A topic completes when 8 of your last 10 questions on it are right, across two sessions. Papers unlock as you complete them.</p>'
    + rows;
}

function screenPaper(paper) {
  const sum = summaryFor(paper);
  const subs = syllabus.subareas[paper] ?? [];
  const byArea = {};
  for (const sub of subs) { const a = sub.split(' ')[1][0]; (byArea[a] ||= []).push(sub); }
  let body = '';
  for (const area of Object.keys(byArea)) {
    body += `<div class="divider">Area ${area}</div>`;
    for (const sub of byArea[area]) {
      const t = sum.topics.find((x) => x.topicId === sub);
      if (hasTopic(sub)) {
        const tick = t.complete ? (t.stale ? '<span class="badge understood">needs revision</span>' : '<span class="badge competent">complete</span>') : '';
        const prog = t.complete ? '' : `<div class="progress">${t.windowCorrect} of last ${Math.max(t.windowSize, 0)} correct${t.windowSize < 10 ? `, ${10 - t.windowSize} more to check` : ''}</div>`;
        body += `<button class="card tap" data-act="topic" data-id="${esc(sub)}"><div class="row">`
          + `<span class="nm">${esc(topicTitle(sub))}</span>${tick}</div>${prog}</button>`;
      } else {
        body += `<div class="card flat empty"><div class="row"><span class="nm muted">${esc(sub)}</span>`
          + '<span class="progress">topic coming</span></div></div>';
      }
    }
  }
  app.innerHTML = headerHTML + bannerHTML()
    + '<a class="back" data-act="home" href="#/">Papers</a>'
    + `<div class="eyebrow">${esc(paper)}</div><h1>${esc(PAPER_NAMES[paper])}</h1>`
    + `<p class="progress">${sum.complete} of ${sum.total} topics complete${avgLabel(paper) ? ` · ${avgLabel(paper)}` : ''}</p>`
    + (isRepresentative(paper) ? '' : `<p class="muted small">Sets aren’t yet exam-representative — ${builtLabel(paper)}. They’ll shape to the exam as more topics are built.</p>`)
    + `<button class="btn block" data-act="set" data-paper="${paper}">Practise a set of 10</button>`
    + body;
}

let deeperFor = null; // topicId whose "Go deeper" layer is expanded
let deeperSection = 0; // section index to scroll to when opened from a repair link

function screenTopic(topicId) {
  const T = topicById(topicId);
  if (!T) { location.hash = '#/'; return; }
  const open = deeperFor === T.topicId;
  const deeperHTML = open
    ? '<div class="divider" id="deeper">Go deeper</div>'
      + T.deeper.map((s, i) => `<div class="deepsec" id="deeper-${i}"><div class="kt">${esc(s.heading)}</div>${renderBody(s.body)}</div>`).join('')
    : `<button class="btn ghost block" data-act="deeper" data-topic="${esc(T.topicId)}">Go deeper</button>`
      + '<p class="muted small">A fuller explanation, shipped in the app — free and offline, for when you’ve blanked on this entirely.</p>';
  app.innerHTML = headerHTML + bannerHTML()
    + `<a class="back" data-act="paper" data-paper="${T.paper}" href="#/paper/${T.paper}">${esc(PAPER_NAMES[T.paper])}</a>`
    + `<div class="eyebrow">${esc(T.paper)} · ${esc(T.topicId)}</div><h1>${esc(T.title)}</h1>`
    + `<div class="rowbtns"><button class="flagbtn" data-act="flag" data-kind="topic" data-id="${esc(T.topicId)}">Flag</button></div>`
    + '<div class="eyebrow">In a nutshell</div>' + renderBody(T.nutshell)
    + '<div class="eyebrow">Exam readiness</div>' + renderBody(T.examReadiness)
    + `<div class="worked"><div class="eyebrow">Worked example</div><p><strong>${inline(T.worked.prompt)}</strong></p>`
    + `<ol>${T.worked.steps.map((s) => `<li>${inline(s)}</li>`).join('')}</ol>`
    + `<div class="answer"><strong>Answer.</strong> ${inline(T.worked.answer)}</div></div>`
    + deeperHTML
    + `<button class="btn block" data-act="set" data-paper="${T.paper}">Practise a set of 10</button>`;
  if (open) {
    const el = document.getElementById(`deeper-${deeperSection}`) || document.getElementById('deeper');
    if (el) el.scrollIntoView({ block: 'start' });
  }
}
function openDeeper(topicId, section = 0) {
  deeperFor = topicId; deeperSection = section;
  store.addDeeperOpen({ id: 'deep-' + Date.now(), topicId, section, at: Date.now(), sessionId: SESSION });
  if (location.hash === '#/topic/' + encodeURIComponent(topicId)) screenTopic(topicId);
  else location.hash = '#/topic/' + encodeURIComponent(topicId);
}

function screenDashboard() {
  const ss = statuses().filter((s) => TOPICS_BY_PAPER[s.paper]);
  const bars = ss.map((s) => {
    const { complete, total } = s.progress; const pct = total ? Math.round((complete / total) * 100) : 0;
    const avgTxt = avgLabel(s.paper, { compact: true });
    return `<div class="card flat"><div class="row"><span class="nm">${esc(PAPER_NAMES[s.paper])}</span>`
      + `<span class="progress">${complete}/${total} topics${avgTxt && avgTxt !== 'no sets yet' ? ` · ${avgTxt}` : ''}</span></div>`
      + `<div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  app.innerHTML = headerHTML + bannerHTML()
    + '<a class="back" data-act="home" href="#/">Papers</a><div class="eyebrow">Dashboard</div><h1>Where you stand</h1>'
    + '<h2>Topics complete</h2>' + bars
    + errorProfileHTML()
    + '<p class="muted small" style="margin-top:12px">Exam-readiness numbers appear here once the sealed simulation pools are built.</p>'
    + v1HistoryHTML();
}
function errorProfileHTML() {
  if (!attemptTally.attempts) return '';
  const pct = Math.round((attemptTally.correct / attemptTally.attempts) * 100);
  const entries = Object.entries(errorProfile).sort((a, b) => b[1] - a[1]);
  let html = `<h2>Your practice</h2><div class="hist"><div class="hrow"><span>Questions answered</span><b>${attemptTally.attempts}</b></div>`
    + `<div class="hrow"><span>Correct</span><b>${attemptTally.correct} (${pct}%)</b></div></div>`;
  if (entries.length) {
    html += '<h2>Where you slip</h2><div class="hist">'
      + entries.map(([c, n]) => `<div class="hrow"><span>${esc(CAUSE_LABEL[c] || c)}</span><b>${n}</b></div>`).join('') + '</div>';
  }
  return html;
}
function v1HistoryHTML() {
  const hist = store.loadMeta()?.v1History;
  if (!hist || !hist.topics.length) return '';
  return '<h2>Your v1 history</h2><p class="muted small">Carried over from the old app — a record, not counted toward mastery.</p><div class="hist">'
    + hist.topics.map((t) => `<div class="hrow"><span>${esc(t.name)}</span><b>${t.correct}/${t.seen}</b></div>`).join('')
    + `<div class="hrow"><span>Streak</span><b>${store.loadMeta().streak.cur} (best ${store.loadMeta().streak.best})</b></div></div>`;
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

// ---------- set runner (the main event) ----------
let play = null;

function startSet(paper) {
  const sum = summaryFor(paper);
  const shortfall = {}; // topicId -> shortfall (higher = more short of completion)
  for (const t of sum.topics) shortfall[t.topicId] = t.complete ? 0 : (11 - t.windowSize);
  const areaOf = (it) => graph.get(it.conceptIds[0]).outcome.split(' ')[1][0];
  const shortfallOf = (it) => shortfall[topicIdForConcept(graph, it.conceptIds[0])] ?? 0;
  const built = assembleSet(ITEMS_BY_PAPER[paper] ?? [], {
    rng: makeRng((Math.floor(Math.random() * 0x7fffffff)) >>> 0),
    size: 10, areaOf, areaWeights: defaultAreaWeights(graph, paper), shortfallOf,
  });
  if (!built.items.length) { toast('No questions for this paper yet'); return; }
  play = { paper, queue: built.items, i: 0, correctCount: 0, answered: 0, examShaped: built.examShaped };
  serveCurrent();
  route();
}
function serveCurrent() {
  const item = play.queue[play.i];
  play.instance = instantiate(item, (Math.floor(Math.random() * 0x7fffffff)) >>> 0);
  play.shownAt = Date.now(); play.chosen = null; play.usedHint = false; play.phase = 'ask'; play.result = null;
}

function screenSet() {
  if (!play) { location.hash = '#/'; return; }
  const inst = play.instance;
  const head = headerHTML + bannerHTML()
    + `<a class="back" data-act="paper" data-paper="${play.paper}" href="#/paper/${play.paper}">${esc(PAPER_NAMES[play.paper])}</a>`
    + `<div class="eyebrow">${esc(play.paper)} · set of 10 · question ${play.i + 1} of ${play.queue.length}</div>`
    + `<div class="rowbtns"><span class="progress">score ${play.correctCount}/${play.answered}</span>`
    + `<button class="flagbtn" data-act="flag" data-kind="item" data-id="${inst.itemId}">Flag</button></div>`;
  const opts = inst.options.map((o, idx) => {
    const label = String.fromCharCode(65 + idx);
    let cls = 'opt';
    if (play.phase === 'feedback') {
      if (o.id === inst.answerId) cls += ' correct';
      else if (o.id === play.chosen) cls += ' wrong';
      else cls += ' dim';
    } else if (o.id === play.chosen) cls += ' chosen';
    return `<button class="${cls}" data-act="opt" data-opt="${o.id}" ${play.phase === 'feedback' ? 'disabled' : ''}>`
      + `<span class="ol">${label}</span>${inline(o.text)}</button>`;
  }).join('');
  let body = `<div class="qstem">${inline(inst.stem)}</div><div class="opts">${opts}</div>`;
  if (play.phase === 'ask') {
    if (inst.scaffold && inst.scaffold.length) {
      body += play.usedHint
        ? `<div class="hint"><div class="eyebrow">Hint</div><ol>${inst.scaffold.map((h) => `<li>${inline(h)}</li>`).join('')}</ol></div>`
        : '<button class="btn ghost small" data-act="hint">Show a hint</button>';
    }
    body += `<button class="btn block" data-act="check" ${play.chosen ? '' : 'disabled'}>Check my answer</button>`;
  } else {
    const r = play.result;
    body += r.correct ? '<div class="verdict ok">✓ Correct</div>' : '<div class="verdict no">✗ Not quite</div>';
    body += `<div class="rationale">${inline(inst.rationale || '')}</div>`;
    if (!r.correct && r.diagnosis) {
      const d = r.diagnosis; const rem = REMEDIATION[d.cause] || {};
      body += `<div class="diag"><div class="eyebrow">Likely cause</div><div class="cause">${esc(CAUSE_LABEL[d.cause] || d.cause)}</div>`
        + (d.needsProbe ? '<p class="small muted">Best guess for now — more answers will sharpen it.</p>' : '')
        + `<div class="eyebrow" style="margin-top:8px">The fix</div><ul>${(rem.actions || []).map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`
        + (() => {
          const tid = topicIdForConcept(graph, inst.conceptIds[0]);
          const sec = deeperSectionForConcept(topicById(tid), inst.conceptIds[0]);
          return `<button class="btn ghost small" data-act="godeeper" data-topic="${esc(tid)}" data-sec="${sec}">Go deeper on this topic</button>`;
        })()
        + '</div>';
    }
    if (r.promoted) body += `<div class="promote">▲ ${esc(inst.conceptIds[0])} is now ${esc(r.newState)}</div>`;
    const last = play.i >= play.queue.length - 1;
    body += `<button class="btn block" data-act="next">${last ? 'Finish set' : 'Next question'}</button>`;
  }
  app.innerHTML = head + body;
}

function chooseOption(oid) { if (play && play.phase === 'ask') { play.chosen = oid; screenSet(); } }
async function submitAnswer() {
  if (!play || play.phase !== 'ask' || !play.chosen) return;
  const inst = play.instance;
  const timeMs = Date.now() - play.shownAt;
  const withinBudget = timeMs <= inst.budgetMs;
  const correct = play.chosen === inst.answerId;
  let diagnosis = null;
  if (!correct) {
    const prior = logRecords.filter((r) => r.kind === 'item' && r.conceptIds.includes(inst.conceptIds[0]));
    diagnosis = diagnose({
      attempt: { correct: false, rung: inst.rung, distractor: play.chosen, timeMs, withinBudget, timed: false, itemId: inst.itemId, conceptIds: inst.conceptIds },
      item: { distractors: inst.distractors }, prior, context: { conceptState: stateOf(inst.conceptIds[0]), budgetMs: inst.budgetMs },
    });
  }
  const prevRank = states.get(inst.conceptIds[0])?.rank ?? 0;
  await store.appendRecords([{
    id: 'att-' + inst.itemId + '-' + Date.now(), kind: 'item', itemId: inst.itemId, conceptIds: inst.conceptIds,
    rung: inst.rung, scaffold: play.usedHint === true, timeMs, withinBudget, timed: false, correct,
    distractor: correct ? null : play.chosen, cause: diagnosis ? diagnosis.cause : null,
    confidence: diagnosis ? diagnosis.confidence : null, sessionId: SESSION, timestamp: Date.now(),
  }]);
  await refreshAll();
  const newRank = states.get(inst.conceptIds[0])?.rank ?? 0;
  play.answered += 1; if (correct) play.correctCount += 1;
  play.result = { correct, diagnosis, promoted: newRank > prevRank, newState: stateOf(inst.conceptIds[0]) };
  play.phase = 'feedback';
  screenSet();
}
function nextQuestion() {
  if (!play) return;
  if (play.i >= play.queue.length - 1) { finishSet(); return; }
  play.i += 1; serveCurrent(); screenSet();
}
function finishSet() {
  const paper = play.paper; const score = play.correctCount; const size = play.answered;
  store.addSetResult({ id: 'set-' + Date.now(), paper, score, size, examShaped: play.examShaped, at: Date.now(), sessionId: SESSION });
  const avg = rollingAverage(store.setResults(), paper);
  const sum = summaryFor(paper);
  // topics this set touched, with their current progress
  const touched = [...new Set(play.queue.map((it) => topicIdForConcept(graph, it.conceptIds[0])))];
  const progressList = touched.map((tid) => {
    const t = sum.topics.find((x) => x.topicId === tid);
    return `<div class="hrow"><span>${esc(topicTitle(tid))}</span><b>${t.complete ? (t.stale ? 'needs revision' : 'complete ✓') : `${t.windowCorrect}/${Math.max(t.windowSize, 0)}`}</b></div>`;
  }).join('');
  const failed = size > 0 && score < 5;
  const weakest = touched.find((tid) => { const t = sum.topics.find((x) => x.topicId === tid); return t && !t.complete; }) || touched[0];
  app.innerHTML = headerHTML + bannerHTML()
    + `<a class="back" data-act="paper" data-paper="${paper}" href="#/paper/${paper}">${esc(PAPER_NAMES[paper])}</a>`
    + '<div class="eyebrow">Set complete</div>'
    + `<h1>You scored ${score} / ${size}</h1>`
    + `<p class="progress">Rolling average ${avg == null ? '—' : avg.toFixed(1)}/10 across topics built so far`
    + (isRepresentative(paper)
      ? ` · this set was ${play.examShaped ? 'exam-shaped' : 'not fully exam-shaped'}`
      : ` · not yet representative — ${builtLabel(paper)}`)
    + '</p>'
    + (failed && weakest ? `<button class="btn ghost block" data-act="godeeper" data-topic="${esc(weakest)}" data-sec="0">Go deeper on what you missed</button>` : '')
    + '<h2>Topics this set touched</h2><div class="hist">' + progressList + '</div>'
    + `<button class="btn block" data-act="set" data-paper="${paper}">Another set of 10</button>`
    + `<button class="btn ghost block" data-act="paper" data-paper="${paper}">Back to ${esc(paper)}</button>`;
  play = null;
}

// ---------- actions ----------
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
      store.addFlag({ id: 'flag-' + Date.now(), target: { kind, conceptId: null, itemId: kind === 'item' ? id : null, topicId: kind === 'topic' ? id : null }, reason: r, sessionId: SESSION, timestamp: Date.now() });
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
      await refreshAll(); persistBanner = ''; route(); toast('Progress restored');
    } catch { const m = document.getElementById('dmsg'); if (m) m.textContent = 'That file is not a Paper Trail export.'; }
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
  if (h.startsWith('#/set/')) {
    const paper = h.slice(6);
    if (!play || play.paper !== paper) startSet(paper); else screenSet();
    setNav('home');
  } else if (h.startsWith('#/paper/')) { screenPaper(h.slice(8)); setNav('home'); }
  else if (h.startsWith('#/topic/')) { screenTopic(decodeURIComponent(h.slice(8))); setNav('home'); }
  else if (h === '#/dashboard') { screenDashboard(); setNav('dashboard'); }
  else if (h === '#/data') { screenData(); setNav('data'); }
  else { screenHome(); setNav('home'); }
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const act = t.getAttribute('data-act');
  if (act === 'home') { e.preventDefault(); location.hash = '#/'; }
  else if (act === 'dashboard') { location.hash = '#/dashboard'; }
  else if (act === 'data') { location.hash = '#/data'; }
  else if (act === 'paper') { e.preventDefault(); location.hash = '#/paper/' + t.getAttribute('data-paper'); }
  else if (act === 'topic') { deeperFor = null; location.hash = '#/topic/' + encodeURIComponent(t.getAttribute('data-id')); }
  else if (act === 'set') {
    const paper = t.getAttribute('data-paper'); const target = '#/set/' + paper;
    if (location.hash === target) startSet(paper); else location.hash = target;
  } else if (act === 'opt') { chooseOption(t.getAttribute('data-opt')); }
  else if (act === 'hint') { if (play) { play.usedHint = true; screenSet(); } }
  else if (act === 'check') { submitAnswer(); }
  else if (act === 'next') { nextQuestion(); }
  else if (act === 'deeper') { openDeeper(t.getAttribute('data-topic'), 0); }
  else if (act === 'godeeper') { openDeeper(t.getAttribute('data-topic'), Number(t.getAttribute('data-sec')) || 0); }
  else if (act === 'flag') { openFlagSheet(t.getAttribute('data-kind'), t.getAttribute('data-id')); }
  else if (act === 'export') { exportState(); }
});

boot();
