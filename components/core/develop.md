---
title: Develop the core
summary: How to build, run and test the business core in metis-backend, the sixteen checks of ./verify with their measured durations, the counter-tests, the local stack with the demo and its relay, and the conventions.
component: core
type: how-to
status: current
ids: []
---

# Develop the core

`metis-backend` holds the core as plans one to four built it: one Gradle build with the project `core` (the Spring Boot application, with the modules `platform`, `workspace` and `delivery` and the two reads screen 24 of the app calls, `GET /workspaces/{workspaceId}/shell` and `GET /workspaces/{workspaceId}/projects/{projectId}/overview`, served from PostgreSQL behind a token), the project `tools` (the command-line tool of the checks), the included build `build-logic` (the convention plugin both projects apply), the contract `contract/openapi.json`, the image, the local stack with the demo data and the relay, and the byte copies of files of `metis-docs` and `metis-app` under `pinned/`. This page describes the tree that plan four and [Fast checks](../../proposals/2026-10-16-fast-checks.md) left, which `./verify` stamps `05ea5fdc36e4` and which is to be the first commit of `main`; none of it is committed yet.

Run every command from the root of a `metis-backend` clone; the paths on this page are relative to it. The design is [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md); [plan one](../../history/plans/2026-10-14-backend-foundation-plan.md), [plan two](../../history/plans/2026-10-14-backend-platform-plan.md), [plan three](../../history/plans/2026-10-14-backend-overview-plan.md) and [plan four](../../history/plans/2026-10-14-backend-delivery-plan.md) built it. The traps they measured are in [Troubleshoot the core](troubleshoot.md).

## What a machine needs

- Docker. The integration tests start PostgreSQL and Keycloak through Testcontainers, the image check builds and runs the image, and the tools that are not Gradle plugins (Trivy, gitleaks, hadolint, actionlint, Redocly CLI, oasdiff) run as images pinned by digest in `gradle/libs.versions.toml`, so none of them is installed.
- Any JDK from 17 on, found through `JAVA_HOME` or the path, to start Gradle 9.8.1. Gradle downloads Amazon Corretto 25 and runs its daemon and the build on it (`gradle/gradle-daemon-jvm.properties`).
- Nothing installed system-wide. On the owner's Mac, which has no `java` on its path, every shell that runs Gradle, `./verify` or `./canary` first runs `export GRADLE_USER_HOME=/Users/mrpo/projects/metis/.work/gradle JAVA_HOME=/opt/homebrew/opt/openjdk@21`: Homebrew's JDK 21 starts Gradle, and Gradle keeps its downloads in the work folder. Docker Desktop answers there and Testcontainers finds it with no setting; Colima stays stopped. A machine that runs Colima needs `DOCKER_HOST`, `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` and `TESTCONTAINERS_HOST_OVERRIDE`, and Colima started with a network address [Source: java.testcontainers.org/supported_docker_environment, read 14 Oct 2026, as section 9.1 of the design records it]; no plan ran on Colima.

## Commands

| Command | What it does |
|---|---|
| `./verify` | Runs every check in order, goes on after a red one, writes `reports/verify.json` and `reports/verify.md`, and exits 1 when a check is red |
| `./verify --fast` | Runs the fast group, the checks from format to unit, which CI runs on every push to `main` |
| `./verify --only lint,unit --append` | Reruns some checks and adds their rows to the record, under `Reruns` |
| `./canary all` | Runs every counter-test, each in a copy of the tree under `build/canary/` |
| `./canary lint-complexity` | Runs one counter-test |
| `./canary lint` | Runs every counter-test of one check, and records the check when each one caught |
| `./canary smoke` | Runs the first counter-test of every check, the smoke set, which proves the engine of the counter-tests with its own tests |
| `./canary changed` | Runs the counter-tests of the checks whose implementation changed since their record in `reports/canary.json`, and the smoke set when the engine changed; a check without a record is selected |
| `./canary changed --list` | Prints that selection and runs nothing |
| `./canary changed --base <ref>` | Selects from the paths changed since the commit, in place of the record |
| `./gradlew checkLint` | Runs one check, without the record; the checks are the tasks named `check` and a capital in `build.gradle.kts` |
| `./gradlew :core:test` | The tests of the core that need no container |
| `./gradlew :core:integrationTest` | The tests of the core on a real PostgreSQL and a real Keycloak |
| `./gradlew :tools:test` | The tests of the tool |
| `./gradlew :core:test -PtestSeed=<seed>` | Repeats the order of an earlier run: each test task prints `Test order seed <seed>: repeat it with -PtestSeed=<seed>` |
| `./gradlew checkMutation -Pmutate=<globs>` | Mutates only the classes the globs name; with `MUTATION_BASE=<git ref>` in the environment and no `-Pmutate`, the classes changed since that ref; with neither, every class |
| `docker build --file core/Dockerfile --tag metis-core:local .` | Builds the image from the sources, with Docker alone |
| `./gradlew writeContract` | Writes `contract/openapi.json` from what the core declares; the check `contract` fails while the file differs |
| `./gradlew writeDemo` | Writes the seed of the demo data, `stack/demo/afterMigrate__demo.sql`, from its builders in `core/src/testShared/java/dev/metis/core/demo/` |
| `./gradlew lockMigrations` | Adds a new migration to `config/migrations.lock`, which holds the hash of each one; a locked migration that changes turns the check `contract` red |
| `./gradlew pinDocs` and `./gradlew pinApp` | Copy again the files of `metis-docs` and `metis-app` that the checks read, from the clones beside this repository, under `pinned/docs/` and `pinned/app/`, and write their hashes into `docs.lock` and `app.lock` |
| `./gradlew --refresh-dependencies --write-locks --write-verification-metadata sha256 --rerun-tasks help spotlessCheck :core:checkLicense` | Writes the lock files and the checksums again after a change of the dependencies, with every task run for real |

