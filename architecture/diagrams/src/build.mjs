// Generates the pitch diagrams (SVG, 1920 x 1080) from data.mjs: Spring Boot stack, English, 11 diagrams.
//   node build.mjs <the root of a metis-app clone>                 -> ../01-*.svg to ../11-*.svg; the FROZEN list in data.mjs is never rewritten (a change is an error)
//   node render.mjs <the root of a metis-app clone> <png folder>   -> layout checks, plus PNG 3840 x 2160 written only into <png folder>
// Text widths are measured with the embedded fonts in the Chromium that Playwright installs in the app,
// so logos, tags and wrapping are exact.
// The build stops (exit 1) on: text wider than its card, a total that differs from `expect`,
// an em or en dash, a font size under 14 px, or a character the embedded fonts do not cover.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliDecompressSync } from 'node:zlib'
import * as D from './data.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..')
const ICONS = JSON.parse(readFileSync(join(HERE, 'icons.json'), 'utf8'))
const [APP] = process.argv.slice(2)
if (!APP) throw new Error('usage: node build.mjs <the root of a metis-app clone>')
const { chromium } = createRequire(join(resolve(APP), 'package.json'))('@playwright/test')

// ---------- fonts ----------------------------------------------------------------------------
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
const VIET = 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB'
const FACES = [
  ['MetisInter', 'inter-latin.woff2', '100 900', LATIN, 'fi'], ['MetisInter', 'inter-vietnamese.woff2', '100 900', VIET, 'fi'],
  ['MetisManrope', 'manrope-latin.woff2', '200 800', LATIN, 'fm'], ['MetisManrope', 'manrope-vietnamese.woff2', '200 800', VIET, 'fm'],
]
const FONT_FILES = Object.fromEntries(FACES.map((f) => [f[1], readFileSync(join(HERE, 'fonts', f[1]))]))
const FONT_CSS = FACES.map(([fam, file, w, r]) => `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${FONT_FILES[file].toString('base64')}) format('woff2');font-weight:${w};font-style:normal;unicode-range:${r}}`).join('\n')
const CLASS_CSS = `.fi{font-family:MetisInter,Inter,'Helvetica Neue',Arial,sans-serif}.fm{font-family:MetisManrope,Manrope,'Helvetica Neue',Arial,sans-serif}`

// Glyph coverage: a character is covered when one face of the family maps it and its unicode-range allows it.
const KNOWN = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill']
function woff2Cmap(buf) {
  const b128 = (o) => { let v = 0; for (let i = 0; i < 5; i++) { const x = buf[o.p++]; v = (v << 7) | (x & 0x7f); if (!(x & 0x80)) return v } }
  const n = buf.readUInt16BE(12); const o = { p: 48 }; const dir = []
  for (let i = 0; i < n; i++) {
    const fl = buf[o.p++]; const t = fl & 0x3f; const tag = t === 63 ? buf.toString('latin1', o.p, (o.p += 4)) : KNOWN[t]
    const orig = b128(o); const v = (fl >> 6) & 3; const tr = tag === 'glyf' || tag === 'loca' ? v !== 3 : v !== 0
    dir.push({ tag, len: tr ? b128(o) : orig })
  }
  const data = brotliDecompressSync(buf.subarray(o.p)); let off = 0; let c
  for (const e of dir) { if (e.tag === 'cmap') c = data.subarray(off, off + e.len); off += e.len }
  const set = new Set(); const nt = c.readUInt16BE(2)
  for (let i = 0; i < nt; i++) {
    const so = c.readUInt32BE(4 + i * 8 + 4); const fmt = c.readUInt16BE(so)
    if (fmt === 4) { const seg = c.readUInt16BE(so + 6) / 2; for (let s = 0; s < seg; s++) { const end = c.readUInt16BE(so + 14 + s * 2); const start = c.readUInt16BE(so + 16 + seg * 2 + s * 2); for (let cp = start; cp <= end && cp !== 0xffff; cp++) set.add(cp) } }
    if (fmt === 12) { const g = c.readUInt32BE(so + 12); for (let k = 0; k < g; k++) { const r = so + 16 + k * 12; for (let cp = c.readUInt32BE(r); cp <= c.readUInt32BE(r + 4); cp++) set.add(cp) } }
  }
  return set
}
const inRange = (range, cp) => range.split(',').some((part) => {
  const [a, b] = part.trim().replace('U+', '').split('-').map((h) => parseInt(h, 16)); return cp >= a && cp <= (b ?? a)
})
const COVER = { fi: new Set(), fm: new Set() }
for (const [, file, , range, cls] of FACES) for (const cp of woff2Cmap(FONT_FILES[file])) if (inRange(range, cp)) COVER[cls].add(cp)

// ---------- styles -----------------------------------------------------------------------------
const INK = '#16191F'
const STYLES = {
  title: ['fm', 800, 44, '#14171C'], subtitle: ['fi', 400, 18, '#4A5160'],
  railName: ['fm', 800, 21, null, 0.6], railDesc: ['fi', 500, 15, '#59606B'],
  name: ['fm', 800, 21, INK], nameHero: ['fm', 800, 28, INK],
  tech: ['fi', 600, 16, '#23272F'], techHero: ['fi', 600, 19, '#23272F'], provider: ['fi', 500, 16, '#3B414B'],
  purpose: ['fi', 400, 15, '#4E5561'], purposeHero: ['fi', 400, 16, '#3E4450'], note: ['fi', 500, 15, '#4E5561'],
  tag: ['fm', 800, 16, '#FFFFFF'], warnTag: ['fi', 700, 15, D.WARN], greyTag: ['fi', 600, 15, '#4A5160'],
  lineLabel: ['fi', 600, 15, null], footer: ['fi', 400, 14, '#6B7280'],
  flagName: ['fm', 800, 16, INK],
  chip: ['fi', 600, 15, '#23272F'], shipTitle: ['fm', 800, 15, null, 0.6], ship: ['fi', 500, 16, '#2E333B'],
  panelLabel: ['fm', 800, 15, '#9FB3C8', 0.8], panelBig: ['fm', 800, 50, '#FFFFFF'], panelUnit: ['fm', 800, 24, '#FFFFFF'],
  panelMid: ['fm', 800, 40, '#FFFFFF'], panelYear: ['fm', 800, 30, '#FFFFFF'], panelNote: ['fi', 500, 15, '#C9D6E3'],
  regionTab: ['fm', 800, 17, '#FFFFFF', 1.2], regionNote: ['fi', 600, 15, '#FFFFFF'],
  chipText: ['fi', 600, 14, '#1864AB'],
  whyName: ['fm', 800, 21, INK], whyBody: ['fi', 400, 15, '#2E333B'],
  noteTitle: ['fm', 800, 18, INK], noteBody: ['fi', 400, 15, '#2E333B'],
  legalTitle: ['fm', 800, 22, INK], legalLaw: ['fi', 600, 16, '#3B414B'], legalItem: ['fi', 400, 16, '#23272F'],
  matrixTitle: ['fm', 800, 15, null, 0.8], matrixName: ['fi', 700, 15, INK],
  ctrlNum: ['fm', 800, 16, '#FFFFFF'], ctrlText: ['fi', 500, 16, '#23272F'],
  cmpCrit: ['fm', 800, 18, INK], cmpHead: ['fm', 800, 17, INK], cmpDetail: ['fi', 400, 15, '#4E5561'],
  cmpColHead: ['fm', 800, 19, '#FFFFFF', 0.8],
  panelLine: ['fi', 500, 16, '#DCE6F0'], panelStrong: ['fi', 700, 16, '#FFFFFF'],
}
const st = (name, over = {}) => { const [cls, weight, size, color, ls] = STYLES[name]; return { cls, weight, size, color, ls: ls || 0, ...over } }

