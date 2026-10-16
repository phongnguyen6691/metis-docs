---
title: PM weekly update
summary: How a project manager reviews the Overview and publishes the weekly status submission, or raises a change request when a commitment must change.
component: all
type: journey
status: current
ids: [OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, RPT-02, RPT-03, BR-39, RPT-04, BR-08, BR-09, EXE-02, BR-04, BR-05, CHG-01]
---

# PM weekly update

Status in the app: step 1 works on mock data in the development build; the other steps are not built yet. This page describes the journey as the BRD defines it, then says what works today.

Each week the project manager reads the project Overview, generates the Weekly Status report, adds the declared health and a narrative, and publishes the result as the weekly status submission. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Review the Overview. The Overview is read-only and computed from the WBS with the metric definitions of BRD section 12: KPI tiles, charts, attention lists and drill-down (OVW-01, OVW-02, OVW-03, OVW-04). It also shows the computed health of the project next to the status the PM declared (OVW-05). Module [M10](../modules/M10-project-overview-and-focus.md), screen 24.
2. Generate the Weekly Status report for the period. The report builder offers the Weekly Status template, a period and selectable sections (RPT-02). The output states the project, the period, the preparer, the data as-of time and the metric version, and it is a snapshot (RPT-03, BR-39). Its health summary equals the Overview for the same time. Module [M12](../modules/M12-journal-and-project-reporting.md), screen 33.
3. Add declared health and narrative. The PM declares the health of the project and writes what changed, what is at risk and what is needed from leadership (RPT-04). A declared health better than the computed health is flagged until an override with a rationale is recorded (OVW-05, BR-08). Module [M12](../modules/M12-journal-and-project-reporting.md), screen 33.
4. Publish it as the weekly status submission. The workspace sets the reporting cadence. A project with no submission at the deadline raises an exception (RPT-04, BR-09), and a missing or late submission appears in the executive attention queue (EXE-02). Module [M12](../modules/M12-journal-and-project-reporting.md), screen 33.
5. If a baselined commitment must change, raise a CR instead of editing it. Baseline scope, dates, budget and critical dependencies are locked after commitment and change only through an approved change request (BR-04, BR-05). Raising one starts by logging it (CHG-01); see [Change request](change-request.md). Module [M11](../modules/M11-change-control-baseline-and-decision-log.md), screen 32.

## What works today

Step 1 works on mock data in the development build of the app. The app is not deployed and has no back end yet, so the figures come from [a mock server](../../architecture/decisions/mock-server-behind-real-api.md), not from a real project. Opening the app shows the Overview of one sample project (screen 24). It shows eight KPI tiles, overall progress, the status breakdown, the declared and the computed health of the project, progress by category, workload by person, and three lists: upcoming milestones and gates, overdue items, and high and critical risk items (OVW-01 to OVW-05). The computed health covers delivery and risk only; see [Derived health covers delivery and risk only](../../architecture/decisions/derived-health-scope.md).

The tiles and the list entries link to the WBS, to a WBS item and to Focus, and each of those pages says it is not built (see [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md)). The page of module [M10](../modules/M10-project-overview-and-focus.md) describes the screen in full. Steps 2 to 5 have nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Review the Overview | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [24 Project overview](../../design/wireframes/wireframes-digest.md#24-project-overview) |
| 2. Generate the Weekly Status report for the period | [M12 Journal and Project Reporting](../modules/M12-journal-and-project-reporting.md) | [33 Journal and project reporting](../../design/wireframes/wireframes-digest.md#33-journal-and-project-reporting) |
| 3. Add declared health and narrative | [M12 Journal and Project Reporting](../modules/M12-journal-and-project-reporting.md) | [33 Journal and project reporting](../../design/wireframes/wireframes-digest.md#33-journal-and-project-reporting) |
| 4. Publish it as the weekly status submission | [M12 Journal and Project Reporting](../modules/M12-journal-and-project-reporting.md) | [33 Journal and project reporting](../../design/wireframes/wireframes-digest.md#33-journal-and-project-reporting) |
| 5. Raise a CR instead of editing a baselined commitment | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |

## Sources

- The journey: the paragraph "PM weekly update" of section 7.9 of the BRD, line 515 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Project Owner / Project Manager (line 363) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The cadence: the "Project status" row of section 7.8 of the BRD, line 497 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.8 Governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)).
- The requirements of M10 (lines 332 to 353), M11 (lines 354 to 376) and M12 (lines 377 to 390), in `business/requirements/source/parts/02-modules-a-b.md`.
- The requirements of M15 (lines 4 to 18), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The business rules BR-39 (line 233), BR-08 (line 202), BR-09 (line 203), BR-04 (line 198) and BR-05 (line 199), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 24, 32 and 33 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The Overview, the report builder, the declared health and the publication: the [wireframe digest](../../design/wireframes/wireframes-digest.md#33-journal-and-project-reporting), screen 33, and the [digest of screen 24](../../design/wireframes/wireframes-digest.md#24-project-overview).
- The blocks of screen 24 as the app builds them, and its destinations that open the not-built page: the [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 220 to 234 and lines 236 to 250 of the original.
- The screen and its requirement ids: lines 5 to 9 of `src/screens/24-project-overview/contract.yaml` in the `metis-app` repository. The destinations of the tiles and list entries: lines 22 to 105 of the same file; the routes `wbs`, `wbsItem` and `focus` open the not-built page (`src/app/w/[workspaceId]/projects/[projectId]/wbs/index.tsx`, `wbs/[itemId].tsx` and `focus.tsx` in the same repository).
- The blocks of the screen and their words: `src/screens/24-project-overview/strings/en.ts` in the `metis-app` repository, for the tiles, progress, status, health, category, workload and the three lists.
- The app opens on the sample project: lines 6 to 9 of `src/app/index.tsx` and line 10 of `src/platform/config.ts` in the `metis-app` repository. `pnpm web` opens the app with mock data: line 12 of `README.md` in the same repository.
