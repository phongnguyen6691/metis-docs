---
title: "`contract.yaml` is each screen's promise, traced to tests"
summary: The screen contract lists requirement codes, controls with four kinds of effect, states and layout; browser tests read it, and the trace gate needs a running test for every code.
component: app
type: decision
status: current
ids: []
---

# `contract.yaml` is each screen's promise, traced to tests

## Context

The wireframe manifest says which screen, which area and which requirement, but it cannot stop two people, or two agents, from choosing different components, a different owner for a state or a different keyboard model for the same screen. The review of the provisional web stack asked for a richer contract per screen (its condition FS-24) and the disposition accepted it.

Each screen therefore needs one file that a reviewer reads to learn what the screen promises and that the test suites read as their source, and each requirement code the contract declares has to be traced to a test (R-T2).

The first trace gate passed in cases where nothing was proven. The code review of 9 Oct 2026 turned the only test that carried BR-24 into `test.skip` and the gate still printed that every code had a test and exited 0, while the control run (the code removed from the name) exited 1. Also `test.todo`, `test.fixme` and an empty `describe` were counted, the test names of all screens were pooled, so a new screen declaring a shared code such as D-19 or BR-32 would have been traced by the tests of screen 24, and the test of the script itself asserted that `test.skip` was valid.

## Decision

`src/screens/<id>/contract.yaml` is the artifact a reviewer reads to learn what a screen promises, and the source the test suites read. It lists the requirement codes, the controls with their effects, the states and the layout per tier. This is the shape, from the spec; the real file of a screen has the full list of controls:

```yaml
id: 24-project-overview
route: /w/{workspaceId}/projects/{projectId}/overview
shell: app
requirements: [OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39]
title: { key: title }
elements:
  - id: tile-blocked
    role: link
    nameKey: tiles.blocked
    effect: { kind: route, to: 26, search: { status: blocked } }
  - id: scope-mine
    role: tab
    nameKey: scope.mine
    effect: { kind: url, search: { scope: mine } }
  - id: status-table-view
    role: button
    nameKey: status.tableView
    effect: { kind: state, attribute: data-view, from: chart, to: table }
states: [default, loading, noAccess, sessionExpired, readOnly, notBaselined, stale, invalidData]
responsive: { desktop: two-column, tablet: two-column, phone: single-column }
```

- A control has one of four kinds of effect, and only four: `route` (go to a screen, by the screen code of the manifest), `url` (write a query parameter), `panel` (open a dialog or a drawer) and `state` (change an attribute on the screen). A control that cannot declare an effect is not yet to be built.
- The behaviour tests on web and Safari read the contract at run time. The Maestro flows are generated from the contract, with a `--check` mode. A counter-test requires that every control found in the content area is listed in `elements`.
- `gate:trace` runs `scripts/check-trace.mjs`. It reads `requirements` of every `src/screens/*/contract.yaml`, reads the name of every test (`test`, `it` and `describe`, `.each` included) in `src/**/*.test.*` and `e2e/web/*.spec.ts` with the TypeScript parser, and turns red when a code has no test that carries it in its name. `pnpm verify` and CI call it, because they run every `gate:*`.
- The gate counts only tests that really run, so a `skip`, `todo`, `fixme` or `fail` call does not count, and the name of a `describe` is only a prefix of the tests inside it. It counts only in the folders of the screen itself (`src/screens/<id>/` and `e2e/web/<id>/`). A code that the contract also lists under `web` needs a browser spec in `e2e/web/<id>/`, because only a browser lays out the web page.
- The contract of screen 24 also carries `D-19` (the overview must be usable on a phone). Its browser specs live in `e2e/web/24-project-overview/`, and its contract lists the codes that the browser must prove.

## Consequences

- A reviewer sees the promise of a screen in one file, and the browser and native tests are driven from it, so a control cannot exist without a declared effect.
- A requirement code without a running test turns the gate red. A skipped test no longer counts, and a shared code declared by a new screen needs a test of that screen.
- A requirement meant for the phone browser has to be proven in a browser spec of the screen, not by a unit test alone.
- The example above only shows the shape. The full list of controls of a screen is written while building it, following the route and control rules in [Final routes, drill filters in the URL, and unbuilt destinations](routes-and-unbuilt-destinations.md).
- The gates and their counter-tests are described in [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md).

## Status

Current. The contract is part of the spec the owner approved on 5 Oct 2026 (FE-16). The trace gate is a ruling of the trace-and-gaps plan that the owner approved on 9 Oct 2026 (FE-24), taken under FE-21 (R-T2). Its present scope per screen is the result of the code clean-up taken under FE-27 and FE-28.

## Sources

- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 377 to 411 of the original (the contract and its four effects), and lines 548 to 551 (the scope of the trace gate as built).
- [Front-end stack review disposition](../../history/reviews/review-disposition-frontend-stack.md): line 41 of the original (FS-24, the contract per screen).
- [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md): lines 14 to 18 of the original (R-T2).
- [Code review report](../../history/code-review/report.md): lines 148 to 160 of the original (the finding on the trace gate).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 1055 of the original (row 78 of its table of rulings).
