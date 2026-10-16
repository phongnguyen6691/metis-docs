---
title: From command to screen
summary: What happens between a command such as pnpm web, pnpm ios or pnpm android and a screen, one station at a time, for each platform.
component: app
type: how-to
status: current
ids: []
---

# From command to screen

The bundler of React Native is called Metro, so the journey reads like a metro map: each platform is a line. The two app lines, iOS and Android, pass through a native build. The web line goes straight to the browser. From the Metro station on, the three lines carry the same JavaScript, and they split again at the last station, where each platform draws in its own way.

Read [Project structure](project-structure.md) first for the folders this page refers to. Paths are relative to the root of `metis-app`.

## Which line stops where

| # | Station | Lines that stop here |
|---|---|---|
| 1 | Command | iOS, Android, Web |
| 2 | Prebuild | iOS, Android |
| 3 | Native build | iOS, Android |
| 4 | Open the app, open the page | iOS, Android, Web |
| 5 | Metro bundles | iOS, Android, Web |
| 6 | `expo-router/entry` | iOS, Android, Web |
| 7 | `_layout.tsx` | iOS, Android, Web |
| 8 | `Shell` | iOS, Android, Web |
| 9 | Route | iOS, Android, Web |
| 10 | Data | iOS, Android, Web |
| 11 | Render | iOS, Android, Web |

## 1. Command

| Build | Command | What it runs |
|---|---|---|
| iOS | `pnpm ios` | `expo run:ios`. If the folder `ios/` does not exist, Expo CLI runs prebuild first. Then it builds the app, installs it and starts Metro [Source: docs.expo.dev/more/expo-cli and `expo run:ios --help` of the installed CLI, read 12 Oct 2026] |
| Android | `pnpm android` | `expo run:android`: the same steps for a Gradle project; the default variant is `debug` [Source: docs.expo.dev/more/expo-cli and `expo run:android --help` of the installed CLI, read 12 Oct 2026] |
| Web | `pnpm web` | `EXPO_PUBLIC_MOCKS=1 expo start --web --clear`. The variable turns the mock server on, `expo start` starts the development server, `--clear` clears Metro's cache and `--web` opens a browser. There is no native build on this line [Source: `expo start --help` of the installed CLI, read 12 Oct 2026] |

The scripts come from `package.json`:

```json
{
  "name": "metis",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "EXPO_PUBLIC_MOCKS=1 expo start --web --clear",
    "build:web": "expo export --platform web --clear --max-workers $(node scripts/workers.mjs) && rm -f dist/mockServiceWorker.js && node scripts/check-web-release.mjs dist"
  }
}
```

## 2. Prebuild (iOS and Android)

Prebuild generates the native project from Expo's template and applies `app.json` to it [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026]. Then each config plugin runs: a JavaScript function that edits native files for you [Source: docs.expo.dev/config-plugins/introduction, read 12 Oct 2026]. Last, autolinking links the native modules of the packages in `node_modules` into the project [Source: docs.expo.dev/modules/autolinking, read 12 Oct 2026]. The folders `ios/` and `android/` are not in the repository: `.gitignore` leaves them out, and prebuild generates them again whenever needed.

- **iOS.** The bundle id is `dev.metis.app`; the icon and the splash screen (background `#111827`) come from `assets/brand/`. Fonts do not come from `app.json` on iOS: `expo-font` loads three `.ttf` files while the app runs (`src/platform/fonts.ios.ts`). The app's own plugin edits `AppDelegate.swift`, adds `SceneDelegate.swift` and declares the scene in `Info.plist`.
- **Android.** The package is `dev.metis.app`. The adaptive icon is one foreground PNG on the background `#111827`, and the splash background is the same colour. The `expo-font` entry of `app.json` embeds one static font file per family and weight (Inter, Manrope and Newsreader, in the weights 400, 500 and 600). The predictive back gesture is turned off (`predictiveBackGestureEnabled: false`).
- **Web.** There is no native project, so there is no prebuild.

The relevant parts of `app.json`:

