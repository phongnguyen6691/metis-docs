---
title: Glossary
summary: Every business term of the BRD and its addendum, with its meaning.
component: all
type: reference
status: current
ids: []
---

# Glossary

The first rows are the terms of [Appendix A of the BRD v4.5](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-a-glossary), then those of
[Appendix A of the onboarding addendum v1.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#appendix-a-glossary-additions), each copied word
for word and in the order of its appendix. The last nine rows are terms that neither appendix lists:
eight that the external reviews of the BRD raised, and the golden thread of BRD section 7.2. The BRD,
the addendum or their wireframes explain each of them, and its row names the section that uses it.
Ids such as BLD-14 or D-40 are requirement and decision ids of the BRD.

| Term | Meaning |
|---|---|
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
| Activation | The aha moment as one event: in the same session the workspace is Active with the company's own lifecycle, at least one real person is invited, at least one real running project is adopted and the cockpit shows at least one metric from the client's own data (Section 4.1) |
| Adoption (of a project) | Bringing a running project into Metis at its current stage, with earlier stages recorded as completed before Metis and, when committed, a baseline from import (ONB-10). On screen it is called bringing a running project into Metis, since "adopt" sounds like taking ownership |
| Access difference | What a proposed role grant would add to or remove from one person's current access, shown next to the proposal before launch (ONB-15, BR-51) |
| Assumed value | A normal value applied without confirmation because launch needs it: inferred for this company with medium confidence, accepted from a card (a value only the executive knows is confirmed instead), or set by a stated fallback rule; it keeps a badge until someone confirms it. A high-impact value is never assumed (BR-52) |
| Bring your own AI | The second onboarding path: the client's own LLM client reads its files and calls the setup tools (Section 12) |
| Default value | A value taken from the starting pack because no document states it; shown with a badge until confirmed. The two badges are explained together on screen: assumed means inferred for this company, default means taken from the starting pack, and both stay flagged until confirmed |
| Eligible session | An onboarding session that meets the entry conditions of Section 4.1 and therefore counts towards the 30-minute measure |
| Draft workspace | A workspace in the Draft state of WSP-05; during onboarding it holds the whole draft that the executive reviews and launches |
| Dry run | A rehearsal of the drafted approval flow on three adopted projects before launch (ONB-14) |
| Finisher | The person the executive names at launch to finish the rest; default owner of delegated items |
| Framing questions | The three outside-in questions to the executive: how they look at the portfolio, how involved they want to be in decisions, what they want to know first (Section 6.3) |
| High-impact value | A field whose risk class makes an unconfirmed value expensive: identity and access, baseline budget and dates, approvers, quorum and routing, and settings that cannot change later (D-42, BR-52) |
| Kept unchanged after the due date | The state of a normal value applied at launch that nobody confirmed by its due date; the value stays and the item remains in the finisher's attention list (BR-48). The glossary keeps "kept by default" as the former name, which the screens no longer use because it read like a default value |
| Onboarding session | The record of one onboarding: facts, answers, inputs, provenance, questions, tasks, findings and the batch ID of everything it created (ONB-01) |
| Onboarding token | A short-lived token limited to the setup tools and one Draft workspace (ONB-21) |
| Portfolio X-ray | Findings drawn from the client's own documents during onboarding, such as missing sponsors or conflicting budgets (ONB-13) |
| Privileged role | A role whose grant is reviewed against the named person at launch rather than in bulk: tenant administration, workspace ownership, executive, portfolio management, and any role that can approve, publish or change permissions (D-41) |
| Provenance | The source of a value (file, location and quoted passage) with a confidence band, a status, a risk class and the actor path that produced it (ONB-08) |
| Rule-based path | Onboarding without the AI: exact parsers and column mapping (ONB-20) |
| Setup tool group | The prepare-only MCP tools that write proposals into a Draft workspace and its session (Section 7.1) |
| Source authority | The document class, approval marker and date that make a budget or a date count as approved; model confidence is not one (BR-53) |
| Starting pack | A provider-maintained lifecycle, option lists and approval flow for one kind of work, with references to built-in published process framework versions; the reference Metis matches documents against (ONB-27) |
| Suggestion | After launch, a change proposed by the AI or an MCP client that applies only when a person accepts it (ONB-18) |
| Quorum | How many of a gate's approvers must agree before the gate is decided, set per gate with its approvers (GOV-03). The gate review shows votes cast against votes needed, and the onboarding approval flow says "3 of 5 approvers must agree" (wireframe screens 12 and 49). The publish check needs a quorum that the configured approvers can meet (GOV-21). Whether a delegated or abstaining vote counts toward it is open (Q-10). Used in [M04](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m04-lifecycle-governance-framework--templates-gov) and [Section 19.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions) |
| Assignment selector | What a process framework node names for its PIC, Reviewer or Approver: a workspace role or a member title, never a person. At build time it resolves against the project's members as resolved (exactly one member), missing (nobody holds it, so the field stays empty) or ambiguous (several members hold it, so the project manager chooses and Metis never picks the first match). A selector assigns work, never access (BLD-14, D-40). Used in [M08](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m08-deliverable-builder--process-frameworks-bld), [Section 14](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#14-roles--permissions) and [Section 15.1](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#151-entities) |
| Parity matrix | For each editor, the table of every drag-and-drop or canvas operation with its gesture, its keyboard command, its list-view action and the server command, so that keyboard equivalence is tested row by row (BR-41, BLD-13). It is the tenth item of the foundation contract pack. Used in [Section 13](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#13-business-rules), [M08](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m08-deliverable-builder--process-frameworks-bld) and [Section 18.4](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#184-delivery-plan) |
| Constraint consistency | The part of the publish check of a process framework that compares each connection's type and lag with the offsets and durations of the two nodes it joins. A conflict that must occur for every Start Date blocks publication and names the two nodes; one that depends on the project's own dates is a warning (BLD-15, BLD-16). Used in [M08](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m08-deliverable-builder--process-frameworks-bld) |
| Confirmation mode | Policy metadata that an MCP tool publishes beside its action class: `per_call`, where a governance action is confirmed in the application for each call, or `batch_launch`, where one later approval confirms a batch of staged proposals (MCP-19). Contract tests assert it for every tool class. Used in [M05](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m05-natural-language-interface-for-llms-mcp-server--access-tokens-mcp), [Section 15.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#152-reference-data-and-defaults) and [Section 18.4](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#184-delivery-plan) |
| Design partner | One of the one or two organizations that act as partners for Discovery and the pilot (Q-09). Usability tests of setup, daily work, approvals and the Builder run with them, one or two portfolios go live with them, and with the pilot sponsor they confirm the pilot targets and own them. Their documents stand for typical onboarding inputs (addendum A-09). Used in [Section 18.4](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#184-delivery-plan), [Section 18.5](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#185-mvp-success-criteria) and [Section 19.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions) |
| AI processing authorization | The tenant admin's authorization of AI processing for the tenant, given on a screen that names the provider and region, what is sent, the provider's contracted no-training term and retention, what Metis keeps and how to switch it off. No customer content reaches the LLM provider before it. It is a product setting, not by itself a legal basis for processing personal data (ONB-22). Used in the addendum's [M23](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#m23-onboarding--data-intake-onb), [Section 11.5](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#115-data-handling-the-customer-decides) and [Section 14](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#14-data-model-additions) |
| Declared versus computed health | The two health signals of a project: the status the project manager declares, and the RAG health computed from delivery, risk, resource and financial data. They are shown side by side, and a declared Green with a computed Amber or Red is flagged as green-but-risky until an override with a rationale exists (OVW-05, RSK-04, BR-08). The project manager adds the declared health to the weekly status submission (RPT-04). Used in [M10](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m10-project-overview--focus-ovw), [M12](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m12-journal--project-reporting-rpt) and [M13](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m13-risk--dependency-rsk) |
| Golden thread | The traceable relationship that every investment keeps, from strategic objective to portfolio, project, MVP or deliverable, investment, resource, delivery in the WBS, and KPI or benefit, so that every project traces from strategy to its outcome. Used in [Section 7.2](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#72-golden-thread) and [Section 4.4](requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#44-product-principles) |

## Source codes

The BRD cites its sources by code. The main BRD defines S1 to S7; the onboarding addendum takes S1 to
S6 from it and defines S7 to S14 itself (lines 31 and 44 of
[`addendum-onboarding/parts/01-front.md`](requirements/source/addendum-onboarding/parts/01-front.md)).
The code S7 therefore names two different sources:

- In the main BRD, S7 is the third external review (line 51 of
  [`parts/01-front.md`](requirements/source/parts/01-front.md)).
- In the addendum, S7 is the product owner's decisions of 2 October 2026 in the onboarding design
  sessions (line 35 of the addendum file above), and the third external review is S14 (line 42).

Read a bare S7 against the document it appears in.
