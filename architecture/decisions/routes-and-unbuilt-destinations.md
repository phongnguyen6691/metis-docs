---
title: Final routes, drill filters in the URL, and unbuilt destinations
summary: Controls link to their final routes from the first wave, drill filters travel in the address with BRD field names, and a target that is not built opens a generic page or shows labelled text.
component: app
type: decision
status: current
ids: [OVW-04, PLT-14, PLT-20]
---

# Final routes, drill filters in the URL, and unbuilt destinations

## Context

The first wave builds one screen, so almost every navigation item, every tab and every drill-down (OVW-04) leads to a screen that does not exist yet. The 4 Oct 2026 spec (decision N-04) had given every control without a screen a "Planned V2" label, a rule that would label nearly everything once only one screen is built.

A second point came from the wireframe manifest. Investment, Scenarios, SteerCo and AI copilot have wireframes, but they belong to V2 and V3. The brainstorm first treated them as having no screen at all, and the spec corrected that to follow the sidebar of the wireframe.

## Decision

Rules for the target of a control:

1. The target is an MVP screen, among the 58, that is not built yet: the control is a real link to the final path of that screen. The path opens a generic "not built in the first wave" page inside the real shell. When the target is built, the generic page is replaced and the overview does not change. The page takes its title from the label of the clicked target (the dictionary group `destinations`), and shows the screen number from the route table, the path and the filter it received. It does not copy `wireframes/manifest.json` into the app, so it shows no requirement code and no wireframe file path (R-B7).
2. The target belongs to a later release by the `phase` column of the manifest (screens 20, 21 and 22 are V2, screen 23 is V3), or it has no screen: the control is text with the label `Planned V2` or `Planned V3` from section 6 of the style guide. It is not clickable and does not use the style of a disabled button.
3. The target is unclear: the control is text with the label `Not built yet`, and the question is recorded in the open questions of the spec.

In the table, `<project>` stands for `/w/{workspaceId}/projects/{projectId}`.

| Control | Target screen | Path |
|---|---|---|
| Overview tab, project node in the tree | 24 | `<project>/overview` |
| Charter tab | 25 | `<project>/charter` |
| WBS tab, metric tile, segment of the status bar, Category row, person row, "View in WBS" | 26 | `<project>/wbs`, with the filter |
| Overdue row, risk row | 28 | `<project>/wbs/{itemId}` |
| Plan tab | 30 | `<project>/plan` |
| Governance tab | 12 | `<project>/governance` |
| Focus tab, "+ 5 more, open in Focus" | 34 | `<project>/focus` |
| Raise change request | 32 | `<project>/changes/new` |
| My focus | 34 | `/me/focus` |
| Approvals | 38 | `/me/approvals` |
| Executive cockpit, Workspace dashboard, Registry, Roadmap, Capacity, Risk and dependencies | 14, 15, 16, 17, 18, 19 | `/w/{workspaceId}/cockpit`, `/dashboard`, `/registry`, `/roadmap`, `/capacity`, `/risk` |
| Lifecycle framework, Templates, Settings | 11, 13, 9 | `/w/{workspaceId}/frameworks`, `/templates`, `/settings` |
| The search box in the sidebar and in the top bar | 40 | `/search` |
| New | 37 | `/w/{workspaceId}/projects/new` |
| Notifications | 39 | `/me/notifications` |
| Investment, Scenarios, SteerCo, AI copilot | 20, 21, 22, 23 | none; the label `Planned V2` or `Planned V3` |
| Help | no screen | the label `Planned V2` |
| Share, Export | unclear | the label `Not built yet` |
| Workspace chooser | a menu in the shell | choosing a workspace opens screen 15 of that workspace |
| Scope switch, table-view button | on the screen itself | writes `scope=mine` into the address; changes a display state |
| Initials of the user | none | text, not clickable |

Drill filters travel in the query parameters of the address, for example the Blocked tile opens `<project>/wbs?status=blocked` (OVW-04). The parameter names are the BRD field names of the WBS (`status`, `type`, `label`, `risk`, `category`, `pic`) and the values come from the filter that the metric snapshot returns; the screen builds no filter itself (see [The app never computes a metric or a drill filter](metrics-are-server-snapshots.md)). A group node in the tree (a client, for instance) is not a link.

How it is built:

- The root address redirects to the overview of the Meridian project, and each unbuilt target has its own placeholder route. A catch-all route would let a mistyped link pass type checking. The path types are regenerated before `tsc` runs, and deleting a placeholder route turns `tsc` red at the `Link` that uses it [Source: measured when the overview-screen plan was written].
- The type of a link is a union with one member per target (`Route` in `src/core/routes.ts`): the literal path pattern with every `[name]` segment of the pattern. `src/core` does not import expo-router, yet `Link` still checks each pattern: handing `Link` the union of the patterns makes `tsc` reject it, a union per target is accepted, and a missing `projectId` is rejected [Source: measured when the overview-screen plan was written].
- A gate compares the route files and the patterns of `ROUTES` as two sets, in both directions, and compares the keys of `SCREENS` with the keys of `ROUTES`, so that the gate itself pins the route table. The search for `manifest.json` stops at the repository folder.

## Consequences

- Every control has a real destination from the first wave. When a screen is built, only its placeholder page is replaced.
- The "not built" page shows less than the manifest could give, because it has no requirement code and no wireframe file path.
- A mistyped link fails type checking, and a route file without a pattern, or a pattern without a route file, fails the gate.
- Three destinations stay open as questions for the owner. Share has no requirement that names it, and Export leans toward PLT-14 and the screen `44-data-export-delete`; until they are decided they carry the label `Not built yet`. The help button and the glossary of PLT-20 may or may not get a screen of their own; until then Help carries the label `Planned V2`.
- It rules out labelling every unbuilt control as Planned, and copying the wireframe manifest into the app.

## Status

Current. The owner approved the generic page for unbuilt screens with the second part of the design on 5 Oct 2026 (FE-07), and the route table with the spec (FE-16). How it is built follows rulings of the overview-screen plan taken under FE-21 (R-B7, R-B19, D-B6) and of the code clean-up taken under FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 190 to 209 of the original (the three rules and the change from the 4 Oct 2026 spec).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 236 to 280 of the original (the rules, the route table, the drill filters).
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 166 to 169 (R-B7), 213 to 216 (R-B19) and 249 to 252 (D-B6) of the original.
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 1017 of the original (row 40 of its table of rulings).
