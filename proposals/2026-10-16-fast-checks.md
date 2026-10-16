---
title: Fast checks
summary: The owner's decisions of 16 and 17 Oct 2026 for metis-backend and metis-app, as built; while working a change runs what it touches, GitHub runs the fast group on a push to main and every check on a pull request, the full mutation runs and every counter-test are for a sandbox CI still to be set up and run by hand at night until it exists, and no run of the checks takes more than half the processors or about a third of the memory of the machine; what changed, the times and peaks measured before and after, and the decisions.
component: all
type: proposal
status: draft
ids: []
---

# Fast checks

## The decisions

On 16 Oct 2026 the counter-tests of the back end ran 148 to 205 minutes a round and the owner's Mac lagged. The owner's words, translated: then put their full sets on CI, and apply it at once to speed up the current plan; fix the overload of Docker too, so the next run does not lag. Every bar stays: 100% of lines and branches, every mutant killed, a counter-test for every check. What changes is when and where the heaviest checks run, and how much of the machine a run may take. The same day the Mac reached 23 of 24.5 GB of swap, and the coordinator added memory to the rule: a heap limit on every test JVM and every minion of PIT, a memory limit on every container, Gradle's and Kotlin's daemons gone soon after a run, and a full `./verify` within about a third of the machine's memory.

On 17 Oct 2026, before the first push, the owner's words, translated: GitHub's CI need not run the full set, which takes too long; the owner will set up a sandbox to run the full CI later; on GitHub, run what is useful while staying economical for a free account. So the weekly job that parts one and two built in both code repositories is gone, and so is the back end's `./canary changed --base` on a pull request: GitHub runs the fast group on a push to `main` and every check on a pull request, and the full sets wait for the sandbox. Part three below built it.

| When | metis-app | metis-backend |
|---|---|---|
| While working | One gate, one test file | One check, one test task, one counter-test |
| Before handing back | `pnpm verify`, mutation in Stryker's incremental mode | `./verify --fast`, then `./canary changed` |
| Every push to `main`, or by hand (GitHub, 30 minutes) | The fast group | The fast group |
| Every pull request (GitHub, 60 minutes) | Every gate, mutation on the changed files | Every check, mutation on the changed classes, the contract against the base |
| The full runs (the sandbox CI; by hand at night until it exists) | The full mutation run, then every counter-test | `./verify` with the whole mutation run, then `./canary all` |

The sandbox CI does not exist yet: until it does, the full runs are started by hand, at night, alone under the shared lock. On GitHub a newer run on the same ref cancels the one still going, and no job runs on a schedule. The rules are in [GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record](../architecture/decisions/where-checks-run.md), [A screen is done when its gates pass, each proven able to fail](../architecture/decisions/gates-with-canaries.md) and [Checks must not overload the machine](../architecture/decisions/resource-caps.md).

## Part one: metis-backend and the shared documents

Built on the tree `bbfcdc216889` that plan four closed with, test first; the tree after is `81140cf75ced`, on which `./verify` is green, every row on that one tree.

### What changed

