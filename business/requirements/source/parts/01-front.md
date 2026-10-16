![](../../design/brand/logo/metis-wordmark@2x.png){width=1.5in}

::: {custom-style="Title"}
BUSINESS REQUIREMENTS DOCUMENT
:::

::: {custom-style="Subtitle"}
Enterprise Portfolio Intelligence & Governance Platform
:::

**Unified BRD v4.5: portfolio intelligence, workspace governance and project execution, delivered as a multi-tenant SaaS with a natural-language interface for LLMs (MCP)**

| Document control | Value |
|------------------------|-----------------------------------------------------------------------------|
| Document version | v4.5 Unified Baseline. Supersedes BRD v4.4, v4.3, v4.2, v4.1 and v4.0 (kept in brd/archive/), BRD v2.0 (Consolidated Concept) and the BRD v3.0 addendum (Workspace & Governance Framework Layer). Supplemented by the BRD Addendum "Onboarding in 30 minutes" v1.1 (brd/), a separate document whose amendments merge into this one after the external review. |
| Date | 3 October 2026 (v4.5) |
| Status | Draft for business and technology validation |
| Product sponsor | CEO / Product Director |
| Working product name | Metis (logo and style guide in brand/; final name per D-22) |
| Product form | Multi-tenant SaaS application: web application plus a natural-language interface for LLMs over the Model Context Protocol (MCP) |
| Primary audience | CEO, ExCo, Product, PMO, Finance, HR, Engineering, Project Owners, Delivery Leads |
| Scope | Enterprise portfolio, tenancy and workspace governance, lifecycle frameworks, project execution (charter, WBS, plan, change control, reporting), resources, investment, outcomes and AI access through MCP |
| Target | MVP (Release 1) → V2 Portfolio Intelligence → V3 AI Portfolio Operating System |
| Reference prototypes | VistaX PM Genesis POC (project execution, 36 screens surveyed on 22 Sep 2026) and the Netlify Enterprise Governance MVP demo (portfolio governance, as described in BRD v2.0) |
| Design artifacts | wireframes/ (46 screens for this document and 12 for the onboarding addendum, as HTML and PNG with manifest.json) and brand/ (logo set, style guide 0.4, design tokens) |
| Editions | This document and a Markdown edition, both generated from brd/source/ |

**Revision history**

| Version | Date | Description |
|-----------|--------------------------|----------------------------------------------------------------------|
| v2.0 | Not recorded in source | Consolidated concept: business requirements, functional modules M01-M12, ASCII wireframes and roadmap, validated against the Netlify prototype. |
| v3.0 | Not recorded in source | Product Director change: Workspace & Governance Framework layer, appended to v2.0 inside the same file (own sections 1-18 and an architecture appendix). |
| v4.0 | 2 Oct 2026 | Unified rewrite: one structure and one ID scheme; v2.0 and v3.0 merged; VistaX POC behaviour integrated; conflicts resolved or raised as decisions; full traceability to legacy IDs and POC screens. |
| v4.1 | 2 Oct 2026 | Product defined as a multi-tenant SaaS (Tenant level, module M02, roles, rules, NFRs); natural-language interface for any MCP-capable LLM with token-based access (module M05); modules renumbered M01 to M22 with requirement IDs unchanged; wireframes for 35 screens, logo and style guide; Markdown edition; decisions D-27 to D-31 and question Q-08 added. |
| v4.2 | 2 Oct 2026 | External pre-feasibility review (S5) triaged item by item; delivery capacity stated (A-07), scope kept; nine new requirements and four new rules; sharper acceptance criteria for access, saving, conflicts, isolation, limits, support access, gates, snapshots and MCP; metric versions and freshness; nine new wireframes (44 in total) with every MVP requirement shown on a screen; style guide accessibility and state components. |
| v4.3 | 2 Oct 2026 | Second external review (S6) triaged: foundation contract pack and walking skeleton as the Discovery exit; milestone map corrected (client access, MCP prepare and portfolio tools, lifecycle configuration); proposed starting values for NFR and adoption targets; draft tenant isolation matrix; undo rules for MCP writes; contextual help rule; client view, sign-in recovery and corrected setup wireframes (45 in total); style guide 0.3. |
| v4.4 | 3 Oct 2026 | Process framework editor after a survey of the POC's Settings, Frameworks editor: authoring outside projects, node templates with offsets and roles, typed connections, and a Release 1 path to publish, version and deprecate custom process frameworks (BLD-13 to BLD-16, wireframe 58, 46 screens). Issued with the BRD Addendum "Onboarding in 30 minutes" v1.0 and its 12 wireframes, reviewed together in the third external review. |
| v4.5 | 3 Oct 2026 | Third external review (S7) triaged item by item: canvas and list equivalence specified as a parity matrix (BLD-13, BR-41); framework node roles become typed assignment selectors with resolved, missing and ambiguous outcomes (BLD-14, D-40); the publish check gains constraint consistency (BLD-15, BLD-16); a built-in published framework may be referenced by a template or pack without a workspace publication (BLD-09); the process framework setup step is labelled optional for activation (WSP-14); MCP tools carry policy metadata including the confirmation mode (MCP-19 and the catalogue); the data lifecycle becomes one tenant data-processing matrix and accessibility gains component acceptance matrices and placeholder contrast (Section 17); the foundation contract pack names an owner, a path and an exit fixture per item and adds a parity matrix (18.4); evidence other than a wireframe is named per requirement (Appendix B.3); style guide 0.4. |

**Source documents**

| Ref | Source | Notes |
|------|----------------------------------------------------------|----------------------------------------------------------|
| S1 | Enterprise_Portfolio_Intelligence_Governance_Platform_BRD.docx | 66,335 bytes, MD5 e6e7cfc96039212fdb235a177faa5ebd. Contains the v2.0 body followed by the v3.0 addendum. |
| S2 | Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v3_Workspace_Governance.docx | Byte-identical to S1 (same size and MD5). No content difference. |
| S3 | vistax-poc-screens/ (screenshots 01-36, screen map 00-tai-lieu-man-hinh.html) | Survey of the VistaX PM Genesis POC (public Claude artifact wbs-master-builder.jsx), 22 Sep 2026. Behaviour observed through the UI only; source code not reviewed. The Settings, Frameworks editor was surveyed again on 3 Oct 2026, with its exported data (review/poc-frameworks-coverage.md, evidence in review/poc-frameworks-2026-10-03/). |
| S4 | Model Context Protocol specification, version 2026-07-28 (modelcontextprotocol.io/specification/2026-07-28) | Basis for the MCP requirements: server features (tools, resources, prompts), transports (stdio, Streamable HTTP), optional OAuth 2.1 based authorization for HTTP transports. Retrieved 2 Oct 2026. |
| S5 | review/metis-review-tien-kha-thi.md (external pre-feasibility review, in Vietnamese) | Review of BRD v4.1, the wireframes and the style guide, 2 Oct 2026: conditional Go, 54 refinements RF-01 to RF-54. Each claim was checked against this document before any change; dispositions in review/review-disposition.md. |
| S6 | review/metis-review-vong-2.md (second external review, in Vietnamese) | Closure review of BRD v4.2, 44 wireframes and style guide 0.2, 2 Oct 2026: conditional Go; of the 54 first-round refinements 39 closed, 11 partly closed, 1 open and 3 closed with a new defect; 24 new refinements RF2-01 to RF2-24. Dispositions in review/review-disposition-round2.md. |
| S7 | review/metis-review-vong-3.md (third external review, in Vietnamese) | Review of BRD v4.4, the onboarding addendum v1.0, 58 wireframes and style guide 0.3, 3 Oct 2026: conditional Go; of the 24 second-round refinements 19 closed and 5 partly closed, none open and none closed with a new defect; 31 new refinements RF3-01 to RF3-31, of which 8 were required before the baseline. Each claim was checked against the files before any change; dispositions in review/review-disposition-round3.md. |

