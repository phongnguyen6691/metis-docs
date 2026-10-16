---
title: M21 Analytics and Executive Reporting
summary: SteerCo packs, weekly portfolio reports, drill-down and governance analytics for executives and the PMO, planned for V2.
component: all
type: module
status: current
ids: [ANL-01, ANL-02, ANL-03, ANL-04, ANL-05]
---

# M21 Analytics and Executive Reporting

Status in the app: not built yet, and planned for V2 (benchmarks for V3). This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Analytics and Executive Reporting is the reporting layer of the portfolio in the BRD ([module M21 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m21-analytics--executive-reporting-anl)). It turns the figures that the other portfolio modules hold into the packs, reports and breakdowns that leaders use in their reviews, so that weekly and SteerCo portfolio reporting needs less manual preparation, which is one of the BRD's business outcomes. It serves the CEO and ExCo, who take investment and strategic decisions, and the PMO or portfolio manager, who governs portfolio health and reporting. In the BRD's [governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence), the quarterly SteerCo or ExCo forum is held for investment allocation and strategic trade-offs.

The module has four outputs. The SteerCo pack is an executive portfolio review of health, investment, capacity, risks, decisions and changes, generated for a chosen period and portfolio (ANL-01). The weekly portfolio report lists what changed since the previous week and the exceptions that need action, and highlights only the material changes (ANL-02). Governance analytics show stage distribution, bottlenecks, gate failures, cycle time, gate throughput, rework and compliance by workspace, and can be filtered by workspace and framework version; they use the workspace governance KPIs of [BRD section 12.4](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#124-workspace-governance-kpis), and the BRD names them, with versioned templates and the global library, as its answer to configuration sprawl across workspaces (ANL-04). Cross-workspace benchmarks compare workspaces and framework versions where policy permits, and include only workspaces that opted in (ANL-05). Under all four, drill-down lets a reader move from a portfolio metric to the project and to the source record, so that every KPI has lineage to its data (ANL-03).

The same rules bind every figure. Each one follows the single set of metric definitions of BRD section 12 and can be drilled down to its records (BR-32). Each pack, report and PDF states the data as-of time and the metric version it used (BR-39), and a saved one is a snapshot that keeps those figures when the data changes ([BRD section 12.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#125-metric-versions-freshness-and-snapshots)). A report that spans workspaces respects record-level permissions (BR-20), and no record, report or export crosses a tenant (BR-33).

The BRD places the module after the first release. ANL-01 to ANL-04 are priority P1, which the BRD reads as V2, the release it describes as portfolio intelligence and investment decisions; ANL-05 is P2, which it reads as V3. The wireframe for the module, screen 22 (SteerCo report), notes that the MVP has project-level weekly status reports and that portfolio packs for SteerCo come with portfolio analytics.

## What users can do today

Nothing yet. The app has no screen of this module. The one screen of the BRD that it holds, the project overview (screen 24, module M10), runs on mock data in the development build, and no back end serves it ([Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md)).

The only trace of the module is a label. The navigation of the development build comes from mock data, and its Portfolio group lists SteerCo as plain text tagged Planned V2. The item cannot be pressed and opens nothing: the app shows a destination of a later release as text and never as a disabled control ([Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md)). The mock data gives it the tag V2, in line with the phase column of the wireframe manifest, where screen 22 is V2. The route table of the app has no route for this module. The label is in the sidebar, and in the drawer at narrower widths.

No pack, weekly portfolio report, governance analytics or benchmark exists. The portfolio pages that such outputs would draw on, such as the executive cockpit and the workspace dashboard, open a page that says they are not built.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Does Release 1 need an executive portfolio report, although this module is planned for V2? The MVP success criteria say that executives can produce a weekly or SteerCo portfolio review without manual spreadsheet consolidation, and the MVP acceptance checklist says that an executive report can be generated from the system, while the phase overview puts SteerCo and portfolio reporting in V2 and ANL-01 and ANL-02 are priority P1. The wireframe of screen 22 says only that the MVP has project-level weekly status reports. Which Release 1 feature meets these two MVP items, or whether part of this module moves into Release 1, is a question for the owner; the BRD records no answer. Sources: lines 9, 110 and 237 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md) ([phase overview](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#181-phase-overview), [MVP success criteria](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#185-mvp-success-criteria), [MVP acceptance checklist](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#21-mvp-acceptance-checklist)); line 1687 of the [wireframe digest](../../design/wireframes/wireframes-digest.md).

## Sources

- [BRD v4.5, module M21](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m21-analytics--executive-reporting-anl): the module and its five requirements are lines 79 to 89 of [part 3 of the BRD source](../requirements/source/parts/03-modules-c-rules.md); its row of the module catalogue is line 26 of [part 2](../requirements/source/parts/02-modules-a-b.md).
- [Part 3 of the BRD source](../requirements/source/parts/03-modules-c-rules.md): the workspace governance KPIs and the rules on metric versions and snapshots (lines 168 to 189), and the business rules BR-20, BR-32, BR-33 and BR-39 (lines 214, 226, 227 and 233).
- [Part 1 of the BRD source](../requirements/source/parts/01-front.md): the reading of priorities P1 as V2 and P2 as V3 (line 55), the business outcome on reporting (line 216), the personas (lines 359 to 361) and the governance cadence (lines 500 and 501).
- [Part 4 of the BRD source](../requirements/source/parts/04-roadmap-decisions.md): the scope of V2 and V3 (lines 9 and 10) and the risk of configuration sprawl across workspaces (line 210).
- Wireframes: screen 22 is phase V2 in [the wireframe manifest](../../design/wireframes/manifest.json), and its note and annotations are lines 1677 to 1755 of [the wireframe digest](../../design/wireframes/wireframes-digest.md).
- Decision records: [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the repository `metis-app`: `src/core/routes.ts` (the route table `ROUTES` at lines 3 to 26 and the screen table `SCREENS` at lines 45 to 68), `src/mocks/fixtures/shell.ts` (the mock navigation, lines 20 to 23), `src/shell/strings/en.ts` (labels and tags, lines 44 to 50), `src/shell/model.ts` (planned items become text with a tag, lines 81 to 106), `src/shell/Sidebar.tsx` (text rows, lines 75 to 94), `src/shell/Rail.tsx` (planned items live in the drawer, line 60) and `src/app/w/[workspaceId]/cockpit.tsx` (the not-built page).
