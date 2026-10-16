---
title: A plan never drops an approved spec requirement
summary: A plan may not cut a requirement of an approved spec on its own, checks are written from the spec, and anything cut or missing leads the review package with a picture.
component: all
type: decision
status: current
ids: []
---

# A plan never drops an approved spec requirement

## Context

On 9 Oct 2026 the owner reported that screen 24 (the project overview) did not display well on a phone, even in Chrome, and that the whole page broke on small screens. The approved front-end spec already required three width levels (its section 4.4), but plan B, which built the shell and screen 24, had cut the two narrower levels, from 768 to 1279 (tablet) and under 768 (phone), by a ruling of its own (R-B1). No check saw the gap: the shape gate measured only at the widths 1280 and 1440, and Playwright had only a desktop configuration.

The owner's questions, translated: why was something so basic missed although the spec mentions it, was the spec not planned in full, and is anything else missing and not built (FE-23).

## Decision

- A plan does not cut a requirement of an approved spec on its own.
- Checks (gates) are written from the spec, not from the plan.
- Anything cut or not yet built is the first item of the review package handed to the owner, with a screenshot.

## Consequences

- The owner sees every gap first, with a picture, before anything else in the package.
- A check measures what the spec requires, so a plan that leaves a requirement out no longer removes the check for it.
- On 9 Oct 2026 the part of section 4.4 that plan B had cut was built at once for the shell and screen 24, pulled forward from plan C, with a gate that measures at phone and tablet widths. Every requirement of the spec was also compared with the code and its tests.
- The code cleanup plan of 10 Oct 2026 carries the rule as one of its global constraints: no requirement of the approved spec is cut, and what cannot be done yet leads the review package with a picture.
- It rules out a plan that narrows the approved spec on its own. A requirement that cannot be built yet stays in the spec and is reported.

## Status

Current, decided by the owner on 9 Oct 2026 (FE-23).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-23 (line 63 of the original).
- [Plan of 9 Oct 2026, three width levels](../../history/plans/2026-10-09-frontend-narrow-widths.md): the reason and the ruling R-B1 (lines 3 to 6 of the original), and the root cause as measured (lines 24 to 29).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): the global constraint on FE-23 (line 29 of the original).
