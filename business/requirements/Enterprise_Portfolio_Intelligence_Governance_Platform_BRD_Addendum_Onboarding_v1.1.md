---
title: BRD addendum, onboarding v1.1
summary: The onboarding addendum to BRD v4.5, generated from source/addendum-onboarding by build.py.
component: all
type: reference
status: current
ids: []
generated_from: business/requirements/source/build.py
---

![](../../design/brand/logo/metis-wordmark@2x.png)

# Business Requirements Document Addendum

**Onboarding in 30 Minutes: Enterprise Portfolio Intelligence & Governance Platform**

**Addendum to the Unified BRD v4.5: a client set up in 30 minutes of the main setup person's active effort, under the entry conditions of Section 4.1, by reading what the client already has, asking only what is missing and handing the rest to the right owners**

| Document control | Value |
|------------------------|-----------------------------------------------------------------------------|
| Document | BRD Addendum: Onboarding in 30 minutes, version 1.1 |
| Supplements | Unified BRD v4.5 (3 October 2026), which this addendum does not edit |
| Date | 3 October 2026 (version 1.1) |
| Status | Draft for business and technology validation and for the external review |
| Product sponsor | CEO / Product Director |
| Decisions | Taken by the product owner on 2 October 2026 in the onboarding design sessions (S7); the design was approved section by section |
| Design artifacts | wireframes/ screens 46 to 57 (HTML and PNG, listed in manifest.json) |
| Editions | This document and a Markdown edition, both generated from brd/source/addendum-onboarding/ |

**Revision history**

| Version | Date | Description |
|---------|------------|------------------------------------------------------------------------------|
| 1.0 | 3 Oct 2026 | First version: module M23 with 40 requirements, 8 business rules, 8 decisions, 5 open questions, amendments to BRD v4.4, 12 wireframes. Drafted against BRD v4.3; the base became v4.4 on the same day, whose only addition, the process framework editor, changes none of the amended items |
| 1.1 | 3 Oct 2026 | Third external review (S14) applied: the 30-minute measure becomes an activation event with entry conditions, five clocks and a distribution (4.1, ONB-26, 19.2); roles granted at launch become proposed grants with an access difference and named approval of privileged roles (ONB-15, BR-51, D-41); values carry a risk class and a high-impact value is never assumed (ONB-08, BR-52, D-42); approved budgets and dates need a source authority (ONB-10, BR-53); starting packs reference built-in published process frameworks instead of forging a publication (ONB-27); deleting inputs is split into the binary and the source content (ONB-22, D-38); reading is split into extraction, validation and writing with no side-effect tool in extraction (ONB-24, 9.1); AI consent is renamed AI processing authorization (ONB-22, 11.5); plus resume, retry and cost contracts, attention-debt measures, evidence types in Appendix D and three new business rules, three decisions and one question |

**Sources** (S1 to S6 as in BRD v4.5)

| Code | Source | Used for |
|------|----------------------------------------------|------------------------------------|
| S7 | Product owner decisions in the onboarding design sessions of 2 October 2026; design spec brd/source/addendum-onboarding/2026-10-02-onboarding-design.md | Every decision and every approved design section |
| S8 | Market research on competitor and adjacent-product onboarding, brd/source/addendum-onboarding/research/research-competitors.md (sources accessed 2 October 2026) | Market patterns, published implementation times, gaps |
| S9 | Market research on onboarding science and enterprise setup patterns, brd/source/addendum-onboarding/research/research-onboarding-patterns.md (sources accessed 2 October 2026) | Behavioural evidence, delegated setup, data import, configuration packs |
| S10 | Market research on AI-native onboarding and MCP for setup, brd/source/addendum-onboarding/research/research-ai-onboarding.md (sources accessed 2 October 2026) | AI setup builders, MCP write safety, risks seen in the market |
| S11 | OWASP Top 10 for LLM Applications 2025, genai.owasp.org/llm-top-10 (accessed 2 October 2026) | Threat classes and mitigations of Section 11 |
| S12 | EU AI Act, Article 50, artificialintelligenceact.eu/article/50 (accessed 2 October 2026) | Transparency duty; applicability to confirm (Q-16) |
| S13 | Option catalogue, brd/source/addendum-onboarding/option-catalogue.md | Options considered and their verdicts (Appendix C) |
| S14 | Third external review of 3 October 2026, review/metis-review-vong-3.md, and its disposition review/review-disposition-round3.md | The refinements merged into version 1.1 |

- **Source codes:** as in the main BRD, plus S7 to S14. Each market claim in S8 to S10 carries its URL and date or the mark [Unverified - confirm before applying]; this addendum quotes only verified claims, or keeps the mark.

## Contents

