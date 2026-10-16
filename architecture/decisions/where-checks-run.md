---
title: GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record
summary: Three places run the checks of metis-app and metis-backend today, GitHub Actions on Linux, the developer's machine and a person on real devices; while working a change runs what it touches, a push to main runs the fast group and a pull request every check, the full mutation runs and every counter-test are for a sandbox CI still to be set up and run by hand at night until it exists, and every run of the checks writes a machine record.
component: all
type: decision
status: current
ids: []
---

# GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record

## Context

On 5 Oct 2026 the owner set the rules for where the checks run. The answer, translated: everything in CI must use free solutions; real devices will be tested by a human; before a pull request is sent the owner needs one command that triggers the full test suite on the owner's Mac, which is macOS and so already covers much (Xcode, Safari); CI runs everything it can, and what needs macOS is run on the Mac before the pull request is sent (FE-15).

The facts that shaped the design:

- GitHub Actions standard runners are free for public repositories, and a private repository on the free plan has a limited allowance of minutes and storage [Source: https://docs.github.com/en/billing/concepts/product-billing/github-actions].
- Since 2 Apr 2024 the 2-core Linux machines accelerate the Android Emulator in hardware, with KVM enabled in the workflow [Source: https://github.blog/changelog/2024-04-02-github-actions-hardware-accelerated-android-virtualization-now-available/].

The code review of 9 Oct 2026 found three defects in the first arrangement:

- CI could not go green: two jobs were cut at 30 minutes while full mutation testing needed more, 4,527 seconds on a 10-core Mac (finding 4).
- `reports/verify.md` was tied to no code tree and recorded no test counts, and a hand-written passage said green beside a red row (finding 18).
- Nothing failed when browser tests stopped running: `forbidOnly` was on only in CI, so `pnpm verify` on the Mac accepted a `test.only` (finding 19).

On 16 Oct 2026 the counter-tests of the back end ran 148 to 205 minutes a round on the Mac, and the owner decided, translated: put the full sets of the mutation testing and of the counter-tests on CI, apply it at once, and fix the overload of Docker. Every bar stays: 100% of lines and branches, every mutant killed, a counter-test for every check. What changes is when and where the heaviest checks run.

On 17 Oct 2026, before the first push, the owner decided, translated: GitHub's CI need not run the full set, which takes too long; the owner will set up a sandbox to run the full CI later; on GitHub, run what is useful while staying economical for a free account. The full sets therefore stay off the developer's rounds, as decided the day before, and wait for that sandbox instead of a weekly job of GitHub.

## Decision

Every check is one command, `pnpm gate:<name>` in the app and a Gradle task `check<Name>` in the back end, so CI, `pnpm verify` and `./verify` only call those commands and no logic lives only in the CI file.

**When each part runs**, in both repositories:

| When | metis-app | metis-backend |
|---|---|---|
| While working | What the change touches: one gate, one test file | What the change touches: one check, one test task, one counter-test |
| Before handing work back | `pnpm verify`, its mutation testing in Stryker's incremental mode from the baseline of the last full run | `./verify --fast`, then `./canary changed`: the counter-tests of the checks whose implementation changed since their record |
| Every push to `main`, or by hand (GitHub's CI) | The fast group, within 30 minutes | The fast group, `./verify --fast`, within 30 minutes |
| Every pull request (GitHub's CI) | Every gate, mutation testing on the changed files, within 60 minutes | Every check, mutation testing on the changed classes (`MUTATION_BASE`) and the contract against the base (`CONTRACT_BASE`), no counter-test, within 60 minutes |
| The full runs (the sandbox CI, still to be set up; by hand at night until it exists) | The full mutation run, `MUTATION_FULL=1 pnpm verify --only mutation --append`, which records the baseline of the runs in steps, then `pnpm canary all` | `./verify` with the whole mutation run, then `./canary all` |

GitHub's CI keeps to what a free account affords: a push runs it on `main` alone, no job runs on a schedule, and a newer run on the same ref cancels the one still going, through `concurrency` with `cancel-in-progress` [Source: docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs, read 17 Oct 2026]. The sandbox CI does not exist yet: until it does, the full runs are started by hand, at night, alone on the machine under the caps of [Checks must not overload the machine](resource-caps.md). The limits of 30 and 60 minutes are not measurements: no workflow has run yet, and the first runs measure the runners' own times.

**1. CI, GitHub Actions on Linux** (`ubuntu-24.04`). Each job calls only `pnpm verify` or `./verify` and uploads `reports/verify.md` as an artifact. There is no macOS machine in CI, no EAS Workflows and no hosted real-device service.

- The app: `gate:native` exits with the reason "macOS only" and is recorded `skipped (macOS only)`. Mutation testing on a pull request (see [Coverage 100, mutation 100, no unused code](machine-proven-code.md)) runs on the source files changed against the base branch (`MUTATION_BASE`, `scripts/mutation.mjs`) plus the source beside each changed test; a changed shared test helper adds the sources of every test that loads it, and a changed setup file or `jest.config.js` adds those of every test. When that addition passes 20 sources (`BUDGET`), CI leaves them out and the row of the gate says why. Not in CI yet, because not built: Lighthouse CI, Reassure, the volume test, picture comparison, the Android app on an emulator through Maestro, Edge and Firefox.
- The back end: a pull request runs `./verify` with `MUTATION_BASE` and `CONTRACT_BASE` set to its base branch, and no counter-test, since a change of the build, of the version catalog or of a lock selects every counter-test, hours of a runner. `./canary changed --base <ref>` still selects from the paths git names since a commit, for a run by hand.

**2. The developer's machine.**

- The app: `pnpm verify` before every pull request runs every gate CI runs, plus what only macOS can do: building the iOS app with Xcode and running the Maestro flows in the iOS Simulator (`gate:native`). Its mutation testing runs in Stryker's incremental mode from `reports/mutation/baseline.json`, the report of the last full run: Stryker reuses a mutant's result while its code and the tests that killed it are unchanged, a test that loads a shared test file changed since runs again, and `MUTATION_FULL=1` runs every file and records a new baseline. A change then costs minutes: 141.7 seconds with nothing changed, 175 seconds after a change of one function, against 8,608.9 seconds for the full run.
- The back end: `./verify --fast` and `./canary changed` before work is handed back; `./canary changed` compares the stamp of each check's implementation files with the one its counter-tests last all caught on, kept in `reports/canary.json`, and a change of the engine of the counter-tests selects one counter-test of every check, the smoke set.

**The record.** `pnpm verify` and `./verify` keep their record in `reports/verify.json`, written only by the command, and draw `reports/verify.md` from it on every run, so no hand-written passage survives. One row per gate or check gives the result (`green`, `RED`, or for the app `skipped (macOS only)`), the seconds, the counts (tests against the floor, coverage, the scope and score of mutation testing) and the stamp of the tree it ran on: a hash of the files git would commit plus the count of uncommitted changes. A red row makes the exit code 1, and so does a full run that cannot name its tree. `--only <name>[,<name>] --append` reruns some and adds their rows under `Reruns`. The test floors are exact, so a change that adds or removes tests updates the floor file; in the app the Playwright option `forbidOnly` stops a run that holds a focused test. A row whose scope was a part of its check says so: the facts of the back end's mutation row open with `partial` then. The back end's `./canary` keeps its own record, `reports/canary.json`. The flag `--publish-status`, which would mark the commit on GitHub as checked on macOS so that branch protection can require it, is not built.

**3. A person on real devices before each release** of the app, from a checklist kept in the repository: which devices, which flows (taken from the screen contracts, see [`contract.yaml` is each screen's promise, traced to tests](screen-contract-and-trace.md)), VoiceOver and TalkBack, and performance measured with Xcode Instruments on an iPhone and Flashlight on an Android device plugged into a computer. The result goes into a dated file.

## Consequences

- The same checks as CI run on the developer's machine before a pull request, with one report as the result; a red row makes the exit code non-zero, and no hand-written text survives in the report.
- The full mutation runs and every counter-test leave the developer's rounds and GitHub's minutes: a sandbox CI is to run them, and until it exists they run by hand at night. A defect that blinds a check the map of the back end gives to no change is caught by the next full run, which has no fixed day until the sandbox CI gives it one; a change whose implementation owner is unclear selects every check.
- A pull request runs no counter-test on GitHub: the developer's `./canary changed` before handing work back, and the next full run, prove the checks a change touched.
- No job runs on a schedule, so a new advisory against an unchanged dependency is found by the next pull request or full run.
- A pull request that changes only tests does not mutate again the code those tests cover; the mapping from a changed test file to its source file closes that gap on CI, and the mutation gate or check is red when a run yields no valid mutant.
- Real devices are covered only by a person, once per release.
- The four repositories are private (RD-14), so CI runs on the account's free allowance of minutes, shared by its private repositories [Source: docs.github.com/en/billing/concepts/product-billing/github-actions, read 12 Oct 2026]; with no scheduled job and no full run on GitHub, a push to `main` and each pull request spend it.
- The browser gate and the native gate are described in [Required platforms, browser gate and native gate](supported-platforms-and-gates.md).

## Status

Current, decided by the owner on 5 Oct 2026 (FE-15), in the test design the owner approved the same day (FE-13). The rhythms, the machine record and the exact test floors are as built under FE-27 (9 Oct 2026) and the code cleanup plan run under FE-28. The owner's decision of 16 Oct 2026 moved the full runs off the developer's rounds, to a weekly job of CI, in both repositories; the owner's decision of 17 Oct 2026 left GitHub the fast group on a push to `main` and every check on a pull request, and the full runs to a sandbox CI the owner is to set up, both as built in [Fast checks](../../proposals/2026-10-16-fast-checks.md).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-15 (line 54 of the original) and section 10.6 (lines 484 to 522 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): section 11 (lines 603 to 669 of the original), the exact test floors (lines 552 to 555) and the open question on a public or private repository (line 696).
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): the owner decision RD-14 in its table of owner decisions (the repositories are private repositories of a personal account), which settles the open question above.
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): rulings 23, 24, 26 and 27 of its table of rulings (lines 1000, 1001, 1003 and 1004 of the original).
- [Code review report](../../history/code-review/report.md): findings 4, 18 and 19 (lines 162 to 170 and 321 to 336 of the original).
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): section 8.5, where the checks of the back end ran before the decision of 16 Oct 2026.
- [Fast checks](../../proposals/2026-10-16-fast-checks.md): the decisions of 16 and 17 Oct 2026, the workflows and commands of both repositories, and the times measured before and after.
