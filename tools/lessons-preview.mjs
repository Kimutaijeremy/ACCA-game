// lessons-preview.mjs — render the pilot lessons to Markdown for format review.
// Run: node tools/lessons-preview.mjs > docs/pilot-lessons-preview.md

import { ALL_LESSONS } from '../src/content/lessons/index.js';

const PILOT_LESSONS = ALL_LESSONS;
const out = (s = '') => process.stdout.write(s + '\n');

out('# Lessons — readable preview');
out('');
out(`${PILOT_LESSONS.length} authored lessons, in the Wanjiku voice. Generated from `
  + '`src/content/lessons/*.js` — the content is data, this is just a readable view.');
out('');
for (const L of PILOT_LESSONS) {
  out('---');
  out('');
  out(`## ${L.title}`);
  out(`*${L.conceptId} · shape: ${L.shape} · syllabus ${L.syllabusYear}*`);
  out('');
  out('### Lesson');
  out(L.story);
  out('');
  for (const k of L.keypoints) {
    out(`> 🔑 **KEYPOINT — ${k.title}**`);
    out('>');
    for (const line of k.body.split('\n')) out(`> ${line}`);
    out('');
  }
  out('### Worked example');
  out(`**${L.worked.prompt}**`);
  out('');
  L.worked.steps.forEach((s, i) => out(`${i + 1}. ${s}`));
  out('');
  out(`**Answer.** ${L.worked.answer}`);
  out('');
  out(`**In one breath.** ${L.compression}`);
  out('');
  out(`**Where it matures →** ${L.forwardPointer}`);
  out('');
  if (L.rateFlags.length) {
    out('**Annual-check flags:**');
    for (const f of L.rateFlags) out(`- ${f}`);
    out('');
  }
}
