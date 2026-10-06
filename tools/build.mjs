// tools/build.mjs — renders the editorial PDF from content/*.mjs
import { Editorial, C } from './kit.mjs';
import { site } from '../content/site.mjs';
import { problems } from '../content/problems.mjs';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : site.out;

const ed = new Editorial({
  title: site.title,
  subtitle: site.subtitle,
  author: site.author,
  out,
  kicker: site.kicker,
  meta: site.meta,
  footer: site.footer,
  notice: site.notice,
  toc: problems.map((p) => ({ id: p.id, title: p.title, tag: p.tag })),
});

const TRACE = !!process.env.TRACE;
const trace = (msg) => { if (TRACE) console.log(`  [${String(ed.page).padStart(2)}] y=${ed.ctx.y.toFixed(0).padStart(4)}  ${msg}`); };

for (const p of problems) {
  ed.newPage(`${p.id} · ${p.title}`);
  ed.problemHeader(
    { id: p.id, title: p.title, titleEn: p.titleEn, subtitle: p.subtitle, chips: p.chips },
    { running: `${p.id} · ${p.title}` },
  );

  if (p.stats) { ed.statRow(p.stats); ed.spacer(2); }

  // ---------------------------------------------------------------- 1. shart
  ed.h1('Masala sharti', { kicker: '1-qism · shart' });
  for (const para of p.story) ed.text(para);
  if (p.storyExtra) { ed.spacer(1); ed.callout('note', 'Nima soʻralmoqda?', p.storyExtra); }

  ed.h2('Kirish maʼlumotlari', { rule: false });
  ed.callout('input', 'Kirish formati', p.input);
  ed.callout('output', 'Chiqish formati', p.output);
  if (p.limits) ed.callout('limits', 'Cheklovlar', [{ list: p.limits }]);

  // --------------------------------------------------------------- 2. namuna
  ed.h2('Namunalar');
  for (const s of p.samples) ed.sample(s);

  // ------------------------------------------------------------- 3. tahlil
  ed.h1('Shartni tushunish', { kicker: '2-qism · tahlil' });
  for (const para of p.analysis) ed.text(para);
  if (p.glossary) { ed.h2('Atamalar lugʻati'); ed.table(['Atama', 'Maʼnosi'], p.glossary, { widths: [130, 407] }); }
  if (p.edges) { ed.h2('Chegaraviy holatlar'); ed.bullets(p.edges, { marker: '→', markerColor: C.hot }); }

  // --------------------------------------------------------------- 4. yechim
  ed.h1('Yechim gʻoyasi', { kicker: '3-qism · yechim' });
  for (const para of p.ideaIntro || []) ed.text(para);
  for (const d of p.diagrams || []) { ed.h3(d.title); ed.diagram(d.spec); if (d.caption) ed.caption(d.caption); }
  for (const cb of p.ideaBlocks || []) ed.callout(cb.kind, cb.title, cb.blocks);
  for (const para of p.ideaOutro || []) ed.text(para);

  // ------------------------------------------------------------ 5. qadamlar
  if (p.walkthrough) {
    ed.h1('Qadam-baqadam ishlash', { kicker: '4-qism · qoʻllanma' });
    for (const para of p.walkthrough.intro || []) ed.text(para);
    if (p.walkthrough.table) ed.table(p.walkthrough.table.headers, p.walkthrough.table.rows, { widths: p.walkthrough.table.widths });
    for (const d of p.walkthrough.diagrams || []) { ed.h3(d.title); ed.diagram(d.spec); if (d.caption) ed.caption(d.caption); }
    for (const para of p.walkthrough.outro || []) ed.text(para);
  }

  // ------------------------------------------------------------------ 6. kod
  if (p.code) {
    ed.h1('Yozilgan kod', { kicker: '5-qism · kod' });
    if (p.codeIntro) for (const para of p.codeIntro) ed.text(para);
    ed.code(p.code, { caption: p.codeCaption || 'C++17' });
    if (p.codeNotes) ed.bullets(p.codeNotes, { marker: '›', markerColor: C.green });
  }

  // ---------------------------------------------------------------- 7. xulosa
  trace('before xulosa');
  ed.h1('Xulosa va murakkablik', { kicker: '6-qism · yakun' });
  trace('after h1');
  if (p.complexity) { ed.table(['Bosqich', 'Vaqt', 'Xotira'], p.complexity, { widths: [240, 150, 147] }); trace('after table'); }
  for (const para of p.conclusion) ed.text(para);
  trace('after conclusion text');
  if (p.takeaway) { ed.callout('idea', 'Yodda tuting', [p.takeaway]); trace('after takeaway'); }
}

const file = await ed.save();
console.log('✓ PDF tayyor:', file);
