---
title: Styles and layout
summary: How styles work without CSS, how layout works without media queries, the rules the app adds for fonts and tokens, and the three width tiers.
component: app
type: how-to
status: current
ids: []
---

# Styles and layout

A style in React Native is a JavaScript object that you pass to the `style` prop: no selector, no class, no cascade [Source: reactnative.dev/docs/style and reactnative.dev/docs/text, read 12 Oct 2026]. The app puts the styles of each component in a `*.styles.ts` file beside it and takes every number from `tokens.ts`. Layout does not use media queries either: the code asks for the window width and picks one of three tiers.

Paths are relative to the root of `metis-app`. The previous page, [Components](components.md), shows the components these styles dress; the next, [Routing](routing.md), shows how pages are chosen.

## A style, and the same thing in CSS

`src/shell/TopBar.styles.ts`:

```ts
// One topbarH row: the breadcrumb on the left, then search pushes the rest to the right.
export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space12,
    height: tokens.topbarH,
    paddingHorizontal: tokens.pagePad,
    borderBottomWidth: 1,
    borderBottomColor: tokens.line
  },
  // ... the breadcrumb, the search box and the bell ...
})
```

The CSS that gives the same box, for comparison only:

```css
.bar {
  display: flex;              /* RN: every View is already flex */
  flex-direction: row;        /* RN defaults to column */
  align-items: center;
  gap: 12px;                  /* tokens.space12 */
  height: 52px;               /* tokens.topbarH */
  padding-inline: 24px;       /* paddingHorizontal: tokens.pagePad */
  border-bottom: 1px solid #E6E6EB;   /* tokens.line */
}
```

On the web, react-native-web turns this object into CSS: rendering a `View` with the same keys gave `height:52px`, `padding-left:24px`, `padding-right:24px`, `flex-direction:row`, `gap:12px` and a 1px bottom border of the colour of `tokens.line` [Source: react-native-web 0.21.3 style output, measured on 12 Oct 2026].

## Rules for people who know CSS

1. **Every `View` is flexbox, and `flexDirection` defaults to `column`, not `row`.** Flexbox works as it does in CSS with a few exceptions, and the default direction is the first of them [Source: reactnative.dev/docs/flexbox, read 12 Oct 2026].
2. **Numbers have no unit.** All dimensions in React Native are unitless and represent density-independent pixels [Source: reactnative.dev/docs/height-and-width, read 12 Oct 2026]. On the web they become CSS pixels (the measurement above). `height: tokens.topbarH` gives the same value on all three platforms.
3. **Merge styles with an array.** The last style in the array has precedence [Source: reactnative.dev/docs/style, read 12 Oct 2026], and a `false` or `null` entry is skipped [Source: react-native 0.86.3 Libraries/StyleSheet/flattenStyle.js, read 12 Oct 2026]: `style={[styles.shell, safeArea(insets)]}` in `src/shell/Shell.tsx`. When a component needs exactly one object, `StyleSheet.flatten` merges the array [Source: reactnative.dev/docs/stylesheet, read 12 Oct 2026]. `PressableLink` needs it because `Link asChild` merges its style into its child's, which must be one object and never an array [Source: comment in src/design-system/PressableLink.styles.ts, read 12 Oct 2026].
4. **A font has exactly one name.** On the apps a font is loaded under one name, so `fontFamily` must be exactly that name [Source: comment in src/design-system/fonts.ts, read 12 Oct 2026]. `src/design-system/fonts.ts` cuts the first family out of the font stack of a token; on Android, `fontFace.android.ts` also adds the weight to the name, such as `Inter-600` (see [Platform files](platform-files.md)). On the web the same line keeps the whole stack, so the fallback fonts draw while the main font loads. Only one value differs, so this is a `Platform.OS` branch inside one file, not a pair of files:

   ```ts
   import { Platform } from 'react-native'

   import { tokens } from './tokens'

   // iOS loads each font under the first family of its stack; Android adds the weight to the name.
   // The web hands CSS the whole stack, so the fallbacks draw while a font loads.
   const family = (stack: string) =>
     Platform.OS === 'web' ? stack : stack.slice(1, stack.indexOf('"', 1))

   // Built at import, as the Text styles that read it are, so a test's asWeb keeps the app's names.
   export const fonts = {
     display: family(tokens.fontDisplay),
     ui: family(tokens.fontUi),
     control: family(tokens.fontControl)
   }
   ```