// ---------- helpers ----------------------------------------------------------------------------
const n2 = (v) => Math.round(v * 100) / 100
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const tint = (hex, a) => '#' + hexToRgb(hex).map((c) => Math.round(c * a + 255 * (1 - a)).toString(16).padStart(2, '0')).join('').toUpperCase()
const layerColor = (k) => (k === 'region' ? D.REGION : D.LAYERS[k].main)
// English number format: 13,768.22 (comma for thousands, decimal point).
const fmtNum = (v, dec = 2) => {
  const neg = v < 0; const [i, f] = Math.abs(v).toFixed(dec).split('.')
  return (neg ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? '.' + f : '')
}
const fmtUsd = (cents) => (cents === 0 ? '0' : fmtNum(cents / 100))

// Measurement: unknown strings get an estimate, are queued, and are measured in Chromium before the next pass.
const MEASURED = new Map(); const PENDING = new Map()
const mkey = (s, t) => `${s.cls}|${s.weight}|${s.size}|${s.ls}|${t}`
function measure(s, t) {
  const k = mkey(s, t); if (MEASURED.has(k)) return MEASURED.get(k)
  PENDING.set(k, { cls: s.cls, weight: s.weight, size: s.size, ls: s.ls, t }); return s.size * 0.6 * t.length
}

