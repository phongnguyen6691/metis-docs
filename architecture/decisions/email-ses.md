---
title: Amazon SES for notification email
summary: Amazon SES sends the email half of the in-app and email notifications, fed by the outbox.
component: core
type: decision
status: draft
ids: [PLT-09]
---

# Amazon SES for notification email

## Context

The BRD asks for in-app and email notifications for mentions, assignments, change request and gate decisions, items due soon or overdue and a missing weekly status. Users choose the channel per trigger for the notifications that are not mandatory, and approval requests cannot be muted (PLT-09). [Source: backend proposals, line 290 of the original]

## Decision

Proposed, not yet decided by the owner:

- Amazon SES, in the Singapore region, sends the notification email. In-app notifications are the other channel. [Source: backend proposals, lines 59 and 290 of the original]
- Email is fed by the outbox, the same outbox that feeds Temporal, see [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md). [Source: backend proposals, line 32 of the original]

## Consequences

- SES is listed within the SOC and ISO scope of AWS and carries an availability commitment of 99.9%. [Source: backend proposals, line 290 of the original]
- The sources say nothing about the sender domain or about bounce handling.

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 32, 59 and 290 of the original.
- BRD row PLT-09, in `business/requirements/`.
