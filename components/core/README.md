---
title: Business core
summary: The Java business core, one code base built into one image that runs as the API or as its migration job and serves the two reads of screen 24, with what is planned beside it, what it depends on, its team and its repository.
component: core
type: overview
status: current
ids: []
---

# Business core

The business core of Metis, written in Java 25 with Spring Boot 4: one code base built into one image, which runs as the API or, chosen by configuration, as its one-shot migration job. `metis-backend` holds it, with no commit yet: the module `platform` (errors, security, tenancy, the clock, logging and the declaration of an operation), and the modules `workspace` and `delivery` with the two reads screen 24 of the app calls, the shell and the overview, served from PostgreSQL behind a token with tenants kept apart by the database. [Develop the core](develop.md) says how to build, run and check it, and [Core interfaces](interfaces.md) what it answers. The rest of this page is the plan: the `worker` role, the writes and every service around the core.

## What it does

The core is the one place that reads and writes Metis data for every channel: the app on the web, iOS and Android, an LLM over MCP, workflows and agents. One API serves the three builds of the app [Source: backend proposals, line 15 of the original], and one write path serves every channel [Source: backend proposals, line 28 of the original]. Everything in this section is the plan; the table under Decided and proposed gives the status of each choice.

In the proposal the running core has two roles:

| Role | What it does | Source |
|---|---|---|
| `api` | Serves the REST API to the web, iOS and Android builds of the app and pushes changes to open screens, over WebSocket or server-sent events (undecided) | backend proposals, lines 15, 24 and 33 of the original; pitch diagram data, lines 122 to 125 of the original |
| `worker` | Runs the background jobs: notification email, PDF building, import, export and reading MS Project files; forwards outbox events to Temporal and to email | pitch diagram data, lines 133 and 134 of the original; backend proposals, lines 32 and 34 of the original; system draft, lines 111 and 234 of the original, carried over, confirm |

One image runs as either role, chosen by configuration [Source: backend proposals, line 24 of the original]. The repositories design also puts the Temporal workflows in the core [Source: repositories design, section 2.1, line 68 of the original]. The sources name only the two roles, so which role runs the workflow code that Temporal calls is open.

What the core is built around, all proposed in draft records:

- **One command catalog.** Each command is declared once, with its name, schemas, permission, action class, undo rule and audit fields. The REST API, the MCP tool list, the workflow blocks, the front-end contract and the permission tests are generated from it. See [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](../../architecture/decisions/command-catalog.md).
- **One write path.** Token, tenant from the token, permission, idempotency, per-field version, write, then the audit row and the outbox event in the same transaction. See [One transactional write path for the app, MCP, workflows and agents](../../architecture/decisions/single-write-path.md).
- **Tenant isolation in the database.** Row-level security of PostgreSQL, through an application role that cannot bypass the policies. See [Tenant isolation with PostgreSQL row-level security](../../architecture/decisions/tenant-isolation-rls.md).
- **Metrics computed on the server.** The core is the only place that computes a metric. A read returns a snapshot with its as-of time, definition version, freshness and drill filter, the shape the app already validates [Source: system draft, line 155 of the original, carried over, confirm]. See [The app never computes a metric or a drill filter](../../architecture/decisions/metrics-are-server-snapshots.md).
- **Domain events through an outbox.** An event is written in the same transaction as the command that causes it and forwarded after the commit, so workflows, notifications and pushed updates neither lose nor repeat it [Source: backend brainstorm log, line 110 of the original].
- **No direct path for MCP or agents.** The MCP gateway and the agent reach Metis data only by calling the core API; neither touches the database [Source: backend proposals, lines 30 and 31 of the original].

The BRD sets the service targets the core must meet (section 17.1): reads and saves under 1 second at the 95th percentile, 99.9% availability a month, at most 15 minutes of data lost in an incident, back within 4 hours [Source: backend proposals, line 18 of the original], and a PDF of 100 pages under 30 seconds at the 95th percentile [Source: backend brainstorm log, line 29 of the original].

## Decided and proposed

The decision records are the reference for what is decided. A row names the part the owner decided and the core built; the rest of a record is proposed.

