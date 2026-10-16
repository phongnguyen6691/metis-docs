
# 18. Roadmap, Release Plan & Delivery

## 18.1 Phase overview

| Phase | Scope | Outcome |
|------------|----------------------------------------------------------------------|----------------------------|
| MVP (Release 1) | Platform foundation; multi-tenant SaaS core (provisioning, isolation, sign-in per tenant, admin console, plans and limits, provider console, support access); MCP server with tokens, OAuth, read tools, append-only and update tools, prepare-only governance and audit; workspace configuration with guided setup; lifecycle framework with stages, gates, waivers and versioned templates; project execution (charter and business case, WBS Master, Deliverable Builder, timeline, board, overview, focus, My approvals, change control and baseline, journal, reports and weekly status); risk register and dependencies; MVP objects; executive cockpit and workspace dashboard; registry; roadmap; capacity basics | Single source of truth, governed execution and portfolio control for a pilot |
| V2 | Self-serve signup and billing, SCIM, data residency options, MCP resources and prompts, REST API; strategy model, investment and benefits, scoring and prioritization, scenario planning, SteerCo and portfolio reporting, governance analytics, template comparison and migration, global template library, cross-workspace views, integrations (ERP, HR, Jira / Azure DevOps, chat, BI, cloud storage, e-signature), project Gantt, full-text search, digest | Portfolio intelligence and investment decisions |
| V3 | AI copilot, predictive risk, automated narrative, scenario assistant, recommendation engine, governance copilot, cross-workspace benchmarks | AI Portfolio Operating System |

## 18.2 Release 1 delivery structure (D-01)

The P0 scope combines the v2.0 MVP, the v3.0 workspace P0 capabilities, parity with the POC, the SaaS tenancy core, the MCP interface and the refinements of the external review (Section 1.7). Release 1 keeps all of it. With an agency team of about 40 developers (A-07), it is built by parallel workstreams on shared foundation contracts; two integration milestones prove the end-to-end flows before the pilot.

| Workstream | Modules | First deliverable to the other streams |
|------------------------------|----------------------|------------------------------------------------------------|
| Platform and tenancy | M01, M02 | Tenant context, sign-in, permission check, write contract (PLT-06), audit, notifications, file storage |
| Workspace and lifecycle governance | M03, M04 | Workspace configuration, option lists with system meaning, published framework versions |
| Project execution | M06, M07, M09, M10, M11, M12 | WBS service and the metric engine (Section 12) |
| Deliverable Builder | M08 | Builder prototype tested with PMs in Discovery, then the canonical framework graph, its editor (BLD-13) and the deterministic build (BLD-12) |
| Portfolio | M13 to M18 | Roll-ups from the metric engine; capacity and allocation records |
| MCP interface | M05 | Tool layer over the same services; OAuth and personal access tokens |
| Quality and security (cross-cutting) | All | Tenant isolation suite (TEN-02), permission tests generated from the matrix (Appendix G), accessibility and performance checks |

Design (the wireframes and the design system in brand/) serves every stream. The split of the team across streams is set in Discovery.

| Milestone | Contents | Exit criteria |
|----------------------|------------------------------------------------------------|------------------------------------|
| 1A: Governed project execution on the multi-tenant platform | M01 (P0 except PLT-02), M02 and M03 (P0); M04 framework definition, configuration and versioning (GOV-01 to GOV-05, GOV-12, GOV-17 to GOV-23); M05 except MCP-07 and the prepare tool of MCP-08, with read tools for 1A modules; M06; M07 except WBS-10 and WBS-14; M09; M10 including OVW-07 to OVW-09; M11; M12; RSK-01 | POC parity on a hosted, multi-tenant, permissioned platform; the isolation suite passes for every data path; a workspace is set up through the guided checklist and its lifecycle framework passes the publish check; an MCP client reads project figures identical to the UI and logs journal entries; Section 12 definitions verified across all views; approvers act from My approvals; one pilot project runs end to end |
| 1B: Lifecycle governance, Builder and portfolio control | M04 gate operation: conditional flow, decisions, exit criteria, waivers, readiness view and follow-up (GOV-06, GOV-08, GOV-09, GOV-13 to GOV-15); MCP-07 update tools, the MCP-08 prepare tool and portfolio read tools; M08 with WBS-10 and WBS-14; M13 (RSK-02 to RSK-04); M14; M15 to M18 (P0); client access (PLT-02) if D-02 is approved | One pilot portfolio governed in the platform; gate and CR decisions flow into the Decision Log; the server rejects ineligible gate decisions (BR-42); the executive cockpit reconciles with project data |
| Pilot readiness | Every P0 requirement | External penetration test passed; accessibility audit against the D-26 target; NFR targets met at pilot volume; the MVP acceptance checklist (Section 21) passes |

