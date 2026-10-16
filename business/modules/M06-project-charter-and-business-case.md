---
title: M06 Project Charter and Business Case
summary: The live project charter, the business case and the creation of a project, for project managers, owners, sponsors and client representatives.
component: all
type: module
status: current
ids: [CHR-01, CHR-02, CHR-03, CHR-04, CHR-05, CHR-06, CHR-07, CHR-08, CHR-09, CHR-10, CHR-11, CHR-12, CHR-13, CHR-14, CHR-15, CHR-16, CHR-17]
---

# M06 Project Charter and Business Case

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

The charter is a live slice of project data, not a separate document. [BRD v4.5, M06](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m06-project-charter--business-case-chr) gives it nine sections: project identification, key contacts, description and objectives, scope, deliverables, client commitments, overall project risk, notes and sign-off (CHR-01). Sections V and VI are read-only lists that the WBS fills as it changes: the work items of type Deliverable with their dates and descriptions, and the items labelled Input Required with their person in charge and target date (CHR-05, CHR-06; see [M07](M07-wbs-master.md)). Section VII shows the project's top risks from the risk register, and a risk added from the charter appears in the register and the reverse (CHR-07).

The charter is signed and revised in the app. The Client Representative, the Project Owner and the Project Manager each sign, and every signature records the authenticated signer, the time and the charter revision. A signed revision is frozen, and a further edit starts a new revision (CHR-08). Issuing a revision snapshots the charter and keeps earlier revisions readable (CHR-09). Two revisions can be compared side by side (CHR-10, priority P1), and the charter exports as a formatted PDF or as data (CHR-11).

The module also holds what a project needs before it is committed. The business case states the problem, the opportunity, the target customer, the strategic rationale, the alternatives, the expected benefits and the assumptions, and it is approved before the project becomes committed (CHR-12). The budget and timeline record the approved budget, the actual, the forecast, the dates and the milestones, with the variance calculated automatically; in the MVP the actuals are entered or imported, and ERP integration is V2 (CHR-13). An accountable owner and an executive sponsor are mandatory before commitment (CHR-14, BR-01), and a committed project is linked to a strategic objective or to an approved exemption (CHR-15, BR-02). The charter also shows the project's lifecycle position: its stage, its gate readiness and its framework version (CHR-16).

CHR-17 creates the project. A project cannot exist outside a workspace (BR-13). It takes the workspace's published lifecycle framework version and keeps it (BR-15), and it starts in Draft with a setup checklist (charter sections I to IV, business case, team, first WBS items) that leads to commitment.

Project managers and project owners create and edit the charter, business sponsors own the business case, and a client representative signs the charter where one is named ([BRD section 14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions)). All 17 requirements are P0 except CHR-10, and [BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01) plans the module in milestone 1A. The decision register assumes in-app sign-off by authenticated users that freezes a revision, revision snapshots in the MVP with e-signature and comparison in V2 (D-12), and a workspace-managed list of strategic objectives in the MVP (D-25). The register assumes each recommendation until the decision owner confirms or changes it ([BRD section 19.1](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register)), so these are assumptions and not settled decisions.

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module [M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used: nobody can write a charter, record a business case, sign or revise a charter, or create a project.

Four of this module's six screens have a link in the build, and a fifth is named by text. Each link opens the shared page for a screen that is not built. That page shows, in the English interface, the title of the link, the sentence "Not built in the first batch.", the screen number, the path, and the filters that came in the address, or "None". It follows the rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): a screen of the MVP that is not built already has its final route and a generic page.

| Screen | Where the app links to it | Path | Phase | What opens |
|---|---|---|---|---|
| 25, Project charter and business case | The Charter tab of the project header | `/w/[workspaceId]/projects/[projectId]/charter` | MVP | The not-built page |
| 37, Create project | The + New button of the top bar, which a phone does not show | `/w/[workspaceId]/projects/new` | MVP | The not-built page |
| 16, Portfolio and project registry | Registry in the sidebar | `/w/[workspaceId]/registry` | MVP | The not-built page |
| 38, My approvals | Approvals in the sidebar | `/me/approvals` | MVP | The not-built page |
| 20, Investment and benefits | Investment in the sidebar | none | V2 | Text tagged "Planned V2", nothing to press |
| 45, Client view of an invited project | nothing links to it | none | MVP | No route exists |

The wireframe manifest assigns the requirements of this module to these screens: screen 25 carries CHR-01 to CHR-16, screen 37 carries CHR-14, CHR-15 and CHR-17, screen 16 carries CHR-15, screen 20 carries CHR-13, screen 38 carries CHR-08, and screen 45 carries CHR-06 and CHR-08.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Where will pilot capacity and actuals data come from (manual entry, file import, or an HR or finance export), and who owns it? CHR-13 says the MVP enters or imports actuals, and the BRD still lists the question. Source: question Q-13 in [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md), line 191.
- Should the server own every rule of a form such as Create project, so that a form cannot require what the contract leaves optional (in CHR-17 the program is optional)? This is a draft proposal of two reviews, not decided by the owner: [The server owns every rule; the UI shows its result](../../architecture/decisions/server-owned-validation.md).

## Sources

- [BRD v4.5, M06 Project Charter and Business Case](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m06-project-charter--business-case-chr): the generated edition this page draws on.
- [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md): lines 222 to 249 (the module) and line 11 (its row in the catalogue).
- [BRD part 03, portfolio modules, metrics and business rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-01, BR-02, BR-13 and BR-15 (lines 195, 196, 207 and 209) and the roles table (lines 250, 256 and 258).
- [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md): the milestone 1A row (line 30), D-12 and D-25 (lines 153 and 166), the rule that the register assumes each recommendation (line 136) and Q-13 (line 191).
- [Wireframe manifest](../../design/wireframes/manifest.json): the phase and the requirements of screens 16, 20, 25, 37, 38 and 45.
- `ROUTES` and `SCREENS` in `src/core/routes.ts`, the not-built page in `src/shell/NotBuilt.tsx` and `src/shell/model.page.ts`, the tabs in `src/shell/model.ts`, the top bar in `src/shell/TopBar.tsx` and the navigation in `src/mocks/fixtures/shell.ts`, all in the `metis-app` repository: what the app links to today.
- [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md): the rule that a screen not built opens a generic page.
- [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md): why only the overview exists.
- [The server owns every rule; the UI shows its result](../../architecture/decisions/server-owned-validation.md): the draft proposal named under open questions.
