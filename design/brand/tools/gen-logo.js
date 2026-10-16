// Final Metis logo set: Fraunces 700 outlines, SVG masters, PNG via resvg.
// Concept: the i is "intelligence" (accent colour) and its dot is a diamond, the milestone and gate
// symbol of governance. The stand-alone mark is the M with the same diamond above it.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const G = JSON.parse(fs.readFileSync(path.join(__dirname, 'glyphs.json'), 'utf8'));

const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'logo'));
fs.mkdirSync(OUT, { recursive: true });

const INK = '#111827', VIOLET = '#6D3BEF', WHITE = '#FFFFFF';
const W = G.word.glyphs, M = W[0], I = W.find(g => g.ch === 'i');
const TRACK = 1.5;
const r2 = v => +v.toFixed(2);
const diamond = (cx, cy, h, fill) => `<path d="M${r2(cx)} ${r2(cy - h)}L${r2(cx + h)} ${r2(cy)}L${r2(cx)} ${r2(cy + h)}L${r2(cx - h)} ${r2(cy)}Z" fill="${fill}"/>`;

// ---- wordmark ---------------------------------------------------------------
const iShift = W.indexOf(I) * TRACK;
const DOT = { cx: (I.tittle.x1 + I.tittle.x2) / 2 + iShift, cy: (I.tittle.y1 + I.tittle.y2) / 2, h: 10.5 };
const minX = Math.min(...W.map(g => g.bbox.x1)), maxX = W[W.length - 1].bbox.x2 + TRACK * (W.length - 1);
const minY = Math.min(DOT.cy - DOT.h, ...W.map(g => g.bbox.y1)), maxY = Math.max(...W.map(g => g.bbox.y2));
const PAD = 8;
const VB = { x: r2(minX - PAD), y: r2(minY - PAD), w: r2(maxX - minX + 2 * PAD), h: r2(maxY - minY + 2 * PAD) };

function wordmark(ink, accent) {
  const letters = W.map((g, k) => `<path d="${g.d}" transform="translate(${r2(k * TRACK)} 0)" fill="${g === I ? accent : ink}"/>`).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-label="Metis">
  <title>Metis</title>
  ${letters}
  ${diamond(DOT.cx, DOT.cy, DOT.h, accent)}
</svg>
`;
}

// ---- mark: the M with the diamond above, in a 100 box --------------------------
// gap and diamond size are in glyph units; the small variant enlarges the diamond for 32px and below.
function mark(ink, accent, h, gap, bg) {
  const cx = (M.bbox.x1 + M.bbox.x2) / 2, cy = M.bbox.y1 - gap - h;
  const x1 = M.bbox.x1, x2 = M.bbox.x2, y1 = cy - h, y2 = M.bbox.y2;
  const fit = bg ? 64 : 88;                                   // content height inside the box
  const sc = fit / (y2 - y1);
  const tx = (100 - (x2 - x1) * sc) / 2, ty = (100 - (y2 - y1) * sc) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Metis mark">
  <title>Metis mark</title>${bg ? `\n  <rect width="100" height="100" rx="22" fill="${bg}"/>` : ''}
  <g transform="translate(${r2(tx)} ${r2(ty)}) scale(${sc.toFixed(4)}) translate(${r2(-x1)} ${r2(-y1)})">
    <path d="${M.d}" fill="${ink}"/>
    ${diamond(cx, cy, h, accent)}
  </g>
</svg>
`;
}

const files = {
  'metis-wordmark.svg': wordmark(INK, VIOLET),
  'metis-wordmark-on-dark.svg': wordmark(WHITE, VIOLET),
  'metis-wordmark-mono.svg': wordmark(INK, INK),
  'metis-wordmark-mono-white.svg': wordmark(WHITE, WHITE),
  'metis-mark.svg': mark(INK, VIOLET, 11, 7),
  'metis-mark-on-dark.svg': mark(WHITE, VIOLET, 11, 7),
  'metis-mark-mono.svg': mark(INK, INK, 11, 7),
  'metis-mark-mono-white.svg': mark(WHITE, WHITE, 11, 7),
  'metis-mark-small.svg': mark(INK, VIOLET, 15, 8),
  'metis-app-icon.svg': mark(WHITE, VIOLET, 12, 7, INK),
  'metis-favicon.svg': mark(WHITE, VIOLET, 17, 8, INK)
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg);

// ---- PNG exports ------------------------------------------------------------
function png(svg, width, name) {
  const buf = new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: 'rgba(0,0,0,0)' }).render().asPng();
  fs.writeFileSync(path.join(OUT, name), buf);
  return buf;
}
png(files['metis-wordmark.svg'], 1200, 'metis-wordmark@2x.png');
png(files['metis-wordmark.svg'], 600, 'metis-wordmark.png');
png(files['metis-wordmark-on-dark.svg'], 1200, 'metis-wordmark-on-dark@2x.png');
for (const s of [512, 256, 128, 64]) png(files['metis-mark.svg'], s, `metis-mark-${s}.png`);
for (const s of [32, 16]) png(files['metis-mark-small.svg'], s, `metis-mark-${s}.png`);
for (const s of [1024, 512, 180]) png(files['metis-app-icon.svg'], s, `metis-app-icon-${s}.png`);
const ico = [16, 32, 48].map(s => ({ s, buf: png(files['metis-favicon.svg'], s, `metis-favicon-${s}.png`) }));

// ---- favicon.ico with embedded PNGs -------------
function writeIco(entries, file) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.s >= 256 ? 0 : e.s, o); dir.writeUInt8(e.s >= 256 ? 0 : e.s, o + 1);
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.buf.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += e.buf.length;
  });
  fs.writeFileSync(file, Buffer.concat([header, dir, ...entries.map(e => e.buf)]));
}
writeIco(ico, path.join(OUT, 'favicon.ico'));

console.log('viewBox', VB);
console.log(fs.readdirSync(OUT).sort().map(f => f + ' ' + fs.statSync(path.join(OUT, f)).size).join('\n'));
