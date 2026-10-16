---
title: React Native for web developers
summary: What a React web developer already knows, what the Metis app calls it, who does what among React, React Native and Expo, and a glossary.
component: app
type: how-to
status: current
ids: []
---

# React Native for web developers

You know React. In the Metis app the same components run as an iOS app, an Android app and a web page, all from one folder, `src`. React Native replaces `react-dom` with a renderer that creates the real views of the operating system [Source: reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026]. Around it the app uses Expo for the command line, the config in `app.json`, the router and the prebuilt native modules. This guide walks through the real code of `metis-app` to show where each part lives.

Paths on every page of the guide are relative to the root of the `metis-app` repository. The guide quotes code from that repository and names a file and a symbol, never a line number, so it stays true when lines move.

## The guide in reading order

1. This page: the vocabulary, and who does what.
2. [Project structure](project-structure.md): the folders of the repository and the direction of their imports.
3. [From command to screen](from-command-to-screen.md): what happens between `pnpm web`, `pnpm ios` or `pnpm android` and a screen.
4. [Platform files](platform-files.md): one import, up to three files, and when a platform file is right.
5. [Components](components.md): `View`, `Text` and `Pressable` in place of `div`, `span` and `button`.
6. [Styles and layout](styles-and-layout.md): styles without CSS, layout without media queries, three width tiers.
7. [Routing](routing.md): paths that are files.
8. [Data flow](data-flow.md): data that goes one way, and the mock scenarios.
9. [Testing](testing.md): tests on four platforms, and the checks beyond Jest.

## Three builds from one folder

