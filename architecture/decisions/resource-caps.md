---
title: Checks must not overload the machine
summary: No run of the checks of either repository takes more than half the processors of the machine, containers included; the test tools are capped at half the cores or less, every container of the back end's checks keeps to the first half of the processors, the runs take the lowest priority, and one heavy job runs at a time.
component: all
type: decision
status: current
ids: []
---

# Checks must not overload the machine

## Context

Twice on 9 Oct 2026 the 10-core Mac was overloaded by the checks of the app: Stryker opened 9 test runner processes and Jest opened 9 child workers, each near 100% CPU, and a full Jest run sometimes overlapped a mutation run (load 21). The owner's words, translated: a lot of Node.js processes spun up and overloaded the system; it had already happened twice and taken the machine down, so fix it so that the checks still run but never overload the machine again (FE-26). The limits had to live in the repository and not depend on someone remembering to set an environment variable.

On 16 Oct 2026 the counter-tests of the back end ran 148 to 205 minutes a round and the Mac lagged. The owner, translated: put the full sets on CI, apply it at once to speed up the current plan, and fix the overload of Docker so the next run does not lag the machine. Before the change no container of the back end's checks had a processor limit but the core's own one: on the tree `bbfcdc216889`, a full `./verify` sampled every two seconds took Docker's virtual machine to 5.90 of the Mac's 10 processors in the image check and to 5.30 in coverage, whose integration tests start Keycloak.

On 17 Oct 2026 the owner kept the full sets off GitHub's free minutes, for a sandbox CI the owner is to set up (see [GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record](where-checks-run.md)). Until it exists the full runs, the whole mutation runs and every counter-test, run by hand on the Mac at night, so these caps hold for them too.

## Decision

The rule for both repositories: no run of the checks takes more than half the processors of the machine, containers included. Half is worked out on the machine that runs the checks, never typed for one.

The app, as FE-26 built it and the decision of 16 Oct 2026 tightened it:

- **Stryker**, the mutation testing tool (see [Coverage 100, mutation 100, no unused code](machine-proven-code.md)), runs with `concurrency: "50%"` in `stryker.config.json`. Stryker runs Jest inside its own process (`runInBand: true`), so this number is the whole count of test processes of the mutation step [Source: narrow-widths plan, R-N41].
- **Jest** runs with `maxWorkers: '50%'` in `jest.config.js`.
- **`pnpm verify` and `pnpm canary`** lower their own priority with `setPriority(constants.priority.PRIORITY_LOW)` before they run the gates, and every child process inherits it (nice 19).
- **Playwright** runs with `workers: '30%'`; with five browsers the web gate had pushed the load to 21. **Metro** runs its workers as threads of one process, which passed half the processors at 4 workers (593% in `gate:web`, 532% in the Release build of `gate:native`), so `scripts/workers.mjs` gives it a fifth of the processors, 2 on the owner's Mac, in both web exports and in that build.
- **`node --test`** of `gate:tooling` runs half the test files at once (`--test-concurrency`), where Node's default, every processor but one, ran 9.
- **Native builds.** A clean rebuild (`expo prebuild --clean`) compiles C++ with ninja at the number of cores plus two processes, outside the `--max-workers` limit of Gradle (load 25 measured), so rebuild only when the native configuration changes. The iOS Simulator and the Android emulator run at normal priority, because the Android emulator under `nice -n 19` shows its first screen about seven times slower.

The back end, `metis-backend`:

- **Gradle, the tests and PIT.** `./verify` and `./canary` give Gradle half the cores as workers, and the convention plugin caps the test forks and the threads of PIT at half the cores. Both commands run at the lowest priority (`nice -n 19`, and Gradle's `--priority=low`, which starts a daemon of its own).
- **Every container.** The root build works out `METIS_CPUSET` from the machine and from Docker: the first half of the machine's processors, or all of Docker's when Docker's machine has fewer, `0-4` on the owner's Mac. Every container a check starts keeps to that set: the services of both compose files of the stack (each carries `cpuset: ${METIS_CPUSET:-}`, and the check `image` refuses a service without it), Schemathesis, oasdiff, the scanners Trivy, gitleaks, actionlint, Redocly and hadolint (`--cpuset-cpus`), and the PostgreSQL and Keycloak of the integration tests (`Stack.confine`). One set for all of them, so their sum stays within half however many run at once; the core keeps its own limit of one processor inside it. A run of the stack by hand leaves the variable unset unless the person sets it.
- **Left out, with their reason.** In the app, the iOS Simulator: launchd starts its processes outside the run, so no tool of the app reaches them; they took 623% at a cold boot and 670% at their peak during the flows (9 of 102 samples over half), and the gate shuts the simulator down after each run. In the back end, the steps of `docker build`: BuildKit offers no processor option for them (`docker build --help` lists `--cgroup-parent` alone), and the Gradle of the build stage runs at half of Docker's processors. Ryuk, the container through which Testcontainers removes the others: it only waits.

Both repositories: **one heavy job at a time.** On the owner's Mac a heavy run holds the shared lock `.work/heavy.lock` of the work folder, in the shell that runs it, the full runs at night included; Jest never runs while Stryker runs. Heavy runs of `pnpm verify` happen in a copy outside a folder watched by a cloud-sync service, because running the tests inside such a folder made the sync process work on thousands of generated files (34% CPU, state "stuck", three leftover temporary copies of Stryker holding 979 files, measured).

Measured after the change on the 10-core Mac: Stryker prints "Creating 5 test runner process(es)" instead of 9; Jest uses at most 5 child processes instead of 9; the gates, `tsc` of `gate:types` included, run at nice 19; the highest load of the web gate is 9.2 instead of 21. In the back end, a full `./verify` at two workers kept every container on the processors `0-4` (a container reads `cpuset 0-4` and `memory.max 536870912` inside itself), and its memory, the checks' JVMs and Docker's virtual machine, peaked at 6,488 MiB, where the same run before peaked at 9,703 MiB, PIT's minions over the tool alone taking 4,574 MiB without a heap limit.

## Consequences

- Mutation testing is slower, about twice as slow as before.
- On a CI machine with 4 cores Stryker gets 2 test processes, and the back end's containers get 2 processors.
- A heap limit costs time where the memory was the work's: mutation testing took 328.6 seconds at 512 MiB a minion, where it had taken 253.7 seconds without a limit for 194 fewer mutants. The integration tests and the image check, their containers kept to the set, took 44.7 and 127.8 seconds, against 60.3 and 167.2 before at the same two workers.
- A cold boot of an iPhone simulator still pushes the load up for a moment (77 measured).
- A cap counts test processes, not the threads inside them: Stryker at its 50% reached 554% in one sample of 144 while it tested mutants.
- The rule bounds what the checks start; what else runs on the machine adds to it. During the counter-test of the mutation check the Mac read 99.8% busy, with the file system's event daemon at 94% of one processor and a video call and a browser open beside it.

## Status

Current. FE-26, decided by the owner on 9 Oct 2026, for the test tools of the app; the owner's decision of 16 Oct 2026 for both repositories and their containers, built in [Fast checks](../../proposals/2026-10-16-fast-checks.md); since the owner's decision of 17 Oct 2026 the full runs keep to them on the Mac until the sandbox CI takes them.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-26 (line 66 of the original).
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N41 (lines 250 to 258 of the original) and R-N48 (lines 300 to 308).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): the constraint FE-26 and its note from the run (lines 26 and 27 of the original).
- [Fast checks](../../proposals/2026-10-16-fast-checks.md): the decisions of 16 and 17 Oct 2026, the measures before and after, and the files of `metis-backend` that hold the limits.
