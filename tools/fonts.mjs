// tools/fonts.mjs — one-off: convert the @fontsource woff2 files into TTF (pdfkit/fontkit need TTF)
// Run: node tools/fonts.mjs
import fs from 'fs';
import path from 'path';
import { decompress } from 'wawoff2';

const fontDir = path.resolve('assets/fonts');
const jobs = [
  ['node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2', 'source-serif-4-latin-400-normal.ttf'],
  ['node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2', 'source-serif-4-latin-600-normal.ttf'],
  ['node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff2', 'source-serif-4-latin-700-normal.ttf'],
  ['node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff2', 'source-serif-4-latin-400-italic.ttf'],
  ['node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2', 'inter-latin-400-normal.ttf'],
  ['node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2', 'inter-latin-600-normal.ttf'],
  ['node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2', 'inter-latin-700-normal.ttf'],
  ['node_modules/@fontsource/inter/files/inter-latin-400-italic.woff2', 'inter-latin-400-italic.ttf'],
];
// DejaVu (mono + math/symbol fallback) is copied straight from the system package:
//   cp /usr/share/fonts/truetype/dejavu/DejaVu{Sans,SansMono,SansMono-Bold,Serif,Serif-Bold}.ttf assets/fonts/

fs.mkdirSync(fontDir, { recursive: true });
for (const [src, dst] of jobs) {
  if (!fs.existsSync(src)) { console.log('skip (missing):', src); continue; }
  const ttf = await decompress(fs.readFileSync(src));
  fs.writeFileSync(path.join(fontDir, dst), Buffer.from(ttf));
  console.log('✓', dst);
}
