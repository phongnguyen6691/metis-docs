---
title: The Metis app
summary: What the app is, its stack, what it depends on, what is built and not built, the guide pages and the questions still open.
component: app
type: overview
status: current
ids: []
---

# The Metis app

The Metis app is one Expo code base that builds three apps: a web app, an iOS app and an Android app. It lives in the `metis-app` repository, which the frontend team owns. Today it runs on mock data only, because no back end exists yet. The first wave of work built the frame around every page and one screen, screen 24, the project overview.

Start with [Develop the app](develop.md) to build, run and test it, [App interfaces](interfaces.md) for what it calls and exposes, and [Troubleshoot the app](troubleshoot.md) when something fails. The guide pages below teach the code base to a web developer who is new to React Native.

## At a glance

| Item | Value |
|---|---|
| Code repository | `metis-app`, one of the four repositories ([Three code repositories and one for every document](../../architecture/decisions/four-repositories.md)) |
| Team | The frontend team |
| Builds | Web (a single-page export), iOS and Android, from one code base: [React Native with Expo for web, iOS and Android](../../architecture/decisions/react-native-expo-single-codebase.md) |
| Name and identifiers | The app is named Metis. The iOS bundle identifier and the Android package are `dev.metis.app`, and the URL scheme is `metis` (`app.json`) |
| Required platforms | Chrome and Safari on desktop, Safari on iPhone, Chrome on Android, iOS from 16.4 and Android from 7: [Required platforms, browser gate and native gate](../../architecture/decisions/supported-platforms-and-gates.md) |
| Data today | Mock data. A mock server answers only when `EXPO_PUBLIC_MOCKS` is `1`, and a web release build is checked to carry none of it (`node scripts/check-web-release.mjs dist`) |
| State of the work | Wave one is built. Wave two, one screen for each layout type and each frame, waits for the owner to sign screen 24 |

Sources: `app.json`, `package.json` and `scripts/check-web-release.mjs` of `metis-app`; [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md), FE-04 (line 44 of the original).

## Stack

The versions are the specifiers of `package.json`; `pnpm-lock.yaml` fixes the installed ones.

| Part | Choice | Version in `package.json` |
|---|---|---|
| App framework | Expo SDK 57 (`expo`) | `~57.0.26` |
| Native runtime | React Native, React | `0.86.3`, `19.2.3` |
| Web | React Native for Web (`react-native-web`) | `~0.21.0` |
| Routing | Expo Router (`expo-router`) | `~57.0.24` |
| Language | TypeScript, strict (`tsconfig.json`) | `~6.0.3` |
| Response contracts | zod | `4.6.5` |
| Mock server | MSW (`msw`, a development dependency) | `2.15.0` |
| Fonts, logo, language select | `expo-font`, `react-native-svg`, `@react-native-picker/picker` | `~57.0.4`, `15.15.4`, `2.11.4` |
| Unit and component tests | Jest with `jest-expo`, `@testing-library/react-native` | `~29.7.0`, `~57.0.5`, `14.0.1` |
| Browser tests | Playwright (`@playwright/test`), `@axe-core/playwright` | `1.63.0`, `4.13.0` |
| Mutation tests | StrykerJS (`@stryker-mutator/core`) | `10.0.0` |
| Static checks | ESLint, Prettier, Knip (unused code) | `^9.39.5`, `^3.9.9`, `6.39.0` |
| Runtime and package manager | Node (`.nvmrc`), pnpm (`packageManager`) | `24.15.0`, `11.28.4` |
| Native flows | Maestro, installed on the machine and not listed in `package.json` | none |

Source: `package.json`, `.nvmrc` and `tsconfig.json` of `metis-app`; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), section 2 (lines 63 to 81 of the original).

## What it depends on

