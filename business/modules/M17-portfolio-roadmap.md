---
title: M17 Portfolio Roadmap
summary: The 12 to 24 month roadmap of projects, MVPs, milestones, gates and cross-project dependencies, for product directors and program reviews.
component: all
type: module
status: current
ids: [RMP-01, RMP-02, RMP-03, RMP-04]
---

# M17 Portfolio Roadmap

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The roadmap puts the portfolio on one time axis. It shows projects, MVPs and major milestones over 12 to 24 months, with quarter and month zoom and filtering (RMP-01). The BRD lists the roadmap among the key views of the Product Director ([BRD section 6](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)), and the bi-weekly Product / Program Review covers the roadmap, the MVPs, the dependencies and the resources, with an updated roadmap and decisions as the platform's output ([BRD section 7.8](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)). In the Product Director portfolio review of [BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys), reading the roadmap and the delivery of the MVPs is the second step, after filtering the portfolio and before looking for capacity conflicts and dependencies.

Three overlays build on the roadmap. The dependency overlay (RMP-02, priority P0) draws the dependencies between projects on the roadmap and makes their conflicts easy to see. A conflict is only flagged: the BRD rules that a dependency is a constraint that flags a conflict and that the system never moves dates automatically (BR-23), and that a conflict is flagged only when both compared dates exist (BR-40). The strategic theme overlay (RMP-03, P1) groups the roadmap by strategic objective and investment theme, and every committed project maps to an objective or is explicitly exempt, the rule of BR-02. The lifecycle overlay (RMP-04, P1) adds stages, gate dates and governance milestones, and gate dates appear for every project with a published framework.

The BRD gives the module one wireframe, screen 17, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). It shows an eighteen-month window with projects, MVP and milestone markers and gates, and a panel for the dependency conflicts. It labels the grouping by strategic theme and the lifecycle stage overlay "Planned V2". These are RMP-03 and RMP-04, the two P1 requirements of the module, and the grouping by strategic theme needs the strategy model of [module M20](M20-strategy-prioritization-and-scenarios.md).

The module is priority P0, and its P0 requirements, RMP-01 and RMP-02, belong to Release 1. The BRD builds them in the portfolio workstream and integrates them at milestone 1B with the cockpit, the registry and capacity. Its acceptance checklist asks that the roadmap displays projects, MVPs and milestones, and its pilot success criteria ask that the roadmap shows projects, MVPs and key dependencies.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used.

The build's navigation does name this module's screen. Roadmap, in the Portfolio group of the sidebar, links to `/w/[workspaceId]/roadmap`, the route of screen 17. At narrower widths the same link sits in the icon rail of a tablet, or in the drawer that the menu button opens.

The link opens the shared page for a screen that is not built. It shows, in the English interface, the title Roadmap, the sentence "Not built in the first batch.", "Screen 17", the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): an MVP screen that is not built already has its final route and a generic page.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Do the links that lead from a portfolio view down to a project keep the view's filter, sort and time period, so that the way back returns to the same filtered view? The first review called the drill-downs from the cockpit and from the registry good, and asked that the roadmap, capacity and risk views follow the same deep-link contract, with a "Back to filtered portfolio" action that keeps the filter, sort and time period ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 509 of the original). The second review asked to keep the filter and the context sticky between the views that the Product Director walks through, from the registry to the scenario ([Round 2 review](../../history/reviews/metis-review-vong-2.md), line 413 of the original). The third review asked to preserve the filter and the context when going back, and for a filter that persists across views ([Round 3 review](../../history/reviews/metis-review-vong-3.md), lines 951 and 952 of the original). No requirement of the BRD says it and no decision record settles it.

## Sources

- [BRD v4.5, module M17](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m17-portfolio-roadmap-rmp): the requirements and the wireframe list, lines 29 to 39 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md); the business rules BR-02 (line 196), BR-23 (line 217) and BR-40 (line 234) of the same part; the catalogue row, line 22 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): the Product Director portfolio review, line 509 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the persona table, line 360, and the governance cadence, line 499, of the same part.
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): the phase overview, line 8, the portfolio workstream, line 22, and milestone 1B, line 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md); the pilot success criterion, line 111; the acceptance checklist, line 230 of the same part.
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screen 17, line 364) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 17, lines 1257 to 1315).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the path from the portfolio down to a project, line 509 of the original. [Round 2 review](../../history/reviews/metis-review-vong-2.md): the walk of the Product Director journey, line 413 of the original. [Round 3 review](../../history/reviews/metis-review-vong-3.md): the journey walkthrough, lines 951 and 952 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table row for Roadmap, line 265.
- The decision record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link or labelled text), `src/shell/Shell.tsx` (which of the sidebar, the rail and the drawer shows at each width), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx`, `src/shell/NotBuilt.tsx`, `src/shell/model.page.ts` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
