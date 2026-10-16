---
title: Error answers are Problem Details with a kind and a correlation id
summary: Every error answer of the core is application/problem+json (RFC 9457) with type, title, status, a kind the app can read and the correlation id of the request, and nothing else.
component: core
type: decision
status: current
ids: []
---

# Error answers are Problem Details with a kind and a correlation id

## Context

The app reads only the status of a failing answer today: 401 draws its signed-out state, 403 no access, 404 not found, and any other failing status a server error ([Core interfaces](../../components/core/interfaces.md)). [The API contract](../contract.md) names the kinds of a rejected write, and the reviewers proposed that every error answer carries a correlation id for support ([The server owns every rule; the UI shows its result](server-owned-validation.md)). Spring Boot turns its own Problem Details off until `spring.mvc.problemdetails.enabled` is set. [Source: docs.spring.io/spring-boot/reference/web/servlet.html, read 14 Oct 2026, as section 9.1 of the design records it] The design chose one body for every error. [Source: design, section 4.5, the row "Error bodies", and section 5.6]

## Decision

- Every error answer is `application/problem+json` (RFC 9457) with five fields and no other: `type`, `title`, `status`, `kind` and `correlationId`.
- `kind` names the case for a client: `unauthenticated` (401), `forbidden` (403), `notFound` (404, for a missing record and for a record of another tenant alike, an unknown path and a direct call of `/error` included), `unavailable` (503, the database cannot be reached), `server` (any other 5xx, a defect) and `validation` (every other 4xx: a query value outside its list, a path that holds an encoded slash, and a method, an `Accept` or a `Content-Type` the endpoint does not take). `notFound` is a kind the list of the contract lacks and the app needs.
- `correlationId` is the id the core gives each request, which every log line of that request carries as `requestId`.
- A module throws one of the exceptions of the named interface `platform :: web`, `Forbidden` or `NotFound`, and one class of `platform`, `Problems`, writes every body: through the advice for whatever leaves a controller, Spring MVC's own exceptions included, and directly for the security filters and the error page, where no controller runs.
- No stack trace, SQL text, message of an exception or internal name leaves in a body.

As plan two built it, `type` is `about:blank` and `title` is the reason phrase of the status. The kinds of a rejected write (`stale`, `locked`, `limit` and the others of the contract) enter with the write path.

## Consequences

- A client can tell the cases apart by `kind` without parsing text, and support can find the log lines of a failed request by its `correlationId`; [Troubleshoot the core](../../components/core/troubleshoot.md#tracing-a-symptom) says how.
- 405, 406 and 415 share the kind `validation` until a client needs to tell them apart, as plan two's first review round ruled.
- Tests prove the mapping of every failure to its status and kind, with a correlation id and nothing internal: `ProblemsTest`, `ProblemAdviceTest` and the web-layer tests among the unit tests, and the integration tests over HTTP.
- An answer that leaves the core outside Problem Details is a defect: plan two found that Tomcat answers an encoded slash with an HTML page of its own, and the core now refuses it in Spring Security's firewall and answers 400 as Problem Details.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Error bodies"; [section 5.6](../../history/specs/2026-10-14-backend-skeleton-design.md#56-errors); section 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 37), "Review round one" (lines 16236, 16237 and 16252) and "What the sandbox taught" (line 16312).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/platform/web/internal/Problem.java`, `Problems.java` (lines 27 to 43), `ProblemAdvice.java` and `RequestFilter.java`, and `core/src/main/java/dev/metis/core/platform/web/Forbidden.java` and `NotFound.java`.
- Page read on 14 Oct 2026, as the design cites it: docs.spring.io/spring-boot/reference/web/servlet.html.
