---
title: PM project setup
summary: How a project manager creates a project in Draft and takes it to commitment with a charter, a WBS and a baseline.
component: all
type: journey
status: current
ids: [CHR-17, GOV-27, BR-15, GOV-12, CHR-02, CHR-03, CHR-04, CHR-12, WBS-01, WBS-04, BLD-01, BLD-05, WBS-12, BLD-14, BLD-12, CHG-06, BR-04, GOV-08]
---

# PM project setup

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

A project manager creates a project and takes it from Draft to commitment: the charter and the business case are written, the WBS is built, people are assigned and the baseline is captured. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Create the project (CHR-17). The project is created with a workspace, a portfolio, an optional program, a name, a client or business unit, a PM, an owner and a sponsor, and optionally from a project template (GOV-27). The workspace's published lifecycle framework version is pinned to the project (BR-15, GOV-12), and the project starts in Draft with a setup checklist that leads to commitment. Planned for V2: the project template, because GOV-27 has priority P1 and the wireframe marks the template field V2. Module [M06](../modules/M06-project-charter-and-business-case.md), screen 37.
2. Complete charter sections I-IV and the business case. Sections I to IV are the identification, the key contacts, the description and objectives, and the scope (CHR-02, CHR-03, CHR-04). The business case must be approved before the project becomes committed (CHR-12). Module [M06](../modules/M06-project-charter-and-business-case.md), screen 25.
3. Build the WBS manually or with the Deliverable Builder. Work items are created and edited in the WBS, whose table view edits them inline (WBS-01, WBS-04). The Builder instead generates pre-wired items and dependencies from a process framework (BLD-01, BLD-05). Modules [M07](../modules/M07-wbs-master.md) (screen 26) and [M08](../modules/M08-deliverable-builder-and-process-frameworks.md) (screen 29).
4. Assign PIC, Reviewer and Approver. People are chosen from the workspace members (WBS-12). A framework node names a role or a title, not a person, so any node whose selector matched nobody or several members is resolved in the build preview: a node that matched nobody is listed as missing and its field stays empty, and a node that matched several members is listed as ambiguous and blocks the build until the PM chooses; Metis never picks the first match (BLD-14, BLD-12). Modules [M07](../modules/M07-wbs-master.md) (screen 28) and [M08](../modules/M08-deliverable-builder-and-process-frameworks.md) (screens 29 and 58).
5. Pass the commitment gate; the baseline is captured. On commitment, at charter approval or at the configured gate, the system captures a baseline of scope, dates, budget and critical dependencies (CHG-06), and those values are locked after commitment (BR-04). The gate is decided as described in [Gate review](gate-review.md) (GOV-08). Modules [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 12) and [M11](../modules/M11-change-control-baseline-and-decision-log.md) (screen 32).

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Create the project (CHR-17) | [M06 Project Charter and Business Case](../modules/M06-project-charter-and-business-case.md) | [37 Create project](../../design/wireframes/wireframes-digest.md#37-create-project) |
| 2. Complete charter sections I-IV and the business case | [M06 Project Charter and Business Case](../modules/M06-project-charter-and-business-case.md) | [25 Project charter and business case](../../design/wireframes/wireframes-digest.md#25-project-charter-and-business-case) |
| 3. Build the WBS manually or with the Deliverable Builder | [M07 WBS Master](../modules/M07-wbs-master.md) | [26 WBS Master: table view](../../design/wireframes/wireframes-digest.md#26-wbs-master-table-view) |
| 3. Build the WBS manually or with the Deliverable Builder | [M08 Deliverable Builder and Process Frameworks](../modules/M08-deliverable-builder-and-process-frameworks.md) | [29 Deliverable Builder](../../design/wireframes/wireframes-digest.md#29-deliverable-builder) |
| 4. Assign PIC, Reviewer and Approver | [M07 WBS Master](../modules/M07-wbs-master.md) | [28 WBS item form and activity](../../design/wireframes/wireframes-digest.md#28-wbs-item-form-and-activity) |
| 4. Assign PIC, Reviewer and Approver | [M08 Deliverable Builder and Process Frameworks](../modules/M08-deliverable-builder-and-process-frameworks.md) | [29 Deliverable Builder](../../design/wireframes/wireframes-digest.md#29-deliverable-builder); [58 Process framework editor](../../design/wireframes/wireframes-digest.md#58-process-framework-editor) |
| 5. Pass the commitment gate | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 5. Pass the commitment gate | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |

## Sources

- The journey: the paragraph "PM project setup" of section 7.9 of the BRD, line 511 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Project Owner / Project Manager (line 363) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M04 (lines 128 to 164), M06 (lines 222 to 249), M07 (lines 250 to 284), M08 (lines 285 to 315) and M11 (lines 354 to 376), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-15 (line 209) and BR-04 (line 198), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 12, 25, 26, 28, 29, 32, 37 and 58 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The setup checklist and the project template field: the [wireframe digest](../../design/wireframes/wireframes-digest.md#37-create-project), screen 37. The preview of roles that matched nobody or several members: the [wireframe digest](../../design/wireframes/wireframes-digest.md#58-process-framework-editor), screen 58.
- The release of a requirement follows its priority, P0 for Release 1, P1 for V2 and P2 for V3: line 55 of `business/requirements/source/parts/01-front.md`.