- **Pinned brand files and wireframe manifest.** `pinned/` holds byte copies of ten files of `metis-docs`: `design/brand/tokens.css`, eight logo and icon files under `design/brand/logo/`, and `design/wireframes/manifest.json`. `docs.lock` names the sha256 of each copy, and `pnpm gate:tooling` fails when a copy differs from it, is missing or is not listed. A change to these files starts in `metis-docs`, never in `pinned/`. [App interfaces](interfaces.md) lists the files and what reads each one.
- **The API contract of the back end, later.** No back end exists. The screens call the real API paths, and a mock server answers in mock builds only ([Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md)). Once the core publishes its OpenAPI contract, the app is to regenerate its zod schemas from it. That flow is planned and not built ([The API contract is the only coupling between app and back end](../../architecture/decisions/api-contract-only-coupling.md)).
- **No third-party host at run time.** The three typefaces are self-hosted, and the only host the app calls is the API base ([Self-hosted fonts per platform](../../architecture/decisions/font-loading.md)).
- **Tools.** Node 24.15.0 and pnpm 11.28.4. The native gate also needs macOS, Xcode, an iOS Simulator named `iPhone 18 Pro`, Maestro and a JDK, and the browser gate needs the Chromium and WebKit builds of Playwright. [Develop the app](develop.md) has the commands.

Sources: `pinned/`, `docs.lock`, `scripts/pinned.mjs`, `.github/workflows/check.yml` and `scripts/native-gate.mjs` of `metis-app`; [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), sections 4.4 and 4.5 (lines 283 to 294 of the original).

## What is built

Wave one is built: the frame around every page, and screen 24, the project overview. It runs on web, iOS and Android, on mock data.

- **The frame** (`src/shell/`). A sidebar when the window is at least 1280 px wide, an icon rail from 768 px, a drawer that opens the sidebar below 1280 px, a top bar (breadcrumb, search box, New, Help, notifications, user initials, language select), the project header with its six tabs, and a workspace menu ([Three width tiers and 44 point touch targets](../../architecture/decisions/width-tiers-and-touch-targets.md)).
- **State panels.** Loading, no access, not found, server not answering, and invalid data that names the wrong fields, each drawn as a panel, and an expired session, drawn as a dialog. An action whose destination is not built, such as Request access or Sign in again, is text labelled `Not built yet`.
- **A page for every unbuilt destination.** Each other destination opens its final path inside the real frame, on a generic page that names the screen, the path and the filters it received. A destination of a later release (Investment, Scenarios, SteerCo, AI copilot) is text labelled `Planned V2` or `Planned V3`, not a link ([Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md)). The route table is in [App interfaces](interfaces.md).
- **Screen 24, the project overview** (`src/screens/24-project-overview/`). The metric tiles, progress, the status breakdown, health, progress by category, workload by person and three lists of what needs attention. It has every state of its contract, English and Vietnamese text, and links that carry the server's filter to the work breakdown structure. Every number is a server snapshot with its as-of time, definition version and freshness ([The app never computes a metric or a drill filter](../../architecture/decisions/metrics-are-server-snapshots.md)).
- **Mock data.** Demo projects and mock scenarios on the web; the iOS and Android apps get the default scenario ([Develop the app](develop.md), "Run it").
- **Checks.** `pnpm verify` runs every gate and keeps a record of the tree each one tested, and `pnpm canary` proves that each gate can fail ([A screen is done when its gates pass, each proven able to fail](../../architecture/decisions/gates-with-canaries.md)).

Not built: the back end; the other 57 screens of the 58 wireframes; the five other frames (admin, provider, no frame, outside guest, onboarding); and the App Store and Google Play releases. Wave two plans one screen for each layout type and each frame: 25-project-charter, 26-wbs-table, 27-wbs-tree, 30-plan-timeline, 31-plan-board, 11-lifecycle-framework-designer, 01-sign-in, 02-tenant-admin-users, 07-provider-tenants, 45-client-view and 46-onboarding-frame, and it is planned only after the owner signs screen 24 ([Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md)).

