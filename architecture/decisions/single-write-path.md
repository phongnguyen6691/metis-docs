---
title: One transactional write path for the app, MCP, workflows and agents
summary: Every write from the app, MCP, workflows and agents takes one path inside a single database transaction, from the token to the audit row and the outbox event; its first three steps, the token, the tenant from the token and the tenant set in the transaction, are adopted for reads.
component: core
type: decision
status: draft
ids: [PLT-06, PLT-11, MCP-14]
---

# One transactional write path for the app, MCP, workflows and agents

## Context

The BRD sets one write contract for the application, MCP and the API. Every write carries the version of the record it was based on and an idempotency key; a stale version is rejected with the newer value, and a retried key is applied once (PLT-06). MCP write tools use the same contract (MCP-14). Audit entries cannot be edited or deleted (PLT-11). Edits of the same field are detected and never silently overwritten, while edits of different fields of one record do not clash (PLT-06). [Source: BRD rows PLT-06, MCP-14 and PLT-11]

The first code of the core only reads: the backend skeleton design builds two reads and leaves writes to a later round. Its section 3 adopts the steps of this path that a read takes. [Source: design, sections 2 and 3]

## Decision

The path every write takes, whichever channel it comes from (app, MCP, workflow or agent). [Source: backend proposals, line 28 of the original]

1. Spring Security checks the token issued by Keycloak (see [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md)); the app may use a session instead of a token. [Source: backend proposals, line 28; system draft, line 107 of the original]
2. The tenant is taken from the token, and never from the body of the request. [Source: backend proposals, line 28; system draft, line 107 of the original]
3. At the start of the database transaction the tenant is set with `set_config('app.tenant_id', ..., true)`. With `true` as its third argument, the setting applies only during the current transaction. [Source: postgresql.org/docs/current/functions-admin.html, read 12 Oct 2026]
4. The permission is checked against the permission matrix. [Source: backend proposals, line 28; system draft, line 108 of the original]
5. The idempotency key is looked up, so that a retried call is applied once. [Source: backend proposals, line 28; system draft, line 109 of the original]
6. The version of each field is checked. [Source: backend proposals, line 28; system draft, line 109 of the original]
7. The command runs in the transaction and writes its data. [Source: system draft, line 109 of the original]
8. The audit row and the outbox event are written in the same transaction. The transaction commits and the result is returned. [Source: backend proposals, line 28; system draft, line 110 of the original]

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design): steps 1 to 3, for a read. As plan two built them in `metis-backend`:

- Spring Security checks every request as an OAuth2 resource server: a bearer token alone, its signature against the keys of the issuer, the issuer, the audience `metis-core`, and an expiry it must have, judged by the time of the machine. A missing or failing token is answered 401 before any controller runs. The core is stateless, with no session, no cookie and no CSRF token.
- The tenant is the one UUID of the claim `tenant_id` of the token; see [The tenant comes from one claim of the token, `tenant_id`](tenant-claim.md). The person reaches the controller as `CurrentUser`, a parameter, never through a static holder.
- The transaction manager of the core, `TenantTransactionManager`, runs `select set_config('app.tenant_id', ?, true)` in `prepareTransactionalConnection`, the hook Spring calls right after a transaction begins, from the tenant of the current user. The same hook makes a read-only transaction read-only in the database, so a read cannot write. A use case is the only place a transaction starts, by annotation or by any transaction API, and the architecture check fails any other.

Still proposed, not decided by the owner:

- Steps 4 to 8, which enter with the write path and the command catalog.
- The session of the web build that step 1 allows, which belongs to the round that builds sign-in.
- After the commit, a worker forwards the outbox events to Temporal (to start workflows, see [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md)), to Valkey (to push updates to screens, see [Push updates and rate limits on Valkey](realtime-and-rate-limits.md)) and to notifications. [Source: system draft, line 111 of the original]
- Carried over from the superseded system draft, confirm: the write request is an envelope of `commandId`, `idempotencyKey`, `expectedVersion` and `payload`. Each record keeps a `version` and a version for each field, so a conflict arises only when the same field is changed; a command that changes another field still writes (PLT-06). [Source: system draft, line 144 of the original]

## Consequences

- Permission, idempotency, versioning and audit sit on one path, so no channel can write without them. [Source: backend proposals, line 28 of the original]
- The audit row and the outbox event commit together with the data they describe, so neither is lost or written alone. Events leave only after the commit. [Source: backend proposals, line 28; system draft, lines 110 and 111 of the original]
- The tenant comes from the token and is set in the transaction, which is what lets row-level security isolate tenants, see [Tenant isolation with PostgreSQL row-level security](tenant-isolation-rls.md). Because the setting lasts one transaction, a pooled connection carries no tenant into the next request: `TenantTransactionTest` proves it on one connection, and the counter-test integration-session-tenant, which sets the tenant for the session instead, goes red.
- Keys of the issuer that cannot be read must not let a request fail with 500: the decoder of the core turns that failure into a rejected token, answered 401.
- Workflows and agents write only by calling commands, see [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md).
- Effort: every write runs these steps, and each field of each record needs a version of its own. [Source: system draft, line 144 of the original]

## Status

Draft. The owner adopted steps 1 to 3 for a read on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plan two built them in `metis-backend`, which has no commit yet. Steps 4 to 8 are still the proposal of 10 Oct 2026, not decided by the owner, and the parts that come from the superseded system draft are carried over, confirm. It stays a draft for the part the owner has not decided; the part adopted passed plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 28 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 104 to 112 and 144 of the original, carried over, confirm.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections 2, [3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), 5.3, 5.4 and 5.5, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (lines 36 and 37), the Review Focus (lines 49 and 52), "Review round one" (line 16228) and "What the sandbox taught" (line 16311).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/platform/security/internal/SecurityConfiguration.java`, `Tokens.java`, `core/src/main/java/dev/metis/core/platform/tenancy/internal/TenantTransactionManager.java` and `core/src/test/java/dev/metis/core/ArchitectureTest.java` (lines 166 to 192).
- BRD rows PLT-06, MCP-14 and PLT-11, in `business/requirements/`.
- Page read on 12 Oct 2026: postgresql.org/docs/current/functions-admin.html.
