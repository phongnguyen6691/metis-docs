---
title: The server owns every rule; the UI shows its result
summary: A draft proposal that readiness and form validation rules live on the server, forms share one schema, and errors show inline with a retry and a correlation id; adopted and built so far is the correlation id on every error answer of the core.
component: core
type: decision
status: draft
ids: [WSP-14, CHR-17]
---

# The server owns every rule; the UI shows its result

## Context

The round 2 review (2 Oct 2026) found two screens that applied rules of their own. The workspace setup wireframe blocked activation by a rule that differed from WSP-14, and the project creation wireframe required a Program although CHR-17 makes it optional. The review rated both as major (3 on a scale of 0 to 4). Both were corrected in the wireframes afterwards (RF2-13 and RF2-14 of the disposition of round 2).

The pre-feasibility review (2 Oct 2026) noted, in its list of missing states, that an enterprise workflow cannot rely on a generic toast for errors.

## Decision

This is a proposal of the reviewers. If it is adopted in full:

- Readiness comes from the server. One readiness endpoint returns the failed rules, and the UI renders exactly those rules instead of rules of its own.
- Forms share one validation schema, generated from the domain contract or taken from a shared form schema, so a form cannot require what the contract leaves optional.
- An error is shown inline at the component that failed, with a retry, and carries a correlation id for support. A generic toast is not the only display.

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design): every error answer carries a correlation id. As plan two built it, every error answer of the core is Problem Details with a `correlationId`, the id the core gives each request and puts on every log line of that request as `requestId`; see [Error answers are Problem Details with a kind and a correlation id](error-bodies-problem-details.md).

## Consequences

- The UI cannot drift from the server on a rule, because the UI holds no rule of its own. The two defects of the review were of this kind: a screen with a rule of its own.
- The back end must expose the readiness result and the schema of each form. Every error answer of the core already carries a correlation id, so support can find the log lines of a failed request by it ([Troubleshoot the core](../../components/core/troubleshoot.md#tracing-a-symptom)).
- It rules out a rule coded only in the UI, and a generic toast as the only error display in an enterprise workflow.
- The app reads only the status of an error today; showing the correlation id to the user is part of the proposal still to decide.

## Status

Draft. Proposed in the round 2 review (2 Oct 2026) and the pre-feasibility review (2 Oct 2026). The owner adopted the correlation id on every error answer on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plan two built it in `metis-backend`, which has no commit yet; the rest is not decided by the owner. It stays a draft for the part the owner has not decided; the part adopted passed plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Round 2 review](../../history/reviews/metis-review-vong-2.md): the two findings on the workspace setup and project creation wireframes (lines 430 and 431 of the original) and the wireframe finding RF2-13 (line 511).
- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the missing state "error and retry" (line 549 of the original).
- [Disposition of the round 2 review](../../history/reviews/review-disposition-round2.md): RF2-13 and RF2-14 applied (lines 28 and 29 of the original).
- [BRD part 02, modules A and B](../../business/requirements/source/parts/02-modules-a-b.md): WSP-14 (line 122) and CHR-17 (line 246).
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions) and section 5.6, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/platform/web/internal/Problem.java`, `Problems.java` and `RequestFilter.java`.
