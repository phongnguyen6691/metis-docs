---
title: M14 MVP and Product Delivery
summary: Lets product teams define an MVP with its outcome, link features to it and follow its progress and health.
component: all
type: module
status: current
ids: [MVP-01, MVP-02, MVP-03, MVP-04, MVP-05]
---

# M14 MVP and Product Delivery

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Product delivery needs a container for outcomes above the work items, and [module M14 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m14-mvp--product-delivery-mvp) gives it one: an MVP, or a release. An MVP records its objective, the customer problem, its scope, its release date, a KPI, an owner and the expected benefit, and every MVP needs a measurable outcome or KPI and release criteria (MVP-01, BR-06). It answers the BRD's fifth core management question, when the value will be delivered ([section 4.3](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#43-core-management-questions)), and it is the "MVP or deliverable" step of the golden thread that traces every project from strategy to investment, delivery and outcome ([section 4.4](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#44-product-principles)).

Features are WBS work items linked to the MVP and to its milestones, and a committed MVP cannot keep an orphan feature (MVP-02). The MVP's progress is the share of its linked work items that are done, with "no linked work" when none are linked, and its health is the worst of its scope, schedule, resource and dependency health; a dimension without data shows unknown and does not count as Green (MVP-03, BRD section 12.1). The status of an MVP can be compared with the status of its project, so a healthy project with an at-risk MVP shows (MVP-03, and the wireframe).

MVP objects are a workspace option: they are enabled for a workspace that does product delivery and can be disabled where they are not used, for example in creative production, and then the workspace hides the MVP fields and views (MVP-04). MVP-05 lets the lifecycle of an MVP or release reference the workspace framework, so that its stages come from a published framework.

The module is for product directors and delivery leads, whose key views include the MVP, and for the project managers whose projects deliver one. MVP-05 is priority P1, which the BRD reads as V2; the other four requirements are P0, part of Release 1. The BRD builds the module in the project execution layer for milestone 1B ([section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). Its wireframe is screen 35 (MVP detail). The Product Director portfolio review uses it, at the step where the director reviews the roadmap and MVP delivery ([section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)). In guided onboarding, the main kind of work of the client, recorded from the sales discovery and confirmed by the executive, sets whether MVP objects are on or off ([addendum, section 6.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#62-facts-pre-filled-from-the-sales-discovery)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, module M10), so no requirement of this module can be used: nobody can define an MVP, link a feature to it or see its progress and health.

The build's navigation names no screen of this module. Screen 35 (MVP detail) is phase MVP in the wireframe manifest, but the route table of the app has no destination for it, so no sidebar item, tab or button leads there, and the mock data holds no MVP. The wireframe of screen 35 is drawn with the Overview tab active; the Overview tab of a project opens screen 24, which shows the server's counts of work items, milestones and approval gates and no MVP. The build computes no progress or health itself (see [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md)).

The rule of the record [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) gives a final route and a generic page to each screen that a control of the shell names. No control names screen 35, so it has neither.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

None recorded.

## Sources

- [BRD v4.5, module M14](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m14-mvp--product-delivery-mvp): the requirements and the wireframe list, lines 403 to 413 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 19.
- [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-06 and BR-39 (lines 200 and 233); the MVP progress and MVP health definitions of section 12.1 (lines 132 and 133); the role of the Product Director (line 249); the entity MVP / release (line 283).
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): milestone 1B, line 31 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md).
- [BRD v4.5, key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys): the Product Director portfolio review, line 509 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the core management question 5, line 263; the golden thread, line 273; the personas, lines 360 and 370; the priority key, line 55.
- [Onboarding addendum v1.1, facts pre-filled from the sales discovery](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#62-facts-pre-filled-from-the-sales-discovery): the main kind of work and MVP objects on or off, line 191 of [Onboarding addendum, front matter](../requirements/source/addendum-onboarding/parts/01-front.md).
- Wireframes: [the manifest](../../design/wireframes/manifest.json) (screen 35, line 802) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md) (screen 35, lines 2627 to 2700). The screen itself: [35 MVP detail](../../design/wireframes/screens/35-mvp-detail.html).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): the rules for a destination that is not built, lines 236 to 250 of the original, and the route table, lines 253 to 275 (it has no row for MVP detail).
- The decision records [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md), [Prove one screen end to end before building more](../../architecture/decisions/acceptance-screen-first.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the `metis-app` repository: `README.md` (`pnpm web` opens the build with mock data), `src/core/routes.ts` (`ROUTES`, `SCREENS`, which hold no destination for screen 35), `src/core/routes.test.ts` (the check that every route names a first-release screen of the manifest), `src/mocks/fixtures/` (the mock data, which holds no MVP) and `src/screens/24-project-overview/contract.yaml` (the controls of screen 24).
