---
title: One code base and one image, run as the API or as its migration job
summary: The business core is one code base of modules with boundaries enforced by tooling, built into one image that runs as the API or as a one-shot migration job, so that writes keep real transactions across modules; the worker role is still proposed.
component: core
type: decision
status: current
ids: [TEN-10, CHG-07, PLT-11, ONB-15, A-07]
---

# One code base and one image, run as the API or as its migration job

## Context

The BRD asks for one service layer, with one permission model, one metric engine and one audit log, for both the app and MCP (section 7.10). Three jobs force writes across several modules in one transaction: the onboarding launch rolls back as a whole when it fails (ONB-15), applying an approved change request creates a new baseline (CHG-07), and every write command has an audit row beside it (PLT-11). BE-01 needs a deployment per region, and BE-02 needs a durable workflow engine, outbound connections, AI and agents. The working assumption was a small team with AI agents and no operations team on duty around the clock. [Source: backend brainstorm log, line 116 of the original]

Three shapes were compared (BE-03). [Source: backend brainstorm log, lines 120 to 122 of the original]

1. One code base split into modules and run in several roles (a modular monolith): module boundaries enforced by tooling; the same build runs as the roles `api` (web and mobile app), `mcp` (MCP endpoint), `worker` (background jobs), `workflow` (durable workflow runs) and `agent` (holds the LLM keys, only an MCP client), plus separate sandboxes for reading foreign files and rendering PDFs; one PostgreSQL per region.
2. Small domain services on Kubernetes: about ten services, each with its own database, linked by a Kafka-style event queue, with a service mesh.
3. Serverless functions with a cloud's own workflow service: each command is a function run on demand, workflows rely on that cloud's orchestration service and the database scales itself.

The log's judgments, which are opinions and not measurements, are these. [Source: backend brainstorm log, lines 126 to 133 of the original]

| Criterion | Modular monolith | Services on Kubernetes | Serverless on one cloud |
|---|---|---|---|
| Stability | High: few moving parts; heavy work, MCP, workflows and agents run as separate processes, so they do not slow people who are editing | Medium: many moving parts and network errors between services | Medium: function time limits and cold starts |
| Correct data | High: real transactions across modules, audit in the same transaction | Lower: distributed transactions and compensating steps to write by hand | Medium |
| Easy to scale | Add machines per role; the ceiling is one PostgreSQL per region | Highest | Scales itself; the database becomes the connection bottleneck |
| MCP and workflow export | One command catalog in one code base generates the API, the MCP tools and the workflow blocks | The catalog must be kept in step across services | Possible, but tied to that cloud's workflow service |
| Global readiness | Replicate the whole deployment for a new region | Replicate the whole cluster of services, which is heavy | Hard to move between clouds |
| Fit for a small team with AI agents | High | Low | Medium |

The proposal was the first shape. It is the only one that keeps real transactions across modules, separates processes in exactly the three places that need it, and can be replicated whole for each region. The three places are: one tenant's MCP load must not slow the app (TEN-10), the LLM keys sit outside the process that can write, and foreign files are read in a sandbox. [Source: backend brainstorm log, line 135 of the original]

The strongest objection is a shared release rhythm. A fault in one module blocks the release of every module, and the test run grows with the whole repository. At about 40 people on eight work streams the coordination overhead rises, and the BRD rates coordination across parallel workstreams a high risk (A-07). The mitigation is to enforce module boundaries with tooling from the start, so that a module that needs its own rhythm is split into a service along that boundary. [Source: backend brainstorm log, line 137 of the original]

The backend skeleton design then asked for one code base that every later backend task extends without reshaping it (BK-02), and its section 3 adopts the part of this record that the skeleton embodies. [Source: design, sections 1 and 3]

## Decision

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design):

- The core is one code base of modules whose boundaries tooling enforces: modules of Spring Modulith, verified by the architecture check; see [Modules of the core kept apart by Spring Modulith](core-modules-spring-modulith.md).
- It is built into one image; see [A multi-stage Dockerfile builds the image from the sources](image-built-from-sources.md).
- The image runs as the API by default and, chosen by configuration (the profile `migrate`), as a one-shot migration job; see [Migrations run as a one-shot job of the same image, before the API](migrations-one-shot-job.md).

As plans one and two built it in `metis-backend`: the Gradle project `core` holds the modules `platform` and `workspace`; `core/Dockerfile` builds the one image; `stack/compose.yaml` runs that image twice, as the service `migrate` and then as the service `core`.

Still proposed, not decided by the owner:

- The same image also runs as the role `worker`, chosen by configuration; the role is built with the first background job. [Source: backend proposals, line 24 of the original; design, section 3]
- The MCP gateway and the agent are not roles of the core: in the proposals the gateway and the agent are separate services, and Temporal runs the workflows. See the drafts [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md), [The agent calls tools only through MCP; models through an LLM gateway](agent-and-llm.md) and [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md). [Source: backend proposals, lines 30 to 32 of the original]
- A module is split into a service only when it needs its own release rhythm, along its enforced boundary. [Source: backend brainstorm log, lines 120 and 137 of the original]
- Each region runs its own copy with one PostgreSQL. [Source: backend brainstorm log, line 120 of the original]

## Consequences

- Writes keep real transactions across modules, with the audit row in the same transaction. [Source: backend brainstorm log, lines 116 and 135 of the original]
- All modules share one release rhythm, and the test run grows with the repository. [Source: backend brainstorm log, line 137 of the original]
- A boundary between modules that a change breaks fails the architecture check before review, so a later split follows a boundary that held all along.
- The command catalog stays in one code base, see [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md), and every write follows the path of [One transactional write path for the app, MCP, workflows and agents](single-write-path.md).
- It rules out the other two shapes, small services on Kubernetes and serverless functions, as the shape of the core.
- The log asked BE-03 on 10 Oct 2026 and records no result for it. [Source: backend brainstorm log, lines 114 and 143 of the original] The owner's approval of the backend skeleton design on 14 Oct 2026 adopted the shape for the part above.

## Status

Current. The owner adopted the part above on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plans one and two built it in `metis-backend`, which has no commit yet. The rest is still the proposal of the backend proposals of 10 Oct 2026, not decided by the owner. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 114, 116, 120 to 122, 126 to 133, 135, 137, 141 and 143 of the original (BE-03).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 24 and 30 to 32 of the original.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections 1, [3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), 5.2 and 5.10, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-02 and BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md) and [plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): the architecture of each (line 19).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `settings.gradle.kts`, the `package-info.java` of the modules under `core/src/main/java/dev/metis/core/`, `core/Dockerfile` and `stack/compose.yaml`.
- BRD rows TEN-10, CHG-07, PLT-11, ONB-15 and A-07, in `business/requirements/`.
