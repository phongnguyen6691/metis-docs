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

{{WIREFRAME_TABLE}}

**What these screens cannot prove.** Every P0 requirement of this module is mapped to a screen, which is traceability and not proof of behaviour: a screen shows that a policy or a result is surfaced, not that a boundary holds, a transaction rolls back or a suite passed. These requirements therefore carry a second kind of evidence, and the build reports the counts per type (generated from brd/source/addendum-onboarding/evidence.tsv):

{{EVIDENCE_TABLE}}

{{WIREFRAME_FIGURES}}

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
