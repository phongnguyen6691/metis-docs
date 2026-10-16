
# Appendix A. Glossary

| Term | Meaning |
|------------------------------|------------------------------------------------------------------------------|
| Access token (personal access token) | Secret a user creates so an LLM client or script can act on their behalf through MCP or the API, limited by scopes and expiry |
| Action class (MCP) | The safeguard class of an MCP tool: read, append-only, reversible write or prepare-only (MCP-19) |
| Approval Gate (label) | WBS item representing an approval step, decided by the item's Approver |
| As-of time | The time of the newest data included in a figure, report or AI answer; shown with the metric version (BR-39) |
| Baseline | Approved snapshot of scope, dates, budget and critical dependencies; changed only through CRs |
| Blueprint | Saved Deliverable Builder canvas of a deliverable, shown in the WBS Master's Blueprint view |
| Break-glass access | Support access with no standing rights: requested with a reason, approved by a tenant admin, scoped, expiring and revocable at once (TEN-09) |
| Category | Level-1 WBS grouping node representing a PM control area; not a work item |
| Change Request (CR) | Formal request to change scope, schedule, budget, resources or dependencies, with impact analysis and decision |
| Checkpoint (label) | WBS item marking a review or quality checkpoint |
| Connection point | A point placed on a lane line of a process framework or Builder canvas to route arrows; it creates no item and no dependency (BLD-15) |
| Data freshness | Whether data is recent enough to trust: fresh, stale (older than the workspace threshold), partial (some sources missing) or unknown |
| Decision Log | Immutable record of governance decisions with rationale and evidence |
| Deliverable | Work item type for an output handed to a client or stakeholder |
| Deliverable Builder | Tool that generates WBS items and dependencies from a process framework |
| Deliverable Process Framework | Reusable swimlane template of steps, approvals, inputs, quality gates, milestones and risks for producing a deliverable |
| Focus | Personal view of overdue, due-this-week and starting-this-week items |
| Foundation contract pack | The shared interfaces every stream builds on (tenant context, permissions, write contract, metrics and snapshots, audit, lifecycle versions, files, MCP tools, data lifecycle), signed off at the end of Discovery (18.4) |
| FS / SS / FF / SF | Finish-to-Start, Start-to-Start, Finish-to-Finish, Start-to-Finish dependency types |
| FTE | Full-time equivalent |
| Gate | Decision point at the end of a lifecycle stage |
| Green-but-risky | Project declared Green while risk rules indicate Amber or Red |
| Input Required (label) | Commitment someone, often the client, must deliver for the project to stay on plan |
| Journal | Everyday project log of notes, meetings, decisions, issues and highlights |
| Lifecycle Framework | Versioned definition of a workspace's stages, gates, criteria and rules |
| MCP (Model Context Protocol) | Open protocol that connects LLM applications to external data and tools; the platform runs one MCP server per tenant |
| MCP client | The connector inside an LLM application that talks to an MCP server |
| MCP server | Service that offers tools, resources and prompts to MCP clients |
| MCP tool, resource, prompt | Tool: a function the model can call. Resource: read-only context. Prompt: a reusable request template |
| Metric version | Version of a metric definition in Section 12; changed definitions get a new version and never alter saved outputs (Section 12.5) |
| Milestone (label) | WBS item marking a significant point in time |
| MVP | Minimum viable product; optional outcome container with KPIs and release criteria |
| OAuth | Standard that lets a user grant an application limited access without sharing a password; MCP uses an OAuth 2.1 based flow over HTTP |
| Offset | Days between the Builder Start Date and the start of a process framework node; with the node duration it gives the dates of the generated item (BLD-14) |
| Phase | The lifecycle stage a WBS item belongs to; the Phase values are the stage names of the workspace lifecycle framework (WSP-09), so Phase on an item and Stage on a project use one list |
| PIC | Person in charge of a work item |
| Plan and entitlement | The commercial package of a tenant: enabled modules and limits |
| Portfolio (POC: Space) | Grouping of programs and projects managed as one investment portfolio |
| Program / Product (POC: Folder) | Optional grouping of projects, such as a product line or client account |
| Provider Operator | Staff of the SaaS provider who run tenants, plans and global templates without seeing tenant business data |
| RAG | Red / Amber / Green status |
| Risk Related (label) | WBS item that carries or mitigates a risk |
| SaaS | Software as a service: one hosted product serving many customer organizations |
| Saved view | A named set of WBS filters, columns, sort and expansion, personal or shared with the project (WBS-20) |
| Scope (token scope) | Permission label on a token, such as wbs:read, that narrows what the token can do |
| Snapshot | A saved report, PDF, weekly status submission or gate pack that keeps its figures, as-of time and metric version when data changes |
| Stage | A step of a workspace lifecycle framework (for example Discovery or Design) with entry and exit criteria, ending at a gate |
| Stage instance | A project's occurrence of a framework stage |
| Support access grant | Time-limited, audited access a tenant admin gives provider staff for a support case |
| Tenant | One customer organization in the SaaS, with its own users, sign-in methods, plan and data boundary |
| Tenant Admin | The customer's administrator of users, sign-in, security, plan and AI access |
| Value at risk | Expected value exposed by delayed, over-budget or low-health initiatives |
| Waiver | Time-limited, approved exception to a governance rule |
| Walking skeleton | A thin end-to-end path through every foundation contract, built in Discovery to prove the contracts fit together |
| WBS | Work breakdown structure; the single source of truth for project work |
| Work item | Any WBS node that is not a Category node |
| Workspace | Governed environment for a company, business unit or operating model, with its own configuration, roles and frameworks |

