---
title: The brand tokens are the only source of sizes and colours
summary: The brand token file is the only source of sizes and colours, a generator writes tokens.ts from it, styles live only in styles files, and lint rejects any literal size or colour.
component: app
type: decision
status: current
ids: []
---

# The brand tokens are the only source of sizes and colours

## Context

The brand files define every size and colour of Metis as tokens in a CSS file, `brand/tokens.css`. The app writes its styles with the React Native `StyleSheet`, which cannot read CSS variables, so the numbers have to reach the code as TypeScript. The brainstorm had at first proposed to drop the theme generator, which was right for Tailwind on web but is not right once styles are written with `StyleSheet`.

Building the shell and screen 24 showed that the token set had to grow, because they used sizes and colours that had no token yet, and that the first token rule left holes (properties such as `flexBasis`, styles in variables, spread styles).

## Decision

- `brand/tokens.css` is the only source of every shape number and colour. In the four-repository layout the file is `design/brand/tokens.css` in `metis-docs`, and `metis-app` keeps a pinned copy under `pinned/design/brand/tokens.css` that its generator and checks read.
- `scripts/gen-tokens` reads the file and writes `src/design-system/tokens.ts`. The mode `--check` regenerates the file and compares it. `tokens.ts` is only ever generated and is never edited by hand. React Native cannot read CSS variables, which is why this generator is needed.
- Styles are `StyleSheet` objects in `*.styles.ts` files next to their component, and lint blocks `StyleSheet` in any other file. These files are in the coverage, the token rule and the browser measurement of shapes, and outside mutation testing.
- A lint rule rejects a number or a colour literal written in a style. It applies to the properties of size, spacing, radius, font size, line height and colour, and not to unitless properties (`flex`, `opacity`, `zIndex`) or the 1 px border of the style guide. It checks every style key of every object in `src` (not only the argument of `StyleSheet.create`), the size and colour props of JSX, and arithmetic on tokens (`token * 2`, `-token`). It does not check `tokens.ts`, where the numbers are set.
- There are only two kinds of exception: the intrinsic size of a drawing and the minimum width of a table column. Each carries a comment `// token-exception: <reason>`, and the reason is required.
- Three groups of tokens never become values used directly in a component: the focus ring, the seven groups of status colours (reached only through the status chip component) and the chart palette (reached only through the chart component).
- Widths are tokens too: `--bp-tablet` (768 px), `--bp-desktop` (1280 px), `--touch` (44 px, the smallest touch target) and `--rail-w` (64 px, the icon rail: a 44 px target with 10 px on each side).
- The names of the tokens follow their role in the wireframe stylesheet: spacing `--space-2` to `--space-18`; radii `--radius-xs`, `--radius-sm`, `--radius-pill`; fixed sizes such as `--chip-h`, `--avatar` and `--logo-h`; font sizes such as `--fs-project-title`, `--fs-nav` and `--fs-crumbs`; line heights in pixels (`--lh-body` is 20.3, that is 14 times 1.45); letter spacing; `--neutral-fill` (the colour `#C9C9D2` of the Not Started state); and a negative `--badge-offset`.

## Consequences

- A brand change is made in the token file and regenerated. No component holds a number.
- The token set grew by 58 tokens to 134 when the shell and screen 24 were built, and the test of the generator pins the count of tokens. The brand owner may rename or merge some of these tokens.
- A style defect that the browser measurement of shapes does not measure can slip through, so the measured set has to be widened when such a case shows up.
- Data in `src` that has a key named like a style property, such as `width`, must rename that key. The models use `share` and `weight`.
- The rule was measured on its own tests: 89 tests, coverage 100%, and 66 of 66 hand-made mutants killed.
- It rules out hand-typed sizes and colours in styles, hand edits of `tokens.ts`, and a styling route through Tailwind or NativeWind ([React Native with Expo for web, iOS and Android](react-native-expo-single-codebase.md)).

## Status

Current, approved by the owner on 5 Oct 2026 with the foundation spec (FE-16). The refinements are rulings of the foundation plan, the overview-screen plan and the narrow-widths plan, taken under FE-17 and FE-21 (R-B8, R-B13, R-B14, D-B2, D-B3, R-N2).

## Sources

- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 75, 303 to 312 and 419 of the original (the style choice, the generator, the three groups, the token gate).
- [Foundation plan](../../history/plans/2026-10-05-frontend-foundation.md): lines 40 to 41 of the original.
- [Overview screen plan](../../history/plans/2026-10-06-frontend-overview-screen.md): lines 170 to 171 (R-B8), 192 to 197 (R-B13, R-B14) and 227 to 239 (D-B2, D-B3) of the original.
- [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md): lines 43 to 48 of the original (R-N2).
- [Metis repositories and central documentation design](../../proposals/2026-10-11-repos-and-docs-design.md): section 4.4 (the pinned copy of the brand files).
