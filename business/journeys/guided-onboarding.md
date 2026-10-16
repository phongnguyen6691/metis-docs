---
title: Guided onboarding
summary: How an executive sets up a client's workspace in about 30 minutes by dropping what the client already has and approving one launch.
component: all
type: journey
status: current
ids: [ONB-02, ONB-03, ONB-27, ONB-04, ONB-29, ONB-28, ONB-13, ONB-11, ONB-12, BR-52, ONB-09, ONB-14, ONB-10, ONB-15, BR-44, ONB-16, ONB-17, ONB-19]
---

# Guided onboarding

Status in the app: not built yet. This page describes the journey as the addendum defines it, then says what works today.

Guided onboarding is the journey that the onboarding addendum adds to the main BRD. Its goal is to set up a client that meets the entry conditions in 30 minutes of the main setup person's effort ([section 4.1 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#41-goal-and-success-measure)). Metis reads the documents the client already has, builds the company as a draft in a Draft workspace (module [M23](../modules/M23-onboarding-and-data-intake.md)), asks only what it cannot read, launches with one approval and hands the rest to the right owners. The manual journeys [Tenant onboarding](tenant-onboarding.md) and [Workspace setup (WSP-14)](workspace-setup.md) stay valid for manual setup ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)).

The six steps below are those of [section 6.1 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#61-steps). On screen the executive sees four steps, Frame, Drop (reading and the first cards), Draft (the remaining cards, the approval flow and the projects to adopt) and Launch; delegation runs after launch. The times are design targets, and only the pilot measures the real ones (section 19.2 of the addendum).

## Steps

1. Frame. The executive confirms the pre-filled facts and the pre-selected answers to the three questions, changes any of them, or says one sentence instead (ONB-02, ONB-03). Metis sets the scope, the starting pack (ONB-27), the portfolio grouping, the decision routing and the home view, and tells the executive which files help most (ONB-04). Design target: under 1 minute. Module [M23](../modules/M23-onboarding-and-data-intake.md), screen 46.
2. Drop. The executive drops files, pastes, forwards or records a voice note. Forwarding and voice are planned for V2 (ONB-29, ONB-28). Metis starts reading at once, a live feed shows the state of each file, and the first signal from the client's own data appears as soon as one source is read (ONB-04, ONB-13). Design target: 2 to 5 minutes. Module [M23](../modules/M23-onboarding-and-data-intake.md), screens 46 and 47.
3. Ask while reading. The executive answers the cards that appear: irreversible settings, contradictions and launch blockers. Metis applies ask, assume, default, delegate or defer to each item, keeps the cap on cards (10 by default) and never assumes a high-impact value (ONB-11, ONB-12, BR-52). Design target: overlaps with reading. Module [M23](../modules/M23-onboarding-and-data-intake.md), screens 47 and 50.
4. Draft. The executive sees their own cockpit, registry and approval flow as a draft, plus the Portfolio X-ray, and Metis runs a dry run of the approval flow on three real projects (ONB-09, ONB-13, ONB-14). On screen this step also holds the remaining cards and the projects to adopt (ONB-10). Design target: around minute 15. Module [M23](../modules/M23-onboarding-and-data-intake.md), screens 48, 49, 50 and 51.
5. Approve and launch. The executive reviews the outcomes reached, then the exceptions: the access changes by role and by name, the unconfirmed values by risk class, the load per owner and what the undo covers. The executive names who finishes the rest and approves once. Metis publishes the lifecycle, adopts the projects, activates the workspace, grants the approved roles, sends the invitations and dispatches the owner tasks (ONB-15). Launch needs a person's approval in the application (BR-44), and a tenant admin can undo the onboarding for a period after launch (ONB-16). Design target: by minute 30. Module [M23](../modules/M23-onboarding-and-data-intake.md), screen 52.
6. Delegate the rest. The executive does nothing, or reassigns an owner. Metis sends the owners pre-filled tasks with due dates, and asks at the moment of need later (ONB-17, ONB-19). Design target: days, not executive time. Module [M23](../modules/M23-onboarding-and-data-intake.md), screen 53.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Frame | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [46 Onboarding: frame](../../design/wireframes/wireframes-digest.md#46-onboarding-frame) |
| 2. Drop | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [46 Onboarding: frame](../../design/wireframes/wireframes-digest.md#46-onboarding-frame); [47 Onboarding: reading](../../design/wireframes/wireframes-digest.md#47-onboarding-reading) |
| 3. Ask while reading | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [47 Onboarding: reading](../../design/wireframes/wireframes-digest.md#47-onboarding-reading); [50 Onboarding: questions and conversation](../../design/wireframes/wireframes-digest.md#50-onboarding-questions-and-conversation) |
| 4. Draft | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [48 Onboarding: draft cockpit](../../design/wireframes/wireframes-digest.md#48-onboarding-draft-cockpit); [49 Onboarding: approval flow](../../design/wireframes/wireframes-digest.md#49-onboarding-approval-flow); [50 Onboarding: questions and conversation](../../design/wireframes/wireframes-digest.md#50-onboarding-questions-and-conversation); [51 Onboarding: projects to adopt](../../design/wireframes/wireframes-digest.md#51-onboarding-projects-to-adopt) |
| 5. Approve and launch | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [52 Onboarding: launch](../../design/wireframes/wireframes-digest.md#52-onboarding-launch) |
| 6. Delegate the rest | [M23 Onboarding and Data Intake](../modules/M23-onboarding-and-data-intake.md) | [53 Onboarding: owner tasks](../../design/wireframes/wireframes-digest.md#53-onboarding-owner-tasks) |

## Sources

- The journey: section 6.1, Steps of the onboarding addendum, lines 171 to 183 of `business/requirements/source/addendum-onboarding/parts/01-front.md` ([BRD addendum 1.1, 6.1 Steps](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#61-steps)).
- The requirements of M23 (lines 3 to 51), in `business/requirements/source/addendum-onboarding/parts/02-requirements.md`.
- The business rules BR-52 (line 98) and BR-44 (line 90), in `business/requirements/source/addendum-onboarding/parts/02-requirements.md`.
- The screens: the title and phase of screens 46, 47, 48, 49, 50, 51, 52 and 53 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The goal, the entry conditions and the 30 minutes: lines 101 to 109 of `business/requirements/source/addendum-onboarding/parts/01-front.md` ([section 4.1 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#41-goal-and-success-measure)). The purpose of the module: line 5 of `business/requirements/source/addendum-onboarding/parts/02-requirements.md`.
- The sample session that walks the six steps in 30 minutes, with the wireframe of each moment: lines 216 to 229 of `business/requirements/source/addendum-onboarding/parts/01-front.md` ([section 6.5 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#65-a-30-minute-session)). The manual journeys stay valid and this journey is added: line 3 of `business/requirements/source/addendum-onboarding/parts/04-changes.md` ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)).
- The release of a requirement follows its priority, P0 for Release 1, P1 for V2 and P2 for V3: line 55 of `business/requirements/source/parts/01-front.md`.
