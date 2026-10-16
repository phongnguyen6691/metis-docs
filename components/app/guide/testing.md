---
title: Testing
summary: How one test suite runs in four Jest projects, which projects run a test file by its name, and the browser tests, native flows and gates beyond Jest.
component: app
type: how-to
status: current
ids: []
---

# Testing

`jest-expo` runs one test suite in four Jest projects: iOS, Android, Web and Node. Each project simulates a platform and picks files by suffix, as Metro does. The name of a test file decides which projects run it. No simulator is needed: component tests run in Node, and the preset mocks the native part [Source: docs.expo.dev/develop/unit-testing, read 12 Oct 2026].

Paths are relative to the root of `metis-app`. The previous page, [Data flow](data-flow.md), describes the code these tests exercise. For the rules every test follows, see the [Tests section of Develop the app](../develop.md#tests).

## Which projects run a test file

| File name | iOS | Android | Web | Node |
|---|---|---|---|---|
| `*.test.ts` | yes | yes | yes | yes |
| `*.test.native.ts` or `*.test.native.tsx` | yes | yes | no | no |
| `*.test.ios.ts` or `*.test.ios.tsx` | yes | no | no | no |
| `*.test.android.ts` or `*.test.android.tsx` | no | yes | no | no |
| `*.test.web.ts` or `*.test.web.tsx` | no | no | yes | no |

The preset for Node of jest-expo also matches `*.test.web.*`; the app filters that suffix out of its Node project, because those tests need `localStorage` and `document` from jsdom (the filter in `jest.config.js`). Inside the iOS project, `import './Select'` resolves to `Select.ios.tsx`, so `Select.test.ios.tsx` tests the iOS version. Each project resolves files by suffix in a fixed order: iOS tries `.ios` then `.native` then the plain file, Android `.android`, `.native`, plain, Web `.web` then plain, and Node `.node`, `.web`, plain [Source: jest-expo 57.0.5 config presets (`getIOSPreset`, `getAndroidPreset`, `getWebPreset`, `getNodePreset`), read 12 Oct 2026].

Examples from the repository:

| File name | Projects that run it | Why |
|---|---|---|
| `src/core/format.test.ts` | All four | No platform suffix; pure code such as `src/core` has no platform |
| `src/screens/24-project-overview/blocks/TileRow.test.native.tsx` | iOS and Android | `.native` is the suffix of component and hook tests |
| `src/design-system/Select.test.ios.tsx` | iOS only | It tests `Select.ios.tsx` |
| `src/design-system/Select.test.android.tsx` | Android only | It tests `Select.android.tsx` |
| `src/platform/storage.test.web.ts` | Web only | It needs `localStorage`; the Node project does not run it |
| `src/design-system/Select.test.helper.ts` | None | A helper, not a test: the name does not end in `.test.ts` |
| `src/window.test.setup.ts` | None | A setup file that the iOS and Android projects load |

The four projects are built in `jest.config.js`:

```js
  projects: [
    project(getIOSPreset(), native(getIOSPreset())),
    project(getAndroidPreset(), native(getAndroidPreset())),
    // jsdom plus Node's fetch, Response, TextEncoder and streams
    project(getWebPreset(), { testEnvironment: 'jest-fixed-jsdom' }),
    // Only the Web project runs *.test.web.*; a per-file jsdom docblock hides coverage from Stryker
    project(getNodePreset(), {
      testMatch: getNodePreset().testMatch.filter((glob) => !glob.includes('.web.'))
    })
  ],
```

A component test, from `src/screens/24-project-overview/blocks/TileRow.test.native.tsx`. Its name starts with the requirement codes it proves, and `gate:trace` reads those codes:

```tsx
test('OVW-01 BR-32 each tile links to the route of the model and reads its label, number and second line', async () => {
  const tiles = tilesOf()
  await render(<TileRow tiles={tiles} />)

  for (const tile of tiles) {
    const element = screen.getByTestId(`tile-${tile.id}`)
    expect(element).toHaveProp('role', 'link')
    expect(element).toHaveProp('href', hrefOf(tile.route))
    for (const text of textsOf(tile)) expect(within(element).getByText(text)).toBeOnTheScreen()
  }
})
```

## Beyond Jest

- **Playwright** runs `e2e/web/*.spec.ts`, and the specs of screen 24 in `e2e/web/24-project-overview/`, on the web export that includes the mock server (`dist-e2e`), in Chromium and WebKit. A static server on port 5310 (`scripts/serve-web.mjs`, started by `playwright.config.ts`) serves the export. Every spec takes `test` and `expect` from `e2e/web/test.ts`, the guarded version: a request that leaves the mock server, a request to a third host or an undeclared page error turns the test red. `testID` becomes `data-testid`, which Playwright locates by default [Source: playwright.dev/docs/locators, read 12 Oct 2026].
- **Maestro** runs the flows of `e2e/native/`. `smoke.yaml` and `phone.yaml` run on the iOS Simulator under `gate:native`; `phone.yaml` also runs on an Android emulator, and `tablet.yaml` on an Android tablet emulator (the comments of the flows). A flow opens the app `dev.metis.app`, points a debug build at Metro on port 8091, waits for the project header (`id: project-header`) and checks the `testID`s. Maestro maps a `testID` to an `id` [Source: docs.maestro.dev/platform-support/react-native, read 12 Oct 2026]. Under `pnpm verify`, `gate:native` builds a Release build for the iOS Simulator, with the JavaScript bundle inside the app and no Metro, runs `smoke.yaml` and `phone.yaml` on the simulator `iPhone 18 Pro` and shuts the simulator down whatever the result. Off macOS the gate records `skipped (macOS only)`, which is neither green nor red (`scripts/native-gate.mjs`).
- **`pnpm verify`** runs every `gate:*` script in the order of `package.json`, and goes on after a red gate. It writes the record `reports/verify.json` and draws `reports/verify.md` from it: one row per gate, and each row names the tree of files it ran on (`scripts/verify.mjs`). `scripts/test-floor.json` holds the exact number of tests that must pass in Jest and in Playwright, and the number of Playwright runs that are expected to fail. A different number, or a skipped test, turns the gate red.

A Maestro flow, `e2e/native/smoke.yaml`:

```yaml
appId: dev.metis.app
---
- launchApp:
    clearState: true
    arguments:
      RCT_jsLocation: 'localhost:8091'
# The project header draws only once the mock data of screen 24 has arrived.
- extendedWaitUntil:
    visible:
      id: 'project-header'
    timeout: 60000
- assertVisible:
    id: 'overview'
- takeScreenshot: overview
```

`RCT_jsLocation` is a key that React Native reads to find the bundle of a debug build [Source: react-native 0.86.3 React/Base/RCTBundleURLProvider.mm, read 12 Oct 2026].

## The gates

`pnpm verify` runs these scripts, in this order:

| Gate | What it checks |
|---|---|
| `gate:tokens` | `src/design-system/tokens.ts` matches `pinned/design/brand/tokens.css` |
| `gate:types` | `tsc` for the app and for `e2e` |
| `gate:lint` | ESLint, with no warning, including the three local rules and the lists of `eslint-rules/restrictions.js` |
| `gate:language` | Code, comments, test titles and tool output are English; Vietnamese only in the `vi` dictionaries |
| `gate:format` | Prettier |
| `gate:deadcode` | knip: files, exports and packages that nobody uses |
| `gate:tooling` | `node --test` for the scripts and the lint rules, with 100% coverage; the check of the pinned copies is among them |
| `gate:trace` | Every requirement code in a screen's contract has a running test that carries the code, in the screen's own folders |
| `gate:unit` | Jest in four projects, 100% coverage, and the number of passed tests equal to the floor |
| `gate:mutation` | Stryker changes the code on purpose, and the tests must catch every change |
| `gate:deps` | `pnpm audit --prod` and the licences of the packages |
| `gate:web` | Builds the export with the mock server, runs Playwright, then builds the release export |
| `gate:native` | The Maestro flows on the iOS Simulator against a Release build; macOS only |

The Gates section of [Develop the app](../develop.md#gates) explains each one in full. The decisions behind them are [A screen is done when its gates pass, each proven able to fail](../../../architecture/decisions/gates-with-canaries.md), [Four Jest projects, and platform files only for real differences](../../../architecture/decisions/jest-projects-and-platform-forks.md) and [What each test layer proves; a request that leaves the mocks fails](../../../architecture/decisions/test-layers-and-network-guard.md).

## Try it

Run one file in all four projects: `pnpm exec jest src/core/format.test.ts`. Jest lists the file once per project, iOS, Android, Web and Node, and ends with the line `Ran all test suites matching /src\/core\/format.test.ts/i in 4 projects.` (measured on 12 Oct 2026).

## Check yourself

How many times does `src/core/format.test.ts` run in `pnpm gate:unit`?

1. 1
2. 2
3. 3
4. 4

<details>
<summary>Answer</summary>

Option 4. The name has no platform suffix, so it matches all four Jest projects: iOS, Android, Web and Node. The run in the Try it section above lists the file four times.

</details>
