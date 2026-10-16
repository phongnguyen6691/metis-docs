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
