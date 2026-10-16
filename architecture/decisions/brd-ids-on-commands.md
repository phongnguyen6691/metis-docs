---
title: Commands and workflows carry BRD ids
summary: Each entry of the command catalog and each Temporal workflow names its BRD ids, and a check rejects one without ids or with an unknown id.
component: core
type: decision
status: current
ids: []
---

# Commands and workflows carry BRD ids

## Context

Documentation follows code through BRD ids. A page names in its header the BRD ids it covers, and these are the BRD's own ids, so nothing is numbered twice. The app already tags each screen this way, in the `requirements:` field of every `contract.yaml` (see [`contract.yaml` is each screen's promise, traced to tests](screen-contract-and-trace.md)). [Source: repositories design, sections 3.3 and 4.2]

When a code pull request changes behavior, the documentation bot collects the BRD ids carried by the changed screens, commands and workflows, together with each component the change touches. The candidate prose pages are the current pages whose header `ids` include a touched id, plus the pages of the touched components. [Source: repositories design, section 4.3, step 1]

## Decision

- Every screen, command and workflow names its BRD ids. The app's `contract.yaml` files already do. Each entry of the core's command catalog and each Temporal workflow gets the same field. [Source: repositories design, section 4.2]
- A check rejects a command or a workflow without ids, and one with an id the BRD does not define. [Source: repositories design, section 4.2]

## Consequences

- The ids are what connects a code change to the pages it touches, so the documentation agent knows which prose to check. [Source: repositories design, sections 4.2 and 4.3]
- A command or workflow with no BRD requirement behind it cannot pass the check; the requirement has to exist in the BRD first.
- The rule applies to the command catalog and to the Temporal workflows, which are proposals of the back-end design; see [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md) and [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md). It starts to bind when they exist.

## Status

Current, decided by the owner on 11 Oct 2026 (RD-07, section 4 of the repositories design approved).

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 3.3, 4.2 and 4.3, and the owner decision RD-07.
