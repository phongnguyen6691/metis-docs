---
title: Screens call the real API; a mock server answers in mock builds only
summary: Screens call the API as if a real server existed, a mock server answers only in mock builds on web, in Jest and on native, and no release build carries any trace of it.
component: app
type: decision
status: current
ids: []
---

# Screens call the real API; a mock server answers in mock builds only

## Context

The first wave of the new front end builds no back end, and its data is hand-written mock data. The screens must still call the API exactly as they will call a real server, so that nothing in a screen changes when the back end arrives.

The mock server is MSW (Mock Service Worker, a library that answers API calls with prepared data, both in the browser and in tests), as the 4 Oct 2026 spec had chosen. Four forces shaped how it is wired:

- Web and native cannot share one mechanism. The package that was meant to run MSW on iOS and Android, `@msw/react-native`, could not be used, and MSW 3 dropped the on-app runner `msw/native`, so version 2 is pinned [Source: trial builds of 5 Oct 2026, recorded in section 2 of the foundation spec].
- A trial export made right after an export with the mock server, without clearing the cache, shipped a release build that still carried the mock server.
- Only three fake projects exist, which cannot reach every state a screen has to show.
- A release must hold none of it.

## Decision

1. No real server and no metric engine exist in the app. Screens call the API as with a real server and the mock server answers in its place; when the back end exists the mock server is switched off and no screen is edited.
2. Mock handlers and fake data live in `src/mocks/` and are shared by every platform: MSW 2.15.0 answers on web (a service worker in development) and in Jest (`msw/node`); on iOS and Android a layer in `src/platform/` calls the handlers directly, not through the network. Screens do not change between them.
3. The mock server starts on web only when `EXPO_PUBLIC_MOCKS` equals `'1'`, started from `src/platform/`. The `pnpm web` command sets the variable, so one command shows the data (R-B20).
4. On iOS and Android, before `require('msw')`, the layer defines empty classes for `Event`, `EventTarget`, `MessageEvent` and `BroadcastChannel` when they are missing. Without them `require('msw')` throws `ReferenceError: Property 'MessageEvent' doesn't exist`, then the same for `'BroadcastChannel'`, and the app draws nothing (measured on the Android Emulator); with them the Android Emulator and the iOS Simulator both show the Meridian data. MSW 2's core only inherits or creates these classes at load time, in its WebSocket and server-sent-events part, and the mock server on the app answers HTTP only [Source: `node_modules/msw/lib/core/ws.js:32` and `node_modules/@mswjs/interceptors/lib/browser/interceptors/WebSocket/index.cjs:35`, as cited by the plan that measured it]. No polyfill package is added (D-B34).
5. Every web export uses `expo export --clear`.
6. A release build holds no mocks. The dead-code gate and a test on the web build prove that `src/mocks/` is absent, and a release-check script proves that the export holds no MSW code, none of the fake-data strings and no worker file (R-B20).
7. Every state of a screen can be viewed through a scenario on the address, `?mock=<name>`, read once when the page loads: `loading`, `sessionExpired`, `serverError`, `invalidData`, `partial` and `unknown` (R-B3), and `longLists`, which gives each of the three attention lists a total larger than the number of rows sent, so the "+ N more" line of all three shows and can be measured in the browser (R-T6). Three fake projects in the shell tree give the other states: Meridian CGI Campaign with full data per the wireframe of screen 24, Northwind Showroom VR with no baseline and stale data, and Spring Catalogue Renders, which answers 403. An unknown project code answers 404. The read-only state has no field in the contract yet, so it is not drawn.
8. A request that leaves the mock server in a mock build is a bug, and a flaky run counts as red. A flaky browser test of `e2e/web/routes.spec.ts` was one such case. Its cause was measured: on `beforeunload` MSW tells the service worker that the page has closed, the service worker then sends that page's requests to the network, and the shell's request started after the first paint, at +169 ms, just after `beforeunload` at +167 ms [Source: measured in the final fix wave of the code-cleanup plan]. The fix is in `src/platform/mocks.web.ts` and covers every route: 0 of 100 repeated runs went red, and 2 of 60 went red with the fix removed.

## Consequences

- Screens never know whether the API is real, so moving to the real back end is a change of configuration and not of screens.
- Each web export is a few seconds slower because of `--clear`, and `pnpm web` depends on one environment variable.
- If a later MSW version really uses one of the four empty classes at load time, the native smoke run goes red and names the class.
- The mock server on the app answers HTTP only.
- The mock server holds no metric rules: what a screen shows is what the mock answers (see [The app never computes a metric or a drill filter](metrics-are-server-snapshots.md)), and the shape of the answers is the API contract ([The API contract is the only coupling between app and back end](api-contract-only-coupling.md)).

## Status

Current. The owner approved a front end that calls the API with a mock server answering in its place on 5 Oct 2026, with the first part of the design (FE-06). The build rules are rulings of the plans of 5 to 10 Oct 2026, taken under FE-17, FE-21, FE-24 and FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 113 to 126 of the original (the design part approved as FE-06: mock server and hand-written data).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 74 and 157 to 170 of the original (the MSW pin, the mock server on each platform, `--clear`, the three fake projects, the release build).
- [Foundation plan](../../history/plans/2026-10-05-frontend-foundation.md): lines 107 to 108 of the original (`--clear`, measured).
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 150 to 155 (R-B3), 217 to 219 (R-B20) and 342 to 350 (D-B34) of the original.
- [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md): lines 42 to 43 of the original (R-T6).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 1066 of the original (row 89 of its table of rulings) and line 929 (the measured cause and the fix).