// Per-diagram bookkeeping for the checks.
let CTX
function T(x, y, t, s, anchor) {
  CTX.texts.push({ t, s })
  return `<text class="${s.cls}" x="${n2(x)}" y="${n2(y)}" font-size="${s.size}" font-weight="${s.weight}" fill="${s.color}"` +
    `${s.ls ? ` letter-spacing="${s.ls}"` : ''}${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(t)}</text>`
}
function icon(name, x, y, size, color, sw = 1.7) {
  const ic = ICONS.lucide.icons[name]; if (!ic) throw new Error(`icon ${name} missing from icons.json`)
  CTX.icons.add(name)
  return `<g data-icon="${name}" transform="translate(${n2(x)} ${n2(y)}) scale(${n2(size / 24 * 1000) / 1000})" fill="none" stroke="${color}" color="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ic.svg}</g>`
}
function logo(slug, x, y, size) {
  const lg = ICONS.simple.icons[slug]; if (!lg) throw new Error(`logo ${slug} missing from icons.json`)
  CTX.logos.add(slug)
  return `<g data-logo="${slug}" transform="translate(${n2(x)} ${n2(y)}) scale(${n2(size / 24 * 1000) / 1000})"><path d="${lg.path}" fill="#${lg.hex}"/></g>`
}
function arrowGlyph(x, cy, w, color) {
  return `<path d="M${n2(x)} ${n2(cy)} H${n2(x + w - 6)} M${n2(x + w - 11)} ${n2(cy - 5)} L${n2(x + w - 4)} ${n2(cy)} L${n2(x + w - 11)} ${n2(cy + 5)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
}
// A line of text runs, logos, lucide icons and arrows. Returns svg and width.
function segs(x, y, list, s, iconColor) {
  let cx = x; let out = ''; const L = Math.round(s.size * 1.25); const mid = y - s.size * 0.36
  list.forEach((g, i) => {
    if (i > 0) cx += s.size * 0.34
    if (g.logo) { out += logo(g.logo, cx, mid - L / 2, L); cx += L }
    else if (g.icon) { out += icon(g.icon, cx, mid - L / 2, L, iconColor || s.color, 2); cx += L }
    else if (g.arrow) { out += arrowGlyph(cx + 3, mid, 22, s.color); cx += 28 }
    else if (g.chip) { const r = chip(cx, mid - 10, 20, g.chip, g.tone || 'cert'); out += r.svg; cx += r.w }
    else { const ss = g.sep ? { ...s, color: '#9AA1AB' } : s; out += T(cx, y, g.t, ss); cx += measure(ss, g.t) }
  })
  return { svg: out, w: cx - x }
}
const lineBox = (s) => s.size * 1.36
const baselineIn = (top, s) => top + lineBox(s) / 2 + s.size * 0.36

// Text block: lines [{s, text|segs}], laid out from `top`; checks each line against `maxW`.
function block(x, top, lines, maxW, owner, iconColor) {
  let y = top; let out = ''
  for (const ln of lines) {
    if (ln.gap) { y += ln.gap; continue }
    if (ln.chipRow) {
      const r = chipRowSvg(x, y + (ln.h - ln.chipH) / 2, ln.chipRow, ln.chipH, ln.chipSize); out += r.svg
      if (r.w > maxW + 0.5) CTX.errors.push(`${owner}: chips "${ln.chipRow.map((c) => c.t).join(', ')}" are ${Math.ceil(r.w)} px, room ${Math.floor(maxW)} px`)
      y += ln.h; continue
    }
    const b = ln.h ? y + ln.h / 2 + ln.s.size * 0.36 : baselineIn(y, ln.s)
    const r = ln.segs ? segs(x, b, ln.segs, ln.s, iconColor) : { svg: T(x, b, ln.text, ln.s), w: measure(ln.s, ln.text) }
    out += r.svg
    if (r.w > maxW + 0.5) CTX.errors.push(`${owner}: "${ln.text || ln.segs.map((g) => g.t || g.chip || `[${g.logo || g.icon || 'arrow'}]`).join(' ')}" is ${Math.ceil(r.w)} px, room ${Math.floor(maxW)} px`)
    y += ln.h || lineBox(ln.s)
  }
  return { svg: out, h: y - top }
}
const blockHeight = (lines) => lines.reduce((a, ln) => a + (ln.gap || (ln.chipRow || ln.h ? ln.h : lineBox(ln.s))), 0)

// ---------- wrapping and chips ---------------------------------------------------------------------
function wrap(text, s, maxW) {
  const words = String(text).split(' '); const out = []; let cur = ''
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w
    if (!cur || measure(s, cand) <= maxW) cur = cand
    else { out.push(cur); cur = w }
  }
  if (cur) out.push(cur)
  return out
}
// Chip tones: fill, border, text. cert = certification, sla = uptime or support commitment, grey = note, warn = caveat.
const CHIP = {
  cert: ['#E7F5FF', '#74C0FC', '#1864AB'], sla: ['#EBFBEE', '#8CE99A', '#2B8A3E'], grey: ['#F1F3F5', '#CED4DA', '#495057'],
  warn: ['#FFF4E6', D.WARN, D.WARN], light: ['#FFFFFF', '#FFFFFF', D.REGION],
}
const chipWidth = (label, s) => measure(s, label) + 16
function chip(x, y, h, label, tone = 'cert', size = 14) {
  const [fill, stroke, color] = Array.isArray(tone) ? tone : CHIP[tone]; const s = st('chipText', { color, size }); const w = chipWidth(label, s)
  return { w, svg: `<g data-chip="${esc(label)}"><rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>${T(x + 8, y + h / 2 + s.size * 0.36, label, s)}</g>` }
}
function chipRows(chips, maxW, size = 14) {
  const s = st('chipText', { size }); const rows = [[]]; let w = 0
  for (const c of chips) {
    const cw = chipWidth(c.t, s)
    if (rows[rows.length - 1].length && w + 6 + cw > maxW) { rows.push([]); w = 0 }
    w += (rows[rows.length - 1].length ? 6 : 0) + cw; rows[rows.length - 1].push(c)
  }
  return rows.filter((r) => r.length)
}
function chipRowSvg(x, y, row, h = 24, size = 14) {
  let cx = x; let out = ''
  for (const c of row) { const r = chip(cx, y, h, c.t, c.tone, size); out += r.svg; cx += r.w + 6 }
  return { svg: out, w: cx - 6 - x }
}
const chipLines = (chips, maxW, h = 24, size = 14) => chipRows(chips, maxW, size).map((row) => ({ chipRow: row, h: h + 4, chipH: h, chipSize: size }))

// ---------- prices -------------------------------------------------------------------------------
function cents(price, vndPerUsd) {
  if (price.usd !== undefined) return Math.round(price.usd * 100)
  return Math.round((price.vnd * 100) / vndPerUsd)
}
function totalsFor(d) {
  const rate = d.vndPerUsd
  const priced = d.nodes.filter((n) => n.price)
  const sum = (items) => {
    const vnd = items.filter((p) => p.vnd !== undefined).reduce((a, p) => a + p.vnd, 0)
    const usd = items.filter((p) => p.usd !== undefined).reduce((a, p) => a + Math.round(p.usd * 100), 0)
    return { vnd, cents: usd + (vnd ? Math.round((vnd * 100) / rate) : 0), usdCents: usd }
  }
  const rec = sum(priced.map((n) => n.price))
  const t = d.totals
  const keep = t.cheapest ? t.cheapest.keep.map((id) => { const n = d.nodes.find((m) => m.id === id); if (!n) throw new Error(`${d.id}: cheapest keeps unknown ${id}`); return n.price }) : []
  const cheap = t.cheapest ? sum([...t.cheapest.own, ...keep]) : null
  const year = D.ONE_OFF_USD.recommended.map((one) => rec.cents * 12 + Math.round(D.YEARLY_USD * 100) + one * 100)
  const res = { rec, cheap, year }
  const check = (label, got, want) => { if (got !== Math.round(want * 100)) CTX.errors.push(`${d.id}: ${label} computes ${got / 100}, source says ${want}`) }
  check('recommended total', rec.cents, t.recommended.expect)
  if (t.cheapest) check('cheapest total', cheap.cents, t.cheapest.expect)
  if (t.firstYear) { check('first year from', year[0], t.firstYear.expect[0]); check('first year to', year[1], t.firstYear.expect[1]) }
  return res
}

// ---------- node pieces --------------------------------------------------------------------------
const PAD = 14; const ICON = 72
function cardRect(n, c) {
  if (n.style === 'contract') return `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="16" fill="#FFFFFF" stroke="${D.CONTRACT}" stroke-width="2" stroke-dasharray="7 6"/>`
  const hero = n.type === 'app' || n.type === 'core' || n.outline
  // mark: an amber outline on an ordinary card (diagram 5: the cards that moved into DigitalOcean)
  const stroke = n.mark ? ` stroke="${D.LAYERS.moved.main}" stroke-width="3.5"` : hero ? ` stroke="${c}" stroke-width="2.5"` : ''
  return `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="16" fill="${tint(c, hero ? 0.11 : 0.085)}"${stroke}/>`
}
// Tags straddle the card's top edge, right-aligned: [moved] [grey] [warn] [price].
function tags(n, c, d) {
  const items = []
  if (n.moved) items.push({ kind: 'moved', t: n.moved })
  if (n.noteTag) items.push({ kind: 'grey', t: n.noteTag })
  if (n.warn) items.push({ kind: 'warn', t: n.warn.replace('{alt}', n.alt ? fmtUsd(cents(n.alt, d.vndPerUsd)) : '{alt}') })
  if (n.price) items.push({ kind: 'price', t: `${fmtUsd(cents(n.price, d.vndPerUsd))} USD` })
  if (n.stepTag) items.push({ kind: 'price', t: n.stepTag })
  let right = n.x + n.w - PAD; let out = ''; const h = 28; const y = n.y - h / 2
  for (const it of items.reverse()) {
    const moved = it.kind === 'moved' // solid amber, white text: matches the card's amber outline
    const s = it.kind === 'price' ? st('tag') : it.kind === 'warn' ? st('warnTag') : moved ? st('warnTag', { color: '#FFFFFF' }) : st('greyTag')
    const iconW = it.kind === 'warn' ? 18 : 0
    const w = measure(s, it.t) + 22 + (iconW ? iconW + 5 : 0); const x = right - w
    const fill = it.kind === 'price' ? c : it.kind === 'warn' ? '#FFF4E6' : moved ? D.LAYERS.moved.main : '#F1F3F5'
    const stroke = it.kind === 'warn' ? ` stroke="${D.WARN}" stroke-width="1.5"` : it.kind === 'grey' ? ' stroke="#ADB5BD" stroke-width="1.2"' : ''
    out += `<g data-tag="${it.kind}"><rect x="${n2(x)}" y="${y}" width="${n2(w)}" height="${h}" rx="14" fill="${fill}"${stroke}/>`
    if (iconW) out += icon('triangle-alert', x + 10, y + 5, 18, D.WARN, 2.2)
    out += T(x + 11 + (iconW ? iconW + 5 : 0), y + h / 2 + s.size * 0.36, it.t, s) + '</g>'
    right = x - 6
  }
  return { svg: out, left: right }
}
function lines4(n) {
  const L = [{ s: st('name'), text: n.name }]
  if (n.tech) L.push({ s: st('tech'), segs: n.tech })
  if (n.tech2) L.push({ s: st('tech'), segs: n.tech2 })
  if (n.provider) L.push({ s: st('provider'), segs: n.provider })
  return L
}
function nodeSide(n, c) {
  const ix = n.x + PAD; const tx = ix + ICON + PAD
  const L = lines4(n)
  if (Array.isArray(n.purpose)) for (const p of n.purpose) {
    if (Array.isArray(p)) L.push({ s: st('purpose'), segs: p }) // one line of text runs and logos
    else L.push(...wrap(p, st('purpose'), n.x + n.w - PAD - tx).map((t) => ({ s: st('purpose'), text: t })))
  }
  else if (n.purpose) L.push({ s: st('purpose'), text: n.purpose })
  if (n.badges) L.push({ chipRow: n.badges, h: 28, chipH: 22, chipSize: 14 })
  if (Array.isArray(n.purpose) && blockHeight(L) > n.h - 8) CTX.errors.push(`${n.id}: text is ${Math.round(blockHeight(L))} px tall, card is ${n.h} px`)
  let out = icon(n.icon, ix, n.y + (n.h - ICON) / 2, ICON, n.style === 'contract' ? D.CONTRACT : c)
  out += block(tx, n.y + (n.h - blockHeight(L)) / 2, L, n.x + n.w - PAD - tx, n.id).svg
  return out
}
function nodeStack(n, c) {
  const ix = n.x + PAD; const iy = n.y + PAD; const tx = ix + ICON + PAD
  const L = lines4(n)
  if (n.badges && n.purpose) L.push({ s: st('purpose'), text: n.purpose }) // chips take the row under the icon
  let out = icon(n.icon, ix, iy, ICON, c)
  out += block(tx, iy + (ICON - blockHeight(L)) / 2, L, n.x + n.w - PAD - tx, n.id).svg
  if (n.badges) out += block(ix, iy + ICON + 6, [{ chipRow: n.badges, h: 24, chipH: 24, chipSize: 14 }], n.w - 2 * PAD, n.id).svg
  else if (n.purpose) out += block(ix, iy + ICON + 4, [{ s: st('purpose'), text: n.purpose }], n.w - 2 * PAD, n.id).svg
  if (n.badges && iy + ICON + 6 + 24 > n.y + n.h - 6) CTX.errors.push(`${n.id}: chips end at ${iy + ICON + 30}, card ends at ${n.y + n.h}`)
  return out
}
function chips(n, c, top) {
  const s = st('chip'); const h = 30; let x = n.x + PAD; let y = top; let out = ''
  for (const [ic, label] of n.chips) {
    const w = 10 + 18 + 7 + measure(s, label) + 12
    if (x + w > n.x + n.w - PAD) { x = n.x + PAD; y += h + 8 }
    out += `<g data-chip="${esc(label)}"><rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${h}" rx="15" fill="#FFFFFF" stroke="${tint(c, 0.45)}" stroke-width="1.5"/>`
    out += icon(ic, x + 10, y + 6, 18, c, 2.2) + T(x + 35, y + h / 2 + s.size * 0.36, label, s) + '</g>'
    x += w + 8
  }
  if (y + h > n.y + n.h - 8) CTX.errors.push(`${n.id}: chips end at ${y + h}, card ends at ${n.y + n.h}`)
  return out
}
function nodeVm(n, c) {
  let out = nodeStack(n, c)
  out += chips(n, c, n.y + PAD + ICON + 4 + lineBox(st('purpose')) + 8)
  return out
}
function nodeApp(n, c) {
  const big = 96; const ix = n.x + 20; const tx = ix + big + 20
  const shipW = 330; const shipX = n.x + n.w - 20 - shipW
  const L = [{ s: st('nameHero'), text: n.name }, { s: st('techHero'), segs: n.tech }, { s: st('purposeHero'), text: n.purpose }]
  let out = icon(n.icon, ix, n.y + (n.h - big) / 2, big, c, 1.6)
  out += block(tx, n.y + (n.h - blockHeight(L)) / 2, L, shipX - 24 - tx, n.id).svg
  out += `<line x1="${shipX - 20}" y1="${n.y + 16}" x2="${shipX - 20}" y2="${n.y + n.h - 16}" stroke="${tint(c, 0.45)}" stroke-width="1.5"/>`
  const S = [{ s: st('shipTitle', { color: c }), text: n.ship.title.toUpperCase() }, ...n.ship.rows.map((r) => ({ s: st('ship'), segs: r }))]
  out += block(shipX, n.y + (n.h - blockHeight(S)) / 2, S, shipW, n.id, c).svg
  return out
}
function nodeCore(n, c) {
  const big = 96; const ix = n.x + 20; const iy = n.y + 20; const tx = ix + big + 18
  const R = [{ s: st('nameHero'), text: n.name }, ...n.techLines.map((sg) => ({ s: st('techHero'), segs: sg }))]
  let out = icon(n.icon, ix, iy, big, c, 1.6)
  out += block(tx, iy + (big - blockHeight(R)) / 2, R, n.x + n.w - 18 - tx, n.id).svg
  const P = n.purposeLines.map((t) => ({ s: st('purposeHero'), text: t }))
  const top = Math.max(iy + big, iy + (big + blockHeight(R)) / 2) + 10
  out += block(ix, top, P, n.w - 34, n.id).svg
  let y = top + blockHeight(P) + 10
  out += `<line x1="${ix}" y1="${n2(y)}" x2="${n.x + n.w - 20}" y2="${n2(y)}" stroke="${tint(c, 0.4)}" stroke-width="1.5"/>`
  y += 8
  for (const t of n.notes) {
    const s = st('note'); const b = baselineIn(y, s)
    out += `<circle cx="${ix + 4}" cy="${n2(b - s.size * 0.33)}" r="3.2" fill="${c}"/>`
    out += block(ix + 16, y, [{ s, text: t }], n.w - 56, n.id).svg
    y += lineBox(s) + 2
  }
  if (y > n.y + n.h - 6) CTX.errors.push(`${n.id}: content ends at ${Math.round(y)}, card ends at ${n.y + n.h}`)
  return out
}

