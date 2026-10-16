---
title: Agent
summary: The planned AI agent service that calls an LLM and reaches Metis data only through MCP tools, with its dependencies, team and open points.
component: agent
type: overview
status: draft
ids: []
---

# Agent

Planned, not built: the AI agent service, the loop that calls an LLM and reaches Metis data only through MCP tools, first for the onboarding agent and later for agent steps in workflows. `metis-backend` holds no code yet, so nothing on this page can be run, called or tested today.

## What it does

Everything in this section is the plan; the table under Decided and proposed gives the status of each choice.

- **Runs agents.** The onboarding agent comes first: the BRD addendum puts an external LLM in the first release for onboarding, and the onboarding agent is an MCP client with a short-lived token whose model holds no tool that writes [Source: backend brainstorm log, lines 35 and 44 of the original]. Agent steps in workflows come last: the owner chose automation inside Metis, outbound connectors and AI and agent steps, and the proposal delivers them in that order [Source: backend brainstorm log, lines 96, 99 and 101 of the original]. See [Internal rules, connectors, AI and agent steps; no customer code](../../architecture/decisions/automation-scope.md).
- **Calls tools only through the MCP gateway**, with a short-lived token [Source: backend proposals, lines 31 and 56 of the original]. The token is narrow in scope and carries the permissions of the person who created the workflow; heavy actions need a person's approval; no agent touches the database directly [Source: backend brainstorm log, line 109 of the original]. The BRD describes the same pattern for the onboarding agent (ONB-06, ONB-24).
- **Calls models through one LLM gateway** that holds the provider keys, pins model versions, caps how much each tenant can use and records an audit entry for each call [Source: backend brainstorm log, line 108 of the original]. The proposals name Claude as the model, reached through Cloudflare AI Gateway [Source: backend proposals, line 56 of the original].
- **Runs on Temporal.** An agent run is a durable workflow, so it can wait for days and survives a restart [Source: backend proposals, lines 32 and 284 of the original]. The superseded system draft made each model call and each tool call one step of the run [Source: system draft, line 255 of the original, carried over, confirm].

Every call that leaves Metis from an agent or a connector passes the egress gateway (see [Controlled egress for connectors and agents](../../architecture/decisions/egress-control.md)).

## Decided and proposed

| Record | Status |
|---|---|
| [Internal rules, connectors, AI and agent steps; no customer code](../../architecture/decisions/automation-scope.md) | Decided |
| [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md) | Decided: the agent lives in `metis-backend` and may move later |
| [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md) | Proposed |
| [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md) | Proposed |
| [A thin, stateless MCP gateway in TypeScript](../../architecture/decisions/mcp-gateway-typescript.md) | Proposed |
| [Controlled egress for connectors and agents](../../architecture/decisions/egress-control.md) | Proposed, carried over, confirm |

## What it depends on

| Dependency | What the agent uses it for |
|---|---|
| The [MCP gateway](../mcp-gateway/README.md) | Every tool call, with the short-lived token |
| An LLM gateway and a model provider | Every model call; Claude through Cloudflare AI Gateway, as proposed |
| Temporal | Runs of the agent as durable workflows |
| The egress gateway | Calls that leave Metis |

The agent has no database access and no other path to Metis data [Source: backend brainstorm log, line 109 of the original].

## Team and repository

- **Team:** the backend team [Source: repositories design, section 2.1, line 68 of the original].
- **Code repository:** `metis-backend`, which holds no code yet. If an AI team forms, the agent folder moves to its own repository with its history [Source: repositories design, section 2.4, line 100 of the original]. See [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md).
- **Reference pages:** `reference/` does not exist yet. It will hold the agents, the tools each may call and the model each calls, generated from the agent definitions [Source: repositories design, section 3.2, line 160 of the original].

## Read next

- [Develop the agent](develop.md), [Agent interfaces](interfaces.md) and [Troubleshoot the agent](troubleshoot.md).
- The architecture pages [overview](../../architecture/overview.md) and [security](../../architecture/security.md).

## Open questions

- The language and framework of the agent: the proposals say any language will do and choose none [Source: backend proposals, line 31 of the original].
- What the agent exposes: how a run starts and how its result comes back are not described [Source: backend proposals, line 31 of the original].
- The lifetime and the scopes of the agent token, and which service issues it: the sources say only that it is short-lived and narrow (see [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md)).
- Which duties of the LLM gateway (keys, pinned versions, ceilings per tenant, audit) Cloudflare AI Gateway covers, and what must be built; the sources do not say.
- The model provider: the BRD fixes how a provider is chosen (D-33) and what is audited (D-34), and the selection belongs to Discovery. The record lists as open that the provider's API routes requests globally by default, while D-33 lists regional processing as a criterion.
- Whether the agent moves to its own repository: only if an AI team forms.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 31, 32, 56 and 284 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 35, 44, 96, 99, 101, 108 and 109 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 255 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 2.4 and 3.2 (lines 68, 100 and 160 of the original).
- BRD rows ONB-06, ONB-24, D-33 and D-34, in `business/requirements/`.
