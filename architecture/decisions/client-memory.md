---
title: What the client remembers
summary: The web keeps the language and the last workspace, forgets a workspace that is not found or forbidden, and uses the home workspace only when nothing is remembered; native keeps nothing yet.
component: app
type: decision
status: current
ids: []
---

# What the client remembers

## Context

Pages outside a workspace (My focus, Approvals, Notifications, Search) have no workspace in their path. The first build gave them the fixed home workspace, `HOME` in `src/platform/config.ts`. The code review of 9 Oct 2026 found the effect: from `/w/digital-products/dashboard` a click on My focus switched the sidebar, the project tree, the location path and the "+ New" button to Creative Studio, and the same happened on every page of that kind. The owner approved the recommendation on 9 Oct 2026 (FE-27): remember the workspace last viewed and use the home workspace only when the app is first opened.

The chosen language is a separate memory. The approved design stores it in the browser, because the first release has no real accounts.

## Decision

**Workspace.**

- The shell remembers only a workspace taken from the `/w/` part of the path, and only after the shell call of that workspace (see [The shell has its own endpoint](shell-api-contract.md)) has answered ok. A query parameter is never remembered, and neither is a workspace whose shell failed to load: a mistyped workspace must not trap the `/me` pages, on the web even across reloads.
- On a page outside a workspace, a remembered workspace is forgotten when its shell call answers `notFound` or `forbidden`. It is kept when the call fails on the network.
- `HOME` is used only when nothing is remembered, that is the first time the app opens.

**Language.** On the web the chosen language is kept in browser storage through `src/platform/storage`, and the `lang` attribute of the page is right from the first paint after a reload. If the browser blocks `localStorage`, the app still runs, in English.

**iOS and Android keep nothing yet.** The storage layer opens the app in English every time, and the workspace is remembered only within a session. Keeping the language with AsyncStorage on the apps was proposed for plan C and is an open question.

## Consequences

- A user who works in one workspace stays in it on the pages outside a workspace, and a workspace that no longer answers is dropped.
- The workspace provider gained one condition and a second small hook.
- Each launch of an app starts in English until the open question is answered.

## Status

Current, decided by the owner on 9 Oct 2026 (FE-27) for the remembered workspace. Storing the language on the web belongs to the design the owner approved on 5 Oct 2026 (FE-08). Whether the apps store the language is an open question for the owner (spec section 13), and until it is answered the apps open in English.

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): FE-08 (line 48 of the original), FE-27 (line 67) and the language select (lines 241 to 244).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the language select (lines 320 to 326 of the original) and the open question on AsyncStorage (line 712).
- [Overview screen plan (plan B)](../../history/plans/2026-10-06-frontend-overview-screen.md): the language after a reload and with `localStorage` blocked (lines 121 to 123 of the original) and D-B18 (lines 296 to 298).
- [Code cleanup plan](../../history/plans/2026-10-10-frontend-code-cleanup.md): rulings 31 and 32 of its table of rulings (lines 1008 and 1009 of the original).
- [Code review report](../../history/code-review/report.md): the decision for the owner (lines 38 to 40 of the original) and finding 11 (lines 243 to 250).
- `metis-app/reports/review/review.md`, the owner's review package, kept on the owner's machines and never committed (repositories design, section 6.1): the apps remember neither the language nor, beyond a session, the workspace (line 35 of the original).
