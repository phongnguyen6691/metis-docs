---
title: Troubleshoot the sandbox
summary: Where symptoms of the sandbox containers will be recorded, with the risks the proposals and the Playwright documentation name in advance.
component: sandbox
type: how-to
status: draft
ids: []
---

# Troubleshoot the sandbox

Planned, not built: no symptom recorded yet.

This page will hold one row per symptom seen on the sandbox containers: what a person or a monitor sees, the cause that was measured, the fix, and where the measurement is kept. A row is added only after the symptom was seen and its cause measured. A fix that is a procedure (roll back an image, restart a container) links its runbook in [operations/runbooks](../../operations/runbooks/README.md). The sandbox is not built, so the table is empty.

| Symptom | Cause | Fix | Source |
|---|---|---|---|
| None recorded yet | | | |

## Risks named in advance

These are risks the proposals and the Playwright documentation name before any code exists. They are not symptoms, and nobody has measured them on Metis.

| Risk | Planned guard | Source |
|---|---|---|
| Chromium runs out of memory and crashes in a container started without `--ipc=host` [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] | Run the container with the flag, and measure a document of 100 pages before going live | backend proposals, line 227 of the original |
| A managed container platform may not allow `--ipc=host` [Unverified - confirm before applying] | The same measurement, on the platform that is chosen | backend proposals, line 227 of the original |
| The Playwright for Java client and the Playwright server have different versions; Playwright says to ensure that they match [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] | Pin the image to a version and upgrade the client and the server together | backend proposals, line 54 of the original |
| MPXJ opens a foreign MS Project file inside the `worker`, which has database access | ClamAV scans the file first, and the size of the file and the time spent reading it are limited. An isolated parser is the alternative the superseded draft used | backend proposals, line 228 of the original; [Uploads scanned before use; PDFs rendered in a sandbox](../../architecture/decisions/files-and-sandbox.md) |
| An infected file is downloaded | A file is scanned before it can be downloaded; the superseded draft made it usable only once clean | backend proposals, line 34 of the original; system draft, line 220 of the original, carried over, confirm |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 34, 54, 227 and 228 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 220 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.1, for the purpose of this page (line 137 of the original).
- Page read on 12 Oct 2026: playwright.dev/java/docs/docker.
