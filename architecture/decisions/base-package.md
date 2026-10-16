---
title: The base package `dev.metis.core`
summary: The code of the core lives under the package dev.metis.core, the tool of the checks under dev.metis.tools, following the identifier of the app, dev.metis.app, with which they share the open question about the organization name.
component: core
type: decision
status: current
ids: []
---

# The base package `dev.metis.core`

## Context

A Java code base needs one base package before its first class, and renaming it later touches every file. The app already uses `dev.metis.app` as its bundle identifier, and the app's develop page keeps open whether that identifier fits the organization ([Develop the app](../../components/app/develop.md#open-questions)). [Source: design, section 4.5, the row "Base package"]

## Decision

- The core's base package is `dev.metis.core`, after the identifier of the app. A module of the core is a direct sub-package of it, such as `dev.metis.core.platform` and `dev.metis.core.workspace`; see [Modules of the core kept apart by Spring Modulith](core-modules-spring-modulith.md).
- The tool of the checks lives under `dev.metis.tools`, and the test code that both projects share, in `test-support/`, under `dev.metis.testsupport`.

## Consequences

- The back end and the app share one root, `dev.metis`, and therefore the app's open question about the organization name. A change of that name renames the packages of every project, which costs more the later it comes.
- Each top package names its project, so a class tells where it belongs, and the mutation scope of a project is its package (`dev.metis.core.*`, `dev.metis.tools.*`).

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Base package"; section 5.2; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (line 32).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: the packages of `core/src/main/java/`, `tools/src/main/java/` and `test-support/java/`, and `build-logic/src/main/kotlin/metis.java-conventions.gradle.kts` (line 157).
