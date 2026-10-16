---
title: Every document is English
summary: Every file of metis-docs is English; Vietnamese records are machine translated into history/ with a banner, and the originals stay in the owner's private store.
component: all
type: decision
status: current
ids: []
---

# Every document is English

## Context

Some of the records that move into the documentation repository are written in Vietnamese: specs, plans, logs and review reports. The owner decided that documents use English only (RD-04). That makes every file of `metis-docs` English, the migrated specs and plans included, and the documentation agent writes English. The BRD review reports belong in `history/` too.

## Decision

- Every file in `metis-docs` is English.
- A Vietnamese record is handled in two steps. First, its lasting content (decisions that still govern the app, the reasons behind the built screens, open questions) becomes English current pages and decision records. Then the record itself is translated by machine into `history/`.
- The banner of a translated record adds one line: machine translation of a Vietnamese record, the original kept in the owner's private store. Nobody reviews these translations: they are records, never current truth.
- A Vietnamese passage inside an English file, such as the owner's words quoted in a spec or a plan, is translated the same way, with the same note. The English-only check finds every one.
- A link in a moved file that points to a file left outside `metis-docs` (a pitch file, a screenshot of an outside product, a zip) becomes plain text naming that file and the owner's private store, so the link check passes.

## Consequences

- Every current page and every decision record is English, so each reader and each AI agent of the team reads one language.
- Nobody reviews the translations in `history/`, so the exact Vietnamese wording lives only in the original, kept in the owner's private store.
- Not chosen: leaving the records out and keeping only the decision records. The reasons behind the built app (the code cleanup alone recorded 89 rulings) would leave the team's reach.
- It rules out any Vietnamese page or passage in `metis-docs`, the owner's quoted words included.
- Material that stays out of the repository altogether is covered by [Pitch diagrams in the documents, the rest of the pitch material out](pitch-diagrams-in-docs.md).

## Status

Current, decided by the owner on 11 Oct 2026 (RD-04).

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): the owner decision RD-04 in its table of owner decisions, the correction on the BRD review reports recorded under that table, and section 6.2. The design spec stays in `proposals/` until the work it describes ships, then moves to `history/`.
