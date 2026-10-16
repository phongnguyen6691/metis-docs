---
title: React Native with Expo for web, iOS and Android
summary: One TypeScript codebase on React Native with Expo serves web, iOS and Android, chosen because it alone passed the rule that no device may rate poorly on performance.
component: app
type: decision
status: current
ids: []
---

# React Native with Expo for web, iOS and Android

## Context

On 5 Oct 2026 the owner approved the third part of the front-end design and added a requirement: the app must be designed so that it can be put on Android and iOS later, easily and with the least effort (FE-08). The owner then asked for one common base for web, iOS and Android (FE-09) and set a condition that became mandatory for the choice: the app must run with the best possible performance on all devices, mobile included, so no device may run poorly (FE-11).

In the same exchange the owner reopened the back-end language, so sharing TypeScript with the back end stopped being a criterion of the comparison (see [The API contract is the only coupling between app and back end](api-contract-only-coupling.md)).

A research note compared the directions on 5 Oct 2026, from facts it read the same day. Capacitor, React Native with Expo and Flutter were scored from 1 to 5 on six criteria. The scores are the research author's judgement, and performance had not been measured on real devices. Kotlin with Compose Multiplatform was dropped before scoring because its web target (Kotlin/Wasm) is only Beta [Source: https://kotlinlang.org/docs/multiplatform/supported-platforms.html].

| Criterion | Capacitor | React Native with Expo | Flutter |
|---|---|---|---|
| Stability | 4 | 4 | 4 |
| Scaling with little effort | 5 | 4 | 4 |
| Maintainability | 4 | 3 | 4 |
| Performance on phones | 3 | 4 | 5 |
| Performance on web | 5 | 4 | 2 |
| Fit for Metis on web (WCAG 2.2 AA, gates that measure the DOM, dense tables) | 5 | 4 | 2 |
| Mandatory: no device below 4 on performance | fails (phones 3) | passes | fails (web 2) |
| Total of the six criteria, for reference only | 26 | 23 | 21 |

## Decision

Use React Native with Expo as the common base for web, iOS and Android: one TypeScript codebase that runs natively on iOS and Android and builds real HTML for the web through React Native for Web.

Why it was chosen:

- It is the only direction with no device rated below 4 on performance.
- Capacitor has the highest total because of its web score, but on phones it runs the web interface inside a native frame, which rates 3 and fails the condition [Source: https://capacitorjs.com/docs].
- Flutter runs phones best, but on web it loads a renderer of about 1.5 MB and draws to a canvas, which rates 2 [Source: https://docs.flutter.dev/platform-integration/web/renderers ; https://github.com/flutter/flutter/pull/159314]. Its accessibility tree is available to screen readers on web only once it is switched on [Source: https://docs.flutter.dev/ui/accessibility/assistive-technologies ; https://github.com/flutter/flutter/issues/174016].
- React Native for Web builds real HTML: `role` maps to semantic tags and `aria-*` is supported [Source: https://necolas.github.io/react-native-web/docs/accessibility/], so the gates that measure the DOM still run on web.

The technology the spec fixed around it, with versions measured on 5 Oct 2026:

| Role | Choice |
|---|---|
| Common base | Expo SDK 57: React Native 0.86, React 19.2.3, iOS from 16.4, Android from 7 [Source: https://docs.expo.dev/versions/latest/] |
| Web | React Native for Web 0.21.3, exported as a single page (see [The web build is a single page](web-build-single-page.md)) |
| Routing | Expo Router 57.0.24 |
| Language | TypeScript in strict mode, 6.0.3 |
| Tooling | Node 24 LTS (24.15.0), pnpm 11.28.4 |
| Data shape checks | zod 4.6.5 |
| Mock server | MSW 2.15.0 (see [Screens call the real API; a mock server answers in mock builds only](mock-server-behind-real-api.md)) |
| Style | React Native `StyleSheet` with `tokens.ts` generated from `brand/tokens.css`; no NativeWind, because its version 5 is a pre-release [Source: https://www.nativewind.dev/], and no Tailwind (see [The brand tokens are the only source of sizes and colours](brand-tokens-source.md)) |
| Logo and icons | `react-native-svg`, loading the original SVG files, because expo-image does not draw SVG on web and has limits with some arc commands on iOS [Source: docs.expo.dev/versions/latest/sdk/image] |
| Fonts | `expo-font`, with the font files held in the repository |
| Dates, times and numbers | `Intl` |

What the choice changes in the design the owner had approved: one Expo app runs web, iOS and Android in place of a Vite web app; Expo Router is the router; the design system is built on React Native base components and still takes its text through props; React Aria Components remain only for heavy web-only screens, none of them in the first wave. What stays: the shapes of the shell and the overview screen, the mock data behind the zod contract, the typed translation layer, the `core/` folder and the intent of the six gates. On iOS and Android the gates gain Maestro flows that read the same screen contract and check accessibility labels. The first wave also runs the overview screen on the iOS Simulator and the Android Emulator.

## Consequences

- One codebase serves three platforms, and the phone layout is also the layout of the app.
- React Native has to be upgraded about every two months, with Expo absorbing most of the work, and the code base holds two component sets, native and DOM. Heavy web-only screens such as the tree table and the canvases are written in DOM inside the same repository.
- Expo SDK 57 supports React Native for Web 0.21, but that web project is run by the community.
- The performance scores are unmeasured. The first screen is signed only after performance is measured on a mid-range Android phone and an iPhone and the numbers are recorded (see [Prove one screen end to end before building more](acceptance-screen-first.md)).
- It rules out Capacitor, Flutter and Compose Multiplatform for the app, the Tailwind and NativeWind styling route, and the earlier browser-only stack ([Provisional web-only stack](web-only-react-dom-stack.md)).

## Status

Current, decided by the owner on 5 Oct 2026 (FE-09, with FE-08 and FE-11). The owner answered the research recommendation with "ok".

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 48, 50 and 51 of the original (FE-08, FE-11, FE-09).
- [Cross-platform research](../../history/specs/2026-10-05-cross-platform-research.md): lines 6 to 51 and 106 to 118 of the original (the conclusion, the two adjustments, the scores, what changes). The addresses cited above are from its lines 59 to 61, 73 to 74, 79, 88 to 89, 91 to 92 and 98, all read on 5 Oct 2026.
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 63 to 79 of the original (the technology table).
