---
title: Development and checks on the VPS, implementation plan
summary: The plan of 21 Oct 2026 that builds the part of the remote runs that is Metis's (the manifest and images in metis-infra, the dev loop with Spring Boot DevTools, the page updates) and proves it on the VPS ai-initiatives, every VPS step after the pdev remote pack passes its own tests on the Mac.
component: all
type: proposal
status: draft
ids: []
---

# Development and checks on the VPS, implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The owner's rules: run to the deliverable on your own recommendations (FE-21); stop only for an irreversible, security-sensitive or outward action; never run `git add`, `git commit` or `git push`.

**Goal:** Metis's dev loop, checks, full runs, generators and Android emulator run on the VPS `ai-initiatives` through the pdev remote pack, from what Metis commits in `metis-infra/remote/`, and every acceptance item of the design is measured.

**Architecture:** `metis-infra/remote/remote.json` is the manifest the pack reads: four images built from Metis's own pins, a dev loop that overlays the back end's stack with a core run from Gradle under Spring Boot DevTools and with Metro in a container, the checks and generators of both code repositories, and an emulator session. The back end changes by one dependency, DevTools in `developmentOnly`, by the locks its checks then require, which the pack's generator writes on the VPS, and by what a shared host needs of every container it starts: no swap, and the pack's two labels, with Testcontainers' Ryuk off there. The pack's own plan, in the pdev repository, is green on the Mac before the first VPS step; until the owner's release the pack runs from the pdev checkout, and its probes measure the acceptance.

**Tech Stack:** pdev-remote 0.1.0 and pdev-core 0.3.22 from the checkout `~/projects/pdev`; on the VPS Docker 29.1.3 with Compose 2.40.3 (measured 21 Oct 2026); Gradle and Spring Boot 4.1.1 with DevTools; Expo and Metro; the Android emulator with KVM and Maestro 2.11.0; Node for the tree stamp of `metis-app/scripts/tree.mjs`.

**Spec:** [Development and checks on the VPS](2026-10-21-vps-development-design.md); the pack's design and plan in the pdev repository, `docs/superpowers/specs/2026-10-21-pdev-remote-design.md` and `docs/superpowers/plans/2026-10-21-pdev-remote.md`.

## Global Constraints

- No VPS step starts before the pack's plan ends green on the Mac (its Task 11: the self-test here and in its Debian container, pack-check of every combination, the core suite).
- The VPS is `ai-initiatives.tail8a0f4a.ts.net`, reached over Tailscale SSH as `root`, its only account, beside 21 containers of other work. No step lists, stops, removes or prunes an object without Metis's label `dev.pdev.project=metis`, installs a package, creates an account or changes a system setting there. Every VPS step is serialized, one heavy job at a time. No step types a `docker` or `docker-compose` command for the VPS: its readings go through `pdev remote status` and `pdev remote probe`, and the pack's deny rows refuse any other.
- Nothing of Metis lands on the VPS while its free disk is short: `setup` reads the free disk before it writes anything and refuses, naming the figures, when the host's 15% (20.2 GiB of 135 GiB, as `df -h` prints them) and Metis's 40 GiB do not fit, so 60.3 GiB must be free; the owner's cleanup target is 65 GiB. The inventory taken before it only reads.
- Until the owner's release of pdev, the pack runs from `~/projects/pdev` in dev mode (`~/.claude/pdev.json` holds `"dev": true` and that `src`, measured 21 Oct 2026); a session that needs the pack's skills starts with `--plugin-dir` for `plugins/pdev-core` and `plugins/pdev-remote` of that checkout.
- Every version inside an image comes from the repository file that pins it, read by the manifest with `{file, match}`; a version only one Dockerfile uses is typed once, as an `ARG` default in that Dockerfile, whose bytes the pack hashes into the image's tag; the one version several files need and no repository pins, the docker CLI image, is typed once in `metis-infra/remote/pins.txt`. Operating-system packages come from the base image's distribution.
- In `metis-backend`, the edits by hand are DevTools in `core/build.gradle.kts` and what a shared host needs of every container Metis starts: `memswap_limit` equal to `mem_limit` on every service of `stack/compose.yaml` and `stack/compose.demo.yaml` (Task 1); `Stack.confine` setting the swap equal to the memory and the labels `dev.pdev.project` and `dev.pdev.run` from `PDEV_PROJECT` and `PDEV_RUN` when they are set (nothing on a Mac); the back end's own `docker run` launchers (`build.gradle.kts` `scanner()` and `imageLint`, `Contract.java`, `Fuzz.java`) given `--memory-swap` equal to `--memory` and the same two labels, asserted by tests of the tool; and the image check requiring the swap limit, with a counter-test (Task 4). The locks and checksums come from the pack's generator.
- On the VPS every back-end check and generator runs with `TESTCONTAINERS_RYUK_DISABLED=true`, set in its manifest command: Ryuk, the container Testcontainers uses to clean up the others, holds the Docker socket and publishes its port on every address of the machine, which no setting of Testcontainers changes (metis-backend `reports/review/review.md`, item 6; the security review of 22 Oct 2026 read the same from `testcontainers-2.0.5.jar` with `javap`). With Ryuk off, the test JVM removes its containers from a shutdown hook (`ResourceReaper.instance()` picks `JVMHookResourceReaper` when that variable is set, and its `init()` registers the hook: `javap` of the same jar, 22 Oct 2026); a JVM killed outright leaves them, labeled, and the pack removes every container of the run's label when the run ends or its watchdog stops it.
- The four stack passwords are generated by the pack on the VPS once and stay in `~/.pdev-remote/metis/secrets/`, outside every repository and every run copy and mounted into no container (Compose reads them on the VPS), since the back end's secret scan reads every file of its tree, ignored ones included (metis-backend `README.md`, lines 74 to 76).
- No `git add`, `git commit` or `git push`. A task appends the paths it changed, one per line, to `~/projects/metis/.superpowers/sdd/2026-10-21-vps-development/changed-files-<repo>.txt`, `<repo>` being metis-infra, metis-backend, metis-app or metis-docs; a file outside the repositories is named in the task's report.
- Measures go to the section As executed of this page, each with its figure and date; evidence (screenshots, inventories, logs) to `~/projects/metis/.work/remote/`.
- A tool is installed on a Mac only when an approved item needs it, with the line that shows it missing, and logged (FE-18).
- English only, no em dash, no en dash; this page and every page Task 11 edits keep the rules of the metis-docs `AGENTS.md`.

