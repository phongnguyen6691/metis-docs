---
title: Agent interfaces
summary: What the planned agent service calls, what the rest of Metis needs it to expose, and the interface points the sources leave open.
component: agent
type: reference
status: draft
ids: []
---

# Agent interfaces

Planned, not built: the interfaces of the agent service. None exists yet, and the sources describe what the agent calls but not what it exposes.

## What it exposes

Open. The proposals describe the agent as a small separate service that can be written in any language, and they do not say what it exposes [Source: backend proposals, line 31 of the original]. No endpoint, message or file format is described.

What the rest of Metis needs to start from it, as the sources state it:

| Need | Source |
|---|---|
| A workflow block hands work to an agent that runs several steps with MCP tools, under the permissions of the person who created the workflow | backend brainstorm log, line 96 of the original |
| The onboarding agent runs when the tenant has authorized AI processing; it raises questions while it reads and writes only through the setup tool group | BRD requirements ONB-06 and ONB-22 |

How a run is started, how its questions and its result come back, and how it is cancelled are open.

## What it calls

| Target | What for | Source |
|---|---|---|
| The [MCP gateway](../mcp-gateway/README.md) | Every tool call, with a short-lived token that carries the user, the tenant and the scope | backend proposals, line 31 of the original; system draft, line 256 of the original, carried over, confirm |
| An LLM gateway, then the model provider | Every model call; the gateway holds the provider keys, pins model versions, caps the use of each tenant and records each call. Claude through Cloudflare AI Gateway, as proposed | backend brainstorm log, line 108 of the original; backend proposals, line 56 of the original |
| Temporal | An agent run is a durable workflow; each model call and each tool call is a step | backend proposals, lines 32 and 284 of the original; system draft, line 255 of the original, carried over, confirm |
| The egress gateway | Any call that leaves Metis | backend brainstorm log, line 107 of the original; [Controlled egress for connectors and agents](../../architecture/decisions/egress-control.md) |

The agent has no database access, and it calls tools only through the gateway [Source: backend brainstorm log, line 109 of the original; backend proposals, line 31 of the original].

## Reference pages

`reference/` does not exist yet. It will hold the agents, the tools each may call and the model each calls, generated from the agent definitions (see section 3.2, line 160 of the original, of [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md)).

## Open questions

- What the agent exposes, and in which language and framework it is built.
- Which service issues the short-lived token, and its lifetime and scopes.
- Whether the LLM gateway is Cloudflare AI Gateway alone, and which of its duties must be built (see [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md)).

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 31, 32, 56 and 284 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 96, 107, 108 and 109 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 255 and 256 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.2 (line 160 of the original).
- BRD rows ONB-06 and ONB-22, in `business/requirements/`.
