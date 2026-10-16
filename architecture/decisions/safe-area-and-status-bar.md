---
title: Safe areas and a dark status bar on one light palette
summary: The shell and the drawer keep inside the safe-area insets, the status bar text is dark, and the app stays light when the phone is in dark mode.
component: app
type: decision
status: current
ids: []
---

# Safe areas and a dark status bar on one light palette

## Context

The spec says the app on a phone leaves the safe area of the notch and the navigation bar. The first plan for the narrow layouts (see [Three width tiers and 44 point touch targets](width-tiers-and-touch-targets.md)) left it to a later plan. On the iPhone 18 Pro simulator the status bar (62 points high) then covered the top bar, and Maestro's tap on the menu button hit the status bar instead. On Android the status bar was transparent with white text, so the time and the battery were invisible on a white page [Source: measured on the Android emulator, narrow-widths plan R-N31].

The app has a single light palette. Whether it should also follow the dark mode of the phone is not decided.

## Decision

- **Safe areas.** The frame of the shell and the panel of the drawer take their margins from `useSafeAreaInsets` (`safeArea` in `Shell.styles.ts`). The test `Shell.narrow.test.native.tsx` uses the measurements of the iPhone 18 Pro: a top inset of 62 and a bottom inset of 34.
- **Status bar text is dark.** The shell calls `StatusBar.setBarStyle('dark-content')` in an effect. It does not use the `StatusBar` component, because that component calls `clearImmediate`, which the jsdom environment of Stryker lacks; the first Stryker dry run failed with a `ReferenceError` [Source: measured, narrow-widths plan R-N31].
- **One light palette.** When the phone is in dark mode the app keeps its light background and the status bar text stays dark, and the pickers drawn by the operating system follow the dark mode and stay readable. The phone flow was run in dark mode on both iOS and Android to check this.

## Consequences

- The phone's dark mode does not change the app, except for the pickers that the operating system draws.
- Time and battery stay readable on Android over the white page.
- A dark theme is an open question for the owner. The review package of 10 Oct 2026 recommends keeping the single light palette and waits for the owner's answer.

## Status

Current, rulings of the narrow-widths plan (R-N27, R-N31), taken under FE-21 and measured on the simulators under FE-25 (9 Oct 2026). Whether the app gets a dark theme is an open question for the owner.

## Sources

- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N27 (lines 182 to 185 of the original) and R-N31 (lines 198 to 203).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the safe area on phones (lines 290 and 291 of the original) and the as-built note on the status bar text (line 791).
- `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1): the dark mode of the phone and the recommendation to keep the single palette (lines 219 and 220 of the original).
