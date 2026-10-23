---
title: Development and checks on the VPS
summary: Proposal of 21 Oct 2026 for Metis to run its dev loop, its checks, its full runs and its Android emulator on a Docker host such as the VPS ai-initiatives, through the pdev remote pack, with everything it runs there and its share of the host coming from inside Metis, so that any VPS with SSH and Docker works the same.
component: all
type: proposal
status: draft
ids: []
---

# Development and checks on the VPS

Written on 21 Oct 2026 from a brainstorm with the owner, and approved by the owner the same day (answer, translated: "approved"). Nothing is built yet.

The mechanism is a new pdev pack, `pdev-remote`, designed for every project in the pdev repository, in the file `docs/superpowers/specs/2026-10-21-pdev-remote-design.md`. This page holds only what is Metis's: its decisions, its measures, the manifest and images Metis brings, the changes Metis makes to its own code and pages, and how Metis proves it works.

## The request

The owner's words, translated:

- "Every task of this project that runs in Docker makes the machine heavy. I want a mechanism that puts the code base on my Linux VPS, sets it up there and runs it in the VPS's Docker for testing instead of the Docker on the machine. We can call the app's URL on the VPS to test the web app, but how do we test iOS and Android? And how can any machine easily sync code from the local machine to the VPS: pull the code, write code and test what can be tested on the machine, then push to the VPS and run the full testing there to keep the machine light. Put simply, I need to run this app in the VPS's Docker while I can code on any of my Macs without setting up the code base again; the Mac I use can help with testing, but the app must be deployed and run in the VPS's Docker to take the load off the Mac."
- "When I change code on the local machine, how does the code on the VPS and in the container follow? Surely I do not pull GitHub on the VPS, move it into the container and rebuild the app after every change?"

## Owner decisions

| Decision | The owner's words, translated | Date |
|---|---|---|
| Metis's heavy work runs on the VPS `ai-initiatives` after the owner frees disk space on it, rather than on an upgraded VPS or a second one | "I will clean up this VPS." | 21 Oct 2026 |
| The mechanism is part of pdev, a new pack for any machine and any project; Metis only brings its own part | "Everything we build must be part of pdev, maybe a new pdev package; set it up on any machine, any project, and it runs at once, no detours." | 21 Oct 2026 |
| The VPS's other work always keeps resources | "Always make sure the VPS still has resources left, because it does other work too." | 21 Oct 2026 |
| Nothing is set up on the VPS: what Metis runs there, and its limits, come from inside Metis, so any VPS works the same | "These designs must come from inside the app itself, with nothing to set up on the VPS; make sure that setting it up on any VPS works the same way." | 21 Oct 2026 |

## Metis's share of any host

Metis works its share out from the host it lands on, with the rule its back end already applies to every container of its checks ([Checks must not overload the machine](../architecture/decisions/resource-caps.md)), extended to everything Metis runs on a host:

| Resource | Metis's rule, on any host | On the VPS `ai-initiatives` |
|---|---|---|
| Processors | The first half of the host's processors, rounded down, at least one: every Metis container keeps to them | Core 0 for Metis; cores 1 and 2 always free for the other work |
| Memory | Every Metis container has a limit and no swap; a heavy run starts only, and goes on only, while the host keeps a quarter of its memory available | Metis stops itself before the host's available memory falls under 2.9 GiB |
| Disk | Metis starts nothing that writes while the host has less than 15% free, and keeps its own images, volumes and copies under 40 GB | Metis stops itself before free space falls under 20 GB |

- No setting on the VPS holds these limits: Docker's own options on each container do (`--cpuset-cpus`, `--memory`, and `--memory-swap` equal to `--memory` so that "the container doesn't have access to swap" [Source: docs.docker.com/engine/containers/resource_constraints/, read 21 Oct 2026]), and the pack's watchdog stops Metis's heavy run when the host's memory or disk runs short.
- On a larger VPS the same rule gives Metis more, with no change: half of 8 processors is 4.
- On this VPS Metis gets one core, so the full runs take longer than on the Mac. Measured at acceptance; past 8 hours a run is the sign to move Metis to a larger VPS, by changing one value on each Mac.

## Settled by the coordinator

