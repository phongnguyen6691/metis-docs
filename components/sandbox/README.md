---
title: Sandbox
summary: The planned sandbox images of Metis, ClamAV for scanning every upload and a Playwright server with Chromium for PDFs, both without database access.
component: sandbox
type: overview
status: draft
ids: []
---

# Sandbox

Planned, not built: the sandbox images of Metis, a ClamAV container that scans every uploaded file and a Playwright server container with Chromium that renders PDFs, both with no access to the database. `metis-backend` holds no code yet, so nothing on this page can be run, called or tested today.

## What it does

Everything in this section is the plan; the table under Decided and proposed gives the status of each choice.

- **Scans every upload.** Files go straight to the file store through presigned URLs, and ClamAV scans each one before it can be downloaded [Source: backend proposals, lines 34 and 55 of the original]. The BRD asks for the scan (PLT-07). The superseded system draft made a file usable only once clean and showed its scan state to the API as scanning, clean, infected or error [Source: system draft, line 220 of the original, carried over, confirm].
- **Renders PDFs.** The `worker` of the [core](../core/README.md) builds the HTML and sends it to a Playwright server container that runs Chromium, through Playwright for Java [Source: backend proposals, lines 34 and 54 of the original]. The BRD asks for server-side PDF generation (D-13) and sets 100 pages in under 30 seconds at the 95th percentile [Source: backend brainstorm log, line 29 of the original].
- **Has no access to the database** [Source: backend proposals, line 288 of the original]. As drawn, the sandbox is ClamAV and Chromium, used for the virus scans of uploads and for PDFs [Source: pitch diagram data, lines 135 and 136 of the original].

The two images are pinned to a version. The Playwright documentation says to ensure that the version of Playwright in the tests matches the version running in the Docker container, and recommends pinning the Docker image to a specific version [Source: playwright.dev/java/docs/docker, read 12 Oct 2026]. PDF output exists only in Chromium, according to the proposals [Source: backend proposals, line 54 of the original] [Unverified - confirm before applying].

MPXJ, which reads MS Project files, does not run in the sandbox: it runs inside the `worker`, and the proposals reduce that risk by scanning with ClamAV first and limiting the size of the file and the time spent reading it [Source: backend proposals, lines 34 and 228 of the original]. This is a security trade-off, described in [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md).

## Decided and proposed

| Record | Status |
|---|---|
| [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md) | Decided: the sandbox images live in `metis-backend` |
| [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) | Proposed |
| [The core's libraries](../../architecture/decisions/core-libraries.md) | Current |
| [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) | Proposed: where the containers run |

## What it depends on

| Dependency | What the sandbox uses it for |
|---|---|
| The `worker` of the [core](../core/README.md) | Starts a scan and sends the HTML of a PDF |
| The file store | Holds the uploads to scan; the sources do not say how the scanner reaches a file |
| A container platform | Runs the two images. Playwright recommends running Chromium with `--ipc=host`, and a managed container platform may not allow that flag (see [Troubleshoot the sandbox](troubleshoot.md)) |

## Team and repository

- **Team:** the backend team [Source: repositories design, section 2.1, line 68 of the original].
- **Code repository:** `metis-backend`, which holds no code yet. The sandbox images (ClamAV, and a Playwright server with Chromium) deploy with the rest of the backend [Source: repositories design, sections 2.1 and 2.2, lines 68 and 82 of the original].
- **Reference pages:** `reference/` does not exist yet. It will hold the images, their versions and their limits, generated from the image definitions [Source: repositories design, section 3.2, line 162 of the original].

## Read next

- [Develop the sandbox](develop.md), [Sandbox interfaces](interfaces.md) and [Troubleshoot the sandbox](troubleshoot.md).
- The architecture pages [security](../../architecture/security.md) and [data](../../architecture/data.md).

## Open questions

- How a scan is started and how its result returns to the core: the sources say that ClamAV scans before download and name no protocol.
- Whether the containers can reach the Internet. The superseded draft gave its sandbox roles no database and no Internet [Source: system draft, line 125 of the original, carried over, confirm].
- Whether a managed container platform allows the `--ipc=host` flag [Source: backend proposals, line 227 of the original] [Unverified - confirm before applying]; a document of 100 pages is to be measured before going live.
- The maintainers and the support policy of MPXJ and of ClamAV: the proposals say they were not looked up [Source: backend proposals, lines 53 and 55 of the original].
- Whether to read MS Project files in an isolated parser, as the superseded draft did, instead of inside the `worker`: the proposals chose the `worker` and the trade-off is open (see [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md)).

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 34, 53, 54, 55, 227, 228 and 288 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 29 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 125 and 220 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: lines 135 and 136 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 2.2 and 3.2 (lines 68, 82 and 162 of the original).
- BRD rows PLT-07 and D-13, in `business/requirements/`.
- Page read on 12 Oct 2026: playwright.dev/java/docs/docker.
