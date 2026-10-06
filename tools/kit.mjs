// editorial-kit — print-quality layout engine on top of pdfkit.
// Typesets competitive-programming editorials: problem statement + visual solution walkthrough.
import PDFDocument from 'pdfkit';
import * as fontkit from 'fontkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

/* ------------------------------------------------------------------ palette */
export const C = {
  ink: '#161a21', body: '#262b34', muted: '#6b7280', faint: '#9aa2ae',
  rule: '#dde1e8', ruleSoft: '#eceff3', paper: '#ffffff', wash: '#f6f7fa', wash2: '#edf0f5',
  accent: '#3b4fd8', accentSoft: '#e9ecfd', accentDeep: '#232c74',
  hot: '#d9480f', hotSoft: '#fdeee4',
  green: '#2b8a3e', greenSoft: '#e7f5ea',
  red: '#c92a2a', redSoft: '#fdecec',
  purple: '#6741d9', purpleSoft: '#f0ebfd',
  teal: '#0c8599', tealSoft: '#e2f3f6',
  gold: '#a17a05', goldSoft: '#fbf3da',
};

/* --------------------------------------------------------------- font pack */
const FILES = {
  'SS4': 'source-serif-4-latin-400-normal.ttf',
  'SS4-Semi': 'source-serif-4-latin-600-normal.ttf',
  'SS4-B': 'source-serif-4-latin-700-normal.ttf',
  'SS4-I': 'source-serif-4-latin-400-italic.ttf',
  'Inter': 'inter-latin-400-normal.ttf',
  'Inter-Semi': 'inter-latin-600-normal.ttf',
  'Inter-B': 'inter-latin-700-normal.ttf',
  'Inter-I': 'inter-latin-400-italic.ttf',
  'Mono': 'DejaVuSansMono.ttf',
  'Mono-B': 'DejaVuSansMono-Bold.ttf',
  'Sym': 'DejaVuSans.ttf',
  'Math': 'DejaVuSerif.ttf',
  'Math-B': 'DejaVuSerif-Bold.ttf',
};
const FAMILY = {
  serif: { r: 'SS4', semi: 'SS4-Semi', b: 'SS4-B', i: 'SS4-I' },
  sans: { r: 'Inter', semi: 'Inter-Semi', b: 'Inter-B', i: 'Inter-I' },
  mono: { r: 'Mono', semi: 'Mono-B', b: 'Mono-B', i: 'Mono' },
};
const SANS = FAMILY.sans, SERIF = FAMILY.serif, MONO = FAMILY.mono;

const COVERAGE = new Map();
function coverage(name) {
  if (!COVERAGE.has(name)) COVERAGE.set(name, new Set(fontkit.openSync(path.join(FONT_DIR, FILES[name])).characterSet));
  return COVERAGE.get(name);
}
const has = (name, cp) => coverage(name).has(cp);

/* ---------------------------------------------------- light math normalizer */
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'i': 'ⁱ', 'k': 'ᵏ', 'x': 'ˣ', 'a': 'ᵃ', 'e': 'ᵉ', 'o': 'ᵒ', 't': 'ᵗ', 'p': 'ᵖ', 'm': 'ᵐ', 's': 'ˢ', 'r': 'ʳ', 'c': 'ᶜ', 'd': 'ᵈ', 'g': 'ᵍ', 'b': 'ᵇ', 'l': 'ˡ', '$': '⁽' };
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'n': 'ₙ', 'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 't': 'ₜ', 's': 'ₛ', 'm': 'ₘ', 'p': 'ₚ', 'r': 'ᵣ', 'u': 'ᵤ', 'v': 'ᵥ', 'h': 'ₕ', 'l': 'ₗ' };
const toScript = (s, map) => {
  let ok = true;
  const out = [...s].map((c) => { const r = map[c]; if (!r) ok = false; return r ?? c; }).join('');
  return ok ? out : s;
};
const MACROS = [
  [/\\(mathcal|mathbb|mathrm|text|operatorname)\{([^{}]*)\}/g, '$2'],
  [/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2'],
  [/\\div(?![a-zA-Z])/g, '÷'], [/\\pm(?![a-zA-Z])/g, '±'], [/\\in(?![a-zA-Z])/g, '∈'],
  [/\\le(q)?(?![a-zA-Z])/g, '≤'], [/\\ge(q)?(?![a-zA-Z])/g, '≥'], [/\\neq(?![a-zA-Z])/g, '≠'],
  [/\\cdot(?![a-zA-Z])/g, '·'], [/\\times(?![a-zA-Z])/g, '×'], [/\\dots(?![a-zA-Z])|\\ldots/g, '…'],
  [/\\approx(?![a-zA-Z])/g, '≈'], [/\\infty(?![a-zA-Z])/g, '∞'], [/\\to(?![a-zA-Z])|\\rightarrow/g, '→'],
  [/\\sum(?![a-zA-Z])/g, '∑'], [/\\prod(?![a-zA-Z])/g, '∏'], [/\\sqrt(?![a-zA-Z])/g, '√'],
  [/\\pmod(?![a-zA-Z])|\\bmod/g, ' mod '], [/\\lfloor/g, '⌊'], [/\\rfloor/g, '⌋'], [/\\lceil/g, '⌈'], [/\\rceil/g, '⌉'],
  [/\\left|\\right/g, ''], [/\\max(?![a-zA-Z])/g, 'max'], [/\\min(?![a-zA-Z])/g, 'min'],
  [/\\log(?![a-zA-Z])/g, 'log'], [/\\gcd(?![a-zA-Z])/g, 'gcd'], [/\\bmod(?![a-zA-Z])/g, ' mod '],
  [/\\ /g, ' '], [/\\[,;!]/g, ' '], [/\\[a-zA-Z]+/g, ''],
];
export function deTex(src) {
  let t = src;
  for (const [re, rep] of MACROS) t = t.replace(re, rep);
  t = t.replace(/\^\{([^{}]*)\}/g, (m, g) => toScript(g, SUP))
       .replace(/_\{([^{}]*)\}/g, (m, g) => toScript(g, SUB))
       .replace(/\^(\S)/g, (m, g) => toScript(g, SUP))
       .replace(/_(\S)/g, (m, g) => { const r = toScript(g, SUB); return r === g ? m : r; });
  return t.trim();
}


/* ------------------------------------------------------------------- inline */
export function parseInline(text, base = {}) {
  const atoms = [];
  const push = (t, st) => { if (t) atoms.push({ t, ...base, ...st }); };
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\$[^$]+\$|__[^_]+__)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) atoms.push(...parseInline(tok.slice(2, -2), { ...base, bold: true }));
    else if (tok.startsWith('__')) atoms.push(...parseInline(tok.slice(2, -2), { ...base, accent: true }));
    else if (tok.startsWith('`')) push(tok.slice(1, -1), { code: true });
    else if (tok.startsWith('$')) push(deTex(tok.slice(1, -1)), { math: true });
    else atoms.push(...parseInline(tok.slice(1, -1), { ...base, italic: true }));
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return atoms;
}

