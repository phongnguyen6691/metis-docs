---
title: Pitch material stays out of the documents
summary: The rule of 11 Oct 2026 that kept the pitch diagrams, the financial model and the legal-entity comparison out of metis-docs, replaced when the owner put the pitch diagrams in.
component: all
type: decision
status: superseded
ids: []
---

# Pitch material stays out of the documents

## Context

The material prepared to pitch Metis includes diagrams, a financial model and a comparison of legal entities. When the owner asked for one repository for every document (RD-01), the owner set a limit: the information used for pitching is not uploaded to it (RD-02). The same material also holds technical content the team needs, the stack and why each component was chosen.

## Decision

- Never in `metis-docs`: the pitch diagrams, the financial model and the legal-entity comparison. They stay outside every repository, in the owner's private store.
- Their technical content, the stack and why each component was chosen, is rewritten in the documents as pages under `architecture/` and as decision records, with no financial figures.
- Backend notes that mix financial figures with legal-entity comparisons stay in the owner's private store too, and get the same rewrite.
- RD-02 excludes only pitch material. The BRD review reports are not pitch material, so they are kept, in `history/`.

## Consequences

- A reader of `metis-docs` finds the technical reasons for a choice, but no financial figures and no comparison of legal entities. Those stay with the owner.
- A choice that also rested on financial figures or on a legal-entity comparison shows only its technical reasons in the documents. The other reasons stay in the owner's private store.
- Writers of decision records read the private store for the technical content and leave the rest out; the backend decision records are written this way.
- It rules out any page or record in `metis-docs` that holds the pitch diagrams, the financial model or the legal-entity comparison. A mention of a file kept outside is plain text that names the file and the owner's private store (see [Every document is English](documentation-english-only.md)).

## Status

Superseded by [Pitch diagrams in the documents, the rest of the pitch material out](pitch-diagrams-in-docs.md).

Decided by the owner on 11 Oct 2026 (RD-02). On 13 Oct 2026 the owner put the pitch diagrams into `architecture/diagrams/`, whole (RD-15). The rest of this decision still holds and is restated in the decision that replaced it.

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): the owner decision RD-02 in its table of owner decisions, the correction on its scope recorded under that table, and section 6.1, the rows for the pitch material and for the backend notes that mix financial figures with legal entities. The design spec stays in `proposals/` until the work it describes ships, then moves to `history/`.
- The pitch material itself is kept in the owner's private store and is not cited here.
