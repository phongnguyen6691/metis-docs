---
title: Liveness and readiness on the port of the API, and nothing else of Actuator
summary: The core exposes two health probes, liveness and readiness, on the port of the API, without detail and without a token, and no other endpoint of Spring Boot Actuator.
component: core
type: decision
status: current
ids: []
---

# Liveness and readiness on the port of the API, and nothing else of Actuator

## Context

A container platform needs to know when the core is alive and when it can serve, and several platforms route and probe one port alone. Spring Boot Actuator brings liveness and readiness probes, on by default, and many other endpoints. [Source: docs.spring.io/spring-boot/reference/actuator/endpoints.html, read 14 Oct 2026, as section 9.1 of the design records it] An answer without detail is safe to reach. [Source: design, section 4.5, the row "Health endpoints", and section 5.9]

## Decision

- The core exposes two probes, on the port of the API: `/actuator/health/liveness` and `/actuator/health/readiness`. They answer without a token and without detail: `{"status":"UP"}` when up.
- Readiness follows the database: its group holds `readinessState` and `db`, so a platform sends no request the core cannot serve.
- No other endpoint of Actuator is exposed: the discovery page of Actuator names itself, `health` and `health-path` alone, and every other path needs a token.
- Actuator is a dependency of the run alone: no code of the core uses it.

## Consequences

- The local stack and the image check probe the core the way a platform would. The health check of the core in `stack/compose.yaml` asks readiness with curl, and the image check requires both probes to answer `{"status":"UP"}`.
- `ProbesTest` of the integration tests proves that both probes answer without a token on the port of the API without detail, that every other path of Actuator needs a token, and that the discovery page names the health endpoint and nothing else; the counter-test integration-exposed-endpoint exposes one more endpoint and requires the check red.
- While the database is away the core is alive but not ready, and a read is answered 503: `FailureTest.whenTheDatabaseIsGoneTheCoreIsNotReadyButAliveAndAReadIsAnswered503`.
- It rules out a separate management port and the other endpoints of Actuator, such as metrics or the environment, until a round needs one and decides how to guard it.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plans one and two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Health endpoints"; [section 5.9](../../history/specs/2026-10-14-backend-skeleton-design.md#59-configuration-logging-and-health); section 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Task 2 and "Review round one" (line 15589).
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): "What the sandbox taught" (line 16339).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/resources/application.yml` (lines 20 to 26), `core/build.gradle.kts` (line 39), `core/src/integrationTest/java/dev/metis/core/ProbesTest.java` and `FailureTest.java` (line 31), `core/src/main/java/dev/metis/core/platform/security/internal/SecurityConfiguration.java` (lines 23 to 32), `stack/compose.yaml` (lines 67 to 71) and `tools/src/main/java/dev/metis/tools/image/ImageCheck.java` (line 41).
- Page read on 14 Oct 2026, as the design cites it: docs.spring.io/spring-boot/reference/actuator/endpoints.html.