| Item of the brief | What was built | Main files |
|---|---|---|
| 1. `./canary changed` | `Implementations` maps each file of the tree to its owners: rules by glob, the first that matches deciding, and every counter-test owning the files it plants into. An owner is a check, every check (the build, the version catalog, the locks, `gradlew`, `test-support/`, and any file no rule names), the engine of the counter-tests (the root package of the tool, `verify/`, the classes of `canary/` that run counter-tests, the launchers, `.gitignore`), or none (the product, its tests but those a check is made of, the pages). The stamp of what a check is made of hashes the files it owns and those of every check. `reports/canary.json` keeps, per check and for the engine, that stamp when every counter-test of it last caught, and when; it is written only when every copy of the run had the stamp the run started from. `./canary changed` selects each check whose stamp differs from its record or has none, and, when the engine's differs, the first counter-test of every other check, the smoke set; `--base <ref>` selects from the paths git names since the base, as the pull request's job of 16 Oct did, and `--list` prints the selection and runs nothing. `./canary <check>` runs every counter-test of one check, and `./canary smoke` the smoke set | `canary/Implementations.java`, `Selection.java`, `Proven.java`, `Choice.java`, `CanaryRun.java` |
| 2. Half the work per counter-test | A counter-test runs its check once, planted, when the newest row of the check in `reports/verify.json` is green, on a tree whose stamp equals the copy's, and is not partial; otherwise it first requires the check green on the copy, as before. The facts of a judge that ran on part of its check open with `partial`, which the mutation judge already wrote for `MUTATION_BASE`, so the mutation row of a pull request stands for no counter-test. Each counter-test prints its seconds | `CanaryRun.java`, `Git.stamp`, `Ledger.latest`, `Facts.PARTIAL` |
| 3. Cheaper copies | Nothing to build: Java 25 clones a file on APFS when it copies its attributes (`sun/nio/fs/BsdFileSystem.java` of its sources, lines 88 to 153, `clonefile` with a plain copy as fallback), and the copy already passed `COPY_ATTRIBUTES`; 256 MiB measured in 0.5 ms with the attributes, 657 to 2,842 ms without. The copies already shared Gradle's build cache (`org.gradle.caching=true`): in the planted runs of plan four's last round, `:core:compileJava` came from the cache 18 times. A comment now says why the attributes stay | `CanaryRun.java` |
| 4. No overload from Docker, and memory | The root build works out `METIS_CPUSET` from the machine and from Docker: the first half of the machine's processors, or all of Docker's when its machine has fewer. Every container of a check keeps to it: both compose files (`cpuset: ${METIS_CPUSET:-}`), Schemathesis, oasdiff, Trivy, gitleaks, actionlint, Redocly, hadolint and the containers of the integration tests. Every container has a memory limit: the core 2 GB as before, PostgreSQL 512 MiB, Keycloak 1 GiB, the migration job 1 GiB, the relay 64 MiB, Schemathesis and oasdiff 512 MiB, the scanners 1 GiB. The check `image` requires both of every service of the stack, before either run. Every test JVM and every minion of PIT has a heap of 512 MiB, the integration tests 1 GiB, every command of the tool 512 MiB and the tool of `./verify` 256 MiB. Gradle's daemon ends 15 minutes after its last build and Kotlin's 15 minutes after its last compilation. `METIS_WORKERS` asks `./verify` and `./canary` for fewer workers than half the cores, and the test forks and the threads of PIT follow the workers a build is given | `build.gradle.kts`, `gradle.properties`, `build-logic/`, `core/build.gradle.kts`, `tools/build.gradle.kts`, `stack/compose.yaml`, `stack/compose.demo.yaml`, `Stack.java`, `Pins.java`, `Fuzz.java`, `Contract.java`, `Processes.java` |
| 5. CI | As built on 16 Oct: push, `./verify --fast`; pull request, `./verify` with `MUTATION_BASE` and `CONTRACT_BASE` on that step alone, since the copy of a counter-test has no history, then `./canary changed --base`, within 360 minutes, since a change of the build selects every counter-test; weekly or by hand, `./verify`, then `./canary all`, within 360 minutes, the most a job may run on GitHub's hosted runners [Source: docs.github.com/en/actions/reference/limits, read 16 Oct 2026: "Each job in a workflow can run for up to 6 hours of execution time"]. Since the owner's decision of 17 Oct, part three: a push to `main` or a run by hand, `./verify --fast` within 30 minutes; a pull request, `./verify` with its bases within 60 minutes and no counter-test; no weekly job | `.github/workflows/check.yml` |
| 6. Documents | `AGENTS.md` and `README.md` of `metis-backend`; [Develop the core](../components/core/develop.md); the three decision records, now for both repositories | |
| Review of plan four, S4 | Schemathesis runs as the owner of `build/image/fuzz`, whose folder only that user may write, where it was writable by every account | `Fuzz.java`, `FuzzTest.java` |
| Review of plan four, T1 | The search for the demo data in the image finds a file or a jar entry by the name of a file of `stack/demo/` or by the tenant the demo data writes to, read from its `set_config`, so an edited copy is found too | `DemoData.java`, `DemoDataTest.java`, two counter-tests |
| Review of plan four, T4 | Two sentences of [plan four](../history/plans/2026-10-14-backend-delivery-plan.md) brought to what its closing run measured | |

Four counter-tests are new: `image-unconfined` (a service without its cpuset), `image-unbounded` (a service without its memory limit), `image-demo-data-edited-in-jar` (the seed a line short, in the jar under another name) and `image-demo-data-edited` (the seed with one line changed, in the jar under its own name). The tool's tests went from 330 to 362.

### Measured before and after

