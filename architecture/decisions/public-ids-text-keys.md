---
title: Text keys are the public ids; a UUID key never leaves the database
summary: Every row has a UUID key that never leaves the database, and a record that an address names carries a text key, unique in its tenant and never changed, which the API uses as its public id.
component: core
type: decision
status: current
ids: []
---

# Text keys are the public ids; a UUID key never leaves the database

## Context

The addresses of the app use readable keys, such as the workspace `creative-studio`, and the shell, which the core answers in the shape the app wrote, names a workspace and a project by such an id (`Shell.Place` and `Shell.Project` of the core). The core keeps its rows under UUID keys, which PostgreSQL 18 makes with `uuidv7()`. [Source: postgresql.org/docs/18/functions-uuid.html, read 14 Oct 2026, as section 9.1 of the design records it] The design chose what the API shows. [Source: design, section 4.5, the row "Public ids", and section 5.7]

## Decision

- Every row has a UUID key, which never leaves the database: `id uuid` with the default `uuidv7()`, or, for the table `tenant`, the tenant id itself.
- A record that an address names carries a text key, unique in its tenant and never changed, beside its UUID: `workspace.key` and `project.key`, each `unique (tenant_id, key)`. That key is its public id: the paths take it, as `GET /workspaces/{workspaceId}/shell` takes the key of the workspace, and the answers give it.
- A person is found by the subject of the token, unique in its tenant, and is never named by an id in an answer.
- A record that no address names gets no key: the shell names portfolios and programs by their names alone, and the core groups them by their UUIDs inside.

A key, as a path carries it, is at least one character, none of them `/`, `\`, `%`, `;`, NUL, LF, CR, U+2028 or U+2029, and is neither `.` nor `..`. Those are what the firewall of the core refuses in a path, so the contract states the rule as a `pattern` and a `not` on every path parameter, and a test holds the keys of the demo data to it. How a key is chosen when a record is created belongs to the modules that create records, with the write path, which must keep to that rule.

## Consequences

- An answer never carries a UUID of the database, so a client cannot learn or reuse one.
- The same key may exist in two tenants. The tenant of the token decides which record a key opens, and a test proves it: `TEN-02 a key that two tenants use opens the workspace of the tenant of the token` in `ShellApiTest`.
- A key never changes, so an address the app saved stays valid.
- A key outside the rule is answered 400 before the core reads it, never as a defect, and a caller built from the contract never sends one: `ContractIdsTest` and the calls Schemathesis generates from the contract in the image check prove both.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Public ids"; sections 5.7, 6.2 and 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 38).
- [Plan four, the backend delivery](../../history/plans/2026-10-14-backend-delivery-plan.md): Task 5, the fourth finding.
- Files of `metis-backend` read on 16 Oct 2026: `core/src/test/java/dev/metis/core/ContractDocument.java` (`ID`) and `ContractIdsTest.java`, `contract/openapi.json`.
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/resources/db/migration/V1__registry.sql` (lines 6 to 80), `core/src/main/java/dev/metis/core/workspace/internal/domain/Shell.java` (lines 26 to 36), `core/src/main/java/dev/metis/core/workspace/internal/data/Trees.java` and `core/src/integrationTest/java/dev/metis/core/ShellApiTest.java` (line 109).
- Page read on 14 Oct 2026, as the design cites it: postgresql.org/docs/18/functions-uuid.html.
