---
title: M02 Tenant and Subscription Management
summary: How a provider operator creates and runs customer tenants, and how a tenant admin manages sign-in, plan limits, support access and offboarding.
component: all
type: module
status: current
ids: [TEN-01, TEN-02, TEN-03, TEN-04, TEN-05, TEN-06, TEN-07, TEN-08, TEN-09, TEN-10, TEN-11, TEN-12, TEN-13, TEN-14, TEN-15]
---

# M02 Tenant and Subscription Management

Status in the app: not built yet. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

Metis is a multi-tenant service: the product owner stated this on 2 Oct 2026, and the BRD records it as assumption A-06. A tenant is one customer organization. It owns its users, sign-in methods, plan, data boundary and enterprise layer, and it contains one or more workspaces ([module M03](M03-workspace-management-and-configuration.md)). This module is how tenants are created and run, and how the provider of the service operates it without seeing any tenant's business data.

Two kinds of people use it. A provider operator creates a tenant with its organization name, verified domains, first tenant admin, plan, region and trial length, and manages tenants, plans, the global template library, feature flags and service notices; the operator screens show tenant metadata and usage only (TEN-01, TEN-08). A tenant admin runs the customer's own account in one console: users and roles, workspaces, sign-in and security policies, the AI access policy for MCP, plan and usage, the audit log and data export (TEN-04). Each tenant chooses its sign-in methods: SSO through its identity provider with verified domains and just-in-time provisioning, email and password with MFA, and magic links for invited external users (TEN-03).

The module also holds the promises that keep tenants apart. Isolation (TEN-02) says that every record, file, search index, cache, report, export, audit entry and MCP session belongs to exactly one tenant, and that no screen, API, MCP tool, report or AI feature returns another tenant's data. The BRD names a tenant boundary and a negative test, run on every release, for each of ten data paths (the isolation matrix), and asks for an external penetration test before go-live. It calls the matrix a draft that assumes the recommendation of decision D-28, shared infrastructure with strict logical isolation, and leaves the mechanisms to the Discovery architecture decision record.

Plans and limits keep a tenant in good standing. A plan enables modules and sets limits on seats, workspaces, storage and monthly MCP calls, and the tenant admin sees usage against them; a limit blocks only the limited action and never reading or export (TEN-05, BR-38). Fair-use quotas and rate limits protect other tenants (TEN-10). A tenant moves through Trial, Active, Suspended (read-only), Cancelled (with an export window) and Deleted (data purged after the retention period, leaving a deletion record) (TEN-06). Tenant admins export all data and files on request and when cancelling, and a full export restores into a new tenant (TEN-07).

Provider staff have no standing access to tenant data. Support is break-glass: the provider states a reason and a case, a tenant admin approves named staff, a scope (read-only by default) and an expiry, the admin can revoke the grant at once, and every action is audited and visible to the tenant (TEN-09, BR-37).

Five requirements are priority P1 and come later: SCIM user provisioning (TEN-11), tenant branding (TEN-12), a hosting region chosen at provisioning with data and backups kept there (TEN-13; the owner decided on 10 Oct 2026 to start in one region and to tie each tenant to a home region when it is created, see [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md)), self-serve signup with online billing (TEN-14, which decision D-27 places in V2) and usage metering (TEN-15). The other ten are P0 and sit in milestone 1A of the release plan ([BRD section 18.2](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01)). The BRD gives the module eight wireframe screens: 1, 2, 3, 4, 5, 7, 43 and 44, described in the [wireframe digest](../../design/wireframes/wireframes-digest.md). The [Tenant onboarding](../journeys/tenant-onboarding.md) journey starts with this module: a provider operator creates the tenant, then the tenant admin sets the sign-in methods and invites users ([BRD section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).

## What users can do today

Nothing yet. The app is not deployed and has no back end. Its development build runs on mock data and holds one screen of the BRD, the project overview (screen 24, [module M10](M10-project-overview-and-focus.md)), so no requirement of this module can be used.

The app has no sign-in, no tenant admin console and no provider console. None of the module's eight wireframe screens has a route in the app, and its navigation has no item for them. The only trace of a tenant is its name: the workspace button at the top of the sidebar shows it above the workspace name, read from the mock shell data.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

- Are the mechanisms behind the isolation matrix confirmed? The BRD calls the matrix of TEN-02 a draft that assumes decision D-28, and leaves the mechanisms to the Discovery architecture decision record (line 86 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); line 169 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md)). The sources record no confirmation by the owner. A draft proposal exists for the database path: [Tenant isolation with PostgreSQL row-level security](../../architecture/decisions/tenant-isolation-rls.md).
- Which retention periods apply to business records, files, audit entries, MCP call records and backups, per customer jurisdiction? The BRD ties the question to the data lifecycle (section 17) and to tenant deletion, where a deleted tenant's data is purged after the retention period (TEN-06), and records no answer ([BRD v4.5, open questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions), Q-11, line 189 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md)).

## Sources

- [BRD v4.5, module M02](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m02-tenant--subscription-management-ten): the purpose, the requirements, the isolation matrix and the wireframe list, lines 62 to 100 of [BRD part 02, modules A and B](../requirements/source/parts/02-modules-a-b.md); the catalogue row, line 7 of the same part.
- [BRD v4.5, assumptions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#53-assumptions): A-06, line 343 of [BRD part 01, front matter](../requirements/source/parts/01-front.md); the personas Tenant Admin and Provider Operator, lines 372 and 373; the tenant level of the hierarchy, line 383; Tenant onboarding, line 523 ([key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- [BRD v4.5, business rules](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#13-business-rules): BR-37 and BR-38, lines 231 and 232 of [BRD part 03, modules C and rules](../requirements/source/parts/03-modules-c-rules.md).
- [BRD v4.5, release 1 delivery structure](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#182-release-1-delivery-structure-d-01): milestone 1A, line 30 of [BRD part 04, roadmap and decisions](../requirements/source/parts/04-roadmap-decisions.md). [BRD v4.5, decision register](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#191-decision-register): D-27 (line 168) and D-28 (line 169) of the same part. [BRD v4.5, open questions](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#192-open-questions): Q-11, line 189 of the same part.
- Wireframes: [the manifest](../../design/wireframes/manifest.json) and [Wireframes text digest](../../design/wireframes/wireframes-digest.md), screens 1, 2, 3, 4, 5, 7, 43 and 44 (manifest lines 15, 35, 55, 73, 99, 135, 971 and 994; digest lines 15 to 66, 68 to 152, 154 to 208, 210 to 316, 318 to 378, 442 to 516, 3186 to 3266 and 3268 to 3339).
- The decision records [Tenant isolation with PostgreSQL row-level security](../../architecture/decisions/tenant-isolation-rls.md), a draft, [One region first, more regions per customer later](../../architecture/decisions/global-ready-release.md), decided by the owner on 10 Oct 2026, and [The shell has its own endpoint](../../architecture/decisions/shell-api-contract.md), for the tenant name that the shell data carries.
- The app, in the `metis-app` repository: `src/core/routes.ts` (`ROUTES`, `SCREENS`), `src/core/api/shell.ts` (the navigation codes and the shell contract), `src/shell/Sidebar.tsx` (the workspace button) and `src/mocks/fixtures/shell.ts` (the mock navigation and the tenant name); `src/screens/` holds one screen, 24.