On the owner's Mac (10 cores, 24 GiB). Before: plan four's own record, and runs of the start tree in a copy of its own; Docker Desktop had 10 processors and 7.75 GiB, and the coordinator then gave it 5 processors and 5 GiB, for the second measure before and every measure after. The sampler read every two to four seconds the cumulative processor time of Docker's virtual machine and of its backend, the machine's busy share over one second, the resident memory of the checks' JVMs, the footprint of Docker's virtual machine, the containers' own memory (`docker stats`) and the swap (`.work/fast-checks/sample.py`, `sample2.py`).

| Measure | Before | After |
|---|---|---|
| `./verify`, rows added up | 530.2 s (plan four, alone on the machine, five workers); 1,092.8 s in the copy beside other work, five workers; 671.4 s at two workers | 629.1 s at two workers, every row green; the fast group 63.0 s, where plan four's took 72.6 at five |
| Docker's VM during `./verify`, peak | 5.90 processors (image) and 5.30 (coverage), with Docker at 10 processors and five workers; 3.76, with Docker at 5 and two workers | 3.54, with Docker at 5 and two workers (3.85 in the run before it): every container on the processors `0-4`, all five of Docker's since its own limit, which a container reads as `cpuset 0-4` |
| Memory during `./verify`, peak, at two workers | 9,703 MiB: the checks' JVMs 4,574 MiB while PIT's minions over the tool ran without a heap limit, and Docker's VM 5,129 MiB; the containers' own peak 2,124 MiB | 6,488 MiB: the checks' JVMs 1,359 MiB at their peak, in coverage, and Docker's VM 5,129 MiB; the containers' own peak 1,773 MiB, in the image check; within a third of the Mac's 24 GiB |
| The first counter-test of each check, 16 | 1,497 s, each by name with the old engine at five workers, two runs each and the start of the launcher each time | 665.4 s in one `./canary smoke` at two workers, 671 s with the start, each check run once, planted; 16 of 16 caught, and the engine recorded |
| `./canary all` | 205 minutes for 152 (plan four) | Not run in this part: a full run does it, by hand at night until the sandbox CI exists |

Each of those sixteen counter-tests, in seconds, before and after. The counter-tests ran on the tree `dd8bd2b84b93`, green in `./verify` too, which differs from the final tree in one test of the tool alone: the test of `./canary changed` now writes its record directly instead of running every fake counter-test four times, which had cost the check `tooling` 20 seconds.

| Counter-test | Before | After |
|---|---|---|
| `format-indent` | 27 | 4.6 |
| `compile-unused-local` | 26 | 3.2 |
| `lint-complexity` | 30 | 12.0 |
| `language-vietnamese` | 10 | 2.2 |
| `architecture-field-injection` | 55 | 14.6 |
| `deadcode-public-method` | 28 | 15.5 |
| `tooling-no-counter-test` | 44 | 29.4 |
| `contract-renamed-field` | 40 | 14.5 |
| `trace-unnamed-id` | 60 | 13.9 |
| `unit-failing` | 40 | 13.6 |
| `integration-no-policy` | 137 | 11.5 |
| `coverage-untested` | 303 | 88.2 |
| `mutation-weak-test` | 262 | 297.4 |
| `deps-vulnerability` | 10 | 6.7 |
| `secrets-private-key` | 7 | 13.0 |
| `image-root` | 418 | 125.1 |

The mutation counter-test alone grew: its one run at two threads of PIT costs more than its two runs at five did. Applied to plan four's 205 minutes, the ratio of the sixteen, 44%, gives about 90 minutes for `./canary all`; that is an estimate, not a measure.

The selection on the real tree, the same day:

| Run | Measured |
|---|---|
| `./canary changed --list`, no record yet | Every check and the engine, each "no record of its counter-tests": 156 counter-tests |
| `./canary secrets`, `./canary format`, `./canary trace` | 2 of 2 each, in 0.2, 0.1 and 0.4 minutes, each check recorded |
| `./canary changed --list` again | The 13 other checks, 150 counter-tests, and no smoke set: the engine was recorded by the smoke run |
| The four new counter-tests, by name | `image-unconfined` 8.2 s, `image-unbounded` 14.2 s, `image-demo-data-edited-in-jar` 120.5 s, `image-demo-data-edited` 109 s with its start, each red because of its planted defect |
| A container started with `--cpuset-cpus 0-4 --memory 512m` | Reads `cpuset 0-4 memory 536870912` from its own cgroup |

### Decisions

