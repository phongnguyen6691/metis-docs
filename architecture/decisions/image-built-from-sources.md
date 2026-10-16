---
title: A multi-stage Dockerfile builds the image from the sources
summary: One image of the core for every environment, built from the sources by Docker alone in two stages, pinned by digest, holding the layered application and nothing of an environment, and run locked down.
component: core
type: decision
status: current
ids: []
---

# A multi-stage Dockerfile builds the image from the sources

## Context

The owner asked that the code base runs well in Docker from the start, so that deployment is smooth (BK-03), and the container is therefore the unit that is built, checked and shipped. Spring Boot documents building an image with a Dockerfile from its layered jar. [Source: docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html, read 14 Oct 2026, as the design cites it] An image built from the sources needs no JDK on the machine that builds it, so a developer machine, CI and a hosting platform that builds from a Dockerfile produce the same image. [Source: design, section 4.5, the row "How the image is built", and section 5.10]

## Decision

- `core/Dockerfile` builds the one image of the core from the sources, in two stages. The build stage, on `amazoncorretto:25-al2023`, compiles with the Gradle wrapper at half the processors and extracts the layers of the jar. The runtime stage, on `amazoncorretto:25-al2023-headless`, holds the layers of the application and nothing else.
- Both base images are pinned by digest, in the Dockerfile as in the compose file of the stack. The runtime stage installs the security fixes of one pinned release of Amazon Linux, so that every build installs the same packages.
- Nothing of an environment is in the image: no test code, no build tool, no documentation endpoint and no secret. `.dockerignore` keeps the reports, the git folder and what a build writes out of the build.
- The image runs as the user `10001`, and its entry point starts the JVM in exec form, so the JVM is the first process and receives the stop signal itself. The heap follows the memory limit of the container (`-XX:MaxRAMPercentage=75`), and an out-of-memory error ends the process (`-XX:+ExitOnOutOfMemoryError`) so that the platform restarts it. [Unverified - confirm before applying]
- The image is configured by environment variables alone, and the compose file of the local stack is the working list of the variables it reads. Its port is Spring Boot's own `SERVER_PORT`, 8080 when unset.
- The image that passes the checks is the one a deployment runs, unchanged. It runs locked down: a user without privileges, a read-only root with one temporary folder, no capability and no new privilege.

## Consequences

- Any machine with Docker builds the image with one command, `docker build --file core/Dockerfile --tag metis-core:local .`, and no JDK.
- The `image` check proves the rules on the running image: it builds it, lints the Dockerfile with hadolint, scans the image with Trivy, and reads inside the running container that the user is not root, that no capability is effective or bounding, that the root is read-only and that no build tool is there; a stop signal must end the JVM within the grace of 30 seconds. Its counter-tests plant a Dockerfile that runs as root, an entry point through a shell, a write to the root at start and a stack that grants a capability or a writable root, and require the check red.
- Each run of the check records the size of the image, the seconds from start to ready and the memory in use after the calls: in the last full run of plan two, an image content of 190.8 MB, ready in 5.3 s, 166.1 MiB.
- The build stage runs Gradle through the class of the wrapper, since `gradlew` needs `xargs`, which the base image lacks; see [Troubleshoot the core](../../components/core/troubleshoot.md#the-image-and-the-image-check).
- Not built yet: the image for amd64, since the owner's Mac builds arm64 only, and pushing the image to a registry, which belongs to `metis-infra` and the first deployed environment.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend` and plan two extended its check; the repository has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "How the image is built"; [section 5.10](../../history/specs/2026-10-14-backend-skeleton-design.md#510-container-first-the-image-its-two-runs-and-the-local-stack); the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (lines 36 and 37), Tasks 16 and 17, "Trial run in the sandbox" (line 15654) and "What the sandbox taught" (lines 15667, 15668 and 15673).
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): "Trial run in the sandbox" (line 16302).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/Dockerfile`, `.dockerignore`, `stack/compose.yaml` (lines 41 to 71), `tools/src/main/java/dev/metis/tools/image/ImageCheck.java` (lines 18 to 53 and 186 to 220), `tools/src/main/java/dev/metis/tools/canary/ImageCanaries.java` and `reports/verify.md`.
- Page read on 14 Oct 2026, as the design cites it: docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html.