Rationale: milestones are integration points, not scope cuts. All streams start after Discovery; the streams that integrate at 1B build from the start against the foundation contracts. MCP update tools are switched on at 1B, once version checks and baseline locks are proven in the application (D-30). The Deliverable Builder has its own stream and a Discovery prototype, so its complexity cannot delay the core.

Working agreements across streams *(New in v4.3, from S6)*:

- Each foundation contract (18.4) has a named owner; every change is versioned, with a migration note and updated test fixtures.
- Consumer-driven contract tests guard every boundary between services, the application and MCP; a change that breaks a contract cannot merge.
- One continuously integrated environment from the first sprint, with a golden tenant and a pair of tenants for negative isolation tests.
- A cross-stream dependency board for blockers only, separate from the feature backlog.
- Each stream has a tech lead and a QA counterpart; a short architecture sync handles contract changes.

The second external review estimated this structure at about 30 to 44 weeks from the start of Discovery to pilot readiness, assuming the foundation contracts are frozen in Discovery and no spike forces a platform change (S6, an estimate). The third review kept the lower bound and widened the upper one to about 30 to 46 weeks, not for headcount but because onboarding puts an external language-model provider, an accuracy corpus and three security suites on the critical path, and because the provider, retention and legal decisions raised by the onboarding addendum, together with the compliance target of D-31, now gate work that starts in Release 1A (S7, also an estimate). The stream plan made in Discovery replaces both.

## 18.3 Complexity indicators

| Block | Difficulty | Reason | Source |
|------------------------------|--------------|------------------------------------------------|--------------|
| Foundation: authentication, workspace, project, permissions | Medium | Standard work, but a prerequisite for everything else | Survey §11 |
| WBS Master table | High | Tree table, inline editing, multi-dimensional filters, bulk actions | Survey §11 |
| Deliverable Builder and Blueprint | Very high | Custom canvas, drag-and-drop, connector drawing, automatic date spreading | Survey §11 |
| Tree Diagram | High | Automatic and free layouts; needs a suitable canvas library | Survey §11 |
| Timeline and Board | Medium | Familiar patterns, mainly drag-and-drop and layout | Survey §11 |
| Charter | Low to medium | Long form; the hard parts are the two live sections and PDF export | Survey §11 |
| Change requests | Medium | CRUD plus impact analysis on the dependency graph | Survey §11 |
| Journal and reports | Medium | Template-based generation, Markdown and PDF export | Survey §11 |
| Overview and Focus | Low | Read-only aggregation; can be built last | Survey §11 |
| Lifecycle governance | High | Not prototyped; configuration, versioning and gate workflows | New assessment |
| Portfolio layer (cockpit, registry, roadmap, capacity) | Medium to high | Not prototyped in the VistaX POC; depends on capacity and budget data quality | New assessment |
| Multi-tenancy foundation | High | Isolation on every data path, per-tenant identity providers, plans, provider console; tested continuously | New assessment |
| MCP server and tokens | Medium | A tool layer over the same services the UI uses; OAuth and token handling, audit and rate limits need security review | New assessment |

## 18.4 Delivery plan

