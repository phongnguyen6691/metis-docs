---
title: Develop the agent
summary: What is fixed and what is open about the toolchain and checks of the planned agent service, with no command yet because nothing is built.
component: agent
type: how-to
status: draft
ids: []
---

# Develop the agent

Planned, not built: the toolchain and the checks of the agent service. No language is chosen and `metis-backend` has no build yet, so this page names no command. Each check below gets the command that runs it when the build exists.

## Toolchain

| Concern | Planned choice | Status |
|---|---|---|
| Language and framework | None chosen; the proposals say the agent can be written in any language | Open [Source: backend proposals, line 31 of the original] |
| Repository | A folder of `metis-backend`; it moves to its own repository with its history only if an AI team forms | Decided: [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md) |
| Packaging | A container image deployed with the other backend services to the same environments | Named in the repositories design [Source: repositories design, sections 2.1 and 2.2, lines 68 and 82 of the original] |
| What it talks to | The [MCP gateway](../mcp-gateway/README.md) for tools, an LLM gateway for models, Temporal for runs | Proposed: [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md) |

Because the agent only calls MCP tools, it can be written in whichever language suits AI work best without touching the core (see [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md)).

## Checks

None of these checks exists yet.

| Check | What it would prove | Source |
|---|---|---|
| The assurance suites of the onboarding agent | A boundary suite (cross-tenant probing, access beyond role, fuzzing, rate limits), an agent red-team suite (injection, prompt extraction, jailbreaks) and an extraction-accuracy suite run on every release and on every change of model, provider or prompt, and fail the release on any finding | BRD requirement ONB-25 |
| One end-to-end test | Agent, gateway, core and PostgreSQL, with Keycloak tokens, in one pipeline | [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 2.2 item 3 (line 82 of the original) |
| No database access | The agent has no path to the database, only MCP tools | backend brainstorm log, line 109 of the original |
| Documentation generator | One command writes the agents, the tools each may call and the model each calls into `build/docs/` | the same design, sections 3.2 and 4.2 (lines 160 and 234 of the original) |

The reviewers also propose a software bill of materials, signed builds and an approval when a provider or a model changes; it is a draft ([A software bill of materials, signed builds, approval when a provider or model changes](../../architecture/decisions/supply-chain-integrity.md)).

## Rules for code and documents

- Code, comments, test titles and tool output are English; this is the rule in the `AGENTS.md` of `metis-backend`.
- Read the decision records in [architecture/decisions](../../architecture/decisions/) before choosing a library or a pattern. A change of behaviour comes with its documentation change in `metis-docs`.
- The agent's context holds no credentials, hostnames or provider keys: every control that decides what may be read or written lives in code on the server, never in a prompt (BRD requirement ONB-24).

## Open questions

- The language, the framework and every tool of the build and the tests.
- How a run is tested without calling a real model: the sources do not say.
- The thresholds of the assurance suites: the BRD leaves the extraction-accuracy threshold to Discovery, per record type (D-39), and the other thresholds are not set in the sources.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 31 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 109 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 2.2, 3.2 and 4.2 (lines 68, 82, 160 and 234 of the original).
- BRD rows ONB-24, ONB-25 and D-39, in `business/requirements/`.
