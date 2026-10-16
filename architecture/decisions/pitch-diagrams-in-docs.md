---
title: Pitch diagrams in the documents, the rest of the pitch material out
summary: The eleven pitch diagrams and the source that builds them are kept whole in metis-docs under architecture/diagrams, prices and the comparison of the two proposals included, while the financial model and the proposal documents stay in the owner's private store.
component: all
type: decision
status: current
ids: []
---

# Pitch diagrams in the documents, the rest of the pitch material out

## Context

On 11 Oct 2026 the owner kept all pitch material out of `metis-docs`: the pitch diagrams, the financial model and the legal-entity comparison (RD-02). The technical content of that material, the stack and why each component was chosen, was rewritten as pages under `architecture/` and as decision records, with no financial figures.

On 13 Oct 2026 the owner copied the folder of the pitch diagrams into `metis-docs` as `architecture/diagrams/`. When the review of the folder pointed out that some of the drawings carry prices and compare the two legal entities, which RD-02 kept out, the owner answered that nothing is set apart and that putting the folder in was meant: "no need to separate them, putting them in is my decision" (machine translation) (RD-15).

## Decision

- `architecture/diagrams/` holds the eleven pitch diagrams and the source that builds them, whole. Nothing is taken out of them: the monthly prices of the hosting proposals, the comparison of Singapore and Vietnam and the legal and security requirements stay in the drawings.
- The rest of the pitch material stays outside every repository, in the owner's private store, as before: the financial model and the backend proposals as documents, and the backend notes that mix financial figures with legal entities. A page cites them as plain text that names the file and the owner's private store (see [Every document is English](documentation-english-only.md)).
- The pages under `architecture/` and the decision records keep the technical content without financial figures. The drawings are the one place of `metis-docs` that holds prices.
- The BRD review reports are not pitch material and stay in `history/`.

## Consequences

- Everyone who can read `metis-docs` can read the prices of the two hosting proposals and the comparison of the two legal entities, in the drawings.
- A drawing is a picture of the day it was drawn. Its prices are those the providers listed on 10 Oct 2026, and nothing updates them.
- A drawing shows a proposal. What it draws is decided only when its decision record says so; the hosting is still a draft, [Production on one provider, DigitalOcean as drawn, not confirmed](production-hosting.md).
- The folder keeps the rules of the repository: English only, no em dash and no en dash, drawings changed through their source and never by hand. [Architecture diagrams](../diagrams/README.md) lists the drawings and says how to rebuild them.

## Status

Current, decided by the owner on 13 Oct 2026 (RD-15). It replaces [Pitch material stays out of the documents](pitch-material-out-of-docs.md).

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): the owner decisions RD-02 and RD-15 in its table of owner decisions, and section 6.1, the rows for the pitch diagrams and for the rest of the pitch material. The design spec stays in `proposals/` until the work it describes ships, then moves to `history/`.
- The original of the folder, `spec/diagrams/2026-10-10-pitch/`, is kept in the owner's private store.