```jsonc
{
  "expo": {
    "name": "Metis",
    "slug": "metis",
    "scheme": "metis",
    "updates": {
      "enabled": false
    },
    "ios": {
      "bundleIdentifier": "dev.metis.app"
    },
    "android": {
      "package": "dev.metis.app",
      "adaptiveIcon": {
        "backgroundColor": "#111827",
        "foregroundImage": "./assets/brand/metis-app-icon-android-foreground-1024.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "single",
      "favicon": "./assets/brand/metis-favicon-48.png"
    },
    "plugins": [
      "expo-router",
      // ... expo-splash-screen and the expo-font entry with the static Android fonts ...
      "./plugins/with-ios-scene-lifecycle"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

The app's own plugin, `plugins/with-ios-scene-lifecycle.js`, has the usual shape of a config plugin: one function per file to change.

```js
// iOS 27 needs the scene lifecycle of expo-template-bare-minimum@58.0.12; drop this at Expo SDK 58.
const { IOSConfig, withAppDelegate, withInfoPlist } = require('expo/config-plugins')

// ...

module.exports = function withIosSceneLifecycle(config) {
  config = withAppDelegate(config, (c) => {
    // ... adds ExpoReactNativeFactoryProvider and removes the window setup from AppDelegate ...
    return c
  })
  config = withInfoPlist(config, (c) => {
    c.modResults.UIApplicationSceneManifest = {
      // ... one scene, whose delegate is SceneDelegate ...
    }
    return c
  })
  return IOSConfig.XcodeProjectFile.withBuildSourceFile(config, {
    filePath: 'SceneDelegate.swift',
    contents: SCENE_DELEGATE,
    overwrite: true
  })
}
```

## 3. Native build (iOS and Android)

- **iOS.** Xcode (`xcodebuild`) compiles the native part: React Native itself and the native modules of packages such as `react-native-screens`, `react-native-svg`, `@react-native-picker/picker` and `react-native-safe-area-context` [Source: @expo/cli 57.0.27 run/ios/XcodeBuild.js and docs.expo.dev/modules/autolinking, read 12 Oct 2026]. The result is an iOS app that runs on the Simulator.
- **Android.** Gradle compiles the same parts and produces the `debug` variant of the app [Source: @expo/cli 57.0.27 run/android/runAndroidAsync.js and `expo run:android --help`, read 12 Oct 2026].
- **Web.** Nothing to compile: the web line has no native project.

This step takes a while, but it is repeated only when the native part changes: a new package with native code, or an edit of `app.json` or of a plugin. A TypeScript edit does not need it. `scripts/native-gate.mjs` follows the same rule: a clean prebuild rebuilds all the native code, so it runs `pnpm install` and prebuild only when `ios/` is missing or out of date, that is, when a native input changed since the last build.

## 4. Open the app, open the page

- **iOS.** The app is installed on the iOS Simulator and opened. A debug build carries no JavaScript: when it opens, it loads the bundle from Metro on your machine, on port 8081, so editing TypeScript needs no rebuild [Source: comments of e2e/native/phone.yaml, which say a debug build loads its bundle from Metro, read 12 Oct 2026]. The Maestro flows point the app at another Metro port with the launch argument `RCT_jsLocation: 'localhost:8091'` (`e2e/native/smoke.yaml`), a key that React Native reads when it looks for the bundle [Source: react-native 0.86.3 React/Base/RCTBundleURLProvider.mm, read 12 Oct 2026].
- **Android.** The app is installed on the Android emulator. Expo CLI runs `adb reverse tcp:8081 tcp:8081` so that the emulator can reach Metro on your machine [Source: @expo/cli 57.0.27 start/platforms/android/adbReverse.js, read 12 Oct 2026]. When Metro runs on another port, as it does for Maestro (8091), run `adb reverse tcp:8091 tcp:8091` yourself (`e2e/native/phone.yaml`).
- **Web.** The browser opens `http://localhost:8081` [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026]. The server returns `public/index.html`, the template of the page [Source: @expo/cli 57.0.27 start/server/webTemplate.js, read 12 Oct 2026]: a small script that sets `lang` from `localStorage` before the first paint, the `@font-face` blocks for the Latin and Vietnamese ranges, and `<div id="root">`, where the app mounts [Source: expo 57.0.26 src/launch/registerRootComponent.web.tsx, read 12 Oct 2026]. Then the browser asks for the JavaScript bundle.

