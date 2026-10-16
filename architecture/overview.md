---
title: Architecture overview
summary: How the planned backend, the built app and the services around them fit together, with the path of one read and of one write.
component: all
type: overview
status: draft
ids: []
---

# Architecture overview

Planned, not built: the backend, the services around it and the environments on this page do not exist yet. Only the app (`metis-app`) is built, and it answers from a mock server. This page describes what the owner's backend proposals plan and says, for each choice, whether the owner has decided it.

How to read it:

- A choice that has a decision record links the record and keeps its status. "Decided" means the record is current. "Proposed" means the record is a draft that the owner has not decided.
- A source is written `[Source: <file>, line N of the original]`. The files are kept in the owner's private store and are listed under Sources. The system draft was superseded by the backend proposals and was written for another stack, so only its stack-neutral lines are used, each marked "carried over, confirm".
- A fact that no source settles is written as open, and the open items are gathered at the end.
- A statement about a third-party platform cites the page and the date it was read, or carries `[Unverified - confirm before applying]`.

The other architecture pages go deeper: [How tenants stay apart](tenancy.md), [Security architecture](security.md), [Data architecture](data.md) and [The API contract](contract.md).

## Goals and constraints

The backend serves a multi-tenant enterprise product. A tenant is one customer company. [Source: backend proposals, line 14 of the original]

- Size: at least 5,000 users in phase one, and ten times that without changing the architecture. [Source: backend proposals, line 14 of the original] The 5,000 are read as the total of about 3 to 10 tenants, with about one fifth of the people active at the peak, about 1,000. That is the proposal writer's assumption. The owner did not correct it when answering BE-01 on 10 Oct 2026, so it holds until corrected. [Source: backend brainstorm log, lines 49 and 51 of the original]
- Clients: one API serves the web, iOS and Android builds of the Expo app. [Source: backend proposals, line 15 of the original]
- MCP: one endpoint for each tenant, for the customers' LLMs. MCP is the protocol that lets an LLM read and write Metis data. [Source: backend proposals, line 16 of the original]
- Automation: drag-and-drop workflows come later. They cover automation inside Metis, connections to outside systems, and AI and agent steps. Customers write no code. [Source: backend proposals, line 17 of the original] This scope is decided: [Internal rules, connectors, AI and agent steps; no customer code](decisions/automation-scope.md) (current).
- Measures: reads and saves under 1 second at the 95th percentile, availability of 99.9% a month, at most 15 minutes of data lost after an incident, and back in 4 hours. [Source: backend proposals, line 18 of the original] These are the proposed starting targets of BRD section 17.1. D-26 confirms or adjusts them, and they are not measurements.
- Security: an independent penetration test before go-live is mandatory, then ISO/IEC 27001 first and SOC 2 when customers ask. [Source: backend proposals, line 19 of the original] Proposed: [ISO 27001 first, SOC 2 Type II when customers ask](decisions/security-certification-path.md) (draft).
- Priority order: stability and long-term support come first, then a component with an organization behind it and a published support policy where one exists. [Source: backend proposals, line 20 of the original, first two clauses] Decided: [Prefer mature, supported components](decisions/component-selection-stability.md) (current). That record decides only the owner's priority. The log's wider principle, components that have run in production for years and young ones only at the edge, is proposed.

### What the backend is built to meet

The brainstorm log restates the BRD constraints in one table. [Source: backend brainstorm log, lines 23 to 38 of the original] The ids are BRD rows; BRD section 17.1 holds the proposed starting values.

| Area | Constraint |
|---|---|
| Speed | Reads through the API and MCP under 1 second at the 95th percentile, saves under 1 second, and web screens usable within 2 seconds for a project of 2,000 items |
| Concurrency | 25 people editing one project at once, with a conflict only when two of them change the same field (PLT-06) |
| Scale | Per tenant up to 5,000 projects, 2,000 items in each project and 2,000 users, designed for ten times the volume measured in the pilot |
| Availability and recovery | 99.9% a month, a recovery point of 15 minutes and a recovery time of 4 hours, and one tenant restored without touching the others |
| Heavy work | A 100-page PDF in under 30 seconds at the 95th percentile (PLT-16), files up to 250 MB with download links valid for 15 minutes (PLT-07), and 60 MCP calls a minute for each token (MCP-12) |
| Certification | SOC 2 Type II or ISO 27001 with controls built from the start (D-31), an independent penetration test before go-live, and secrets kept in a store with rotation |
| Identity | Per tenant: SSO by SAML 2.0 or OIDC, password with MFA, and magic links for outside guests (TEN-03), through one identity layer (D-03); SCIM later (TEN-11) |
| Tenant isolation | Ten data paths; in the database a row-level policy enforced by the database itself; a record that does not exist and a record of another tenant must look the same, response time included (TEN-02, D-28) |
| Audit | Who, when, the value before and after, and the reason; no edit and no delete; one envelope for people, AI and support staff (PLT-11) |
| MCP | One HTTPS endpoint for each tenant on the Streamable HTTP transport (MCP-01), OAuth 2.1 and personal tokens (D-29), 17 tools in four action classes, and MCP never approves, decides, changes a baseline, deletes or changes permissions (D-30) |
| AI | An external LLM enters the first release for onboarding (A-08); the onboarding agent is an MCP client with a short-lived token and no write tool (ONB-24) |
| Scheduled work | Reminders for due and overdue items, waiver expiry, support-access expiry, deletion of data past retention, PDFs in the background, and onboarding reminders |
| Integrations | First release: SSO, MCP clients, email and an LLM. Later: SCIM, payment, ERP, HR, Jira or Azure DevOps, chat, data warehouse, BI and e-signature. Every integration write is idempotent by external id, with error rows and a reconciliation report |
| Open in the BRD | Where the data is hosted (D-20), the isolation model (D-28), the identity layer (D-03) and the permission model (D-15) |

