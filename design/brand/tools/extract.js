// Extracts Fraunces 700 outlines for the word "Metis" into glyphs.json (size 100, baseline y=104).
// The dot of the i is removed so the logo can place its own diamond (milestone) there.
const opentype = require('opentype.js');
const fs = require('fs');
const font = opentype.loadSync('fraunces.ttf');
const SIZE = 100, BASE = 104, scale = SIZE / font.unitsPerEm;

function contours(path) {             // split a path into closed contours
  const out = []; let cur = null;
  for (const c of path.commands) {
    if (c.type === 'M') { cur = new opentype.Path(); out.push(cur); }
    cur.commands.push(c);
  }
  return out;
}
function run(text) {
  const glyphs = font.stringToGlyphs(text);
  let x = 0; const list = [];
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    let p = g.getPath(x, BASE, SIZE);
    let tittle = null;
    if (text[i] === 'i') {             // drop the topmost contour (the dot), keep its box for the diamond
      const cs = contours(p).map(c => ({ c, bb: c.getBoundingBox() })).sort((a, b) => a.bb.y1 - b.bb.y1);
      tittle = cs[0].bb;
      p = new opentype.Path(); cs.slice(1).forEach(o => p.extend(o.c));
    }
    const bb = p.getBoundingBox();
    const adv = g.advanceWidth * scale;
    const kern = i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0;
    list.push({ ch: text[i], x: +x.toFixed(2), adv: +adv.toFixed(2), kern: +kern.toFixed(2), d: p.toPathData(2),
      bbox: { x1: +bb.x1.toFixed(2), y1: +bb.y1.toFixed(2), x2: +bb.x2.toFixed(2), y2: +bb.y2.toFixed(2) },
      tittle: tittle && { x1: +tittle.x1.toFixed(2), y1: +tittle.y1.toFixed(2), x2: +tittle.x2.toFixed(2), y2: +tittle.y2.toFixed(2) } });
    x += adv + kern;
  }
  return { width: +x.toFixed(2), glyphs: list };
}
const os2 = font.tables.os2 || {};
const out = { family: font.names.fontFamily.en, unitsPerEm: font.unitsPerEm, base: BASE,
  capHeight: os2.sCapHeight ? +(os2.sCapHeight * scale).toFixed(2) : null,
  xHeight: os2.sxHeight ? +(os2.sxHeight * scale).toFixed(2) : null,
  word: run('Metis') };
fs.writeFileSync('glyphs.json', JSON.stringify(out, null, 1));
console.log(out.family, 'capHeight', out.capHeight, 'xHeight', out.xHeight, 'width', out.word.width);
out.word.glyphs.forEach(g => console.log(g.ch, 'x', g.x, 'adv', g.adv, 'kern', g.kern, 'bbox', JSON.stringify(g.bbox), g.tittle ? 'tittle ' + JSON.stringify(g.tittle) : ''));
