// Checks the layout of each SVG in the Chromium that Playwright installs in the app and renders it to PNG at
// 3840 x 2160 (device scale 2).
//   node render.mjs <the root of a metis-app clone> <png folder>   (run build.mjs first). PNGs are for review
//   only and go into <png folder>, which must lie outside the repository; the deliverables are the SVG files.
// Checks, measured in the browser on the real SVG with its embedded fonts:
//   text on text, text or icon outside its card or the canvas, icon on text, card on card,
//   a line through text, a card, a tag or another line (except its own bus), tags on other cards.
// Exit code 1 when any check fails; the PNG is still written so the failure can be looked at.
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { FILES } from './data.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..')
// The root of metis-docs: this file sits in architecture/diagrams/src.
const REPO = resolve(HERE, '../../..')
const [APP, PNG] = process.argv.slice(2)
if (!APP || !PNG) throw new Error('usage: node render.mjs <the root of a metis-app clone> <png folder outside the repository>')
const PNG_DIR = resolve(PNG)
if (PNG_DIR === REPO || PNG_DIR.startsWith(REPO + '/')) throw new Error(`PNG folder must be outside the repository: ${PNG_DIR}`)
const JOBS = FILES.map((id) => ({ id }))
const { chromium } = createRequire(join(resolve(APP), 'package.json'))('@playwright/test')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 })
let failed = false
for (const d of JOBS) {
  const svgFile = join(OUT, `${d.id}.svg`)
  await page.goto(pathToFileURL(svgFile).href)
  await page.evaluate(async () => { await document.fonts.ready })
  const report = await page.evaluate(() => {
    const problems = []
    const R = (el) => { const r = el.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom } }
    const hit = (a, b, m = 0) => a.x0 < b.x1 - m && b.x0 < a.x1 - m && a.y0 < b.y1 - m && b.y0 < a.y1 - m
    const inside = (a, b, m = 0) => a.x0 >= b.x0 + m && a.x1 <= b.x1 - m && a.y0 >= b.y0 + m && a.y1 <= b.y1 - m
    const fmt = (b) => `[${Math.round(b.x0)},${Math.round(b.y0)} ${Math.round(b.x1)},${Math.round(b.y1)}]`
    const ownerOf = (el) => { const n = el.closest('[data-node]'); return n ? n.getAttribute('data-node') : null }
    const boxOf = (n) => { const [x, y, w, h] = n.getAttribute('data-box').split(',').map(Number); return { x0: x, y0: y, x1: x + w, y1: y + h } }
    // ink box of a text: real horizontal extent, vertical extent from baseline and size (accents and descenders)
    const texts = [...document.querySelectorAll('text')].map((el) => {
      const r = R(el); const y = +el.getAttribute('y'); const s = +el.getAttribute('font-size')
      return { el, t: el.textContent, box: { x0: r.x0, x1: r.x1, y0: y - 0.98 * s, y1: y + 0.26 * s }, node: ownerOf(el),
        tag: !!el.closest('[data-tag]'), label: el.closest('[data-label-for]')?.getAttribute('data-label-for') || null }
    })
    const glyphs = [...document.querySelectorAll('[data-icon],[data-logo]')].map((el) => ({ el, box: R(el), node: ownerOf(el), name: el.getAttribute('data-icon') || el.getAttribute('data-logo'), tag: !!el.closest('[data-tag]') }))
    const nodes = [...document.querySelectorAll('[data-node]')].map((el) => ({ id: el.getAttribute('data-node'), box: boxOf(el) }))
    const tagBoxes = [...document.querySelectorAll('[data-tag] rect, [data-tab]')].map((el) => ({ box: R(el), node: ownerOf(el) || 'region-tab' }))
    const labels = [...document.querySelectorAll('[data-label-for] rect')].map((el) => ({ box: R(el), line: el.closest('[data-label-for]').getAttribute('data-label-for') }))
    const canvas = { x0: 8, y0: 8, x1: 1912, y1: 1072 }
    // 1. text on text
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      if (hit(texts[i].box, texts[j].box, 0.5)) problems.push(`text on text: "${texts[i].t}" ${fmt(texts[i].box)} and "${texts[j].t}" ${fmt(texts[j].box)}`)
    }
    // 2. text and glyphs inside their card (tags excluded: they straddle the top edge) and inside the canvas
    const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))
    for (const t of texts) {
      if (!inside(t.box, canvas)) problems.push(`text outside canvas: "${t.t}" ${fmt(t.box)}`)
      if (t.node && !t.tag && !inside(t.box, nodeById[t.node].box, 4)) problems.push(`text outside card ${t.node}: "${t.t}" ${fmt(t.box)} card ${fmt(nodeById[t.node].box)}`)
    }
    for (const g of glyphs) {
      if (!inside(g.box, canvas)) problems.push(`icon outside canvas: ${g.name} ${fmt(g.box)}`)
      if (g.node && !g.tag && !inside(g.box, nodeById[g.node].box, 4)) problems.push(`icon outside card ${g.node}: ${g.name} ${fmt(g.box)}`)
      for (const t of texts) if (hit(g.box, t.box, 1)) problems.push(`icon on text: ${g.name} ${fmt(g.box)} and "${t.t}" ${fmt(t.box)}`)
    }
    for (let i = 0; i < glyphs.length; i++) for (let j = i + 1; j < glyphs.length; j++) {
      if (hit(glyphs[i].box, glyphs[j].box, 1)) problems.push(`icon on icon: ${glyphs[i].name} and ${glyphs[j].name} ${fmt(glyphs[i].box)}`)
    }
    // 3. cards and tags
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      if (hit(nodes[i].box, nodes[j].box)) problems.push(`card on card: ${nodes[i].id} and ${nodes[j].id}`)
    }
    for (const tg of tagBoxes) {
      for (const n of nodes) if (n.id !== tg.node && hit(tg.box, n.box)) problems.push(`tag of ${tg.node} on card ${n.id} ${fmt(tg.box)}`)
      for (const t of texts) if (!t.tag && !(tg.node === 'region-tab' && t.el.closest('[data-tab]')) && hit(tg.box, t.box)) problems.push(`tag of ${tg.node} on text "${t.t}"`)
    }
    // 4. lines: segments against text, cards, tags, labels and other lines
    const segs = []
    for (const el of document.querySelectorAll('[data-line]')) {
      const pts = el.getAttribute('data-pts').split(' ').map((p) => p.split(',').map(Number))
      for (let i = 1; i < pts.length; i++) segs.push({ id: el.getAttribute('data-line'), group: el.getAttribute('data-group'), from: el.getAttribute('data-from'), to: el.getAttribute('data-to'), a: pts[i - 1], b: pts[i] })
    }
    const segBox = (s) => ({ x0: Math.min(s.a[0], s.b[0]) - 1.5, x1: Math.max(s.a[0], s.b[0]) + 1.5, y0: Math.min(s.a[1], s.b[1]) - 1.5, y1: Math.max(s.a[1], s.b[1]) + 1.5 })
    for (const s of segs) {
      const sb = segBox(s)
      for (const t of texts) if (t.label !== s.id && hit(sb, t.box)) problems.push(`line ${s.id} through text "${t.t}"`)
      for (const n of nodes) if (n.id !== s.from && n.id !== s.to && hit(sb, n.box, 1)) problems.push(`line ${s.id} through card ${n.id}`)
      for (const tg of tagBoxes) if (hit(sb, tg.box)) problems.push(`line ${s.id} through tag of ${tg.node}`)
      for (const lb of labels) if (lb.line !== s.id && hit(sb, lb.box)) problems.push(`line ${s.id} through label of ${lb.line}`)
    }
    // 5. region boundary: keeps at least 5 px away from text, cards, tags and line labels
    for (const el of document.querySelectorAll('[data-region]')) {
      const pts = el.getAttribute('data-pts').split(' ').map((p) => p.split(',').map(Number))
      pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length]; const sb = segBox({ a, b }); const near = { x0: sb.x0 - 5, x1: sb.x1 + 5, y0: sb.y0 - 5, y1: sb.y1 + 5 }
        for (const t of texts) if (!t.el.closest('[data-tab]') && hit(near, t.box)) problems.push(`region edge near text "${t.t}"`)
        for (const n of nodes) if (hit(near, n.box)) problems.push(`region edge near card ${n.id}`)
        for (const tg of tagBoxes) if (tg.node !== 'region-tab' && hit(near, tg.box)) problems.push(`region edge near tag of ${tg.node}`)
        for (const lb of labels) if (hit(near, lb.box)) problems.push(`region edge near label of ${lb.line}`)
      })
    }
    for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
      const p = segs[i]; const q = segs[j]
      if (p.group === q.group) continue
      if (hit(segBox(p), segBox(q), 2)) problems.push(`line ${p.id} crosses line ${q.id}`)
    }
    return { problems, counts: { texts: texts.length, glyphs: glyphs.length, cards: nodes.length, segments: segs.length, minFont: Math.min(...texts.map((t) => +t.el.getAttribute('font-size'))) } }
  })
  mkdirSync(PNG_DIR, { recursive: true })
  await page.screenshot({ path: join(PNG_DIR, `${d.id}.png`), clip: { x: 0, y: 0, width: 1920, height: 1080 } })
  const c = report.counts
  console.log(`${d.id}: ${c.texts} texts, ${c.glyphs} icons and logos, ${c.cards} cards, ${c.segments} line segments, smallest font ${c.minFont} px: ${report.problems.length} problem(s)`)
  for (const p of report.problems) console.log(`  ${p}`)
  if (report.problems.length) failed = true
}
await browser.close()
process.exit(failed ? 1 : 0)
