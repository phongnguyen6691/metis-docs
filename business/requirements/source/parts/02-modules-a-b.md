
# 8. Functional Requirements: Module Catalogue

| ID | Module | Layer | Pri | Purpose | Main sources |
|------|----------------------------------|--------------|-----|----------------------------------------|----------------------|
| M01 | Platform Foundation & Collaboration | Platform, Tenancy & Access | P0 | Identity, access enforcement, multi-user persistence, files, notifications, audit, search, export, contextual help | v2 §13-14; POC 01, 30, 36; Survey §11 |
| M02 | Tenant & Subscription Management | Platform, Tenancy & Access | P0 | Tenants, sign-in methods, plans and limits, provider operations, support access, offboarding | New in v4.1 (A-06) |
| M03 | Workspace Management & Configuration | Platform, Tenancy & Access | P0 | Workspaces, navigation hierarchy, fields and options, team and roles | v3 WS-001…010; POC 31-34 |
| M04 | Lifecycle Governance Framework & Templates | Platform, Tenancy & Access | P0 | Stages, gates, evidence, waivers, templates and versioning | v3 GF, TPL, §8 |
| M05 | Natural-Language Interface for LLMs (MCP) | Platform, Tenancy & Access | P0 | MCP server per tenant, tokens and OAuth, tools, prepare-only governance, audit | New in v4.1 (A-06); S4 |
| M06 | Project Charter & Business Case | Project Execution | P0 | Live charter, business case, budget, owner and sponsor | POC 04-08; v2 M03 |
| M07 | WBS Master | Project Execution | P0 | Single source of truth for work: table, tree, blueprint, item form, dependencies | POC 09-14, 19-21 |
| M08 | Deliverable Builder & Process Frameworks | Project Execution | P0 | Generate pre-wired WBS fragments from process frameworks | POC 14-18, 35 |
| M09 | Project Plan: Timeline & Board | Project Execution | P0 | Time and status views of the WBS | POC 22-23 |
| M10 | Project Overview & Focus | Project Execution | P0 | Project dashboard and personal daily work list | POC 02-03, 29 |
| M11 | Change Control, Baseline & Decision Log | Project Execution | P0 | CR register, baseline, decisions | POC 24-25; v2 M08 |
| M12 | Journal & Project Reporting | Project Execution | P0 | Daily journal, report builder, weekly status submission | POC 26-28; v2 FR-701 |
| M13 | Risk & Dependency | Project Execution | P0 | Risk register, portfolio risk, dependency map | v2 M07; POC 03, 07 |
| M14 | MVP & Product Delivery | Project Execution | P0 | MVPs, features, releases, outcome KPIs | v2 M04 |
| M15 | Executive Portfolio Cockpit & Workspace Dashboard | Portfolio Intelligence | P0 | CEO-first control tower and workspace dashboard | v2 M01; v3 WS-005 |
| M16 | Portfolio & Project Registry | Portfolio Intelligence | P0 | Registry of all initiatives and projects | v2 M02 |
| M17 | Portfolio Roadmap | Portfolio Intelligence | P0 | 12-24 month roadmap with dependency overlay | v2 M05 |
| M18 | Resource & Capacity | Portfolio Intelligence | P0 | Capacity, demand, utilization, bottlenecks | v2 M06 |
| M19 | Investment & Benefits | Portfolio Intelligence | P1 | Budget, actual, forecast, value, benefits | v2 M09 |
| M20 | Strategy, Prioritization & Scenario Planning | Portfolio Intelligence | P1 | Strategy model, scoring, what-if scenarios | v2 M10, §4.1 |
| M21 | Analytics & Executive Reporting | Portfolio Intelligence | P1 | SteerCo packs, portfolio reports, governance analytics | v2 M11; v3 GF-013 |
| M22 | AI Portfolio Copilot | Portfolio Intelligence | P2 | Q&A, recommendations, scenario and governance assistance | v2 M12; v3 §16 |

Each module below states its purpose, then its requirements. A module's priority is the highest priority of its requirements; individual requirements may be later.

# 9. Platform, Tenancy & Access Requirements

## M01 Platform Foundation & Collaboration (PLT)

Purpose: turn the single-user, browser-only POC into a governed multi-user product. The POC states this gap itself: "Email invitations and enforced access levels require accounts; they arrive when this graduates to a hosted app" (POC 34) and limits storage to about 4.5 MB per project (POC 36).

