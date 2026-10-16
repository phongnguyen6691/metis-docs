---
title: Prove one screen end to end before building more
summary: The first wave builds one screen, the project overview, with every detail and only on mock data, and no second screen starts before the owner signs it.
component: app
type: decision
status: current
ids: []
---

# Prove one screen end to end before building more

## Context

After the first app was deleted ([Rewrite the front end, reuse nothing of the first app](rewrite-frontend-from-scratch.md)), the first wave of the new front end needed a scope. Two assumptions were sent to the owner on 5 Oct 2026 and not corrected: the goal stays that a screen counts as done only when machines prove it through six gates (token, shape, behavior, translation, brand, accessibility), with exactly one screen built and signed before it is copied; and the acceptance screen is `24-project-overview`.

Three questions were put to the owner:

- FE-03, scope of the first wave: a vertical slice for the acceptance screen, the whole business core first, or the interface only. The owner chose the vertical slice and asked for an interface complete enough to review the design.
- FE-04, what a complete interface means: the acceptance screen alone with every detail, one screen for each layout type and each frame, or all 58 screens.
- FE-05, how to divide the code: along the back end's package boundaries, as one core package, or as a single app.

## Decision

1. The first wave builds one screen, `24-project-overview`, with every design detail (FE-04).
2. The wave is front end only. No back end is built, data may be mocked, and the code is one app with hand-written mock data (FE-05, as the log reads the owner's words).
3. At each layer the wave builds only what the acceptance screen needs: the API contract, the mock data, the base components, the shell, the translation layer and the six gates. It has no metric calculation rules and no part of the back end (the vertical slice of FE-03, narrowed by FE-05).
4. Wave two is planned only after the owner settles the first screen. It builds one screen for each layout type and each frame: `25-project-charter`, `26-wbs-table`, `27-wbs-tree`, `30-plan-timeline`, `31-plan-board`, `11-lifecycle-framework-designer`, `01-sign-in`, `02-tenant-admin-users`, `07-provider-tenants`, `45-client-view` and `46-onboarding-frame`.
5. The first screen is signed when all seven conditions hold:
   1. the six gates are green on every required platform;
   2. every gate of the test system is green, coverage, mutation, dead code and trace included;
   3. every counter-test turns its own gate red;
   4. `pnpm verify` is green on the Mac and CI is green on the same commit;
   5. the tester has run the real-device checklist and recorded the result;
   6. performance is measured on a mid-range Android phone and an iPhone and the numbers are recorded;
   7. the owner views the real screen in two languages, at three widths, through every state, on web, the iOS Simulator and Android, and signs.
6. After the signature, the screenshots of the screen on each platform and width become the baselines.

Left out of the first wave: the back end with its metric rules, the other 57 screens, the five other frames (admin, provider, no frame, outside guest, onboarding), and the App Store and Google Play release.

## Consequences

- The owner reviews one complete, real screen before a second one exists, and the checks are proven on that screen first and then copied.
- The other 57 screens wait. Wave two has no plan until the owner signs screen 24.
- Parts that screen 24 does not need are not built in this wave.
- A control whose target is a screen that is not built yet opens a generic "not built" page inside the real shell; see [Final routes, drill filters in the URL, and unbuilt destinations](routes-and-unbuilt-destinations.md) for the exact rules.

## Status

Current, decided by the owner on 5 Oct 2026 (FE-03, FE-04, FE-05).

## Sources

- [Front-end brainstorm log](../../history/specs/frontend-brainstorm-log.md): lines 24 to 27, 43 to 45 and 70 to 72 of the original (the assumptions, FE-03 to FE-05, the vertical slice).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): lines 25 to 59 of the original (goal, what is inside and outside the first wave, the seven conditions to sign).
