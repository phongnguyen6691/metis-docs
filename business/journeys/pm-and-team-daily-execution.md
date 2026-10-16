---
title: PM and team daily execution
summary: How a project manager and the team clear overdue work, update status, discuss items and keep the project journal.
component: all
type: journey
status: current
ids: [OVW-06, OVW-07, OVW-08, PLN-05, WBS-04, WBS-16, PLT-09, RPT-01]
---

# PM and team daily execution

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

Every working day the project manager and the delivery team look at what is overdue, update the status of their items, talk about the work in comments and write down what happened in the Journal. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Open Focus and clear overdue items. Focus, titled Today and This Week, lists the overdue items, the items due this week and the items starting this week, with an Only mine filter (OVW-06). A status change or Done can be set from the row without opening the item (OVW-07), and Focus can span all the user's projects in the workspace (OVW-08). Module [M10](../modules/M10-project-overview-and-focus.md), screen 34.
2. Update status on the Board or in the WBS. On the Board, dragging a card to another status column, or choosing a column in its Move to menu, changes the status (PLN-05). In the WBS table the status is edited inline (WBS-04). Each change is recorded in the item's activity (WBS-16). Modules [M09](../modules/M09-project-plan-timeline-and-board.md) (screen 31) and [M07](../modules/M07-wbs-master.md) (screen 26).
3. Comment and @mention on items. An item keeps its activity and its comments, with @mentions and attachments, posted as the signed-in user (WBS-16). An @mention notifies the person (PLT-09). Module [M07](../modules/M07-wbs-master.md), screen 28.
4. Log meetings, decisions, issues and highlights in the Journal. A journal entry is a Note, Meeting, Decision, Issue or Highlight, optionally linked to a WBS item, and it flows into the reports (RPT-01). Module [M12](../modules/M12-journal-and-project-reporting.md), screen 33.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Open Focus and clear overdue items | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [34 Focus: today and this week](../../design/wireframes/wireframes-digest.md#34-focus-today-and-this-week) |
| 2. Update status on the Board or in the WBS | [M09 Project Plan: Timeline and Board](../modules/M09-project-plan-timeline-and-board.md) | [31 Project plan: board](../../design/wireframes/wireframes-digest.md#31-project-plan-board) |
| 2. Update status on the Board or in the WBS | [M07 WBS Master](../modules/M07-wbs-master.md) | [26 WBS Master: table view](../../design/wireframes/wireframes-digest.md#26-wbs-master-table-view) |
| 3. Comment and @mention on items | [M07 WBS Master](../modules/M07-wbs-master.md) | [28 WBS item form and activity](../../design/wireframes/wireframes-digest.md#28-wbs-item-form-and-activity) |
| 4. Log meetings, decisions, issues and highlights in the Journal | [M12 Journal and Project Reporting](../modules/M12-journal-and-project-reporting.md) | [33 Journal and project reporting](../../design/wireframes/wireframes-digest.md#33-journal-and-project-reporting) |

## Sources

- The journey: the paragraph "PM and team daily execution" of section 7.9 of the BRD, line 513 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The personas of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Project Owner / Project Manager (line 363) and Delivery team member (line 365) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The cadence: the "Project team" row of section 7.8 of the BRD, line 496 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.8 Governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)).
- The requirements of M01 (lines 33 to 61), M07 (lines 250 to 284), M09 (lines 316 to 331), M10 (lines 332 to 353) and M12 (lines 377 to 390), in `business/requirements/source/parts/02-modules-a-b.md`.
- The screens: the title and phase of screens 26, 28, 31, 33 and 34 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
