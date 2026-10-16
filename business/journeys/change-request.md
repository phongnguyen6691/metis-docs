---
title: Change request
summary: How a change request goes from logged to applied, and who decides.
component: all
type: journey
status: current
ids: [CHG-02, CHG-01, CHG-03, BR-23, CHG-04, BR-30, CHG-09, BR-28, OVW-09, CHG-07, BR-04, BR-05, CHG-11]
---

# Change request

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

A change request (CR) is the formal way to change scope, schedule, budget, resources or dependencies. Before commitment the register of change requests is advisory; once a project is baselined, its locked fields change only through an approved CR (BR-04, BR-05). Three roles act, and each sees only its own actions: the requester logs the CR, an approver decides, and the PM applies it (CHG-07). The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Log the CR with affected items. The form takes the requester, the type, the priority, what is changing, why, the affected WBS items and the schedule, budget and resource impact (CHG-02). What, why, type and at least one affected item or baseline field are mandatory. The register says whether the project is baselined (CHG-01). Module [M11](../modules/M11-change-control-baseline-and-decision-log.md), screen 32.
2. Review the automatic impact analysis. It counts and lists the directly affected items and the downstream items that could shift through dependency links. It is advisory and reschedules nothing (CHG-03, BR-23). Module [M11](../modules/M11-change-control-baseline-and-decision-log.md), screen 32.
3. The approver decides (Approve, Reject, Defer, Request information) with rationale. A decision without a rationale is blocked (CHG-04, BR-30). The requester cannot be the sole approver unless the workspace policy allows self-approval for operational changes (CHG-09, BR-28). The approver finds the request in My approvals (OVW-09). Modules [M11](../modules/M11-change-control-baseline-and-decision-log.md) (screen 32) and [M10](../modules/M10-project-overview-and-focus.md) (screen 38).
4. If approved, the PM applies the change and a new baseline version is recorded. An approved CR unlocks only the fields it changes and shows Approved pending application until the PM has seen the difference between the current baseline and the new values. Applying creates a new baseline version that references the CR (CHG-07, BR-04, BR-05). Module [M11](../modules/M11-change-control-baseline-and-decision-log.md), screen 32.
5. The decision is stored in the Decision Log. The log keeps the decision with its rationale, evidence links, approver and date (CHG-11). The wireframes have no screen of the log itself. Module [M11](../modules/M11-change-control-baseline-and-decision-log.md).

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Log the CR with affected items | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 2. Review the automatic impact analysis | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 3. The approver decides | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 3. The approver decides | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals) |
| 4. The PM applies the change | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | [32 Change requests and baseline](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline) |
| 5. The decision is stored in the Decision Log | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | None (the wireframes have no screen of the Decision Log itself) |

## Sources

- The journey: the paragraph "Change request" of section 7.9 of the BRD, line 517 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The cadence: the "Change control" row of section 7.8 of the BRD, line 503 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.8 Governance cadence](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#78-governance-cadence)).
- The requirements of M10 (lines 332 to 353) and M11 (lines 354 to 376), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-23 (line 217), BR-30 (line 224), BR-28 (line 222), BR-04 (line 198) and BR-05 (line 199), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 32 and 38 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The register, the form, the impact analysis, the decision and the application of an approved CR: the [wireframe digest](../../design/wireframes/wireframes-digest.md#32-change-requests-and-baseline), screen 32.