`./verify` and `./canary` give Gradle half the cores as workers, or the fewer that `METIS_WORKERS` asks for, and run at the lowest priority (`nice -n 19`, and Gradle's `--priority=low`); the convention plugin caps the test forks and the threads of PIT at half the cores, or at the workers the build is given when they are fewer. On the owner's Mac, short of memory since 16 Oct 2026, every heavy run takes two: `METIS_WORKERS=2`, or `--max-workers=2` for a Gradle command. Every test JVM and every minion of PIT has a heap of 512 MiB, the integration tests 1 GiB, every command of the tool 512 MiB and the tool that `./verify` and `./canary` start 256 MiB. Every container a check starts keeps to `METIS_CPUSET`, the first half of the machine's processors, or all of Docker's when Docker's machine has fewer, which the root build works out from the machine and from `docker info` (`0-4` on the owner's Mac), and has a memory limit: the services of the stack as below, Schemathesis and oasdiff 512 MiB, Trivy, gitleaks, actionlint, Redocly and hadolint 1 GiB. Gradle's daemon ends 15 minutes after its last build and Kotlin's 15 minutes after its last compilation (`gradle.properties`). Run one heavy job at a time: a Gradle build, a PIT run, a Docker build, the integration tests or a counter-test; on the owner's Mac under the lock `.work/heavy.lock` of the work folder, and `./gradlew --stop` after the run, while the lock is held.

Never edit what a command writes: `gradlew`, `gradle/wrapper/`, `gradle/gradle-daemon-jvm.properties`, the `gradle.lockfile` files, `gradle/verification-metadata.xml`, `contract/openapi.json`, `stack/demo/afterMigrate__demo.sql`, `config/migrations.lock`, and `pinned/` with `docs.lock` and `app.lock`.

## The local stack

`stack/compose.yaml` runs the image as a deployment runs it: PostgreSQL 18.6, whose init script `stack/postgres/roles.sh` creates the roles `metis_migrator` and `metis_app`; Keycloak 26.8.1 with the development realm of `stack/keycloak/metis.json`; the migration job; then the API, each waiting for the health of what it needs. Both images are pinned by digest. The stack holds no password and reads four from the environment; a start without one stops with a message that names it:

- `METIS_POSTGRES_PASSWORD`, `METIS_MIGRATOR_PASSWORD` and `METIS_APP_PASSWORD`: the superuser of the database, the owner of the tables and the role of the API;
- `METIS_PERSON_PASSWORD`: the password of the two people of the realm, `developer`, and `two-tenants`, whose token names two tenants and is answered 401.

Keep them in a file outside the repository, at a path you choose, and name that path in `METIS_STACK_ENV`: the secret scan of `./verify` reads every file of the tree, the ones git ignores included, so a file of passwords inside it turns the scan red.

```sh
for name in POSTGRES MIGRATOR APP PERSON; do echo "METIS_${name}_PASSWORD=$(uuidgen)"; done > "$METIS_STACK_ENV"
docker compose --env-file "$METIS_STACK_ENV" --file stack/compose.yaml up --build --wait
docker compose --env-file "$METIS_STACK_ENV" --file stack/compose.yaml down --volumes
```

- `--build` builds the image from the sources first. Without it the stack runs whatever image `metis-core:local` names, an older build included.
- The API answers on `127.0.0.1:8080`, or on the port `METIS_PORT` gives. `METIS_TIME_ZONE` sets the time zone of its container (UTC when unset) and `METIS_IMAGE` the image both runs use. `METIS_CPUSET` keeps every container on those processors, `0-3` for the first four, as the checks always set it; unset, a container may use any.
- Every service has a memory limit: PostgreSQL 512 MiB, Keycloak 1 GiB, the migration job 1 GiB, the core 2 GB, and the relay of the demo 64 MiB.
- The migration job applies the migrations as `metis_migrator` and exits. The API then starts as `metis_app`, refuses a database that lacks a migration of the image, and runs locked down: a user without privileges, a read-only root with `/tmp` alone writable, no capability, no new privilege, one processor, 2 GB and 30 seconds of grace to stop.
- `/actuator/health/liveness` and `/actuator/health/readiness` answer without a token; readiness follows the database. Every other path needs a token.