function fontNameFor(atom, family) {
  const f = FAMILY[family] || FAMILY.serif;
  if (atom.code) return atom.bold ? MONO.b : MONO.r;
  if (atom.math) return 'Math';
  if (atom.bold) return f.b;
  if (atom.italic) return f.i || f.r;
  if (atom.accent) return f.semi || f.b;
  return f.r;
}

function runsOf(atom, family) {
  const primary = fontNameFor(atom, family);
  const out = [];
  let cur = { font: primary, t: '' };
  for (const ch of atom.t) {
    const cp = ch.codePointAt(0);
    let fn = primary;
    if (!has(primary, cp)) fn = ['Sym', 'Mono'].find((f) => has(f, cp)) || primary;
    if (fn !== cur.font && cur.t) { out.push(cur); cur = { font: fn, t: '' }; }
    cur.font = fn; cur.t += ch;
  }
  if (cur.t) out.push(cur);
  return out;
}

const WCACHE = new Map();
function strWidth(doc, font, size, str) {
  const key = font + '|' + size + '|' + str;
  let w = WCACHE.get(key);
  if (w === undefined) { w = doc.font(font).fontSize(size).widthOfString(str); WCACHE.set(key, w); }
  return w;
}

function unitize(atoms, family) {
  const units = [];
  for (const atom of atoms) {
    for (const run of runsOf(atom, family)) {
      for (const p of run.t.split(/(\s+)/)) {
        if (!p) continue;
        if (/^\s+$/.test(p)) units.push({ space: true, brk: /\n/.test(p), runs: [{ font: run.font, t: ' ' }], atom });
        else units.push({ space: false, runs: [{ font: run.font, t: p }], atom });
      }
    }
  }
  return units;
}
function unitWidth(doc, u, size) {
  if (u._w !== undefined && u._s === size) return u._w;
  let w = 0; for (const r of u.runs) w += strWidth(doc, r.font, size, r.t);
  u._w = w; u._s = size; return w;
}
function lineWidth(doc, line, size) { let w = 0; for (const u of line) w += unitWidth(doc, u, size); return w; }

function hardSplit(doc, unit, size, width) {
  const out = [[]]; let w = 0;
  const font = unit.runs[0].font;
  for (const ch of unit.runs.map((r) => r.t).join('')) {
    const cw = strWidth(doc, font, size, ch);
    if (w + cw > width && out[out.length - 1].length) { out.push([]); w = 0; }
    const cur = out[out.length - 1];
    const lastRun = cur[cur.length - 1];
    if (lastRun && lastRun.font === font) lastRun.t += ch; else cur.push({ font, t: ch });
    w += cw;
  }
  return out;
}

function wrapAtoms(doc, atoms, family, size, width) {
  const units = unitize(atoms, family);
  const lines = [];
  let line = [], w = 0;
  const flush = () => { while (line.length && line[line.length - 1].space) line.pop(); lines.push(line); line = []; w = 0; };
  for (const u of units) {
    if (u.brk) { flush(); continue; }
    const uw = unitWidth(doc, u, size);
    if (uw > width && !u.space) {
      if (line.length) flush();
      const pieces = hardSplit(doc, u, size, width);
      for (let i = 0; i < pieces.length - 1; i++) lines.push(pieces[i]);
      line = pieces[pieces.length - 1]; w = lineWidth(doc, line, size);
      continue;
    }
    if (w + uw > width + 0.3 && !u.space) flush();
    if (u.space && !line.length) continue;
    line.push(u); w += uw;
  }
  flush();
  return lines;
}

/* ------------------------------------------------- universal rich renderer */
// Draws a string honouring **bold**, *italic*, `code`, $math$ and per-character
// font fallback (DejaVu) for glyphs the text faces do not contain.
export function renderRich(doc, x, y, width, text, o = {}) {
  const family = o.family || 'serif';
  const size = o.size ?? 10;
  const lh = size * (o.leading ?? 1.38);
  const lines = wrapAtoms(doc, parseInline(String(text)), family, size, width);
  lines.forEach((line, i) => {
    const lw = lineWidth(doc, line, size);
    let cx = x;
    if (o.align === 'center') cx = x + Math.max(0, (width - lw) / 2);
    else if (o.align === 'right') cx = x + Math.max(0, width - lw);
    const baseline = y + i * lh + size * 0.8;
    for (const u of line) {
      if (u.space) { cx += unitWidth(doc, u, size); continue; }
      for (const r of u.runs) {
        doc.font(r.font).fontSize(size).fillColor(u.atom.color || o.color || C.body).text(r.t, cx, baseline, { lineBreak: false, baseline: 'alphabetic' });
        cx += strWidth(doc, r.font, size, r.t);
      }
    }
  });
  return y + lines.length * lh;
}
export function richWidth(doc, text, family, size) {
  const lines = wrapAtoms(doc, parseInline(String(text)), family || 'serif', size, 1e6);
  return lines.length ? lineWidth(doc, lines[0], size) : 0;
}

/* --------------------------------------------------------------------- Ctx */
class Ctx {
  constructor(doc, o) {
    Object.assign(this, { doc, x: o.x, y: o.y, w: o.w, l: o.l, r: o.r, top: o.top, bottom: o.bottom, dry: !!o.dry });
  }
  clone(dry = this.dry) { return new Ctx(this.doc, { x: this.x, y: this.y, w: this.w, l: this.l, r: this.r, top: this.top, bottom: this.bottom, dry }); }
}

/* ================================================================= Editorial */
export class Editorial {
  constructor(o = {}) {
    this.title = o.title || 'Tahririyat';
    this.subtitle = o.subtitle || '';
    this.author = o.author || '';
    this.out = o.out || path.join(ROOT, 'editorial.pdf');
    this.doc = new PDFDocument({
      size: 'A4', margins: { top: 46, bottom: 54, left: 56, right: 56 },
      autoFirstPage: false, bufferPages: false,
      info: { Title: this.title, Author: this.author },
    });
    for (const [n, f] of Object.entries(FILES)) this.doc.registerFont(n, path.join(FONT_DIR, f));
    this.page = 0;
    this.chromeLabel = '';
    this.doc.on('pageAdded', () => { this.page++; this.noAutoBreak(); if (this.page > 1) this.chrome(); });
    this.doc.addPage();
    this.noAutoBreak();
    this.page = 1;
    const { width, height } = this.doc.page;
    this.left = 56;
    this.right = width - 56;
    this.cw = this.right - this.left;
    this.top = 62;
    this.bottom = height - 58;
    this.cover(o);
    this._ctx = null;          // the first content page is created on demand
  }
  get D() { return this.doc; }

  get ctx() { if (!this._ctx) this.newPage(); return this._ctx; }
  set ctx(v) { this._ctx = v; }

  // We lay out every line ourselves, so pdfkit's automatic pagination must never fire
  // (its page break inside a pageAdded handler would recurse forever).
  noAutoBreak() { this.doc.page.margins.bottom = 0; }

