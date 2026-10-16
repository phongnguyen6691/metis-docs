---
title: Security architecture
summary: The planned sign-in, permissions, audit, secrets, edge, file and supply-chain controls, and the certification path.
component: all
type: overview
status: draft
ids: []
---

# Security architecture

Planned, not built: no sign-in, permission check, audit log or certification exists yet, because the backend does not. The app has no sign-in flow either: "Sign in again" and "Request access" are text labelled "Not built yet". This page describes what the owner's backend proposals plan, and marks what the owner has decided.

Sources and statuses are written as on [Architecture overview](overview.md). `[Source: ..., line N of the original]` names a line of a file in the owner's private store. "Decided" means a current decision record, and "proposed" means a draft one. "Carried over, confirm" marks a line of the system draft, which the backend proposals superseded and which was written for another stack. A platform statement cites the page and the date it was read, or carries `[Unverified - confirm before applying]`.

## Sign-in and sessions

Proposed: [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) (draft).

- Keycloak 26.x does the sign-in: SSO for each organization, just-in-time provisioning, MFA (TOTP, WebAuthn, passkey and recovery codes), SCIM and the OAuth server for MCP. Magic links for outside guests come from an authenticator that Metis writes itself. [Source: backend proposals, line 50 of the original, columns 1 to 3]
- Per tenant, SSO is SAML 2.0 or OIDC, the user is created and attached to the tenant at the first sign-in, and MFA can be made mandatory. [Source: system draft, line 263 of the original, carried over, confirm]
- Keycloak is open-source software of the CNCF, accepted at the Incubating level. [Source: cncf.io/projects/keycloak/, read 12 Oct 2026] Because Metis runs it, it has no certification of its own and is covered by Metis's controls and the penetration test. [Source: backend proposals, line 283 of the original, column 4]
- Sessions, carried over, confirm: the web build holds a cookie session kept by the `api`, so the browser never holds a token, and the cookie is HttpOnly, Secure and SameSite. The iOS and Android builds use OAuth 2.1 with PKCE through the system browser and keep the token in the key store of the device, with `expo-auth-session` and `expo-secure-store`, which the draft says are still supported in Expo SDK 57. [Unverified - confirm before applying] [Source: system draft, line 269 of the original]
- The BRD requires that no workspace is reachable without an authenticated session, and that sessions persist across browser restarts until expiry or sign-out (PLT-01). Sign-in methods are enabled for each tenant (TEN-03), through one identity layer (D-03).
- Open: the sources describe no sign-in screen, no session length and no token lifetime for the app.

## Keycloak gaps