**How to read this document**

- **Priority:** P0 = MVP (Release 1), P1 = V2, P2 = V3.
- **Source codes:** "v2 FR-001" or "v2 §16" = BRD v2.0 body; "v3 WS-001", "v3 GF-001", "v3 TPL-001" or "v3 §8" = BRD v3.0 addendum; "POC 09" = screenshot 09 of the VistaX POC (file 09-*.jpg); "Survey §05" = section 05 of the POC screen map; "S4" = the MCP specification; "RF-nn", "RF2-nn" and "RF3-nn" = refinements of the first (S5), second (S6) and third (S7) external reviews; "New" = added in v4.0 to v4.5 to close a gap or resolve a conflict, to be validated.
- **Decisions:** "D-nn" refers to the decision register in Section 19. Each decision carries a recommendation that this document assumes until the decision is taken.
- **Wireframes:** each module lists its screens; open wireframes/screens/NN-name.html in a browser or view wireframes/png/NN-name.png. Every screen carries its requirement IDs.

```{=openxml}
{{TOC}}
```

# 1. About This Version

## 1.1 Source comparison result

The two supplied BRD files are **byte-identical** (same size, same MD5 checksum). The file whose name carries "v3_Workspace_Governance" is not a separate version: both files contain the full BRD v2.0 body (sections 1-24, appendices A-B) followed by the BRD v3.0 addendum (sections 1-18 and an architecture appendix). The meaningful comparisons are therefore (a) the v2.0 body against the v3.0 addendum, and (b) the BRD against the VistaX PM Genesis POC. Both are summarised below; every individual conflict and its resolution is listed in Appendix C.

## 1.2 What the v3.0 addendum changed relative to v2.0

| Area | BRD v2.0 body | BRD v3.0 addendum | Treatment in v4.0 |
|----------------------|----------------------------------|----------------------------------|----------------------------------|
| Hierarchy | Strategy → Objective → Portfolio → Program/Product → Project → MVP/Feature and Milestone/WBS/Task | Platform → Workspace → Portfolio → Program/Product → Project → MVP → Feature → Milestone/WBS | v3.0 hierarchy adopted; POC "Space" and "Folder" mapped to Portfolio and Program (Section 7.1, D-04) |
| Vision | One system connecting strategy to outcome | Configurable Enterprise Portfolio Operating System: one platform, many workspaces | Merged (Section 4.1) |
| Governance | M08: weekly status, baseline, change request (CR), decision log | Lifecycle stages and gates, templates, waivers; M08 to become a Lifecycle Governance Engine | Split into M04 (framework and gates) and M11 (change, baseline, decisions) |
| Requirement IDs | FR-001…FR-1103 (38 requirements) | WS-001…010, GF-001…014, TPL-001…010 (34 requirements) | Re-keyed by module; every legacy ID kept in Source columns and Appendix D |
| Roles | 8 roles (§12) | 9 workspace roles (§9) | One enforced role model (Section 14) |
| Data model | 15 entities (§9) | 10 new entities (§12) | One model (Section 15) |
| Business rules | BR-01…BR-12 | 10 unnumbered rules (§13) | BR-01…BR-32 (Section 13) |
| KPIs | 12 portfolio KPIs (§11) | 11 governance KPIs (§15) | Section 12, with project metric definitions added |
| Roadmap | MVP / V2 / V3 by module (§15) | MVP / V2 / V3 workspace capabilities (§16) | One roadmap (Section 18) |
| Screens | 13 suggested screens (Appendix A), 12 wireframes | 1 workspace dashboard wireframe | Appendix B (screen inventory with POC evidence) and Appendix E (wireframes) |

## 1.3 What the VistaX POC adds or contradicts

| Topic | BRD (v2.0 and v3.0) | VistaX PM Genesis POC | Resolution in v4.0 |
|------------------|------------------------------|------------------------------|------------------------------|
| Product focus | Portfolio and enterprise, CEO-first | Project execution, PM-first ("From charter to closeout, one connected workspace") | Both: the POC defines the Project Execution layer under the BRD's portfolio layer |
| Hierarchy | Workspace → Portfolio → Program → Project | Workspace → Space → Folder → Project | Space = Portfolio, Folder = Program/Product (D-04) |
| Work structure | Project → MVP → Feature; Milestone / WBS / Task | WBS with Category rows, Types (Deliverable, Work Package, Task, Subtask), five Labels, FS/SS/FF/SF dependencies | POC WBS model adopted (Section 7.3); MVP kept as an optional outcome object (M14) |
| Framework | Lifecycle stage-gate framework (Discovery … Retro) | Process frameworks that generate WBS items (CGI Still Renders, 3D Animation / Video, Simple Review Loop) | Two framework types with distinct names (Section 7.4) |
| Phase or stage | Configurable stages with gates | Phase list (Initiation … Closing) as an item attribute | Phase values = the workspace lifecycle stage list |
| Change control | Baseline locked; CR mandatory for locked fields | CR register is "advisory"; the PM applies changes manually; decisions Approve / Reject / Defer | Advisory before baseline, enforced after baseline (BR-04, BR-05, D-08) |
| Status reporting | PMs submit weekly status; missing reports flagged | Journal plus report builder (Weekly Status, Executive Summary, Full History, Custom) | The generated report becomes the weekly status submission (RPT-04) |
| Risk | Risk register with probability, impact and score | Item Risk Level, "Risk Related" label and a charter risk table | One project risk register feeding the charter and portfolio aggregation (M13) |
| Capacity | FTE capacity and demand by capability | Count of open items per PIC | Workload count in project views; FTE capacity in M18 |
| Roles and access | 8 + 9 roles | Admin / Member labels, not enforced | One enforced role model (Section 14) |
| Platform | SSO, RBAC, audit, scalability | Browser storage (≈4.5 MB per project), no real accounts, single user | Production platform requirements (M01, Section 17) |
| Metrics | Portfolio KPIs only | Inconsistent counts on the same data (22% vs 25% progress; "Deliverables 6" vs none; "Delayed 0" vs 9 overdue) | Standard metric definitions (Section 12) |

## 1.4 Defects in the source file corrected in v4.0

