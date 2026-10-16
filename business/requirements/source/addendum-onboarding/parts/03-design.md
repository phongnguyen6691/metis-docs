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