| Step | Duration guidance | Key deliverables | Exit criteria |
|----------------------|--------------|------------------------------------------------|----------------------------|
| Discovery & Data Design | 6-8 weeks | Process maps, data model, the foundation contract pack (below), NFR targets (17.1) and pilot adoption targets (18.5); decisions taken in the order of Section 19.1; technical spikes: tenant isolation negative tests, two users editing one field, an MCP client over OAuth and over a personal token, PDF snapshot generation; a Deliverable Builder prototype tested with PMs; buyer interviews and one or two design partners (Q-09) | Approved BRD, data dictionary, and stream plan with dates; foundation contract pack signed off; walking skeleton passing end to end |
| UX / Prototype | 4-6 weeks, overlapping Discovery | High-fidelity screens from the wireframes (wireframes/) and the design system (brand/); usability tests of setup, daily work, approvals and the Builder with design partners | Approved prototype |
| MVP Build | Set in Discovery from the stream plan (A-07) | Every P0 requirement, built in parallel workstreams with milestones 1A and 1B (18.2) | Pilot readiness (18.2) |
| Pilot | 4-8 weeks | 1-2 portfolios live with design partners | Success criteria of 18.5 met |
| Scale | 8-16 weeks | Additional portfolios and P1 scope | Enterprise rollout readiness |
| AI phase | Later | Copilot, scenarios, predictive insights | Governed AI readiness |

**Foundation contract pack** (Discovery exit). Each item is an artifact, not an intention: it has a named owner, a file format, a path in the repository and an exit fixture that the walking skeleton runs, so Discovery can be judged closed by running something rather than by reading a promise. The owners are set in the stream plan at the start of Discovery; the formats and paths below are the proposal *(New in v4.3; artifacts named in v4.5)*:

1. Tenant context and isolation: architecture decision record, the isolation matrix (M02) and a negative test skeleton.
2. Identity and permissions: the machine-readable permission matrix (role, action, scope, approval threshold) with the precedence rule of Section 14, and generated authorization tests.
3. Write contract: record version, idempotency key, conflict and error codes, retry rules, shared by the application, MCP and the API (PLT-06).
4. Metrics: metric definitions version 1, the snapshot envelope and a reconciliation fixture (Section 12).
5. Audit and events: one envelope with actor attribution for people, AI through MCP and support access.
6. Lifecycle: framework and template identifiers and versions, for lifecycle and process frameworks alike (GOV-12, GOV-22, BLD-16).
7. Files and evidence: file references, scanning states and evidence links (PLT-07, GOV-04).
8. MCP tools: the catalogue version and the mapping from tool to requirement, scope, class, service and milestone, with contract tests per tool class.
9. Data lifecycle: the tenant data-processing matrix of Section 17 (retention, region, transfer mechanism and sub-processor per path), the backup purge period and the sub-processor inventory, with legal confirmation per jurisdiction [Unverified - confirm before applying].
10. Keyboard parity: one matrix per editor (operation, gesture, keyboard command, list-view action, server command) for the lifecycle designer and the process framework editor, driving generated keyboard tests (BR-41, BLD-13).

| Item | Format and path (proposed) | Exit fixture |
|------|--------------------------------------------|------------------------------------------|
| 1 Tenant context and isolation | Decision record in docs/adr/, matrix as YAML in contracts/isolation/ | The negative test suite runs and fails on a deliberately cross-tenant query |
| 2 Identity and permissions | Permission matrix as CSV or YAML in contracts/permissions/ | Generated authorization tests run for every role of the matrix |
| 3 Write contract | Schema and error codes in contracts/write/ | A retried call and a stale call behave as specified |
| 4 Metrics | Definitions version 1 and snapshot envelope in contracts/metrics/ | The reconciliation fixture matches a screen, a report and an MCP answer |
| 5 Audit and events | Envelope schema in contracts/audit/ | One entry per actor kind, including AI through MCP and support access |
| 6 Lifecycle and framework versions | Identifier and version rules in contracts/lifecycle/ | Publishing a version leaves existing instances unchanged |
| 7 Files and evidence | Reference and scan-state schema in contracts/files/ | An infected and a clean upload both end in the specified state |
| 8 MCP tools | Catalogue with class and policy metadata in contracts/mcp/ | A contract test per tool class, including the confirmation mode |
| 9 Data lifecycle | Processing matrix in contracts/data-lifecycle/ | A tenant deletion walks every path of the matrix |
| 10 Keyboard parity | Matrix per editor in contracts/parity/ | Every row passes with the keyboard alone |

The walking skeleton runs one thin path through every contract: tenant, workspace, project, WBS item, metric, MCP read and audit entry.

