// Renders HTML files to full-page PNG with the locally installed Google Chrome (puppeteer-core, no browser download).
// Usage: node render.mjs [file-or-dir ...] [--out DIR] [--width 1440]
//   default input: ../screens   default output: ../png
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const outDir = path.resolve(opt('--out', path.join(here, '..', 'png')));
const width = +opt('--width', '1440');
const inputs = args.length ? args : [path.join(here, '..', 'screens')];
const files = inputs.flatMap(p => fs.statSync(p).isDirectory()
  ? fs.readdirSync(p).filter(f => f.endsWith('.html')).sort().map(f => path.join(p, f)) : [p]);

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', '--allow-file-access-from-files'] });
const page = await browser.newPage();
const problems = [];
page.on('pageerror', e => problems.push(`${path.basename(current)}: ${e.message}`));
let current = '';
for (const f of files) {
  current = f;
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.resolve(f)).href, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const out = path.join(outDir, path.basename(f).replace(/\.html$/, '.png'));
  await page.screenshot({ path: out, fullPage: true });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${path.basename(out)}  ${width}x${h}`);
}
await browser.close();
if (problems.length) { console.error('PAGE ERRORS:\n' + problems.join('\n')); process.exit(1); }