## Review Focus

- A base image pinned on the Mac's ARM processor by a digest with no x86_64 entry (the back end's `core/Dockerfile`, lines 2 and 16, and the stack's images): the build or pull on the VPS fails naming the image, and the fix is the multi-architecture index digest in the same file, never a second pin. Tests: Task 2, Step 5 (the four images) and Task 5, Step 3 (the image check builds the core and pulls the stack).
- The relay answers one origin, `http://localhost:8081` (`stack/compose.demo.yaml`, line 25): a browser at `http://127.0.0.1:8081` shows the unavailable state, by design. Test: Task 3, Step 4.
- The secret scan of `./verify` reads every file of the tree: the dev secrets never enter a repository or a run copy. Test: Task 5, Step 3, the secrets row green.
- Two Gradle builds in one workspace: a back-end generator while the core's continuous build runs. The generator is declared heavy, so the dev loop pauses first and resumes after, the relay after the core. Test: Task 4, Step 2.
- One processor for Metis: a full run may pass 8 hours, the sign the design gives for moving Metis to a larger VPS. Test: Task 8 records every duration and flags each one over 8 hours.
- Ryuk off: a back-end run opens no listener outside the VPS's loopback, and no container of it outlives the run. Tests: Task 4, Step 3 (the labels and the swap, test first), Task 5, Step 3 and Task 6, Step 2 (the listeners compared with the inventory before setup).
- An owned name that already exists on the VPS belongs to the other work: the plan stops before setup. Test: Task 2, Step 3.

---

## Files

| Path | What it holds |
|---|---|
| `metis-infra/remote/remote.json` | the manifest (values below) |
| `metis-infra/remote/pins.txt` | the one version no repository pins that several files read: the docker CLI image |
| `metis-infra/remote/workspace/Dockerfile` | the workspace image |
| `metis-infra/remote/app-runner/Dockerfile` | the app's runner |
| `metis-infra/remote/backend-runner/Dockerfile` | the back end's runner, also the core's dev service |
| `metis-infra/remote/android/Dockerfile`, `entrypoint.sh`, `build.sh`, `flows.sh` | the emulator image and the scripts of the two Android checks |
| `metis-infra/remote/compose.dev.yaml` | the dev loop over the stack |
| `metis-infra/remote/core-dev/run.sh`, `classpath.init.gradle.kts` | the core's dev service |
| `metis-infra/AGENTS.md`, `metis-infra/README.md` | the first code of the repository |
| `metis-backend/stack/compose.yaml`, `stack/compose.demo.yaml` | `memswap_limit` equal to `mem_limit` on every service |
| `metis-backend/core/build.gradle.kts`, its locks, `AGENTS.md` | DevTools, the locks the generator writes, the rule on remote runs |
| `metis-backend/build.gradle.kts`, `tools/src/main/java/dev/metis/tools/contract/Contract.java`, `tools/src/main/java/dev/metis/tools/image/Fuzz.java`, `core/src/integrationTest/java/dev/metis/core/Stack.java`, their tests | no swap and the pack's two labels on every container the back end starts |
| `metis-backend/tools/src/main/java/dev/metis/tools/image/Pins.java`, `tools/src/main/java/dev/metis/tools/canary/ImageCanaries.java` | the image check's swap rule and its counter-test |
| `metis-app/AGENTS.md` | the rule on remote runs |
| metis-docs pages of Task 11 and this page | as built |
| `~/projects/metis/.claude/` (settings, profile, launcher), `~/projects/metis/CLAUDE.md` | outside the repositories: the project layer, the folder notes |

## The manifest's values

Version 1, project `metis`, repositories `metis-app`, `metis-backend`, `metis-docs`, `metis-infra`. Share: processors `half`, `memory_reserve` 25, `disk_reserve` 15, `disk_max` `40g` (the design's table). `workspace_image` `workspace`. `cli_image` read with `{file, match}` from `metis-infra/remote/pins.txt`, match `^docker-cli=(\S+)$`: `docker:29.1.3-cli` by its index digest, which carries the buildx and compose plugins (Task 1, Step 1 proves it); `builder_memory` `3g` (the core's image build runs Gradle inside BuildKit). `owned`, the objects the back end's own checks create under their own names: compose `metis-check` (`tools/src/main/java/dev/metis/tools/image/Compose.java`, line 17), images `metis-core:check` (`build.gradle.kts`, line 85), volumes `metis-trivy-cache` (`build.gradle.kts`, line 56), containers `metis-check-fuzz` (`tools/src/main/java/dev/metis/tools/image/Fuzz.java`, line 22); the containers the integration tests and the back end's launchers start carry the run's labels (Task 4, Step 3), and the pack removes them when the run ends. Forwards `[8081, 8081]`, `[8090, 8090]`, `[8080, 8080]`. Dev: compose `metis-backend/stack/compose.yaml`, `metis-backend/stack/compose.demo.yaml`, `metis-infra/remote/compose.dev.yaml`; name `dev`; `pause_for_heavy` true; secrets `METIS_POSTGRES_PASSWORD`, `METIS_MIGRATOR_PASSWORD`, `METIS_APP_PASSWORD`, `METIS_PERSON_PASSWORD` (`stack/compose.yaml`, lines 15 to 17 and 33). Android: image `android`, memory `4g`, reverse 8081 and 8090, flows `android-flows`.

| Image | Context | Arguments, each read from |
|---|---|---|
| `workspace` | `metis-infra/remote/workspace` | `DOCKER_CLI` from `pins.txt`, match `^docker-cli=(\S+)$`; `BASE` an `ARG` default of its Dockerfile |
| `app-runner` | `metis-infra/remote/app-runner` | `PLAYWRIGHT_VERSION` from `metis-app/pnpm-lock.yaml`, match `'@playwright/test':\n\s+specifier: \S+\n\s+version: ([0-9.]+)` (1.63.0 today); `NODE_VERSION` from `metis-app/.nvmrc`, `^([0-9.]+)$` (24.15.0); `PNPM_VERSION` from `metis-app/package.json`, `"packageManager": "pnpm@([0-9.]+)"` (11.28.4) |
| `backend-runner` | `metis-infra/remote/backend-runner` | `BASE` from `metis-backend/core/Dockerfile`, `^FROM (\S+) AS build$` (the Corretto 25 image the back end builds with); `DOCKER_CLI` from `pins.txt`, as the workspace |
| `android` | `metis-infra/remote/android` | `NODE_VERSION`, `PNPM_VERSION` as the app runner; `BASE` and every Android and Maestro version `ARG` defaults of its Dockerfile |

