---
title: Tenant isolation with PostgreSQL row-level security
summary: Tenants share one schema with a tenant id on every row, and the database itself enforces a forced row-level policy on every table, set for each transaction from the token, through an application role that cannot bypass it, with negative tests in the checks.
component: core
type: decision
status: current
ids: [TEN-02, D-28, ONB-23]
---

# Tenant isolation with PostgreSQL row-level security

## Context

The BRD asks for every data path to be isolated by tenant (TEN-02), with a negative test for each path on every release. For the database it asks for a tenant id on every row, enforced by a row-level policy in the database and not only in application queries. The matrix that says so is a draft, written on the assumption of shared infrastructure with strict logical isolation (D-28), and the mechanisms are to be confirmed by the architecture decision. A record that does not exist and a record of another tenant must look the same, including the response time (ONB-23). [Source: backend brainstorm log, line 32 of the original; BRD requirements TEN-02 and ONB-23, decision D-28 and the isolation matrix under TEN-02]

In PostgreSQL, superusers and roles with the `BYPASSRLS` attribute always bypass row security. Table owners normally bypass it as well, unless the table is altered with `FORCE ROW LEVEL SECURITY`. [Source: postgresql.org/docs/current/ddl-rowsecurity.html, read 12 Oct 2026] The default role of PlanetScale, a managed PostgreSQL offering that the proposals considered, is defined with `BYPASSRLS` [Source: planetscale.com/docs/postgres/connecting/roles, read 12 Oct 2026], which the proposals list as a risk. [Source: backend proposals, lines 45 and 226 of the original]

Two facts were measured while the first tables were built, on PostgreSQL 18.6. Any role may set `app.tenant_id`, `metis_app` included, so the policies keep tenants apart for the SQL that the core writes, not for any SQL at all. [Source: the security review of plan two, as section 5.4 of the design records it] And once a transaction that set the tenant ends, PostgreSQL leaves an empty text in the setting, not a missing one, on the same pooled connection. [Source: `TenantTransactionTest`, plan two, 15 Oct 2026]

## Decision

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), all of it, for the tables of the first slice:

- Row-level security of PostgreSQL isolates tenants. Tenants share one schema, with `tenant_id uuid not null` on every row of a tenant's table. Its default reads the tenant of the transaction, `nullif(current_setting('app.tenant_id', true), '')::uuid`, so application code never writes a tenant id.
- Every such table has row-level security enabled and forced, so that its owner is subject to it too, and one policy for reads and writes: the row's tenant equals the tenant of the transaction. A transaction without a tenant, whether the setting was never made or is left empty by an earlier transaction, sees no row and writes none.
- A foreign key names the tenant as well, so a row can never point at a row of another tenant.
- The application connects with its own database role, which cannot bypass the policies; Flyway runs the migrations under another role, which owns the tables and is subject to the forced policies too. See [The environment creates the database roles; migrations only grant](database-roles-from-environment.md) and [Migrations run as a one-shot job of the same image, before the API](migrations-one-shot-job.md).
- The tenant is set for each transaction from the token, as the first statement of the transaction; see [One transactional write path for the app, MCP, workflows and agents](single-write-path.md) and [The tenant comes from one claim of the token, `tenant_id`](tenant-claim.md).
- A record that does not exist and a record of another tenant take the same code path: the query returns no row and the answer is 404, with the same status, the same body and the same number of statements.
- Since any role may set the tenant, the architecture check guards the SQL of the core: only the repositories and the tenant hook reach the database, a repository calls nothing but `JdbcClient`, and the text of every statement is a constant of its class, so no value of a request can become part of a statement and choose its own tenant.
- Negative tests run in the checks, with a cross-tenant case for every endpoint.

As plan two built it: the seven tables of the registry (`tenant`, `person`, `workspace`, `workspace_member`, `portfolio`, `program` and `project`) in `V1__registry.sql`, each with the policy `tenant_rows`; the transaction manager of the core, `TenantTransactionManager`, which runs `select set_config('app.tenant_id', ?, true)` in the hook Spring calls right after a transaction begins; and the integration tests `CatalogTest`, `RolesTest`, `TenantTransactionTest`, `RepositoriesTest` and `CrossTenantTest`. Of the data paths of the BRD's isolation matrix, this round has the database and the application logs, whose lines carry the tenant id and no content of a record ([OpenTelemetry sent to Grafana Cloud](observability-opentelemetry.md)); the other eight enter with their components.

Still proposed, carried over from the superseded system draft, confirm: a large enterprise tenant may later get its own database in the same region (D-28). [Source: system draft, line 201 of the original]

## Consequences

- The database refuses to return another tenant's rows even if the application code forgets a filter, which is what the BRD means by a policy enforced in the database and not only in application queries. [Source: BRD requirement TEN-02, the database line of its isolation matrix]
- The protection disappears silently if the application connects as a superuser, as a table owner without `FORCE`, or with a role that has `BYPASSRLS`. [Source: backend proposals, line 226 of the original] The checks now catch each case: `CatalogTest` reads the catalog of the migrated database and fails a table without the tenant column, the forced policy, a UUID key or a foreign key that names the tenant, and any relation the API can read that is not such a table; `RolesTest` reads the effective rights of both roles; `TenantTransactionTest` proves on one pooled connection that the tenant ends with its transaction; `CrossTenantTest` calls every endpoint with the ids of another tenant. The counter-tests integration-no-policy, integration-no-force, integration-no-tenant-column, integration-bypassrls, integration-session-tenant, integration-read-only and integration-readable-view each plant one breach and go red.
- The tests compare the status, the body and the number of statements of a foreign record and a missing one; the response time itself is not measured.
- Effort: a policy on each table, two database roles, the tenant set at the start of every transaction, and a negative test for each data path; a new table that misses any of them fails the catalog test.
- It rules out relying on application filters alone, and an application that connects as the table owner or as a superuser.

## Status

Current. The owner adopted all of it but a database of its own for a large tenant on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), for the tables of the first slice, and plan two built it in `metis-backend`, which has no commit yet. The BRD's isolation matrix is itself a draft that the architecture decision confirms. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 29, 45 and 226 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 201 of the original, carried over, confirm.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 32 of the original.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), [section 5.4](../../history/specs/2026-10-14-backend-skeleton-design.md#54-tenancy), sections 5.7 and 8.4, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (lines 35, 36 and 39), the Review Focus (lines 49 to 51), "Review round one" (lines 16220 to 16222), "Review round two" (line 16262) and "What the sandbox taught" (line 16319).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/resources/db/migration/V1__registry.sql`, `core/src/main/java/dev/metis/core/platform/tenancy/internal/TenantTransactionManager.java`, the `@DisplayName` titles of `CatalogTest`, `RolesTest`, `TenantTransactionTest` and `RepositoriesTest` in `core/src/integrationTest/java/dev/metis/core/`, and `tools/src/main/java/dev/metis/tools/canary/IntegrationCanaries.java`.
- BRD rows TEN-02, D-28 and ONB-23, in `business/requirements/`.
- Pages read on 12 Oct 2026: postgresql.org/docs/current/ddl-rowsecurity.html and planetscale.com/docs/postgres/connecting/roles.
