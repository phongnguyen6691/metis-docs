---
title: Components
summary: View, Text and Pressable in place of div, span and button, the rules that trip web writers, and what real components of the app become on iOS, Android and the web.
component: app
type: how-to
status: current
ids: []
---

# Components

React Native has no HTML tags. You build an interface from a small set of core components, and each platform translates them into its own views [Source: reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026]. This page shows real components of `metis-app` and what each becomes on iOS, Android and the web. The HTML on the web was measured by rendering the same props with the `react-native-web` of this repository (0.21.3) on 12 Oct 2026, with the generated class and style attributes left out.

| React Native | iOS view | Android view | Web analog |
|---|---|---|---|
| `<View>` | `UIView` | `ViewGroup` | A non-scrolling `<div>` |
| `<Text>` | `UITextView` | `TextView` | `<p>` |
| `<ScrollView>` | `UIScrollView` | `ScrollView` | `<div>` |

[Source: reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026] In the output of react-native-web measured here, a plain `Text` is a `<div dir="auto">` and not a `<p>`.

Paths are relative to the root of `metis-app`. The previous page, [Platform files](platform-files.md), explains how one import reaches different files; the next, [Styles and layout](styles-and-layout.md), covers `style`.

## Rules that trip web writers

1. **Text must sit inside `<Text>`.** React Native requires every text node to be wrapped in a `<Text>`; a text node directly under a `<View>` is not allowed [Source: reactnative.dev/docs/text, read 12 Oct 2026]. In development its renderer logs `Text strings must be rendered within a <Text> component.` to the console [Source: react-native 0.86.3 Libraries/Renderer/implementations/ReactFabric-dev.js, read 12 Oct 2026]. On the web, react-native-web still draws the text into a `<div>` and logs only `Unexpected text node: ... A text node cannot be a child of a <View>.` in development [Source: react-native-web 0.21.3 dist/exports/View/index.js, read 12 Oct 2026], so the mistake is easy to miss in a browser tab. TypeScript does not catch it either: `<View>Loading</View>` compiles (checked with this repository's TypeScript on 12 Oct 2026).
2. **`onPress` replaces `onClick`.** In the app a press is handled by a `Pressable`, or by `PressableLink` when it is a link [Source: reactnative.dev/docs/pressable, read 12 Oct 2026]. A style is an object of properties, not a sheet with selectors, so there is no `:hover` or `:active`; the `style` of a `Pressable` can instead be a function that receives whether the component is pressed [Source: reactnative.dev/docs/pressable, read 12 Oct 2026].
3. **There is no cascade.** A `View` hands no text colour or font to its children. Only a `Text` nested in a `Text` inherits: "React Native still has the concept of style inheritance, but limited to text subtrees" [Source: reactnative.dev/docs/text, read 12 Oct 2026]. The breadcrumb of the top bar relies on it: the whole path is one `Text`, and the last name is a nested `Text`, so that only it is bold while the path stays on one line (`Crumbs` in `src/shell/TopBar.tsx`).
4. **Accessibility is written like ARIA.** `role`, `aria-label`, `aria-expanded` and `aria-hidden` are props of React Native [Source: reactnative.dev/docs/accessibility, read 12 Oct 2026]. On the web they become ARIA attributes, and a role can change the element: `role="navigation"` gives a `<nav>` [Source: react-native-web 0.21.3 dist/modules/AccessibilityUtil/propsToAccessibilityComponent.js, read 12 Oct 2026]. On the apps they reach VoiceOver on iOS and TalkBack on Android [Source: reactnative.dev/docs/accessibility, read 12 Oct 2026]. The app also passes `aria-current` to mark the current item. React Native 0.86.3 does not mention that prop in its types or sources (searched on 12 Oct 2026), and react-native-web forwards it to the DOM; what the apps do with it is [Unverified - confirm before applying].
5. **`testID` is the hook for tests.** React Native defines it as the way "to locate this view in end-to-end tests" [Source: reactnative.dev/docs/view, read 12 Oct 2026]. On the web it becomes `data-testid`, which Playwright locates by default [Source: playwright.dev/docs/locators, read 12 Oct 2026]. On the apps it is the id that Maestro finds [Source: docs.maestro.dev/platform-support/react-native, read 12 Oct 2026]; `e2e/native/phone.yaml` taps `topbar-menu` this way.

## Menu button

`src/shell/MenuButton.tsx`:

```tsx
// Below desktop width the sidebar is a drawer: this opens it from the phone top bar or the rail.
export function MenuButton({ label, open, onPress, testID }: MenuProps & { testID: string }) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-expanded={open}
      onPress={onPress}
      testID={testID}
      style={styles.button}
    >
      <Glyph name="menu" size="body" tone="text" />
    </Pressable>
  )
}
```

| Platform | What you get |
|---|---|
| iOS | A native view that receives presses. The screen reader of iOS gets the name `Open menu`, the role of a button and the expanded state (`aria-expanded`); a press calls `onPress`. The glyph inside has `aria-hidden`, so the screen reader skips it [Source: reactnative.dev/docs/accessibility, read 12 Oct 2026] |
| Android | The same, with TalkBack as the screen reader [Source: reactnative.dev/docs/accessibility, read 12 Oct 2026]. `testID="topbar-menu"` is the id Maestro looks for in `e2e/native/phone.yaml` |
| Web | The HTML below: the `role="button"` makes the `Pressable` a `<button>`, `testID` becomes `data-testid`, and the glyph, a `Text` with `aria-hidden`, becomes a `<div>` |

```html
<button aria-expanded="false" aria-label="Open menu" role="button" tabindex="0" data-testid="topbar-menu" type="button"><div dir="auto" aria-hidden="true">&#x2261;</div></button>
```

The character inside is U+2261, written here as an entity; the design system draws its marks as Unicode characters (`GLYPHS` in `src/design-system/Glyph.tsx`).

## A tile that is a link

`src/design-system/Tile.tsx`, trimmed:

```tsx
export function Tile({ label, value, figure, delta, alert, href, testID }: TileProps) {
  return (
    <PressableLink href={href} testID={testID} style={frame(alert)}>
      <Text variant="small" tone="muted">
        {label}
      </Text>
      {/* ... the value, and the lines under it ... */}
    </PressableLink>
  )
}
```

`PressableLink` wraps a `Pressable` in `Link asChild`. `Link` then hands its child the `href`, the role `link` and an `onPress` that navigates [Source: expo-router 57.0.24 build/link/BaseExpoRouterLink.js and build/link/useLinkToPathProps.js, read 12 Oct 2026].

| Platform | What you get |
|---|---|
| iOS and Android | A press runs the `onPress` that `Link` supplies, which asks the router to go to the path [Source: expo-router 57.0.24 build/link/useLinkToPathProps.js, read 12 Oct 2026]. `<Slot />` then draws the page for that path (today the shared not-built page, which lists the filters it received). The filter `risk=high,critical` travels in that path; there is just no address bar to show it |
| Web | An element with an `href` becomes an `<a>` [Source: react-native-web 0.21.3 dist/exports/View/index.js, read 12 Oct 2026]. A filter with several values is joined by a comma: `risk=high%2Ccritical` |

The web output for the tile of high-risk items (measured with the path that `resolveHref` of Expo Router gives for the tile's route):

```html
<a href="/w/creative-studio/projects/meridian-cgi-campaign/wbs?risk=high%2Ccritical" role="link" tabindex="0" data-testid="tile-highRisk"><div dir="auto">High risk</div>...</a>
```

## The project title

`src/shell/ProjectHeader.tsx` and `src/design-system/Text.tsx`:

```tsx
// src/shell/ProjectHeader.tsx
<Text variant="projectTitle" heading={1}>
  {header.title}
</Text>

// src/design-system/Text.tsx
<NativeText
  role={heading ? 'heading' : undefined}
  aria-level={heading}
  numberOfLines={lines}
  ellipsizeMode="tail"
  testID={testID}
  style={style}
>
```

| Platform | What you get |
|---|---|
| iOS and Android | A native text view. `role="heading"` marks the text as a heading for the screen reader [Source: reactnative.dev/docs/accessibility, read 12 Oct 2026]. When the `lines` prop is set, `numberOfLines` with `ellipsizeMode="tail"` cuts the text with an ellipsis [Source: reactnative.dev/docs/text, read 12 Oct 2026] |
| Web | `role="heading"` with `aria-level={1}` makes the `Text` an `<h1>` |

```html
<h1 dir="auto" aria-level="1" role="heading">Meridian CGI Campaign</h1>
```

## The page regions

```tsx
// src/shell/TopBar.tsx
<View role="banner" testID="topbar" style={styles.bar}>

// src/shell/Sidebar.tsx
<View role="navigation" aria-label={label} testID="sidebar" style={styles.frame}>

// src/shell/Shell.tsx
<ScrollView testID="page" role="main" style={styles.page}>
```

| Platform | What you get |
|---|---|
| iOS and Android | Two plain views and a `ScrollView`, which is the native scroll container [Source: reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026] |
| Web | `banner` becomes `<header>`, `navigation` becomes `<nav>` and `main` becomes `<main>` [Source: react-native-web 0.21.3 dist/modules/AccessibilityUtil/propsToAccessibilityComponent.js, read 12 Oct 2026] |

```html
<header role="banner" data-testid="topbar">...</header>
<nav aria-label="Main" role="navigation" data-testid="sidebar">...</nav>
<main role="main" data-testid="page"><div>...</div></main>
```

The scroll region of the shell is the only `main` of every page (a comment above `Shell` in `src/shell/Shell.tsx` says so).

## The language select

`src/shell/TopBar.tsx`:

```tsx
<Select
  label={language.label}
  name={language.name}
  value={language.value}
  options={language.options}
  onChange={(value) => onLocale(resolveLocale(value))}
  cancel={language.cancel}
  testID="language"
/>
```

| Platform | What you get |
|---|---|
| iOS | `Select.ios.tsx`: a button that shows the chosen language. A press opens the action sheet of iOS, with a Cancel row [Source: reactnative.dev/docs/actionsheetios, read 12 Oct 2026] |
| Android | `Select.android.tsx`: a face that draws the chosen language, with the `Picker` of `@react-native-picker/picker` above it, almost transparent, to take the press. Opacity `0.01` and not `0`, because TalkBack skips an element at `0` [Source: comment in src/design-system/Select.styles.ts, read 12 Oct 2026]. A press opens the system picker dialog [Source: comments of e2e/native/phone.yaml, read 12 Oct 2026] |
| Web | The `Picker` renders a real `<select>` [Source: @react-native-picker/picker 2.11.4 js/Picker.web.js, read 12 Oct 2026] |

```html
<select aria-label="Language" data-testid="language"><option value="en" selected="">English</option><option value="vi">...</option></select>
```

The second option is labelled with the name of the other language in that language. [Platform files](platform-files.md) shows the three `Select` files.

## The drawer

`src/shell/Shell.tsx`:

```tsx
// Modal traps focus and returns it to the opener; Escape, Android Back and the scrim all close it.
function Drawer(props: {
  open: boolean
  label: string
  close: string
  onClose: () => void
  children: ReactNode
}) {
  const { open, label, close, onClose, children } = props
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={open} transparent onRequestClose={onClose} aria-label={label}>
      <View testID="drawer" style={styles.drawer}>
        <View testID="drawer-panel" style={[styles.panel, safeArea(insets)]}>
          {children}
        </View>
        <Pressable
          role="button"
          aria-label={close}
          onPress={onClose}
          testID="drawer-close"
          style={styles.scrim}
        />
      </View>
    </Modal>
  )
}
```

| Platform | What you get |
|---|---|
| iOS | A `Modal` presents the drawer above the page [Source: reactnative.dev/docs/modal, read 12 Oct 2026]. `transparent` renders it over a transparent background, so the page stays visible, dimmed by the scrim beside the panel; pressing that area (`drawer-close`) closes it. The workspace menu (`src/design-system/Menu.tsx`) puts its panel in a transparent `Modal` as well, so a press outside it closes it |
| Android | The same, and the Back button of the system calls `onRequestClose`, so the drawer closes as Android users expect [Source: reactnative.dev/docs/modal, read 12 Oct 2026]. The workspace menu closes with Back too |
| Web | react-native-web draws the `Modal` as a layer at the end of `<body>`, with the role `dialog`, keeps the focus inside it and gives the focus back to the element that opened it when it closes. Escape calls `onRequestClose` [Source: react-native-web 0.21.3 dist/exports/Modal (ModalPortal.js, ModalContent.js, ModalFocusTrap.js), read 12 Oct 2026]. On the web the workspace menu also closes on Tab, because the focus leaves it (`closeOnTab` in `Menu.tsx`) |

## Check yourself

In a component you write `<View>Loading</View>`. What happens?

1. It works the same on all three platforms.
2. On iOS and Android React Native logs an error in development; on the web the text still draws.
3. TypeScript reports a compile error.
4. The text draws, but without a font.

<details>
<summary>Answer</summary>

Option 2. React Native requires text inside `<Text>`, and in development its renderer logs `Text strings must be rendered within a <Text> component.` [Source: reactnative.dev/docs/text and react-native 0.86.3 ReactFabric-dev.js, read 12 Oct 2026]. react-native-web draws the text in a `<div>` and only logs a console error in development, so the mistake is easy to miss when you test in a browser alone [Source: react-native-web 0.21.3 dist/exports/View/index.js, read 12 Oct 2026]. TypeScript accepts a string child of a `View` (checked with this repository's TypeScript on 12 Oct 2026), so option 3 is wrong.

</details>