  /* ------------------------------------------------------------------ chrome */
  chrome() {
    const d = this.doc, { width, height } = d.page;
    d.save();
    renderRich(d, 56, 28, width - 240, this.title.toUpperCase(), { family: 'sans', size: 7.2, color: C.faint, leading: 1.2 });
    if (this.chromeLabel) renderRich(d, width - 296, 28, 240, this.chromeLabel.toUpperCase(), { family: 'sans', size: 7.2, color: C.faint, align: 'right', leading: 1.2 });
    d.moveTo(56, 40).lineTo(width - 56, 40).lineWidth(0.6).strokeColor(C.ruleSoft).stroke();
    d.moveTo(56, height - 42).lineTo(width - 56, height - 42).lineWidth(0.6).strokeColor(C.ruleSoft).stroke();
    d.font(SANS.r).fontSize(8).fillColor(C.faint).text(String(this.page), 56, height - 36, { width: 40, lineBreak: false });
    d.font(SANS.r).fontSize(7.2).fillColor(C.faint)
      .text(this.author.toUpperCase(), width - 296, height - 35, { width: 240, align: 'right', characterSpacing: 1, lineBreak: false });
    d.restore();
  }

  /* ------------------------------------------------------------------- cover */
  cover(o) {
    const d = this.doc, { width, height } = d.page;
    this.chromeLabel = '';
    d.save();
    d.rect(0, 0, width, 15).fill(C.accent);
    d.rect(0, 15, width, 3).fill(C.hot);
    d.font(SANS.b).fontSize(9.6).fillColor(C.accent).text((o.kicker || 'MASALA TAHLILI').toUpperCase(), 64, 132, { characterSpacing: 2.6 });
    d.font(SERIF.b).fontSize(o.titleSize || 37).fillColor(C.ink).text(this.title, 64, 158, { width: width - 128, lineGap: 6 });
    if (this.subtitle) d.font(SERIF.r).fontSize(14).fillColor(C.muted).text(this.subtitle, 64, d.y + 12, { width: width - 168, lineGap: 4 });
    d.moveTo(64, d.y + 20).lineTo(width - 64, d.y + 20).lineWidth(1).strokeColor(C.rule).stroke();
    let cy = d.y + 38 + 12;
    for (const line of o.meta || []) {
      const end = renderRich(d, 64, cy - 12, width - 128, line, { family: 'serif', size: 9.8, color: C.muted, leading: 1.5 });
      cy = end + 8;
    }
    if (o.toc?.length) {
      cy = Math.max(cy + 26, height - 300);
      d.font(SANS.b).fontSize(8.4).fillColor(C.accent).text('MUNDARIJA', 64, cy, { characterSpacing: 1.9 });
      cy += 22;
      for (const t of o.toc) {
        d.font(SANS.b).fontSize(9.6).fillColor(C.accentDeep).text(t.id, 64, cy, { width: 30, lineBreak: false });
        renderRich(d, 96, cy - 1.6, width - 330, t.title, { family: 'serif', size: 10.8, color: C.ink });
        if (t.tag) d.font(SANS.r).fontSize(8.2).fillColor(C.muted).text(t.tag, width - 240, cy + 1, { width: 176, align: 'right', lineBreak: false });
        d.moveTo(96, cy + 16).lineTo(width - 64, cy + 16).lineWidth(0.5).strokeColor(C.ruleSoft).stroke();
        cy += 24;
      }
    }
    if (o.footer) renderRich(d, 64, height - 76, width - 128, o.footer, { family: 'serif', size: 8.6, color: C.faint, leading: 1.5 });
    if (o.notice) {
      const ny = height - 172;
      d.save();
      d.roundedRect(64, ny, width - 128, 78, 4).fill(C.hotSoft);
      d.rect(64, ny, 3, 78).fill(C.hot);
      renderRich(d, 78, ny + 11, width - 160, o.notice.title, { family: 'sans', size: 8.6, color: '#a53a0b', leading: 1.35 });
      renderRich(d, 78, ny + 26, width - 160, o.notice.body, { family: 'serif', size: 9.4, color: '#7a3a12', leading: 1.5 });
      d.restore();
    }
    d.restore();
  }

  /* ------------------------------------------------------------- page control */
  newPage(label) {
    if (this._ctx?.dry) { this._ctx.y = this._ctx.top; return this._ctx; }
    if (label !== undefined) this.chromeLabel = label;
    this.doc.addPage();
    this.noAutoBreak();
    const fresh = { x: this.left, y: this.top, w: this.cw, l: this.left, r: this.right, top: this.top, bottom: this.bottom, dry: false };
    if (this._ctx) Object.assign(this._ctx, fresh);      // keep cached references valid
    else this._ctx = new Ctx(this.doc, fresh);
    this.doc.font(SERIF.r).fontSize(10.3).fillColor(C.body);
    return this._ctx;
  }
  need(h, label) {
    const c = this.ctx;
    if (c.y + h > c.bottom && c.y > c.top + 4) this.newPage(label);
  }

  /* ------------------------------------------------------------------- style */
  style(o = {}) {
    return {
      family: o.family || o.font || 'serif', size: o.size ?? 10.3, leading: o.leading ?? 1.53,
      color: o.color || C.body, justify: o.justify ?? true, indent: o.indent ?? 0,
      spaceBefore: o.spaceBefore ?? 0, spaceAfter: o.spaceAfter ?? 7,
    };
  }

  measure(text, o = {}, width) {
    const s = this.style(o);
    const lines = wrapAtoms(this.doc, parseInline(text), s.family, s.size, (width ?? this.ctx.w) - s.indent);
    return lines.length * s.size * s.leading + s.spaceBefore + s.spaceAfter;
  }

  text(text, o = {}) {
    const ctx = this.ctx, s = this.style(o);
    ctx.y += s.spaceBefore;
    const width = (o.width ?? ctx.w) - s.indent;
    const lines = wrapAtoms(this.doc, parseInline(text), s.family, s.size, width);
    const lh = s.size * s.leading;
    const roomLines = Math.floor((ctx.bottom - ctx.y) / lh + 1e-6);
    if (lines.length > 1 && roomLines < 2 && ctx.y > ctx.top + 4) this.newPage(o.label);
    for (let i = 0; i < lines.length; i++) {
      if (ctx.y + lh > ctx.bottom) this.newPage(o.label);
      const last = i === lines.length - 1;
      this.drawLine(lines[i], ctx.x + s.indent, ctx.y + s.size * 0.8, width, s,
        { justify: s.justify && !last && o.justify !== false });
      ctx.y += lh;
    }
    ctx.y += s.spaceAfter;
    return ctx.y;
  }

  drawLine(line, x, baseline, width, s, o = {}) {
    const ctx = this.ctx, d = ctx.doc;
    const lw = lineWidth(d, line, s.size);
    const gaps = line.filter((u) => u.space).length;
    const extra = o.justify && gaps && lw < width ? (width - lw) / gaps : 0;
    let cx = x;
    for (const u of line) {
      if (u.space) { cx += unitWidth(d, u, s.size) + extra; continue; }
      for (const r of u.runs) {
        if (!ctx.dry) d.font(r.font).fontSize(s.size).fillColor(u.atom.color || o.color || s.color).text(r.t, cx, baseline, { lineBreak: false, baseline: 'alphabetic' });
        cx += strWidth(d, r.font, s.size, r.t);
      }
    }
  }

