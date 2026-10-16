---
title: Workspace setup (WSP-14)
summary: How a workspace is set up from a starter template, checked for readiness and activated by its owner.
component: all
type: journey
status: current
ids: [WSP-01, WSP-03, WSP-14, WSP-07, WSP-08, WSP-10, WSP-11, PLT-03, GOV-18, GOV-19, GOV-20, GOV-21, GOV-12, BLD-13, BLD-16, BLD-09, BR-14, WSP-05]
---

# Workspace setup (WSP-14)

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

A workspace is the governed environment of a company, a business unit or an operating model, with its own configuration, roles and frameworks. Guided workspace setup (WSP-14) gives a new workspace a checklist and ends with a readiness check before the owner activates it. The onboarding addendum adds [a guided path](guided-onboarding.md) that fills the same checklist from the customer's documents; this journey stays valid for manual setup ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)). The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Create the workspace from a starter template and complete the profile. A new workspace starts in Draft with its owner (WSP-01). The profile holds the purpose, the operating model, the governance owner, the time zone, the fiscal and business calendars and the reporting cadence, and it drives working-day durations and reporting periods (WSP-03). The starter template is optional (WSP-14). Module [M03](../modules/M03-workspace-management-and-configuration.md), screen 36.
2. Configure fields and options. The workspace manages its lists for Category, Type, Label, Phase, Status and Priority (WSP-07). Every Status maps to a system state, so that a rename never breaks a metric or a Board column (WSP-08). Module [M03](../modules/M03-workspace-management-and-configuration.md), screen 9.
3. Invite the team and assign roles. Members are added with a role and can then be chosen as PIC, Reviewer and Approver (WSP-10, WSP-11). The invitee joins on acceptance (PLT-03). Module [M03](../modules/M03-workspace-management-and-configuration.md), screen 10.
4. Clone, adapt, review and publish the lifecycle framework. A template is cloned into an editable draft, its stages and governance are adapted, and publication needs a review and a readiness check (GOV-18, GOV-19, GOV-20, GOV-21). A published version is immutable (GOV-12). Module [M04](../modules/M04-lifecycle-governance-framework-and-templates.md), screens 13 and 11.
5. Add or adapt deliverable process frameworks, or keep the built-in ones for now: this step is recommended before the Deliverable Builder is used and does not block activation. New frameworks are authored in the process framework editor, opened from the template library, and published by the Workspace Owner (BLD-13, BLD-16). The built-in frameworks stay available meanwhile (BLD-09). Module [M08](../modules/M08-deliverable-builder-and-process-frameworks.md), screens 13 and 58.
6. The readiness check passes and the owner activates the workspace. The check tests four rules: the owner is set, a published default lifecycle framework exists (BR-14), every Status maps to a system state, and at least one portfolio exists (WSP-14). Activating a workspace that fails the check is blocked and lists what is missing. Activation moves the workspace from Draft to Active (WSP-05). Module [M03](../modules/M03-workspace-management-and-configuration.md), screen 36.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Create the workspace from a starter template and complete the profile | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [36 Workspace setup](../../design/wireframes/wireframes-digest.md#36-workspace-setup) |
| 2. Configure fields and options | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [9 Workspace settings: fields and options](../../design/wireframes/wireframes-digest.md#09-workspace-settings-fields-and-options) |
| 3. Invite the team and assign roles | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [10 Workspace settings: team and roles](../../design/wireframes/wireframes-digest.md#10-workspace-settings-team-and-roles) |
| 4. Clone, adapt, review and publish the lifecycle framework | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [13 Template library](../../design/wireframes/wireframes-digest.md#13-template-library); [11 Lifecycle framework designer](../../design/wireframes/wireframes-digest.md#11-lifecycle-framework-designer) |
| 5. Add or adapt deliverable process frameworks | [M08 Deliverable Builder and Process Frameworks](../modules/M08-deliverable-builder-and-process-frameworks.md) | [13 Template library](../../design/wireframes/wireframes-digest.md#13-template-library); [58 Process framework editor](../../design/wireframes/wireframes-digest.md#58-process-framework-editor) |
| 6. The readiness check passes and the owner activates the workspace | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [36 Workspace setup](../../design/wireframes/wireframes-digest.md#36-workspace-setup) |

## Sources

- The journey: the paragraph "Workspace setup (WSP-14)" of section 7.9 of the BRD, line 527 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Workspace Owner / Admin (line 362) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M01 (lines 33 to 61), M03 (lines 101 to 127), M04 (lines 128 to 164) and M08 (lines 285 to 315), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-14 (line 208), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 9, 10, 11, 13, 36 and 58 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The six steps of the checklist, the four readiness rules and the workspace states: the [wireframe digest](../../design/wireframes/wireframes-digest.md#36-workspace-setup), screen 36.
- The addendum fills the same checklist: the row WSP-14 in line 11 of `business/requirements/source/addendum-onboarding/parts/04-changes.md` ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)).