5. **There are no hand-typed numbers.** `tokens.ts` is generated from `pinned/design/brand/tokens.css` by `pnpm gen:tokens`, and `gate:tokens` fails when the file differs from its source. The lint rule `local/no-style-literals` rejects a literal number or colour in a style, including a number moved into a `const` of the same file, a size computed by a call and a size written as a `px` string. `opacity`, `zIndex`, `aspectRatio` and `shadowOpacity` also take a token or a reason, written as `// token-exception: <reason>` on the line above. The rule is in the [Styles section of Develop the app](../develop.md#styles), and [The brand tokens are the only source of sizes and colours](../../../architecture/decisions/brand-tokens-source.md) records it.

## Three width tiers

There is no media query. `useWindowDimensions()` returns the width of the window and updates when the size of the screen changes [Source: reactnative.dev/docs/usewindowdimensions, read 12 Oct 2026]. `tierOf` turns the width into one of three tiers with two tokens, `bpTablet` (768) and `bpDesktop` (1280). `src/design-system/tier.ts`:

```ts
// The full shell from bpDesktop, an icon rail from bpTablet, one column and a drawer below it.
export type Tier = 'phone' | 'tablet' | 'desktop'

export const tierOf = (width: number): Tier => {
  if (width >= tokens.bpDesktop) return 'desktop'
  return width >= tokens.bpTablet ? 'tablet' : 'phone'
}

// The tier of the current window; it changes when the window resizes or the device turns.
export const useTier = (): Tier => tierOf(useWindowDimensions().width)

// The apps are used by finger, so touch targets at every width; the web needs them on phones only.
export const useTouchTargets = (): boolean => {
  // Read on each call, not at import, so a test can render one component as on the web.
  const fingerOnly = Platform.OS !== 'web'
  return useTier() === 'phone' || fingerOnly
}

// The target style when useTouchTargets asks for it, nothing otherwise.
export const useTouch = () => (useTouchTargets() ? styles.touch : null)
```

What each tier changes:

| Tier | Window width | `Shell` | Top bar | Tiles per row | Cards of a screen | Touch targets (`useTouch`) |
|---|---|---|---|---|---|---|
| `desktop` | From `bpDesktop` (1280) | The full sidebar, `sidebarW` (232) wide | Breadcrumb, search box (`searchW`, 300), New, Help, bell, avatar, language | 8 per row | Side by side | On the apps only |
| `tablet` | From `bpTablet` (768) up to below `bpDesktop` | An icon rail, `railW` (64) wide, whose menu button opens the sidebar as a drawer | Breadcrumb, search box (it shrinks), New, bell, avatar, language | 4 per row | Side by side | On the apps only |
| `phone` | Below `bpTablet` | No sidebar and no rail; the menu button of the top bar opens the sidebar as a drawer | Menu button, breadcrumb, bell, language | 2 per row | In one column | Everywhere: a minimum height and width of `touch` (44) |

The sources of the table are `Shell` and `TopBar` in `src/shell`, `TileRow` and `Screen` in `src/screens/24-project-overview`, and `useTouch` in `tier.ts`. The tests use one window width per tier, `PHONE` (390), `TABLET` (1000) and `DESKTOP` (1440), from `src/widths.test.helper.ts`. The safe areas of the device are added around the shell with `useSafeAreaInsets` (see [From command to screen](from-command-to-screen.md)); the decisions are [Three width tiers and 44 point touch targets](../../../architecture/decisions/width-tiers-and-touch-targets.md) and [Safe areas and a dark status bar on one light palette](../../../architecture/decisions/safe-area-and-status-bar.md).

## Try it

Run `pnpm web` and drag the window narrower than 1280 px, then than 768 px. Open the developer tools of the browser and find the `<nav aria-label="Main">` of the sidebar, the `<a href>` of the tiles and the `css-` classes that react-native-web generates.

## Check yourself

On an iPhone about 390 points wide, where is the sidebar of the app?

1. On the left, as a full sidebar.
2. Collapsed to a narrow icon rail.
3. In a drawer, opened with the menu button of the top bar.
4. At the bottom of the screen, like a tab bar.

<details>
<summary>Answer</summary>

Option 3. `tierOf(390)` is `'phone'`, because 390 is below `bpTablet`. `Shell` draws neither the sidebar nor the rail; `TopBar` draws a menu button, and pressing it opens the sidebar in a `Modal` as a drawer.

</details>
