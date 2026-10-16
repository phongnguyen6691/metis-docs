---
title: Core interfaces
summary: The two reads the core serves to the app behind a bearer token, with their statuses, error bodies and headers, the answers to the app's questions, the development relay, what the core calls, and the interfaces still planned.
component: core
type: reference
status: current
ids: [WSP-02, WSP-06, REG-03, OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39]
---

# Core interfaces

The core that `metis-backend` holds, which has no commit yet, serves two reads, the ones screen 24 of the app calls, from PostgreSQL behind a bearer token. `contract/openapi.json` of `metis-backend` is the exact contract: the core writes it, and the check `contract` fails while the file differs from what the code declares. This page says what the file means for a caller. Every other interface of the core is planned, and listed at the end.

## What it serves

| Operation | Request | BRD ids | Statuses it documents |
|---|---|---|---|
| `workspace.shell.read` | `GET /workspaces/{workspaceId}/shell` | WSP-02, WSP-06, REG-03 | 200; 401; 403 for a person who is no member of the workspace; 404 for a workspace the tenant does not have |
| `delivery.overview.read` | `GET /workspaces/{workspaceId}/projects/{projectId}/overview`, with `scope=mine` or no parameter | OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39 | 200; 400 for a `scope` that is not `mine`, an empty one included; 401; 403 for a person who is no member of the project or of its workspace; 404 for a project that is not in that workspace |

- The ids in the path are the text keys the app's addresses use, such as `creative-studio`; a UUID never leaves the database. An id is at least one character, none of them `/`, `\`, `%`, `;`, NUL, LF, CR, U+2028 or U+2029, and is neither `.` nor `..`: the contract states it as a `pattern` and a `not` on every path parameter, and the core answers an id outside it 400 or 404, never as a defect. A `scope` other than `mine` is answered 400, an empty `scope=` included; no parameter reads the whole project.
- The answers are the shapes the app wrote in `src/core/api/shell.ts`, `overview.ts` and `project.ts` of `metis-app`, field for field: the contract makes every component of a record required, a nullable one nullable, and every text that is no code and no date at least one character long. A record behind a union, the delayed tile and the reasons of the health, stands alone in the contract, told apart by its required fields.
- Times leave as UTC instants ending in `Z`, days as `yyyy-mm-dd`. "Today" is the date of the clock in the workspace's time zone, which every project answer carries as `timeZone`.
- Each operation also documents a `default` response with the Problem Details schema: what the platform answers to a malformed request or a failure (below).
- Each operation is declared once, on its controller method, with `@Operation` of the module `platform.contract`: its durable name, a one-line summary, its BRD ids, its action class (`read` for both) and the statuses beside 200. The contract carries them as `operationId`, `summary`, `x-metis-brd` and `x-metis-action`.

### Errors

Every error is `application/problem+json` (RFC 9457) with `type`, `title`, `status`, `kind` and `correlationId`, and nothing else: no stack trace, no SQL text and no internal name. That holds for an error Tomcat answers before the application, a NUL in the path for one, since a report valve of the core writes the same body with its own correlation id. The app reads only the status today. The core reads no form and takes no upload: neither the multipart resolver nor the filter that reads the urlencoded body of a PUT, PATCH or DELETE runs, so no body is read before the token is checked, and the type of a body changes no answer of a read.

| Status | `kind` | When |
|---|---|---|
| 401 | `unauthenticated` | No token, or a token that fails a check |
| 403 | `forbidden` | The person of the token may not open the workspace or the project |
| 404 | `notFound` | No such record for this tenant; an unknown path, `/error` called directly included. A record of another tenant takes the same path as a missing one, with the same status, body and number of statements |
| 400 | `validation` | A query parameter with a value outside its list; a query the server cannot read, such as a parameter without a name; a path that holds a character the id rule refuses, encoded or not; a method outside the standard ones (`DELETE`, `GET`, `HEAD`, `OPTIONS`, `PATCH`, `POST`, `PUT`, `QUERY`) |
| 405, 406, 415 | `validation` | A method, an `Accept` or a `Content-Type` the endpoint does not take; a 405 names the methods it takes in `Allow` |
| 500 | `server` | A defect; the log line holds the types of the exception and of its causes with their frames, never a message |
| 503 | `unavailable` | The database cannot be reached |