Wireframes: {{WF:PLT}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| PLT-01 | **Sign-in and sessions.** Users sign in with the methods their tenant enables (TEN-03): SSO through the tenant's identity provider, email and password with MFA, or a magic link for invited external users. Sessions persist across browser restarts until expiry or sign-out. | (1) No workspace is reachable without an authenticated session. (2) Sign-out ends the session on that device. (3) Session lifetime is configurable. | P0 | v2 §13, §14; POC 01; Survey §01; TEN-03; D-03 |
| PLT-02 | **External user access.** If client access is approved, external users sign in with a local account or magic link and see only the projects they are invited to. | (1) External users cannot browse workspaces, portfolios or other projects. (2) Access can be revoked immediately. | P0 | POC 06-07; Survey §11; D-02, D-03 |
| PLT-03 | **Invitations and membership.** Workspace Owners invite users by email, assign a role and deactivate members. | (1) The invitee receives an email and joins on acceptance. (2) A deactivated member loses access at once but stays on history (BR-26). | P0 | POC 34; Survey §01, §10 |
| PLT-04 | **Access enforcement.** Roles and record-level permissions (Section 14) are enforced in the user interface and on the server. Missing access is explained, never shown as an empty page: no access (with a request-access action that notifies the owner), read-only (archived workspace, suspended tenant, frozen revision, locked baseline field, each with the reason) and session expired (sign in again without losing unsaved input). | (1) A request without permission is rejected by the server even when the UI is bypassed. (2) Each of the three states shows its reason and next action. | P0 | v2 §12, §14; v3 WS-002; POC 34; RF-30 |
| PLT-05 | **Server persistence and autosave.** All data is stored server-side; edits autosave; every editing screen shows the save state in the same place (saving, saved with time, failed with reason and Retry). | (1) A refresh after "saved" shows the edit. (2) A failed save is visible and can be retried. (3) Leaving a page with unsaved or failed changes warns the user. (4) No per-project storage cap comparable to the POC's 4.5 MB. | P0 | POC 02, 36; Survey §11; RF-26 |
| PLT-06 | **Concurrent editing.** Several users work on the same project at the same time; other users' changes appear without a manual reload; conflicting edits of the same field are detected and never silently overwritten. One write contract serves the application, MCP and the API: every write carries the version of the record it was based on and an idempotency key; a stale version is rejected with the newer value; a retried key is applied once (MCP-14). | (1) When two users edit the same field, the later save is not applied; that user sees both values and keeps theirs, takes the newer one or merges. (2) The same rejection happens for a stale MCP or API write. | P0 | Survey §11; New; RF-07, RF-26 |
| PLT-07 | **File storage.** Files on WBS items, comments and project Docs & Links are kept in managed storage with access control and time-limited download links; allowed types and maximum size are configurable per workspace; uploads are scanned for malware. | (1) A user without project access cannot download its files. (2) An oversized or blocked file is rejected with a clear message. | P0 | POC 19, 30, 36; Survey §06, §09, §11; New |
| PLT-08 | **Docs & Links.** Each project has a Docs & Links area, opened from the project node in the navigation tree, to add links or notes and upload files. | Entries can be added, opened, renamed and removed; removal is audited. | P0 | POC 30 |
| PLT-09 | **Notifications.** In-app and email notifications for @mentions; assignment as PIC, Reviewer or Approver; CR and gate decisions requested or made; items due soon or overdue; missing weekly status. An in-app notification center lists unread and read notifications with filters and opens the source record; users set the channel per trigger for non-mandatory notifications. | (1) Each trigger notifies the right recipients once; approval requests cannot be muted. (2) Opening a notification marks it read and opens its record. | P0 | v2 §13; Survey §06-08, §11; D-16; RF-29 |
| PLT-10 | **Digest and chat channels.** Optional morning digest of each user's Focus items; delivery to Slack or Microsoft Teams. | The digest lists overdue, due-today and due-this-week items for the user. | P1 | Survey §08; v2 §13; D-16 |
| PLT-11 | **Audit log.** Configuration changes, baseline changes, approvals and governance decisions record actor, timestamp, before and after values and reason; each item shows its own activity. | Audit entries cannot be edited or deleted and can be exported by authorized roles. | P0 | v2 §14, BR-12; v3 WS-009; POC 21 |
| PLT-12 | **Search.** Search projects by name and WBS items by code or name within the user's authorized scope. | Results respect permissions; selecting a result opens it. | P0 | POC 02, 30; Survey §09; D-17 |
| PLT-13 | **Full-text search.** Search across item descriptions, comments, journal entries and CRs. | Results respect permissions. | P1 | Survey §09; D-17 |
| PLT-14 | **Export and import.** Export a project or a workspace as a data file (JSON); import a project file as a new project; nothing is overwritten. | Export then import reproduces items, dependencies, charter, CRs and journal of the project. | P0 | POC 08, 36; BR-27 |
| PLT-15 | **Protected destructive actions.** Deleting a project or clearing a workspace is limited to Workspace Owners, needs typed confirmation and remains recoverable during a retention period. | A deleted project can be restored within the retention period; the action is audited. | P0 | POC 36 ("Clear workspace"); New |
| PLT-16 | **Document generation.** Formatted PDF output for charters and reports. A PDF is a snapshot: it states its data as-of time, metric version and generator, and the file is kept so the same document can be downloaded again (BR-39). | (1) PDF content equals the on-screen content at the stated as-of time. (2) Downloading it again returns the same file even after the data has changed. | P0 | POC 08, 28; Survey §03, §07; D-13; RF-18 |
| PLT-17 | **Branded templates.** Tenant or workspace PDF branding (logo, colours, cover) for charters and reports. | A workspace can select its branding template. | P1 | Survey §03; TEN-12; D-13 |
| PLT-18 | **Personal preferences.** Display name (used in activity, e.g. "Nadia R. changed Status"), default landing tab and default WBS view, applied when opening or switching projects. | Preferences apply on project open and switch. | P0 | POC 31 |
| PLT-19 | **Sandbox workspace.** A resettable demo or training workspace inside each tenant. | A tenant admin resets it without affecting other workspaces. | P1 | POC 01; Survey §01; D-21 |
| PLT-20 | **Contextual help and glossary.** Help where the work happens: a tooltip on the first occurrence of each product term on a screen (Stage, Phase, Gate, Baseline, Category, Label, Approval Gate and the other Appendix A terms used as labels), guidance in every empty state, and a searchable glossary built from Appendix A, opened from the help button on every screen. Later occurrences on the same screen carry no tooltip, to avoid noise. | (1) The first occurrence of each Appendix A term on a screen has a tooltip. (2) The glossary opens from the help button on every screen. | P0 | S5; Section 4.5; RF2-20 |

## M02 Tenant & Subscription Management (TEN)

Purpose: run the product as a multi-tenant SaaS (A-06). A tenant is one customer organization: it owns its users, sign-in methods, plan, data boundary and enterprise layer, and contains one or more workspaces. Provider operators run the service without seeing tenant business data.

Wireframes: {{WF:TEN}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| TEN-01 | **Tenant provisioning.** A provider operator creates a tenant with organization name, verified domains, first tenant admin, plan, region and trial length; the tenant starts with a default workspace and the default lifecycle framework from the global template library. | The first admin receives an invitation; the tenant shows as Trial or Active with its plan and region. | P0 | New (A-06); D-27 |
| TEN-02 | **Tenant isolation.** Every record, file, search index, cache, report, export, audit entry and MCP session belongs to exactly one tenant; no screen, API, MCP tool, report or AI feature returns another tenant's data. An isolation matrix names the tenant boundary and its test for each data path: database, file storage, search index, caches, queues and background jobs, audit log, backups and restore, application logs and support tools. | (1) Each data path in the matrix has a negative test proving a tenant A user cannot reach tenant B data; the suite runs on every release and fails it on any leak. (2) An external penetration test precedes go-live. | P0 | New (A-06); BR-33; D-28; RF-02 |
| TEN-03 | **Sign-in methods per tenant.** Tenant admins enable SSO (SAML 2.0 or OIDC) with verified domains and just-in-time provisioning, email and password with MFA, and magic links for invited external users. | A user of a verified domain is routed to the tenant's identity provider; MFA can be made mandatory. | P0 | v2 §13; D-03 |
| TEN-04 | **Tenant admin console.** Users and roles, workspaces, sign-in and security policies, AI access policy for MCP, plan and usage, audit log and data export, in one console. | Every console action is audited (PLT-11). | P0 | v3 §9; New |
| TEN-05 | **Plans and entitlements.** Each tenant has a plan that enables modules and sets limits (seats, workspaces, storage, MCP calls per month); usage against limits is visible to the tenant admin. Limit states: approaching (the tenant admin is warned at a set share of the limit), reached (only the limited action is blocked, with a message naming the limit and how to raise it), and always available (reading and export). | (1) At a limit, the blocked action names the limit and the way to raise it. (2) Reading and export still work at every limit (BR-38). | P0 | New; RF-20 |
| TEN-06 | **Tenant lifecycle.** States Trial, Active, Suspended (read-only), Cancelled (export window) and Deleted (data purged after the retention period, with a deletion record). | A suspended tenant can read and export but not edit; a deleted tenant leaves only the deletion record. | P0 | New |
| TEN-07 | **Export and offboarding.** Tenant admins export all data and files on request and when cancelling; deletion follows the retention period. | A full export restores into a new tenant with the same projects, files and history. | P0 | PLT-14; New |
| TEN-08 | **Provider operations console.** Provider operators manage tenants, plans, the global template library, feature flags and service notices, without access to tenant business data. | Operator screens show tenant metadata and usage only. | P0 | v3 §9; New |
| TEN-09 | **Support access grants.** Break-glass access only: provider staff have no standing access to tenant data. A provider request states the reason and case; a tenant admin approves it for named staff, a scope (workspaces, read-only by default) and an expiry; the admin can revoke it at once; every action is audited and visible to the tenant. | (1) Access ends at expiry or on revoke, effective immediately. (2) The tenant audit log shows the request, approval and each action taken. | P0 | BR-37; New; RF-14 |
| TEN-10 | **Fair-use limits.** Per-tenant quotas and rate limits on API and MCP calls, exports and report generation protect other tenants. | One tenant's load cannot push other tenants outside the agreed service level (D-26). | P0 | New |
| TEN-11 | **User provisioning (SCIM).** Automatic user and group provisioning from the tenant's identity provider. | Deprovisioning in the identity provider deactivates the user at the next sync. | P1 | New |
| TEN-12 | **Tenant branding.** Tenant logo, accent colour, email sender name and document templates, within the contrast rules of the style guide. | Branded colours keep text contrast at 4.5:1 or more. | P1 | PLT-17; New |
| TEN-13 | **Data residency.** The tenant chooses a hosting region at provisioning; data at rest and backups stay in that region. | The region is shown in the console and cannot change silently. | P1 | D-20; D-28 |
| TEN-14 | **Self-serve signup and billing.** Signup with trial, online payment, invoices, plan upgrades and downgrades. | A prospect can start a trial without provider intervention. | P1 | D-27 |
| TEN-15 | **Usage metering.** Per-tenant usage (active users, storage, MCP calls) for the provider's capacity planning and billing. | A monthly usage report exists for every tenant. | P1 | New |

**Tenant isolation matrix** (draft for TEN-02, assuming the D-28 recommendation of shared infrastructure with strict logical isolation; the mechanisms are confirmed in the Discovery architecture decision record, 18.4):

| Data path | Tenant boundary | Negative test, run on every release |
|--------------------|--------------------------------------------------|----------------------------------------|
| Database | Tenant ID on every row, enforced by a row-level policy in the database, not only in application queries | A query in tenant A context returns no tenant B rows, including through reports and exports |
| File storage | A storage prefix per tenant; download links signed for one tenant, one file and a short time | A tenant B link and a guessed path both fail for a tenant A user |
| Search index | Tenant filter applied by the search service on every query | Searching a tenant B project name from tenant A returns nothing |
| Caches | Tenant ID in every cache key | Warm a tenant B entry, read the same key from tenant A: no hit |
| Queues and background jobs | Tenant ID in every job envelope; workers set the tenant context before work | A job whose tenant ID does not match its data is rejected and logged |
| Audit log | Partitioned by tenant; tenant admins and exports see only their partition | An audit export of tenant A contains no tenant B entry |
| Backups and restore | One tenant can be restored without touching others (Section 17) | Restore tenant A from backup; tenant B data is unchanged |
| Application logs | Tenant ID on each entry; no record content in logs | A log scan finds no record content and no entry without a tenant ID |
| Support tools | Access only through a break-glass grant (TEN-09) | Provider staff without a grant cannot open tenant data |
| MCP sessions and tokens | A token is issued for one tenant's endpoint and its audience is checked on every call (MCP-04) | A tenant A token sent to the tenant B endpoint gets HTTP 401 |

## M03 Workspace Management & Configuration (WSP)

Purpose: make the workspace a first-class product object (v3 §18), combining the v3.0 workspace concept with the POC's navigation tree and Settings (General, Fields & Options, Team, Frameworks, Data).

Wireframes: {{WF:WSP}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| WSP-01 | **Create workspace.** An authorized admin creates a workspace with name, company or business unit, owner, timezone, fiscal calendar and status. | The workspace is created in Draft with its owner. | P0 | v3 WS-001 |
| WSP-02 | **Workspace isolation.** Users see only authorized workspaces and records. | A user of workspace A cannot list, open or search records of workspace B. | P0 | v3 WS-002 |
| WSP-03 | **Workspace profile.** Purpose, operating model, governance owner, currency, business calendar (used for working-day durations), fiscal calendar and reporting cadence. | Profile values drive durations (WBS-15) and reporting periods (RPT-04). | P0 | v3 WS-003, §10 |
| WSP-04 | **Workspace switcher.** Users switch between authorized workspaces without losing context. | Returning to a workspace reopens the last project and tab. | P0 | v3 WS-004 |
| WSP-05 | **Workspace lifecycle.** States Draft, Active, Suspended and Archived; an archived workspace is read-only and auditable. | No edits are possible in an archived workspace. | P0 | v3 WS-006; BR-21 |
| WSP-06 | **Navigation tree.** A collapsible sidebar shows Workspace → Portfolio (Space) → Program (Folder) → Project; nodes can be created, renamed, moved and archived; folders show project counts; a project node expands to Docs & Links. | Moving a project between programs keeps all its data and history. | P0 | POC 02, 30; D-04 |
| WSP-07 | **Fields & Options.** Workspace-managed lists for Category, Type, Label, Phase, Status and Priority; each value shows how many items use it; values can be added, renamed, reordered and deleted. | (1) Renaming a value updates every item using it. (2) Deleting a value in use requires a replacement value (BR-25). | P0 | POC 32-33; Survey §10; D-14 |
| WSP-08 | **System meaning of options.** Each Status maps to a system state (Not started, In progress, Waiting, Blocked, Done) and each built-in Label keeps its system meaning, so renames never break metrics, Board columns or charter sections. | Renaming "Done" to "Completed" leaves progress figures unchanged. | P0 | POC 32-33; New |
| WSP-09 | **Phase list from the lifecycle framework.** The Phase values offered on WBS items are the stages of the workspace's published lifecycle framework. | Publishing a framework with a new stage makes it selectable as a Phase. | P0 | POC 33; v3 §4; New |
| WSP-10 | **Team members.** Add members (name, role or title, email), set their role and see their assigned item count; every member is selectable as PIC, Reviewer and Approver and can be @mentioned; renaming a member updates their assignments everywhere. | Removing a member keeps their name on existing items and history (BR-26). | P0 | POC 02, 34 |
| WSP-11 | **Role assignment.** Assign roles from Section 14 to members at workspace level and, where needed, per project. | A member's effective permissions follow the assigned roles. | P0 | v2 §12; v3 §9; Survey §09-10; D-15 |
| WSP-12 | **Workspace cloning.** Clone a workspace's configuration into a new workspace without live transactions unless explicitly selected. | The clone contains configuration only by default. | P1 | v3 WS-007 |
| WSP-13 | **Cross-workspace governance.** Controlled shared resources, dependencies and executive reporting across workspaces. | Cross-workspace views respect record-level permissions (BR-20). | P1 | v3 WS-008 |
| WSP-14 | **Guided workspace setup.** A new workspace opens a setup checklist (profile, fields and options, team and roles, lifecycle framework, process frameworks) with an optional starter template (for example product delivery or creative production) and a readiness check before activation: owner set, a published default lifecycle framework (BR-14), every Status mapped to a system state, at least one portfolio. The checklist states which steps the readiness check tests and which it does not: the process framework step is recommended before the Deliverable Builder is used and is not an activation blocker, so a workspace is never held back by a step no readiness rule tests. | (1) Activating a workspace that fails the readiness check is blocked and lists what is missing. (2) A workspace created from a starter template is ready to activate after the team is invited. (3) The process framework step is labelled optional for activation, and a workspace with no process framework activates. | P0 | RF-24; v3 WS-001, WS-003 |

![POC 32: Settings, Fields & Options. Category and Type lists with usage counts (the six Category rows are stored as Type = Deliverable, see Section 12.2).](source/images/poc-32.jpg){width=6.6in}

![POC 34: Settings, Team. Access is only a label in the POC; enforcement arrives with accounts (PLT-03, PLT-04).](source/images/poc-34.jpg){width=6.6in}

## M04 Lifecycle Governance Framework & Templates (GOV)

Purpose: make the delivery lifecycle configurable through versioned templates rather than custom development (v3 §4-8). The template model behaves as a governed configuration system: CLONE → ADAPT → REVIEW → PUBLISH → INSTANTIATE. Reference lifecycles are in Section 7.6 (Company A) and Section 15.2 (creative production phases).

Wireframes: {{WF:GOV}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| GOV-01 | **Stage library.** Admins create, edit, deactivate and reorder lifecycle stages. | Stage order is reflected in new projects and in the Phase list. | P0 | v3 GF-001 |
| GOV-02 | **Stage metadata.** Objective, description, owner, duration or SLA, activities, artifacts, entry and exit criteria. | All listed attributes can be stored per stage. | P0 | v3 GF-002 |
| GOV-03 | **Gate configuration.** Approvers, quorum, decision options and evidence requirements per gate. | A gate cannot be decided without its quorum. | P0 | v3 GF-003 |
| GOV-04 | **Mandatory artifacts.** Documents, fields, checklists and evidence can be mandatory before gate submission. | Submission is blocked while a mandatory artifact is missing. | P0 | v3 GF-004 |
| GOV-05 | **Role mapping.** Stages map to configurable workspace roles (stage owner, gate approvers, control functions). | Stage tasks route to the mapped roles. | P0 | v3 GF-005 |
| GOV-06 | **Conditional flow.** Rules add or remove stages, e.g. regulatory impact = yes adds Compliance Review. | Changing the triggering field updates the project's stage list. | P0 | v3 GF-006 |
| GOV-07 | **Parallel stages.** Selected activities run in parallel with dependency controls. | Parallel stages show separate readiness. | P1 | v3 GF-007 |
| GOV-08 | **Gate decision.** Pass, Pass with Conditions, Rework, Hold or Reject, each with rationale and evidence. | A decision without rationale is blocked (BR-30). | P0 | v3 GF-008 |
| GOV-09 | **Exit criteria.** A project cannot advance until mandatory criteria pass or an authorized, unexpired waiver exists. Eligibility is checked by the server for every channel (BR-42); the gate review shows which criteria block the decision. | (1) Advancing with an open criterion and no waiver is blocked (BR-17). (2) Pass and Pass with Conditions stay disabled until the gate is eligible, and an ineligible decision sent through the API or MCP is rejected. | P0 | v3 GF-009; RF-10, RF-28 |
| GOV-10 | **Stage SLA.** Planned versus actual stage duration; overdue stages flagged. | Overdue stages appear in the workspace dashboard. | P1 | v3 GF-010 |
| GOV-11 | **Stage health.** Combines schedule, scope, resources, risks, dependencies and gate readiness. | Health is calculated with the same rules in every project. | P1 | v3 GF-011 |
| GOV-12 | **Framework versioning and pinning.** Published framework versions are immutable; changes create a new version; each project and stage instance keeps the version it was created with. | Editing a template never alters existing stage instances (BR-15, BR-16). | P0 | v3 GF-012, WS-010, §13 |
| GOV-13 | **Exception and waiver.** Authorized users temporarily waive a rule with reason, approver and expiry. | Expired waivers re-block the affected criterion and raise an attention item. | P0 | v3 GF-014 |
| GOV-14 | **Gate readiness view.** Before a gate meeting: required evidence status, open risks, dependencies, budget and resource impact, decision history. | All five elements are shown for any pending gate. | P0 | v3 §8 |
| GOV-15 | **Gate follow-up.** Gate decisions link to project, stage, evidence, approver and Decision Log; conditions are tracked as actions with owner and due date; failed or conditional gates can raise risks or CRs. | A "Pass with Conditions" decision creates at least one tracked condition. | P0 | v3 §8 |
| GOV-16 | **Gate escalation.** Escalation for overdue, repeatedly failed or materially blocked gates. | Escalations notify the configured role. | P1 | v3 §8 |
| GOV-17 | **Template catalog.** Authorized users browse approved corporate and workspace templates. | Only published templates are offered for new projects. | P0 | v3 TPL-001 |
| GOV-18 | **Clone template.** An existing template is cloned into an editable draft (the POC's "Edit a copy"). | The clone records its source (GOV-23). | P0 | v3 TPL-002; POC 35 |
| GOV-19 | **Adapt stages.** Add, remove, rename, reorder and configure stages in a draft. | Changes stay in draft until published. | P0 | v3 TPL-003 |
| GOV-20 | **Adapt governance.** Change approvers, artifacts, gates, thresholds and exception rules in a draft. | Changes stay in draft until published. | P0 | v3 TPL-004 |
| GOV-21 | **Publish workflow.** Template changes require review and publication before activation. Publishing runs a readiness check: every stage has an owner role, every gate has approvers and a quorum that the configured approvers can meet, mandatory artifacts are defined, and the stage list yields the Phase values. | (1) Unpublished drafts cannot be instantiated. (2) A draft that fails the readiness check cannot be published and the check lists each failure. | P0 | v3 TPL-005; S5 |
| GOV-22 | **Template version.** Each published version has a unique version number and effective date. | Version and effective date shown on every project. | P0 | v3 TPL-006 |
| GOV-23 | **Template provenance.** Source template, lineage, author, accountable owner and change summary are recorded. | Lineage and owner are viewable for any template. | P0 | v3 TPL-007; RF-19 |
| GOV-24 | **Template comparison.** Compare versions and show stage, rule and artifact differences. | Differences are listed per element. | P1 | v3 TPL-008 |
| GOV-25 | **Template migration.** Propose migration of active projects to a new version and show impact before approval. | No project changes version without approval. | P1 | v3 TPL-009 |
| GOV-26 | **Global template library.** Global standard templates alongside workspace-specific templates. | Workspaces can clone global templates. | P1 | v3 TPL-010 |
| GOV-27 | **Project and WBS templates.** Create a project from a template holding charter defaults and a WBS skeleton. | A new project from a template contains its WBS skeleton. | P1 | v3 §10 |
| GOV-28 | **Template deprecation and review.** A template can be deprecated (no new projects, existing projects unaffected) with a replacement and a reason; templates unused or unreviewed for a set period are flagged to their owner (GOV-23). | A deprecated template is not offered for new projects and still shows on the projects that use it. | P1 | RF-19 |

## M05 Natural-Language Interface for LLMs: MCP Server & Access Tokens (MCP)

Purpose: let people work with the platform in natural language from the LLM tools they already use (A-06). Each tenant gets a remote server for the Model Context Protocol (MCP), the open protocol that connects LLM applications to external data and tools. Any LLM client that implements the MCP specification connects with a token or OAuth, and the clients verified by the provider are listed in the connection guide (MCP-15); the server offers tools (functions the model can call), resources (read-only context such as a charter) and prompts (reusable request templates), and always acts as the user who owns the token.

Protocol facts this module relies on [Source: S4, MCP specification 2026-07-28]:

- Server features are tools, resources and prompts; messages use JSON-RPC 2.0.
- The standard transports are stdio (a local subprocess) and Streamable HTTP (each message is an HTTP POST to one MCP endpoint); a hosted SaaS uses Streamable HTTP.
- Authorization is optional in the protocol. When used over HTTP it follows an OAuth 2.1 based flow: the MCP server publishes OAuth Protected Resource Metadata (RFC 9728), clients send the access token in the Authorization header on every request and never in the URL, and the server accepts only tokens issued for it.

Support for remote servers, OAuth and static tokens differs between LLM client applications [Unverified - confirm per client, Q-08]. The platform therefore offers both OAuth and personal access tokens, issued by its own authorization server (D-29).

Wireframes: {{WF:MCP}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| MCP-01 | **MCP server endpoint.** One HTTPS endpoint per tenant using the Streamable HTTP transport, declaring the protocol version it supports; shown on the connection page. | A standard MCP client lists the tools and calls a read tool against the tenant endpoint. | P0 | S4; A-06 |
| MCP-02 | **Personal access tokens.** Users create tokens with a name, scopes, optional workspace or project restriction and an expiry within the tenant maximum; a token is shown once, stored hashed, revocable and shows its last use. | A revoked or expired token gets HTTP 401; the token value is never shown again after creation. | P0 | A-06; BR-36; D-29 |
| MCP-03 | **OAuth authorization.** Clients that support MCP authorization connect through the platform's OAuth 2.1 authorization server with user consent, following the MCP specification (Protected Resource Metadata, PKCE, resource indicator). | A compliant client completes sign-in and consent without copying a token. | P0 | S4; D-29 |
| MCP-04 | **Same permissions, same tenant.** Every request runs as the token's user; the effective permission is the intersection of the user's roles and the token's scopes; tenant isolation applies. | A Viewer's token cannot call write tools; no tool returns another tenant's data (TEN-02). | P0 | BR-34; TEN-02 |
| MCP-05 | **Read tools.** Search and list projects and portfolios; project overview metrics; WBS items with filters; the user's focus list; change requests, risks, decisions and journal entries; charters and reports; workspace configuration. | Results match what the same user sees in the application. | P0 | A-06 |
| MCP-06 | **Append-only write tools.** Add journal entries and comments linked to WBS items. | Entries show the AI avatar and "via MCP" with the token name in activity. | P0 | RPT-01; WBS-16 |
| MCP-07 | **Update tools.** Update WBS item status, dates, PIC and effort; create draft change requests and risks; generate report drafts. | Updates respect baseline locks (BR-04) and version checks (MCP-14). | P0 | D-30 |
| MCP-08 | **Prepare-only governance.** Approvals and decisions (CRs, gates, portfolio decisions), baseline application, deletions, permission and token changes cannot be executed through MCP; a tool can prepare them and returns a link for a person to confirm in the application. | Calling a decision tool creates a draft and a confirmation link; nothing is approved. | P0 | BR-35; BR-10; v2 §14 |
| MCP-09 | **Tool contracts.** Each tool has a stable name, a plain-language description, a JSON input schema with examples and a version; changes stay backward compatible within a major version. | The tool list is published on the connection page and versioned. | P0 | S4 |
| MCP-10 | **Server-computed figures.** Tools return metrics computed by the platform with the Section 12 definitions (progress, overdue, delayed, health) instead of raw rows for the LLM to aggregate. | get_project_overview returns the same values as the Overview screen for the same time. | P0 | BR-32 |
| MCP-11 | **Audit and transparency.** Every call is logged with user, token, client name, tool, parameter summary, result and time; users see their own MCP activity and tenant admins see all of it. | Entries are immutable and exportable (PLT-11). | P0 | PLT-11; BR-12 |
| MCP-12 | **Rate limits and quotas.** Limits per token and per tenant (plan based) with clear errors and retry guidance. | Exceeding a limit returns a clear error and does not affect other tenants. | P0 | TEN-05; TEN-10 |
| MCP-13 | **Data minimization.** Tools return only the fields needed, paginate large results and exclude personal contact data unless the scope allows it. | Contact emails and phones appear only with a contacts scope. | P0 | New |
| MCP-14 | **Write safety.** Write tools use the same write contract as the application and the API (PLT-06): idempotency keys and record versions, so a retried or stale call never duplicates work or overwrites newer changes; a stale call returns the newer value. | (1) Repeating a call with the same key changes nothing a second time. (2) A call based on an old version is rejected with the current value. | P0 | PLT-06; RF-07 |
| MCP-15 | **Connection page and guide.** A page in the user's profile shows the endpoint, the OAuth connection, token creation, example client configurations, a test call and the tool list, plus a compatibility list of verified clients with the connection methods each supports. A failed test call names its category and the fix: invalid or expired token, missing scope, workspace restriction, client not allowed by tenant policy, rate limit, protocol version mismatch, service unavailable. | (1) A new user connects a verified client by following the page alone. (2) Each failure category shows its own message and next step. | P0 | Q-08; RF-06, RF-32 |
| MCP-16 | **Content-injection safety.** Text stored in records (comments, descriptions, files) is returned as data and never interpreted as instructions by the server; write and prepare tools act only on explicit parameters. | A comment containing instructions cannot trigger any server action. | P0 | S4; New |
| MCP-17 | **Resources and prompts.** Charters, reports and journal digests exposed as MCP resources; prompt templates such as "Draft weekly status", "Prepare gate readiness summary" and "Portfolio risk review". | Prompts appear in clients that support them. | P1 | S4 |
| MCP-18 | **REST API.** A REST API with the same tokens, scopes, limits and audit, for system integrations. | The same permission model applies as for MCP. | P1 | v2 §13 |
| MCP-19 | **Action classes and policy metadata.** Every tool belongs to one class that sets its safeguards: read; append-only (new journal entries and comments); reversible write (field updates and drafts, undoable from the item's activity); prepare-only (governance actions that a person confirms in the application, BR-35). Because prepare-only can be confirmed per call or in one later transaction, the class alone does not fix the boundary: each tool also publishes policy metadata that a contract test can read, namely `confirmation_mode` (`per_call` for the prepare tool of MCP-08, `batch_launch` where one approval covers a batch of staged proposals), `allowed_workspace_state`, whether a tenant policy switch is required, the maximum objects per call and per session, and its milestone. The class and this metadata are shown in the tool list and recorded in the audit log. Undo rules: a person with edit rights can undo an MCP write while the field still holds the value that write set; after a later change the field is corrected by a normal edit instead; an undo is itself a versioned, audited write and the original entry stays; MCP writes never touch baseline-locked fields (BR-04), so an undo never changes a baseline. | (1) Every published tool has exactly one class. (2) Undo is offered on an MCP write while its value is current and is replaced by a normal edit after a later change; the undo appears in the activity next to the original entry. | P0 | D-30; S5; RF2-15 |
| MCP-20 | **Client allowlist and workspace restrictions.** Tenant admins choose which MCP clients may connect (all clients that implement the specification, or a named list), which workspaces MCP may reach, the maximum token lifetime and the scopes each role may grant. OAuth clients are identified by their registration with the platform's authorization server; a personal access token is a bearer token that works from any application holding it, so it cannot prove which client uses it; for personal tokens the policy is to allow or block them as a whole, per workspace. | (1) An OAuth client outside the allowlist is refused with a message naming the policy. (2) A token cannot reach a workspace the tenant policy excludes. (3) When personal tokens are blocked, every call with one is refused with the policy name. | P0 | RF-32; TEN-04; D-29 |

**Indicative tool catalogue** (final names set in the API design; a read tool arrives with the module whose data it reads; milestones as in Section 18.2). The catalogue is the canonical list, versioned in the foundation contract pack (18.4), and each row carries the policy metadata of MCP-19 beside its class; the column below shows the confirmation mode, the field that distinguishes a governance action confirmed per call from a batch of proposals confirmed by one later approval:

| Tool | Purpose | Scope | Class (MCP-19) | Milestone | Confirmation |
|------------------------------|--------------------------------------------------|--------------|------------|------------|------------|
| list_projects | Search and list projects the user can access | projects:read | Read | 1A | none (read) |
| get_project_overview | Section 12 metrics, health and attention items of a project | projects:read | Read | 1A | none (read) |
| get_wbs_items | WBS items filtered by status, PIC, category, phase or dates | wbs:read | Read | 1A | none (read) |
| get_my_focus | The user's overdue, due and starting items across projects | wbs:read | Read | 1A | none (read) |
| get_portfolio_summary | Cockpit figures and attention queue of a workspace | portfolio:read | Read | 1B (with M15) | none (read) |
| list_change_requests, get_change_request | Change register and CR detail with impact analysis | changes:read | Read | 1A | none (read) |
| list_risks | Project risks; portfolio risks from 1B (with M13) | risks:read | Read | 1A, 1B | none (read) |
| get_charter, get_report | Charter and reports as Markdown | reports:read | Read | 1A | none (read) |
| add_journal_entry, add_comment | Append-only writes | journal:write, comments:write | Append-only | 1A | none (append-only) |
| update_wbs_item | Change status, dates, PIC or effort | wbs:write | Reversible write | 1B | none (reversible) |
| create_change_request_draft, create_risk | Drafts that people submit | changes:draft, risks:write | Reversible write | 1B | none (reversible) |
| generate_report | Report draft for a template and period | reports:write | Reversible write | 1B | none (reversible) |
| prepare_decision | Prepare a CR, gate or portfolio decision for confirmation in the app | prepare only | Prepare-only | 1B | `per_call` |

# 10. Project Execution Requirements

## M06 Project Charter & Business Case (CHR)

Purpose: a charter that is a live slice of project data rather than a separate document (Survey §03). Sections V and VI are synchronized from the WBS; the business case, budget and sponsorship fields come from BRD v2.0 module M03.

Wireframes: {{WF:CHR}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| CHR-01 | **Charter structure.** Nine sections: I Project Identification, II Key Contacts, III Description & Objectives, IV Project Scope, V Deliverables, VI Input Required, VII Overall Project Risk, VIII Other Notes, IX Sign-off. | All nine sections appear in the UI and in the PDF in this order. | P0 | POC 04-07 |
| CHR-02 | **Identification (I).** Project name, client or department, project manager, start date, target completion, overall status, project number, contract value or number, revision number, revision description, project team (name, title or role). Values are shared with the project record, Overview, WBS and Timeline. | Changing target completion in the charter updates the project record, subject to the baseline lock (BR-04). | P0 | POC 04 |
| CHR-03 | **Key contacts (II).** Rows of role, name, email and phone; add and remove rows; default roles Approved Representative, Contracting Officer Representative and Key Contact, configurable per workspace. | Default roles appear on new charters. | P0 | POC 05 |
| CHR-04 | **Description, objectives and scope (III-IV).** Description; objectives, one per line; in scope; out of scope. | Objectives render as a list in the PDF. | P0 | POC 05 |
| CHR-05 | **Deliverables, live (V).** Read-only list of work items with Type = Deliverable (Category nodes excluded), with dates and descriptions taken from the WBS; when empty, a link opens the WBS Master. | Editing a deliverable's date in the WBS updates section V without manual action. | P0 | POC 06; BR-22 |
| CHR-06 | **Client commitments, live (VI).** Read-only list of work items labelled Input Required, with description, PIC (may be the client) and target date, plus a charter note per row. | Labelling an item Input Required adds it to VI at once; the note stays attached to that item. | P0 | POC 06 |
| CHR-07 | **Overall project risk (VII).** Shows the project's top risks (risk, mitigation plan, owner) from the risk register; risks can be added from the charter. | A risk added in the charter appears in the register, and the reverse. | P0 | POC 07; v2 FR-601; New |
| CHR-08 | **Notes and sign-off (VIII-IX).** Free notes; sign-off by Client Representative, Project Owner and Project Manager, each recorded with authenticated signer, timestamp and charter revision. | A signed revision is frozen; further edits start a new revision. | P0 | POC 07; Survey §03; D-12 |
| CHR-09 | **Charter revisions.** Issuing a revision snapshots the charter with revision number and description; earlier revisions remain viewable. | Each issued revision can be opened read-only. | P0 | POC 04; Survey §03; D-12 |
| CHR-10 | **Revision comparison.** Side-by-side comparison of two charter revisions. | Changed fields are highlighted. | P1 | Survey §03; D-12 |
| CHR-11 | **Charter export.** Download as formatted PDF (sections, client commitments with PICs, risks, sign-off lines) or as data (JSON). | The PDF lists every Input Required item with PIC and date. | P0 | POC 08; PLT-16 |
| CHR-12 | **Business case.** Problem, opportunity, target customer, strategic rationale, alternatives, expected benefits and assumptions. | The business case is approved before the project becomes committed. | P0 | v2 FR-201 |
| CHR-13 | **Budget and timeline.** Approved budget, actual, forecast, start and end dates and milestones; budget and date variance calculated automatically. In the MVP, actuals are entered or imported (ERP integration is V2). | Variance updates when actual or forecast changes. | P0 | v2 FR-202, §13 |
| CHR-14 | **Owner and sponsor.** An accountable project owner and an executive sponsor. | Both are mandatory before commitment (BR-01). | P0 | v2 FR-203 |
| CHR-15 | **Strategic linkage.** Link the project to one or more strategic objectives (a workspace-managed list in the MVP) or record an approved exemption. | Committed projects without objective or exemption are flagged (BR-02). | P0 | v2 BR-02, §22; D-25 |
| CHR-16 | **Lifecycle position.** Current stage, gate readiness and framework version shown on the project. | Values match the project's stage instances. | P0 | v3 §14 (M03) |
| CHR-17 | **Create project.** A project is created with workspace, portfolio, optional program, name, client or business unit, PM, owner and sponsor, and an optional project template (GOV-27 when available); the workspace's published lifecycle framework version is pinned (BR-15); the project starts in Draft with a setup checklist (charter I-IV, business case, team, first WBS items) that leads to commitment. | (1) A project cannot be created outside a workspace (BR-13). (2) The new project shows its pinned framework version and its setup checklist. | P0 | RF-25; v3 §13 |

![POC 06: Charter sections V and VI are synchronized live from the WBS Master (CHR-05, CHR-06).](source/images/poc-06.jpg){width=6.6in}

## M07 WBS Master (WBS)

Purpose: the heart of project execution. One data set, three views (Table, Tree Diagram, Blueprint), one item form, and dependencies that warn but never reschedule.

Wireframes: {{WF:WBS}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| WBS-01 | **Single source of truth.** Project work is created and edited only through the WBS (table, tree, item form, Board, Builder); every other view reads from it. | No other view stores its own copy of WBS fields (BR-22). | P0 | POC 06, 09; Survey §00 |
| WBS-02 | **Hierarchy.** Hierarchical items with codes 1.0, 1.1, 1.1.1; Level is derived from position; Category nodes exist only at level 1; up to five levels. | An item cannot be created deeper than the maximum depth. | P0 | POC 09, 19; D-06 |
| WBS-03 | **Code generation.** The system generates codes when items are created and renumbers them on move; each item keeps a permanent internal ID so links, dependencies and history survive renumbering. | Moving 1.2 under 1.1 renumbers it 1.1.3 with dependencies and activity intact. | P0 | POC 19; Survey §04; D-05 |
| WBS-04 | **Table view.** Columns: selection, WBS (code, name, type and label icons), Description, Type, Phase, PIC, Start, Target, Duration, Status, Priority, Risk, Actions (add child, attach, duplicate, delete); inline editing with date pickers; expand and collapse; the WBS column stays visible during horizontal scroll. | All columns are editable inline except Duration and codes; the View Option menu switches between Table, Tree Diagram and Blueprint. | P0 | POC 09-11 |
| WBS-05 | **Filters.** Category, Phase, Type, Status and PIC, default All, applied instantly without an Apply button; matches keep their hierarchy context. | Filtering by PIC shows matching items with their parents. | P0 | POC 09; Survey §04 |
| WBS-06 | **Bulk actions.** After multi-select: change Status, PIC, Phase, Priority or Risk Level; delete with confirmation. | A bulk change is recorded in each item's activity. | P0 | POC 09; Survey §04 |
| WBS-07 | **Drag-and-drop restructuring.** Reorder and re-parent items by drag-and-drop in the table. | Codes renumber per WBS-03. | P1 | Survey §04 |
| WBS-08 | **Tree Diagram view.** Hierarchy canvas with dependency arrows; Auto Vertical and Auto Horizontal layouts; zoom; expanded full-screen view. | Every item appears once; arrows match dependencies. | P0 | POC 12-13 |
| WBS-09 | **Free Move layout.** Drag nodes anywhere; positions are remembered. | Positions persist across sessions. | P1 | POC 13 |
| WBS-10 | **Blueprint view.** Shows Deliverable Builder canvases (items, connections, connection points) exactly as laid out; when empty, a button opens the Builder. | The Blueprint matches the canvas saved at generation. | P0 | POC 14; BLD-08 |
| WBS-11 | **Item form.** WBS code, parent, level (derived), Category (PM control area), Type (work object level), Phase, Labels (multi), Name (required), Description, Input Required list, Output Produced list, Files & Links, PIC, Reviewer, Approver, Start Date, Target Date, Duration (auto), Planned Effort, Actual Effort (entries such as 12h or 2d 4h), Status, Priority, Risk Level, Dependencies, Notes. | (1) Name and parent or Category are required. (2) Target is not before Start. (3) Effort text is stored as hours. | P0 | POC 19-21; New (Planned Effort) |
| WBS-12 | **Assignment.** PIC, Reviewer and Approver are chosen from workspace members; "Client" can be chosen as an external party for Input Required items. | Free-text names are not accepted for internal people. | P0 | POC 06, 09, 34 |
| WBS-13 | **Dependencies.** Predecessor links of type FS, SS, FF or SF between items of the same project; violations are flagged on both items; dates are never moved automatically. A conflict is evaluated only when both compared dates exist (BR-40). | (1) An FS predecessor finishing after the successor starts shows a conflict flag on both items and no date changes (BR-23). (2) A link whose compared date is missing shows "schedule data incomplete", not a conflict. | P0 | POC 20, 25; RF-09, RF-33 |
| WBS-14 | **Cross-project dependencies.** Dependencies between items, MVPs and milestones of different projects in the same workspace. | The impact is visible in both projects and in the dependency map (RSK-03). | P0 | v2 FR-603 |
| WBS-15 | **Duration.** Duration = Target − Start + 1, in calendar days (POC behaviour) or in working days from the workspace business calendar. | 13 Jul-28 Aug 2026 shows 47 calendar days or 35 working days (Mon-Fri, no holidays). | P0 | POC 10; v3 WS-003; D-07 |
| WBS-16 | **Activity and comments.** Each saved item shows its change history (e.g. "Nadia R. changed Status") and comments with @mentions and attachments, posted as the signed-in user. | Activity starts on first save; @mentions notify (PLT-09). | P0 | POC 19, 21 |
| WBS-17 | **Item attachments.** Files and links on an item (deliverables, references), available once the item has been saved. | Attachments are stored per PLT-07. | P0 | POC 19 |
| WBS-18 | **Category nodes.** Category nodes group work by PM control area; their dates, status and progress roll up from their children; they are excluded from work-item counts and KPIs. | Overview totals equal the number of work items (BR-24). | P0 | POC 02, 28, 32; New |
| WBS-19 | **Duplicate and delete.** Duplicate an item with or without children; deleting an item that has children or dependents requires confirmation listing what will be removed. | Deleted dependencies are removed from both ends. | P0 | POC 10 |
| WBS-20 | **Saved views and column presets.** Column presets for common jobs (Planning: dates, duration, dependencies; Tracking: status, PIC, target; Risk: risk level, labels), personal saved views (filters, columns, sort, expansion) and views shared with the project; key columns stay frozen; the table is fully operable from the keyboard. | A saved view reopens with the same filters, columns and sort; a shared view is available to every project member. | P0 | RF-38 |

![POC 09: WBS Master, Table view with Category rows, filters, Deliverable Builder entry point.](source/images/poc-09.jpg){width=6.6in}

![POC 19: WBS item form. Level, Category, Type and Phase overlap, hence WBS-02, WBS-18 and D-06.](source/images/poc-19.jpg){width=6.6in}

![POC 13: Tree Diagram with Free Move, Auto Vertical and Auto Horizontal layouts.](source/images/poc-13.jpg){width=6.6in}

## M08 Deliverable Builder & Process Frameworks (BLD)

Purpose: the POC's most distinctive capability. Instead of typing tasks one by one, the PM picks a process framework and generates a pre-wired set of WBS items and dependencies. The survey rates it the hardest block to build (custom canvas, drag-and-drop, connector drawing, automatic date spreading) and recommends a separate milestone. The frameworks themselves are authored in their own editor, outside any project, as the POC does under Settings, Frameworks (BLD-13 to BLD-16; editor surveyed on 3 Oct 2026, see review/poc-frameworks-coverage.md).

Wireframes: {{WF:BLD}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| BLD-01 | **Launch and target.** From the WBS Master, the PM opens the Builder and either builds under an existing item or creates a new deliverable (name and parent Category). | The new deliverable is created under the chosen Category. | P0 | POC 15, 17 |
| BLD-02 | **Framework selection and preview.** Cards show each framework's flow summary and item and relationship counts; a read-only swimlane preview opens with "Use this framework". | Preview counts equal the framework definition. | P0 | POC 15-16 |
| BLD-03 | **Canvas.** Swimlanes defined by the framework (default: Deliverables, Approval, Input Required, Quality Gate, Milestones, Risk); nodes show provisional WBS codes; one Start Date drives the dates of all nodes. | Changing the Start Date shifts every node by the same offset rule (D-09). | P0 | POC 16, 18 |
| BLD-04 | **Canvas editing.** Drag a node along its lane to reschedule; click a node to edit it with the full item form; drag the link handle onto another node to connect; double-click a lane line to add a connection point; select an arrow and drag its ends or corners; Delete removes; "+" adds a node to a lane. | Each listed gesture works with the mouse and has a keyboard equivalent (BR-41); the list editor (BLD-12) performs the same edits without the canvas. | P0 | POC 18-19; RF-35 |
| BLD-05 | **Generate into the WBS.** "Build N items into the WBS" creates the items with codes, labels and dependencies under the target deliverable and saves the canvas as that deliverable's Blueprint. | Item and relationship counts in the WBS equal the canvas (e.g. 16 and 15 for CGI Still Renders). | P0 | POC 18 |
| BLD-06 | **Lane mapping.** Each lane maps to WBS attributes (Label and, optionally, Category) as defined in the framework. | Items generated from the Approval lane carry the Approval Gate label (per D-09). | P0 | POC 18; D-09 |
| BLD-07 | **Re-run protection.** Running the Builder again for the same deliverable asks whether to add another set or cancel; items with progress, effort or comments are never overwritten. | No existing item changes after a re-run (BR-31). | P0 | Survey §05; D-09 |
| BLD-08 | **Blueprint storage.** One Blueprint per deliverable; the Blueprint view lets the user choose the deliverable. | Two deliverables built separately show two Blueprints. | P0 | POC 14; Survey §05; D-09 |
| BLD-09 | **Framework library.** Built-in frameworks (CGI Still Renders, 3D Animation / Video, Simple Review Loop) are read-only, maintained by the provider as published immutable versions, and a starter template or a configuration pack may reference such a version directly, which is a reference and not a workspace publication; users create frameworks in the process framework editor (BLD-13) or "Edit a copy" of a built-in or published framework; either way the result is a draft framework of the workspace, published under BLD-16. | (1) Editing a built-in always produces a custom copy. (2) A template or pack that offers a built-in framework records the provider's published version and creates no publication event in the workspace, so the authority of BLD-16 is never bypassed. | P0 | POC 35; D-23 |
| BLD-10 | **Framework provenance.** Generated items record the framework and version used. | Provenance is visible on each generated item. | P0 | v3 TPL-007; New |
| BLD-11 | **Framework governance.** Custom process frameworks gain the review step of the template workflow (GOV-21) before publication and can be shared with other workspaces through the template library; in Release 1 the Workspace Owner publishes them without review (BLD-16). | A framework that needs review is offered in the Builder only after its review is approved. | P1 | v3 §7; Survey §05 |
| BLD-12 | **Build preview, re-run difference and list editor.** Before building, a preview lists the items, codes, labels, dates and dependencies that will be created; building is deterministic (the same framework version, target and Start Date always give the same result); a re-run shows the difference against the existing set before confirmation; a list editor (an outline of lanes and nodes) edits the same graph as the canvas with the keyboard. | (1) The preview counts equal the created items and relationships. (2) Every canvas edit can be done in the list editor without a pointer. | P0 | RF-15, RF-35; D-09 |
| BLD-13 | **Process framework editor.** Process frameworks are authored outside any project, on a canvas and its list view (BLD-12), opened from the template library with New framework, Edit a copy or Open. The editor shows lanes, nodes, connections and connection points on a relative day axis whose day 0 is the Builder Start Date; it never shows calendar dates, named people or a project's items. Lanes can be added, renamed, reordered and removed while empty; each lane maps to one Label or none and optionally a Type (BLD-06); a new framework starts with the default lanes of BLD-03. Gestures and keyboard equivalents follow BLD-04 and BR-41; drafts autosave with the save state shown (PLT-05). Equivalence is specified as a parity matrix rather than as one sentence: one row per editor operation (create, edit, move between lanes and reorder a node; set or clear a parent; add, rename, reorder and remove a lane; create a connection and set its type and lag; delete a connection; add, move and delete a route point) naming its canvas gesture, its keyboard command, its list-view action and the server command all three call, so each row is a test. The matrix is a Discovery artifact of the foundation contract pack (18.4) and the list view ships every row of it. | (1) A framework created with New framework, published (BLD-16) and chosen in the Builder of any project of the workspace produces exactly the nodes and connections drawn. (2) Every row of the parity matrix passes in the list view with the keyboard alone, and no editor operation exists that the matrix does not list. | P0 | POC 35; D-09; BR-41 |
| BLD-14 | **Framework node template.** A node stores its name, lane, optional parent node (a sub-item, within the depth limit of WBS-02), Type, Labels (the lane label by default), description, input and output lists, offset and duration in days of the workspace duration basis (D-07), optional planned effort, PIC, Reviewer and Approver as an assignment selector or left for the PM, priority and risk level. A selector is typed, not free text: it names either a workspace role or a member title (WSP-10, for example 3D Lead or Client), stored as the kind plus the identifier of the role or the normalized title, offered with autocomplete from the roles and titles the workspace already uses, and a title that nobody holds yet is accepted with the badge "no matching member yet". Resolution at build time has three outcomes, never one: resolved to exactly one member; missing, when nobody holds it, which leaves the field empty; and ambiguous, when more than one member holds it, which the build preview lists for the PM to choose. Metis never picks the first match. Renaming a title keeps the selector working through an alias recorded with the rename, or invalidates it explicitly with a listed consequence; D-40 settles whether matching is the normalized title or a mapping the customer maintains. Status, actual effort, dates, named people, files and links to project items exist only on the generated WBS items. | (1) A generated item starts on the Start Date plus the node offset and lasts the node duration (WBS-15). (2) A selector that matches one member resolves to that member; one that matches nobody leaves the field empty and is listed as missing in the build preview; one that matches several is listed as ambiguous with the candidates and blocks the build until the PM chooses (BLD-12). (3) Renaming a title does not silently unassign a node: the alias keeps it resolved, or the preview lists it as missing. | P0 | POC 35; D-09; D-40 |
| BLD-15 | **Framework connections.** A connection joins two nodes of the same framework and carries a dependency type (FS, SS, FF or SF; FS by default) and a lag in days; the dependencies generated from it keep both (WBS-13). Connection points only route arrows: every connection starts and ends at a node. | (1) The dependencies created by a build equal the framework connections in number, type and lag. (2) The editor offers no project item as the end of a connection. (3) A connection whose type and lag contradict the offsets and durations of its two nodes for every Start Date is reported by the publish check of BLD-16. | P0 | POC 35; D-09 |
| BLD-16 | **Process framework lifecycle in Release 1.** A process framework is Draft, Published or Deprecated. Project Managers and Workspace Owners create and edit drafts; the Workspace Owner publishes a draft that passes the check: at least one node; every node named and in a lane; offsets and durations of zero or more; no dependency cycle; sub-items within the WBS-02 depth; and constraint consistency, which compares each connection's type and lag with the offsets and durations of the nodes it joins. A conflict that must occur for every Start Date (for example a finish-to-start connection whose successor's offset places it before its predecessor finishes) blocks publication and is named with its two nodes; a conflict that depends on the project's own dates is a warning, since the schedule itself only generates dependencies as constraints and never moves dates (BR-23). Without this check a framework can publish and make every build it produces generate an immediate schedule conflict. Publishing creates an immutable version with number, effective date, publisher and change summary (as for templates, GOV-22 and GOV-23); editing a published framework opens a new draft; the Builder offers the latest published version of each framework and records it on the generated items (BLD-10). A draft that was never published can be deleted after confirmation; a published framework is deprecated instead (no longer offered, its history and provenance kept). The review step and sharing beyond the workspace (BLD-11) and a named replacement on deprecation (GOV-28) remain P1. | (1) A draft that fails the check shows each failure and keeps Publish disabled. (2) Publishing a new version never changes an existing Blueprint or generated item. (3) A deprecated framework still shows on the items built from it. (4) A draft whose connection types and lags contradict its offsets and durations for every Start Date cannot be published, and one whose conflict depends on the project's dates publishes with the warning recorded. | P0 | POC 35; GOV-21, GOV-22; D-09 |

![POC 16: Framework preview. Six lanes, 16 items and 15 pre-wired relationships for CGI Still Renders.](source/images/poc-16.jpg){width=6.6in}

![POC 18: Builder canvas. Provisional codes (1.4.x, 7.x, 8.x, 9.x, 10.x) show the lane-to-WBS mapping that D-09 must settle.](source/images/poc-18.jpg){width=6.6in}

![POC 35: Settings, Frameworks. Built-in frameworks and "Edit a copy"; the editor behind "+ New framework", "Edit a copy" and "Edit" is specified in BLD-13 to BLD-16.](source/images/poc-35.jpg){width=6.6in}

## M09 Project Plan: Timeline & Board (PLN)

Wireframes: {{WF:PLN}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| PLN-01 | **Plan area.** Project Plan groups Timeline, Board, Changes and Reports with a full-screen toggle. | Switching views keeps the project context. | P0 | POC 22-28 |
| PLN-02 | **Timeline.** Point-in-time timeline of dated work items: each card shows date, days relative to today, code and name, a status dot and an OVERDUE tag when late; filter; zoom (default 100%); horizontal or vertical orientation; equal-spacing mode. | An item past its target date and not Done shows OVERDUE. | P0 | POC 22 |
| PLN-03 | **Timeline overlays.** Lifecycle stages, gate dates and governance milestones on the timeline. | Gate dates appear as distinct markers. | P1 | v3 §14 (M05) |
| PLN-04 | **Project Gantt.** Bar-based Gantt with dependency lines. | Bars and dependency lines match WBS dates and links. | P1 | Survey §07; D-11 |
| PLN-05 | **Board.** Kanban columns from the workspace Status list (Not Started, In Progress, Waiting, Blocked; Done per D-10) with counts; cards show code, name, labels, PIC avatar, target date and priority; drag-and-drop changes status and is recorded in the item's activity; a "Move to…" menu on every card does the same from the keyboard or on touch (BR-41); "+ Add Task" creates an item in that column; empty columns show a drop zone; filter. | (1) Dragging a card to Blocked sets Status = Blocked and logs the change. (2) "Move to…" gives the same result and announces the new status to screen readers. | P0 | POC 23; Survey §07; D-10; RF-36 |

![POC 22: Timeline, point-in-time cards with OVERDUE tags.](source/images/poc-22.jpg){width=6.6in}

![POC 23: Board by status. No Done column in the POC (D-10).](source/images/poc-23.jpg){width=6.6in}

## M10 Project Overview & Focus (OVW)

Purpose: read-only views that summarise the WBS for the project (Overview) and for the person (Focus). Portfolio and program aggregation is covered by M15.

Wireframes: {{WF:OVW}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| OVW-01 | **KPI tiles.** Total work items, Deliverables, Work Packages, Milestones, Gates, Blocked, Delayed and High Risk, calculated per Section 12; tiles for Blocked, Delayed and High Risk are highlighted when above zero. | Tile values equal the Weekly Status health summary for the same date. | P0 | POC 02; Section 12 |
| OVW-02 | **Charts.** Overall progress (Done / total work items), status breakdown with counts, progress by Category (done versus total). | Charts exclude Category nodes. | P0 | POC 02 |
| OVW-03 | **Attention lists.** Workload by PIC (open items only), upcoming milestones and gates, overdue items with a count badge, high and critical risk items. | List membership follows Section 12. | P0 | POC 03 |
| OVW-04 | **Drill-down.** Every tile, chart segment and list entry opens the filtered WBS or the item. | Clicking "Blocked" opens the WBS filtered on Status = Blocked. | P0 | POC 03; v2 §18; Survey §02 |
| OVW-05 | **Project health.** Computed RAG health (delivery, risk, resource, financial) shown next to the PM-declared status; a mismatch is flagged as green-but-risky. | A declared Green with a computed Red is flagged until an override with rationale exists (BR-08). | P0 | v2 FR-003, BR-08; New |
| OVW-06 | **Focus.** "Today & This Week" with the date and a one-line summary; counters for overdue, due today, due in the next 7 days and in progress; columns Overdue, Due this week, Starting this week; rows show code, name, PIC, status and days overdue; each empty column states why it is empty; "Only mine" filters to the signed-in user. | Counts follow Section 12 (e.g. days overdue = today − target date). | P0 | POC 29 |
| OVW-07 | **Quick update from Focus.** Change status or mark done without opening the item. | The change is logged in the item's activity. | P0 | Survey §08; RF-11 |
| OVW-08 | **My work across projects.** Focus across all projects of the workspace that the user belongs to. | Items from several projects appear with project names. | P0 | Survey §08; RF-11 |
| OVW-09 | **My approvals.** One queue of everything waiting for the user's decision across the workspaces they belong to: CR decisions, gate decisions and votes, charter sign-offs, waiver requests, deliverable approvals (items labelled Approval Gate where the user is Approver) and decisions prepared through MCP; each row shows type, project, requester, age and due date and opens the decision screen; the navigation shows how many the user can act on now; items blocked by another decision show their blocker. | (1) Every pending request addressed to the user appears once and disappears when decided or withdrawn. (2) The navigation count equals the number of queue items the user can act on now. | P0 | RF-12, RF-27; PLT-09 |

![POC 02: Project Overview. "22%" and "18 items" count the six Category rows; the Weekly Status report shows 25% and 12 items (Section 12.2).](source/images/poc-02.jpg){width=6.6in}

![POC 29: Focus, "Today & This Week".](source/images/poc-29.jpg){width=6.6in}

## M11 Change Control, Baseline & Decision Log (CHG)

Purpose: combine the POC change register (advisory, with impact analysis) with v2.0 baseline governance. Before commitment the register is advisory, as in the POC; after commitment locked fields change only through approved CRs.

Wireframes: {{WF:CHG}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| CHG-01 | **Change register.** Counters (Open, Approved, Rejected, Total logged), status filters (All, Open, Approved, Rejected, Deferred, Closed), columns Ref, Change, Type, Priority, Status, Requester, Logged and Impacts; references numbered CR-001, CR-002…; the register states whether the project is baselined (enforced) or not (advisory). | Counters equal the filtered lists. | P0 | POC 24 |
| CHG-02 | **CR form.** Requester, Type (Scope, Schedule, Budget, Resource, Dependency, Other), Priority, What is changing, Why (justification), Affected WBS items, Schedule impact (days), Budget impact, Resource impact (FTE), Impact notes (cost, risk, quality), Proposed action, Effective date. | What, Why, Type and at least one affected item or baseline field are mandatory. | P0 | POC 25; v2 FR-703 |
| CHG-03 | **Impact analysis.** Automatic count and list of directly affected items and of downstream items that could shift through dependency links; advisory only. | For POC CR-001: 1 item directly affected, 0 downstream; nothing is rescheduled. | P0 | POC 25; BR-23 |
| CHG-04 | **Review and decision.** Approver; status (Draft, Under Review, Approved, Approved pending application, Rejected, Deferred, Withdrawn, Closed); decision notes; actions Approve, Reject, Defer and Request information. | A decision without rationale is blocked (BR-30); decisions record actor and time. | P0 | POC 25; v2 FR-703, §8 wireframe |
| CHG-05 | **CR history.** Submission, edits, information requests and decisions with actor and timestamp. | History cannot be edited. | P0 | POC 25; PLT-11 |
| CHG-06 | **Baseline.** On commitment (charter approval or the configured gate) the system captures a baseline of scope (deliverables), dates, budget and critical dependencies; locked values cannot be edited directly. | Editing a locked target date prompts the user to raise a CR (BR-04). | P0 | v2 FR-702 |
| CHG-07 | **Applying approved changes.** An approved CR unlocks only its affected baseline fields for the PM to apply; the CR shows "Approved pending application" until applied; before applying, the PM sees the difference between the current baseline and the values to apply; applying creates a new baseline version referencing the CR. Each role sees only its actions: the requester edits or withdraws, the approver decides, the PM applies. | (1) Approved CRs not applied within the workspace threshold raise an attention item (BR-05). (2) Apply is available only after the difference has been shown. | P0 | v2 BR-05; POC 24; D-08; RF-39 |
| CHG-08 | **Structured change sets.** A CR carries proposed field changes that are applied automatically on approval. | Applied values equal the approved change set. | P1 | D-08 |
| CHG-09 | **Segregation of duties.** The requester cannot be the sole approver of the same CR unless workspace policy allows self-approval for operational changes. | Self-approval is blocked by default (BR-28). | P0 | POC 25; New |
| CHG-10 | **Approval authority.** Thresholds on schedule, budget and FTE impact route CRs to PM, PMO or Executive per the role model. | A CR above the PMO threshold requires an Executive decision. | P1 | v2 §12 |
| CHG-11 | **Decision log.** CR, gate and portfolio decisions stored with rationale, evidence links, approver and date; immutable after approval except through a correction workflow; Journal entries of type Decision can be promoted. | A promoted decision links back to its journal entry. | P0 | v2 FR-704; v3 §8; POC 26 |
| CHG-12 | **CR deletion.** Only draft CRs can be deleted; submitted CRs are withdrawn or closed with a reason. | "Delete" is unavailable after submission (BR-29). | P0 | POC 25; New |

![POC 25: Change request detail with impact analysis, review and decision, and history.](source/images/poc-25.jpg){width=6.6in}

## M12 Journal & Project Reporting (RPT)

Wireframes: {{WF:RPT}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| RPT-01 | **Journal.** Everyday project log with entry types Note, Meeting, Decision, Issue and Highlight; optional link to a WBS item; timestamped and attributed; entries flow into reports. | A linked entry appears in that item's report section. | P0 | POC 26 |
| RPT-02 | **Report builder.** Templates Weekly Status, Executive Summary, Full History and Custom; period from and to; selectable sections Health summary, Completed this period, Coming up (next 7 days), Overdue, Milestones, Journal entries, Item notes, Change requests, Activity log; default title "[Template]: [from] to [to]". | Each template preselects its default sections. | P0 | POC 27 |
| RPT-03 | **Report output.** Generated on screen with project, period, preparer, data as-of time and metric version; copy as Markdown; export to PDF; save to the Saved list. A saved report is a snapshot that keeps its figures when the data changes (BR-39). | (1) Health summary figures equal the Overview for the same as-of time (Section 12). (2) A saved report reopened later shows its original figures and as-of time. | P0 | POC 28; RF-18 |
| RPT-04 | **Weekly status submission.** The workspace sets the reporting cadence; for each period the PM publishes a status report (generated report, declared health and narrative); missing or late submissions appear in the executive attention queue. | A project without a submission at the cadence deadline raises an exception (BR-09). | P0 | v2 FR-701; POC 27-28 |
| RPT-05 | **Report sharing.** Saved reports shared by permission-checked link inside the organization; external sharing only per D-02. | A link opened by an unauthorized user shows no content. | P1 | Survey §07; D-02 |

![POC 28: Weekly Status report generated from WBS, journal and CR data.](source/images/poc-28.jpg){width=6.6in}

## M13 Risk & Dependency (RSK)

Wireframes: {{WF:RSK}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| RSK-01 | **Project risk register.** Risk, description, probability, impact, score and severity (one method per workspace), owner, mitigation plan, due date and status; linked to WBS items with Risk Level or the Risk Related label and to charter section VII. | (1) Score and severity are calculated consistently. (2) High or Critical item risks without a register entry are flagged. | P0 | v2 FR-601; POC 03, 07, 09 |
| RSK-02 | **Portfolio risk.** Aggregate project risks and identify systemic risks across projects. | Cross-project risks are grouped and traceable. | P0 | v2 FR-602 |
| RSK-03 | **Dependency map.** Upstream and downstream dependencies between projects, MVPs and milestones. | A dependency delay shows the impacted downstream items. | P0 | v2 FR-603; WBS-14 |
| RSK-04 | **Green-but-risky detection.** Projects declared Green while risk rules indicate Amber or Red are flagged until an override with rationale is recorded. | Flags appear in the attention queue (BR-08). | P0 | v2 BR-08, §23 |
| RSK-05 | **Gate-aware risk.** Stage and gate readiness included in health and escalation. | A gate overdue beyond its SLA lowers stage health. | P1 | v3 §14 (M07) |

## M14 MVP & Product Delivery (MVP)

Wireframes: {{WF:MVP}}.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| MVP-01 | **MVP definition.** Objective, customer problem, scope, release date, KPI, owner and expected benefit. | Every MVP has a clear outcome and release criteria (BR-06). | P0 | v2 FR-301 |
| MVP-02 | **Feature linkage.** Features (WBS work items) are linked to MVPs and milestones. | No orphan feature in a committed MVP. | P0 | v2 FR-302 |
| MVP-03 | **MVP health.** Scope, schedule, resource and dependency health and progress at MVP level, calculated as defined in Section 12.1. | Progress and health follow Section 12.1, and MVP status can be compared with project status. | P0 | v2 FR-303; RF-21 |
| MVP-04 | **Workspace option.** MVP objects are enabled per workspace (e.g. product delivery) and can be disabled where not used (e.g. creative production). | A workspace with MVPs disabled hides MVP fields and views. | P0 | v3 §10; New |
| MVP-05 | **MVP lifecycle.** An MVP or release lifecycle can reference the workspace framework. | MVP stages come from a published framework. | P1 | v3 §14 (M04) |