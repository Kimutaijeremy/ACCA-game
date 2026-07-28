// synth.js — one shared generator for a realistic "year of use" attempt log, imported by both
// the browser harness and the Node baseline so the Q4 benchmark compares like with like.
//
// It emits, per concept: a lesson, then a climbing sequence of items (concept-check → guided →
// standard → stretch/integrated) spread over real time in early 2026. Deriving at "now"
// (mid-year) therefore leaves many reviews overdue, so the review queue is genuinely populated
// and promotion/decay code paths actually run.

const HOUR = 3600000;

export function synthLog(liveIds, n) {
  const recs = [];
  const base = Date.UTC(2026, 0, 1);
  const perConcept = Math.max(13, Math.floor(n / liveIds.length));
  const seq = [
    'concept-check', 'concept-check', 'concept-check',
    'guided', 'guided', 'guided',
    'standard', 'standard', 'standard', 'standard', 'standard',
    'stretch', 'integrated',
  ];
  let count = 0;
  for (let ci = 0; ci < liveIds.length && count < n; ci++) {
    const cid = liveIds[ci];
    let t = base + ci * HOUR;
    recs.push({ id: `l${ci}`, kind: 'lesson', conceptIds: [cid], sessionId: `s${ci}_0`, timestamp: t });
    count++;
    for (let k = 0; k < perConcept && count < n; k++, count++) {
      const rung = seq[k % seq.length];
      t += 6 * HOUR;
      recs.push({
        id: `x${count}`, kind: 'item', conceptIds: [cid], rung,
        correct: count % 9 !== 0, scaffold: rung === 'guided',
        withinBudget: true, timed: k % 2 === 0,
        sessionId: `s${ci}_${k >> 2}`, timestamp: t,
      });
    }
  }
  return recs;
}