| Gap | What the sources say | How the proposals close it | Source |
|---|---|---|---|
| Magic link | Keycloak has no ready-made magic link, and the extension of one vendor is under the Elastic License 2.0. [Unverified - confirm before applying] The system draft says that extension needs a licence review before use in a SaaS. Metis writes its own authenticator on an interface that Keycloak itself calls internal. | Pin the Keycloak version, run the authenticator's tests on every new version before upgrading, and consider a Red Hat build. | Backend proposals, line 222, and system draft, line 265 of the original |
| Domain ownership | Keycloak assigns organization members by email domain without proof that the tenant owns the domain. An open bug (#53815, affecting 26.8.0) grants membership by domain without checking that the email is verified. [Unverified - confirm before applying] | Metis checks a DNS record before it adds a domain to a tenant, and accepts only users with a verified email. | Backend proposals, line 223, and system draft, line 266 of the original |
| OAuth for MCP | Client ID Metadata Documents and the `resource` parameter of RFC 8707 are still experimental in Keycloak 26.8. | The MCP gateway checks the audience of the token itself, and the setup is tested with real LLM clients before go-live. | Backend proposals, line 224 of the original |

On the internal interface: the Keycloak documentation says of the Authentication SPI, "This is an internal SPI" and "any new release of Keycloak can change it without prior notice". [Source: keycloak.org/docs/latest/server_development/index.html, read 12 Oct 2026] On OAuth for MCP: the Keycloak release notes list the Client ID Metadata Document feature as experimental in 26.6.0, and the notes read do not mention the `resource` parameter of RFC 8707. [Source: keycloak.org/docs/latest/release_notes/index.html, read 12 Oct 2026]

The launch plan of the system draft was dynamic client registration, with the audience checked through a client scope for each tenant, and the other two features turned on when Keycloak supports them. [Source: system draft, line 249 of the original, carried over, confirm] Revision 2026-07-28 of the MCP specification deprecates dynamic client registration in favour of Client ID Metadata Documents, and keeps it only for backward compatibility. [Source: modelcontextprotocol.io/specification/2026-07-28/changelog, read 12 Oct 2026] So the carried-over launch plan depends on a mechanism the specification deprecates, and it is open until the owner decides (see Open questions).

A further open item of the system draft is a bug report about server-side request forgery when Client ID Metadata Documents are enabled in Keycloak (#53812, not read). [Source: system draft, line 319 of the original, carried over, confirm] The MCP security guidance explains the risk: an authorization server that supports these documents takes a URL from an unknown client and fetches it. [Source: modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices, read 12 Oct 2026]

## MCP authorization and tokens

Proposed: [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) (draft).

- The gateway checks the OAuth token and the audience of each tenant, then calls the core API. It never touches the database. [Source: backend proposals, line 30 of the original] The MCP specification requires an MCP server to validate that an access token was issued specifically for it as the intended audience, and to accept only tokens valid for its own resources. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026]
- Authorization is OAuth 2.1 through Keycloak. The MCP server publishes its metadata under RFC 9728, checks the audience of the token and accepts the `resource` parameter of RFC 8707. [Source: system draft, line 249 of the original, carried over, confirm] The specification makes these two obligations: a server must implement Protected Resource Metadata, and a client must send `resource` whether or not the authorization server supports it. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026]
- Personal tokens are hashed, revocable, and have a scope and an expiry. A token is shown once (MCP-02, D-29). [Source: system draft, line 249 of the original, carried over, confirm]
- A token never travels in a URL. The BRD says so (the AI interface security row of section 17), and the specification requires that access tokens are not included in the URI query string. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026]
- The permission of a call is the intersection of the roles of the user and the scopes of the token (MCP-04). The tenant admin keeps a list of allowed MCP clients (MCP-20). [Source: system draft, line 250 of the original, carried over, confirm]
- The tools are generated from the command catalog. A tool has a confirmation mode, `per_call` or `batch_launch`. An undo works while the field still holds the value the command set. Calls are rate limited, and the audit records the token and the name of the client (MCP-11). [Source: system draft, line 251 of the original, carried over, confirm]
- There are 17 tools in four action classes. MCP never approves, decides, changes a baseline, deletes or changes permissions (MCP-08, D-30). [Source: backend brainstorm log, line 34 of the original]
- Tools return data and never act on text found in records (MCP-16).

The MCP security guidance describes "token passthrough" as an MCP server that accepts a token from a client and passes it through to a downstream API. It says the authorization specification explicitly forbids it, and that MCP servers must not accept any token that was not explicitly issued for them. [Source: modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices, read 12 Oct 2026] The proposals say the gateway calls the core API after it checks the token. They do not say how the core learns the user and the scopes of the call. This is open (see Open questions).

## Permissions

Proposed: [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) (draft) and [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](decisions/command-catalog.md) (draft).

- The permission matrix is data that a machine can read: roles, actions, scope and approval thresholds. The effective permission is the union of the workspace role and the project role within the tenant policy (D-15). [Source: system draft, line 270 of the original, carried over, confirm]
- The dispatcher of commands checks it for every channel, so the app, MCP, workflows and agents meet the same check. [Source: backend proposals, line 28 of the original; system draft, line 270 of the original, carried over, confirm]
- Each command in the catalog names the permission it needs, its scope (tenant, workspace or project) and its action class. [Source: backend proposals, line 26 of the original; system draft, line 133 of the original, carried over, confirm]
- The matrix of permission tests for the 16 roles is generated from the catalog. [Source: backend proposals, line 27 of the original]
- The BRD requires that roles and record-level permissions are enforced in the user interface and on the server (PLT-04).

## Audit

Proposed: [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) (draft).

