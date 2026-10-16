---
title: Name, bundle id, icons and splash
summary: The app is named Metis with the bundle id dev.metis.app, and its logo, icons and splash screen come from the brand files.
component: app
type: decision
status: current
ids: []
---

# Name, bundle id, icons and splash

## Context

The Expo template ships its own name, icons and splash screen: the sample icon on iOS and Android, a blue splash with the Expo logo, and the lowercase name "metis" under the icon. The spec asks for the app icon to be the right file and for the word "Metis" never to be typed in a font where a logo belongs; the logo is drawn from the original SVG file, copied byte for byte. `expo prebuild` also needs a bundle id. The probe of 5 Oct 2026 used `dev.metis.spikec`, so a real id had to be chosen.

## Decision

- **Name.** The app is named "Metis", with a capital letter. The generated iOS project follows: `ios/Metis.xcworkspace` and the scheme `Metis`.
- **Bundle id.** `dev.metis.app`, for `ios.bundleIdentifier` and `android.package`. It is a working choice, and the owner was asked whether it matches the name of the owner's organisation.
- **Logo.** The logo is drawn by `react-native-svg-transformer` from `assets/brand/metis-wordmark.svg`, a byte copy of the brand file `metis-wordmark.svg`. This needs the `.svgrrc` setting `{"svgo": false}`, because SVGO breaks this file [Source: probe of 5 Oct 2026, plan B D-B4]. On the web the probe gave 6 paths whose `d` equals the original character by character, at 68.58 x 24. Under Jest a `.svg` file becomes a stand-in component, through `scripts/jest-svg.cjs`, that records the file path and the number of paths.
- **Web icons.** The favicon is a byte copy of the brand file `metis-favicon-48.png`, and the 180 px web app icon is copied byte for byte from the brand logo files, with a test that it loads.
- **iOS icon.** The square variant, `metis-app-icon-square`. Expo flattens an app icon that is already rounded onto a white background [Source: measured, pixel 2,2 of the iOS icon was white, narrow-widths plan R-N35].
- **Android icon.** An adaptive icon with an ink-coloured background. Its foreground is the M and the diamond scaled to two thirds around the centre (`metis-app-icon-android-foreground`), because with the whole app icon as the foreground the circular mask cuts the foot of the M: a corner of the letter is 45 dp from the centre and the visible circle has a radius of 36 dp [Source: measured, narrow-widths plan R-N35].
- **Generated files.** The brand tool `design/brand/tools/platform-icons.mjs` of `metis-docs` produces the two icon variants, their byte copies sit in `assets/brand` of the app, and `scripts/brand-files.test.mjs` checks them.
- **Splash.** An ink-coloured background with the foreground layer of the Android icon, `imageWidth` 200, instead of the blue background and the Expo logo.

## Consequences

- Changing the bundle id after release would make a different app on real devices and in the stores [Source: plan B, D-B33, lines 339 to 341 of the original].
- The bundle id is an open question for the owner: whether `dev.metis.app` is the right name of the owner's organisation, to be answered before the app is released.
- Every icon is derived from the brand files, so a new brand icon means generating and copying the variants again.

## Status

Current, rulings of plan B (D-B4, D-B25, D-B33) and of the narrow-widths plan (R-N35 to R-N37), taken under FE-21 and, for the icons, under FE-25 (9 Oct 2026). The bundle id is an open question for the owner (spec section 13, before the app is released; question 12 of the review package).

## Sources

- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): D-B4 (lines 240 to 245 of the original), D-B25 (lines 317 to 319) and D-B33 (lines 339 to 341).
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N35 to R-N37 (lines 227 to 238 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the logo and the icons (lines 316 to 318 of the original), the open question on the bundle id (line 716) and the as-built note on the icons, the name and the splash (lines 778 to 784).
- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): the web app icon of 180 px in FE-25 (line 65 of the original).
- `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1): question 12 on the bundle id (lines 463 and 464 of the original).
