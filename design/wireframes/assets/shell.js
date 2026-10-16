/* Metis wireframe shell. Builds the shared chrome around <main> from <body> data attributes, so each
   screen file only holds its own content. Plain DOM, no dependencies, works from file://.

   <body data-shell="app|admin|provider|none"     which chrome to draw (default app)
         data-nav="cockpit"                       active sidebar item id (see NAV below)
         data-workspace="Creative Studio"         workspace shown in the switcher and project tree
         data-tenant="Nova Energy"                tenant name in the app and admin sidebars (default Acme Holdings)
         data-crumbs="Portfolio / Executive cockpit"  breadcrumb text in the top bar
         data-project="Meridian CGI Campaign"     draws the project header and tabs
         data-tab="overview|charter|wbs|plan|governance|focus"
         data-client, data-pm, data-stage, data-rag="g|a|r", data-rag-label, data-framework, data-baseline
                                                  optional project header values (defaults: the POC demo project)
         data-save="saving|failed", data-save-label   save state in the project header (default: all changes saved)
         data-user="HL"                           initials of the signed-in user in the top bar (default NR, Nadia R.)>
   The screen's <meta name="wf:*"> tags feed the strip above the frame (title, phase, requirements). */
(function () {
  const body = document.body, d = body.dataset;
  const meta = n => (document.querySelector(`meta[name="wf:${n}"]`) || {}).content || '';
  const LOGO = '../../brand/logo/metis-wordmark.svg';
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const main = document.querySelector('main');
  const notes = document.querySelector('.wf-notes');

  const strip = h(`<div class="wf-strip"><span>WIREFRAME</span><b>${meta('title')}</b><span>${meta('area')}</span>
    <span>Phase: ${meta('phase')}</span><span>Requirements: ${meta('requirements')}</span>${meta('poc') ? `<span>POC: ${meta('poc')}</span>` : ''}</div>`);

  const shell = d.shell || 'app';
  const ws = d.workspace || 'Creative Studio';
  const tenant = d.tenant || 'Acme Holdings';

  const item = (id, ic, label, extra = '') =>
    `<a class="nav-item${d.nav === id ? ' active' : ''}" data-id="${id}"><span class="ic">${ic}</span>${label}${extra}</a>`;

  const TREES = {
    'Creative Studio': [
      ['Client Delivery', [['Northwind Furniture Co.', ['Meridian CGI Campaign', 'Northwind Showroom VR']], ['Contoso Retail', ['Spring Catalogue Renders']]]]
    ],
    'Digital Products': [
      ['Growth', [['MSME Transformation', ['MSME Payment', 'Merchant Onboarding']], ['Customer', ['Digital Sales', 'Mobile App']]]],
      ['Technology & Regulatory', [['Platform', ['Core Platform', 'Data Platform']], ['Regulatory', ['AML Upgrade']]]]
    ]
  };
  function tree() {
    return (TREES[ws] || []).map(([pf, programs]) =>
      `<a class="nav-item"><span class="ic">▤</span>${pf}</a><div class="nav-tree">` +
      programs.map(([pg, projects]) =>
        `<a class="nav-item"><span class="ic">▸</span>${pg}<span class="count">${projects.length}</span></a><div class="nav-tree">` +
        projects.map(p => `<a class="nav-item${d.project === p ? ' active' : ''}"><span class="ic">≡</span>${p}</a>`).join('') + '</div>'
      ).join('') + '</div>'
    ).join('');
  }

  const sidebars = {
    app: () => `<aside class="wf-sidebar">
      <img class="logo" src="${LOGO}" alt="Metis">
      <div class="switch"><div><small>${tenant}</small><b>${ws}</b></div><span class="muted">▾</span></div>
      <div class="search">Search  ⌘K</div>
      <div class="nav-sec">Home</div>
      ${item('my-focus', '◎', 'My focus', '<span class="count hot">9</span>')}
      ${item('approvals', '✓', 'Approvals', '<span class="count">3</span>')}
      <div class="nav-sec">Portfolio</div>
      ${item('cockpit', '◐', 'Executive cockpit')}
      ${item('workspace-dashboard', '▦', 'Workspace dashboard')}
      ${item('registry', '☰', 'Registry')}
      ${item('roadmap', '⇥', 'Roadmap')}
      ${item('capacity', '◫', 'Capacity')}
      ${item('risk', '△', 'Risk & dependencies')}
      ${item('investment', '$', 'Investment', '<span class="phase">Planned V2</span>')}
      ${item('scenario', '⇄', 'Scenarios', '<span class="phase">Planned V2</span>')}
      ${item('steerco', '▤', 'SteerCo', '<span class="phase">Planned V2</span>')}
      ${item('copilot', '✦', 'AI copilot', '<span class="phase">Planned V3</span>')}
      <div class="nav-sec">Projects</div>
      ${tree()}
      <div class="nav-spacer"></div>
      <div class="nav-sec">Workspace</div>
      ${item('framework', '◇', 'Lifecycle framework')}
      ${item('templates', '⧉', 'Templates')}
      ${item('settings', '⚙', 'Settings')}
    </aside>`,
    admin: () => `<aside class="wf-sidebar">
      <img class="logo" src="${LOGO}" alt="Metis">
      <div class="switch"><div><small>Tenant admin</small><b>${tenant}</b></div><span class="muted">▾</span></div>
      <div class="nav-sec">Organization</div>
      ${item('admin-users', '◍', 'Users & roles')}
      ${item('admin-security', '⚿', 'Sign-in & security')}
      ${item('admin-workspaces', '▦', 'Workspaces')}
      ${item('admin-plan', '◔', 'Plan & usage')}
      ${item('admin-ai', '✦', 'AI access (MCP)')}
      ${item('admin-audit', '☰', 'Audit log')}
      ${item('admin-export', '⇩', 'Data export')}
      <div class="nav-spacer"></div>
      ${item('back', '←', 'Back to app')}
    </aside>`,
    provider: () => `<aside class="wf-sidebar">
      <img class="logo" src="${LOGO}" alt="Metis">
      <div class="switch"><div><small>Provider console</small><b>Metis operations</b></div><span class="muted">▾</span></div>
      <div class="nav-sec">Operations</div>
      ${item('provider-tenants', '▦', 'Tenants')}
      ${item('provider-plans', '◔', 'Plans & limits')}
      ${item('provider-templates', '⧉', 'Global templates')}
      ${item('provider-support', '⚿', 'Support access')}
      ${item('provider-health', '♥', 'Service health')}
    </aside>`
  };

  if (shell === 'none') {
    const wrap = h('<div class="wf-frame no-sidebar"></div>');
    main.parentNode.insertBefore(wrap, main); wrap.appendChild(main);
    body.insertBefore(strip, body.firstChild);
    if (notes) body.appendChild(notes);
    return;
  }

  const topbar = h(`<header class="wf-topbar"><div class="crumbs">${(d.crumbs || '').split(' / ').map((c, i, a) => i === a.length - 1 ? `<b>${c}</b>` : c).join(' / ')}</div>
    <div class="gsearch">Search projects, WBS items, people (/)</div>
    <span class="btn secondary sm">+ New</span><span class="help" title="Help and glossary">?</span><span class="bell">🔔<i>3</i></span><span class="av lg">${d.user || 'NR'}</span></header>`);

  // Project header values; defaults describe the POC demo project (Meridian CGI Campaign).
  const P = {
    client: d.client || 'Northwind Furniture Co.', pm: d.pm || 'Nadia R.',
    stage: d.stage || 'Production · stage 3 of 6', rag: d.rag || 'a', ragLabel: d.ragLabel || 'At risk',
    framework: d.framework || 'Creative Production v1.2', baseline: d.baseline || 'Baseline v1 · 25 Jun 2026'
  };
  const TABS = [['overview', 'Overview'], ['charter', 'Charter'], ['wbs', 'WBS'], ['plan', 'Plan'], ['governance', 'Governance'], ['focus', 'Focus']];
  const projhead = d.project ? h(`<section class="wf-projhead">
      <div class="top"><div>
        <h1>${d.project}</h1>
        <div class="meta"><span>${P.client}</span><span>·</span><span>PM ${P.pm}</span><span>·</span>
          <span class="chip running">${P.stage}</span><span class="rag ${P.rag}">${P.ragLabel}</span>
          <span class="tag">${P.framework}</span><span class="tag">${P.baseline}</span></div>
      </div>
      <div class="actions"><span class="btn secondary sm">Share</span><span class="btn primary sm">Raise change request</span></div></div>
      <nav class="wf-tabs">${TABS.map(([id, l]) => `<a class="${d.tab === id ? 'active' : ''}">${l}</a>`).join('')}<span class="save ${d.save || ''}">${d.saveLabel || 'All changes saved · 09:41'}</span></nav>
    </section>`) : null;

  const frame = h('<div class="wf-frame"></div>');
  const right = h('<div class="wf-main"></div>');
  frame.appendChild(h(sidebars[shell]()));
  right.appendChild(topbar);
  if (projhead) right.appendChild(projhead);
  main.parentNode.insertBefore(frame, main);
  main.classList.add('wf-page');
  right.appendChild(main);
  frame.appendChild(right);
  body.insertBefore(strip, body.firstChild);
  if (notes) body.appendChild(notes);
})();
