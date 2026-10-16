---
title: English code, one source per value, no retyped literal
summary: Code, comments and test names are English, Vietnamese lives only in the dictionaries, every value has one source, and gates reject the rest.
component: app
type: decision
status: current
ids: []
---

# English code, one source per value, no retyped literal

## Context

On 9 Oct 2026 the owner pointed at a lot of hand-typed text scattered and even duplicated across the app and its tests, such as the demo client name and the name of a group in the project tree, and at comments written in Vietnamese (FE-27, translated). The code review of the same day measured both:

- Vietnamese appeared on 2,220 lines in 288 files. Only 137 lines, in the two `strings/vi.ts` dictionaries, were legitimate; the rest were comments, test names, lint messages and gate output. 222 comment lines in 135 files pointed at plan decision ids or spec section numbers, which resolve only in 1.4 MB of Vietnamese plans, and 78 more at line numbers of the wireframe.
- Values of the demo data were retyped on about 339 lines in 53 test files, and UI text on up to 495 lines in 58 test files, next to the dictionaries that already hold it. Seven "must not appear" tests keyed on hand-typed text would pass forever after a rename, since nothing can draw a name that no longer exists.
- The mechanism: agents copied code blocks from the Vietnamese plans verbatim; the fixtures module exported no id constants, so every use retyped them; the repository had no conventions document; and no gate checked either.
- The reasons matter. Why the Android language select has opacity 0.01 sat in a Vietnamese comment, and a reader who could not read it would "clean it up" and bring the defect back. A team of about 40 people at an agency would read the code, and the six review agents recommended the same convention.

## Decision

**Language.** The gate is `gate:language` (`node scripts/check-language.mjs`).

- Code, comments, test names (`describe`, `it`, `test`), lint messages and the text printed by scripts and gates are English.
- Vietnamese is allowed only in the dictionaries `src/**/strings/vi.ts`, on the `NATIVE_NAMES` line of `src/core/i18n/locale.ts`, on the bilingual `noscript` line of `public/index.html`, and on the line right after a comment `lang-exception: <reason>`, which is for Vietnamese test data that no dictionary holds. Every other letter outside ASCII is an error (`non-ascii-letter`); the gate normalises text to NFC and catches uppercase letters too.
- A comment is one English line that gives the reason and does not retell what the code does. Code and configuration may not hold references that a maintainer cannot open: plan decision ids (such as R-B15, R-N27, D-B23 and FE-23), `Task <number>`, spec section numbers, wireframe line numbers, and measurement dates or logs. The gate rejects these references in comments, test names and every Markdown line of the app. BRD requirement ids (`OVW-01`, `BR-24`, `D-19`) are kept when a comment names the requirement, and a test name keeps its requirement id at the front, because `gate:trace` reads it (see [`contract.yaml` is each screen's promise, traced to tests](screen-contract-and-trace.md)).

**One source per value.**

- Ids of the demo data come from `IDS` (`src/mocks/fixtures/ids.ts`); names and numbers from the objects exported by `src/mocks/fixtures/*`; UI text from `STRINGS`; paths from `ROUTES`; sizes and colours from `tokens` (see [The brand tokens are the only source of sizes and colours](brand-tokens-source.md)). An id that no fixture holds, `UNKNOWN_ID`, is its own export of `ids.ts` and not a key of `IDS`, in a file without Jest globals so that Playwright can load it. The paths of the browser specs are built from `ROUTES` and `IDS` in `e2e/web/paths.ts`.
- A hand-typed English sentence may be the expected value only in the one reference model test of each area, `src/screens/<id>/model.test.ts` and `src/shell/model.test.ts`, whose job is to prove that the model composes the sentence. They type each composed sentence once and read plain labels from `STRINGS`; every other `model.<part>.test.ts` builds its sentences from `STRINGS` with `interpolate`, `plural` and `joined`.
- The lint rule `local/no-restated-literals`, part of `gate:lint`, covers the tests of `src`, the specs of `e2e` and the `node --test` tests of `scripts/` and `eslint-rules/`. It rejects a string equal to a value of `src/mocks/fixtures/*` or of a dictionary; a string that holds an id of `ids.ts`, in a path or a `testID`; a string that holds such a value of two words or more; and a string that fills a dictionary template whose fixed text is two words or more. `'a ' + 'b'` counts as `'a b'`, and the children of JSX are examined too. In the reference model tests it checks only the demo data. The line above a string is excused by `restated-literal: <reason>`. The rule's own tests read a separate sample data tree through a rule option, plus one case on the real data.
- A "must not appear" assertion uses the same expression as its positive twin, so a rename cannot make it vacuous.

## Consequences

- Renaming the demo client or rewording a sentence changes one source file, and no test needs a hand edit.
- The tests and comments written before the convention had to be rewritten to read from the fixtures and dictionaries and to give their reasons in English.
- The rule has limits: a lowercase or camelCase ASCII word, a string under four characters, numbers, regular expressions and templates with expressions are out of its reach, and reviewers check those.
- A comment that holds a plan id or a spec section number fails the gate, so the reason must be written out in full.

## Status

Current, decided by the owner on 9 Oct 2026 (FE-27).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-27 (line 67 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): section 9.4 (lines 509 to 555 of the original).
- [Code review report](../../history/code-review/report.md): the conclusions (lines 9 to 17 of the original), the decision for the owner on the language convention (lines 32 to 37), finding 1 (lines 89 to 111) and finding 2 (lines 113 to 146).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): the constraints on language, comments and sources (lines 19 to 22 of the original) and rulings 16, 20, 21, 62 and 76 of its table of rulings (lines 993, 997, 998, 1039 and 1053).
