---
title: M07 WBS Master
summary: The work breakdown structure that holds all project work in one place, which project managers and delivery teams edit in table, tree and blueprint views.
component: all
type: module
status: current
ids: [WBS-01, WBS-02, WBS-03, WBS-04, WBS-05, WBS-06, WBS-07, WBS-08, WBS-09, WBS-10, WBS-11, WBS-12, WBS-13, WBS-14, WBS-15, WBS-16, WBS-17, WBS-18, WBS-19, WBS-20]
---

# M07 WBS Master

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The WBS Master is the heart of project execution: one data set of work items, shown in three views (Table, Tree Diagram and Blueprint), edited through one item form, with dependencies that warn about a conflict and never move a date ([BRD v4.5, M07](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m07-wbs-master-wbs)). It is the single source of truth for project work. The charter's deliverables and client commitments, the Overview, the Timeline, the Board, Focus and the reports are views derived from it, and none of them keeps its own copy of a WBS field (WBS-01, BR-22).

Items sit in a hierarchy with codes such as 1.0, 1.1 and 1.1.1, up to five levels deep (WBS-02). The system generates the codes and renumbers them when an item moves, and a permanent internal ID keeps links, dependencies and history intact (WBS-03). Category nodes exist only at level 1. They group work by project-management control area, roll up the dates, the status and the progress of their children, and are never counted as work items or in a KPI (WBS-18, BR-24).

The Table view has filters for category, phase, type, status and person in charge that apply at once, bulk actions after a multi-select, inline editing, and column presets with personal and shared saved views (WBS-04 to WBS-06, WBS-20). Drag-and-drop restructuring (WBS-07) and the Free Move layout of the tree (WBS-09) are P1. The Tree Diagram draws the hierarchy with dependency arrows in vertical and horizontal layouts (WBS-08), and the Blueprint view shows the canvases that the Deliverable Builder saved (WBS-10; see [M08](M08-deliverable-builder-and-process-frameworks.md)).

The item form holds the fields from code, parent and name to dates, effort, status, priority, risk level and dependencies (WBS-11). The person in charge, the reviewer and the approver are chosen from workspace members, and "Client" can stand for an external party on Input Required items (WBS-12). A dependency links two items of the same project as finish-to-start, start-to-start, finish-to-finish or start-to-finish. A violation is flagged on both items, only when both compared dates exist, and no date is ever moved automatically (WBS-13, BR-23, BR-40). The module also covers dependencies across the projects of a workspace (WBS-14), duration in calendar days or in working days (WBS-15), activity and comments with mentions (WBS-16), attachments (WBS-17), and duplicate and delete (WBS-19).