- The document control table and the page footer still read "BRD v2.0" although the file includes the v3.0 addendum.
- The v3.0 addendum restarts numbering at section 1, so sections 1-18 exist twice; v2.0 also has two headings numbered 6.1.
- The numbered steps of the three Key User Journeys continue across journeys (9-15, 16-21, 22-26) instead of restarting at 1.
- Section 23 of v2.0 ends with a leftover machine citation marker ("cite turn0view0").
- Priority conflicts inside v3.0: TPL-001…TPL-007 are P0, but the v3.0 roadmap places "template library, clone/adapt" in V2; GF-012 (framework versioning) is P1 while WS-010 (immutable published versions) is P0 and a business rule requires projects to store the exact framework version.
- Scope conflicts inside v2.0: the MVP checklist requires strategic linkage and portfolio investment reconciliation, while the Strategy and Investment modules are V2/P1; the Capacity dashboard is P0 while the HR integration that feeds it is P1.
- The v2.0 validation note says the supplied Claude artifact could not be reviewed; v4.0 reviews it through the POC survey (S3).
- The v3.0 workspace dashboard wireframe and architecture appendix lost their box formatting.

## 1.5 Key resolutions made in this version

1. One hierarchy and one vocabulary for the BRD and the POC (Section 7.1).
2. The WBS Master is the single source of truth for project work; charter, dashboards, timeline, board, focus and reports are derived views (BR-22).
3. Two framework types: Lifecycle Framework (stage-gate, from v3.0) and Deliverable Process Framework (WBS generator, from the POC) (Section 7.4).
4. Change control combines the POC change register with the v2.0 baseline: advisory before commitment, enforced after it (M11).
5. Standard metric definitions remove the counting inconsistencies observed in the POC (Section 12).
6. The combined P0 scope is larger than the v2.0 MVP build guidance. Since v4.2, Release 1 keeps the full P0 scope and is built by parallel workstreams with two integration milestones, sized for the stated delivery capacity (Section 18, D-01, A-07).

## 1.6 Changes in v4.1

| Change | Where |
|--------------------------------------------------------------------------|----------------------------|
| The product owner stated the product form: a multi-tenant SaaS. A Tenant level now sits between the platform and the workspaces; the enterprise layer (strategy, investment, cross-workspace views) is per tenant; provider operations are separated from customer administration. | 7.1, M02, Sections 13, 14, 17 |
| Natural-language interface for LLMs: each tenant gets a remote MCP server that any MCP-capable LLM client can connect to with a scoped token or OAuth, acting with the user's permissions; governance decisions stay with people in the application. | M05, BR-33 to BR-38, Section 17 |
| Modules renumbered M01 to M22 (new M02 Tenant & Subscription Management, new M05 Natural-Language Interface); requirement IDs are unchanged. | Section 8; old to new: M02 → M03, M03 → M04, M04 to M12 → M06 to M14, M13 to M20 → M15 to M22 |
| Wireframes for all 35 target screens (HTML and PNG, annotated with requirement IDs) replace the ASCII wireframes of BRD v2.0; logo, style guide and design tokens for the working name Metis. | Appendix B, Appendix E, brand/ |
| Decisions updated (D-03, D-20, D-21, D-22) and added (D-27 to D-31); open question Q-08 on LLM client compatibility. | Section 19 |
| A Markdown edition is generated from the same source as this document. | brd/ |

## 1.7 Changes in v4.2

An external pre-feasibility review (S5) assessed BRD v4.1, the wireframes and the style guide and concluded "Go with conditions". Every claim that can be checked against the documents was checked before any change, and all of them held: 22 MVP requirements had no screen, a dependency conflict was shown for an item without a start date, a gate showed two different quorums and allowed Pass with mandatory evidence missing, and the Approvals menu item had no screen. The product owner stated the delivery capacity at the same time (A-07): proposals to cut or defer scope because of team size were not applied. The disposition of each refinement is in review/review-disposition.md.

| Change | Where |
|--------------------------------------------------------------------------|----------------------------|
| Delivery capacity stated: an agency team of about 40 developers. Release 1 keeps the full P0 scope; increments 1A and 1B become integration milestones of parallel workstreams; the 10-16 week guidance from v2.0 is withdrawn and the build is re-estimated in Discovery. | A-07, 18.2, 18.4, D-01 |
| New requirements: contextual help (PLT-20), guided workspace setup (WSP-14), template deprecation (GOV-28), MCP action classes (MCP-19), MCP client allowlist (MCP-20), project creation (CHR-17), saved WBS views (WBS-20), Builder preview and keyboard list editor (BLD-12), My approvals (OVW-09). Quick update from Focus and My work across projects (OVW-07, OVW-08) move into the MVP. The existing GOV-23 now also records the template owner. | Sections 9, 10 |
| New rules: data as-of time and metric version on every figure (BR-39), no dependency conflict without both dates (BR-40), keyboard equivalent for every drag or canvas action (BR-41), gate eligibility enforced by the server (BR-42). | Section 13 |
| Sharper acceptance criteria: no-access, read-only and expired-session states; save state and conflict handling with one version contract for the application, MCP and the API; notification center; tenant isolation matrix with negative tests; plan-limit states; break-glass support access; gate eligibility and publish readiness; PDF and report snapshots; MCP compatibility list and connection diagnostics. | M01, M02, M04, M05, M11, M12 |
| MCP positioning: open to every LLM client that implements the specification, with a list of verified clients; the differentiation rests on governed data rather than on MCP itself. | 2, 4.2, 7.10, M05 |
| Metrics: MVP progress and health formulas, data freshness, metric versions and snapshots. | 12.1, 12.5 |
| Integration contract, accessibility target, data lifecycle and secrets handling. | 16, 17 |
| Decisions to take first and in which order; D-01, D-03, D-09, D-15 and D-26 updated; questions Q-09 to Q-13; risks for market evidence and stream coordination. | 19, 20 |
| Nine new wireframes (workspace setup, project creation, my approvals, notifications, search, docs and links, editor states, access states, data export and deletion) and revisions from the review; the build now fails if any MVP requirement has no screen. | Appendix B, Appendix E |
| Style guide: focus ring, accessibility contracts for grid, tree, board, canvas and dialogs, saving and error states, planned-capability badge, tenant branding rules, minimum type size, density, data freshness and AI attribution. | brand/ |

## 1.8 Changes in v4.3

A second external review (S6) checked how the first review was handled and reviewed the new material. It kept the conclusion "Go with conditions": of the 54 first-round refinements, 39 are closed, 11 partly closed, 1 open and 3 closed with a new defect. Every claim that can be checked against the documents was checked and all held. The review respected A-07 and proposed no scope cut; it judged the parallel-stream plan instead. Dispositions are in review/review-disposition-round2.md.

