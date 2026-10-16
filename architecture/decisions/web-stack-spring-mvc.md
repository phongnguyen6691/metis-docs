---
title: Spring MVC on virtual threads
summary: The core serves its API with Spring MVC on Tomcat, with virtual threads switched on, because it reaches PostgreSQL through JDBC, which blocks.
component: core
type: decision
status: current
ids: []
---

# Spring MVC on virtual threads

## Context

The core reaches PostgreSQL through JDBC with explicit SQL ([The core's libraries](core-libraries.md)), and JDBC blocks the thread that waits for the database. Spring Boot switches virtual threads on with `spring.threads.virtual.enabled`. [Source: docs.spring.io/spring-boot/reference/features/spring-application.html, read 14 Oct 2026, as the design cites it] The design judged plain blocking code on virtual threads the simplest fit for a core that blocks on JDBC. [Source: design, section 4.5, the row "Web stack"]

## Decision

- The web stack of the core is Spring MVC, through the starter `spring-boot-starter-webmvc`, on the Tomcat that Spring Boot embeds.
- Virtual threads are switched on: `spring.threads.virtual.enabled: true` in `core/src/main/resources/application.yml`.
- The dispatcher starts with the core (`spring.mvc.servlet.load-on-startup: 1`), so no request waits for it.
- The JSON library is Jackson 3, the default of Spring Boot 4. [Source: docs.spring.io/spring-boot/reference/features/json.html, read 14 Oct 2026, as section 9.1 of the design records it]
- Tomcat is 11.0.25 and Jackson 3.1.7, raised in `gradle/libs.versions.toml` above the 11.0.24 and 3.1.5 that Spring Boot 4.1.1 manages, to the nearest releases without a known vulnerability.

## Consequences

- The code of a request is plain blocking Java, from the controller to the repository, and its tests need no reactive tooling. `ProbesTest.aRequestIsServedOnAVirtualThread`, of the integration tests, proves that a request runs on a virtual thread.
- Spring WebFlux and reactive database drivers are out.
- Tomcat and Jackson are the two libraries whose version the catalog raises above Spring Boot's list. Trivy found 3 CRITICAL vulnerabilities in Tomcat 11.0.24 and HIGH ones in Jackson 3.1.5 in the first image; the `deps` check now fails a known vulnerability in the lock files, and the `image` check one in the image.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Web stack"; section 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (line 34), Task 2 and "What the sandbox taught" (line 15668).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/build.gradle.kts` (line 32), `core/src/main/resources/application.yml` (lines 7 to 9 and 15 to 19) and `gradle/libs.versions.toml` (lines 4 to 6).
- Pages read on 14 Oct 2026, as the design cites them: docs.spring.io/spring-boot/reference/features/spring-application.html and docs.spring.io/spring-boot/reference/features/json.html.
