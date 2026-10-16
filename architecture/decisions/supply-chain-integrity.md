---
title: A software bill of materials, signed builds, approval when a provider or model changes
summary: A draft proposal to add a software bill of materials, signed builds and an approval step when a provider or model changes, beyond the dependency and licence scan the onboarding addendum already requires.
component: all
type: decision
status: draft
ids: [ONB-25]
---

# A software bill of materials, signed builds, approval when a provider or model changes

## Context

The round 3 review (3 Oct 2026) checked the onboarding addendum for supply chain and provider change risks. At that time ONB-25 reran the assurance suites on a change of model, provider or prompt, but the addendum did not state the parser, OCR SDK and container dependencies. The review proposed these controls: a software bill of materials (SBOM), a dependency scan, signed builds, a record of the provider's model version, and approval of a change.

The addendum has since taken part of that. ONB-25 now has each release record the provider, the model version, the prompt version and the versions of the parser and OCR dependencies it was tested on, with a dependency and licence scan of that chain, and a change to any of them reruns the three suites. The design of the addendum repeats it, and a new model or provider is used only after the three suites pass. The software bill of materials, the signed builds and an approval of the change are not in the addendum.

## Decision

This is a proposal of a reviewer, not a decision of the owner. Beyond the record and the dependency and licence scan that the addendum already requires, the controls proposed are:

- A software bill of materials.
- Signed builds.
- An approval when a provider or a model changes.

## Consequences

- If adopted, a provider or a model could no longer be changed without an approval, and builds would be signed and come with a bill of materials, in addition to the evidence ONB-25 already keeps for each release.
- The source does not say who approves, where the bill of materials is kept or which signing scheme is used. Those stay open until the owner decides.
- Until the owner decides, this page is a draft.

## Status

Draft: proposed in the round 3 review (3 Oct 2026), not decided by the owner.

## Sources

- [Round 3 review](../../history/reviews/metis-review-vong-3.md): the supply chain and provider change row (line 643 of the original).
- [Disposition of the round 3 review](../../history/reviews/review-disposition-round3.md): the dependency record and scan applied to the addendum (lines 67 and 69 of the original).
- [Onboarding addendum, requirements](../../business/requirements/source/addendum-onboarding/parts/02-requirements.md): ONB-25 (line 35).
- [Onboarding addendum, design](../../business/requirements/source/addendum-onboarding/parts/03-design.md): the dependency record and scan (lines 192 and 220) and the rule on model changes (line 230).
