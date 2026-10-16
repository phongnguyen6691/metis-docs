---
title: Migrations run as a one-shot job of the same image, before the API
summary: The image of the core runs once as the migration job, which migrates as the owner of the tables and exits, and then as the API, which never migrates, never holds the owner's password and refuses a database that is behind.
component: core
type: decision
status: current
ids: [TEN-02]
---

# Migrations run as a one-shot job of the same image, before the API

## Context

A role that owns a table can switch the policies of that table off, so the password of the owner of the tables must stay out of the process that faces the network ([The environment creates the database roles; migrations only grant](database-roles-from-environment.md)). A deployment also needs one clear order of moves. The owner asked that the code base runs well in Docker from the start, so that a deployment holds no surprise (BK-03). [Source: design, section 4.5, the row "How migrations run", and section 5.10]

## Decision

- The one image of the core has two runs, chosen by configuration. With the profile `migrate`, it is the migration job: it applies the migrations as `metis_migrator`, which owns the tables, serves nothing and exits, with 0 or with another code when a migration fails. Without it, it is the API: it connects as `metis_app` and never migrates.
- A deployment is always the same two moves: run `migrate`, then start the API. The local stack, the tests and the image check make exactly these moves.
- At start, the API validates the database against the migrations it carries and refuses one that lacks a migration of the image. A database ahead of the image is accepted, since migrations follow expand, then contract: a migration never breaks the image that is running while the next one rolls out.
- Only the migration job ever holds the password of `metis_migrator`. The environment of the API holds neither the role of the owner nor its password, nor the password of the superuser.

As plan two built it: `application-migrate.yml` makes the migration job a process with no web server; `MigrationCheck`, active under every profile but `migrate`, replaces Spring Boot's migration with Flyway's `validate`; `stack/compose.yaml` runs the service `migrate` with the profile and the owner's role, and starts the service `core` only after `migrate` completed successfully.

## Consequences

- The process that faces the network cannot switch a policy off.
- The image check proves the moves on the image a deployment would run: the API started alone on a database no migration job ran on must stop, with Flyway's message "Detected resolved migration not applied to database" in its log; after the migration job, the API must start and connect as `metis_app`, and `docker inspect` of its container must show neither the name `metis_migrator` nor a password made for the owner or for the superuser. The counter-tests image-unchecked-database and image-owner-password prove that it goes red.
- The tests prove the same in the JVM: the context starts as the API and as the migration job, and the API refuses a database the migration job never migrated (`StartupTest` and `MigrationTest` of the integration tests, `MigrationCheckTest` of the unit tests).
- A merged migration never changes, and a rolling deployment that runs the previous image on the new schema is not tested yet: it needs a first release.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "How migrations run"; [section 5.10](../../history/specs/2026-10-14-backend-skeleton-design.md#510-container-first-the-image-its-two-runs-and-the-local-stack); section 8.4; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): the architecture (line 19), the Review Focus (line 53), "Review round one" (line 16223) and "What the sandbox taught" (lines 16327 and 16340).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/resources/application-migrate.yml`, `core/src/main/java/dev/metis/core/platform/tenancy/internal/MigrationCheck.java`, `stack/compose.yaml` (lines 41 to 91) and `tools/src/main/java/dev/metis/tools/image/ImageCheck.java` (lines 42 to 43, 109 to 133 and 172 to 183).