### What the BRD does not ask for

Four needs come from outside the BRD. [Source: backend brainstorm log, lines 42 to 45 of the original]

1. 5,000 users in phase one. The BRD has no total of users. It asks for at least two live tenants and up to 2,000 users in each.
2. Drag-and-drop workflows. Neither the BRD nor the onboarding addendum asks for them. The BRD has stage rules with conditions, actions and thresholds, escalation, and routing thresholds for change requests. The drag-and-drop screen comes later, but its foundation is needed from the start: domain events, the command catalog and a durable workflow engine.
3. Internal agents. The BRD places an AI copilot in V3, while the onboarding addendum already brings one agent, for onboarding, into the first release.
4. iOS and Android apps. The BRD proposes no native app in the MVP (D-19), but the front end already builds both, so the backend serves native clients from the start.

## Components and stack

### The parts

| Part | What it does | Built with | State | Code repository | Pages |
|---|---|---|---|---|---|
| App | One code base, three builds: web, iOS and Android | TypeScript 6, React Native 0.86, Expo SDK 57 | Built, on mock data | `metis-app` | [`components/app/`](../components/app/README.md) |
| Business core | Reads, writes, permissions and audit; runs as the role `api` or `worker`; generates the OpenAPI contract | Java 25 LTS, Spring Boot 4 | Planned; the language is decided | `metis-backend` | [`components/core/`](../components/core/README.md) |
| MCP gateway | The MCP endpoint of each tenant, for the customers' LLMs | TypeScript on Node.js 24 | Planned, proposed | `metis-backend` | [`components/mcp-gateway/`](../components/mcp-gateway/README.md) |
| Agent | Runs agents; reaches Metis only through MCP | Language open | Planned, proposed | `metis-backend` | [`components/agent/`](../components/agent/README.md) |
| Sign-in | SSO, MFA, magic links, OAuth for LLMs | Keycloak 26.x and a self-written authenticator | Planned, proposed | `metis-backend` (extensions) | [`components/keycloak/`](../components/keycloak/README.md) |
| Sandbox | Virus scans of uploads and PDF rendering | ClamAV; a Playwright server with Chromium | Planned, proposed | `metis-backend` (images) | [`components/sandbox/`](../components/sandbox/README.md) |
| Infrastructure | Every environment as code | OpenTofu, proposed as the tool | Planned; building every environment as code in `metis-infra` is decided, the tool is proposed | `metis-infra` | [`components/infra/`](../components/infra/README.md) |

[Source: component diagram data, lines 83 to 176 of the original; repositories design, section 2.1; `metis-app/package.json`] The three code repositories are decided: [Three code repositories and one for every document](decisions/four-repositories.md) (current). The app calls the API as if a server existed and a mock server answers in mock builds: [Screens call the real API; a mock server answers in mock builds only](decisions/mock-server-behind-real-api.md) (current).

Temporal, PostgreSQL, Valkey and the object store have no component folder of their own. Where each of them is hosted is open (see Open questions).

### The backend stack

Each row gives the layer, the component, its role in Metis, and the state of its decision record. [Source: backend proposals, lines 38 to 59 of the original, columns 1 to 3; component diagram data, lines 140 to 146 of the original]

