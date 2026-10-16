---
title: The environment creates the database roles; migrations only grant
summary: The two database roles of the core, the owner of the tables and the role of the API, are created by the environment, never by a migration, and a migration only grants the role of the API the rights the code uses.
component: core
type: decision
status: current
ids: [TEN-02]
---

# The environment creates the database roles; migrations only grant

## Context

Tenants are kept apart by row-level security, which stops protecting them if the application connects as a superuser, as the owner of a table without `FORCE`, or with a role that has `BYPASSRLS` ([Tenant isolation with PostgreSQL row-level security](tenant-isolation-rls.md)). So the core needs two roles: one that owns the tables and migrates them, and one for the API that owns nothing. The proposals let Flyway create those roles. A migration cannot hold a password, and creating a role needs a privilege that the role of the migrations should not have. [Source: design, section 4.5, the row "Database roles"]

## Decision

- The environment creates the two roles, never a migration: `metis_migrator`, which owns the tables and the database and runs the migrations, and `metis_app`, the role of the API. In the local stack the init script of PostgreSQL, `stack/postgres/roles.sh`, creates them with passwords it reads from the environment and makes `metis_migrator` the owner of the database.
- A migration only grants: it gives `metis_app` exactly the rights the code uses.
- `metis_app` has no `SUPERUSER` and no `BYPASSRLS`, owns no table, is a member of no role, and holds only the rights the code uses. Today the API only reads: `select` on the seven tables of the registry and on the history of the migrations, which it reads to refuse a database that is behind.
- `metis_migrator` owns the tables and is itself subject to the forced policies.

This differs from the backend proposals, which let Flyway create the roles.

## Consequences

- No password is in a migration, and the role that runs the migrations cannot create roles of its own.
- Every environment must create the roles before the first migration. The local stack does it in its init script; a deployed environment, which belongs to `metis-infra`, must do the same.
- The integration tests read the rights as PostgreSQL applies them. `RolesTest` requires that `metis_app` is a member of no role and that, over every kind of right on a table, `has_table_privilege` gives `select` on those tables alone and `has_any_column_privilege` gives no insert, update or reference anywhere; it also requires that the owner of the tables is no superuser and cannot bypass a policy. The counter-tests integration-bypassrls, integration-app-in-owner-role, integration-public-write and integration-column-grant each plant one breach and go red.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Database roles"; section 5.4; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 35) and "Review round one" (line 16221).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `stack/postgres/roles.sh`, `stack/compose.yaml` (lines 6 to 21), `core/src/main/resources/db/migration/V1__registry.sql` (lines 117 to 121) and `core/src/integrationTest/java/dev/metis/core/RolesTest.java` (line 100).
- BRD row TEN-02, in `business/requirements/`.
