---
title: OpenTelemetry sent to Grafana Cloud
summary: Services emit traces, metrics and logs with OpenTelemetry to Grafana Cloud, and logs carry the tenant and request ids and never record content; adopted and built so far is the rule on the logs, while the export and the receiver are still proposed.
component: all
type: decision
status: draft
ids: [TEN-02]
---

# OpenTelemetry sent to Grafana Cloud

## Context

Grafana Cloud is proposed to measure the service targets of section 17.1 of the BRD. The BRD also requires that application logs carry the tenant id on each entry and no record content (the application-log rule of the isolation matrix in TEN-02). [Source: backend proposals, line 291 of the original]

The first code of the core writes logs before any environment exists to receive them; the backend skeleton design leaves the export of traces, metrics and logs to a collector to the first deployed environment. [Source: design, section 2]

## Decision

Proposed in the backend proposals, not decided by the owner:

- Services use OpenTelemetry for traces, metrics and logs. Its trace and log specifications are at stable level. [Source: backend proposals, line 57; system draft, line 284 of the original]
- Grafana Cloud receives them and shows logs, metrics, traces and alerts. [Source: backend proposals, lines 57 and 291 of the original]
- Carried over from the superseded system draft, to be confirmed: a collector in each region sends the data to Grafana Cloud in its Singapore region [Source: system draft, line 284 of the original]; the service objectives come straight from section 17.1 of the BRD (reading and saving in under 1 second, web screens in under 2 seconds, PDF in under 30 seconds and availability of 99.9%), alerts fire when the burn rate of the error budget passes a threshold, and synthetic checks run from Vietnam [Source: system draft, line 285 of the original]; tenant administrators can see integration errors, stale data and failed saves [Source: system draft, line 286 of the original].

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design): logs carry the tenant id and the request id, and never the content of a record. [Source: backend proposals, line 291; system draft, line 284 of the original] As plan two built it in the core:

- The core logs JSON lines on standard output, in Spring Boot's structured format `ecs`, and the image writes no log file.
- A filter that runs first on every request gives it an id, puts it on every log line of the request as `requestId`, and hands it to the error body as `correlationId`. A filter that runs right after the token is checked puts the tenant of the token on every line as `tenantId`, and ends each request with one line, `served <method> <route> with <status>`, which names the pattern of the route and never the path, since a path holds the ids of records.
- The line of a 500 carries the type and the frames of the exception and of each cause, never a message, and the PostgreSQL driver leaves the detail of the server out of its messages, since a message of PostgreSQL can hold a value of a row.

## Consequences

- OpenTelemetry is an open standard, so the receiver can change without changing the code of the services. [Source: system draft, line 30 of the original]
- Grafana Cloud lists SOC 2 Type II, ISO 27001 and CSA STAR, has a Singapore region and requires a signed data processing agreement. [Source: backend proposals, line 291 of the original]
- The organization behind OpenTelemetry was not looked up. [Unverified - confirm before applying] [Source: backend proposals, line 57 of the original]
- `LogTest`, of the integration tests, plants marker values in the database, calls every endpoint and a defect whose message holds a marker, and fails if a marker reaches the log or if a line of a request lacks the two ids. PIT mutates the lines that log too, and the mutation judge fails a line that calls the logger and carries no mutant.
- A symptom is traced from the `correlationId` of an error answer to the log lines of its request; [Troubleshoot the core](../../components/core/troubleshoot.md#tracing-a-symptom) says how.
- Effort: a collector in each region, and the alerts on the error budget.

## Status

Draft. The owner adopted the rule on the logs on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plan two built it in `metis-backend`, which has no commit yet. OpenTelemetry, its export and Grafana Cloud are still the proposal of 10 Oct 2026, not decided by the owner, and the parts taken from the superseded system draft are carried over and have to be confirmed. It stays a draft for the part the owner has not decided; the part adopted passed plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 57 and 291 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 30 and 284 to 286 of the original, carried over, confirm.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections 2, [3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions) and 5.9, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): "Review round one" (lines 16225 to 16227) and "Review round two" (line 16265).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/resources/application.yml` (lines 10 to 14 and 27 to 30), `core/src/main/java/dev/metis/core/platform/web/internal/RequestFilter.java`, `core/src/main/java/dev/metis/core/platform/logging/internal/TenantLogFilter.java`, `ProblemAdvice.java` (line 60) and `core/src/integrationTest/java/dev/metis/core/LogTest.java`.
- BRD row TEN-02, in `business/requirements/`.
