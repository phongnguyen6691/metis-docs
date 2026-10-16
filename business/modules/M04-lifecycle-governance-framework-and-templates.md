---
title: M04 Lifecycle Governance Framework and Templates
summary: How a workspace admin turns the delivery lifecycle into versioned stages, gates and templates, and how stage owners and gate approvers decide gates.
component: all
type: module
status: current
ids: [GOV-01, GOV-02, GOV-03, GOV-04, GOV-05, GOV-06, GOV-07, GOV-08, GOV-09, GOV-10, GOV-11, GOV-12, GOV-13, GOV-14, GOV-15, GOV-16, GOV-17, GOV-18, GOV-19, GOV-20, GOV-21, GOV-22, GOV-23, GOV-24, GOV-25, GOV-26, GOV-27, GOV-28]
---

# M04 Lifecycle Governance Framework and Templates

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Metis does not fix how a company delivers. The delivery lifecycle is configuration: stages, gates, mandatory evidence, roles and rules held in versioned templates, so that a company changes its lifecycle without custom development. The BRD describes the template model as a governed configuration system with five steps: clone, adapt, review, publish and instantiate. Reference lifecycles are in [BRD section 7.6](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#76-company-a-reference-lifecycle-from-v30) (Company A) and in section 15.2 (creative production phases).

Stages and gates. A workspace admin keeps a library of stages, each with an objective, owner, duration or SLA, activities, artifacts and entry and exit criteria, and can reorder and deactivate them and map them to workspace roles (GOV-01, GOV-02, GOV-05). A gate has approvers, a quorum, decision options and evidence requirements, and a mandatory artifact blocks submission until it exists (GOV-03, GOV-04). Rules can add or remove stages, for example a regulatory impact that adds a compliance review (GOV-06). Parallel stages, the stage SLA and stage health are priority P1 (GOV-07, GOV-10, GOV-11).

Deciding a gate. A gate is decided as Pass, Pass with Conditions, Rework, Hold or Reject, each with a rationale and evidence, and a decision without a rationale is blocked (GOV-08, BR-30). A project cannot advance while a mandatory exit criterion is open, unless an authorized and unexpired waiver exists (GOV-09, GOV-13, BR-17). The server checks eligibility for every channel: the gate review shows what blocks the decision, and an ineligible decision sent through the API or MCP is rejected (BR-42). Before a gate meeting, the readiness view shows the status of the evidence, open risks, dependencies, budget and resource impact, and the decision history (GOV-14). Decisions link to the project, stage, evidence, approver and Decision Log, conditions become tracked actions, and failed or conditional gates can raise risks or change requests (GOV-15). Escalation of overdue or repeatedly failed gates is P1 (GOV-16).

Templates and versions. A published framework version is immutable: a change creates a new version, and each project and stage instance keeps the version it was created with, so editing a template never alters existing projects (GOV-12, BR-15, BR-16). Authorized users browse a catalog of approved templates, clone one into an editable draft, adapt its stages and governance in the draft, and publish it after review (GOV-17 to GOV-21). Publishing runs a readiness check: every stage has an owner role, every gate has approvers and a quorum that the configured approvers can meet, mandatory artifacts are defined, and the stage list yields the Phase values; a draft that fails cannot be published. Each version has a number and an effective date, and its source template, lineage, author and accountable owner are recorded (GOV-22, GOV-23). Comparing versions, migrating active projects with their impact shown, a global template library, project and WBS templates, and deprecation with a replacement are P1 (GOV-24 to GOV-28).

Nineteen of the 28 requirements are P0, and nine are P1 (GOV-07, GOV-10, GOV-11, GOV-16 and GOV-24 to GOV-28). The release plan puts framework definition, configuration and versioning (GOV-01 to GOV-05, GOV-12 and GOV-17 to GOV-23) in milestone 1A, and gate operation (GOV-06, GOV-08, GOV-09 and GOV-13 to GOV-15) in milestone 1B ([BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). The BRD gives the module six wireframe screens: 11, 12, 13, 15, 37 and 38, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). Two key journeys run on it: [Gate review](../journeys/gate-review.md), and [Workspace setup](../journeys/workspace-setup.md), whose fourth step is to clone, adapt, review and publish the lifecycle framework ([BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, [module M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used. No lifecycle, gate or template can be configured, viewed or decided in the app.

The build's navigation does name this module's screens. All six have a route, and each link opens the page that says the screen is not built:

- Lifecycle framework, in the Workspace group of the sidebar, links to `/w/[workspaceId]/frameworks`, the route of screen 11 (the framework designer).
- The Governance tab of a project links to `/w/[workspaceId]/projects/[projectId]/governance`, the route of screen 12 (gate review).
- Templates, in the Workspace group, links to `/w/[workspaceId]/templates`, the route of screen 13 (the template library).
- Workspace dashboard, in the Portfolio group, links to `/w/[workspaceId]/dashboard`, the route of screen 15.
- The + New button of the top bar, which a phone does not show, links to `/w/[workspaceId]/projects/new`, the route of screen 37 (create project).
- Approvals, in the Home group of the sidebar, links to `/me/approvals`, the route of screen 38 (My approvals). The mock data gives it a count of three.

At narrower widths the sidebar links sit in the icon rail of a tablet, or in the drawer that the menu button opens. One thing of the module is already shown as text: the project header of screen 24, the only project page the build draws, tags the project with the name and version of its lifecycle framework and with the stage the project is in (for example "stage 3 of 6"). It is read from the mock data and links to no framework.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Can one gate have several different approver groups or quorums, and are abstention, delegation or a substitute approver needed for the MVP? GOV-03 gives each gate approvers and a quorum, and the BRD does not say whether a gate can have more than one group or quorum. For delegation and abstention it records its own question: whether gate approvers can delegate their vote or abstain, and how that counts toward the quorum ([BRD v4.5, open questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions), Q-10, line 188 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md)). The first review asked the wider question, with the substitute approver, for GOV-03 and GOV-09 ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 878 of the original).

## Sources

- [BRD v4.5, module M04](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m04-lifecycle-governance-framework--templates-gov): the purpose, the requirements and the wireframe list, lines 128 to 164 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 9 of the same part.
- [BRD v4.5, business rules](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#13-business-rules): BR-15, BR-16 and BR-17 (lines 209 to 211), BR-30 (line 224) and BR-42 (line 236) of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): Gate review, line 519, and Workspace setup, line 527 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the personas Stage Owner / Gate Approver (line 364) and Control function (line 371).
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): the workstream Workspace and lifecycle governance, line 19, and milestones 1A and 1B, lines 30 and 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md). [BRD v4.5, open questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions): Q-10, line 188 of the same part.
- Wireframes: [the manifest](../../design/wireframes/manifest.json) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md), screens 11, 12, 13, 15, 37 and 38 (manifest lines 223, 250, 275, 322, 845 and 868; digest lines 800 to 870, 872 to 962, 964 to 1033, 1121 to 1199, 2786 to 2848 and 2850 to 2932).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the question for the client on gate approvers, line 878 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table rows for the Governance tab (line 260), Approvals (264), the cockpit and dashboard row (265), Lifecycle framework, Templates and Settings (266) and New (268).
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) and [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md).
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/mocks/fixtures/shell.ts` (the mock navigation) and `src/mocks/fixtures/meridian.ts` (the framework and stage of the mock project), `src/shell/model.ts` (`projectHeaderOf`, and how a navigation entry becomes a link), `src/shell/ProjectHeader.tsx`, `src/shell/Sidebar.tsx`, `src/shell/Rail.tsx`, `src/shell/TopBar.tsx` and `src/shell/strings/en.ts` (the English labels); `src/screens/` holds one screen, 24.
