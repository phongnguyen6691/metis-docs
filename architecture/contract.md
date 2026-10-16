---
title: The API contract
summary: The contract the core generates for its two reads, with their errors and snapshots, how the declaration of each operation starts the command catalog, how the contract reaches the app, and the parts still planned.
component: all
type: overview
status: current
ids: []
---

# The API contract

Partly built. The core in `metis-backend`, which has no commit yet, serves the two reads that the app calls, and generates their contract as `contract/openapi.json`, OpenAPI 3.1. The writes, the rest of the command catalog, the MCP tools and the realtime events are planned. The app checks every answer against its own zod contract, and a mock server answers in its mock builds.

Sources and statuses are written as on [Architecture overview](overview.md). `[Source: ..., line N of the original]` names a line of a file in the owner's private store. "Decided" means a current decision record, and "proposed" means a draft one. "Carried over, confirm" marks a line of the system draft, which the backend proposals superseded and which was written for another stack. A platform statement cites the page and the date it was read, or carries `[Unverified - confirm before applying]`.

## The two reads

| Operation | Request | BRD ids |
|---|---|---|
| `workspace.shell.read` | `GET /workspaces/{workspaceId}/shell` | WSP-02, WSP-06, REG-03 |
| `delivery.overview.read` | `GET /workspaces/{workspaceId}/projects/{projectId}/overview`, with `scope=mine` or none | OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39 |

