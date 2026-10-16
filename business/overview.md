---
title: Metis in one page
summary: What Metis is, for whom, how tenants and workspaces divide it, and what is built today.
component: all
type: overview
status: current
ids: []
---

# Metis in one page

Metis is a multi-tenant SaaS for governing a company's project portfolio and running its projects,
with a natural-language interface for LLMs. Its business requirements document (BRD v4.5, with an
onboarding addendum) is written. The app has one screen, on mock data, and no back end exists yet:
the sections below describe the product the BRD specifies, and "What is built today" says how much of
it exists.

## Product

Metis is the working name of the Enterprise Portfolio Intelligence and Governance Platform (BRD
decision D-22). The BRD states the vision as one platform where leadership sees what the company
invests in, why it matters, whether the company can deliver it, what is at risk and what to do about
it, and where every team runs its projects from charter to closeout inside a governed workspace whose
operating rules are configured, not coded. Executive views come first for leaders and today's work
comes first for delivery teams. Source: [BRD Sections 2 and 4](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#2-executive-summary).

The BRD builds it from three connected layers:

- **Enterprise Portfolio Intelligence:** strategy, investment, portfolio health, capacity, risk,
  scenarios and decision support, with an AI copilot in V3.
- **Workspace and Governance Framework:** each company, business unit or operating model runs in its
  own governed workspace, with a configurable lifecycle of stages and gates built from versioned
  templates.
- **Project Execution:** charter, WBS Master, Deliverable Builder, timeline, board, focus list,
  change register, journal and reports, all derived from one WBS.

It is specified as a multi-tenant SaaS: each customer organization is an isolated tenant with its own
users, sign-in methods, plan and data. Every tenant also gets an MCP (Model Context Protocol) server,
so people can ask about and update their projects from the AI tools they already use, with the same
permissions, metric definitions and audit trail as the application.

Two principles hold the layers together: standardize the data and decision language while
configuring the operating workflow, and enter work once in the WBS and derive every other view from
it. AI explains, predicts and recommends from traceable data, and people approve every action.
Metis is meant to sit beside execution tools such as Jira and Azure DevOps, which stay the systems of
record where appropriate, and hosting or training a language model is out of scope. Source:
[BRD Sections 4.4 and 5.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#44-product-principles).

The BRD phases the work. Release 1, the MVP (priority P0), comes first. V2 (P1) adds portfolio
intelligence and investment decisions, and V3 (P2) adds the AI features: the copilot, predictive
risk and recommendations. Source:
[BRD Section 18.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#181-phase-overview).

## Personas

The BRD names sixteen personas. Each row gives the persona's primary need and the views the BRD
attaches to it. Source: [BRD Section 6](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas).

| Persona | Primary need | Key views |
|---|---|---|
| CEO / ExCo | Investment and strategic decisions | Executive cockpit, decision center, scenarios, portfolio value |
| Product Director | Build the right products and manage trade-offs | Portfolio, roadmap, MVP, capacity, dependencies |
| PMO / Portfolio Manager | Govern portfolio health and reporting | Workspace dashboard, registry, governance, CRs, reporting |
| Workspace Owner / Admin | Configure the operating model of a workspace | Settings: fields and options, team and roles, frameworks, templates, data |
| Project Owner / Project Manager | Deliver commitments | Overview, Charter, WBS, Plan, Focus, CRs, Reports |
| Stage Owner / Gate Approver | Stage readiness and formal gate decisions | Gate readiness, evidence, decisions |
| Delivery team member | Know and update assigned work | Focus ("Only mine"), Board, WBS item, comments |
| Client / external stakeholder | Provide inputs, approve deliverables, sign off | Charter (Input Required, sign-off), approvals, shared reports |
| Finance | Budget and forecast control | Investment, actuals, forecast, variance |
| HR / Resource Manager | Capacity and capability planning | Capacity, demand, bottlenecks |
| Business Owner / Sponsor | Business case and outcome | Strategy, KPI, benefits, project health |
| Engineering / Delivery Lead | Delivery feasibility | MVP, WBS, dependencies, capacity |
| Control function (Risk, Finance, Security, Legal, Compliance) | Configured reviews at gates | Gate reviews and evidence |
| Tenant Admin | Run the customer organization's account: users, sign-in, security, plan, AI access | Tenant admin console |
| Provider Operator | Operate the SaaS: tenants, plans, global templates, support | Provider console |
| LLM-assisted user (any persona) | Ask, summarise and log updates in natural language from an LLM client | An MCP client (verified clients listed), My profile, AI access |

Twelve key user journeys involve these personas: eleven in BRD Section 7.9 and the guided onboarding
that the addendum adds. The pages in `journeys/` walk through them.

## Tenants and workspaces

Metis divides what it holds into levels. Source: [BRD Section 7.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#71-unified-hierarchy).

| Level | What it is |
|---|---|
| Platform | The SaaS provider: the shared product, the global template library, plans and operations. |
| Tenant | One customer organization: its users, sign-in methods, plan and limits, data boundary and enterprise layer (strategy, investment, cross-workspace views). It holds one or more workspaces. |
| Workspace | The governance boundary: team and roles, fields and options, lifecycle framework, process frameworks, policies and calendar. |
| Portfolio | A grouping of programs and projects managed as one investment portfolio. |
| Program / Product | An optional grouping of projects, such as a product line or a client account. |
| Project | The unit of delivery: charter, business case, budget, stage instances and baseline. |
| MVP / Release | An optional outcome container with KPIs and release criteria, used by product workspaces. |
| WBS | The single source of truth for a project's work: Category nodes at level 1, then work items (Deliverable, Work Package, Task, Subtask). |

The BRD says Portfolio and Program where the prototype behind it said Space and Folder, a choice it
assumes in decision D-04 until the decision owner confirms or changes it. People reach Metis through
the web application, through the MCP server for LLM clients, and, from V2, through a REST API.

In the BRD the tenant is the isolation unit. Every record, file, search index, cache, report,
export, audit entry and MCP session belongs to exactly one tenant, and no screen, API, MCP tool,
report or AI feature returns another tenant's data (TEN-02). Provider operators run tenants, plans
and global templates without seeing tenant business data (TEN-08). Support reaches tenant data only
through a break-glass grant that a tenant admin approves for named staff, a scope and an expiry, and
can revoke at once (TEN-09). The tenant admin chooses the sign-in methods, manages users and roles,
and sets the security and AI access policies (TEN-03, TEN-04). Source:
[module M02](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m02-tenant--subscription-management-ten).

In the BRD the workspace is where one company, business unit or operating model works under its own
rules. An authorized admin creates it in Draft with a name, owner, time zone and fiscal calendar
(WSP-01). It then moves between Draft, Active, Suspended and Archived, and an archived workspace is
read-only (WSP-05). Its Settings area has five parts: General, Fields and Options, Team, Frameworks
and Data. Users see only the workspaces they are authorized for (WSP-02). Workspaces differ in
lifecycle, approvals and option lists, never in the core data model, so that one data model lets the
enterprise compare and govern them (BRD Sections 3 and 4.4). Source:
[module M03](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m03-workspace-management--configuration-wsp).

## What is built today

Little of the product is built. The BRD and the wireframes of 58 screens are written. The app has
its first screen. The back end (the core, the MCP gateway, the agent, the Keycloak extensions and
the sandbox) and the infrastructure have no code yet.

What a user can do today:

- Run the app where someone builds it from the `metis-app` repository: it is not deployed and has no
  back end. Its development build answers its API requests from a mock server with made-up data:
  `pnpm web` turns the mock server on, and an iOS or Android build turns it on only when it is built
  with `EXPO_PUBLIC_MOCKS=1`. There is no sign-in: the app opens on the overview of a made-up
  project. See
  [Screens call the real API; a mock server answers in mock builds only](../architecture/decisions/mock-server-behind-real-api.md).
- Use one screen of the BRD: screen 24, the project overview of module M10, whose contract names
  OVW-01 to OVW-05, BR-24, BR-32, BR-39 and D-19. Its promise is written in
  `src/screens/24-project-overview/contract.yaml` of `metis-app`. For one project the screen shows
  eight metric tiles, overall progress, a status breakdown, health declared by the PM beside health
  computed from the data, progress by category, workload by person, and three lists of what needs
  attention (upcoming milestones and gates, overdue items, high and critical risks). It reads data
  and edits none. It lays out for desktop, tablet and phone widths, speaks English and Vietnamese,
  and has a state for loading, no access, project not found, server unavailable, expired session,
  invalid data, and data that is stale, partial, unknown or not baselined.
- Move around the shell that frames the screen: a sidebar with the Home, Portfolio and Workspace
  groups and the project tree, a top bar with the breadcrumb, search, New, help, notifications, the
  user's initials and a language select, and a project header with six tabs. On a tablet the sidebar
  shrinks to an icon rail and on a phone it opens as a drawer, and the top bar drops some items.
  Every link except those to the overview opens a page that says the destination is not built, with
  its screen number, its path and the filters it received. Investment, Scenarios, SteerCo, the AI
  copilot and Help carry a Planned V2 or Planned V3 label and open nothing; Share and Export carry
  the label Not built yet. See
  [Final routes, drill filters in the URL, and unbuilt destinations](../architecture/decisions/routes-and-unbuilt-destinations.md)
  and the [front-end foundation spec](../history/specs/2026-10-05-frontend-foundation-spec.md), lines
  236 to 250 of the original.

No other screen exists. The first wave stops at screen 24, and a second wave is planned only after
the owner settles it. See
[Prove one screen end to end before building more](../architecture/decisions/acceptance-screen-first.md).

The app is one code base with three builds, web, iOS and Android. The BRD leaves native mobile
applications out of the MVP ([Section 5.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#52-out-of-scope-for-the-mvp)
and D-19); on 5 Oct 2026 the owner decided on one common base for web, iOS and Android (FE-08,
FE-09). See
[React Native with Expo for web, iOS and Android](../architecture/decisions/react-native-expo-single-codebase.md).

For each module, the pages in `modules/` say what users can do today; for most modules the answer is
nothing yet.

The status of the BRD itself: version 4.5 is a "Draft for business and technology validation" (its
document control table). The third external review, which read BRD v4.4 and addendum v1.0, kept the
conclusion "Go with conditions" ([BRD Section 1.10](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#110-changes-in-v45)).
It proposed to change that to "Go" for Discovery once its eight required refinements were merged
([third external review](../history/reviews/metis-review-vong-3.md), lines 835 and 1142 of the
original), and the disposition shows all of them applied in v4.5
([disposition of the third review](../history/reviews/review-disposition-round3.md), lines 8 and 17
to 24 of the original). Whether the owner recorded "Go" for Discovery is not stated in these
sources.

## Where the requirements live

- The BRD v4.5 ([Markdown edition](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md))
  and the onboarding addendum v1.1 ([Markdown edition](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md))
  are generated from their parts. [`requirements/source/README.md`](requirements/source/README.md)
  says how: edit the parts, never the generated files.
- [`modules/`](modules/) holds one page per BRD module, M01 to M23: what the module is for, what
  users can do today, where the app differs from the BRD, and its open questions. The header `ids`
  of a page lists every requirement id of its module.
- [`journeys/`](journeys/) holds one page per key user journey.
- [`glossary.md`](glossary.md) defines the business terms of both documents.
- [`../architecture/decisions/`](../architecture/decisions/) holds one record per decision, with its
  reasons and its status; [`../design/wireframes/`](../design/wireframes/) holds the 58 wireframe
  screens.

For what is built, trust a module page over the BRD edition: the module page records where the app
differs from the BRD.

## Open questions

**Order of the decisions.** The BRD orders its own decisions ([Section 19.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register))
and the addendum orders its own ([Section 17.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#171-decisions)),
and neither gives one order for both. The third external review proposed one
([lines 837 to 847 of the original](../history/reviews/metis-review-vong-3.md)):

| Group | Decisions | Why |
|---|---|---|
| Taken, in the review's words | D-32, D-37 | The AI direction and the priority of CHG-10. |
| Foundation, before the schema, infrastructure and security freeze | D-28, D-20, D-03, D-15, D-33, D-34, D-38, D-31 | Tenant isolation, region, identity, permissions, provider, audit, retention and legal shape the architecture. |
| Data and onboarding design, in Discovery | D-36, D-39, D-26 | Starting packs, the accuracy threshold and the non-functional targets need assumptions about the document corpus and the pilot. |
| Release design, before the matching implementation | D-35, D-29, D-30, D-09, D-07 | The contracts for undo, tokens, MCP tools, process frameworks and durations. The review reads D-09 as effectively decided and asks to record it as confirmed. |
| Before the external client path | D-02 | It does not block core release 1A; it blocks client access (PLT-02) at 1B. |

The review adds that D-33 and D-38 belong with the foundation group, because the P0 onboarding sends
customer content out of the product from Release 1; the addendum already pulls both forward into
that group. The BRD assumes each recommendation of its register until the decision owner confirms or
changes it; the two registers mark only D-09 (its authoring part, confirmed on 3 Oct 2026) and D-32
(decided on 2 Oct 2026) as settled. Which order the owner follows is not recorded in these sources.

**Team shape.** Assumption A-07 gives the delivery capacity as an agency team of about 40
developers working in parallel workstreams, with the full scope kept
([BRD Section 5.3](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#53-assumptions)).
Section 18.2 draws seven workstreams, each with a tech lead and a QA counterpart, and Section 20
adds a product owner per stream. The split of the team across the workstreams is set in Discovery
(Section 18.2). Whether the 40 people form one cross-functional team is not stated in these
sources.

**Per module.** The BRD lists 13 open questions of its own ([Section 19.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions))
and the addendum 6 ([Section 17.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#172-open-questions)).
Questions that concern one module are on its page in `modules/`, among them the questions about the
screen that is built.
