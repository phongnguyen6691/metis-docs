---
title: The core's libraries
summary: The core uses Spring Security as a resource server, JdbcClient with explicit SQL over HikariCP and the PostgreSQL driver, Flyway under a role of its own and springdoc-openapi for the contract; orval or Kubb, MPXJ and Playwright for Java are still proposed.
component: core
type: decision
status: current
ids: []
---

# The core's libraries

## Context

The core is written in Java with Spring Boot (see [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](backend-language-java-spring-boot.md)). The backend proposals list the libraries around the framework, with for each one who stands behind it and what support policy it publishes, in line with [Prefer mature, supported components](component-selection-stability.md). Where they could not find a maintainer or a policy, they say so. [Source: backend proposals, lines 42, 43, 46, 47, 53 and 54 of the original]

For data access the proposals asked for explicit SQL and no heavy ORM, and left Spring Data JDBC or plain JDBC open. The backend skeleton design compared three ways. [Source: design, section 4.2]

| | `JdbcClient` with explicit SQL | Spring Data JDBC | jOOQ |
|---|---|---|---|
| Fits the proposal "explicit SQL and no heavy ORM" | Yes, literally | Partly: aggregates are loaded and saved whole, custom SQL for the rest | Yes |
| What the code looks like | A SQL text block, named parameters, a row mapped to a record | Repositories derived from interfaces, plus `@Query` for anything else | SQL written in a typed Java DSL generated from the schema |
| Extra moving parts | None: it is part of Spring Framework | Mapping conventions, aggregate rules, callbacks | A code generator in the build and generated sources |
| Row-level security | Nothing hidden: every statement is in the source | The generated statements are not in the source | Nothing hidden |

`JdbcClient` is part of Spring Framework and Spring Boot configures it. [Source: docs.spring.io/spring-framework/reference/data-access/jdbc/core.html and docs.spring.io/spring-boot/reference/data/sql.html, read 14 Oct 2026] The columns on Spring Data JDBC and jOOQ are the design's reading of the two tools and were not checked on their pages. [Unverified - confirm before applying]

## Decision

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design):

| Concern | Library | What it does in Metis | Who stands behind it, and the support policy found |
|---|---|---|---|
| Authentication and authorization | Spring Security as an OAuth2 resource server | Checks the token Keycloak issued, for its signature, issuer, audience and expiry; see [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md) [Source: docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html, read 12 Oct 2026] | Broadcom; the general Spring policy applies, and the dates of Spring Security itself were not looked up [Unverified - confirm before applying] |
| Data access | `JdbcClient` of Spring Framework with explicit SQL, HikariCP and the PostgreSQL JDBC driver | SQL in text blocks with named parameters, each row mapped to a record; no Spring Data JDBC and no jOOQ; the tenant is set at the start of each transaction | Broadcom for Spring Framework; community projects for HikariCP and the driver, with no support policy found [Unverified - confirm before applying] |
| Migrations | Flyway, with its module for PostgreSQL | Applies the SQL migrations under a database role of its own, the owner of the tables, in the migration job; see [Migrations run as a one-shot job of the same image, before the API](migrations-one-shot-job.md) | Apache-2.0, and PostgreSQL 18 is on its list of supported versions [Source: documentation.red-gate.com/fd/supported-databases-and-versions-143754067.html, read 14 Oct 2026, as section 9.1 of the design records it]; its maintainer and support policy were not looked up [Unverified - confirm before applying] |
| API contract | springdoc-openapi | Generates OpenAPI 3.1 from the code, which is its default [Source: springdoc.org, read 12 Oct 2026] | A community project, not maintained by the Spring team [Source: springdoc.org, read 12 Oct 2026]; no support policy published |

Spring Boot 4.1.1 manages the versions of the first three: Spring Security 7.1.1, HikariCP 7.0.2, the PostgreSQL JDBC driver 42.7.13 and Flyway 12.4.0, beside Spring Framework 7.0.9. [Source: docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html, read 14 Oct 2026, as section 9.1 of the design records it]

As plans two and three built them in `metis-backend`: the starters `spring-boot-starter-security-oauth2-resource-server`, `spring-boot-starter-jdbc` and `spring-boot-starter-flyway`, with `flyway-database-postgresql` and the driver at run time; the repositories of `workspace/internal/data` (`People`, `Workspaces`, `Trees` and `Projects`) and of `delivery/internal/data` (`WorkBreakdowns`), whose every statement is a text block passed to `JdbcClient`; the migration job, which connects as `metis_migrator`; and springdoc-openapi 3.1.1, on the test classpath alone, where a test writes the contract, see [A test writes the contract, with springdoc-openapi on the test classpath alone](contract-written-by-a-test.md).

