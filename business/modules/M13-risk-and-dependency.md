---
title: M13 Risk and Dependency
summary: Lets project managers and portfolio leads record risks and cross-project dependencies, and flags projects declared Green whose risks say otherwise.
component: all
type: module
status: current
ids: [RSK-01, RSK-02, RSK-03, RSK-04, RSK-05]
---

# M13 Risk and Dependency

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Risk and dependency answer the sixth core management question of the BRD: what is at risk or dependent on something else ([section 4.3](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#43-core-management-questions)). [Module M13 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m13-risk--dependency-rsk) records the risks and the dependencies of the work and rolls them up. Each project keeps a risk register: a risk has a description, a probability, an impact, a score and a severity (one scoring method per workspace), an owner, a mitigation plan, a due date and a status. The register links to the WBS items that carry a Risk Level or the Risk Related label and to section VII of the project charter, and a work item with a High or Critical risk level but no register entry is flagged (RSK-01).

At portfolio level the module groups the project risks of a workspace, so that a systemic risk, one that hits several projects, can be seen across them (RSK-02). The dependency map shows the upstream and downstream dependencies between projects, MVPs and milestones, and a delay in one shows the downstream items it affects (RSK-03). A dependency is a constraint that flags a conflict; the system never moves a date by itself (BR-23, WBS-13, WBS-14).

Two requirements tie risk to health. A project declared Green while the risk rules compute Amber or Red is flagged in the executive attention queue until someone records an override with a rationale (RSK-04, BR-08). And gate readiness enters the health and the escalation of a stage, so that a gate overdue beyond its SLA lowers the stage health (RSK-05).

The module is for project managers, who keep the risk register, for product directors and delivery leads, who look for dependencies across projects, and for executives, who see the projects that look greener than their risks allow. RSK-05 is priority P1, which the BRD reads as V2; the other four requirements are P0, part of Release 1. The BRD builds the project risk register (RSK-01) for milestone 1A, and the portfolio risk, the dependency map and the green-but-risky flag (RSK-02 to RSK-04) for milestone 1B ([section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). Its wireframes are screens 19 (Risk and dependency control tower) and 16 (Portfolio and project registry, which also compares declared and computed health). It takes part in the journeys CEO weekly review (step 4, green-but-risky projects) and Product Director portfolio review (step 3, capacity conflicts and dependencies) ([section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used: there is no risk register, no dependency map and no green-but-risky flag.

The build's navigation does name both of this module's screens, 19 and 16. Risk & dependencies, in the Portfolio group of the sidebar, links to `/w/[workspaceId]/risk`, the route of screen 19, which is phase MVP in the wireframe manifest. At narrower widths the same link sits in the icon rail of a tablet, or in the drawer that the menu button opens. The registry (screen 16) has its own link, described with [M16 Portfolio and Project Registry](M16-portfolio-and-project-registry.md).

The link opens the shared page for a screen that is not built. It shows, in the English interface, the title Risk & dependencies, the sentence "Not built in the first batch.", "Screen 19", the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): an MVP screen that is not built already has its final route and a generic page.

Screen 24 touches the same ground without being this module. Its High risk tile and its High & critical risk items list show the work items of high or critical risk level, from the overview data the server sends, and its Health card sets the health declared by the project manager beside a computed level. They belong to the project overview (module M10): the tile and the list link to the WBS routes, which are not built either, the Health card links nowhere, and the build reads no risk register.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Do the links that lead from a portfolio view down to a project keep the view's filter, sort and time period, so that the way back returns to the same filtered view? The first review called the drill-downs from the cockpit and from the registry good, and asked that the roadmap, capacity and risk views follow the same deep-link contract, with a "Back to filtered portfolio" action that keeps the filter, sort and time period ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 509 of the original). The second review asked to keep the filter and the context sticky between the views that the Product Director walks through, from the registry to the scenario ([Round 2 review](../../history/reviews/metis-review-vong-2.md), line 413 of the original). The third review asked to preserve the filter and the context when going back, and for a filter that persists across views ([Round 3 review](../../history/reviews/metis-review-vong-3.md), lines 951 and 952 of the original). No requirement of the BRD says it and no decision record settles it. The same question stands with the cockpit, in [M15 Executive Portfolio Cockpit and Workspace Dashboard](M15-executive-cockpit-and-workspace-dashboard.md).

## Sources

- [BRD v4.5, module M13](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m13-risk--dependency-rsk): the requirements and the wireframe list, lines 391 to 401 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 18; WBS-13 and WBS-14 (lines 270 and 271).
- [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-08 and BR-23 (lines 202 and 217); the Dependency conflict definition of section 12.1 (line 131); the portfolio KPIs on risk (lines 159 and 160); the role of the Project Manager (line 250); the entities Dependency and Risk (lines 285 and 293).
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): milestones 1A and 1B, lines 30 and 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): the CEO weekly review and the Product Director portfolio review, lines 507 and 509 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the core management question 6, line 264; the principle "warn, do not auto-reschedule", line 279; the personas, lines 360 and 370; the priority key, line 55.
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screens 16 and 19, lines 343 and 404) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 16, lines 1201 to 1255; screen 19, lines 1428 to 1518). The screens themselves: [16 Portfolio and project registry](../../design/wireframes/screens/16-portfolio-registry.html) and [19 Risk and dependency control tower](../../design/wireframes/screens/19-risk-dependency.html).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the path from the portfolio down to a project, lines 507 to 509 of the original. [Round 2 review](../../history/reviews/metis-review-vong-2.md): the walk of the Product Director journey, line 413 of the original. [Round 3 review](../../history/reviews/metis-review-vong-3.md): the journey walkthrough, lines 951 and 952 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table row for Risk & dependencies, line 265.
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `README.md` (`pnpm web` opens the build with mock data), `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx`, `src/shell/NotBuilt.tsx`, `src/shell/model.page.ts` and `src/shell/strings/en.ts` (the English labels), `src/screens/24-project-overview/contract.yaml` and `src/screens/24-project-overview/model.ts` (the tile, the list and the Health card of screen 24).
