---
title: The demo data stays outside the image, mounted into the migration job by the demo overlay
summary: The demo data is a Flyway callback written from the builders of the tests, which the demo overlay of the local stack mounts into the migration job, so the image that ships holds no demo data and the API validates the same history of migrations.
component: core
type: decision
status: current
ids: []
---

# The demo data stays outside the image, mounted into the migration job by the demo overlay

## Context

The owner opens screen 24 of the app on the real core, so the core needs the app's demo data: the tenant, four people, two workspaces, three portfolios, six programs and ten projects of the app's mock server, with the 18 rows of the first demo project that the wireframes draw and 8 rows that give the second its numbers. The mock data holds for one day only, 22 Sep 2026 in the workspace's time zone. [Source: design, section 6.5] One image runs in every environment and holds nothing of one, see [A multi-stage Dockerfile builds the image from the sources](image-built-from-sources.md), and every value of the demo data has one source, see [English code, one source per value, no retyped literal](code-language-and-single-source.md).

## Decision

Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4: the demo data is files outside the image, mounted into the migration job by the demo overlay of the local stack and added as a second Flyway location by the `demo` profile.

As plan three built it in `metis-backend`, and plan four runs it:

- The builders of `core/src/testShared/java/dev/metis/core/demo/` define every id, name and number of the demo data once. `./gradlew writeDemo` writes from them `stack/demo/afterMigrate__demo.sql`, a Flyway callback that the history of migrations never records, idempotent, written as the owner of the tables for the demo tenant alone; a unit test fails when the file is not what the builders write.
- `stack/compose.demo.yaml` mounts `stack/demo/` read-only at `/demo` in the migration job alone and runs it with the profiles `migrate,demo`, for which a document of `application.yml` adds the location `filesystem:/demo`. The API runs the profile `demo` without the folder, so it validates the same history as any deployment.
- The profile `demo` fixes the business clock at 2026-09-22T03:00:00Z, 10:00 in the workspace's zone, so the demo shows the same figures on any day; the time of a token is still judged by the real clock.
- The demo person is the realm's person `developer`, whose subject and tenant the builders give to the demo's Nadia R.

## Consequences

- The image that ships holds no demo data, and the image check proves it on the image a deployment runs.
- The core's answers for both demo workspaces and both demo projects equal the app's mock answers, but for the four differences of section 6.5 of the design; an integration test compares them field for field, and the image check compares the overviews in a container whose zone puts the demo's instant on another date.
- No test retypes a value of the demo data: the check `lint` refuses a string of a test that equals or holds one.
- A later module that needs demo rows adds them to the builders and runs `./gradlew writeDemo`; a deployment never mounts the folder.
- It rules out demo rows in a migration and a test endpoint that loads them.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03). Plan three built the builders, the seed, the profile and the overlay's mount in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Demo data"; sections 5.10, [6.5](../../history/specs/2026-10-14-backend-skeleton-design.md#65-demo-data-and-where-the-core-differs-from-the-mock-server) and 7.3; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Tasks 6 and 12 and its Decision 8.
- Files of `metis-backend` read on 16 Oct 2026: `stack/compose.demo.yaml`, `stack/demo/afterMigrate__demo.sql`, `core/src/main/resources/application.yml` and `application-demo.yml`, and `core/src/testShared/java/dev/metis/core/demo/`.