A token for `developer` comes from Keycloak inside the stack, since the address it is asked at, `http://keycloak:8080/realms/metis`, is the issuer the API trusts:

```sh
docker compose --env-file "$METIS_STACK_ENV" --file stack/compose.yaml exec core \
  curl --silent --data grant_type=password --data client_id=metis-dev --data username=developer \
  --data-urlencode "password=$(grep PERSON "$METIS_STACK_ENV" | cut -d= -f2)" \
  http://keycloak:8080/realms/metis/protocol/openid-connect/token
```

The migration job of a deployment writes no row, and the shell answers 403 for a person its tenant does not know. With the demo overlay below, the migration job writes the demo data, and the realm's person `developer` is the demo person.

### The demo and the relay

`stack/compose.demo.yaml` is an overlay for the demo, which the owner opens in a browser:

- The migration job runs with the profiles `migrate,demo` and the folder `stack/demo/` mounted read-only at `/demo`, where the profile finds the demo data, a Flyway callback the history of migrations never records. The API never sees the folder.
- The core runs with the profile `demo`, which fixes its business clock at 2026-09-22T03:00:00Z, the one day the app's mock data holds for; tokens are still judged by the real clock.
- The relay starts: nginx 1.30.6, pinned by digest, configured by `stack/relay/nginx.conf` and `stack/relay/relay.js`. The app sends no token yet, so on each call the relay asks Keycloak for a token of `developer` and forwards the call to the core with it, in place of any the caller sent. It forwards reads alone and answers any other method 403; it answers only a request for the host `localhost` or `127.0.0.1`, and any other 421; it answers every preflight itself; only a page of the origin `METIS_APP_ORIGIN` may read what it answers, `http://localhost:8081` when unset, the app's development server; without a token from Keycloak it answers 500 and forwards nothing. It listens on `127.0.0.1:8090`, or on the port `METIS_RELAY_PORT` gives, and needs no password beyond the four above.

```sh
docker compose --env-file "$METIS_STACK_ENV" --file stack/compose.yaml --file stack/compose.demo.yaml up --build --wait
docker compose --env-file "$METIS_STACK_ENV" --file stack/compose.yaml --file stack/compose.demo.yaml down --volumes
```

Then point a web build of the app at the relay, in a clone of `metis-app`, with the mock server off, which it is unless `EXPO_PUBLIC_MOCKS` is set:

- the development server, whose origin the relay allows when `METIS_APP_ORIGIN` is unset: `EXPO_PUBLIC_API_BASE=http://127.0.0.1:8090 pnpm exec expo start --web --clear`, then open `http://localhost:8081`, which goes to screen 24 of the first demo project;
- a release export, served by the app's own `scripts/serve-web.mjs` on `127.0.0.1` and a port you choose, `5396` here: start the stack with `METIS_APP_ORIGIN=http://127.0.0.1:5396` in its environment, then `EXPO_PUBLIC_API_BASE=http://127.0.0.1:8090 pnpm build:web` and `node scripts/serve-web.mjs dist 5396`, and open `http://127.0.0.1:5396`.

## The checks of `./verify`

Every check is a root Gradle task named `check` and a capital, and a row of `Checks.ORDER` in the tool, in the order of section 8.2 of the design. `./verify` runs the checks whose tasks Gradle has, in that order, goes on after a red one, and keeps its record in `reports/verify.json`, from which it draws `reports/verify.md` on every run: one row per check with its result, its seconds, its facts and the stamp of its tree (a hash of the files git would commit, plus the count of uncommitted changes). A red row makes the exit code 1, and so does a full run that cannot name its tree because git cannot list the files. A check task that `Checks.ORDER` lacks stops the run, in whatever project it is registered. Every check but format, compile, deps and secrets fails when its judge leaves no facts in `build/facts/`, and `./verify` clears the facts before each check. Git ignores `reports/`.

`Checks.ORDER` lists the sixteen checks of section 8.2 of the design, and every one has its task.

The seconds and facts below are the record of the last full run of part one of [Fast checks](../../proposals/2026-10-16-fast-checks.md), on the tree `81140cf75ced` on 16 Oct 2026, every row green and nothing skipped, on the owner's Mac (arm64, ten cores, 24 GiB; Docker Desktop with five processors and 5 GiB), at two workers (`METIS_WORKERS=2`), as every heavy run there since that day. Its rows add up to 629.1 seconds; plan four's last run, at five workers with Docker at ten processors, added up to 530.2. The tree of this page differs from it in the workflow, `AGENTS.md` and `README.md` alone: its full run of 17 Oct 2026 was green on every row with the same facts, but the image check's times, in 1,076.5 seconds, while macOS's file-event daemon and its media analysis took several processors and the swap was nearly full. A first run on a new machine also downloads Corretto, the libraries, the images and the database of Trivy, which no plan measured.