Project managers and project owners create and edit the WBS, and team members update the items assigned to them ([BRD section 14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions)). All 20 requirements are P0 except WBS-07 and WBS-09. [BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01) plans the module in milestone 1A, except WBS-10 and WBS-14, which come in milestone 1B with the Builder; the WBS service, with the metric engine of [BRD section 12](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#121-project-metric-definitions), is the first thing the project execution stream hands to the other streams. The decision register assumes system-generated codes with a permanent internal ID (D-05), a level derived from position with Category as its own node kind and up to five levels (D-06), and a workspace setting for the duration basis, calendar days by default (D-07). The register assumes each recommendation until the decision owner confirms or changes it ([BRD section 19.1](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register)), so these are assumptions and not settled decisions.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module [M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used: nobody can create, edit, filter or view a work item, a dependency or a saved view.

The build's navigation and screen 24 name two of this module's three WBS screens (26, 27 and 28). Each link opens the shared page for a screen that is not built. That page shows, in the English interface, the title of the link, the sentence "Not built in the first batch.", the screen number, the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a screen of the MVP that is not built already has its final route and a generic page.

| Screen | Where the app links to it | Path | Phase | What opens |
|---|---|---|---|---|
| 26, WBS Master: table view | The WBS tab of the project header. On screen 24: the metric tiles, the segments of the status bar (its legend lines where touch targets apply), the category rows, the person rows, the View in WBS button and the + N more lines of the upcoming and risk lists | `/w/[workspaceId]/projects/[projectId]/wbs` | MVP | The not-built page, which prints the filter the link carried |
| 28, WBS item form and activity | The rows of the upcoming, overdue and risk lists of screen 24 | `/w/[workspaceId]/projects/[projectId]/wbs/[itemId]` | MVP | The not-built page |
| 27, WBS Master: tree diagram and blueprint | nothing links to it | none | MVP | No route exists |

A filter travels in the address under the name of a WBS field of the BRD (`status`, `type`, `label`, `risk`, `category` or `pic`). The Blocked tile, for example, opens the first path with `status=blocked`, and the not-built page prints "status: blocked" under "Filters received".

The BRD also lists the roadmap (screen 17) and the risk and dependencies screen (screen 19) for this module, where dependencies across projects appear (WBS-14), the plan screens 30 and 31 ([M09](M09-project-plan-timeline-and-board.md)), the editor states (screen 42) and the client view (screen 45). The sidebar links to screens 17 and 19 and the project header links to screen 30, and they open the same shared page; screens 31, 42 and 45 have no route.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Which filter stands for items that are late against the baseline? WBS-05 offers category, phase, type, status and person in charge, and no such filter, while section 12 defines Delayed as a work item, not Done, whose current target date is later than its baseline target date. The Delayed tile of the overview drills down with `delayed=true`, a name the front end proposed and the back end will fix. This is a draft proposal, not decided by the owner: [`delayed=true` and `scope=mine` are provisional names](../../architecture/decisions/provisional-drill-parameters.md). Sources: [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md), lines 152 and 153 of the original; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 701 of the original; [BRD part 03](../requirements/source/parts/03-modules-c-rules.md), line 123.
- Should the upcoming list also filter by date and status? WBS-05 has no filter by date, section 12 defines upcoming milestones and gates as items that are not Done with a target date of today or later, and the overview's upcoming list carries the server's filter, which the mock data sets to the labels milestone and approval gate only. This is a question for the back end. Sources: [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 767 to 770 of the original; [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md), lines 9 to 13 of the original; [BRD part 03](../requirements/source/parts/03-modules-c-rules.md), line 128.

## Sources

- [BRD v4.5, M07 WBS Master](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m07-wbs-master-wbs): the generated edition this page draws on.
- [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md): lines 250 to 284 (the module) and line 12 (its row in the catalogue).
- [BRD part 03, portfolio modules, metrics and business rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-22, BR-23, BR-24 and BR-40 (lines 216, 217, 218 and 234), the metric definitions of Delayed and Upcoming (lines 123 and 128) and the roles table (lines 250 and 257).
- [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md): the project execution stream and the milestone rows (lines 20, 30 and 31), D-05, D-06 and D-07 (lines 146 to 148) and the rule that the register assumes each recommendation (line 136).
- [Wireframe manifest](../../design/wireframes/manifest.json): the phase and the requirements of screens 17, 19, 26, 27, 28, 30, 31, 42 and 45.
- `ROUTES` and `SCREENS` in `src/core/routes.ts`, the not-built page in `src/shell/NotBuilt.tsx` and `src/shell/model.page.ts`, and the links of screen 24 in `src/screens/24-project-overview/contract.yaml`, `model.ts` and `model.lists.ts`, all in the `metis-app` repository: what the app links to today.
- [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): the rule that a screen not built opens a generic page, and the drill filter names.
- [The app never computes a metric or a drill filter](../../architecture/decisions/metrics-are-server-snapshots.md): the filter of the upcoming list.
- [`delayed=true` and `scope=mine` are provisional names](../../architecture/decisions/provisional-drill-parameters.md): the draft proposal named under open questions.
