---
title: Controlled egress for connectors and agents
summary: Every outbound call from connectors and agents leaves through one egress gateway with a per-tenant allow-list, blocked internal addresses and rate limits.
component: core
type: decision
status: draft
ids: []
---

# Controlled egress for connectors and agents

## Context

In BE-02 (10 Oct 2026) the owner chose outbound connectors (email, Slack or Teams, Jira) and webhooks, with each tenant keeping its own connection keys in a secret store, and AI and agent steps. [Source: brainstorm log, lines 95, 96 and 107 of the original]

The system draft adds that the MCP security guidance recommends an egress gateway as a defence against server-side request forgery. [Source: system draft, line 240 of the original]

## Decision

Proposed, not yet decided by the owner; carried over from the superseded system draft, confirm:

- Every outbound call from connectors and agents goes through one controlled egress gateway. [Source: brainstorm log, line 107; system draft, line 240 of the original]
- The gateway keeps a per-tenant allow-list of destinations, blocks internal network addresses and limits the rate of calls. [Source: brainstorm log, line 107; system draft, line 240 of the original]
- The connection keys sit in a secret store of each tenant. [Source: brainstorm log, line 107; system draft, line 240 of the original]
- The system draft proposed to build the gateway on Smokescreen (MIT licence, blocks internal addresses by default). [Source: system draft, line 240 of the original]

## Consequences

- A tenant's workflows and agents can reach only the destinations on that tenant's allow-list, and never an internal address. [Source: system draft, line 240 of the original]
- It rules out direct outbound calls: every outbound call goes through the gateway. [Source: brainstorm log, line 107 of the original]
- Connectors, the workflow interpreter and agents all depend on it, see [Versioned workflow graphs run by one interpreter](workflow-definition-model.md) and [The agent calls tools only through MCP; models through an LLM gateway](agent-and-llm.md).
- Open: the choice of Smokescreen comes from the superseded system draft and has not been confirmed.

## Status

Draft, carried over from the superseded system draft of 10 Oct 2026 and from the consequences listed under BE-02: not decided by the owner; confirm before use.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 95, 96 and 107 of the original (BE-02).
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 240 of the original, carried over, confirm.