- **What a shared file selects.** A file of the build belongs to every check, since each check is a task of it and a change there can blind any of them; a dependency upgrade therefore selects every counter-test, which is why the pull request's job of 16 Oct had 360 minutes and why GitHub runs no counter-test since 17 Oct. The engine's files select the smoke set, as the brief rules. A test of the product is no check's, but those a check is made of: the architecture and module rules, the settings test of the dead code check, the tests of the contract, and the integration tests, whose counter-tests plant defects their tests must catch.
- **A missing record selects every check.** The record is new, so its first full entries come from the first full run, by hand at night. This part's change touches the build, so its own selection is every check: `./canary changed --list` showed it, and this part ran the smoke set, the new counter-tests and three whole checks instead of the full set.
- **The skip trusts a row of the whole check.** A row whose facts open with `partial` stands for no counter-test; `./verify` narrows a check only through `MUTATION_BASE`.
- **One set of processors for every container.** A `cpuset` the containers share keeps their sum within half however many run at once, which a share per container cannot do once the core keeps its own processor; it is also valid on a runner of two processors, where half is one. The core keeps `cpus: 1` inside the set, as a deployment runs it.
- **Left out of the caps.** The steps of `docker build`, for which BuildKit offers no processor or memory option (`docker build --help` lists `--cgroup-parent` alone), and whose Gradle runs at half of Docker's processors; Ryuk, Testcontainers' reaper, which only waits.
- **Memory by service, not by machine.** The limits are what each service needs, as the core's 2 GB is a rule of its deployment; the measures show the sum within a third of this Mac's memory. On a private repository's runner of GitHub, 2 processors and 8 GB [Source: docs.github.com/en/actions/reference/runners/github-hosted-runners, read 16 Oct 2026], every container of a check shares one processor, and the stack takes about half the runner's memory.
- **The daemons' idle life.** 15 minutes, where Gradle keeps a daemon three hours [Source: docs.gradle.org/current/userguide/build_environment.html, read 16 Oct 2026: `org.gradle.daemon.idletimeout`, "Default is 10800000 (3 hours)"] and Kotlin's daemon waits two hours after its last compilation [Source: kotlinlang.org/docs/kotlin-daemon.html, read 16 Oct 2026: `autoshutdownIdleSeconds`, set through `-Dkotlin.daemon.jvm.options` in `org.gradle.jvmargs`].

### Not run

- The full `./canary all` and the first full record of `reports/canary.json`: a full run does them, by hand at night until the sandbox CI exists.
- `./canary changed --base` on a real history: the repository has no commit. Its selection is proven by the tool's tests, on paths a fake git gives.
- CI: the repository has no remote yet; the first runs of part three's workflow measure a runner of 2 processors.

## Part two: metis-app

Written by part two, the agent that built it. Measured on the 10-core Mac `mrpo`, 16 Oct 2026.

### What changed

- **Mutation testing in steps.** With no `MUTATION_BASE` and no arguments, `gate:mutation` runs
  Stryker's incremental mode from `reports/mutation/baseline.json`: the Stryker report of the last full
  run, its tree, its start and the hash of each shared test file (`*.test.helper.*`,
  `*.test.setup.*`, `jest.config.js`). Each run hands Stryker a copy, so the baseline stays the full
  run's. Stryker reuses a mutant's result while its code and a test that killed it are unchanged
  (`incremental-differ.js` of `@stryker-mutator/core` 10.0.0), and it cannot see shared test code, so
  the copy leaves out every test that loads a shared file changed since; past `BUDGET` sources the
  tests stay and the row says why. `MUTATION_FULL=1`, or no baseline, runs every file and records the
  baseline, red or green. Arguments (the mutation canary) and `MUTATION_BASE` (pull requests) work as
  before. `pnpm verify` records the new scope: `Mutation: incremental from the full run of <time> on
  tree <tree>`, with a score over every mutant.
- **The baseline today** is the report of the full run of 15 to 16 Oct 2026 (8,608.9 seconds, 1,718
  mutants, score 100, tree `eca5409429eb`): no file under `src/` and none of the 22 shared test files
  changed since it started, checked by their times and by the 189 sources in the report.
- **Counter-tests by change: not built for the app.** `scripts/canary.mjs` maps a canary to its gate
  only, and the whole set takes 7 to 8.5 minutes, so the full runs run every canary (a weekly CI
  job as part two built it, the sandbox CI since part three, by hand at night until it exists) and
  `AGENTS.md` says when to run one by hand: a change to a gate's own code.