| Record | Status |
|---|---|
| [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](../../architecture/decisions/backend-language-java-spring-boot.md) | Decided |
| [Prefer mature, supported components](../../architecture/decisions/component-selection-stability.md) | Decided for the owner's priority only (stability and long-term support first); the log's principle (years in production, young components only at the edge) is proposed |
| [Internal rules, connectors, AI and agent steps; no customer code](../../architecture/decisions/automation-scope.md) | Decided |
| [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md) | Decided |
| [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](../../architecture/decisions/api-contract-flow.md) | Decided |
| [Commands and workflows carry BRD ids](../../architecture/decisions/brd-ids-on-commands.md) | Decided |
| [One code base and one image, run as the API or as its migration job](../../architecture/decisions/modular-monolith-core.md) | Decided and built for one code base, one image and its migration job; the `worker` role is proposed |
| [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](../../architecture/decisions/command-catalog.md) | Decided and built for the declaration of an operation; the rest is proposed |
| [One transactional write path for the app, MCP, workflows and agents](../../architecture/decisions/single-write-path.md) | Decided and built for steps 1 to 3 of a read; steps 4 to 8 are proposed |
| [Tenant isolation with PostgreSQL row-level security](../../architecture/decisions/tenant-isolation-rls.md) | Decided and built for the tables of the first slice; a database of its own for a large tenant is proposed |
| [The core's libraries](../../architecture/decisions/core-libraries.md) | Decided and built for Spring Security, `JdbcClient` with HikariCP, Flyway and springdoc-openapi; orval or Kubb, MPXJ and Playwright for Java are proposed |
| [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md) | Proposed |
| [Versioned workflow graphs run by one interpreter](../../architecture/decisions/workflow-definition-model.md) | Proposed, carried over, confirm |
| [Push updates and rate limits on Valkey](../../architecture/decisions/realtime-and-rate-limits.md) | Proposed |
| [Controlled egress for connectors and agents](../../architecture/decisions/egress-control.md) | Proposed, carried over, confirm |
| [Amazon SES for notification email](../../architecture/decisions/email-ses.md) | Proposed |
| [The same test discipline as the front end](../../architecture/decisions/backend-testing.md) | Decided and built but the legs through the gateway and the agent, which are proposed |
| [One editor holds a short lease on the builder canvas](../../architecture/decisions/builder-canvas-single-editor.md) | Proposed by reviewers |
| [The server owns every rule; the UI shows its result](../../architecture/decisions/server-owned-validation.md) | Decided and built for the correlation id on every error answer; the rest is proposed by reviewers |

The choices of section 4 of [the backend skeleton design](../../history/specs/2026-10-14-backend-skeleton-design.md#4-choices-of-this-spec) are decided and built, each in its record: [modules with Spring Modulith](../../architecture/decisions/core-modules-spring-modulith.md), [the rules of the overview in Java](../../architecture/decisions/overview-rules-in-java.md), [the checks tool in Java](../../architecture/decisions/checks-tool-in-java.md), [Gradle](../../architecture/decisions/gradle-build.md), [Amazon Corretto](../../architecture/decisions/jdk-amazon-corretto.md), [Spring MVC](../../architecture/decisions/web-stack-spring-mvc.md), [the base package](../../architecture/decisions/base-package.md), [text keys as public ids](../../architecture/decisions/public-ids-text-keys.md), [the tenant claim](../../architecture/decisions/tenant-claim.md), [access rules in use cases](../../architecture/decisions/access-rules-in-use-cases.md), [database roles from the environment](../../architecture/decisions/database-roles-from-environment.md), [the contract written by a test](../../architecture/decisions/contract-written-by-a-test.md), [Problem Details](../../architecture/decisions/error-bodies-problem-details.md), [demo data outside the image](../../architecture/decisions/demo-data-outside-the-image.md), [a one-shot migration job](../../architecture/decisions/migrations-one-shot-job.md), [health probes only](../../architecture/decisions/health-probes-only.md), [the image built from the sources](../../architecture/decisions/image-built-from-sources.md), [no API version](../../architecture/decisions/no-api-version.md) and [the licences](../../architecture/decisions/backend-licences.md).

## What it depends on

| Dependency | What the core uses it for | Status | Record |
|---|---|---|---|
| PostgreSQL (version 18 as drawn) | Business data of every tenant, in one schema with a tenant id on every row; migrations run by Flyway under another database role | PostgreSQL is named among the open standards of [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md) (decided); row-level security and Flyway are decided and built, on PostgreSQL 18.6 | [Tenant isolation with PostgreSQL row-level security](../../architecture/decisions/tenant-isolation-rls.md) |
| Valkey | Cache, event fan-out between `api` instances and call counters for the rate limits; it holds no business data | Proposed | [Push updates and rate limits on Valkey](../../architecture/decisions/realtime-and-rate-limits.md) |
| Object storage | Customer files, uploaded straight to the store through presigned URLs and downloaded through links that live 15 minutes | S3-compatible file storage is named among the open standards of [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md) (decided); the provider is proposed | [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| Temporal | Workflows, schedules, the interpreter of tenant workflows and agent runs, fed by the outbox | Proposed | [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md) |
| Keycloak | Issues the tokens; the core checks them as an OAuth2 resource server and takes the tenant from the token | Decided and built for the tokens the core checks; the rest is proposed | [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) |
| The sandbox | ClamAV scans each upload; a Playwright server renders PDFs; neither reaches the database | Proposed | [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| Email | Notification email through Amazon SES, fed by the outbox | Proposed | [Amazon SES for notification email](../../architecture/decisions/email-ses.md) |
| Telemetry | OpenTelemetry traces, metrics and logs sent to Grafana Cloud; logs carry the tenant and request ids and never record content | Decided and built for the ids the logs carry; the rest is proposed | [OpenTelemetry sent to Grafana Cloud](../../architecture/decisions/observability-opentelemetry.md) |
| An egress gateway | Every outbound call of connectors and agents | Proposed, carried over | [Controlled egress for connectors and agents](../../architecture/decisions/egress-control.md) |

Sources for the table: backend proposals, lines 28 to 34, 42, 45, 52, 290 and 291 of the original; backend brainstorm log, lines 29, 107 and 71 of the original (line 71 names the open standards); system draft, line 284 of the original, carried over, confirm; pitch diagram data, lines 140 to 146 of the original; [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md) for the open standards.

## Team and repository

- **Team:** the backend team [Source: repositories design, section 2.1, line 68 of the original].
- **Code repository:** `metis-backend`, which holds the core, with no commit yet. The same repository holds the MCP gateway, the agent, the Keycloak extensions and the sandbox images, and they deploy together to the same environments [Source: repositories design, section 2.2, line 82 of the original]. See [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md).
- **Reference pages:** `reference/` does not exist yet. It arrives with the generators of plan two and will hold the API (the OpenAPI file and a page per endpoint), the commands, the permissions (16 roles by command), the data model, the outbox events, the settings and the error codes, generated from the command catalog, springdoc-openapi and the Flyway migrations [Source: repositories design, section 3.2, line 157 of the original].

## Read next

- [Develop the core](develop.md), [Core interfaces](interfaces.md) and [Troubleshoot the core](troubleshoot.md).
- The architecture pages [overview](../../architecture/overview.md), [tenancy](../../architecture/tenancy.md), [security](../../architecture/security.md), [data](../../architecture/data.md) and [contract](../../architecture/contract.md).
- The components that call the core: the [MCP gateway](../mcp-gateway/README.md) and the [agent](../agent/README.md); the sign-in service is [Keycloak](../keycloak/README.md) and the file and PDF containers are the [sandbox](../sandbox/README.md).

## Open questions

- Which role runs the Temporal workflow code: the sources name only `api` and `worker`, and the repositories design puts the workflows in the core.
- WebSocket or server-sent events for pushing changes to screens [Source: backend proposals, line 33 of the original].
- Whether Metis runs Temporal itself or uses the hosted Temporal Cloud; and, if hosted, whether the payload encryption it needs exists in the Java SDK, which the sources mark unverified (see [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md)).
- The owner approved the one-code-base shape for the core and its migration job on 14 Oct 2026 (BK-03, section 3 of [the backend skeleton design](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions)); the `worker` role is still proposed.
- Library facts the proposals mark unverified: the support dates of Spring Security, the support policies of HikariCP and the PostgreSQL JDBC driver, and the maintainers of MPXJ (see [The core's libraries](../../architecture/decisions/core-libraries.md)).
- How the MCP gateway reads the command catalog: the proposals say it does, and name no endpoint or file format [Source: backend proposals, line 30 of the original].
- Capacity is unmeasured. The load assumptions of the proposals (about a thousand users at peak for five thousand users) are estimates by their writer, and a load test before the architecture is fixed is planned to replace them with measurements [Source: backend proposals, line 14 of the original; system draft, lines 303 to 305 of the original, carried over, confirm]. The BRD asks for its targets to be confirmed against pilot and target volumes before the architecture is frozen (D-26).

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 14, 15, 18, 24, 28 to 34, 42, 45, 52, 290 and 291 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 29, 71, 107, 110, 114 and 143 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 111, 155, 234, 284 and 303 to 305 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: lines 122 to 125, 133, 134 and 140 to 146 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 2.2 and 3.2 (lines 68, 82 and 157 of the original).
- BRD row D-26, in `business/requirements/`.
