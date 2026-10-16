![](../../design/brand/logo/metis-wordmark@2x.png){width=1.5in}

::: {custom-style="Title"}
BUSINESS REQUIREMENTS DOCUMENT ADDENDUM
:::

::: {custom-style="Subtitle"}
Onboarding in 30 Minutes: Enterprise Portfolio Intelligence & Governance Platform
:::

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

```{=openxml}
{{TOC}}
```

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