`pins.txt`, read in Task 1, holds one line, `docker-cli` (`docker:29.1.3-cli` by its index digest, the VPS's Docker), the one version three files read: the manifest's `cli_image` and the workspace and back-end runner images. There is no separate Compose pin: both images take the Compose plugin from that image, which Task 1, Step 1 shows carries it. Every other version no repository pins is used by one Dockerfile and is an `ARG` default there, read in Task 1: in the workspace's, `BASE` (the Debian trixie-slim image by its index digest); in the Android image's, `BASE` (Ubuntu 24.04 by its index digest), the build number of the command-line tools (Google's current Linux archive), and the Mac's own SDK (`/opt/homebrew/share/android-commandlinetools`, read 21 Oct 2026): platform-tools 37.0.1 (so the adb of the Mac and of the image match, as the viewer needs), emulator 37.2.12, build tools 35.0.0 and 36.0.0, platforms android-35 and android-36, NDK 27.1.12297006, CMake 3.22.1, the system image `system-images;android-35;google_apis;x86_64` (the Mac's API 35 image, in the VPS's architecture), the AVD's device `pixel_7` and RAM 2048 (the Mac's AVD `metis-pixel`), and Maestro 2.11.0.

Checks (arguments of `pdev remote check <name>` are appended; `{PDEV_HOME}` and `{PDEV_WS}` are the pack's placeholders):

| Check | Image, repository | Command | Heavy | Memory | Outputs | Docker, network |
|---|---|---|---|---|---|---|
| `app-verify` | app-runner, metis-app | `env npm_config_store_dir={PDEV_HOME}/cache/pnpm-store sh -c 'pnpm install --frozen-lockfile && exec pnpm verify "$@"' sh` | yes | 4g | the app records | no, bridge |
| `app-mutation-full` | app-runner, metis-app | the same with `MUTATION_FULL=1 exec pnpm verify --only mutation --append` | yes | 4g | the app records | no, bridge |
| `app-canary` | app-runner, metis-app | the same with `exec pnpm canary "$@"` | yes | 4g | the app records | no, bridge |
| `app-gate` | app-runner, metis-app | the same with `exec pnpm run "gate:$1"` | no | 3g | the app records | no, bridge |
| `app-jest` | app-runner, metis-app | the same with `exec pnpm exec jest "$@"` | no | 3g | none | no, bridge |
| `backend-verify` | backend-runner, metis-backend | `env GRADLE_USER_HOME={PDEV_HOME}/cache/gradle TESTCONTAINERS_HOST_OVERRIDE=localhost TESTCONTAINERS_RYUK_DISABLED=true ./verify` | yes | 3g | `metis-backend/reports` | yes, host |
| `backend-canary` | backend-runner, metis-backend | the same with `./canary` | yes | 3g | `metis-backend/reports` | yes, host |
| `backend-gradle` | backend-runner, metis-backend | the same with `./gradlew` | no | 3g | `metis-backend/reports` | yes, host |
| `backend-stack` | backend-runner, metis-backend | the same with `./gradlew` | yes | 3g | `metis-backend/reports` | yes, host |
| `android-build` | android, metis-app | `sh {PDEV_WS}/metis-infra/remote/android/build.sh` | yes | 4g | none | no, bridge |
| `android-flows` | android, metis-app | `sh {PDEV_WS}/metis-infra/remote/android/flows.sh` | yes | 1g | `metis-app/reports/native-android` | no, host |

The app records are `metis-app/reports/verify.json`, `verify.md`, `mutation.json`, `mutation` (the baseline and the steps of `scripts/mutation.mjs`, lines 28 and 31), `jest.json` and `e2e.json`: `pnpm verify --append` and the mutation steps read them back (`scripts/verify.mjs`, line 251). `backend-gradle` serves the Gradle tasks that start no container (`checkFormat`, `:tools:test`); `backend-stack`, the same command made heavy, serves every Gradle task that starts one (`checkImage`, `:core:integrationTest`, `checkContract` with oasdiff and its linter, `checkDeps` and `checkSecrets` with their scanners, `checkTooling` with actionlint), so it waits for the reserve, takes the lock and pauses the dev loop. Both hold the Docker socket, so both wait for the reserve and get a watchdog, the pack's rule. The backend runner shares the host's network and sets `TESTCONTAINERS_HOST_OVERRIDE=localhost`, since the tests publish on `127.0.0.1` (`Stack.java`, line 74) [Unverified - confirm before applying; Task 4, Step 3 runs the first Testcontainers test there and Task 5, Step 1 the whole suite].

Generators: `backend` (backend-runner, metis-backend, `env GRADLE_USER_HOME={PDEV_HOME}/cache/gradle TESTCONTAINERS_RYUK_DISABLED=true ./gradlew`, heavy, 3g, bridge), `app-tokens` (app-runner, metis-app, the pnpm prefix with `exec pnpm gen:tokens`, light, 2g, bridge), `app-mock-answers` (app-runner, metis-app, the pnpm prefix with `WRITE_MOCK_ANSWERS=1 exec pnpm exec jest src/mocks/answers.test.web.ts`, light, 3g, bridge), `docs` (app-runner, metis-docs, `node tools/generate.mjs`, light, 1g, network `none`). None declares outputs or the Docker socket.

## Lanes

- Task 1 runs on the Mac beside the pack's plan once its `validate` exists (its Task 2).
- Tasks 2 to 10 run on the VPS one after another in this order; Task 9 waits for the owner's release and may come last.
- Task 11 ends the plan.

---

### Task 1: The manifest, the images and the dev overlay (Mac)

**Files:** Create every `metis-infra/remote/` file of the table above; modify `metis-backend/stack/compose.yaml` and `metis-backend/stack/compose.demo.yaml`.

**Interfaces:**
- The images. `workspace`: `FROM ${BASE}` (its `ARG` default the Debian trixie-slim image by its index digest), `rsync`, `git`, `ca-certificates` from Debian, the docker CLI and its Compose plugin copied from `${DOCKER_CLI}` (the pack's watchdogs resume the dev loop through Compose from this image), `CMD ["sleep", "infinity"]`. `app-runner`: `FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble` [Unverified - confirm before applying: the tag scheme], Node `${NODE_VERSION}` from nodejs.org checked against its `SHASUMS256.txt`, `npm install --global pnpm@${PNPM_VERSION}`, `python3` and `git` from Ubuntu (the docs generator runs `build.py`, `metis-docs/tools/generate.mjs` line 18). `backend-runner`: `FROM ${BASE}`, `git`, `findutils` (`gradlew` needs `xargs`, `core/Dockerfile` line 10), `curl` (the core's health check, `stack/compose.yaml` line 75), the docker CLI with its buildx and Compose plugins from `${DOCKER_CLI}`, so that the image check's `docker build` goes to Metis's builder through `BUILDX_BUILDER`. `android`: `FROM ${BASE}` (its `ARG` default Ubuntu 24.04 by its index digest), `openjdk-21-jdk-headless` (the Macs run Gradle and Maestro on JDK 21), `unzip`, `curl`, `git`, the libraries the emulator asks for, Node and pnpm as the app runner, the command-line tools, the platform-tools and emulator archives at the pinned revisions from Google's repository index (`sdkmanager` installs only the newest of those two), `sdkmanager` for the build tools, platforms, NDK, CMake and system image, the licences accepted, the AVD `metis-phone` (device `pixel_7`, `hw.ramSize=2048`, `hw.cpu.ncore=1`), Maestro `${MAESTRO}` from its release archive, every version an `ARG` default named in the paragraph on the pins above, `ENTRYPOINT ["/entrypoint.sh"]`.
- `entrypoint.sh` begins with `[ "$#" -gt 0 ] && exec "$@"`, so a command given to the image runs as it is (`emulator -accel-check`, `build.sh`, `flows.sh`), the duty the pack's `references/remote-android.md` states; given none, it starts the emulator `@metis-phone -no-window -no-audio -no-boot-anim -no-snapshot -gpu swiftshader_indirect -accel on`, waits for `sys.boot_completed`, runs `adb reverse tcp:<p> tcp:<p>` for each port of `PDEV_ANDROID_REVERSE`, then waits on the emulator. `build.sh`: in the run copy's `metis-app`, `pnpm install --frozen-lockfile`, `CI=1 EXPO_NO_GIT_STATUS=1 pnpm exec expo prebuild --clean --platform android`, `EXPO_PUBLIC_MOCKS=1 ./gradlew -p android assembleRelease`, the APK copied to `$PDEV_HOME/cache/android/metis.apk`. `flows.sh`: `pnpm install --frozen-lockfile`, `adb install -r` of that APK, `FLOWS` and `maestroEnv(app)` read from `scripts/native-gate.mjs` (lines 27 and 126 to 135) by one `node --input-type=module` call, `maestro --device emulator-5554 test --format JUNIT --output reports/native-android/maestro.xml --test-output-dir reports/native-android/flows` with `-e NAME=value` for each value, `adb exec-out screencap -p` to `reports/native-android/screen.png`, Maestro's status as its own.
- The stack, in `metis-backend`: on every service of `stack/compose.yaml` (the `mem_limit` lines 11, 30, 69 and 85) and `stack/compose.demo.yaml` (line 19), a `memswap_limit` equal to the `mem_limit` of the same service, right after it, so that no service of the stack swaps wherever it runs. The image check's rule that requires it, and its counter-test, come red first in Task 4, Step 7.
- `compose.dev.yaml`: every service, the stack's and `metro`, gets `cpuset: ${PDEV_CPUSET:?}` and `labels: [dev.pdev.project=${PDEV_PROJECT:?}]`, the project's name from the pack rather than typed again. The stack's services keep their own memory (`mem_limit` and the `memswap_limit` above); the overlay sets memory only where it differs from the stack, each `mem_limit` with an equal `memswap_limit`: 2g for `migrate` and 3g for `core` (the image's 2g plus 1g for Gradle's daemon, the design's sum), 2g for `metro`. `migrate` and `core` run `${PDEV_IMAGE_BACKEND_RUNNER:?}` (`core` with `build: !reset null` [Source: docs.docker.com/reference/compose-file/merge/, read 21 Oct 2026]), `pull_policy: never`, `read_only: false`, `working_dir: ${PDEV_WS}/metis-backend`, the volumes `${PDEV_WS}:${PDEV_WS}` and `${PDEV_HOME}/cache:${PDEV_HOME}/cache` and nothing else of the project's folder on the VPS, `GRADLE_USER_HOME: ${PDEV_HOME}/cache/gradle`, the command `sh ${PDEV_WS}/metis-infra/remote/core-dev/run.sh migrate` or `dev`, the core's health check kept with `start_period: 900s`. `metro` runs `${PDEV_IMAGE_APP_RUNNER:?}`: `working_dir: ${PDEV_WS}/metis-app`, the same two volumes, `npm_config_store_dir: ${PDEV_HOME}/cache/pnpm-store`, `EXPO_PUBLIC_API_BASE: ${EXPO_PUBLIC_API_BASE:-http://localhost:8090}`, `EXPO_PUBLIC_MOCKS: ${EXPO_PUBLIC_MOCKS:-}` (mocks are on for `1` only, `src/platform/mocks.ts` line 5), the command `sh -c 'pnpm install --frozen-lockfile && exec pnpm exec expo start --port 8081'` with no `CI` (Metro under `CI=1` never reloads), the port `127.0.0.1:8081:8081`, a health check on `http://127.0.0.1:8081/status` with `start_period: 900s`. Every path is absolute through `${PDEV_WS}` or `${PDEV_HOME}`, because Compose resolves an override file's relative paths against the stack's folder [Source: docs.docker.com/compose/how-tos/multiple-compose-files/merge/, read 21 Oct 2026].
- The core's dev service: `classpath.init.gradle.kts` registers in `:core` a task `pdevClasspath` that writes the main runtime classpath to `core/build/pdev/classpath.txt` and the main class of `bootRun` to `core/build/pdev/main.txt`; DevTools is on that classpath, since the Spring Boot plugin leaves `developmentOnly` out of `productionRuntimeClasspath` only [Source: docs.spring.io/spring-boot/gradle-plugin/reacting.html, read 21 Oct 2026]. `run.sh migrate` runs `./gradlew --init-script <it> :core:classes :core:pdevClasspath`, then `exec java -cp <classpath> <main>`, the migration job of the stack's profiles. `run.sh dev` makes the same Gradle call, starts `./gradlew -t :core:classes` in the background, Gradle's continuous build, and ends with `exec java -Xmx768m -cp <classpath> <main>`: one Gradle daemon serves both, and DevTools restarts the core when its classes change.

- [ ] **Step 1: Read the pins.** Each image digest with `docker buildx imagetools inspect <image>:<tag>` (the index digest, which serves x86_64 and ARM); the command-line tools' build number from Google's repository index; a tag that does not exist stops the step with the error line. Then `docker run --rm <the docker-cli pin> sh -c 'docker buildx version && docker compose version'` prints both versions; a missing plugin stops the step, since the pack's builder needs buildx and the watchdogs and the back end's runner take Compose from this image.
- [ ] **Step 2: Write** the files, and the `memswap_limit` lines of the two stack files.
- [ ] **Step 3: Validate.** From `~/projects/metis`: `python3 ~/projects/pdev/plugins/pdev-remote/scripts/remote.py validate --manifest metis-infra/remote/remote.json`. Expected: `remote validate: ok`.
- [ ] **Step 4: Merge check.** `docker compose -f metis-backend/stack/compose.yaml -f metis-backend/stack/compose.demo.yaml -f metis-infra/remote/compose.dev.yaml config --format json` with `PDEV_PROJECT=metis`, `PDEV_CPUSET=0`, `PDEV_WS`, `PDEV_HOME`, the two `PDEV_IMAGE_` names and the four passwords set to placeholder values in its environment. Expected, read by a short Python check: no `build` under `core`; every service with `cpuset` `0`, a `memswap_limit` equal to its `mem_limit` and the label `dev.pdev.project=metis`; the memory of `postgres`, `keycloak` and `relay` the stack's own; every published port on `127.0.0.1`; every bind mount's source under `PDEV_WS` or `PDEV_HOME/cache`.
- [ ] **Step 5: Run** `sh -n` on each script. Expected: no output.
- [ ] **Step 6: Ledger:** append the created paths to `changed-files-metis-infra.txt` and the two stack files to `changed-files-metis-backend.txt`.

### Task 2: The project layer, the first contact and setup (VPS)

**Files:** none in a repository; outside, `~/projects/metis/.claude/` and `.work/remote/`.

- [ ] **Step 1: Preconditions.** Copy the summary lines of the pack plan's Task 11 into As executed; without them, stop.
- [ ] **Step 2: The layer.** In `~/projects/metis`, in a session started with `--plugin-dir` for the checkout's `plugins/pdev-core` and `plugins/pdev-remote` (init copies the launcher from the core that runs it, and the installed core, 0.3.20, has no pack fall-through), run block 1 of `/pdev-core:init` with the argument `remote`; its block 2 (installs, browser servers, `deps --install`) waits for the owner's release. Expected: `bash .claude/pdev/bin/pdev resolve --names` prints `pdev-remote`, and `bash .claude/pdev/bin/pdev remote validate --manifest metis-infra/remote/remote.json` prints `remote validate: ok`.
- [ ] **Step 3: Owned names and the inventory before** anything of Metis lands: `bash .claude/pdev/bin/pdev remote probe inventory --host root@ai-initiatives.tail8a0f4a.ts.net --manifest metis-infra/remote/remote.json --out .work/remote/inventory-before.json`. Expected: `probe inventory: written`, and its `project` item holds no object of Metis's label and none of the owned names (`metis-check`, `metis-core:check`, `metis-trivy-cache`, `metis-check-fuzz`), each read by its exact name. An owned name that exists before Metis ever ran there belongs to the other work: the plan stops with the name, for the owner.
- [ ] **Step 4: fswatch.** `command -v fswatch` prints nothing (the line that shows it missing); `brew install fswatch`, logged in As executed.
- [ ] **Step 5: Setup.** `bash .claude/pdev/bin/pdev remote setup root@ai-initiatives.tail8a0f4a.ts.net --manifest metis-infra/remote/remote.json`. Expected: `share: processors 0 of 3`, a memory reserve of 2.9 GiB, a disk reserve of 20.2 GiB, the four images built (each time recorded), `remote setup: ready`. A free disk short of 60.3 GiB stops it with the three figures before anything is written; a busy forward port or a digest without x86_64 stops it with the pack's line; the digest is fixed in the file that pins it, a short disk or a busy port goes to the owner.
- [ ] **Step 6: Share.** `bash .claude/pdev/bin/pdev remote probe share --stress`. Expected: the workspace container on `0`, `memory.max` 536870912, `memory.swap.max` 0, the load and memory lines passing, `probe share: PASS`.

### Task 3: The dev loop, the sync and the forwards (VPS)

- [ ] **Step 1:** `bash .claude/pdev/bin/pdev remote up --env EXPO_PUBLIC_MOCKS=1`. Expected: the three URLs, no guard line; the memory of Metis's containers recorded from `pdev remote probe share`.
- [ ] **Step 2: Screen 24 from the mock server.** On the Mac, `pnpm -C metis-app exec playwright screenshot` of `http://localhost:8081/w/creative-studio/projects/meridian-cgi-campaign/overview`, waiting for `project-header`, to `.work/remote/screen24-mock.png`.
- [ ] **Step 3: An edit.** Change one string screen 24 shows in a `src/**/strings/en.ts` file, save, poll the page until it shows it; record the seconds; revert, and the old text comes back.
- [ ] **Step 4: The real core.** `pdev remote down`, `pdev remote up`; screen 24 shows the demo data of the core through the relay (`screen24-core.png`); the same page at `http://127.0.0.1:8081` shows the unavailable state, recorded as expected.
- [ ] **Step 5:** `pdev remote probe sync`, `pdev remote probe forward`, `pdev remote probe share --stress`. Expected: three PASS lines; the sync seconds recorded.

### Task 4: DevTools, the back end's own containers and the generators (VPS)

**Files:** Modify `metis-backend/core/build.gradle.kts` (after line 41); `metis-backend/build.gradle.kts` (`scanner()`, lines 42 to 53, and `imageLint`, lines 89 to 101); `tools/src/main/java/dev/metis/tools/contract/Contract.java` (the oasdiff launch, from line 136); `tools/src/main/java/dev/metis/tools/image/Fuzz.java` (the launch, lines 57 to 74); `core/src/integrationTest/java/dev/metis/core/Stack.java` (`confine`, lines 71 to 81); the image check's `tools/src/main/java/dev/metis/tools/image/Pins.java` (beside the memory rule, lines 54 and 68) and `tools/src/main/java/dev/metis/tools/canary/ImageCanaries.java` (beside lines 128 to 133); and their tests. The generator writes `core/gradle.lockfile` and `gradle/verification-metadata.xml`.

- [ ] **Step 1: Edit** on the Mac: `developmentOnly(platform(libs.spring.boot.bom))` and `developmentOnly("org.springframework.boot:spring-boot-devtools")` under one comment line that says why (the dev service restarts the core when its classes change; the image never holds DevTools).
- [ ] **Step 2: The locks.** With the dev loop up: `pdev remote gen backend --refresh-dependencies --write-locks --write-verification-metadata sha256 --rerun-tasks help spotlessCheck :core:checkLicense` (the command of metis-backend `AGENTS.md`, line 77). Expected: the dev loop paused and resumed, the relay answering again at `http://localhost:8090` once resumed (it finds the core once, at its start, so it answers only when it started after the core), `wrote` lines for the locks and the checksums only, exit 0.
- [ ] **Step 3: The back end's own containers, test first,** before any back-end check that starts a container runs on the VPS. Tests first: in `core/src/integrationTest`, a test of `Stack.confine` (given `PDEV_PROJECT` and `PDEV_RUN`, the container it confines carries `dev.pdev.project` and `dev.pdev.run` with their values; given neither, no such label; its swap limit equals its memory limit); in the tool's tests (`FuzzTest`, `ContractBaseTest`, and one that reads the two launchers of `build.gradle.kts`), that every `docker run` of `scanner()`, `imageLint`, `Contract.java` and `Fuzz.java` carries `--memory-swap` equal to its `--memory`, and the two labels when `PDEV_PROJECT` and `PDEV_RUN` are set. Run both red: `pdev remote check backend-gradle :tools:test` and `pdev remote check backend-stack :core:integrationTest --tests <the confine test>`; the confine test must fail on its own assertions, the labels and the swap, while a database that does not start is the Testcontainers question of the design and stops the plan with its first error, for the owner. The red run's database carries no label yet; the test JVM's shutdown hook removes it (Global Constraints). Then the four launchers and `confine` changed, and both runs again. Expected: green.
- [ ] **Step 4: The checks it touches.** `pdev remote check backend-stack checkFormat checkCompile checkDeadcode checkDeps` (`checkDeps` starts the vulnerability scanner). Expected: green. A red `checkDeadcode` or `checkDeps` caused by DevTools stops the plan with the evidence: the design's statement that DevTools passes like any other dependency is then wrong, and the owner decides.
- [ ] **Step 5: A Java edit.** `pdev remote up`; change one string of an answer of the core in a Java file, save on the Mac, poll the answer through the relay until it changes; record the seconds and that the command log holds no `docker build` in between; revert, and the old answer comes back.
- [ ] **Step 6: Write-back.** Change the summary of one metis-docs page on the Mac and run `pdev remote gen docs`; while it runs, edit `metis-docs/llms.txt` on the Mac. Expected: exit 3 naming `metis-docs/llms.txt`, nothing copied. Restore that edit and run it again: `wrote metis-docs/llms.txt`. Revert the summary, run it once more, and `llms.txt` holds its bytes from before the step.
- [ ] **Step 7: No swap in the image check, test first.** Add to the image check the rule that every service of the two compose files of `stack/` carries a `memswap_limit` equal to its `mem_limit` (in `Pins.java`, beside the memory rule), with its counter-test beside the existing ones for `cpuset` and `mem_limit` (`ImageCanaries.java`), a service whose `memswap_limit` line is removed, and its row in `Implementations.java` if the check's files change; run the counter-test red first (`pdev remote check backend-canary <its name>`: the stack holds the lines since Task 1, and no rule catches their removal yet), then the rule. Then `pdev remote check backend-stack checkImage checkTooling` and `pdev remote check backend-canary changed`. Expected: green, and the new counter-test red on its planted file.
- [ ] **Step 8: Ledger:** append every back-end path of this task (and any other lock the generator wrote) to `changed-files-metis-backend.txt`.

### Task 5: The checks, the runs and the watchdog (VPS)

- [ ] **Step 1: Testcontainers in full.** `pdev remote check backend-stack :core:integrationTest`. Expected: green, which proves the host network and `TESTCONTAINERS_HOST_OVERRIDE=localhost` with Ryuk off. Red stops the plan with the first failing test's error, for the owner.
- [ ] **Step 2: The Mac's load.** Take the shared lock `.work/heavy.lock` of the work folder. When `docker ps -q` on the Mac lists no container, stop Docker Desktop (`docker desktop stop`) for Step 3 and start it after; when any container runs (another project's work), leave Docker Desktop running and record instead that the Mac ran no Metis container and the CPU of Docker's virtual machine during the run. Either way record `sysctl -n vm.loadavg` every minute to `.work/remote/mac-load.txt` while Step 3 runs.
- [ ] **Step 3: `./verify` in full.** First the stamp of `metis-backend`, the one `Git.java` writes (lines 46 to 75): one `node --input-type=module` call that imports `treeOf` from `metis-app/scripts/tree.mjs` and prints its value for `metis-backend`, with git run in that repository. Then `pdev remote check backend-verify`. During the run: save a change to a back-end source on the Mac (reverted after the run); `pdev remote check app-verify --no-wait` exits 75 naming the holder; `pdev remote probe inventory --out .work/remote/inventory-verify.json`, then `pdev remote probe inventory --compare .work/remote/inventory-before.json .work/remote/inventory-verify.json`, whose `listeners` item reads `same`; end the local process, then `pdev remote status` lists the run and `pdev remote attach <id>` follows it to its end. Expected: exit 0, `metis-backend/reports/verify.json` back on the Mac, every row's tree equal to the stamp taken before the run, the secrets row green. While the image check builds the core, `pdev remote probe share` lists the builder's container `buildx_buildkit_pdev-metis-builder0` on the share's cpuset, with `builder_memory` as its memory and no swap, and no other build container of Metis.
- [ ] **Step 4: `pnpm verify`.** `pdev remote check app-verify`. Expected: exit 0, `gate:native` `skipped (macOS only)`. Then on the Mac `NATIVE_DIR=$HOME/projects/metis/.work/native/apps/metis pnpm -C metis-app verify --only native --append`. Expected: `reports/verify.md` reads `All rows on one tree: yes` and the native row is green.
- [ ] **Step 5: The watchdog.** `pdev remote check backend-verify --only lint`; while it runs, write a memory figure above the VPS's available memory into its `~/.pdev-remote/metis/control/<id>/watchdog.conf` with one `ssh` that runs `printf` there, no Docker command. Expected: the run stops within 15 s, `stopped by the watchdog: memory ...`, the dev loop stays paused, and `pdev remote status` prints the reason. Then set `share.memory_reserve` in the Mac's copy of the manifest above the VPS's available share and run `pdev remote check backend-verify --only lint --no-wait`. Expected: exit 75 naming the reserve. Revert the manifest. Then `pdev remote up`, which prints the reason and brings the loop back, and the same raise in the dev watchdog's `~/.pdev-remote/metis/control/dev/watchdog.conf`. Expected: the dev loop's containers stop within 15 s, `pdev remote status` prints the reason, and the next `up` brings the loop back. None of these probes takes memory from the other work.