  spacer(h = 8) { this.ctx.y += h; }

  tryLine(fn) {
    const ctx = this.ctx;
    const dry = ctx.clone(true);
    const prev = this.ctx; this.ctx = dry;
    try { fn(dry); } finally { this.ctx = prev; }
    return dry.y - ctx.y;
  }

  /* --------------------------------------------------------------- headings */
  h1(text, o = {}) {
    this.need(70, o.label);
    const ctx = this.ctx, d = this.doc;
    ctx.y += o.spaceBefore ?? 10;
    if (o.kicker) {
      if (!ctx.dry) renderRich(d, ctx.x, ctx.y, ctx.w, o.kicker.toUpperCase(), { family: 'sans', size: 8.2, color: C.accent, leading: 1.2 });
      ctx.y += 15;
    }
    if (!ctx.dry) renderRich(d, ctx.x, ctx.y, ctx.w, text, { family: 'sans', size: o.size ?? 15.4, color: C.ink, leading: 1.3 });
    ctx.y += (o.size ?? 15.4) * 1.35 + 4;
    if (!ctx.dry) d.moveTo(ctx.x, ctx.y).lineTo(ctx.x + 34, ctx.y).lineWidth(2).strokeColor(C.hot).stroke();
    ctx.y += o.spaceAfter ?? 12;
  }

  h2(text, o = {}) {
    this.need(56, o.label);
    const ctx = this.ctx, d = this.doc;
    ctx.y += o.spaceBefore ?? 13;
    if (!ctx.dry) renderRich(d, ctx.x, ctx.y, ctx.w, text, { family: 'sans', size: o.size ?? 11.6, color: o.color || C.accentDeep, leading: 1.3 });
    ctx.y += (o.size ?? 11.6) * 1.4 + 2;
    if (o.rule !== false && !ctx.dry) d.moveTo(ctx.x, ctx.y + 2).lineTo(ctx.x + ctx.w, ctx.y + 2).lineWidth(0.6).strokeColor(C.rule).stroke();
    ctx.y += o.spaceAfter ?? 9;
  }

  h3(text, o = {}) {
    this.need(40, o.label);
    const ctx = this.ctx, d = this.doc;
    ctx.y += o.spaceBefore ?? 9;
    if (!ctx.dry) renderRich(d, ctx.x, ctx.y, ctx.w, text, { family: 'sans', size: o.size ?? 9.8, color: o.color || C.ink, leading: 1.35 });
    ctx.y += (o.size ?? 9.8) * 1.45 + 3;
  }

  bullets(items, o = {}) {
    const ctx = this.ctx, d = this.doc, ind = o.indent ?? 17, size = o.size ?? 10.1;
    for (const raw of items) {
      const isObj = typeof raw === 'object';
      const marker = isObj ? (raw.marker ?? o.marker ?? '•') : (o.marker ?? '•');
      const txt = isObj ? raw.text : raw;
      const color = isObj && raw.color ? raw.color : (o.markerColor || C.accent);
      const h = this.measure(txt, { size, spaceAfter: 0, indent: ind }, ctx.w);
      this.need(Math.min(h, 42), o.label);
      const y = ctx.y;
      if (!ctx.dry) renderRich(d, ctx.x, y, ind - 4, marker, { family: 'sans', size: size * 0.95, color, leading: 1.2 });
      ctx.x += ind;
      this.text(txt, { size, spaceAfter: o.gap ?? 3.4, label: o.label });
      ctx.x -= ind;
    }
    ctx.y += o.spaceAfter ?? 5;
  }

  /* ------------------------------------------------------------ list of kv rows */
  kvRows(rows, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const labelW = o.labelW ?? 92, size = o.size ?? 10;
    for (const [k, v] of rows) {
      const h = this.measure(v, { size, spaceAfter: 0 }, ctx.w - labelW);
      this.need(h, o.label);
      const y = ctx.y;
      if (!ctx.dry) d.font(SANS.b).fontSize(size * 0.9).fillColor(C.muted).text(k, ctx.x, y + size * 0.72, { width: labelW - 10, lineBreak: false, baseline: 'alphabetic' });
      ctx.x += labelW;
      this.text(v, { size, spaceAfter: o.gap ?? 4, label: o.label });
      ctx.x -= labelW;
    }
    ctx.y += o.spaceAfter ?? 4;
  }

  /* ---------------------------------------------------------------- callouts */
  callout(kind, title, blocks, o = {}) {
    const T = {
      statement: { bg: '#f7f8fb', bar: C.accentDeep, fg: C.accentDeep },
      input: { bg: C.tealSoft, bar: C.teal, fg: '#0a6472' },
      output: { bg: C.purpleSoft, bar: C.purple, fg: '#4b2fb3' },
      limits: { bg: C.goldSoft, bar: C.gold, fg: '#7c5d05' },
      idea: { bg: C.accentSoft, bar: C.accent, fg: C.accentDeep },
      warn: { bg: C.hotSoft, bar: C.hot, fg: '#a53a0b' },
      note: { bg: C.greenSoft, bar: C.green, fg: '#20642e' },
      proof: { bg: C.wash2, bar: '#39404d', fg: '#39404d' },
      plain: { bg: C.wash, bar: C.rule, fg: C.ink },
    }[kind] || { bg: C.wash, bar: C.accent, fg: C.accentDeep };
    let ctx = this.ctx;
    const d = this.doc;
    const pad = o.pad ?? 12, gutter = 7, innerW = ctx.w - 2 * pad - gutter;
    const titleH = title ? 17 : 0;
    // measuring pass (drawing disabled)
    const heights = blocks.map((b) => {
      const dry = ctx.clone(true);
      dry.x = ctx.x + pad + gutter; dry.w = innerW; dry.r = ctx.x + ctx.w - pad;
      const prev = this.ctx; this.ctx = dry;
      try { this.renderBlock(b, innerW); } finally { this.ctx = prev; }
      return dry.y - ctx.y;
    });
    const total = heights.reduce((a, b) => a + b, 0) + 2 * pad + titleH;
    this.need(Math.min(total, 150), o.label);
    ctx = this.ctx;
    const bg = (y, h) => {
      if (ctx.dry) return;
      d.save();
      d.rect(ctx.x, y, 3, h).fill(T.bar);
      d.rect(ctx.x + 3, y, ctx.w - 3, h).fill(T.bg);
      d.restore();
    };
    bg(ctx.y, pad + titleH);
    if (title && !ctx.dry) renderRich(d, ctx.x + pad + gutter, ctx.y + pad - 4, ctx.w - 2 * pad - gutter, title.toUpperCase(), { family: 'sans', size: 8.5, color: T.fg, leading: 1.25 });
    ctx.y += pad + titleH;
    const savedX = ctx.x, savedW = ctx.w;
    ctx.x = savedX + pad + gutter; ctx.w = innerW; ctx.r = savedX + savedW - pad;
    for (let i = 0; i < blocks.length; i++) {
      const h = heights[i];
      ctx.x = savedX; ctx.w = savedW; ctx.r = savedX + savedW;
      if (ctx.y + h > ctx.bottom && ctx.y > ctx.top + 30) { ctx.y = this.ctx.y; this.ctx = ctx; this.newPage(o.label); }
      bg(ctx.y, h);
      ctx.x = savedX + pad + gutter; ctx.w = innerW; ctx.r = savedX + savedW - pad;
      this.renderBlock(blocks[i], innerW);
      if (this.ctx !== ctx) { ctx = this.ctx; ctx.x = savedX + pad + gutter; ctx.w = innerW; }
    }
    ctx.x = savedX; ctx.w = savedW; ctx.r = savedX + savedW;
    bg(ctx.y, pad + 3);
    ctx.y += pad + 3 + (o.spaceAfter ?? 9);
  }