- [1. About This Addendum](#1-about-this-addendum)
  - [1.1 Why an addendum](#11-why-an-addendum)
  - [1.2 Decisions behind this addendum](#12-decisions-behind-this-addendum)
  - [1.3 Identifiers](#13-identifiers)
- [2. Executive Summary](#2-executive-summary)
- [3. Where Onboarding Time Goes](#3-where-onboarding-time-goes)
- [4. Goal, Users and Principles](#4-goal-users-and-principles)
  - [4.1 Goal and success measure](#41-goal-and-success-measure)
  - [4.2 Users and roles](#42-users-and-roles)
  - [4.3 Principles](#43-principles)
- [5. Scope, Assumptions and Constraints](#5-scope-assumptions-and-constraints)
  - [5.1 In scope for Release 1](#51-in-scope-for-release-1)
  - [5.2 After Release 1](#52-after-release-1)
  - [5.3 Assumptions](#53-assumptions)
  - [5.4 Constraints](#54-constraints)
- [6. The Onboarding Journey](#6-the-onboarding-journey)
  - [6.1 Steps](#61-steps)
  - [6.2 Facts pre-filled from the sales discovery](#62-facts-pre-filled-from-the-sales-discovery)
  - [6.3 The three executive questions](#63-the-three-executive-questions)
  - [6.4 Rules](#64-rules)
  - [6.5 A 30-minute session](#65-a-30-minute-session)
- [7. Functional Requirements: Module M23](#7-functional-requirements-module-m23)
  - [M23 Onboarding & Data Intake (ONB)](#m23-onboarding--data-intake-onb)
  - [7.1 MCP setup tool catalogue](#71-mcp-setup-tool-catalogue)
- [8. Business Rules](#8-business-rules)
- [9. Reading, Conversion and the Draft](#9-reading-conversion-and-the-draft)
  - [9.1 Pipeline](#91-pipeline)
  - [9.2 The Draft workspace is the draft](#92-the-draft-workspace-is-the-draft)
  - [9.3 Adopting in-flight projects](#93-adopting-in-flight-projects)
  - [9.4 Provenance and confidence](#94-provenance-and-confidence)
  - [9.5 One pipeline, two drivers](#95-one-pipeline-two-drivers)
  - [9.6 Rule-based path](#96-rule-based-path)
- [10. Questions, Delegation and Launch](#10-questions-delegation-and-launch)
  - [10.1 What counts as missing](#101-what-counts-as-missing)
  - [10.2 Ask, assume, default, delegate or defer](#102-ask-assume-default-delegate-or-defer)
  - [10.3 Question cards and the conversation panel](#103-question-cards-and-the-conversation-panel)
  - [10.4 Portfolio X-ray](#104-portfolio-x-ray)
  - [10.5 Delegation](#105-delegation)
  - [10.6 Approve and launch](#106-approve-and-launch)
  - [10.7 Effort budget](#107-effort-budget)
- [11. Guardrails and AI Policy](#11-guardrails-and-ai-policy)
  - [11.1 The boundary](#111-the-boundary)
  - [11.2 Hardening the MCP surface against tricks](#112-hardening-the-mcp-surface-against-tricks)
  - [11.3 Metis's own onboarding agent](#113-metiss-own-onboarding-agent)
  - [11.4 Proof before release](#114-proof-before-release)
  - [11.5 Data handling: the customer decides](#115-data-handling-the-customer-decides)
  - [11.6 The fixed reply to probing](#116-the-fixed-reply-to-probing)
- [12. Bring Your Own AI](#12-bring-your-own-ai)
  - [12.1 Who it is for](#121-who-it-is-for)
  - [12.2 How it works](#122-how-it-works)
  - [12.3 The prompt pack](#123-the-prompt-pack)
  - [12.4 Data, quality and safety on this path](#124-data-quality-and-safety-on-this-path)
- [13. Amendments to BRD v4.5](#13-amendments-to-brd-v45)
- [14. Data Model Additions](#14-data-model-additions)
- [15. Non-Functional Requirements and Integration](#15-non-functional-requirements-and-integration)
  - [15.1 Additions to Section 17 of BRD v4.5](#151-additions-to-section-17-of-brd-v45)
  - [15.2 Processing targets (proposed, to confirm with D-26 of BRD v4.5)](#152-processing-targets-proposed-to-confirm-with-d-26-of-brd-v45)
  - [15.3 Integration additions](#153-integration-additions)
- [16. Delivery](#16-delivery)
- [17. Decisions and Open Questions](#17-decisions-and-open-questions)
  - [17.1 Decisions](#171-decisions)
  - [17.2 Open questions](#172-open-questions)
- [18. Risks](#18-risks)
- [19. Acceptance Checklist and Onboarding Targets](#19-acceptance-checklist-and-onboarding-targets)
  - [19.1 Acceptance checklist](#191-acceptance-checklist)
  - [19.2 Onboarding targets (proposed, to confirm with the design partners in Discovery)](#192-onboarding-targets-proposed-to-confirm-with-the-design-partners-in-discovery)
- [Appendix A. Glossary Additions](#appendix-a-glossary-additions)
- [Appendix B. Wireframes](#appendix-b-wireframes)
- [Appendix C. Options Considered](#appendix-c-options-considered)
  - [C.1 Three approaches](#c1-three-approaches)
  - [C.2 Where the options landed](#c2-where-the-options-landed)
- [Appendix D. Market Evidence](#appendix-d-market-evidence)

# 1. About This Addendum

This addendum supplements BRD v4.5 without editing it. It specifies how a new client gets from nothing to a working Metis in 30 minutes of the main setup person's active effort, measured as Section 4.1 defines it, and what that changes in BRD v4.5. Its amendments are listed in Section 13; until a later release merges them, BRD v4.5 remains the baseline and this addendum prevails where it states an amendment.

## 1.1 Why an addendum

To use every capability of Metis, a client sets up a tenant, a workspace with its lifecycle and approvals, people and roles, and its existing projects and data. The second external review (S6) estimated 12 to 24 or more steps for tenant onboarding, 18 to 35 for workspace setup and 15 to 28 for each project. The product owner asked that any client be set up in 30 minutes, without slide tours and without a long wizard, and accepted AI that reads whatever the client already has (S7).

## 1.2 Decisions behind this addendum

Taken by the product owner on 2 October 2026 (S7):

- The 30 minutes measure the active effort of the main setup person until activation, the aha moment whose four parts and entry conditions Section 4.1 fixes.
- Whatever input the client has is read, converted and imported; what is missing is asked through automated questions or delegated to its owner.
- The users are mostly C-level executives with little time; any executive must understand the process at once and must not be pushed to give up.
- Metis builds no model and trains none. It calls a third-party LLM through an API, enabled by the customer; that AI talks to Metis's own MCP server (the Model Context Protocol interface of BRD v4.5, module M05) to create the records and runs the questions (D-32).
- The data belongs to the customer. Security protects the boundary: other tenants, Metis internals, roles and person-only decisions (Section 11).
- A second path gives prompts and guidance so that the client's own LLM sends the data (Section 12).
- Without the AI, rule-based importers remain the fallback for structured files (Section 9.6).
- Of three approaches considered (Appendix C), the design keeps "draft first", opens with a few questions to the executive and delegates the rest (Section 6).

## 1.3 Identifiers

New identifiers continue the numbering of the main BRD: module M23 with the requirement prefix ONB, business rules BR-43 to BR-53, decisions D-32 to D-39 and D-41 to D-43 (D-40 belongs to the main BRD, which defines the assignment selector of process framework nodes), open questions Q-14 to Q-19, assumptions A-08 to A-10, sources S7 to S14 and wireframes 46 to 57. Identifiers of the main BRD keep their meaning; the build of this addendum checks every reference against both documents.

# 2. Executive Summary

Enterprise portfolio tools take weeks to months to implement (Section 3). Metis aims at 30 minutes of the main setup person's active effort for a client that meets the entry conditions of Section 4.1, because its buyers are executives who will not fill in forms.

The design turns setup from filling in into confirming. The Metis team pre-fills what the sales conversations already established. The executive confirms three questions about their own view and decisions, then drops whatever the company already has: trackers, decks, handbooks, plans, org charts. A third-party LLM, enabled by the customer, reads them and builds the company as a draft, through Metis's own MCP server, inside a Draft workspace: portfolios, adopted in-flight projects, people with proposed roles, the approval flow and a Portfolio X-ray of the problems hidden in those documents. The executive sees their own cockpit after about 15 minutes, answers at most 10 one-tap cards, checks a dry run of the approval flow on three real projects and launches with one approval. Everything else goes to the right owners as pre-filled tasks, and launch never waits for them.

Every value keeps its source and a risk class, and a high-impact value is never assumed. Every role the launch would grant is shown as a proposal with the access it adds, and a privileged role is approved against the person's name. Nothing becomes live until a person approves it; launch can be undone for 14 days by default, and what an undo cannot remove is named before the approval. The customer's data is theirs to use through any admitted MCP client; the boundary around other tenants, Metis internals and person-only decisions is enforced by architecture and proven by three test suites on every release. Clients that keep the Metis AI switched off use their own AI through the same tools, or rule-based importers.

The addendum adds 40 requirements (27 for Release 1), 11 business rules, 11 decisions and 6 open questions, and amends the main BRD in 25 places (Section 13).

# 3. Where Onboarding Time Goes

| Layer | Who | What must exist | Steps estimated by the second review (S6) |
|---|---|---|---|
| Tenant | Tenant admin | Sign-in (SSO or password with MFA), verified domains, users, roles per workspace and project, AI access policy | 12 to 24 or more |
| Workspace | Workspace owner | Profile, option lists, team and roles, lifecycle with approvals, process frameworks, portfolio tree | 18 to 35 |
| Project | Project manager | Project record, charter, business case, budget, WBS, assignments | 15 to 28 per project |
| Portfolio data | Resource manager, finance | Capacity, allocations, budgets, risks | Not estimated |

- The four activation rules of WSP-14 are met by a starter template once the team is invited. The time goes into three things: a lifecycle that matches how the company really works, the right people with the right roles, and the data that sits in spreadsheets, decks and documents.
- Identity has its own clock: DNS domain verification can take up to 72 hours [Source: S9, Atlassian documentation, accessed 2 October 2026], and SSO needs the customer's IT. Neither belongs on the 30-minute path.
- Published PPM implementations take weeks to months, all as vendor claims: 2 to 6 weeks for Celoxis, 4 to 9 months for enterprise and 12 to 18 months for global rollouts for Planisware, and 6 to 12 months for traditional PPM against 2 to 4 weeks according to monday.com [Source: S8]. No PPM vendor reviewed claims a governed setup in under an hour [Source: S8].
- Microsoft retired Project Online on 30 September 2026; after retirement customers can no longer access their projects in the service [Source: S8, Microsoft 365 Message Center MC1478955 through a mirror, 24 September 2026]. PPM customers with exported plans need a new home now.

# 4. Goal, Users and Principles

## 4.1 Goal and success measure

- **Goal:** a client that meets the entry conditions below sets up its company in Metis in 30 minutes of the main setup person's effort, without slide tours and without a long wizard.
- **Activation, the aha moment, is one event** whose four parts must all hold in the same session: the workspace is Active with the company's own lifecycle published, at least one real person is invited, at least one real running project is adopted into the registry, and the executive cockpit shows at least one metric computed from the client's own data. Three of four is not activation.
- **Eligible session:** one onboarding session of a tenant that meets the entry conditions: the facts of 6.2 are pre-filled (A-10); the executive holds at least a project list in a supported structured file (A-09); AI processing is authorized, or the rule-based path is chosen, before the first file is read; and no sign-in dependency (single sign-on, domain verification, provisioning) sits on the path. Provider and test tenants are excluded by an explicit flag, never by name. Sessions outside these conditions are measured and reported, separately, and are not counted against the 30-minute target.
- **Five clocks, recorded separately** (ONB-26), because one number hides where the time went: active open time (the session open and in focus), elapsed time (first framing screen to the launch commit, by the wall clock), user input time, processing wait time (reading, parsers and AI calls) and external dependency time (anything owned by the customer's IT or by another person). The clock starts at the first framing screen and stops at the launch commit; closing the browser does not stop elapsed time, so a session cannot improve its figures by closing a tab while Metis reads.
- **The 30 minutes are the active open time** of the main setup person. The measure is met for a cohort when the share of eligible sessions whose active open time is at most 30 minutes reaches the threshold of 19.2, reported together with the median and the 75th and 90th percentiles. A median alone cannot show that a client reached it, so the claim this addendum makes is the share and the distribution, never the median by itself.
- Deeper data (detailed WBS, capacity, process frameworks) follows, split among the right owners, outside the 30 minutes.
- **Targets:** Section 19.2.

## 4.2 Users and roles

| User | Part in onboarding | Metis role |
|---|---|---|
| Executive (C-level) | Confirms the framing, drops the files, answers the cards, approves the launch | First tenant admin (TEN-01) and owner of the Draft workspace; Executive |
| Finisher | Named at launch (for example the head of the PMO); default owner of delegated items | Usually Portfolio Manager |
| Owners | Named in the documents: finance for budgets, HR for capacity, each project's PM | Their existing roles |
| Tenant admin | Authorizes AI processing for the tenant, sets masking, switches the setup tool group for external clients | Tenant Admin (often the executive at first) |
| Provider operator | Creates the tenant and records the facts and answers from the sales discovery; sees no business data | Provider Operator |
| Customer IT | Configures SSO, domains and provisioning after launch | Tenant Admin or a delegate |

The onboarding AI has no role of its own: it acts as the executive, within the setup tool group (MCP-04).

## 4.3 Principles

These principles join the UX principles of BRD v4.5, Section 4.5.

| Principle | Why |
|---|---|
| Show before you ask | The executive sees their own portfolio, built from their files, before answering anything; the AI setup builders reviewed all preview a draft before committing it [Source: S8, S10]. |
| Never ask what can be read | Every value read from a document keeps its source; only uncertain or contradictory values become questions [Source: S9, S10]. |
| Pre-select the best guess, and say where it came from | Defaults shift choices (meta-analysis of 58 studies, d = 0.68), so every pre-filled value names its origin (from the sales discovery, from the starting pack, from a named document) and can be changed in one click; the number of fields matters more than the number of steps in checkout flows [Source: S9]. |
| Start part-done, keep it short, let them resume | A head start on progress raised completion from 19% to 34% in a field experiment; 72% of three-step tours were completed against 16% of seven-step tours (vendor data) [Source: S9]. |
| Ask the right person, not the executive | Nominate, approve and auto-approve at a deadline is used in HR software such as Lattice and Culture Amp; if-then plans raise follow-through (d = .65) [Source: S9]. |
| Ask irreversible things first | ServiceNow warns that the fiscal calendar type cannot change after funds are allocated [Source: S8]. |
| Nothing is live until a person applies it | Plan, review, then apply is the market norm for AI-built configuration [Source: S10], and it matches BR-35. |
| Everything can be undone for a while | Imports can be undone within a window in HubSpot and Linear [Source: S8, S9]. |
| Ask outside-in | Executive questions are about their own view, the decisions they keep and what they need to know; Metis derives the structure. How the company operates comes from the documents or the PMO (S7). |
| Numbers come from the client's data | Amounts and percentages differ per client, so a question never carries one; Metis computes a boundary from the client's data and shows it as a consequence to confirm (S7). |
| Show progress as outcomes, not as a stopwatch | A visible timer turns a promise into pressure, and progress research shows the effect depends on shape and context [Source: S9], so the screens show what is done ("34 projects found", "governance rehearsed") and that the session is saved and resumable; the clocks run in telemetry instead (ONB-26). |
| Review by exception | The executive reviews what needs a decision, not every row: adoption and launch lead with the conflicts, the access changes and the high-impact values, with the rest collapsed behind a count (ONB-10, ONB-15). |

# 5. Scope, Assumptions and Constraints

## 5.1 In scope for Release 1

The P0 requirements of module M23, ONB-01 to ONB-27 (Section 7): onboarding session; facts pre-filled from the sales discovery; three framing questions; intake of any supported file; exact parsers before AI; the onboarding agent; the MCP setup tool group; provenance and confidence; the Draft workspace as the draft; adoption of in-flight projects; gap engine; question cards and conversation; Portfolio X-ray; dry run and decision boundary; launch with one approval; undo window; delegation; suggestions after launch; questions at the moment of need; rule-based path; bring-your-own-AI path; AI processing authorization and data handling; boundary hardening of the MCP surface; agent guardrails; assurance suites; onboarding metrics; starting packs.

## 5.2 After Release 1

The P1 requirements, ONB-28 to ONB-40: voice; forwarding address; cloud folder; directory read; board pack reproduction; walkthrough of the client's portfolio; pre-boarding from the sales cycle; IT setup link and domain capture; import into an Active workspace; setup party and overnight completion; human concierge mode; MCP prompts and preview in the client's AI; configuration suggestions from usage.

## 5.3 Assumptions

| ID | Assumption | Impact if wrong |
|------|------------------------------------------------------------|----------------------------------|
| A-08 | An LLM provider meeting the criteria of D-33 (contractual no-training, zero or short retention, regional processing, a data processing agreement, model version pinning) is available for Release 1. | Tenants that refuse the available terms use the rule-based path or their own AI (Sections 9.6, 12). |
| A-09 | Executives hold at least a project list in a spreadsheet or a slide deck; the design partners' documents represent typical inputs (Q-14). | More cards and owner tasks; the aha moment moves later. |
| A-10 | Provider operators capture the pre-filled facts and answers during the sales discovery of the sales-led model (D-27). | The executive states the facts and answers the three questions from scratch, still within the framing step. |

## 5.4 Constraints

- Person-only decisions stay as in BRD v4.5: approvals, decisions, baseline application, deletions, permission and token changes need a person in the application (BR-35).
- Tenant isolation applies to every onboarding data path (TEN-02, BR-33).
- Provisioning is sales-led in Release 1 (D-27).
- Scope follows business need and is not reduced to fit team size (A-07).
- Metis still neither hosts nor trains an LLM; D-32 narrows the out-of-scope line of BRD v4.5, Section 5.2, for onboarding only.

# 6. The Onboarding Journey

## 6.1 Steps

| Step | What the executive does | What Metis does | Design target |
|---|---|---|---|
| Frame | Confirms the pre-filled facts and the pre-selected answers to the three questions, changes any of them, or says one sentence instead | Sets the scope, the starting pack, the portfolio grouping, the decision routing and the home view; tells the executive which files help most | Under 1 minute |
| Drop | Drops files, pastes, forwards or records a voice note (voice and forwarding are P1) | Starts reading at once; a live feed shows each file's state, and the first signal from the client's own data appears as soon as one source is read (ONB-13) | 2 to 5 minutes |
| Ask while reading | Answers the cards that appear: irreversible settings, contradictions, launch blockers | Applies ask, assume, default, delegate or defer per item; keeps the cap (10 cards by default) and never assumes a high-impact value | Overlaps with reading |
| Draft | Sees their own cockpit, registry and approval flow as a draft, plus the Portfolio X-ray | Runs the dry run of the approval flow on three real projects | Around minute 15 |
| Approve and launch | Reviews the outcomes reached, then the exceptions: the access changes by role and by name, the unconfirmed values by risk class, the load per owner and what the undo covers; names who finishes the rest; approves once | Publishes the lifecycle, adopts the projects, activates the workspace, grants the approved roles, sends invitations, dispatches owner tasks | By minute 30 |
| Delegate the rest | Nothing, or reassigns an owner | Sends pre-filled tasks with due dates; asks at the moment of need later | Days, not executive time |

On screen the executive sees four steps: Frame, Drop (reading and the first cards), Draft (the remaining cards, the approval flow and the projects to adopt) and Launch; delegation runs after launch.

## 6.2 Facts pre-filled from the sales discovery

In Release 1 the provider operator creates the tenant (TEN-01) and records these facts from the sales conversations, together with the answers to the three questions of 6.3 when the sales discovery gave them; the executive confirms them in one tap or changes any of them (ONB-02).

| Fact | Example (wireframe 46) | What it sets |
|---|---|---|
| Scope | All of Nova Energy | Workspace boundary and number of workspaces |
| Main kind of work | Engineering, construction and capital projects | Starting pack (ONB-27), MVP objects on or off (MVP-04) |
| Reporting currency | EUR | Irreversible settings, confirmed first |
| Fiscal year | January to December | Irreversible settings, confirmed first |

## 6.3 The three executive questions

The wording asks about a decision the executive already makes, not about a preference: "look at" was replaced because it can mean grouping, ownership or reporting, "how involved" because it mixed authority with personal taste, and "every morning" because it presets a cadence the product does not impose.

| Question | Answers offered, in the executive's voice | What Metis derives |
|---|---|---|
| When you review the portfolio, what grouping helps you make decisions fastest? | By business unit or subsidiary; by product or service; by client; by strategic objective; by market or region; "Suggest one from my documents" | Portfolio and program levels (BRD v4.5, Section 7.1), cockpit grouping, roadmap lanes |
| Which project decisions should come to you personally? | "Every project before it starts, and any major change"; "Only the big or strategic projects; my team handles the rest"; "Our executive committee decides together; I am one member"; "Only the exceptions that need me"; "Use the rules in our governance documents" | Approvers per approval point and whether a committee with a quorum is used (GOV-03, GOV-05); a rule routing big or strategic projects to the executive (GOV-06), with the boundary computed from the client's data (ONB-14); the executive's place in My approvals (OVW-09) or only in the attention queue (EXE-02); routing of major changes (CHG-10, raised to P0 in Section 13) |
| When you open Metis, what should you see first? | Where the money goes and whether it matches our priorities; which projects may slip or overrun; whether we have the people for what we committed; what is waiting for my decision | Home view and cockpit order; which data Metis reads and asks for first; which freshness thresholds are set first (BRD v4.5, Section 12.5) |

The mapping from each answer to the configuration it sets is one versioned table, owned with the starting packs (D-36) and recorded on the session (ONB-03), so two sessions that answered the same way produce the same configuration and a later change to the mapping is traceable. The second question is the one that moves governance, so the selected answer states its consequence in one line, for example "Projects above the boundary Metis computes from your data will wait for your approval", before the executive moves on. One sentence may replace the three, offered as "or describe it in your own words", for example: "I want to see it by subsidiary, I only decide the big bets, and I want to know what is about to slip." At launch Metis asks "Who will finish the rest for you?", suggesting a person from the documents; that person becomes the default owner of delegated items.

## 6.4 Rules

- **Ask outside-in** and **no preset numbers or cadences in questions** (Section 4.3). Without budget data, the boundary of big projects goes to the data owner as a delegated item, and launch proceeds with "strategic projects only" as the assumed rule.
- **At most three framing questions**, one tap each, each with "let Metis work it out", on the same screen as the drop zone.
- **Questions appear while reading**, irreversible and launch-blocking items first.
- **The card cap is a ceiling, not a quota.** It limits what reaches the executive; it is never a number of cards to fill, and the counter says how many are resolved and how many can be delegated or left flagged (ONB-11).
- **Launch never waits for a delegated answer.** What launch needs is answered by the executive, assumed with a visible badge, or set to a safe default; owners confirm or correct after launch.
- **A high-impact value is never assumed** (identity and access, baseline budget and dates, approvers and quorum, settings that cannot change later): it is confirmed, delegated to a named owner, or left blocking the launch (BR-52).

## 6.5 A 30-minute session

The wireframes follow one illustrative session (sample data, not a measurement): it shows that the path can be walked in the time, not how the time is distributed across clients, which only the pilot measures (19.2). Nova Energy (the tenant created in wireframe 07) is set up on 5 October 2026 by its COO, Rosa Okafor:

| Time | Event | Wireframe |
|---|---|---|
| 0:00 to 0:48 | Rosa confirms the four pre-filled facts and the three pre-selected answers | 46 |
| 0:48 to 4:00 | She drops seven files: the portfolio tracker, the PMO handbook, the ExCo pack, the Capex plan, the org chart, an MS Project schedule and a zip of twelve status reports | 46, 47 |
| 2:10, while the drop continues | The first signal appears: 34 projects found, 3 budgets conflicting, 7 without a sponsor, each figure opening its source | 47 |
| 4:00 to 14:00 | Metis reads; she answers six cards and three go to owners | 47 |
| 14:00 | The draft cockpit shows 34 projects in 4 business units, EUR 214.6M; the X-ray finds eight kinds of problem | 48 |
| 14:00 to 24:00 | She checks the approval flow and its dry run, changes one approver in the conversation and leaves the last cards open, so their values stay assumed; 14 projects will come to her; 34 projects will be adopted, 21 of them committed | 49, 50, 51 |
| 24:00 to 27:00 | She names Sam Varga to finish the rest and approves the launch | 52 |
| Days after | 31 items go to 6 owners, due 12 October 2026; 12 are closed by 7 October | 53 |

# 7. Functional Requirements: Module M23

## M23 Onboarding & Data Intake (ONB)

Purpose: take a new client from nothing to a working workspace in 30 minutes of the main setup person's effort (Section 4.1). Metis reads whatever the client already has, builds the company as a draft in a Draft workspace, asks only what it cannot read, launches with one approval and hands the rest to the right owners. Requirements marked P0 belong to Release 1, as in BRD v4.5; P1 follows.

Wireframes: 46-onboarding-frame, 47-onboarding-reading, 48-onboarding-draft-cockpit, 49-onboarding-approval-flow, 50-onboarding-questions, 51-onboarding-adoption, 52-onboarding-launch, 53-onboarding-owner-tasks, 54-onboarding-rule-based, 55-onboarding-own-ai, 56-tenant-admin-ai-onboarding, 57-provider-onboarding.

| ID | Requirement | Acceptance criteria | Pri | Source |
|--------|------------------------------------------------|------------------------------------|------|--------------|
| ONB-01 | **Onboarding session.** Each new tenant starts with one onboarding session for its first workspace, created at provisioning (TEN-01) or by a tenant admin. The session holds the pre-filled facts, the framing answers, the inputs and their source fragments, per-field provenance, questions, delegated items, X-ray findings, the provider and model version of the onboarding AI, the batch ID stamped on every record it creates, and the timing events of Section 4.1. It is resumable until launch and stays open after launch for delegated items, suggestions and the undo window. Resuming works from another device after sign-in: an interrupted upload resumes or repeats under the same idempotency key (PLT-06) without creating a second record, reading and AI calls continue on the server while the session is closed, and reopening shows the exact state of every file and job. | (1) Signing in again after closing the browser reopens the session at the same step with nothing lost. (2) Every record created by the session carries its batch ID. (3) A session that used the onboarding AI shows the provider and model version it ran on. (4) Closing the session while files are being read leaves the reading running on the server; reopening on another device shows each file's state and no project is duplicated. (5) The session's events yield active open time, elapsed time, user input time, processing wait time and external dependency time separately (ONB-26). | P0 | S7; WSP-14; PLT-06 |
| ONB-02 | **Facts pre-filled from the sales discovery.** When creating the tenant, the provider operator records scope, main kind of work, reporting currency and fiscal year and, when the sales discovery gave them, the answers to the three framing questions (ONB-03); the executive confirms them in one tap or changes any of them. The main kind of work sets the starting pack (ONB-27) and the MVP objects on or off (MVP-04). The operator may also pre-select the onboarding AI; it stays off until a tenant admin authorizes AI processing for the tenant (ONB-22). | (1) A tenant created with pre-filled facts opens the framing screen with those values selected and labelled "pre-filled by the Metis team". (2) Currency and fiscal year are confirmed before any value is imported. (3) A pre-selected onboarding AI sends no customer content to the LLM provider until a tenant admin authorizes AI processing. | P0 | S7; TEN-01; D-27; S8 |
| ONB-03 | **Three framing questions, asked outside-in.** The executive answers, or confirms pre-selected answers to, three questions in the words of Section 6.3: which grouping helps them review the portfolio fastest, which project decisions should come to them personally, and what they should see first when they open Metis. No question presets a cadence, an amount or a percentage. One sentence may replace all three, offered as "or describe it in your own words" rather than as a fourth option of equal weight. Each answer maps to configuration through a versioned mapping table (Section 6.3), and the screen states the consequence of the selected answer, not only a picture of the home screen. | (1) The framing screen shows exactly three questions, none containing a number or a cadence, each skippable and each selected answer stating its consequence in one line, on the same screen as the drop zone. (2) A one-sentence answer sets the same values as the three questions. (3) The answers set the portfolio levels, the approval routing and the home view through the mapping table of Section 6.3, whose version is recorded on the session. | P0 | S7 |
| ONB-04 | **Drop and paste anything.** One drop zone accepts many files, folders and zip archives of the supported types (spreadsheets, CSV, Word, PDF, PowerPoint, MS Project MPP and XML, images, saved emails) and pasted text or tables. Uploads are scanned (PLT-07) and limited per plan (TEN-05) and by the caps of ONB-24 on size, pages, archive expansion and nesting. The drop zone lists the files that help most for the executive's answers; the reading feed shows each file's own state (queued, reading, read, partly read, failed) and what it yielded. A failure names its reason in the user's words with a retry or conversion hint and never stops the other files; a partly read file states how far it got and what was kept. An estimate of the time to the draft is shown only once telemetry calibrates it; until then the feed shows progress per file (ONB-26). Images are read by the provider's vision service once AI processing is authorized (ONB-22); without it they are listed but not read. | (1) A zip of mixed supported files is accepted in one drop and each file appears in the reading feed with its own state. (2) An unsupported or oversized file is listed with its reason and a next step and does not stop the others. (3) A corrupt or password-protected file shows its reason and its hint, the other files finish, and the draft is built from what was read. | P0 | S7; S8; PLT-07 |
| ONB-05 | **Exact parsers before AI.** Structured inputs are read by rule-based parsers: spreadsheet cells with formatting and colours, CSV, MS Project XML and MPP, exports from Project Online, Jira, Asana, Smartsheet and monday.com, Word and PDF text with OCR for scans, PowerPoint text and tables, saved emails (message text and attachments). The LLM handles only ambiguous mappings and unstructured content. | (1) An MS Project or Project Online export becomes WBS items with dates and dependencies without an LLM call. (2) A red, amber or green cell in a tracker becomes the project's declared health. | P0 | S7; S8; S9 |
| ONB-06 | **Onboarding agent.** When the tenant has authorized AI processing (ONB-22), a third-party LLM called through an API (D-32) reads source fragments as quoted data, maps them to Metis records, resolves the same project or person written differently across files, detects contradictions, matches the operating model against the starting packs (ONB-27) and raises questions while reading. A proposed match carries the evidence it rests on (which fields agreed) and its confidence band; a match that rests on a person's name alone, or that has more than one candidate inside the band, becomes a question naming every candidate instead of a merge, and identity is never merged silently. The agent is one more client of the MCP server: it writes only through the setup tool group (ONB-07), with a short-lived onboarding token bound to the executive, the tenant and the Draft workspace. Metis builds no model and trains none. | (1) A project named differently in two files becomes one record that lists both sources and the fields that agreed. (2) The first question or finding appears while files are still being read (Section 15.2). (3) A write by the agent outside its Draft workspace is refused. (4) Two people with the same name, or two projects that differ only by a similar name, stay separate and raise one question naming both candidates. | P0 | S7; D-32; S10; BR-43 |
| ONB-07 | **MCP setup tool group.** A prepare-only tool group on the tenant's MCP server (Section 7.1) writes proposals into a Draft workspace and its onboarding session; it never writes into an Active workspace and never publishes, activates, invites or grants roles. Its confirmation boundary is the launch transaction (ONB-15) rather than a link per call, which the tool catalogue records as the policy value `confirmation_mode = batch_launch` (Section 7.1, MCP-19). Each proposal carries source references, a confidence per field and an idempotency key (PLT-06); validation errors are written so that an LLM can correct itself. Every payload is validated against a published JSON schema with enumerations and identifier allow-lists, unknown fields are rejected, and the objects per call and per session are capped (ONB-24); the tenant and workspace of a write are derived on the server from the token and never read from the call. The group is off by default for external clients and switched on by a tenant admin (MCP-20). | (1) A setup call never changes an Active workspace: after launch a call carrying a source is stored as a suggestion in the session (ONB-18), and a call outside the workspace its token is bound to is refused. (2) Repeating a call with the same idempotency key changes nothing a second time. (3) A proposal without a source reference, or citing a source that is not in the session, is rejected with a message naming the missing field or the unknown source; on the bring-your-own-AI path a source reported in the call (file name, location, quoted passage) is first recorded in the session as reported by your AI (Section 12.4). (4) A call with an unknown field, a tenant or workspace identifier of its own, or more objects than the cap is rejected with the field named and writes nothing. | P0 | S7; S10; MCP-08; MCP-19; BR-35 |
| ONB-08 | **Provenance, confidence and risk class.** Every value created by onboarding keeps its source (file, location, quoted passage), a confidence band (high, medium, low), a status (read, assumed, default, confirmed, asked, delegated, conflicting) and a risk class. High impact covers identity and access, baseline budget and dates, approvers and quorum, and settings that cannot change later; the full list is D-42 and everything else is normal. A confidence band only routes a value to ask, assume, default or delegate; it is never evidence that the value is right, and a high-impact value is never assumed or defaulted on confidence alone (BR-52). High-confidence values show their source on hover; medium values carry a "check" badge, and a normal "check" value still unconfirmed at launch counts as assumed; low and conflicting values become questions; assumed and default values keep their badge until confirmed and, after launch, appear in the responsible owner's attention list; the executive's attention queue (EXE-02) shows the assumed values as one item per owner, with the number still to confirm, together with that owner's overdue delegated tasks (ONB-17), until they are confirmed. The numeric cut-offs of the bands are tuned in Discovery, and a correction after launch is counted per record type as the accuracy signal (ONB-26). | (1) Opening any figure of the draft cockpit shows the file and passage it came from in one click, and states whether it was read, assumed or defaulted. (2) Every value created by onboarding shows a source, or an assumed or default label (BR-45). (3) After launch, an assumed value awaiting confirmation appears in the responsible owner's attention list and is counted, together with that owner's overdue delegated tasks (ONB-17), in that owner's item of the executive's attention queue (EXE-02) until someone confirms or changes it. (4) A high-impact value is never applied as assumed or default: it is confirmed by the executive, delegated to a named owner, or left blocking the launch, and the launch summary states which. | P0 | S7; S10; D-42; BR-52 |
| ONB-09 | **The Draft workspace is the draft.** Onboarding writes into a workspace in Draft (WSP-05), which only owners and admins can open: option lists, portfolio tree, a lifecycle draft version (GOV-19 to GOV-21), adopted projects (ONB-10) and member records with proposed roles. Invitations and role grants wait for launch. "Start over" deletes every record the session's batch created in the Draft workspace; the audit log and the session's inputs remain. | (1) Before launch, a member of the tenant does not see the workspace in the switcher. (2) Start over removes every record the batch created in the Draft workspace; the audit log and the session's inputs remain. | P0 | S7; WSP-05 |
| ONB-10 | **Adopt in-flight projects.** A running project is adopted at its current stage, read from the documents or asked. Earlier stages are recorded as completed before Metis with their source and get no gate decision (BR-46). A budget or a date counts as approved only on a source authority (BR-53): a document class the client names as authoritative (a board or investment committee pack, a signed contract, an approved budget sheet), carrying an approval marker, its date and, where the document states it, the approver. Confidence alone never makes a value approved, and two authoritative sources that disagree become an exception for the executive rather than a choice the model makes. A project whose documents show an approved budget and dates on such an authority is adopted as committed, with a baseline captured at launch from the imported values and labelled "from import" (BR-47); the others stay uncommitted with advisory change control (BR-04). The declared status is kept as the last known status with its as-of time; Section 12 metrics of BRD v4.5 show "not available yet" until a plan is imported (BR-39). A project adopted as committed without an owner or a sponsor is not blocked: the gap becomes a delegated item and an attention item until the person is named (BR-01; Section 13, CHR-17 row). | (1) A project adopted in Execute shows the earlier stages as completed before Metis, each linked to its source, with no gate decision. (2) A committed adopted project has a baseline labelled "from import", and editing a locked value asks for a change request. (3) The Decision Log holds one adoption entry per project naming the approving executive, the source authority of the baseline with its date, and the exceptions still open at launch. (4) A budget or date read from a document that carries no approval marker does not make a project committed: it becomes an exception on the adoption review. | P0 | S7; CHR-17; CHG-06; BR-04; BR-53 |
| ONB-11 | **Gap engine.** The session checks the Draft workspace against five rule sets (activation, publish check, adoption, the executive's answers, feature data) and gives each gap one treatment: ask the executive, assume with a badge, set a safe default, delegate to an owner, or defer to the moment of need. The executive sees at most 10 cards in the 30-minute path (a product setting, 10 by default; a bulk or contradiction card counts as one), ordered: irreversible settings, launch blockers, what the chosen home view needs, the rest. The cap is a ceiling on what reaches the executive, never a number of cards to produce: the card count shown states how many are resolved and how many can be delegated or left flagged. A high-impact gap (ONB-08) is never pushed past the cap into an assumption: it is asked, delegated to a named owner, or listed as a launch blocker. | (1) No more than the configured number of cards reach the executive; every other gap is listed on the launch summary with its treatment. (2) Launch never waits for a delegated answer. (3) A high-impact gap beyond the cap becomes a delegated item with a named owner or a launch blocker, never an assumption. | P0 | S7; S9 |
| ONB-12 | **Question cards and conversation.** A card asks one question in business words with Metis's best guess pre-selected and its quoted source, alternatives, "Use this" and "Ask someone". Bulk cards confirm matched items and list the exceptions; contradiction cards show both sources side by side. A conversation panel takes free answers and states what it changed. | (1) Accepting a card's guess marks the value as assumed by the executive, with the card's source, except a value only the executive knows (Section 10.2, Ask the executive), which is confirmed. (2) "Ask someone" creates a delegated item for the suggested owner (ONB-17). (3) A free answer in the conversation makes the same change as the matching card. | P0 | S7; S8 |
| ONB-13 | **Portfolio X-ray and first signal.** While reading, Metis lists findings from the client's own documents: missing accountability, no strategic link, conflicting figures, slipped dates, possible duplicates, overloaded people, stale status and suspicious content, each with its sources and a suggested owner. As soon as the first supported source is read, a first-signal strip states what has been found so far from the client's own data, for example the number of projects, the conflicting budgets and the missing sponsors, each figure opening its source; it does not wait for the draft to be complete. At launch every open finding becomes an attention item (EXE-02). | (1) A budget that differs between two files appears as a conflicting-figures finding citing both. (2) After launch every open finding is in the attention queue with its owner. (3) The first-signal strip appears while files are still being read, with at least one figure from the client's data and its source link. | P0 | S7 |
| ONB-14 | **Dry run and the decision boundary.** Before launch the drafted approval flow runs on three adopted projects chosen to exercise the most rules (the largest by budget, one routed to the executive, one typical), showing who approves each point, whether the named approvers can reach the quorum and which documents become mandatory. When the executive decides only big or strategic projects, Metis computes the boundary from the client's data and shows it for confirmation. Without budget data, the boundary goes to the data owner as a delegated item and launch proceeds with "strategic projects only" as the assumed rule. | (1) A quorum the named approvers cannot reach is shown as a failure with its fix. (2) With budget data, the boundary appears as a consequence of the data (number of projects, share of the budget, starting amount) and is never asked as a number. (3) For a client with a project list and no budget data, the boundary is a delegated item for the data owner and launch proceeds with "strategic projects only" as an assumed rule. | P0 | S7; S8; GOV-21 |
| ONB-15 | **Launch summary and single approval.** One page leads with the outcomes reached (a workspace with the company's lifecycle, real people, the adopted projects, live metrics) and then the exceptions that need the executive, in this order: the access changes, the values still unconfirmed grouped by risk class (ONB-08) and never as one undifferentiated count, the load per owner, and the scope of the undo. The readiness results carry a one-click fix per failure, and the technical transaction is one expandable view rather than the lead. Every role the launch will grant exists first as a proposed role grant on the session, with its source, the person it is for and the difference between that person's current and proposed access; standard team roles are approved in bulk, while a privileged role (D-41) is listed by person and approved by name (BR-51). One "Approve and launch" by the executive (first tenant admin and owner of the Draft workspace) runs in one transaction: re-run every check and re-check every proposed grant against the permission matrix on the server; publish the lifecycle, with the AI as author and the executive as reviewer (GOV-21); adopt the projects; activate the workspace (WSP-05); grant the approved roles and queue the invitations, sent only after the launch commits so that a rolled-back launch sends none (PLT-03); dispatch owner tasks and turn findings into attention items; record each step, each granted role and its approver in the audit log with channel "onboarding". | (1) If any check fails, nothing changes and the failing rule is named with its fix. (2) After success the workspace is Active, the lifecycle is published with the AI as author and the executive as reviewer, and the audit log shows each step and each granted role with the person who approved it. (3) If any step after the checks fails, the whole launch is rolled back and nothing changes. (4) A privileged role is granted only after the executive approves it against that person's name; approving the standard roles in bulk grants no privileged role, and a grant the permission matrix refuses at commit stops the launch. (5) An unconfirmed high-impact value blocks the launch until it is confirmed or delegated; normal unconfirmed values are listed by risk group with their owners. | P0 | S7; WSP-14; GOV-21; BR-35; BR-44; BR-51; D-41 |
| ONB-16 | **Undo window.** For a period after launch set per tenant (14 days by default, D-35), a tenant admin can undo the onboarding: records of the batch that nobody changed since launch are removed, and the others are listed and kept; a record counts as changed when its version moved after the launch commit, and the list names who changed it and when; an unchanged record that a kept record depends on is kept and listed with the reason; audit and Decision Log entries stay (PLT-11, CHG-11), and the undo itself is audited. What an undo cannot remove is named before the launch approval and in the undo screen: invitations already sent, a published lifecycle version a gate decision has used, a baseline a change request has since changed, and any record a person edited. | (1) An undo on day 3 removes the unchanged batch records that no kept record depends on, keeps and lists with the reason those a changed record depends on, and lists the changed ones with who changed them and when. (2) After the window the undo action is no longer offered. (3) Before approving the launch the executive can open the list of what an undo would not remove. | P0 | S7; S9 |
| ONB-17 | **Delegation to owners.** Items go to the person named at launch to finish the rest (the default owner) and to owners found in the documents, as tasks with pre-filled values and their sources, which the owner accepts singly or all at once, edits, reassigns or answers with "I don't know", with a due date and reminders; an item is closed when its owner accepts or corrects it. Correcting a value that a baseline from import has locked opens a change request with the correction and its source (BR-47); the item closes when the change request is raised. At the due date a normal value applied at launch is kept unchanged and badged "kept unchanged after the due date"; nothing else applies itself (BR-48), and a high-impact value is never kept this way: it escalates and stays unconfirmed (BR-52). Overdue delegated tasks escalate to the default owner, then to the executive's attention queue (EXE-02); the morning digest (PLT-10, P1 in BRD v4.5) carries the same line once it is enabled. Each owner's load, the age of their queue and their overdue items are measured (ONB-26), and an owner above the load threshold is flagged on the launch summary before the approval. Completion is reported as two figures that are never merged: the executive's launch is complete when the launch commits, and the follow-through is complete when every required delegated item is closed; items deferred to the moment of need (ONB-19) stay outside the follow-through denominator until their trigger fires. Channels in Release 1: in-app and email. | (1) A task accepted by its owner turns the value's badge into confirmed. (2) A normal task left past its due date keeps the launch value and stays in the default owner's attention list. (3) The bar on the executive's home is labelled as delegated follow-through, equals the share of required delegated items closed, and never claims that setup as a whole is complete. (4) An overdue delegated task goes to the default owner and then appears in the executive's attention queue in its owner's item (ONB-08). (5) A high-impact value left past its due date is not kept by default: it escalates and stays unconfirmed. | P0 | S7; S9; PLT-09; EXE-02; BR-52 |
| ONB-18 | **Suggestions after launch.** After launch the onboarding agent and MCP clients using the setup tool group write only suggestions (BR-43): a setup call that carries a source is stored as a suggestion in the onboarding session. Each suggestion names its source and is accepted by the responsible person, singly or in bulk. | (1) A suggestion never changes data before a person accepts it. (2) A bulk acceptance records the person and each accepted suggestion in the audit log. | P0 | S7; BR-35 |
| ONB-19 | **Questions at the moment of need.** A deferred item becomes a task when its trigger occurs: a feature used for the first time, or a project reaching an approval point where no person is named yet. An approval point never lacks approvers: until a person is named, the people holding the starting pack's role approve (shown as default), and the deferred item is naming that person; a role that nobody holds fails the publish check and the dry run and is fixed before launch (ONB-14). | (1) The first project to reach an approval point where no person is named creates a task for the workspace owner to name that person, and the people holding the starting pack's role approve meanwhile. (2) The first opening of deliverable process frameworks while none is set up creates the deferred task to set them up for the default owner (ONB-17). | P0 | S7; S9; GOV-21 |
| ONB-20 | **Rule-based path without AI.** With the onboarding AI switched off, structured inputs go through column-mapping screens (suggestions from header names, a kept-and-dropped report) that produce the same proposals; unstructured documents are listed but not read, which the screen states rather than implying the same breadth as the AI path; cards, launch and delegation work the same way. A mapping is saved per set of headers and offered again for the next file that matches, so a long mapping can be left and resumed. | (1) A tenant with the AI switched off sets up a workspace from a tracker spreadsheet and an MS Project file. (2) No content of that tenant reaches the LLM provider. (3) A saved mapping is offered for the next file with the same headers, and an interrupted mapping reopens where it stopped. (4) The screen states that handbooks, decks and other unstructured documents are not read on this path. | P0 | S7; S9 |
| ONB-21 | **Set up with your own AI.** A page extending the AI access page (MCP-15) offers: the tenant admin's switch for the setup tool group; an onboarding token limited to the setup tools and one Draft workspace, valid 7 days by default and never beyond the tenant maximum (MCP-20); the connection test; copy-ready prompts; a live feed of what the client's AI proposes. The first call, `get_setup_context`, returns the framing answers, the starting pack, the schemas, the order of work, the rules and the session's open questions, so prompts stay short. Launch happens only in Metis. Clients that pass Metis's onboarding test scenario carry a "verified for onboarding" mark. Switching AI processing off or revoking the token blocks the next tool call at once; a call already in flight may return its result, but every staged write re-checks the token and the tenant policy at the moment it commits and is refused when either has changed. | (1) A verified client sets up a Draft workspace from the prompt pack alone. (2) The client can neither launch, invite nor grant roles. (3) The onboarding token is refused after it expires. (4) After a revocation or an AI switch-off, the next setup call is refused and a write already in flight is not committed. | P0 | S7; S10; MCP-02; MCP-15 |
| ONB-22 | **AI processing authorization and data handling.** No customer content reaches the LLM provider before a tenant admin authorizes AI processing for the tenant on a screen that names the provider and region, what is sent, the provider's contracted no-training term and retention, what Metis keeps and how to switch off. This authorization is a product setting, not by itself a legal basis for processing personal data: the data processing agreement, the privacy notice and the lawful basis sit outside the product, and the screen says so and links to them (Q-16). Masking covers the fields a tenant names and, in unstructured text, the content classes a scanner finds (personal identifiers, payment and bank details, credentials and secrets, and any class the tenant blocks under D-43); the screen states that detection is imperfect and that a tenant can block whole classes instead of relying on it. The LLM provider and any speech or vision service are on the published sub-processor list (BRD v4.5 Section 17), and the provider and model version are recorded per session (ONB-01). Deleting the inputs is offered as two named actions (D-38): "delete the original files" removes the stored binaries and keeps the provenance metadata and the quoted passages; "delete the source content" removes the binaries, the extracted text and fragments and the quoted passages, leaving each record its source identifier, a hash and the mark "source removed", as far as the audit retention of D-34 and the backup purge period of BRD v4.5 Section 17 allow, which the screen states. The agent always presents itself as AI, and every record it proposed shows "proposed by AI, approved by" the person. | (1) Before authorization, a dropped file is read by the exact parsers only. (2) While masking is on, a salary column and a bank account number written in a slide are both masked in what is sent. (3) Every AI-proposed record shows its AI origin and its approver. (4) After "delete the original files" the binaries are gone from tenant storage and each source link keeps the file name and the quoted passage; after "delete the source content" no quoted passage or extracted fragment remains and each record shows "source removed" with its hash. (5) Neither action claims to remove what audit retention or a backup purge period still holds; the screen names what remains and until when. | P0 | S7; S12; BR-49; D-38; D-43; BRD v4.5 Section 17 |
| ONB-23 | **Boundary of the MCP surface.** No response on any channel reveals another tenant's data or existence, or Metis internals (BR-50): identifiers are opaque; "not found" and "no access" give the same answer; there is no generic query, search-anything or execute tool; no tool fetches an address supplied by a client; errors carry a category and a fix, never a stack trace, a query or an internal name; tool names, descriptions and schemas are static and versioned (MCP-09). The side channels are closed with the payload: a missing record and a record in another tenant return the same status code, the same error envelope, a comparable payload size and a response time in the same band; search indexes, caches, queues and job status are partitioned per tenant; and identifier enumeration is rate limited per token and per tenant (MCP-12). | (1) The boundary suite (ONB-25) passes with zero findings. (2) A guessed identifier of another tenant and a non-existent identifier get the same status, the same envelope and a response time in the same band. (3) No search, cache, queue or job-status path returns an entry of another tenant, each covered by its own negative test (TEN-02). | P0 | S7; S11; TEN-02; MCP-12; MCP-13; MCP-16 |
| ONB-24 | **Onboarding agent guardrails.** The agent's context holds no credentials, hostnames, provider keys, database names, permission structure or authorization rule: every control that decides what may be read or written lives in code on the server, never in a prompt. Reading runs as three stages that code outside the model keeps apart (Section 9.1): extraction, where the model sees document text as marked data and holds no tool that writes, fetches or reads another record; validation, where Metis checks each proposed record against its schema, its cited sources and the permission matrix; and writing, where a deterministic orchestrator calls the setup tools. Text that reads like an instruction is quarantined with its source and reported as a Portfolio X-ray finding rather than deleted, so a governance rule written in the imperative is not lost, and no document text ever changes a tool, a permission, a policy or the order of work. The agent answers anything about the customer's data that the executive may see and refuses only Metis internals, other tenants and unrelated requests, with one fixed reply (Section 11.6). Code outside the model screens every reply for canary strings, key formats, internal hostnames and other tenants' names; replies are rendered as text, never as markup, and no reply becomes a query, a path or an address. Repeated probing slows the session and notifies the tenant admin. Caps apply per onboarding on files, size, pages, archive expansion ratio and nesting depth, tokens, AI calls and parallel jobs and, once voice is enabled (ONB-28), audio minutes; retries are bounded with exponential backoff, the session can be cancelled, a repeated file is recognized by content hash and not paid for twice, and a provider spend cap applies per tenant with an alert before the cap (TEN-10). Every AI call, tool call, refusal and security event is written to the tenant audit log (MCP-11, PLT-11); what is kept follows D-34. | (1) Asking for the system prompt, the database tables or other customers returns the fixed reply. (2) A reply containing a canary string is blocked and recorded as a security event. (3) At the spend cap, AI reading stops with a clear message and the rule-based path keeps working. (4) An AI call and a refused probe each appear in the tenant audit log with the session they belong to. (5) An instruction hidden in a document changes no tool, no permission and no value: it appears as a quarantined finding with its source, and the surrounding content is still read. (6) A retry storm, an archive that expands past its ratio and a file dropped twice each stop at their cap with a message, and the session continues. | P0 | S7; S11 |
| ONB-25 | **Assurance suites as release gates.** Three suites run on every release and on every change of model, provider or prompt, and fail the release on any finding, or, for the accuracy suite, on a result below its threshold. Boundary suite: cross-tenant probing with a second test tenant, identifier enumeration, access beyond role for each role of the permission matrix, parameter fuzzing, server-side fetch attempts, inspection of error messages, rate limits. Agent red-team suite: direct injection, injection hidden in each supported file type, prompt extraction, multi-turn and role-play jailbreaks, attacks in Vietnamese and other languages, spend exhaustion. Extraction-accuracy suite: precision and recall per record type against reference documents extracted by a person, with the threshold of D-39. The accuracy corpus is owned by the product team, versioned, and covers the file types of Q-14 and the languages of Q-15; a release records the provider, the model version, the prompt version and the versions of the parser and OCR dependencies it was tested on, with a dependency and licence scan of that chain, and a change to any of them re-runs the three suites. A starting-pack update is treated as a change of input and runs the red-team suite against a deliberately poisoned pack fixture. | (1) Each suite's report is kept as release evidence, and the tenant admin sees the latest results. (2) A release with one leak, one write outside a Draft workspace and its onboarding session, one person-only action taken by the AI, or accuracy below the threshold is blocked. (3) The release evidence names the provider, model, prompt and parser dependency versions, and the corpus version, that each suite ran against. (4) A poisoned starting pack changes no tool, no permission and no high-impact value. | P0 | S7; S11; TEN-02; Q-14; Q-15 |
| ONB-26 | **Onboarding metrics.** The session emits events, and every metric below is derived from them, never from one clock. **Activation** is one event: the launch committed, the workspace is Active, at least one real person was invited, at least one real running project was adopted and the cockpit holds at least one metric computed from the client's own data, all in one onboarding session; its denominator is eligible sessions started (Section 4.1), with provider and test tenants excluded by an explicit flag rather than by name. **Time** is five clocks recorded separately: active open time, elapsed time, user input time, processing wait time and external dependency time; `first_value_at` (the first source-backed figure or finding shown to the executive) and `draft_ready_at` are separate events. Every time measure is reported as a distribution (median, 75th and 90th percentile, and the share of eligible sessions within the target), never as a median alone. **Cards:** generated, shown, answered, delegated, assumed past the cap, avoided by a parser or a pre-fill, and time per card. **Accuracy:** corrections within 14 days of launch per record type, the share of corrections on high-impact fields, and how often a source was opened before a value was accepted. **Attention debt:** values still unconfirmed at launch by risk class, tasks per owner, queue age, overdue items at day 7 and day 14, and privileged-role grants approved as exceptions. **Trust:** undo used, bulk acceptance later reversed, launches cancelled after the summary was shown, and how often the executive chose to delegate rather than answer. **Dropout** carries a reason from a fixed list: voluntary exit, authorization or admin dependency, file failure, AI or provider failure, confusion or going back, validation block. Every metric is segmented by path (Metis AI, bring your own AI, rule-based), provider and model version, document language and file mix. Completion is reported as the two figures of ONB-17 and never merged. A metric that needs a period shows once the period has passed. Tenant admins see their own sessions; provider operators see the same metrics per tenant and their distributions, without tenant business data (TEN-08). | (1) The provider console shows the metrics per tenant without project names or figures. (2) The tenant admin sees the same metrics for the tenant's sessions. (3) Activation is reported with its denominator of eligible sessions, and a session that closed the browser while the AI was reading shows the same elapsed time as one that stayed open, with a different active open time. (4) Every time measure shows median, 75th and 90th percentile and the share within target, segmented by path. | P0 | S7; BRD v4.5 Section 18.5 |
| ONB-27 | **Starting packs.** One pack per kind of work offered in the pre-fill (Release 1 set in D-36), each with a lifecycle (stages, approval points, owner roles, mandatory artifacts), option lists, the approval flow in business words, and references to process frameworks that the provider maintains as built-in published immutable versions (BLD-09, BLD-16). Applying a pack references those versions and never forges a workspace publication: no publisher, effective date or change summary is invented for the workspace. When the customer or the agent adapts one of them, the adaptation becomes a workspace draft whose publication follows BLD-16, so the Workspace Owner publishes it; a launch publishes an adapted process framework only when it is listed in the launch summary and the approving person holds that authority. Packs extend the WSP-14 starter templates and are the reference the agent matches documents against. | (1) Each kind of work offered in the pre-fill has a published pack. (2) A Draft workspace built from a pack alone satisfies the four readiness rules of WSP-14 and is ready to activate once the team is invited, with the pack's process frameworks offered as provider built-in published versions that need no workspace publication. (3) Adapting a pack's process framework creates a workspace draft that only the Workspace Owner can publish, and the built-in version it came from stays unchanged. | P0 | S7; WSP-14; BLD-09; BLD-16; S8 |
| ONB-28 | **Voice note and voice answers.** The executive records up to five minutes on how the company runs projects, or answers cards by voice; speech is transcribed by a listed sub-processor. | The transcript is shown and can be corrected before it is read. | P1 | S7; S10 |
| ONB-29 | **Forward to Metis.** A tenant-specific address receives status reports, board packs and minutes into the session. | A forwarded email's attachments appear in the reading feed with the sender as source. | P1 | S13 |
| ONB-30 | **Cloud folder read once.** The executive points to a SharePoint, OneDrive or Google Drive folder through a connector authorized with the cloud provider; Metis reads it once. | No folder is read from an address typed into Metis (ONB-23). | P1 | S13; S9 |
| ONB-31 | **Directory read.** People, titles, departments and managers are read once from Microsoft Entra ID or Google Workspace. | Each matched person shows the directory as source. | P1 | S13; S8 |
| ONB-32 | **Board pack reproduction.** Metis regenerates the last SteerCo or board pack from the imported data, side by side with the original; differences become questions. | Each difference links to both sources. | P1 | S13 |
| ONB-33 | **Walkthrough of the client's own portfolio.** A two-minute narrated tour generated from the client's data replaces a generic product tour. | Every figure in the tour states its as-of time (BR-39). | P1 | S13; S8 |
| ONB-34 | **Pre-boarding from the sales cycle.** Documents shared during the sale, with the customer's written agreement, seed the session before the first sign-in. | Nothing is read before the customer's admin authorizes AI processing. | P1 | S13; S9 |
| ONB-35 | **IT setup link and domain capture.** A scoped, expiring link lets the customer's IT configure SSO, domain verification and SCIM without a Metis account; colleagues on a verified domain join with a safe default role. | The link expires and covers sign-in settings only. | P1 | S13; S9 |
| ONB-36 | **Import into an Active workspace.** A second wave (for example another business unit) imports as new projects (PLT-14, BR-27) from the onboarding sources, after a validation report that this addendum adds. | Nothing in the Active workspace changes before a person applies the import. | P1 | S7; PLT-14 |
| ONB-37 | **Setup party and overnight completion.** A live session in which every PM confirms their projects from a phone; the agent keeps reading a shared folder overnight and reports in the morning. | Overnight reading produces suggestions only (BR-43). | P1 | S13 |
| ONB-38 | **Human concierge mode.** A Metis onboarding specialist drives the same tools under a support access grant (TEN-09). | Every action shows the specialist and the grant in the tenant audit log. | P1 | S13; S8 |
| ONB-39 | **MCP prompts and a preview in the client's AI.** The prompt pack is served as MCP prompts and the drafted approval flow is rendered inside the client through MCP Apps, together with MCP-17. | The prompts appear in clients that support MCP prompts. | P1 | S10; MCP-17 |
| ONB-40 | **Configuration suggestions from usage.** After launch Metis proposes configuration changes from observed use, for example mapping a newly used status to a system state. | A suggestion names its evidence and applies only when a person accepts it. | P1 | S13; S9 |

## 7.1 MCP setup tool catalogue

Indicative names, fixed in the API design like the tool catalogue of BRD v4.5 (M05). Every tool runs as the user who owns the token, within the tenant (MCP-04), and belongs to one action class (MCP-19). Prepare-only here means that nothing becomes live until a person approves the launch in the application (ONB-15), instead of a confirmation link per call (MCP-08); after launch a setup call that carries a source is stored as a suggestion in the session (ONB-18).

Because the same action class now covers two confirmation boundaries, each tool in the canonical catalogue carries policy metadata next to its class, so the boundary is a value a test can read rather than a sentence to interpret. The setup group shares these values:

| Policy field | Value for the setup tool group |
|------------------------|------------------------------------------------------------------|
| `class` | Read, or Prepare-only (MCP-19) |
| `confirmation_mode` | `batch_launch`: the launch transaction of ONB-15 is the confirmation, not a link per call (MCP-08 keeps `per_call`) |
| `allowed_workspace_state` | `draft`: a call against an Active workspace is refused and, after launch, stored as a suggestion (ONB-18) |
| `requires_setup_policy` | `true`: the tenant's setup switch must be on for external clients (MCP-20) |
| `max_objects_per_call`, `max_objects_per_session` | Proposed starting values 200 and 5,000, confirmed in the API design; a call above the cap is refused (ONB-07, ONB-24) |
| `milestone` | 1A for the whole group (Section 16) |

| Tool | Purpose | Class (MCP-19) | Writes to |
|------------------------------|--------------------------------------------------------|--------------|------------|
| `get_setup_context` | Framing answers, starting pack, record schemas, order of work, rules and the session's open questions | Read | Nothing |
| `propose_profile` | Workspace profile and the irreversible settings | Prepare-only | Draft workspace |
| `propose_option_lists` | Categories, types, labels, statuses with their system states, priorities | Prepare-only | Draft workspace |
| `propose_portfolio_tree` | Portfolios and programs from the chosen view | Prepare-only | Draft workspace |
| `propose_people` | Members with titles and proposed roles; placeholders for people not yet invited | Prepare-only | Draft workspace (no invitation) |
| `propose_projects` | Adopted projects with stage, commitment, budget, dates, owner, sponsor and declared status | Prepare-only | Draft workspace |
| `propose_lifecycle` | Lifecycle draft version: stages, approval points, approvers, quorum, rules | Prepare-only | Lifecycle draft version |
| `propose_project_plan` | WBS items and dependencies from a plan | Prepare-only | Draft workspace |
| `propose_capacity` | Capacity and allocations | Prepare-only | Draft workspace |
| `propose_budget` | Budgets and actuals | Prepare-only | Draft workspace |
| `raise_question` | A gap or contradiction with sources, best guess, owner and treatment | Prepare-only | Onboarding session |
| `record_finding` | A Portfolio X-ray finding with sources and suggested owner | Prepare-only | Onboarding session |
| `check_readiness` | Runs the activation rules (WSP-14), the publish check (GOV-21) and the dry run (ONB-14); returns each failure in plain words | Read | Nothing |

# 8. Business Rules

These rules continue the numbering of BRD v4.5, Section 13.

| ID | Business rule | Source |
|-------|----------------------------------------------------------------------------|----------------------|
| BR-43 | The onboarding agent and MCP clients using the setup tool group write proposals only into a Draft workspace and its onboarding session; after launch they write suggestions that a person accepts. | S7; BR-35 |
| BR-44 | Launch (publication, activation, invitations, role grants, adoption of projects) needs a person's approval in the application. | S7; BR-35 |
| BR-45 | Every value created by onboarding keeps its source; a value without a source is shown as assumed or default until someone confirms it. | S7 |
| BR-46 | Stages completed before adoption are recorded with their sources and get no gate decision; exit rules (BR-17) apply from the adoption stage onward. | S7; BR-17 |
| BR-47 | A baseline captured from imported values is labelled "from import" and changes only through change requests, like any baseline (BR-04, BR-05). | S7; BR-04; BR-05 |
| BR-48 | Auto-accept at a due date keeps a value applied at launch; it never applies a new change. | S7 |
| BR-49 | Customer content goes to a third-party LLM only when the tenant has authorized AI processing; the no-training term is a contractual commitment of the selected provider, shown with a link to the agreement rather than as a claim Metis verifies itself; masking follows the tenant's settings. | S7; D-32; D-33 |
| BR-50 | No response on any channel reveals another tenant's data or existence, or Metis internals (database structure, hosts, keys, prompts); "not found" and "no access" are indistinguishable. | S7; S11; BR-33 |
| BR-51 | A role granted at launch exists first as a proposed role grant with its source and its current-to-proposed access difference; a privileged role is approved against the named person, never in bulk, and every grant is re-checked against the permission matrix on the server at commit. | S7; BR-35; D-41 |
| BR-52 | A high-impact value (identity and access, baseline budget and dates, approvers and quorum, settings that cannot change later) is never applied as assumed or defaulted and is never kept by an auto-accept at a due date: it is confirmed by a person, delegated to a named owner, or left blocking. | S7; D-42 |
| BR-53 | A budget or a date read from a document counts as approved only on a named source authority with an approval marker and date; model confidence alone never establishes approval, and two authoritative sources that disagree become an exception for a person. | S7; BR-47 |

# 9. Reading, Conversion and the Draft

## 9.1 Pipeline

| Step | Component | Uses the LLM | Output |
|---|---|---|---|
| Receive | Intake: upload and paste, and after Release 1 forward and voice (P1); tenant-scoped storage with malware scanning (PLT-07) | No | Stored inputs |
| Extract | Parsers per format: spreadsheet cells with formatting and colours, CSV, MS Project XML and MPP, Word, PDF (text, and OCR for scans), PowerPoint text and tables, saved emails; images and audio go to the provider's vision and speech services | Images and audio only | Source fragments with stable IDs (file, sheet, cell, page, slide, time) |
| Understand (extraction) | Onboarding agent: the third-party LLM, run by a Metis onboarding service, reads fragments as quoted data with the framing answers and the starting pack as context; maps columns, resolves entities, matches the operating model, finds contradictions. In this stage the model holds no tool that writes, fetches or reads another record: it returns candidate facts | Yes | Candidate records with their cited fragments |
| Validate | Metis onboarding service and MCP server: schema and enumeration checks, unknown fields rejected, every cited source checked against the session, permission, tenant and business-rule checks, risk class attached per field | No | Validated proposals, or errors written for self-correction |
| Write | A deterministic orchestrator in Metis calls the setup tools (Section 7.1) with the validated proposals; no model output decides which tool runs | No | Draft records, questions, findings |
| Review and launch | The product's own screens on the Draft workspace; question cards; launch summary | No | Live workspace |

Exact parsing comes first: a structured input whose mapping is unambiguous is read without the LLM (ONB-05). The LLM decides ambiguous mappings, reads unstructured content, resolves entities and matches the operating model.

The split between extraction, validation and writing is the prompt-injection boundary (ONB-24). Detecting instruction-like text is useful as a signal and useless as a boundary: a governance handbook is written in the imperative, so a filter that removes imperatives removes requirements, and one that keeps them cannot be trusted to keep attacks out. What makes the attack harmless is that the stage which sees document text can call nothing, and the stage that writes takes only validated records, as OWASP states for controls that must sit outside the model [Source: S11, LLM01:2025 Prompt Injection].

## 9.2 The Draft workspace is the draft

BRD v4.5 already has a non-live state for a new workspace; the design reuses it instead of a separate staging copy of every entity (ONB-09).

- The workspace is created in Draft (WSP-05): only owners and admins open it; members do not see it.
- The lifecycle is a draft version (GOV-19 to GOV-21), published at launch.
- Option lists and the portfolio tree are written to the Draft workspace.
- People become member records with proposed roles; invitations and role grants take effect at launch, when the executive approves (PLT-03, BR-35).
- Existing projects are adopted into the Draft workspace (9.3).
- The onboarding session (ONB-01) holds what BRD v4.5 lacks: framing answers, inputs, source fragments, per-field provenance and confidence, questions, delegated items, findings, the batch ID on every created record, and each item's status.
- The draft shown to the executive is the product itself: the cockpit and the registry of the Draft workspace, with badges from the session.
- "Start over" deletes every record the batch created in the Draft workspace; the audit log and the session's inputs remain. After launch, the undo window (ONB-16) removes the batch's unchanged records and lists the others.
- After launch the AI no longer writes records: a setup call that carries a source is stored as a suggestion in the session, and the responsible person accepts it (ONB-18).

A separate staging layer, holding proposed records outside the product and applying them as a change set, was considered and not kept: it mirrors patterns that protect live systems [Source: S10, Stripe and ServiceNow], whereas a new Metis workspace is not live until activation, and a second model of every entity would double the work and let the preview drift from the product. Importing into a workspace that is already Active is a different case, planned after Release 1 (ONB-36).

## 9.3 Adopting in-flight projects

CHR-17 creates every project in Draft with a setup checklist. Onboarding brings projects that are already running, so the addendum adds an adoption path (ONB-10):

- A project is adopted at its current stage, read from the documents or asked. Earlier stages are recorded as completed before Metis, with the source document as evidence; they are marked completed before Metis and never as passed, because no gate was held (BR-46). The Decision Log gets one entry per project: adopted at stage X at launch, approved by the executive, on the source authority named below, with the exceptions still open at that moment.
- A budget or a date counts as approved only on a source authority (BR-53): a document class the client names as authoritative, carrying an approval marker, its date and, where stated, the approver. On such an authority the project is adopted as committed and its baseline is captured at launch from the imported values (CHG-06), labelled "from import" (BR-47). Without it, or where two authoritative sources disagree, the project is an exception on the adoption review rather than a committed baseline, and it stays uncommitted with advisory change control until a person decides (BR-04). The executive reviews the exceptions, not all the rows: the adoption screen opens on the conflicts, the low-confidence rows and the ambiguous evidence, with the ready projects collapsed behind their count and a bulk action.
- Mandatory artifacts of stages completed before adoption are not demanded retroactively; exit rules (BR-17) apply from the adoption stage onward. A committed project without an owner or a sponsor is still adopted as committed: the gap becomes a delegated item and an attention item until the person is named, instead of blocking the adoption (BR-01; Section 13, CHR-17 row).
- Declared status and health from the tracker are kept as the last known status with the document's as-of time. Computed metrics (BRD v4.5, Section 12) show "not available yet" until a plan is imported, as partial data under BR-39.
- The executive's single launch approval covers the adoption of every listed project.

## 9.4 Provenance and confidence

- Every proposed value carries its source fragment (file, location, quoted text), a confidence band (high, medium, low), a status (read, assumed, default, confirmed, asked, delegated, conflicting) and a risk class (high impact or normal, D-42) (ONB-08).
- A confidence band routes a value; it never certifies it. A band decides whether Metis asks, assumes, defaults or delegates, and it is not evidence that the value is right, because a model can be confident and wrong, and because the bands are not calibrated across providers or models. High-impact values therefore do not follow the bands at all: they need a person or a source authority (BR-52, BR-53).
- High-confidence normal values are applied quietly and show their source on hover; medium values are applied with a "check" badge, and a "check" value still unconfirmed at launch counts as assumed; low-confidence and conflicting values become questions.
- "Assumed" and "default" badges stay visible after launch until someone confirms the value, and the value appears in the responsible owner's attention list; the executive's attention queue (EXE-02) shows the assumed values as one item per owner, with the number still to confirm, together with that owner's overdue delegated tasks (ONB-17), until then.
- This addendum fixes the bands and their behaviour; the numeric cut-offs are tuned in Discovery with the design partners.

## 9.5 One pipeline, two drivers

The setup tool group (ONB-07, Section 7.1) is prepare-only: it writes only into a Draft workspace and its onboarding session, never into an Active workspace, and never publishes, activates, invites or grants roles. It is off by default for external clients; a tenant admin switches it on, the pattern of an admin tool group disabled by default [Source: S10, Atlassian Rovo MCP server]. Every proposal carries source references, a confidence per field and an idempotency key (PLT-06), and returns what was written plus any validation errors.

The Metis onboarding agent calls the same MCP server as any client, with a short-lived onboarding token bound to the executive, the tenant, the Draft workspace and the setup tool group. On the second path (Section 12) the client's own AI uses the same tools with the same kind of token, bound to the person who creates it.

## 9.6 Rule-based path

When the tenant does not authorize AI processing, structured inputs go through column-mapping screens (suggestions by header names, a kept-and-dropped report) and produce the same proposals; the question cards, the launch and the delegation work the same way (ONB-20). Unstructured documents are listed but not read, and the screen says so: this path is not equivalent for handbooks, decks and minutes, and promising otherwise would be the one claim the design cannot keep. A mapping is saved per set of headers and offered for the next matching file, so a long mapping can be left and resumed.

# 10. Questions, Delegation and Launch

## 10.1 What counts as missing

The onboarding session checks the Draft workspace against five rule sets and turns every gap into one item (ONB-11):

| Rule set | Examples of gaps | Source of the rule |
|---|---|---|
| Activation | No published default lifecycle; a status without a system state; no portfolio | WSP-14, BR-14 |
| Publish check | An approval point without approvers; a quorum the named approvers cannot reach; a stage without an owner role | GOV-21 |
| Adoption | A project's current stage unknown; committed without budget or dates; committed without owner or sponsor | Section 9.3, BR-01, BR-03 |
| The executive's answers | The boundary of big or strategic projects; the members of the executive committee; the data the chosen home view needs | Section 6.3 |
| Feature data | Capacity and allocations, actuals, strategic objectives, process frameworks | RES-03, CHR-13, CHR-15, BLD-09 |

## 10.2 Ask, assume, default, delegate or defer

Each item gets one treatment, decided by three tests: is it needed for launch, how costly is a wrong value, and who knows the answer.

| Treatment | When | Example |
|---|---|---|
| Ask the executive | Needed for launch and only the executive knows, or the value cannot change later, or it is high impact (D-42) | Confirm currency and fiscal year; who sits on the executive committee; which people get a privileged role |
| Assume, with a visible badge | Needed for launch, readable with medium confidence, cheap to correct, and not high impact | A project's current stage inferred from its status report |
| Safe default | Needed for launch, stated nowhere, and the starting pack has a sensible value | Stage owner roles and mandatory artifacts from the starting pack |
| Delegate | Someone named in the documents knows it better than the executive | Budgets to finance; each project's dates to its PM; capacity to HR |
| Defer | Needed neither for launch nor for the chosen home view | Process frameworks; naming the person who approves a late approval point, asked when the first project gets there (the people holding the starting pack's role approve until then) |

- The executive sees at most 10 cards in the 30-minute path (a product setting, 10 by default), ordered: irreversible settings, launch blockers, what the chosen home view needs, the rest. Normal items beyond the cap are assumed, defaulted or delegated automatically and listed on the launch summary; a high-impact item beyond the cap is delegated to a named owner or listed as a launch blocker, never assumed (ONB-11).
- A question never carries a preset number, and launch never waits for a delegated answer (Section 6.4).

## 10.3 Question cards and the conversation panel

- **Card:** one question in business words; Metis's best guess pre-selected with its source (quoted passage and file); alternatives; "Use this" (accept the guess, marked assumed, or confirmed when only the executive knows the answer); "Ask someone" (delegate, with the suggested owner pre-filled). Target: under 15 seconds per card.
- **Bulk card:** "We matched 78 of 86 people to roles; check the 8 we are unsure about."
- **The counter is not a quota:** the card area says how many questions are resolved and how many can be delegated or left flagged, rather than "6 of your 10 cards answered", which turns a ceiling into homework (ONB-11).
- **Contradiction card:** both sources side by side; pick one or type the right value.
- **Conversation panel:** free text, and voice where enabled (ONB-28). The agent turns an answer into proposals and states what changed, for example "Added Finance as an approver for the 11 largest projects."
- Cards appear while documents are still being read.

## 10.4 Portfolio X-ray

Findings from the client's own documents, shown next to the draft and turned into attention items (EXE-02) at launch (ONB-13):

| Finding | Example | Suggested owner |
|---|---|---|
| Missing accountability | Committed projects without an owner or a sponsor (BR-01) | PMO |
| No strategic link | Projects linked to no objective, when objectives are known (BR-02) | Executive |
| Conflicting figures | A budget or a date that differs between two documents | Data owner |
| Slipped dates | A target date that moved between two versions of a status report | Project manager |
| Possible duplicates | Two similar projects in different units | PMO |
| Overloaded people | One person leading or delivering many projects (count-based, as OVW-03) | Resource manager |
| Stale status | A last status older than the freshness threshold (BRD v4.5, Section 12.5) | Project manager |
| Suspicious content | Text in a document that reads like instructions to an AI | Tenant admin |

## 10.5 Delegation

- **Owners:** the person named at launch to finish the rest (default owner) and the owners found in the documents (each project's PM, finance for budgets, HR for capacity) (ONB-17).
- **Task:** pre-filled values with their sources; accept all, edit, reassign or "I don't know"; a due date and reminders; correcting a value that a baseline from import has locked opens a change request (BR-47). Channels in Release 1: the in-app task list and email (D-16); chat channels follow BRD v4.5.
- Owners are members of the workspace and receive the normal invitation at launch (PLT-03).
- **Auto-accept at the due date applies only to normal values already applied at launch** (assumed or defaulted): the badge changes to "kept unchanged after the due date", which says what happened instead of reading like a default value, and the item stays in the default owner's attention list. A high-impact value is never kept this way: it escalates and stays unconfirmed (BR-52). A suggestion that would change data after launch never applies itself (BR-48).
- **Escalation:** an overdue task goes to the default owner, then to the executive's attention queue (EXE-02); the morning digest (PLT-10, P1 in BRD v4.5) carries the same line once it is enabled. Each task carries the risk class of the value behind it, so an overdue high-impact item is visible as such rather than as one of many.
- **Load per owner:** the number of items, the age of the queue and the overdue count are measured per owner (ONB-26), and an owner above the load threshold is named on the launch summary before the approval, so the launch does not simply move the work out of sight.
- **Progress per feature:** for example "Investment view: 9 of 12 budgets confirmed"; until the follow-through is complete the executive's home shows a slim bar labelled as delegated follow-through, which is not the same figure as the launch being complete (ONB-17).

## 10.6 Approve and launch

The launch summary is one page in business words, and it leads with what the executive achieved before what they must still check, because this is the end of the journey and the moment they remember (ONB-15):

- **What you have now:** the workspace with the company's own lifecycle, the real people, the adopted projects and the live metrics, as four achieved outcomes rather than as counts of objects created.
- **What your approval will do:** the seven steps below in business words, with the technical transaction behind one expandable view.
- **Access changes:** every invitation and role grant, grouped by role. Standard team roles are approved in bulk. A privileged role (D-41) is listed by person, with the difference between that person's current and proposed access and the source of the proposal, and is approved against the name (BR-51).
- **Values still unconfirmed:** grouped as high impact, normal and informational, never as one number. A high-impact value blocks the launch until it is confirmed or delegated (BR-52).
- **What happens next:** the owner tasks grouped by owner and due date, with the owners carrying the heaviest load named, so the executive sees where the work lands.
- **Who finishes the rest:** suggested from the documents, editable.
- **What can and cannot be undone:** the undo window, and the list of what an undo would not remove (ONB-16).
- **Readiness:** the WSP-14 activation rules, the GOV-21 publish check and the dry run, each passed or failed with its failure in plain words and a one-click fix. Only a deterministic blocker disables the approval.

**Dry run** (ONB-14): three adopted projects chosen to exercise the most rules (the largest by budget, one routed to the executive, one typical) run through the drafted approval flow; the screen shows who approves each point, whether the named approvers can reach the quorum and which documents become mandatory.

One "Approve and launch", by the executive, who is the first tenant admin (TEN-01) and the owner of the Draft workspace unless another owner was named, runs on the server in one transaction:

1. Re-runs every readiness check and re-checks every proposed role grant against the permission matrix on the server; any failure stops the launch and nothing changes.
2. Publishes the lifecycle draft. The AI is the author of the draft and the executive its reviewer, which satisfies the review step of GOV-21. A process framework adapted from the starting pack is published only when it was listed in the summary and the approver holds that authority (ONB-27, BLD-16).
3. Adopts the projects (Section 9.3): stage instances, baselines from import for committed projects, one Decision Log entry per project with its source authority and open exceptions.
4. Activates the workspace (WSP-05).
5. Grants the approved roles and queues the invitations, which are sent only after the launch commits, so a rolled-back launch sends none (PLT-03, BR-35). Each grant is recorded with the person who approved it; a privileged grant records the named approval (BR-51).
6. Dispatches the owner tasks and turns the X-ray findings into attention items.
7. Records every step in the audit log: the AI as author of each proposal, the executive as approver, channel "onboarding" (PLT-11, MCP-11).

After launch, an undo window (14 days by default, set per tenant, D-35) removes the batch's records that nobody has changed since and lists those it keeps, together with any unchanged record a kept one depends on; audit and Decision Log entries stay (ONB-16).

## 10.7 Effort budget

- The 30 minutes belong to the executive, are the active open time of Section 4.1, and are measured together with the four other clocks, so a slow provider shows up as processing wait time instead of hiding inside one number (ONB-26).
- Owner effort is measured separately, with design targets such as "a PM confirms their own adopted project in under 5 minutes" and "finance confirms a budget list in one pass".
- The work pushed past the launch is a budget of its own: values still unconfirmed by risk class, tasks per owner, queue age and overdue items at day 7 and day 14 are measured, and an owner above the load threshold is named on the launch summary. A fast launch that leaves a long queue is a worse outcome than a launch two minutes slower that leaves none (ONB-17, ONB-26).

# 11. Guardrails and AI Policy

Principle stated by the product owner (S7): **the data belongs to the customer.** Any user may read and act on what their roles allow, in the application or through MCP with any client the tenant's policy admits (MCP-20), including to make Metis do what they want. The security work is on the boundary: MCP exposes nothing that lets anyone reach beyond it. The boundary is enforced by architecture and code on the server, never by a prompt; OWASP states that critical controls must not be delegated to the LLM and that sensitive information must not sit in system prompts [Source: S11, LLM07:2025 System Prompt Leakage].

## 11.1 The boundary

| Inside: available to a user through the app or MCP | Outside: never exposed through any channel |
|---|---|
| Records of their own tenant that their roles allow, intersected with the token's scopes (MCP-04) | Any record, name, count or even the existence of another tenant (TEN-02, BR-33) |
| Figures computed by Metis, with as-of time and metric version (MCP-10, BR-39) | Database names, table and column names, query language, raw queries |
| The published tool list, schemas and versions (MCP-09) | Internal hostnames, service topology, software versions beyond the MCP protocol version, stack traces |
| Their own audit entries and MCP activity; all of the tenant's for tenant admins (MCP-11) | Signing keys, provider keys, token hashes, other users' tokens (BR-36) |
| Drafts and proposals they or their AI create (setup tool group, prepare tools) | The prompts and orchestration of Metis's own onboarding agent |
| Business-level errors that say what to fix (MCP-15) | Actions reserved to a person in the application: approvals, decisions, baseline application, deletions, permission and token changes (BR-35) |

Inside the tenant the data belongs to the organization, not to each user: roles still decide who sees what, and the onboarding agent acts as the executive and sees what the executive sees. BR-35 is unchanged; it is the customer's own governance (AI prepares, people decide, a positioning point of BRD v4.5, Section 4.2), not a limit on access to their data.

Threat classes considered, from the OWASP Top 10 for LLM Applications 2025 [Source: S11]: prompt injection (LLM01), sensitive information disclosure (LLM02), improper output handling (LLM05), excessive agency (LLM06), system prompt leakage (LLM07), misinformation (LLM09), unbounded consumption (LLM10).

## 11.2 Hardening the MCP surface against tricks

The same surface serves the customer's own AI clients and Metis's onboarding agent, so one set of controls protects both (ONB-23).

| Trick | Control |
|---|---|
| Probing for other tenants by guessing identifiers or names | Opaque identifiers; one response for "not found" and "no access"; the token's tenant audience checked on every call (TEN-02) |
| Reading the answer from the shape of the response | Same status code, same error envelope, comparable payload size and a response time in the same band for a missing record and a record of another tenant; enumeration rate limited (ONB-23, MCP-12) |
| Reaching another tenant through something other than the database | Search indexes, caches, queues, job status, exports and support tooling are partitioned per tenant, each with its own negative test in the isolation suite (TEN-02) |
| Asking for more than the role allows | Every tool runs the same server-side permission checks as the application (PLT-04, MCP-04) |
| Smuggling a query or code | No generic query, search-anything or execute tool; every parameter validated against its schema and allow-lists; page-size caps (MCP-13) |
| Making the server fetch an address (server-side request forgery) | No tool fetches a URL supplied by a client; a cloud folder is read only through a connector the tenant admin authorizes with the cloud provider (ONB-30) |
| Reading internals from errors | Errors carry a category and a fix, never a stack trace, a query or an internal name |
| Instructions hidden in record text or documents | The stage that sees document text has no tool that writes, fetches or reads (Section 9.1); a deterministic orchestrator does the writing from validated records; stored text is returned as data and never interpreted as instructions by the server (MCP-16); write tools act only on explicit parameters; every setup proposal cites sources that exist in its session; suspicious fragments are quarantined with their source, not deleted (ONB-24) |
| A poisoned input or starting pack steering the mapping | Every source carries a trust level (provider-maintained pack, customer document, text reported by a customer AI) and the raw evidence is kept unchanged; a pack update runs the red-team suite against a poisoned pack fixture; no pack or document can set a permission, a tool policy or a high-impact value (ONB-25, ONB-27) |
| A compromised or changed dependency in the reading chain | The provider, model, prompt and the parser and OCR dependency versions are recorded per release with a dependency and licence scan; a change to any of them re-runs the three suites (ONB-25) |
| Output used as code, a path or an address | Replies are rendered as text and never executed, inserted as markup or turned into a query, a file path or a URL; proposals pass schema and enumeration validation and unknown fields are rejected (ONB-07, ONB-24) |
| Changing what a tool claims to do | Tool names, descriptions and schemas are static and versioned (MCP-09) and contain no secrets or internal hints |
| Writing outside the draft or taking person-only actions | The setup tool group writes only into a Draft workspace; publishing, activation, invitations and role grants need a person (BR-35, BR-43, BR-44) |
| Exhausting the service or the budget | Rate limits and quotas per token and per tenant (MCP-12, TEN-10); caps on file size, pages, archive expansion ratio and nesting depth, tokens, AI calls and parallel jobs; a bounded retry budget with exponential backoff; a cancel action; content hashing so a repeated file is not paid for twice; a provider spend cap with an alert before the cap (ONB-24) |

## 11.3 Metis's own onboarding agent

The agent is one more client of the same surface, so 11.1 and 11.2 already bound it. Because its prompt and orchestration are Metis internals and it calls a third-party LLM, it adds these controls (ONB-24):

- **Nothing worth stealing in its context:** task instructions and published schemas only; no credentials, hostnames, provider keys, database names, permission structure or authorization rule; provider keys stay in the onboarding service. Hiding the prompt is not a control: every rule that decides what may be read or written is enforced in code on the server, as OWASP requires [Source: S11, LLM07:2025 System Prompt Leakage].
- **An internals lock, not a topic lock:** it answers anything about the customer's data that the executive may see within its onboarding token (Section 9.5), and refuses only Metis internals, other tenants and requests unrelated to the customer's business, with the fixed reply of 11.6. An input classifier flags probing; repeated probing slows the session and notifies the tenant admin.
- **Documents as data, in a stage that can do nothing else:** text reaches the model inside marked data blocks with its source; each document is read in its own pass where possible, so one hostile file cannot steer the reading of the others; the extraction stage holds no tool that writes, fetches or reads another record, and a deterministic orchestrator performs every write from validated records (Section 9.1).
- **Quarantine instead of deletion:** text that reads like an instruction is set aside with its source and reported as a Portfolio X-ray finding, and the surrounding content is still read. Removing imperatives would delete the governance rules Metis is there to read, and keeping them would be no safer, which is why the boundary is the stage separation and not the classifier.
- **Output screening by code outside the model:** each reply is checked for canary strings planted in the prompt, key and token formats, internal hostnames and other tenants' names; a hit blocks the reply and records a security event. Output is rendered as text, never executed, inserted as markup, or used as a query, a file path or an address.
- **Spend and load:** caps per onboarding on files, size, pages, archive expansion ratio and nesting depth, tokens, AI calls and parallel jobs and, once voice is enabled, audio minutes; a bounded retry budget with exponential backoff; a cancel action; content hashing against paying twice for the same file; and a provider spend cap per tenant with an alert before the cap.
- **Audit:** every AI call, tool call, refusal and security event is in the tenant audit log (MCP-11, PLT-11); what is kept follows D-34.

## 11.4 Proof before release

Three suites run on every release and on every change of model, provider or prompt, like the tenant isolation suite (TEN-02), and their reports are kept as release evidence (ONB-25):

- **Boundary suite:** cross-tenant probing with a second test tenant, identifier enumeration, access beyond role for each role (generated from the permission matrix, BRD v4.5 Section 18.4), parameter fuzzing, attempts at server-side fetches, inspection of every error message for internals, rate limits. Pass: zero data or existence of another tenant, zero access beyond role, zero internals in any response.
- **Agent red-team suite:** direct injection; injection hidden in each supported file type (spreadsheet cell, slide note, PDF text layer, image text, audio); system prompt extraction; role-play and multi-turn jailbreaks; attacks in Vietnamese and other languages; spend exhaustion. Pass: zero canary or secret leaks, zero writes outside the Draft workspace and its onboarding session, zero person-only actions by the AI.
- **Extraction-accuracy suite:** reference documents with the records a person extracted from them (projects, people, budgets, dates, stages); precision and recall per record type, against the threshold of D-39. It guards against wrong values (LLM09) as the other suites guard against attacks.

OWASP lists adversarial testing that treats the model as an untrusted user among the mitigations of prompt injection [Source: S11, LLM01:2025 Prompt Injection].

What each release records as evidence, so that a passing suite can be tied to what it ran against (ONB-25): the corpus version; the provider, model version and prompt version; the versions of the parser and OCR dependencies with their dependency and licence scan; and the pack versions in use. A change to any of them re-runs the three suites, and a starting-pack update additionally runs the red-team suite against a deliberately poisoned pack fixture. The three risk classes of the OWASP list that this scope does not centre on are covered here rather than ignored: supply chain (LLM03) by the dependency record and scan, data and model poisoning (LLM04) by the source trust levels, the unchanged raw evidence and the poisoned-pack fixture, and vector weaknesses (LLM08) by the rule that any later embedding or index is partitioned per tenant like every other data path (TEN-02).

## 11.5 Data handling: the customer decides

- **Off until authorized.** Because the data is the customer's, Metis sends nothing to the third-party LLM until a tenant admin authorizes AI processing for the tenant (ONB-22). In the sales-led flow the provider may pre-select "on"; the executive, as first tenant admin, still authorizes it explicitly. The screen is called "Enable AI processing for this tenant": it is a product setting and not by itself the lawful basis for processing personal data, which the data processing agreement and the privacy notice carry (Q-16).
- **The authorization screen states** which provider processes the content and in which region, what is sent (the fragments needed, the questions and answers, never other tenants' data), that the provider does not train on customer data, the provider's retention, what Metis keeps, how to switch the AI off, and the rule-based path as the alternative.
- **Masking is the customer's choice, and field names are not enough:** sensitive personal fields beyond names, titles and work email (for example salaries or private phone numbers in a capacity sheet) are masked before sending by default, and unstructured text is scanned for content classes as well, since a handbook or a slide carries no column headers: personal identifiers, payment and bank details, credentials and secrets. Detection is imperfect, which the screen states; a tenant that cannot accept that residual risk blocks whole data classes instead, or keeps the AI off (D-43).
- **Sub-processors and transfers:** the LLM provider and any speech or vision service join the published sub-processor list, with the processing region and the transfer mechanism where processing leaves the customer's region, as one matrix with the storage, parser, audit, backup and support paths (BRD v4.5, Section 17, data lifecycle; D-31, D-33, Q-11) [Unverified - confirm the transfer mechanism and the lawful basis with counsel per jurisdiction].
- **Inputs kept by Metis, and two meanings of deletion:** uploaded files are the customer's documents in their own tenant storage, kept as the source behind provenance links under the tenant's retention policy. "Delete the original files" removes the binaries and keeps the provenance metadata and the quoted passages, which are themselves source content; "delete the source content" removes the binaries, the extracted text and fragments and the quoted passages, leaving a source identifier, a hash and the mark "source removed". Neither action can reach what audit retention (D-34) or the backup purge period still holds, and the screen says so rather than promising that the data is gone (ONB-22, D-38).
- **Transparency:** the agent always presents itself as AI (the square "AI" avatar of the wireframes), and every record it proposed shows "proposed by AI, approved by" the person. Where the EU AI Act applies, Article 50(1) requires informing people that they are interacting with an AI system, from 2 August 2026 [Source: S12] [Unverified - confirm applicability to Metis with counsel, Q-16].
- **Model changes:** the provider and model version are recorded per session; a new model or provider is used only after the three suites pass.
- **The provider's name is not a secret:** the sub-processor list and the authorization screen name it; what stays protected is listed in 11.1.
- **What the audit keeps for onboarding AI calls** (D-34): metadata and redacted excerpts by default; the full prompt and reply only for calls flagged as security events, for 90 days, visible to the tenant admin. This mirrors open question Q-12 of BRD v4.5 for MCP calls.

## 11.6 The fixed reply to probing

"I can help with anything about your company's data in Metis, but I can't share how I am built or anything about the systems behind Metis. Shall we continue with *the current step*?" Shown in the user's language; the same reply for every out-of-scope request, so probing learns nothing from variations.

# 12. Bring Your Own AI

## 12.1 Who it is for

- Tenants that keep the Metis onboarding AI switched off (policy, compliance, procurement).
- Teams whose own AI already reaches their documents: an enterprise assistant connected to the company's file stores can find and read files the executive would never upload, which makes this path richer, not only a fallback [Unverified - confirm before applying].
- Anyone who prefers to work from the AI client they use every day.

## 12.2 How it works

1. **Enable:** the tenant admin switches on the setup tool group for MCP clients (off by default, Section 9.5); the tenant's client allowlist applies (MCP-20).
2. **Connect:** the executive or a delegate opens "Set up with your own AI". The page extends the AI access page (MCP-15, wireframe 08) with the endpoint, OAuth or an onboarding token limited to the setup tools and the Draft workspace (7 days by default, never above the tenant maximum), and a test call (ONB-21).
3. **Ask:** the user pastes one short prompt. The intelligence is served by Metis, not by the prompt: the first call, `get_setup_context`, returns the framing answers, the starting pack, the record schemas, the order of work, the rules (cite a source for every value, never invent, raise a question instead of guessing) and the session's open questions. Prompts stay short, work in any language and follow Metis's changes without anyone editing what they pasted.
4. **Work:** the client's AI reads the files in the user's environment and calls the same setup tools as Metis's agent; validation errors come back in words the AI can act on.
5. **Watch:** the Metis tab shows the same live feed, draft screens, cards and X-ray as Section 6, for example "Your AI added 34 projects and raised 6 questions".
6. **Launch in Metis only:** the launch summary and the single approval happen in the application (Section 10.6). The client's AI can never launch, invite or grant roles (BR-35).

## 12.3 The prompt pack

| Job | Prompt |
|---|---|
| Set up from documents | "Use the Metis tools to set up our company from these files. Start with get_setup_context and follow it." |
| Import a project list | "Add the projects in this file to our Metis setup, with their owners, dates, budgets and status." |
| Describe how we approve projects | "From this handbook, describe in Metis how our projects get approved and who approves them." |
| Add our people | "Add the people in this org chart to our Metis setup with their titles and suggested roles." |
| Fill in budgets | "Fill in the budgets of our Metis projects from this finance sheet." |
| Answer open questions | "Get the open Metis setup questions and answer the ones these files can answer by proposing the values with the setup tools; leave the others." |

Release 1 ships the pack as copy-ready text on the page and in the guide, in the user's language. Serving the same prompts as MCP prompts follows MCP-17 (P1 in BRD v4.5, ONB-39), so this P0 path does not depend on a P1 requirement. A user who keeps the setup context can also ask freely, for example "Our PMO handbook is in the shared drive; read it and set up our approval flow".

## 12.4 Data, quality and safety on this path

- **Data:** files are read by the customer's AI in the customer's environment; Metis receives only the proposals and the quoted sources. Metis's LLM provider is not involved; the customer's provider processes the data under the customer's own terms (BRD v4.5, Section 17).
- **Provenance:** the client reports file name, location and quoted passage for each value; Metis records them in the session as "reported by your AI", so proposals can cite them (ONB-07), and does not hold the file. The label is not cosmetic: on this path Metis never read the source, so it does not claim to have verified it, and the badge names the actor path (Customer AI, with the client) rather than showing the same mark as a value Metis read itself. Whether a reported quote is enough to make a project committed, or whether a person must confirm it against the document, is Q-19; this addendum assumes a person confirms high-impact values on this path (BR-52, BR-53).
- **Quality:** Metis validation catches structural errors (an approval point without approvers, a missing stage), not wrong values; the same badges, cards and launch review apply. The verified-client list (MCP-15) gains a "verified for onboarding" mark for clients that pass Metis's onboarding test scenario.
- **Safety:** the guide advises running Metis setup without other connectors that can send data elsewhere (web, email) in the same session, following vendor guidance on prompt injection across MCP servers [Source: S10]; the boundary of Section 11 holds whatever the client does.
- **When IT blocks external MCP connections** (a case Stripe documents [Source: S10, Stripe MCP documentation]): the rule-based path, or the Metis onboarding AI if the tenant enables it.

# 13. Amendments to BRD v4.5

The main BRD is not edited. Each row states what it says today and what this addendum changes (every row was checked on 3 Oct 2026); a later release merges the rows into the main text. The process framework editor added in v4.5 changes none of the twenty items that version 1.0 amended, but it does meet this addendum outside that table, because a starting pack carries process frameworks: that overlap is resolved in the ONB-27 and BLD-16 rows below, and the two documents are therefore not independent. Section numbers in the third column are those of this addendum. Module M23, rules BR-43 to BR-50 and assumptions A-08 to A-10 continue the numbering of BRD v4.5 and need no row; the journeys "Tenant onboarding" and "Workspace setup (WSP-14)" in Section 7.9 of BRD v4.5 stay valid for manual setup, Section 6 of this addendum adds the guided journey, and the acceptance list of Section 19 extends the MVP acceptance checklist of BRD v4.5 (Section 21).

| BRD v4.5 item | Today in v4.5 | Amendment |
|---|---|---|
| 5.2 Out of scope | "Hosting or training an LLM inside the platform: customers bring their own MCP-capable LLM client; the in-app copilot is V3 (M22)." | Unchanged for hosting and training. Calling a third-party LLM through an API to read onboarding inputs and run the onboarding questions is in Release 1 when the tenant enables it (D-32). |
| 4.5 UX principles | Eleven principles; none about setup | Add the principles of Section 4.3 of this addendum, in particular "Show before you ask", "Ask outside-in" and "Numbers come from the client's data". |
| TEN-01 Tenant provisioning (P0) | The operator records organization, domains, first tenant admin, plan, region and trial length | The operator also records the pre-filled facts, an IT contact for sign-in setup and, when known, the framing answers, and may pre-select the onboarding AI (ONB-02); the default workspace that TEN-01 creates is the onboarding's Draft workspace, built from the starting pack of the main kind of work (ONB-27). |
| TEN-04 Tenant admin console (P0) | Users, sign-in, AI access policy for MCP, plan, audit and export | Add the AI onboarding policy (ONB-22) and the switch of the setup tool group for external clients (ONB-07). |
| WSP-14 Guided setup (P0) | Setup checklist, optional starter template, readiness check of four rules | Rules unchanged; onboarding fills the same checklist; starter templates become the starting packs (ONB-27). The process framework step of the checklist is recommended and not an activation blocker, which the requirement and the setup screen now say in those words, so a workspace is never held back by a step the readiness rules do not test. |
| GOV-21 Publish workflow (P0) | Template changes need review and publication before activation | A draft authored by the onboarding AI and reviewed and published by a person satisfies the review step; the author is recorded as AI (ONB-15). |
| BLD-09 and BLD-16 Process frameworks (P0) | Built-in frameworks are read-only; a workspace framework is Draft, Published or Deprecated, and the Workspace Owner publishes it | A starting pack references provider-maintained built-in published immutable versions and forges no workspace publication event; an adaptation becomes a workspace draft that the Workspace Owner publishes under BLD-16, so a pack can never bypass that authority (ONB-27). |
| CHR-17 Create project (P0) | Every project is created in Draft with a setup checklist | Unchanged for new projects; adoption of in-flight projects is a second creation path (ONB-10). A missing owner or sponsor does not block the adoption of a project its documents show as committed (BR-01, CHR-14): the gap becomes a delegated item and an attention item until the person is named (Section 9.3). |
| CHG-06 Baseline (P0) | Captured on commitment | Add the baseline captured at launch from imported values for adopted committed projects (BR-47). |
| CHG-10 Approval authority (P1) | Thresholds route change requests to PM, PMO or Executive | Raised to P0 (D-37): the executive's decision routing uses it (ONB-03). |
| EXE-02 Executive attention queue (P0) | Missing reports, green-but-risky projects, overdue milestones and gates, change requests, capacity, budget variance | Add open X-ray findings (ONB-13) and, per owner, one item for the assumed values awaiting confirmation (ONB-08) and the overdue delegated tasks (ONB-17). |
| PLT-09 Notifications (P0) | Mentions, assignments, decisions, due and overdue items, missing status | Add delegated tasks, reminders and escalations (ONB-17); the morning digest (PLT-10, P1) carries the escalation line once it is enabled. |
| M05 MCP | Tool catalogue without setup tools; personal tokens (MCP-02); verified clients (MCP-15); client policy (MCP-20) | Add the setup tool group (Section 7.1), the onboarding token, the "verified for onboarding" mark, the setup switch in the client policy, and the boundary hardening (ONB-23). Because prepare-only now covers two confirmation boundaries, the canonical catalogue carries policy metadata next to the class (`confirmation_mode`, `allowed_workspace_state`, `requires_setup_policy`, the object caps and the milestone), with `confirmation_mode = batch_launch` for this group and `per_call` for the prepare tool of MCP-08, so the boundary is a value a contract test reads instead of a sentence to interpret. The setup tool group is available from Release 1A, ahead of the update tools (MCP-07) and the prepare tool of MCP-08 that D-30 of BRD v4.5 holds until 1B, because it writes only into a Draft workspace and its onboarding session (BR-43) and every write carries an idempotency key (PLT-06). |
| 14 Roles and permissions | One role model; effective permissions are the union of workspace and project roles | Unchanged. The addendum notes only that making the executive the first tenant admin and the Draft workspace owner is a provisioning choice of the sales-led path (TEN-01, D-27), not a claim that an executive role implies tenant administration; the roles can be separated afterwards and every change is audited. Roles granted at launch follow BR-51. |
| 15 Data model | No onboarding entities | Add the entities and the attributes of Section 14. |
| 16 Integrations | LLM clients connect inbound through MCP; no outbound LLM | Add the integrations of Section 15.3: the outbound LLM provider, vision and speech services, and the inbound cloud folder and directory reads (P1). The LLM provider and the vision service are P0, so D-18 (SSO and email only in the MVP) gains them for onboarding when the tenant enables the AI (D-32). |
| 17 Non-functional requirements | No AI processing targets; a data lifecycle row covering storage, files, audit, MCP records, logs and backups | Add Section 15.1 and the processing targets of Section 15.2. The data lifecycle row becomes one tenant data-processing matrix that also covers the outbound LLM and vision calls, the parser chain, the onboarding audit excerpts and the bring-your-own-AI path, with the region, the retention, the transfer mechanism and the sub-processor for each (D-43, Q-11). |
| 18.2 Delivery | Seven workstreams; milestones 1A and 1B | Add the "Onboarding and intake" workstream and its milestone contents (Section 16). |
| 18.5 Success criteria | No onboarding measure | Add the onboarding targets of Section 19.2. |
| 19 Decisions and questions | D-01 to D-31, Q-01 to Q-13 | Add D-32 to D-39 and Q-14 to Q-18 (Section 17). |
| 20 Risks | No onboarding risks | Add the risks of Section 18. |
| Appendix A Glossary | No onboarding terms | Add the terms of Appendix A of this addendum. |

# 14. Data Model Additions

| Entity | Key attributes | Relationships |
|--------------------|------------------------------------------------------|------------------------------------|
| Onboarding session | ID, tenant, Draft workspace, executive, pre-filled facts, framing answers, status, started, launched, batch ID, LLM provider and model version | Belongs to a tenant; holds inputs, questions, tasks, findings, suggestions |
| Input | File name, type, size, scan state, uploader, kept or deleted after launch | Belongs to a session; yields source fragments |
| Source fragment | Input, location (sheet and cell, page, slide, time), quoted text | Belongs to an input; cited by provenance annotations |
| Provenance annotation | Record, field, fragment or "reported by your AI", confidence band, status (read, assumed, default, confirmed, asked, delegated, conflicting), risk class (high impact, normal), actor path (Metis onboarding AI with its provider, customer AI with its client, person), author (AI, person) | Attached to any record field created by onboarding |
| Setup question | Text, best guess, sources, treatment, owner, kind (card, bulk or contradiction), answer, answered by | Belongs to a session |
| Delegated task | Owner, items, due date, reminders, state, risk class, kept-unchanged flag, escalation state | Belongs to a session; links to the records it confirms |
| X-ray finding | Type, detail, sources, suggested owner, state | Belongs to a session; becomes an attention item at launch |
| Suggestion | Record, field, proposed value, source, state, accepted by | Created after launch by the agent or an MCP client |
| AI processing authorization | Tenant, provider, region, masking settings and blocked data classes, authorized by, authorized at, revoked at | Belongs to a tenant |
| Starting pack | Kind of work, lifecycle, option lists, approval flow, version, and the built-in published process framework versions it references | Provider-maintained; referenced by sessions |
| Proposed role grant | Person or placeholder, proposed role and scope, source, current access, proposed access, privileged flag, approval state, approved by, approved at | Belongs to a session; becomes a role assignment at launch (BR-51) |
| Source authority | Document class, approval marker, approval date, approver where stated, trust level | Attached to an input; cited by a baseline from import (BR-53) |
| Session timing event | Kind (session opened, focused, blurred, closed, input, job started, job ended, dependency wait, first value, draft ready, launch committed), time | Belongs to a session; the five clocks and the activation event of ONB-26 derive from these |

The addendum also adds attributes to entities that already exist in the main BRD (its Section 15.1): the batch ID on every record an onboarding session creates (ONB-01); on Baseline, the label "from import" and the source authority it rests on for a baseline captured from imported values (BR-47, BR-53); on Project stage instance, the mark "completed before Metis" with its sources for a stage completed before adoption (ONB-10, BR-46); and on Member / role assignment, the proposed role and the proposed role grant it came from (ONB-09, BR-51).

# 15. Non-Functional Requirements and Integration

## 15.1 Additions to Section 17 of BRD v4.5

| Area | Requirement | Source |
|----------------|--------------------------------------------------------------------------|--------------|
| AI processing | Customer content reaches the LLM provider only after the tenant authorizes it, only the fragments a task needs, masked per tenant settings and per blocked data class; the provider and model version are recorded per session. | ONB-22; BR-49; D-43 |
| Assurance | The boundary, red-team and extraction-accuracy suites are release gates (ONB-25). | S11 |
| Data lifecycle | Uploaded inputs follow the tenant's retention policy, with an option to delete them after launch; AI call content follows D-34. | D-34; D-38 |
| Resilience | If the LLM provider is unavailable or the spend cap is reached, the failure screen offers "continue without AI" at once, the structured data already parsed is kept, retries are bounded, and no retry spends again on a file already read; the session resumes later. An interrupted upload resumes under its idempotency key and server-side reading continues while the session is closed (ONB-01). | ONB-20; ONB-24; PLT-06 |
| Accessibility | Onboarding screens, cards and the conversation panel are fully operable from the keyboard and meet the WCAG target of D-26, with the component acceptance matrices of the style guide (table, tree, board, canvas, dialog) and a screen-reader pass on screens 46, 49, 50, 51, 52 and 53 before the pilot. | BR-41; D-26 |
| Responsiveness | Question cards can be answered on a phone as responsive web, with no native app (D-19, extended to the onboarding question cards). | D-19 |
| Localization | Cards, prompts and the fixed reply are shown in the user's language; documents are read in the languages agreed in Q-15. | Q-15 |

## 15.2 Processing targets (proposed, to confirm with D-26 of BRD v4.5)

| Target | Proposed starting value |
|---|---|
| First signal from the client's own data after the first file is dropped (ONB-13) | Within 2 minutes |
| First card or first finding after the first file is dropped | Within 2 minutes |
| Draft cockpit ready for a reference set of about 20 documents | Within 10 minutes of the drop |
| Launch transaction | Within 1 minute for a reference portfolio of 50 projects and 100 people |

## 15.3 Integration additions

| System | Purpose | Direction | Pri | Source |
|--------------------|--------------------------------------------------|--------------------|------|--------------|
| LLM provider | Reading onboarding inputs and running the onboarding questions | Outbound | P0 | D-32; ONB-06 |
| Vision service | Text and structure from images; OCR for scanned PDFs stays in the parsers (ONB-05) | Outbound | P0 | ONB-04 |
| Speech service | Voice notes and voice answers | Outbound | P1 | ONB-28 |
| Cloud folder connector | Read a folder once through an authorized connector | Inbound | P1 | ONB-30 |
| Identity directory read | Read people, titles and managers once | Inbound | P1 | ONB-31 |

Each follows the integration contract of BRD v4.5, Section 16, and each outbound service is a listed sub-processor.

# 16. Delivery

- **Workstream "Onboarding and intake"**, from Discovery onward, beside the seven workstreams of BRD v4.5, staffed from the agency team of A-07; the split of the team across streams is set in Discovery (BRD v4.5, 18.2).
- **Discovery** delivers: the reference document sets of the design partners (Q-14) and the extraction-accuracy threshold (D-39); the provider selection (D-33); the list of starting packs (D-36); the privileged-role list (D-41), the high-impact field list (D-42) and the tenant data-class policy (D-43); the versioned framing mapping table (Section 6.3); and a prototype of the framing, adoption and launch screens tested with executives in the UX phase (BRD v4.5, 18.4).
- **Usability testing before the pilot** runs in two rounds, so the first round's findings are fixed before the second: a proposed sample of 12 to 16 participants (5 or 6 executives of design partners, 3 or 4 PMO or workspace owners, 2 tenant admins or customer IT, 2 project managers receiving an adopted project), with no facilitator explaining the vocabulary. The tasks: walk from the framing screen to launch with the participant's own kind of documents; find and correct a value the AI read wrongly; resolve a conflicting budget or date; review the imported baseline of a committed project; launch with one privileged-role anomaly and one high-impact assumption present; confirm an adopted project as its project manager; switch AI processing off mid-session as a tenant admin and see what happens; and run the rule-based path on a spreadsheet and the bring-your-own-AI path on a configured client. Proposed pass criteria, to confirm in Discovery: every participant can say what the launch will do, in their own words, before approving it; nobody grants a privileged role without noticing; every critical error has a recovery path; the keyboard and screen-reader pass has no severity 3 or 4 issue; and the three suites pass.
- **Milestone 1A:** onboarding session, intake and exact parsers, the onboarding agent, the setup tool group, the Draft workspace, adoption of projects, cards, launch with the registry (the registry, M16, integrates at 1B like the cockpit) and the approval flow (its routing of big or strategic projects uses the conditional flow of GOV-06, which BRD v4.5 integrates at 1B, so the dry run of ONB-14 completes at 1B), the rule-based path, the AI processing authorization, boundary hardening and the three suites.
- **Milestone 1B:** the draft cockpit (the cockpit, M15, integrates at 1B), the Portfolio X-ray as attention items, delegation at full scope, the bring-your-own-AI path with its verified clients, onboarding metrics, the dry run of ONB-14 on projects routed by the conditional flow.
- **What may be tested as a variant in the pilot:** the compact against the expanded framing screen, step progress against outcome progress, showing the first signal as soon as a source is read against waiting for the draft, row-first against exception-first review on adoption and launch, and the wording of adoption. What may never be an experiment: whether a person approves, whether a privileged role is reviewed by name, the data authorization and the masking defaults, tenant isolation, and any security warning. A timer shown to create urgency is not a variant either (Section 4.3).
- **Pilot readiness:** the three suites pass; the acceptance list of Section 19.1 passes with the design partners; the targets of Section 19.2 are met, or the variance explained.

Every other P0 requirement of M23 is complete at Pilot readiness, as BRD v4.5 requires for every P0 requirement (BRD v4.5, 18.2).

# 17. Decisions and Open Questions

## 17.1 Decisions

| ID | Decision | Context and evidence | Recommendation assumed in this addendum | Needed by |
|------|------------------|----------------------------------|----------------------------------|------------|
| D-32 | Onboarding AI in Release 1 | BRD v4.5 lists hosting or training an LLM inside the platform as out of scope; understanding unstructured client input (handbooks, slide decks, meeting minutes, images) needs a language model; structured files with an unambiguous mapping are read without it (ONB-05) | Decided on 2 Oct 2026: a third-party LLM through an API, enabled per tenant; Metis builds and trains no model; tenants can keep it off and use the rule-based path or their own AI | Taken |
| D-33 | LLM provider | Customer documents reach the provider, so its terms must be compared before selection | Criteria: contractual no-training, zero or short retention, regional processing, a data processing agreement, model version pinning, the sub-processors the provider itself uses, and the transfer mechanism where processing leaves the customer's region; selection in Discovery. Pulled forward into the foundation group of decisions with D-38, because Release 1 sends customer content outbound on a P0 path | Discovery (foundation) |
| D-34 | Audit content of onboarding AI calls | Privacy against forensic value; the same question as Q-12 for MCP calls | Metadata and redacted excerpts by default; full content only for calls flagged as security events, kept 90 days | Release 1A design |
| D-35 | Undo window | Long enough to notice a wrong import, short enough to keep data stable | 14 days by default, tenant setting | Release 1A design |
| D-36 | Starting packs in Release 1 | One pack per kind of work offered in the pre-fill; Q-07 and Q-09 decide which kinds | Packs for the design partners' kinds of work, plus the two lifecycles that already exist (the Company A reference lifecycle, creative production) | Discovery |
| D-37 | Priority of CHG-10 | The executive's decision routing (ONB-03) uses change-approval thresholds, which are P1 in BRD v4.5 | Raise CHG-10 to P0 | Discovery |
| D-38 | Uploaded inputs and what deletion means | Provenance needs the source; some customers will not want their files kept; a quoted passage is itself source content, so one "delete" action cannot mean both things | Keep inputs in tenant storage under the tenant's retention policy, and offer two named actions: delete the original files (binaries removed, provenance metadata and quoted passages kept) and delete the source content (binaries, extracted text, fragments and quoted passages removed, a source identifier, a hash and the mark "source removed" kept), each stating what audit retention (D-34) and the backup purge period still hold. Pulled forward into the foundation group with D-33 | Discovery (foundation) |
| D-39 | Extraction-accuracy threshold | The accuracy suite (ONB-25) needs a pass level | Set in Discovery from the design partners' documents, per record type, with the corpus owned and versioned by the product team | Discovery |
| D-41 | Which roles are privileged at launch | A launch grants roles; granting tenant administration or workspace ownership has a different blast radius from granting a team role, and ONB-15 needs a list a test can read | Privileged: Tenant Admin, Workspace Owner, Executive or ExCo, Portfolio Manager or PMO, and any role that can approve, publish or change permissions; each is approved against the named person, with its access difference shown, and never in bulk (BR-51). Everything else is a standard role, approved in bulk | Discovery, before the launch transaction is built |
| D-42 | Which fields are high impact | A value that is wrong and assumed is cheap to fix for a project label and expensive for an approver or a budget baseline, so the risk class must be a list rather than a judgement at runtime | High impact: identity and access (people, roles, privileged grants), baseline budget and dates and their source authority, approvers, quorum and approval routing, and settings that cannot change later (currency, fiscal year, duration basis). These are never assumed or defaulted and are never kept by an auto-accept (BR-52); everything else is normal | Discovery, before the gap engine is built |
| D-43 | Which data classes a tenant allows outbound | Masking by field name cannot cover a handbook or a slide, and some customers will refuse whole classes rather than rely on detection | Per tenant: masking on by default for personal identifiers, payment and bank details, credentials and secrets, plus an explicit block list of classes that are never sent, with the residual risk of imperfect detection stated on the screen; the lawful basis, the sub-processors and the transfer mechanism stay with D-31, D-33 and Q-11 [Unverified - confirm with counsel per jurisdiction] | Discovery (foundation) |

## 17.2 Open questions

| ID | Question | Why it matters |
|------|----------------------------------------------------------|------------------------------------------|
| Q-14 | Which document types do the design partners actually hold? | Order of parser work (ONB-05) and the reference sets of the accuracy suite |
| Q-15 | Which languages must the onboarding agent handle in Release 1? | Accuracy suite, prompt pack, cards |
| Q-16 | Does EU AI Act Article 50 apply to Metis, and for which customers? | Transparency duties of Section 11.5; counsel to confirm |
| Q-17 | Do the design partners' IT policies allow external MCP connections? | Viability of the bring-your-own-AI path (Section 12) |
| Q-18 | What AI cost per onboarding fits the price? | Quotas and spend caps (ONB-24) |
| Q-19 | On the bring-your-own-AI path, does a quoted passage reported by the customer's AI count as evidence on its own, or must a person confirm it against the document before it can commit a project or lock a baseline? | Metis never read the source on that path, so the provenance trust model differs from the Metis AI path (Section 12.4, BR-53) |

# 18. Risks

| Risk | Impact | Mitigation |
|----------------------------------------|----------|------------------------------------------------------------|
| Wrong extraction paints a wrong portfolio | High | Sources on every value, badges, accuracy suite, launch review, undo window |
| Over-trust in baselines taken from documents | Medium | "From import" label; change requests as for any baseline (BR-47) |
| LLM provider outage, change or price rise | Medium | Rule-based path; model version pinning; suites before any change; provider criteria (D-33) |
| AI cost exceeds what the price allows | Medium | Quotas, spend caps, exact parsers first (Q-18) |
| Personal data in uploaded documents | High | Consent, masking by default, sub-processor list, retention settings |
| Executives still drop off | High | Metrics per step with a dropout reason (ONB-26); two rounds of usability tests with design partners in the UX phase (Section 16) |
| An executive launches a configuration that looks complete but grants the wrong access | High | Proposed role grants with the access difference; privileged roles approved by name; a server re-check at commit; the grant and its approver in the audit log (ONB-15, BR-51, D-41) |
| The 30-minute measure reports a success the clients did not have | High | Activation as one event with four parts, entry conditions for the cohort, five clocks, and a distribution with the share within target rather than a median (Section 4.1, ONB-26, 19.2) |
| A fast launch leaves a long queue for the organization | Medium to high | Values unconfirmed by risk class, load per owner, queue age and day 7 and day 14 overdue measured; the heaviest owners named before the approval; high-impact values never auto-kept (ONB-17, ONB-26, BR-52) |
| Owners ignore delegated tasks | Medium | Launch never waits; escalation; launch values kept by default |
| Release 1 grows | Medium | Own workstream; milestone placement of Section 16; P1 requirements stay out of Release 1 |

# 19. Acceptance Checklist and Onboarding Targets

## 19.1 Acceptance checklist

- From a tenant with pre-filled facts and a reference document set, an executive reaches the draft cockpit and then launches within the targets of 19.2, measured in moderated sessions with the design partners, with the session's five clocks recorded separately and the activation event raised only when all four of its parts hold (Section 4.1).
- A first signal from the client's own data appears while files are still being read, with its source link.
- The framing screen has three questions, none with a preset number, each skippable; the one-sentence answer sets the same values.
- Each supported input type is read; the kept-and-dropped report lists what was ignored and why; an MS Project or Project Online export becomes WBS items with dates and dependencies.
- Every value created by onboarding shows its source, or an "assumed" or "default" label.
- The executive sees no more cards than the cap; every other gap is assumed, defaulted, delegated or deferred and listed on the launch summary.
- In-flight projects are adopted at their current stage with their history before Metis; committed ones get a baseline from import; no gate decision is fabricated.
- Approve and launch runs the seven steps in one transaction; a failing check blocks the launch and names its fix.
- The launch summary leads with the outcomes reached, shows every role grant with its access difference, approves a privileged role against the named person and never in bulk, groups unconfirmed values by risk class, names the owners carrying the heaviest load, and lists what an undo would not remove.
- A high-impact value is never applied as assumed or defaulted, and is never kept by an auto-accept at a due date.
- A budget or date without a source authority does not make a project committed.
- An instruction hidden in a document changes no tool, no permission and no value, and appears as a quarantined finding with its source.
- Deleting the original files and deleting the source content behave as ONB-22 states, and neither claims to remove what audit retention or a backup purge still holds.
- Switching AI processing off, or revoking an onboarding token, refuses the next setup call and prevents an in-flight write from committing.
- An interrupted upload and a closed session both resume without duplicating a project, and reading continues on the server meanwhile.
- A pack's process framework is offered as a provider built-in published version; adapting one creates a workspace draft that only the Workspace Owner can publish.
- Undo within the window removes the batch's records that nobody changed and lists the others.
- Delegated tasks reach their owners; auto-accept keeps only values applied at launch; a suggestion after launch applies only when a person accepts it.
- A verified client sets up a Draft workspace from the prompt pack; launch happens only in Metis.
- With the onboarding AI switched off, the rule-based path sets up a workspace from structured files.
- The boundary, red-team and extraction-accuracy suites pass their criteria (Section 11.4).
- No customer content reaches the LLM provider before the tenant authorizes AI processing; masking is on by default and covers both named fields and the content classes a scanner finds.
- Every AI call, tool call, refusal and security event is in the tenant audit log.

## 19.2 Onboarding targets (proposed, to confirm with the design partners in Discovery)

Every measure below is reported per path (Metis AI, bring your own AI, rule-based) and, for time, as a distribution rather than a single number, because a median cannot show what the slowest quarter of clients experienced.

| Measure | Proposed target |
|---|---|
| Activation rate: eligible sessions reaching all four parts of activation (Section 4.1) | 80% or more of eligible sessions; the threshold is confirmed with the design partners in Discovery |
| Executive active open time to launch | Share within 30 minutes 80% or more; median, 75th and 90th percentile reported beside it |
| Executive active open time to the draft cockpit | Share within 15 minutes 80% or more; median and percentiles reported beside it |
| Elapsed time, user input time, processing wait time, external dependency time | Tracked separately per session; no target before the pilot, since they diagnose rather than grade |
| Time to the first signal from the client's own data | Within 2 minutes of the first file (15.2) |
| Cards generated, shown, answered, delegated, assumed past the cap, avoided by a parser or a pre-fill | Tracked; shown as a ceiling against a count, not as a completion rate |
| Values read with high confidence, assumed or defaulted, asked, by risk class | Tracked; no high-impact value applied as assumed or defaulted (a pass or fail, not a target) |
| Values corrected within 14 days of launch, per record type and for high-impact fields | Tracked as the accuracy signal; threshold after the pilot (D-39) |
| Sources opened before a value was accepted | Tracked as a trust signal |
| Privileged-role grants approved as exceptions | Tracked; every one named in the audit log |
| Values unconfirmed at launch by risk class, tasks per owner, queue age, overdue at day 7 and day 14 | Tracked; no owner above the load threshold at launch without being named on the summary |
| Delegated items closed by their due date | 80% or more |
| Undo used, bulk acceptance later reversed, launch cancelled after the summary | Tracked as trust signals |
| Onboarding sessions abandoned before launch | Tracked per step with a reason from the fixed list (ONB-26); target after the pilot |
| PM time to confirm their own adopted project | 5 minutes or less (median) |
| Executive launch complete, and delegated follow-through complete | Tracked as two figures, never merged (ONB-17) |

# Appendix A. Glossary Additions

| Term | Meaning |
|------------------------------|------------------------------------------------------------------------------|
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

# Appendix B. Wireframes

The twelve screens follow one onboarding at Nova Energy, the tenant created in wireframe 07 (Section 6.5). Screens 54, 55 and 57 also show Kite Logistics, a tenant that keeps the Metis AI off and uses the rule-based path and its own AI. Screens 46 to 54 form the Onboarding area of the wireframe gallery; 55 to 57 extend the access and tenancy screens 08, 04 and 07. Sample data is fictional and consistent across the twelve screens.

Nova Energy and Kite Logistics are separate sample tenants, as Acme Holdings is in the main BRD; nothing needs to match between them. Each sample tenant has its own identifier namespace in the test fixtures, and no email, project identifier or person is reused across tenants unless a test deliberately checks isolation, which keeps the fixtures usable by the tenant isolation suite (TEN-02).

| Screen | Area | Phase | Wireframe | Requirements | POC |
|--------------------------|------------|-------|----------------------------|------------------------------------|--------|
| Onboarding: frame | Onboarding | MVP | 46-onboarding-frame | ONB-01, ONB-02, ONB-03, ONB-04, ONB-09, ONB-22, ONB-27 | none |
| Onboarding: reading | Onboarding | MVP | 47-onboarding-reading | ONB-01, ONB-04, ONB-05, ONB-06, ONB-07, ONB-08, ONB-09, ONB-11, ONB-12 | none |
| Onboarding: draft cockpit | Onboarding | MVP | 48-onboarding-draft-cockpit | ONB-03, ONB-08, ONB-09, ONB-11, ONB-13, EXE-01, EXE-02, BR-39 | none |
| Onboarding: approval flow | Onboarding | MVP | 49-onboarding-approval-flow | ONB-03, ONB-14, ONB-27, GOV-03, GOV-05, GOV-06, GOV-21, CHG-10 | none |
| Onboarding: questions and conversation | Onboarding | MVP | 50-onboarding-questions | ONB-11, ONB-12, ONB-17, ONB-28 | none |
| Onboarding: projects to adopt | Onboarding | MVP | 51-onboarding-adoption | ONB-10, ONB-08, BR-46, BR-47, CHG-06, CHR-16 | none |
| Onboarding: launch | Onboarding | MVP | 52-onboarding-launch | ONB-15, ONB-16, WSP-14, GOV-21, BR-44, PLT-03 | none |
| Onboarding: owner tasks | Onboarding | MVP | 53-onboarding-owner-tasks | ONB-08, ONB-17, ONB-18, ONB-19, BR-48, PLT-09 | none |
| Onboarding: rule-based import | Onboarding | MVP | 54-onboarding-rule-based | ONB-05, ONB-20 | none |
| Set up with your own AI | Access & tenancy | MVP | 55-onboarding-own-ai | ONB-07, ONB-21, MCP-15, MCP-20, ONB-39 | none |
| Tenant admin: AI onboarding policy | Access & tenancy | MVP | 56-tenant-admin-ai-onboarding | ONB-07, ONB-22, ONB-23, ONB-24, ONB-25, ONB-26, TEN-04, MCP-11, BR-49, BR-50 | none |
| Provider console: tenant pre-fill and onboarding metrics | Access & tenancy | MVP | 57-provider-onboarding | ONB-02, ONB-26, TEN-01, TEN-08 | none |

**What these screens cannot prove.** Every P0 requirement of this module is mapped to a screen, which is traceability and not proof of behaviour: a screen shows that a policy or a result is surfaced, not that a boundary holds, a transaction rolls back or a suite passed. These requirements therefore carry a second kind of evidence, and the build reports the counts per type (generated from brd/source/addendum-onboarding/evidence.tsv):

| Requirement | Evidence type | What proves the behaviour | What the screen does prove |
|---|---|---|---|
| ONB-01 | contract test | Resume test across devices, with an interrupted upload and a closed session during reading | The session card, its saved state and the step it reopens at |
| ONB-06 | contract test | Reference corpus with the resolved, missing and ambiguous identity cases | The reading feed and the questions the agent raises |
| ONB-07 | contract test | Tool-class test on draft-only writes, schema rejection, object caps and idempotency | The screens naming the setup tools and their draft-only scope |
| ONB-15 | contract test | Transaction and fault-injection test, including a refused privileged grant at commit | The summary, the access difference and the approval control |
| ONB-16 | contract test | Post-launch undo scenarios over changed, unchanged and dependent records | The undo window, its scope and the list of what it cannot remove |
| ONB-21 | contract test | Token scope and revocation test, with a write in flight at revocation | The token page, its limits and the connection test |
| ONB-22 | legal decision | Data processing agreement, lawful basis and sub-processor and transfer matrix, with a masking and deletion test | The authorization screen, the masking switch and the two deletion actions |
| ONB-23 | security suite | Boundary suite: cross-tenant probing, enumeration, error envelope and timing band | The policy and evidence surfaces of the tenant admin screen |
| ONB-24 | security suite | Red-team suite per file type, plus parser, cost and tool-policy tests | The guardrail list and the quarantined findings |
| ONB-25 | security suite | The versioned suite reports themselves, with the provider, model, prompt and dependency versions | That the latest suite results are shown to the tenant admin |
| ONB-26 | contract test | Event schema and metric reconciliation test, including the five clocks and the activation event | The metrics surfaces of the provider and tenant consoles |

![Wireframe 46-onboarding-frame: Onboarding: frame. First onboarding screen for a new client's executive: four pre-filled facts collapsed to chips, three outside-in questions with only the governance one expanded, a one-sentence override, the drop zone as the primary action, and the AI processing authorization that opens when the first file is ready to send.](../../design/wireframes/png/46-onboarding-frame.png)

![Wireframe 47-onboarding-reading: Onboarding: reading. Metis reads the dropped files: a live feed per file of what was found and how, running totals, provenance on every value, cards that stream in while reading, items already sent to owners, and the resumable session.](../../design/wireframes/png/47-onboarding-reading.png)

![Wireframe 48-onboarding-draft-cockpit: Onboarding: draft cockpit. The executive cockpit of the Draft workspace, built from the client's own files: Draft banner, figures with source badges and as-of time, the projects that may slip first, the business units, the Portfolio X-ray with owners, and the to-confirm rail.](../../design/wireframes/png/48-onboarding-draft-cockpit.png)

![Wireframe 49-onboarding-approval-flow: Onboarding: approval flow. How a project gets approved, in business words for the executive: the lifecycle read from the PMO handbook and matched to the Capital projects pack, the big-or-strategic boundary computed from the client's data, the differences from the pack, and the dry run on three real projects.](../../design/wireframes/png/49-onboarding-approval-flow.png)

![Wireframe 50-onboarding-questions: Onboarding: questions and conversation. The cards an executive answers in the 30-minute path: a single card with its sourced best guess, a bulk card, a contradiction card sent to its owner, the cap, the conversation panel, and the same card on a phone.](../../design/wireframes/png/50-onboarding-questions.png)

![Wireframe 51-onboarding-adoption: Onboarding: projects to adopt. Bringing 34 running projects into Metis, reviewed by exception: four counts, then the 7 projects whose source authority, sponsor or stage needs the executive, each with its action; the 27 ready ones sit behind a tab, and one project panel shows the stages completed before Metis and what the imported baseline will lock.](../../design/wireframes/png/51-onboarding-adoption.png)

![Wireframe 52-onboarding-launch: Onboarding: launch. Launch summary that leads with the four outcomes reached, then the exceptions: access changes with privileged roles approved by name and their access difference, unconfirmed values grouped by risk class with two blocking the launch, the load per owner, the readiness results, and what an undo would not remove.](../../design/wireframes/png/52-onboarding-launch.png)

![Wireframe 53-onboarding-owner-tasks: Onboarding: owner tasks. After launch: the finisher's task list with pre-filled values and sources, the completeness bar the executive sees, the rule that keeps launch values by default at the due date, a suggestion from a new document waiting for a person, and a task raised at the moment of need.](../../design/wireframes/png/53-onboarding-owner-tasks.png)

![Wireframe 54-onboarding-rule-based: Onboarding: rule-based import. Setup with the Metis onboarding AI switched off: columns of a project list mapped by header rules, status colours read as health, an MS Project plan read exactly, and the kept-and-dropped report before anything is written.](../../design/wireframes/png/54-onboarding-rule-based.png)

![Wireframe 55-onboarding-own-ai: Set up with your own AI. The bring-your-own-AI path: the admin switch for the setup tool group, an onboarding token limited to the setup tools and the Draft workspace, the connection test, the copy-ready prompt pack and a live feed of what the client's AI proposes; launch stays in Metis.](../../design/wireframes/png/55-onboarding-own-ai.png)

![Wireframe 56-tenant-admin-ai-onboarding: Tenant admin: AI onboarding policy. Tenant admin page for the onboarding AI: consent and processing, masking, what happens to uploaded files, quotas and spend cap, the setup tool switch for external clients, security events, the assurance evidence of the current release, and the onboarding metrics of the tenant's own sessions.](../../design/wireframes/png/56-tenant-admin-ai-onboarding.png)

![Wireframe 57-provider-onboarding: Provider console: tenant pre-fill and onboarding metrics. Provider console: onboarding metrics per tenant without any business data, and the create-tenant dialog extended with the facts and answers recorded from the sales discovery.](../../design/wireframes/png/57-provider-onboarding.png)


# Appendix C. Options Considered

Sixty-three options were assessed (S13). This appendix records the approaches compared and where each group of options landed.

## C.1 Three approaches

| Criterion | Draft first (kept) | Conversation first | Delegate first |
|---|---|---|---|
| Executive time to the draft cockpit | About 15 minutes (target) | 20 to 30 minutes, depending on the conversation | Not in the first session; after owners answer |
| Feels like | Seeing my company in the product, then fixing by exception | Talking to a consultant | Assigning a project to my team |
| Reviewing 30 projects and 80 people | Fast: tables and bulk confirmation in context | Slow: long lists do not fit a conversation | Fast for the executive, slow overall |
| Risk of drop-off | Low: value appears before any effort | Medium: long conversations tire | High: momentum depends on others |
| Data accuracy | High: sources shown, owners asked for the uncertain items | Medium: one person's memory | Highest: owners answer for their own data |
| Fit with BR-35 and GOV-21 | One draft, one approval in the application | Many small approvals inside a conversation | Many approvals by many people |

The catalogue (S13) also compared build effort. That criterion is not repeated here: its rating for "draft first" assumed a separate draft layer across entities, and the approved design keeps the draft in the Draft workspace instead (Section 9.2).

The product owner kept "draft first", added the framing questions of "conversation first" before the drop and the owner tasks of "delegate first" after launch, with three fixes: at most three framing questions, questions while reading, and a launch that never waits for delegated answers (S7).

## C.2 Where the options landed

| Group | Kept for Release 1 | After Release 1 | Not kept |
|---|---|---|---|
| Getting data in | Drop and paste anything; photos and screenshots; exports from current tools; bring your own AI (ONB-04, ONB-05, ONB-21) | Voice note, forwarding address, cloud folder, directory, pre-boarding (ONB-28 to ONB-31, ONB-34); public company documents, meeting recordings and calendar reading, with no requirement yet (consent risk for recordings, S10) | None |
| Reading and converting | Two-lane reading, sources on every value, confidence bands, entity resolution, contradictions, status and colour translation, operating model from documents, closest reference model, plans to WBS, kept-and-dropped report, suspicious content flag (ONB-05, ONB-06, ONB-08, ONB-13, ONB-20, ONB-27) | Capacity and budget sheets beyond what launch needs, charters from contracts, with no requirement yet | None |
| Value before setup | Draft shown as the product; Portfolio X-ray (ONB-09, ONB-13) | Board pack reproduction; walkthrough of the client's portfolio (ONB-32, ONB-33); next-quarter preview, with no requirement yet | None |
| Asking only what is missing | Ask, assume, default, delegate or defer; one-tap cards; bulk confirmation; ask the owner; conversation; card cap; questions at the moment of need (ONB-11, ONB-12, ONB-17, ONB-19) | Voice answers (ONB-28); answers by email, with no requirement yet | None |
| People and access | Identity off the critical path; people from documents; placeholders (ONB-09, ONB-17) | IT setup link and domain capture (ONB-35) | None |
| Operating model | Approval flow in business words; dry run; starting packs (ONB-14, ONB-27) | None | None |
| Safety and trust | Draft held in the Draft workspace (the catalogue's Setup Plan); undo window; guardrails; AI processing authorization; short-lived tokens (ONB-09, ONB-16, ONB-21 to ONB-25) | None | A separate staging layer (Section 9.2) |
| Bring your own AI path | Prompt pack and guide as copy-ready text; errors written for the LLM (ONB-21, ONB-07) | Preview inside the client's AI and the prompt pack served as MCP prompts (ONB-39) | None |
| After launch | Owner tasks; onboarding metrics (ONB-17, ONB-26) | Configuration suggestions from usage (ONB-40) | None |
| Wild cards | None | Setup party and overnight completion; human concierge (ONB-37, ONB-38); onboarding without opening Metis, with no requirement yet | A fully automatic launch (contradicts BR-35; S10) |

# Appendix D. Market Evidence

The research notes (S8 to S10) hold every claim below with its URL, date and verification status, except the OWASP and EU AI Act rows, which rest on S11, S12 and the pages cited in the approved design (S7). The table lists the claims this addendum relies on and the market evidence behind its design.

The third column names what kind of evidence each row is, and the fourth what the design is allowed to take from it, because the strength differs by an order of magnitude across these rows: a peer-reviewed meta-analysis supports a direction, a vendor benchmark supports nothing beyond that vendor's context, a case report shows that something can happen and never how often, and a legal text binds only where it applies. A row that shows a pattern exists is never read as a pattern that guarantees an outcome, and no figure from another market becomes a target for this product.

| Claim | Source (accessed 2 October 2026 unless stated) | Evidence type | What the design may take from it |
|---|---|---|---|
| monday magic builds a workspace from a prompt or from Excel, CSV, PDF or DOCX, asks clarifying questions when the input is insufficient, and previews before commit | support.monday.com/hc/en-us/articles/27740074397842 (created 30 Jun 2025, updated 24 Sep 2026; read in S8 through the Help Center API, while S10 could not open the page) | Vendor product documentation | Pattern: a prompt or a file becomes a draft that is previewed before commit. No effect size |
| Jira shows a suggested space configuration for review, built from a prompt, documents, CSV or PDF, and lets people be invited while it builds | support.atlassian.com/jira-software-cloud/docs/create-a-new-project/ | Vendor product documentation | Pattern: review before commit, invite while the draft builds |
| Microsoft Planner builds plans from Word, Excel or PowerPoint files, with review before creation | support.microsoft.com/en-us/planner/what-can-you-do-with-planner-agent-in-copilot | Vendor product documentation | Pattern: documents become a draft reviewed before creation |
| Microsoft retired Project Online on 30 Sep 2026; projects are no longer accessible in the service afterwards | Microsoft 365 Message Center MC1478955, through mc.merill.net/message/MC1478955 (24 Sep 2026) | Vendor service notice, through a mirror | Market timing only; re-check before any external use [Unverified] |
| ServiceNow SPM has a setup hub with progress; the fiscal calendar type cannot change after funds are allocated | servicenow.com/community/spm-articles/quick-start-guide-for-strategic-portfolio-management/ta-p/2990613 (updated 11 Aug 2026) | Vendor product documentation | Pattern: a setup hub with progress, and a warning on a setting that cannot change |
| Planview ProjectAdvantage suggests deliverables across phases and gates at project setup | planview.com/products-solutions/products/planview-vantage/ (modified 1 Sep 2026) | Vendor product page | A competitor capability exists; says nothing about onboarding quality |
| Published implementation times, all vendor claims: Celoxis 2 to 6 weeks; Planisware 4 to 9 months for enterprise and 12 to 18 months for global rollouts; monday.com 6 to 12 months for traditional PPM against 2 to 4 weeks for itself | celoxis.com/article/organization-project-management-tools (17 Apr 2026); planisware.com/resources/selecting-tool/how-choose-perfect-project-and-portfolio-management-tool-5-steps (28 Sep 2023); monday.com/blog/project-management/project-portfolio-management-software/ (27 Jan 2026) | Vendor claims | Marketing comparison only; never an independent baseline [Unverified] |
| No PPM vendor reviewed claims a governed setup in under an hour (a finding of the competitor review, not a vendor statement) | S8, sections 17 and 18 | Own review of a sample (S8) | Keep the wording "in the reviewed set"; not a market-wide proof [Unverified beyond the sample] |
| Extraction and import tools gate on confidence and show their evidence, as the vendors describe them: Flatfile's Automap plugin can be set to accept a mapping only when every mapped field reaches a stated confidence level (strong, above 90%, or absolute, 100%) and runs a failure callback when it aborts for low confidence; Docusign Iris Worksheets results can include citations, reasoning and confidence indicators; UiPath Cartographer, released 23 Sep 2026 with no independent results yet, gives every fact a source and a verifier and surfaces the contradiction when two people give different answers | flatfile.com/docs/plugins/automap; docusign.com/blog/developers/developers-guide-docusign-iris-agentic-capabilities; uipath.com/blog/product-and-updates/biggest-product-announcements-fusion-2026 (23 Sep 2026) | Vendor product documentation | Pattern: gate on confidence and show the evidence; UiPath has no independent result yet |
| Defaults shift choices: meta-analysis of 58 studies, d = 0.68 | doi.org/10.1017/bpp.2018.43 (Jan 2019) | Peer-reviewed meta-analysis | Direction only: defaults pull, so provenance and a one-click change are required. The magnitude is not transferred to this product |
| In checkout flows, the number of form fields affects usability far more than the number of steps; the average checkout has 11.3 fields while 8 are enough | baymard.com/blog/checkout-flow-average-form-fields (26 Jun 2024) | Industry research, e-commerce context | Qualitative lesson only: field count matters more than step count. No target for Metis |
| A head start on progress raised completion from 19% to 34% (loyalty cards at a car wash) | academic.oup.com/jcr/article-lookup/doi/10.1086/500480 (Mar 2006; figures through a secondary source) | Peer-reviewed, figures through a secondary source | Direction only: a head start helps, which is why the pre-fill exists. The exact figures stay marked [Unverified] |
| 72% of three-step tours were completed against 16% of seven-step tours | chameleon.io/benchmark-report-2022 (2022, vendor data) | Vendor benchmark | Not causal and not from this market; it does not justify a fixed number of steps [Unverified] |
| If-then plans raise follow-through, d = .65 | doi.org/10.1016/S0065-2601(06)38002-1 (2006) | Peer-reviewed | Supports owner plus due date on every delegated item; no forecast of closure rates |
| Nominate, approve and auto-approve at a deadline: Lattice locks in and approves peer nominations a manager has not approved by the end of peer selection; Culture Amp has an optional date when peer nominations are approved automatically | help.lattice.com/en-us/articles/15179229-what-happens-if-a-manager-hasn-t-approved-nominations-before-peer-selection-ends; support.cultureamp.com/en/articles/10398426-launch-a-unified-performance-review-cycle | Vendor product documentation | Analogy for auto-accept at a due date, with the guardrail that high-impact values never auto-keep |
| Imports can be undone within a window: HubSpot restores the changes of a named import within 14 days; Linear lets an import be deleted for a limited time after creation | knowledge.hubspot.com/object-settings/restore-crm-changes (14 Aug 2026); linear.app/docs/import-issues | Vendor product documentation | Supports a reversible import window and its stated scope |
| DNS domain verification can take up to 72 hours | support.atlassian.com/user-management/docs/verify-a-domain-to-manage-accounts/ | Vendor product documentation | Keeps identity work off the executive clock |
| Stripe's MCP server asks a person to approve certain writes through a URL; unapproved actions expire after 24 hours; IT may block external MCP servers; it advises caution when it is used with other MCP servers, to avoid prompt injection | docs.stripe.com/mcp | Vendor product documentation | Supports human confirmation of writes and caution about other connectors in the same session |
| ServiceNow Build Agent asks for confirmation of the requirements before it builds ("Approve plan"), lets the user preview the code before approval, and creates a checkpoint after each approved task plan to which the app can be restored | github.com/ServiceNow/ServiceNowDocs/blob/australia/markdown/application-development/create-a-new-application-using-build-agent.md (lines 60, 73, 75, 85); github.com/ServiceNow/ServiceNowDocs/blob/australia/markdown/application-development/ba-conversational-change-log.md (lines 16, 23, 33, 39, 44) | Vendor product documentation | Supports plan, review, apply, and a restore point |
| Atlassian's Rovo MCP server keeps its admin tool group disabled until an admin enables it | support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/ | Vendor product documentation | Supports a setup tool group that is off until an admin enables it |
| Asana's MCP server offers preview tools that draft a project for review before creating it | developers.asana.com/docs/mcp-tools-reference | Vendor product documentation | Supports prepare before create |
| Prompt injection through MCP has been shown to expose data (Supabase, GitHub) | simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/ (6 Jul 2025); invariantlabs.ai/blog/mcp-github-vulnerability (26 May 2025) | Case reports | Threat evidence for the design of Section 11; no incidence rate |
| A bug in Asana's MCP server could have exposed data to other accounts | upguard.com/blog/asana-discloses-data-exposure-bug-in-mcp-server (page dated 2 Jul 2026) [Unverified - confirm the incident year before citing] | Case report, year unverified | Threat evidence only; the mark stays [Unverified] |
| Recording meetings carries a consent risk: a federal class action filed on 15 Aug 2025 alleges that Otter recorded private conversations without asking meeting attendees for permission (allegations, not findings) | npr.org/2025/08/15/g-s1-83087/otter-ai-transcription-class-action-lawsuit (15 Aug 2025) | Court filing, allegations | Reason to keep recordings out of scope; not a finding of liability |
| AI-built configuration has gone wrong in the market: in the Setup with Agentforce beta, complex field types such as the custom Address field can come back as Text Areas, and the guide advises treating anything the AI configures as a draft; a Replit agent deleted a live production database during a code and action freeze | sfdcdevelopers.com/2026/04/08/setup-with-agentforce-a-technical-guide-for-salesforce-admins/ (8 Apr 2026); fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/ (23 Jul 2025) | Vendor and secondary material | Cautionary examples behind draft-first and undo; no quantitative claim |
| OWASP Top 10 for LLM Applications 2025 lists prompt injection, sensitive information disclosure, improper output handling, excessive agency, system prompt leakage, misinformation and unbounded consumption among its ten risks | genai.owasp.org/llm-top-10 (2025 edition) | Standards body, verified 3 Oct 2026 | Used directly as the threat taxonomy of Section 11 |
| OWASP states that critical controls must not be delegated to the LLM and that sensitive information must not sit in system prompts | genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/ (LLM07:2025 System Prompt Leakage) | Standards body, verified 3 Oct 2026 | Used directly: authorization in code on the server, no secret in a prompt |
| OWASP lists adversarial testing that treats the model as an untrusted user among the mitigations of prompt injection | genai.owasp.org/llmrisk/llm01-prompt-injection/ (LLM01:2025 Prompt Injection) | Standards body, verified 3 Oct 2026 | Used directly for the red-team suite of ONB-25 |
| EU AI Act Article 50(1): people must be informed that they are interacting with an AI system, from 2 August 2026 | artificialintelligenceact.eu/article/50 [Unverified - confirm applicability to Metis with counsel] | Legal text, verified; applicability not | The disclosure duty shapes the AI attribution; applicability to Metis stays with counsel [Unverified, Q-16] |