## 5. Metro bundles

Metro starts at `expo-router/entry`, builds the graph of every module the entry requires, runs each module through a transformer and joins the results into one bundle [Source: metrobundler.dev/docs/concepts, read 12 Oct 2026]. In this app the transformer is Babel. `babel-preset-expo` extends React Native's Babel preset, which strips the TypeScript types and compiles JSX [Source: babel-preset-expo README and @react-native/babel-preset 0.86.3 src/configs/main.js, read 12 Oct 2026]. It also runs React Compiler when `experiments.reactCompiler` is on [Source: babel-preset-expo README, read 12 Oct 2026], and Expo's Metro config replaces `process.env.EXPO_PUBLIC_*` with the real value [Source: docs.expo.dev/guides/environment-variables, read 12 Oct 2026]. `metro.config.js` adds one thing, so that a `.svg` file becomes a component:

```js
// react-native-svg-transformer makes each .svg a component, so the logo draws from its source file.
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo')
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg')
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg']

module.exports = config
```

Metro picks files by the suffix of the platform it bundles for [Source: metrobundler.dev/docs/resolution, read 12 Oct 2026] (see [Platform files](platform-files.md)):

- **iOS.** `import { Select } from '../design-system/Select'` in the top bar gives `Select.ios.tsx`; `./mocks` and `./fonts` in `src/platform/useStartup.ts` give `mocks.ts` and `fonts.ios.ts`.
- **Android.** The same imports give `Select.android.tsx`, `mocks.ts` and `fonts.ts`.
- **Web.** `mocks.web.ts` and `storage.web.ts` in `src/platform/` win over the plain files, and `react-native` is pointed at `react-native-web` [Source: @expo/cli 57.0.27 withMetroMultiPlatform.js (the alias `'react-native': 'react-native-web'`), read 12 Oct 2026].

## 6. `expo-router/entry`

`package.json` names `"main": "expo-router/entry"`, so the app has no `index.js` and no `App.tsx`. The entry file of Expo Router registers the root component with the platform and renders it [Source: expo-router 57.0.24 entry-classic.js, read 12 Oct 2026]. On the web that means mounting it in the element with the id `root` [Source: expo 57.0.26 src/launch/registerRootComponent.web.tsx, read 12 Oct 2026]. The router reads every file under `src/app` and builds the route table [Source: docs.expo.dev/router/basics/core-concepts, read 12 Oct 2026]. With `typedRoutes` on, Expo also writes TypeScript types for that table to `.expo/types/router.d.ts` [Source: docs.expo.dev/router/reference/typed-routes, read 12 Oct 2026].

## 7. `_layout.tsx`

`RootLayout` calls `useStartup()` from `src/platform/useStartup.ts`. That hook waits for the fonts (`useAppFonts`) and starts the mock server (`startMocks()`), and returns `true` only when both are done. Until then `RootLayout` returns `null`, so no page asks the API before the mock server can answer. If the mock server fails to start, the error is only logged and the app still draws, so the error states appear instead of a blank page. When startup is done, the layout wraps every page in `AppFrame` (`src/shell/AppFrame.tsx`): `LocaleProvider` (the language), `WorkspaceProvider` (the open workspace) and `Shell` (the frame). `<Slot />` is the place where the page that matches the path is drawn.

```tsx
import { Slot } from 'expo-router'

import { useStartup } from '../platform/useStartup'
import { AppFrame } from '../shell/AppFrame'

// Nothing draws before startup ends, so no page asks the API before the mock server answers.
export default function RootLayout() {
  const ready = useStartup()
  if (!ready) return null
  return (
    <AppFrame>
      <Slot />
    </AppFrame>
  )
}
```

`<Slot />` is a placeholder for the current child route [Source: docs.expo.dev/router/advanced/root-layout, read 12 Oct 2026]. The two files `useStartup` waits on differ by platform:

