---
title: Plain core, shared shell, layers enforced by lint
summary: Import rules enforced by ESLint keep the core free of UI, Expo and MSW, keep the design system and each screen apart, and give the parts shared by all screens one home in the shell.
component: app
type: decision
status: current
ids: []
---

# Plain core, shared shell, layers enforced by lint

## Context

A `core/` folder for everything that is not interface (API calls, the zod contract, dictionaries, formatting and the display logic of each screen as pure functions) was proposed so that a later mobile app could reuse it unchanged. A lint rule was to forbid `core/` from importing React DOM, the design system or browser objects.

The code review of 9 Oct 2026 tested the first form of these rules and found three problems:

- About 260 lines that every screen needs were trapped in screen 24: the data hook that drops old answers, the mapping of API errors to states, the state view, the number helpers `num` and `counted`, and the texts of the error states. Lint forbids a screen from importing another screen, so screen 25 would have had to copy them with their tests, and a bug fix would have had to be repeated for every screen.
- The rules could be bypassed. `src/core` importing `expo-router` got through, because the rule banned only the names `react`, `react-native` and `react-dom`, and a screen's `model.ts` importing a component got through. The rows "a screen imports a screen" and "mocks" had no counter-test, and the spec contradicted itself: it forbade every `model.ts` from importing `src/screens/`, although the model of a screen has to read the screen's own text.
- When the shell failed to load, it had asked only once and could not retry, and its error sentence told the user to reload a page, which does not exist on iOS and Android.

## Decision

Each layer has import rules, and ESLint enforces them for production code. Tests may cross the boundaries, for example to load `src/mocks/`.

| Area | May not import |
|---|---|
| `src/core/` | `src/design-system/`, `src/platform/`, `src/shell/`, `src/screens/`, `src/mocks/` |
| `src/core/` and every model file (`model.ts`, `model.<part>.ts`) | the interface and platform packages `react`, `react-dom`, `react-native`, `react-native-*`, `@react-native*/*`, `@react-navigation/*`, Expo (`expo`, `expo-*`, `@expo/*`) and MSW (`msw`, `msw/*`), whether by `import`, `import()` or `require`; and they may not use `window`, `document`, `localStorage`, `globalThis` or `self` |
| every model file | `src/design-system/`, `src/platform/`, `src/mocks/` |
| the model file of a screen | `src/shell/` (a screen puts the model of the shell together with its own, but its own model does not import the shell); inside the folder of the screen it may import only `model.*` files and `strings/` |
| the model file of `src/shell/` | `src/screens/`, and every file of `src/shell/` except `./strings` |
| `src/design-system/` | `src/core/i18n/` (the translation layer), `src/platform/`, `src/shell/`, `src/screens/`, `src/mocks/` |
| `src/screens/<id>/` | another screen |
| `src/shell/`, `src/screens/`, `src/app/` | `src/mocks/`; only `src/platform/` (to start the mock server) and tests import it |
| every file except `src/design-system/Text.tsx` and `Glyph.tsx` | `Text` of `react-native`; no file draws `Animated.Text`, because the `Text` of the design system sets the typeface each platform needs |

ESLint enforces the table with `import/no-restricted-paths`, `no-restricted-imports`, `no-restricted-syntax` and `no-restricted-globals` in `eslint.config.js`. The ban lists are in `eslint-rules/restrictions.js`, which has tests of its own, and the counter-tests `boundary-*` and `native-text` prove that the rules go red.

`src/shell/` has two roles:

- The frame of every page: `AppFrame` (the language provider, the workspace provider and the frame, so that the root layout and the tests mount the same tree), `Shell`, the sidebar, the icon rail, the top bar, the drawer, the project header `ProjectHeader` and the generic "not built" page.
- The parts shared by every screen: the data hook `useApi(key, load)`, which drops the answer to an older request and can retry (the data hooks of the screens and of the shell are this hook); `problemOf` in `model.problem.ts`, which turns an API error into a state to draw; `StateView`, which draws loading and errors; and the dictionary of the shell with its shared `states` block.

A screen never imports another screen. What every screen needs lives in `src/shell/`, and a new shared helper needs two callers in the change that adds it. Route files only read the URL parameters and hand them to the screen. The conventions in full are in [Develop the app](../../components/app/develop.md).

A shell that fails to load offers a "Try again" button, on the icon rail as well, because a menu in error must not look as if it were still loading. The rail has its own dictionary entry for it, `sidebar.menuErrorRetry`, in English "Could not load the menu. Try again".

The lint rule `no-style-literals` stops at the files that cannot hold style: `src/core`, `src/mocks` and the model files. Measured, ordinary value ranges and sizes in those files gave two reports each, and a style object written in a component stays red. Those files import no interface layer, which the boundary rules enforce, and the screens still to come keep their value ranges in model files and mock data.

## Consequences

- A break of a layer is red in lint, and each rule has a counter-test that proves it can go red (see [A screen is done when its gates pass, each proven able to fail](gates-with-canaries.md)).
- Screens cannot copy shared parts from one another, so a fix to a shared part is made once.
- `src/core` does not depend on the interface, so if the back end or another app later needs the API contract, it can reuse `core/` unchanged.
- A helper used by one screen only stays in that screen, because a shared helper needs two callers in the change that adds it.
- It rules out interface, platform, Expo or MSW code in `src/core` and in model files, a screen importing a screen, production code importing the mocks, and the design system reading the translation layer.

## Status

Current, approved by the owner on 5 Oct 2026 with the foundation spec (FE-16). The rules as written here are the as-built result of the code clean-up of 10 Oct 2026, taken under FE-27 and FE-28.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 337 to 340 of the original (the proposal of a plain `core/`).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 111 to 142 of the original (the two roles of the shell, the boundary table, how it is enforced).
- [Code review report](../../history/code-review/report.md): lines 197 to 207, 219 to 229 and 252 to 259 of the original (findings 7, 9 and 12).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 24 of the original, and lines 1005 and 1050 (rows 28 and 73 of its table of rulings).
