---
title: The tool of the checks is written in Java, in `tools/`
summary: Every check of the back end is a Gradle task, and one Java command-line tool in tools/ runs them in order, judges what Gradle and JUnit cannot, records each run and plants the defects of the counter-tests, under the same bar as the core.
component: core
type: decision
status: current
ids: []
---

# The tool of the checks is written in Java, in `tools/`

## Context

The checks of the back end need tools that the build does not bring: the record of a run, the counter-tests, the language check and the judges of what Gradle and JUnit cannot see, such as a skipped test. The app has such tools as Node scripts, under the rules of [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md) and [CI runs `pnpm verify`; macOS work runs on a Mac; every run leaves a record](where-checks-run.md). The design compared three ways to give the back end its own. [Source: design, section 4.4]

| | A Java command-line tool in `tools/` | The app's Node scripts, copied and adapted | Gradle tasks only |
|---|---|---|---|
| Toolchains needed to verify a change of the core | The JDK and Docker | The JDK, Docker and Node | The JDK and Docker |
| Under the same bar as the code | Yes: the same coverage and mutation setup applies to `tools/` | Coverage only, as in the app | Build logic is hard to cover |
| New code | A port, with the app's scripts and their tests as the reference for behaviour | The least | The record of a run and the counter-tests fight the build model |
| Who maintains it later | The backend team, in its own language | The backend team, in a second language | The backend team |

Neither Gradle nor JUnit can fail a build because a test was skipped [Source: the Test task of docs.gradle.org and docs.junit.org/6.1.3, read 14 Oct 2026, as section 9.2 of the design records it], and PIT rounds its score before it compares it with a threshold [Source: pitest.org/quickstart/commandline, read 14 Oct 2026, as the design records it], so a judge has to read the reports.

## Decision

- Every check is a Gradle task of the root build, named `check` and a capital, so a developer runs one check as `./gradlew checkLint`. A check task that the tool's list `Checks.ORDER` lacks, in whatever project it is registered, stops a run.
- One command-line tool, the Gradle project `tools` (package `dev.metis.tools`), runs those tasks one after the other, records the results and plants the defects of the counter-tests. Its commands are `verify`, `canary`, `language`, `marks`, `tests`, `deadcode`, `coverage`, `mutation-scope`, `mutation` and `image`: beside running and recording, it judges the test reports against the exact floors, the mutation report, the walk over unused code, the language of comments and test titles, the escape hatches and their counts, and the running image.
- `./verify` and `./canary` are two short shell launchers: they build the tool through the Gradle task `:tools:launcher`, which also writes the list of the check tasks of every project, and start it with the JDK and the classpath that task wrote, at the lowest priority.
- The tool is under the bar of the core: 100% of its lines and branches, every mutant killed, its own architecture rules and the unused-code walk.
- Node enters `metis-backend` with the MCP gateway, not before.

Plan one built the tool; plan two extended it with the integration check, the walk over what Spring calls, the titles of tests and the image check of the database.

## Consequences

- A change of the core is verified with the JDK and Docker alone.
- The tool is most of the measured code. In the last full run of plan two its tests numbered 182, its coverage counted 1615 lines and 669 branches against 268 lines and 51 branches of the core, and 984 of the 1088 mutants were its own. [Source: `reports/verify.md` of `metis-backend`, tree `7a5919cab5b4`]
- Its checks are proven by its own counter-tests, 104 on the tree plan two left, and the tooling check fails a check that has neither a counter-test nor a reason in `NoCanary.REASONS`.
- It rules out copying the app's Node scripts into the back end, and checks whose logic lives in Gradle tasks alone.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan one built it in `metis-backend` and plan two extended it; the repository has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.4](../../history/specs/2026-10-14-backend-skeleton-design.md#44-what-the-tools-of-the-checks-are-written-in), sections 8.2, 8.3 and 9.2, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): the goal and the architecture (lines 18 and 19) and Tasks 3 to 7.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Tasks 1 and 2.
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `verify`, `canary`, `build.gradle.kts`, `tools/build.gradle.kts`, `tools/src/main/java/dev/metis/tools/Cli.java`, `tools/src/main/java/dev/metis/tools/verify/Checks.java`, and `reports/verify.md`, which `./verify` wrote on 15 Oct 2026.