# Appendix B. Screen Inventory & POC Traceability

## B.1 VistaX POC screens

All 36 screenshots are in vistax-poc-screens/. The requirement column lists every v4.0 requirement whose Source cites the screen.

| POC | Screen or state | Module | Requirements citing it |
|------|------------------------------------------------|----------|----------------------------------------|
| 01 | Sign in, demo workspace entry | M01 | {{POC:01}} |
| 02 | Overview: KPI tiles and charts | M10 | {{POC:02}} |
| 03 | Overview: workload, milestones and gates, overdue, high risks | M10 | {{POC:03}} |
| 04 | Charter I: Project Identification | M06 | {{POC:04}} |
| 05 | Charter II-IV: contacts, description, scope | M06 | {{POC:05}} |
| 06 | Charter V-VI: live Deliverables and Input Required | M06 | {{POC:06}} |
| 07 | Charter VII-IX: risk, notes, sign-off | M06 | {{POC:07}} |
| 08 | Charter download: PDF or JSON | M06 | {{POC:08}} |
| 09 | WBS Master table and filters | M07 | {{POC:09}} |
| 10 | WBS table: dates, duration, status, priority, risk, actions | M07 | {{POC:10}} |
| 11 | WBS view options: Table, Tree Diagram, Blueprint | M07 | {{POC:11}} |
| 12 | WBS Tree Diagram | M07 | {{POC:12}} |
| 13 | Tree layouts: Free Move, Auto Vertical, Auto Horizontal | M07 | {{POC:13}} |
| 14 | Blueprint empty state | M07, M08 | {{POC:14}} |
| 15 | Deliverable Builder: target and framework choice | M08 | {{POC:15}} |
| 16 | Framework preview (CGI Still Renders) | M08 | {{POC:16}} |
| 17 | Builder: create a new deliverable | M08 | {{POC:17}} |
| 18 | Builder canvas | M08 | {{POC:18}} |
| 19 | WBS item form, upper part | M07 | {{POC:19}} |
| 20 | WBS item form, lower part: assignment, dates, effort, dependencies | M07 | {{POC:20}} |
| 21 | Edit item with activity and comments | M07 | {{POC:21}} |
| 22 | Project Plan: Timeline | M09 | {{POC:22}} |
| 23 | Project Plan: Board | M09 | {{POC:23}} |
| 24 | Project Plan: Change register | M11 | {{POC:24}} |
| 25 | Change request detail | M11 | {{POC:25}} |
| 26 | Reports: Journal | M12 | {{POC:26}} |
| 27 | Reports: Build a Report | M12 | {{POC:27}} |
| 28 | Reports: generated Weekly Status | M12 | {{POC:28}} |
| 29 | Focus: Today & This Week | M10 | {{POC:29}} |
| 30 | Sidebar tree and Docs & Links | M01, M03 | {{POC:30}} |
| 31 | Settings: General | M01 | {{POC:31}} |
| 32 | Settings: Fields & Options (Category, Type) | M03 | {{POC:32}} |
| 33 | Settings: Fields & Options (Label, Phase, Status, Priority) | M03 | {{POC:33}} |
| 34 | Settings: Team | M03 | {{POC:34}} |
| 35 | Settings: Frameworks | M08 | {{POC:35}} |
| 36 | Settings: Data (backup, export, import, clear) | M01 | {{POC:36}} |