// ---------- explanation cards (diagrams 8 to 11) ---------------------------------------------------
// "why" card: icon, name with logos, then labelled sections (ROLE, MEETS, EVIDENCE) with a hanging label column.
function wrapIndent(text, s, firstW, restW) {
  const words = String(text).split(' '); const out = []; let cur = ''
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w; const room = out.length ? restW : firstW
    if (!cur || measure(s, cand) <= room) cur = cand
    else { out.push(cur); cur = w }
  }
  if (cur) out.push(cur)
  return out
}
// why row (diagrams 10 and 11): component (icon, logos, name, sub lines), then what it does, the requirement, the evidence.
function nodeWhyRow(n, c) {
  const [x1, x2, x3] = n.grid.cols; const ICN = 72
  const S = { name: st('whyName'), sub: st('purpose'), body: st('whyBody', { size: 16 }) }
  let out = icon(n.icon, n.x + 16, n.y + (n.h - ICN) / 2, ICN, c)
  const nx = n.x + 16 + ICN + 16; const nw = x1 - 24 - nx
  const logos = (n.logos || []).map((l) => ({ logo: l }))
  const lw = logos.length * (Math.round(S.name.size * 1.25) + S.name.size * 0.34)
  const names = Array.isArray(n.name) ? n.name : wrapIndent(n.name, S.name, nw - lw, nw)
  const N = names.map((t, i) => ({ s: S.name, segs: [...(i ? [] : logos), { t }] }))
  for (const t of n.sub || []) N.push({ s: S.sub, text: t })
  const cell = (x, w, L) => {
    const h = blockHeight(L)
    if (h > n.h - 16) CTX.errors.push(`${n.id}: cell at x ${x} is ${Math.round(h)} px tall, row is ${n.h} px`)
    return block(x, n.y + (n.h - h) / 2, L, w, n.id).svg
  }
  out += cell(nx, nw, N)
  for (const x of n.grid.cols) out += `<line x1="${x - 12}" y1="${n.y + 12}" x2="${x - 12}" y2="${n.y + n.h - 12}" stroke="${tint(c, 0.35)}" stroke-width="1.5"/>`
  const text = (t, w) => wrap(t.replace(/\b(BRD|ADD|section) (?=\d)/g, '$1\u00a0'), S.body, w).map((x) => ({ s: S.body, text: x })) // keep "BRD 1463" on one line
  const w1 = x2 - 24 - x1; const w2 = x3 - 24 - x2; const w3 = n.x + n.w - 16 - x3
  out += cell(x1, w1, text(n.role, w1)) + cell(x2, w2, text(n.meets, w2))
  const E = [...(n.chips ? chipLines(n.chips, w3) : []), ...(n.chipRows || []).map((r) => ({ chipRow: r, h: 28, chipH: 24, chipSize: 14 }))]
  if (n.after) E.push(...text(n.after, w3))
  out += cell(x3, w3, E)
  return out
}
function nodeWhyHead(n) {
  const s = st('cmpColHead', { size: 16 }); const xs = [n.x + 18, ...n.grid.cols]; const mid = n.y + n.h / 2 + s.size * 0.36
  let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14" fill="#102A43"/>`
  n.titles.forEach((t, i) => { out += T(xs[i], mid, t, s) })
  let cx = xs[3] + measure(s, n.titles[3]) + 16
  for (const k of n.key) { const r = chip(cx, n.y + (n.h - 24) / 2, 24, k.t, k.tone); out += r.svg; cx += r.w + 6 }
  if (cx - 6 > n.x + n.w - 16) CTX.errors.push(`${n.id}: chip key ends at ${Math.round(cx - 6)}, row ends at ${n.x + n.w - 16}`)
  return out
}
// note card: icon, title, wrapped paragraphs, optional chips.
function nodeNote(n, c) {
  const ICN = n.iconSize || 72; const ix = n.x + PAD; const iy = n.y + PAD
  let out = icon(n.icon, ix, n.valign === 'top' ? iy : n.y + (n.h - ICN) / 2, ICN, c)
  const tx = ix + ICN + 16; const tw = n.x + n.w - PAD - tx
  const L = [n.titleLogos ? { s: st('noteTitle'), segs: [...n.titleLogos.map((l) => ({ logo: l })), { t: n.title }] } : { s: st('noteTitle'), text: n.title }]
  for (const [i, para] of (n.paras || []).entries()) {
    if (i) L.push({ gap: 6 })
    if (para.chips) L.push(...chipLines(para.chips, tw))
    else if (Array.isArray(para)) L.push({ s: st('noteBody'), segs: para }) // one line of text runs, logos and arrows
    else for (const t of wrap(para, st('noteBody'), tw)) L.push({ s: st('noteBody'), text: t })
  }
  const h = blockHeight(L)
  out += block(tx, n.valign === 'top' ? iy : n.y + (n.h - h) / 2, L, tw, n.id).svg
  if (h > n.h - 2 * PAD + 2) CTX.errors.push(`${n.id}: content is ${Math.round(h)} px tall, card has ${n.h - 2 * PAD}`)
  return out
}
// Hand-drawn flags at any size (same drawing as diagram 1).
function flagSvg(kind, x, y, W, Hh) {
  const k = W / 78; let out = ''
  if (kind === 'sg') {
    out += `<rect x="${x}" y="${y}" width="${W}" height="${Hh}" fill="#FFFFFF"/><rect x="${x}" y="${y}" width="${W}" height="${Hh / 2}" fill="#EF3340"/>`
    out += `<circle cx="${n2(x + 17 * k)}" cy="${n2(y + 13 * k)}" r="${n2(9.2 * k)}" fill="#FFFFFF"/><circle cx="${n2(x + 20.6 * k)}" cy="${n2(y + 13 * k)}" r="${n2(8.6 * k)}" fill="#EF3340"/>`
    for (let i = 0; i < 5; i++) {
      const a = ((-90 + i * 72) * Math.PI) / 180
      out += `<polygon points="${star(x + (25 + 4.6 * Math.cos(a)) * k, y + (13.4 + 4.6 * Math.sin(a)) * k, 2.05 * k)}" fill="#FFFFFF"/>`
    }
  } else {
    out += `<rect x="${x}" y="${y}" width="${W}" height="${Hh}" fill="#DA251D"/><polygon points="${star(x + W / 2, y + Hh / 2 + 1.5 * k, W * 0.2)}" fill="#FFCD00"/>`
  }
  return out + `<rect x="${x + 0.5}" y="${y + 0.5}" width="${W - 1}" height="${Hh - 1}" fill="none" stroke="#ADB5BD" stroke-width="1"/>`
}
// legal card: flags, title, law, then items (small icon plus wrapped text).
function nodeLegal(n, c) {
  const FW = 66; const FH = 44; const ix = n.x + PAD + 4; const iy = n.y + PAD + 4
  let out = ''; let fx = ix
  n.flags.forEach((f, i) => {
    if (i) { out += arrowGlyph(fx + 4, iy + FH / 2, 26, '#868E96'); fx += 34 }
    out += `<g data-icon="flag-${f}">${flagSvg(f, fx, iy, FW, FH)}</g>`; fx += FW
  })
  const tx = fx + 18; const tw = n.x + n.w - PAD - tx
  const H = [{ s: st('legalTitle'), text: n.title }, ...wrap(n.law, st('legalLaw'), tw).map((t) => ({ s: st('legalLaw'), text: t }))]
  const hy = iy + Math.max(0, (FH - blockHeight(H)) / 2)
  out += block(tx, hy, H, tw, n.id).svg
  let y = Math.max(iy + FH, hy + blockHeight(H)) + 22
  const s = st('legalItem'); const IC = 30; const textX = n.x + PAD + 4 + IC + 14; const textW = n.x + n.w - PAD - textX
  for (const it of n.items) {
    const L = wrap(it.text, s, textW).map((t) => ({ s, text: t }))
    out += icon(it.icon, n.x + PAD + 4, y + (lineBox(s) - IC) / 2 + 1, IC, c, 2)
    out += block(textX, y, L, textW, n.id).svg
    y += blockHeight(L) + 16
  }
  if (y - 16 > n.y + n.h - 8) CTX.errors.push(`${n.id}: content ends at ${Math.round(y - 16)}, card ends at ${n.y + n.h}`)
  return out
}
// evidence matrix: title, then one row per supplier with its chips.
function nodeMatrix(n, c) {
  const x0 = n.x + PAD + 4; let y = n.y + PAD
  let out = icon(n.icon, x0, y, 72, c)
  const tx = x0 + 72 + 16; const tw = n.x + n.w - PAD - tx
  const H = [{ s: st('noteTitle'), text: n.title }, ...wrap(n.intro, st('noteBody'), tw).map((t) => ({ s: st('noteBody'), text: t }))]
  out += block(tx, y + (72 - blockHeight(H)) / 2, H, tw, n.id).svg
  y += 72 + 12
  const ns = st('matrixName'); const NW = Math.max(...n.rows.map((r) => measure(ns, r.name))) + 18
  for (const r of n.rows) {
    out += T(x0, y + 12 + ns.size * 0.36, r.name, ns)
    const cr = chipRowSvg(x0 + NW, y, r.chips, 24, 14); out += cr.svg
    if (x0 + NW + cr.w > n.x + n.w - PAD) CTX.errors.push(`${n.id}: chips of ${r.name} reach ${Math.round(x0 + NW + cr.w)}, card ends at ${n.x + n.w - PAD}`)
    y += 24 + n.rowGap
  }
  if (y - n.rowGap > n.y + n.h - 8) CTX.errors.push(`${n.id}: rows end at ${Math.round(y - n.rowGap)}, card ends at ${n.y + n.h}`)
  return out
}
// controls card: icon, title, intro, numbered rows.
function nodeControls(n, c) {
  const x0 = n.x + PAD + 4; let y = n.y + PAD
  let out = icon(n.icon, x0, y, 72, c)
  const tx = x0 + 72 + 16; const tw = n.x + n.w - PAD - tx
  const H = [{ s: st('noteTitle'), text: n.title }, ...wrap(n.intro, st('noteBody'), tw).map((t) => ({ s: st('noteBody'), text: t }))]
  out += block(tx, y + Math.max(0, (72 - blockHeight(H)) / 2), H, tw, n.id).svg
  y += Math.max(72, blockHeight(H)) + 14
  const ns = st('ctrlNum'); const ts = st('ctrlText')
  const cols = n.cols || 1; const per = Math.ceil(n.rows.length / cols); const colW = (n.x + n.w - PAD - x0) / cols; const top = y
  n.rows.forEach((r, i) => {
    const cx = x0 + Math.floor(i / per) * colW; if (i % per === 0) y = top
    const bw = measure(ns, r.num) + 18
    out += `<rect x="${n2(cx)}" y="${n2(y)}" width="${n2(bw)}" height="28" rx="8" fill="${c}"/>` + T(cx + 9, y + 14 + ns.size * 0.36, r.num, ns)
    const tw2 = cx + colW - 16 - (cx + 74)
    const L = wrap(r.text, ts, tw2).map((t) => ({ s: ts, text: t }))
    out += block(cx + 74, y + (28 - lineBox(ts)) / 2, L, tw2, n.id).svg
    y += Math.max(28, blockHeight(L)) + n.rowGap
    if (y - n.rowGap > n.y + n.h - 8) CTX.errors.push(`${n.id}: rows end at ${Math.round(y - n.rowGap)}, card ends at ${n.y + n.h}`)
  })
  return out
}
// list card (diagram 2): icon with a title beside it, then rows of logos and text at full width.
function nodeList(n, c) {
  const ix = n.x + PAD; const iy = n.y + PAD; const tx = ix + ICON + PAD
  const H = [{ s: st('name'), text: n.title }, ...(n.sub ? [{ s: st('purpose'), text: n.sub }] : [])]
  let out = icon(n.icon, ix, iy, ICON, c)
  out += block(tx, iy + (ICON - blockHeight(H)) / 2, H, n.x + n.w - PAD - tx, n.id).svg
  const R = n.rows.map((r) => ({ s: st('tech'), segs: r, h: n.rowH || 30 }))
  out += block(ix, iy + ICON + 8, R, n.w - 2 * PAD, n.id).svg
  if (iy + ICON + 8 + blockHeight(R) > n.y + n.h - 8) CTX.errors.push(`${n.id}: rows end at ${Math.round(iy + ICON + 8 + blockHeight(R))}, card ends at ${n.y + n.h}`)
  return out
}
// pill (diagram 6): a component box, its name after an optional logo and an optional second line, centred.
function nodePill(n) {
  const name = st('name', { size: 17 })
  const L = [n.logo ? { s: name, segs: [{ logo: n.logo }, { t: n.name }] } : { s: name, text: n.name }, ...(n.sub ? [{ s: st('purpose', { size: 14 }), text: n.sub }] : [])]
  return block(n.x + 12, n.y + (n.h - blockHeight(L)) / 2, L, n.w - 24, n.id).svg
}
// table row (diagram 6): a criterion, then one cell per side; the header row is dark.
function nodeRow(n, c) {
  const [x1, x2] = n.grid.cols; const cw = n.grid.cellW; const head = !!n.head
  const cs = head ? st('cmpColHead', { size: 16 }) : st('cmpCrit', { size: 16 }); const ts = head ? cs : st('purpose', { color: '#2E333B' })
  let out = head ? `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12" fill="#102A43"/>` : ''
  const cell = (x, t, s, w) => { const L = wrap(t, s, w).map((x2) => ({ s, text: x2 })); const h = blockHeight(L)
    if (h > n.h - 8) CTX.errors.push(`${n.id}: "${t}" is ${Math.round(h)} px tall, row is ${n.h} px`)
    return block(x, n.y + (n.h - h) / 2, L, w, n.id).svg }
  out += cell(n.x + 16, n.crit, cs, x1 - 24 - n.x - 16)
  if (n.span) return out + `<line x1="${x1 - 12}" y1="${n.y + 8}" x2="${x1 - 12}" y2="${n.y + n.h - 8}" stroke="${tint(c, 0.35)}" stroke-width="1.5"/>` + cell(x1, n.left, ts, n.x + n.w - 16 - x1)
  for (const [x, t] of [[x1, n.left], [x2, n.right]]) {
    if (!head) out += `<line x1="${x - 12}" y1="${n.y + 8}" x2="${x - 12}" y2="${n.y + n.h - 8}" stroke="${tint(c, 0.35)}" stroke-width="1.5"/>`
    out += cell(x, t, ts, cw)
  }
  return out
}
// gate card (diagram 3): icon with name and tool beside it, what the gate blocks below, the pass mark as chips at the bottom.
function nodeGate(n, c) {
  const ix = n.x + PAD; const iy = n.y + PAD; const tx = ix + ICON + PAD; const bw = n.w - 2 * PAD
  const L = [{ s: st('name'), text: n.name }, { s: st('tech'), segs: n.tool }]
  let out = icon(n.icon, ix, iy, ICON, c)
  out += block(tx, iy + (ICON - blockHeight(L)) / 2, L, n.x + n.w - PAD - tx, n.id).svg
  const body = st('purpose', { color: '#2E333B' }); const muted = st('purpose', { color: '#6B7280' })
  const B = wrap(n.blocks, body, bw).map((t) => ({ s: body, text: t }))
  if (n.aside) B.push({ gap: 4 }, ...wrap(n.aside, muted, bw).map((t) => ({ s: muted, text: t })))
  out += block(ix, iy + ICON + 8, B, bw, n.id).svg
  const chipY = n.y + n.h - PAD - 24
  if (iy + ICON + 8 + blockHeight(B) > (n.pass ? chipY - 4 : n.y + n.h - 8)) CTX.errors.push(`${n.id}: text ends at ${Math.round(iy + ICON + 8 + blockHeight(B))}, room until ${n.pass ? chipY - 4 : n.y + n.h - 8}`)
  if (n.pass) out += block(ix, chipY, [{ chipRow: n.pass, h: 24, chipH: 24, chipSize: 14 }], bw, n.id).svg
  return out
}
// comparison row: criterion cell, then one cell per side with a marker, a short verdict and a detail line.
const MARK = { good: ['circle-check', '#2B8A3E'], watch: ['triangle-alert', D.WARN] }
function nodeCompare(n, c) {
  const G = n.grid; const ICN = 72
  let out = icon(n.icon, n.x + PAD + 2, n.y + (n.h - ICN) / 2, ICN, c, 1.7)
  const cx = n.x + PAD + 2 + ICN + 16; const cw = G.critW - (cx - n.x) - 12
  const C = wrap(n.crit, st('cmpCrit'), cw).map((t) => ({ s: st('cmpCrit'), text: t }))
  out += block(cx, n.y + (n.h - blockHeight(C)) / 2, C, cw, n.id).svg
  for (const [side, x] of [[n.sg, G.sgX], [n.vn, G.vnX]]) {
    out += `<line x1="${x - 18}" y1="${n.y + 10}" x2="${x - 18}" y2="${n.y + n.h - 10}" stroke="#DEE2E6" stroke-width="1.5"/>`
    let tx = x
    if (side.mark) { const [ic, col] = MARK[side.mark]; out += icon(ic, x, n.y + n.h / 2 - 15, 30, col, 2.2); tx = x + 42 }
    const tw = x + G.cellW - tx
    const L = [{ s: st('cmpHead'), text: side.head }, ...wrap(side.detail, st('cmpDetail'), tw).map((t) => ({ s: st('cmpDetail'), text: t }))]
    out += block(tx, n.y + (n.h - blockHeight(L)) / 2, L, tw, n.id).svg
  }
  return out
}
function nodeCompareHead(n) {
  const G = n.grid; let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14" fill="#102A43"/>`
  const s = st('cmpColHead')
  out += T(n.x + PAD + 4, n.y + n.h / 2 + s.size * 0.36, n.crit, s)
  for (const [col, x] of [[n.sg, G.sgX], [n.vn, G.vnX]]) {
    out += `<g data-icon="flag-${col.flag}">${flagSvg(col.flag, x, n.y + (n.h - 32) / 2, 48, 32)}</g>`
    out += T(x + 62, n.y + n.h / 2 + s.size * 0.36, col.title, s)
  }
  return out
}
function node(n, d) {
  const c = n.layer ? layerColor(n.layer) : '#495057'
  const body = { side: nodeSide, stack: nodeStack, vm: nodeVm, app: nodeApp, core: nodeCore, whyRow: nodeWhyRow, whyHead: nodeWhyHead,
    gate: nodeGate, list: nodeList, pill: nodePill, row: nodeRow, note: nodeNote, legal: nodeLegal, matrix: nodeMatrix, controls: nodeControls, compare: nodeCompare, compareHead: nodeCompareHead }[n.type](n, c)
  const tg = tags(n, c, d)
  const card = n.type === 'compareHead' || n.type === 'whyHead' || (n.type === 'row' && n.head) ? '' : cardRect(n, c)
  return `<g data-node="${n.id}" data-box="${n.x},${n.y},${n.w},${n.h}">${card}${body}${tg.svg}</g>`
}

