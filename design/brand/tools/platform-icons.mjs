// Derives the two platform app icons from metis-app-icon.svg; the Chromium that Playwright
// installs in the app renders each 1024 px PNG.
// - metis-app-icon-square: the ink square without rounded corners. iOS rounds the corners
//   itself, and the transparent corners of a rounded icon turn white when Expo flattens it.
// - metis-app-icon-android-foreground: the foreground layer of the Android adaptive icon,
//   without the ink square (Android draws an ink background), with the M and the diamond
//   scaled to 2/3 around the centre. Android shows only the middle 72 of the 108 dp (2/3) of
//   this layer, so the M shows at the size it has on the iOS icon and stays inside the 66 dp
//   safe circle.
// Usage: node platform-icons.mjs <the root of a metis-app clone>
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

const logo = resolve(import.meta.dirname, '../logo')
const [app] = process.argv.slice(2)
const { chromium } = createRequire(join(resolve(app), 'package.json'))('@playwright/test')

const source = readFileSync(join(logo, 'metis-app-icon.svg'), 'utf8')
const rect = /\n\s*<rect [^>]*\/>/
const group = source.replace(rect, '').match(/(<g [\s\S]*<\/g>)/)?.[1]
if (!rect.test(source) || !source.includes(' rx="22"') || !group) {
  throw new Error('metis-app-icon.svg: no ink square <rect rx="22"> or no <g> group of the M found')
}
const icons = {
  'metis-app-icon-square': source.replace(' rx="22"', ''),
  'metis-app-icon-android-foreground': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Metis mark">
  <title>Metis mark</title>
  <g transform="translate(16.6667 16.6667) scale(0.666667)">
  ${group}
  </g>
</svg>
`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } })
for (const [name, svg] of Object.entries(icons)) {
  writeFileSync(join(logo, `${name}.svg`), svg)
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:1024px;height:1024px}</style>${svg}`
  )
  writeFileSync(
    join(logo, `${name}-1024.png`),
    await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } })
  )
}
await browser.close()