## B.2 Target screens and wireframes

Every target screen has a wireframe in wireframes/ (HTML to open in a browser, PNG to view, manifest.json for tools and AI agents). Generated from wireframes/manifest.json.

{{WIREFRAME_TABLE}}

## B.3 What a wireframe cannot prove

Every P0 requirement is mapped to at least one screen, and the build fails when one is not. That mapping is traceability, not proof of behaviour: a screen can show that a policy, a state or an error is surfaced, and it cannot show that isolation holds on every data path, that a token's scope is enforced, that a transaction rolls back, or that an operation reachable with a pointer is also reachable from the keyboard. The requirements below therefore carry a second kind of evidence, and the build reports the requirements by evidence type so that a coverage figure is never read as a count of proven behaviours. The table is generated from brd/source/evidence.tsv.

{{EVIDENCE_TABLE}}

# Appendix C. Source Reconciliation Log

| # | Topic | Source positions | Resolution in v4.0 | Where |
|------|----------------|------------------------------------------|------------------------------------------|------------|
| C-01 | Duplicate files | S1 and S2 are byte-identical | Treated as one source; v2.0 body and v3.0 addendum compared instead | 1.1 |
| C-02 | Version label | Control table and footer say v2.0 although v3.0 content is included | v4.0 with revision history | Cover |
| C-03 | Numbering | v3.0 restarts at section 1; two "6.1" headings; journey steps numbered 9-26 | One numbering scheme; journeys restart at 1 | 7.9 |
| C-04 | Citation marker | v2 §23 ends with "cite turn0view0" | Removed | Appendix F |
| C-05 | Hierarchy | v2: Portfolio → Program → Project; v3: adds Platform and Workspace; POC: Workspace → Space → Folder → Project | v3.0 hierarchy; Space = Portfolio; Folder = Program | 7.1, D-04 |
| C-06 | Work structure | v2: Project → MVP → Feature and Milestone / WBS / Task; POC: WBS with Category rows, Types and Labels | POC WBS adopted; MVP optional; features are work items linked to MVPs; milestones are labelled work items | 7.3, M14 |
| C-07 | Meaning of "framework" | v3: lifecycle stage-gate framework; POC: deliverable process template | Two framework types with distinct names | 7.4 |
| C-08 | Phase versus stage | POC Phase list on items; v3 lifecycle stages | Phase values are the stages of the workspace framework | WSP-09 |
| C-09 | Meaning of "gate" | v3 formal stage gates; POC "Approval Gate" label on items | Two gate levels | 7.5 |
| C-10 | Change control | v2 baseline lock and mandatory CR; POC advisory register with manual application | Advisory before baseline, enforced after; approved CRs tracked until applied | M11, BR-04, BR-05, D-08 |
| C-11 | CR decision options | v2 wireframe: Approve, Reject, Request Info; POC: Approve, Reject, Defer | Approve, Reject, Defer, Request information | CHG-04 |
| C-12 | CR statuses | POC: Under Review, Approved, Rejected, Deferred, Closed | Adds Draft, Approved pending application and Withdrawn | 15.2 |
| C-13 | Weekly status | v2: PM submission with missing-report flag; POC: generated report | The published report is the submission | RPT-04 |
| C-14 | Risk | v2 risk register; POC item risk level and charter risk table | One register feeding charter VII; item risks linked | RSK-01, CHR-07 |
| C-15 | Capacity | v2 FTE capacity at P0 but HR integration at P1; POC counts open items per PIC | Count-based workload in project views; capacity and allocations maintained in the platform in the MVP; HR integration in V2 | RES-01…03 |
| C-16 | Budget and investment | v2 MVP checklist requires portfolio investment reconciliation; M09 is P1 | Project budget at P0 with simple roll-up; portfolio investment management in V2 | CHR-13, M19 |
| C-17 | Strategy | BR-02 and the v2 MVP checklist need strategic linkage; the strategy domain is V2 | Objective list in the MVP; strategy model in V2 | CHR-15, STR-01, D-25 |
| C-18 | Template priorities | TPL-001…007 are P0; the v3 roadmap puts template library and clone/adapt in V2 | Catalog, clone, adapt, publish, version and provenance at P0; comparison, migration and global library at P1 | GOV-17…26 |
| C-19 | Framework versioning | GF-012 is P1; WS-010 is P0 and a rule requires version pinning | P0 | GOV-12 |
| C-20 | Cockpit and workspace dashboard | v2 portfolio cockpit; v3 workspace dashboard and cross-workspace view | Cockpit per workspace in the MVP; cross-workspace view in V2 | M15 |
| C-21 | Notification priority | v2 integration at P1; POC has none; approvals need notifications once multi-user | In-app and email at P0; digest and chat at P1 | PLT-09, PLT-10 |
| C-22 | Roles | v2: 8 roles; v3: 9 workspace roles; POC: Admin and Member labels | One role model including Team member, Client and Viewer | Section 14 |
| C-23 | Health dimensions | v2 FR-003 includes the strategic dimension at P0; the strategy module is V2 | Strategic dimension added in V2 | EXE-03 |
| C-24 | POC metric inconsistencies | 22% vs 25% progress; "Deliverables 6" vs none; "Delayed 0" vs 9 overdue | Section 12 definitions | 12.2, BR-24, BR-32 |
| C-25 | CR self-approval | POC CR-001 has the same person as requester and approver | Segregation of duties | CHG-09, BR-28 |
| C-26 | CR deletion | POC allows deleting a submitted CR | Only drafts can be deleted | CHG-12, BR-29 |
| C-27 | Clearing a workspace | POC lets the user clear the whole workspace | Owner only, typed confirmation, retention period | PLT-15 |
| C-28 | Superseded diagrams | v2 hierarchy (§6.1), architecture (§19.1) and final product model (§24.1) | Replaced by Sections 7.1 and 7.10 | 7.1, 7.10 |
| C-29 | Claude artifact not reviewed | v2 validation note | Reviewed through the POC survey (S3) | A-01, Q-02 |
| C-30 | Two prototypes | v2 treats the Netlify prototype as the governance foundation; the VistaX POC is a second prototype | Netlify = portfolio governance reference; VistaX = project execution reference | 4.2, Appendix F |
| C-31 | Product form | Sources describe one enterprise; the product owner states a multi-tenant SaaS (v4.1) | Tenant level and module M02 added; enterprise layer per tenant | 7.1, M02 |
| C-32 | Platform Admin role | v3 §9 Platform Admin owns global configuration | Split into Provider Operator (SaaS operations, no tenant data) and Tenant Admin (customer administration) | Section 14 |
| C-33 | AI access | v2 places AI in V3 as an in-app copilot | MCP interface for any LLM in the MVP (read and append in 1A, updates in 1B); in-app copilot stays V3 and reuses the MCP tools | M05, M22, D-30 |
| C-34 | Module numbering | v4.0 used M01 to M20 | M01 to M22 with two new modules; requirement IDs unchanged | Section 8, 1.6 |
| C-35 | Wireframes | v2 ASCII wireframes; the POC covers only project screens | 35 HTML and PNG wireframes for all target screens; v2 wireframe content carried into the portfolio screens | Appendix E |
| C-36 | External pre-feasibility review | The review (S5) rated the product Go with conditions and proposed 54 refinements, some of them cutting or deferring scope because of team size | Scope kept, delivery capacity stated (A-07); every other refinement applied, partly applied or found already covered, as recorded in review/review-disposition.md | 1.7 |
| C-37 | Second external review | The review (S6) found three new defects (workspace readiness, a mandatory program, two row heights), milestone dependencies that did not hold, and targets without values | Defects fixed; milestone map corrected; proposed starting targets; the foundation contract pack made the Discovery exit, as recorded in review/review-disposition-round2.md | 1.8 |