- **iOS.** `src/platform/mocks.ts` defines the classes Hermes lacks (`Event`, `EventTarget`, `MessageEvent`, `BroadcastChannel`) so that MSW can load [Source: comment in src/platform/mocks.ts, read 12 Oct 2026], then replaces the global `fetch` with a version that asks the mock handlers first. An API call that no handler answers logs an error that names the call. `src/platform/fonts.ios.ts` calls `useFonts` of `expo-font` to load the three `.ttf` files.
- **Android.** `mocks.ts` is the same file. `src/platform/fonts.ts` returns `true` at once: `app.json` already builds the fonts into the app, one static file per weight.
- **Web.** `src/platform/mocks.web.ts` registers the MSW service worker and reads the scenario from `?mock=` in the URL; an API call that no handler answers makes MSW print an error that names it. `fonts.ts` returns `true` at once: the fonts are declared in CSS in `index.html`.

## 8. `Shell`

`Shell` is the frame of every page. It sits in the layout, outside the page, so it reads the `workspaceId` of the URL with `useGlobalSearchParams` rather than `useLocalSearchParams` (see [Routing](routing.md)). It calls `/shell` for the menu, works out the width tier with `useWindowDimensions` (see [Styles and layout](styles-and-layout.md)) and leaves room for the safe areas with `useSafeAreaInsets`.

```tsx
export function Shell({ children }: { children: ReactNode }) {
  const params: Params = useGlobalSearchParams()
  const pathname = usePathname()
  const active = activeOf(pathname)
  const fromUrl = workspaceOfUrl(active, params)
  const workspaceId = useWorkspace(fromUrl)
  const projectId = one(params.projectId) ?? null
  const shell = useShell(workspaceId)
  useWorkspaceMemory(fromUrl, shell.result)
  const { locale, setLocale } = useLocale()
  const tier = useTier()
  const drawer = useDrawer(tier, pathname)
  // ...
  const insets = useSafeAreaInsets()
  // ...
  return (
    <View testID="shell" style={[styles.shell, safeArea(insets)]}>
      {tier === 'desktop' ? sidebar : null}
      {tier === 'tablet' ? (
        <Rail
          // ...
        />
      ) : null}
      <View testID="shell-main" style={styles.main}>
        <TopBar model={bar} onLocale={setLocale} menu={menu} />
        <ScrollView testID="page" role="main" style={styles.page}>
          {children}
        </ScrollView>
      </View>
      {/* ... the Drawer, which holds the sidebar below desktop width ... */}
    </View>
  )
}
```

The workspace of the frame comes, in order, from the workspace named in the path of a `/w/` page; else from the last workspace whose menu loaded (the web remembers it across page reloads, the apps only while the app stays open); else from `HOME` in `src/platform/config.ts`. So My focus, Approvals, Notifications and Search keep the workspace you were viewing. On a page outside a workspace, a remembered workspace that the server reports as not found or forbidden is forgotten, so a mistyped path does not trap those pages (see [What the client remembers](../../../architecture/decisions/client-memory.md)).

- **iOS.** An iPhone is a few hundred points wide (390 in the tests), far below the 768 of the token `bpTablet`, so the tier is `phone`: no sidebar, and the menu button of the top bar opens the sidebar as a drawer (a `Modal`). The safe area leaves room for notches, the status bar and the home indicator [Source: docs.expo.dev/versions/latest/sdk/safe-area-context, read 12 Oct 2026].
- **Android.** The same phone tier. The Back button closes the drawer through the `onRequestClose` of `Modal` [Source: reactnative.dev/docs/modal, read 12 Oct 2026]. The safe area leaves room for the interface elements of the system, such as the status bar.
- **Web.** A 1440 px window is the `desktop` tier: the sidebar is always visible. Drag the window narrower than 1280 px and then 768 px to watch the frame change.

## 9. Route

