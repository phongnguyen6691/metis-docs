---
title: Rewrite the front end, reuse nothing of the first app
summary: The first front-end app had too many defects, so it was deleted on 5 Oct 2026 and rebuilt from nothing; only its lessons carry over.
component: app
type: decision
status: current
ids: []
---

# Rewrite the front end, reuse nothing of the first app

## Context

The first front-end round left an `apps/` folder and a `packages/` folder, with their own `tools/`, build, test and lint configuration and an automated check workflow. The 4 Oct 2026 spec and plan had been written for that code. On 5 Oct 2026 the owner judged that there had been too many errors in it to keep (FE-02).

Two questions followed. What should happen to the app folder (FE-01)? And what should happen to the old design system: rebuild a minimal one, keep and fix it, or defer it (FE-02)?

## Decision

- Delete the `apps/` folder and make sure nothing is referenced from the abandoned project; whatever is needed is created anew (FE-01).
- Clear out `packages/` as well and write the code again fresh, because there were too many errors in the first round (FE-02).
- The deletion was carried out on 5 Oct 2026 (decision N-10, section 16.1 of the 4 Oct 2026 spec). It removed `apps/`, `packages/`, `tools/`, the build, test and lint configuration, and the automated check workflow. The repository kept only inputs and documents.
- Only the lessons of the first round carry over. The defect log of that round is read for its lessons and no code is taken from it.
- The 4 Oct 2026 spec and plan stay only as records.

## Consequences

- No code of the first app is inherited, so its defects are not inherited either. Every part of the new front end is created under the new spec.
- Everything has to be built again. The new work starts from the BRD, the wireframes, the brand files and the defect log of the first round.
- It rules out copying code from the first app, keeping its packages, and any reference from new files to the deleted project.
- The scope of the new first wave is the next decision: [Prove one screen end to end before building more](acceptance-screen-first.md).

## Status

Current, decided by the owner on 5 Oct 2026 (FE-01, FE-02).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 10 to 14 and 41 to 42 of the original (the deletion, FE-01 and FE-02).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 11 to 15 and line 725 of the original (the inputs of the new work; the defect log read for lessons only, no code taken).
- The 4 Oct 2026 spec and plan of the first app (`spec/2026-10-04-frontend-foundation-spec.md`, `plan/2026-10-04-*`) and its defect log (`analysis/metis-storefront/evidences/2026-10-04-so-loi.md`) are kept in the owner's private store.
