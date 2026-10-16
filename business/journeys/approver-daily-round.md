---
title: Approver daily round
summary: How an approver works through the queue of decisions waiting for them, and how the requester learns the outcome.
component: all
type: journey
status: current
ids: [OVW-09, CHG-04, CHG-09, BR-30, GOV-08, BR-42, MCP-08, BR-35, PLT-09]
---

# Approver daily round

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

An approver starts from one queue, My approvals, instead of looking for requests project by project. Each row opens the item where the decision is taken, the approver decides, and the requester is told. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Open My approvals (OVW-09). The queue lists every CR decision, gate decision and vote, charter sign-off, waiver request, deliverable approval and decision prepared through MCP that waits for the user, oldest first. Each row shows its type, project, requester, age and due date, and the navigation shows how many requests the user can act on now. Module [M10](../modules/M10-project-overview-and-focus.md), screen 38.
2. Open an item with its evidence and impact. A row opens the item where the decision is taken: a change request with its impact analysis, a gate review with its readiness evidence and waivers, a charter for sign-off, or the WBS item of a deliverable approval. Modules [M11](../modules/M11-change-control-baseline-and-decision-log.md) (screen 32), [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 12), [M06](../modules/M06-project-charter-and-business-case.md) (screen 25) and [M07](../modules/M07-wbs-master.md) (screen 28).
3. Decide with rationale or request information. A CR decision needs a rationale and cannot come from the requester (CHG-04, CHG-09, BR-30). A gate decision depends on the eligibility of the gate (GOV-08, BR-42). A decision prepared through MCP counts only when the approver confirms it in the application (MCP-08, BR-35). The two kinds of decision are described in [Change request](change-request.md) and [Gate review](gate-review.md). Modules [M11](../modules/M11-change-control-baseline-and-decision-log.md) (screen 32), [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 12) and [M05](../modules/M05-mcp-server-and-access-tokens.md) (screen 38).
4. The requester is notified (PLT-09). Notifications cover CR and gate decisions requested or made, in the application and by email, and a notification opens its source record. Module [M01](../modules/M01-platform-foundation-and-collaboration.md), screen 39.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Open My approvals (OVW-09) | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals) |
| 2. Open an item with its evidence and impact | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 2. Open an item with its evidence and impact | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 2. Open an item with its evidence and impact | [M06 Project Charter and Business Case](../modules/M06-project-charter-and-business-case.md) | [25 Project charter and business case](../../design/wireframes/wireframes-digest.md#25-project-charter-and-business-case) |
| 2. Open an item with its evidence and impact | [M07 WBS Master](../modules/M07-wbs-master.md) | [28 WBS item form and activity](../../design/wireframes/wireframes-digest.md#28-wbs-item-form-and-activity) |
| 3. Decide with rationale or request information | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 3. Decide with rationale or request information | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 3. Decide with rationale or request information | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals) |
| 4. The requester is notified (PLT-09) | [M01 Platform Foundation and Collaboration](../modules/M01-platform-foundation-and-collaboration.md) | [39 Notifications and preferences](../../design/wireframes/wireframes-digest.md#39-notifications-and-preferences) |

## Sources

- The journey: the paragraph "Approver daily round" of section 7.9 of the BRD, line 521 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The requirements of M01 (lines 33 to 61), M04 (lines 128 to 164), M05 (lines 165 to 219), M06 (lines 222 to 249), M07 (lines 250 to 284), M10 (lines 332 to 353) and M11 (lines 354 to 376), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-30 (line 224), BR-42 (line 236) and BR-35 (line 229), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 12, 25, 28, 32, 38 and 39 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The queue, its rows and the draft prepared through MCP: the [wireframe digest](../../design/wireframes/wireframes-digest.md#38-my-approvals), screen 38.