// ---------- lines ----------------------------------------------------------------------------------
const MARKERS = new Set()
function lineSvg(L) {
  const c = L.color || layerColor(L.layer); const pts = L.pts.map((p) => [...p])
  if (L.arrow) { // stop the stroke inside the arrow head so the tip is clean
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]; const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.min(7, len - 1) / len; pts[pts.length - 1] = [b[0] - (b[0] - a[0]) * k, b[1] - (b[1] - a[1]) * k]
    MARKERS.add(c)
  }
  const d = 'M' + pts.map((p) => `${n2(p[0])} ${n2(p[1])}`).join(' L')
  let out = `<path data-line="${L.id}" data-from="${L.from}" data-to="${L.to}" data-group="${L.group || L.id}" data-pts="${L.pts.map((p) => p.join(',')).join(' ')}" d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" stroke-linecap="butt"${L.dashed ? ' stroke-dasharray="8 7"' : ''}${L.arrow ? ` marker-end="url(#ah${c.slice(1)})"` : ''}/>`
  if (L.label) {
    const s = st('lineLabel', { color: c }); const w = measure(s, L.label.t) + 14; const h = 24
    out += `<g data-label-for="${L.id}"><rect x="${n2(L.label.x - w / 2)}" y="${n2(L.label.y - h / 2)}" width="${n2(w)}" height="${h}" rx="6" fill="#FFFFFF" stroke="${tint(c, 0.35)}" stroke-width="1"/>`
    out += T(L.label.x, L.label.y + s.size * 0.36, L.label.t, s, 'middle') + '</g>'
  }
  return out
}
const markerDefs = () => [...MARKERS].map((c) => `<marker id="ah${c.slice(1)}" viewBox="0 0 14 14" refX="7" refY="7" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1 L14 7 L0 13 Z" fill="${c}"/></marker>`).join('')