### Task 6: Android (VPS)

- [ ] **Step 1:** `pdev remote check android-build`, with the emulator down. Expected: exit 0 and the APK in the VPS's cache; the time recorded.
- [ ] **Step 2:** `pdev remote up --android --no-dev`. Expected: `emulator -accel-check` reports KVM usable and the boot ends within 600 s. Without KVM the plan records the output and stops this task: the VPS cannot run Android. With the emulator up, `pdev remote probe inventory --out .work/remote/inventory-android.json`, then `--compare` with `.work/remote/inventory-before.json`: its `listeners` item reads `same`.
- [ ] **Step 3:** `pdev remote check android-flows`. Expected: the two flows of `FLOWS` pass, `reports/native-android/maestro.xml` back on the Mac.
- [ ] **Step 4: Through the viewer's tunnel,** on the Mac: `ADB_SERVER_SOCKET=tcp:localhost:5038 /opt/homebrew/share/android-commandlinetools/platform-tools/adb exec-out screencap -p > .work/remote/android.png` (the Mac's adb 37.0.1, the image's version). Expected: a picture of screen 24. scrcpy, the live view on the same tunnel, stays optional.
- [ ] **Step 5:** `pdev remote down`.

### Task 7: iOS on the Mac against the VPS

- [ ] **Step 1:** `pdev remote up --env EXPO_PUBLIC_MOCKS=1`.
- [ ] **Step 2:** On the Mac, build the Debug app once with Xcode in the native build folder (`NATIVE_DIR`), install it on `iPhone 18 Pro` and open it. Expected: screen 24 from the VPS's Metro, `xcrun simctl io booted screenshot .work/remote/ios.png`.
- [ ] **Step 3:** Change one string screen 24 shows; expected on the simulator with no Xcode build, the seconds recorded; revert; shut the simulator down.