| Check | What it proves | Main tools | Seconds | Facts of that run |
|---|---|---|---|---|
| `format` | Every Java file of `core`, `tools` and `test-support` is formatted, with no unused import; every other text file has no trailing space and ends with a newline | Spotless 8.10.4, google-java-format 1.36.1 | 1.2 | |
| `compile` | The main and test code of both projects, the integration tests included, compiles with `-Xlint:all -Werror`; Error Prone's `UnusedVariable`, `UnusedMethod` and `UnusedNestedClass` and NullAway are errors, over packages marked `@NullMarked` | javac of Corretto 25, Error Prone 2.50.0, NullAway 0.14.2 | 0.9 | |
| `lint` | No method above a cyclomatic complexity of 10 and no file above 300 lines; no method of a repository above a complexity of 1; every escape hatch gives its reason and the counts equal `config/debt.json`; no list of exclusions leaves out every class of a project; no test retypes a value of the demo data | Checkstyle 14.3.0, the tool | 3.4 | 3 marks |
| `language` | No letter outside ASCII but on the line after a `lang-exception:` comment that gives its reason; no comment and no test title that cites a plan, a ruling, a task, a date or a line of a file; SQL comments and `@DisplayName` titles are read too | The tool | 1.2 | 392 files |
| `architecture` | The module boundaries of Spring Modulith, the layers inside a module and the forbidden APIs: the rules listed under Conventions; a type of `platform` that one module alone uses; a method mapped to a request without `@Operation` | Spring Modulith 2.1.1, ArchUnit 1.5.1 | 6.8 | 23 passed, 0 failed, 0 skipped |
| `deadcode` | No dependency declared and unused or used and undeclared; no project declares a library that a bundle of the root build names; no class or member that no entry point reaches, no code that only tests reach and no test helper no test calls; no setting of an `application*.yml` that nothing defines; no table, column or resource file that nothing names, but the leftovers of `config/unnamed.txt` | Dependency Analysis Gradle Plugin 3.19.2, the walk of the tool on ArchUnit, `SettingsTest`, the tool | 8.0 | 1 passed, 0 failed, 0 skipped |
| `tooling` | The tests of the tool pass; every check has a counter-test or a reason in `NoCanary.REASONS`; the workflow file passes its linter and pins every action; every pinned copy is the file its lock names | JUnit, the tool, actionlint 1.7.12 | 13.5 | 362 passed, 0 failed, 0 skipped |
| `contract` | `contract/openapi.json` is what the core declares and passes Redocly's linter with no unused component; every BRD id it declares is in the pinned `ids.txt`; no locked migration changed; oasdiff finds no breaking change against `CONTRACT_BASE`, when CI names one | springdoc-openapi 3.1.1, Redocly CLI 2.63.0, oasdiff 1.33.0, the tool | 9.0 | 2 operations, 11 BRD ids, 2 migrations locked, no base to compare; its tests 1 passed, 0 failed, 0 skipped |
| `trace` | Every BRD id an operation declares stands in the name of a unit test that ran and passed; a skipped test counts for nothing | The tool, over the test reports | 9.8 | 11 BRD ids of 2 operations, 168 tests passed |
| `unit` | The tests of the core that need no container pass, none skipped, and the number that passed equals the floor | JUnit 6.1.3, AssertJ, Mockito 5.23.0, Spring's test support | 9.2 | 168 passed, 0 failed, 0 skipped |
| `integration` | The tests on a real PostgreSQL 18.6 and a real Keycloak 26.8.1 pass, none skipped, as many as the floor; they receive every response the contract documents, and every answer they receive validates against it | Testcontainers 2.0.5, datasource-proxy 1.11.1, openapi-request-validator 3.0.0, the tool | 44.7 | 82 passed, 0 failed, 0 skipped |
| `coverage` | Every line and every branch of the core, over its unit and integration tests together, and of the tool runs in a test; each report is judged on its own | JaCoCo 0.8.15, the tool | 58.7 | core lines 735 of 735, branches 181 of 181; tools lines 3230 of 3230, branches 1251 of 1251 |
| `mutation` | Every mutant of PIT's group STRONGER is killed, none survived and none went untested; every line that logs carries a mutant | PIT 1.30.0, the tool | 328.6 | full: 2299 mutants, 2299 killed (core 338, tools 1961) |
| `deps` | No known vulnerability in the lock files; only allowed licences in what the core runs with; every configuration resolves against its lock file and its checksums | Trivy 0.75.0, dependency-license-report 3.1.4, Gradle | 4.6 | |
| `secrets` | No secret in the tree, the files git ignores included | gitleaks 8.30.1 | 1.7 | |
| `image` | The image builds from the sources with Docker alone, passes hadolint and has no known vulnerability. Before either run, every image of both compose files, every base image of `core/Dockerfile` and every tool image of the version catalog is pinned by its digest, and every service of both compose files keeps to the processors of `METIS_CPUSET` within a memory limit, or no run starts. The stack runs the image twice, each time from an empty compose project of its own, on free ports, in the zone `America/New_York`, where the demo's instant falls on another date than in the demo workspace; the tool runs on two processors, as a runner of CI. As a deployment runs it: the API alone refuses a database no migration job ran on; after the migration job it is ready within 60 seconds, runs locked down as the image's user (read inside the running container), connects as `metis_app`, holds no password of the owner of the tables or of the superuser, answers its probes without detail, finds no row the migration job wrote, and no file it exports and no entry of its jars takes the name of a file of `stack/demo/` or holds the tenant the demo data writes to, so an edited copy is found too; on 2,000 work items the check writes itself, both reads answer with a token from Keycloak, the overview stays under 1 second at the 95th percentile of 100 calls, the calls Schemathesis generates from the contract, from a confined container that runs as the owner of its private report folder, meet no 5xx and no answer outside it, and a stop signal during a request that a lock of the database holds lets the request finish and ends the JVM within 30 seconds. As the demo runs it: the demo's overviews equal by value to the app's answers, every point of the relay read from outside, and Schemathesis on the demo's own ids, at least one read with the token answered 200. Every point prints what it measured | Docker with Compose, hadolint 2.15.1, Trivy 0.75.0, Schemathesis 4.31.1, the tool | 127.8 | image content 190.8 MB, ready in 6.3 s, memory 468.3MiB, overview of 2000 work items 256 ms at the 95th percentile, 244 calls from the contract, demo up in 19.9 s, 150 calls from the contract on its ids, 47 answered 200 with the token |