- The audit row is written in the same transaction as the write, so a write without its audit entry cannot commit. [Source: backend proposals, line 28 of the original]
- An entry records who acted, when, the value before and after, and the reason. It cannot be edited or deleted. One envelope serves people, AI and support staff. [Source: backend brainstorm log, line 33 of the original] Authorized roles can export it (PLT-11).
- Carried over, confirm: the log is an append-only table partitioned by month, with a hash chain for each tenant that exposes any edit. A daily export goes to object storage in a write-once mode, where nobody can delete or overwrite during the retention period, the account owner included. The subject types are person, AI through MCP, support staff, automation and system. [Source: system draft, line 204 of the original]
- The earlier draft used the write-once mode of one cloud's object store. Whether the object store of the chosen provider has an equivalent is not checked. [Unverified - confirm before applying]
- Every MCP call is logged with the user, the token, the name of the client, the tool, a summary of the parameters, the result and the time (MCP-11).

## Secrets

- The BRD asks for signing keys, token hashes and integration credentials to be kept in a managed secret store with rotation, never logged and never shown again after creation. [Source: backend brainstorm log, line 30 of the original; the Secrets row of BRD section 17]
- Each tenant has its own secret store for the keys of its connectors. [Source: backend brainstorm log, line 107 of the original]
- The keys of the LLM provider are held by the LLM gateway, outside the process that can write. [Source: backend brainstorm log, lines 108 and 135 of the original]
- Controls built from the first day, carried over, confirm: SSO and MFA for the staff, least privilege, encryption at rest and TLS in transit, a secret store with rotation, scanning of dependencies and containers in continuous integration, a software bill of materials, signing of containers, branch protection, an independent penetration test before go-live, and a cross-tenant check on every release. [Source: system draft, line 291 of the original] The system draft names the services of one cloud for some of these, which do not apply to the drawn layout, so those parts are not carried over.
- Open: which secret store holds the keys, and how data is encrypted at rest on the chosen provider.

## Agents and LLMs

Proposed: [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) (draft).

- The agent is a small service outside the core. It reaches Metis only as an MCP client, through the gateway, with a short-lived token of narrow scope that carries the permissions of the person who created the workflow. Heavy actions need a person's approval. No agent touches the database. [Source: backend proposals, line 31 of the original; backend brainstorm log, line 109 of the original]
- Each run of an agent is a Temporal workflow, and each model call and tool call is a step, so a run survives a restart and can wait for approval. [Source: backend proposals, line 32 of the original]
- One shared LLM gateway holds the provider keys, pins the model versions, caps use for each tenant and audits the calls. [Source: backend brainstorm log, line 108 of the original] The BRD fixes what it serves: the provider criteria of D-33 (a contractual no-training term, zero or short retention, regional processing, a data processing agreement and model version pinning) and the audit content of D-34. [Source: system draft, line 258 of the original, carried over, confirm]
- The agent calls MCP itself and does not use the MCP connector built into the API of the model provider, because that connector does not get the provider's mode without data retention. [Unverified - confirm before applying] [Source: system draft, line 258 of the original, carried over, confirm]
- The provider named in the proposals is Claude, reached through Cloudflare AI Gateway. [Source: backend proposals, line 56 of the original, columns 1 to 3] The proposals list for the provider: no use of API data for training, incident notice within 48 hours, deletion of data within 30 days after termination, data stored in the United States, and the certifications SOC 2 Type II, ISO 27001:2022 and ISO 42001. [Unverified - confirm before applying] [Source: backend proposals, line 289 of the original, column 4]
- The API of the provider routes requests globally by default. [Unverified - confirm before applying] [Source: backend proposals, line 128 of the original] D-33 lists regional processing as a criterion, so this has to be settled before the provider is selected. Selection belongs to Discovery under D-33.
- Text that reads like an instruction, found in an uploaded document, is set aside with its source and reported, and the surrounding content is still read. [Source: system draft, line 259 of the original, carried over, confirm] The onboarding agent holds no credential, hostname or authorization rule in its context (ONB-24).
- Customers write no code that runs in a workflow. Decided: [Internal rules, connectors, AI and agent steps; no customer code](decisions/automation-scope.md) (current).

