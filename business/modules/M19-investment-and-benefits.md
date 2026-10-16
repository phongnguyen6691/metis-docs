---
title: M19 Investment and Benefits
summary: Portfolio investment, benefits, value at risk and funding checkpoints, planned for V2, for finance, sponsors and executives.
component: all
type: module
status: current
ids: [INV-01, INV-02, INV-03, INV-04]
---

# M19 Investment and Benefits

Status in the app: not built yet, and planned for V2. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

This module tracks what the portfolio invests and what it is meant to return. The BRD splits the subject in two. In the MVP, the project-level budget, actual and forecast are P0 in the charter (CHR-13) and roll up as simple sums in the executive cockpit. This module adds portfolio investment management, and the BRD puts it in V2: the first release keeps the project budget and a simple roll-up ([Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log), C-16).

Four requirements make up the module, all priority P1. INV-01 tracks approved budget, actual, forecast, CapEx and OpEx, and the variance by project and portfolio; the portfolio totals must reconcile with the project-level records. INV-02 records expected and realized benefits linked to KPIs, each with a benefit owner and a measurement date. INV-03 shows the expected value at risk for delayed, over-budget or low-health initiatives, with a method that is documented and configurable. INV-04 makes configured stage gates funding checkpoints, so that the release of funding is recorded against the gate decision. Until benefits are captured, the value tiles of the cockpit show "not tracked" (EXE-01).

In the persona table of the BRD ([section 6](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)), Finance has investment, actuals, forecast and variance as key views, and the Business Owner or Sponsor has strategy, KPIs, benefits and project health. The monthly Portfolio Review looks at investment, health, benefits and strategic alignment, and its output is a portfolio scorecard ([BRD section 7.8](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)).

The BRD gives the module one wireframe, screen 20, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). It opens with the banner "Planned for V2" and says that in the MVP the project budgets roll up as simple sums in the cockpit, while the screen adds CapEx and OpEx, benefits and value at risk. The MVP acceptance checklist asks only that investment fields roll up to portfolio level.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used.

The build's navigation labels the module as planned. Investment, in the Portfolio group of the sidebar, is plain text with the tag "Planned V2". It is not a link and it has no page, because a destination of a later release has no route: the route table of the app has no entry for it, and a comment in the same file names Investment among the sidebar items without a page. The icon rail of a tablet holds links only, so there the item shows only in the drawer that the menu button opens.

The label comes from the shell data. The mock data of the development build marks the item V2, and the contract of the shell data lets the server choose the label (see [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md)). The rule is the second rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a destination of a later release is text with a "Planned V2" or "Planned V3" label, not clickable and not styled as a disabled button.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

None recorded.

## Sources

- [BRD v4.5, module M19](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m19-investment--benefits-inv): the purpose, the requirements and the wireframe list, lines 54 to 66 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md); the value tiles rule of EXE-01, line 12; the catalogue row, line 24 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md).
- [BRD v4.5, stakeholders and personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas): the personas Finance (line 367) and Business Owner / Sponsor (line 369) of [BRD part 01, front matter](../requirements/source/parts/01-front.md). [BRD v4.5, governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence): the monthly Portfolio Review, line 500 of the same part.
- [BRD v4.5, phase overview](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#181-phase-overview): V2 includes investment and benefits, line 9, and the acceptance checklist, line 235 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md).
- [BRD v4.5, Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log): C-16, line 140 of [BRD part 05, appendices](../requirements/source/parts/05-appendices.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screen 20, line 426) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 20, lines 1520 to 1608).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination of a later release, lines 244 to 248 of the original, and the route table row for Investment, Scenarios, SteerCo and AI copilot, line 270.
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, and the comment on the items without a page), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link or labelled text), `src/shell/Shell.tsx` (which of the sidebar, the rail and the drawer shows at each width), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
