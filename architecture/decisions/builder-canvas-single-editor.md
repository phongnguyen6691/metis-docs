---
title: One editor holds a short lease on the builder canvas
summary: A draft proposal that one editor holds a short server-enforced lease on a builder canvas, others see it read-only and can request edit, and there is no real-time co-editing in the pilot.
component: core
type: decision
status: draft
ids: [PLT-06]
---

# One editor holds a short lease on the builder canvas

## Context

PLT-06 requires that several users can work on a project at the same time, that conflicting edits of the same field are detected and never silently overwritten, and that one write contract serves the application, MCP and the API: each write carries the version of the record it was based on and an idempotency key. For the risk of concurrent edits on the WBS and the canvas, the risk table of the BRD lists field-level conflict detection (PLT-06) and "one editor per Builder canvas at a time".

Two reviews looked at the canvas. The pre-feasibility review (2 Oct 2026) advised against a real-time collaborative canvas now: PLT-06 applying to the whole project does not mean the Builder needs multi-cursor editing, operational transformation or CRDTs. The front-end stack review (3 Oct 2026) judged the BRD rule that one person edits one canvas at a time acceptable for the MVP only if the server enforces it as a lease and it is not a flag in the browser: with a browser flag, two tabs or two machines still overwrite each other, which PLT-06 forbids.

## Decision

This is a proposal of the reviewers, not a decision of the owner. If it is adopted:

- In the pilot a canvas has one editor at a time, who holds a short lease. Other users see the canvas read-only, with a "request edit" action. There is no real-time co-editing.
- The server enforces the lease. The minimum contract is: the lock owner, the time it was acquired and the time it expires; a heartbeat or time to live; a read-only observer mode; and a takeover or request-control flow.
- When an editor loses the lease in the middle of a session, they stop writing, keep their unsaved local command log, and can copy or recover it.
- The lease covers one specific canvas or version, not the whole project.
- The version and idempotency rules of PLT-06 still apply: the lease reduces conflicts and does not replace the conflict contract. The WBS table keeps optimistic concurrency.
- The disposition of the front-end stack review adds that this is one line for the foundation contracts of the platform (section 18.4 of the BRD), a job of the back end and not of the front end.

## Consequences

- The lease reduces conflicts on a canvas, and the Builder avoids the work of co-editing.
- Only one person edits a canvas at a time.
- A flag in the browser alone does not meet PLT-06, so the front end cannot deliver this without the lease of the back end.
- The BRD does not contain this lease contract today: its foundation contract pack lists a write contract (item 3) but no canvas lease. Until the owner decides, this page is a draft.
- If adopted, it rules out real-time collaborative editing of the canvas (multi-cursor, operational transformation, CRDT) in the pilot, and a lock kept only in the browser.

## Status

Draft: proposed in the pre-feasibility review (2 Oct 2026) and the front-end stack review (3 Oct 2026), not decided by the owner.

## Sources

- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the section on the canvas and several editors (line 259 of the original).
- [Front-end stack review](../../history/reviews/metis-review-frontend-stack.md): section 6.5, two people editing one canvas (lines 518 to 532 of the original).
- [Disposition of the front-end stack review](../../history/reviews/review-disposition-frontend-stack.md): the added item with a consequence for the back end (line 86 of the original).
- [BRD part 02, modules A and B](../../business/requirements/source/parts/02-modules-a-b.md): PLT-06 (line 46).
- [BRD part 04, roadmap and decisions](../../business/requirements/source/parts/04-roadmap-decisions.md): the foundation contract pack, item 3 (line 79), and the risk table (line 208).
