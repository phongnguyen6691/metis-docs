---
title: Typed dictionaries per screen, English first
summary: Each screen and the shell own a typed English dictionary and a Vietnamese one that must match it, sentences are templates with slots, and the owner approves the Vietnamese.
component: app
type: decision
status: current
ids: []
---

# Typed dictionaries per screen, English first

## Context

The app shows its text in English and Vietnamese and must take a third language without touching a component. A single merged dictionary lets two screens translate one key two ways; English sentences used as keys, or a proxy wrapper around the dictionary, leave text inside arrays and nested objects untranslated. The design also had to make a missing Vietnamese key impossible to ship. On 9 Oct 2026 FE-27 added a second need: a sentence built by joining strings in code breaks when word order differs between languages, so each sentence must be a template.

## Decision

- **One dictionary folder per screen and one for the shell.** `strings/en.ts` is the original. `strings/vi.ts` is typed `Dictionary<typeof en>`, so a key that is missing, extra or misplaced is a compile error. `strings/index.ts` exports `STRINGS`, a `Record<Locale, ...>` of `{ en, vi }`, and `SAME_IN_VI`, the keys whose Vietnamese text stays the same (the product name, project terms, separators, symbols, templates made only of slots). Dictionaries are never merged across screens, an English sentence is never a key, and no proxy wraps the dictionary.
- **API data carries codes and user content only** (project names, item names, people's names). The label of a code, such as a status, a type or a risk level, lives in the dictionary of the screen. User content is never translated.
- **A sentence is a template with `{slot}` placeholders**, filled by `interpolate`; a missing value is an error and `{name}` never reaches the screen, because word order differs per language. Plurals go through `plural()` with two forms, `one` and `other`, which are enough for English and Vietnamese (a language that needs more would need `Intl.PluralRules`). A list goes through `joined()` with the language's `{list}, {item}` template, and an empty list is a type error.
- **Lint enforces it.** In a `model` file there is no string with a space or punctuation, no `+` with a string and no `.join()`. No component of the design system, the shell, the screens or the routes types text the user reads: JSX text and props such as `aria-label`, `label`, `placeholder` and `title` come from a dictionary or a prop. Design-system components get all their text through required props and have no default text.
- **Error states are written once.** The shell dictionary has a shared `states` block (no access, not found, session expired, invalid data, server not answering, "Try again", "Back to {destination}"). A screen writes only its loading sentence (`states.loading`) and the title of the server-not-answering state (`states.unavailable.title`). `problemOf` (`src/shell/model.problem.ts`) builds the state from an API error and those two. The states themselves are described in [Every response is validated, and every failure is a named state](validated-contracts-and-error-states.md).
- **A registry test audits every dictionary.** `src/core/i18n/dictionaries.test.ts` keeps one list of all dictionaries (folder, `STRINGS`, `SAME_IN_VI`) and fails when a `strings/` folder is missing from it. For each dictionary it checks that each language takes the file of its own name, and that the Vietnamese has every key and the same slots and leaves no English sentence outside `SAME_IN_VI`. A `SAME_IN_VI` key that the original lacks, or whose translation differs from the original, is a `stale` error of `auditDictionaries`. The check is a pure function in `src/core/` with its own tests, so it is inside coverage and mutation testing like other code.
- **Adding a language** takes four edits and no component change: the code in `LOCALES` and its own name in `NATIVE_NAMES` of `src/core/i18n/locale.ts`; one strings file beside each `en.ts`, typed `Dictionary<typeof en>`; an entry in the `STRINGS` record of each `strings/index.ts`; and an entry in the list of the script that sets `lang` in `public/index.html`, because that script runs before the app loads.
- **The Vietnamese is drafted by the code writer and approved by the owner** when the owner approves the screen.

## Consequences

- A missing Vietnamese key fails the build, and two screens cannot translate one key differently.
- A new dictionary needs one line in the registry list, and the registry test fails if that line is forgotten.
- Vietnamese text waits for the owner's review. On 9 Oct 2026 the owner approved changing the Vietnamese label of the "My items" scope button, so that it no longer equals the label of "My focus" in the sidebar; "My focus" keeps its label.

## Status

Current, decided by the owner: the design of the translation layer on 5 Oct 2026 (FE-08), and the sentence templates, the shared `states` block, the registry test and the reviewed label on 9 Oct 2026 (FE-27).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-08 (line 48 of the original), FE-27 (line 67) and section 8.1 (lines 229 to 249).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): sections 5.3 to 5.5 (lines 320 to 373 of the original).
- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the dictionary check as a pure function in `src/core/` (lines 126 to 128 of the original).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): ruling 24 of the run, the `stale` error kind (lines 19647 to 19651 of the original).
