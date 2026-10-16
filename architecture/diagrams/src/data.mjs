// One data structure for the pitch diagrams of 10/10/2026 (Spring Boot stack, English).
// diagrams() returns the eleven diagrams in reading order (FILES); sections below keep the order they were drawn in. Change a price here, run `node build.mjs <metis-app>` then
// `node render.mjs <metis-app> <png folder>`: node tags, totals and first-year ranges are recomputed, and build.mjs
// stops when a total no longer matches `expect` (update `expect` on purpose when the sources change).
// The NestJS variant is kept as SVG files in the owner's private store (prices: cost model, section S11).
//
// Content sources (do not invent components, prices or flows):
//   spec/2026-10-10-backend-two-proposals.md   stack (section 3), Singapore (5), Vietnam (6)
//   spec/2026-10-10-backend-cost-model.md      sections S1 to S4
//   .superpowers/backend/cost-chat-summary.md  prices and totals
//   apps/metis/package.json                    expo ~57.0.26, react-native 0.86.3, typescript ~6.0.3
//   .superpowers/pitch/frontend-digest.md      diagrams 2 and 3 (every fact there cites apps/metis file:line)

export const CANVAS = { w: 1920, h: 1080 }
export const RAIL = { labelX: 284, barX: 296, barW: 12 }
// Reading order: what Metis runs on, the app (how it is built, how it is tested), where it runs and what it costs
// (Singapore, its one-provider variant, the two side by side, Vietnam, Singapore or Vietnam), the law and security,
// then why each component was chosen.
export const FILES = ['01-what-metis-runs-on', '02-frontend-architecture', '03-frontend-test-pipeline', '04-proposal-singapore',
  '05-proposal-singapore-single-provider', '06-scattered-vs-single-provider', '07-proposal-vietnam', '08-singapore-vs-vietnam',
  '09-legal-and-security', '10-why-these-components', '11-why-these-components-services']
// Every diagram but 2, 5 and 6 is frozen: the owner reviews them as they are. build.mjs never rewrites a frozen file.
export const FROZEN = FILES.filter((id) => !['02-frontend-architecture', '05-proposal-singapore-single-provider', '06-scattered-vs-single-provider'].includes(id))

// Layer colours: icons, rail, lines and price tags use `main`; cards use a 9% tint of it.
export const LAYERS = {
  users: { main: '#E03131', name: 'USERS' },
  frontend: { main: '#E8590C', name: 'FRONTEND' },
  edge: { main: '#7048E8', name: 'EDGE NETWORK' },
  backend: { main: '#2B8A3E', name: 'BACKEND' },
  data: { main: '#1971C2', name: 'DATA' },
  external: { main: '#495057', name: 'EXTERNAL SERVICES' },
  legal: { main: '#0B7285', name: 'LEGAL' },
  security: { main: '#5F3DC4', name: 'SECURITY' },
  neutral: { main: '#495057', name: '' },
  // groups of the test gates (diagram 3)
  qcode: { main: '#1971C2', name: 'CODE QUALITY' },
  qcorrect: { main: '#2B8A3E', name: 'CORRECTNESS' },
  qsupply: { main: '#5F3DC4', name: 'SECURITY AND SUPPLY CHAIN' },
  qdevices: { main: '#E8590C', name: 'REAL BROWSERS AND DEVICES' },
  qcanary: { main: '#E67700', name: 'CANARIES' },
  // bands of diagram 2
  fbuild: { main: '#E8590C', name: 'BUILD TIME' },
  frun: { main: '#E03131', name: 'RUN TIME' },
  moved: { main: '#C25E00', name: '' }, // what moved into DigitalOcean (diagrams 5 and 6)
}
export const REGION = '#0B7285' // Singapore / Vietnam boundary
export const WARN = '#C25E00' // "estimate", "unsure", "plus egress"
export const CONTRACT = '#495057'

// Icons pulled from the npm packages by extract-icons.mjs into icons.json.
export const ICON_SET = {
  lucide: ['monitor', 'tablet-smartphone', 'smartphone', 'bot', 'monitor-smartphone', 'globe', 'shield-check',
    'file-code', 'server', 'key-round', 'plug-zap', 'workflow', 'cog', 'box', 'brain-circuit', 'database', 'zap',
    'folder-open', 'git-branch', 'activity', 'mail', 'sparkles', 'app-window', 'package', 'users', 'network',
    'database-backup', 'map-pin', 'scale', 'triangle-alert', 'file-text', 'scan-search', 'container', 'code',
    'circle-check', 'user-check', 'alarm-clock', 'earth', 'file-check', 'badge-check',
    'search-check', 'list-checks', 'wrench', 'trending-up', 'receipt', 'gauge', 'clipboard-check',
    'store', 'hammer', 'cloud', 'layers', 'building-2', 'arrow-left-right', 'languages', 'palette', 'file-type', 'align-left', 'scissors', 'link', 'test-tube', 'bug', 'package-check', 'bird',
    'laptop', 'list-todo'],
  simple: ['typescript', 'react', 'expo', 'openjdk', 'springboot', 'nodedotjs', 'keycloak', 'temporal',
    'postgresql', 'claude', 'anthropic', 'grafana', 'github', 'digitalocean', 'planetscale', 'apple', 'android',
    'appstore', 'googleplay', 'cloudflare', 'openapiinitiative', 'zod', 'modelcontextprotocol', 'opentofu',
    'eslint', 'prettier', 'knip', 'jest', 'stryker', 'pnpm', 'xcode', 'metro', 'gradle'],
}

// Money that is not monthly infrastructure (cost-chat-summary.md table b; cost model PT-X01, PT-X02, PT-Z02).
export const ONE_OFF_USD = { recommended: [9024, 20025], cheapest: [5024, 9024] } // pentest + Google Play
export const YEARLY_USD = 109.46 // Apple Developer Program + .com domain
export const VND_PER_USD = 26070 // Vietcombank, 10/10/2026 (cost model, header)

// Column grids: content runs from x 332 to 1880.
const C4 = [[332, 372], [724, 372], [1116, 372], [1508, 372]] // equal columns (diagrams 4 and 7)
const H = [[332, 380], [752, 364], [1136, 364], [1520, 360]] // hub columns (diagram 1: wide core column)
const E5 = [[332, 290], [636, 290], [940, 290], [1244, 290], [1580, 300]] // Vietnam external band
const at = (col, y, h) => ({ x: col[0], w: col[1], y, h })
const vnd = (n) => n.toLocaleString('en-US') + ' VND'

