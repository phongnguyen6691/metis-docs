---
title: Platform files
summary: How one import can reach up to three files, which files the app splits by platform and why, and when a platform file is the right tool.
component: app
type: how-to
status: current
ids: []
---

# Platform files

When the code says `import { Select } from './Select'`, Metro does not look for that exact name. It tries the suffixes of the platform being bundled, in order, and takes the first file that exists. The app splits a few files this way; every other line of code runs the same on all three platforms.

Read [From command to screen](from-command-to-screen.md) first if you want to see where in the journey Metro picks the files. Paths are relative to the root of `metis-app`.

## How Metro picks a file

| Platform | Files tried for `./Select`, in order |
|---|---|
| iOS | `Select.ios.tsx`, `Select.native.tsx`, `Select.tsx` |
| Android | `Select.android.tsx`, `Select.native.tsx`, `Select.tsx` |
| Web | `Select.web.tsx`, `Select.tsx` |

Metro tries `.<platform>.<ext>` first, then `.native.<ext>` when `preferNativePlatform` is on, then the plain `.<ext>` [Source: metrobundler.dev/docs/resolution, read 12 Oct 2026]. Expo's Metro setup turns `preferNativePlatform` on for every platform but the web [Source: @expo/cli 57.0.27 build/src/start/server/metro/withMetroMultiPlatform.js, read 12 Oct 2026], which is why the web never takes a `.native` file. The same two sources, and the platform suffixes of React Native [Source: reactnative.dev/docs/platform-specific-code, read 12 Oct 2026], give the table above.

## The splits in this app

Each row below was resolved with the Metro resolver (metro-resolver 0.84.5) over the files of this repository, with `preferNativePlatform` set as Expo's CLI sets it [Source: metro-resolver 0.84.5 and @expo/cli 57.0.27, run on 12 Oct 2026].

| Import | Written in | iOS | Android | Web |
|---|---|---|---|---|
| `import { Select } from '../design-system/Select'` | `src/shell/TopBar.tsx` | `Select.ios.tsx` | `Select.android.tsx` | `Select.tsx` |
| `import { startMocks } from './mocks'` | `src/platform/useStartup.ts` | `mocks.ts` | `mocks.ts` | `mocks.web.ts` |
| `import { useAppFonts } from './fonts'` | `src/platform/useStartup.ts` | `fonts.ios.ts` | `fonts.ts` | `fonts.ts` |
| `import { readLocale, writeLocale } from '../platform/storage'` | `src/shell/locale.tsx` | `storage.ts` | `storage.ts` | `storage.web.ts` |
| `import { fontFace } from './fontFace'` | `src/design-system/Text.tsx` | `fontFace.ts` | `fontFace.android.ts` | `fontFace.ts` |

The files that carry a suffix are `Select.ios.tsx`, `Select.android.tsx`, `fontFace.android.ts`, `fonts.ios.ts`, `mocks.web.ts` and `storage.web.ts`. Every other file is one file for all three platforms.

## Two other ways, and when to choose each

**TypeScript sees only the plain file.** `tsconfig.json` extends `expo/tsconfig.base`, and neither sets `moduleSuffixes`, so for TypeScript `./Select` is always `Select.tsx` [Source: typescriptlang.org/tsconfig, option moduleSuffixes, read 12 Oct 2026]. A `.ios.tsx` file must export exactly the same API. The app keeps the versions in step by having `Select.ios.tsx` and `Select.android.tsx` import the type `SelectProps` from `./Select`.