| Change | Where |
|--------------------------------------------------------------------------|----------------------------|
| Discovery now ends with a signed-off foundation contract pack (tenant context, identity and permissions, write contract, metrics and snapshots, audit and events, lifecycle versions, files and evidence, MCP tools, data lifecycle) and a walking skeleton running end to end; working agreements across streams. | 18.2, 18.4 |
| Milestone map corrected: client access (PLT-02) at 1B; the MCP prepare tool and portfolio read tools at 1B with the modules they depend on; lifecycle configuration (stages, gates, artifacts, roles) at 1A so a framework can pass its publish check; gate operation at 1B. | 18.2, M05 tool catalogue, D-30 |
| Proposed starting values for the NFR targets and the pilot adoption targets, to confirm in D-26 and with the design partners. | 17.1, 18.5, D-26 |
| Draft tenant isolation matrix: one boundary and one negative test per data path. | M02 |
| Rules for undoing MCP writes; contextual help on the first occurrence of each term per screen; effective permissions when workspace and project roles combine. | MCP-19, PLT-20, Section 14 |
| Decision order: D-15 joins the decisions to take first; D-31 before the architecture is frozen; D-02 before the client access path is built. | 19.1 |
| Wording: the MCP integration row follows the client policy (MCP-20); the 1.7 list separates new requirements from the updated GOV-23. | 16, 1.7 |
| Wireframes: workspace readiness matches WSP-14; program optional at project creation; personal tokens allowed or blocked per workspace; Undo on MCP changes; metric version next to every as-of time; deliverable approvals in My approvals; three sign-in recovery states; a new client view (45 screens); "Planned" written as text; a help and glossary button on every screen. | Appendix B, Appendix E |
| Style guide 0.3: one set of row heights for comfortable and compact density, the planned label written as text, a dialog checklist. | brand/ |

## 1.9 Changes in v4.4

The product owner named the POC's Settings, Frameworks menu a key capability. A survey of that menu on 3 Oct 2026 (review/poc-frameworks-coverage.md) found that v4.3 covered the intent of process frameworks but had no screen and no acceptance criteria for authoring them, and no Release 1 path to use a custom framework. The product owner confirmed the five recommendations of the survey the same day. The BRD Addendum "Onboarding in 30 minutes" v1.0 was issued alongside as a separate document; its amendments are not part of v4.4.

| Change | Where |
|--------------------------------------------------------------------------|----------------------------|
| A process framework editor outside projects with lanes defined per framework, node templates holding offsets, durations and roles instead of dates and people, typed connections with lag, sub-items, and connection points that only route arrows. | M08 (BLD-09, BLD-13 to BLD-15), 7.4, D-09, Appendix A |
| A Release 1 path to publish, version and deprecate custom process frameworks without a review step; Project Managers draft them, the Workspace Owner publishes; the review step stays P1. | BLD-11, BLD-16, Sections 14, 15.1, 18 and 21 |
| A new process framework editor wireframe, a corrected template library and a link from workspace setup (46 screens for this document; screens 46 to 57 belong to the onboarding addendum). | Appendix B, wireframes 13, 36 and 58 |

## 1.10 Changes in v4.5

A third external review (S7) read this document, the onboarding addendum v1.0, all 58 wireframes and style guide 0.3, and kept the conclusion "Go with conditions": of the 24 second-round refinements 19 are closed and 5 partly closed, none open and none closed with a new defect, and it raised 31 new refinements of which 8 had to be merged before the baseline. Every claim was checked against the files first and all of them held, so the refinements were applied rather than argued. The review's finding about this document was that the remaining gaps are no longer missing screens but contracts that two implementations could read differently: an equivalence asserted in one sentence, a role resolving to "the one member holding it", a publish check that lets a self-contradicting schedule through, and a coverage figure that reads like proof of behaviour. Dispositions are in review/review-disposition-round3.md.

| Change | Where |
|--------------------------------------------------------------------------|----------------------------|
| Canvas and list equivalence specified as a parity matrix (operation, gesture, keyboard command, list action, server command), one testable row per editor operation, and added to the foundation contract pack. | BLD-13, BR-41, 18.4, 21 |
| Framework node roles become typed assignment selectors (workspace role or normalized member title) with three resolution outcomes, resolved, missing and ambiguous; Metis never picks the first match; renames keep an alias or are invalidated explicitly. | BLD-14, 14, 15.1, D-40 |
| The publish check compares connection types and lags with node offsets and durations: a conflict certain for every Start Date blocks publication, one that depends on the project's dates warns. | BLD-15, BLD-16, 21 |
| A built-in published process framework may be referenced by a starter template or a configuration pack as a provider version, which creates no workspace publication event and so cannot bypass the Workspace Owner's authority. | BLD-09, BLD-16, 7.4 |
| The process framework step of workspace setup is labelled optional for activation, matching the four readiness rules. | WSP-14, 7.9, 21 |
| MCP tools publish policy metadata beside their class, including the confirmation mode, so a prepare-only tool confirmed per call is distinguishable from a batch of staged proposals confirmed by one approval. | MCP-19, tool catalogue, 18.4 |
| The data lifecycle row becomes one tenant data-processing matrix covering every path that holds or moves customer data, including outbound language, vision and speech calls, with retention, region, transfer mechanism and sub-processor per path. | 17, 18.4 |
| Accessibility gains per-pattern acceptance matrices (table, tree grid, board, canvas, dialog) and states that text contrast applies to placeholders. | 17, 21, brand/ |
| The foundation contract pack names an owner, a format, a path and an exit fixture for each item, and adds the keyboard parity matrix as a tenth item. | 18.4, Appendix G |
| Evidence other than a wireframe is named per requirement, and the build reports requirements by evidence type, so "every P0 requirement has a screen" is never read as "every behaviour is proven". | Appendix B.3, brd/source/evidence.tsv |
| Starting values of the non-functional targets are stated as the baseline defaults the design is built to; changing one is a recorded decision with its rationale. | 17.1, D-26 |

# 2. Executive Summary

The company needs one integrated view of its entire project portfolio. Portfolio information is fragmented across project plans, spreadsheets, finance reports, resource plans, weekly status reports and delivery tools. This creates three management problems: lack of transparency, poor cross-project trade-off decisions and slow escalation.

The Enterprise Portfolio Intelligence & Governance Platform solves this with three connected layers:

- **Enterprise Portfolio Intelligence** (from BRD v2.0): strategy, investment, portfolio health, capacity, risk, scenarios and decision support, with an AI copilot in V3.
- **Workspace & Governance Framework** (from BRD v3.0): each company, business unit or operating model runs in its own governed workspace with a configurable lifecycle of stages and gates, built from versioned templates.
- **Project Execution** (evidenced by the VistaX PM Genesis POC): charter, WBS Master, Deliverable Builder, timeline, board, focus list, change register, journal and reports, all derived from one WBS.

The platform is delivered as a **multi-tenant SaaS**: each customer organization is an isolated tenant with its own users, sign-in methods, plan and data, and can run several workspaces. Besides the web application, every tenant gets a **natural-language interface for LLMs**: a Model Context Protocol (MCP) server that any LLM client implementing the MCP specification can connect to with a scoped token or OAuth (clients verified by the provider are listed in the connection guide), so people can ask about and update their projects and portfolio from the AI tools they already use, with the same permissions, metric definitions and audit trail as the application.

