---
title: Develop the app
summary: The rules of the metis-app code base and its 13 checks, how to run them, and what each one proves.
component: app
type: how-to
status: current
ids: []
---

# Develop the app

The rules of the `metis-app` code base. A gate enforces most of them (named next to the rule);
reviewers enforce the rest. Run every command from the root of a `metis-app` clone; paths on this
page are relative to it.

## Language

- Code, comments, documents, test names (`describe`, `it`, `test`), lint messages and the output of
  scripts and gates are English.
- Vietnamese lives only in the `vi` dictionaries (`src/**/strings/vi.ts`) and on the line right after a
  `lang-exception: <reason>` comment (any comment syntax; one comment excuses one line). The gate flags
  every other non-ASCII letter too (rule `non-ascii-letter`), so an accented name needs the marker as well.
- Use `lang-exception:` for the native language names (`NATIVE_NAMES` in `src/core/i18n/locale.ts`), the
  bilingual `<noscript>` text of `public/index.html`, and Vietnamese test data that no dictionary holds:

```ts
// lang-exception: a project name typed by a user, to prove the diacritics render
const typed = '<a project name typed with Vietnamese letters>'
```

- `node scripts/check-language.mjs [path ...]` checks this and the banned references under Comments,
  dates included. It looks for references in comments (after `//`; inside `/* */`, and `<!-- -->`
  outside scripts, on every line they span; after `#` in YAML and ignore files), in test titles (the
  first string or template of a `test`, `it`, `describe` or `suite` call or of a member such as
  `test.each(table)`, on the line of the call or the next) and in every line of a Markdown file, so
  product text such as a WBS item named "Task 1 of 3" passes. In a script it steps over strings,
  template literals and regular expressions, so a `//` or `/*` inside one starts no comment; a quote
  that does not close on its line opens no string, since JSX text may hold an apostrophe, and in a
  `.tsx` file `/>` closes a tag. It reads tokens, not a syntax tree: a regular expression right after
  `)` reads as a division, a division right after `}` as a regular expression, two apostrophes on
  one line of JSX text as a string, in a `.tsx` file a regular expression that starts with `>` as a
  tag closer, and an apostrophe in JSX text with a quote of code on the same line as a string; each
  can misread what follows it. These, a title held in a
  variable and tool output (a logged line, an error message) are out of its reach, so reviewers check
  them. With no path (`pnpm gate:language`) it scans the whole repository, `.github/workflows/`
  included, but not the copies under `pinned/`, which `metis-docs` checks;
  it prints `path:line: rule: excerpt` per problem and exits 1 on a problem, or when the paths hold no
  file to scan.

## Comments

- A comment is one English line that says why: a measured platform quirk, a workaround, an invariant, a
  trade-off. Do not retell what the code does.
- Never point at something the next maintainer cannot open: plan or ruling ids, task numbers, spec
  section numbers, line numbers of a reference file, dates, measurement logs. State the fact itself.
  BRD requirement codes (`OVW-01`, `BR-24`, `D-19`) are fine when the comment names the requirement.

```ts
// Banned: names documents the reader does not have.
// Closes on select, R-B15 and spec 4.4, see wireframe.css:199, measured on 9 Oct.
// Right: the fact.
// The drawer closes on select because a phone user cannot reach the page behind it.
```

- Every escape hatch carries its reason: `eslint-disable-next-line <rule> -- <reason>`,
  `Stryker disable next-line <Mutator>: <reason>`, `token-exception: <reason>`,
  `restated-literal: <reason>`. A deliberate shortcut says `ponytail: <its ceiling>; <how to lift it>`.

## One source of truth

| Value                                  | Source                                                           |
| -------------------------------------- | ---------------------------------------------------------------- |
| ids and people of the demo data        | `IDS` and `PEOPLE` in `src/mocks/fixtures/ids.ts`                |
| names, numbers, dates of the demo data | the objects exported by `src/mocks/fixtures/*`                   |
| text the user reads                    | `STRINGS` of the shell and of each screen (`strings/`)           |
| paths                                  | `ROUTES` in `src/core/routes.ts`                                 |
| colours, sizes, spacing                | `tokens`, generated from `pinned/design/brand/tokens.css` by `pnpm gen:tokens` |

- Each value is defined once. Never retype it in a test, an e2e spec (paths come from
  `e2e/web/paths.ts`) or a script: renaming the demo client or rewording a sentence must change one
  file. `gate:lint` (`local/no-restated-literals`) rejects a string in a test file that equals a
  value of `src/mocks/fixtures/*`, or of a dictionary outside the reference model tests below, or
  that holds an id of `src/mocks/fixtures/ids.ts` (in a path or a testID); it also rejects a string
  that holds such a value of two words or more (in the reference tests, a value of the demo data only)
  or, outside those tests, fills a dictionary template whose fixed text has two words or more;
  `'a ' + 'b'` counts as `'a b'`. The line above may give a `restated-literal:` reason. A single
  lowercase or camelCase ASCII word, a string under four characters and a number pass, since such a
  match is chance; a regular expression and a template with expressions (but for an id in it) are out
  of the rule's reach, so reviewers check them.

```tsx
// Banned: retyped, so a rename breaks every test that copied it.
expect(screen.getByText('Northwind Furniture Co.')).toBeVisible()
expect(screen.getByLabelText('Open menu')).toBeVisible()
// Right: read each value where it is defined.
expect(screen.getByText(creativeStudio.tree[0].programs[0].name)).toBeVisible()
expect(screen.getByLabelText(STRINGS.en.menu.open)).toBeVisible()
```

