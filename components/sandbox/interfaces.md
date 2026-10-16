---
title: Sandbox interfaces
summary: What the planned sandbox containers expose to the core, what they call, and the interface points the sources leave open.
component: sandbox
type: reference
status: draft
ids: []
---

# Sandbox interfaces

Planned, not built: the interfaces of the sandbox containers. None exists yet, and the sources describe what each container does but not the protocol.

## What it exposes

| Interface | Consumer | What it is | Source |
|---|---|---|---|
| The virus scan | The `worker` of the [core](../core/README.md) | ClamAV scans each uploaded file before it can be downloaded. The result is one of scanning, clean, infected or error. How a scan is started and how the result returns are open | backend proposals, lines 34 and 55 of the original; system draft, line 220 of the original, carried over, confirm |
| The PDF renderer | The `worker` of the core | A Playwright server container that runs Chromium. The `worker` builds the HTML and a Playwright for Java client sends it to the server. Playwright documents a remote connection in which the client connects to the server over a WebSocket address [Source: playwright.dev/java/docs/docker, read 12 Oct 2026] | backend proposals, lines 34 and 54 of the original |

The version of the client and the version of the server must match, so the two are pinned and upgraded together [Source: playwright.dev/java/docs/docker, read 12 Oct 2026; backend proposals, line 54 of the original].

## What it calls

Nothing is described. The containers have no access to the database [Source: backend proposals, line 288 of the original]. The superseded system draft gave its sandbox roles no Internet either, and let them read and write exactly one object of the file store through a signed link [Source: system draft, line 125 of the original, carried over, confirm]. The current proposals do not say whether that applies to the two containers.

## Limits

| Limit | Value | Source |
|---|---|---|
| A PDF of 100 pages | Under 30 seconds at the 95th percentile | backend brainstorm log, line 29 of the original |
| An uploaded file | Up to 250 MB | backend brainstorm log, line 29 of the original |

## Open questions

- The protocol of the scan: who starts it, how the scanner gets the file, and how the result is reported.
- The address, the port and the authentication of the Playwright server inside the private network of an environment.
- Whether the containers have network access beyond the core.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 34, 54, 55 and 288 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 29 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 125 and 220 of the original, carried over, confirm.
- Page read on 12 Oct 2026: playwright.dev/java/docs/docker.
