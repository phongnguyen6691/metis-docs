---
title: Develop the MCP gateway
summary: The planned toolchain and checks of the TypeScript MCP gateway, marked decided or proposed, with no command yet because nothing is built.
component: mcp-gateway
type: how-to
status: draft
ids: []
---

# Develop the MCP gateway

Planned, not built: the toolchain and the checks of the MCP gateway. `metis-backend` has no build yet, so this page names no command. Each check below gets the command that runs it when the build exists.

## Toolchain

| Concern | Planned choice | Status |
|---|---|---|
| Language and runtime | TypeScript on Node.js 24 | Proposed: named in the table of the repositories design, whose approval (RD-05) decided the repositories and not the stack, and in [A thin, stateless MCP gateway in TypeScript](../../architecture/decisions/mcp-gateway-typescript.md) (draft) |
| Package manager | pnpm | Named in the repositories design |
| MCP SDK | The version 2 packages of the TypeScript SDK (`@modelcontextprotocol/server`) | Proposed |
| Packaging | Docker | Named in the repositories design |
| Test tools, lint rules, coverage and mutation thresholds | Not stated in the sources | Open |

If the gateway proposal is adopted, the back end has two languages: Java for the [core](../core/README.md) and TypeScript for the gateway (see [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](../../architecture/decisions/backend-language-java-spring-boot.md)).

Sources: [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 2.1 (line 68 of the original); backend proposals, line 48 of the original.

## Checks

None of these checks exists yet.

| Check | What it would prove | Source |
|---|---|---|
| Audience check on every request | A token of tenant A sent to the endpoint of tenant B is refused with HTTP 401. The gateway checks the audience itself | BRD requirement TEN-02 (its isolation matrix) and MCP-04; backend proposals, line 224 of the original |
| A test with real LLM clients | The sign-in works with the clients customers use, before the first customer connects | backend proposals, line 224 of the original |
| A tool contract test | Every tool belongs to one action class and publishes policy metadata, including the confirmation mode, that a contract test can read | BRD requirement MCP-19 |
| The penetration test | Its scope includes the MCP gateway | backend proposals, line 206 (first sentence) of the original |
| A small gateway with pinned versions | The gateway stays very small and its dependency versions are pinned, because it brings the npm supply chain into a back end whose core is Java; provenance checks alone do not stop worms | backend proposals, line 225 of the original |
| Documentation generator | One command writes the MCP tools with their scopes and rate limits into `build/docs/` | [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), sections 3.2 and 4.2 (lines 159 and 234 of the original) |

The end-to-end test through agent, gateway, core and PostgreSQL, with Keycloak tokens, runs in the pipeline of `metis-backend` (see [The same test discipline as the front end](../../architecture/decisions/backend-testing.md)).

## Rules for code and documents

- Code, comments, test titles and tool output are English; this is the rule in the `AGENTS.md` of `metis-backend`.
- Read the decision records in [architecture/decisions](../../architecture/decisions/) before choosing a library or a pattern. A change of behaviour comes with its documentation change in `metis-docs`.
- Under the proposal, the tool list comes from the command catalog of the core, so a new tool starts as a command declared there [Source: backend proposals, lines 27 and 30 of the original].

## Open questions

- The test tools, the lint rules and the coverage and mutation thresholds for the gateway are not set in the sources.
- The local stack that runs the gateway beside the core, Keycloak and the agent is named in the repositories design and not described.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 27, 30, 48, 206 (first sentence), 224 and 225 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 3.2 and 4.2 (lines 68, 159 and 234 of the original).
- BRD rows TEN-02, MCP-04 and MCP-19, in `business/requirements/`.
