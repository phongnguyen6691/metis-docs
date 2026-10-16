---
title: Workspace time zone, Intl output, percentages floored
summary: Times follow the time zone carried in the API response, dates and numbers come from Intl, and percentages round down so unfinished work never shows 100%.
component: app
type: decision
status: current
ids: []
---

# Workspace time zone, Intl output, percentages floored

## Context

The BRD (section 12.1) counts "today" in the time zone of the workspace. If the screen showed times in another zone, the overdue days and the "As of" line could differ by a day, and the same screen would read differently on CI, on a Mac and on a phone.

Formatting is done by `Intl`, and Hermes, the JavaScript engine of the native apps, takes its locale data from the operating system and has gaps on Android 7 to 11 [Source: foundation spec, section 5.5, lines 358 to 359 of the original]. So the format tests must run on every platform.

At the final review of plan A the owner was asked how percentages should round, because 1,999 of 2,000 items done would show "100%". The owner's answer, translated: round down, so that the project is seen to still have work and is not rounded up (FE-20).

## Decision

- **Time zone.** The API response carries the IANA time zone of the workspace (`timeZone`) and every time on the screen is shown in it. Timestamps are UTC with a trailing Z. The contract rejects a zone that `Intl` does not know. Midnight shows as `00:00`.
- **Formatting.** Dates, times, numbers and percentages are formatted by `Intl` for the active language, in `src/core/format.ts`. English uses `en-GB`, which prints September as "Sept" (CLDR data) where the wireframe writes "Sep"; the plan builds no date string to match the wireframe letter by letter, and the shape and number measurements compare numbers, not month names [Source: foundation plan, lines 120 to 122 of the original].
- **Percentages round down to an integer** in `formatPercent`: 99.5% shows 99%, and only exactly 100 shows 100%.
- **Tests.** The expected date and number strings are the strings that Node 24.15.0 prints. The test environment pins `TZ` to `America/Los_Angeles`, with a test that guards the pin, and a single-digit day is pinned too. Rounding in `formatInteger` is left out because the contract sends only whole numbers. The format tests run on every platform.
- **Hermes** prints the same strings as Node on Android with the exact options of `format.ts` (`22 Sept 2026, 09:40` in English and `09:40 22 thg 9, 2026` in Vietnamese). On iPhone, Hermes writes the Vietnamese `dateStyle` date with an extra word between the time and the day, and the options of `format.ts` were not measured there; the Maestro flow keeps one waiting string per platform [Source: measured on native when plan A was written, lines 122 to 125 of the original].

## Consequences

- The same data reads the same on every machine, and a project with work left never shows 100%.
- If the time zone rule were wrong, the change is small: drop one field and one parameter.
- "Sept" differs from the wireframe's "Sep"; if the owner wants "Sep", a token goes into the date formatter.

## Status

Current, decided by the owner on 6 Oct 2026 (FE-20) for the percentage rule. The time zone and the date strings are decisions of the foundation plan, approved by the owner with the plan on 6 Oct 2026 (FE-17), and plan B kept the date rule (R-B6).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-20 (line 59 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the time zone in the response (lines 185 to 191) and the formatting rules (lines 358 to 361).
- [Front-end foundation plan (plan A)](../../history/plans/2026-10-05-frontend-foundation.md): the time zone and the date strings (lines 116 to 125 of the original), the midnight case (lines 75 to 77), and ruling 6 of the run (lines 4309 and 4310).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): rule R-B6 (lines 163 to 165 of the original).