## 18.5 MVP success criteria

- 100% of in-scope projects have a master record.
- 100% of committed projects have owner, sponsor, budget, timeline, status and lifecycle stage.
- The portfolio dashboard reconciles with approved project data.
- Resource bottlenecks can be identified by project and capability.
- Every baseline change is traceable to a Change Request.
- Executives can produce a weekly or SteerCo portfolio review without manual spreadsheet consolidation.
- The roadmap shows projects, MVPs and key dependencies.
- At least one pilot portfolio uses the platform as its primary governance source.
- Every project metric is identical across Overview, Focus, Board and reports for the same date. *(New)*
- Pilot project teams run daily work (Focus, Board, Journal) in the platform rather than in spreadsheets. *(New)*
- At least two tenants run in production (a design partner and a second customer, or a provider-run pilot tenant if only one design partner joins) with zero cross-tenant findings in automated tests and the penetration test. *(New in v4.1, clarified in v4.3)*
- Pilot users connect at least one verified LLM client through MCP and get answers whose figures match the application. *(New in v4.1)*

Adoption and value, measured over the last four weeks of the pilot *(New in v4.2; proposed targets in v4.3)*. The pilot sponsor and each design partner confirm the targets in Discovery and own them; when partners start from very different baselines, targets are set per partner.

| Measure | Proposed target |
|------------------------------------------------------------|----------------------------|
| Pilot project updates (WBS, status, journal) made in the platform rather than in spreadsheets | 80% or more |
| Weekly status published on time from the platform (Section 12.3) | 90% or more |
| Median time a PM spends on the weekly update | 20 minutes or less, and below the baseline measured in Discovery |
| Stale-project rate (Section 12.5) | 10% or less |
| Executive attention items opened down to their source record | 70% or more |
| Median time from approval request to decision (OVW-09) | 3 working days or less |
| Pilot PMs active each week | 80% or more |
| MCP answers whose figures match the application in spot checks | 100% |
| Weekly active users by role; users with a connected MCP client | Tracked; targets set after the pilot |

# 19. Decisions Required & Open Questions

## 19.1 Decision register

This BRD assumes each recommendation until the decision owner (Product Director unless stated) confirms or changes it.

**Decide first.** These decisions shape the architecture or the acceptance of everything else. Foundation, at the start of Discovery: D-28 tenant isolation model, D-20 cloud and regions, D-03 authentication, D-15 access model. Before the architecture is frozen: D-26 NFR targets (starting values in 17.1) and D-31 compliance target. In parallel once the foundation is set: D-24 metric definitions, D-29 MCP authentication, D-09 Builder rules. Before the client access path is built for milestone 1B: D-02 client access.