Still proposed, not decided by the owner:

| Concern | Library | What it does in Metis | Who stands behind it, and the support policy found |
|---|---|---|---|
| Front-end contract | orval or Kubb, which the app chooses | Generate zod 4 schemas from the OpenAPI document, so that the front end keeps zod [Source: orval.dev/docs/guides/zod and kubb.dev/plugins/plugin-zod, read 12 Oct 2026] | Community projects; no support policy published |
| MS Project import | MPXJ, run in the `worker` | Reads MS Project files; it is written and maintained in Java [Source: mpxj.org, read 12 Oct 2026] | Maintainer and support not looked up [Unverified - confirm before applying] |
| PDF | Playwright for Java, connected to a Playwright server container running Chromium | Builds a PDF from HTML; see [Uploads scanned before use; PDFs rendered in a sandbox](files-and-sandbox.md) | Microsoft; no support policy found. The image is pinned to a version, and the version of the client must match that of the server [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] |

## Consequences

- SQL is written by hand and stays visible beside its mapping, with nothing generated, so every statement that row-level security filters is in the source. [Source: backend proposals, line 43 of the original; design, section 4.2]
- A repository holds no decision: the architecture check lets only a repository and the tenant hook reach JDBC, lets a repository call nothing but `JdbcClient`, and requires the text of every statement to be a constant of its class; the lint check holds its methods to a complexity of 1. Repositories stay out of mutation testing, since PIT runs no test that starts a database, and the repository tests pin every query on a real PostgreSQL.
- Spring Data JDBC can be added for a module whose aggregates are written whole, once the write path exists. [Source: design, section 4.2]
- The lines marked unverified (Spring Security, HikariCP, the PostgreSQL JDBC driver, Flyway and MPXJ here; Valkey in [Push updates and rate limits on Valkey](realtime-and-rate-limits.md)) have to be checked. [Source: backend proposals, line 230 of the original]
- springdoc-openapi is maintained by its community and not by the Spring team. The generated OpenAPI file is stored in the repository and checked in CI, so if springdoc lags behind Spring Boot the generator can be replaced and the contract stays the same. [Source: backend proposals, line 88 of the original]
- The front end stays TypeScript: the contract goes through OpenAPI 3.1, and zod is generated with orval or Kubb. [Source: backend proposals, line 90 of the original]
- MPXJ reads MS Project files inside the `worker`, and the PDF is built in a separate Playwright container. [Source: backend proposals, lines 53 and 54 of the original]
- It rules out a heavy ORM for the core.
- The OpenAPI file is part of the flow described in [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md).

## Status

Current. The owner adopted Spring Security, `JdbcClient` with HikariCP and the PostgreSQL driver, Flyway under a role of its own and springdoc-openapi as the generator of the contract on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design); plans two and three built all four in `metis-backend`, which has no commit yet. orval or Kubb, MPXJ and Playwright for Java are still the proposals of 10 Oct 2026, not decided by the owner. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 29, 42, 43, 46, 47, 53, 54, 88, 90 and 230 of the original.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), [section 4.2](../../history/specs/2026-10-14-backend-skeleton-design.md#42-how-the-core-reads-and-writes-data), sections 5.7, 8.1 and 9.1, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): the tech stack (line 20), Global Constraints (line 39) and "Review round one" (line 16220).
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Tasks 5 and 7.
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/build.gradle.kts` (lines 32 to 41), `core/src/main/java/dev/metis/core/workspace/internal/data/Trees.java`, `config/mutation-exclusions.txt` and `stack/compose.yaml` (lines 74 to 91).
- Pages read on 12 Oct 2026: docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html, springdoc.org, orval.dev/docs/guides/zod, kubb.dev/plugins/plugin-zod, mpxj.org and playwright.dev/java/docs/docker. Pages read on 14 Oct 2026, as the design cites them: docs.spring.io/spring-framework/reference/data-access/jdbc/core.html, docs.spring.io/spring-boot/reference/data/sql.html, docs.spring.io/spring-boot/appendix/dependency-versions/coordinates.html and documentation.red-gate.com/fd/supported-databases-and-versions-143754067.html.
