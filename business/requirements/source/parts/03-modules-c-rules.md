
# 11. Portfolio & Enterprise Intelligence Requirements

## M15 Executive Portfolio Cockpit & Workspace Dashboard (EXE)

Purpose: the CEO-first control tower (v2.0) and the workspace dashboard (v3.0). In the MVP the cockpit works within one workspace at a time; the cross-workspace executive view follows in V2.

Wireframes: {{WF:EXE}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| EXE-01 | **Executive KPI summary.** Total projects, portfolio investment, FTE, expected value and realized value, each with its data as-of time (BR-39). | (1) Values aggregate correctly from approved portfolio records; value tiles show "not tracked" until benefits are captured (INV-02). (2) A tile fed by data older than the workspace freshness threshold is marked stale; a tile missing some projects' data is marked partial and names them. | P0 | v2 FR-001; RF-31 |
| EXE-02 | **Executive attention queue.** Missing status reports, green-but-risky projects, overdue milestones, overdue gates, pending and approved-but-unapplied CRs, capacity overloads and material budget variance. | Each item has owner, reason, severity and next action (decide, review, rebalance or remind). | P0 | v2 FR-002; v3 §8; RF-42 |
| EXE-03 | **Portfolio health.** Overall and dimension-level health: delivery, risk, resource and financial in the MVP; strategic in V2. | Health is calculated consistently, drillable to projects, and shows which projects have stale or missing status data. | P0 | v2 FR-003; RF-31 |
| EXE-04 | **Executive decision center.** Projects recommended for START, CONTINUE, ACCELERATE, DELAY or STOP. | Each recommendation includes rationale and supporting evidence (BR-10). | P1 | v2 FR-004, §6.2 |
| EXE-05 | **Workspace dashboard.** Portfolio health, investment, capacity, risk, governance exceptions and upcoming gates; delivery pipeline showing projects per lifecycle stage, overdue gates and blocked projects. | Pipeline counts equal the projects' current stages. | P0 | v3 WS-005, §11 |
| EXE-06 | **Cross-workspace executive view.** Enterprise cockpit across workspaces with governance health per workspace. | Data shown respects record-level permissions (BR-20). | P1 | v3 §14 (M01), WS-008 |

## M16 Portfolio & Project Registry (REG)

Wireframes: {{WF:REG}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| REG-01 | **Project master record.** Unique project ID, name, description, workspace, portfolio, program, owner, sponsor, account or business unit, status and framework version. | A project cannot be duplicated; required fields are validated. | P0 | v2 FR-101; v3 §14 (M02) |
| REG-02 | **Search and filter.** Search by project ID or name; filter by workspace, portfolio, program, owner, health, lifecycle stage, strategic objective, business unit and status. | Results update without page reload. | P0 | v2 FR-102; v3 §14 (M02) |
| REG-03 | **Portfolio hierarchy.** Projects are grouped under portfolios (Spaces) and programs or products (Folders). | Each project has one primary portfolio and optional secondary tags. | P0 | v2 FR-103; POC 02 |

## M17 Portfolio Roadmap (RMP)

Wireframes: {{WF:RMP}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| RMP-01 | **Portfolio roadmap.** Projects, MVPs and major milestones over 12-24 months. | Quarter and month zoom; filtering. | P0 | v2 FR-401 |
| RMP-02 | **Dependency overlay.** Cross-project dependencies on the roadmap. | Dependency conflicts are visually identifiable. | P0 | v2 FR-402 |
| RMP-03 | **Strategic theme overlay.** Group the roadmap by strategic objective and investment theme. | Every committed project maps to an objective or is explicitly exempt. | P1 | v2 FR-403 |
| RMP-04 | **Lifecycle overlay.** Stages, gate dates and governance milestones on the roadmap. | Gate dates appear for every project with a published framework. | P1 | v3 §14 (M05) |

## M18 Resource & Capacity (RES)

Purpose: FTE capacity and demand by person and capability. The POC only counts open items per PIC (OVW-03); FTE planning needs capacity data and allocations. In the MVP, capacity is maintained in the platform or imported from a file; the HR integration follows in V2.

Wireframes: {{WF:RES}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| RES-01 | **Capacity dashboard.** Capacity, demand, utilization and gap by person, department and capability. | Utilization is calculated from active allocations and capacity. | P0 | v2 FR-501 |
| RES-02 | **Bottleneck detection.** Resources or capabilities above configurable utilization thresholds. | Overload items link to the projects causing the demand (BR-07). | P0 | v2 FR-502 |
| RES-03 | **Capacity and allocation records.** Resource Managers maintain capacity per person or capability and period; PMs record project allocations (FTE per person or capability per period); import from file. | Demand equals the sum of active allocations for the period. | P0 | v2 FR-501, §13; New |
| RES-04 | **Scenario capacity.** Simulate the impact of adding or removing projects or changing allocations. | Scenarios never change the baseline until approved (BR-11). | P1 | v2 FR-503 |
| RES-05 | **Stage-specific demand.** Demand and capability needs by lifecycle stage. | Demand can be viewed per stage. | P1 | v3 §14 (M06) |

## M19 Investment & Benefits (INV)

Project-level budget, actual and forecast are P0 in the charter (CHR-13) and roll up as simple sums in the MVP cockpit. This module adds portfolio investment management in V2.

Wireframes: {{WF:INV}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| INV-01 | **Investment tracking.** Approved budget, actual, forecast, CapEx and OpEx, and variance by project and portfolio. | Portfolio totals reconcile with project-level records. | P1 | v2 FR-801 |
| INV-02 | **Benefits.** Expected and realized benefits linked to KPIs. | Benefit owner and measurement date are required. | P1 | v2 FR-802 |
| INV-03 | **Value at risk.** Expected value at risk for delayed, over-budget or low-health initiatives. | The method is documented and configurable. | P1 | v2 FR-803 |
| INV-04 | **Funding checkpoints.** Configured stage gates act as funding checkpoints. | Funding release is recorded against the gate decision. | P1 | v3 §14 (M09) |

## M20 Strategy, Prioritization & Scenario Planning (STR)

Wireframes: {{WF:STR}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| STR-01 | **Strategy model.** Strategic pillars, objectives, KPIs and targets, linked to portfolios and projects (golden thread). The MVP uses a simple objective list (CHR-15). | Every committed project traces to an objective or exemption. | P1 | v2 §4.1, §6.1, BR-02 |
| STR-02 | **Portfolio score.** Score initiatives on strategic alignment, customer value, financial value, risk, urgency and feasibility. | The score is transparent, weighted and auditable. | P1 | v2 FR-901 |
| STR-03 | **Investment scenario.** Model budget reductions or increases and show project, resource and value impact. | Scenario results do not alter the approved baseline. | P1 | v2 FR-902 |
| STR-04 | **Resource scenario.** Simulate capacity changes and identify projects delayed or accelerated. | The impact chain is traceable. | P1 | v2 FR-903 |
| STR-05 | **Lifecycle-aware evaluation.** Evaluate projects by lifecycle stage and governance readiness. | Stage and gate readiness are scoring inputs. | P1 | v3 §14 (M10) |

## M21 Analytics & Executive Reporting (ANL)

Wireframes: {{WF:ANL}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| ANL-01 | **SteerCo pack.** Executive portfolio review with health, investment, capacity, risks, decisions and changes. | The pack can be generated for a selected period and portfolio. | P1 | v2 FR-1001 |
| ANL-02 | **Weekly portfolio report.** Changes since the previous week and exceptions requiring action. | Only material changes and exceptions are highlighted. | P1 | v2 FR-1002 |
| ANL-03 | **Drill-down analytics.** Move from a portfolio metric to the project and source record. | Every KPI has lineage to underlying data. | P1 | v2 FR-1003 |
| ANL-04 | **Governance analytics.** Stage distribution, bottlenecks, gate failures, cycle time, gate throughput, rework and compliance by workspace (KPIs in Section 12.4). | Figures can be filtered by workspace and framework version. | P1 | v3 GF-013, §14 (M11), §15 |
| ANL-05 | **Cross-workspace benchmarks.** Compare workspaces and framework versions where policy permits. | Benchmarks only include workspaces that opted in. | P2 | v3 §15, §16 |

## M22 AI Portfolio Copilot (AIC)

Wireframes: {{WF:AIC}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| AIC-01 | **Portfolio Q&A.** Natural-language questions across strategy, projects, resources, investment and risk. | Answers cite the underlying portfolio records. | P2 | v2 FR-1101 |
| AIC-02 | **Recommendations.** Recommend stop, accelerate, fund or delay actions from configured decision rules. | Each recommendation includes evidence, assumptions and confidence. | P2 | v2 FR-1102 |
| AIC-03 | **Scenario assistant.** Interpret what-if questions and generate scenario proposals. | No baseline change without explicit human approval. | P2 | v2 FR-1103 |
| AIC-04 | **Governance copilot.** Answer workspace-rule and gate-readiness questions; suggest framework improvements. | Suggestions cite the analytics they are based on. | P2 | v3 §14 (M12), §16 |
| AIC-05 | **Predictive risk.** Predict delivery and gate risk from historical patterns. | Predictions show confidence and contributing factors. | P2 | v2 §15; v3 §16 |
| AIC-06 | **Automated narrative.** Draft weekly and SteerCo narratives from data and journal entries for human review. | Drafts are never published without human approval. | P2 | v2 §15 |

# 12. Metric Definitions & KPIs

## 12.1 Project metric definitions

All project views, reports, portfolio roll-ups and MCP tools use these definitions (BR-32, MCP-10). "Work item" means any WBS node that is not a Category node. "Today" is the user's date in the workspace timezone.

| Metric | Definition | Used in |
|----------------------|------------------------------------------------------------------|----------------------|
| Total work items | Count of work items (Category nodes excluded) | OVW-01, RPT-03 |
| Deliverables | Work items with Type = Deliverable | OVW-01, CHR-05 |
| Work packages | Work items with Type = Work Package | OVW-01 |
| Milestones | Work items labelled Milestone | OVW-01, OVW-03 |
| Gates (deliverable) | Work items labelled Approval Gate; lifecycle gates are counted separately as "Lifecycle gates due" | OVW-01, EXE-05 |
| Overall progress % | Done work items ÷ total work items × 100 (count-based) | OVW-02, RPT-03 |
| Progress by Category | Per Category: Done work items ÷ work items in that Category | OVW-02 |
| In progress | Work items whose Status maps to "In progress" | OVW-06, RPT-03 |
| Blocked | Work items whose Status maps to "Blocked" | OVW-01 |
| Overdue | Work item not Done and Target Date before today | OVW-03, OVW-06, PLN-02 |
| Days overdue | Today − Target Date, in calendar days | OVW-06 |
| Delayed | Work item not Done whose current Target Date is later than its baseline Target Date; shown as "not baselined" before CHG-06 | OVW-01, EXE-02 |
| High risk | Work items with Risk Level High or Critical | OVW-01, OVW-03 |
| Due today | Not Done and Target Date = today | OVW-06 |
| Due this week | Not Done and Target Date within the next 7 days (rolling) | OVW-06, RPT-02 |
| Starting this week | Status maps to "Not started" and Start Date within the next 7 days (rolling) | OVW-06 |
| Upcoming milestones and gates | Not Done items labelled Milestone or Approval Gate with Target Date today or later, earliest first | OVW-03 |
| Workload by PIC | Count of not-Done work items per PIC | OVW-03 |
| Duration | Target Date − Start Date + 1, in calendar days or working days (D-07) | WBS-15 |
| Dependency conflict | Evaluated only when both compared dates exist (FS: predecessor Target and successor Start; SS: both Starts; FF: both Targets; SF: predecessor Start and successor Target); a missing date gives "schedule data incomplete" (BR-40) | WBS-13, RSK-03 |
| MVP progress % | Done work items linked to the MVP ÷ work items linked to the MVP × 100; "no linked work" when none are linked | MVP-03 |
| MVP health | The worst of its scope, schedule, resource and dependency health; a dimension without data shows "unknown" and does not count as Green | MVP-03 |
| Data as-of time | Time of the newest change included in a figure; "stale" when older than the workspace freshness threshold, "partial" when some included projects lack data (BR-39) | EXE-01, EXE-03, RPT-03 |

## 12.2 POC discrepancies these definitions remove

Observed in the POC data of 22 Sep 2026 (one project, 18 WBS rows of which 6 are Category rows):

| Observation | Evidence | Cause | Fix |
|------------------------------------|------------|------------------------------|----------------------|
| Overview progress 22% (4 of 18) while the Weekly Status report shows 25% (3 of 12) | POC 02, 28 | The Overview counts the 6 Category rows as items; the report excludes them | Category nodes excluded everywhere (BR-24) |
| "Deliverables 6" tile while Charter V says "No items with Type = Deliverable yet" | POC 02, 06, 32 | Category rows are stored with Type = Deliverable (Settings: Deliverable 6, Work Package 4, Task 8 = 18) | Category is its own node kind; Deliverables count Type = Deliverable work items |
| "Delayed 0" while 9 items are overdue | POC 02, 03, 29 | "Delayed" is not date-based and undocumented | Delayed = slipped against baseline; Overdue = past target |
| "Upcoming Milestones & Gates" lists items 20 to 60 days in the past | POC 03 | No date filter on "upcoming" | Upcoming = target today or later; late items appear under Overdue |
| High & Critical risk list includes Category rows (4.0 Timeline, 6.0 Risks) | POC 03 | Category rows carry a Risk Level | Risk counted on work items only |
| Board shows 9 open items while the status donut shows 14 not done | POC 02, 23 | Same Category-row cause | One definition set for all views |

## 12.3 Portfolio KPIs

| KPI | Definition | Target direction |
|----------------------------|------------------------------------------------------------------|--------------|
| Portfolio health | Weighted health across strategic, financial, delivery, resource and risk dimensions | ↑ |
| Strategic alignment coverage | % committed projects linked to approved objectives | 100% |
| Budget variance | Forecast versus approved budget | ↓ |
| Schedule variance | Forecast milestone completion versus baseline | ↓ |
| Capacity utilization | Demand ÷ available capacity | Within threshold |
| Critical resource bottlenecks | Number of capabilities above the critical threshold | ↓ |
| Critical portfolio risks | Number of critical risks | ↓ |
| Green-but-risky rate | Projects declared Green while the risk engine says Amber or Red | ↓ |
| Change request cycle time | Median time from CR submission to decision | ↓ |
| Approved-not-applied CRs | Approved CRs not yet applied to the baseline beyond the threshold | ↓ |
| Benefit realization | Realized benefit ÷ expected benefit | ↑ |
| Decision lead time | Time from portfolio exception to executive decision | ↓ |
| Reporting compliance | Projects submitting weekly status on time | ↑ |
| Client commitment reliability | Input Required items delivered by their target date | ↑ |

## 12.4 Workspace governance KPIs

| KPI | Definition |
|------------------------------|------------------------------------------------------------------|
| Stage cycle time | Planned versus actual stage duration |
| Gate outcome rate | Share of Pass, Pass with Conditions and Rework decisions |
| First-pass gate approval rate | Gates passed at the first submission |
| Governance waiting time | Time waiting for a governance decision |
| Stage bottlenecks | Stage volume and ageing |
| Mandatory evidence completion | Mandatory artifacts complete at gate submission |
| Waiver rate | Exceptions and waivers granted; overdue waivers |
| Framework compliance | Compliance rate by workspace |
| Gate rework | Rework caused by failed gates |
| Framework-version impact | Effect of a framework version on cycle time, quality and outcomes |
| Cross-workspace benchmarks | Comparisons where policy permits |

## 12.5 Metric versions, freshness and snapshots

- Every metric definition in this section carries a version. A changed definition is published as a new version with its effective date; it never silently changes past figures.
- Every dashboard, report, PDF and MCP answer states the data as-of time and the metric version it used (BR-39).
- Saved reports, PDFs, weekly status submissions and gate packs are snapshots: they keep the figures, as-of time and metric version they were generated with (PLT-16, RPT-03).
- Each workspace sets freshness thresholds (for example for weekly status and capacity data); views mark stale and partial data instead of hiding it.

# 13. Business Rules

| ID | Business rule | Source |
|-------|----------------------------------------------------------------------------|----------------------|
| BR-01 | Every committed project must have an owner and a sponsor. | v2 BR-01 |
| BR-02 | Every committed project must have a strategic objective or an approved exemption. | v2 BR-02 |
| BR-03 | Every committed project must have a baseline budget and target date. | v2 BR-03 |
| BR-04 | Baseline scope, dates, budget and critical dependencies are locked after commitment. Before commitment the plan is freely editable and the CR register is advisory. | v2 BR-04; v3 §13; POC 24 |
| BR-05 | Changes to locked fields require an approved CR; applying it creates a new baseline version that references the CR. | v2 BR-05; v3 §13; D-08 |
| BR-06 | Every MVP must have a measurable outcome or KPI and release criteria. | v2 BR-06 |
| BR-07 | Resource utilization thresholds are configurable by capability and organization. | v2 BR-07 |
| BR-08 | A project cannot be shown Green if critical risk rules force Amber or Red, unless an explicit override with rationale is recorded. | v2 BR-08 |
| BR-09 | A missing weekly status submission creates an exception item. | v2 BR-09 |
| BR-10 | Portfolio recommendations are advisory until an authorized executive approves the decision. | v2 BR-10 |
| BR-11 | Scenario analysis must not alter approved baseline data. | v2 BR-11 |
| BR-12 | All approvals and governance decisions must be auditable. | v2 BR-12 |
| BR-13 | A project cannot be created without a workspace. | v3 §13 |
| BR-14 | Every active workspace has one published default lifecycle framework. | v3 §13 |
| BR-15 | A project instantiated from a framework stores the exact framework version used. | v3 §13 |
| BR-16 | Editing a template never retroactively alters existing project stage instances; moving a project to a new version needs an approved migration. | v3 §13, TPL-009 |
| BR-17 | A governed stage cannot be Complete while mandatory exit criteria are incomplete, unless an approved and unexpired waiver exists. | v3 §13 |
| BR-18 | Gate decisions are immutable after approval except through a correction workflow. | v3 §13 |
| BR-19 | Workspace configuration changes require role-based authorization and audit logging. | v3 §13 |
| BR-20 | Cross-workspace reporting respects record-level permissions. | v3 §13 |
| BR-21 | Archived workspace configurations and historical gate decisions remain auditable and read-only. | v3 §13 |
| BR-22 | The WBS is the single source of truth for project work; charter sections V-VI, Overview, Timeline, Board, Focus and Reports are derived views and hold no divergent copy of WBS data. | POC 06; Survey §00 |
| BR-23 | Dependencies are constraints that flag conflicts; the system never moves dates automatically. | POC 20, 25 |
| BR-24 | Category nodes are grouping nodes: excluded from work-item counts, progress and KPIs; their dates and progress roll up from their children. | New (Section 12.2) |
| BR-25 | Renaming a configurable option updates every item using it; an option in use cannot be deleted without choosing a replacement; options with a system meaning cannot be deleted. | POC 32; D-14 |
| BR-26 | Removing a member keeps their name on existing items and history and revokes their access immediately. | POC 34; New |
| BR-27 | Importing a project file never overwrites existing data; it creates a new project. | POC 36 |
| BR-28 | The requester of a CR cannot be its sole approver unless workspace policy explicitly allows self-approval for operational changes. | POC 25; New |
| BR-29 | A submitted CR cannot be deleted; it is withdrawn or closed with a reason. | POC 25; New |
| BR-30 | Every CR decision and gate decision records a rationale. | v2 FR-703, FR-704; v3 GF-008; POC 25 |
| BR-31 | Generating items from a process framework never overwrites existing WBS items that have progress, effort or comments. | Survey §05; New |
| BR-32 | Every KPI shown in the product or returned through MCP follows the definitions in Section 12 and is drillable to its underlying records. | v2 FR-1003, §18; New |
| BR-33 | Every record belongs to exactly one tenant; no query, report, export, search, MCP call or AI feature crosses tenants. | New (A-06) |
| BR-34 | Actions through MCP or the API are attributed to the token's user, recorded with the token and client name, and never exceed the user's permissions. | New (A-06) |
| BR-35 | Approvals, decisions, baseline application, deletions and permission or token changes require a person acting in the application; MCP clients can only prepare them. | New (A-06); v2 BR-10 |
| BR-36 | Access tokens are shown once, stored hashed, always expire, and are revoked when the user is deactivated or the tenant is suspended. | New (A-06) |
| BR-37 | Provider staff cannot access tenant business data without a time-limited, audited support grant from a tenant admin. | New (A-06) |
| BR-38 | Plan limits block only the limited action; they never block reading or exporting a tenant's own data. | New (A-06) |
| BR-39 | Every dashboard, report, PDF and MCP answer states the data as-of time and the metric version it used; saved outputs are snapshots. | RF-08, RF-18, RF-31 |
| BR-40 | A dependency conflict is flagged only when both compared dates exist; otherwise the link shows "schedule data incomplete". | RF-09, RF-33 |
| BR-41 | Every drag-and-drop or canvas action has a keyboard equivalent, enumerated in a parity matrix per editor (one row per operation, with its gesture, its keyboard command, its list-view action and the server command), so the equivalence is testable row by row rather than asserted. | RF-35, RF-36, RF-47; BLD-13 |
| BR-42 | The server enforces gate eligibility: a gate decision or stage advance that fails mandatory criteria without a valid waiver is rejected from every channel (application, API, MCP). | RF-10, RF-28 |

# 14. Roles & Permissions

One role model replaces the v2.0 role table, the v3.0 workspace roles and the POC access labels (Admin, Member). Roles are assigned per workspace and, where needed, per project; permissions are enforced on the server (PLT-04).

| Role | Scope | Create / edit | Approve / decide | View |
|--------------------|--------------|------------------------------|------------------------------|----------------------|
| Provider Operator (SaaS) | Platform | Tenants, plans, global template library, feature flags, service notices | Publication of global templates | Tenant metadata and usage; business data only through a support grant (BR-37) |
| Tenant Admin | Tenant | Users and roles, sign-in and security policies, workspaces, AI access policy, branding | Support access grants | Tenant configuration, usage and audit log; business data only through assigned roles |
| Workspace Owner (POC "Admin") | Workspace | Profile, members and roles, fields and options, frameworks and templates, policies | Publication of workspace frameworks; waivers per policy | All workspace data |
| Executive / ExCo | Enterprise or assigned workspaces | Decisions, strategic priorities | Portfolio decisions, major CRs | All enterprise data in scope |
| Portfolio Manager / PMO | Portfolios | Portfolio and project governance, registry, reporting cadence | Portfolio-level CRs within authority; delegated gate decisions | All portfolio data |
| Product Director | Products and programs | Projects, MVPs, roadmaps | Product and project decisions | Assigned items and portfolio summary |
| Project Manager / Project Owner | Project | Charter, WBS, plan, risks, CRs, journal, reports, weekly status; process framework drafts of the workspace (BLD-16) | Operational changes within delegated authority | Assigned projects |
| Stage Owner | Stage instance | Stage evidence and readiness | None | Assigned projects |
| Gate Approver | Gate | Gate decision records | Gate decisions within delegated authority | Projects with pending gates |
| Control function (Risk, Finance, Security, Legal, Compliance) | Configured gates | Reviews and evidence | Control approvals where configured | Projects under review |
| Finance | Portfolio investment | Budget, actuals, forecast | Financial controls | Portfolio investment |
| Resource Manager | Capability pools | Capacity and allocations | Resource changes | Resource views |
| Business Owner / Sponsor | Owned initiatives | Business case, KPI, benefits | Business acceptance; sponsor approvals | Owned initiatives |
| Team member (POC "Member") | Member projects | Assigned work items (status, effort, comments, files), journal entries | Item reviews or approvals when named Reviewer or Approver | Projects they belong to |
| Client / external stakeholder (D-02) | Invited projects | Comments; files on their Input Required items | Client approval gates and charter sign-off where named | Shared views of invited projects only |
| Viewer | Granted scope | None | None | Approved read-only views |

Permission principles: least privilege; record-level access by tenant, workspace, portfolio and project; segregation of duties for approvals (BR-28); every permission change is audited (PLT-11). An LLM client connected through MCP has no role of its own: it acts as the token's user within the token's scopes (MCP-04) and cannot take governance actions (BR-35). Effective permissions are the union of the roles a user holds at workspace level and on a project, within tenant policy: a project role adds rights on that project and never removes rights granted at workspace level; external users (Client) hold project roles only (recommendation assumed for D-15).

The role model is maintained as a machine-readable permission matrix (role, action, scope, approval threshold) that drives server enforcement, generated permission tests and this table (D-15, Appendix G).

Roles and member titles are also the values a process framework node can carry as an assignment selector (BLD-14): the framework names a role or a title, and the build resolves it against the project's members with three possible outcomes, resolved, missing or ambiguous. A selector is not a permission: resolving one assigns work, never access, and a role granted to a person still follows this table and the permission matrix.

# 15. Conceptual Data Model & Reference Data

## 15.1 Entities

| Entity | Key attributes | Relationships |
|--------------------|------------------------------------------------------|------------------------------------|
| Tenant | ID, organization name, verified domains, plan, region, lifecycle state, sign-in settings | Contains workspaces, users, tokens, audit log |
| Plan and entitlement | Plan name, enabled modules, limits (seats, workspaces, storage, MCP calls) | Assigned to tenants |
| Workspace | ID, name, company/BU, owner, status, timezone, currency, calendars, cadence | Belongs to a tenant; contains portfolios, members, option lists, frameworks |
| Portfolio (Space) | Name, owner, budget, priority | Belongs to a workspace; contains programs and projects |
| Program / Product (Folder) | Name, owner, roadmap | Belongs to a portfolio; contains projects and MVPs |
| Project | ID, name, client/BU, PM, owner, sponsor, dates, status, project number, contract value, framework version | Belongs to a workspace, portfolio and optional program |
| Charter revision | Revision number and description, sections I-IV and VIII, sign-offs | Belongs to a project; sections V-VI derived from WBS |
| Key contact | Role, name, email, phone | Belongs to a project |
| Business case | Problem, opportunity, customer, rationale, alternatives, benefits, assumptions | Belongs to a project |
| Strategy / strategic objective | Pillar, objective, KPI, target | Linked to portfolios and projects |
| MVP / release | Objective, problem, scope, release date, KPI, owner, expected benefit | Belongs to a project or product; links features (work items) |
| WBS node | Internal ID, code, parent, kind (Category or work item), type, phase, labels, name, description, inputs, outputs, PIC, reviewer, approver, dates, planned and actual effort, status, priority, risk level, notes, framework provenance | Belongs to a project; tree structure |
| Dependency | Predecessor, successor, type (FS, SS, FF, SF) | Between WBS nodes, MVPs or milestones, within or across projects |
| Baseline | Version, captured scope, dates, budget, critical dependencies, CR reference | Belongs to a project |
| Change request | Ref, requester, type, priority, what, why, affected items, impacts, proposed action, effective date, approver, status, decision notes, history | Belongs to a project; references baseline fields and WBS nodes |
| Decision | Type, rationale, evidence, approver, date | Linked to portfolio, project, CR or gate |
| Journal entry | Type, text, author, timestamp, linked WBS node | Belongs to a project |
| Report | Template, period, sections, title, content, preparer | Belongs to a project; a weekly status submission is a published report |
| Activity event / comment | Actor, timestamp, change or comment text, mentions, attachments | Belongs to a WBS node |
| Attachment / doc link | File or URL, name, owner, size, type | Belongs to a WBS node, comment or project (Docs & Links) |
| Risk | Description, probability, impact, score, severity, owner, mitigation, due date, status | Linked to project, MVP, milestone or WBS node |
| Resource / capacity | Person or capability, capacity per period, cost | Allocated to projects and MVPs |
| Allocation | Project, person or capability, period, FTE | Links resources to projects |
| Budget | Approved, actual, forecast, variance, CapEx/OpEx | Linked to project and portfolio |
| Benefit | Expected, realized, owner, measurement date | Linked to objective, project or MVP |
| Member / role assignment | User, title, email, roles, status | Belongs to a workspace; optional project scope |
| Option list value | List, value, order, system meaning, usage count | Belongs to a workspace |
| Lifecycle framework | ID, workspace, version, status, effective date, parent version, change summary, publisher | Contains stages, gates, rules; referenced by projects |
| Lifecycle stage | Name, sequence, type, SLA, entry and exit criteria, owner role | Belongs to a framework; instantiated per project |
| Gate | Decision options, approvers, quorum, criteria | Belongs to a stage; records decisions |
| Stage artifact | Type, mandatory flag, owner, status, evidence | Required by a stage or gate |
| Stage rule | Condition, action, threshold | Controls routing and escalation |
| Project stage instance | Project, stage, dates, status, readiness | Instantiates a framework stage |
| Gate decision | Decision, rationale, approver, timestamp, evidence, conditions | Linked to gate, project and Decision Log |
| Exception / waiver | Rule, reason, approver, expiry | Temporarily overrides a governance rule |
| Process framework | ID, workspace, name, description, built-in flag, status (Draft, Published, Deprecated), version, effective date, parent version, change summary, publisher, source framework | Belongs to a workspace; contains lanes, nodes and connections; used by the Deliverable Builder; referenced by Blueprints and generated items (BLD-10) |
| Framework lane | Name, order, label, type | Belongs to a process framework (BLD-13) |
| Framework node | Name, lane, parent node, type, labels, description, inputs, outputs, offset, duration, planned effort, PIC, Reviewer and Approver as assignment selectors, priority, risk level | Belongs to a process framework; becomes one WBS item per build (BLD-14) |
| Assignment selector | Kind (workspace role or member title), role identifier or normalized title, display text, alias of a renamed title | Held by a framework node for PIC, Reviewer or Approver (BLD-14, D-40) |
| Selector resolution | Selector, project, outcome (resolved, missing, ambiguous), matched member or candidate list, chosen member and who chose | Produced per node by a build preview; recorded on the generated item (BLD-12, BLD-14) |
| Framework connection | From node, to node, dependency type, lag, route points | Belongs to a process framework; becomes one dependency per build (BLD-15) |
| Blueprint | Canvas layout, nodes, connections, connection points | Belongs to a deliverable |
| Notification | Recipient, trigger, channel, status | Linked to the triggering record |
| Access token | Name, owner, scopes, workspace or project restriction, hash, created, expiry, last used, status | Belongs to a user; used by MCP and the REST API |
| OAuth client authorization | Client name and ID, user, granted scopes, consent time | Belongs to a user |
| MCP call record | User, token or client, tool, parameter summary, result, time, linked record | Part of the tenant audit log |
| Support access grant | Provider staff member, case, reason, scope, approver, start, expiry, revoked at, actions taken | Requested by the provider, approved by a tenant admin |
| Saved view | Name, owner, shared flag, filters, columns, sort, expansion | Belongs to a user or a project (WBS-20) |
| Metric definition | Metric, formula, version, effective date | Referenced by every figure, report and MCP answer (BR-39) |
| Snapshot | Source (report, PDF, submission, gate pack), as-of time, metric version, content, file | Belongs to a project or portfolio |
| MCP client policy | Allowed clients, allowed workspaces, maximum token lifetime, grantable scopes per role | Belongs to a tenant (MCP-20) |

## 15.2 Reference data and defaults

| List | Default values | Configurable | System meaning |
|----------------|----------------------------------------------------------|--------------|------------------------------|
| Category | Deliverables, Technical, Quality, Timeline, Resource, Risk, Communication | Yes | Grouping only (BR-24) |
| Type | Deliverable, Work Package, Task, Subtask (product workspaces may add MVP feature types) | Yes | Deliverable feeds Charter V |
| Label | Milestone, Checkpoint, Approval Gate, Input Required, Risk Related | Add new; built-ins keep their meaning | Milestone and Approval Gate feed milestone and gate views; Input Required feeds Charter VI; Risk Related links to the risk register |
| Phase | From the lifecycle framework. Creative production: Initiation, Planning, Production, Review, Delivery, Closing. Company A: Discovery, Design, Solution, Development, Test, GTM, Retro | Through the framework | Stage instances and gates |
| Status | Not Started, In Progress, Waiting, Blocked, Done | Yes | Each value maps to a system state (WSP-08) |
| Priority | Low, Medium, High, Critical | Yes | None |
| Risk Level | Low, Medium, High, Critical | No | High and Critical count as High risk |
| Dependency type | FS, SS, FF, SF | No | Conflict rules |
| Journal entry type | Note, Meeting, Decision, Issue, Highlight | No | Decision entries can be promoted to the Decision Log |
| CR type | Scope, Schedule, Budget, Resource, Dependency, Other | Yes | None |
| CR status | Draft, Under Review, Approved, Approved pending application, Rejected, Deferred, Withdrawn, Closed | No | Drives counters and attention items |
| Gate decision | Pass, Pass with Conditions, Rework, Hold, Reject | No | Drives stage progression |
| Workspace state | Draft, Active, Suspended, Archived | No | Archived = read-only |
| Report template | Weekly Status, Executive Summary, Full History, Custom | Custom templates can be added | Weekly Status is the default submission template |
| Key contact roles | Approved Representative, Contracting Officer Representative, Key Contact | Yes | None |
| Tenant state | Trial, Active, Suspended, Cancelled, Deleted | No | Suspended = read-only; Cancelled = export window |
| Token scopes | portfolio:read, projects:read, wbs:read, wbs:write, journal:write, comments:write, changes:read, changes:draft, risks:read, risks:write, reports:read, reports:write | Tenant admins restrict them by role | Decisions are prepare-only for every scope |
| Channel | Web, MCP, API | No | Recorded on every audit entry |
| MCP action class | Read, Append-only, Reversible write, Prepare-only | No | Sets confirmation, undo and audit behaviour (MCP-19) |
| Confirmation mode | per_call, batch_launch | No | Policy metadata beside the action class: a governance action confirmed per call, or a batch of staged proposals confirmed by one later approval (MCP-19) |
| Assignment selector kind | Workspace role, Member title | No | What a process framework node names for PIC, Reviewer or Approver (BLD-14, D-40) |
| Selector resolution | Resolved, Missing, Ambiguous | No | The outcome of matching a selector against a project's members; ambiguous blocks the build until a person chooses (BLD-14) |

Sample and fixture data: each sample tenant (Acme Holdings in this document, and the onboarding samples of the addendum) has its own identifier namespace, and no email address, project identifier or person is reused across sample tenants unless a test deliberately checks isolation. Fixtures that share identifiers across tenants by accident make a cross-tenant leak look like correct behaviour, which is exactly what the isolation suite is meant to catch (TEN-02).

# 16. Integration Requirements

| System | Purpose | Direction | Pri | Source |
|--------------------|--------------------------------------------------|--------------------|------|--------------|
| Identity / SSO (per tenant) | Authentication and role mapping through each tenant's identity provider (SAML 2.0 or OIDC) | Inbound | P0 | v2 §13; TEN-03 |
| LLM clients (MCP) | Natural-language access by LLM clients that implement MCP, within the tenant's client policy (MCP-20) | Inbound (MCP server) | P0 | S4; M05; RF2-12 |
| User provisioning (SCIM) | Users and groups from the tenant's identity provider | Inbound | P1 | TEN-11 |
| Payment provider | Self-serve subscriptions and invoices | Outbound + webhook | P1 | TEN-14; D-27 |
| Email | Invitations, notifications, approval requests | Outbound | P0 | v2 §13; PLT-03, PLT-09 |
| Finance / ERP | Actual spend, budget, forecast | Inbound + controlled outbound | P1 | v2 §13 |
| HR / Resource | People, roles, capacity, org structure | Inbound | P1 | v2 §13 |
| Jira / Azure DevOps | Execution progress, issues, sprint and release data | Inbound + link | P1 | v2 §13; Survey §11 |
| Chat (Slack, Microsoft Teams) | Alerts, reminders, approvals | Outbound | P1 | v2 §13; Survey §11 |
| Cloud file storage (Google Drive, Dropbox) | Link heavy deliverables instead of uploading them | Link | P1 | POC 36; Survey §11 |
| Data warehouse | Enterprise analytics and historical trends | Bidirectional / ETL | P1 | v2 §13 |
| BI / reporting | Advanced analytics | Outbound | P1 | v2 §13 |
| E-signature | Charter sign-off with legal signature | Outbound + callback | P1 | Survey §03; D-12 |

In the MVP, data that will later come from ERP or HR (actuals, capacity) is entered in the platform or imported from files (CHR-13, RES-03).

**Integration contract.** Every integration, and every MVP file import, states: the system of record for each field it touches; direction and frequency; the conflict rule when both sides change; a freshness threshold, with the as-of time shown wherever the data appears (BR-39); idempotent writes keyed by external IDs; an error queue visible to administrators; a reconciliation report; and an audit entry per run. No integration writes WBS data except through the same services and rules as the application (BR-22).

# 17. Non-Functional Requirements

| Area | Requirement | Source |
|----------------|--------------------------------------------------------------------------|--------------|
| Security | SSO, RBAC enforced on the server, least privilege, encryption in transit and at rest, audit logs, malware scanning of uploads, isolation of external users. | v2 §14; PLT-02, PLT-07 |
| Performance | Measurable targets agreed in Discovery (D-26) for pilot and target volumes: page and API response time at the 95th percentile, concurrent editors per project, PDF and report generation time, MCP response time. | v2 §14; D-26; RF-05 |
| Availability | Availability aligned to the company criticality tier, agreed in Discovery. | v2 §14; D-26 |
| Durability | Server-side persistence, autosave with visible state, backup and restore with agreed recovery point and time objectives. | POC 02, 36; D-26 |
| Concurrency | Multiple simultaneous editors per project without silent overwrites (PLT-06). | Survey §11 |
| Auditability | Baseline changes, approvals, decisions and configuration changes are timestamped with actor and rationale. | v2 §14; v3 WS-009 |
| Scalability | Growth from hundreds to thousands of projects and users; no per-project storage cap comparable to the POC's 4.5 MB. | v2 §14; POC 36 |
| Usability | The CEO reaches portfolio health and decisions within 30 seconds from home; a PM reaches the project Focus view in one click from the project. | v2 §14; POC 29 |
| Accessibility | WCAG 2.2 level AA recommended as the target (confirm in D-26); every function operable from the keyboard, including tables, trees, boards and canvases (BR-41); visible focus; color never the only signal; text contrast at or above the level the target requires, placeholders included, with the faint neutral reserved for disabled and decorative use; component contracts in the style guide (brand/style-guide.md) with an acceptance matrix per interactive pattern (data table, tree grid, board with drag and drop, canvas editor, dialog and drawer) covering roles, states, keyboard model and announcements, verified by automated component tests and one screen-reader pass before the pilot. | v2 §14, §18; RF-46, RF-47 |
| Responsiveness | Responsive web; read and light-update views (Focus, Board, Overview, approvals) usable on phones. | Survey §11; D-19 |
| Localization | Workspace timezone, currency and fiscal calendar; dates and numbers in the user's locale. | v3 WS-003; POC 04 |
| Data quality | Mandatory fields, validation, stale-data alerts and reconciliation controls; as-of time and metric version on every figure (BR-39). | v2 §14; RF-08 |
| Data portability | Export of projects and workspaces (JSON) and of charters and reports (PDF, Markdown). | POC 08, 28, 36 |
| Observability | Integration failures, stale feeds and failed saves are visible to administrators. | v2 §14; POC 02 |
| Hosting and residency | Hosted and operated by the provider; region and residency options per D-20 and D-28. | Survey §11; D-20; D-28 |
| Multi-tenancy | Logical isolation of every data path by tenant; automated cross-tenant tests on every release; one tenant can be restored from backup without affecting others. | TEN-02; D-28 |
| Service levels | Availability and support levels per plan, published to customers. | D-26; D-27 |
| Compliance | Security controls mapped to the certification chosen in D-31; data processing agreement for customers. | D-31 |
| Data lifecycle | Data classification, and one tenant data-processing matrix rather than a retention list: for every path that holds or moves customer data (business records, uploaded files and their extracted text, audit entries and any excerpt they keep, MCP call records, logs, backups, search indexes and caches, outbound calls to a language, vision or speech service, and provider support access) the matrix states the data classes, the retention, the processing region, the transfer mechanism where data leaves that region, and the sub-processor. Deletion at tenant deletion reaches backups within a stated period, and a deletion offered to a customer states what audit retention and the backup purge period still hold rather than promising more. The published sub-processor list and the policy for data a user sends through MCP to their own provider, which processes it under the customer's own terms, are part of the same matrix. Legal requirements per jurisdiction are confirmed with counsel [Unverified - confirm before applying]. | RF-13; TEN-06, TEN-07; D-31 |
| Secrets | Signing keys, token hashes and integration credentials kept in a managed secret store with rotation; secrets never logged and never shown again after creation. | S5; BR-36 |
| AI interface security | MCP endpoint over TLS only; tokens hashed, scoped and expiring; tokens never accepted in URLs; only tokens issued by the platform accepted; content in records treated as data; per-token rate limits. | S4; M05 |
| AI safety | AI recommendations carry evidence, confidence and assumptions; human approval is required for any action. | v2 §14 |

## 17.1 Proposed starting targets (to confirm in D-26)

Proposed values, not measurements: they turn D-26 into a confirm-or-adjust decision. Discovery checks them against pilot volumes and the cost of the chosen cloud set-up (D-20, D-28). Until that decision they are the baseline defaults the design is built to, so the baseline is not held open waiting for a measurement that does not exist yet; changing one is a recorded decision with its rationale and the volume test behind it, not a silent edit.

| Target | Proposed starting value | Notes |
|------------------------------|--------------------------------------------------|----------------------------|
| Web views (Overview, Focus, Board, WBS) | Usable within 2 seconds at the 95th percentile, for projects up to 2,000 work items | Measured from the user's region on broadband |
| API and MCP read calls | Under 1 second at the 95th percentile | Tools return computed figures (MCP-10) |
| Saves | Under 1 second at the 95th percentile from edit to "saved" | PLT-05 |
| Concurrent editors | 25 people editing one project at once | Conflicts only on the same field (PLT-06) |
| Scale per tenant | 5,000 projects, 2,000 work items per project, 2,000 users | Design for ten times the pilot volume measured in Discovery |
| Availability | 99.9% per month for paid plans, excluding announced maintenance | Published per plan (Service levels) |
| Recovery | Recovery point 15 minutes, recovery time 4 hours; one tenant restored without affecting others | Durability; Multi-tenancy |
| PDF and report generation | Under 30 seconds at the 95th percentile for documents up to 100 pages; longer jobs notify when ready | PLT-16 |
| MCP rate limits | 60 calls a minute per token by default; monthly calls per plan | MCP-12; TEN-10 |
| Files | 250 MB per file by default, set per workspace; download links valid for 15 minutes | PLT-07 |
| Accessibility | WCAG 2.2 level AA | Accessibility row above |
