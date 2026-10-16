---
title: Project structure
summary: The folders and files of the metis-app repository, what each one is for, and the one-way direction in which the folders of src import each other.
component: app
type: how-to
status: current
ids: []
---

# Project structure

The root of the `metis-app` repository is the app. There is no workspace of packages: a package would split out only when a second consumer exists (see [One app, no multi-package workspace](../../../architecture/decisions/one-app-no-package-workspace.md)). Paths on this page are relative to that root.

Read [React Native for web developers](react-native-for-web-developers.md) first for the vocabulary. The next page, [From command to screen](from-command-to-screen.md), follows one command through these folders.

## The repository root

| Path | What it is |
|---|---|
| `package.json` | The entry point (`"main": "expo-router/entry"`) and the scripts: `start`, `ios`, `android` and `web` run the app, `build:web` writes the web export, `verify` and `canary` run the checks, and each check has a `gate:*` script that `pnpm verify` runs in turn. `dependencies` are what the app uses while it runs; `devDependencies` are tools such as Jest, Playwright, Stryker and ESLint |
| `app.json` | The Expo config: name, the `metis` URL scheme, the bundle id and package `dev.metis.app`, icons, splash screen, the plugin list and the two experiments `typedRoutes` and `reactCompiler`. Prebuild reads it to generate the native projects. Its `expo-font` entry lists static fonts for Android only. `web.output` is `"single"`, which makes the web build a single-page app: one `index.html`, with paths handled in the browser [Source: docs.expo.dev/versions/latest/config/app, read 12 Oct 2026] |
| `babel.config.js` | One preset, `babel-preset-expo` |
| `metro.config.js` | The default Expo Metro config plus one change: `.svg` files are source code and go through `react-native-svg-transformer`, so a component such as `src/design-system/Logo.tsx` can import the brand SVG. `types/svg.d.ts` types that import |
| `tsconfig.json` | Extends `expo/tsconfig.base` and turns on `strict`, `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. It includes `.expo/types`, where the typed routes are written. TypeScript does not know platform suffixes: it always reads the plain file (see [Platform files](platform-files.md)) |
| `plugins/` | The app's own config plugin, `with-ios-scene-lifecycle.js`. During prebuild it edits `AppDelegate.swift`, adds `SceneDelegate.swift` and declares the scene in `Info.plist`. iOS 27 needs this scene lifecycle, and the plugin is to be dropped at Expo SDK 58 [Source: comment in plugins/with-ios-scene-lifecycle.js, read 12 Oct 2026] |
| `ios/` and `android/` | Not in the repository. Prebuild generates them and `.gitignore` leaves them out [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026]. To change the native part, edit `app.json` or write a plugin and generate again; do not edit these folders by hand |
| `public/` | Used by the web build only: `index.html` (the page template), fonts as `.woff2` files split into Latin and Vietnamese ranges, and `mockServiceWorker.js` of MSW, which `build:web` removes from the release export. `apple-touch-icon.png` is a byte copy of a pinned logo [Source: @expo/cli 57.0.27 start/server/webTemplate.js, which reads `index.html` from the public folder, read 12 Oct 2026] |
| `assets/` | Files Metro bundles as assets: the `.ttf` fonts (`assets/fonts/` for the variable fonts iOS loads, `assets/fonts/android/` for the static ones Android embeds) and `assets/brand/`, which holds byte copies of four pinned logo files |
| `pinned/` and `docs.lock` | Copies of the brand files and the wireframe manifest whose source is `metis-docs`; see below |
| `src/` | All the app code; see the next section |
| `e2e/` | `web/` holds the Playwright specs (those of screen 24 are in `web/24-project-overview/`); `native/` holds the Maestro flows |
| `scripts/` and `eslint-rules/` | The tooling of the checks: `verify.mjs` runs every `gate:*`, `gen-tokens.mjs` writes `tokens.ts`, `check-language.mjs`, `check-trace.mjs`, `check-licenses.mjs`, `check-web-release.mjs`, `serve-web.mjs`, `mutation.mjs`, `tree.mjs` (the stamp of the tree a check ran on), `workers.mjs` (how many workers Metro bundles with), `native-gate.mjs`, `canary.mjs` with the table `canaries.mjs`, `pinned.mjs`, and `test-floor.json`, the exact number of tests that must pass. `eslint-rules/` holds three lint rules of the app (`no-style-literals`, `no-restated-literals`, `stryker-disable-reason`) and `restrictions.js`, the lists of what lint forbids |
| `jest.config.js`, `playwright.config.ts`, `stryker.config.json`, `knip.jsonc`, `eslint.config.js` | The configuration of the test and lint tools. `jest.config.js` builds the four Jest projects (see [Testing](testing.md)) |
| `pnpm-workspace.yaml`, `pnpm-lock.yaml` | The pnpm settings (the hoisted layout, the approved build scripts, the list of reviewed audit advisories) and the lockfile. The repository is one package |
| `.github/workflows/check.yml` | The one workflow, at the root of the repository; see below |
| `README.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json` | A short quick start; the instructions for AI coding agents, which point to the documentation in `metis-docs`; one line that imports `AGENTS.md` into Claude Code; and the shared Claude Code settings, which list `../metis-docs` as an additional directory |
| `LICENSES.md`, `.nvmrc`, `.prettierrc`, `.prettierignore`, `.svgrrc` | The licences of the files the app carries; the Node version; the Prettier settings and ignore list; the settings of the SVG transformer |

## What `src` holds

The code of `src` is layered in one direction. A route file is thin and calls a screen; a screen uses the shell and the design system; all of them rest on `core`, the plain TypeScript that knows nothing about React Native. Two folders stand beside the chain: `platform` adapts the app to each platform, and `mocks` is the mock server.

| Folder | What it holds | Imports from the other folders of `src` | Imported by |
|---|---|---|---|
| `app/` | The Expo Router files, one per path. `_layout.tsx` wraps every page, `index.tsx` redirects, `+not-found.tsx` receives unknown paths. A page file only reads the URL parameters and hands them to a screen: `overview.tsx` calls screen 24, and every other page opens the shared "not built" page (`NotBuilt`) | `shell`, `screens`, `platform`, `core` | Expo Router, through the folder |
| `screens/24-project-overview/` | The only built screen (see below) | `design-system`, `core`, `shell`, `platform` | `app` |
| `shell/` | The frame around every page and the parts every screen shares (see below) | `design-system`, `core`, `platform` | `app`, `screens` |
| `design-system/` | The components built on `View`, `Text` and `Pressable`, the tokens and the width tiers (see below) | `core`, for the `Route` type only | `screens`, `shell` |
| `core/` | Plain TypeScript, without React, React Native, Expo or MSW: the API client (`fetch` plus `zod`), the data contracts, the route table, number and date formatting with `Intl`, and the typed dictionaries with `interpolate`, `plural` and `joined` | Nothing in `src` | Every other folder |
| `platform/` | The adapters per platform: `config.ts` (the API address and the page the app opens), `useStartup.ts` (the hook the root layout waits on) and three pairs of files for fonts, the mock server and storage | `core`; `mocks`, only inside the `EXPO_PUBLIC_MOCKS` check | `app`, `screens`, `shell`, `mocks` |
| `mocks/` | The mock server (MSW): handlers for the shell and the overview, the scenarios and the sample data in `fixtures/`. `fixtures/ids.ts` holds `IDS` and `PEOPLE`, the ids and people of the sample data, so every other file reads them from there | `core`, `platform` (for the API address) | `platform/mocks.ts` and `platform/mocks.web.ts`, and tests |

Tests sit beside the files they test, named `*.test.ts`, `*.test.native.tsx` and so on, and the shared test helpers are `*.test.helper.ts`.

ESLint enforces these boundaries with `import/no-restricted-paths` in `eslint.config.js`: `src/core` imports no UI, platform or mock layer; `src/design-system` depends on no app layer; only `src/platform` and tests import `src/mocks`; a screen never imports another screen. The [Screens section of Develop the app](../develop.md#screens) lists the whole rule set, and [Plain core, shared shell, layers enforced by lint](../../../architecture/decisions/layers-enforced-by-lint.md) records why.

### `screens/24-project-overview/`

- `Screen.tsx` chooses between a state (`StateView`, which draws loading and errors) and the content.
- `useOverview.ts` gets the data through the shared `useApi` hook.
- `model.ts`, with `model.lists.ts` and `model.tools.ts`, holds pure functions that turn the data into text and numbers already translated and formatted.
- `blocks/` holds the cards of the screen.
- `strings/` holds the `en` and `vi` dictionaries.
- `contract.yaml` is the screen's contract: the requirement codes, the controls and their effects. Reviewers read it, the browser tests read it at run time, and `gate:trace` reads its codes.

A screen never imports another screen, and its model imports no `src/shell` file. `Screen.tsx` composes the shell's models (the project header, the error states) with the screen's own model.

### `shell/`

- The frame: `AppFrame` (the providers and `Shell`, mounted by the root layout and by the tests alike), `Shell` (the layout by width, with the drawer), `Sidebar`, `Rail` (the icon column), `TopBar`, `MenuButton`, `ProjectHeader` (the header of every project page) and `NotBuilt`.
- State that belongs to the frame: `locale.tsx` (the language) and `workspace.tsx` (the open workspace).
- What every screen shares: `useApi` (the data hook), `useShell` (the shell's own request), `model.problem.ts` (`problemOf` turns an API error into a state to draw), `StateView`, and the shell dictionary with its shared `states` block.
- `model.ts` and `model.page.ts` are pure functions that build the sidebar, the top bar, the breadcrumb, the project header and the not-built page.

### `design-system/`

- The components, built on `View`, `Text` and `Pressable`: `Button`, `Card`, `Tile`, `Select`, `Dialog`, `Menu` and others. Each has its own `.styles.ts` file.
- `tokens.ts` is generated from `pinned/design/brand/tokens.css`, and `tier.ts` splits the width into three tiers (see [Styles and layout](styles-and-layout.md)).
- Shared building blocks exist once: `PressableLink` (the one place that puts a `Pressable` under `Link asChild`), `Row` (a horizontal row with a gap taken from the tokens) and `PendingAction` (an action this build does not have yet: a label and a tag, nothing to press).
- Three files are split by platform, `Select.ios.tsx`, `Select.android.tsx` and `fontFace.android.ts`. `fonts.ts` differs by one value between the apps and the web, so it branches on the spot.

## Pinned design files

`pinned/` holds copies of files whose source is `metis-docs`: the brand tokens, the brand logos and the wireframe manifest. `docs.lock` names the sha256 of each copy. `gate:tooling` fails when a copy differs from its hash, so a change to these files starts in `metis-docs`, never in `pinned/`. The code reads the copies: `scripts/gen-tokens.mjs` writes `src/design-system/tokens.ts` from `pinned/design/brand/tokens.css`, and `src/core/routes.ts` gives each destination its screen number, which a test in `src/core/routes.test.ts` checks against `pinned/design/wireframes/manifest.json`. A test in `scripts/brand-files.test.mjs` checks that `assets/brand/` holds, byte for byte, the logo files of the same name from `pinned/design/brand/logo/`.

## The workflow at the root

`.github/workflows/check.yml` is the only workflow. Every job runs `pnpm verify`, so no check lives only in CI, and the work that needs macOS stays on a Mac. A newer run on the same ref cancels the one still going, and no job runs on a schedule, to spare the free minutes of a private repository.

| Job | When it runs | What it runs |
|---|---|---|
| `fast` | Each push to `main`, or by hand | The fast group of checks: `pnpm verify --only tokens,types,lint,language,format,deadcode,tooling,trace,unit` |
| `full` | Each pull request | Every check, with mutation testing limited to the source files the pull request changed (`MUTATION_BASE`) |

No job runs every canary or the full mutation run: they are the full runs, for a sandbox CI the owner is to set up, and until it exists they are started by hand at night (see the Gates section of [Develop the app](../develop.md#gates)).

`gate:native` needs macOS and an iOS Simulator; elsewhere it records `skipped (macOS only)`. The checks themselves are described in [Testing](testing.md) and in the Gates section of [Develop the app](../develop.md#gates).

## Related decisions

- [One app, no multi-package workspace](../../../architecture/decisions/one-app-no-package-workspace.md)
- [Plain core, shared shell, layers enforced by lint](../../../architecture/decisions/layers-enforced-by-lint.md)
- [The web build is a single page](../../../architecture/decisions/web-build-single-page.md)
- [The brand tokens are the only source of sizes and colours](../../../architecture/decisions/brand-tokens-source.md)
- [CI runs `pnpm verify`; macOS work runs on a Mac; every run leaves a record](../../../architecture/decisions/where-checks-run.md)
