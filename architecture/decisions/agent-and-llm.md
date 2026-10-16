---
title: The agent calls tools only through MCP; models through an LLM gateway
summary: The agent is a separate service that reaches Metis data only through the MCP gateway with short-lived tokens, and every model call goes through one LLM gateway.
component: agent
type: decision
status: draft
ids: [ONB-06, ONB-24, D-33, D-34]
---

# The agent calls tools only through MCP; models through an LLM gateway

## Context

In BE-02 (10 Oct 2026) the owner chose that workflows may contain AI and agent steps, next to internal automation and outbound connectors; customers write no code. Whatever the components, the architecture is built around one command catalog: the app calls commands through the API, an LLM calls them through MCP, a workflow uses them as its blocks and an agent calls them as an MCP client. [Source: brainstorm log, lines 90 and 101 of the original]

The BRD already describes one agent, the onboarding agent. It is one more client of the MCP server with a short-lived token bound to the executive, the tenant and the draft workspace (ONB-06), and its context holds no credentials, hostnames or provider keys (ONB-24). The log asks for the same pattern for every agent. [Source: brainstorm log, line 109 of the original]

Customer content reaches the model provider on these calls, so the BRD also fixes how a provider is chosen (D-33) and what is audited (D-34).

## Decision

Proposed, not yet decided by the owner:

- The agent is a small separate service outside the core, written in any language. [Source: backend proposals, lines 31 and 56 of the original]
- It reaches Metis only as an MCP client. It calls tools through the MCP gateway with a short-lived token of narrow scope that carries the permissions of the person who created the workflow. Heavy actions need a person's approval. No agent touches the database directly. [Source: backend proposals, line 31; brainstorm log, line 109 of the original]
- Every model call goes through one shared LLM gateway. The gateway holds the provider keys, pins model versions, caps how much each tenant can use and records an audit entry for each call. [Source: brainstorm log, line 108 of the original]
- The BRD fixes what the gateway has to serve: the provider criteria of D-33 (a contractual no-training term, zero or short retention, regional processing, a data processing agreement, model version pinning) and the audit content of D-34 (metadata and redacted excerpts by default, full content only for calls flagged as security events).
- The proposals name Claude as the model, reached through Cloudflare AI Gateway. The sources do not say which duties of the gateway that product covers. [Source: backend proposals, line 56 of the original]

## Consequences

- The agent has no more reach than its token: the permission checks of any MCP client and no path to the database. [Source: brainstorm log, line 109 of the original]
- Because it only calls MCP tools, the agent can be written in whichever language suits AI work best without touching the core. [Source: backend proposals, line 31 of the original]
- Agent runs are workflows on Temporal, see [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md). Calls that leave Metis from an agent or a connector pass the egress gateway, see [Controlled egress for connectors and agents](egress-control.md).
- The provider named in the proposals states: no use of API data for training, incident notice within 48 hours, deletion of data within 30 days after termination, data stored in the United States, and the certifications SOC 2 Type II, ISO 27001:2022 and ISO 42001. [Source: backend proposals, line 289 of the original]
- Open: the provider's API routes requests globally by default. D-33 lists regional processing as a criterion, so this has to be settled before selection; selection itself belongs to Discovery under D-33. [Source: backend proposals, line 128 of the original]
- Open: the lifetime and the scopes of the agent token are not stated in the sources.
- Effort: the four duties of the gateway (keys, pinned versions, tenant ceilings, audit trail) have to be built or configured; the sources give no estimate.

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner. The scope (AI and agent steps in workflows) was decided in BE-02; the components were not.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 31, 56, 128 and 289 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 90, 101, 108 and 109 of the original (BE-02).
- BRD rows ONB-06, ONB-24, D-33 and D-34, in `business/requirements/`.
