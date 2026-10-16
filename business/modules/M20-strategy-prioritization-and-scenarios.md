---
title: M20 Strategy, Prioritization and Scenario Planning
summary: The strategy model, the portfolio score and what-if scenarios for budget and capacity, planned for V2, for executives and product directors.
component: all
type: module
status: current
ids: [STR-01, STR-02, STR-03, STR-04, STR-05]
---

# M20 Strategy, Prioritization and Scenario Planning

Status in the app: not built yet, and planned for V2. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

This module ties the portfolio to the company's strategy and lets executives test a decision before they take it. All five of its requirements are priority P1. The golden thread of [BRD section 7.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#72-golden-thread) keeps a traceable line from strategic objective to portfolio, project, MVP or deliverable, investment, resource, delivery and KPI or benefit. STR-01, the strategy model, holds the first links: strategic pillars, objectives, KPIs and targets, linked to portfolios and projects, so that every committed project traces to an objective or to an approved exemption (BR-02). The BRD assumes a split in decision D-25, until the decision owner confirms or changes it: the first release uses a simple list of objectives that the workspace manages and the charter links to (CHR-15), and the full strategy model arrives in V2 ([Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log), C-17).

The other four requirements evaluate and compare. STR-02 scores initiatives on strategic alignment, customer value, financial value, risk, urgency and feasibility, and the score must be transparent, weighted and auditable. STR-03 models budget reductions or increases and shows the impact on projects, resources and value. STR-04 simulates capacity changes and identifies the projects that would be delayed or accelerated, with a traceable impact chain. STR-05 evaluates projects by lifecycle stage and governance readiness, which become scoring inputs. Scenario results must not alter the approved baseline (BR-11), and portfolio recommendations stay advisory until an authorized executive approves the decision (BR-10).

In the persona table of the BRD ([section 6](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)), the CEO or ExCo has scenarios among the key views and the Business Owner or Sponsor has strategy. In the Product Director portfolio review of [BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys), the project score and the expected value are reviewed after the roadmap and capacity, a scenario is created if trade-offs are required, and the recommendation is submitted to governance. The decision lifecycle of [BRD section 7.7](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#77-decision-lifecycle) lists a strategic score, dependencies and scenario impact among the evidence for delaying or accelerating a project.

The BRD gives the module one wireframe, screen 21, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). It opens with the banner "Planned for V2", runs a scenario on a copy of the portfolio, and applies a result only as a proposal for an authorized executive, so the approved baseline never changes from the screen. The strategy model is also what the roadmap's strategic theme overlay (RMP-03, [module M17](M17-portfolio-roadmap.md)) needs, which is why the roadmap wireframe labels that overlay "Planned V2".

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used.

The build's navigation labels the module as planned. Scenarios, in the Portfolio group of the sidebar, is plain text with the tag "Planned V2". It is not a link and it has no page, because a destination of a later release has no route: the route table of the app has no entry for it, and a comment in the same file names Scenarios among the sidebar items without a page. The icon rail of a tablet holds links only, so there the item shows only in the drawer that the menu button opens.

The label comes from the shell data. The mock data of the development build marks the item V2, and the contract of the shell data lets the server choose the label (see [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md)). The rule is the second rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a destination of a later release is text with a "Planned V2" or "Planned V3" label, not clickable and not styled as a disabled button.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

None recorded.

## Sources

- [BRD v4.5, module M20](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m20-strategy-prioritization--scenario-planning-str): the requirements and the wireframe list, lines 67 to 78 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md); the business rules BR-02 (line 196), BR-10 (line 204) and BR-11 (line 205) of the same part; the catalogue row, line 25 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); CHR-15, line 244 of the same part 02.
- [BRD v4.5, golden thread](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#72-golden-thread): lines 418 to 420 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the decision lifecycle, lines 482 to 490; the personas CEO / ExCo (line 359) and Business Owner / Sponsor (line 369); the Product Director portfolio review, line 509.
- [BRD v4.5, phase overview](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#181-phase-overview): V2 includes the strategy model, scoring and prioritization, and scenario planning, line 9 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md); the decision register entry D-25, line 166 of the same part.
- [BRD v4.5, Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log): C-17, line 141 of [BRD part 05, appendices](../requirements/source/parts/05-appendices.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screen 21, line 445) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 21, lines 1610 to 1675; the roadmap overlay note, line 1315).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination of a later release, lines 244 to 248 of the original, and the route table row for Investment, Scenarios, SteerCo and AI copilot, line 270.
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, and the comment on the items without a page), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link or labelled text), `src/shell/Shell.tsx` (which of the sidebar, the rail and the drawer shows at each width), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