| ID | Decision | Context and evidence | Recommendation assumed in this BRD | Needed by |
|------|------------------|----------------------------------|----------------------------------|------------|
| D-01 | Release 1 scope and sequencing | The combined P0 scope exceeds the v2.0 MVP build guidance of 10-16 weeks, which assumed a smaller scope and team; the delivery capacity is an agency of about 40 developers (A-07); the external review proposed cutting scope for team size | Keep the full P0 scope; parallel workstreams on shared foundation contracts with integration milestones 1A and 1B (Section 18.2); dates set in Discovery from the stream plan | Discovery start |
| D-02 | Client (external) access | POC uses "Client" as PIC and has client sign-off; the survey asks whether clients log in | Restricted Client role in Release 1B after a security review (view invited projects, comment, deliver inputs, approve client gates, sign the charter); until then share PDFs and reports | Before Release 1B design |
| D-03 | Authentication method | POC has no real authentication; v2.0 lists SSO as P0; as a SaaS, customers differ in identity maturity | Per tenant: SSO (SAML 2.0 or OIDC) for tenants with an identity provider, email and password with MFA otherwise, magic link for invited external users (TEN-03); all methods run through one identity layer (one user, session and MFA model), so adding or removing a method changes nothing else | Discovery |
| D-04 | Hierarchy names | POC uses Space and Folder; the BRD uses Portfolio and Program / Product | Use Portfolio and Program in the product, aligned with executive reporting | Discovery |
| D-05 | WBS code generation | POC requires a manually typed WBS ID; renumbering on move is undefined | System-generated codes renumbered on move, plus a permanent internal ID | Discovery |
| D-06 | WBS depth and field rules | Level, Type and Category overlap; Category rows are stored as Type = Deliverable; the demo uses three levels | Level derived from position; Category is a separate node kind at level 1; Types not bound to levels; up to five levels | Discovery |
| D-07 | Duration basis | POC shows calendar days inclusive (47 days for 13 Jul-28 Aug 2026, 35 working days); v3.0 workspaces have a business calendar | Workspace setting: calendar days (default) or working days from the business calendar | Discovery |
| D-08 | Applying approved CRs | POC register is advisory and the PM applies changes; v2.0 locks baselines | MVP: approved CR unlocks affected fields, is tracked until applied, then re-baselined; V2: structured change sets applied on approval | Discovery |
| D-09 | Deliverable Builder rules | Date spreading from the Start Date, re-run behaviour, Blueprint granularity and lane mapping are undocumented; the POC gives lanes provisional codes 7.x-10.x | Frameworks define per-node offset and duration; a re-run adds a new set after confirmation and never overwrites; one Blueprint per deliverable; lanes map to labels (Approval → Approval Gate, Input Required → Input Required, Quality Gate → Checkpoint, Milestones → Milestone, Risk → Risk Related) and generated items sit under the target deliverable; the framework is one canonical graph (lanes, nodes, edges, offsets) shared by the canvas and the list editor, and builds are deterministic and previewed (BLD-12). Confirmed by the product owner on 3 Oct 2026 for authoring (BLD-13 to BLD-16): each framework defines its lanes; node offsets and durations count in the workspace duration basis (D-07); sub-items are allowed within the WBS-02 depth; connection points only route arrows and create no dependency; in Release 1 the Workspace Owner publishes custom process frameworks without a review step and Project Managers may draft them. The no-review choice holds because publication is restricted to the Workspace Owner and every version is immutable, so the risk is a weak draft rather than an unauthorized one, which is why v4.5 strengthens the publish check with constraint consistency (BLD-16) instead of adding an approval ceremony | Discovery (Builder prototype) |
| D-10 | Board Done column | The POC Board has no Done column | A collapsible Done column limited to recently completed items | Release 1A design |
| D-11 | Project Gantt | The POC Timeline is point-based; the survey asks for bars with dependency lines | Not in the MVP; evaluate in V2 with the portfolio roadmap component | V2 planning |
| D-12 | Charter sign-off and revisions | POC sign-off fields are plain text; revision fields have no history | In-app sign-off by authenticated users freezes the revision; revision snapshots in the MVP; e-signature and comparison in V2 | Release 1A design |
| D-13 | PDF generation | The POC generates PDFs in the browser | Server-side generation with a standard template in the MVP; workspace branding in V2 | Release 1A design |
| D-14 | Deleting configurable values | The POC propagates renames; deleting an in-use value is undefined | Renames propagate; deletion requires a replacement; values with a system meaning cannot be deleted | Release 1A design |
| D-15 | Access model | The POC has Admin and Member only | Adopt the role model of Section 14, including Viewer and Client, maintained as a machine-readable permission matrix (18.4); effective permissions are the union of workspace and project roles within tenant policy (Section 14) | Discovery (first) |
| D-16 | Notification channels | The POC has no notifications | In-app and email in the MVP; digest and Slack / Teams in V2 | Release 1A design |
| D-17 | Search scope | The POC searches project names only | MVP: projects and WBS items by code or name; full-text in V2 | Release 1A design |
| D-18 | Release 1 integrations | The survey mentions Jira, Asana, Google Drive and Slack; v2.0 puts all integrations except SSO at P1 | SSO and email only in the MVP; plain links to cloud files; other integrations in V2 | Discovery |
| D-19 | Mobile | The survey asks about mobile web and native apps | Responsive web for Focus, Board, Overview and approvals; no native app in the MVP | Discovery |
| D-20 | Cloud provider, regions and residency offer | The product is a SaaS hosted by the provider (A-06); customers may require data in a given region | Provider to choose the cloud and launch region(s) and define which residency options are sold (TEN-13) before solution design (blocking) | Discovery |
| D-21 | Demo and trial | The POC offers "Explore the demo workspace" without an account | A resettable sandbox workspace inside each tenant; prospects get a trial tenant (sales-led in the MVP, self-serve in V2); no anonymous public access | Release 1A design |
| D-22 | Product name | BRD: Enterprise Portfolio Intelligence & Governance Platform; POC: VistaX PM Genesis; project codename Metis | Use "Metis" as the working brand (logo and style guide in brand/) with the BRD name as descriptor; the logo can be regenerated for another name | Discovery |
| D-23 | Built-in process frameworks | The POC ships CGI Still Renders, 3D Animation / Video and Simple Review Loop | Simple Review Loop as a generic built-in; CGI and 3D frameworks as templates for creative-production workspaces; others through the template library | Before Release 1B build |
| D-24 | Metric definitions | POC counts differ between views (Section 12.2) | Approve Section 12 as the single definition set | Discovery |
| D-25 | Strategic linkage in the MVP | BR-02 applies in the MVP while the strategy module is V2 | Workspace-managed objective list in the MVP (CHR-15); full strategy model in V2 | Discovery |
| D-26 | NFR targets | v2.0 NFRs are qualitative (agreed SLA, criticality tier) | Treat the proposed starting values of Section 17.1 as the baseline defaults and confirm or adjust them against pilot and target volumes, recording the rationale and the volume test for any change: response times at the 95th percentile, concurrent editors, scale, availability, recovery point and time, PDF generation time, MCP rate limits, file limits, accessibility (WCAG 2.2 AA, placeholders included) | Discovery, before the architecture is frozen |
| D-27 | Commercial and onboarding model | SaaS needs plans, limits and a way to sign customers up | Sales-led provisioning by provider operators in the MVP with plans and limits enforced and invoicing outside the product; self-serve signup, trial and online billing in V2 (TEN-14) | Discovery |
| D-28 | Tenant isolation model | Shared infrastructure is cheaper; some customers ask for dedicated environments | Shared infrastructure with strict logical isolation (tenant on every data path, tenant-scoped storage, search and caches) for all plans in the MVP; dedicated database or region as an enterprise option later | Discovery (blocking) |
| D-29 | MCP authentication | The MCP specification defines an OAuth 2.1 based flow for HTTP; client support for OAuth and static tokens varies [Unverified - confirm per client] | Offer both in the MVP: OAuth per the specification and personal access tokens as bearer tokens, both issued by the platform's authorization server, scoped and expiring | Release 1A design |
| D-30 | MCP actions per increment | Write access from LLMs raises the risk of unintended changes | 1A: read tools for 1A modules and append-only writes (journal entries, comments); 1B: updates to WBS items, draft CRs, risks and report drafts, prepare-only decision drafts (MCP-08) and portfolio read tools; never approvals, decisions, baseline changes, deletions or permission changes | Release 1A design |
| D-31 | Compliance target | Enterprise SaaS buyers usually ask for an independent security attestation | Choose the target (for example SOC 2 Type II or ISO 27001) and timeline with the commercial plan; design controls for it from the start | Discovery |
| D-40 | How a framework assignment selector matches a person | A process framework node names a role or a title, not a person (BLD-14); titles are free text in many organizations, so matching can be the normalized title, a customer-maintained mapping from title to role, or both, and several people can hold the same title | Match on the workspace role first, then on the normalized member title (trimmed, case-folded, accent-folded), with a customer-maintained alias list for renamed or synonymous titles; a title matching several members is ambiguous and the PM chooses in the build preview, per build, with the choice recorded on the generated item; Metis never picks the first match | Release 1B design, with the Builder |

