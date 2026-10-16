---
title: Four Jest projects, and platform files only for real differences
summary: Jest runs four projects, render tests are named .test.native.tsx, Stryker gets a jsdom environment, and a platform file exists only when behaviour differs.
component: app
type: decision
status: current
ids: []
---

# Four Jest projects, and platform files only for real differences

## Context

Jest runs the unit and component tests for iOS, Android, the web and plain Node through four projects (`jest-expo`). Three measurements shaped how tests and platform files are arranged:

- React Native Testing Library renders only in the iOS and Android projects. In the Web and Node projects it throws `Text strings must be rendered within a <Text> component`. Pure modules run in all four [Source: measured when plan B was written].
- StrykerJS 10 (the mutation testing tool, see [Coverage 100, mutation 100, no unused code](machine-proven-code.md)) runs every project in one environment, taken from the top level of the Jest configuration (`@stryker-mutator/jest-runner/dist/src/jest-plugins/with-coverage-analysis.js:71`), which is node by default. Tests that use `localStorage`, `document` or `window` went red in its dry run, and a per-file `@jest-environment` docblock made Stryker report `Missing coverage results`. Stryker's time was the same either way, 16 seconds on `useOverview.ts` [Source: measured when plan B was written].
- The preset of React Native fakes a window of 750 px, which is the phone tier [Source: `node_modules/@react-native/jest-preset/jest/mocks/NativeModules.js`, as read in the narrow-widths plan].

The architecture review of 9 Oct 2026 also listed platform file pairs that differ by one value (`pointer.ts` and `fonts.*`).

## Decision

- **File suffixes pick the projects.** A pure TypeScript test is `x.test.ts` and runs on all four projects. A test that renders React Native components is `x.test.native.tsx` and runs on iOS and Android. A `*.test.web.*` test runs only in the Web project, and `.ios`, `.android` and `.web` tests run on that one platform.
- **Stryker environment.** The top level of `jest.config.js` sets `testEnvironment: 'jest-fixed-jsdom'`, so under Stryker all four projects run in jsdom.
- **Default window.** Component tests start from a desktop window of 1440 x 900, set in `src/window.test.setup.ts` for the iOS and Android projects only. A test that needs another width tier sets `Dimensions.set` itself.
- **Platform files only for real differences.** A file `X.ios.tsx`, `X.android.tsx` or `X.web.tsx`, with `X.tsx` as the default, exists only when the behaviour or the component really differs, like the native `Select`. Each such fork has its own test file (`X.test.ios.tsx`) and a comment with the measured reason. When only one value differs, branch in place, for example `const fingerOnly = Platform.OS !== 'web'`, and do not add a file pair.

## Consequences

- A render error that exists only on the web escapes Jest; the Playwright tests on the web catch it.
- Under Stryker all four projects run in jsdom.
- A platform file needs its own test file.
- The cleanup merged `pointer.ts` into `src/design-system/tier.ts`, one of the single-value forks that the review listed.

## Status

Current, rulings of plan B taken under FE-21 (R-B5, R-B16, D-B7) and of the narrow-widths plan (R-N10). The platform-file rule is a convention of the code cleanup run under FE-27 and FE-28.

## Sources

- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): R-B5 (lines 159 to 162 of the original), R-B16 (lines 202 to 204) and D-B7 (lines 253 to 259).
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N10 (lines 81 to 83 of the original).
- [Develop the app](../../components/app/develop.md), the page that was `apps/metis/CONTRIBUTING.md`: the file suffixes (lines 209 and 210 of the original) and the section on platform forks (lines 229 to 234).
- [Code review report](../../history/code-review/report.md): the light finding on one-value forks (line 408 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the merge of `pointer.ts` into `tier.ts` (lines 788 to 790 of the original).