### Task 8: The full runs (VPS)

- [ ] **Step 1:** One after another: `pdev remote check backend-canary all`, `pdev remote check app-mutation-full`, `pdev remote check app-canary all`. Each may leave the connection; `pdev remote attach <id>` collects it. Record each start, end, exit and the memory of Metis's containers each minute (`pdev remote probe share`). Expected: each exits 0 and its records are back on the Mac; a run past 8 hours is flagged for the owner.

### Task 9: The owner's other Mac (waits for the release)

- [ ] **Step 1:** After the owner's release of pdev-core 0.3.22 and pdev-remote 0.1.0, on the other Mac: `/plugin marketplace update pdev`, `/pdev-core:init remote` (both blocks), `/pdev-remote:remote-setup root@ai-initiatives.tail8a0f4a.ts.net`, then `bash .claude/pdev/bin/pdev remote check app-gate lint`. Expected: setup ready with no manifest edit, the gate green. Before the release this task is `NOT RUN`: the release waits for the owner's word.

### Task 10: Purge, the inventory after, setup again (VPS)

- [ ] **Step 1:** `pdev remote down`, then `pdev remote purge --yes`. Expected: `purge: no labeled object left`.
- [ ] **Step 2:** `pdev remote probe inventory --out .work/remote/inventory-after.json`, then `pdev remote probe inventory --compare .work/remote/inventory-before.json .work/remote/inventory-after.json`. Expected: packages, accounts, units and listeners `same`; `/etc` `same`, or only paths the system rewrote by itself, each named. The Docker counts are recorded: `purge` removed Metis's labeled objects and the `owned` ones (`metis-check`, `metis-core:check`, `metis-trivy-cache`, `metis-check-fuzz`); what remains of Metis is the public images its checks pulled by digest, which other work may share, so the plan leaves them and names them for the owner from the repositories' pins.
- [ ] **Step 3:** Setup again with the same command as Task 2, so Metis stays on the VPS; the time recorded.

