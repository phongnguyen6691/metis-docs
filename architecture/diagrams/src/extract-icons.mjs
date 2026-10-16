// Builds icons.json from the two npm-packed icon packages (run once; the build reads only icons.json).
//   npm pack lucide-static@1.48.0 simple-icons@16.32.0   (in a new empty folder, then untar each)
//   node extract-icons.mjs <dir>/lucide/package <dir>/simple/package
// Only path data is copied: element names and attribute values are whitelisted, nothing is executed.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ICON_SET } from './data.mjs'

const [lucideDir, simpleDir] = process.argv.slice(2)
if (!lucideDir || !simpleDir) throw new Error('usage: node extract-icons.mjs <lucide-static package dir> <simple-icons package dir>')
const here = dirname(fileURLToPath(import.meta.url))

const SAFE_VALUE = /^[0-9A-Za-z .,\-]*$/
const ATTRS = new Set(['d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'points'])
const ELEMENTS = new Set(['path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'ellipse'])

function lucideIcon(name) {
  const src = readFileSync(join(lucideDir, 'icons', `${name}.svg`), 'utf8')
  const body = src.slice(src.indexOf('>', src.indexOf('<svg')) + 1, src.lastIndexOf('</svg>'))
  const out = []
  for (const m of body.matchAll(/<([a-z]+)\s+([^>]*?)\s*\/>/g)) {
    if (!ELEMENTS.has(m[1])) throw new Error(`${name}: unexpected element <${m[1]}>`)
    const attrs = []
    for (const a of m[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)) {
      const fillOk = a[1] === 'fill' && (a[2] === 'currentColor' || a[2] === 'none')
      if (!fillOk && (!ATTRS.has(a[1]) || !SAFE_VALUE.test(a[2]))) throw new Error(`${name}: unexpected attribute ${a[1]}="${a[2]}"`)
      attrs.push(`${a[1]}="${a[2]}"`)
    }
    out.push(`<${m[1]} ${attrs.join(' ')}/>`)
  }
  if (!out.length) throw new Error(`${name}: no shapes`)
  return out.join('')
}

const lucidePkg = JSON.parse(readFileSync(join(lucideDir, 'package.json'), 'utf8'))
const lucideLicense = readFileSync(join(lucideDir, 'LICENSE'), 'utf8')
const featherList = (lucideLicense.match(/derived from the Feather project:\s*\n\s*\n([^\n]+)/) || [, ''])[1]
  .split(',').map((s) => s.trim()).filter(Boolean)

const simplePkg = JSON.parse(readFileSync(join(simpleDir, 'package.json'), 'utf8'))
const simpleData = JSON.parse(readFileSync(join(simpleDir, 'data', 'simple-icons.json'), 'utf8'))

const result = {
  lucide: { package: 'lucide-static', version: lucidePkg.version, license: lucidePkg.license, icons: {} },
  simple: { package: 'simple-icons', version: simplePkg.version, license: simplePkg.license, icons: {} },
}
for (const name of ICON_SET.lucide) {
  result.lucide.icons[name] = { svg: lucideIcon(name), feather: featherList.includes(name) }
}
for (const slug of ICON_SET.simple) {
  const meta = simpleData.find((i) => i.slug === slug)
  if (!meta) throw new Error(`simple-icons: no data for ${slug}`)
  const svg = readFileSync(join(simpleDir, 'icons', `${slug}.svg`), 'utf8')
  const d = (svg.match(/<path d="([^"]+)"/) || [])[1]
  if (!d || !SAFE_VALUE.test(d)) throw new Error(`simple-icons: bad path for ${slug}`)
  if (!/^[0-9A-F]{6}$/i.test(meta.hex)) throw new Error(`simple-icons: bad colour for ${slug}`)
  result.simple.icons[slug] = { title: meta.title, hex: meta.hex, path: d, license: meta.license || null }
}
writeFileSync(join(here, 'icons.json'), JSON.stringify(result, null, 1) + '\n')
console.log(`icons.json: ${Object.keys(result.lucide.icons).length} lucide ${result.lucide.version}, ` +
  `${Object.keys(result.simple.icons).length} simple-icons ${result.simple.version}`)