  renderBlock(b, width) {
    if (typeof b === 'string') this.text(b, { size: 10.1, spaceAfter: 5, justify: true, width });
    else if (b.rich) b.rich.forEach((p, i) => this.text(p, { size: 10.1, spaceAfter: i === b.rich.length - 1 ? 3 : 5, justify: true, width }));
    else if (b.list) this.bullets(b.list, { size: 9.9, gap: 2.8, indent: 15, spaceAfter: 3 });
    else if (b.kv) this.kvRows(b.kv, { size: 9.9, labelW: 88, gap: 3.5 });
    else if (b.code) this.code(b.code, { ...(b.codeOpts || {}), width });
    else if (b.sample) this.sample(b.sample, {});
    else if (b.table) this.table(b.table.headers, b.table.rows, { ...(b.table.opts || {}), width });
    else if (b.diagram) this.diagram(b.diagram);
    else if (b.text) this.text(b.text, { size: 10.1, spaceAfter: 5, width });
  }

  /* ---------------------------------------------------------------- samples */
  sample(s, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const half = (ctx.w - 20) / 2;
    const linesIn = String(s.in).split('\n'), linesOut = String(s.out).split('\n');
    const rows = Math.max(linesIn.length, linesOut.length);
    const noteH = s.note ? this.measure(s.note, { size: 9.4, spaceAfter: 0 }, ctx.w - 22) : 0;
    const boxH = 16 + rows * 12.6 + noteH + 20;
    this.need(boxH + 10, o.label);
    const y0 = ctx.y;
    if (!ctx.dry) {
      d.save();
      d.roundedRect(ctx.x, y0, ctx.w, boxH, 4).fill(C.wash).lineWidth(0.7).strokeColor(C.rule).stroke();
      d.rect(ctx.x, y0, ctx.w, 3).fill('#39404d');
      renderRich(d, ctx.x + 11, y0 + 10, half - 6, 'KIRISH', { family: 'sans', size: 7.6, color: C.accentDeep, leading: 1.25 });
      renderRich(d, ctx.x + half + 31, y0 + 10, half - 6, 'CHIQISH', { family: 'sans', size: 7.6, color: C.hot, leading: 1.25 });
      renderRich(d, ctx.x + 11, y0 + 24, half - 6, String(s.in), { family: 'mono', size: 9.1, color: C.ink, leading: 1.4 });
      renderRich(d, ctx.x + half + 31, y0 + 24, half - 6, String(s.out), { family: 'mono', size: 9.1, color: C.ink, leading: 1.4 });
      d.moveTo(ctx.x + half + 10, y0 + 11).lineTo(ctx.x + half + 10, y0 + 24 + rows * 12.6).lineWidth(0.7).strokeColor(C.rule).stroke();
      if (s.note) {
        const ny = y0 + 24 + rows * 12.6 + 6;
        d.moveTo(ctx.x + 11, ny).lineTo(ctx.x + ctx.w - 11, ny).lineWidth(0.6).strokeColor(C.rule).stroke();
        renderRich(d, ctx.x + 11, ny + 7, ctx.w - 22, s.note, { family: 'serif', size: 9.4, color: C.muted, leading: 1.45 });
      }
      d.restore();
    }
    ctx.y = y0 + boxH + (o.spaceAfter ?? 10);
  }