- The fast group is the first ten checks, format to unit, which CI runs on every push to `main`; their rows add up to 63.0 seconds in that record.
- The tests run in a random order of classes and of methods, from a seed each run prints. No test can resolve a host name but the local one: the JDK loads the resolver `LocalHostOnly` of `test-support` in every test JVM. A literal address is beyond its reach. The floors are exact, in `test-floor.json`: architecture 23, contract 1, deadcode 1, integration 82, tooling 362 and unit 168, so a change that adds or removes tests updates the file.
- The integration tests run in one JVM of a 1 GiB heap, so their containers and their Spring contexts start once, and their task fails after 20 minutes. Their PostgreSQL and Keycloak keep to the processors of `METIS_CPUSET`, within 512 MiB and 1 GiB, through `Stack.confine`. They read `stack/compose.yaml`, `stack/postgres/roles.sh`, `stack/keycloak/metis.json` and `stack/demo/`, so the stack and the tests share one source, and `stack/` and `contract/openapi.json` are inputs of their task. Every core a test starts listens on `127.0.0.1` alone, and every container of the tests publishes its ports there alone. The shared database is migrated and seeded by the demo's migration job.
- The integration tests hold one list of the endpoints, `Endpoints`, with a path a member reads and, for each, the paths of another tenant paired with the missing path they must answer as. `CrossTenantTest` (the same status, body and number of statements for a foreign record as for a missing one), `LogTest` and `TokenTest` walk it, and a test fails an endpoint the list lacks.
- Coverage runs both test tasks of the core again and reads their execution data together, since only a database runs a repository.
- The full mutation run: 328.6 seconds over 2299 mutants at two threads in that record, which `./verify` runs when `MUTATION_BASE` is unset, as in the full runs; CI mutates only the classes a pull request changed, through `MUTATION_BASE`.

## Counter-tests

A check that cannot go red proves nothing. `./canary <name>` copies the files of the tree into `build/canary/<name>/`, plants one defect there, runs the check and requires it red with the text of that defect; its output goes to `build/canary/<name>.log`, and the working tree is never touched. Before planting it requires the check green on the copy, since a check already red proves nothing about the defect, unless the newest row of the check in `reports/verify.json` is green, on a tree whose stamp equals the copy's, and not partial: then the check runs once, planted. A check red for another reason does not count as a catch. The copy clones each file where the file system clones, as APFS does, and every copy shares Gradle's build cache. Each counter-test prints its seconds, and a run its minutes.

`./canary changed` runs the counter-tests a change selects, from the map of `tools/src/main/java/dev/metis/tools/canary/Implementations.java`: rules by glob name the checks each file is made of, the first that matches deciding, and every counter-test owns the files it plants into. A file of the build, of the version catalog, of a lock or of `test-support/`, or one no rule names, belongs to every check; a file of the engine of the counter-tests (the root package of the tool, `verify/`, the classes of `canary/` that run counter-tests, the launchers, `.gitignore`) selects the smoke set; a file of the product, of its tests but those a check is made of, or a page selects nothing. A new file of the tool, of `config/` or of `stack/` needs a rule, or `checkTooling` fails it. `reports/canary.json`, which git ignores, keeps for each check and for the engine the stamp of what it is made of when every counter-test of it last caught, and the instant; a run writes it only when every copy had the stamp the run started from. A check without a record is selected, so the first full record comes from a full run, `./canary all`. `./canary all` runs every one and exits 0 when each one caught its defect.

The tree of this page holds 156 counter-tests: format 2, compile 3, lint 11, language 5, architecture 29, deadcode 10, tooling 6, contract 5, trace 2, unit 5, integration 26, coverage 3, mutation 4, deps 4, secrets 2 and image 39, of which 25 run the deployment run of the image check alone (`-PimageRun=deployment`) and 14 the demo run alone (`-PimageRun=demo`); the five of the pins stop before either run. They live in `tools/src/main/java/dev/metis/tools/canary/`. `NoCanary.REASONS` is empty: every check has a counter-test, and `checkTooling` fails a check that has neither.

