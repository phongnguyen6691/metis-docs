---
title: Gradle with the Kotlin DSL, one version catalog, locks and verified checksums
summary: The back end builds with Gradle 9.8.1 and Kotlin build scripts, writes every version once, locks every configuration in strict mode and checks the sha256 of every artifact it resolves.
component: core
type: decision
status: current
ids: []
---

# Gradle with the Kotlin DSL, one version catalog, locks and verified checksums

## Context

The repositories design names Gradle as the build of `metis-backend`, but its approval (RD-05) decided the repositories, not the build tool, so the backend skeleton design asked for the tool itself. [Source: design, section 4.5, the row "Build tool"] The app pins its own toolchain in [pnpm 11.28.4, the hoisted layout, Expo's peer pins](toolchain-pins.md). The supply chain of the back end must be reviewable: the build should use exactly the files that were reviewed, which the design's `deps` check proves. [Source: design, sections 8.2 and 8.4]

Gradle 9.8.1 runs on Java 25 and compiles it, which it does since 9.1.0, and Spring Boot 4.1.1 builds with Gradle 8.14 or later and 9.x. [Source: services.gradle.org/versions/current, docs.gradle.org/current/userguide/compatibility.html and docs.spring.io/spring-boot/system-requirements.html, read 14 Oct 2026, as section 9.1 of the design records them]

## Decision

- Gradle 9.8.1, run through its wrapper, with build scripts in the Kotlin DSL.
- One build of two projects, `core` and `tools`, and the included build `build-logic`, whose one convention plugin, `metis.java-conventions`, both projects apply.
- Every version is written once: in the catalog `gradle/libs.versions.toml`, in the plugins of `settings.gradle.kts`, or by Spring Boot 4.1.1's own list. The catalog also holds the images of the scanners, each pinned by its digest.
- Every configuration is locked in strict mode, and `gradle/verification-metadata.xml` holds the sha256 of every artifact, so a dependency whose lock or checksum is not current fails its resolution. One command writes both again after a change of the dependencies, with every task run for real (it is in the `AGENTS.md` of `metis-backend` and in [Develop the core](../../components/core/develop.md#commands)); nobody edits them by hand.
- Dependencies come from Maven Central alone, and a project may not declare a repository of its own.
- The build cache is on, so that the copy of the tree a counter-test makes reuses what the tree compiled. The configuration cache stays off: Gradle refuses to store this build in it.
- Every check of the back end is a task of this build; see [The tool of the checks is written in Java, in `tools/`](checks-tool-in-java.md).

## Consequences

- The `deps` check resolves every configuration of both projects against its lock and its checksums. Its counter-tests deps-lock and deps-checksum prove that a stale lock and a tampered checksum turn it red.
- A change of the dependencies needs the command that writes the locks and the checksums. Written on a warm cache, or with a task restored from the build cache, the checksums miss files, and Gradle keeps the checksums of a library that left the build; [Troubleshoot the core](../../components/core/troubleshoot.md#dependencies-locks-and-checksums) has the symptoms and the fixes.
- A machine needs any JDK from 17 on to start Gradle; Gradle fetches the JDK of the build itself, see [Amazon Corretto 25, fetched by Gradle's toolchain support](jdk-amazon-corretto.md).
- It rules out Maven and a build that resolves whatever versions a repository serves on the day.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Build tool"; sections 8.2, 8.4 and 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (lines 32 and 34), Task 1, and "What the sandbox taught" (lines 15665 and 15666).
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): "What the sandbox taught" (lines 16329 and 16334).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `settings.gradle.kts`, `gradle.properties`, `gradle/libs.versions.toml`, `gradle/wrapper/gradle-wrapper.properties`, `build-logic/src/main/kotlin/metis.java-conventions.gradle.kts` (lines 25 to 37) and `AGENTS.md`.
- Pages read on 14 Oct 2026, as the design cites them: services.gradle.org/versions/current, docs.gradle.org/current/userguide/compatibility.html and docs.spring.io/spring-boot/system-requirements.html.
