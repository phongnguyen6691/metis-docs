---
title: The allowed licences of the back end, the app's list plus EPL-1.0 and EPL-2.0
summary: What the core runs with may only be under the app's allowed licences, the permissive ones and MPL-2.0, plus EPL-1.0 and EPL-2.0; a library under several licences passes on one allowed licence, and the check reads SPDX ids.
component: core
type: decision
status: current
ids: []
---

# The allowed licences of the back end, the app's list plus EPL-1.0 and EPL-2.0

## Context

The app allows the permissive licences and MPL-2.0, and refuses GPL, AGPL and LGPL when they stand alone ([Accepted advisories and allowed licences](dependency-policy.md)). The libraries a Spring Boot application runs with include Logback, the logging library Spring Boot uses by default, and the Jakarta API jars, which the design expected under Eclipse licences. [Source: design, section 4.5, the row "Licences"] The design notes that, like MPL-2.0, the Eclipse licences bind changes to their own files only. [Unverified - confirm before applying] It asked that the licence report of the real dependency tree be read before the list was fixed, and that a licence outside it come back to the owner.

## Decision

- The libraries the core runs with may only be under these licences, written as SPDX ids in `config/allowed-licenses.json`: 0BSD, Apache-2.0, BlueOak-1.0.0, BSD-2-Clause, BSD-3-Clause, CC-BY-4.0, CC0-1.0, EPL-1.0, EPL-2.0, ISC, MIT, MPL-2.0, Python-2.0 and Unlicense. That is the app's list of twelve plus EPL-1.0 and EPL-2.0.
- A library under several licences passes when one of them is allowed, which is the app's rule that GPL, AGPL and LGPL are refused only when they stand alone.
- The `deps` check runs the licence report plugin `com.github.jk1.dependency-license-report` 3.1.4 over the run classpath of the core, with its SPDX normaliser, and its task `checkLicense` fails on a library with no allowed licence.
- The scanners and linters that are not Gradle plugins run as images and never ship with the core, so the rule does not cover them, even where their licence is copyleft. [Source: design, section 9.2]

## Consequences

- The licence report of plan one read the real tree: Logback is under EPL-2.0 or LGPL-2.1-only, the Jakarta Annotations under EPL-2.0 or GPL-2.0-only with the Classpath exception, and SLF4J under MIT plus an entry the report cannot name; each passes on its allowed licence. This settles the claim the design marked unverified.
- The report prints one licence per library, while the check passes a library on any allowed one; [Troubleshoot the core](../../components/core/troubleshoot.md#dependencies-locks-and-checksums) says how to read it.
- A library under a licence outside the list turns `deps` red, and its counter-test, deps-licence, proves it. Adding a licence to the list comes back to the owner.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend` and left the list unchanged after reading the report; the repository has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Licences"; sections 8.2 and 9.2; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (line 35) and "What the sandbox taught" (line 15664).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `config/allowed-licenses.json`, `core/build.gradle.kts` (lines 123 to 127), `build.gradle.kts` (line 153) and `gradle/libs.versions.toml` (line 45).
