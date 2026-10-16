---
title: Uploads scanned before use; PDFs rendered in a sandbox
summary: Uploads go straight to the file store through presigned URLs and are scanned by ClamAV before download, MS Project files are read in the worker, and PDFs are rendered by a Playwright server container with no database access.
component: sandbox
type: decision
status: draft
ids: [PLT-07, PLT-16, D-13]
---

# Uploads scanned before use; PDFs rendered in a sandbox

## Context

The BRD keeps files in managed storage with time-limited download links and scans uploads for malware (PLT-07). It asks for server-side PDF generation (D-13) and for a PDF that is a stored snapshot (PLT-16); its target in section 17.1 is 30 seconds at the 95th percentile for documents up to 100 pages. [Source: BRD rows PLT-07, D-13 and PLT-16, and the PDF and report generation row of section 17.1, in business/requirements/] The product also has to read MS Project files. [Source: backend proposals, line 53 of the original]

## Decision

Proposed, not yet decided by the owner:

- Uploads go straight to the file store through presigned URLs. ClamAV (GPL-2.0 licence, from Cisco Talos) scans each file before it can be downloaded. [Source: backend proposals, lines 34 and 55 of the original]
- MPXJ, a Java library, reads MS Project files inside the `worker`, with no sidecar process. [Source: backend proposals, lines 34 and 53 of the original]
- For a PDF the `worker` builds the HTML and sends it to a Playwright server container (Chromium) through Playwright for Java 1.63.0. The image is pinned, the client version must match the server's, and PDF output exists only in Chromium. [Source: backend proposals, lines 34 and 54 of the original]
- The sandbox containers (ClamAV and Chromium) have no access to the database. [Source: backend proposals, line 288 of the original]

## Consequences

- Trade-off: MPXJ opens foreign files inside the `worker`, which has database access. The earlier system draft isolated the parser in its own role with no database and no Internet, allowed to read and write exactly one object through a signed link; that is carried over for comparison, not adopted here. The proposals reduce the risk by scanning with ClamAV first and by limiting file size and read time. [Source: backend proposals, line 228; system draft, line 125 of the original]
- Chromium in a container: Playwright advises running it with `--ipc=host`, otherwise Chromium can run out of memory, and a managed container platform may not allow that flag. [Unverified - confirm before applying] A 100-page document has to be measured before going live. [Source: backend proposals, line 227 of the original]
- Open: MPXJ's maintainers and support policy, and ClamAV's support policy, were not looked up. [Unverified - confirm before applying] [Source: backend proposals, lines 53 and 55 of the original]
- Effort: the Playwright server image and the Playwright for Java client have to be pinned and upgraded together. [Source: backend proposals, line 54 of the original]

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 34, 53, 54, 55, 227, 228 and 288 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals: line 125 of the original, carried over, confirm.
- BRD rows PLT-07, PLT-16 and D-13, in `business/requirements/`.