// ---------- frame pieces ----------------------------------------------------------------------------
function rail(d) {
  if (!d.bands || !d.bands.length) return ''
  let out = ''; const bands = d.bands
  bands.forEach((b, i) => {
    const c = layerColor(b.layer); const end = i < bands.length - 1 ? bands[i + 1].y0 : b.y1
    out += `<rect x="${D.RAIL.barX}" y="${b.y0}" width="${D.RAIL.barW}" height="${end - b.y0}" fill="${c}"/>`
    const mid = (b.y0 + b.y1) / 2; const nameS = st('railName', { color: c }); const descS = st('railDesc')
    const name = D.LAYERS[b.layer].name
    out += T(D.RAIL.labelX, mid - 2, name, nameS, 'end')
    out += T(D.RAIL.labelX, mid + 21, b.desc, descS, 'end')
    for (const [s, t] of [[nameS, name], [descS, b.desc]]) {
      if (measure(s, t) > D.RAIL.labelX - 24) CTX.errors.push(`rail: "${t}" is ${Math.ceil(measure(s, t))} px`)
    }
  })
  const first = bands[0]; const last = bands[bands.length - 1]
  out += `<rect x="${D.RAIL.barX}" y="${first.y0 - 6}" width="${D.RAIL.barW}" height="12" rx="6" fill="${layerColor(first.layer)}"/>`
  out += `<rect x="${D.RAIL.barX}" y="${last.y1 - 6}" width="${D.RAIL.barW}" height="12" rx="6" fill="${layerColor(last.layer)}"/>`
  return `<g data-rail="1">${out}</g>`
}
function roundedPoly(pts, r) {
  let d = ''
  pts.forEach((p, i) => {
    const prev = pts[(i - 1 + pts.length) % pts.length]; const next = pts[(i + 1) % pts.length]
    const v1 = [prev[0] - p[0], prev[1] - p[1]]; const v2 = [next[0] - p[0], next[1] - p[1]]
    const l1 = Math.hypot(...v1); const l2 = Math.hypot(...v2); const rr = Math.min(r, l1 / 2, l2 / 2)
    const a = [p[0] + (v1[0] / l1) * rr, p[1] + (v1[1] / l1) * rr]; const b = [p[0] + (v2[0] / l2) * rr, p[1] + (v2[1] / l2) * rr]
    d += `${i === 0 ? 'M' : 'L'}${n2(a[0])} ${n2(a[1])} Q${p[0]} ${p[1]} ${n2(b[0])} ${n2(b[1])} `
  })
  return d + 'Z'
}
function region(d) {
  if (d.regions) return d.regions.map(regionSvg).join('')
  return d.region ? regionSvg(d.region) : ''
}
function regionSvg(R) {
  const col = R.color || D.REGION
  let out = `<path data-region="1" data-pts="${R.pts.map((p) => p.join(',')).join(' ')}" d="${roundedPoly(R.pts, 18)}" fill="${tint(col, 0.035)}" stroke="${col}" stroke-width="3" stroke-dasharray="12 7"/>`
  const ls = st('regionTab'); const ns = st('regionNote'); const h = 32
  const chipsW = R.tabChips ? R.tabChips.reduce((a, cp) => a + chipWidth(cp.t, st('chipText')) + 6, 4) : 0
  const w = 14 + 20 + 8 + measure(ls, R.label) + (R.note ? 14 + measure(ns, R.note) : 0) + 16 + chipsW
  const x = R.tab.align === 'right' ? R.tab.x - w : R.tab.x; const y = R.tab.y - h
  out += `<g data-tab="region"><path d="M${n2(x)} ${y + h} V${y + 10} Q${n2(x)} ${y} ${n2(x + 10)} ${y} H${n2(x + w - 10)} Q${n2(x + w)} ${y} ${n2(x + w)} ${y + 10} V${y + h} Z" fill="${col}"/>`
  out += icon(R.icon || 'map-pin', x + 14, y + 6, 20, '#FFFFFF', 2.2)
  out += T(x + 42, y + h / 2 + ls.size * 0.36, R.label, ls)
  if (R.note) out += T(x + 42 + measure(ls, R.label) + 14, y + h / 2 + ns.size * 0.36, R.note, ns)
  if (R.tabChips) out += chipRowSvg(x + w - chipsW - 12, y + 5, R.tabChips.map((cp) => ({ ...cp, tone: R.color ? ['#FFFFFF', '#FFFFFF', col] : 'light' })), 22, 14).svg
  if (x < (R.tab.minX || 0)) CTX.errors.push(`region tab starts at ${Math.round(x)}, limit ${R.tab.minX}`)
  return out + '</g>'
}
function star(cx, cy, r, rot = -90) { // five-point star, inner radius 0.382 r
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.382 : r; const a = ((rot + i * 36) * Math.PI) / 180
    pts.push(`${n2(cx + rr * Math.cos(a))},${n2(cy + rr * Math.sin(a))}`)
  }
  return pts.join(' ')
}
// Hand-drawn flags, top right of diagram 1: a map pin, then Singapore and Vietnam, each with only its name under it.
function flags(d) {
  const W = 78; const Hh = 52; const gap = 46; const y = 20
  const xs = [1880 - W - gap - W, 1880 - W]; const s = st('flagName')
  let out = `<g data-flags="1">` + icon('map-pin', xs[0] - 50, y + Hh / 2 - 17, 34, D.REGION, 2)
  // Singapore: red upper half, white lower half, white crescent and five white stars; Vietnam: red, centred yellow star
  out += flagSvg('sg', xs[0], y, W, Hh) + flagSvg('vn', xs[1], y, W, Hh)
  d.flags.names.forEach((nm, i) => { out += T(xs[i] + W / 2, y + Hh + 22, nm, s, 'middle') })
  return out + '</g>'
}
function header(d) {
  let out = T(40, 58, d.title, st('title')) + T(40, 88, d.subtitle, st('subtitle'))
  const tw = Math.max(measure(st('title'), d.title), measure(st('subtitle'), d.subtitle))
  const limit = d.flags ? 1880 - 78 - 46 - 78 - 60 - 30 : 1880
  if (40 + tw > limit) CTX.errors.push(`header: title block ends at ${Math.ceil(40 + tw)}, room until ${limit}`)
  if (d.flags) out += flags(d)
  return out
}
function panelColumns(d, tot) {
  const t = d.totals; const x = 40; const w = 1840; const y = t.y; const h = t.h
  let out = `<g data-node="totals" data-box="${x},${y},${w},${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#102A43"/>`
  const lab = st('panelLabel'); const line = st('panelLine'); const strong = st('panelStrong')
  t.columns.forEach((col, i) => {
    const cx = col.x; const room = col.w
    if (i) out += `<line x1="${cx - 24}" y1="${y + 20}" x2="${cx - 24}" y2="${y + h - 20}" stroke="#2C4A68" stroke-width="1.5"/>`
    out += T(cx, y + 30, col.label, lab)
    if (measure(lab, col.label) > room) CTX.errors.push(`totals: label "${col.label}" wider than ${room} px`)
    let yy = y + 44
    if (col.big) {
      const numS = st('panelBig'); const unit = st('panelUnit'); const v = col.big === 'total' ? fmtUsd(tot.rec.cents) : col.big
      out += T(cx, yy + 44, v, numS) + T(cx + measure(numS, v) + 10, yy + 44, col.unit || 'USD', unit)
      if (measure(numS, v) + 10 + measure(unit, col.unit || 'USD') > room) CTX.errors.push(`totals: "${v}" wider than ${room} px`)
      yy += 62
    }
    for (const ln of col.lines) {
      const parts = typeof ln === 'string' ? [{ t: ln }] : ln
      for (const wl of parts.length === 1 && !parts[0].strong ? wrap(parts[0].t, line, room) : [null]) {
        if (wl !== null) { out += T(cx, yy + 18, wl, line); yy += 22; continue }
        let px = cx
        for (const p of parts) { const s2 = p.strong ? strong : line; out += T(px, yy + 18, p.t, s2); px += measure(s2, p.t) + 6 }
        if (px - 6 - cx > room) CTX.errors.push(`totals: line "${parts.map((p) => p.t).join(' ')}" wider than ${room} px`)
        yy += 22
      }
    }
    if (yy + 8 > y + h) CTX.errors.push(`totals column ${i} ends at ${Math.round(yy)}, panel ends at ${y + h}`)
  })
  return out + '</g>'
}
function panel(d, tot) {
  if (d.totals.kind === 'columns') return panelColumns(d, tot)
  const t = d.totals; const x = 40; const w = 1840; const y = t.y; const h = t.h
  let out = `<g data-node="totals" data-box="${x},${y},${w},${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#102A43"/>`
  const cols = [x + 36, 560, 1150]; const ends = [530, 1120, x + w - 36]
  const lab = st('panelLabel'); const note = st('panelNote'); const unit = st('panelUnit')
  const fill = (s) => s.replace('{vnd}', fmtNum(tot.rec.vnd, 0)).replace('{usd}', fmtNum(tot.rec.usdCents / 100))
  const items = [
    [t.recommended, t.labels.rec, st('panelBig'), fmtUsd(tot.rec.cents)],
    [t.cheapest, t.labels.cheap, st('panelMid'), fmtUsd(tot.cheap.cents)],
    [t.firstYear, t.labels.year, st('panelYear'), `${fmtUsd(tot.year[0])} to ${fmtUsd(tot.year[1])}`],
  ]
  items.forEach(([it, label, numS, v], i) => {
    const cx = cols[i]
    if (i) out += `<line x1="${cx - 24}" y1="${y + 20}" x2="${cx - 24}" y2="${y + h - 20}" stroke="#2C4A68" stroke-width="1.5"/>`
    out += T(cx, y + 28, label, lab)
    out += T(cx, y + 82, v, numS) + T(cx + measure(numS, v) + 10, y + 82, 'USD', unit)
    const room = ends[i] - cx
    if (measure(numS, v) + 10 + measure(unit, 'USD') > room) CTX.errors.push(`totals: "${v} USD" wider than ${room} px`)
    if (measure(lab, label) > room) CTX.errors.push(`totals: label "${label}" wider than ${room} px`)
    it.note.forEach((ln, k) => {
      const tx = fill(ln); out += T(cx, y + 112 + k * 19, tx, note)
      if (measure(note, tx) > room) CTX.errors.push(`totals: note "${tx}" is ${Math.ceil(measure(note, tx))} px, room ${room}`)
    })
  })
  return out + '</g>'
}
const FOOTER = {
  en: { icons: 'Icons', feather: 'from Feather', logos: 'Logos', except: 'except', keycloak: 'Linux Foundation trademark rules',
    tail: 'Logos are trademarks of their owners. Fonts: Inter, Manrope (SIL OFL 1.1).', drawn: 'Drawn on 10 Oct 2026.' },
}
function footer(d) {
  const F = FOOTER.en
  const used = [...CTX.icons].filter((k) => ICONS.lucide.icons[k].feather)
  const special = { android: 'Android: Google, CC BY 3.0', openjdk: 'OpenJDK: BSD-3-Clause', zod: 'Zod: MIT', keycloak: `Keycloak: ${F.keycloak}` }
  const sp = [...CTX.logos].filter((k) => special[k]).map((k) => special[k])
  const L1 = `${F.icons}: ${ICONS.lucide.package} ${ICONS.lucide.version}, ${ICONS.lucide.license}${used.length ? ` (${used.join(', ')} ${F.feather}, MIT)` : ''}. ` +
    `${F.logos}: ${ICONS.simple.package} ${ICONS.simple.version}, CC0 1.0${sp.length ? `; ${F.except} ${sp.join('; ')}` : ''}.`
  const L2 = `${F.tail} ${d.footerSource} ${d.drawn || F.drawn}`
  const s = st('footer')
  for (const t of [L1, L2]) if (measure(s, t) > 1840) CTX.errors.push(`footer: ${Math.ceil(measure(s, t))} px wide`)
  return `<g data-footer="1">${T(40, 1048, L1, s)}${T(40, 1067, L2, s)}</g>`
}