## Edge and egress

Proposed: [Cloudflare at the edge](decisions/edge-cloudflare.md) (draft) and [Controlled egress for connectors and agents](decisions/egress-control.md) (draft).

- Cloudflare provides the domain names, the CDN, a web application firewall, protection against attacks that take the service down, and bot rules with an exception for the mobile app. It protects every connection, and the MCP endpoint is served only over TLS. [Source: backend proposals, line 279 of the original, columns 1 to 3]
- HTTPS ends at Cloudflare, with Cloudflare's certificate, as drawn. [Source: component diagram data, line 685 of the original] Whether Cloudflare connects to the origin over HTTPS again, and whether it checks the origin's certificate, is open. Its SSL/TLS mode decides both. [Source: developers.cloudflare.com/ssl/origin-configuration/ssl-modes/, read 12 Oct 2026]
- Every outgoing call of a connector or an agent passes one controlled egress gateway. It keeps an allow-list of destinations for each tenant, blocks internal network addresses and limits the rate of calls. [Source: backend brainstorm log, line 107 of the original; system draft, line 240 of the original, carried over, confirm] The system draft proposed to build it on Smokescreen.
- The MCP security guidance recommends that operators of MCP clients deployed on a server consider an egress proxy that blocks internal destinations, names Smokescreen as an example, and recommends blocking private and link-local address ranges. [Source: modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices, read 12 Oct 2026]
- No MCP tool fetches an address supplied by a client (ONB-23).

## Untrusted files

Proposed: [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) (draft).

- Uploads go straight to the file store through presigned URLs, and ClamAV scans each file before it can be downloaded. [Source: backend proposals, line 34 of the original]
- The sandbox containers (ClamAV and Chromium) have no access to the database. [Source: backend proposals, line 288 of the original]
- The trade-off of MPXJ: it opens MS Project files inside the `worker`, which has database access. The proposals reduce the risk by scanning with ClamAV first and by limiting file size and read time. [Source: backend proposals, line 228 of the original] The earlier draft isolated the parser in a role of its own, with no database and no Internet, allowed to read and write exactly one object through a signed link. That is carried over for comparison, not adopted. [Source: system draft, line 125 of the original, carried over, confirm]
- Chromium in a container: Playwright recommends `--ipc=host`, because without it Chromium can run out of memory and crash. [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] A managed container platform may not allow that flag, and a 100-page document has to be measured before go-live. [Unverified - confirm before applying] [Source: backend proposals, line 227 of the original]
- The BRD requires malware scanning of uploads (PLT-07) and treats the content of records as data, never as instructions (MCP-16).

## Supply chain

- The proposals record that Maven Central had a worm-infected package in 11/2025 and a package imitating Jackson in 12/2025, both removed quickly, and that npm had several worm waves, from 18 popular packages in 09/2025 to 444 packages in under 4 hours in 08/2026. [Unverified - confirm before applying] [Source: backend proposals, line 74 of the original]
- The MCP gateway adds a second language and with it the npm supply chain. The proposals answer by keeping the gateway very small and pinning its versions, and they note that provenance checks alone do not stop such worms. [Source: backend proposals, line 225 of the original]
- Other versions are pinned too: the Keycloak version, with its authenticator's tests run on every new version, and the Playwright server image, whose version must match its client. [Source: backend proposals, line 222 of the original; playwright.dev/java/docs/docker, read 12 Oct 2026]
- Carried over, confirm: continuous integration scans dependencies and containers, builds a software bill of materials, signs containers and protects branches. [Source: system draft, line 291 of the original]
- A reviewer proposes a software bill of materials, signed builds, and an approval when a provider or a model changes: [A software bill of materials, signed builds, approval when a provider or model changes](decisions/supply-chain-integrity.md) (draft).

## Certification

Proposed: [ISO 27001 first, SOC 2 Type II when customers ask](decisions/security-certification-path.md) (draft). The BRD requires one of the two and leaves the choice open (D-31).

