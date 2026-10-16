---
title: Who may open a workspace or a project is a rule written in the use case
summary: Until the permission matrix exists, the rule on who may open a workspace or a project is Java code of the workspace module, called from the use case, so coverage, mutation testing and the unused-code check reach it.
component: core
type: decision
status: current
ids: [WSP-02, D-15]
---

# Who may open a workspace or a project is a rule written in the use case

## Context

The BRD keeps the role model as a machine-readable permission matrix that drives server enforcement and generated permission tests (D-15), and asks that users see only the workspaces and records they are authorized for (WSP-02). The permission model is not designed yet; the matrix of the 16 roles enters with the write path ([One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md)). The first reads still need a rule on who may open a workspace and a project.

The design weighed an annotation that holds the rule as an expression in a string, and found that such an expression would sit outside coverage, mutation testing and the unused-code check, which measure Java code. [Source: design, section 4.5, the row "Who may open a project"]

## Decision

- Until the permission matrix exists, the rule on who may open a workspace and a project is Java code of the `workspace` module, run by the use case, and no annotation with an expression in a string guards a read.
- The boundary between tenants is not part of the rule: the database keeps it, see [Tenant isolation with PostgreSQL row-level security](tenant-isolation-rls.md).

As plan two built it for the shell, in `ShellReader` of `workspace/internal/app`: a person whom the tenant does not know, or who is no member of the workspace, may not open it and is answered 403 `forbidden`; a workspace the tenant does not have is answered 404 `notFound`, by the same path as one that does not exist. The use case throws `Forbidden` or `NotFound` of the named interface `platform :: web`, and the core writes the answer; see [Error answers are Problem Details with a kind and a correlation id](error-bodies-problem-details.md).

## Consequences

- The rule is under the same checks as every other line: unit tests of the use case (`ShellReaderTest`), the integration tests over HTTP (`ShellApiTest`) and the cross-tenant tests (`CrossTenantTest`).
- Only membership decides, so the answers carry no field that says a person may only read; it enters with the permission model.
- The permission matrix of the 16 roles enters with the write path, and its design decides what becomes of this rule.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built the rule of the workspace in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Who may open a project"; sections 5.5 and 6.6; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 37).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/workspace/internal/app/ShellReader.java` (lines 30 to 43), `core/src/main/java/dev/metis/core/platform/web/Forbidden.java` and `NotFound.java`.
- BRD rows WSP-02 and D-15, in `business/requirements/`.