// ---------- diagram -------------------------------------------------------------------------------
function render(d) {
  CTX = { texts: [], icons: new Set(), logos: new Set(), errors: [] }
  MARKERS.clear()
  const tot = d.totals ? totalsFor(d) : null
  const body = [
    region(d),
    rail(d),
    ...d.lines.map(lineSvg),
    ...d.nodes.map((n) => node(n, d)),
    ...(d.labels ? [d.labels.map((l) => { const s = st('railName', { color: l.color, size: 16 })
      return T(l.x, l.y, l.t, s) + (l.note ? T(l.x + measure(s, l.t) + 12, l.y, l.note, st('railDesc')) : '') }).join('')] : []),
    header(d),
    tot ? panel(d, tot) : '',
  ].join('\n')
  const foot = footer(d) // after the body so the footer lists the icons actually drawn
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D.CANVAS.w} ${D.CANVAS.h}" width="${D.CANVAS.w}" height="${D.CANVAS.h}" lang="en">
<title>${esc(d.title)}</title>
<desc>Pitch diagram (${d.stack}), generated from spec/diagrams/2026-10-10-pitch/src/data.mjs.</desc>
<defs><style>
${FONT_CSS}
${CLASS_CSS}
</style>${markerDefs()}</defs>
<rect width="${D.CANVAS.w}" height="${D.CANVAS.h}" fill="#FFFFFF"/>
${body}
${foot}
</svg>
`
  // Text rules
  for (const { t, s } of CTX.texts) {
    if (/[\u2012-\u2015\u2212]/.test(t)) CTX.errors.push(`dash in "${t}"`)
    if (s.size < 14) CTX.errors.push(`font size ${s.size} for "${t}"`)
    if (t !== t.normalize('NFC')) CTX.errors.push(`not NFC: "${t}"`)
    for (const ch of t) if (ch !== ' ' && !COVER[s.cls].has(ch.codePointAt(0))) CTX.errors.push(`glyph U+${ch.codePointAt(0).toString(16).toUpperCase()} "${ch}" not in ${s.cls} fonts ("${t}")`)
  }
  return { svg, errors: CTX.errors, tot }
}

// ---------- main ---------------------------------------------------------------------------------
const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(`<!doctype html><html><head><style>${FONT_CSS}${CLASS_CSS}</style></head><body><svg id="m" width="10" height="10"></svg></body></html>`)
// The sample holds three Vietnamese letters, written as escapes to keep this file ASCII: they make
// Chromium load the Vietnamese face of each font beside the Latin one.
await page.evaluate(async () => {
  const sample = 'Aa\u1EC7\u1EED\u1EF90'
  for (const f of ['MetisInter', 'MetisManrope']) for (const w of [400, 500, 600, 700, 800]) await document.fonts.load(`${w} 20px ${f}`, sample)
  await document.fonts.ready
})
const fontsOk = await page.evaluate(() => ['MetisInter', 'MetisManrope'].every((f) => document.fonts.check(`800 20px ${f}`, '\u1EC7')))
if (!fontsOk) throw new Error('embedded fonts did not load in Chromium')

let failed = false
for (const d of D.diagrams()) {
  let result
  for (let pass = 0; pass < 12; pass++) {
    result = render(d)
    if (!PENDING.size) break
    const items = [...PENDING.entries()].map(([k, v]) => ({ k, ...v })); PENDING.clear()
    const widths = await page.evaluate((items) => {
      const svg = document.getElementById('m'); const out = {}
      for (const it of items) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.setAttribute('class', it.cls); t.setAttribute('font-size', it.size); t.setAttribute('font-weight', it.weight)
        if (it.ls) t.setAttribute('letter-spacing', it.ls)
        t.textContent = it.t; svg.appendChild(t); out[it.k] = t.getComputedTextLength(); t.remove()
      }
      return out
    }, items)
    for (const [k, v] of Object.entries(widths)) MEASURED.set(k, v)
  }
  if (PENDING.size) result.errors.push(`text measurement did not settle (${PENDING.size} strings pending)`)
  const file = join(OUT, `${d.id}.svg`)
  // Frozen files (FROZEN in data.mjs) are never rewritten: identical output is skipped, different output is an error.
  let note = ''
  if (D.FROZEN.includes(d.id)) {
    const old = existsSync(file) ? readFileSync(file, 'utf8') : null
    if (old === result.svg) note = ' (frozen, unchanged, not rewritten)'
    else { result.errors.push(`frozen file would change; not written`); note = ' (frozen)' }
  } else writeFileSync(file, result.svg)
  const kb = Math.round(Buffer.byteLength(result.svg) / 1024)
  const t = result.tot
  const totals = t ? ` | ${fmtUsd(t.rec.cents)}${t.cheap ? ` / ${fmtUsd(t.cheap.cents)}` : ''}${d.totals.firstYear ? ` / ${fmtUsd(t.year[0])} .. ${fmtUsd(t.year[1])}` : ''}` : ''
  console.log(`${d.id}.svg  ${kb} KB${totals}${note}`)
  if (result.errors.length) { failed = true; for (const e of result.errors) console.log(`  ERROR ${e}`) }
}
await browser.close()
if (failed) { console.log('build: errors above'); process.exit(1) }
console.log('build: ok')