- ISO/IEC 27001:2022 comes first and is mandatory. SOC 2 Type II follows when customers ask. Controls are designed from the start. [Source: backend proposals, lines 19, 314 and 315 of the original]
- ISO 27001 does not require a supplier to hold ISO 27001. It requires Metis to manage its suppliers: a policy, contracts with security clauses, periodic monitoring and a way to handle data when a supplier is left (controls 5.19 to 5.23 of ISO/IEC 27001:2022). A supplier's SOC 2 Type II report or ISO 27001 certificate is the evidence auditors usually ask for. [Unverified - confirm before applying] [Source: backend proposals, line 303 of the original]
- From each infrastructure supplier Metis collects a certificate that covers the services and data centers it uses, and an audit report from the last 12 months. For the SOC 2 of Metis, the infrastructure suppliers are subservice organizations. The usual method relies on the supplier's own SOC 2 report, and a supplier without one breaks the chain of assurance, so a direct inspection may be needed. [Unverified - confirm before applying] [Source: backend proposals, line 325 of the original]

The standards the proposals consider, with the level proposed for each. [Source: backend proposals, lines 310 to 321 of the original] The descriptions are the proposals' own and were not re-read. [Unverified - confirm before applying]

| Standard | What it is | Why Metis needs it | Level |
|---|---|---|---|
| ISO/IEC 27001:2022 | An information security management system, certified by an accredited body; every certificate of the 2013 edition expires from 31 Oct 2025 | D-31, with controls designed from the start | Mandatory, first |
| SOC 2 Type II | A report of a CPA audit firm that controls are designed and operate well over a period; Type I only looks at the design on one date | The same; US customers often ask | When customers ask |
| ISO/IEC 27017:2026 | Security controls for cloud services, issued together with 27001 | Metis both provides a cloud service and uses the cloud | Should have |
| ISO/IEC 27018:2025 | Protection of personal data processed for customers in the cloud | Metis holds the employee data of customers | Should have |
| ISO/IEC 27701:2025 | A privacy management system, a standalone standard from the 2025 edition | European customers and GDPR questions | Later |
| ISO/IEC 42001:2023 | An AI management system | Metis has AI agents and MCP, and the question of Article 50 of the EU AI Act is open (Q-16) | Later |
| CSA STAR | Level 1 is a self-declared CAIQ questionnaire; level 2 builds on ISO 27001 or SOC 2 | Customers look up the STAR registry | Level 1 early |
| PCI DSS | Applies only to parties that hold, process or transmit card data | Not needed, because invoicing is outside the product (D-27) | No |

What the proposals list for each supplier or component. [Source: backend proposals, lines 279 to 293 of the original, column 4] These are the proposals' own research and were not re-read. [Unverified - confirm before applying]

| Supplier or component | What the proposals list |
|---|---|
| Cloudflare | ISO 27001:2022, 27018 and 27701; SOC 2 Type II; PCI DSS 4.0 level 1 |
| DigitalOcean App Platform | A commitment of 99.95%; SOC 2 Type II, SOC 3 and CSA STAR level 1. ISO 27001 is stated only for the data centers DigitalOcean rents space in. [Source: backend proposals, line 266 of the original] |
| Core in Java 25 with Spring Boot 4 | Spring Boot has a published support policy; Amazon Corretto 25 is supported until 10/2032 |
| MCP gateway in TypeScript | The official MCP SDK is at the highest support level |
| Keycloak | Open-source software of the CNCF; run by Metis, so it has no certificate of its own and is covered by Metis's controls and the penetration test |
| Temporal | Run by Metis: Metis's controls. Temporal Cloud: SOC 2 Type 2 and a commitment of 99.9% |
| PostgreSQL with a standby | A layout with a separate managed database vendor: SOC 2 Type 2, a commitment of 99.99%, restore to 5 minutes before. The DigitalOcean layout: a commitment of 99.95%, restore within 7 days, the data-loss level not published |
| Valkey | Holds no business data, so it needs no backup |
| File store | Spaces: a commitment of 99.9% |
| Sandbox (ClamAV and Chromium) | Software that Metis runs |
| Claude by Anthropic | SOC 2 Type II, ISO 27001:2022 and ISO 42001; no use of API data for training; incident notice within 48 hours; deletion within 30 days after termination; data stored in the United States |
| Amazon SES | Within the SOC and ISO scope of AWS; a commitment of 99.9% |
| Grafana Cloud | SOC 2 Type 2, ISO 27001 and CSA STAR; a Singapore region; a data processing agreement must be signed |
| GitHub | ISO 27001:2022 and SOC 3 |
| OpenTofu, proposed as the tool that builds every environment as code | Official providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud |

