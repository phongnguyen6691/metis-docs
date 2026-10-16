---
title: Self-hosted fonts per platform
summary: The three typefaces are self-hosted with no third-party host, six font-face rules on the web, variable files on iOS and nine static files on Android.
component: app
type: decision
status: current
ids: []
---

# Self-hosted fonts per platform

## Context

The brand uses Newsreader, Inter and Manrope. They are kept in the repository and nothing calls Google Fonts at runtime. The files must cover Latin and Vietnamese letters on every platform. Each platform needed its own loading path:

- On the web, Google Fonts lists the `cyrillic-ext` block before `latin` for Inter and Manrope, so taking the first file takes the wrong block; the blocks have to be chosen by name [Source: measured on 5 Oct 2026, brainstorm log, lines 102 to 104 of the original]. The package `expo-font` writes one face per font name on the web and drops the second block, and Vietnamese text then fell back to Georgia [Source: measured when plan B was written, R-B17].
- On Android the three files are variable fonts, one file holding every weight, and React Native draws only the default weight of the file: 200 for Manrope, 400 for Inter and Newsreader. The thickness of strokes divided by the height of the text, iOS against Android before the fix, was 0.111 and 0.071 on a button, 0.103 and 0.038 on a tab, and 0.177 and 0.130 on the number of a metric tile [Source: measured on screenshots of the iOS Simulator and the Android emulator, R-N32].
- Below Android 9, React Native tells only regular from bold 700 inside one family (`ReactFontManager.kt`, `TypefaceStyle.apply` uses `nearestStyle`), so an XML family with several weights draws 500 and 600 with the 400 file [Source: code read and measured on an Android 7.0 emulator, R-N44].
- The code review of 9 Oct 2026 found two Android places that bypassed the weight handling: the numbers of `BarRow` and the sentences of `StatePanel` called `textStyle(...)` bare, and only `Text.tsx` wrapped `fontFace` (finding 14).

## Decision

- **Web.** Six `@font-face` rules in `public/index.html`, with the files in `public/fonts/`, so no font comes from a third-party host at runtime. The `latin` and `vietnamese` blocks are two separate faces with a `unicode-range`, chosen by block name. Newsreader uses the optical size of the heading (the size 30).
- **iOS.** `expo-font` loads the full-character variable files; iOS and the web keep the variable files.
- **Android.** Nine static files, three typefaces at the weights 400, 500 and 600, are cut with `fonttools varLib.instancer <font>.ttf wght=<weight> --static` into `assets/fonts/android`. Each weight is its own family, such as "Inter-500", so there are nine families declared in `app.json` through the `expo-font` plugin. `design-system/fontFace.android.ts` renames the family by the final weight of the text, in `Text.tsx`. `src/platform/fonts.ts`, the default file that Android and the web use, loads no font at run time. iOS and the web keep the variable files. The test `scripts/native-fonts.test.mjs` checks that the files are static and that the weight written in each file equals the declared weight.
- **One door for text.** Only `src/design-system/Text.tsx` and `Glyph.tsx` import `Text` from `react-native`, and no file draws `Animated.Text`, because the `Text` of the design system sets the font face that each platform needs (the rule is one row of the layer table in [Plain core, shared shell, layers enforced by lint](layers-enforced-by-lint.md)). `BarRow` and `StatePanel` go through `fontFace`.

After the fix the stroke ratios on Android were 0.143 on a button, 0.115 on a tab and 0.185 on the tile number (Inter regular as a mark: 0.107 and 0.125). On the Android 7.0 emulator they were 0.143, 0.115 and 0.182, equal to Android 15.

## Consequences

- The repository holds two sets of font files: the variable files for iOS and the web, and the nine static files for Android.
- Every Android text style must go through `fontFace`, and the ban on importing `Text` from `react-native` elsewhere keeps that true.
- A new weight on Android means a new static file and a new family.
- On the web, a typeface with Vietnamese letters needs both blocks as separate faces.

## Status

Current, a ruling of plan B (R-B17) and rulings of the narrow-widths plan (R-N32, R-N44), taken under FE-21 and measured on the simulators under FE-25 (9 Oct 2026).

## Sources

- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): R-B17 (lines 205 to 209 of the original).
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): R-N32 (lines 204 to 212 of the original) and R-N44 (lines 280 to 286).
- [Code review report](../../history/code-review/report.md): finding 14 (lines 270 to 276 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): section 5.4, the fonts (lines 328 to 335 of the original).
- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): the measurement on Google Fonts blocks (lines 102 to 106 of the original).
- [Develop the app](../../components/app/develop.md), the page that was `apps/metis/CONTRIBUTING.md`: the single import of `Text` (lines 252 to 254 of the original).