| Build | Command | What it does |
|---|---|---|
| iOS | `pnpm ios` | Runs `expo run:ios`: builds the native app, installs it and loads the JavaScript from Metro [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026] |
| Android | `pnpm android` | Runs `expo run:android`: builds the native app with Gradle and installs it, with the same JavaScript [Source: @expo/cli 57.0.27 run/android/runAndroidAsync.js (it calls Gradle's assemble step), read 12 Oct 2026] |
| Web | `pnpm web` | Runs `EXPO_PUBLIC_MOCKS=1 expo start --web --clear`: serves the page at `localhost:8081` with the mock server on [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026]. `react-native-web` translates the components to DOM elements |

The scripts are in `package.json`. Every table in the guide names the platform it describes.

## What you know, and what it is called here

Most of what you know about React carries over unchanged: components, props, state, hooks, context, keys. What changes is what sits under React (who draws the screen) and around it (who bundles, routes and tests).

| In React on the web | In the Metis app | Where to look |
|---|---|---|
| `react-dom` draws the component tree into the DOM | `react-native` draws it into the views of iOS and Android. On the web, `react-native-web` translates the same components into DOM elements [Source: necolas.github.io/react-native-web/docs, read 12 Oct 2026] | `package.json` (`dependencies`) |
| Vite or webpack bundles the code | Metro bundles it and the Expo CLI starts it [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026]. `metro.config.js` adds one thing: it turns `.svg` files into components | `metro.config.js` |
| `index.html` plus `main.tsx` calling `createRoot` | `"main": "expo-router/entry"` in `package.json`: the entry file of Expo Router registers the root component itself [Source: expo-router 57.0.24 entry-classic.js, read 12 Oct 2026]. `public/index.html` exists for the web build only | `package.json`, `public/index.html` |
| React Router, or the `app/` folder of Next.js | Expo Router: each file under `src/app` is a path, and `_layout.tsx` wraps the pages [Source: docs.expo.dev/router/introduction and docs.expo.dev/router/advanced/root-layout, read 12 Oct 2026] | `src/app/_layout.tsx` |
| `<div>`, `<span>`, `<button>` | `<View>`, `<Text>`, `<Pressable>`. Every text node must sit inside `<Text>` [Source: reactnative.dev/docs/text, read 12 Oct 2026] | `src/shell/MenuButton.tsx` |
| `onClick` | `onPress` [Source: reactnative.dev/docs/pressable, read 12 Oct 2026] | `src/shell/MenuButton.tsx` |
| `<a href>` | `PressableLink`: a `Link asChild` around a `Pressable`. On the web it becomes `<a href>`; on the apps a press navigates [Source: expo-router 57.0.24 build/link/BaseExpoRouterLink.js and react-native-web 0.21.3 dist/exports/View/index.js, read 12 Oct 2026] | `src/design-system/PressableLink.tsx`, `src/design-system/Tile.tsx` |
| CSS, `className`, media queries | `StyleSheet.create` in a `*.styles.ts` file, style arrays, and `useWindowDimensions` for the width [Source: reactnative.dev/docs/style and reactnative.dev/docs/usewindowdimensions, read 12 Oct 2026] | `src/design-system/tier.ts` |
| `import.meta.env.VITE_*` | `process.env.EXPO_PUBLIC_*`, replaced by its value when the code is bundled [Source: docs.expo.dev/guides/environment-variables, read 12 Oct 2026] | `src/platform/mocks.web.ts`, `src/platform/config.ts` |
| `localStorage` | The web build uses `localStorage`. The apps remember nothing between launches yet; a comment in the file says AsyncStorage would lift that limit | `src/platform/storage.ts`, `src/platform/storage.web.ts` |
| MSW running in a service worker | The web build keeps the service worker [Source: mswjs.io/docs/integrations/browser, read 12 Oct 2026]. The apps have none, so they wrap `fetch` | `src/platform/mocks.ts`, `src/platform/mocks.web.ts` |
| `@font-face` | Web: `@font-face` in `public/index.html`. iOS: `expo-font` loads `.ttf` files while the app runs. Android: the `expo-font` entry of `app.json` embeds one static font file per family and weight when the app is built [Source: docs.expo.dev/versions/latest/sdk/font, read 12 Oct 2026] | `src/platform/fonts.ios.ts`, `src/platform/fonts.ts`, `app.json` |
| Jest with jsdom | `jest-expo` runs four Jest projects: iOS, Android, Web and Node [Source: jest-expo 57.0.5 config presets, read 12 Oct 2026] | `jest.config.js` |
| Playwright | Playwright for the web build, Maestro for the apps on simulators and emulators | `e2e/web`, `e2e/native` |

## Who does what: React, React Native, Expo

React decides what needs drawing. React Native draws it with the views of the operating system [Source: reactnative.dev/docs/intro-react-native-components, read 12 Oct 2026]. In this app Expo builds, runs and packages it [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026]. The first table below is what happens on your machine when you build; the second is the layers that run inside the app or the browser.

Build time, on your machine:

| Step | What it does | Output | Platforms |
|---|---|---|---|
| Expo CLI | `expo start`, `expo run:ios`, `expo run:android`, `expo export` [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026] | The commands that start the rest | All |
| Metro and Babel | `metro.config.js` and `babel-preset-expo` | A JavaScript bundle: layers 1 to 4 below | All |
| Prebuild | `app.json` and `plugins/` produce `ios/` and `android/` [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026] | The native projects | iOS, Android |
| Xcode and Gradle | Compile the native part [Source: @expo/cli 57.0.27 run/ios/XcodeBuild.js and run/android/runAndroidAsync.js, read 12 Oct 2026] | An installable app: layers 5 and 6 below | iOS, Android |

Run time, inside the app or the browser:

| Layer | iOS and Android | Web |
|---|---|---|
| 1. Your code | `src/`: TypeScript and React | The same |
| 2. Libraries | `expo-router`, `expo-font`, `react-native-safe-area-context`, `@react-native-picker/picker`, `react-native-svg` | The same |
| 3. React | Components and hooks; React compares the old tree with the new | The same |
| 4. The React Native API | `react-native`: `View`, `Text`, `Pressable`, `ScrollView`, `StyleSheet` | `react-native-web`: the same API, written on `react-dom` [Source: necolas.github.io/react-native-web/docs, read 12 Oct 2026] |
| 5. The engine | Hermes runs the JavaScript, Fabric draws, Yoga computes flexbox [Source: reactnative.dev/docs/hermes, reactnative.dev/architecture/fabric-renderer and reactnative.dev/architecture/render-pipeline, read 12 Oct 2026] | The browser's JavaScript engine and CSS layout [Source: necolas.github.io/react-native-web/docs, read 12 Oct 2026] |
| 6. The views | UIKit views on iOS; Android views on Android (`ViewGroup`, `TextView`) [Source: reactnative.dev/architecture/render-pipeline, read 12 Oct 2026] | DOM elements: `div`, `a`, `button`, `h1` |

Layers 1 to 3 are the same on all three platforms. From layer 4 each platform takes its own path. The prebuild step and Xcode or Gradle exist only on the two app lines.

### React

React is used as you know it. The code base uses three newer parts of React 19:

- `use(LocaleContext)` reads a context [Source: react.dev/reference/react/use, read 12 Oct 2026]; see `src/shell/locale.tsx`.
- `<LocaleContext value>` is a provider, and `WorkspaceContext` is one too [Source: react.dev/blog/2024/12/05/react-19, read 12 Oct 2026]; see `src/shell/workspace.tsx`.
- `useEffectEvent`, from React 19.2 [Source: react.dev/blog/2025/10/01/react-19-2, read 12 Oct 2026], lets `useApi` call the latest load function without asking the server again on every render; see `src/shell/useApi.ts`.

React Compiler is on in `app.json` (`experiments.reactCompiler`): the compiler memoizes components and hooks by itself [Source: docs.expo.dev/guides/react-compiler, read 12 Oct 2026]. Nothing under `src` calls `useMemo` or `useCallback` or wraps a component in `memo`.

### React Native

React Native supplies the core components, the style system and the engine that runs them. Hermes is the JavaScript engine it uses by default [Source: reactnative.dev/docs/hermes, read 12 Oct 2026]. On the web, react-native-web plays the same part as a layer on `react-dom` [Source: necolas.github.io/react-native-web/docs, read 12 Oct 2026].

The app code, tests not counted, imports only these names from `react-native`: `StyleSheet`, `View`, `Pressable`, `Platform`, `ScrollView`, `Modal`, `Text`, `StatusBar`, `ActivityIndicator`, `ActionSheetIOS` and `useWindowDimensions`. Only `Text.tsx` and `Glyph.tsx` of the design system import `Text`: a lint rule (`nativeText` in `eslint-rules/restrictions.js`) forbids it anywhere else, so every piece of text goes through the design system's `Text`, which sets the font face each platform needs.

### Expo

Expo is the toolset around React Native. In this app that is the `expo` command line, `app.json` and its plugins, the prebuild step that generates `ios/` and `android/`, `babel-preset-expo`, the Metro config, `jest-expo`, and modules such as `expo-router`, `expo-font` and `expo-splash-screen`.

The app code imports two Expo packages directly, `expo-router` and `expo-font`. Expo does the rest when the app is built.

## What the app does not use, or barely

- **Expo Go**, Expo's ready-made app for trying JavaScript. A development build is "your own version of Expo Go where you are free to use any native libraries and change any native configuration" [Source: docs.expo.dev/develop/development-builds/introduction, read 12 Oct 2026]. The app has a plugin that edits the native project, so it builds its own app with `expo run:ios` and `expo run:android`.
- **Over-the-air updates**, which send new JavaScript to an installed app without going through the store [Source: docs.expo.dev/eas-update/introduction, read 12 Oct 2026]. They are off: `updates.enabled` is `false` in `app.json`, which makes builds use only the code and assets bundled when they were built [Source: docs.expo.dev/versions/latest/config/app, read 12 Oct 2026]. The repository has no `eas.json`.
- **`Platform.OS` in code.** It appears only where the difference is one value and a branch on the spot is clearer: `src/design-system/tier.ts` (finger or mouse), `src/design-system/fonts.ts` (a font name or a whole font stack) and `src/design-system/Dialog.tsx` (the kind of shadow below Android 9) are examples. Every other difference lives in a file with a platform suffix (see [Platform files](platform-files.md)). The rule is in the Platform forks section of [Develop the app](../develop.md): a platform file exists only when the behavior or the component really differs.
- **State or fetch libraries** such as Redux or React Query. There are none: the data path uses `useState`, `useEffect`, `fetch` and `zod` (see [Data flow](data-flow.md)). React Native provides the Fetch API [Source: reactnative.dev/docs/network, read 12 Oct 2026].

## Glossary

| Term | Meaning |
|---|---|
| Metro | The JavaScript bundler of React Native. It builds the graph of modules from the entry point, transforms each one (with Babel in this app), joins the results into one bundle and picks files by platform suffix [Source: metrobundler.dev/docs/concepts and metrobundler.dev/docs/resolution, read 12 Oct 2026]. In development it is a server on port 8081 [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026] |
| Bundle | One JavaScript file with all the code of the app. A debug app loads it from Metro [Source: comments of e2e/native/phone.yaml, read 12 Oct 2026]; the web export writes it to `dist/_expo/static/js/web/entry-<hash>.js` [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026, and the listing of the `dist` folder of a checkout the same day] |
| Hermes | The JavaScript engine React Native uses by default [Source: reactnative.dev/docs/hermes, read 12 Oct 2026]. It lacks some browser classes such as `MessageEvent`, so `src/platform/mocks.ts` defines empty ones before it loads MSW [Source: comment in src/platform/mocks.ts, read 12 Oct 2026] |
| Fabric | The renderer of React Native: it turns the React tree into native views and updates them [Source: reactnative.dev/architecture/fabric-renderer, read 12 Oct 2026] |
| Yoga | The layout engine, written in C++, that React Native calls to compute the position and size of each view from its flexbox style [Source: reactnative.dev/architecture/render-pipeline, read 12 Oct 2026] |
| react-native-web | A library that implements the React Native API on `react-dom`, so the same code runs in a browser: a `View` becomes a `div`, styles become CSS classes [Source: necolas.github.io/react-native-web/docs and react-native-web 0.21.3, read 12 Oct 2026] |
| Expo CLI | The `expo` command. `start` runs the development server, `run:ios` and `run:android` build and install the app, `export` writes the web build, `prebuild` generates the native projects [Source: docs.expo.dev/more/expo-cli, read 12 Oct 2026] |
| Prebuild | The step that generates `ios/` and `android/` from `app.json` and the plugins. Expo calls the approach Continuous Native Generation: the native projects are generated when needed and can stay out of version control [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026] |
| Config plugin | A JavaScript function that runs during prebuild and edits the native project files for you [Source: docs.expo.dev/config-plugins/introduction, read 12 Oct 2026]. The app has one of its own in `plugins/` |
| Autolinking | The mechanism that links the native code of the installed packages into the iOS build (through CocoaPods) and the Android build (through Gradle), so you only install the package [Source: docs.expo.dev/modules/autolinking, read 12 Oct 2026] |
| Expo Go | Expo's ready-made app for trying JavaScript code. The app builds its own instead [Source: docs.expo.dev/develop/development-builds/introduction, read 12 Oct 2026] |
| Fast Refresh | Saving a file sends the changed module to the running app; React renders again and keeps the state of function components when it can [Source: reactnative.dev/docs/fast-refresh, read 12 Oct 2026]. It replaces JavaScript only: a change to the native part needs the native project generated again and a new native build [Source: docs.expo.dev/workflow/continuous-native-generation, read 12 Oct 2026] |
| Density-independent pixels | The unit of every style number: the same physical size on screens of different pixel density [Source: reactnative.dev/docs/height-and-width, read 12 Oct 2026]. On the web react-native-web writes CSS pixels (measured by rendering a `View` with `height: 52`, which gave `height:52px`, on 12 Oct 2026) |
| Safe area | The part of the screen not covered by notches, status bars, home indicators and other interface elements of the device or the system. `useSafeAreaInsets()` returns those margins [Source: docs.expo.dev/versions/latest/sdk/safe-area-context, read 12 Oct 2026]. On the web the same hook reads the browser's safe-area values [Source: react-native-safe-area-context 5.7.0 src/NativeSafeAreaProvider.web.tsx, read 12 Oct 2026] |
| `testID` | The prop that names an element for tests: it becomes `data-testid` on the web and the id that Maestro finds on the apps [Source: reactnative.dev/docs/view, docs.maestro.dev/platform-support/react-native and react-native-web 0.21.3, read 12 Oct 2026] |
| Typed routes | TypeScript types that Expo Router generates from `src/app` into `.expo/types/router.d.ts`, so a wrong `href` is a compile error [Source: docs.expo.dev/router/reference/typed-routes, read 12 Oct 2026] |
| React Compiler | The compiler that memoizes components and hooks, in place of hand-written `useMemo`, `useCallback` and `memo` [Source: docs.expo.dev/guides/react-compiler, read 12 Oct 2026] |
| EAS | Expo Application Services, Expo's cloud service; its update service sends JavaScript, styling and image updates to an installed app over the air [Source: docs.expo.dev/eas-update/introduction, read 12 Oct 2026]. The app does not use it |

## Further reading

- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code): the `.ios`, `.android` and `.native` suffixes, from React Native.
- [Introduction to React Native for Web](https://necolas.github.io/react-native-web/docs/): react-native-web.
- [Introduction to Expo Router](https://docs.expo.dev/router/introduction/): a route table from a folder.
- [Using URL parameters](https://docs.expo.dev/router/reference/url-parameters/): `useLocalSearchParams` and `useGlobalSearchParams`.
- [Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/): prebuild.
- [Introduction to config plugins](https://docs.expo.dev/config-plugins/introduction/): plugins that edit native files.
- [Environment variables in Expo](https://docs.expo.dev/guides/environment-variables/): `EXPO_PUBLIC_*`.
- [Introduction to development builds](https://docs.expo.dev/develop/development-builds/introduction/): building the app yourself instead of using Expo Go.