# Appendix D. Legacy ID Traceability

Every requirement and business rule of BRD v2.0 and v3.0 maps to at least one v4.0 ID. Generated from the Source columns of this document.

{{LEGACY_TABLE}}

# Appendix E. Wireframes

The wireframe set lives in wireframes/ and is built for people and AI agents alike:

- **screens/NN-name.html**: one self-contained page per screen with real layout and copy, the shared components of assets/wireframe.css and the design tokens of brand/tokens.css. Each page declares its id, area, phase and requirement IDs in meta tags, marks sections with data-req attributes, and ends with numbered annotations that explain behaviour and cite requirement IDs.
- **png/NN-name.png**: the rendered page, for documents and quick review.
- **manifest.json**: the machine-readable index (id, title, area, phase, requirements, POC references, files), and **index.html**: a gallery for people.
- **tools/**: render.mjs renders the PNGs with the local Chrome; check.py validates markup, metadata, annotations and the no-dash rule; build-index.mjs rebuilds the manifest, the gallery and wireframes-digest.md (the text of every screen and its annotations, for readers and AI tools that cannot read the images).

The ASCII wireframes of BRD v2.0 are retired: their content now lives in the portfolio screens (cockpit, registry, roadmap, capacity, risk, investment, scenario, SteerCo, copilot) and the workspace dashboard. The POC screenshots in Appendix B.1 remain the evidence of observed behaviour. Selected wireframes of capabilities the POC does not cover:

{{WIREFRAME_FIGURES}}

# Appendix F. Netlify Prototype Cross-Check (from BRD v2.0)

BRD v2.0 reviewed the Netlify "Enterprise Governance Platform MVP Demo". It showed resource capacity across 50 resources, resource bottlenecks, active risk counts, department workload, project health across 25 projects, a Requires Attention section, project search and filtering, project drill-down, missing weekly report alerts, green-but-risky discrepancy detection and pending change requests. This prototype was not re-reviewed for v4.0 (A-03, Q-05).

| Prototype element | Observed | BRD v2.0 treatment | v4.0 requirements |
|------------------------------|--------------|------------------------------------------|------------------------|
| Resource Capacity | Yes | Keep as P0; expand to demand and capacity scenarios | RES-01, RES-04 |
| Resource Bottleneck | Yes | Keep; link to projects and capabilities | RES-02 |
| Risk Overview | Yes | Keep; add systemic portfolio risk | RSK-02 |
| Department Workload | Yes | Keep; add capability-level capacity | RES-01 |
| Project Health | Yes | Keep; add multi-dimensional health score | EXE-03, OVW-05 |
| Requires Attention | Yes | Keep and make it the CEO entry point | EXE-02 |
| Missing Weekly Reports | Yes | Keep as governance exception | RPT-04 |
| Green-but-Risky | Yes | Keep as risk-engine discrepancy | RSK-04 |
| Change Requests | Yes | Keep and formalize baseline governance | CHG-01…CHG-07 |
| Project Registry | Yes | Keep; add strategy and investment fields | REG-01, REG-02, REG-03 |
| Milestones / Checkpoints | Yes | Keep; connect to MVP and WBS | WBS-11, MVP-02 |
| Strategic Alignment | Not evidenced | Add P0/P1 | CHR-15, STR-01 |
| Investment / Benefits | Not evidenced | Add P1 | INV-01, INV-02 |
| Scenario Planning | Not evidenced | Add P1 | STR-03, STR-04 |
| AI Copilot | Not evidenced | Add P2 | AIC-01…AIC-03 |

# Appendix G. Recommended Next Artifacts

- Product requirements document per release increment, derived from this BRD.
- Enterprise data dictionary, canonical status and health taxonomy, and versioned metric specification (Section 12, 12.5).
- High-fidelity designs built from the wireframes (wireframes/) and the design tokens (brand/tokens.css).
- MCP tool catalogue specification: names, schemas, scopes, examples and versioning (M05).
- Tenancy and security architecture: isolation model (D-28), identity per tenant, token and OAuth design, support access.
- POC source-code review notes (Q-03) confirming formulas and Builder scheduling.
- API and integration specification, with one integration contract per system (Section 16).
- The foundation contract pack, due at the end of Discovery (18.4), each item with its owner, format, path and exit fixture: tenant isolation decision record, matrix and negative tests (TEN-02); the machine-readable permission matrix with approval thresholds that drives server enforcement and generated permission tests (Section 14, CHG-10, D-15); the write contract; metric definitions and snapshots; the audit envelope; the MCP tool catalogue with class and policy metadata (MCP-19); the tenant data-processing matrix (Section 17); and the keyboard parity matrix per editor (BR-41, BLD-13).
- Portfolio scoring model and scenario methodology.
- Catalogue of lifecycle frameworks (Company A, creative production) and process frameworks, each built-in one as a published provider version a template or pack can reference (BLD-09).
- Component accessibility specifications for the design system: one acceptance matrix per interactive pattern (data table, tree grid, board with drag and drop, canvas editor, dialog and drawer) with roles, states, keyboard model and announcements (Section 17, BR-41).
- Pilot portfolio onboarding checklist and migration plan from spreadsheets and POC exports.
- SteerCo operating calendar and governance playbook.
