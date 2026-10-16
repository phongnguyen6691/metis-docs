---
title: The same test discipline as the front end
summary: The back end keeps the front end's discipline, every line covered, every mutant killed, no unused code, exact test floors and a counter-test for every check, with module-boundary checks, tests on a real PostgreSQL and Keycloak and cross-tenant tests; the end-to-end legs through the gateway and the agent are still proposed.
component: core
type: decision
status: current
ids: [TEN-02]
---

# The same test discipline as the front end

## Context

The proposals ask the back end to keep the discipline of the front end, which means coverage and mutation testing. [Source: backend proposals, line 58 of the original] The app already runs 13 automated checks (see section 2.1 of [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md)) under [Coverage 100, mutation 100, no unused code](machine-proven-code.md) and [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md).

Tenant isolation rests on PostgreSQL row-level security. The default role of one managed PostgreSQL provider bypasses it, so the application must connect with a role that cannot, and cross-tenant tests have to run in CI. [Source: backend proposals, line 226 of the original] The BRD asks for a negative test on every data path that fails the release on any leak (TEN-02).

For the backend skeleton the owner asked that the tests go as deep as the app's, coverage included, so that lines no longer used are pointed out and removed, and that every test that can exist be listed (BK-02). The design answered with its section 8, the checks and the catalogue of every kind of test, and its section 9, which verified each tool on Java 25 and JUnit 6. [Source: design, sections 8 and 9]

## Decision

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), all of it, made concrete in section 8 of the design and with the tool list verified in its section 9:

- A line of code passes five conditions, the rule of the app restated for the back end: a test runs through it (100% of lines and branches), the test catches errors (every mutant killed), something uses it, an endpoint is declared in the contract, and the line traces to a requirement that a passing test names.
- Every check is a Gradle task that `./verify` runs and records, and every check has a counter-test that plants one defect and requires the check red; see [The tool of the checks is written in Java, in `tools/`](checks-tool-in-java.md).
- No test is skipped, and the number of tests that pass equals a floor kept in the repository. Tests run in a random order from a printed seed, and a test cannot resolve a host name but the local one.
- The tools are JUnit Jupiter 6, not the JUnit 5 the draft named, since Spring Boot 4 manages JUnit 6 [Source: docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html, read 14 Oct 2026, as section 9.1 of the design records it]; AssertJ and Mockito; Testcontainers for Java, with its PostgreSQL module; PIT for mutation testing; JaCoCo for coverage; Spring Modulith and ArchUnit for the module boundaries and the rules inside a module; Error Prone with NullAway, Checkstyle and Spotless; the Dependency Analysis Gradle Plugin; datasource-proxy to count the statements of a request.
- Tests that depend on row-level security run against a real PostgreSQL, started by Testcontainers.
- Cross-tenant tests run in the checks, and the application connects with a database role that cannot bypass row-level security.
- The test with Keycloak tokens covers the core and PostgreSQL, since the gateway and the agent do not exist yet.

As plans one and two built it in `metis-backend`: fourteen checks, of which the last full run of plan two recorded every row green, with 76 unit tests, 58 integration tests and 182 tests of the tool, 100% of the lines and branches of the core and of the tool, and 1088 mutants killed of 1088; and 104 counter-tests ([Develop the core](../../components/core/develop.md#the-checks-of-verify) has the table). The integration tests take tokens from the stack's own Keycloak, run as a generic container of its image, and read the shell with them (`KeycloakTest`); the image check reads the shell with a token issued inside the running stack. PIT runs on JUnit 6 as it is: a probe on the empty application proved it before any code depended on it, which closes the risk the design opened. Two checks of the design, `contract` and `trace`, are not built yet.

Still proposed: the legs of the end-to-end test through the MCP gateway and the agent, which come with those components. [Source: the repositories design, section 2.2, item 3]

## Consequences

- One pipeline in the back-end repository holds the unit, mutation, cross-tenant and end-to-end tests, because the whole back end deploys together. [Source: the repositories design, section 2.2, item 3]
- A leak between tenants fails the checks (TEN-02).
- Code only a database can run, the repositories and the transaction manager that sets the tenant, stays inside coverage and outside mutation testing, since PIT runs no test that starts a container; the integration tests and their counter-tests prove it instead. [Source: design, section 8.1]
- The cost, measured on the owner's Mac: a full `./verify` takes about four minutes and a full mutation run about 105 seconds, while a full `./canary all` of 96 counter-tests took 45 minutes at the lowest priority. [Source: plan two, "Trial run in the sandbox"]
- The design records the tools it considered and left out, each with its reason: jqwik, k6 and Gatling, ProGuard and Qodana, SpotBugs with FindSecBugs, PMD, OSV-Scanner, REST Assured and palantir-java-format. [Source: design, section 9.2]

## Status

Current. The owner adopted all of it but the legs through the gateway and the agent on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plans one and two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 58 and 226 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 2.1 (the `metis-backend` row) and section 2.2 (item 3).
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), [section 8](../../history/specs/2026-10-14-backend-skeleton-design.md#8-tests-and-checks), [section 9.2](../../history/specs/2026-10-14-backend-skeleton-design.md#92-test-and-quality-tools) and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-02 and BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Task 1 (line 59), the probe that proves PIT on JUnit 6.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 42), "Review round two" (line 16268), "Trial run in the sandbox" (lines 16276 to 16300) and "What the sandbox taught" (line 16306).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `test-floor.json`, `build-logic/src/main/kotlin/metis.java-conventions.gradle.kts`, `core/build.gradle.kts`, `core/src/integrationTest/java/dev/metis/core/KeycloakTest.java` and `reports/verify.md`, which `./verify` wrote on 15 Oct 2026.
- BRD row TEN-02, in `business/requirements/`.