- A typed English sentence may be the expected value only in the one reference model test of each
  area, `src/screens/<screen>/model.test.ts` and `src/shell/model.test.ts`, whose job is to prove the
  model composes that sentence: it types each sentence the model composes once, reads every plain
  label from `STRINGS` and takes the demo data inside a sentence from the fixtures. Lint checks only
  the demo data there, since it lets a whole dictionary value through in these tests, so reviewers
  check the labels. Every other test, a `model.<part>.test.ts` included, reads its copy from
  `STRINGS` or builds it with the dictionary's helpers.
- Never build a sentence by concatenation: put a `{slot}` template in the dictionary and fill it with
  `interpolate`, because word order differs per language. Plurals go through `plural()`, and a list of
  items through `joined()` with the language's `{list}, {item}` template (it takes at least one item,
  so a caller that may hold none decides what to show first). Add every new key to `en.ts` and
  `vi.ts`; `vi.ts` is typed against `en.ts`, so a missing key does not compile.
- No component types the text the user reads: JSX text and the `aria-label`, `aria-description`,
  `aria-valuetext`, `accessibilityLabel`, `accessibilityHint`, `label`, `placeholder` and `title` props
  come from a dictionary or a prop, and so do the branches of `?:`, `&&` and `||` and the operands of `+`
  in them, up to three deep; a `const` or a default value holding two words or more counts as typed
  text, written as a string or a template, and so does such a string in an object or a list a `const`
  holds (read as `COPY.empty`), cast with `as` or `satisfies` or not, since lint cannot tell which
  const a JSX child reads; a thrown message and a string in a type there are no text (lint, in the
  `.tsx` files of `src/design-system`, `src/shell`, `src/screens` and `src/app`, so a style value
  such as a font stack or a shadow, which lives in a `*.styles.ts` file or in tokens, is out of its
  reach). A helper that returns text (`() => 'No items'`) and an object or a list handed to a call
  first (`Object.freeze({...})`, `new Map(...)`) are out of the rule's reach too, so reviewers check
  them. Design-system components get all their text through props.
- No model types text either: in a `model*.ts` file lint rejects a string holding a space or
  punctuation (the braces of a `{slot}`, a hyphen and an underscore excepted), a `+` with a string and
  a `.join()` call; a thrown message, a module path, the source of a `RegExp` and a string in a type
  pass. A sign such as `+` or `→` and a hyphen alone are no punctuation to the rule, so they pass too
  and reviewers check them.
- `src/core/i18n/dictionaries.test.ts` audits every dictionary from one list: a new `strings/` folder
  adds one line there (its folder, its `STRINGS` and its `SAME_IN_VI`), and the test fails for a
  folder the list leaves out.
- A fact two fixtures share is written in one of them and read by the other: the shell tree takes the
  project and client names from the overview fixtures, and each person (the shell's user, a manager,
  a workload row) comes from `PEOPLE`, so renaming the demo client or a person changes one line.

## Tests

- Layers: the design system proves how a component looks; a screen or the shell proves what it puts in
  it (content, links, roles, accessible names, the layout it sets itself), reached by `testID`. In a
  screen or shell test, do not re-assert a design-system style or walk the element tree (`.parent`,
  `.children`, child indexes); a design-system test may walk its own component's tree.
- Use the shared builders, do not copy set-up code:
  - `src/route.test.helper.ts`: `MERIDIAN`, the demo project's path parameters, and `pathOf`, which
    fills the `[param]` segments of a route so a link test compares the path the router shows;
  - `src/widths.test.helper.ts`: `PHONE`, `TABLET`, `DESKTOP`, one window width per tier, with no imports
    so the browser specs can load them too;
  - `src/viewport.test.helper.ts`: those widths again, `setWidth`, and `asWeb`, which renders one test
    as on the web;
  - `src/mocks/server.test.helper.ts`: `mockServer` (an unhandled request fails the test);
  - `src/mocks/fixtures/ids.ts`: `UNKNOWN_ID`, an id no fixture holds, which the mock server answers
    with 404; it sits beside `IDS`, in a file without Jest globals, so the browser specs load it too;
  - `src/platform/storage.test.helper.ts`: `storageMock`;
  - `src/query.test.helper.ts`: `HIDDEN`, the query option that also finds glyphs and other marks
    hidden from screen readers, and `testIDsIn`, the testIDs a screen reader reaches inside a node, in
    render order (it skips hidden nodes, as every query without `HIDDEN` does);
  - `src/core/api/schema.test.helper.ts`: `brokenBy`, the paths a contract reports for a changed copy
    of a fixture (name the fixture's type, as in `brokenBy<Shell>(...)`, to break the copy in typed
    code), with `setPath` and `cases` to break one field at a time;
  - `src/design-system/tokens.test.helper.ts`: `distinctTokens`, which a style test hands to
    `jest.mock('./tokens', ...)` so no two tokens share a value and a swapped token shows;
  - `src/design-system/status.test.helper.ts`: `FILL`, the fill each work status wears in the stacked
    bar and in its legend swatch, read through the mocked tokens;
  - `src/spy.test.helper.ts`: `rendersOf`, `looksOf`, `rowsOf`, `glyphsOf` and `badgesOf`, which read
    what a spied component was given (next bullet);
  - `AppFrame` from `src/shell/AppFrame.tsx` (the real providers) and the `Screen.test.helper.tsx`
    beside each screen.
- To prove what a block passes to a design-system component, wrap that component in a pass-through
  spy: the real component still draws, and the test reads the props it was given.

