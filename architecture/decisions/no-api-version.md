---
title: No API version until the first breaking change
summary: The paths and headers of the core carry no API version; the comparison of the contract guards compatibility, and a version enters with the first breaking change that must ship.
component: core
type: decision
status: current
ids: []
---

# No API version until the first breaking change

## Context

The back end must keep answering the versions of the app already on phones. The decided contract flow guards that: oasdiff compares every change of the contract with the base branch, and a breaking change needs the label `contract: breaking`, set by the frontend lead ([The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md)). The design left an API version in the path or in a header out of the first round, with the other things nothing in that round would use, each to enter with its first user. [Source: design, section 2, and section 4.5, the row "API versioning"]

## Decision

- The API carries no version, neither in the path nor in a header. The first read is `GET /workspaces/{workspaceId}/shell`.
- A version enters with the first breaking change.

## Consequences

- One shape per operation, and no routing by version in the core or in the app.
- Compatibility rests on the comparison of the contract that the decided flow runs. The contract file and its checks are not built yet in `metis-backend`.
- It rules out a version prefix such as `/v1` on the first endpoints.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. The path that plan two built in `metis-backend`, which has no commit yet, carries no version. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "API versioning"; section 2; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- File of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/workspace/internal/web/ShellController.java` (line 21).
