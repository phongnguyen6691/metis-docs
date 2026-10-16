---
title: What each test layer proves; a request that leaves the mocks fails
summary: Design-system tests prove looks, shell and screen tests prove content by testID, and a browser spec fails on any request that the mock server did not answer.
component: app
type: decision
status: current
ids: []
---

# What each test layer proves; a request that leaves the mocks fails

## Context

The code review of 9 Oct 2026 found three weaknesses in a suite that had 100% coverage and 100% mutation score:

- Three field-swap bugs on screen 24 passed all 704 related tests: the Delayed tile painted red by its change against the baseline, the Delayed tile showing that change instead of the number of late items, and the risk card counting the high-risk metric instead of the list total. The demo data had equal numbers in each pair (2 and 2, 4 and 4), and Stryker has no mutator that swaps field names [Source: code review report, finding 5].
- A request that escaped the mock server (see [Screens call the real API; a mock server answers in mock builds only](mock-server-behind-real-api.md)) was invisible to 60 of 75 browser tests: on the web the mock server ran with `onUnhandledRequest: 'bypass'` and `quiet: true`, so a request without a handler went to the real network without a log. One such leak had been seen once (`ERR_NAME_NOT_RESOLVED` in `routes.spec`) and its diagnosis postponed (finding 6).
- Mirror tests copied the style keys of the code under test: 125 `toHaveStyle` assertions in the shell, and on screen 24 119 `toHaveStyle` assertions and 89 lines that walk the element tree, mostly re-asserting the inner style of the design system. A change to the Banner of the design system would turn red the tests of every screen with a Banner (finding 17).

## Decision

**Test layers.**

- The tests of the design system prove how a component looks. They may walk the element tree of their own component (55 such places were kept), because a component owns its structure and a `testID` inside it would widen its API only for tests.
- The tests of a screen or of the shell prove what they put into a component: content, links, roles, accessible names and the layout they set themselves. They find elements by `testID`. They do not re-assert a style of the design system and do not walk the tree (`.parent`, `.children`, child indexes).
- A layout rule that the shell sets has a Jest assertion by `testID` in the shell area: the padding of the sidebar, the nesting of the project tree, the padding of the "not built" page, the frame height of the session dialog. The shell has a table of every style property with its reason and a test that holds the table, and screen 24 has the same for its style properties and for the layout and look props it passes to the design system.
- A block test asserts the props that a block passes to a design-system component through a pass-through spy, `jest.fn(actual.X)`: the real component still draws and the test reads its props. `rendersOf` and `looksOf` live in `src/spy.test.helper.ts`, so a block test does not load `AppFrame`, the routes or MSW. A tone that does not change with the data is a decision of the block's look, not data of the model.
- Every screen has a data variant in which every numeric field differs (`distinct(data)`), so reading the wrong field fails. A "must not appear" assertion uses the same expression as its positive twin. Waiting time is never the assertion.

**Network guard in the browser specs.**

- Every browser spec imports `test` and `expect` from `e2e/web/test.ts`, and lint rejects an import from `@playwright/test`. That `test` carries an automatic fixture that fails a test, naming the URL, when a request leaves the mock server. It also fails a test on a page error that the test did not declare, and on a declared page error that does not appear.
- A route intercept of the page for the API host names every request that left the mock server, at the moment of interception. The exemption by error text applies only to API requests that the intercept does not see (the service worker had already answered, Chromium cancels unread 4xx and 5xx bodies, WebKit cancels at navigation) and to requests to the origin of the app [Source: code cleanup plan, rulings 64 and 67]. A request to a host that is neither the origin of the app nor the API host is named as soon as the page sends it and always fails the test. The intercept turns the HTTP cache of Playwright off.
- Known limit: a request to a third host that is still pending on the page of the app when the test ends is not named. No third host exists today.

## Consequences

- Changing a style in the design system no longer turns red the tests of every screen that uses the component.
- Reading a wrong numeric field fails even where two fields are equal in the demo data.
- A leaked request fails the test and is named with its URL.
- The shell and screen 24 each carry a table of style properties, held by a test.

## Status

Current, rulings of the code cleanup plan taken under FE-28, in the cleanup that the owner approved on 9 Oct 2026 (FE-27).

## Sources

- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): the constraint on test layers (line 23 of the original); rulings 39, 41, 42, 44, 45, 46, 47, 63, 64, 67 and 71 of its table of rulings (lines 1016, 1018, 1019, 1021, 1022, 1023, 1024, 1040, 1041, 1044 and 1048); the guard as built (line 777).
- [Code review report](../../history/code-review/report.md): findings 5 and 6 (lines 172 to 195 of the original) and finding 17 (lines 306 to 319).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the test layers, the data variant and the rule against disabled tests (lines 513 to 522 and 542 to 547 of the original).
