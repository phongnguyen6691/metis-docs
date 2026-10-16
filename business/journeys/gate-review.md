---
title: Gate review
summary: How a gate goes from mandatory evidence to a decision with rationale, and what happens to its conditions.
component: all
type: journey
status: current
ids: [GOV-04, BR-42, GOV-09, GOV-14, GOV-13, BR-17, GOV-03, GOV-08, BR-30, OVW-09, GOV-15, CHG-11, BR-18]
---

# Gate review

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

A gate is the decision point at the end of a lifecycle stage. The stage owner completes the evidence the gate requires, the gate approvers decide whether the project may advance, and the decision and its conditions are recorded. This journey is the lifecycle gate, decided by the gate approvers with a quorum; a deliverable approval gate, a WBS item labelled Approval Gate, is decided by the item's Approver instead ([section 7.5 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#75-lifecycle-and-gate-operating-model)). The steps below are those of [section 7.9](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. The stage owner completes mandatory evidence. Documents, fields, checklists and evidence can be mandatory before a gate is submitted (GOV-04). The gate review lists each mandatory artifact with its owner, its status and its evidence. Module [M04](../modules/M04-lifecycle-governance-framework-and-templates.md), screen 12.
2. Gate readiness is checked. Decision buttons stay disabled until the gate is eligible, and the server rejects an ineligible decision from every channel (BR-42, GOV-09). A disabled decision always names what is missing, with a link to each blocker and its owner, so an ineligible gate is actionable rather than simply closed. The readiness view also shows the open risks, the dependencies, the budget and resource impact and the decision history (GOV-14). A mandatory criterion can be set aside only by an authorized waiver that has not expired (GOV-13, BR-17). Module [M04](../modules/M04-lifecycle-governance-framework-and-templates.md), screen 12.
3. Gate approvers decide with rationale. The options are Pass, Pass with Conditions, Rework, Hold and Reject. A gate cannot be decided without its quorum, and a decision without a rationale is blocked (GOV-03, GOV-08, BR-30). Approvers find the vote in My approvals (OVW-09). Modules [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) (screen 12) and [M10](../modules/M10-project-overview-and-focus.md) (screen 38).
4. Conditions become tracked actions; the decision enters the Decision Log. A Pass with Conditions decision creates at least one tracked condition with an owner and a due date, and the decision is linked to the project, the stage, the evidence, the approver and the Decision Log (GOV-15, CHG-11). An approved gate decision cannot be edited except through a correction workflow (BR-18). Modules [M04](../modules/M04-lifecycle-governance-framework-and-templates.md) and [M11](../modules/M11-change-control-baseline-and-decision-log.md), screen 12.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. The stage owner completes mandatory evidence | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 2. Gate readiness is checked | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 3. Gate approvers decide with rationale | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 3. Gate approvers decide with rationale | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals) |
| 4. Conditions become actions; the decision enters the Decision Log | [M04 Lifecycle Governance Framework and Templates](../modules/M04-lifecycle-governance-framework-and-templates.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |
| 4. Conditions become actions; the decision enters the Decision Log | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [12 Gate review](../../design/wireframes/wireframes-digest.md#12-gate-review) |

## Sources

- The journey: the paragraph "Gate review" of section 7.9 of the BRD, line 519 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Stage Owner / Gate Approver (line 364) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The cadence: the "Gate review" row of section 7.8 of the BRD, line 502 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.8 Governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)).
- The requirements of M04 (lines 128 to 164), M10 (lines 332 to 353) and M11 (lines 354 to 376), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-42 (line 236), BR-17 (line 211), BR-30 (line 224) and BR-18 (line 212), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 12 and 38 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The mandatory artifacts, the blockers, the votes against the quorum, the rationale and the decision history: the [wireframe digest](../../design/wireframes/wireframes-digest.md#12-gate-review), screen 12.
- The two gate levels: lines 463 to 468 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.5 Lifecycle and gate operating model](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#75-lifecycle-and-gate-operating-model)).