**`Platform.OS` and `Platform.select` handle a difference of one value in place.** `Platform.OS` is `ios` or `android` on the apps [Source: reactnative.dev/docs/platform-specific-code, read 12 Oct 2026], and `web` on the web, where react-native-web provides `Platform` [Source: react-native-web 0.21.3 dist/exports/Platform/index.js, read 12 Oct 2026]. The `Link` of Expo Router does this itself: it sets `onClick` on the web and `onPress` on the apps [Source: expo-router 57.0.24 build/link/BaseExpoRouterLink.js, read 12 Oct 2026]. The app uses the same tool only when the difference is a single value: `tier.ts` chooses finger or mouse, `fonts.ts` chooses a font name or a whole font stack, and `Dialog.tsx` chooses the kind of shadow below Android 9. When the behavior or the component really differs, it splits the file, so that each version reads on its own. The rule is in the [Platform forks section of Develop the app](../develop.md#platform-forks), and [Four Jest projects, and platform files only for real differences](../../../architecture/decisions/jest-projects-and-platform-forks.md) records it. Each fork also gets its own test file, such as `Select.test.ios.tsx`.

## The splits, one by one

### Select

The plain `Select.tsx` is the browser's own `<select>`: on the web the `Picker` of `@react-native-picker/picker` renders a real `<select>` element [Source: @react-native-picker/picker 2.11.4 js/Picker.web.js, read 12 Oct 2026].

```tsx
// The browser's own select element; Select.ios.tsx and Select.android.tsx say why they differ.
export function Select({ label, value, options, onChange, testID }: SelectProps) {
  const touch = useTouchTargets()
  return (
    <Picker
      accessibilityLabel={label}
      selectedValue={value}
      onValueChange={(next) => onChange(String(next))}
      // The package types testID as string; React Native ignores one without a value.
      testID={testID as string}
      style={select(touch)}
    >
      {options.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} />
      ))}
    </Picker>
  )
}
```

On iOS the wheel picker is 216 points high and does not fit the top bar [Source: comment in src/design-system/Select.ios.tsx, read 12 Oct 2026], so the iOS file draws a button. Pressing it opens the system action sheet with `ActionSheetIOS`, which shows a native iOS action sheet from a list of options and a cancel button index [Source: reactnative.dev/docs/actionsheetios, read 12 Oct 2026].

```tsx
// The iOS wheel is 216 points high and does not fit the top bar, so a button opens a system sheet.
export function Select({ label, name, value, options, onChange, cancel, testID }: SelectProps) {
  const touch = useTouchTargets()
  const current = options.find((option) => option.value === value)?.label ?? value
  const choices = options.map((option) => option.label)
  const open = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: label,
        options: [...choices, cancel],
        cancelButtonIndex: choices.length
      },
      (index) => {
        const chosen = options[index]
        if (chosen) onChange(chosen.value)
      }
    )
  return (
    <Pressable role="button" aria-label={name} onPress={open} testID={testID} style={button(touch)}>
      <Text variant="crumb">{current}</Text>
      <Glyph name="caret" size="caption" tone="muted" />
    </Pressable>
  )
}
```

Android has a file of its own because the Android picker cannot size itself [Source: comment in src/design-system/Select.android.tsx, read 12 Oct 2026]: a face draws the chosen option, and the `Picker` lies over it, almost transparent, to take the touch. Its opacity is `0.01`, because TalkBack and Maestro skip an element at `0` [Source: comment in src/design-system/Select.styles.ts, read 12 Oct 2026]. A press opens the system picker dialog; the language select opens an action sheet on iOS and a dialog on Android [Source: comments of e2e/native/phone.yaml, read 12 Oct 2026].

```tsx
// The Android picker cannot size itself: a face draws the option, the picker above takes the touch.
export function Select({ label, name, value, options, onChange, testID }: SelectProps) {
  const touch = useTouchTargets()
  const current = options.find((option) => option.value === value)?.label ?? value
  return (
    <View style={styles.frame}>
      <View aria-hidden style={button(touch)}>
        <Text variant="crumb">{current}</Text>
        <Glyph name="caret" size="caption" tone="muted" />
      </View>
      <Picker
        // TalkBack reads this name instead of the chosen item, so it holds both (WCAG 2.5.3).
        accessibilityLabel={name}
        prompt={label}
        selectedValue={value}
        onValueChange={(next) => onChange(String(next))}
        // The package types testID as string; React Native ignores one without a value.
        testID={testID as string}
        style={styles.cover}
      >
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  )
}
```

See [The language select on each platform](../../../architecture/decisions/native-language-select.md).

### Mocks

A build runs a mock server only when `EXPO_PUBLIC_MOCKS` is `1`. On the web, MSW registers a service worker that answers requests at the network level [Source: mswjs.io/docs/integrations/browser, read 12 Oct 2026]; the web file picks the scenario from `?mock=` in the URL. The apps have no service worker [Source: comment in src/platform/mocks.ts, read 12 Oct 2026], so the app file replaces the global `fetch` with a function that asks the MSW handlers first; the apps have no URL to pick a scenario with, so they always get `default`. In both files an API call that no handler answers is a bug, so it logs an error that names the call, while a call to any other host goes on to the network. On the web, `holdWhenLeaving` also keeps an API request that a leaving page starts from reaching the network, because MSW has by then told its worker that the page closed [Source: comment in src/platform/mocks.web.ts, read 12 Oct 2026].

```ts
// iOS and Android have no service worker, which MSW uses to catch requests on the web.
export async function startMocks(): Promise<void> {
  if (process.env.EXPO_PUBLIC_MOCKS === '1') {
    defineMissingEventClasses(globalThis as unknown as Record<string, unknown>)
    // Metro inlines the flag, so a release drops this block, as the iOS release shows.
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional, see above
    const { getResponse } = require('msw') as typeof import('msw')
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional, see above
    const mocks = require('../mocks/handlers') as typeof import('../mocks/handlers')
    // The apps have no URL to pick a scenario with, so they get the one for no choice: default.
    const handlers = mocks.handlersFor(mocks.scenarioOf(null))
    const api = new URL(apiConfig.baseUrl).host
    const network = globalThis.fetch
    const mocked: typeof fetch = async (input, init) => {
      const request = new Request(input, init)
      const response = await getResponse(handlers, request)
      if (response) return response
      // An API call no handler answers is a bug, so it logs an error naming it; other hosts pass.
      if (new URL(request.url).host === api) {
        console.error('[mocks] no handler for', request.method, request.url)
      }
      return network(input, init)
    }
    Object.assign(globalThis, { fetch: mocked })
  }
}
```

```ts
export async function startMocks(): Promise<void> {
  if (process.env.EXPO_PUBLIC_MOCKS === '1') {
    // Metro inlines EXPO_PUBLIC_MOCKS, so a release build drops this block and src/mocks with it.
    // require, not import(): the project's Jest 29 cannot run import().
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional, see above
    const { setupWorker } = require('msw/browser') as typeof import('msw/browser')
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional, see above
    const mocks = require('../mocks/handlers') as typeof import('../mocks/handlers')
    const scenario = mocks.scenarioOf(new URLSearchParams(window.location.search).get('mock'))
    const api = new URL(apiConfig.baseUrl).host
    // Before the worker starts, so this page's beforeunload listener runs before MSW's.
    holdWhenLeaving(api)
    await setupWorker(...mocks.handlersFor(scenario)).start({
      // An API call no handler answers is a bug, so it logs an error naming it; other hosts pass.
      onUnhandledRequest: (request, print) => {
        if (new URL(request.url).host === api) print.error()
      },
      quiet: true
    })
  }
}
```

The first block is `src/platform/mocks.ts`, the second `src/platform/mocks.web.ts`. See [Screens call the real API; a mock server answers in mock builds only](../../../architecture/decisions/mock-server-behind-real-api.md), and [Data flow](data-flow.md) for the scenarios.

### Fonts

Each platform gets its fonts differently:

- **iOS.** `expo-font` loads the `.ttf` files while the app runs and reports when they are ready [Source: docs.expo.dev/versions/latest/sdk/font, read 12 Oct 2026].
- **Android.** Nothing loads at run time. The `expo-font` entry of `app.json` embeds one static font file per family and weight when the app is built [Source: docs.expo.dev/versions/latest/sdk/font, read 12 Oct 2026]. Android ignores `fontWeight` on a variable font, which is why the weights are separate files [Source: comment in src/platform/fonts.ts, read 12 Oct 2026].
- **Web.** `@font-face` rules in `public/index.html` split the Latin and Vietnamese ranges with `unicode-range`, which `expo-font` cannot write [Source: comment in src/platform/fonts.ts, read 12 Oct 2026]. The browser loads the fonts itself.

Android and the web share the plain file, whose hook returns `true` at once.

```ts
import { useFonts } from 'expo-font'

// Each key is the first family of a token's font stack, the name src/design-system/fonts.ts uses.
const FONT_FILES = {
  Inter: require('../../assets/fonts/Inter.ttf'),
  Newsreader: require('../../assets/fonts/Newsreader.ttf'),
  Manrope: require('../../assets/fonts/Manrope.ttf')
}

// True once the fonts loaded, or when loading failed: the app still draws, in the system font.
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts(FONT_FILES)
  return loaded || error !== null
}
```

```ts
// Android ignores fontWeight on a variable font, so app.json builds in one static file per weight:
// cd assets/fonts && fonttools varLib.instancer <F>.ttf wght=<W> --static -o android/<F>-<W>.ttf
// The web loads them with @font-face in public/index.html, as expo-font cannot set unicode-range.
export const useAppFonts = (): boolean => true
```

The first block is `src/platform/fonts.ios.ts`, the second `src/platform/fonts.ts`. See [Self-hosted fonts per platform](../../../architecture/decisions/font-loading.md).

### Storage

The web build remembers the language and the open workspace in `localStorage`. The calls sit in a `try`, because private mode or a browser policy can block `localStorage`, and the app then runs without memory [Source: comment in src/platform/storage.web.ts, read 12 Oct 2026]. The apps keep nothing between launches yet, so every launch starts in English with the default workspace; a comment in `storage.ts` says AsyncStorage would lift that limit.

```ts
import { DEFAULT_LOCALE, type Locale } from '../core/i18n/locale'

// ponytail: iOS and Android keep no language or workspace between launches; AsyncStorage lifts it.
export const readLocale = (): Locale => DEFAULT_LOCALE

export const writeLocale = (_locale: Locale): void => {}

export const readWorkspace = (): string | null => null

export const writeWorkspace = (_id: string): void => {}

export const forgetWorkspace = (): void => {}
```

```ts
// public/index.html reads this key too, to set the page language before the first paint.
export const LOCALE = 'metis.locale'
const WORKSPACE = 'metis.workspace'

// Private mode or a browser policy can block localStorage: the app then runs without memory.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Unsaved, the value lasts until the page reloads.
  }
}

export const readLocale = (): Locale => resolveLocale(read(LOCALE))

export function writeLocale(locale: Locale): void {
  document.documentElement.lang = locale
  write(LOCALE, locale)
}

// ... readWorkspace, writeWorkspace and forgetWorkspace, with the same try ...
```

The first block is `src/platform/storage.ts`, the second `src/platform/storage.web.ts`. See [What the client remembers](../../../architecture/decisions/client-memory.md).

### Font face

Every piece of text goes through the design system's `Text`, and `Text` calls `fontFace` to choose the font by weight. On iOS and the web the face comes from `fontFamily` and `fontWeight`, so the plain file returns the style unchanged. On Android, below version 9 a font family gives only regular or bold [Source: comment in src/design-system/fontFace.android.ts, read 12 Oct 2026], so each weight is its own family: the Android file adds the weight to the family name, such as `Inter-600`, which is the exact name of a static file that `app.json` registers.

```ts
import type { TextStyle } from 'react-native'

// iOS and the web pick the face from fontFamily and fontWeight; fontFace.android.ts covers Android.
export const fontFace = (style: (TextStyle | null)[]) => style
```

```ts
import type { TextStyle } from 'react-native'

// Below Android 9 a family gives only regular or bold, so each weight is its own family (app.json).
// The last weight wins, as in a React Native style array, so an override draws with its own family.
export const fontFace = (style: (TextStyle | null)[]) => {
  const { fontFamily, fontWeight }: TextStyle = Object.assign({}, ...style)
  return [...style, { fontFamily: `${fontFamily}-${fontWeight}` }]
}
```

The first block is `src/design-system/fontFace.ts`, the second `src/design-system/fontFace.android.ts`.

## Check yourself

The folder `src/design-system` holds `Select.tsx`, `Select.ios.tsx` and `Select.android.tsx`. When Metro bundles for the web, which file does `import { Select } from './Select'` load?

1. `Select.android.tsx`
2. `Select.tsx`
3. `Select.ios.tsx`
4. Metro reports an error because there are several versions.

<details>
<summary>Answer</summary>

Option 2. For the web Metro tries `.web.tsx` and then the plain `.tsx`; the suffixes `.android` and `.ios` count only when bundling for that platform, and Expo does not turn on the `.native` step for the web [Source: metrobundler.dev/docs/resolution and @expo/cli 57.0.27 withMetroMultiPlatform.js, read 12 Oct 2026]. The resolver run in the table above gives `Select.tsx` for the web.

</details>
