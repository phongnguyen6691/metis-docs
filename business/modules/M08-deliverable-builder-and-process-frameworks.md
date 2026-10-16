---
title: M08 Deliverable Builder and Process Frameworks
summary: Generates pre-wired WBS items and dependencies from process frameworks, which project managers use to build deliverables and workspace owners author and publish.
component: all
type: module
status: current
ids: [BLD-01, BLD-02, BLD-03, BLD-04, BLD-05, BLD-06, BLD-07, BLD-08, BLD-09, BLD-10, BLD-11, BLD-12, BLD-13, BLD-14, BLD-15, BLD-16]
---

# M08 Deliverable Builder and Process Frameworks

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The Deliverable Builder is the proof of concept's most distinctive capability. Instead of typing tasks one by one, the project manager picks a process framework and generates a pre-wired set of WBS items and dependencies ([BRD v4.5, M08](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m08-deliverable-builder--process-frameworks-bld)). The survey behind the BRD rates it the hardest block to build, because of the custom canvas, the drag and drop, the connector drawing and the automatic date spreading, and it recommends a separate milestone. [BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01) gives the Builder its own workstream, with a prototype tested with project managers in Discovery.

From the WBS Master the project manager opens the Builder and either builds under an existing item or creates a new deliverable (BLD-01), then picks a framework from cards that show its flow summary and its item and relationship counts (BLD-02). The canvas has swimlanes defined by the framework, nodes with provisional WBS codes and one Start Date that drives every date (BLD-03). Every gesture has a keyboard equivalent, and a list editor makes the same edits without a pointer (BLD-04, BLD-12, BR-41). Before building, a preview lists the items, codes, labels, dates and dependencies that will be created. The build is deterministic, and a re-run shows its difference against the existing set (BLD-12). "Build N items into the WBS" creates the items, their labels and their dependencies and saves the canvas as that deliverable's Blueprint (BLD-05, BLD-08). A re-run never overwrites an item that has progress, effort or comments (BLD-07, BR-31), and generated items record the framework and the version used (BLD-10).

Frameworks come from a library and from an editor. The built-in frameworks (CGI Still Renders, 3D Animation / Video and Simple Review Loop) are read-only and published by the provider as immutable versions; users create their own in the process framework editor, or edit a copy of one (BLD-09). The editor works outside any project, on a relative day axis whose day 0 is the Builder Start Date, and it never shows calendar dates, named people or a project's items (BLD-13). A node stores its name, lane, parent, type, labels, inputs and outputs, offset and duration, an optional effort, and the person in charge, reviewer and approver as a typed selector, which names a workspace role or a member title and never a person (BLD-14). At build time a selector resolves to one member, to nobody, or to several members, which the preview lists for the project manager to choose, so Metis never picks the first match. A connection joins two nodes of the framework and carries a dependency type and a lag (BLD-15).

In Release 1 a framework is Draft, Published or Deprecated. Project managers and workspace owners edit drafts, and the Workspace Owner publishes a draft that passes the publish check as an immutable version, with no review step. The check includes constraint consistency: a connection whose type and lag contradict the offsets and durations of its two nodes for every Start Date blocks publication (BLD-16). Review and sharing beyond the workspace (BLD-11) stay P1. The BRD records that the product owner confirmed the choices behind BLD-13 to BLD-16 on 3 Oct 2026 (D-09): no review step in Release 1, drafts by project managers, sub-items within the depth limit, connection points that only route arrows, and lanes defined by each framework. They follow a survey of the proof of concept's Frameworks menu ([POC Frameworks coverage survey](../../history/reviews/poc-frameworks-coverage.md)).

