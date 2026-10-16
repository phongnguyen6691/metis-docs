---
title: A screen is done when its gates pass, each proven able to fail
summary: A screen is done when six gates pass on every required platform; every gate of the app and every check of the back end has a counter-test that plants a defect and requires red, unless it is listed with its reason; the full sets are for a sandbox CI still to be set up and run by hand at night until it exists, and the back end runs by change the counter-tests of the checks a change touched.
component: all
type: decision
status: current
ids: []
---

# A screen is done when its gates pass, each proven able to fail

## Context

The goal the owner kept is that a screen counts as done only when machines prove it through six gates (token, shape, behavior, translation, brand, accessibility), with exactly one screen built and signed before it is copied (see [Prove one screen end to end before building more](acceptance-screen-first.md)).

Each gate gets a deliberate break that proves it can report red. The first form of the gates and of the counter-tests was approved by the owner on 5 Oct 2026 as the third part of the design (FE-08), when the app was still a web app. The move to React Native with Expo then added the column for iOS and Android.

## Decision

A screen is done when the six gates pass on every required platform, and when every counter-test turns its own gate red. The signing conditions of the first screen say the same (see the conditions in [Prove one screen end to end before building more](acceptance-screen-first.md)).

The six gates:

| Gate | On web | On iOS and Android |
|---|---|---|
| Token | A lint rule of its own: no number and no colour literal written in a style, only through `tokens.ts`; plus `gen-tokens --check` | The same rule, the same code |
| Shape | Playwright measures the DOM against numbers read from `brand/tokens.css`: sidebar 232, top bar 52, page margin 24, list rows from 44, figure of a tile 28, title 30; three widths; no horizontal scroll | Component tests require the drawn style to match the tokens; Maestro screenshots are compared with baselines after signing |
| Behavior | Browser tests read the contract, click every control and measure the effect; the reverse test; every link of the shell opens a page with a title; the browser console has no error | Maestro flows generated from the contract click every control and measure the effect |
| Translation | No sentence of `en.ts` is still shown after switching to Vietnamese; `lang` is right; the choice survives a reload; no layout breaks | Like web, measured by Maestro and component tests |
| Brand | The three typefaces are loaded and `font-family` matches the token; the logo is drawn from the original SVG; the favicon and the app icon load | The typefaces are loaded through expo-font; the logo is drawn from the original SVG; the app icon is the right file |
| Accessibility | axe-core finds no serious or critical violation in any state; every control is reached with Tab and has a focus ring | Every control has a role and a readable label (component tests by role); touch targets of 44 x 44; VoiceOver and TalkBack by the tester |

The counter-tests:

- The rule is that every gate has a deliberate break that proves it can go red, except a gate listed with a reason in `NO_CANARY`. `scripts/canary <name>` runs the gate first and requires green, plants the defect, runs the gate again and requires red for the very defect planted, then restores the state whatever the result. The green baseline step was added while building on 6 Oct 2026: if the gate is already red, the later red proves nothing about the planted defect. `pnpm canary all` runs every counter-test.
- Counter-tests are not part of the unit suite, because many need a browser or an emulator.
- Only the `NO_CANARY` list in `scripts/canaries.mjs` may exempt a gate, and each entry carries a reason. Two gates are exempt. `gate:deps`: the break would have to install a package with a vulnerability or a wrong licence, rewriting `node_modules` and the lockfile, and `scripts/check-licenses.test.mjs` proves that the licence rule can go red. `gate:native`: each run needs a Release build and a booted iOS simulator, and its flow was proven red once, by hand, with a wrong `testID` planted. `gate:tooling` turns red when a `gate:*` script of `package.json` has no counter-test and no `NO_CANARY` reason, or has both.
- Every new measurement is shown red before it counts as done. Breaking the contract for a moment (the filter of `risks-more`, the name key of `state-back`) turned two contract measurements red; adding a Google Fonts tag and turning off optical size in the `index.html` of the build turned two font measurements red; ten new counter-tests, run on the real gates, all went red because of the planted defect. Every file was restored (compared with `cmp`).
- The rules of the tooling got counter-tests of their own: the import boundaries of `src/core` and `src/design-system`, the ceiling of complexity, the ceiling of file length, the reason required when a rule is disabled, an unused variable (strict TypeScript), Prettier, the path types regenerated before `tsc`, and hard-typed text in the components of the design system.
- The helper that plants a defect creates the folders that are missing and, when it restores, removes exactly the folder it created. The counter-test of the trace gate needs a fake screen, `src/screens/99-canary`.
- The ban on restricted syntax is declared once (`restricted` in `eslint.config.js`). In the flat configuration of ESLint a later block that sets `no-restricted-syntax` again for the same files replaces the list of the earlier block, so the block of the design system has to copy the whole list [Source: trace-and-gaps plan, R-T11].

The breaks, the gate that must go red, and the counter-test built when the code clean-up ended on 10 Oct 2026:

