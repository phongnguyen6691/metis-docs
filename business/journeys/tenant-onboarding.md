---
title: Tenant onboarding
summary: How a customer organization is set up by hand, from the tenant a provider operator creates to the frameworks a workspace owner configures.
component: all
type: journey
status: current
ids: [TEN-01, TEN-13, TEN-14, TEN-03, PLT-03, WSP-01, WSP-14, WSP-07, WSP-10, WSP-11, GOV-21, BLD-13, BLD-16]
---

# Tenant onboarding

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

A tenant is one customer organization. A provider operator creates it, its tenant admin sets up sign-in and users, and its workspace owners configure the workspaces. The onboarding addendum adds a guided path that reads the customer's own documents ([Guided onboarding](guided-onboarding.md)); this journey stays valid for manual setup ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)). The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. A provider operator creates the tenant with plan, region and first admin (self-serve signup is V2). The operator enters the organization name, the verified domains, the first tenant admin, the plan and the trial length (TEN-01). The tenant starts with a default workspace and the default lifecycle framework from the global template library, and the first admin receives an invitation. Two parts are planned for V2, both of priority P1: choosing the region, so that Release 1 uses the default region (TEN-13), and self-serve signup (TEN-14). Module [M02](../modules/M02-tenant-and-subscription-management.md), screen 7.
2. The tenant admin sets sign-in methods (SSO, or password with MFA) and invites users. The methods are single sign-on through the tenant's identity provider with verified domains, email and password with MFA, and magic links for invited external users (TEN-03). An invitation assigns a role, and the invitee joins on acceptance (PLT-03). Modules [M02](../modules/M02-tenant-and-subscription-management.md) (screen 3) and [M01](../modules/M01-platform-foundation-and-collaboration.md) (screen 2).
3. The admin creates workspaces, starting from global templates. A workspace is created in Draft with its owner (WSP-01) and set up as in [Workspace setup (WSP-14)](workspace-setup.md). It starts from global templates, which the template library catalogs beside the templates of the tenant and of the workspace. Modules [M03](../modules/M03-workspace-management-and-configuration.md) (screen 36) and [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 13).
4. Workspace owners configure fields, roles and frameworks. They manage the workspace lists (WSP-07), assign team roles (WSP-10, WSP-11), and prepare the lifecycle framework (GOV-21) and the process frameworks (BLD-13, BLD-16). The same work is a guided checklist in [Workspace setup (WSP-14)](workspace-setup.md). Modules [M03](../modules/M03-workspace-management-and-configuration.md) (screens 9 and 10), [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 11) and [M08](../modules/M08-deliverable-builder-and-process-frameworks.md) (screen 58).

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. A provider operator creates the tenant | [M02 Tenant and Subscription Management](../modules/M02-tenant-and-subscription-management.md) | [7 Provider console: tenants](../../design/wireframes/wireframes-digest.md#07-provider-console-tenants) |
| 2. The tenant admin sets sign-in methods and invites users | [M02 Tenant and Subscription Management](../modules/M02-tenant-and-subscription-management.md) | [3 Tenant admin: sign-in and security](../../design/wireframes/wireframes-digest.md#03-tenant-admin-sign-in-and-security) |
| 2. The tenant admin sets sign-in methods and invites users | [M01 Platform Foundation and Collaboration](../modules/M01-platform-foundation-and-collaboration.md) | [2 Tenant admin: users and roles](../../design/wireframes/wireframes-digest.md#02-tenant-admin-users-and-roles) |
| 3. The admin creates workspaces | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [36 Workspace setup](../../design/wireframes/wireframes-digest.md#36-workspace-setup) |
| 3. The admin creates workspaces | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [13 Template library](../../design/wireframes/wireframes-digest.md#13-template-library) |
| 4. Workspace owners configure fields, roles and frameworks | [M03 Workspace Management and Configuration](../modules/M03-workspace-management-and-configuration.md) | [9 Workspace settings: fields and options](../../design/wireframes/wireframes-digest.md#09-workspace-settings-fields-and-options); [10 Workspace settings: team and roles](../../design/wireframes/wireframes-digest.md#10-workspace-settings-team-and-roles) |
| 4. Workspace owners configure fields, roles and frameworks | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [11 Lifecycle framework designer](../../design/wireframes/wireframes-digest.md#11-lifecycle-framework-designer) |
| 4. Workspace owners configure fields, roles and frameworks | [M08 Deliverable Builder and Process Frameworks](../modules/M08-deliverable-builder-and-process-frameworks.md) | [58 Process framework editor](../../design/wireframes/wireframes-digest.md#58-process-framework-editor) |

## Sources

- The journey: the paragraph "Tenant onboarding" of section 7.9 of the BRD, line 523 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The personas of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Provider Operator (line 373), Tenant Admin (line 372) and Workspace Owner / Admin (line 362) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M01 (lines 33 to 61), M02 (lines 62 to 100), M03 (lines 101 to 127), M04 (lines 128 to 164) and M08 (lines 285 to 315), in `business/requirements/source/parts/02-modules-a-b.md`.
- The screens: the title and phase of screens 2, 3, 7, 9, 10, 11, 13, 36 and 58 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The creation of a tenant, with the region and the signup marked V2: the [wireframe digest](../../design/wireframes/wireframes-digest.md#07-provider-console-tenants), screen 7. The levels of the template library: the [digest of screen 13](../../design/wireframes/wireframes-digest.md#13-template-library).
- The manual journeys stay valid: line 3 of `business/requirements/source/addendum-onboarding/parts/04-changes.md` ([section 13 of the addendum](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md#13-amendments-to-brd-v45)).
- The release of a requirement follows its priority, P0 for Release 1, P1 for V2 and P2 for V3: line 55 of `business/requirements/source/parts/01-front.md`.