- **Every run in its own copy.** A check runs in a copy of the workspace taken right after the sync, so `reports/verify.json` stamps one tree for every row, and the counter-tests, which copy the live tree, copy a still one.
- **Heavy runs pause the dev loop.** A full `./verify`, `pnpm verify`, every counter-test run and every Gradle task that starts containers (the image check, the integration tests, the scanners) take the host's lock and stop Metis's dev loop (the stack, Metro, the emulator) until they end; the loop comes back through Compose, the relay after the core. The dev loop's declared memory limits come to 6,720 MiB while it runs (the stack's PostgreSQL, Keycloak and relay, the core's development service with Gradle's daemon, and Metro), and a full `./verify` peaked at 1,359 MiB of JVMs and 1,773 MiB of containers ([Fast checks](2026-10-16-fast-checks.md)): together they do not fit beside the VPS's other work.
- **Generators write back.** The commands that rewrite tracked files run on the host and copy what they changed into the Mac's tree, refusing a file edited on the Mac meanwhile: in `metis-backend` the contract, the demo answers, the migration lock, the pinned copies of the docs and of the app, the dependency locks and the formatter; in `metis-app` `pnpm gen:tokens` and the mock answers; in `metis-docs` `node tools/generate.mjs`. A Mac then needs no JDK to finish a back-end change.
- **Only Metis's own objects.** Every container, image, volume and network the pack creates for Metis carries Metis's label; the containers the back end's checks start themselves (the integration tests' databases, the scanners, the contract's `oasdiff`, the fuzzer) carry Metis's label and the run's, from the pack's `PDEV_PROJECT` and `PDEV_RUN`, so the pack removes them when the run ends; the few objects the back end's own checks create under their own names (the compose project `metis-check`, the image `metis-core:check`, the volume `metis-trivy-cache`, the container `metis-check-fuzz`) are listed by exact name in the manifest, and each is read on a host before Metis first runs there: one that exists belongs to other work and stops the setup for the owner. Nothing else is listed, stopped or removed, no Docker command is typed for the host by hand, and one command removes all of Metis from a host but the public images its checks pulled, which other work may share.
- **Builds stay inside the share.** Every image build, the pack's and the image check's alike, runs on Metis's own BuildKit builder, created with the share's processors and memory and no swap; and every Metis container keeps from swap, the back end's own included, which takes a `memswap_limit` on the services of `stack/`, the same in the integration tests' containers and in the containers the back end's checks start with `docker run`, with the image check and the tool's tests requiring it.
- **The native gate stays on a Mac that has its tools.** It builds a Release app with Xcode and CocoaPods on every run and drives the iPhone simulator with Maestro, which needs a JDK. Those tools are optional on a Mac: a Mac without them records the gate as not run there, and a pull request of the app waits for a Mac that has them, as the rule that macOS work runs on a Mac already says.
- **Spring Boot DevTools for the back end's development loop**, in the configuration `developmentOnly`, so the image and the checks do not change (section on the back end).

## Measured on 21 Oct 2026

The VPS, read with read-only commands over Tailscale SSH as `root`; nothing was installed or changed:

| Item | Measure |
|---|---|
| System | Ubuntu 26.04 LTS, kernel 7.0, x86_64, a guest of KVM |
| Processor | 3 virtual cores of an AMD Ryzen 9 9950X |
| Virtualization inside the guest | `/dev/kvm` present, `kvm_amd` loaded, AMD-V exposed |
| Memory | 11.7 GiB, 7.4 GiB available, 4 GiB of the other work in swap (10 GiB of swap) |
| Disk | 135 GB, 25 GB free (82% used) |
| Docker's own report | images 44.2 GB, of which 34.4 GB reclaimable; build cache 18 GB, of which 4 GB reclaimable |
| Docker | 29.1.3 from Ubuntu's packages, Compose 2.40.3, cgroup v2 |
| Other work | 21 running containers, load average 0.21 |
| Accounts | `root` only |
| From the Mac | 46 to 53 ms over Tailscale, on a direct path |

What Metis takes, measured on the Mac (Apple M4, 10 cores, 24 GiB): the back end's Gradle home 6.0 GB, `metis-app/node_modules` 0.7 GB, Playwright's browsers 2.9 GB, the Android SDK 11 GB and three emulators 7.1 GB. Without their ignored files the four repositories hold 1,318 files and 41.5 MB, and their `.git` folders 33 MB together.

Estimated for a host, not measured: 30 to 35 GB for Metis with one emulator. Hence the cleanup target of 65 GB free on this VPS and Metis's own disk ceiling of 40 GB.

## What Metis brings

All of it committed in `metis-infra/remote/`, the first code of `metis-infra`, so that every Mac has it after a clone and any host runs it the same way:

