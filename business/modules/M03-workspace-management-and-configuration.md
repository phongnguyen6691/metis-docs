---
title: M03 Workspace Management and Configuration
summary: How a workspace owner or admin creates a workspace and sets up its profile, navigation tree, option lists, team and roles, then activates it through a checklist.
component: all
type: module
status: current
ids: [WSP-01, WSP-02, WSP-03, WSP-04, WSP-05, WSP-06, WSP-07, WSP-08, WSP-09, WSP-10, WSP-11, WSP-12, WSP-13, WSP-14]
---

# M03 Workspace Management and Configuration

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The workspace is the governance boundary inside a tenant. It owns its team and roles, its option lists, its lifecycle framework and process frameworks, its policies and its calendar, and it holds portfolios, programs and projects ([BRD section 7.1](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#71-unified-hierarchy)). This module makes the workspace a first-class product object. It combines the workspace concept of BRD v3.0 with what the proof of concept already had: the navigation tree and a Settings area with General, Fields and Options, Team, Frameworks and Data.

Creating and describing a workspace. An authorized admin creates a workspace with a name, company or business unit, owner, time zone, fiscal calendar and status, and it starts in Draft with its owner (WSP-01). The profile adds the purpose, operating model, governance owner, business calendar and reporting cadence; its values drive working-day durations (WBS-15) and reporting periods (RPT-04) (WSP-03). A workspace is Draft, Active, Suspended or Archived, and an archived one is read-only and auditable (WSP-05). Users see only the workspaces and records they are authorized for (WSP-02), and they switch between workspaces without losing context (WSP-04).

Structure and vocabulary. A collapsible sidebar tree shows Workspace, Portfolio (the proof of concept's Space), Program (its Folder) and Project; nodes can be created, renamed, moved and archived, folders show project counts, and a project node expands to Docs & Links (WSP-06). Fields and Options are the workspace-managed lists for Category, Type, Label, Phase, Status and Priority: each value shows how many items use it, a rename updates every item, and deleting a value in use needs a replacement (WSP-07, BR-25). Each Status maps to a system state (Not started, In progress, Waiting, Blocked, Done) and each built-in Label keeps its system meaning, so renaming "Done" to "Completed" leaves progress figures unchanged (WSP-08). The Phase values come from the stages of the workspace's published lifecycle framework (WSP-09, [module M04](M04-lifecycle-governance-framework-and-templates.md)).

People and roles. Team members have a name, a role or title and an email. Each can be chosen as PIC, Reviewer and Approver and be @mentioned, and removing one keeps the name on existing items and history (WSP-10, BR-26). Roles from [BRD section 14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions) are assigned at workspace level and, where needed, per project (WSP-11).

Setting up. A new workspace opens a setup checklist (profile, fields and options, team and roles, lifecycle framework, process frameworks) with an optional starter template, and a readiness check before activation: owner set, a published default lifecycle framework (BR-14), every Status mapped to a system state, and at least one portfolio. The process framework step is recommended before the Deliverable Builder is used but is not an activation blocker (WSP-14). Cloning a workspace's configuration (WSP-12) and cross-workspace governance (WSP-13) are priority P1; the other 12 requirements are P0 and sit in milestone 1A of the release plan ([BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). The BRD gives the module five wireframe screens: 2, 9, 10, 36 and 43, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). Two key journeys rely on it: [Workspace setup](../journeys/workspace-setup.md) is the checklist of WSP-14, and [Tenant onboarding](../journeys/tenant-onboarding.md) ends with workspace owners configuring fields, roles and frameworks ([BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, [module M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used. No workspace can be created, configured or activated, and no member can be added or given a role.

The frame around screen 24 shows two things in this module's area, both read-only and fed by mock data:

- The workspace menu. The workspace button at the top of the sidebar (on a tablet or a phone, in the drawer that the menu button opens) shows the tenant name above the workspace name and opens a menu of the workspaces that the shell data names; the mock data names two. Choosing one opens the dashboard route of that workspace, the route of screen 15, which shows the page that says the screen is not built. The menu has no screen of its own: it has no design yet, and the choice of its target is an open question (see below).
- The project tree. The sidebar lists the portfolios, programs and projects of the current workspace, with the number of projects beside each program, and a project opens its overview. The tree only displays the data: it cannot be collapsed, and nothing in it can be created, renamed, moved or archived.

One of the module's five wireframe screens has a route. Settings, in the Workspace group of the sidebar, links to `/w/[workspaceId]/settings`, the route of screen 9 (fields and options), and opens the page that says the screen is not built. Screens 2, 10, 36 and 43 have no route.

## Where the app differs from the BRD

Nothing of this module is built, so there is no built behavior to compare with the BRD, with one exception in the frame of screen 24:

- Returning to a workspace. WSP-04 asks that returning to a workspace reopens the last project and tab. The workspace menu of the shell opens the dashboard of the chosen workspace instead (screen 15). The route table of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) sets that target, and the foundation spec lists the target as an open question (see below).

## Open questions

- When a member who is a PIC, Reviewer or Approver is deactivated, does the app show the impact and offer bulk reassignment before the deactivation is confirmed? PLT-03, WSP-10 and BR-26 keep the member's name on history and revoke access at once, but no requirement says what happens to the work assigned to the member. The first review found the role assignment clear but the reassignment of orphaned PIC or Approver work not yet a guided flow, and proposed that deactivating a user opens an impact list and a bulk reassignment before the user confirms ([Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md), line 608 of the original, in its assessment of screen 10). It also listed among the operational risks that role and approval changes can leave a project stuck when an approver leaves the organization (line 295 of the original). The wireframe of screen 10 flags the open items of a removed member for reassignment after the removal, and has no impact list and no bulk reassignment ([Wireframes text digest](../../design/wireframes/wireframes-digest.md), lines 734, 772 and 797).
- Where does the workspace menu lead, and how should it look? The menu has no design yet. The app opens the dashboard of the chosen workspace (screen 15), and the foundation spec asks whether that is agreed, for the review of screen 24 ([Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 718 of the original). WSP-04 asks that returning to a workspace reopens the last project and tab.

## Sources

- [BRD v4.5, module M03](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m03-workspace-management--configuration-wsp): the purpose, the requirements and the wireframe list, lines 101 to 127 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 8 of the same part.
- [BRD v4.5, unified hierarchy](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#71-unified-hierarchy): the workspace level, lines 386 to 387 and 410, and the persona Workspace Owner / Admin, line 362 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); Tenant onboarding, line 523, and Workspace setup, line 527 ([key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- [BRD v4.5, business rules](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#13-business-rules): BR-14 (line 208), BR-25 (line 219) and BR-26 (line 220) of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md).
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): milestone 1A, line 30 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md), screens 2, 9, 10, 36 and 43 (manifest lines 35, 182, 203, 822 and 971; digest lines 68 to 152, 623 to 726, 728 to 798, 2702 to 2784 and 3186 to 3266).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the operational risks, line 295, and the assessment of screen 10, line 608 of the original.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original; the route table rows for Settings (line 266) and the workspace chooser (line 273); the open question on the workspace menu, line 718.
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) and [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md), for the workspace list and the project tree that the shell data carries.
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/shell/Sidebar.tsx` (the workspace button, its menu and the project tree), `src/shell/Rail.tsx` (what the tablet rail leaves to the drawer), `src/shell/model.ts` (`sidebarOf`), `src/design-system/Menu.tsx`, `src/mocks/handlers.ts` (the two workspaces) and `src/mocks/fixtures/shell.ts` (the mock navigation and tree); `src/screens/` holds one screen, 24.