  /* ------------------------------------------------------------------- code */
  tokens(src) {
    const KW = new Set(('alignas alignof and asm auto bool break case catch char class compl const constexpr const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not nullptr operator or private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this throw true try typedef typeid typename union unsigned using virtual void volatile while xor ' +
      'cin cout cerr endl vector map set unordered_map unordered_set multiset pair queue deque stack priority_queue sort stable_sort lower_bound upper_bound binary_search push_back emplace_back pop_back begin end rbegin size clear ll max min swap fill memset accumulate gcd').split(/\s+/));
    const TYPE = new Set('int long short char bool float double void size_t string vector map set pair auto ll unsigned size_t int64_t int32_t'.split(/\s+/));
    const toks = [];
    let i = 0;
    const push = (t, cls) => { if (t) toks.push({ t, cls }); };
    while (i < src.length) {
      const r = src.slice(i); let m;
      if ((m = /^\/\/[^\n]*/.exec(r))) { push(m[0], 'com'); i += m[0].length; continue; }
      if ((m = /^\/\*[\s\S]*?\*\//.exec(r))) { push(m[0], 'com'); i += m[0].length; continue; }
      if ((m = /^#[^\n]*/.exec(r))) { push(m[0], 'pre'); i += m[0].length; continue; }
      if ((m = /^"(?:[^"\\]|\\.)*"/.exec(r)) || (m = /^'(?:[^'\\]|\\.)*'/.exec(r))) { push(m[0], 'str'); i += m[0].length; continue; }
      if ((m = /^\d+(\.\d+)?([eE][-+]?\d+)?(ull|ll|u|L|f)?/.exec(r))) { push(m[0], 'num'); i += m[0].length; continue; }
      if ((m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(r))) { push(m[0], KW.has(m[0]) ? 'kw' : (TYPE.has(m[0]) ? 'type' : 'id')); i += m[0].length; continue; }
      push(r[0], 'punct'); i += 1;
    }
    return toks;
  }

  code(src, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const COL = { kw: '#7c3aed', type: '#1c7ed6', str: '#2f9e44', com: '#98a1ac', num: '#e8590c', pre: '#c2255c', id: C.ink, punct: '#4c5561' };
    const rawLines = [[]];
    for (const tk of this.tokens(src)) {
      const parts = tk.t.split('\n');
      parts.forEach((p, idx) => {
        if (idx) rawLines.push([]);
        if (p) {
          const line = rawLines[rawLines.length - 1];
          const last = line[line.length - 1];
          if (last && last.cls === tk.cls) last.t += p; else line.push({ t: p, cls: tk.cls });
        }
      });
    }
    const padX = 12, padTop = o.caption ? 22 : 12, padBot = 12;
    let size = o.size ?? 8.4, lh = size * 1.44;
    const avail = (o.width ?? ctx.w) - 2 * padX;
    const lineW = (l) => l.reduce((a, t) => a + strWidth(d, MONO.r, size, t.t), 0);
    let maxW = Math.max(...rawLines.map(lineW));
    while (maxW > avail && size > 6.1) { size -= 0.2; lh = size * 1.44; maxW = Math.max(...rawLines.map(lineW)); }
    const lines = [];
    for (const line of rawLines) {
      let l = [], w = 0;
      for (const t of line) for (const ch of t.t) {
        const cw = strWidth(d, MONO.r, size, ch);
        if (w + cw > avail && l.length) { lines.push(l); l = []; w = 0; }
        const lastT = l[l.length - 1];
        if (lastT && lastT.cls === t.cls) lastT.t += ch; else l.push({ t: ch, cls: t.cls });
        w += cw;
      }
      lines.push(l);
    }
    let i = 0;
    let first = true;
    while (i < lines.length) {
      const room = ctx.bottom - ctx.y;
      const fit = Math.max(6, Math.floor((room - padTop - padBot) / lh));
      const take = Math.min(fit, lines.length - i);
      const boxH = take * lh + padTop + padBot;
      if (!ctx.dry) {
        d.save();
        d.roundedRect(ctx.x, ctx.y, o.width ?? ctx.w, boxH, 4).fill('#fafbfd').lineWidth(0.7).strokeColor(C.rule).stroke();
        d.rect(ctx.x, ctx.y, 3, boxH).fill('#39404d');
        if (o.caption && first) d.font(SANS.b).fontSize(7.6).fillColor(C.muted).text(o.caption.toUpperCase(), ctx.x + padX, ctx.y + 8, { characterSpacing: 1.2 });
        let yy = ctx.y + padTop + size * 0.8;
        for (let k = i; k < i + take; k++) {
          let xx = ctx.x + padX;
          for (const t of lines[k]) {
            d.font(MONO.r).fontSize(size).fillColor(COL[t.cls] || C.ink).text(t.t, xx, yy, { lineBreak: false, baseline: 'alphabetic' });
            xx += strWidth(d, MONO.r, size, t.t);
          }
          yy += lh;
        }
        d.restore();
      }
      ctx.y += boxH;
      i += take;
      first = false;
      if (i < lines.length) this.newPage(o.label);
    }
    ctx.y += o.spaceAfter ?? 10;
  }

  /* ------------------------------------------------------------------ table */
  table(headers, rows, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const w = o.width ?? ctx.w;
    const cols = headers.length;
    const widths = o.widths || Array(cols).fill(w / cols);
    const pad = 7, size = o.size ?? 9.3;
    const rowH = (cells) => Math.max(21, Math.max(...cells.map((c, i) => wrapAtoms(d, parseInline(String(c)), o.family || 'sans', size, widths[i] - pad * 2).length * size * 1.42)) + pad * 1.8);
    const heights = rows.map(rowH);
    const total = heights.reduce((a, b) => a + b, 0) + 24;
    this.need(total + 8, o.label);
    let y = ctx.y;
    if (!ctx.dry) {
      d.save();
      d.rect(ctx.x, y, w, 24).fill('#39404d');
      let x = ctx.x;
      headers.forEach((h, i) => {
        renderRich(d, x + pad, y + 7.5, widths[i] - pad * 2, String(h), { family: 'sans', size: 8.2, color: '#ffffff', leading: 1.3 });
        x += widths[i];
      });
      y += 24;
      rows.forEach((row, ri) => {
        const hh = heights[ri];
        if (ri % 2 === 0) d.rect(ctx.x, y, w, hh).fill(C.wash);
        let xx = ctx.x;
        row.forEach((cell, i) => {
          renderRich(d, xx + pad, y + pad * 0.85, widths[i] - pad * 2, String(cell), {
            family: 'sans', size, color: cell === '—' ? C.faint : C.body, leading: 1.45,
          });
          xx += widths[i];
        });
        d.moveTo(ctx.x, y).lineTo(ctx.x + w, y).lineWidth(0.5).strokeColor(C.ruleSoft).stroke();
        y += hh;
      });
      d.moveTo(ctx.x, y).lineTo(ctx.x + w, y).lineWidth(0.8).strokeColor(C.rule).stroke();
      d.restore();
    }
    ctx.y = y + (o.spaceAfter ?? 10);
  }

  /* --------------------------------------------------------------- diagrams */
  dCell(x, y, w, h, text, o = {}) {
    const ctx = this.ctx, d = ctx.doc;
    if (ctx.dry) return;
    d.save();
    if (o.r) d.roundedRect(x, y, w, h, o.r); else d.rect(x, y, w, h);
    d.fill(o.fill || C.paper);
    d.lineWidth(o.lw ?? 0.9).strokeColor(o.stroke || C.rule).stroke();
    if (o.textColor !== 'none' && text !== '' && text !== undefined) {
      const fs = o.size ?? 9;
      renderRich(d, x, y + h / 2 - fs * 0.62, w, String(text), {
        family: 'mono', size: fs, color: o.textColor || C.ink, align: 'center', leading: 1.2,
      });
    }
    d.restore();
  }
  dText(x, y, w, text, o = {}) {
    if (this.ctx.dry) return;
    renderRich(this.doc, x, y, w, text, {
      family: o.family || (o.font === SANS.b ? 'sans' : 'sans'), size: o.size ?? 7.8,
      color: o.color || C.muted, align: o.align || 'left', leading: o.leading ?? 1.5,
    });
  }
  dArrow(x1, y1, x2, y2, o = {}) {
    const d = this.doc; if (this.ctx.dry) return;
    const col = o.color || C.accent, s = o.head ?? 4.4;
    d.save();
    d.lineWidth(o.width ?? 1.1).strokeColor(col);
    if (o.dashed) d.dash(3, { space: 3 });
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - s * 0.85 * Math.cos(ang), by = y2 - s * 0.85 * Math.sin(ang);
    d.moveTo(x1, y1).lineTo(bx, by).stroke();
    d.undash();
    d.polygon([x2, y2], [x2 - s * Math.cos(ang - 0.44), y2 - s * Math.sin(ang - 0.44)], [x2 - s * Math.cos(ang + 0.44), y2 - s * Math.sin(ang + 0.44)]).fill(col);
    d.restore();
  }

  specHeight(spec) {
    switch (spec.type) {
      case 'cells':
        return 20 + (spec.cellH ?? 30) + 22 + (spec.pointers?.length || 0) * 22 + (spec.notes?.length || 0) * 13 + (spec.caption ? 14 : 0);
      case 'steps': {
        let y = 4;
        for (const st of spec.steps) y += (st.cellH ?? 19) + (st.note ? 13 : 0) + 8;
        return y + (spec.caption ? 13 : 0);
      }
      case 'matrix':
        return 18 + spec.rows.length * ((spec.cellH ?? 21) + 3) + (spec.caption ? 13 : 0);
      case 'flow': {
        const row = spec.dir === 'row', n = spec.boxes.length, bh = row ? 46 : 30;
        return 12 + (row ? bh : n * bh + (n - 1) * 16) + 12;
      }
      case 'bars': return 118;
      case 'nodes': return (spec.height ?? 150) + 10;
      default: return 70;
    }
  }

  diagram(spec) {
    const ctx = this.ctx;
    const h = this.specHeight(spec);
    this.need(h + 6, spec.label);
    const x0 = ctx.x, y0 = ctx.y, w = spec.width ?? ctx.w;
    ({ cells: () => this.dCells, steps: () => this.dSteps, matrix: () => this.dMatrix, flow: () => this.dFlow, bars: () => this.dBars, nodes: () => this.dNodes }[spec.type] || (() => () => {}))().call(this, x0, y0, w, spec);
    ctx.y = y0 + h;
    return ctx.y;
  }

  dCells(x0, y0, w, spec) {
    const vals = spec.values, n = vals.length, gap = spec.gap ?? 4;
    const cw = Math.min(spec.cellW ?? 34, (w - (n - 1) * gap) / n);
    const chh = spec.cellH ?? 30;
    const totalW = n * cw + (n - 1) * gap;
    const sx = spec.center === false ? x0 : x0 + (w - totalW) / 2;
    const hl = new Map((spec.highlight || []).map((h) => [h.i, h]));
    for (let i = 0; i < n; i++) {
      const x = sx + i * (cw + gap), h = hl.get(i);
      this.dCell(x, y0 + 18, cw, chh, vals[i], {
        fill: h ? (h.fill || C.accentSoft) : C.paper, stroke: h ? (h.stroke || C.accent) : C.rule,
        textColor: h ? (h.textColor || C.accentDeep) : C.ink, size: spec.size ?? 9, bold: !!h, lw: h ? 1.25 : 0.85,
      });
      if (spec.indexLabels !== false) this.dText(x, y0 + 18 + chh + 3, cw, String(i), { align: 'center', size: 6.8, color: C.faint });
      if (h?.label) this.dText(x - 14, y0 + 2, cw + 28, h.label, { align: 'center', size: 7.3, color: h.stroke || C.accent, font: SANS.b });
    }
    let yy = y0 + 18 + chh + 20;
    for (const p of spec.pointers || []) {
      const x = sx + p.i * (cw + gap) + cw / 2, col = p.color || C.hot;
      this.dArrow(x, yy + 10, x, yy + 1, { color: col, width: 1.2 });
      this.dText(x - 90, yy + 13, 180, p.text, { align: 'center', size: 7.6, color: col, font: SANS.b });
      yy += 22;
    }
    for (const note of spec.notes || []) { this.dText(sx, yy, totalW, note, { align: 'center', size: 7.9, color: C.muted }); yy += 13; }
    if (spec.caption) this.dText(x0, yy + 1, w, spec.caption, { align: 'center', size: 8, color: C.muted, font: SERIF.i });
  }

  dSteps(x0, y0, w, spec) {
    const labelW = spec.labelW ?? 104;
    let y = y0 + 4;
    for (const st of spec.steps) {
      const vals = st.values, n = vals.length, gap = 3, chh = st.cellH ?? 19;
      const cw = Math.min(st.cellW ?? 26, (w - labelW - (n - 1) * gap) / n);
      const hl = new Map((st.highlight || []).map((h) => [h.i, h]));
      this.dText(x0, y + chh / 2 - 4, labelW - 10, st.title, { size: 8, color: st.titleColor || C.ink, font: SANS.b });
      for (let i = 0; i < n; i++) {
        const h = hl.get(i);
        this.dCell(x0 + labelW + i * (cw + gap), y, cw, chh, vals[i], {
          fill: h ? (h.fill || C.accentSoft) : '#fdfdfe', stroke: h ? (h.stroke || C.accent) : C.ruleSoft,
          textColor: h ? (h.textColor || C.accentDeep) : C.body, size: st.size ?? 7.6, lw: h ? 1.15 : 0.7, bold: !!h,
        });
      }
      if (st.note) this.dText(x0 + labelW, y + chh + 1, w - labelW, st.note, { size: 7.3, color: C.muted });
      y += chh + (st.note ? 13 : 0) + 8;
    }
    if (spec.caption) this.dText(x0, y, w, spec.caption, { size: 8, color: C.muted, font: SERIF.i });
  }

  dMatrix(x0, y0, w, spec) {
    const rows = spec.rows, cols = rows[0].length, gap = 3;
    const offX = x0 + (spec.rowLabels ? 46 : 0);
    const cw = Math.min(spec.cellW ?? 30, (w - (spec.rowLabels ? 46 : 0) - (cols - 1) * gap) / cols);
    const chh = spec.cellH ?? 21;
    const hl = new Map((spec.highlight || []).map((h) => [`${h.r},${h.c}`, h]));
    for (let r = 0; r < rows.length; r++) {
      if (spec.rowLabels) this.dText(x0, y0 + 18 + r * (chh + gap) + chh / 2 - 4, 42, spec.rowLabels[r], { size: 7.5, color: C.muted, align: 'right' });
      for (let c = 0; c < cols; c++) {
        const h = hl.get(`${r},${c}`);
        this.dCell(offX + c * (cw + gap), y0 + 18 + r * (chh + gap), cw, chh, rows[r][c], {
          fill: h ? (h.fill || C.hotSoft) : C.paper, stroke: h ? (h.stroke || C.hot) : C.ruleSoft,
          textColor: h ? (h.textColor || C.hot) : C.body, size: 7.7, lw: h ? 1.2 : 0.7, bold: !!h,
        });
      }
    }
    if (spec.colLabels) for (let c = 0; c < cols; c++) this.dText(offX + c * (cw + gap), y0 + 4, cw, spec.colLabels[c], { align: 'center', size: 6.8, color: C.faint });
  }

  dFlow(x0, y0, w, spec) {
    const row = spec.dir === 'row', n = spec.boxes.length;
    const bw = row ? (w - (n - 1) * 18) / n : Math.min(210, w * 0.6);
    const bh = row ? 46 : 30;
    let cx = row ? x0 : x0 + (w - bw) / 2, cy = y0 + 12;
    spec.boxes.forEach((b, i) => {
      this.dCell(cx, cy, bw, bh, '', { fill: b.fill || C.wash, stroke: b.stroke || C.rule, lw: 1, r: 3 });
      this.dText(cx + 6, cy + (b.sub ? 6 : 9), bw - 12, b.label, { align: 'center', size: 8.5, color: b.color || C.ink, font: SANS.b });
      if (b.sub) this.dText(cx + 6, cy + 18, bw - 12, b.sub, { align: 'center', size: 7.4, color: C.muted });
      if (i < n - 1) {
        if (row) { this.dArrow(cx + bw + 3, cy + bh / 2, cx + bw + 15, cy + bh / 2, { color: C.faint }); cx += bw + 18; }
        else { this.dArrow(cx + bw / 2, cy + bh + 2, cx + bw / 2, cy + bh + 14, { color: C.faint }); cy += bh + 16; }
      }
    });
  }

  dBars(x0, y0, w, spec) {
    const vals = spec.values, n = vals.length, gap = 16;
    const max = Math.max(...vals, 1);
    const bw = Math.min(46, (w - (n - 1) * gap) / n);
    const baseY = y0 + 78;
    const sx = x0 + (w - (n * bw + (n - 1) * gap)) / 2;
    vals.forEach((v, i) => {
      const h = Math.max(3, (v / max) * 58), hi = spec.highlight?.includes(i);
      const x = sx + i * (bw + gap);
      this.dCell(x, baseY - h, bw, h, '', { fill: hi ? C.hot : C.accentSoft, stroke: hi ? C.hot : C.accent, lw: 1 });
      this.dText(x, baseY - h - 12, bw, String(v), { align: 'center', size: 7.5, color: hi ? C.hot : C.accentDeep, font: SANS.b });
      this.dText(x - 12, baseY + 5, bw + 24, String(spec.labels?.[i] ?? i), { align: 'center', size: 6.8, color: C.muted });
    });
    if (spec.caption) this.dText(x0, baseY + 20, w, spec.caption, { size: 8, color: C.muted, font: SERIF.i });
  }

  dNodes(x0, y0, w, spec) {
    const H = spec.height ?? 150, R = spec.r ?? 13;
    const px = (nx) => x0 + 16 + nx * (w - 32), py = (ny) => y0 + 8 + ny * (H - 20);
    for (const e of spec.edges || []) {
      const a = spec.nodes.find((n) => n.id === e.from), b = spec.nodes.find((n) => n.id === e.to);
      const x1 = px(a.x), y1 = py(a.y), x2 = px(b.x), y2 = py(b.y);
      const ang = Math.atan2(y2 - y1, x2 - x1);
      this.dArrow(x1 + R * Math.cos(ang), y1 + R * Math.sin(ang), x2 - R * Math.cos(ang), y2 - R * Math.sin(ang), { color: e.color || C.rule, dashed: e.dashed, width: e.width ?? 1.1 });
      if (e.label) this.dText((x1 + x2) / 2 - 34, (y1 + y2) / 2 - 11, 68, e.label, { align: 'center', size: 7, color: e.color || C.muted });
    }
    for (const n of spec.nodes) {
      this.dCell(px(n.x) - R, py(n.y) - R, R * 2, R * 2, n.label, {
        r: R, fill: n.fill || C.paper, stroke: n.stroke || C.accent, textColor: n.color || C.ink, size: n.size ?? 8, bold: true, lw: n.lw ?? 1.15,
      });
    }
    if (spec.caption) this.dText(x0, y0 + H - 4, w, spec.caption, { size: 8, color: C.muted, font: SERIF.i });
  }

  /* -------------------------------------------------------------------- misc */
  rule(o = {}) {
    const ctx = this.ctx, d = this.doc;
    ctx.y += o.spaceBefore ?? 6;
    if (!ctx.dry) d.moveTo(ctx.x, ctx.y).lineTo(ctx.x + (o.width ?? ctx.w), ctx.y).lineWidth(0.6).strokeColor(C.rule).stroke();
    ctx.y += o.spaceAfter ?? 8;
  }

  caption(text) {
    this.text(text, { family: 'serif', size: 8.6, color: C.muted, justify: false, spaceAfter: 10, indent: 6 });
  }

  chips(items, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const size = 7.7, padX = 7.5, h = 16.5;
    this.need(h + 8, o.label);
    let x = ctx.x; const y = ctx.y;
    if (!ctx.dry) {
      d.save();
      for (const it of items) {
        const label = typeof it === 'string' ? it : it.text;
        const th = (typeof it === 'object' && it.kind && {
          tag: { bg: C.accentSoft, fg: C.accentDeep }, warn: { bg: C.hotSoft, fg: C.hot },
          ok: { bg: C.greenSoft, fg: C.green }, meta: { bg: C.wash2, fg: C.muted },
        }[it.kind]) || { bg: C.accentSoft, fg: C.accentDeep };
        const tw = richWidth(d, label, 'sans', size);
        if (x + tw + padX * 2 > ctx.x + ctx.w) { x = ctx.x; }
        d.roundedRect(x, y, tw + padX * 2, h, 8.5).fill(th.bg);
        renderRich(d, x + padX, y + 5.4, tw + 2, label, { family: 'sans', size, color: th.fg, leading: 1.15 });
        x += tw + padX * 2 + 5;
      }
      d.restore();
    }
    ctx.y = y + h + (o.spaceAfter ?? 8);
  }

  statRow(stats, o = {}) {
    const ctx = this.ctx, d = this.doc;
    const n = stats.length, gap = 8;
    const bw = (ctx.w - (n - 1) * gap) / n, bh = 60;
    this.need(bh + 10, o.label);
    if (!ctx.dry) {
      stats.forEach((s, i) => {
        const x = ctx.x + i * (bw + gap);
        d.save();
        d.roundedRect(x, ctx.y, bw, bh, 4).fill(s.bg || C.wash).lineWidth(0.7).strokeColor(C.rule).stroke();
        d.font(SANS.b).fontSize(7.4).fillColor(s.labelColor || C.muted).text(s.label.toUpperCase(), x + 10, ctx.y + 9, { characterSpacing: 1, lineBreak: false });
        renderRich(d, x + 10, ctx.y + 24, bw - 20, String(s.value), { family: 'serif', size: s.size ?? 13.5, color: s.color || C.ink, leading: 1.2 });
        d.restore();
      });
    }
    ctx.y += bh + (o.spaceAfter ?? 10);
  }

  /* --------------------------------------------------------- problem scaffold */
  problemHeader(p, o = {}) {
    this.chromeLabel = o.running || `${p.id} · ${p.title}`;
    this.need(130, o.running);
    const ctx = this.ctx, d = this.doc;
    const y0 = ctx.y;
    if (!ctx.dry) {
      d.save();
      d.roundedRect(ctx.x, y0, 44, 44, 7).fill(C.accent);
      d.font(SANS.b).fontSize(19).fillColor('#fff').text(p.id, ctx.x, y0 + 12, { width: 44, align: 'center', lineBreak: false });
      d.font(SANS.b).fontSize(17).fillColor(C.ink).text(p.title, ctx.x + 58, y0 + 1, { width: ctx.w - 58, lineGap: 2 });
      if (p.titleEn) d.font(SERIF.i).fontSize(9.6).fillColor(C.faint).text(p.titleEn, ctx.x + 58, y0 + 23, { width: ctx.w - 58, lineBreak: false });
      d.restore();
    }
    ctx.y = y0 + 36;
    if (p.subtitle) {
      const sx = ctx.x; ctx.x += 58; ctx.w -= 58; ctx.r -= 58;
      this.text(p.subtitle, { size: 10.5, color: C.muted, spaceAfter: 3, justify: false, width: ctx.w });
      ctx.x = sx; ctx.w += 58; ctx.r += 58;
    }
    ctx.y += 7;
    if (p.chips) this.chips(p.chips, { spaceAfter: 7 });
    if (!ctx.dry) d.moveTo(ctx.x, ctx.y).lineTo(ctx.x + ctx.w, ctx.y).lineWidth(0.8).strokeColor(C.rule).stroke();
    ctx.y += 13;
  }

  /* ------------------------------------------------------------------ output */
  async save() {
    const stream = fs.createWriteStream(this.out);
    const done = new Promise((res, rej) => { stream.on('finish', () => res(this.out)); stream.on('error', rej); });
    this.doc.pipe(stream);
    this.doc.end();
    return done;
  }
}
