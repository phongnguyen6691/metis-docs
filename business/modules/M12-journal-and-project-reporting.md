---
title: M12 Journal and Project Reporting
summary: Lets project teams keep a project journal, build and save reports from it and from project data, and publish the weekly status for the portfolio.
component: all
type: module
status: current
ids: [RPT-01, RPT-02, RPT-03, RPT-04, RPT-05]
---

# M12 Journal and Project Reporting

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The journal and the reports are where a project writes down its week and tells others about it ([module M12 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m12-journal--project-reporting-rpt)). The project manager keeps the journal, builds the reports and publishes the weekly status; team members add journal entries; the executive attention queue shows the projects whose weekly status is missing. The journal is the everyday log of a project: entries of type Note, Meeting, Decision, Issue or Highlight, each timestamped and attributed, optionally linked to a WBS item, and flowing into reports (RPT-01). An LLM client connected through MCP can append entries, which show the AI avatar and the token name (MCP-06). A Decision entry can be promoted to the decision log of [M11 Change Control, Baseline and Decision Log](M11-change-control-baseline-and-decision-log.md) (CHG-11).

The report builder produces a report for a period from the project's data and its journal. It offers the templates Weekly Status, Executive Summary, Full History and Custom, and each preselects its default sections (RPT-02). A generated report states its project, period, preparer, the time of its data and the version of the metric definitions; it can be copied as Markdown, exported to PDF and saved to the Saved list. A saved report is a snapshot that keeps its figures and as-of time when the data later changes (BR-39), and the health summary of a report equals the project overview for the same as-of time (RPT-03, BRD section 12). The BRD assumes that the server generates the PDF from a standard template in the MVP, with workspace branding in V2 (decision D-13).

The weekly status submission is how a project reports to the portfolio. The workspace sets the reporting cadence; for each period the project manager publishes a status report made of the generated report, the declared health and a narrative, and a missing or late submission becomes an exception in the executive attention queue (RPT-04, BR-09). Saved reports can be shared by a permission-checked link inside the organization; sharing with a reader outside it waits for the client access decision D-02 (RPT-05).

RPT-05 is priority P1, which the BRD reads as V2; the other four requirements are P0, part of Release 1. The BRD builds the module in the project execution layer for milestone 1A ([section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). Its wireframes are screens 33 (Journal and project reporting, whose Journal, Build a report and Saved tabs are three states of one area) and 45 (Client view of an invited project, where a shared report would appear). It takes part in the journeys PM weekly update and PM and team daily execution ([section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used: nobody can write a journal entry, build, save or export a report, or publish a weekly status.

The build's navigation names no screen of this module. Screen 33 and screen 45 are phase MVP in the wireframe manifest, but the route table of the app has no destination for either, so no sidebar item, tab or button leads to them. The wireframe of screen 33 is drawn with the Plan tab active, and the Plan tab of a project opens the shared page for a screen that is not built, here screen 30 (Project plan: timeline). That page shows, in the English interface, the title Plan, the sentence "Not built in the first batch.", "Screen 30", the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): an MVP screen that is not built already has its final route and a generic page.

The one trace of the module in the build is a sentence under the overall progress on screen 24: "Same value as the Weekly Status report for the same date." It points at a report that the app cannot yet produce, and it echoes the acceptance rule of RPT-03 that the figures of a report equal the overview's for the same as-of time. The build computes no figure itself (see [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md)).

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Should a PDF report carry a watermark or a legal footer? The BRD assumes a PDF generated by the server from a standard template in the MVP (decision D-13), and PLT-16 says that a PDF states its data as-of time, metric version and generator; neither names a watermark or a legal footer. The first review asked whether the PDF needs a signature, a legal footer, a watermark or a version number, or is only a presentational export (line 882 of the original). Source: [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md).

## Sources

- [BRD v4.5, module M12](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m12-journal--project-reporting-rpt): the requirements and the wireframe list, lines 377 to 387 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 17; PLT-16 (line 56) and MCP-06 (line 186).
- [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-09 and BR-39 (lines 203 and 233); the metric definitions of section 12.1 and the snapshot rules of section 12.5 (lines 106 to 134 and 184 to 189); the reporting compliance KPI (line 165); the roles of the PMO, the Project Manager, the team member and the Client (lines 248, 250, 257 and 258); the entities Journal entry and Report (lines 289 and 290).
- [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md): milestone 1A, line 30; decisions D-02 (line 143), D-13 (line 154) and D-30 (line 171).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): lines 513 and 515 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the principle "enter once, derive everywhere", line 277; the personas, lines 361, 363 and 366; the priority key, line 55.
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screens 33 and 45, lines 757 and 1014) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 33, lines 2485 to 2568; screen 45, lines 3341 to 3415). The screens themselves: [33 Journal and project reporting](../../design/wireframes/screens/33-journal-reports.html) and [45 Client view of an invited project](../../design/wireframes/screens/45-client-view.html).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the question on the content of the PDF, line 882 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table row for the Plan tab, line 259.
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `README.md` (`pnpm web` opens the build with mock data), `src/core/routes.ts` (`ROUTES`, `SCREENS`, which hold no destination for screens 33 and 45), `src/shell/model.ts` (the six project tabs), `src/shell/NotBuilt.tsx`, `src/shell/model.page.ts` and `src/app/w/[workspaceId]/projects/[projectId]/plan.tsx` (the shared page), `src/screens/24-project-overview/strings/en.ts` and `src/screens/24-project-overview/blocks/ProgressCard.tsx` (the Weekly Status sentence).