## Penetration test

- An independent penetration test before go-live is mandatory (TEN-02). [Source: backend proposals, lines 19 and 304 of the original]
- Its scope must include the self-written magic-link authenticator, the MCP gateway and the cross-tenant check through row-level security. [Source: backend proposals, line 206 of the original, first sentence]

## Open questions

1. The OAuth plan for MCP. The system draft launches with dynamic client registration, the specification of 2026-07-28 deprecates it in favour of Client ID Metadata Documents, and Keycloak lists that feature as experimental. The gateway checks the audience itself and is tested with real LLM clients. [Source: backend proposals, line 224 of the original; system draft, line 249 of the original]
2. How the core learns the user and the scopes of a call that comes through the gateway, without passing the MCP token on to the core.
3. The secret store, the mechanism for encryption at rest, and a write-once mode for the audit export on the chosen provider.
4. The duties that Cloudflare AI Gateway covers for the LLM gateway, and regional processing at the model provider. [Source: backend proposals, lines 56 and 128 of the original]
5. The licence review of the Elastic License 2.0 extension, if it were used instead of the self-written authenticator, and the unread Keycloak bug report about server-side request forgery (#53812). [Source: system draft, line 319 of the original, carried over, confirm]
6. Whether the hop from Cloudflare to the origin is encrypted again.
7. Whether a managed container platform allows `--ipc=host` for Chromium. [Source: backend proposals, line 227 of the original]
8. The compliance target and its timeline (D-31), and whether Article 50 of the EU AI Act applies to Metis (Q-16).
9. The session and token lifetimes of the app and of the agent token, which the sources do not state.

## Decisions behind this page

| Decision | Status |
|---|---|
| [Internal rules, connectors, AI and agent steps; no customer code](decisions/automation-scope.md) | Current |
| [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) | Draft |
| [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) | Draft |
| [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) | Draft |
| [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](decisions/command-catalog.md) | Draft |
| [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) | Draft |
| [Cloudflare at the edge](decisions/edge-cloudflare.md) | Draft |
| [Controlled egress for connectors and agents](decisions/egress-control.md) | Draft |
| [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) | Draft |
| [A software bill of materials, signed builds, approval when a provider or model changes](decisions/supply-chain-integrity.md) | Draft |
| [ISO 27001 first, SOC 2 Type II when customers ask](decisions/security-certification-path.md) | Draft |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 19, 26 to 28, 30 to 32, 34, 50 (columns 1 to 3 only), 56 (columns 1 to 3 only), 74, 128, 206 (first sentence only), 222 to 225, 227, 228, 266, 279 to 293 (column 4 for the certification tables), 301 to 304, 310 to 321 and 325 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 30, 33, 34, 107 to 109 and 135 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 125, 133, 204, 240, 249 to 251, 258, 259, 263, 265, 266, 269, 270, 291 and 319 of the original, carried over, confirm.
- The component diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store, used for its technical content only: line 685 of the original.
- BRD rows PLT-01, PLT-04, PLT-07, PLT-11, TEN-02, TEN-03, MCP-02, MCP-04, MCP-08, MCP-11, MCP-16, MCP-20, ONB-23, ONB-24, D-03, D-15, D-27, D-29, D-30, D-31, D-33, D-34 and Q-16, and the Secrets and AI interface security rows of section 17, in `business/requirements/`.
- Pages read on 12 Oct 2026: cncf.io/projects/keycloak/, keycloak.org/docs/latest/server_development/index.html, keycloak.org/docs/latest/release_notes/index.html, modelcontextprotocol.io/specification/2026-07-28/basic/authorization, modelcontextprotocol.io/specification/2026-07-28/changelog, modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices, developers.cloudflare.com/ssl/origin-configuration/ssl-modes/ and playwright.dev/java/docs/docker.