Two design principles hold the layers together: *standardize the data and decision language, configure the operating workflow* (v3.0), and *enter work once in the WBS, derive every other view from it* (POC). The executive layer can only be trusted if the execution layer captures real work with consistent definitions; this version therefore treats the POC's project execution capabilities as the foundation of the MVP and adds the governance and portfolio layers above them.

## 2.1 Business outcomes

- Create a single source of truth for all company projects and initiatives.
- Give executives a portfolio-level view of investment, value, resources, delivery health, risks and dependencies.
- Improve resource allocation and identify bottlenecks before they become delivery failures.
- Strengthen change control by protecting committed scope, timeline and dependency baselines.
- Connect every project to strategic objectives and measurable outcomes.
- Enable portfolio decisions to fund, accelerate, maintain, defer or stop initiatives.
- Reduce manual preparation of weekly and SteerCo portfolio reporting.
- Give project teams one place to plan, execute and report work from charter to closeout. *(New, from the POC)*
- Serve many customer organizations from one SaaS with strict tenant isolation. *(New in v4.1)*
- Let people query and update portfolio data in natural language from any LLM client that implements MCP, under the same permissions and audit as the application. *(New in v4.1)*
- Make client and stakeholder commitments (inputs, approvals, sign-offs) visible and tracked. *(New, from the POC)*
- Create a data foundation for scenario planning and an AI portfolio copilot.

# 3. Business Context & Problem Statement

**Portfolio level (BRD v2.0).** Leadership cannot see in one place what the company is investing in, whether it has the capacity to deliver, what is at risk and which commitments have changed. Trade-offs between projects are made without comparable data, and escalation depends on manual status reporting.

**Operating model level (BRD v3.0).** Different companies, business units and operating models need different delivery lifecycles and approval rules, yet the enterprise needs one data model to compare and govern them. Hard-coding one lifecycle forces either custom development or workarounds outside the platform.

**Delivery model (v4.1).** The product owner stated on 2 Oct 2026 that the platform is a multi-tenant SaaS and that it must offer an interface through which LLMs work with it in natural language, over MCP, using tokens to connect from any LLM. The POC is single-user and browser-only, so both are new capabilities.

**Project level (VistaX POC).** The POC's design targets four recurring project problems:

- Charters are static documents that drift away from the plan; the POC makes charter sections live views of the WBS.
- Client inputs and approvals are tracked informally; the POC labels them (Input Required, Approval Gate) and lists them as client commitments in the charter.
- Status reports are assembled by hand; the POC generates them from WBS data and a daily journal.
- Changes are agreed without recorded impact; the POC logs change requests with affected items, downstream impact and a decision trail.

# 4. Product Vision, Positioning & Principles

## 4.1 Product vision

One enterprise platform where leadership can see what the company is investing in, why it matters, whether the company has capacity to deliver it, what is at risk and what action should be taken; and where every team runs its projects, from charter to closeout, inside a governed workspace whose operating rules are configured rather than coded.

ONE PLATFORM → MANY WORKSPACES → CONFIGURABLE GOVERNANCE FRAMEWORKS → STANDARDIZED DATA → LOCAL OPERATING MODELS → PORTFOLIO INTELLIGENCE

## 4.2 Product positioning

| Traditional PM tool | Governance prototype (Netlify) | Project execution POC (VistaX) | Target platform |
|--------------------|--------------------|--------------------|--------------------|
| How are tasks progressing? | How are projects governed? | How is this project planned, executed and controlled? | Are we investing in the right things and delivering the right outcomes? |
| Task / sprint focus | Project / milestone focus | WBS / deliverable focus | Strategy / investment / portfolio / delivery / outcome |
| Mostly project-level | Portfolio visibility + governance | Single project, single user | Enterprise strategic portfolio intelligence on governed execution data |
| Status reporting | Exception reporting | Live derived views and generated reports | Decision support + scenario planning |

**Where the differentiation lies.** An MCP interface alone is not a lasting advantage: other work-management products are adding MCP servers [Unverified - confirm in the Discovery market review]. The platform differentiates on what the interface exposes: metrics derived from one WBS with versioned definitions (Section 12), governance that is configured, versioned and enforced (M04, M11), the same permissions, metric engine and audit for people and AI (BR-32, BR-34), and decisions that AI can prepare but only people can take (BR-35). Discovery tests this thesis with buyers and design partners (18.4, Q-09).

## 4.3 Core management questions

1. What are we investing in?
2. Why are we investing in it?
3. How much are we investing?
4. Do we have enough people and capability?
5. When will the value be delivered?
6. What is at risk or dependent on something else?
7. Which commitments have changed, why, and who decided?
8. Which projects should be funded, accelerated, delayed or stopped?
9. What must each team clear today and this week? *(New, from the POC Focus view)*
10. What does the client owe us, and by when? *(New, from the POC Input Required section)*

## 4.4 Product principles

- **CEO-first for executives, PM-first for delivery:** executive views surface decisions and exceptions before detail; project views surface today's work first.
- **One golden thread:** every project traces from strategy to investment, MVP or deliverable, delivery and outcome.
- **Exception-based management:** highlight what needs attention instead of forcing leaders to inspect every project.
- **Baseline integrity:** committed scope, dates, budget and dependencies change only through governed change.
- **Single data model:** project, resource, budget, roadmap, risk and outcome information is not maintained in disconnected spreadsheets.
- **Enter once, derive everywhere:** the WBS is the single source of truth for project work; every other project view reads from it.
- **Standardize the data and decision language; configure the operating workflow:** workspaces differ in lifecycle, approvals and lists, never in the core data model.
- **Warn, do not auto-reschedule:** dependencies are constraints that flag conflicts; only people move dates.
- **Drill-down by design:** executives stay at portfolio level while delivery teams drill to milestone, WBS item and activity.
- **Integrate rather than replace execution tools:** Jira, Azure DevOps, ERP, HR and finance remain systems of record where appropriate.
- **Decision-oriented analytics:** dashboards lead to actions, not just visualization.
- **Accountable AI:** AI explains, predicts and recommends from traceable portfolio data; humans approve every action.
- **Tenant isolation by default:** every record, file, search index, report, export and MCP call belongs to exactly one tenant; nothing crosses tenants.
- **Open, governed AI access:** any LLM client that implements MCP can work with the platform through scoped tokens or OAuth; it acts as the user, sees only what the user may see, gets figures computed by the platform, and can prepare but never take governance decisions.

## 4.5 UX principles