| Run | Measured | Source |
|---|---|---|
| `./canary all` on the tree `bbfcdc216889` of plan four, 152 counter-tests | 152 of 152 red because of their planted defect, from 17:27:08 to 20:52:04 on 16 Oct 2026 (205 minutes), exit 0 | [Plan four](../../history/plans/2026-10-14-backend-delivery-plan.md#review-round-one) |
| `./canary smoke` on the tree `dd8bd2b84b93` of [Fast checks](../../proposals/2026-10-16-fast-checks.md), 16 counter-tests, two workers | 16 of 16 red because of their planted defect, each check run once, planted, since the record of `./verify` held it green on the copy's stamp: 665.4 seconds, against 1,497 for the same sixteen by name before | [Fast checks](../../proposals/2026-10-16-fast-checks.md#measured-before-and-after) |
| `./canary changed --list` on that tree | 156 counter-tests with no record; after `./canary secrets`, `format` and `trace` and the smoke run, 150 of the 13 other checks | The same |

Each counter-test that builds the image tags it `metis-core:check` in its copy, so after `./canary all` that tag holds the last planted image, and the next `./verify` builds it again.

## The rules a line of code must pass

The rule of the app, [Coverage 100, mutation 100, no unused code](../../architecture/decisions/machine-proven-code.md), restated for the back end in section 8.1 of the design. All five conditions are built.

1. A test runs through it: 100% of the lines and branches of `core` and `tools`. `config/coverage-exclusions.txt` leaves out one class, `dev.metis.tools.Main`, which exits the JVM and which `MainTest` runs as a process.
2. The test catches errors: every mutant is killed. PIT's own threshold is not used, since PIT rounds the score; the tool reads PIT's report. `config/mutation-exclusions.txt` keeps two entries in coverage and out of mutation testing, since only a database shows what they do and PIT runs no test that starts a container: the repositories of every `internal.data` package and `TenantTransactionManager`. The integration tests prove both. PIT mutates the lines that log too, and the judge fails a line that calls the logger and carries no mutant. No method is excused from mutation testing.
3. Something uses it: the `deadcode` check. The walk starts from the entry points of `config/entry-points.txt`, each with its reason (the `main` of the core and of the tool, the resolver of the network guard, which the JDK loads, and the badge of a navigation item, which no production code fills yet), and from what the frameworks call by themselves: a method mapped to a request, a handler, a bean and a listener of Spring, a member a test engine or Spring's test context runs, the accessors through which Jackson writes an answer, the classes an answer's types stand for, the constants of an enum a row or an answer holds, and the `serialVersionUID` that the JDK's serialization reads. Every table and column of the migrations is named by a statement of a repository, and every resource file by its path, or listed with its reason in `config/unnamed.txt`.

4. If it is an endpoint, it is declared in the contract: the architecture check fails a method mapped to a request without `@Operation`, and the check `contract` fails an operation without BRD ids or with an id the BRD lacks.
5. It traces to a requirement: every BRD id an operation declares stands in the `@DisplayName` of a unit test that ran and passed, which the check `trace` requires.

Every escape hatch gives its reason and is counted in `config/debt.json`, whose counts the lint check holds equal to the code: `SuppressWarnings` 0, `DoNotMutate` 0, `Generated` 0, `lang-exception` 0, `coverage-exclusion` 1, `mutation-exclusion` 2 and `unnamed` 0.

## Conventions

How a later task extends the core, from section 7 of the design, as the code of plans one to four applies it.

### Adding things

| To add | Do this | The check that proves it |
|---|---|---|
| A module | A package under `dev.metis.core` whose `package-info.java` carries `@ApplicationModule(allowedDependencies = ...)` and `@NullMarked`, with `internal/web`, `internal/app`, `internal/domain` and `internal/data` as needed. See [Modules of the core kept apart by Spring Modulith](../../architecture/decisions/core-modules-spring-modulith.md) | `architecture` |
| An endpoint | A controller method in `internal/web` that takes `CurrentUser` as a parameter, calls one use case of `internal/app` and carries `@Operation` (its durable name, a one-line summary, its BRD ids, its action class and the statuses beside 200); records for the answer; an entry in `Endpoints` of the integration tests, with its foreign and missing paths; a unit test whose `@DisplayName` opens with each BRD id; then `./gradlew writeContract` | `architecture`, `contract`, `trace`, `integration` |
| A rule | A pure function or record in `internal/domain`, with its tests first | `unit`, `coverage`, `mutation` |
| A table | A new migration under `core/src/main/resources/db/migration` with the tenant column and its default, row-level security enabled and forced, the one policy `tenant_rows` on the tenant of the transaction, a foreign key that names the tenant and the grants the code uses; its repository in `internal/data`, whose statements name every column. A migration never creates a role and never changes once merged: `./gradlew lockMigrations` adds its hash to `config/migrations.lock` | `integration` (`CatalogTest`, `RolesTest`), `contract`, `deadcode` |
| A call from one module to another | A type in the base package of the called module, or in one of its named interfaces, added to the caller's `allowedDependencies` | `architecture` |
| A setting | A field of a validated `@ConfigurationProperties` record that production code reads; `@Value` is not used. An environment gives it through an environment variable | `deadcode` (`SettingsTest`) |
| A dependency | A line in the build file of the project, its version in `gradle/libs.versions.toml` unless Spring Boot's list holds it, never a library a bundle of the root build names; then the command that writes the locks and the checksums | `deadcode`, `deps` |
| Demo data | A value in the builders of `core/src/testShared/java/dev/metis/core/demo/`, then `./gradlew writeDemo`; a test reads it from there and never retypes it | `unit` (`DemoSeedTest`), `lint`, `integration` (`MockDataTest`) |
| A variable of the image | An environment variable the core reads, written into `stack/compose.yaml`, which the image check runs as a deployment runs it; never a file of the image or a test endpoint | `image` |
| A rule of the relay | A line of `stack/relay/nginx.conf` or `stack/relay/relay.js`, a point of the demo run that reads it from outside, and its counter-test in `DemoCanaries` | `image` |
| A file of `metis-docs` or `metis-app` that a check reads | A byte copy under `pinned/`, written by `./gradlew pinDocs` or `./gradlew pinApp`; never edited | `tooling` |
| A check | A task named `check` and a capital in the root `build.gradle.kts`, a row of `Checks.ORDER` in the order of the design, a judge that leaves facts in `build/facts/` unless the root build names the check in `factFree`, and its counter-test or its reason in `NoCanary.REASONS` | `tooling` |

### Rules inside a module

Each rule is an ArchUnit rule of `core/src/test/java/dev/metis/core/ArchitectureTest.java` or of `test-support`, unless the line says otherwise.

- `web` calls `app`; `app` calls `domain` and `data`; `data` may use `domain` types; no call goes back up (`layers`). A controller calls no rule of `domain` (`noRuleInControllers`) and touches no repository.
- `domain` depends on nothing of Spring and nothing of the other layers (`pureDomain`).
- A repository runs SQL written as a text block with named parameters through `JdbcClient` and makes no decision: it calls nothing but `JdbcClient` (`repositoriesRunTheirStatement`), the text of every statement is a string constant of its class (`everyStatementIsAConstant`), its methods keep a complexity of 1 (the lint check), and only a repository and the tenant hook reach `org.springframework.jdbc`, `java.sql` or `javax.sql` (`jdbcInRepositoriesAlone`).
- A use case method is the only place a transaction starts, by annotation or by any transaction API (`transactionsInUseCases`).
- Dependencies arrive through the constructor (`constructorInjectionOnly`); no static holder of the person of a request (`noStaticHolder`); no `new` of a bean (`noBeanMadeByHand`).
- No code reads the clock of the machine but `platform.time.internal` (`noSystemClock`), and only the token decoder gets that time (`machineTimeForTokensAlone`). The business date is the `Clock` bean, which `metis.time.fixed` stops under the profile `demo` or `test` alone.
- No standard output (`logsGoThroughTheLogger`), no legacy date type (`noLegacyDates`), and every package marked `@NullMarked` (`nullMarked`), so that NullAway fails a null that crosses a method boundary unmarked.
- Types are package-private unless another package needs them, and an answer of the API is a record. No interface with a single implementation, no base class for one subclass, no setting for a value that never changes; reviewers check these.
- A deliberate shortcut carries a `ponytail:` comment that names its ceiling and how to lift it.

### Language, comments and tests

The rules of the app, unchanged: [English code, one source per value, no retyped literal](../../architecture/decisions/code-language-and-single-source.md).

- Code, comments, test names, log messages and the output of the tool are English. A letter outside ASCII is allowed only on the line after a `lang-exception:` comment that gives its reason.
- A comment is one line that says why. It never cites a plan, a ruling, a task number, a date or a line of another file; BRD ids are fine. google-java-format wraps a comment longer than 100 characters, so every comment fits in one line.
- A test name is an English sentence about behaviour, and a test that proves a requirement opens its `@DisplayName` with its BRD id, as `TenantTransactionTest` does with `TEN-02 a transaction sees the rows of the tenant of its user alone`. The language check reads the title as it reads a comment.
- Every value has one source. The ids, names and numbers of the demo data are written once, in its builders, and the lint check refuses a string of another test of the core that equals one, holds one of its keys or holds one of its phrases.

## Where the checks run

The rules of [GitHub's CI runs the checks, a sandbox CI the full runs; macOS work runs on a Mac; every run leaves a record](../../architecture/decisions/where-checks-run.md) and [Checks must not overload the machine](../../architecture/decisions/resource-caps.md), both for the app and for the back end since the owner's decisions of 16 and 17 Oct 2026, built in [Fast checks](../../proposals/2026-10-16-fast-checks.md).

- While working, what the change touches: one check, one test task, one counter-test.
- Before work is handed back, `./verify --fast`, the set CI runs on every push to `main`, then `./canary changed`. A change of the build, of the version catalog or of a lock selects every counter-test; `./canary changed --list` shows a selection before it runs.
- In CI, `.github/workflows/check.yml` calls only `./verify`, so no check lives in the workflow alone: `./verify --fast` on every push to `main`, or when started by hand, within 30 minutes; on every pull request `./verify` with `MUTATION_BASE` and `CONTRACT_BASE` set to the base branch, within 60 minutes, and no counter-test. A newer run on the same ref cancels the one still going, and no job runs on a schedule, to spare the free minutes of a private repository. Each job keeps `reports/verify.md` as an artifact. The token of a job reads the code and writes nothing, and every action is pinned by its commit.
- The full runs, `./verify` with the whole mutation run and then `./canary all`, are for a sandbox CI the owner is to set up, not for GitHub. Until it exists they are started by hand, at night, alone under the shared lock.
- These limits are not measurements: the workflow has never run. A runner of a private repository has 2 processors and 8 GB [Source: docs.github.com/en/actions/reference/runners/github-hosted-runners, read 16 Oct 2026], where every container of a check shares one processor; the first runs measure the runners' own times.

## Not proven yet

- The CI workflow has never run, and `MUTATION_BASE` has never met a real history, since the repository has no commit.
- The image for amd64: the owner's Mac builds arm64 only.
- oasdiff against a base branch: no branch holds the contract yet.
- The stop of the image check lost its held answer once, in the first `./canary all` of plan four, without a byte, and no probe made it again; the check prints the core's log when it comes back. See [Troubleshoot the core](troubleshoot.md).
- Two races bounded without a proven cause: a connection refused to a new database 0.1 seconds after its start, which `Stack.database()` waits out, and a held request of `ShutdownTest` answered before it reached its endpoint, whose wait fails after 20 seconds with the answer. See [Troubleshoot the core](troubleshoot.md).
- Ryuk, the container with which Testcontainers removes the others, publishes its port on every address, and Testcontainers offers no setting to change it; it keeps to no processor set and no memory limit either, since it only waits.
- `./canary changed` against a full record, and `--base` on a real history: the record is new and the repository has no commit.
- The steps of `docker build` keep to no processor set: BuildKit offers no such option, and the Gradle of the build stage runs at half of Docker's processors.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections [7](../../history/specs/2026-10-14-backend-skeleton-design.md#7-conventions-how-a-later-task-extends-the-skeleton), [8](../../history/specs/2026-10-14-backend-skeleton-design.md#8-tests-and-checks) and [9.3](../../history/specs/2026-10-14-backend-skeleton-design.md#93-what-a-developer-machine-needs).
- [Plan one, the backend foundation](../../history/plans/2026-10-14-backend-foundation-plan.md): Global Constraints (lines 26 to 29) and "What the sandbox taught" (line 15677).
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (lines 26 to 29 and 41), "Review round one" (lines 16225, 16234 and 16242), "Review round two" (line 16268), "Trial run in the sandbox" (lines 16272 to 16302) and "Left for plan three" (lines 16352 and 16353).
- [Plan three, the backend overview and the contract](../../history/plans/2026-10-14-backend-overview-plan.md): its tasks, "Trial run" and "Left for plan four".
- [Plan four, the backend delivery](../../history/plans/2026-10-14-backend-delivery-plan.md): its tasks, "Trial run" and "Left for later".
- [Fast checks](../../proposals/2026-10-16-fast-checks.md): the selection of counter-tests by change, the run once on a tree `./verify` holds green, the limits of processors and memory, the workflow, and the measures before and after, on the tree `81140cf75ced`, with `reports/verify.md`, `reports/verify.json` and `reports/canary.json` of that day, which git ignores.
- Files of `metis-backend` read on 16 Oct 2026, beside the tree `bbfcdc216889` of `reports/verify.md`: `README.md`, `AGENTS.md`, `verify`, `canary`, `build.gradle.kts`, `settings.gradle.kts`, `gradle/libs.versions.toml`, `build-logic/src/main/kotlin/metis.java-conventions.gradle.kts`, `core/build.gradle.kts`, `tools/build.gradle.kts`, `test-floor.json`, `config/debt.json`, `config/entry-points.txt`, `config/coverage-exclusions.txt`, `config/mutation-exclusions.txt`, `stack/compose.yaml`, `.github/workflows/check.yml`, `tools/src/main/java/dev/metis/tools/verify/Checks.java`, `tools/src/main/java/dev/metis/tools/canary/` and `tools/src/test/java/dev/metis/tools/canary/NoCanary.java`, `tools/src/main/java/dev/metis/tools/image/`, `core/src/test/java/dev/metis/core/ArchitectureTest.java`, `stack/compose.demo.yaml`, `stack/relay/`, `contract/openapi.json`, and `reports/verify.md` and `reports/verify.json`, which `./verify` wrote on 16 Oct 2026 and git ignores.