| Part | Metis's choice |
|---|---|
| The manifest | the four repositories side by side, the share rule above, the images, the dev loop, the forwards, the checks, the generators, Android |
| The workspace image | rsync and git, for the receiving end of the sync and its deletion pass |
| The app's runner image | Playwright's own image at the version the app's lockfile pins, with the Node and pnpm versions the app pins |
| The back end's runner image | Amazon Corretto 25, as GitHub's runner uses, with Docker's command line and Compose; it reaches the containers its tests start through the host's Docker socket |
| The emulator image | the Android SDK packages of the Macs' native setup (an x86_64 system image of API 35, the platforms and build tools 35 and 36, `ndk;27.1.12297006`, `cmake;3.22.1`) and Maestro |
| The dev loop | the stack of `metis-backend/stack/compose.yaml` with `compose.demo.yaml`, the core's development service, and Metro in a container (`EXPO_PUBLIC_MOCKS=1` for the mock server, `EXPO_PUBLIC_API_BASE=http://localhost:8090` for the real back end); the overlay sets memory only where it differs from the stack, takes Metis's label from the pack, and mounts only the workspace and the shared cache |
| Forwards | the Mac's `localhost` 8081 (Metro), 8090 (the relay) and 8080 (the core) to the same ports of the host's loopback |
| Heavy checks | `pnpm verify`, `pnpm canary`, the full mutation run of the app, `./verify`, `./verify --fast`, `./canary changed`, `./canary all`, and any Gradle task that starts containers; each brings `reports/` back |
| Light checks | one gate, one test file, a Gradle task that starts no container: a run copy, no lock |
| Android | one AVD of a phone profile, `adb reverse` of 8081 and 8090, the Maestro flows of `e2e/native` by command |

Every version inside an image comes from the repositories' own pins, never typed a second time; a version no repository pins and only one Dockerfile uses is written once, as a default of that Dockerfile. The ports keep the relay's rule as it is: the host `localhost` or `127.0.0.1`, and cross-origin calls from `http://localhost:8081` only.

The back end's tests publish their containers on `127.0.0.1`, a fix measured on macOS. From a runner container, Testcontainers uses "the default gateway's IP" in place of localhost [Source: java.testcontainers.org/supported_docker_environment/continuous_integration/dind_patterns/, read 21 Oct 2026], which does not reach `127.0.0.1`. The back end's runner therefore shares the host's network and sets `TESTCONTAINERS_HOST_OVERRIDE` to `localhost` [Unverified - confirm before applying]; acceptance item 4 proves it.

Testcontainers' Ryuk, the container it starts to clean up the others, holds the Docker socket and publishes its port on every address of the machine, which no setting of Testcontainers changes (the back end's own record, `metis-backend/reports/review/review.md`, item 6); on a host that would put a socket-holding service on the VPS's other addresses. So the back end's checks and generators run there with `TESTCONTAINERS_RYUK_DISABLED=true`, and `Stack.confine` labels every container the tests start with Metis's label and the run's, from `PDEV_PROJECT` and `PDEV_RUN` when they are set (nothing on a Mac). With Ryuk off, the test JVM removes its containers from a shutdown hook (read in `testcontainers-2.0.5.jar` with `javap` on 22 Oct 2026); a JVM killed outright leaves them, and the pack removes every container of the run's label when the run ends or its watchdog stops it. The acceptance compares the VPS's listeners outside loopback during a back-end run and during the emulator session with the inventory taken before setup: no new one.

## The back end's development loop

- Today the core runs only from its image, so a Java change means `docker compose up --build`.
- A development service, in a compose file of its own, runs the core from Gradle with the workspace mounted. `./gradlew -t` rebuilds when a source changes: "Continuous Build allows you to automatically re-execute the requested tasks when file inputs change" [Source: docs.gradle.org/current/userguide/continuous_builds.html, read 21 Oct 2026]. Spring Boot DevTools restarts the application "whenever files on the classpath change", typically much faster than a cold start [Source: docs.spring.io/spring-boot/reference/using/devtools.html, read 21 Oct 2026].
- DevTools is "automatically disabled when running a fully packaged application", and repackaged archives do not contain it [same source]: the image is still built from sources for the checks and the demo.
- DevTools passes the back end's dependency and licence checks like any other dependency.

## iOS