- Progressive disclosure: summary first, detail on demand.
- Executive screens are decision-oriented; avoid dashboard overload (5-8 high-value executive signals).
- Consistent RAG semantics that never rely on color alone.
- Every warning has a reason and a next action; every empty state explains what to do next (the POC's "Add one in the WBS Master" pattern).
- Every metric is drillable to the underlying records.
- Baseline, forecast and actual are shown consistently.
- Strategic, investment and execution information stays visually connected.
- Calculated indicators show confidence and data freshness; every dashboard, report and AI answer states its data as-of time and metric version (BR-39).
- Every drag-and-drop or canvas action has a keyboard equivalent (BR-41).
- Help sits where the work happens: terms such as Stage, Phase, Gate and Baseline are explained in place (PLT-20).
- Planned capabilities are labelled as planned, never shown as disabled controls.

# 5. Scope, Assumptions & Constraints

## 5.1 In scope

| Domain | Scope |
|------------------------|----------------------------------------------------------------------|
| Platform | Identity and access, multi-user collaboration, notifications, files, audit, export and import |
| SaaS and tenancy | Tenant provisioning and lifecycle, tenant administration, sign-in methods per tenant, plans and limits, provider operations, support access, export and offboarding |
| AI access (MCP) | MCP server per tenant, personal access tokens and OAuth, read tools, append-only and update tools, prepare-only governance actions, audit, rate limits |
| Workspace | Workspace lifecycle, navigation hierarchy, fields and options, team and roles, configuration audit |
| Lifecycle governance | Stages, gates, mandatory evidence, waivers, templates (clone, adapt, review, publish, instantiate), versioning |
| Project execution | Charter and business case, WBS Master, Deliverable Builder and process frameworks, timeline, board, focus, overview, change control and baseline, journal and reports, documents and links |
| Strategy | Strategic pillars, objectives and KPI linkage |
| Portfolio | Portfolio hierarchy, registry, investment allocation, prioritization |
| MVP / Product | MVP definition, features, release milestones, expected value |
| Roadmap | 12-24 month portfolio, project and MVP roadmap |
| Resource | Capacity, demand, utilization, capability bottlenecks |
| Risk | Risk register, risk engine, portfolio risk aggregation, dependencies |
| Investment | Budget, actual, forecast, variance, CapEx/OpEx, value |
| Outcome | KPI, expected benefit, realized benefit, value at risk |
| AI | Portfolio Q&A, alerts, recommendations and scenario support (V3) |

## 5.2 Out of scope for the MVP

- Full replacement of Jira / Azure DevOps or enterprise task management.
- Full accounting / ERP functionality, payroll or HR administration, complex procurement.
- Automatic scheduling, critical-path rescheduling or resource levelling (BR-23).
- Native mobile applications (D-19).
- Anonymous public access to a demo workspace (D-21).
- Advanced AI autonomous actions without human approval.
- Hosting or training an LLM inside the platform: customers bring their own MCP-capable LLM client; the in-app copilot is V3 (M22).
- Online self-serve signup and billing (V2, D-27).

## 5.3 Assumptions

| ID | Assumption | Impact if wrong |
|------|------------------------------------------------------------|----------------------------------|
| A-01 | The public Claude artifact referenced (but not reviewed) in BRD v2.0 is the VistaX PM Genesis POC (artifact file wbs-master-builder.jsx). | Another prototype exists and must be reviewed (Q-02). |
| A-02 | POC behaviour in this document was observed through the UI only; hidden logic (formulas, scheduling) is inferred. | Some POC-derived rules change once the source code is reviewed (Q-03). |
| A-03 | The Netlify governance prototype is as described in BRD v2.0 §23; it was not re-reviewed for v4.0. | Appendix F needs updating (Q-05). |
| A-04 | Example data is illustrative: banking examples in v2.0, the Company A digital product lifecycle in v3.0, a CGI production agency in the POC. The platform itself is industry-neutral. | Industry-specific requirements may be missing. |
| A-05 | The sources give no target dates; the durations in Section 18 are guidance to be re-estimated in Discovery for the team in A-07. | Release dates move. |
| A-06 | The platform is a multi-tenant SaaS and exposes an MCP interface usable from any MCP-capable LLM with tokens (stated by the product owner on 2 Oct 2026). | Modules M02 and M05 and the SaaS NFRs change scope. |
| A-07 | Delivery capacity is an agency team of about 40 developers working in parallel workstreams (stated by the product owner on 2 Oct 2026). Scope follows business need and is not reduced to fit a smaller team. | The workstream structure of Section 18.2 and the dates are re-planned; requirement priorities stay. |

## 5.4 Constraints and dependencies

- The POC runs entirely in the browser with about 4.5 MB of storage per project, no real accounts, no enforced roles and no file store; the product needs a hosted backend (POC 34, 36; Survey §11).
- Enterprise SSO is a P0 integration (v2 §13).
- The SaaS is hosted and operated by the provider; cloud regions, data residency options and client-data security rules must be confirmed before solution design (D-20, D-28).
- MCP support differs between LLM client applications (OAuth versus static tokens, remote server support); any client that implements the specification can connect, and compatibility is verified per client before it is listed in the connection guide (MCP-15, Q-08) [Unverified - confirm per client].
- Integrations with ERP, HR, Jira / Azure DevOps and BI depend on data owners in those functions (V2).
- Several requirements depend on client decisions listed in Section 19.

# 6. Stakeholders & Personas

| Persona | Primary need | Key views | Source |
|----------------------|------------------------------|----------------------------------------|------------|
| CEO / ExCo | Investment and strategic decisions | Executive cockpit, decision center, scenarios, portfolio value | v2 §5 |
| Product Director | Build the right products and manage trade-offs | Portfolio, roadmap, MVP, capacity, dependencies | v2 §5 |
| PMO / Portfolio Manager | Govern portfolio health and reporting | Workspace dashboard, registry, governance, CRs, reporting | v2 §5; v3 §9 |
| Workspace Owner / Admin | Configure the operating model of a workspace | Settings: fields and options, team and roles, frameworks, templates, data | v3 §9; POC 31-36 |
| Project Owner / Project Manager | Deliver commitments | Overview, Charter, WBS, Plan, Focus, CRs, Reports | v2 §5; POC 02-29 |
| Stage Owner / Gate Approver | Stage readiness and formal gate decisions | Gate readiness, evidence, decisions | v3 §9 |
| Delivery team member | Know and update assigned work | Focus ("Only mine"), Board, WBS item, comments | POC 21, 23, 29 |
| Client / external stakeholder | Provide inputs, approve deliverables, sign off | Charter (Input Required, sign-off), approvals, shared reports | POC 06-07; D-02 |
| Finance | Budget and forecast control | Investment, actuals, forecast, variance | v2 §5 |
| HR / Resource Manager | Capacity and capability planning | Capacity, demand, bottlenecks | v2 §5 |
| Business Owner / Sponsor | Business case and outcome | Strategy, KPI, benefits, project health | v2 §5; v3 §9 |
| Engineering / Delivery Lead | Delivery feasibility | MVP, WBS, dependencies, capacity | v2 §5 |
| Control function (Risk, Finance, Security, Legal, Compliance) | Configured reviews at gates | Gate reviews and evidence | v3 §9 |
| Tenant Admin | Run the customer organization's account: users, sign-in, security, plan, AI access | Tenant admin console | New (M02) |
| Provider Operator | Operate the SaaS: tenants, plans, global templates, support | Provider console | New (M02) |
| LLM-assisted user (any persona) | Ask, summarise and log updates in natural language from an LLM client | An MCP client (verified clients listed); My profile, AI access | New (M05) |

# 7. Target Operating Model

## 7.1 Unified hierarchy

```
PLATFORM (SaaS provider)   shared product, global template library, plans, operations
 |
 +-- TENANT   one customer organization: users, sign-in methods, plan and limits,
      |       data boundary, enterprise layer (strategy, investment, cross-workspace views)
      |
      +-- WORKSPACE   governance boundary: team and roles, fields and options,
           |          lifecycle framework, process frameworks, policies, calendar
           |
           +-- PORTFOLIO              (POC: "Space")
                |
                +-- PROGRAM / PRODUCT  (POC: "Folder", e.g. a client account; optional)
                     |
                     +-- PROJECT   charter, business case, budget, stage instances, baseline
                          |
                          +-- MVP / RELEASE   optional outcome container (product workspaces)
                          |
                          +-- WBS   single source of truth for project work
                               +-- Category (grouping node, level 1)
                                    +-- Deliverable / Work Package / Task / Subtask

Cross-cutting: Strategy, Investment, Resources, Risks, Dependencies,
               Governance (stages, gates, CRs, decisions), Outcomes
Access channels: web application; MCP server for LLM clients; REST API (V2)
```

| Level | BRD term (v2.0 / v3.0) | POC term | Definition | POC example |
|----------------|------------------|------------------|----------------------------------------|----------------------|
| Platform | Platform | Not shown | SaaS provider level: shared product, common data model, global templates, plans | |
| Tenant | Not present (new in v4.1) | Not present (single user) | One customer organization: users, sign-in, plan, data boundary and the enterprise layer | Acme Holdings (wireframe sample data) |
| Workspace | Workspace | Workspace | Governance boundary; owns configuration, roles, frameworks and reporting scope | My Workspace |
| Portfolio | Portfolio | Space | Grouping of programs and projects managed as one investment portfolio | My Workspace (space) |
| Program / Product | Program / Product | Folder (with project count badge) | Optional grouping of projects, e.g. a product line or client account | Client Projects (1) |
| Project | Project | Project | Unit of delivery with a charter, team, plan and governance | Meridian CGI Campaign (client: Northwind Furniture Co.) |
| MVP / Release | MVP | Not present | Optional outcome container with KPIs and release criteria | |
| Category | Not present | Category row (1.0, 2.0 …) | PM control area grouping work items | 1.0 Deliverables, 2.0 Technical |
| Work item | Milestone / WBS / Task / Feature | WBS item | Deliverable, Work Package, Task or Subtask | 1.1 51 Render Images (Work Package) |

## 7.2 Golden thread

Every investment keeps a traceable relationship: Strategic Objective → Portfolio → Project → MVP or Deliverable → Investment → Resource → Delivery (WBS) → KPI / Benefit.

## 7.3 Project work model (WBS)

- **Node kinds:** Category nodes group work at level 1; every other node is a work item with a Type (default list: Deliverable, Work Package, Task, Subtask).
- **Classification:** Category = PM control area; Type = work object level; Phase = lifecycle stage of the workspace framework.
- **Labels (multi-select management roles):** Milestone, Checkpoint, Approval Gate, Input Required, Risk Related. Each built-in label drives a view (Section 15.2).
- **Assignment:** PIC (person in charge), Reviewer, Approver. The client can be the PIC of Input Required items.
- **Dependencies:** FS, SS, FF, SF. They flag conflicts and never move dates.

| Derived view | What it shows | Derived from |
|----------------------|----------------------------------------------------|----------------------------|
| Overview dashboard | KPI tiles, progress, status, category progress, workload, milestones and gates, overdue, high risks | All work items (Section 12) |
| Charter V Deliverables | Work items with Type = Deliverable | Type |
| Charter VI Input Required | Client commitments with PIC and target date | Label Input Required |
| Timeline | Dated work items as points on a time axis | Start / Target dates |
| Board | Work items by status | Status |
| Focus | Overdue, due this week, starting this week | Target, Start, PIC |
| Reports | Health summary, completed, coming up, overdue, milestones, journal, CRs, activity | Work items, journal, CRs, activity |

## 7.4 Two framework types

| Aspect | Lifecycle Framework | Deliverable Process Framework |
|----------------|------------------------------------------|------------------------------------------|
| Purpose | How a project moves from idea to outcome through stages and gates | How one deliverable is produced: steps, approvals, inputs, quality gates, milestones, risks |
| Structure | Ordered stages with entry and exit criteria, mandatory artifacts, gates, SLAs and rules | Swimlanes defined per framework (default: Deliverables, Approval, Input Required, Quality Gate, Milestones, Risk) with node templates (offset, duration, roles) and typed connections (BLD-13 to BLD-15) |
| Applied when | A project is created (stage instances are instantiated) | The PM runs the Deliverable Builder for a deliverable |
| Output | Project stage instances and gate records | WBS items, dependencies and a Blueprint canvas |
| Examples | Company A: Discovery → Design → Solution → Development → Test → GTM → Retro. Creative production: Initiation → Planning → Production → Review → Delivery → Closing | CGI Still Renders (16 items, 15 relationships), 3D Animation / Video (12, 11), Simple Review Loop (6, 5) |
| Versioning | Published versions are immutable; projects keep the version they started with (BR-15) | Built-ins are read-only published provider versions that a starter template or a pack may reference without creating a workspace publication; "Edit a copy" creates a workspace draft that the Workspace Owner publishes; published versions are immutable and generated items record framework and version (BLD-09, BLD-10, BLD-16) |
| Requirements | M04 | M08 |
| Source | v3 §4-7 | POC 15-18, 35 |

## 7.5 Lifecycle and gate operating model

Governance is embedded in the lifecycle, not only reported on: PROPOSE → STAGE → GATE → STAGE → GATE → … → OUTCOME / RETRO (stage names come from the workspace framework).

- Gate readiness is visible before meetings: required evidence, open risks, dependencies, budget and resource impact, decision history.
- Approvers can request information or rework without bypassing baseline and change-control rules.
- Gate decisions are linked to project, stage, evidence, approver and the Decision Log.
- Failed or conditional gates create actions, risks or change requests.
- Escalation rules trigger for overdue, repeatedly failed or materially blocked gates.

Two gate levels exist and both feed governance KPIs:

| Gate level | Example | Decided by | Decision values |
|----------------------|----------------------------------|----------------------|----------------------------------|
| Lifecycle gate (stage exit) | Solution approval before Development | Gate Approvers with quorum, per framework | Pass, Pass with Conditions, Rework, Hold, Reject |
| Deliverable approval gate (WBS item labelled Approval Gate) | Client approval of draft renders | The item's Approver | Item status (approved = Done) with comment |

## 7.6 Company A reference lifecycle (from v3.0)

| Stage | Purpose | Typical mandatory outputs | Gate / exit |
|------------|----------------------------------|----------------------------------------|----------------------|
| Discovery | Validate problem, customer need, opportunity and strategic fit | Problem statement, customer evidence, opportunity, initial business case, KPI | Discovery approval |
| Design | Define experience, process and target operating model | Journey or service blueprint, UX/UI, process design, acceptance criteria | Design approval |
| Solution | Define technical and business solution and feasibility | Architecture, NFRs, integrations, security and risk assessment, estimate | Solution approval |
| Development | Build approved scope | Sprint or release plan, WBS, code and review evidence, progress, dependencies | Build readiness |
| Test | Validate quality, security, performance and business acceptance | Test evidence, defects, UAT, security and performance results | Go-live readiness |
| GTM | Prepare launch, adoption and operational readiness | Launch plan, training, communication, support model, KPI baseline | GTM / launch approval |
| Retro / Improvement | Measure outcome and improve the delivery system | Outcome review, KPI result, lessons learned, improvement actions | Closure / improvement backlog |

## 7.7 Decision lifecycle

| Decision | Trigger | Required evidence | Outcome |
|------------|------------------------------|----------------------------------------|----------------------|
| START | New initiative proposed | Business case, strategic fit, capacity, value | Approved / rejected |
| CONTINUE | Periodic review | Health, value, risk, spend | Continue / remediate |
| ACCELERATE | High value or critical opportunity | Capacity, dependency, scenario impact | Additional funding or resources |
| DELAY | Capacity or priority conflict | Strategic score, dependencies, scenario | Replanned roadmap |
| STOP | Low value or poor feasibility | Value at risk, spend, score, alternatives | Close / reallocate |

## 7.8 Governance cadence

| Cadence | Forum | Purpose | Platform output |
|------------|----------------------|----------------------------------------|----------------------------|
| Daily | Project team | Clear overdue and due work, log events | Focus view, journal |
| Weekly | Project status | Progress, risks, changes, client commitments | Weekly status submission (RPT-04) |
| Weekly | Portfolio Ops | Exceptions, risks, capacity, missing reports | Attention queue and actions |
| Bi-weekly | Product / Program Review | Roadmap, MVP, dependencies, resources | Updated roadmap and decisions |
| Monthly | Portfolio Review | Investment, health, benefits, strategic alignment | Portfolio scorecard |
| Quarterly | SteerCo / ExCo | Investment allocation and strategic trade-offs | Decision pack and scenario options |
| Per gate | Gate review | Stage exit decision | Gate decision and Decision Log entry |
| Ad hoc | Change control | Material scope, budget, date or dependency changes | CR decision and audit trail |

## 7.9 Key user journeys

**CEO weekly review:** (1) Open the executive cockpit. (2) Review portfolio health, investment, value and capacity. (3) Open Requires Attention. (4) Review green-but-risky projects and material budget or resource exceptions. (5) Review recommended decisions. (6) Approve, reject or request further analysis. (7) Publish decisions into the Decision Log.

**Product Director portfolio review:** (1) Filter the portfolio by strategic objective or product. (2) Review roadmap and MVP delivery. (3) Identify capacity conflicts and dependencies. (4) Review project score and expected value. (5) Create a scenario if trade-offs are required. (6) Submit the recommendation to governance.

**PM project setup:** (1) Create the project (CHR-17): workspace, portfolio, program, client, PM, owner and sponsor, optionally from a project template; the lifecycle framework version is pinned and the project starts in Draft with a setup checklist. (2) Complete charter sections I-IV and the business case. (3) Build the WBS manually or with the Deliverable Builder. (4) Assign PIC, Reviewer and Approver, resolving in the build preview any node whose selector matched nobody or several members (BLD-14). (5) Pass the commitment gate; the baseline is captured.

**PM and team daily execution:** (1) Open Focus and clear overdue items. (2) Update status on the Board or in the WBS. (3) Comment and @mention on items. (4) Log meetings, decisions, issues and highlights in the Journal.

**PM weekly update:** (1) Review the Overview. (2) Generate the Weekly Status report for the period. (3) Add declared health and narrative. (4) Publish it as the weekly status submission. (5) If a baselined commitment must change, raise a CR instead of editing it.

**Change request:** (1) Log the CR with affected items. (2) Review the automatic impact analysis. (3) The approver decides (Approve, Reject, Defer, Request information) with rationale. (4) If approved, the PM applies the change and a new baseline version is recorded. (5) The decision is stored in the Decision Log.

**Gate review:** (1) The stage owner completes mandatory evidence. (2) Gate readiness is checked; decision buttons stay disabled until the gate is eligible, and the server rejects an ineligible decision (BR-42). A disabled decision always names what is missing, with a link to each blocker and its owner, so an ineligible gate is actionable rather than simply closed. (3) Gate approvers decide with rationale. (4) Conditions become tracked actions; the decision enters the Decision Log.

**Approver daily round:** (1) Open My approvals (OVW-09): every CR, gate, charter sign-off, waiver and MCP-prepared decision waiting for the user, oldest first. (2) Open an item with its evidence and impact. (3) Decide with rationale or request information. (4) The requester is notified (PLT-09).

**Tenant onboarding:** (1) A provider operator creates the tenant with plan, region and first admin (self-serve signup is V2). (2) The tenant admin sets sign-in methods (SSO, or password with MFA) and invites users. (3) The admin creates workspaces, starting from global templates. (4) Workspace owners configure fields, roles and frameworks.

**Connect an LLM through MCP:** (1) The user opens My profile, AI access. (2) Connects a client with OAuth, or creates a personal access token with scopes, workspace restriction and expiry, within the clients and workspaces the tenant allows (MCP-20). (3) Adds the endpoint and token to the LLM client; a test call names the cause of any failure (MCP-15). (4) Asks questions or logs updates in natural language; answers use the figures the platform computes. (5) Decisions the LLM prepares wait for confirmation in the application; every call appears in the audit log.

**Workspace setup (WSP-14):** (1) Create the workspace from a starter template and complete the profile. (2) Configure fields and options. (3) Invite the team and assign roles. (4) Clone, adapt, review and publish the lifecycle framework. (5) Add or adapt deliverable process frameworks, or keep the built-in ones for now: this step is recommended before the Deliverable Builder is used and does not block activation. (6) The readiness check passes and the owner activates the workspace.

## 7.10 Conceptual architecture

```
   People in a browser                     LLM clients implementing MCP (verified ones listed)
           |                                                  |
   Responsive web application              MCP server per tenant (Streamable HTTP, OAuth or token)
           |                                                  |
           +-------------------------+------------------------+
                                     |
          Service layer: one permission model, one metric engine, one audit log
                                     |
  +------------------+------------------+------------------+------------------+
  | Strategy &       | Governance:      | Project          | Resource &       |
  | Investment       | stages, gates,   | execution: WBS,  | Capacity         |
  |                  | CRs, decisions   | plan, reports    |                  |
  +------------------+------------------+------------------+------------------+
                                     |
      Workspace configuration (fields & options, roles, frameworks, policies)
                                     |
   Tenant boundary: tenant-scoped data, files, search, audit and quotas, one per customer
                                     |
  +--------+--------+----------+----------+--------+---------+    +-----------------+
  | ERP    | HR     | Jira/ADO | Data/BI  | SSO    | Email / |    | AI copilot (V3) |
  |        |        |          |          |        | Chat    |    | uses MCP tools  |
  +--------+--------+----------+----------+--------+---------+    +-----------------+
                                     |
        Provider operations: tenants, plans, global templates, support access
```