### Task 11: Pages and notes as built (Mac)

**Files:** Modify, in metis-docs, [GitHub's CI runs the checks, a sandbox CI the full runs](../architecture/decisions/where-checks-run.md) (the sandbox is a Docker host through the pack; the full runs start by command at any hour), [Checks must not overload the machine](../architecture/decisions/resource-caps.md) (the rule on a host: half the processors, every container's limit with no swap, the reserves of 25% of the memory and 15% of the disk, Metis's 40 GB), [The development network on HostHatch](../architecture/decisions/development-on-hosthatch.md) and [Environments](../operations/environments.md) (a Docker host runs Metis's dev loop and checks, with synthetic data only), [Develop the app](../components/app/develop.md) (Run it and Gates: `pdev remote up`, the checks by name, `gate:native` on a Mac), [Develop the core](../components/core/develop.md) (the local stack and where the checks run: the dev service with DevTools, the generators, a new migration needing `pdev remote down` and `up`), [Develop the infrastructure](../components/infra/develop.md) (the first code, `remote/`), and this page's As executed; `AGENTS.md` of metis-app, metis-backend and metis-infra and `metis-infra/README.md` (heavy runs and generators through `pdev remote`, by name); outside the repositories, `~/projects/metis/CLAUDE.md` (the VPS, the commands, the rules of this plan).

