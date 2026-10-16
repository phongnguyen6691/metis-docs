---
title: Develop the sandbox
summary: The planned toolchain and checks for the sandbox images, pinned container images for ClamAV and a Playwright server, with no command yet.
component: sandbox
type: how-to
status: draft
ids: []
---

# Develop the sandbox

Planned, not built: the toolchain and the checks of the sandbox images. `metis-backend` has no build yet, so this page names no command. Each check below gets the command that runs it when the build exists.

## Toolchain

| Concern | Planned choice | Status |
|---|---|---|
| Images | Docker images for ClamAV and for a Playwright server that runs Chromium | Where they live is decided: [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md). ClamAV and the Playwright server are proposed: [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| Pinning | Both images pinned to a version; the Playwright for Java client in the core and the Playwright server upgraded together, with matching versions | Proposed: [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| The PDF client | Playwright for Java, in the `worker` of the [core](../core/README.md) | Proposed: [The core's libraries](../../architecture/decisions/core-libraries.md) |
| Build and test tools for the images | Not stated in the sources | Open |

Sources: [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 2.1 (line 68 of the original); backend proposals, line 54 of the original. Playwright documents how to run its server in a container for a remote connection, and says to ensure that the version of Playwright in the tests matches the version running in the Docker container, and to pin the Docker image to a specific version [Source: playwright.dev/java/docs/docker, read 12 Oct 2026].

## Checks

None of these checks exists yet.

| Check | What it would prove | Source |
|---|---|---|
| Measure a document of 100 pages before going live | A PDF of 100 pages takes under 30 seconds at the 95th percentile, and Chromium does not run out of memory in the container | backend proposals, line 227 of the original; backend brainstorm log, line 29 of the original |
| Run Chromium with `--ipc=host`, or find the way the container platform allows | Playwright recommends the flag, because without it Chromium can run out of memory and crash [Source: playwright.dev/java/docs/docker, read 12 Oct 2026]. A managed container platform may not allow it [Unverified - confirm before applying] | backend proposals, line 227 of the original |
| Matching versions | The Playwright for Java client and the Playwright server have the same version | backend proposals, line 54 of the original |
| No database access | Neither container has access to the database | backend proposals, line 288 of the original |
| Documentation generator | One command writes the images, their versions and their limits into `build/docs/` | the repositories design, sections 3.2 and 4.2 (lines 162 and 234 of the original) |

## Rules for code and documents

- Code, comments, test titles and tool output are English; this is the rule in the `AGENTS.md` of `metis-backend`.
- Read the decision records in [architecture/decisions](../../architecture/decisions/) before choosing a library or a pattern. A change of behaviour comes with its documentation change in `metis-docs`.

## Open questions

- The build files of the images and the way they are tested.
- The limits of the images (memory, time, file size) are not set in the sources, except that a file may be up to 250 MB and a PDF of 100 pages must take under 30 seconds [Source: backend brainstorm log, line 29 of the original].

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 54, 227 and 288 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 29 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 3.2 and 4.2 (lines 68, 162 and 234 of the original).
- Page read on 12 Oct 2026: playwright.dev/java/docs/docker.