```tsx
jest.mock('../../../design-system/Row', () => {
  const actual = jest.requireActual('../../../design-system/Row')
  return { ...actual, Row: jest.fn(actual.Row) }
})
afterEach(() => {
  jest.clearAllMocks()
})
// rendersOf(Row) lists the props of every render; rowsOf and looksOf pick out a Row or a Text.
```

- `src/window.test.setup.ts` is loaded by the iOS and Android Jest projects only. It starts every test
  on a desktop width, restores real timers and requires an assertion in every test
  (`expect.hasAssertions()`); a `.test.web.*` file, which only the Web project runs, is outside it.
- Waiting time is never the assertion. To prove a late answer is ignored, hold the promise yourself,
  resolve it when the test says so, then assert. Do not `sleep` and hope.
- Every screen has a data variant where all numeric fields differ (`distinct(data)` in its helper), so
  reading the wrong field fails even when two fields are equal in the demo data.
- A "must not appear" assertion uses the same expression as its positive twin:

```tsx
const { name } = creativeStudio.workspace
expect(screen.getByText(name)).toBeVisible() // before the switch
expect(screen.queryByText(name)).toBeNull() // after it, same `name`: a rename cannot make this vacuous
```

- No `only`, `skip`, `todo`, `fixme`, `fail` or `failing` (nor `fit`, `xit` and the like, nor
  node:test's `{ skip: true }` options or a `t.skip()` or `t.todo()` on its test context): fix the test
  or delete it. A test that must fail passes while its body is broken, so only the browser guard's
  self-tests, `e2e/web/test.spec.ts`, may call `test.fail()`. Lint rejects them in `src/**/*.test.*`,
  `e2e/` and the node:test files of `scripts/` and `eslint-rules/`, and Playwright's `forbidOnly` stops
  a focused run.
- A browser spec imports `test` and `expect` from `e2e/web/test.ts`, never from `@playwright/test` or
  `playwright/test` (lint rejects it), so a request that leaves the mock server or an undeclared page
  error fails it.
- Test names are English sentences about behavior. A test that proves a requirement starts with its
  code, which stands alone (`BR-3` does not match `BR-32`). `gate:trace` fails when a code listed in
  a screen's `contract.yaml` is in the name of no running test inside that screen's folders,
  `src/screens/<screen>/` and `e2e/web/<screen>/`, so a browser spec that proves a screen's code
  lives in its `e2e/web/` folder. A code the contract also lists under `web` needs a running spec in
  `e2e/web/<screen>/` itself, because only a browser lays the web page out; a Jest test does not
  count for it. A skipped or fixme test counts for nothing, nor does one whose body calls a bare
  `test.skip()`, `test.fixme()` or `test.fail()`; in a file with a focused test only the focused
  ones count; a `describe` name only prefixes the tests in it:

```ts
test('OVW-01 BR-32 the Blocked tile links to the project WBS filtered by status=blocked', () => {})
```

- The file suffix picks the Jest projects: `x.test.ts` runs on all four (iOS, Android, Web, Node), so use
  it for pure TypeScript; `x.test.native.tsx` runs on iOS and Android; `.ios`, `.android`, `.web` on one.

## Styles

- A component's styles live in `Component.styles.ts` beside `Component.tsx`. `StyleSheet`, style objects
  in JSX and object spreads into JSX are rejected by lint everywhere else.
- Colours and sizes come from `tokens`; a literal number or colour in a style is rejected unless the
  line right above its property says `// token-exception: <reason>` (a line above the style's name
  does not count, so a one-line style with such a value takes one property per line), and so are a
  number or colour moved into a `const NAME` of the same file, a size computed by a call and a size
  written as a `px` text. `opacity`, `zIndex`, `aspectRatio` and `shadowOpacity` take a token or a
  reason too; `flex` and `flexGrow` take any number, since bars compute them from data, and 0
  passes. The rule (`local/no-style-literals`) reads components, styles files and tests; it skips
  `src/core`, `src/mocks` and model files, which import no UI layer, so a range or a size there is
  data.
- The trade-off: the split doubles the number of files per component. We accept it because every style
  value then sits in one place where the token rule can check it, and a reviewer reads layout without
  the behavior around it. To change the split, change the lint rule and this section together.

## Platform forks

- A platform file (`X.ios.tsx`, `X.android.tsx`, `X.web.tsx`, with `X.tsx` as the default) exists only
  when the behavior or the component really differs, like the native `Select`. Each fork gets its own
  test file (`X.test.ios.tsx`) and a comment with the measured reason.
- When one value differs, branch in place: `const fingerOnly = Platform.OS !== 'web'`, not a file pair.

## Screens

- A screen is one folder, `src/screens/<number>-<name>/`: `Screen.tsx` and `Screen.styles.ts`; `blocks/`
  for pieces only this screen uses; `model.ts` (or `model.<part>.ts`), pure TypeScript that turns API
  data and the dictionary into what the screen draws; its own `strings/` dictionary; and `contract.yaml`,
  the requirement codes and controls the screen promises.
- The data hook is one call, `useApi(key, load)`, which drops answers to older questions and supports
  retry. `StateView` draws loading and error states from `problemOf(error, copy)`, where `copy` is the
  shell dictionary and the screen's own title for the state where the server does not answer.
- What every screen needs (hooks, state views, problem mapping, the frame) lives in `src/shell`; a screen
  never imports another screen. A new shared helper needs two callers in the change that adds it.
- Lint enforces the layers: `src/core` and every `model*.ts` are plain TypeScript (no React, React
  Native, React Navigation, Expo or MSW package, by `import` or `import()`, no design system, platform or
  mocks, no `window`, `document`, `localStorage`, `globalThis` or `self`); a screen's model imports no
  `src/shell` file, since the screen composes the shell's models, and from its own folder only its
  `model.*` files and `strings/`; `src/design-system` knows nothing about the app layers; `src/shell`,
  `src/screens` and `src/app` never import `src/mocks`; only `src/design-system/Text.tsx` and
  `Glyph.tsx` import `Text` from `react-native`, and no file draws `Animated.Text`, because the design
  system's `Text` sets the font face each platform needs. Route files in `src/app` only read URL
  parameters and hand them to a screen. The lists of what lint forbids live in
  `eslint-rules/restrictions.js`, with their tests.

## Gates

- A gate is a `gate:*` script in `package.json`. `pnpm verify` runs all of them in order, even after a
  red one, and writes `reports/verify.md`; CI runs the same command. While you work, run the gate of the
  area you touched (`pnpm gate:lint`); run `pnpm verify` before you hand work over.
- `pnpm verify` keeps its record in `reports/verify.json` and draws `reports/verify.md` from it on every
  run, so an edit to the Markdown never survives: one row per gate, each naming the tree it ran on (a hash
  of the files git would commit in the repository, the pinned copies included, plus the count of uncommitted changes), under
  `All rows on one tree` and `Not run`. Where git cannot list the files, a row's tree is `unknown`: the
  report then says `All rows on one tree: unknown` with a warning above the table, and a run of every
  gate exits 1, so run `pnpm verify` in a git work tree (a copy outside the repo needs `git init -q` at
  its root).
- `gate:unit` and `gate:web` are red when a test was skipped or flaky, or when the number that passed
  differs from `scripts/test-floor.json`: the floor is exact, so the change that adds or removes tests
  updates it. `gate:web` is also red when the number of its runs that expect to fail, the guard's
  self-tests that call `test.fail()`, differs from `webExpectedFailures` in the same file.
- `gate:mutation` says what it mutated (all files, the files given, a run in steps from a full run,
  or how many files changed since the base) and is red when a run yields no valid mutant; a
  `Mutation:` line above the table says `full`, `incremental from ...` or `partial, ...`.
  `pnpm verify --only <gate>[,<gate>] --append` reruns some gates and adds their rows under `Reruns`.
- Beyond `types`, `lint`, `format` and `unit` (Jest, 100% coverage): `language` (the language check
  above), `tokens` (generated tokens current), `deadcode` (knip), `tooling` (tests of `scripts/` and
  `eslint-rules/`, 100% coverage of those two folders only, so a file preloaded through
  `NODE_OPTIONS` never counts), `trace` (the requirement codes of each screen's `contract.yaml`,
  as the Tests section says), `mutation` (Stryker: every mutant killed, so a test that runs code
  without asserting on it fails; the next bullet says how it runs), `deps` (audit and licenses), `web`
  (Playwright on Chromium and WebKit, then the release build) and `native` (the Maestro flows
  `e2e/native/smoke.yaml` and `phone.yaml` on the iOS Simulator, against a Release build that holds
  its JS bundle, so no Metro runs).
- `gate:mutation` runs Stryker one of three ways (`scripts/mutation.mjs`), and its row names which.
  Arguments come first and narrow any run to the files they name
  (`pnpm gate:mutation --mutate "<glob>"`, as the mutation canary does).
  - **In steps**, on a Mac. A full run takes more than two hours, so the gate reuses the last full
    run and reruns only what changed since: it hands Stryker's incremental mode a copy of
    `reports/mutation/baseline.json`, the report of that run, and Stryker tests again every mutant
    whose code changed, every mutant a changed test had killed, and every surviving mutant a new test
    covers. Stryker cannot see shared test code, so the full run also records the hash of each
    `*.test.helper.*`, `*.test.setup.*` and `jest.config.js`, and the gate drops from the copy every
    test that loads one changed since, so the mutants those tests covered run again; past `BUDGET`
    sources (in `scripts/mutation.mjs`) they stay out and the row says why. A change Stryker cannot
    see elsewhere (the demo data, a dictionary, a style, a configuration, a package) waits for the
    next full run. The row reads `incremental from the full run of <time> on tree <tree>`, and its
    score counts every mutant, the reused ones included.
  - **Full**, with `MUTATION_FULL=1` or when no baseline exists: every file, and its report becomes
    the baseline, red or green. GitHub's CI never runs it, to spare the free minutes; a sandbox CI
    the owner is to set up will. Until it does, start it by hand at night:
    `MUTATION_FULL=1 pnpm verify --only mutation --append`.
  - **Changed files**, on a pull request: CI sets `MUTATION_BASE=<git ref>` and mutates the source
    files changed since then, plus the source beside each changed test, and every
    `strings/index.ts` for a change to the dictionary registry test (`COVERS` in
    `scripts/mutation.mjs`); a changed shared helper (`*.test.helper.*`) adds the sources of every
    test that loads it, directly or through another helper or a setup file, and a changed
    `*.test.setup.*` or `jest.config.js` those of every test; past `BUDGET` sources they stay out,
    the row says why, and the next full run covers them.
- No check takes more than half the processors: Stryker (`concurrency: "50%"` in
  `stryker.config.json`) and Jest (`maxWorkers: '50%'`) take half the cores, Playwright 30%,
  `node --test` in `gate:tooling` half (`--test-concurrency`), and Metro a fifth (`--max-workers`, 2
  on a 10-core Mac) in the web export and in the Release build of `gate:native`
  (`scripts/workers.mjs`, which both read):
  Expo runs Metro's workers as threads of one process, and with its main thread that process
  passed half the processors at 4 workers. The Release build runs 4 Xcode jobs. The iOS Simulator
  is the exception: launchd starts its processes, outside every cap, and its cold boot takes more
  than half the processors for a few seconds, so the gate shuts it down after each run.
  `pnpm verify`, `pnpm canary` and `pnpm gate:native` run at the lowest priority. Run one heavy job
  at a time, and never Jest while Stryker runs.
- `gate:native` needs macOS with Xcode, an iOS Simulator named `iPhone 18 Pro` (the newest runtime that
  has one is used), Maestro and a JDK (`JAVA_HOME`, else Homebrew's `openjdk@21`). Elsewhere it exits 78
  and `pnpm verify` records `skipped (macOS only)`, a row neither green nor red.
  It copies the repository, its history left out, to a build folder outside it, `NATIVE_DIR` or by
  default `~/metis-run/native/apps/metis` (a relative one is read from the repository root, and a quoted
  `~` is not expanded), because `ios/` takes
  gigabytes. The copy deletes from that folder every file the app lacks, so the gate refuses a folder
  that is or holds the repository or the home folder, a folder inside the repository, which each
  run would copy into itself, and a folder with files in it that holds neither its marker
  `.metis-native-gate`, written on first use, nor the stamp of an earlier run (which then gets the
  marker). A clean `expo prebuild` recompiles every native module, so the gate runs
  `pnpm install` and `expo prebuild --clean --platform ios` there only when a native input changed
  (`app.json` and the files it names, `plugins/`, the `dependencies`, the pnpm lockfile and settings),
  or when `ios/` has no stamp or no `.xcworkspace`. The stamp, `ios/.native-hash` of the build folder,
  records those inputs after a prebuild whose `pod install` wrote the workspace; delete it to force a
  prebuild.
  Maestro cannot import TypeScript, so the gate passes the flows their Vietnamese labels and the demo
  project id from the sources (`maestroEnv`) as `-e` variables. It shuts the simulator down at the end,
  whatever the result; the JUnit report and the screenshots land in `reports/native-gate/`.
- `pnpm canary <name>` (or `all`) plants a defect on purpose (see `scripts/canaries.mjs`), requires the
  gate to go red for that defect, and restores the tree. A gate that stays green with the defect planted
  is blind, so a new gate comes with its canary in the same change, or with the reason it cannot have
  one in `NO_CANARY` of the same file; `gate:tooling` fails a gate that has neither.
- Every canary runs in the full runs, which a sandbox CI the owner is to set up will run, and by
  hand at night until it does; GitHub's CI runs none. `scripts/canary.mjs` cannot tell which gate a
  change touches, so before handing work back you run them by hand when your change touches a gate's
  own code: a file of `scripts/` or `eslint-rules/`, a tool's configuration (`eslint.config.js`,
  `jest.config.js`, `src/window.test.setup.ts`, `playwright.config.ts`, `stryker.config.json`,
  `knip.jsonc`, `tsconfig.json`, `.prettierrc`), the browser specs (`e2e/web/`) or a `gate:*` line of
  `package.json`. Run the canaries of that gate (each canary in `scripts/canaries.mjs` names its
  gate), or all of them (`pnpm canary all`, 7 to 8.5 minutes). A change to the product code under
  `src/` needs none.

## Run it

To run the web app you need Node 24.15.0 (`.nvmrc`) and pnpm 11.28.4 (`packageManager` in `package.json`). Install the packages once, then start the app with mock data:

```bash
pnpm install --frozen-lockfile
pnpm web
```

`pnpm web` is the `web` script of `package.json`, `EXPO_PUBLIC_MOCKS=1 expo start --web --clear`. The flag starts the mock server (MSW), so the app shows data without a back end, and `--clear` clears the cache. The root path `/` opens the overview of the home project, `meridian-cgi-campaign` in the workspace `creative-studio` (`HOME` in `src/platform/config.ts`).

### The demo projects

The mock server knows two workspaces and, in `creative-studio`, three projects (`IDS` in `src/mocks/fixtures/ids.ts`). The path of each is `/w/creative-studio/projects/<project>/overview`.

| Project in the path | What the mock server answers on the overview path |
|---|---|
| `meridian-cgi-campaign` | Meridian CGI Campaign, with every number of the wireframe of screen 24 |
| `northwind-showroom-vr` | Northwind Showroom VR: no baseline, stale snapshots and upcoming items |
| `spring-catalogue-renders` | Status 403, so the no-access state |
| Any other project, or any other workspace | Status 404, so the not-found state |

`metis-backend` compares its own answers with four answers of the mock server: the shell of both workspaces and the overview of Meridian and of Showroom VR. `src/mocks/answers.test.web.ts` keeps them as JSON in `src/mocks/answers/` and fails when a fixture changes and they do not; `WRITE_MOCK_ANSWERS=1 pnpm exec jest src/mocks/answers.test.web.ts` writes them anew, and `./gradlew pinApp` in `metis-backend` copies them there.

### The mock scenarios

Add `?mock=<name>` to the address of the page to reach states that the demo projects never reach, for example `/w/creative-studio/projects/meridian-cgi-campaign/overview?mock=serverError`. The name is read once, when the page loads, and holds for as long as the page stays loaded; an unknown name picks `default`. A scenario changes the overview answer only: the shell answer and the 403 and 404 answers stay the same.

| Name | What the mock server does |
|---|---|
| `default` | Answers with the demo data |
| `loading` | Never answers the overview, so the loading state shows until the client gives up after 10 seconds and the unavailable state takes over |
| `sessionExpired` | Answers the overview with status 401 |
| `serverError` | Answers the overview with status 500 |
| `invalidData` | Drops the Blocked metric, so the contract rejects the answer and names `metrics.blocked` as the wrong field |
| `partial` | Sets the freshness of every metric to `partial` |
| `unknown` | Sets the freshness of every metric to `unknown` |
| `longLists` | Makes each attention list report three rows more than it sends, so the "+ N more" row of every list shows |

The iOS and Android apps have no page address, so they always use `default` (`src/platform/mocks.ts`).

### The API address

The client reads `EXPO_PUBLIC_API_BASE` (`apiConfig` in `src/platform/config.ts`) and falls back to `https://api.metis.test`. A `.test` host never resolves, so without the variable no real server is reached: a mock build gets the mock server, a release build gets the network error. A request that gets no answer within 10 seconds (`timeoutMs`) becomes the `timeout` error, and the screen draws its unavailable state. To point the web app at a real API, set the variable and leave the mocks off:

```bash
EXPO_PUBLIC_API_BASE=https://<api host> pnpm exec expo start --web --clear
```

The core in `metis-backend` answers both calls, behind a token the app does not send yet. The demo of its local stack adds a relay that signs each call as the demo person, on `http://127.0.0.1:8090`, and lets this development server's origin, `http://localhost:8081`, read its answers: start the demo as [Develop the core](../core/develop.md#the-demo-and-the-relay) says, then run the command above with `EXPO_PUBLIC_API_BASE=http://127.0.0.1:8090`. [App interfaces](interfaces.md) lists the calls.

### The web builds

| Command | What it does |
|---|---|
| `pnpm build:web` | Exports the release into `dist/` with no mocks, deletes `dist/mockServiceWorker.js`, and runs `node scripts/check-web-release.mjs dist`, which fails when any trace of the mocks is left |
| `pnpm build:web:e2e` | Exports the build with mocks into `dist-e2e/`, the folder the browser tests serve |
| `pnpm test:e2e` | Runs Playwright on Chromium and WebKit against `dist-e2e/` |

`pnpm gate:web` runs `build:web:e2e`, checks that the mock export holds every mock marker (`--expect-all`), runs `test:e2e`, and ends with `build:web`. On a new machine install the browsers first: `pnpm exec playwright install chromium webkit` (CI adds `--with-deps` on Linux).

Sources: `package.json`, `src/platform/config.ts`, `src/platform/mocks.web.ts`, `src/platform/mocks.ts`, `src/mocks/handlers.ts`, `src/mocks/fixtures/ids.ts` and `.github/workflows/check.yml` of `metis-app`; [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 150 to 155 and 217 to 219 of the original; [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md), lines 42 and 43 of the original.

## Native builds by hand

`pnpm gate:native` builds and tests the iOS app for you (see Gates). Build by hand to test on Android, to run the tablet flow, or to run a flow against a Debug build with Metro. The build folder lives outside the repository and outside any cloud-synced folder, because the generated `ios/` folder weighs 1.2 GB.

The runs of the team used these devices:

| Device | System | Used for |
|---|---|---|
| iPhone 18 Pro simulator | iOS 27.0 | `pnpm gate:native`, and the iOS flows by hand |
| `metis-pixel` | Pixel 7, Android 15 | The phone flows |
| `metis-tablet` | Pixel Tablet in portrait, 800 dp | `e2e/native/tablet.yaml` |
| `metis-api24` | Android 7.0 | Font weights, touch targets and the dialog shadow |

The first runs used Xcode 27.0, CocoaPods 1.17.0, OpenJDK 17, the Android SDK (NDK 27.1.12297006, CMake 3.22.1, build-tools 35.0.0 and 36.0.0) and Maestro. The second Mac had Temurin 21, Maestro 2.11.0 and an Android 15 device named `Pixel_9_API_35`. The gate's default JDK for Maestro is Homebrew's `openjdk@21`. These runs used simulators and emulators only; the real-device checklist has not been run ([The Metis app](README.md), known gaps).

1. Prepare the build folder, by default `~/metis-run/native/apps/metis` (the `NATIVE_DIR` of the gate). It must already hold the rest of the app and its `node_modules`: run `pnpm gate:native` once on a Mac, which copies the app there and installs the packages, or copy the whole app and run `pnpm install --frozen-lockfile` there. Copy `app.json`, `assets/`, `src/` and `e2e/native/` into it, then generate the native projects there:

   ```bash
   CI=1 pnpm exec expo prebuild --clean --platform all
   ```

   A clean prebuild recompiles every native module, so repeat it only when a native input changed: `app.json` and the files it names, `plugins/`, the dependencies, the pnpm lockfile and settings.

2. Build and install the app. On iOS, `Metis` is both the workspace and the scheme:

   ```bash
   xcodebuild -workspace ios/Metis.xcworkspace -scheme Metis -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build build
   xcrun simctl install <device id> ios/build/Build/Products/Debug-iphonesimulator/Metis.app
   ```

   The path of `Metis.app` follows the `Release-iphonesimulator` folder that `scripts/native-gate.mjs` reads for a Release build [Unverified - confirm before applying]. On Android, from the `android/` folder [Unverified - confirm before applying]:

   ```bash
   JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew app:assembleDebug -PreactNativeDevServerPort=8091 -PreactNativeArchitectures=arm64-v8a
   adb reverse tcp:8091 tcp:8091
   adb install -r <the debug APK that Gradle wrote>
   ```

3. Start Metro with the mocks on, from the build folder:

   ```bash
   CI=1 EXPO_PUBLIC_MOCKS=1 pnpm exec expo start --port 8091
   ```

   A Debug build loads its bundle from this Metro (port 8091 in the flows). A Metro started with `CI=1` never reloads, so restart it after every copy of code.

4. Run the flows with Maestro. It needs `JAVA_HOME`, like Gradle, also on iOS:

   ```bash
   JAVA_HOME=/opt/homebrew/opt/openjdk@21 maestro --device <device> test e2e/native/smoke.yaml
   JAVA_HOME=/opt/homebrew/opt/openjdk@21 maestro --device <device> test e2e/native/tablet.yaml
   ```

   `e2e/native/phone.yaml` reads three values that Maestro cannot take from the sources, so pass them with `-e`, as `maestroEnv` in `scripts/native-gate.mjs` does: `MERIDIAN_ID` (`IDS.meridian` in `src/mocks/fixtures/ids.ts`), `LANGUAGE_VI` (`NATIVE_NAMES.vi` in `src/core/i18n/locale.ts`) and `OVERVIEW_VI` (`vi.destinations.overview` in `src/shell/strings/vi.ts`):

   ```bash
   JAVA_HOME=/opt/homebrew/opt/openjdk@21 maestro --device <device> test -e MERIDIAN_ID=meridian-cgi-campaign -e LANGUAGE_VI=<name> -e OVERVIEW_VI=<text> e2e/native/phone.yaml
   ```

`smoke.yaml` opens the app and waits for the project header, `phone.yaml` checks the phone layout, and `tablet.yaml` checks the icon rail on a portrait Android tablet. Run an emulator at normal priority and a simulator after the build, because both load the machine; [Troubleshoot the app](troubleshoot.md) lists the native traps.

Sources: [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 177 to 180, 247 to 249, 285 to 286 and 313 to 323 of the original; [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 30 to 33 of the original; [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), lines 964 and 1036 of the original; `scripts/native-gate.mjs` and `e2e/native/` of `metis-app`.

## Brand and fonts

### App icons

The brand files come from `metis-docs`. Its `design/brand/tools/platform-icons.mjs` derives the two platform variants of the app icon from `design/brand/logo/metis-app-icon.svg` and renders them as 1024 px PNG files with the Chromium that Playwright installed in a `metis-app` clone:

```bash
node design/brand/tools/platform-icons.mjs <the root of a metis-app clone>
```

- `metis-app-icon-square` is the ink square without rounded corners. iOS rounds the corners itself, and the transparent corners of a rounded icon turn white when Expo flattens it.
- `metis-app-icon-android-foreground` is the foreground layer of the Android adaptive icon, without the ink square, since Android draws an ink background. The M and the diamond are scaled to two thirds around the centre, because Android shows only the middle 72 of the 108 dp of this layer, so the M keeps the size it has on the iOS icon and stays inside the 66 dp safe circle [Source: header comment of `design/brand/tools/platform-icons.mjs`, read 12 Oct 2026].

In the app, `pinned/design/brand/logo/` holds copies of these files, `assets/brand/` holds four byte copies, `public/apple-touch-icon.png` is a copy of the 180 px icon, and `app.json` takes the icon, the Android adaptive icon (foreground on the ink background `#111827`), the splash screen (the same foreground, 200 wide, on `#111827`) and the web favicon from `assets/brand/`. `scripts/brand-files.test.mjs`, which `pnpm gate:tooling` runs, fails when:

- a file of `assets/brand/` differs from the pinned logo of the same name;
- `public/apple-touch-icon.png` differs from the pinned `metis-app-icon-180.png`;
- `app.json` does not take the icon, the adaptive icon and the splash image from `assets/brand/`, or its name is not the brand name;
- the two derived icons carry other shapes than `metis-app-icon.svg` (a logo change without a new run of `platform-icons.mjs`);
- the logo ratio token is not the width over the height of the wordmark `viewBox`.

To change the logo, change it in `metis-docs`, run `platform-icons.mjs` there, and then replace the pinned copies and the copies in `assets/brand/`. The pull request that replaces a pinned copy is to come from the documentation bot, which is not built; until it exists, the file under `pinned/` and its hash in `docs.lock` change together, and `pnpm gate:tooling` proves that they agree.

### Fonts

The three typefaces (Newsreader, Inter and Manrope) are kept in the repository, and nothing calls a font host at run time; `LICENSES.md` holds their licences.

| Platform | Files | How they load |
|---|---|---|
| Web | `public/fonts/<family>-latin.woff2` and `<family>-vietnamese.woff2` | Six `@font-face` rules in `public/index.html`, chosen by block name, because `expo-font` cannot set a `unicode-range` |
| iOS | `assets/fonts/Inter.ttf`, `Manrope.ttf` and `Newsreader.ttf`, variable fonts | `expo-font` loads them under the first family of each token stack (`src/platform/fonts.ios.ts`) |
| Android | `assets/fonts/android/<Family>-<weight>.ttf`, nine static files | The `expo-font` plugin in `app.json` builds them in; `src/platform/fonts.ts` loads nothing at run time |

Android draws only the default weight of a variable font (200 for Manrope, 400 for Inter and Newsreader), and below Android 9 it tells only regular from bold 700 inside one family. So every weight in use, 400, 500 and 600, is its own static file and its own family (`Inter-500`), and `src/design-system/fontFace.android.ts` names the family from the final weight of the text. A static file is cut from the variable file:

```bash
cd assets/fonts && fonttools varLib.instancer <Family>.ttf wght=<weight> --static -o android/<Family>-<weight>.ttf
```

A new weight on Android is a new file, a new family in `app.json` and a new entry in `WEIGHTS` of `scripts/native-fonts.test.mjs`, which checks that the declared families are the nine expected ones, that no file is still a variable font and that the weight written in each file is the declared weight.

Sources: `design/brand/tools/platform-icons.mjs` of `metis-docs`; `app.json`, `scripts/brand-files.test.mjs`, `scripts/native-fonts.test.mjs`, `src/platform/fonts.ts`, `src/platform/fonts.ios.ts` and `public/index.html` of `metis-app`; [Narrow widths plan](../../history/plans/2026-10-09-frontend-narrow-widths.md), lines 208 to 212 and 233 to 234 of the original; [Self-hosted fonts per platform](../../architecture/decisions/font-loading.md).

## Expected durations

Measured on a 10-core Mac, with the checks at the lowest priority and Stryker and Jest at half the cores. A run is slower on a busy machine.

| Check | Measured | Source |
|---|---|---|
| `pnpm verify`, every gate with mutation in steps | About 10 minutes: 611 seconds of gates on 16 Oct 2026 (tree `dadf7f9edecb`), nothing changed since the full run | `reports/verify.md` of `metis-app` on that tree |
| `pnpm verify`, every gate with the full mutation run | About 2 h 15 min to 2 h 30 min: 138 minutes on 10 and 11 Oct 2026; 8,757 seconds of gates on 15 and 16 Oct 2026 (tree `eca5409429eb`) | [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), line 932 of the original; `reports/verify.md` of `metis-app` on that tree |
| `gate:mutation`, full run | 8,145 seconds (about 2 h 16 min) over 1,714 mutants; 8,609 seconds over 1,718 mutants on 15 and 16 Oct 2026 | [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), line 932 of the original; `reports/verify.md` of `metis-app` on tree `eca5409429eb` |
| `gate:mutation`, in steps | 142 seconds with nothing changed since the full run: Stryker's first run of the 2,951 tests takes about 2 minutes, then it reuses 1,714 of the 1,718 results (the other 4 are mutants a disable comment ignores). 175 seconds after a change to one function of a screen model, which reran its 7 mutants | `reports/verify.md` of `metis-app` on tree `dadf7f9edecb`, and Stryker's log of the second run |
| `pnpm canary all` | 7 to 8.5 minutes: 424 seconds in one run and 501 seconds in the next | [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), lines 927 and 932 of the original |
| `gate:web` | About 44 seconds for 198 browser tests; 57 seconds for 220 tests in the latest record (on 12 Oct 2026, tree 432d8aa466b7) | [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), line 920 of the original; `reports/verify.md` of `metis-app` |
| `gate:native` | 73 to 135 seconds when the iOS project is prepared; 327 seconds when `expo prebuild` runs first | [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md), lines 921 and 922 of the original |

In the latest record (on 12 Oct 2026, tree 432d8aa466b7) the other gates took: tokens 0.2 s, types 3.9 s, lint 5.5 s, language 0.2 s, format 1.3 s, deadcode 0.9 s, tooling 7.5 s, trace 0.4 s, unit 21.3 s and deps 2.8 s (`reports/verify.md`, which `pnpm verify` writes and git ignores).

The workflow `.github/workflows/check.yml` runs the fast group on a push to `main` or when started by hand, within 30 minutes, and every gate on a pull request, within 60, mutating only the files the pull request changed; a newer run on the same ref cancels the one still going. These are limits, not measurements: CI has not run, because the repository has no remote yet. No job of GitHub runs every canary or the full mutation run, and none runs on a schedule, to spare the free minutes of a private repository: the full runs are for a sandbox CI the owner is to set up, and until it exists they are started by hand at night, as the Gates section says.

## Open questions

The owner or the team has not answered these. The last column says what stands until then.

| Question | Needed before | What stands today | Source |
|---|---|---|---|
| Where does the "checked on macOS" status go, and from where is it set? `pnpm verify --publish-status` would attach it to the commit on GitHub, and branch protection would require it before a merge | Enabling the flag | The flag is not built. The repositories design puts the code in private repositories of the owner's personal GitHub account (RD-14), but no remote exists yet, and the GitHub CLI on the Mac is logged in to an account that is not the Metis account | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 661 to 663 and 697 of the original; [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), RD-14 (line 26 of the original) |
| Do the free CI minutes of a private repository suffice for the workflows? The question "public or private" is answered: the four repositories are private (RD-14) | Enabling CI | A push runs the fast group on `main` alone, a pull request mutates only the files it changed within 60 minutes, a newer run cancels an older one on the same ref, and no job runs on a schedule: the full mutation run, more than two hours on the Mac, and every canary wait for the owner's sandbox CI. The first weeks of CI show whether the free minutes suffice | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 613, 614, 632, 633 and 696 of the original; [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), RD-14 (line 26 of the original) |
| Which real devices does the tester use? | Signing screen 24 | No list exists | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 698 of the original |
| What is the iOS performance threshold? | After the first measurement of screen 24 | Not set, and no stable tool measures iOS performance automatically | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 463 and 699 of the original |
| Which configuration measures the 2-second target of the overview on a phone browser (Lighthouse on an emulated phone or on a desktop), and what happens if it is missed? | The first measurement of the real screen | The sample app measured 2.9 seconds with compression on an emulated phone; the real screen is not measured | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 677 and 700 of the original |
| How does real Safari on an iPhone run in an automated check, since the iOS 27 Simulator does not accept `safaridriver`? Keep looking for a way to enable it, or rely on the WebKit iPhone emulation of Playwright plus a tester on a real iPhone | The plan for the interface | Open. Playwright's WebKit stands in | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), lines 455 to 458 and 704 of the original |
| Is `dev.metis.app` the right bundle identifier for the organization? | The app release | `app.json` uses it, and changing it later makes another app in the stores | [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md), line 716 of the original; [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md), lines 339 to 341 of the original |