- [ ] **Step 1: Write** the changes, each page as built, with the figures of As executed.
- [ ] **Step 2: Check.** In metis-docs, `node tools/generate.mjs` then `node tools/check.mjs`. Expected: `check: clean (<n> pages, <m> files)`. In metis-backend, `pdev remote check backend-gradle checkFormat`. Expected: green.
- [ ] **Step 3: Ledger:** append the paths to the files of metis-docs, metis-app, metis-backend and metis-infra.

## Self-review

- The design's acceptance items: 1 is Tasks 2 to 6, 9 and 10 (the pack's items, measured by its probes: inventory 2 and 10, its listeners also 5 and 6, sync 3, share 2 and 3, watchdog 5, labels 10, forwards 3, runs 5, write-back 4, Android 6, a second machine 9); 2 is Task 3; 3 Task 4; 4 Task 5; 5 Task 8; 6 Task 6; 7 Task 7; 8 Task 5; 9 Task 9.
- The design's pages and files: Task 11. What Metis brings: Task 1, with the generators and the checks of the table above, and Task 4 for the back end's own containers.
- The values are the design's (share, reserves, forwards, packages of the emulator) or read from the repositories and the Mac, each named with its file.

## Estimate

| Tasks | Where | Done by |
|---|---|---|
| 1 | the Mac, beside the pack's plan | 23 Oct 2026 |
| 2, 3, 4 | the VPS, once 65 GB are free | 24 Oct 2026 |
| 5 | the VPS | 25 Oct 2026 |
| 6, 7 | the VPS and the Mac | 25 Oct 2026 |
| 8 | the VPS, overnight | 26 Oct 2026 |
| 10, 11 | the VPS, then the Mac | 26 Oct 2026 |
| 9 | the other Mac | after the owner's release |

