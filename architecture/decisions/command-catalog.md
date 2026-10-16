---
title: One catalog generates the API, the MCP tools, the workflow blocks and the permission tests
summary: Each command is declared once in a catalog, from which the REST API, the MCP tool list, the workflow blocks, the front-end contract and the permission tests are generated; the declaration of an operation on its endpoint, exported into the contract file, is built, the rest is proposed.
component: core
type: decision
status: draft
ids: [MCP-09, MCP-19, D-15, D-30]
---

# One catalog generates the API, the MCP tools, the workflow blocks and the permission tests

## Context

Whatever scope the owner chose for automation (BE-02), the architecture is built around a command catalog: each command has a name, input and output data, a permission, an action class and audit fields. The app calls commands through the API, an LLM calls them through MCP, a workflow uses them as drag-and-drop blocks and an agent calls them as an MCP client. [Source: backend brainstorm log, line 90 of the original]

The BRD sets what the catalog has to feed. Every MCP tool has a stable name, a description and a versioned input schema (MCP-09) and belongs to one action class, which sets its safeguards (MCP-19). The access model is kept as a machine-readable permission matrix (D-15). MCP never approves, decides, changes a baseline, deletes or changes permissions (D-30). [Source: BRD rows MCP-09, MCP-19, D-15 and D-30]

The backend skeleton design adopted the first part of the catalog that its two reads need, and left the rest to the rounds that build writes and the MCP gateway. [Source: design, sections 3 and 5.8]

## Decision

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design): the declaration of an operation. Each endpoint carries a durable name, its BRD ids and its action class, declared once on its controller method and exported into the contract file, so that `contract/openapi.json` is the first form of the catalog: one entry per operation, with its name, its schemas, its BRD ids and its action class.

As plan three built it in `metis-backend`:

- `@Operation` of the module `platform.contract` declares an endpoint with its `name` (the module first, such as `delivery.overview.read`), a one-line `summary`, its `brd` ids, its `action`, an `ActionClass`, and the `statuses` its spec gives beside 200. `ActionClass` holds `read` alone, the class both operations of the round need.
- The test that writes the contract carries them as `operationId`, `summary`, `x-metis-brd` and `x-metis-action`, and documents each status with the Problem Details schema; see [A test writes the contract, with springdoc-openapi on the test classpath alone](contract-written-by-a-test.md).
- The architecture check fails a method mapped to a request that carries no `@Operation`; the check `contract` fails an operation without BRD ids or with an id the BRD lacks; the check `trace` fails a declared id that no passing unit test names; the integration tests must receive every status an operation documents.

Still proposed, not decided by the owner:

- A command also has the schema of its input, the permission it needs, an undo rule and the fields written to the audit log, and the action classes append-only, reversible write, prepare-only and admin. [Source: backend proposals, line 26 of the original]
- These are generated from the catalog: [Source: backend proposals, line 27 of the original]
  - the REST API with its OpenAPI 3.1 document, produced by springdoc-openapi, which is built for the two reads;
  - the zod 4 contract for the front end, generated from the OpenAPI document with orval or Kubb and checked in CI;
  - the tool list of the MCP gateway, see [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md);
  - the building blocks of the workflow builder, see [Versioned workflow graphs run by one interpreter](workflow-definition-model.md);
  - the matrix of permission tests for the 16 roles.
- Carried over from the superseded system draft, confirm: a command also has a scope (tenant, workspace or project) and a confirmation mode when it is called through MCP; the MCP tool list is filtered by action class and release milestone; in the builder an action is a command, a trigger is a type of domain event and a condition is a query; and two internal classes, admin and admin decision, can never be called through MCP. [Source: system draft, lines 133 and 135 to 139 of the original]

## Consequences

- An endpoint is declared in one place, and its name, BRD ids and action class reach the contract file and the checks from there. A later field of the catalog joins `@Operation` and the test that writes the contract. [Source: design, section 5.8]
- A command is defined in one place, and the API, the MCP tools, the workflow blocks and the permission tests follow from it, once their generators exist. [Source: backend proposals, lines 26 and 27 of the original]
- The permission tests for the 16 roles come from the same entries as the endpoints and the tools. [Source: backend proposals, line 27 of the original]
- The catalog is easiest to keep in one code base, which is part of the case for [One code base and one image, run as the API or as its migration job](modular-monolith-core.md).
- Every entry names its BRD ids, see [Commands and workflows carry BRD ids](brd-ids-on-commands.md).
- Effort: the generators of the tool list, the builder blocks and the permission matrix have to be built.
- It rules out defining an endpoint, a tool or a workflow block outside the catalog.

## Status

Draft. The owner adopted the declaration of an operation on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plan three built it in `metis-backend`, which has no commit yet. The permission, the undo rule, the audit fields, the confirmation mode and every generator but the OpenAPI one are still the proposals of 10 Oct 2026, not decided by the owner; the extra fields from the superseded system draft are carried over, confirm. It stays a draft for the part the owner has not decided; the part adopted passed plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 90 of the original (BE-02).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 26 and 27 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 133 and 135 to 139 of the original, carried over, confirm.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), [section 5.8](../../history/specs/2026-10-14-backend-skeleton-design.md#58-contract) and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Tasks 7, 9 and 10.
- Files of `metis-backend` read on 16 Oct 2026: `core/src/main/java/dev/metis/core/platform/contract/Operation.java` and `ActionClass.java`, `core/src/test/java/dev/metis/core/ModuleRulesTest.java` and `contract/openapi.json`.
- BRD rows MCP-09, MCP-19, D-15 and D-30, in `business/requirements/`.
