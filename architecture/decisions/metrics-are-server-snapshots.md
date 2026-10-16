---
title: The app never computes a metric or a drill filter
summary: Every number on a screen is a server snapshot with its as-of time, definition version, freshness and drill filter, and links copy the server's filter.
component: all
type: decision
status: current
ids: [BR-24, BR-32, BR-39, MCP-10, OVW-04, WBS-05]
---

# The app never computes a metric or a drill filter

## Context

In the proof of concept that section 12.2 of the BRD analyses, the overview showed 22% (4 of 18) while the weekly report showed 25% (3 of 12), because the overview counted six Category rows. BR-24 says that a Category node is not counted in counts, progress or KPIs. BR-32 says that every KPI follows the metric definition of section 12 of the BRD and can be drilled down to its source records, and BR-39 puts the as-of time and the definition version on every number. The sentence "the interface does not compute metrics" of the 4 Oct 2026 spec was an inference from BR-32, BR-39 and MCP-10 (the platform computes the number).

So the question was where a number and the filter behind it come from: a screen counting and filtering rows itself, or the server.

## Decision

- The screen counts and adds no row. Every number is a snapshot returned by the server (MCP-10).
- A metric snapshot carries the metric code; the value, or the state "not baselined"; the data timestamp; the definition version; the freshness (`fresh`, `stale`, `partial` or `unknown`); and the drill-down filter (BR-32, BR-39).
- A drill filter goes into the query parameters of the address. The parameter names follow the BRD field names of the WBS (`status`, `type`, `label`, `risk`, `category`, `pic`) and the values come from the filter that the snapshot returns. The screen builds no filter itself. For example the Blocked tile opens the WBS with `status=blocked` (OVW-04).
- The list of upcoming milestones and approval gates carries its own filter (`attention.upcoming.drill`, of the same type as the filter of a tile). Its "View in WBS" button and its "+ N more" line copy that filter into the address. The mock data uses `{ label: [milestone, approvalGate] }`, which holds only BRD WBS fields.
- A filter value contains no comma. A link joins several values with commas (`risk=high%2Ccritical`) and the target page splits them there, so the contract rejects a value that holds a comma. The code review of 9 Oct 2026 found that `src/core/routes.ts` split every value on commas while the contract accepted any non-empty string, so a value with a comma became two values after one pass through an address.
- The rule that Category nodes are not counted (BR-24) belongs to the back end, not to the screen.

## Consequences

- A test such as "25 percent, not 22" checks that the screen shows the snapshot. It does not check the arithmetic, which is the back end's.
- If the back end returns a different filter, the screens do not change.
- Open question for the back end: should "upcoming" also filter by date and status? BRD WBS-05 has no filter by date, so the mock filters by label only.
- A response whose shape the contract rejects is a named error state and never a number the screen made up (see [Every response is validated, and every failure is a named state](validated-contracts-and-error-states.md)).

## Status

Current. The owner approved the principle with the first part of the front-end design on 5 Oct 2026 (FE-06) and the filter of the upcoming list on 9 Oct 2026 (FE-24). The upcoming-list filter is a ruling of the trace-and-gaps plan (R-T1).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 64, 81 to 87 and 120 to 126 of the original (FE-24, the measured facts of the BRD, the snapshot design approved as FE-06).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 151 to 155, 180 and 277 to 280 of the original (the failure states, the snapshot fields, the drill filters in the address).
- [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md): lines 9 to 13 of the original (R-T1).
- [Code review report](../../history/code-review/report.md): lines 374 to 379 of the original (the comma finding).