## 19.2 Open questions

| ID | Question | Why it matters |
|------|----------------------------------------------------------|------------------------------------------|
| Q-01 | Is the POC a desired-state mock-up, or has it been validated with real users? | Decides how much POC behaviour is requirement rather than illustration. |
| Q-02 | Is the Claude artifact referenced in BRD v2.0 the VistaX PM Genesis POC (A-01)? | If not, another prototype must be reviewed. |
| Q-03 | Can the POC source code be shared (the artifact's Copy function)? | Confirms the formulas, Builder scheduling and data model inferred from the UI. |
| Q-04 | Are the primary Release 1 users internal PMs only, or clients as well? | Drives D-02 and the security scope. |
| Q-05 | Should the Netlify governance prototype be re-reviewed against this version? | Appendix F reflects only the v2.0 description. |
| Q-06 | What are the approval status and dates of BRD v2.0 and v3.0? | The revision history is incomplete. |
| Q-07 | Which industries or operating models, beyond digital product delivery and creative production, must the first workspaces support? | Drives built-in frameworks and reference data. |
| Q-08 | Which LLM client applications must be verified and listed in the connection guide, and do they connect with OAuth, static tokens or both? | Drives D-29 and MCP-15; support differs per client [Unverified - confirm per client]. |
| Q-09 | Which one or two organizations will act as design partners for Discovery and the pilot, and which buyers can be interviewed? | Market evidence for the scope and the differentiation thesis (4.2); pilot targets (18.5). |
| Q-10 | Can gate approvers delegate their vote or abstain, and how does that count toward the quorum? | Gate rules (GOV-03, GOV-08) and My approvals (OVW-09). |
| Q-11 | Which retention periods apply to business records, files, audit entries, MCP call records and backups, per customer jurisdiction? | Data lifecycle (Section 17) and tenant deletion (TEN-06). |
| Q-12 | What must the audit log keep for MCP calls: parameter summaries only, or full parameters and results? | Privacy versus forensic value (MCP-11, Section 17). |
| Q-13 | Where will pilot capacity and actuals data come from (manual entry, file import, or an HR or finance export), and who owns it? | Capacity (RES-03), budget (CHR-13) and data freshness (12.5). |

# 20. Product Risks & Mitigations

| Risk | Impact | Mitigation |
|----------------------------------------|----------|------------------------------------------------------------|
| Data quality and stale updates | High | Mandatory fields, freshness indicators, integrations and owner accountability |
| The product becomes another reporting tool | High | Decision engine, scenario planning and executive attention as core features |
| Coordination across parallel workstreams (A-07) | High | Foundation contract pack signed off in Discovery and versioned (18.4); contract owners and consumer-driven contract tests; one continuously integrated environment with a golden tenant; integration milestones 1A and 1B (18.2); one design system; a product owner per stream |
| Requirements and wireframes drift apart | Medium | The build fails when a P0 requirement has no screen; behaviour is proven by acceptance and contract tests, not by screen traceability alone (Section 21) |
| Scope larger than the market needs | Medium | Buyer interviews and design partners in Discovery (Q-09); adoption metrics in the pilot (18.5); P1 and P2 scope re-ranked after the pilot |
| Resistance from PMs | Medium | Derived views remove manual reporting; quick updates from Focus and My approvals (OVW-07, OVW-09); contextual help (PLT-20); Builder prototype tested with PMs; integrate execution tools; minimise duplicate entry |
| Inconsistent status definitions | High | Section 12 definitions and system meaning of options (WSP-08) |
| AI recommendations not trusted | Medium | Evidence-linked recommendations, assumptions, confidence and human approval |
| Inaccurate resource data | High | Allocation governance (RES-03) and HR integration in V2 |
| POC behaviour misread from screenshots | Medium | Obtain the source code (Q-03); validate D-05…D-10 with the client |
| Deliverable Builder complexity | High | Own workstream; prototype with PMs in Discovery; build preview and list editor (BLD-12); manual WBS entry as fallback |
| Concurrent editing conflicts on WBS and canvas | Medium | Field-level conflict detection (PLT-06); one editor per Builder canvas at a time |
| External client access exposes data | High | Invitation-only restricted Client role and a security review before Release 1B (D-02) |
| Configuration sprawl across workspaces | Medium | Versioned templates, global library and governance analytics (M04, ANL-04) |
| Cross-tenant data exposure | High | Tenant on every data path, automated cross-tenant tests on every release, penetration test, tenant-scoped caches and search (TEN-02, BR-33) |
| An LLM client makes unintended changes, including through instructions hidden in record text | High | Scoped tokens, append-only writes first, prepare-only governance, version checks, content treated as data, audit of every call (M05, BR-35) |
| Leaked access token | High | Hashed, expiring, scoped tokens; revocation; last-used display; tenant-wide kill switch; anomaly alerts (MCP-02, MCP-12) |
| LLM answers with wrong figures | Medium | Tools return server-computed metrics with definitions, as-of time and metric version (MCP-10, BR-39); answers cite records |
| No lasting edge from MCP alone | Medium | Differentiate on governed data, versioned metrics and enforced governance (4.2); verified client list (MCP-15) |

# 21. MVP Acceptance Checklist

- The executive cockpit shows project count, health, investment, capacity and attention items.
- A workspace can be created, configured (fields and options, team and roles) and switched; isolation between workspaces is verified.
- A lifecycle framework can be cloned, adapted, published and pinned to new projects; gates record decisions with rationale; waivers expire.
- The project registry supports search, filter and drill-down.
- The project record supports business case, owner, sponsor, budget, timeline and strategic linkage.
- Charter sections V and VI update live from the WBS; the charter exports to PDF and JSON; sign-off freezes a revision.
- The WBS Master supports table and tree views, the item form, bulk actions, renumbering and dependencies that flag conflicts without moving dates.
- The Deliverable Builder generates items and dependencies matching the framework counts and saves a Blueprint.
- A process framework is created in its editor, published after its check and used by the Deliverable Builder in any project of the workspace; publishing a new version changes no existing Blueprint or generated item (BLD-13 to BLD-16).
- Timeline, Board, Focus, Overview and reports show the same work items and the same figures (Section 12).
- MVPs can be created and linked to projects with KPI and release criteria.
- The roadmap displays projects, MVPs and milestones.
- The capacity dashboard shows demand versus capacity and bottlenecks.
- Risk and dependency records are linked to projects and portfolio views.
- Weekly status submission and missing-report exceptions work.
- Committed baseline fields are locked; the CR workflow supports impact assessment, decision, application and re-baselining.
- Investment fields roll up to portfolio level.
- The audit log captures governance and configuration actions.
- An executive report can be generated from the system.
- Notifications reach @mentioned users, assignees and approvers.
- Several users can edit concurrently without silent overwrites; data survives refresh and sign-out.
- A provider operator provisions a tenant; the tenant admin configures sign-in and invites users; cross-tenant access tests pass.
- Plan limits are enforced on the limited action only; export always works.
- An MCP client connects with OAuth or a personal access token, lists tools, reads project figures identical to the UI, logs a journal entry, and cannot approve anything; every call is in the audit log.
- A workspace is set up through the guided checklist and activates only after its readiness check passes; the process framework step is labelled optional for activation and a workspace with none activates (WSP-14).
- A project is created with its lifecycle framework version pinned and starts in Draft with its setup checklist (CHR-17).
- Approvers see and act on every pending decision in My approvals (OVW-09); the server rejects an ineligible gate decision from every channel (BR-42).
- Every dashboard, report, PDF and MCP answer states its as-of time and metric version; saved reports and PDFs do not change afterwards (BR-39).
- Every drag-and-drop and canvas action has a keyboard equivalent: every row of each editor's parity matrix passes in its list view with the keyboard alone, and the accessibility audit passes against the D-26 target, placeholder contrast included, with the component acceptance matrices of the style guide verified by automated tests and one screen-reader pass (BR-41, BLD-13).
- No-access, read-only, session-expired, save-failed and conflict states show their reason and next action (PLT-04 to PLT-06).
- Support access works only through approved, expiring, revocable grants (TEN-09).
- A process framework publishes only when its check passes, constraint consistency included, and a node whose assignment selector matches several members blocks the build until the project manager chooses, while one that matches nobody leaves the field empty and is listed (BLD-14, BLD-16).
- The foundation contract pack is versioned, each of its ten items exists at its path with its owner, and its exit fixtures pass in continuous integration; contract tests exist for every MCP tool class and assert the confirmation mode of each (MCP-05, MCP-07, MCP-13, MCP-16, MCP-19).
- Every requirement whose behaviour a screen cannot prove has the evidence named for it in Appendix B.3, and the build reports the requirements by evidence type.
