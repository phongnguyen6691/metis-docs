---
title: Required platforms, browser gate and native gate
summary: Which browsers and devices must work, and the two gates, gate:web and gate:native, that prove it.
component: app
type: decision
status: current
ids: []
---

# Required platforms, browser gate and native gate

## Context

On 5 Oct 2026 the owner found that the design did not cover browser compliance. The owner's answer, translated: at least Chrome and Safari must be supported well, and Android and iOS must also be covered by automated tests (FE-14). What can be automated is limited by the tools:

- Playwright drives branded Chrome, but it does not work with branded Safari, and its phones are emulation only [Source: https://playwright.dev/docs/browsers].
- Real Safari is driven by WebDriver through `safaridriver`, which ships with macOS and can run Safari in the iOS Simulator, one Safari session per machine at a time [Source: https://developer.apple.com/documentation/safari-developer-tools/webdriver]. A Safari opened by hand rejects automated sessions, and the Safari of the iOS 27 Simulator has no Remote Automation switch [Source: measured on 5 Oct 2026, spec section 8.3].
- Maestro runs flows on the Android Emulator, on real Android devices and on the iOS Simulator, not yet on a real iPhone [Source: foundation spec, section 8.3]. The trial of 5 Oct 2026 ran on the iOS Simulator and the Android Emulator of the Mac only.
- No stable tool measures iOS performance automatically; it is measured with Xcode Instruments before a release [Source: brainstorm log, section 10.5].
- The Expo SDK in use runs from iOS 16.4 and Android 7 [Source: https://docs.expo.dev/versions/latest/].

The code review of 9 Oct 2026 found that the web check "text laid out like iOS and Android" is a CSS emulation and that no gate ran a native flow, although the spec put one in `pnpm verify` (finding 21 of the report).

## Decision

**Required platforms.** A failure on one of them blocks merge. "Supported well" means the screen's gates are green on every one of them:

- Chrome on desktop, the two latest major versions.
- Safari on macOS, the two latest major versions.
- Safari on iPhone, the two latest iOS versions.
- Chrome on Android, the two latest versions.
- The iOS app, from iOS 16.4.
- The Android app, from Android 7.

Edge and Firefox on desktop, the two latest major versions, are supported but do not block merge.

**Compatibility in the code.** `browserslist` lists exactly the web browsers above, and `eslint-plugin-compat` turns lint red when the code uses a web API that a listed browser lacks. Unit and component tests run on every platform through `jest-expo/universal` (iOS, Android, web and Node).

**Browser gate.** `gate:web` runs the Playwright tests on Chromium and WebKit and then builds the release bundle. It is a gate of `pnpm verify` because a run took 41 to 43 seconds, under the 90 seconds that rule R-B10 allowed; at 90 seconds or more it would have been a separate command, `pnpm check:web`. CI installs the two browsers with `pnpm exec playwright install --with-deps chromium webkit`; that step has not run on the `ubuntu-24.04` runner yet [Unverified - confirm before applying]. The keyboard test on WebKit presses `Alt+Tab`: the `Tab` key of WebKit skips links and `button` elements and stops only at elements with `role="button"` and `tabindex="0"`, while `Alt+Tab` visits all of them, like Option+Tab in Safari [Source: measured when plan B was written, D-B36].

**Native gate.** `gate:native` needs macOS with Xcode, an iOS Simulator named `iPhone 18 Pro` (the newest runtime that has one), Maestro and a JDK. It builds the iOS app in the Release configuration, boots the simulator, installs the app, runs the Maestro flows `e2e/native/smoke.yaml` and `e2e/native/phone.yaml`, and shuts the simulator down whatever the result. Off macOS it exits 78 and `pnpm verify` records `skipped (macOS only)`, a row that is neither green nor red. `gate:native` and `verify` each declare the exit code 78 themselves, with a comment naming the other, because a shared module for one number is not worth it. Maestro is a Java program and needs `JAVA_HOME=/opt/homebrew/opt/openjdk@21` on the owner's Mac, even for iOS [Source: code cleanup plan, ruling 59]. The gate has no canary: it is listed in `NO_CANARY` with its reason (the rule is in [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md)), since a canary would need a Release build and a simulator boot each time, and its flow was proven red once by hand with a wrong `testID`.

## Consequences

- Real Safari is not automated yet. WebKit under Playwright stands in for Safari on macOS and on iPhone, and how to automate Safari on an iPhone is an open question of the spec (section 13). Edge and Firefox are not run in CI yet.
- `gate:native` covers the iOS Simulator only. The Android flows (`phone.yaml`, `tablet.yaml`) are run by hand on emulators.
- The native gate runs only on a Mac, so it is proven by the `pnpm verify` record made there, not by CI (see [CI runs pnpm verify; macOS work runs on a Mac; every run leaves a record](where-checks-run.md)).
- The two native flows check that elements show; they do not measure text that leaves its frame. Overflow on iOS and Android is measured only by the CSS emulation in `gate:web`, whose 32 tests were renamed to say what they measure, and the review package keeps native layout checking as an open item.
- Performance on iOS has no automated measure.

## Status

Current, decided by the owner on 5 Oct 2026 (FE-14). The supported list sits in the spec the owner approved (FE-16) and in the test design the owner approved (FE-13), both on 5 Oct 2026. The form of the two gates follows rule R-B10 of plan B and the code cleanup plan, run under FE-21 and FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-13, FE-14 and FE-16 (lines 53, 55 and 56 of the original), and section 10.5 (lines 438 to 482 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): section 8 (lines 428 to 463 of the original), the pull request rhythm (line 622), `gate:native` as built (lines 641 to 651) and the open question on Safari on iPhone (line 704).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): rule R-B10 (lines 178 to 180 of the original), D-B36 (lines 356 to 358), and the measured run time with the two gate forms (lines 17835 to 17856).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): rulings 58, 59 and 69 of its table of rulings (lines 1035, 1036 and 1046 of the original) and the renaming of the emulation tests (line 783).
- [Code review report](../../history/code-review/report.md): finding 21 (lines 348 to 356 of the original).
- `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1): item 1 of the missing or unchecked list (line 11 of the original).
