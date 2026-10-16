---
title: Internal rules, connectors, AI and agent steps; no customer code
summary: Workflow automation covers rules inside Metis, outbound connectors and AI and agent steps, and customers never write code that runs in a workflow.
component: core
type: decision
status: current
ids: []
---

# Internal rules, connectors, AI and agent steps; no customer code

## Context

Neither the BRD nor its onboarding addendum asks for drag-and-drop workflow automation, so its scope was the owner's to set (BE-02). The answer decides what the workflow engine needs (waiting for days, retrying by itself, undoing), whether code written by customers must be isolated, whether each tenant keeps its own connection keys and whether a shared gateway for calling LLMs is needed. [Source: backend brainstorm log, line 90 of the original]

Whatever the scope, the architecture is built around one command catalog (see [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md)): each command has a name, input and output data, a permission, an action class and audit fields. The app calls commands through the API, an LLM calls them through MCP, a workflow uses them as drag-and-drop blocks and an agent calls them as an MCP client. [Source: backend brainstorm log, line 90 of the original]

Four options were put to the owner. [Source: backend brainstorm log, lines 94 to 97 of the original]

1. Automation inside Metis: a tenant admin drags a rule of the form "on an event or at a time, if the conditions hold, run a Metis command", such as creating a task, sending a notification or asking for an approval.
2. Option 1 plus outbound connections: ready connectors (email, Slack or Teams, Jira) and webhooks, with each tenant keeping its own connection keys in a secret store.
3. Option 2 plus AI and agent steps: blocks that summarize, classify and draft reports, and a block that hands work to an agent that runs several steps with MCP tools under the permissions of the person who created the workflow.
4. A full automation platform in the style of n8n or Zapier, where customers write code that runs in the workflow, which needs a sandbox for foreign code.

The proposal was option 3 as the target, delivered in steps (internal automation first, outbound connections next, AI and agents last), and no customer-written code. Running foreign code in a multi-tenant product that aims at SOC 2 or ISO 27001 opens a whole attack surface, and the question can be reopened when there is real demand. [Source: backend brainstorm log, line 99 of the original]

## Decision

The owner answered "3" on 10 Oct 2026. [Source: backend brainstorm log, line 101 of the original]

- The foundation is designed for automation inside Metis, outbound connections (connectors and webhooks) and AI and agent steps.
- Customers do not write code that runs in a workflow.
- The proposal delivers the scope in steps: internal automation first, then outbound connections, then AI and agents. [Source: backend brainstorm log, line 99 of the original]

## Consequences

The log lists what the foundation needs. [Source: backend brainstorm log, lines 105 to 110 of the original]

- A durable workflow engine that waits for days (approval gates, deadlines), retries by itself and compensates when a step fails. The onboarding launch, for one, rolls back as a whole (ONB-15). The draft [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md) proposes an engine.
- Workflow definitions are data: a versioned graph, checked against the command catalog when it is published, and a published version does not change. The BRD treats lifecycle frameworks and process frameworks the same way. See the draft [Versioned workflow graphs run by one interpreter](workflow-definition-model.md).
- A secret store for each tenant holds the connector keys, and every call that leaves Metis passes through one controlled egress: internal networks blocked, a list of allowed destinations and rate limits. See the draft [Controlled egress for connectors and agents](egress-control.md).
- One shared LLM gateway holds the provider keys, pins model versions, caps usage per tenant and records an audit entry for each call.
- Agents run as MCP clients with a short-lived token of narrow scope that carries the permissions of the person who created the workflow. Heavy actions need a person's approval, and no agent touches the database directly; the onboarding agent follows the same pattern. See the draft [The agent calls tools only through MCP; models through an LLM gateway](agent-and-llm.md), which also covers the LLM gateway.
- Domain events are written in the same transaction as the command (the outbox) and trigger workflows, notifications and updates pushed to screens, without losing or repeating an event.
- It rules out customer-written code in workflows and a full automation platform of the fourth option. [Source: backend brainstorm log, line 99 of the original]

## Status

Current, decided by the owner on 10 Oct 2026 (BE-02).

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 86 to 110 of the original (BE-02).
- BRD row ONB-15, in `business/requirements/`.
