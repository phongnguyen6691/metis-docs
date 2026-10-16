---
title: Amazon Corretto 25, fetched by Gradle's toolchain support
summary: The core is compiled, tested and run on Amazon Corretto 25, which Gradle downloads by itself and the image takes as its base, so no developer machine or CI runner installs a JDK for the build.
component: core
type: decision
status: current
ids: []
---

# Amazon Corretto 25, fetched by Gradle's toolchain support

## Context

The core is written in Java 25 ([The core in Java 25 LTS with Spring Boot 4; no C# or .NET](backend-language-java-spring-boot.md)), and the proposals name Amazon Corretto as its JDK. Corretto 25 lists its end of life as October 2032. [Source: aws.amazon.com/corretto/faqs, read 14 Oct 2026, as section 9.1 of the design records it] The design asks that nothing be installed system-wide, on a developer machine or in CI. [Source: design, section 4.5, the row "JDK distribution"]

## Decision

- Every project of the build compiles and tests on Java 25 of the vendor Amazon, as the toolchain of the convention plugin `metis.java-conventions` says.
- The toolchain resolver `org.gradle.toolchains.foojay-resolver-convention` 1.0.0 downloads Corretto 25 on the first run. Any JDK from 17 on starts Gradle.
- The Gradle daemon runs on Corretto 25 too: `gradle/gradle-daemon-jvm.properties`, which `./gradlew updateDaemonJvm` writes, pins it. A daemon on an older JDK made Spotless refuse the release of google-java-format the build uses.
- The image builds on `amazoncorretto:25-al2023` and runs on `amazoncorretto:25-al2023-headless`, both pinned by digest in `core/Dockerfile`.
- In CI, `actions/setup-java` installs the Corretto 25 that Gradle runs on, which is the one the build asks for, so the build downloads no other.

The trial runs of both plans ran Corretto 25.0.4.10.1.

## Consequences

- The developer machine, CI and the image run one vendor and one major release of the JDK.
- A first run downloads Corretto. Gradle keeps its downloads in its home folder, `GRADLE_USER_HOME`, which on the owner's Mac points inside the work folder of the project. [Source: design, section 9.3]
- On the owner's Mac, which has no `java` on its path, `JAVA_HOME` points at Homebrew's JDK 21 to start Gradle; see [Develop the core](../../components/core/develop.md#what-a-machine-needs).
- It rules out a JDK installed by hand on a machine as the JDK of the build.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "JDK distribution"; sections 9.1 and 9.3; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (lines 26 and 33), "Trial run in the sandbox" (line 15626) and "What the sandbox taught" (line 15660).
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): "Trial run in the sandbox" (line 16272).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `settings.gradle.kts`, `build-logic/src/main/kotlin/metis.java-conventions.gradle.kts` (lines 18 to 23), `gradle/gradle-daemon-jvm.properties`, `core/Dockerfile` and `.github/workflows/check.yml`.
- Page read on 14 Oct 2026, as the design cites it: aws.amazon.com/corretto/faqs.