export function diagrams() {
  // -------------------------------------------------------------------------------------------
  // Diagram 1: what Metis runs on (same for both proposals)
  // -------------------------------------------------------------------------------------------
  const d1 = {
    title: 'What Metis runs on',
    subtitle: 'The same for both proposals; only the hosting differs.',
    flags: { names: ['Singapore', 'Vietnam'] },
    bands: [
      { layer: 'users', y0: 110, y1: 196, desc: 'Who uses Metis, on which device' },
      { layer: 'frontend', y0: 210, y1: 336, desc: 'What users see and tap' },
      { layer: 'edge', y0: 350, y1: 440, desc: 'Protects every connection' },
      { layer: 'backend', y0: 452, y1: 748, desc: 'Servers that handle every request' },
      { layer: 'data', y0: 760, y1: 894, desc: 'Where customer data is kept' },
      { layer: 'external', y0: 906, y1: 992, desc: 'Third-party services Metis uses' },
    ],
    nodes: [
      // USERS
      { id: 'u-web', layer: 'users', type: 'side', ...at(H[0], 112, 82), icon: 'monitor', name: 'Web browser',
        tech: [{ t: 'Metis app, web build' }], purpose: 'used for: working on a computer' },
      { id: 'u-ios', layer: 'users', type: 'side', ...at(H[1], 112, 82), icon: 'tablet-smartphone', name: 'iPhone and iPad',
        tech: [{ logo: 'apple' }, { t: 'Metis app, iOS build' }], purpose: 'used for: working on the go' },
      { id: 'u-android', layer: 'users', type: 'side', ...at(H[2], 112, 82), icon: 'smartphone', name: 'Android phone',
        tech: [{ logo: 'android' }, { t: 'Metis app, Android build' }], purpose: 'used for: working on the go' },
      { id: 'u-llm', layer: 'users', type: 'side', ...at(H[3], 112, 82), icon: 'bot', name: 'Customer\'s LLM',
        tech: [{ t: 'Claude, ChatGPT over' }, { logo: 'modelcontextprotocol' }, { t: 'MCP' }], purpose: 'used for: AI access to Metis data' },
      // FRONTEND
      { id: 'app', layer: 'frontend', type: 'app', x: 332, y: 214, w: 1168, h: 118, icon: 'monitor-smartphone', name: 'Metis app',
        tech: [{ logo: 'typescript' }, { t: 'TypeScript 6.0' }, { t: '·', sep: true }, { logo: 'react' }, { t: 'React Native 0.86' },
          { t: '·', sep: true }, { logo: 'expo' }, { t: 'Expo SDK 57' }],
        purpose: 'used for: one codebase, three builds: web, iOS, Android',
        ship: {
          title: 'Shipped through',
          rows: [[{ icon: 'globe' }, { t: 'web: open in a browser' }], [{ logo: 'appstore' }, { t: 'App Store: iPhone, iPad' }],
            [{ logo: 'googleplay' }, { t: 'Google Play: Android' }]],
        } },
      // EDGE NETWORK
      { id: 'contract', layer: 'frontend', type: 'side', style: 'contract', x: 332, y: 354, w: 380, h: 82, icon: 'file-code',
        name: 'API contract', tech: [{ logo: 'openapiinitiative' }, { t: 'OpenAPI 3.1' }, { arrow: true }, { logo: 'zod' }, { t: 'zod' }],
        purpose: 'used for: core and app stay in sync' },
      { id: 'cf', layer: 'edge', type: 'side', x: 752, y: 354, w: 560, h: 82, icon: 'shield-check', name: 'Network shield',
        tech: [{ logo: 'cloudflare' }, { t: 'Cloudflare' }], purpose: 'used for: domain (DNS), CDN, web firewall, DDoS protection' },
      // BACKEND (hub: the core spans both rows)
      { id: 'core', layer: 'backend', type: 'core', x: 332, y: 466, w: 380, h: 280, icon: 'server', name: 'Business core',
        techLines: [[{ logo: 'openjdk' }, { t: 'Java 25 LTS' }], [{ logo: 'springboot' }, { t: 'Spring Boot 4' }]],
        purposeLines: ['used for: reads, writes, permissions, audit'],
        notes: ['one codebase, runs as api or worker', 'a single write path for every channel', 'generates the OpenAPI 3.1 contract'] },
      { id: 'login', layer: 'backend', type: 'stack', ...at(H[1], 466, 120), icon: 'key-round', name: 'Sign-in',
        tech: [{ logo: 'keycloak' }, { t: 'Keycloak 26' }], purpose: 'used for: SSO, MFA, OAuth for LLMs' },
      { id: 'mcp', layer: 'backend', type: 'stack', ...at(H[2], 466, 120), icon: 'plug-zap', name: 'MCP gateway',
        tech: [{ logo: 'typescript' }, { t: 'TypeScript,' }, { logo: 'nodedotjs' }, { t: 'Node.js 24' }],
        purpose: 'used for: customers\' LLMs read and write' },
      { id: 'workflow', layer: 'backend', type: 'stack', ...at(H[3], 466, 120), icon: 'workflow', name: 'Durable workflows',
        tech: [{ logo: 'temporal' }, { t: 'Temporal' }], purpose: 'used for: schedules, approvals, automation' },
      { id: 'jobs', layer: 'backend', type: 'stack', ...at(H[1], 626, 120), icon: 'cog', name: 'Background jobs',
        tech: [{ t: 'worker' }, { logo: 'openjdk' }, { t: 'Java 25' }], purpose: 'used for: email, PDF, import, export, MS Project' },
      { id: 'sandbox', layer: 'backend', type: 'stack', ...at(H[2], 626, 120), icon: 'box', name: 'Sandbox',
        tech: [{ t: 'ClamAV, Chromium' }], purpose: 'used for: virus scans of uploads, PDFs' },
      { id: 'agent', layer: 'backend', type: 'stack', ...at(H[3], 626, 120), icon: 'brain-circuit', name: 'AI agent',
        tech: [{ t: 'calls' }, { logo: 'claude' }, { t: 'Claude' }], purpose: 'used for: running agents, tools only via MCP' },
      // DATA
      { id: 'pg', layer: 'data', type: 'stack', ...at(H[0], 774, 118), icon: 'database', name: 'Database',
        tech: [{ logo: 'postgresql' }, { t: 'PostgreSQL 18' }], tech2: [{ t: 'row-level security' }],
        purpose: 'used for: storing data, customers kept apart' },
      { id: 'valkey', layer: 'data', type: 'stack', ...at(H[1], 774, 118), icon: 'zap', name: 'In-memory store',
        tech: [{ t: 'Valkey' }], purpose: 'used for: cache, realtime pushes, rate limits' },
      { id: 'files', layer: 'data', type: 'stack', ...at(H[2], 774, 118), icon: 'folder-open', name: 'File storage',
        tech: [{ t: 'S3-style object storage' }], purpose: 'used for: files customers upload' },
      // EXTERNAL SERVICES
      { id: 'github', layer: 'external', type: 'side', ...at(H[0], 908, 82), icon: 'git-branch', name: 'Source code',
        tech: [{ logo: 'github' }, { t: 'GitHub' }], purpose: 'used for: code, automated tests' },
      { id: 'grafana', layer: 'external', type: 'side', ...at(H[1], 908, 82), icon: 'activity', name: 'Monitoring',
        tech: [{ logo: 'grafana' }, { t: 'Grafana Cloud' }], purpose: 'used for: logs, errors, metrics' },
      { id: 'ses', layer: 'external', type: 'side', ...at(H[2], 908, 82), icon: 'mail', name: 'Email',
        tech: [{ t: 'Amazon SES' }], purpose: 'used for: sending email to users' },
      { id: 'claude', layer: 'external', type: 'side', ...at(H[3], 908, 82), icon: 'sparkles', name: 'AI',
        tech: [{ logo: 'claude' }, { t: 'Claude by Anthropic' }], purpose: 'used for: AI features and agents' },
    ],
    lines: [
      { id: 'web-app', layer: 'users', from: 'u-web', to: 'app', pts: [[522, 194], [522, 214]], arrow: true },
      { id: 'ios-app', layer: 'users', from: 'u-ios', to: 'app', pts: [[934, 194], [934, 214]], arrow: true },
      { id: 'and-app', layer: 'users', from: 'u-android', to: 'app', pts: [[1318, 194], [1318, 214]], arrow: true },
      { id: 'llm-cf', layer: 'users', from: 'u-llm', to: 'cf', pts: [[1700, 194], [1700, 395], [1312, 395]], arrow: true,
        label: { t: 'over MCP', x: 1700, y: 272 } },
      { id: 'app-cf', layer: 'frontend', from: 'app', to: 'cf', pts: [[934, 332], [934, 354]], arrow: true },
      { id: 'cf-login', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'login', pts: [[934, 436], [934, 466]], arrow: true },
      { id: 'cf-core', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'core', pts: [[934, 450], [640, 450], [640, 466]], arrow: true },
      { id: 'cf-mcp', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'mcp', pts: [[934, 450], [1318, 450], [1318, 466]], arrow: true },
      { id: 'contract-app', color: CONTRACT, dashed: true, from: 'contract', to: 'app', pts: [[420, 354], [420, 332]], arrow: true },
      { id: 'core-contract', color: CONTRACT, dashed: true, from: 'core', to: 'contract', pts: [[420, 466], [420, 436]] },
      { id: 'agent-mcp', layer: 'backend', from: 'agent', to: 'mcp', pts: [[1600, 626], [1600, 606], [1318, 606], [1318, 586]],
        arrow: true, label: { t: 'MCP only', x: 1459, y: 606 } },
      { id: 'core-pg', layer: 'data', group: 'data-bus', from: 'core', to: 'pg', pts: [[522, 746], [522, 774]] },
      { id: 'core-valkey', layer: 'data', group: 'data-bus', from: 'core', to: 'valkey', pts: [[522, 760], [934, 760], [934, 774]] },
      { id: 'core-files', layer: 'data', group: 'data-bus', from: 'core', to: 'files', pts: [[934, 760], [1318, 760], [1318, 774]] },
      { id: 'agent-claude', layer: 'backend', from: 'agent', to: 'claude', pts: [[1700, 746], [1700, 908]], arrow: true,
        label: { t: 'calls Claude', x: 1700, y: 833 } },
    ],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 2, 3; apps/metis/package.json.',
  }

  // -------------------------------------------------------------------------------------------
  // Shared by diagrams 4 and 7
  // -------------------------------------------------------------------------------------------
  const users23 = (y) => [
    { id: 'u-people', layer: 'users', type: 'side', ...at(C4[0], y, 78), icon: 'users', name: 'Users',
      tech: [{ t: 'Metis app: web, iOS, Android' }], purpose: 'used for: everyday work' },
    { id: 'u-llm', layer: 'users', type: 'side', ...at(C4[1], y, 78), icon: 'bot', name: 'Customer\'s LLM',
      tech: [{ t: 'Claude, ChatGPT over' }, { logo: 'modelcontextprotocol' }, { t: 'MCP' }], purpose: 'used for: AI access to Metis data' },
  ]
  const NOT_PRICED = 'Not in the monthly price'
  const panelLabels = { rec: 'LAUNCH SETUP, PER MONTH', cheap: 'CHEAPEST SETUP THAT RUNS', year: 'FIRST YEAR, LAUNCH SETUP' }
  const DO = { logo: 'digitalocean' }

  // -------------------------------------------------------------------------------------------
  // Diagram 4: Singapore proposal (section 5)
  // -------------------------------------------------------------------------------------------
  const SG = { cf: 194, region: 288, bus: 298, row1: 320, row2: 462, data: 602, step: 732, ext: 758, bottom: 884 }
  const d4 = {
    title: 'Singapore proposal: where it runs, what it costs',
    subtitle: 'A Singapore legal entity signs with customers; data stays in Singapore. USD per month, before VAT, launch setup.',
    bands: [
      { layer: 'users', y0: 100, y1: 178, desc: NOT_PRICED },
      { layer: 'edge', y0: 190, y1: 284, desc: 'Protects every connection' },
      { layer: 'backend', y0: 294, y1: 582, desc: 'Servers that handle every request' },
      { layer: 'data', y0: 594, y1: 722, desc: 'Where data, files, images live' },
      { layer: 'external', y0: 740, y1: 878, desc: 'Third-party services Metis uses' },
    ],
    region: {
      label: 'SINGAPORE', note: 'customer data stays inside this frame',
      pts: [[322, SG.region], [1890, SG.region], [1890, SG.step], [1106, SG.step], [1106, SG.bottom], [322, SG.bottom]],
      tab: { x: 1880, y: SG.region, align: 'right' },
    },
    nodes: [
      ...users23(100),
      { id: 'cf', layer: 'edge', type: 'side', x: 332, y: SG.cf, w: 958, h: 84, icon: 'shield-check', name: 'Network shield',
        price: { usd: 20.0 }, tech: [{ logo: 'cloudflare' }, { t: 'Cloudflare Pro, billed yearly, global network' }],
        purpose: 'used for: domain (DNS), CDN, web firewall, DDoS protection' },
      // BACKEND row 1 (DigitalOcean App Platform, Singapore)
      { id: 'static', layer: 'backend', type: 'stack', ...at(C4[0], SG.row1, 116), icon: 'app-window', name: 'Static web app',
        price: { usd: 0 }, tech: [{ t: 'web build of the Metis app' }], provider: [DO, { t: 'App Platform, static site' }],
        purpose: 'used for: serving web files behind the cache' },
      { id: 'core', layer: 'backend', type: 'stack', ...at(C4[1], SG.row1, 116), icon: 'server', name: 'Business core',
        price: { usd: 50.0 }, tech: [{ logo: 'openjdk' }, { t: 'Java 25,' }, { logo: 'springboot' }, { t: 'Spring Boot 4' }],
        provider: [DO, { t: 'App Platform, 2 × 25.00' }], purpose: 'used for: reads, writes, permissions, audit' },
      { id: 'mcp', layer: 'backend', type: 'stack', ...at(C4[2], SG.row1, 116), icon: 'plug-zap', name: 'MCP gateway',
        price: { usd: 24.0 }, tech: [{ logo: 'typescript' }, { t: 'TypeScript,' }, { logo: 'nodedotjs' }, { t: 'Node.js' }],
        provider: [DO, { t: 'App Platform, 2 × 12.00' }], purpose: 'used for: customers\' LLMs read and write' },
      { id: 'login', layer: 'backend', type: 'stack', ...at(C4[3], SG.row1, 116), icon: 'key-round', name: 'Sign-in',
        price: { usd: 25.0 }, tech: [{ logo: 'keycloak' }, { t: 'Keycloak, 1 instance' }],
        provider: [DO, { t: 'App Platform' }], purpose: 'used for: SSO, MFA, OAuth for LLMs' },
      // BACKEND row 2
      { id: 'workflow', layer: 'backend', type: 'stack', ...at(C4[0], SG.row2, 116), icon: 'workflow', name: 'Durable workflows',
        price: { usd: 31.85 }, warn: 'estimate', tech: [{ logo: 'temporal' }, { t: 'Temporal Cloud, Developer' }],
        provider: [{ t: 'Temporal Cloud, AWS Singapore' }], purpose: 'used for: schedules, approvals, automation' },
      { id: 'jobs', layer: 'backend', type: 'stack', ...at(C4[1], SG.row2, 116), icon: 'cog', name: 'Background jobs',
        price: { usd: 25.0 }, tech: [{ t: 'worker' }, { logo: 'openjdk' }, { t: 'Java 25' }],
        provider: [DO, { t: 'App Platform' }], purpose: 'used for: email, PDF, import, export, MS Project' },
      { id: 'sandbox', layer: 'backend', type: 'stack', ...at(C4[2], SG.row2, 116), icon: 'box', name: 'Sandbox',
        price: { usd: 75.0 }, tech: [{ t: 'ClamAV 50.00; Chromium 25.00' }],
        provider: [DO, { t: 'App Platform' }], purpose: 'used for: virus scans, PDF rendering' },
      { id: 'agent', layer: 'backend', type: 'stack', ...at(C4[3], SG.row2, 116), icon: 'brain-circuit', name: 'AI agent',
        price: { usd: 5.0 }, tech: [{ t: 'calls' }, { logo: 'claude' }, { t: 'Claude' }],
        provider: [DO, { t: 'App Platform' }], purpose: 'used for: agents, tools only via MCP' },
      // DATA
      { id: 'pg', layer: 'data', type: 'stack', ...at(C4[0], SG.data, 116), icon: 'database', name: 'Database',
        price: { usd: 80.38 }, tech: [{ logo: 'postgresql' }, { t: 'PostgreSQL with standby' }],
        provider: [{ logo: 'planetscale' }, { t: 'PlanetScale PS-20 HA' }], purpose: 'used for: customer data, in AWS Singapore' },
      { id: 'valkey', layer: 'data', type: 'stack', ...at(C4[1], SG.data, 116), icon: 'zap', name: 'In-memory store',
        price: { usd: 15.0 }, tech: [{ t: 'Valkey, one 1 GiB node' }],
        provider: [DO, { t: 'Managed Valkey, SGP1' }], purpose: 'used for: cache, realtime, rate limits' },
      { id: 'spaces', layer: 'data', type: 'stack', ...at(C4[2], SG.data, 116), icon: 'folder-open', name: 'File storage',
        price: { usd: 5.0 }, tech: [{ t: '250 GiB stored, 1,024 GiB egress' }],
        provider: [DO, { t: 'Spaces, SGP1' }], purpose: 'used for: files customers upload' },
      { id: 'registry', layer: 'data', type: 'stack', ...at(C4[3], SG.data, 116), icon: 'package', name: 'Image registry',
        price: { usd: 5.0 }, tech: [{ t: 'Container Registry Basic' }],
        provider: [DO, { t: 'DigitalOcean, SGP1' }], purpose: 'used for: images the containers run' },
      // EXTERNAL SERVICES (two inside Singapore, two global)
      { id: 'ses', layer: 'external', type: 'stack', ...at(C4[0], SG.ext, 116), icon: 'mail', name: 'Email',
        price: { usd: 5.0 }, tech: [{ t: 'Amazon SES' }], provider: [{ t: 'AWS, Singapore region' }],
        purpose: 'used for: sending email to users' },
      { id: 'grafana', layer: 'external', type: 'stack', ...at(C4[1], SG.ext, 116), icon: 'activity', name: 'Monitoring',
        price: { usd: 0 }, tech: [{ logo: 'grafana' }, { t: 'Grafana Cloud Free' }], provider: [{ t: 'Grafana Labs, Singapore region' }],
        purpose: 'used for: logs, errors, metrics' },
      { id: 'claude', layer: 'external', type: 'stack', ...at(C4[2], SG.ext, 116), icon: 'sparkles', name: 'AI',
        price: { usd: 20.0 }, tech: [{ logo: 'claude' }, { t: 'Claude Sonnet 5.5' }],
        provider: [{ logo: 'anthropic' }, { t: 'Anthropic, via' }, { logo: 'cloudflare' }, { t: 'AI Gateway' }],
        purpose: 'used for: AI for agents; routed globally' },
      { id: 'github', layer: 'external', type: 'stack', ...at(C4[3], SG.ext, 116), icon: 'git-branch', name: 'Source code',
        price: { usd: 0 }, tech: [{ logo: 'github' }, { t: 'GitHub Free, OpenTofu' }], provider: [{ t: 'GitHub, global' }],
        purpose: 'used for: code hosting, automated tests' },
    ],
    lines: [
      { id: 'people-cf', layer: 'users', from: 'u-people', to: 'cf', pts: [[382, 178], [382, SG.cf]], arrow: true },
      { id: 'llm-cf', layer: 'users', from: 'u-llm', to: 'cf', pts: [[774, 178], [774, SG.cf]], arrow: true },
      { id: 'cf-core', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'core', pts: [[910, SG.cf + 84], [910, SG.row1]], arrow: true },
      { id: 'cf-static', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'static', pts: [[910, SG.bus], [518, SG.bus], [518, SG.row1]], arrow: true },
      { id: 'cf-mcp', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'mcp', pts: [[910, SG.bus], [1302, SG.bus], [1302, SG.row1]], arrow: true },
      { id: 'cf-login', layer: 'edge', group: 'cf-bus', from: 'cf', to: 'login', pts: [[1302, SG.bus], [1694, SG.bus], [1694, SG.row1]], arrow: true },
    ],
    totals: {
      y: 894, h: 128, labels: panelLabels,
      recommended: { expect: 386.23, note: ['the exact sum of the prices on the cards'] },
      cheapest: {
        expect: 166.23,
        own: [{ usd: 72.0 }, { usd: 27.38 }], // 3 Droplets (fh:278: 24 USD each), PostgreSQL PS-20 single node
        keep: ['workflow', 'spaces', 'registry', 'claude', 'ses', 'grafana', 'github'],
        note: ['3 Droplets, single-node PostgreSQL, Valkey in a container, Cloudflare Free'],
      },
      firstYear: { expect: [13768.22, 24769.22], note: ['12 months, penetration test, Apple, Google Play, domain; before VAT'] },
    },
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md section 5; .superpowers/backend/cost-chat-summary.md.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 7: Vietnam proposal (section 6). VND at 1 USD = 26,070 VND.
  // -------------------------------------------------------------------------------------------
  const VN = { cf: 198, top: 172, region: 326, vm: 350, bus: 566, data: 596, bottom: 724, ext: 750 }
  const SMC05 = 'VNPT SMC05: 4 vCPU, 8 GB'
  const d7 = {
    title: 'Vietnam proposal: where it runs, what it costs',
    subtitle: 'A Vietnamese legal entity signs; everything that stores or processes personal data runs on a Vietnamese cloud (VNPT prices as reference). USD per month, before VAT.',
    vndPerUsd: VND_PER_USD,
    bands: [
      { layer: 'users', y0: 100, y1: 178, desc: NOT_PRICED },
      { layer: 'edge', y0: 192, y1: 318, desc: 'Protects every connection' },
      { layer: 'backend', y0: 334, y1: 550, desc: 'Servers that handle every request' },
      { layer: 'data', y0: 562, y1: 716, desc: 'Where customer data is kept' },
      { layer: 'external', y0: 734, y1: 870, desc: 'Outside Vietnam' },
    ],
    region: {
      label: 'VIETNAM', note: 'data and processing stay inside this frame',
      pts: [[322, VN.region], [1150, VN.region], [1150, VN.top], [1890, VN.top], [1890, VN.bottom], [322, VN.bottom]],
      tab: { x: 1880, y: VN.top, align: 'right' },
    },
    nodes: [
      ...users23(100),
      { id: 'cf', layer: 'edge', type: 'stack', x: 332, y: VN.cf, w: 764, h: 116, icon: 'shield-check', name: 'Network shield',
        price: { usd: 20.0 }, tech: [{ logo: 'cloudflare' }, { t: 'Cloudflare Pro, billed yearly' }],
        provider: [{ t: 'Cloudflare, global network, outside Vietnam' }],
        purpose: 'used for: domain (DNS), CDN, web firewall, DDoS protection' },
      { id: 'lb', layer: 'edge', type: 'stack', x: 1312, y: VN.cf, w: 372, h: 116, icon: 'network', name: 'Load balancer',
        price: { vnd: 450000 }, tech: [{ t: 'VNPT LB01, with HA' }], provider: [{ t: 'VNPT, ' + vnd(450000) }],
        purpose: 'used for: sharing load across app machines' },
      // BACKEND: VNPT virtual machines
      { id: 'sandbox-vm', layer: 'backend', type: 'vm', x: 332, y: VN.vm, w: 404, h: 196, icon: 'server', name: 'Sandbox machine',
        price: { vnd: 759000 }, tech: [{ t: SMC05 }], provider: [{ t: 'VNPT, ' + vnd(759000) }],
        purpose: 'used for: untrusted files, no DB keys',
        chips: [['scan-search', 'Virus scan: ClamAV'], ['file-text', 'PDF: Chromium']] },
      { id: 'jobs-vm', layer: 'backend', type: 'vm', x: 756, y: VN.vm, w: 404, h: 196, icon: 'server', name: 'Jobs machine',
        price: { vnd: 759000 }, tech: [{ t: SMC05 }], provider: [{ t: 'VNPT, ' + vnd(759000) }],
        purpose: 'used for: jobs, self-hosted Temporal, Valkey',
        chips: [['cog', 'Background jobs'], ['workflow', 'Workflows'], ['zap', 'In-memory store'], ['brain-circuit', 'AI agent']] },
      { id: 'app-vm', layer: 'backend', type: 'vm', x: 1180, y: VN.vm, w: 700, h: 196, icon: 'server', name: 'App machines × 2',
        price: { vnd: 1518000 }, tech: [{ t: '2 × VNPT SMC05: 4 vCPU, 8 GB each' }], provider: [{ t: 'VNPT, ' + vnd(1518000) }],
        purpose: 'used for: every request from users and LLMs',
        chips: [['server', 'Business core'], ['key-round', 'Sign-in'], ['plug-zap', 'MCP gateway'], ['app-window', 'Static web app (nginx)']] },
      // DATA
      { id: 'files', layer: 'data', type: 'stack', x: 332, y: VN.data, w: 372, h: 116, icon: 'folder-open', name: 'File storage',
        price: { vnd: 45000 }, warn: 'plus egress', tech: [{ t: 'Object Storage, 50 GB block' }],
        provider: [{ t: 'VNPT, ' + vnd(45000) }], purpose: 'used for: files; egress price not published' },
      { id: 'backup', layer: 'data', type: 'stack', x: 724, y: VN.data, w: 372, h: 116, icon: 'database-backup', name: 'Off-site backup',
        price: { vnd: 52272 }, tech: [{ t: 'encrypted dump, 60.5 GB' }], provider: [{ t: 'Bizfly Simple Storage' }],
        purpose: 'used for: a copy at a second provider' },
      { id: 'pg', layer: 'data', type: 'stack', x: 1300, y: VN.data, w: 440, h: 116, icon: 'database', name: 'Database',
        price: { vnd: 2401000 }, warn: 'unsure: {alt} if 3 nodes', alt: { vnd: 3601500 },
        tech: [{ logo: 'postgresql' }, { t: 'PostgreSQL with standby' }], provider: [{ t: 'VNPT mi.large × 2' }],
        purpose: 'used for: data, sign-in, Temporal' },
      // EXTERNAL SERVICES (outside Vietnam)
      { id: 'claude', layer: 'external', type: 'stack', ...at(E5[0], VN.ext, 116), icon: 'sparkles', name: 'AI',
        price: { usd: 20.0 }, tech: [{ logo: 'claude' }, { t: 'Claude Sonnet 5.5' }], provider: [{ logo: 'anthropic' }, { t: 'Anthropic' }],
        purpose: 'used for: AI for agents' },
      { id: 'ses', layer: 'external', type: 'stack', ...at(E5[1], VN.ext, 116), icon: 'mail', name: 'Email',
        price: { usd: 5.0 }, tech: [{ t: 'Amazon SES' }], provider: [{ t: 'AWS, Singapore' }], purpose: 'used for: sending email' },
      { id: 'grafana', layer: 'external', type: 'stack', ...at(E5[2], VN.ext, 116), icon: 'activity', name: 'Monitoring',
        price: { usd: 0 }, tech: [{ logo: 'grafana' }, { t: 'Grafana Cloud Free' }], provider: [{ t: 'Grafana Labs' }],
        purpose: 'used for: logs, metrics; IPs removed' },
      { id: 'registry', layer: 'external', type: 'stack', ...at(E5[3], VN.ext, 116), icon: 'package', name: 'Image registry',
        price: { usd: 5.0 }, tech: [{ t: 'Container Registry' }], provider: [DO, { t: 'DigitalOcean, SGP1' }],
        purpose: 'used for: images, no customer data' },
      { id: 'github', layer: 'external', type: 'stack', ...at(E5[4], VN.ext, 116), icon: 'git-branch', name: 'Source code',
        price: { usd: 0 }, tech: [{ logo: 'github' }, { t: 'GitHub Free' }], provider: [{ t: 'GitHub, global' }],
        purpose: 'used for: code, fake data only' },
    ],
    lines: [
      { id: 'people-cf', layer: 'users', from: 'u-people', to: 'cf', pts: [[382, 178], [382, VN.cf]], arrow: true },
      { id: 'llm-cf', layer: 'users', from: 'u-llm', to: 'cf', pts: [[774, 178], [774, VN.cf]], arrow: true },
      { id: 'cf-lb', layer: 'edge', from: 'cf', to: 'lb', pts: [[1096, VN.cf + 58], [1312, VN.cf + 58]], arrow: true,
        label: { t: 'into Vietnam', x: 1225, y: VN.cf + 58 } },
      { id: 'lb-app', layer: 'edge', from: 'lb', to: 'app-vm', pts: [[1498, VN.cf + 116], [1498, VN.vm]], arrow: true },
      { id: 'app-pg', layer: 'backend', group: 'db', from: 'app-vm', to: 'pg', pts: [[1330, VN.vm + 196], [1330, VN.data]] },
      { id: 'jobs-pg', layer: 'backend', group: 'db', from: 'jobs-vm', to: 'pg', pts: [[958, VN.vm + 196], [958, VN.bus], [1330, VN.bus]] },
      { id: 'pg-backup', layer: 'data', from: 'pg', to: 'backup', pts: [[1300, VN.data + 58], [1096, VN.data + 58]], arrow: true,
        label: { t: 'encrypted backup', x: 1198, y: VN.data + 58 } },
    ],
    totals: {
      y: 876, h: 142, labels: panelLabels,
      recommended: { expect: 279.55, note: ['{vnd} VND + {usd} USD,', 'plus VNPT file egress (price not published)'] },
      cheapest: {
        expect: 138.01,
        own: [{ vnd: 1518000 }, { vnd: 1200500 }], // 2 x SMC05, PostgreSQL mi.large single node
        keep: ['files', 'backup', 'registry', 'claude', 'ses', 'grafana', 'github'],
        note: ['2 SMC05 machines, single-node PostgreSQL, no load balancer,', 'Cloudflare Free; plus egress'],
      },
      firstYear: { expect: [12488.06, 23489.06], note: ['12 months, penetration test, Apple, Google Play, domain;', 'before egress and VAT'] },
    },
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md section 6; .superpowers/backend/cost-chat-summary.md; 1 USD = 26,070 VND (Vietcombank, 10 Oct 2026).',
  }


  // -------------------------------------------------------------------------------------------
  // Diagram 5: Singapore proposal on one provider, DigitalOcean (section 12). New file; diagram 4 stays.
  // Diagram 4's rail, grid, cards and wording, so the two can be flipped side by side: every card that runs on
  // DigitalOcean shows its logo, and only the two cards that moved in (amber outline and tag) change.
  // -------------------------------------------------------------------------------------------
  const cert = (...t) => t.map((x) => ({ t: x, tone: 'cert' }))
  const ONE4 = {
    cf: { w: 600 }, // narrower than in diagram 4, so the change note and the DigitalOcean tab fit on its right
    workflow: { price: { usd: 30.0 }, warn: undefined, tech: [{ logo: 'temporal' }, { t: 'Temporal, self-hosted, with UI' }],
      provider: [DO, { t: 'App Platform' }], moved: 'moved from Temporal Cloud', mark: true },
    pg: { price: { usd: 260.0 }, tech: [{ logo: 'postgresql' }, { t: 'PostgreSQL HA, 2 vCPU, 8 GB' }],
      provider: [DO, { t: 'Managed PostgreSQL, SGP1' }], purpose: 'used for: core, Keycloak and Temporal data',
      moved: 'moved from PlanetScale', mark: true },
  }
  const d5 = {
    title: 'Singapore proposal on one provider: where it runs, what it costs',
    subtitle: 'Same layout as diagram 4; the two cards outlined in amber moved into DigitalOcean. USD per month, before VAT, launch setup.',
    bands: d4.bands,
    region: {
      label: 'DIGITALOCEAN, SINGAPORE (SGP1)', note: 'one private network, one bill',
      pts: [[322, SG.region], [1890, SG.region], [1890, SG.step], [322, SG.step]],
      tab: { x: 1880, y: SG.region, align: 'right', minX: 942 },
      tabChips: [{ t: 'SOC 2 Type II' }, { t: 'SOC 3' }, { t: 'CSA STAR Level 1' }],
    },
    nodes: [
      ...d4.nodes.map((n) => (ONE4[n.id] ? { ...n, ...ONE4[n.id] } : n)),
      { id: 'changed', layer: 'moved', type: 'note', x: 1116, y: 96, w: 764, h: 152, icon: 'arrow-left-right', iconSize: 48,
        title: 'What changed from diagram 4',
        paras: [
          [{ t: 'PostgreSQL:' }, { logo: 'planetscale' }, { t: 'PlanetScale 80.38' }, { arrow: true }, DO, { t: 'DigitalOcean 260.00 USD, on the private network' }],
          [{ t: 'Temporal:' }, { logo: 'temporal' }, { t: 'Temporal Cloud 31.85' }, { arrow: true }, DO, { t: 'self-hosted on App Platform 30.00 USD' }],
          [{ t: 'Vendors on the bill: 6' }, { arrow: true }, { t: '4. Per month: 386.23' }, { arrow: true }, { t: '564.00 USD' }],
          'Watch: DigitalOcean does not publish a maximum data loss for PostgreSQL.',
        ] },
    ],
    lines: d4.lines,
    totals: {
      kind: 'columns', y: 888, h: 140,
      recommended: { expect: 564.0 },
      columns: [
        { x: 76, w: 300, label: 'LAUNCH SETUP, PER MONTH', big: 'total', lines: ['4 vendors on the bill'] },
        { x: 420, w: 380, label: 'SAME LAYOUT ELSEWHERE, USD PER MONTH',
          lines: [[{ t: '637.08', strong: true }, { t: 'Google Cloud Compute Engine, 1-year' }], [{ t: '746.57', strong: true }, { t: 'GKE Autopilot, 1-year' }],
            [{ t: '802.55', strong: true }, { t: 'AWS Fargate' }]] },
        { x: 844, w: 520, label: 'SCALING',
          lines: ['Add App Platform instances; CPU autoscaling needs dedicated CPU plans, from 29 USD per container. Upgrade path: DigitalOcean Kubernetes, free control plane, HA 40 USD a month, 2 vCPU 4 GB nodes 24 USD a month.'] },
        { x: 1408, w: 436, label: 'ENVIRONMENTS',
          lines: ['Development: HostHatch, synthetic data only, 15 USD, not in the total', 'Staging: DigitalOcean, smallest sizes, priced later', 'Production: DigitalOcean SGP1, as drawn'] },
      ],
    },
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 5 and 12; spec/2026-10-10-backend-cost-model.md PT-M03 to PT-M11; research-compliance.md.',
    drawn: 'Drawn on 11 Oct 2026.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagrams 10 and 11: why each component was chosen (section 13 table)
  // -------------------------------------------------------------------------------------------
  // Table rows: component, what it does in Metis, the requirement it meets, the evidence. Heights are set per row.
  const GW = { cols: [444, 898, 1352] }
  const sla = (...t) => t.map((x) => ({ t: x, tone: 'sla' }))
  const grey = (...t) => t.map((x) => ({ t: x, tone: 'grey' }))
  const KEY = [{ t: 'certification', tone: 'cert' }, { t: 'commitment', tone: 'sla' }, { t: 'note', tone: 'grey' }]
  const whyHead = (key) => ({ id: 'head', type: 'whyHead', x: 40, y: 104, w: 1840, h: 44, grid: GW, key,
    titles: ['COMPONENT', 'WHAT IT DOES IN METIS', 'REQUIREMENT IT MEETS', 'EVIDENCE'] })
  const whyRows = (gap, rows) => { let y = 156; return rows.map((r) => { const n = { type: 'whyRow', x: 40, w: 1840, grid: GW, ...r, y }; y += r.h + gap; return n }) }
  const d10 = {
    title: 'Why each component was chosen: edge, servers, databases',
    subtitle: 'Part 1 of 2, from section 13. BRD n is line n of the BRD v4.5, ADD n line n of the onboarding addendum v1.1, BE-02 an owner decision.',
    nodes: [
      whyHead([...KEY, { t: 'caveat', tone: 'warn' }]),
      ...whyRows(10, [
        { id: 'w-cf', layer: 'edge', h: 96, icon: 'shield-check', logos: ['cloudflare'], name: 'Cloudflare Pro',
          role: 'Domain, CDN, web firewall, DDoS protection, bot rules with an exception for the mobile apps',
          meets: 'Protects every connection; MCP only over TLS (BRD 1463)',
          chips: cert('ISO 27001:2022', 'ISO 27018', 'ISO 27701', 'SOC 2 Type II', 'PCI DSS 4.0 Level 1') },
        { id: 'w-app', layer: 'backend', h: 96, icon: 'container', logos: ['digitalocean'], name: ['DigitalOcean', 'App Platform'],
          role: 'Runs the containers: load balancing, rolling deploys, TLS',
          meets: '99.9% availability (BRD 1477); a small team does not patch operating systems',
          chips: [...sla('SLA 99.95%'), ...cert('SOC 2 Type II', 'SOC 3', 'CSA STAR Level 1')] },
        { id: 'w-core', layer: 'backend', h: 96, icon: 'server', logos: ['openjdk', 'springboot'], name: ['Java 25,', 'Spring Boot 4 core'],
          role: 'One write path for the app, MCP and workflows: permission checks, de-duplication, per-field version checks, audit in the same transaction',
          meets: 'Write contract (BRD 696), audit that cannot be edited or deleted (BRD 701), permission matrix (BRD 1639)',
          chips: sla('Spring Boot: published support policy', 'Amazon Corretto 25: supported to 10/2032') },
        { id: 'w-mcp', layer: 'backend', h: 96, icon: 'plug-zap', logos: ['typescript', 'modelcontextprotocol'], name: ['TypeScript', 'MCP gateway'],
          role: 'One endpoint per tenant for customers\' LLMs; OAuth through Keycloak; rate limits per token',
          meets: 'MCP endpoint per tenant (BRD 831), rate limits (BRD 842), OAuth and personal tokens (BRD 1653)',
          chips: sla('Official MCP SDK, highest support tier') },
        { id: 'w-kc', layer: 'backend', h: 96, icon: 'key-round', logos: ['keycloak'], name: 'Keycloak',
          role: 'Sign-in, SAML or OIDC SSO per tenant, MFA, sign-in links for external guests, OAuth 2.1 server for MCP, SCIM later',
          meets: 'Per-tenant sign-in (BRD 722), a single identity layer (BRD 1627); sign-in data stays in our database, same region',
          chips: grey('open source, CNCF'), after: 'Self-hosted: no certificate of its own; covered by Metis\'s controls and the penetration test.' },
        { id: 'w-temporal', layer: 'backend', h: 96, icon: 'workflow', logos: ['temporal'], name: 'Temporal',
          sub: ['scattered: Temporal Cloud', 'one provider: self-hosted'],
          role: 'Durable workflows: approvals that wait for days, reminder schedules, drag-and-drop workflows, agent runs; survives restarts',
          meets: 'Time-based jobs in the BRD (BRD 699, 725, 798); drag-and-drop workflows (BE-02)',
          chips: [...cert('Temporal Cloud: SOC 2 Type 2'), ...sla('Temporal Cloud: SLA 99.9%')], after: 'Self-hosted: under Metis\'s own controls.' },
        { id: 'w-pg', layer: 'data', h: 114, icon: 'database', logos: ['postgresql'], name: ['PostgreSQL', 'with standby'],
          sub: ['scattered: PlanetScale', 'one provider: DigitalOcean'],
          role: 'Business data; row-level security keeps tenants apart; point-in-time restore',
          meets: 'At most 15 minutes of data lost, back within 4 hours, 99.9% (BRD 1477, 1478); tenant isolation in the database (BRD 740)',
          chipRows: [[...cert('PlanetScale SOC 2 Type 2'), ...sla('SLA 99.99%', 'restore to 5 minutes ago')],
            sla('DigitalOcean SLA 99.95%', 'restore to any point in 7 days'),
            [{ t: 'DigitalOcean: data-loss limit not published', tone: 'warn' }]] },
        { id: 'w-valkey', layer: 'data', h: 96, icon: 'zap', name: 'Valkey',
          role: 'Cache, pushes changes to screens, counts rate limits',
          meets: 'Limits per token and tenant (BRD 842); changes appear without a reload (BRD 696)',
          chips: grey('holds no business data, so no backup needed') },
      ]),
    ],
    lines: [],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 13, 5 and 12; .superpowers/backend/research-compliance.md; .superpowers/backend/digest-brd.md.',
  }
  const d11 = {
    title: 'Why each component was chosen: files, services, tooling',
    subtitle: 'Part 2 of 2, from section 13. BRD n is line n of the BRD v4.5, ADD n line n of the onboarding addendum v1.1.',
    nodes: [
      whyHead(KEY),
      ...whyRows(10, [
        { id: 'w-files', layer: 'data', h: 112, icon: 'folder-open', name: 'File storage',
          role: 'Customer files per tenant; signed download links that last 15 minutes',
          meets: 'Scanned and stored files (BRD 697, 741, 1481)',
          chips: sla('Spaces: SLA 99.9%') },
        { id: 'w-sandbox', layer: 'backend', h: 112, icon: 'box', name: 'Sandbox', sub: ['ClamAV and Chromium'],
          role: 'Scans every upload for malware; renders PDFs; no access to the database',
          meets: 'Malware scanning (BRD 697); server-side PDF (BRD 1637)',
          chips: grey('self-hosted software') },
        { id: 'w-claude', layer: 'external', h: 112, icon: 'sparkles', logos: ['claude'], name: 'Claude, by Anthropic',
          role: 'AI for onboarding and agents',
          meets: 'External LLM when a tenant turns it on (ADD 775); supplier selection criteria (ADD 776)',
          chips: cert('SOC 2 Type II', 'ISO 27001:2022', 'ISO 42001'),
          after: 'No training on API data; breach notice within 48 hours; data deleted within 30 days of termination; data stored in the US.' },
        { id: 'w-ses', layer: 'external', h: 112, icon: 'mail', name: 'Amazon SES',
          role: 'Notification email',
          meets: 'In-app and email notifications (BRD 699)',
          chips: [...cert('In AWS SOC and ISO scope'), ...sla('SLA 99.9%')] },
        { id: 'w-grafana', layer: 'external', h: 112, icon: 'activity', logos: ['grafana'], name: 'Grafana Cloud',
          role: 'Logs, metrics, traces, alerts',
          meets: 'Measures the targets of BRD section 17.1; logs carry no record content (BRD 747)',
          chips: cert('SOC 2 Type 2', 'ISO 27001', 'CSA STAR'), after: 'Singapore region available; a DPA must be signed.' },
        { id: 'w-github', layer: 'external', h: 112, icon: 'git-branch', logos: ['github'], name: 'GitHub',
          role: 'Source code, automated tests',
          meets: 'Keeps the same testing discipline as the frontend',
          chips: cert('ISO 27001:2022', 'SOC 3') },
        { id: 'w-tofu', layer: 'external', h: 112, icon: 'file-code', logos: ['opentofu'], name: 'OpenTofu',
          role: 'Infrastructure written as code',
          meets: 'Rebuild in another region if one is lost, running again within 4 hours (BRD 1478)',
          after: 'Official providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud; the PlanetScale provider is community-maintained.' },
      ]),
    ],
    lines: [],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 13 and 12; .superpowers/backend/research-compliance.md; .superpowers/backend/digest-brd.md.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 9: legal and security (sections 13.1 and 13.2)
  // -------------------------------------------------------------------------------------------
  const L3 = [332, 855, 1378]
  const d9 = {
    title: 'Legal and security: how the requirements are met',
    subtitle: 'The law depends on where the contracting company is incorporated; supplier evidence supports Metis\'s own ISO 27001.',
    bands: [
      { layer: 'legal', y0: 104, y1: 414, desc: 'What the law asks' },
      { layer: 'security', y0: 434, y1: 1022, desc: 'Evidence for certification' },
    ],
    nodes: [
      { id: 'l-sg', layer: 'legal', type: 'legal', x: L3[0], y: 104, w: 502, h: 310, flags: ['sg'], title: 'Singapore entity',
        law: 'Singapore Personal Data Protection Act (PDPA)',
        items: [{ icon: 'user-check', text: 'Publish the contact of the data protection officer.' },
          { icon: 'alarm-clock', text: 'Data breach: assess within 30 days; notify the PDPC within 3 calendar days if it can cause significant harm or affects 500 or more people.' },
          { icon: 'earth', text: 'Transfers abroad, such as Claude storing data in the US, need comparable protection by contract, for example Anthropic\'s DPA with standard contractual clauses.' }] },
      { id: 'l-vncust', layer: 'legal', type: 'legal', x: L3[1], y: 104, w: 502, h: 310, flags: ['vn', 'sg'], title: 'Vietnamese customers',
        law: 'Vietnam Personal Data Protection Law 91/2025/QH15',
        items: [{ icon: 'file-check', text: 'Data processed in Singapore: file a cross-border transfer impact assessment at the latest 60 days after the first transfer.' }] },
      { id: 'l-vn', layer: 'legal', type: 'legal', x: L3[2], y: 104, w: 502, h: 310, flags: ['vn'], title: 'Vietnam entity',
        law: 'Decree 333/2026/ND-CP, in-country storage',
        items: [{ icon: 'circle-check', text: 'In-country storage is met: the data sits at VNPT.' },
          { icon: 'file-check', text: 'Services abroad (Claude, SES, Grafana, the image registry) still need the transfer dossier.' }] },
      { id: 's-evidence', layer: 'security', type: 'matrix', x: 332, y: 434, w: 740, h: 588, rowGap: 24, icon: 'badge-check',
        title: 'Supplier evidence', intro: 'SOC 2 Type II reports or ISO 27001 certificates are what auditors usually ask for.',
        rows: [
          { name: 'DigitalOcean', chips: [...cert('SOC 2 Type II', 'SOC 3', 'CSA STAR Level 1'), ...grey('ISO 27001: leased sites only')] },
          { name: 'Cloudflare', chips: cert('ISO 27001:2022', 'SOC 2 Type II', 'PCI DSS 4.0 Level 1') },
          { name: 'Anthropic', chips: cert('SOC 2 Type II', 'ISO 27001:2022', 'ISO 42001') },
          { name: 'AWS (SES)', chips: cert('in AWS SOC and ISO scope') },
          { name: 'Grafana Cloud', chips: cert('SOC 2 Type 2', 'ISO 27001', 'CSA STAR') },
          { name: 'GitHub', chips: cert('ISO 27001:2022', 'SOC 3') },
          { name: 'PlanetScale', chips: cert('SOC 2 Type 2') },
          { name: 'Temporal Cloud', chips: cert('SOC 2 Type 2') },
          { name: 'VNPT', chips: [...cert('ISO 27001', 'ISO 27017'), ...grey('PCI DSS expired Aug 2026', 'no SOC 2')] },
          { name: 'Bizfly', chips: [...cert('ISO 27001:2022', 'PCI DSS 4.0.1'), ...grey('no SOC 2')] },
        ] },
      { id: 's-controls', layer: 'security', type: 'controls', x: 1092, y: 434, w: 788, h: 216, rowGap: 10, cols: 2, icon: 'list-checks',
        title: 'Metis manages its suppliers', intro: 'ISO/IEC 27001:2022 does not require suppliers to hold ISO 27001; it asks Metis for:',
        rows: [{ num: '5.19', text: 'a supplier security policy' }, { num: '5.20', text: 'security clauses in contracts' },
          { num: '5.21', text: 'the ICT supply chain' }, { num: '5.22', text: 'regular monitoring and review' },
          { num: '5.23', text: 'cloud services, with a plan for data on exit' }] },
      { id: 's-iso', layer: 'security', type: 'note', x: 1092, y: 670, w: 788, h: 150, icon: 'clipboard-check',
        title: 'Metis\'s own ISO 27001', paras: ['Supplier evidence and these controls go into the audit. ISO 27001 first, then SOC 2, when customers ask (section 1).',
          'First-year audits for both: 24,000 to 44,000 USD (section 8).'] },
      { id: 's-pentest', layer: 'security', type: 'note', x: 1092, y: 840, w: 788, h: 182, icon: 'search-check',
        title: 'Independent penetration test before go-live (BRD 721)',
        paras: ['Scope includes the custom magic-link sign-in, the MCP gateway and cross-tenant checks through row-level security (section 8).',
          'Budget: 8,999 to 20,000 USD, a US market range published by a testing firm; no quote from Vietnam or Singapore yet.'] },
    ],
    lines: [
      { id: 'ev-ctrl', layer: 'security', from: 's-evidence', to: 's-controls', pts: [[1072, 542], [1092, 542]], arrow: true },
      { id: 'ctrl-iso', layer: 'security', from: 's-controls', to: 's-iso', pts: [[1486, 650], [1486, 670]], arrow: true },
    ],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 13.1, 13.2, 1 and 8; spec/2026-10-10-backend-cost-model.md; .superpowers/backend/research-compliance.md.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 8: Singapore versus Vietnam, beyond cost (section 14)
  // -------------------------------------------------------------------------------------------
  const G8 = { critW: 340, sgX: 410, vnX: 1170, cellW: 700 }
  const row = (i, id, icon, crit, sg, vn) => ({ id, layer: 'neutral', type: 'compare', x: 40, y: 172 + i * 85, w: 1840, h: 80, grid: G8, icon, crit, sg, vn })
  const d8 = {
    title: 'Singapore or Vietnam: beyond cost',
    subtitle: 'One row per criterion, from section 14. Our reading: a green check marks the stronger side, an amber flag a point to plan for.',
    nodes: [
      { id: 'head', type: 'compareHead', x: 40, y: 104, w: 1840, h: 58, grid: G8, crit: 'CRITERION',
        sg: { flag: 'sg', title: 'SINGAPORE PROPOSAL' }, vn: { flag: 'vn', title: 'VIETNAM PROPOSAL' } },
      row(0, 'c-law', 'scale', 'Law',
        { mark: 'watch', head: 'Singapore PDPA', detail: 'Vietnamese customers need a cross-border transfer dossier' },
        { mark: 'good', head: 'In-country storage met', detail: 'services abroad still need the transfer dossier' }),
      row(1, 'c-where', 'map-pin', 'Where data is stored',
        { head: 'Singapore', detail: 'database, files and cache in Singapore; Claude stores AI data in the US' },
        { head: 'Vietnam (VNPT)', detail: 'backups at Bizfly, also in Vietnam' }),
      row(2, 'c-cert', 'badge-check', 'Infrastructure certifications',
        { head: 'SOC 2 Type II', detail: 'DigitalOcean SOC 2 Type II; PlanetScale SOC 2 Type 2' },
        { mark: 'watch', head: 'ISO 27001, no SOC 2', detail: 'VNPT ISO 27001, 27017 (PCI DSS expired Aug 2026); Bizfly ISO 27001:2022, PCI DSS 4.0.1' }),
      row(3, 'c-sla', 'gauge', 'Uptime commitments',
        { head: '99.95% to 99.99%', detail: 'App Platform 99.95%; database 99.95% (DigitalOcean) or 99.99% (PlanetScale)' },
        { head: '99.98% to 99.99%', detail: 'virtual machines 99.99%; PostgreSQL 99.98%' }),
      row(4, 'c-rpo', 'database-backup', 'Data lost on a restore',
        { head: '5 minutes, or not published', detail: 'PlanetScale publishes 5 minutes; DigitalOcean does not publish it' },
        { mark: 'watch', head: 'Not published', detail: 'VNPT does not publish it' }),
      row(5, 'c-ops', 'wrench', 'Operations',
        { mark: 'good', head: 'Managed by the provider', detail: 'managed containers, database and cache; no operating system patching' },
        { mark: 'watch', head: 'Run by Metis', detail: 'patch the virtual machines; run Valkey and Temporal ourselves' }),
      row(6, 'c-scale', 'trending-up', 'Scaling',
        { head: 'Add instances', detail: 'more App Platform instances; upgrade path DigitalOcean Kubernetes' },
        { head: 'Add machines', detail: 'more machines behind the load balancer; upgrade path VNPT Kubernetes (99.98%)' }),
      row(7, 'c-near', 'users', 'Close to Vietnamese users',
        { head: 'Data in Singapore', detail: 'static files come from Cloudflare points in Hanoi, Saigon and Da Nang' },
        { mark: 'good', head: 'Closest to users', detail: 'data and processing inside Vietnam' }),
      row(8, 'c-intl', 'earth', 'International customers',
        { mark: 'good', head: 'Ready', detail: 'Singapore region, global providers' },
        { mark: 'watch', head: 'Needs a second deployment', detail: 'an extra deployment abroad for international customers' }),
      row(9, 'c-price', 'receipt', 'Price transparency',
        { mark: 'good', head: 'All prices published', detail: 'every price comes from a public price list' },
        { mark: 'watch', head: 'Some prices need a quote', detail: 'some prices are not published' }),
    ],
    lines: [],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md section 14 (and 5, 6, 12, 13); .superpowers/backend/research-compliance.md, research-infra.md.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 2: frontend architecture, build time and one request (.superpowers/pitch/frontend-platform-facts.md)
  // -------------------------------------------------------------------------------------------
  const L9 = { web: 112, ios: 222, android: 332, h: 100 }
  const X9 = [720, 1120, 1520] // lane columns, 360 wide
  const R9 = { browser: 476, iphone: 616, android: 756, h: 120 }
  const lane = (id, col, y, icon, name, tech, purpose) => ({ id, layer: 'frontend', type: 'side', x: X9[col], y, w: 360, h: L9.h, icon, name, tech, purpose: [purpose] })
  const step = (id, a, b, y, xa, xb, label, layer = 'frontend') => ({ id, layer, from: a, to: b, pts: [[xa, y], [xb, y]], arrow: true,
    ...(label ? { label: { t: label, x: (xa + xb) / 2, y } } : {}) })
  const d2 = {
    title: 'Frontend architecture: one code base, three apps',
    subtitle: 'React Native with Expo, built into a website, an iPhone app and an Android app. Numbers follow one request from tap to screen; Cloudflare and the backend are as proposed.',
    bands: [
      { layer: 'fbuild', y0: 104, y1: 440, desc: 'One code base, three apps' },
      { layer: 'frun', y0: 456, y1: 1022, desc: 'One request, as proposed' },
    ],
    nodes: [
      // build time
      { id: 'code', layer: 'frontend', type: 'list', x: 332, y: L9.web, w: 330, h: 320, icon: 'code', title: 'One code base',
        rows: [[{ logo: 'typescript' }, { t: 'TypeScript 6.0.3' }], [{ logo: 'react' }, { t: 'React 19.2.3' }],
          [{ logo: 'react' }, { t: 'React Native 0.86.3' }], [{ icon: 'layers' }, { t: 'New Architecture, Fabric' }],
          [{ logo: 'expo' }, { t: 'Expo SDK 57, Expo Router' }], [{ logo: 'metro' }, { t: 'Metro bundles each platform' }]] },
      lane('w1', 0, L9.web, 'globe', 'Web bundle', [{ logo: 'metro' }, { t: 'Metro, react-native-web' }], 'View and Text become HTML'),
      lane('w2', 1, L9.web, 'file-code', 'Static files', [{ t: 'expo export, web' }], 'one index.html, JavaScript, assets'),
      lane('w3', 2, L9.web, 'cloud', 'Static hosting', [{ logo: 'cloudflare' }, { t: 'behind Cloudflare CDN' }], [DO, { t: 'proposed: App Platform' }]),
      lane('i1', 0, L9.ios, 'file-code', 'Xcode project', [{ logo: 'expo' }, { t: 'expo prebuild' }], 'writes ios/ from app.json'),
      lane('i2', 1, L9.ios, 'hammer', 'iOS build', [{ logo: 'xcode' }, { t: 'Xcode, Release' }], 'app code inside; Hermes runs it'),
      lane('i3', 2, L9.ios, 'store', 'App Store', [{ logo: 'appstore' }, { t: 'distribution target' }], 'iPhone, iOS 16.4 and later'),
      lane('a1', 0, L9.android, 'file-code', 'Gradle project', [{ logo: 'expo' }, { t: 'expo prebuild' }], 'writes android/ from app.json'),
      lane('a2', 1, L9.android, 'hammer', 'Android build', [{ logo: 'gradle' }, { t: 'Gradle' }], 'Hermes runs the app code'),
      lane('a3', 2, L9.android, 'store', 'Google Play', [{ logo: 'googleplay' }, { t: 'distribution target' }], 'Android 7 and later'),
      // run time: one request
      { id: 'browser', layer: 'users', type: 'side', x: 332, y: R9.browser, w: 370, h: R9.h, icon: 'monitor', stepTag: '1', name: 'Browser',
        tech: [{ t: 'Chrome, Safari, Edge, Firefox' }], purpose: ['7 react-native-web renders HTML and CSS'] },
      { id: 'iphone', layer: 'users', type: 'side', x: 332, y: R9.iphone, w: 370, h: R9.h, icon: 'smartphone', stepTag: '1', name: 'iPhone app',
        tech: [{ logo: 'apple' }, { t: 'installed on the phone' }], purpose: ['7 Hermes runs the JavaScript; Fabric draws native iOS views'] },
      { id: 'android', layer: 'users', type: 'side', x: 332, y: R9.android, w: 370, h: R9.h, icon: 'tablet-smartphone', stepTag: '1', name: 'Android app',
        tech: [{ logo: 'android' }, { t: 'installed on phone or tablet' }], purpose: ['7 Hermes runs the JavaScript; Fabric draws native Android views'] },
      { id: 'cf', layer: 'edge', type: 'note', x: 812, y: R9.browser, w: 360, h: 400, icon: 'shield-check', titleLogos: ['cloudflare'], title: 'Cloudflare edge',
        paras: ['The nearest point, such as Hanoi, Saigon or Da Nang.', 'DNS for the domain.', 'HTTPS ends here, with Cloudflare\'s certificate.',
          'Web firewall and DDoS protection check every call.', 'The CDN cache keeps the web files.'] },
      { id: 'origin', layer: 'frontend', type: 'side', x: 1282, y: R9.browser, w: 598, h: 110, icon: 'cloud', name: 'Static hosting, the origin',
        tech: [{ t: 'the web files' }], purpose: ['sends a file only when the edge has no copy', [DO, { t: 'proposed: App Platform static site' }]] },
      { id: 'backend', layer: 'backend', type: 'list', x: 1282, y: 626, w: 598, h: 250, icon: 'server', title: 'Backend, as proposed', sub: 'detail in diagrams 4 to 7',
        rows: [[{ logo: 'openjdk' }, { logo: 'springboot' }, { t: 'API: Java 25, Spring Boot 4, answers in JSON' }],
          [{ logo: 'postgresql' }, { t: '5 reads the data from PostgreSQL' }], [{ logo: 'keycloak' }, { t: 'Keycloak issues sign-in tokens; the API checks them' }]], rowH: 36 },
    ],
    lines: [
      step('code-w1', 'code', 'w1', L9.web + 50, 662, 720), step('code-i1', 'code', 'i1', L9.ios + 50, 662, 720), step('code-a1', 'code', 'a1', L9.android + 50, 662, 720),
      step('w1-w2', 'w1', 'w2', L9.web + 50, 1080, 1120), step('w2-w3', 'w2', 'w3', L9.web + 50, 1480, 1520),
      step('i1-i2', 'i1', 'i2', L9.ios + 50, 1080, 1120), step('i2-i3', 'i2', 'i3', L9.ios + 50, 1480, 1520),
      step('a1-a2', 'a1', 'a2', L9.android + 50, 1080, 1120), step('a2-a3', 'a2', 'a3', L9.android + 50, 1480, 1520),
      step('r-files', 'browser', 'cf', R9.browser + 30, 702, 812, '2 web files', 'users'),
      step('r-web', 'browser', 'cf', R9.browser + 85, 702, 812, '3 HTTPS', 'users'),
      step('r-ios', 'iphone', 'cf', R9.iphone + 60, 702, 812, '3 HTTPS', 'users'),
      step('r-android', 'android', 'cf', R9.android + 60, 702, 812, '3 HTTPS', 'users'),
      step('r-origin', 'cf', 'origin', R9.browser + 55, 1172, 1282, '2 on a miss', 'edge'),
      step('r-api', 'cf', 'backend', 751, 1172, 1282, '4 checked', 'edge'),
      { id: 'r-answer', layer: 'backend', from: 'backend', to: 'android', pts: [[1340, 876], [1340, 930], [517, 930], [517, 876]], arrow: true,
        label: { t: '6 the answer comes back through Cloudflare; the app checks it against the zod contract', x: 928, y: 930 } },
    ],
    footerSource: 'Source: .superpowers/pitch/frontend-platform-facts.md: repository files, plus Expo, React Native and Cloudflare docs read on 11 Oct 2026.',
    drawn: 'Drawn on 11 Oct 2026.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 3: the 13 test gates of pnpm verify, in order (frontend-digest.md sections 2 to 11)
  // -------------------------------------------------------------------------------------------
  const Y10 = { r1: 140, r2: 386, r3: 632, strip: 878 }
  const pass = (...t) => t.map((x) => ({ t: x, tone: 'sla' }))
  const gate = (n, layer, x, y, w, h, icon, name, tool, blocks, passes, aside) =>
    ({ id: `g${n}`, layer, type: 'gate', x, y, w, h, stepTag: `gate ${n}`, icon, name, tool, blocks, pass: pass(...passes), aside })
  const X1 = (i) => 40 + i * 310; const X2 = (i) => 40 + i * 372
  const arrow = (a, b, ya, layer, xa, xb) => ({ id: `${a}-${b}`, layer, from: a, to: b, pts: [[xa, ya], [xb, ya]], arrow: true })
  const d3 = {
    title: '13 automated gates test the app before QA sees it',
    subtitle: 'pnpm verify runs them in this order and reports every red one. Last full run, 10 Oct 2026: 13 of 13 green on one code tree, 52bc6629bff0.',
    labels: [
      { x: 40, y: 118, t: 'CODE QUALITY', note: 'gates 1 to 6', color: '#1971C2' },
      { x: 40, y: 364, t: 'CORRECTNESS', note: 'gates 7 to 10', color: '#2B8A3E' },
      { x: X2(4), y: 364, t: 'SECURITY AND SUPPLY CHAIN', note: 'gate 11', color: '#5F3DC4' },
      { x: 40, y: 610, t: 'REAL BROWSERS AND DEVICES', note: 'gates 12 and 13', color: '#E8590C' },
      { x: 1300, y: 610, t: 'HANDOFF', color: '#495057' },
    ],
    nodes: [
      gate(1, 'qcode', X1(0), Y10.r1, 290, 200, 'palette', 'Design tokens', [{ t: 'Node script' }],
        'Colours, sizes and fonts drifting from the brand: generated tokens must match the brand file.', ['exact match']),
      gate(2, 'qcode', X1(1), Y10.r1, 290, 200, 'file-type', 'Type check', [{ logo: 'typescript' }, { t: 'TypeScript 6.0.3' }],
        'Type errors in the app and its browser tests, in strict mode, and links to pages that do not exist.', ['0 errors']),
      gate(3, 'qcode', X1(2), Y10.r1, 290, 200, 'list-checks', 'Lint', [{ logo: 'eslint' }, { t: 'ESLint 9.39.5' }],
        'Wrong imports between layers, hand-typed styles or text, disabled tests, unsupported web features.', ['0 errors', '0 warnings']),
      gate(4, 'qcode', X1(3), Y10.r1, 290, 200, 'languages', 'Language', [{ t: 'Node script' }],
        'Code, comments and test titles not in English; Vietnamese only in the Vietnamese text files.', ['0 problems']),
      gate(5, 'qcode', X1(4), Y10.r1, 290, 200, 'align-left', 'Format', [{ logo: 'prettier' }, { t: 'Prettier 3.9.9' }],
        'Any file not written in the one standard format.', ['0 files']),
      gate(6, 'qcode', X1(5), Y10.r1, 290, 200, 'scissors', 'Dead code', [{ logo: 'knip' }, { t: 'Knip 6.39.0' }],
        'Unused files, exports and dependencies.', ['0 findings']),
      gate(7, 'qcorrect', X2(0), Y10.r2, 352, 200, 'wrench', 'Tool tests', [{ logo: 'nodedotjs' }, { t: 'Node test runner' }],
        'Untested project tools: 12 scripts and 5 lint rules; every gate needs a canary or a written reason.', ['100% coverage']),
      gate(8, 'qcorrect', X2(1), Y10.r2, 352, 200, 'link', 'Requirement trace', [{ t: 'Node script' }],
        'A screen requirement that no running test names; 4 of screen 24\'s 9 codes must be proven in a browser.', ['0 untraced']),
      gate(9, 'qcorrect', X2(2), Y10.r2, 352, 200, 'test-tube', 'Unit tests', [{ logo: 'jest' }, { t: 'Jest 29.7.0' }],
        'Broken logic, data contracts or components, tested in four set-ups: iOS, Android, web and Node.', ['2,951 of 2,951', '100% coverage']),
      gate(10, 'qcorrect', X2(3), Y10.r2, 352, 200, 'bug', 'Mutation tests', [{ logo: 'stryker' }, { t: 'StrykerJS 10.0.0' }],
        'Plants 1,714 small bugs in the code; every one must make a test fail, so a weak test cannot hide.', ['score 100']),
      gate(11, 'qsupply', X2(4), Y10.r2, 352, 200, 'package-check', 'Dependencies', [{ logo: 'pnpm' }, { t: 'pnpm audit, licences' }],
        'Shipped packages with a published security advisory, 4 reviewed ones excepted, or a licence off a 12-entry list.', ['0 new advisories', '0 licence issues']),
      gate(12, 'qdevices', 40, Y10.r3, 620, 226, 'globe', 'Browser tests', [{ t: 'Playwright 1.63.0, axe-core 4.13.0' }],
        '110 tests on Chromium and WebKit, Safari\'s engine, 360 to 1440 px wide with phones emulated, in English and Vietnamese: layout, keyboard, accessibility and 12 page states. The release build must hold no mock data.',
        ['220 of 220 runs', '0 skipped']),
      gate(13, 'qdevices', 680, Y10.r3, 600, 226, 'smartphone', 'iPhone app test', [{ logo: 'xcode' }, { t: 'Xcode Release build, Maestro 2.11.0' }],
        'Builds the real iOS app and runs 2 flows on the iPhone 18 Pro simulator, iOS 27.0: launch, phone layout, drawer, switch to Vietnamese.',
        ['2 of 2 flows'], 'Also run by hand on 9 Oct: Android 15 phone, Android 7.0 and an Android tablet; 16 defects found and fixed.'),
      { id: 'qa', layer: 'neutral', type: 'gate', x: 1300, y: Y10.r3, w: 580, h: 226, icon: 'users', name: 'Then to the QA team', tool: [{ t: 'with a review package' }],
        blocks: 'Receives the build and a review package that opens with what is still missing or untested, 52 screenshots and a check of 190 spec lines against the code. Testers then work on real devices.' },
      { id: 'canary', layer: 'qcanary', type: 'note', x: 40, y: Y10.strip, w: 600, h: 144, icon: 'bird',
        title: 'Planted defects the gates must catch: 37 of 37 caught',
        paras: ['37 deliberate faults across 11 gates, such as a hand-typed size, a skipped test or a 30 x 30 px button. A gate that stays green with one planted is blind. Last run: 501 s.'] },
      { id: 'runs', layer: 'neutral', type: 'note', x: 660, y: Y10.strip, w: 600, h: 144, icon: 'laptop', title: 'Runs today with pnpm verify',
        paras: ['All 13 in order on the developer\'s Mac: about 139 minutes, 98% of it mutation testing.',
          { chips: [{ t: 'CI on GitHub Actions: ready, starts with the first commit', tone: 'grey' }] }] },
      { id: 'next', layer: 'neutral', type: 'note', x: 1280, y: Y10.strip, w: 600, h: 144, icon: 'list-todo', title: 'Next to cover',
        paras: ['Real Safari, Edge and Firefox; Android flows in CI; a written QA checklist.'] },
    ],
    lines: [
      ...[1, 2, 3, 4, 5].map((i) => arrow(`g${i}`, `g${i + 1}`, Y10.r1 + 100, 'qcode', X1(i - 1) + 290, X1(i))),
      ...[7, 8, 9].map((i) => arrow(`g${i}`, `g${i + 1}`, Y10.r2 + 100, 'qcorrect', X2(i - 7) + 352, X2(i - 6))),
      arrow('g10', 'g11', Y10.r2 + 100, 'qsupply', X2(3) + 352, X2(4)),
      arrow('g12', 'g13', Y10.r3 + 113, 'qdevices', 660, 680),
      arrow('g13', 'qa', Y10.r3 + 113, 'neutral', 1280, 1300),
    ],
    footerSource: 'Source: .superpowers/pitch/frontend-digest.md sections 2 to 11; results from apps/metis/reports/verify.md, 10 Oct 2026.', drawn: 'Drawn on 11 Oct 2026.',
  }

  // -------------------------------------------------------------------------------------------
  // Diagram 6: scattered (diagram 4) or one provider (diagram 5), side by side
  // -------------------------------------------------------------------------------------------
  const isl = (label, note, color, x, y, w, h) => ({ label, note, color, icon: 'building-2', pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], tab: { x, y, align: 'left' } })
  const pill = (id, x, y, w, name, sub, moved, logo) => ({ id, layer: moved ? 'moved' : 'neutral', type: 'pill', x, y, w, h: 52, name, sub, outline: !!moved, logo })
  const P11 = [40, 1000] // left and right panel origins
  const doPills = (p, k) => [
    pill(`${k}-mcp`, p + 16, 316, 172, 'MCP gateway', '', false, 'digitalocean'), pill(`${k}-kc`, p + 196, 316, 144, 'Keycloak', '', false, 'digitalocean'), pill(`${k}-core`, p + 348, 316, 144, 'core', '', false, 'digitalocean'),
    pill(`${k}-valkey`, p + 16, 380, 172, 'Valkey', '', false, 'digitalocean'), pill(`${k}-spaces`, p + 196, 380, 144, 'Spaces', '', false, 'digitalocean'), pill(`${k}-reg`, p + 348, 380, 144, 'Registry', '', false, 'digitalocean'),
    pill(`${k}-agent`, p + 16, 444, 172, 'agent', '', false, 'digitalocean'), pill(`${k}-sandbox`, p + 196, 444, 144, 'sandbox', '', false, 'digitalocean'), pill(`${k}-worker`, p + 348, 444, 144, 'worker', '', false, 'digitalocean'),
  ]
  const topPills = (p, k) => [pill(`${k}-cf`, p + 16, 186, 308, 'Cloudflare Pro', '', false, 'cloudflare'), pill(`${k}-claude`, p + 376, 186, 218, 'Claude', '', false, 'claude'), pill(`${k}-ses`, p + 646, 186, 218, 'Amazon SES')]
  const topIslands = (p) => [isl('CLOUDFLARE', '', '#7048E8', p, 174, 340, 76), isl('ANTHROPIC', '', '#495057', p + 360, 174, 250, 76), isl('AWS', '', '#495057', p + 630, 174, 250, 76)]
  const G11 = { cols: [400, 1150], cellW: 720 }
  const trow = (i, id, crit, left, right) => ({ id, layer: 'neutral', type: 'row', x: 40, y: 604 + i * 48, w: 1840, h: 44, grid: G11, crit, left, right })
  const d6 = {
    title: 'Scattered or one provider: what actually changes',
    subtitle: 'Both Singapore proposals run the same containers on DigitalOcean. Only PostgreSQL and Temporal move, shown in amber. USD per month, before VAT.',
    labels: [
      { x: 40, y: 128, t: 'SCATTERED, DIAGRAM 4', note: '6 vendors on the bill, 386.23 USD a month', color: '#495057' },
      { x: 1000, y: 128, t: 'ONE PROVIDER, DIAGRAM 5', note: '4 vendors on the bill, 564.00 USD a month', color: '#0B7285' },
    ],
    regions: [
      ...topIslands(P11[0]), isl('DIGITALOCEAN', 'App Platform and managed services', '#0B7285', P11[0], 300, 520, 208),
      isl('PLANETSCALE', '', '#495057', P11[0] + 660, 300, 220, 80), isl('TEMPORAL CLOUD', '', '#495057', P11[0] + 660, 428, 220, 80),
      ...topIslands(P11[1]), isl('DIGITALOCEAN', 'one private network', '#0B7285', P11[1], 300, 880, 208),
    ],
    nodes: [
      ...topPills(P11[0], 'l'), ...doPills(P11[0], 'l'),
      pill('l-pg', P11[0] + 676, 312, 188, 'PostgreSQL', 'PS-20 HA, 80.38 USD', true, 'planetscale'),
      pill('l-temporal', P11[0] + 676, 440, 188, 'Temporal', '31.85 USD', true, 'temporal'),
      ...topPills(P11[1], 'r'), ...doPills(P11[1], 'r'),
      pill('r-pg', P11[1] + 660, 312, 204, 'PostgreSQL', '2 vCPU, 8 GB, 260.00 USD', true, 'digitalocean'),
      pill('r-temporal', P11[1] + 660, 440, 204, 'Temporal', 'self-hosted, 30.00 USD', true, 'digitalocean'),
      { id: 'th', type: 'row', head: true, x: 40, y: 556, w: 1840, h: 40, grid: G11, crit: 'WHAT CHANGES', left: 'SCATTERED, DIAGRAM 4', right: 'ONE PROVIDER, DIAGRAM 5' },
      trow(0, 't-pg', 'PostgreSQL', 'PlanetScale PS-20 HA, 1/4 vCPU, 2 GiB: 80.38 USD', 'DigitalOcean Managed PostgreSQL HA, 2 vCPU, 8 GB: 260.00 USD'),
      trow(1, 't-temporal', 'Temporal', 'Temporal Cloud, run by Temporal; SOC 2 Type 2, SLA 99.9%: 31.85 USD', 'self-hosted on App Platform, run by us: 30.00 USD'),
      trow(2, 't-net', 'Network path', 'PlanetScale over the Internet with TLS; Temporal Cloud over TLS 1.3', 'one private network for the containers, PostgreSQL and Valkey'),
      trow(3, 't-vendors', 'Vendors on the bill', '6: DigitalOcean, PlanetScale, Temporal Cloud, Cloudflare, Anthropic, AWS', '4: DigitalOcean, Cloudflare, Anthropic, AWS'),
      trow(4, 't-who', 'Who runs the database', 'PlanetScale, a separate company', 'DigitalOcean, the same company as the containers'),
      trow(5, 't-rec', 'Recovery commitment', 'SLA 99.99%; restore to 5 minutes ago', 'SLA 99.95%; restore to any point in 7 days; max data loss not published'),
      trow(6, 't-total', 'Monthly total', '386.23 USD', '564.00 USD'),
      { id: 't-same', layer: 'neutral', type: 'row', span: true, x: 40, y: 948, w: 1840, h: 74, grid: G11, crit: 'Same in both',
        left: 'Cloudflare Pro; on DigitalOcean the core, MCP gateway, Keycloak, worker, agent and sandbox containers, Valkey, Spaces and the image registry; Claude by Anthropic; Amazon SES on AWS; free: Grafana Cloud and GitHub.' },
    ],
    lines: [
      { id: 'l-net-pg', layer: 'neutral', to: 'l-pg', pts: [[562, 340], [716, 340]], arrow: true, dashed: true, label: { t: 'Internet, TLS', x: 634, y: 340 } },
      { id: 'l-net-tc', layer: 'neutral', to: 'l-temporal', pts: [[562, 468], [716, 468]], arrow: true, dashed: true, label: { t: 'TLS 1.3', x: 634, y: 468 } },
      { id: 'r-net-pg', color: '#0B7285', from: 'r-core', to: 'r-pg', pts: [[1496, 340], [1660, 340]], arrow: true, label: { t: 'private network', x: 1578, y: 340 } },
      { id: 'r-net-tc', color: '#0B7285', from: 'r-worker', to: 'r-temporal', pts: [[1496, 468], [1660, 468]], arrow: true, label: { t: 'private network', x: 1578, y: 468 } },
    ],
    footerSource: 'Source: spec/2026-10-10-backend-two-proposals.md sections 5, 12, 13; spec/2026-10-10-backend-cost-model.md lines 130, 185, 192; research-compliance.md.',
    drawn: 'Drawn on 11 Oct 2026.',
  }

  return [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11].map((d, i) => ({ ...d, id: FILES[i], stack: 'spring-boot' }))
}
