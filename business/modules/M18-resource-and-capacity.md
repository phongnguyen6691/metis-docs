---
title: M18 Resource and Capacity
summary: Capacity, demand, utilization and bottlenecks by person, department and capability, fed by capacity and allocation records, for resource managers, project managers and product directors.
component: all
type: module
status: current
ids: [RES-01, RES-02, RES-03, RES-04, RES-05]
---

# M18 Resource and Capacity

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

This module serves the fourth core management question of [BRD section 4.3](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#43-core-management-questions), whether the company has enough people and capability for the work it has committed to. The capacity dashboard shows capacity, demand, utilization and the gap by person, department and capability (RES-01). Bottleneck detection finds the resources or capabilities above utilization thresholds, which are configurable by capability and organization (BR-07), and every overload links to the projects that cause the demand (RES-02).

Two kinds of records feed the figures (RES-03). Resource managers maintain capacity per person or capability and period. Project managers record project allocations, as FTE per person or capability per period. Demand is the sum of the active allocations of the period, and utilization is calculated from the active allocations and the capacity. In the MVP the records are kept in the platform or imported from a file, and the integration with HR systems follows in V2. The BRD gives the reason for this shape: the earlier proof of concept (POC) only counts open items per person in charge (OVW-03), a workload count, and planning in FTE needs capacity data and allocations ([Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log), C-15). It also lists inaccurate resource data as a high product risk, answered by allocation governance (RES-03) and the HR integration of V2 ([BRD section 20](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#20-product-risks--mitigations)).

Two more requirements are priority P1: RES-04 simulates the effect of adding or removing projects or of changing allocations, and scenarios never change the baseline until approved (BR-11); RES-05 shows demand and capability needs by lifecycle stage. The BRD gives the module one wireframe, screen 18, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). It shows capacity, demand, utilization and the gap by capability, a monthly heat strip and the projects behind each bottleneck; the allocation editor opens in a side drawer from "Edit allocations", beside an "Import capacity file" action, and the capacity scenario is labelled "Planned V2".

The module is priority P0, and its P0 requirements, RES-01 to RES-03, belong to Release 1. The BRD builds them in the portfolio workstream and integrates them at milestone 1B with the cockpit, the registry and the roadmap. Its acceptance checklist asks that the capacity dashboard shows demand versus capacity and bottlenecks, and its pilot success criteria ask that resource bottlenecks can be identified by project and capability. The onboarding addendum treats capacity as deeper data that follows its first 30 minutes of setup, split among the right owners (module M23).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used.

The build's navigation does name this module's screen. Capacity, in the Portfolio group of the sidebar, links to `/w/[workspaceId]/capacity`, the route of screen 18. At narrower widths the same link sits in the icon rail of a tablet, or in the drawer that the menu button opens.

The link opens the shared page for a screen that is not built. It shows, in the English interface, the title Capacity, the sentence "Not built in the first batch.", "Screen 18", the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): an MVP screen that is not built already has its final route and a generic page.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Where will pilot capacity and actuals data come from (manual entry, file import, or an HR or finance export), and who owns it? The BRD says it matters for capacity (RES-03), for budget (CHR-13) and for data freshness ([BRD section 12.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#125-metric-versions-freshness-and-snapshots)), and records no answer ([BRD v4.5, open questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions), Q-13, line 191 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md)).
- Do the links that lead from a portfolio view down to a project keep the view's filter, sort and time period, so that the way back returns to the same filtered view? The first review called the drill-downs from the cockpit and from the registry good, and asked that the roadmap, capacity and risk views follow the same deep-link contract, with a "Back to filtered portfolio" action that keeps the filter, sort and time period ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 509 of the original). The second review asked to keep the filter and the context sticky between the views that the Product Director walks through, from the registry to the scenario ([Round 2 review](../../history/reviews/metis-review-vong-2.md), line 413 of the original). The third review asked to preserve the filter and the context when going back, and for a filter that persists across views ([Round 3 review](../../history/reviews/metis-review-vong-3.md), lines 951 and 952 of the original). No requirement of the BRD says it and no decision record settles it.

## Sources

- [BRD v4.5, module M18](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m18-resource--capacity-res): the purpose, the requirements and the wireframe list, lines 40 to 53 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md); the business rules BR-07 (line 201) and BR-11 (line 205); the rule on data that will later come from ERP or HR, line 372; the catalogue row, line 23 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md).
- [BRD v4.5, core management questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#43-core-management-questions): question 4, line 262 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the capacity row of the table that compares the POC with the BRD (section 1.3), line 97; the persona HR / Resource Manager, line 368.
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): the phase overview, line 8, the portfolio workstream, line 22, and milestone 1B, line 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md); the pilot success criterion, line 108; the open question Q-13, line 191; the product risk on resource data, line 205; the acceptance checklist, line 231 of the same part.
- [BRD v4.5, Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log): C-15, line 139 of [BRD part 05, appendices](../requirements/source/parts/05-appendices.md).
- [Onboarding addendum v1.1, goal and success measure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#41-goal-and-success-measure): deeper data after the first 30 minutes, line 108 of [Onboarding addendum, front matter](../requirements/source/addendum-onboarding/parts/01-front.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screen 18, line 384) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 18, lines 1317 to 1426).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the path from the portfolio down to a project, line 509 of the original. [Round 2 review](../../history/reviews/metis-review-vong-2.md): the walk of the Product Director journey, line 413 of the original. [Round 3 review](../../history/reviews/metis-review-vong-3.md): the journey walkthrough, lines 951 and 952 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table row for Capacity, line 265.
- The decision record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/mocks/fixtures/shell.ts` (the mock navigation), `src/shell/model.ts` (how a navigation entry becomes a link or labelled text), `src/shell/Shell.tsx` (which of the sidebar, the rail and the drawer shows at each width), `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx`, `src/shell/NotBuilt.tsx`, `src/shell/model.page.ts` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