Sources: [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), sections 1.2 and 1.3 (lines 31 to 46 of the original) and 4.3 (lines 236 to 276 of the original); [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md), FE-04 (line 44 of the original); [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19825 to 19829 of the original; `src/shell/`, `src/screens/` and `src/mocks/handlers.ts` of `metis-app`.

## Known gaps

| Gap | What exists instead | Source |
|---|---|---|
| Real devices and human checks | The checks run on simulators and emulators: an iPhone 18 Pro simulator (iOS 27), an Android 15 phone and tablet, and an Android 7.0 emulator. The real-device checklist has not been run because the list of devices does not exist. No run has turned on TalkBack, and VoiceOver was not tried on a device. The Apple side ran on the iOS 27 simulator only; running iOS 16.4, the oldest required version, needs a simulator or device of that generation, and no record shows one | [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19787, 19790, 19791 and 19805 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 177 to 180 and 285 to 286 of the original; [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 698 of the original; `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1), line 15 of the original |
| Speed on devices | Not measured. Cold start under 2 seconds and scrolling at 60 frames per second on a mid-range Android phone are proposals, the iOS threshold is not set, and no stable tool measures iOS performance automatically. The sample app measured 2.9 seconds with compression on an emulated phone against the 2-second target of the web overview; the real screen is not measured | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 463, 677, 680, 681, 699 and 700 of the original |
| Real Safari | Not built. Playwright runs WebKit, not branded Safari. A spike on 5 Oct 2026 ran real Safari on macOS through WebdriverIO and `safaridriver`, but no check of the app does, and Safari on the iOS 27 Simulator cannot be automated | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 448 to 458 and 651 of the original; [Plan A](../../history/plans/2026-10-05-frontend-foundation.md), lines 4230 to 4237 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19808 and 19809 of the original |
| `Intl` on devices | The date, time and percent formatting tests run on the four Jest platforms. They have not run on real devices, and whether a time zone is valid depends on the device and Hermes | [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19792 and 19821 of the original |
| Seven canaries | Not built: the sabotage tests of the shape gate, the behaviour gate, the reverse check, the translation gate, the brand gate, component performance and web performance. Every other gate has a canary or a reason in `NO_CANARY` (`scripts/canaries.mjs`) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 572 to 576, 582, 583 and 820 to 822 of the original |
| Checks outside CI | The workflow `.github/workflows/check.yml` runs `pnpm verify` and `pnpm canary`. It does not run Lighthouse CI, Reassure, the volume test with 2,000 items, the comparison with baseline screenshots, the Android app on an emulator with Maestro, or Edge and Firefox. The workflow has never run, because the repository has no remote yet | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 632 to 635 and 697 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), line 19813 of the original |
| Baseline screenshots | None. The pictures of each platform and width become the baselines after the owner signs screen 24 | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 59 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), line 342 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), line 19798 of the original |
| Flows from the screen contract | The three native flows (`e2e/native/smoke.yaml`, `phone.yaml` and `tablet.yaml`) are written by hand. Flows generated from each screen's contract, tapping every control, are not built | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 408 and 409 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), line 343 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19793 and 19800 of the original |
| Phone profiles in Playwright | The browser tests emulate a phone with `isMobile` and `hasTouch` at two phone widths on Chromium and WebKit. The Pixel and iPhone device profiles of Playwright are not used | [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 344 and 345 of the original |
| Publishing the macOS result | `pnpm verify` has no `--publish-status` flag, which would attach "checked on macOS" to the commit on GitHub | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 661 to 663 of the original |

## Guide

The guide pages teach the code base to a web developer who is new to React Native. Seven pages quote code from `metis-app` and end with a question to check yourself; the first two, React Native for web developers and Project structure, name files and symbols instead, and no question of the quiz tests them.

| Page | What it covers |
|---|---|
| [React Native for web developers](guide/react-native-for-web-developers.md) | What a web developer already knows, what React, React Native and Expo each do here, and the glossary |
| [Project structure](guide/project-structure.md) | The folder map of `metis-app`, including `pinned/` and the root workflow |
| [From command to screen](guide/from-command-to-screen.md) | What happens between a command such as `pnpm web` and a screen |
| [Platform files](guide/platform-files.md) | One import and up to three files, and when a platform file is right |
| [Components](guide/components.md) | `View`, `Text` and `Pressable` in place of `div`, `span` and `button`, and the rules that trip web writers |
| [Styles and layout](guide/styles-and-layout.md) | Styles without CSS, layout without media queries, and the three width tiers |
| [Routing](guide/routing.md) | Paths that are files, and the rules of the route table |
| [Data flow](guide/data-flow.md) | Data that goes one way, and the mock scenarios |
| [Testing](guide/testing.md) | Tests on four platforms, and the checks beyond Jest |

## Decisions behind the app

| Topic | Decisions |
|---|---|
| Why it is built this way | [Rewrite the front end, reuse nothing of the first app](../../architecture/decisions/rewrite-frontend-from-scratch.md), [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md), [React Native with Expo for web, iOS and Android](../../architecture/decisions/react-native-expo-single-codebase.md), [One app, no multi-package workspace](../../architecture/decisions/one-app-no-package-workspace.md) |
| Data and the back end | [The API contract is the only coupling between app and back end](../../architecture/decisions/api-contract-only-coupling.md), [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md), [The app never computes a metric or a drill filter](../../architecture/decisions/metrics-are-server-snapshots.md), [Every response is validated, and every failure is a named state](../../architecture/decisions/validated-contracts-and-error-states.md), [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md), [Derived health covers delivery and risk only](../../architecture/decisions/derived-health-scope.md), [`delayed=true` and `scope=mine` are provisional names](../../architecture/decisions/provisional-drill-parameters.md) (a draft) |
| Look and behaviour | [The brand tokens are the only source of sizes and colours](../../architecture/decisions/brand-tokens-source.md), [Self-hosted fonts per platform](../../architecture/decisions/font-loading.md), [Three width tiers and 44 point touch targets](../../architecture/decisions/width-tiers-and-touch-targets.md), [Safe areas and a dark status bar on one light palette](../../architecture/decisions/safe-area-and-status-bar.md), [The language select on each platform](../../architecture/decisions/native-language-select.md), [Typed dictionaries per screen, English first](../../architecture/decisions/typed-dictionaries.md), [Workspace time zone, Intl output, percentages floored](../../architecture/decisions/time-and-number-formatting.md), [What the client remembers](../../architecture/decisions/client-memory.md), [Name, bundle id, icons and splash](../../architecture/decisions/app-identity.md), [Where the wireframe and the style guide disagree, build the wireframe and ask](../../architecture/decisions/wireframe-over-style-guide.md) |
| Routes and the web build | [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [The web build is a single page](../../architecture/decisions/web-build-single-page.md) |
| Code rules and checks | [Plain core, shared shell, layers enforced by lint](../../architecture/decisions/layers-enforced-by-lint.md), [English code, one source per value, no retyped literal](../../architecture/decisions/code-language-and-single-source.md), [`contract.yaml` is each screen's promise, traced to tests](../../architecture/decisions/screen-contract-and-trace.md), [A screen is done when its gates pass, each proven able to fail](../../architecture/decisions/gates-with-canaries.md), [Coverage 100, mutation 100, no unused code](../../architecture/decisions/machine-proven-code.md), [Required platforms, browser gate and native gate](../../architecture/decisions/supported-platforms-and-gates.md), [CI runs `pnpm verify`; macOS work runs on a Mac; every run leaves a record](../../architecture/decisions/where-checks-run.md), [What each test layer proves; a request that leaves the mocks fails](../../architecture/decisions/test-layers-and-network-guard.md), [Four Jest projects, and platform files only for real differences](../../architecture/decisions/jest-projects-and-platform-forks.md), [Checks must not overload the machine](../../architecture/decisions/resource-caps.md), [Accepted advisories and allowed licences](../../architecture/decisions/dependency-policy.md), [pnpm 11.28.4, the hoisted layout, Expo's peer pins](../../architecture/decisions/toolchain-pins.md) |

## Open questions

The owner has not answered these. The second column says what the code does until the owner does.

| Question | Until it is answered | Source |
|---|---|---|
| Where do Share and Export lead? Export leans toward the data export screen (PLT-14, screen 44). Needed before wave two | Both are text labelled `Not built yet`, not buttons | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 272 and 694 of the original |
| Does the Help button, with the glossary of PLT-20, get a screen of its own? Needed before wave two | Help is text labelled `Planned V2` | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 271 and 695 of the original |
| Where do Request access and Sign in again lead, and is the wording of the state texts right? Asked at the review of screen 24 | Both actions are text labelled `Not built yet`, and the sentences are drafts | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 707 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19410 and 19411 of the original |
| Is the "As of" line right when it shows the worst freshness and the earliest time of the nine metric snapshots? Asked at the review of screen 24 | It does exactly that | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 711 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), line 19418 of the original |
| Should the iOS and Android apps store the language, for example with AsyncStorage? | Every launch of the app opens in English, and the last workspace is kept only while the app runs (`src/platform/storage.ts`) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 712 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19419 and 19420 of the original |
| Should the Blocked tile stand out when its count is above 0, as the BRD says (OVW-01), or only Delayed and High risk, as the wireframe table says? Asked at the review of screen 24 | It follows the BRD: Blocked, Delayed and High risk stand out when above 0 | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 225 and 714 of the original |
| Are the targets of the "+ N more" rows right? | The upcoming and risk lists open the work breakdown structure with the server's filter, and the overdue list opens Focus (`src/screens/24-project-overview/contract.yaml`) | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 719 of the original |
| When does wave two start? | Wave two has no plan. It is planned after the owner signs screen 24 | [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md), line 44 of the original; [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19825 and 19826 of the original |

The owner's review package adds more questions and open items. The second column says what the code does, and where the package gives a recommendation, the code already follows it.

| Question | Until it is answered | Source |
|---|---|---|
| Should the "stale" mark of the "As of" line be 11 px, as the code draws it, or 9 px, as the wireframe draws it? The wireframe's general rule gives the stale mark 9 px because that mark sets no size, while the partial and unknown marks set 11 px | The code draws 11 px, like the other two marks (`src/screens/24-project-overview/blocks/HeaderRow.styles.ts`). Recommendation: keep it. Changing it is one line | `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1), line 41 of the original |
| Does a screen reader read the name of the workspace menu twice on the web? The menu opens in a layer that the browser treats as a dialog. The accessibility checker reports a serious error when that dialog has no name, so the layer and the menu inside it both carry the name | Both carry the name. A real screen reader has not been used to measure the double reading. Recommendation: keep it | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), line 42 of the original; [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), line 1063 of the original |
| Is the new Vietnamese copy right? It is the menu load error with its retry button, the name of the retry button on the icon rail, the "My items" scope label (it replaced a label that clashed with "My focus"), and the "Search" label of the sidebar and top bar search boxes | The copy is in place. Recommendation: approve it as it stands | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), lines 43 to 47 of the original |
| Do the four accepted advisories of the Expo packages stay accepted? | They stay ignored by `pnpm audit --prod`, one reason for each, and a new advisory turns the gate red ([Accepted advisories and allowed licences](../../architecture/decisions/dependency-policy.md)). Recommendation: keep them until Expo ships a fix | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), line 48 of the original |
| Should the app rotate on tablets? The app locks portrait. An Android tablet held in landscape boxes the app into a strip about 600 dp wide that uses the phone layout, with the hint box of the system | It stays locked in portrait. Recommendation: allow rotation (`orientation: default` in `app.json`) before shipping to tablets, and check phones in landscape too | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), lines 211 to 215 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 309 to 311 and 340 to 341 of the original |
| Should the app support the iPad? `ios.supportsTablet` in `app.json` is off, so an iPad runs the app as a magnified iPhone with the phone layout, and the iPad has not been run | It stays off. Recommendation: turn it on together with rotation, then check on an iPad simulator | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), lines 216 to 218 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 240 to 242 and 340 of the original |
| Should the app get a dark theme? It has one light palette. In the system's dark mode only the picker of the operating system turns dark | The palette stays light. Recommendation: keep it | `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), lines 219 and 220 of the original; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 198 to 203 of the original |
| Should every page get its own browser tab title? Today every page has the same title, "Metis", taken from the app name in app.json (Expo Router sets no title per route) [Source: expo-router/build/ExpoRoot.js lines 65 to 67 and @expo/cli build/src/start/server/webTemplate.js line 57, the packages installed in metis-app, read 12 Oct 2026]; Plan B measured one title on five paths in Chromium and WebKit before the app was renamed. Success criterion 2.4.2 of WCAG, Page Titled, asks that each page have an informative title: "Each web page should include an informative `<title>` element, the content of which describes the page's content/purpose" [Source: MDN, Understanding WCAG, Operable, read 12 Oct 2026] | The title stays "Metis". The package records no recommendation | [Plan B](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 19920 to 19922 of the original; `metis-app/reports/review/review.md`, kept on the owner's machines and never committed (repositories design, section 6.1), line 35 of the original |