| Layer | Component | Role in Metis | State |
|---|---|---|---|
| Language and runtime | Java 25 LTS on Amazon Corretto 25 (alternative: Eclipse Temurin 25) | Runs the Spring Boot core | Java decided: [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](decisions/backend-language-java-spring-boot.md) (current); the distribution is proposed |
| Framework | Spring Boot 4.x | HTTP, configuration, dependency injection, health checks | Decided (same record) |
| Security | Spring Security as a resource server | Checks Keycloak tokens and authorizes by method | Proposed: [The core's libraries](decisions/core-libraries.md) (draft) |
| Data access | Spring Data JDBC or plain JDBC, HikariCP, the PostgreSQL JDBC driver | Explicit SQL and no heavy ORM; sets the tenant at the start of each transaction | Proposed (same record) |
| Migrations | Flyway, Community edition | Creates tables, row-level security policies and roles | Proposed (same record) |
| Tenant separation | PostgreSQL row-level security with `set_config(..., true)` | Blocks reads across tenants inside the database | Proposed: [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) (draft) |
| API contract | springdoc-openapi | Generates OpenAPI 3.1 from the code | Proposed: core-libraries |
| Front-end contract | orval, or Kubb with its zod plugin | Generates zod 4 schemas, so the front end keeps zod | Proposed: core-libraries |
| MCP | `mcp-gateway`: TypeScript on Node.js 24 LTS, with the version 2 packages of the TypeScript MCP SDK | The MCP endpoint for customers' LLMs; stateless; calls the core API | Proposed: [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) (draft) |
| MCP, alternative | Spring AI MCP server | Would run MCP inside the Java core, with one container and one language fewer | Named as the alternative in the same record |
| Identity | Keycloak 26.x and a self-written magic-link authenticator; Metis verifies a tenant's email domain by a DNS record | Sign-in, SSO per organization, just-in-time provisioning, MFA (TOTP, WebAuthn, passkey, recovery codes), SCIM, OAuth server for MCP | Proposed: [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) (draft) |
| Durable workflows | Temporal with the Java SDK | Workflows, schedules, the interpreter of drag-and-drop workflows, agent runs | Proposed: [Temporal for workflows, schedules and agent runs](decisions/durable-workflows-temporal.md) (draft); hosting open |
| Realtime | Spring WebSocket or server-sent events; Valkey pub/sub | Pushes changes to screens; counts calls | Proposed: [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) (draft); WebSocket or server-sent events open |
| MS Project reading | MPXJ, inside the `worker` | Reads MS Project files | Proposed: [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) (draft) |
| PDF | Playwright for Java, connected to a Playwright server container running Chromium | Builds PDFs from HTML | Proposed (same record) |
| Malware scan | ClamAV | Scans files before they can be downloaded | Proposed (same record) |
| Agent | A service of its own, language open; Claude reached through an LLM gateway | The LLM loop; tools only through MCP | Proposed: [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) (draft) |
| Observability | OpenTelemetry, sent to Grafana Cloud | Traces, logs and metrics | Proposed: [OpenTelemetry sent to Grafana Cloud](decisions/observability-opentelemetry.md) (draft) |
| Testing | JUnit 5, Testcontainers for Java, PIT, and ArchUnit or Spring Modulith for module boundaries | The same discipline as the front end | Proposed, tools unverified: [The same test discipline as the front end](decisions/backend-testing.md) (draft) |
| Edge | Cloudflare | DNS, CDN, web firewall, protection against attacks that take the service down | Proposed: [Cloudflare at the edge](decisions/edge-cloudflare.md) (draft) |
| Email | Amazon SES, Singapore region, as drawn in the Singapore proposal | Notification email | Proposed: [Amazon SES for notification email](decisions/email-ses.md) (draft) |
| Source and checks | GitHub | Code and automated checks | No record |
| Infrastructure as code | OpenTofu, proposed as the tool | Every environment as code in `metis-infra` | Decided that every environment is built as code in `metis-infra`; the tool is proposed: [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) (current) |
| Data stores | PostgreSQL 18 with row-level security; Valkey; S3-style object storage | Business data; cache, pushes and rate limits; the files customers upload | Proposed; the records above cover the pieces |

The open standards (PostgreSQL, a Redis-compatible cache and S3-compatible storage) are decided in [One region first, more regions per customer later](decisions/global-ready-release.md) (current), while the products, versions and providers in this table are proposed. [Source: backend brainstorm log, line 71 of the original]

The versions in this table are the proposals' own and were not re-checked for this page. [Unverified - confirm before applying] The proposals mark several lines as unverified (Spring Security, HikariCP, the PostgreSQL JDBC driver, Valkey, MPXJ and the test tools), and they have to be checked before an implementation plan is written. [Source: backend proposals, line 230 of the original]

### Who calls whom

| From | To | What passes | Source |
|---|---|---|---|
| Web, iOS and Android app | Cloudflare edge | HTTPS requests, and the web files | Component diagram data, line 163 of the original |
| A customer's LLM | Cloudflare edge, then the MCP gateway of its tenant | MCP over HTTPS | Component diagram data, lines 161 and 166 of the original |
| Cloudflare edge | Keycloak | Sign-in traffic | Component diagram data, line 164 of the original |
| Cloudflare edge | Core `api` | API calls | Component diagram data, line 165 of the original |
| MCP gateway | Core API | Tool calls; never the database | Backend proposals, line 30 of the original |
| Agent | MCP gateway | Tool calls only, with a short-lived token | Component diagram data, line 169, and backend proposals, line 31 of the original |
| Agent | The LLM provider | Model calls through an LLM gateway | Component diagram data, line 174, backend proposals, line 56, and backend brainstorm log, line 108 of the original |
| Core | PostgreSQL, Valkey, object storage | Data; cache, pushes and counters; files | Component diagram data, lines 171 to 173 of the original |
| Core | Temporal | Workflows, schedules and agent runs, fed by the outbox | Backend proposals, line 32 of the original |
| Core `worker` | Sandbox | Virus scans and PDF rendering | Backend proposals, line 34 of the original |
| Core | Amazon SES | Notification email, fed by the outbox | Backend proposals, line 32, and line 59 (column 1) of the original |
| Core | App, at build time | The OpenAPI 3.1 contract, from which the app generates its zod schemas | Component diagram data, lines 167 and 168, and backend proposals, line 27 of the original |
| The services | Grafana Cloud | OpenTelemetry traces, logs and metrics | Backend proposals, line 57 of the original, columns 1 to 3 |

## Backend shape

The core is one modular code base (BE-03): one code base and one image, run as the role `api` or `worker` by configuration. [Source: backend proposals, line 24 of the original] This is proposed, not decided: [One code base and one image, run as the API or as its migration job](decisions/modular-monolith-core.md) (draft). The brainstorm log asked BE-03 on 10 Oct 2026 and records no result. [Source: backend brainstorm log, lines 114 and 143 of the original]

| Process | What it does | Touches the database? | Source |
|---|---|---|---|
| Core `api` | HTTP for the web, iOS and Android builds, and the push of changes to screens | Yes, through an application role that cannot bypass row-level security | Backend proposals, lines 24, 28, 29 and 33 of the original |
| Core `worker` | Email, PDF, import, export, MS Project reading and the outbox. Temporal runs the durable workflows; the sources do not say which role hosts the Temporal workers. | Yes | Component diagram data, lines 133 and 134, and backend proposals, lines 32 to 34 of the original |
| MCP gateway | One MCP endpoint for each tenant; checks the OAuth token and the audience of the tenant; reads the command catalog from the core; calls the core API | No, never | Backend proposals, line 30 of the original |
| Agent | The LLM loop of the agents; calls tools only through the MCP gateway | No | Backend proposals, line 31 of the original; backend brainstorm log, line 109 of the original |
| Keycloak | Sign-in | Its own database | Backend proposals, lines 50 and 256 of the original |
| Sandbox | ClamAV scans; a Playwright server renders PDFs | No | Backend proposals, lines 34 and 288 of the original |

Why one code base rather than small services or serverless functions: [Source: backend brainstorm log, lines 116, 130 and 135 to 137 of the original]

- Three jobs need writes across several modules in one transaction: the onboarding launch rolls back as a whole when it fails, applying an approved change request creates a new baseline, and every write command has an audit row beside it. One code base keeps these as real transactions.
- It separates processes in exactly the three places that need it: one tenant's MCP load must not slow the app (TEN-10), the LLM keys sit outside the process that can write, and foreign files are read in a sandbox.
- It can be replicated whole for each region. The ceiling is one PostgreSQL for each region.
- The strongest objection is a shared release rhythm. A fault in one module blocks the release of every module, and at about 40 people on eight work streams the coordination overhead grows. The mitigation is to enforce module boundaries with tooling from the start, so a module that needs its own rhythm can become a service along that boundary.

The brainstorm log's first option listed more roles inside the same build (`mcp`, `workflow` and `agent`). The proposals keep two roles in the core and run the gateway and the agent as separate services. [Source: backend brainstorm log, line 120 of the original; backend proposals, lines 24, 30 and 31 of the original]

## Path of one read

A read follows these steps. Steps 1, 5 and 6 are built in the app today; the others are planned.

| Step | What happens | State |
|---|---|---|
| 1 | The app sends an HTTPS request to the API for JSON: the shell of a workspace, or the overview of a project. The app sends no credentials today. | Built: `getShell` and `getOverview` in `metis-app/src/core/api/client.ts` |
| 2 | Cloudflare answers at the edge. It holds the DNS for the domain, ends HTTPS with its own certificate, checks every call with its web firewall and protection against attacks that take the service down, and keeps the web files in its CDN cache. The web files come from the origin, static hosting, only when the edge has no copy. | Planned. [Source: component diagram data, lines 684 to 688 of the original] |
| 3 | The edge passes the checked API call to the backend. | Planned. [Source: component diagram data, line 703 of the original] |
| 4 | The API checks the token that Keycloak issued, takes the tenant from it, and reads the data from PostgreSQL. Row-level security keeps the rows of other tenants out of the result. | Planned. [Source: component diagram data, lines 689 to 691 of the original; backend proposals, lines 28 and 45 of the original] |
| 5 | The answer comes back through Cloudflare. The app checks the body against its zod contract and turns every failure into a named error state. | Built |
| 6 | The app draws the screen. On the web, react-native-web turns it into HTML and CSS. On iOS and Android, Hermes runs the JavaScript and Fabric draws native views. | Built. [Unverified - confirm before applying] [Source: component diagram data, lines 678 to 683 of the original] |

How the app proves who it is on a call is carried over, confirm: the web build holds a cookie session kept by the `api` (the browser never holds a token), and the iOS and Android builds use OAuth 2.1 with PKCE through the system browser and keep the token in the device key store. [Source: system draft, line 269 of the original] Neither is built: the app sends no credentials and no sign-in screen exists.

Cloudflare ends HTTPS as drawn. Whether it connects to the origin over HTTPS again, and whether it checks the origin's certificate, is not stated. Cloudflare's SSL/TLS encryption mode decides both, and its modes range from no encryption toward the origin to a validated origin certificate. [Source: developers.cloudflare.com/ssl/origin-configuration/ssl-modes/, read 12 Oct 2026]

The host of the web build must answer `index.html` for every path of the app, paths with dots included: [The web build is a single page](decisions/web-build-single-page.md) (current).

Other ways in:

- A customer's LLM reaches Cloudflare, then the MCP gateway of its tenant. The gateway checks the token and calls the core API, never the database. [Source: component diagram data, lines 161 and 166 of the original; backend proposals, line 30 of the original]
- Sign-in traffic goes from Cloudflare to Keycloak. [Source: component diagram data, line 164 of the original]
- An agent calls the MCP gateway only, and calls Claude through an LLM gateway. [Source: component diagram data, lines 169 and 174 of the original; backend proposals, lines 31 and 56 of the original]

## Path of one write

Every write, whichever channel it comes from (app, MCP, workflow or agent), takes the same path inside one database transaction. [Source: backend proposals, line 28 of the original] Proposed: [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) (draft).

1. Spring Security checks the token issued by Keycloak, or the web session. [Source: backend proposals, line 28 of the original; system draft, line 107 of the original, carried over, confirm]
2. The tenant is taken from the token, never from the body of the request. [Source: backend proposals, line 28 of the original; system draft, line 107 of the original, carried over, confirm]
3. At the start of the transaction the tenant is set with `set_config('app.tenant_id', ..., true)`. The variable lives only in that transaction. [Source: backend proposals, line 28 of the original] With `is_local` true, the new value applies only during the current transaction. [Source: postgresql.org/docs/current/functions-admin.html, read 12 Oct 2026]
4. The permission is checked against the permission matrix. [Source: backend proposals, line 28 of the original; system draft, line 108 of the original, carried over, confirm]
5. The idempotency key is looked up, so that a retried call is applied once. [Source: backend proposals, line 28 of the original; system draft, line 109 of the original, carried over, confirm]
6. The version of each field is checked. [Source: backend proposals, line 28 of the original; system draft, line 109 of the original, carried over, confirm]
7. The command runs and writes its data. [Source: system draft, line 109 of the original, carried over, confirm]
8. The audit row and the outbox event are written in the same transaction, the transaction commits and the result is returned. [Source: backend proposals, line 28 of the original; system draft, line 110 of the original, carried over, confirm]

After the commit, a worker forwards the outbox events to Temporal (to start workflows), to Valkey (to push updates to screens) and to notifications. Domain events are written in the same transaction as the command, so no event is lost or repeated. [Source: system draft, line 111 of the original, carried over, confirm; backend brainstorm log, line 110 of the original] The envelope of a write and its typed rejections are on [The API contract](contract.md).

## Background work and realtime

- Temporal runs the workflows, the schedules, the interpreter of drag-and-drop workflows and the agent runs. The outbox moves events to Temporal and to email. [Source: backend proposals, line 32 of the original] Proposed: [Temporal for workflows, schedules and agent runs](decisions/durable-workflows-temporal.md) (draft).
- A run can wait for days (an approval gate, a deadline), retries by itself, and compensates when a step fails. The onboarding launch rolls back as a whole. [Source: backend brainstorm log, line 105 of the original]
- A workflow definition is data: a versioned graph, checked against the command catalog when it is published. A published version never changes. [Source: backend brainstorm log, line 106 of the original] Proposed: [Versioned workflow graphs run by one interpreter](decisions/workflow-definition-model.md) (draft, carried over from the system draft).
- Each tenant has its own secret store for connector keys, and every outgoing call passes a controlled egress gateway. [Source: backend brainstorm log, line 107 of the original] Proposed: [Controlled egress for connectors and agents](decisions/egress-control.md) (draft, carried over from the system draft).
- One shared LLM gateway holds the provider keys, pins model versions, caps use for each tenant and audits the calls. An agent runs as an MCP client with a short-lived, narrow token that carries the permissions of the person who created the workflow. A heavy action needs a person's approval. No agent touches the database. [Source: backend brainstorm log, lines 108 and 109 of the original] Proposed: [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) (draft).
- Scheduled work: reminders for due and overdue items, waiver expiry, support-access expiry, deletion of data past retention, PDFs in the background, and onboarding reminders. [Source: backend brainstorm log, line 36 of the original]
- Realtime: `api` pushes changes over WebSocket or server-sent events (open), and Valkey pub/sub carries the events between `api` instances. Valkey also counts calls: by default 60 MCP commands a minute for each token. [Source: backend proposals, line 33 of the original] Proposed: [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) (draft).

## Files, scans and PDFs

- Uploads go straight to the file store through presigned URLs. ClamAV scans each file before it can be downloaded. [Source: backend proposals, line 34 of the original]
- MPXJ reads MS Project files inside the `worker`, with no sidecar process. [Source: backend proposals, line 34 of the original]
- For a PDF, the `worker` builds the HTML and sends it to a Playwright server container, running Chromium, through Playwright for Java. [Source: backend proposals, line 34 of the original]
- The sandbox containers (ClamAV and Chromium) have no access to the database. [Source: backend proposals, line 288 of the original]
- A trade-off: MPXJ opens foreign files inside the `worker`, which has database access. The proposals reduce the risk by scanning with ClamAV first and by limiting file size and read time. [Source: backend proposals, line 228 of the original]
- Playwright recommends `--ipc=host` for Chromium in Docker, because without it Chromium can run out of memory and crash. It also says the Playwright version of the tests must match the version in the container, and that the image should be pinned. [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] Whether a managed container platform allows that flag is not verified, and a 100-page document has to be measured before go-live. [Unverified - confirm before applying] [Source: backend proposals, line 227 of the original]

Proposed: [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) (draft). The security side of untrusted files is on [Security architecture](security.md).

## External services

| Service | Used for | State |
|---|---|---|
| Cloudflare | Domain names, CDN, web firewall and protection against attacks that take the service down; protects every connection, and the MCP endpoint is served only over TLS | Proposed: [Cloudflare at the edge](decisions/edge-cloudflare.md) (draft) |
| Grafana Cloud | Logs, errors and metrics; makes the BRD section 17.1 targets measurable; logs carry no record content | Proposed: [OpenTelemetry sent to Grafana Cloud](decisions/observability-opentelemetry.md) (draft) |
| Amazon SES | Notification email, in the Singapore region as drawn in the Singapore proposal (PLT-09) | Proposed: [Amazon SES for notification email](decisions/email-ses.md) (draft) |
| Claude, by Anthropic | AI for onboarding and for agents, as an external LLM when a tenant switches it on | Proposed: [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) (draft); the provider is selected under D-33 |
| Temporal Cloud | Hosted Temporal, if chosen | Open: self-run or hosted |
| GitHub | Source code and automated checks | No record |
| OpenTofu | Proposed as the tool that builds every environment as code; the proposals expect it to rebuild the infrastructure in another region when a region is lost, so that service is back within 4 hours | The code in `metis-infra` is decided and the tool is proposed: [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) (current) |
| DigitalOcean | Production hosting, as drawn in the Singapore proposal | Proposed: [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) (draft) |
| HostHatch | The development network, with synthetic data only | Proposed by the owner, not confirmed: [The development network on HostHatch, with synthetic data only](decisions/development-on-hosthatch.md) (draft) |

[Source: backend proposals, lines 56 to 59, 279 and 289 to 293 of the original, columns 1 to 3; component diagram data, lines 147 to 155 of the original] Where the sources say how a supplier is evidenced (certificates, commitments), see [Security architecture](security.md).

## Where it runs

- Production runs at one provider. The proposals draw it on DigitalOcean. The owner has not confirmed that and still chooses between DigitalOcean and Google Cloud. AWS stays only a point of comparison. [Source: backend brainstorm log, line 236 of the original] Proposed: [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) (draft).
- The drawn layout has the application containers on DigitalOcean App Platform, managed PostgreSQL with a standby, Valkey, Spaces for files and a Container Registry for the images the containers run, all on one private network. [Source: backend proposals, lines 264, 265, 280 and 285 of the original, column 1 of line 285; component diagram data, lines 253 to 255 of the original] The application scales by adding container instances. [Source: backend proposals, line 268 of the original, first clause]
- Commitments that the proposals list for this layout: 99.95% for App Platform, Managed Databases and Container Registry, 99.9% for Spaces, and none stated for Valkey. [Unverified - confirm before applying] [Source: backend proposals, line 265 of the original]
- The first stage runs in one region. The brainstorm log reads the owner's answer as a region in Singapore, but where it runs is not final: the owner asked for both backend proposals to be drawn, a Singapore proposal and a Vietnam proposal, and withdrew the question of choosing between them (BE-08). The DigitalOcean layout on this page is the Singapore proposal's. [Source: backend brainstorm log, lines 73, 188, 220 and 222 of the original]
- Each region is a full, independent deployment, with its own database, files, cache and workers. Each tenant is tied to a home region when it is created. A thin global layer holds only the directory from tenant to region, the domain names, the CDN and the sign-in entry point. [Source: backend brainstorm log, line 77 of the original] Decided: [One region first, more regions per customer later](decisions/global-ready-release.md) (current), except where the first region is placed. The tenant directory is described on [How tenants stay apart](tenancy.md).
- Development runs on a HostHatch network built from the same container images and the same component versions as production. The log names PostgreSQL, Keycloak, Temporal and ClamAV as examples, and those components are proposals in draft records. The managed services are replaced by open-source equivalents that speak the same protocol, and the data is synthetic. A small test environment on the production provider is added before launch to check what HostHatch cannot imitate: scale, the standby failover of the database and the provider's permission model. [Source: backend brainstorm log, line 236 of the original]
- HostHatch has no certification and no uptime commitment, and its data processing agreement does not bind where data is stored, so it never holds real customer data. [Source: backend brainstorm log, line 184 of the original]
- The infrastructure pipeline holds the keys that can change or delete production, and only the infrastructure team can change the workflows that use them. [Source: the repositories design, section 2.2, item 2]

Decided: that every environment is built as code in `metis-infra`: [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) (current). Proposed by the owner, not confirmed: [The development network on HostHatch, with synthetic data only](decisions/development-on-hosthatch.md) (draft). The tool that builds them is not chosen: OpenTofu is proposed, and BE-13 is logged as being calculated, as that record states. The environments themselves are described in [Environments](../operations/environments.md).

## Scale

- Target: at least 5,000 users in phase one, and ten times that without changing the architecture. [Source: backend proposals, line 14 of the original]
- Estimate, not measured: about 1,000 people active at the peak, each sending about one request every 10 seconds, so about 100 requests a second, and about 1,000 a second for ten times the load. A load test before the architecture is fixed (D-26) is to replace these estimates with measurements. [Source: system draft, lines 303 and 305 of the original, carried over, confirm]
- How it grows: add instances for each role. The ceiling is one PostgreSQL for each region. [Source: backend brainstorm log, line 130 of the original]
- Launch sizes are not set. The system draft sized roles that the proposals no longer have (an `mcp` role and an `automation` role), so its sizes are not carried over. [Source: system draft, line 304 of the original]
- Versions move on a schedule: each Spring Boot minor version, Keycloak about every quarter, Node.js 24 to its successor for the MCP gateway, and Java 25 to the next long-term-support release. The support dates behind this schedule were not re-checked. [Unverified - confirm before applying] [Source: backend proposals, line 215 of the original]

## Out of scope

- Decided: customers write no code that runs in a workflow. [Source: backend brainstorm log, line 101 of the original] See [Internal rules, connectors, AI and agent steps; no customer code](decisions/automation-scope.md) (current).
- Not planned, carried over, confirm: many small services, Kafka and a service mesh; a separate search engine; running several regions at once for the same tenant; push notifications on phones; GraphQL. [Source: system draft, line 309 of the original]

## Open questions

1. Where the first region is placed: the Singapore proposal or the Vietnam proposal. The owner withdrew the question of choosing between them (BE-08). [Source: backend brainstorm log, lines 188, 220 and 222 of the original]
2. The production provider: DigitalOcean or Google Cloud. [Source: backend brainstorm log, line 236 of the original]
3. The tool that builds the environments as code. OpenTofu is proposed, and BE-13 is logged as being calculated, as [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) states.
4. Where Temporal runs (run by Metis, or hosted by Temporal Cloud), and how PostgreSQL is hosted. The PostgreSQL line of the proposals also lists a database for Temporal, which depends on the first answer. [Source: backend proposals, line 284 of the original, and column 1 of line 256]
5. The recovery point that can be promised to customers. The BRD asks for 15 minutes, and DigitalOcean does not publish its maximum data loss, so it has to be asked. [Source: backend proposals, line 267 of the original]
6. WebSocket or server-sent events for pushes to screens. [Source: backend proposals, line 33 of the original]
7. The shape of the core (BE-03) was asked and has no recorded result. [Source: backend brainstorm log, lines 114 and 143 of the original]
8. The language of the agent and what it exposes. [Source: backend proposals, line 31 of the original] The proposals name Cloudflare AI Gateway for the route to Claude, and do not say which of the four duties of the LLM gateway it covers. [Source: backend proposals, line 56 of the original]
9. Whether the hop from Cloudflare to the origin is encrypted again.
10. Which secret store holds the keys. The BRD asks for a managed store with rotation, and the sources used for this page name no product. [Source: backend brainstorm log, line 30 of the original]
11. Who provisions email and the LLM gateway. `metis-infra` is described as holding Cloudflare, DigitalOcean, Grafana Cloud, Temporal Cloud when chosen and the development network, and names neither. [Source: the repositories design, section 2.1]
12. The unverified libraries and tools of the stack table. [Source: backend proposals, line 230 of the original]
13. The load test (D-26) that replaces the estimates under Scale.

## Decisions behind this page

| Decision | Status |
|---|---|
| [Three code repositories and one for every document](decisions/four-repositories.md) | Current |
| [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](decisions/backend-language-java-spring-boot.md) | Current |
| [Prefer mature, supported components](decisions/component-selection-stability.md) | Current |
| [Internal rules, connectors, AI and agent steps; no customer code](decisions/automation-scope.md) | Current |
| [One region first, more regions per customer later](decisions/global-ready-release.md) | Current |
| [The development network on HostHatch, with synthetic data only](decisions/development-on-hosthatch.md) | Draft |
| [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) | Current; the tool is proposed |
| [Screens call the real API; a mock server answers in mock builds only](decisions/mock-server-behind-real-api.md) | Current |
| [The web build is a single page](decisions/web-build-single-page.md) | Current |
| [One code base and one image, run as the API or as its migration job](decisions/modular-monolith-core.md) | Current |
| [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) | Draft |
| [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) | Current |
| [The core's libraries](decisions/core-libraries.md) | Current |
| [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) | Draft |
| [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) | Draft |
| [Temporal for workflows, schedules and agent runs](decisions/durable-workflows-temporal.md) | Draft |
| [Versioned workflow graphs run by one interpreter](decisions/workflow-definition-model.md) | Draft |
| [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) | Draft |
| [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) | Draft |
| [The agent calls tools only through MCP; models through an LLM gateway](decisions/agent-and-llm.md) | Draft |
| [Controlled egress for connectors and agents](decisions/egress-control.md) | Draft |
| [OpenTelemetry sent to Grafana Cloud](decisions/observability-opentelemetry.md) | Draft |
| [Cloudflare at the edge](decisions/edge-cloudflare.md) | Draft |
| [Amazon SES for notification email](decisions/email-ses.md) | Draft |
| [The same test discipline as the front end](decisions/backend-testing.md) | Current |
| [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) | Draft |
| [ISO 27001 first, SOC 2 Type II when customers ask](decisions/security-certification-path.md) | Draft |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 14 to 20 (line 20 only as far as its first two clauses), 24, 26 to 34, 38 to 59 (columns 1 to 3 only), 215, 227, 228, 230, 256 (column 1 only), 264 to 269 (line 268 only as far as its first clause) and 279 to 293 (columns 1 to 3 only) of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 23 to 45, 49, 51, 71, 73, 77, 101, 105 to 110, 112 to 137, 143, 184, 188, 220, 222 and 236 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 107 to 111, 269, 303 to 305 and 309 of the original, carried over, confirm.
- The component diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store, used for its technical content only: lines 83 to 176, 253 to 255 and 678 to 705 of the original.
- [Metis repositories and central documentation, design](../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1 and 2.2.
- BRD rows PLT-06, PLT-07, PLT-09, PLT-11, PLT-16, MCP-01, MCP-12, TEN-02, TEN-03, TEN-10, TEN-11, D-03, D-15, D-19, D-20, D-26, D-28, D-29, D-30, D-31, D-33, A-08 and ONB-24, and section 17.1, in `business/requirements/`.
- The app code, `metis-app/src/core/api/client.ts` and `metis-app/package.json`, in the `metis-app` repository.
- Pages read on 12 Oct 2026: developers.cloudflare.com/ssl/origin-configuration/ssl-modes/, postgresql.org/docs/current/functions-admin.html and playwright.dev/java/docs/docker.
