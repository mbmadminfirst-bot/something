// tools/render-pages.mjs <pdf> [pages...] — rasterize PDF pages to PNG for visual QC
import * as mupdf from 'mupdf';
import fs from 'fs';
import path from 'path';

const [file, ...rest] = process.argv.slice(2);
const scale = Number(process.env.SCALE || 2);
const outDir = process.env.OUT_DIR || '/tmp/qc';
fs.mkdirSync(outDir, { recursive: true });

const doc = mupdf.Document.openDocument(fs.readFileSync(file), 'application/pdf');
const total = doc.countPages();
const wanted = rest.length ? rest.map(Number) : Array.from({ length: total }, (_, i) => i + 1);
console.log(`sahifalar soni: ${total}`);
for (const p of wanted) {
  if (p < 1 || p > total) continue;
  const pix = doc.loadPage(p - 1).toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false, true);
  const out = path.join(outDir, `page-${String(p).padStart(2, '0')}.png`);
  fs.writeFileSync(out, pix.asPNG());
  console.log(out);
}