- Their answers are the shapes the app wrote in `metis-app/src/core/api/shell.ts`, `overview.ts` and `project.ts`, field for field; [Core interfaces](../components/core/interfaces.md) lists the statuses, the headers, the tokens and the answers to the app's questions.
- The contract is written by a test of the core. `ContractTest` starts the web layer with springdoc-openapi, which only the tests hold, and writes the document with its keys in a fixed order; `./gradlew writeContract` writes the file, and the check `contract` fails while the file differs, passes Redocly's linter with no unused schema, finds every BRD id in the BRD and holds every merged migration to its hash. The integration tests record every answer they receive and validate it against the file, and every documented status of every operation must be among them.
- The file holds the bearer scheme on its root, a fixed server `/`, a summary on each operation, and a `default` response with the Problem Details schema for what the platform answers to a malformed request or a failure.
- Every path parameter carries the rule of an id as a `pattern` and a `not`: at least one character, none of them `/`, `\`, `%`, `;`, NUL, LF, CR, U+2028 or U+2029, and neither `.` nor `..`, which is what the firewall of the core lets through. So a caller built from the file sends no id the core refuses before it reads it.
- The image check runs Schemathesis, pinned by digest, on the file against the image, with a token, from a container of its own that drops every capability: every answer to the calls it generates must be one the file allows, and none may be a 5xx. As a deployment runs the image, it generates the ids, so on GET it meets 400, 404 and 405, and 401 for its own calls without the token (244 calls on the last run); as the demo runs it, it is given the demo's workspace and project, and at least one read with the token must answer 200 (150 calls, 54 reads with the token answered 200 on the last run).

## The command catalog

The part decided: each endpoint is declared once, on its controller method, with `@Operation` of the module `platform.contract`: a durable name such as `delivery.overview.read`, a one-line summary, its BRD ids, its action class and the statuses beside 200. The contract carries them as `operationId`, `summary`, `x-metis-brd` and `x-metis-action`, so `contract/openapi.json` is the first form of the catalog: one entry per operation, with its name, its schemas, its BRD ids and its action class. Every BRD id an operation declares stands in the name of a unit test that ran and passed, which the check `trace` requires. Only the action class `read` exists, the one both operations need. See [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](decisions/command-catalog.md).

Proposed, for the later rounds:

- A command also has the schema of its input, the permission it needs, an undo rule and the fields written to the audit log, and the action classes append-only, reversible write, prepare-only and admin. [Source: backend proposals, line 26 of the original]
- These are generated from the catalog beside the OpenAPI document: the zod 4 contract for the front end, checked in continuous integration, the tool list of the MCP gateway, the building blocks of the workflow builder, and the matrix of permission tests for the 16 roles. [Source: backend proposals, line 27 of the original]
- Carried over, confirm: a command also has a scope (tenant, workspace or project) and a confirmation mode when it is called through MCP. The tool list is filtered by action class and release milestone. In the workflow builder an action is a command, a trigger is a type of domain event and a condition is a query. Two internal classes, admin and admin decision, can never be called through MCP (D-30). [Source: system draft, lines 133 to 139 of the original]
- Every command and every workflow names its BRD ids, and a check rejects one without ids or with an unknown id. Decided: [Commands and workflows carry BRD ids](decisions/brd-ids-on-commands.md) (current); the check `contract` applies it to both operations today.
- Springdoc-openapi, the generator of the OpenAPI document, defaults to OpenAPI 3.1, and it is a community project, not maintained by the Spring team. [Source: springdoc.org, read 12 Oct 2026] The generated file is stored in the repository and checked in continuous integration, so if springdoc lags behind Spring Boot the generator can be replaced and the contract stays the same. [Source: backend proposals, lines 46 and 88 of the original]

## Errors

Built for the reads: every error is `application/problem+json` (RFC 9457) with `type`, `title`, `status`, `kind` and `correlationId`. RFC 9457 defines a structure for the details of an error inside an HTTP reply, and the media type `application/problem+json` for JSON. [Source: rfc-editor.org/rfc/rfc9457.html, read 12 Oct 2026] The kinds of a read are `unauthenticated` (401), `forbidden` (403), `notFound` (404), `validation` (400, 405, 406 and 415), `server` (500) and `unavailable` (503); [Core interfaces](../components/core/interfaces.md#errors) says when each one comes. See [Error answers are Problem Details with a kind and a correlation id](decisions/error-bodies-problem-details.md).

Carried over, confirm: a rejected write answers in the same format with a kind of its own, so that the interface can show the right state. [Source: system draft, lines 146 to 153 of the original]

| Kind | What it carries |
|---|---|
| `stale` | The conflicts by field: your value, the newer value, who changed it, when, and the version |
| `locked` | The reason: a baseline, an archived workspace, a suspended tenant, a signed version, or another person holding the write lease of the canvas |
| `forbidden` | The resource, the role that is needed, who decides, and the action to ask for access |
| `validation` | The fields that are wrong |
| `limit` | Which limit of the plan was reached, and how to raise it (TEN-05) |
| `gateNotMet` | Each blocker of the approval gate, with the person responsible (BR-42) |
| `unauthenticated`, `rateLimited` | A sign-in is needed; a rate limit was reached, with the time to retry |

- Every error carries a correlation id, the part of [The server owns every rule; the UI shows its result](decisions/server-owned-validation.md) that the reads built.
- The app names its own failures differently, and only for reads (see below). It reads the status alone and has no counterpart yet for `stale`, `locked`, `validation`, `limit`, `gateNotMet` or `rateLimited`.

## Write envelope and conflicts

Proposed: [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) (draft).

- The write path looks up an idempotency key and checks the version of each field. [Source: backend proposals, line 28 of the original]
- Carried over, confirm: the request of a write is an envelope of `commandId`, `idempotencyKey`, `expectedVersion` and `payload`. Each record keeps a `version` and a version for each field, so a conflict arises only when the same field is changed, and a command that changes another field still writes. [Source: system draft, line 144 of the original]
- The BRD sets one write contract for the application, MCP and the API: a stale version is rejected with the newer value, and a retried key is applied once (PLT-06, MCP-14).
- The app sends only reads today, so it does not exercise the envelope, and the core has no write.

## Read snapshots

- A read returns each metric as a snapshot in the shape the front end checks: a value with `asOf`, `definitionVersion`, `freshness` and `drill`. The server is the only place that computes metrics. Decided: [The app never computes a metric or a drill filter](decisions/metrics-are-server-snapshots.md) (current).
- In the app's contract (`metis-app/src/core/api/overview.ts`) a snapshot is `asOf`, a UTC instant, `definitionVersion`, a positive whole number, `freshness`, one of `fresh`, `stale`, `partial` and `unknown`, and `drill`, a record from field names to non-empty lists of values, no value holding a comma, because a link joins values with commas. Each tile adds its `value`, and some tiles add counts such as `overdue` or `critical`. The `delayed` tile is either `measured`, with `sinceBaseline` and `baselineVersion`, or `notBaselined`.
- As the core computes them: one query loads the work breakdown of the project, and pure functions compute every number from those rows, the project record, the clock in the workspace's time zone and the reader. `asOf` is the newest change among the work items counted, the clock when none is; `freshness` is `stale` when `asOf` is older than the workspace's threshold, strictly, else `fresh`, and this operation never sends `partial` or `unknown`. The server builds each drill filter from the field names of the work breakdown and sends the initials of people. Every definition version is 1 today. See [The rules of the overview run in Java over the loaded items](decisions/overview-rules-in-java.md).

## What the app calls

Built. [Source: `metis-app/src/core/api/client.ts`, `metis-app/src/core/api/shell.ts`, `metis-app/src/core/api/overview.ts`, `metis-app/src/core/api/project.ts`, `metis-app/src/platform/config.ts`, `metis-app/src/platform/mocks.ts` and `metis-app/src/platform/mocks.web.ts`]

| Call | Path | Query | Answer |
|---|---|---|---|
| The shell (`getShell`) | `GET {apiBase}/workspaces/{workspaceId}/shell` | None | `user`, `tenant`, `workspace`, `workspaces`, `nav` (the groups `home`, `portfolio` and `workspace`), `tree`, `notifications` |
| The project overview (`getOverview`) | `GET {apiBase}/workspaces/{workspaceId}/projects/{projectId}/overview` | `scope=mine` when the My items switch is on, otherwise none | `timeZone`, `project` (the header), `metrics`, `statusBreakdown`, `progressByCategory`, `workload`, `attention` (the lists `upcoming`, `overdue` and `risks`), `computedHealth` |

- `{apiBase}` comes from the variable `EXPO_PUBLIC_API_BASE`. Without the variable no real server is reached: a mock build gets the mock server, and a release build gets the `network` error. Each call has a timeout of 10 seconds, which covers reading the body.
- The core answers both calls. Since the app sends no token yet, a build of the app reaches the core only through the development relay of the local stack, which adds a token of the demo person; see [Develop the core](../components/core/develop.md).
- The ids come from the user's address, so they are encoded. An empty id, `.` or `..` answers "not found" without a request.
- The client sends a plain GET with an abort signal, with no custom header and no credentials option. No code of the app handles a token or a session yet.
- The client checks the body against its zod contract and never throws at a screen. Every failure becomes a named error:

| Cause | Named error |
|---|---|
| HTTP 401 | `unauthenticated` |
| HTTP 403 | `forbidden` |
| HTTP 404 | `notFound` |
| Any other status that is not a success | `server`, with the status |
| A body that is not JSON, or has the wrong shape | `invalid`, with the path and the message of each wrong field |
| No answer | `network` |
| No answer within 10 seconds | `timeout` |

- The client does not read the body of an error answer; it maps the status only.
- Every project page contract extends one shared part, the workspace time zone (an IANA name that must be valid) and the project header, so a tab can draw its header without the overview. Times are UTC instants.
- Decided: [The shell has its own endpoint](decisions/shell-api-contract.md) (current), whose shape the core now answers. [Every response is validated, and every failure is a named state](decisions/validated-contracts-and-error-states.md) (current). [Screens call the real API; a mock server answers in mock builds only](decisions/mock-server-behind-real-api.md) (current). Proposed: [`delayed=true` and `scope=mine` are provisional names](decisions/provisional-drill-parameters.md) (draft), which the core keeps.

## From the catalog to the app

Decided: [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](decisions/api-contract-flow.md) (current).

- The core generates `contract/openapi.json`, in OpenAPI 3.1, in `metis-backend`, and the check `contract` fails when the committed file is stale. Built.
- On every backend pull request, oasdiff compares the contract with the one of the base branch, and a breaking change, such as a removed field or a new required input, fails the check. Built, and waiting for a base: no branch holds the file yet, so the check prints `no base to compare`. The label `contract: breaking`, set by the frontend lead, belongs to the documentation bot of the repositories design. [Source: the repositories design, section 4.5]
- When the backend pull request merges, a bot opens a pull request in `metis-app` that copies the contract. The app regenerates its zod schemas and its checks run. Not built: the bot belongs to plan two of the repositories design. [Source: the repositories design, section 4.5]
- The generator of the zod schemas is proposed, not decided: orval, or Kubb with its zod plugin. [Source: backend proposals, line 47 of the original, columns 1 to 3] Orval generates a zod schema for each model of an OpenAPI specification, and its baseline is zod 4. [Source: orval.dev/docs/guides/zod, read 12 Oct 2026] Kubb's zod plugin generates zod v4 schemas from an OpenAPI spec. [Source: kubb.dev/plugins/plugin-zod/, read 12 Oct 2026] Whether Kubb reads OpenAPI 3.1 is not stated on that page. [Unverified - confirm before applying] The contract tells the records of a union apart by their required fields alone; a generator that wants a discriminator needs the field `state` of the delayed tile and `kind` of a reason narrowed to one value per record.
- The front end stays TypeScript. The contract goes through OpenAPI 3.1 and zod is generated from it. [Source: backend proposals, line 90 of the original] Decided: [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](decisions/backend-language-java-spring-boot.md) (current).
- Until the bot exists, the app's zod contract in `metis-app/src/core/api/` and the core's file are kept equal by hand, and the core's tests compare its answers for the demo data with the app's own mock answers, pinned in `metis-backend` under `pinned/app/`. Decided: [The API contract is the only coupling between app and back end](decisions/api-contract-only-coupling.md) (current).
- The libraries: [The core's libraries](decisions/core-libraries.md).

## From the catalog to MCP

Proposed: [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) (draft).

- The MCP gateway reads the command catalog from the core, then calls the core API. [Source: backend proposals, line 30 of the original]
- The tools are generated from the catalog. Their list is filtered by action class and release milestone: the 17 tools of the BRD, and the group of setup tools of the onboarding addendum. A tool has a confirmation mode, `per_call` or `batch_launch`, an undo while the field still holds the value the command set, a rate limit, and an audit entry that records the token and the name of the client. [Source: system draft, lines 137 and 251 of the original, carried over, confirm]
- The BRD fixes the contract of a tool: a stable name, a plain description, a versioned JSON input schema with examples, and changes that stay backward compatible within a major version (MCP-09). A tool returns figures computed by the platform and not raw rows (MCP-10). A REST API with the same tokens, scopes, limits and audit is a later priority (MCP-18).
- The reference page of the MCP tools, with their scopes and rate limits, is to be generated from the catalog the gateway reads. It arrives with the generators of the second plan of the repositories design, and no such page exists yet. [Source: the repositories design, section 3.2]

## Older app versions

- The backend must keep answering older app versions. The stores review each release, and people update their phones at their own pace. [Source: the repositories design, section 2.2, item 1] Apple says it reviews all apps and app updates submitted to App Store Connect. [Source: developer.apple.com/distribute/app-review/, read 12 Oct 2026] Google Play shows an update as "In review". [Source: support.google.com/googleplay/android-developer/answer/9859751, read 12 Oct 2026] How long people keep an old version is not measured. [Unverified - confirm before applying]
- For that reason a breaking change of the contract fails the check `contract` against its base, and needs the label `contract: breaking`, set by the frontend lead. [Source: the repositories design, section 4.5]
- The API has no version in its path or its headers: one enters with the first breaking change. See [No API version until the first breaking change](decisions/no-api-version.md).
- Open: how long an older shape must still be served, and how the API tells an app that it is too old, are not stated in the sources.

## Realtime events

- `api` pushes changes to screens over WebSocket or server-sent events, and the choice is open. The Expo app reads server-sent events with `expo/fetch`. [Source: backend proposals, line 33 of the original] Expo's documentation shows `expo/fetch` reading a response with the header `Accept: text/event-stream` through a body reader, collecting raw chunks, and it does not parse events. [Source: docs.expo.dev/versions/latest/sdk/expo/, read 12 Oct 2026] So the app needs a small reader of the event format. [Source: system draft, line 215 of the original, carried over, confirm]
- Carried over, confirm: there is one stream for each project. Events travel from the outbox through Valkey to the `api` instances, and then to the screens. After a reconnect the stream resumes from the last event received. [Source: system draft, line 215 of the original]
- The BRD requires that the changes of other users appear without a manual reload (PLT-06).
- Built: nothing. Neither the app nor the core has a realtime channel.
- Proposed: [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) (draft).

## Open questions

1. The names `delayed=true` and `scope=mine` and the meaning of "My items" stay provisional: the core keeps the names, and "My items" filters by the person in charge, until the owner decides. [Source: the decisions on the provisional names, linked above]
2. How the app attaches a session or a token to its two calls. The web build is expected to use a cookie session and the native builds an OAuth token, and the app sends neither today; the sign-in round decides. [Source: system draft, line 269 of the original, carried over, confirm]
3. Which of the app's own checks the regenerated schemas keep: a list never longer than its total, a valid IANA time zone, and no comma in a drill value.
4. How long an older app version is served.
5. WebSocket or server-sent events, and the types and payloads of the events.
6. How the API is paged: no read of this round needs it.
7. How the core learns the user and the scopes of a call that comes through the MCP gateway. This is open on [Security architecture](security.md).

## Decisions behind this page

| Decision | Status |
|---|---|
| [Commands and workflows carry BRD ids](decisions/brd-ids-on-commands.md) | Current |
| [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](decisions/api-contract-flow.md) | Current |
| [The API contract is the only coupling between app and back end](decisions/api-contract-only-coupling.md) | Current |
| [The app never computes a metric or a drill filter](decisions/metrics-are-server-snapshots.md) | Current |
| [The shell has its own endpoint](decisions/shell-api-contract.md) | Current |
| [Every response is validated, and every failure is a named state](decisions/validated-contracts-and-error-states.md) | Current |
| [Screens call the real API; a mock server answers in mock builds only](decisions/mock-server-behind-real-api.md) | Current |
| [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](decisions/backend-language-java-spring-boot.md) | Current |
| [A test writes the contract, with springdoc-openapi on the test classpath alone](decisions/contract-written-by-a-test.md) | Current |
| [The rules of the overview run in Java over the loaded items](decisions/overview-rules-in-java.md) | Current |
| [Error answers are Problem Details with a kind and a correlation id](decisions/error-bodies-problem-details.md) | Current |
| [No API version until the first breaking change](decisions/no-api-version.md) | Current |
| [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](decisions/command-catalog.md) | Draft |
| [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) | Draft |
| [The core's libraries](decisions/core-libraries.md) | Current |
| [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) | Draft |
| [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) | Draft |
| [The server owns every rule; the UI shows its result](decisions/server-owned-validation.md) | Draft |
| [`delayed=true` and `scope=mine` are provisional names](decisions/provisional-drill-parameters.md) | Draft |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 26 to 28, 30, 33, 46 and 47 (columns 1 to 3 only), 88 and 90 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 133 to 139, 144, 146 to 153, 215, 251 and 269 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../proposals/2026-10-11-repos-and-docs-design.md): sections 2.2, 3.2, 4.2 and 4.5.
- [Backend skeleton and the overview slice, design](../history/specs/2026-10-14-backend-skeleton-design.md): sections [5.6](../history/specs/2026-10-14-backend-skeleton-design.md#56-errors), [5.8](../history/specs/2026-10-14-backend-skeleton-design.md#58-contract), 6.1, [6.4](../history/specs/2026-10-14-backend-skeleton-design.md#64-the-overview) and 6.6; [plan three, the backend overview and the contract](../history/plans/2026-10-14-backend-overview-plan.md): Tasks 7 and 8, its Decisions and "Left for plan four"; [plan four, the backend delivery](../history/plans/2026-10-14-backend-delivery-plan.md): Tasks 4 and 5.
- The app code in the `metis-app` repository: `src/core/api/client.ts`, `src/core/api/shell.ts`, `src/core/api/overview.ts`, `src/core/api/project.ts`, `src/core/api/primitives.ts`, `src/platform/config.ts`, `src/platform/mocks.ts` and `src/platform/mocks.web.ts`.
- Files of `metis-backend` read on 16 Oct 2026: `contract/openapi.json`, `core/src/main/java/dev/metis/core/platform/contract/Operation.java` and `ActionClass.java`, `core/src/test/java/dev/metis/core/ContractTest.java`, `ContractDocument.java` and `ContractIdsTest.java`, `build.gradle.kts` (`checkContract`), `tools/src/main/java/dev/metis/tools/image/Fuzz.java`.
- BRD rows PLT-06, TEN-05, BR-32, BR-39, BR-42, MCP-09, MCP-10, MCP-14, MCP-18 and D-30, in `business/requirements/`.
- Pages read on 12 Oct 2026: springdoc.org, orval.dev/docs/guides/zod, kubb.dev/plugins/plugin-zod/, rfc-editor.org/rfc/rfc9457.html, docs.expo.dev/versions/latest/sdk/expo/, developer.apple.com/distribute/app-review/ and support.google.com/googleplay/android-developer/answer/9859751.