- **CI.** Part two built a weekly job: `pnpm verify --only deps`, `pnpm canary all`, then
  `MUTATION_FULL=1 pnpm verify --only mutation --append`, the baseline uploaded as the artifact
  `mutation-baseline`, within 360 minutes, the most a hosted job may run [Source:
  docs.github.com/en/actions/reference/limits, read 16 Oct 2026]. Part three removed it with its
  artifact. Part two left the push and pull request jobs unchanged.
- **Caps.** `gate:tooling` ran 9 test files at once (Node's default, all processors but one); it now
  runs half (`--test-concurrency`, 5 here). Expo runs Metro's workers as threads of one process
  (`unstable_workerThreads`, `@expo/metro-config` `ExpoMetroConfig.js:314`), which passed half the
  processors at 4 workers; `scripts/workers.mjs` now gives Metro a fifth (2 here) in both web exports
  and in the Release build of `gate:native`. Stryker, Jest and Playwright keep 50%, 50% and 30%.
- **Code.** `scripts/tree.mjs` holds the tree stamp, now used by `verify.mjs` and `mutation.mjs`; the
  scripts stay at 100% of lines, branches and functions (692 tests).

### Measured before and after

| Measure | Before | After |
|---|---|---|
| `gate:mutation` on the Mac | 8,608.9 s, full run | 141.7 s in steps with nothing changed since the full run (1,714 of 1,718 results reused, the other 4 ignored by a disable comment); 175 s after a change to one function of a screen model (7 mutants tested, 1,707 reused); score 100 each time |
| `pnpm verify`, 13 gates | 8,756.6 s of gates (tree `eca5409429eb`) | 610.8 s, 10 min 18 s from start to end (tree `dadf7f9edecb`); 502.5 s under the temporary cap below (tree `fe92dbf61584`) |
| `gate:tooling`, test files at once | 9 | 5 |
| Metro, web export | 4 workers, one process at up to 593% in `gate:web` | 2 workers: 333% at the peak, 14 s against 17 s |
| Metro, Release build of `gate:native` | 4 workers, 532% | 2 workers |
| Docker's machine | The app starts no container | The app starts no container |

The final record, on tree `fe92dbf61584`, ran under the coordinator's cap for the lagging Mac (Node
tools saw 4 processors through `.work/cap-cpus.cjs`: Stryker 2 runners, Jest 2 workers, Playwright 1,
Metro 1). Every gate is green on that one tree, `gate:tooling` in its rerun (see the first finding).
The run's own processes peaked at 261% (`gate:unit`). The counter-tests of the changed gates went red
for their planted defects: `mutation` (88 s), `tooling` (24 s) and `touch-target` (292 s). The fix of
the first finding changed only the `gate:tooling` line of `package.json`; `format` (the file's
layout), `deadcode` (knip reads its scripts) and `tooling` then reran green on tree `c31b91af6e6a`, the
tree as it stands. A full `pnpm verify` then ran on that tree under the same cap: all 13 gates
green, every row on that one tree, mutation in steps in 75.1 s.

### Findings for the coordinator

1. `metis-app/package.json:74`: with `cap-cpus.cjs` preloaded through `NODE_OPTIONS`, Node's coverage
   counted that file (75% of its branches), so `gate:tooling` was red at 99.89% while all its tests
   passed; the second Mac's `env.sh` would hit the same. Applied:
   `--test-coverage-include='scripts/**' --test-coverage-include='eslint-rules/**'`, both folders,
   because the coverage also counts the 5 lint rules of `eslint-rules/`, which `scripts/**` alone
   would drop from the bar. On tree `c31b91af6e6a` the gate is green at 100% with the preload and
   without it, over the same 20 files; an uncovered function planted in `scripts/workers.mjs` turned it
   red (99.69% of functions) and was restored byte for byte, and the `tooling` counter-test went red
   for its planted file.
2. The iOS Simulator is not capped: launchd starts its processes, outside the run. It took 623% at
   its cold boot and 670% at its peak during the flows (9 of 102 samples over half). The gate shuts it
   down after each run. Not approach-changing; no tool of the app can cap it.
3. Stryker at its standing 50% (5 runners) reached 554% in one sample of 144 while it tested mutants;
   the brief keeps that cap.

### For the decision records