Project managers and workspace owners work with this module ([BRD section 14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions)). All 16 requirements are P0 except BLD-11, and the BRD plans the module in milestone 1B. The decision register holds the Builder rules that the requirements rest on (D-09, whose authoring part the product owner confirmed on 3 Oct 2026) and the choice of built-in frameworks (D-23). The register assumes each recommendation until the decision owner confirms or changes it ([BRD section 19.1](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register)), so the other parts of D-09 and D-23 are assumptions and not settled decisions.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module [M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used: nobody can pick a process framework, build items into a WBS, author a framework or publish one.

Of this module's four screens only the template library has a route. The Templates entry of the sidebar's Workspace group links to it, and the link opens the shared page for a screen that is not built. That page shows, in the English interface, the title of the link, the sentence "Not built in the first batch.", the screen number, the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a screen of the MVP that is not built already has its final route and a generic page. The Builder, the process framework editor and the workspace setup screen have no route in the app, so nothing links to them.

| Screen | Where the app links to it | Path | Phase | What opens |
|---|---|---|---|---|
| 13, Template library | Templates in the sidebar | `/w/[workspaceId]/templates` | MVP | The not-built page |
| 29, Deliverable Builder | nothing links to it | none | MVP | No route exists |
| 58, Process framework editor | nothing links to it | none | MVP | No route exists |
| 36, Workspace setup | nothing links to it | none | MVP | No route exists |

The wireframe manifest assigns the requirements of this module to these screens: screen 29 carries BLD-01 to BLD-08, BLD-10 and BLD-12; screen 58 carries BLD-09 and BLD-12 to BLD-16; screen 13 carries BLD-09, BLD-11, BLD-13 and BLD-16; and screen 36 carries BLD-13. The Lifecycle framework entry of the sidebar (screen 11) is the lifecycle framework designer of [M04](M04-lifecycle-governance-framework-and-templates.md), not the process framework editor.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Who enforces "one editor per Builder canvas at a time"? The BRD's risk table lists it as a mitigation, but no requirement says how. The reviews propose a short lease that one editor holds and the server enforces, with other users seeing the canvas read-only and a request-to-edit action, and no real-time co-editing in the pilot. This is a proposal, not decided by the owner: [One editor holds a short lease on the builder canvas](../../architecture/decisions/builder-canvas-single-editor.md). Sources: [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md), line 208; [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 259 of the original; [Front-end stack review](../../history/reviews/metis-review-frontend-stack.md), lines 518 to 532 of the original.
- How does a framework's assignment selector match a person? BLD-14 leaves it to D-40. The BRD recommends the workspace role first, then the normalized member title with an alias list kept by the customer, and a PM choice in the build preview when several members hold the title; it assumes that recommendation until the product owner confirms it, and needs it for the Release 1B design, with the Builder. Sources: [BRD part 02](../requirements/source/parts/02-modules-a-b.md), line 306; [BRD part 04](../requirements/source/parts/04-roadmap-decisions.md), line 173; [Round 3 review](../../history/reviews/metis-review-vong-3.md), line 1056 of the original (question I-10); [Disposition of the round 3 review](../../history/reviews/review-disposition-round3.md), lines 88 and 101 of the original.
- Which built-in process frameworks ship, and who owns their content? BLD-09 names three built-in frameworks. The register recommends Simple Review Loop as the generic built-in and the CGI and 3D frameworks as templates for creative-production workspaces, and needs the answer before the Release 1B build; the first review asked the client which default templates must exist on launch day and who owns their content. The BRD also asks which industries or operating models, beyond digital product delivery and creative production, the first workspaces must support, which drives the built-in frameworks (Q-07, line 185 of [BRD part 04](../requirements/source/parts/04-roadmap-decisions.md)). Sources: [BRD part 02](../requirements/source/parts/02-modules-a-b.md), line 301; [BRD part 04](../requirements/source/parts/04-roadmap-decisions.md), line 164; [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 879 of the original.

## Sources

- [BRD v4.5, M08 Deliverable Builder and Process Frameworks](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m08-deliverable-builder--process-frameworks-bld): the generated edition this page draws on.
- [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md): lines 285 to 315 (the module) and line 13 (its row in the catalogue).
- [BRD part 03, portfolio modules, metrics and business rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-31 and BR-41 (lines 225 and 235) and the roles table (lines 246 and 250).
- [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md): the Builder workstream and the milestone 1B row (lines 21 and 31), the complexity rating (line 52), D-09, D-23 and D-40 (lines 150, 164 and 173), the risk table (lines 207 and 208) and the rule that the register assumes each recommendation (line 136).
- [POC Frameworks coverage survey](../../history/reviews/poc-frameworks-coverage.md): the survey behind BLD-13 to BLD-16, lines 1 to 21 and 147 to 168 of the original (the gaps, the five choices and what was applied).
- [Wireframe manifest](../../design/wireframes/manifest.json): the phase and the requirements of screens 13, 29, 36 and 58.
- `ROUTES` and `SCREENS` in `src/core/routes.ts`, the not-built page in `src/shell/NotBuilt.tsx` and `src/shell/model.page.ts` and the navigation in `src/mocks/fixtures/shell.ts`, all in the `metis-app` repository: what the app links to today.
- [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): the rule that a screen not built opens a generic page.
- [One editor holds a short lease on the builder canvas](../../architecture/decisions/builder-canvas-single-editor.md): the draft proposal named under open questions.