| Break | Gate that must go red | Counter-test built |
|---|---|---|
| Write a number into the style of a component | Token | `token-literal`, `style-constant`, `style-unitless` (`gate:lint`) |
| Change a number in `brand/tokens.css` without regenerating | Token (`gen-tokens --check`) | `token-stale`: a line added to `tokens.ts`, so the file differs from the generated one (`gate:tokens`) |
| Regenerate the tokens with a changed number, code unchanged | Shape | not built |
| Delete the path of a navigation item | Behavior | not built |
| Add a button that the contract does not declare | The reverse test | not built |
| Delete a Vietnamese sentence | Translation (compile) | not built |
| Replace the logo with text | Brand | not built |
| Shrink a button below 44 | Accessibility | `touch-target`: a control of 30 px on screen 24 (`gate:web`) |
| Use a web API that Safari does not support | Browser compatibility | `compat` (`gate:lint`) |
| Add an export that nobody uses | Dead code | `deadcode` (`gate:deadcode`) |
| Add a function with no test | Coverage | `coverage` (`gate:unit`) |
| Delete an assertion in a test | Mutation testing | `mutation`: a test that asserts only the type of the result (`gate:mutation`) |
| Add a heavy loop in a component | Component performance | not built (there is no Reassure yet) |
| Add a large library to the web bundle | Web performance | not built (there is no Lighthouse CI yet) |
| Remove the requirement code from a test name | Trace | `trace`, `trace-web` (`gate:trace`) |

The list as built is in `scripts/canaries.mjs`: 37 counter-tests for 11 gates. Besides the rows above it holds `unused-local` and `route-types` (`gate:types`), `prettier` (`gate:format`), `language` and `language-date` (`gate:language`), `tooling` (`gate:tooling`) and, for `gate:lint`, `complexity`, `max-lines`, `disable-reason`, the boundaries (`boundary-core`, `boundary-design-system`, `boundary-core-package`, `boundary-model`, `boundary-screen`, `boundary-mocks`, `boundary-globals`, `native-text`), hard-typed text (`default-text`, `shell-text`, `branch-text`, `model-text`), restated text (`restated-literal`, `restated-phrase`), disabled tests (`disabled-test`, `inverted-test`) and the guard of the browser specs (`e2e-guard`).

## The counter-tests of the back end

The rule holds for `metis-backend` too: every check of `./verify` has counter-tests in `tools/src/main/java/dev/metis/tools/canary/`, and `NoCanary.REASONS`, the table of checks exempted with a reason, is empty; `checkTooling` fails a check that has neither or both. `./canary <name>` copies the files of the tree into `build/canary/<name>/`, plants the defect there, never in the working tree, and requires the check red with the text of that defect. Before planting it requires the check green on the copy, unless the record of `./verify` already holds the check green, run whole, on a tree whose stamp equals the copy's: then the check runs once, planted. The tree of 16 Oct 2026 holds 156 counter-tests over the sixteen checks.

## When the counter-tests run

The owner's decision of 16 Oct 2026 keeps every counter-test and moves the full sets off the developer's rounds; the owner's decision of 17 Oct 2026 keeps them off GitHub's free minutes too, for a sandbox CI the owner is to set up. Until it exists, the full sets run by hand at night, alone on the machine under the caps of [Checks must not overload the machine](resource-caps.md):

- **metis-app.** The 37 counter-tests run in the full runs (`pnpm canary all`), and by hand when the code of a gate changes. They are not selected by change: `scripts/canary.mjs` maps a counter-test to its gate alone, and the whole set takes 7 to 8.5 minutes.
- **metis-backend.** `./canary changed` runs the counter-tests of the checks whose implementation changed: `Implementations.java` of the tool names, rule by rule, the files each check is made of, and every counter-test also owns the files it plants into. Against the record `reports/canary.json`, which holds for each check the stamp of those files when every one of its counter-tests last caught; with `--base <ref>`, against the paths changed since that commit. A file of the build, of the version catalog or of a lock, or one no rule names, belongs to every check; a file of the engine of the counter-tests selects the first counter-test of every check, the smoke set, since the engine is proven by its own tests and one counter-test per check. A file of the product selects none. `./canary all` runs every one, in the full runs. A pull request runs no counter-test on GitHub.

## Consequences

- A gate with a built counter-test has been shown able to go red on a planted defect.
- Adding a gate without a counter-test, or without a reason in `NO_CANARY`, turns `gate:tooling` red.
- Seven breaks had no counter-test when the clean-up ended on 10 Oct 2026 (Shape, Behavior, the reverse test, Translation, Brand, component performance and web performance) and were left to a later plan. The native gate has no automatic counter-test, only the one proof by hand.
- Counter-tests take a browser or an emulator, so they run apart from the unit suite, by `pnpm canary`.
- A defect that blinds a check through a file no rule gives that check, a change of product code that the check's counter-tests depend on, is found by the next full run, not before the work is handed back.

## Status

Current, decided by the owner on 5 Oct 2026 (FE-08, with the spec approved as FE-16). The counter-tests built, and the exemptions, are rulings of the foundation plan, the trace-and-gaps plan and the code clean-up taken under FE-17, FE-21 and FE-28. The back end's counter-tests are those of its skeleton design, section 8.3; when the counter-tests of both repositories run are the owner's decisions of 16 and 17 Oct 2026, built in [Fast checks](../../proposals/2026-10-16-fast-checks.md).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 24 to 26 and 251 to 294 of the original (the goal, the first form of the six gates and of the counter-tests, FE-08).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 48 to 59, 415 to 424 and 559 to 599 of the original (the signing conditions, the six gates on every platform, the counter-tests as built).
- [Trace and gaps plan](../../history/plans/2026-10-09-frontend-trace-and-gaps.md): lines 24 to 27 and 52 to 60 of the original (R-T4, R-T10, R-T11, R-T12).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): line 1035 of the original (row 58 of its table of rulings).
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): section 8.3, the counter-tests of the back end.
- [Fast checks](../../proposals/2026-10-16-fast-checks.md): the decisions of 16 and 17 Oct 2026, the selection by change of the back end, and the app's part.
