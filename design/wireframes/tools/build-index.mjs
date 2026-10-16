// Builds ../manifest.json (for tools and AI agents) and ../index.html (gallery for people)
// from the <meta name="wf:*"> tags of every screen. Usage: node build-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(path.join(root, 'screens')).filter(f => /^\d{2}-.+\.html$/.test(f)).sort();
const meta = (html, name) => (html.match(new RegExp(`<meta name="wf:${name}" content="([^"]*)"`)) || [, ''])[1].replace(/&amp;/g, '&');
const AREAS = ['Access & tenancy', 'Onboarding', 'Workspace & governance', 'Personal & collaboration', 'Portfolio', 'Project execution'];

const screens = files.map(f => {
  const html = fs.readFileSync(path.join(root, 'screens', f), 'utf8');
  const stem = f.replace(/\.html$/, '');
  return {
    order: +f.slice(0, 2), id: meta(html, 'id'), title: meta(html, 'title'), area: meta(html, 'area'), phase: meta(html, 'phase'),
    requirements: meta(html, 'requirements').split(/\s+/).filter(Boolean), poc: meta(html, 'poc').split(/\s+/).filter(Boolean),
    summary: meta(html, 'summary'), file: stem, html: `screens/${f}`, png: `png/${stem}.png`
  };
});
const problems = [];
screens.forEach(s => {
  if (!s.id || !s.title || !AREAS.includes(s.area) || !['MVP', 'V2', 'V3'].includes(s.phase) || !s.requirements.length) problems.push(`${s.file}: incomplete metadata`);
  if (!fs.existsSync(path.join(root, s.png))) problems.push(`${s.file}: PNG not rendered`);
});
const ids = screens.map(s => s.id);
ids.filter((x, i) => ids.indexOf(x) !== i).forEach(x => problems.push(`duplicate id ${x}`));

const manifest = {
  name: 'Metis wireframes', generated: process.env.WIREFRAMES_DATE || new Date().toISOString().slice(0, 10),
  conventions: 'Open screens/*.html in a browser. Meta tags wf:* carry id, area, phase, requirement IDs (BRD v4.3 and its onboarding addendum) and POC screenshot numbers; data-req attributes mark sections; .wf-notes holds numbered annotations. Shared chrome comes from assets/shell.js, components from assets/wireframe.css, tokens from ../brand/tokens.css.',
  areas: AREAS, screens
};
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const card = s => `<a class="card x-card" href="${s.html}">
  <img src="${s.png}" alt="${esc(s.title)}" loading="lazy">
  <div class="x-body"><div class="row between"><b>${String(s.order).padStart(2, '0')} · ${esc(s.title)}</b><span class="tag">${s.phase}</span></div>
  <div class="small muted">${esc(s.summary)}</div>
  <div class="x-reqs">${s.requirements.map(r => `<span class="tag">${r}</span>`).join(' ')}</div></div></a>`;
const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Metis wireframes</title>
<link rel="stylesheet" href="../brand/tokens.css"><link rel="stylesheet" href="assets/wireframe.css">
<style>
  body { background: var(--paper); }
  .x-wrap { max-width: 1280px; margin: 0 auto; padding: 36px 28px 60px; }
  .x-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 8px; }
  .x-head img { height: 40px; }
  .x-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 12px 0 30px; }
  .x-card { display: flex; flex-direction: column; overflow: hidden; color: var(--text); }
  .x-card img { width: 100%; height: 190px; object-fit: cover; object-position: top; border-bottom: 1px solid var(--line); }
  .x-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
  .x-reqs { display: flex; flex-wrap: wrap; gap: 4px; }
</style></head>
<body><div class="x-wrap">
<div class="x-head"><div><div class="label">Wireframes · BRD v4.3 and onboarding addendum · ${screens.length} screens · ${manifest.generated}</div>
<div class="title">Metis wireframes</div>
<p class="muted">Click a screen to open the HTML wireframe. PNGs are in png/, the machine-readable index is manifest.json.</p></div>
<img src="../brand/logo/metis-wordmark.svg" alt="Metis"></div>
${AREAS.map(a => `<div class="h2">${a}</div><div class="x-grid">${screens.filter(s => s.area === a).map(card).join('\n')}</div>`).join('\n')}
</div></body></html>
`;
fs.writeFileSync(path.join(root, 'index.html'), page);

// wireframes-digest.md: the text of every screen (content and annotations) for readers that cannot see small text in PNGs
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', middot: '·', rarr: '→', larr: '←', hellip: '…' };
const toText = h => h
  .replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
  .replace(/<span class="anno" data-n="(\d+)"><\/span>/g, ' [$1]')
  .replace(/<\/(td|th)>/g, ' | ')
  .replace(/<(br|\/div|\/li|\/tr|\/p|\/h\d|\/section|\/header|\/table|\/ol|\/ul)[^>]*>/g, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(#\d+|[a-z]+);/g, (m, e) => e[0] === '#' ? String.fromCodePoint(+e.slice(1)) : (ENT[e] ?? m))
  .split('\n').map(l => l.replace(/\s+/g, ' ').replace(/\s*\|\s*$/, '').trim()).filter(Boolean)
  .filter((l, i, a) => l !== a[i - 1]);
const digest = ['---', 'title: Wireframes text digest',
  'summary: The text and annotations of every wireframe screen, for readers and AI agents that cannot read the images.',
  'component: all', 'type: reference', 'status: current', 'ids: []',
  'generated_from: design/wireframes/tools/build-index.mjs', '---', '', `# Metis wireframes: text digest`, '',
  `Generated ${manifest.generated} from screens/*.html by tools/build-index.mjs. For each of the ${screens.length} screens: metadata, the screen content in reading order (app chrome such as the sidebar is omitted; [n] marks an annotation), then the annotations. The images are in png/.`, ''];
screens.forEach(s => {
  const html = fs.readFileSync(path.join(root, s.html), 'utf8');
  const main = (html.match(/<main>([\s\S]*?)<\/main>/) || [, ''])[1];
  const notes = [...(html.match(/<section class="wf-notes">([\s\S]*?)<\/section>/) || [, ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => toText(m[1].replace(/<span class="anno" data-n="\d+"><\/span>/, '')).join(' '));
  const ctx = (html.match(/<body ([^>]*)>/) || [, ''])[1].match(/data-(project|tab|workspace|nav)="([^"]*)"/g) || [];
  digest.push(`## ${String(s.order).padStart(2, '0')} ${s.title}`, '',
    `- File: ${s.html} · image: ${s.png}`, `- Area: ${s.area} · Phase: ${s.phase} · POC screenshots: ${s.poc.join(', ') || 'none'}`,
    `- Requirements: ${s.requirements.join(', ')}`, `- Context: ${ctx.map(c => c.replace(/"/g, '')).join(', ') || 'none'}`,
    `- Purpose: ${s.summary}`, '', '### Content', '', ...toText(main).map(l => `    ${l}`), '', '### Annotations', '',
    ...notes.map((n, i) => `${i + 1}. ${n}`), '');
});
fs.writeFileSync(path.join(root, 'wireframes-digest.md'), digest.join('\n'));
console.log(`manifest.json, index.html and wireframes-digest.md: ${screens.length} screens`);
if (problems.length) { console.error('PROBLEMS:\n' + problems.join('\n')); process.exit(1); }