## As executed

Empty until the plan runs.

## Review round one

The coordinator's rulings of 22 Oct 2026 on the architecture, code and security reviews, as applied here; the task numbers are the new ones.

1. Ryuk off: `TESTCONTAINERS_RYUK_DISABLED=true` in every back-end check and generator command (Global Constraints, the checks table, the generators); `Stack.confine` labels from `PDEV_PROJECT` and `PDEV_RUN`, with a test (Task 4, Step 3); the listeners compared with the inventory before setup during `./verify` (Task 5, Step 3) and the emulator session (Task 6, Step 2); the manifest's values no longer leave the test containers to Testcontainers' cleanup.
2. `--memory-swap` equal to `--memory` and the two labels on `scanner()`, `imageLint`, `Contract.java` and `Fuzz.java`, asserted by tests of the tool (Task 4, Step 3); `metis-check-fuzz` in `owned.containers`; each owned name read by its exact name before setup, the plan stopping for the owner when one exists (Task 2, Step 3).
3. Write-back and outputs are the pack's mechanism; Task 4, Step 6 holds as it was.
4. `entrypoint.sh` begins with `[ "$#" -gt 0 ] && exec "$@"` (Task 1).
5. Watchdog targets are the pack's; Task 5, Step 5 now expects the loop to stay down after a reserve stop until `up`, and writes the watchdog files of `control/<id>/`.
6. The forwards' own control socket is the pack's.
7. The relay answering after the resume of Task 4, Step 2 shows it started after the core.
8. The stale lock is the pack's.
9. `backend-stack` (heavy, Docker, host network) for Gradle tasks that start containers, `backend-gradle` light (the checks table); Task 4, Steps 3, 4 and 7 and Task 5, Step 1 call `backend-stack`.
10. The run copy is the pack's.
11. The Python floor is the pack's.
12. The exit codes are the pack's.
13. The acceptance helper task removed (it was Task 2): its steps call `pdev remote probe inventory|sync|share|forward` (Tasks 2, 3, 5, 6, 8, 10), and the stamp is one `node --input-type=module` call of `treeOf` (Task 5, Step 3); the tasks renumbered, 12 to 11, every cross-reference with them.
14. The disk maximum is the pack's; the free-disk gate is `setup`'s own refusal before it writes anything (Global Constraints, Task 2, Step 5), so the step that read it with a typed command is gone.
15. The stack's `memswap_limit` lines written in Task 1; the image check's rule and its counter-test red first in Task 4, Step 7; the overlay sets memory only on `migrate`, `core` and `metro`, and the label as `dev.pdev.project=${PDEV_PROJECT:?}` (Task 1).
16. `cli_image` read from `pins.txt` with `{file, match}`; the single-use pins as `ARG` defaults of their Dockerfiles; `pins.txt` keeps the docker CLI image only; no separate Compose pin, Task 1, Step 1 proving the CLI image carries Compose (the manifest's values, Task 1).
17. The scaffolding branch is the pack's.
18. The watcher's rule is the pack's.
19. No `ssh ... docker` typed in this plan: free disk through `setup`, the inventory, shares and memory through the probes, the watchdog's figure written by a plain `ssh` running `printf` (Global Constraints; Tasks 2, 3, 5, 8, 10).
20. Memory samples through `pdev remote probe share` (Task 3, Step 1; Task 8).
21. The overlay mounts `${PDEV_WS}` and `${PDEV_HOME}/cache` only (Task 1); the secrets mounted into no container (Global Constraints); the watchdog files under `control/<id>/` (Task 5, Step 5).
22. The design's risk line now states the residual risk; this plan changes nothing for it.
