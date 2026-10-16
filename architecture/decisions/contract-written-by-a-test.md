---
title: A test writes the contract, with springdoc-openapi on the test classpath alone
summary: The core's contract, contract/openapi.json, is written and checked by a test that starts the web layer with springdoc-openapi, which only the tests hold, so the image carries no documentation endpoint.
component: core
type: decision
status: current
ids: []
---

# A test writes the contract, with springdoc-openapi on the test classpath alone

## Context

The core generates its contract as `contract/openapi.json`, and the build fails when the committed file is stale, see [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md). The backend skeleton design adopted springdoc-openapi as the generator, see [The core's libraries](core-libraries.md). It defaults to OpenAPI 3.1. [Source: springdoc.org, read 12 Oct 2026]

Two facts shaped where it runs. The Gradle plugin of springdoc-openapi dates from June 2024 and was built for Gradle 7. [Source: plugins.gradle.org/plugin/org.springdoc.openapi-gradle-plugin, read 14 Oct 2026, as section 9.1 of the design records it] And a library in the image that serves documentation is one more endpoint and more libraries in what ships. [Source: design, section 4.5, the row "springdoc-openapi"]

## Decision

Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4: springdoc-openapi is on the test classpath only, and the contract is generated in a test.

As plan three built it in `metis-backend`:

- springdoc-openapi 3.1.1 is a test dependency of the core, with the parts of swagger-core it uses declared beside it; the image holds neither.
- `ContractTest`, tagged `contract` and run by the task `:core:contractTest`, starts the web layer with springdoc-openapi and completes the document: the name, the BRD ids and the action class that `@Operation` declares on each controller method become `operationId`, `x-metis-brd` and `x-metis-action`; each declared status becomes a Problem Details response, with one `default` response for what the platform answers to a malformed request or a failure; every component of a record is required, a `@Nullable` one nullable, and every text that is no code and no date at least one character long; the server is a fixed `/` and the bearer scheme sits on the root; a nested type is named with the types around it, such as `Attention.Upcoming.Item`, and a record behind a sealed interface stands alone.
- The test writes the document with its keys in a fixed order and compares it with `contract/openapi.json`; `./gradlew writeContract` writes the file. The check `contract` runs the test, Redocly's linter with no unused schema, the judge of the BRD ids against the pinned `ids.txt` and of the lock of the migrations, and oasdiff against the base branch when one exists.

## Consequences

- The image carries no documentation endpoint and no library of springdoc-openapi.
- springdoc-openapi and the request validator of the integration tests bring Jackson 2 to the tests alone; its BOM holds it at the nearest release without a known vulnerability, 2.22.3 in plan three, so the `deps` check stays green without a widened list.
- swagger-core writes a record of a sealed interface as `allOf` the interface and an object of its fields, which a schema without extra fields then refuses, and names a schema by the simple name of its class; the test shapes both, and the integration tests validate every answer they receive against the file, which shows such a fault at once. See [Troubleshoot the core](../../components/core/troubleshoot.md).
- springdoc-openapi is maintained by its community and not by the Spring team; since the file is stored and checked, the generator can be replaced and the contract stays the same. [Source: backend proposals, line 88 of the original]
- It rules out a documentation endpoint in the image and the Gradle plugin of springdoc-openapi.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03). Plan three built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "springdoc-openapi"; [section 5.8](../../history/specs/2026-10-14-backend-skeleton-design.md#58-contract); section 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Task 7, its Decisions 9, 10 and 13, and "What the work taught".
- Files of `metis-backend` read on 16 Oct 2026: `core/build.gradle.kts` (the tasks `contractTest` and `writeContract`), `core/src/test/java/dev/metis/core/ContractTest.java`, `gradle/libs.versions.toml` and `contract/openapi.json`.
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 88 of the original.
- Pages: springdoc.org, read 12 Oct 2026; plugins.gradle.org/plugin/org.springdoc.openapi-gradle-plugin, read 14 Oct 2026, as the design cites it.
