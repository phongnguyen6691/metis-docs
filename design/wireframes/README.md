---
title: Wireframes
summary: The 58 annotated wireframe screens of the BRD, how a screen is built, edited and rendered.
component: all
type: overview
status: current
ids: []
---

# Metis wireframes

Annotated wireframes for every target screen of BRD v4.5 and its onboarding addendum (`../../business/requirements/`); every MVP (P0) requirement of the BRD appears on at least one screen. Mid-fidelity: real layout, real copy and sample data, the brand tokens, no final visual polish.

## Open

- `index.html`: gallery of all screens, grouped by area.
- `screens/NN-name.html`: one page per screen. Open directly in a browser (works from `file://`).
- `png/NN-name.png`: rendered full-page images.
- `manifest.json`: machine-readable index (id, title, area, phase, requirement IDs, POC screenshot numbers, summary, files).
- `wireframes-digest.md`: the text and annotations of every screen in one file, for reviewers and AI tools that cannot read small text in the PNGs.

## How a screen file is built

| Part | Where | Purpose |
|---|---|---|
| `<meta name="wf:*">` | head | `id`, `title`, `area`, `phase` (MVP, V2, V3), `requirements` (BRD IDs), `poc` (POC screenshot numbers), `summary` |
| `<body data-*>` | body | Chrome drawn by `assets/shell.js`: `data-shell` app, admin, provider or none; `data-nav`; `data-workspace`; `data-tenant` (tenant shown in the app and admin sidebars, default Acme Holdings); `data-crumbs`; `data-project` and `data-tab` for project screens, plus optional `data-client`, `data-pm`, `data-stage`, `data-rag`, `data-rag-label`, `data-framework`, `data-baseline`, `data-save` and `data-save-label` (save state next to the tabs); `data-user` sets the signed-in user's initials (default NR) |
| `<main>` | body | The screen content only; sections carry `data-req="IDs"` |
| `<section class="wf-notes">` | end of body | Numbered annotations; each starts with the requirement IDs it explains and matches a `<span class="anno" data-n="N">` marker on the screen |

Components come from `assets/wireframe.css`; colours, type and spacing from `../brand/tokens.css` (the same tokens as the style guide in `../brand/`). Sample data is fictional and consistent across screens: tenant Acme Holdings with workspaces Creative Studio (the POC demo project Meridian CGI Campaign, corrected to the BRD metric definitions) and Digital Products (portfolio examples from BRD v2.0). The onboarding screens 46 to 57 follow a new client instead: Nova Energy, the tenant being created in 07-provider-tenants, set up by its COO Rosa Okafor on 5 Oct 2026 (the full sample set is in [the addendum plan](../../history/brd/addendum-onboarding/2026-10-03-onboarding-addendum-plan.md)).

## Edit

1. Change the HTML of the screen (keep the meta tags and annotations in step with the BRD requirement IDs).
2. `python3 tools/check.py` validates markup balance, required metadata, annotation numbering and the no em dash or en dash rule.
3. `cd tools && npm install && node render.mjs` renders every screen to `png/` with the locally installed Google Chrome (set `CHROME_PATH` if it lives elsewhere); pass file paths to render only some.
4. `node tools/build-index.mjs` rebuilds `manifest.json`, `index.html` and `wireframes-digest.md`. For a rebuild that changes no screen, run `WIREFRAMES_DATE=<the date in manifest.json> node tools/build-index.mjs`: without it the files get today's date, and the copy of `manifest.json` that `metis-app` pins no longer equals this one.
5. Rebuild the BRD (`../../business/requirements/source/build.py`) and, for screens 46 to 57, the onboarding addendum (`../../business/requirements/source/build.py addendum-onboarding`), so their wireframe references and figures follow; the BRD build fails if a screen cites an ID that is not in the BRD, if a module has no screen, or if a P0 requirement has no screen.

## Conventions

- One screen, one file. 01 to 35 are numbered in reading order by area (access and tenancy 01 to 08, workspace and governance 09 to 13, portfolio 14 to 23, project execution 24 to 35); 36 onward were added after the external review and are grouped by their area in the gallery, which also has a Personal and collaboration area. 46 to 57 come from the onboarding addendum; 46 to 54 form the Onboarding area of the gallery, 55 to 57 extend the access and tenancy screens 08, 04 and 07.
- Future capability uses `<span class="tag future">Planned V2</span>` (dashed outline, the words written in the HTML so screen readers and the digest read them), never the disabled look; save state uses `.save`; data freshness uses `.fresh` with `stale`, `partial` or `unknown`; `.kbd-focus` shows the keyboard focus ring in a static screen (selection uses the accent-soft fill, never the ring).
- Metrics follow BRD Section 12; status always shows colour, shape and words.
- V2 and V3 parts inside an MVP screen carry a V2 or V3 tag and reduced opacity.
- Actions made through MCP use the square "AI" avatar with "via MCP" and the token name; people are round avatars, external client users have a dashed outline.