The Mac builds the iOS app with Xcode once and again only when the native configuration changes; the debug app loads its code from `http://localhost:8081` and its data from `http://localhost:8090`, both forwarded to the host. Xcode installs only on macOS [Source: developer.apple.com/xcode/system-requirements, read 21 Oct 2026]. The native gate is in the settled section above. What the Mac still carries: the simulator, which peaked at 670% of one core and cannot be capped, an Xcode build when the native configuration changes or the native gate runs, the editor, the agents and the light checks the owner chooses to run locally.

## Pages and files updated as built

- [GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record](../architecture/decisions/where-checks-run.md): the sandbox is a Docker host through the pack, and the full runs start by command, at any hour.
- [Checks must not overload the machine](../architecture/decisions/resource-caps.md): the rule extended to everything Metis runs on a host, with the memory and disk reserves the host keeps.
- [The development network on HostHatch, with synthetic data only](../architecture/decisions/development-on-hosthatch.md) and [Environments](../operations/environments.md): a Docker host runs Metis's dev loop and checks, with synthetic data only.
- The develop pages of the app, the core and the infrastructure, and the `AGENTS.md` of each code repository: heavy runs and generators go through `pdev remote`.
- The folder notes on each Mac, outside the repositories.

## Acceptance on Metis

Each item is a check a machine runs:

1. The pack's own acceptance (its design, section Success looks like) passes with Metis's four repositories on the VPS, measured by the pack's probes: the inventory of the VPS unchanged included, and no listener outside loopback added during a back-end run or the emulator session.
2. The Mac's browser at `http://localhost:8081` shows screen 24 from the mock server, then from the real core through the relay; an edit saved on the Mac shows there within the measured time, with no build.
3. A change to a Java file saved on the Mac changes an answer of the core on the VPS within the measured time, with no image build.
4. `./verify` in full is green on the VPS with its tree stamp equal to the Mac's; `pnpm verify` is green with `gate:native` as `skipped (macOS only)`, then the Mac's native row joins the same record with `pnpm verify --only native --append`.
5. One `./canary all` and one full mutation run of the app with `pnpm canary all` end on the VPS; their times are recorded.
6. `emulator -accel-check` reports KVM usable on the VPS; the app built there opens in the emulator; a screenshot is taken through the viewer on the Mac; the Maestro flows pass.
7. The iPhone simulator on the Mac shows screen 24 with code from Metro on the VPS, and an edit shows there with no Xcode build.
8. During a full `./verify` on the VPS, Docker Desktop is stopped and the Mac's load is recorded.
9. The owner's other Mac joins with one setup command and runs one check.

## Risks for Metis

- **A shared Docker daemon, and the risk that remains.** Metis's containers run beside the VPS's other work on one Docker daemon, logged in as `root`. The checks given the Docker socket (the back end's `./verify`, its counter-tests and its Gradle checks) run the Gradle build, its dependencies and the images its tests pull with root's power over the whole VPS, and a container on the host's network reaches the other work's services on the loopback. Today's back-end code touches only its own names (measured by the security review of 22 Oct 2026). In place: pinned, checksummed dependencies (the dependency locks and `gradle/verification-metadata.xml`); Ryuk off; Metis's labels on every container it starts; the watchdogs; narrow mounts (a check sees its run copy and the shared cache, never the dev secrets or the files a watchdog obeys); the limits; and the refusal of any hand-typed Docker command for the VPS. Metis is not separated from the other work by an account of its own, which would be a setup on the VPS. A Docker API proxy per run, admitting only Metis's labeled and owned objects, would remove this risk; it waits for the owner's decision.
- **x86_64.** The back end's image and its pinned digests were built on the Mac's ARM processor; a digest pinned to one architecture breaks the build on x86_64. The first `./verify` on the VPS shows it.
- **Testcontainers from a runner container**, in the section on what Metis brings.
- **Speed.** One core on this VPS: the full runs take longer, measured by acceptance item 5.

## Effort and dates

The pack and its core change take about two days, Metis's manifest, images and acceptance about one more, most of it waiting for the full runs on one core. If the owner approves both designs on 21 Oct 2026, Metis runs on the VPS on 24 or 25 Oct 2026, provided the disk is freed and the pdev release has the owner's word.

## The owner's steps

- Free at least 65 GB on the VPS.
- Give the word for the pdev release (a tag and a push), and commit Metis's changes, as always.

## Sources

- The brainstorm of 21 Oct 2026: the request and the decisions quoted above.
- The measures above: read-only commands on the VPS and on the Mac, 21 Oct 2026.
- The builder check of 21 Oct 2026, which read Metis's repositories and found the memory sum, the generators and the tools of the native gate.
- The external pages cited where they are used.
