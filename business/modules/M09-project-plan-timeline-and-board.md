---
title: "M09 Project Plan: Timeline and Board"
summary: The time and status views of the WBS, a timeline and a kanban board that project managers and delivery teams use to follow and update work.
component: all
type: module
status: current
ids: [PLN-01, PLN-02, PLN-03, PLN-04, PLN-05]
---

# M09 Project Plan: Timeline and Board

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Project Plan gives the time and status views of the WBS ([BRD v4.5, M09](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m09-project-plan-timeline--board-pln)). It groups the Timeline, the Board, Changes and Reports in one plan area with a full-screen toggle, and switching between views keeps the project context (PLN-01). Only the Timeline and the Board belong to this module; the change register and the reports belong to [M11](M11-change-control-baseline-and-decision-log.md) and [M12](M12-journal-and-project-reporting.md). Both views are derived from the WBS and hold no copy of its data (BR-22; see [M07](M07-wbs-master.md)).

The Timeline is a point-in-time view of dated work items. Each card shows the date, the days relative to today, the code and name, a status dot and an OVERDUE tag when the item is past its target date and not Done. The view can be filtered, zoomed (100 percent by default), laid out horizontally or vertically, and set to equal spacing (PLN-02). Overlays of lifecycle stages, gate dates and governance milestones (PLN-03) and a bar-based Gantt with dependency lines (PLN-04) are P1.

The Board is a kanban board whose columns come from the workspace Status list: Not Started, In Progress, Waiting, Blocked and, per D-10, Done. Each column shows a count, and a card shows the code, name, labels, avatar of the person in charge, target date and priority. Dragging a card to another column changes its status and is recorded in the item's activity. A "Move to" menu on every card does the same from the keyboard or on touch and announces the new status to screen readers (BR-41). "+ Add Task" creates an item in a column, and an empty column shows a drop zone (PLN-05).

Project managers and project owners edit the plan, and team members update the items assigned to them ([BRD section 14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions)). Three of the five requirements are P0, and [BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01) plans the module in milestone 1A. A metric shown on the Timeline or the Board must equal the Overview's for the same date ([BRD section 18.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#185-mvp-success-criteria)). The decision register assumes a collapsible Done column limited to recently completed items, because the proof of concept's Board has none (D-10), and no project Gantt in the MVP, to be evaluated in V2 with the portfolio roadmap (D-11). The register assumes each recommendation until the decision owner confirms or changes it ([BRD section 19.1](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register)), so these are assumptions and not settled decisions.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module [M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used: nobody can see a timeline, filter it or move a card on a board.

The Plan tab of the project header, which screen 24 draws, links to the plan's route, and the link opens the shared page for a screen that is not built. That page shows, in the English interface, the title of the link, the sentence "Not built in the first batch.", the screen number, the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a screen of the MVP that is not built already has its final route and a generic page. The route belongs to the timeline; the Board has no route of its own, so nothing links to it.

| Screen | Where the app links to it | Path | Phase | What opens |
|---|---|---|---|---|
| 30, Project plan: timeline | The Plan tab of the project header | `/w/[workspaceId]/projects/[projectId]/plan` | MVP | The not-built page |
| 31, Project plan: board | nothing links to it | none | MVP | No route exists |

The wireframe manifest assigns PLN-01 to PLN-04 to screen 30 and PLN-05 to screen 31.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

None recorded.

## Sources

- [BRD v4.5, M09 Project Plan: Timeline and Board](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m09-project-plan-timeline--board-pln): the generated edition this page draws on.
- [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md): lines 316 to 331 (the module) and line 14 (its row in the catalogue, which gives the module its purpose).
- [BRD part 03, portfolio modules, metrics and business rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-22 and BR-41 (lines 216 and 235) and the roles table (lines 250 and 257).
- [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md): the milestone 1A row (line 30), the success criterion on identical metrics (line 113), D-10 and D-11 (lines 151 and 152) and the rule that the register assumes each recommendation (line 136).
- [Wireframe manifest](../../design/wireframes/manifest.json): the phase and the requirements of screens 30 and 31.
- `ROUTES` and `SCREENS` in `src/core/routes.ts`, the tabs in `src/shell/model.ts`, and the not-built page in `src/shell/NotBuilt.tsx` and `src/shell/model.page.ts`, all in the `metis-app` repository: what the app links to today.
- [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): the rule that a screen not built opens a generic page.
- [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md): why only the overview exists.
