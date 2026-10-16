---
title: The rules of the overview run in Java over the loaded items
summary: One query loads the work breakdown of a project, and pure Java functions compute every number of the overview from those rows, so that every business rule is under coverage and mutation testing.
component: core
type: decision
status: current
ids: [OVW-01, OVW-02, OVW-03, OVW-04, OVW-05, BR-24, BR-32, BR-39]
---

# The rules of the overview run in Java over the loaded items

## Context

The overview of a project, screen 24 of the app, answers with every figure of the BRD's section 12.1: the tiles, the status breakdown, the progress by category, the workload, the three lists and the computed health, each as a snapshot with its as-of time, definition version, freshness and drill filter (OVW-01 to OVW-05, BR-24, BR-32, BR-39). The BRD caps a project at 2,000 items. The back end restates the app's rule that every line is covered, every mutant killed and nothing unused, see [Coverage 100, mutation 100, no unused code](machine-proven-code.md). [Source: design, sections 4.3 and 6.4]

The backend skeleton design compared three places for the rules. [Source: design, section 4.3]

| | Java over the loaded items | SQL aggregates | Stored documents |
|---|---|---|---|
| How | One query loads the items of the project, at most 2,000 by the BRD; pure functions compute every number | One query per metric with `count`, `filter` and `case` | A table holds the finished answer of each project as JSON |
| Coverage and mutation testing | Every rule is Java, so every rule is under both | SQL text is not mutated and its branches are not measured | Nothing to measure: the numbers are typed in |
| Speed for one project | One indexed read of at most 2,000 narrow rows, then arithmetic in memory | Fast | Fast |
| Honest | Yes | Yes | No: it is a second mock server |

## Decision

Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4: the rules of the overview run in Java over the loaded items.

As plan three built it in `metis-backend`:

- `WorkBreakdowns.of(project)` in `delivery/internal/data` loads the work breakdown of the project in one statement.
- Pure functions of `delivery/internal/domain` compute the answer from those rows, the clock in the workspace's time zone, the freshness threshold of the workspace, the version of the baseline and, for `scope=mine`, the key of the reader: `Figures.of` gathers `Tiles`, `Charts`, `Lists`, `Snapshots`, `Health`, `Mine` and `Codes`. The package uses nothing of Spring.
- Each rule of the BRD and each provisional rule of section 6.4 of the design is one function, and each snapshot carries the definition version of its metric, 1 today.

## Consequences

- Every rule of the overview is under coverage and mutation testing: in the last full run of plan three, the package `delivery` held 292 lines and 96 branches, all covered, and PIT killed every one of its 183 mutants.
- A request makes a fixed number of statements, whatever the size of the project: 7 for a project of 18 rows as for one of 8, measured by the integration tests.
- The rules are tested on synthetic work breakdowns built so that every count differs from every other, on seeded random work breakdowns for their invariants, and on the demo data against the app's own answers.
- The image check times the overview of a project of 2,000 work items on the image as a deployment runs it, against the BRD's target of 1 second at the 95th percentile.
- A screen that spans thousands of projects, such as a portfolio, needs aggregates in SQL or stored snapshots, and that is its own design. [Source: design, section 4.3]
- It rules out computing a figure of the overview in SQL or storing a finished answer.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan three built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections [4.3](../../history/specs/2026-10-14-backend-skeleton-design.md#43-where-the-rules-of-the-overview-run) and [6.4](../../history/specs/2026-10-14-backend-skeleton-design.md#64-the-overview), and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): Tasks 4 and 5, its Decisions and "Trial run".
- Files of `metis-backend` read on 16 Oct 2026: `core/src/main/java/dev/metis/core/delivery/internal/domain/Figures.java`, `core/src/main/java/dev/metis/core/delivery/internal/data/WorkBreakdowns.java` and `core/src/main/java/dev/metis/core/delivery/internal/app/OverviewReader.java`.
- BRD rows OVW-01 to OVW-05, BR-24, BR-32 and BR-39, in `business/requirements/`.
