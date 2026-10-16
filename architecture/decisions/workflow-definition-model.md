---
title: Versioned workflow graphs run by one interpreter
summary: A workflow definition is a versioned graph that is checked against the command catalog when published and then frozen, and one shared interpreter runs the frozen version.
component: core
type: decision
status: draft
ids: [BLD-16, TEN-10]
---

# Versioned workflow graphs run by one interpreter

## Context

In BE-02 (10 Oct 2026) the owner chose that tenant administrators build automation by drag and drop: when an event happens or a time comes, and the conditions hold, run a Metis command such as creating a task, sending a notification or asking for an approval. Customers write no code. The BRD and its addendum do not ask for this. [Source: brainstorm log, lines 90, 94 and 101 of the original]

The BRD already treats lifecycle frameworks and process frameworks as configuration: a draft passes a check and publishing creates an immutable version (BLD-16). The log asks for workflow definitions to work the same way. [Source: brainstorm log, line 106 of the original]

Most of the detail below was written in the system draft of 10 Oct 2026, which the backend proposals superseded. It is carried over and has to be confirmed.

## Decision

Proposed, not yet decided by the owner:

- A workflow definition is data: a versioned graph. A published version never changes. [Source: brainstorm log, line 106 of the original]
- The graph is JSON with these kinds of block: trigger, condition, step, branch, wait, approval request, AI step and a step that hands work to an agent. [Source: system draft, line 237 of the original, carried over, confirm]
- Publishing checks every block against the command catalog (schema, permission, action class) and checks for loops, then freezes the version. [Source: system draft, line 237 of the original, carried over, confirm]
- One shared interpreter workflow on Temporal runs exactly the frozen version. Each step calls the command dispatcher under the automation's own identity, a service identity of the tenant that a tenant administrator owns and whose scope is stated, so permission checks, audit and idempotency are the same as in the app. [Source: system draft, line 238 of the original, carried over, confirm]
- Triggers are domain events, schedules, signed incoming webhooks and manual runs. [Source: system draft, line 239 of the original, carried over, confirm]
- Connectors are email, Slack or Teams, Jira and generic HTTP. The keys sit in the tenant's own secret store and every outgoing call passes the egress gateway, see [Controlled egress for connectors and agents](egress-control.md). [Source: system draft, line 240 of the original, carried over, confirm]
- The number of workflows one tenant runs at the same time is limited (TEN-10). [Source: system draft, line 241 of the original, carried over, confirm]
- The editor is React Flow (MIT licence) on the web; on iOS and Android it runs through Expo's DOM components, which embed the web editor in the app. [Source: system draft, line 242 of the original, carried over, confirm]
- Customers write no code (BE-02). [Source: system draft, line 243 of the original]

## Consequences

- Permission checks, audit and idempotency of a workflow step are the same as in the app, because each step goes through the same dispatcher under a scoped identity. [Source: system draft, line 238 of the original]
- The blocks of the editor are the commands of the catalog, see [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md). [Source: brainstorm log, line 90 of the original]
- Changing a workflow means publishing a new version. [Source: brainstorm log, line 106 of the original]
- On the native apps the editor is the web editor embedded in the app, not a native screen. [Source: system draft, line 242 of the original]
- Tenant-defined workflows run on Temporal, see [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md).
- It rules out customer-written code in workflows. [Source: brainstorm log, line 101 of the original]
- Open: the system draft was superseded by the backend proposals, so the block kinds, the identity model and the editor have not been confirmed against the current stack.

## Status

Draft, carried over from the superseded system draft of 10 Oct 2026 and from the consequences listed under BE-02: not decided by the owner; confirm before use.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 90, 94, 101 and 106 of the original (BE-02).
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 236 to 243 of the original, carried over, confirm.
- BRD rows BLD-16 and TEN-10, in `business/requirements/`.
