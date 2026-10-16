---
title: Temporal for workflows, schedules and agent runs
summary: Temporal runs workflows, schedules, the workflow interpreter and agent runs, fed by the outbox, and payloads are encrypted before they reach a hosted Temporal.
component: core
type: decision
status: draft
ids: [PLT-09, TEN-06, GOV-13]
---

# Temporal for workflows, schedules and agent runs

## Context

BE-02 (10 Oct 2026) needs a durable workflow engine: it must wait for days (approval gates, deadlines), retry by itself and compensate when a step fails; the onboarding launch, for one, rolls back as a whole. [Source: brainstorm log, line 105 of the original]

The BRD adds time-driven work: reminders for items due soon or overdue and for a missing weekly status (PLT-09), purging a deleted tenant's data after the retention period (TEN-06) and re-blocking a criterion when a waiver expires (GOV-13). [Source: backend proposals, line 284 of the original]

Domain events are written in the same transaction as the command that causes them (the outbox), so that workflows, notifications and pushed updates can start without losing or repeating an event. [Source: brainstorm log, line 110 of the original]

## Decision

Proposed, not yet decided by the owner:

- Temporal (server under the MIT licence, Java SDK) runs workflows, schedules, the interpreter of drag-and-drop workflows and agent runs. [Source: backend proposals, lines 32 and 51 of the original]
- The outbox feeds it: the outbox moves events to Temporal and to email. [Source: backend proposals, line 32 of the original]
- A run can wait for days, for example for an approval or a reminder, and survives a restart. [Source: backend proposals, line 284 of the original]
- Temporal can be run by Metis or used as the hosted Temporal Cloud; this record does not choose between them. [Source: backend proposals, line 284 of the original]
- Temporal Cloud stores workflow history, so Metis encrypts payloads before sending them. [Source: backend proposals, line 127 of the original]

## Consequences

- Patch policy: only the three latest minor versions of the server are patched and a major version is supported for at least 12 months (taken from a search summary), so the server has to be kept on a recent version. [Source: backend proposals, line 51 of the original]
- Certification: Temporal Cloud holds SOC 2 Type II and no ISO 27001 was found. A supplier's SOC 2 Type II report is the kind of evidence the supplier controls of ISO 27001 ask for, see [ISO 27001 first, SOC 2 Type II when customers ask](security-certification-path.md). Run by Metis, Temporal falls under Metis's own controls. [Source: backend proposals, lines 51, 284 and 303 of the original]
- Temporal Cloud carries an availability commitment of 99.9%. [Source: backend proposals, line 284 of the original]
- Open: the codec feature that encrypts payloads exists in the .NET SDK, but for the Java SDK it was not verified, and it has to be verified before a hosted Temporal is used. [Unverified - confirm before applying] [Source: backend proposals, line 127 of the original]
- The interpreter of tenant-defined workflows and the agent runs both depend on this choice, see [Versioned workflow graphs run by one interpreter](workflow-definition-model.md) and [The agent calls tools only through MCP; models through an LLM gateway](agent-and-llm.md).

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner. The need for a durable engine follows from BE-02, which the owner decided; the choice of Temporal was not decided.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 32, 51, 127, 284 and 303 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 105 and 110 of the original (BE-02).
- BRD rows PLT-09, TEN-06 and GOV-13, in `business/requirements/`.