- `where-checks-run.md`: the full mutation run now keeps the baseline (in the weekly job part two
  built, by hand at night since part three); a Mac runs Stryker's incremental mode from it, so "The Stryker incremental cache is not used" no
  longer holds for the app. Pull requests are unchanged.
- `resource-caps.md`: Metro takes a fifth of the processors in the web export and in the Release
  build (`scripts/workers.mjs`), replacing `--max-workers 4`; `node --test` half; the simulator is the
  uncapped exception, with the numbers above.
- `gates-with-canaries.md`: the app's 37 canaries run in the full runs and by hand when a gate's own
  code changes; no canary changed.

### Not run

- The full mutation run: a full run does it, by hand at night until the sandbox CI exists; the
  baseline is the last full run, on the same sources.
- `pnpm canary all`: a full run does it; the three counter-tests of the changed gates ran.
- CI: the repository has no remote yet.
- A full `pnpm verify` at the standing caps after the Metro change: the coordinator capped every run
  at 2 Stryker runners, 2 Jest workers and 2 Playwright workers, so the final record ran under that cap.

## Part three: the economical part on GitHub

Built on 17 Oct 2026 from the owner's words in [The decisions](#the-decisions), before the first push of the four repositories.

### What changed

| Repository | `.github/workflows/check.yml` | Texts |
|---|---|---|
| All three | A push to `main`, a pull request or a run by hand starts it, and no `schedule`; `concurrency` keyed on the workflow and the ref, with `cancel-in-progress`, so a newer run on the same ref cancels the one still going [Source: docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs, read 17 Oct 2026] | |
| metis-backend | A push or a run by hand: `./verify --fast`, within 30 minutes. A pull request: `./verify` with `MUTATION_BASE` and `CONTRACT_BASE`, within 60 minutes, without `./canary changed --base`; each job keeps `reports/verify.md` alone. The weekly job is gone. Every action stays pinned by its commit, and every checkout keeps `persist-credentials: false` | `AGENTS.md`, `README.md` |
| metis-app | A push or a run by hand: the fast group, within 30 minutes. A pull request: `pnpm verify` with `MUTATION_BASE`, within 60 minutes, `gate:native` recorded `skipped (macOS only)`. The weekly job and its artifact `mutation-baseline` are gone | `AGENTS.md`, `README.md`, the first comment of `scripts/mutation.mjs` and its message `LEFT_OUT` |
| metis-docs | Its one job, as before | The three decision records, [Develop the core](../components/core/develop.md), [Develop the app](../components/app/develop.md), [Project structure](../components/app/guide/project-structure.md) and this page |

### Proof

On the owner's Mac, each heavy run alone under the shared lock, at two workers.

| Run | Measured |
|---|---|
| actionlint 1.7.12, the backend's pinned image, on the three workflows | No finding, exit 0 for each |
| `./verify` in metis-backend, `METIS_WORKERS=2` | 16 checks green on one tree `05ea5fdc36e4`, nothing skipped: rows 1,076.5 seconds, the fast group 96.6. Slower than part one's 629.1, since `fseventsd`, macOS's file-event daemon, ran beside it at 92 to 98% of a processor with 31 GB in the memory column of `top`, and its media analysis at up to 2.6 processors, with 35.1 of 35.8 GB of swap in use |
| `./canary changed --list` | The 13 checks without a record, each for that reason alone; format, secrets, trace and the engine not selected. The change maps to `tooling` alone: `.github/**` is the check's, and the pages are no check's |
| `./canary tooling` | 6 of 6 red because of their planted defect, each check run once, planted, in 1.7 minutes; `tooling` recorded, so the selection after holds 12 checks |
| `pnpm verify` in metis-app, Node seeing 4 processors through `.work/cap-cpus.cjs` | 13 gates green on one tree `8280b6f479b0`, mutation in steps 72.1 seconds at a score of 100; the simulator shut down after |
| `pnpm canary tooling` and `pnpm canary mutation`, for the change to `scripts/mutation.mjs` | Both red because of their planted defect; the tree's stamp the same after |
| `node tools/generate.mjs`, then `node tools/check.mjs` in metis-docs | `check: clean (245 pages, 482 files)` |

### Not run

- The full runs, `./canary all` with the first full record of `reports/canary.json`, the app's full mutation run and `pnpm canary all`: they are for the sandbox CI, by hand at night until it exists.
- CI: the repositories have no remote yet, so no workflow has run, and its first runs measure the limits of 30 and 60 minutes.
