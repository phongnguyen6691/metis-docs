---
title: M16 Portfolio and Project Registry
summary: The searchable list of all initiatives and projects, with one master record per project and its place in the portfolio and program hierarchy, for the PMO and product directors.
component: all
type: module
status: current
ids: [REG-01, REG-02, REG-03]
---

# M16 Portfolio and Project Registry

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The registry is the list of all initiatives and projects. A PMO lead or a product director opens it to find one project, or to narrow the portfolio to the projects that matter to them, before moving on to [the roadmap](M17-portfolio-roadmap.md), [the capacity view](M18-resource-and-capacity.md) or a single project. The BRD lists the registry among the key views of the PMO / Portfolio Manager ([BRD section 6](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)), and the first step of the Product Director portfolio review in [BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys) is to filter the portfolio by strategic objective or product, which the registry's filters allow.

Three requirements make up the module, all priority P0. REG-01 gives every project one master record: a unique project ID, name, description, workspace, portfolio, program, owner, sponsor, account or business unit, status and the version of its lifecycle framework. A project cannot be duplicated, and the required fields are validated. REG-02 lets people search by project ID or name and filter by workspace, portfolio, program, owner, health, lifecycle stage, strategic objective, business unit and status, with results that update without a page reload. REG-03 groups projects under portfolios and under programs or products, and each project has one primary portfolio and optional secondary tags. Where the earlier proof of concept (POC) said Space and Folder, the BRD says Portfolio and Program, a choice it assumes in decision D-04 until the decision owner confirms or changes it.

The BRD gives the module two wireframes, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). Screen 16 is the registry list: it shows each project's linked strategic objective or approved exemption (CHR-15, BR-02), and an expanded row compares the declared health with the computed one (RSK-04). Screen 37 is the new project dialog that opens over the registry, where the master record of REG-01 is created and checked for duplicates (CHR-17).

The BRD plans the registry for Release 1: the portfolio workstream builds it and it is integrated at milestone 1B with the cockpit, the roadmap and capacity. Its acceptance checklist asks that the registry supports search, filter and drill-down, and its pilot success criteria ask that every in-scope project has a master record. The onboarding addendum depends on the registry too: its activation event needs at least one real running project adopted into the registry, and the draft workspace it shows the executive includes the registry.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used.

The build's navigation does name this module's screens, and each link opens a page that says the screen is not built:

- Registry, in the Portfolio group of the sidebar, links to `/w/[workspaceId]/registry`, the route of screen 16. At narrower widths the same link sits in the icon rail of a tablet, or in the drawer that the menu button opens.
- The + New button of the top bar, on desktop and tablet widths, links to `/w/[workspaceId]/projects/new`, the route of screen 37.

That shared page shows, in the English interface, the name of the destination (Registry, or New project), the sentence "Not built in the first batch.", the screen number, the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): an MVP screen that is not built already has its final route and a generic page.

The sidebar also shows the projects of the workspace as a tree of portfolios, programs and projects, from the shell data (see [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md)). Only a project is a link, and it opens that project's overview. The tree is navigation: it offers none of the registry's search, filters, master record or tags.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Do the links that lead from a portfolio view down to a project keep the view's filter, sort and time period, so that the way back returns to the same filtered view? The first review called the drill-downs from the cockpit and from the registry good, and asked that the roadmap, capacity and risk views follow the same deep-link contract, with a "Back to filtered portfolio" action that keeps the filter, sort and time period ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 509 of the original). The second review asked to keep the filter and the context sticky between the views that the Product Director walks through, from the registry to the scenario ([Round 2 review](../../history/reviews/metis-review-vong-2.md), line 413 of the original). The third review asked to preserve the filter and the context when going back, and for a filter that persists across views ([Round 3 review](../../history/reviews/metis-review-vong-3.md), lines 951 and 952 of the original). No requirement of the BRD says it and no decision record settles it.

## Sources

- [BRD v4.5, module M16](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m16-portfolio--project-registry-reg): the requirements and the wireframe list, lines 19 to 28 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md); the catalogue row, line 21 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): the Product Director portfolio review, line 509 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the persona table, line 361 of the same part; the Portfolio and Program levels, lines 389 to 391.
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): the phase overview, line 8, the portfolio workstream, line 22, and milestone 1B, line 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md); the pilot success criterion, line 105; decision D-04, line 145; the acceptance checklist, line 222 of the same part.
- [Onboarding addendum v1.1, goal and success measure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#41-goal-and-success-measure): the activation event, line 104 of [Onboarding addendum, front matter](../requirements/source/addendum-onboarding/parts/01-front.md); the draft that includes the registry, line 28 of [Onboarding addendum, design](../requirements/source/addendum-onboarding/parts/03-design.md); the registry integrating at milestone 1B, line 90 of [Onboarding addendum, changes](../requirements/source/addendum-onboarding/parts/04-changes.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screens 16 and 37, lines 343 and 845) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 16, lines 1201 to 1255; screen 37, lines 2786 to 2848).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the path from the portfolio down to a project, line 509 of the original. [Round 2 review](../../history/reviews/metis-review-vong-2.md): the walk of the Product Director journey, line 413 of the original. [Round 3 review](../../history/reviews/metis-review-vong-3.md): the journey walkthrough, lines 951 and 952 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table rows for Registry (line 265) and New (line 268).
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link or labelled text), `src/shell/Shell.tsx` (which of the sidebar, the rail and the drawer shows at each width), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx`, `src/shell/TopBar.tsx`, `src/shell/NotBuilt.tsx`, `src/shell/model.page.ts` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