### Tokens, headers and the public paths

- Bearer tokens only: no session, no cookie, no CSRF token. A token is checked for its signature, with keys fetched from the issuer that `METIS_SECURITY_ISSUER` names, its issuer, its audience `metis-core` and its expiry, judged by the real clock in every profile; a token without an expiry is refused.
- The token carries the tenant in the claim `tenant_id`: one UUID, or a list of exactly one, as a multivalued mapper of Keycloak sends it. No claim, two tenants or a value that is no UUID is answered 401; a subject that is no person of that tenant is answered 403.
- Every answer carries `Cache-Control: no-store`, since an answer belongs to one person.
- Without a token, the core answers three paths: `/actuator/health/liveness` and `/actuator/health/readiness`, without detail, readiness following the database; and `/.well-known/oauth-protected-resource`, the metadata of the protected resource (RFC 9728), which names the issuer alone.
- No other path answers without a token, in any profile, and the core has no CORS: a page of a browser reaches it through a proxy that adds a token, today the development relay alone.

## The answers to the app's questions

The app listed what it needs to know of the back end in [App interfaces](../app/interfaces.md#open-questions). The design of the core answers them so, and the code built them so; a rule marked provisional is one the BRD leaves open, kept in one function with its own definition version until the owner decides it.

| Question of the app | Answer |
|---|---|
| Will the back end answer the shell in the shape of the app's schema? | Yes: the contract is that shape, field for field |
| Will it keep the rules on the time zone, the project header, the initials and the drill values? | Yes: every project answer carries the workspace's `timeZone` and the `project` header; the server sends the initials; no value of a drill holds a comma, which the database refuses for a person's key and a WBS code. Each rule has a test |
| Which filter does the Delayed tile open? | `delayed=true`, provisional: the BRD's filter list has no such filter |
| Does "My items" filter by the person in charge or the assignee? | By the person in charge, provisional. With `scope=mine` every number counts the reader's own items, every drill also names the reader as `pic`, and the header does not change |
| Does the upcoming list also filter by date and status? | The list does: milestones and approval gates that are not done, with a target date of today or later, earliest first. Its drill still carries the labels alone, since the BRD's filter list has no date filter |
| How is health computed for resources and finance? | It is not: the answer carries delivery and risk, with a provisional rule for the computed level and its reasons |
| Which field says the viewer has read-only access? | None yet: it enters with the permission model |
| Will reads stay under 1 second at the 95th percentile? | The image check times the overview of a project of 2,000 work items on the image as a deployment runs it, 100 calls after 20 to warm up: 250 ms at the 95th percentile in the last full run, on the owner's Mac |

Where the core answers otherwise than the app's mock server, on purpose: the counts beside "My focus" and "Approvals" and the number of unread notifications are not sent (each badge is `null`, `notifications` is 0), since nothing counts them yet; a project of a workspace the person is no member of is answered 403, where the mock server answers 404; `scope=mine` counts the reader's items, where the mock server sends the same answer; and an error carries Problem Details, where the mock server sends no body. Every other field of both demo projects equals the app's mock answer, which a test of the core compares field for field.

## The development relay

The app sends no token yet, since sign-in is not built. So that a browser can open screen 24 on the real core, the demo overlay of the local stack, `stack/compose.demo.yaml`, adds a relay: nginx with a script of `stack/relay/`, on `127.0.0.1:8090` by default. On every call it asks the stack's Keycloak for a token of the realm's person `developer`, who is the demo person of the demo data, and forwards the call to the core with that token in place of any the caller sent. It forwards reads alone and answers any other method 403 itself; it answers only a request for the host `localhost` or `127.0.0.1`, and any other 421, so a page that rebinds its own name to the machine reaches no core; it answers every preflight itself; and only a page of the origin `METIS_APP_ORIGIN` (`http://localhost:8081` when unset, the app's development server) may read what it answers. When Keycloak gives no token it answers 500 and forwards nothing. The relay is configuration of the stack, never code of the core and never part of the image. [Develop the core](develop.md) says how to start it and how to point the app at it.

## What it calls

| Target | How the core talks to it | Status |
|---|---|---|
| PostgreSQL 18 | JDBC through HikariCP and the PostgreSQL driver, with explicit SQL through `JdbcClient`; every statement runs in a transaction whose first statement sets the tenant; the API connects as `metis_app`, which owns no table and cannot pass a policy | Built |
| Keycloak 26 | Fetches the keys of the issuer to check a token; never takes the tenant from anything but the token | Built |
| Valkey, object storage, Temporal, the sandbox, email, telemetry, an egress gateway | As the proposals plan them: see [Architecture overview](../../architecture/overview.md) | Planned |

## What it exposes later

| Interface | Consumer | Status |
|---|---|---|
| The writes, with their typed rejections | The app, the MCP gateway, workflows, agents | Planned: [One transactional write path for the app, MCP, workflows and agents](../../architecture/decisions/single-write-path.md) |
| The rest of the command catalog: permissions, undo rules, audit fields, confirmation modes, the generators of the MCP tools, the workflow blocks and the permission tests | The MCP gateway, the workflow editor, the permission tests | Planned: [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](../../architecture/decisions/command-catalog.md) |
| The same API to the MCP gateway | The MCP gateway and the agent | Planned: [A thin, stateless MCP gateway in TypeScript](../../architecture/decisions/mcp-gateway-typescript.md) |
| A realtime channel | The app | Planned, the protocol undecided: [Push updates and rate limits on Valkey](../../architecture/decisions/realtime-and-rate-limits.md) |
| Presigned URLs | The app | Planned: [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| Sign-in sessions and tokens of the app's builds | The app | Planned, with the sign-in round: [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) |

## Open questions

- The provisional rules of the overview (the computed health, `sinceBaseline`, "My items", the order and length of the lists, the order of the workload, done items, the freshness the operation sends, the codes of the item types the app has not met) wait for the owner: [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md#64-the-overview), section 6.4.
- How the app attaches a session or a token to its calls belongs to the sign-in round.
- How the MCP gateway reads the command catalog: the proposals say it does, and name no endpoint or file format [Source: backend proposals, line 30 of the original].
- WebSocket or server-sent events [Source: backend proposals, line 33 of the original].

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections [5.5](../../history/specs/2026-10-14-backend-skeleton-design.md#55-security), [5.6](../../history/specs/2026-10-14-backend-skeleton-design.md#56-errors), [5.8](../../history/specs/2026-10-14-backend-skeleton-design.md#58-contract), 5.10, [6.1](../../history/specs/2026-10-14-backend-skeleton-design.md#61-the-two-operations), 6.4, [6.5](../../history/specs/2026-10-14-backend-skeleton-design.md#65-demo-data-and-where-the-core-differs-from-the-mock-server) and [6.6](../../history/specs/2026-10-14-backend-skeleton-design.md#66-the-apps-open-questions-as-this-round-leaves-them).
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Tasks 5 to 8 and its Decisions.
- [Plan four, the backend delivery](../../history/plans/2026-10-14-backend-delivery-plan.md): Tasks 2 and 5.
- Files of `metis-backend` read on 16 Oct 2026: `contract/openapi.json`, `core/src/main/java/dev/metis/core/platform/contract/Operation.java`, `platform/security/internal/SecurityConfiguration.java` and `Tokens.java`, `platform/web/internal/RequestFilter.java`, `ProblemAdvice.java`, `EncodedSlash.java` and `TomcatErrors.java`, `core/src/main/resources/application.yml`, `delivery/internal/web/OverviewController.java`, `stack/compose.demo.yaml`, `stack/relay/nginx.conf` and `relay.js`.
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 30 and 33 of the original.
