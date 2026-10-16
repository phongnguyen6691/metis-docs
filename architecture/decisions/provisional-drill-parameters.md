---
title: "`delayed=true` and `scope=mine` are provisional names"
summary: The Delayed tile drills down with delayed=true and the My items switch writes scope=mine, both provisional names that the back end will fix.
component: app
type: decision
status: draft
ids: [WBS-05]
---

# `delayed=true` and `scope=mine` are provisional names

## Context

Two controls of the overview screen need a filter that the BRD does not yet define:

- The Delayed tile opens the work breakdown structure filtered on late items. The BRD filters of the WBS (WBS-05) are category, phase, type, status and person in charge. There is no filter for items that are late against the baseline.
- The My items switch narrows the screen to "my" items. The screen must not filter rows itself (spec section 3.3; see [The app never computes a metric or a drill filter](metrics-are-server-snapshots.md)), so the filter has to travel to the server, and the BRD does not say whether "my" means the items the user is in charge of, the items assigned to the user, or both.

## Decision

This is a proposal of the front end, and the back end decides the final names.

- The drill-down of the Delayed tile uses `delayed=true`. The demo data of the mock server uses this name.
- The My items switch writes `scope=mine` into the address of the page, and the client sends it as a query parameter of the overview call. When the whole project is selected, no `scope` is sent.
- Until the back end defines the filter, the mock server (see [Screens call the real API; a mock server answers in mock builds only](mock-server-behind-real-api.md)) answers `scope=mine` with the same data as for the whole project. The screen never filters rows itself.

## Consequences

- The review of the screen shows the same numbers under My items as for the whole project.
- Two questions wait for the back end, both due before it builds the API of the overview screen: which filter stands for items late against the baseline, and whether My items filters by the person in charge, by the assignee, or by both.
- The same gap in WBS-05 touches the upcoming list: whether it also filters by date and status is a question for the back end.

## Status

Draft: proposed in plan A (`delayed=true`) and in plan B (R-B4, `scope=mine`), not decided by the owner. The back end chooses the names; both questions are open in section 13 of the spec.

## Sources

- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the decision on the Delayed drill-down (lines 152 and 153 of the original).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): R-B4 (lines 156 to 158 of the original) and the as-built note on `scope` (lines 19470 and 19471).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the open questions (lines 701 and 710 of the original) and the as-built note on the upcoming list (lines 767 to 770).