The path `/` matches `src/app/index.tsx`, which only holds a `<Redirect>` to the overview of the `HOME` project, `/w/creative-studio/projects/meridian-cgi-campaign/overview`. The file `overview.tsx` reads `workspaceId`, `projectId` and `scope` with `useLocalSearchParams` and hands them to `OverviewScreen`. The route does nothing else:

```tsx
import { useLocalSearchParams } from 'expo-router'

import { one, type Params } from '../../../../../core/routes'
import { OverviewScreen } from '../../../../../screens/24-project-overview/Screen'

// A segment arrives as one string; anything else becomes an empty id, which reads as not found.
export default function OverviewRoute() {
  const params: Params = useLocalSearchParams()
  return (
    <OverviewScreen
      workspaceId={one(params.workspaceId) ?? ''}
      projectId={one(params.projectId) ?? ''}
      scope={one(params.scope)}
    />
  )
}
```

- **iOS and Android.** The apps have no address bar, but the paths exist: the URL scheme `metis` in `app.json` lets a deep link open a page [Source: docs.expo.dev/versions/latest/config/app and docs.expo.dev/router/basics/core-concepts, read 12 Oct 2026].
- **Web.** The URL changes in the address bar [Source: docs.expo.dev/router/basics/core-concepts, read 12 Oct 2026].

## 10. Data

`useOverview` hands `useApi`, the shared hook, a key and a function that calls `getOverview`. `fetch` goes to `https://api.metis.test/...` (the default when `EXPO_PUBLIC_API_BASE` is not set), the mock server answers, `zod` checks the shape of the answer, and `buildOverview` translates the text, formats the numbers and builds the links. The screen only draws the result. [Data flow](data-flow.md) follows each step, with the error cases.

## 11. Render

- **iOS.** Fabric, the renderer of React Native, compares the new React tree with the old one and creates or updates the matching native views: a `View` becomes a UIKit view. Yoga computes positions and sizes. There is no DOM, no CSS and no browser [Source: reactnative.dev/architecture/render-pipeline, read 12 Oct 2026].
- **Android.** The same Fabric and Yoga, with Android views as the result: a `View` becomes a `ViewGroup`, a `Text` a `TextView` and a `ScrollView` a native scroll container [Source: reactnative.dev/architecture/render-pipeline and reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026].
- **Web.** `react-native-web` translates the components into HTML elements: a `View` becomes a `<div>` (or a `<nav>`, `<header>` or `<main>`, by its `role`), a `Text` a `<div>` or an `<h1>`, a `Pressable` with an `href` an `<a>`. Styles become CSS classes. React DOM mounts everything in the element with the id `root` [Source: react-native-web 0.21.3 dist/exports/View/index.js and dist/modules/AccessibilityUtil/propsToAccessibilityComponent.js, and expo 57.0.26 src/launch/registerRootComponent.web.tsx, read 12 Oct 2026]. [Components](components.md) shows the measured output.

## Try it

With Xcode installed, run `pnpm ios`; the first build takes a while. Then change a word in `src/screens/24-project-overview/strings/en.ts` and save the file. The Simulator shows the new text without a native rebuild, because only JavaScript changed [Source: reactnative.dev/docs/fast-refresh, read 12 Oct 2026]. Undo the edit afterwards.

## Check yourself

You add a plugin to the `plugins` array of `app.json`. What do you do to see its effect on the iOS Simulator?

1. Save the file and let Fast Refresh load it.
2. Run prebuild again (`pnpm exec expo prebuild --clean`), then rebuild with `pnpm ios`.
3. Clear the Metro cache with `--clear`.
4. Nothing: plugins run every time the app opens.

<details>
<summary>Answer</summary>

Option 2. A plugin runs during prebuild and changes the native project [Source: docs.expo.dev/config-plugins/introduction, read 12 Oct 2026]. Fast Refresh updates React components in the running app [Source: reactnative.dev/docs/fast-refresh, read 12 Oct 2026], and `--clear` clears the bundler cache [Source: `expo start --help` of the installed CLI, read 12 Oct 2026]; neither touches the native project. The installed app stays the old native build until the native project is generated again with `pnpm exec expo prebuild --clean` [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026] and the app is rebuilt.

</details>
