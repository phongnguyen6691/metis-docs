---
title: CEO weekly review
summary: How the CEO reviews the portfolio each week, from the executive cockpit to the decisions kept in the Decision Log.
component: all
type: journey
status: current
ids: [EXE-01, BR-39, EXE-03, INV-02, EXE-02, RSK-04, BR-08, CHR-13, RES-02, EXE-04, BR-10, OVW-09, CHG-11]
---

# CEO weekly review

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

Once a week the CEO, or another member of the executive committee, opens the executive cockpit, reads the state of the portfolio, works through what needs attention and decides on what is recommended. In Release 1 the cockpit covers one workspace at a time. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Open the executive cockpit. It is the control tower of one workspace, and each tile states how fresh its data is (EXE-01, BR-39). Module [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md), screen 14.
2. Review portfolio health, investment, value and capacity. The cockpit totals projects, portfolio investment, FTE, expected value and realized value (EXE-01) and shows health by delivery, risk, resource and financial dimension (EXE-03). The value tiles read "Not tracked" until benefits are captured (INV-02, planned for V2). Module [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md), screen 14.
3. Open Requires Attention. This is the executive attention queue: missing status reports, green-but-risky projects, overdue milestones and gates, pending and approved-but-unapplied change requests, capacity overloads and material budget variance (EXE-02). Module [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md), screen 14.
4. Review green-but-risky projects and material budget or resource exceptions. A green-but-risky project is declared Green while the risk rules indicate Amber or Red (RSK-04, BR-08). The queue draws budget variance from the project budgets (CHR-13) and capacity overloads from bottleneck detection (RES-02). Each item has an owner, a reason, a severity and a next action: decide, review, rebalance or remind (EXE-02). Module [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md), screen 14.
5. Review recommended decisions. The decision center recommends START, CONTINUE, ACCELERATE, DELAY or STOP for projects, each with a rationale and supporting evidence (EXE-04, BR-10). Planned for V2: EXE-04 has priority P1, and the wireframe marks the decision center V2. Module [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md), screen 14.
6. Approve, reject or request further analysis. A recommendation is advisory until an authorized executive approves the decision (BR-10). Until the decision center arrives in V2, the decisions that wait for the CEO reach them as Decide items of the attention queue and in My approvals (OVW-09). Modules [M15](../modules/M15-executive-cockpit-and-workspace-dashboard.md) (screen 14) and [M10](../modules/M10-project-overview-and-focus.md) (screen 38).
7. Publish decisions into the Decision Log. The log keeps each decision with its rationale, evidence links, approver and date (CHG-11), and the decision center writes to it. The wireframes have no screen of the log itself. Module [M11](../modules/M11-change-control-baseline-and-decision-log.md).

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Open the executive cockpit | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 2. Review portfolio health, investment, value and capacity | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 3. Open Requires Attention | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 4. Review green-but-risky projects and material budget or resource exceptions | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 5. Review recommended decisions | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 6. Approve, reject or request further analysis | [M15 Executive Portfolio Cockpit and Workspace Dashboard](../modules/M15-executive-cockpit-and-workspace-dashboard.md) | [14 Executive portfolio cockpit](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit) |
| 6. Approve, reject or request further analysis | [M10 Project Overview and Focus](../modules/M10-project-overview-and-focus.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals) |
| 7. Publish decisions into the Decision Log | [M11 Change Control, Baseline and Decision Log](../modules/M11-change-control-baseline-and-decision-log.md) | None (the wireframes have no screen of the Decision Log itself) |

## Sources

- The journey: the paragraph "CEO weekly review" of section 7.9 of the BRD, line 507 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: CEO / ExCo (line 359) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M06 (lines 222 to 249), M10 (lines 332 to 353), M11 (lines 354 to 376) and M13 (lines 391 to 402), in `business/requirements/source/parts/02-modules-a-b.md`.
- The requirements of M15 (lines 4 to 18), M18 (lines 40 to 53) and M19 (lines 54 to 66), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The business rules BR-39 (line 233), BR-08 (line 202) and BR-10 (line 204), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 14 and 38 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The attention queue, the decision center and the "Not tracked" value tiles: the [wireframe digest](../../design/wireframes/wireframes-digest.md#14-executive-portfolio-cockpit), screen 14.
- The release of a requirement follows its priority, P0 for Release 1, P1 for V2 and P2 for V3: line 55 of `business/requirements/source/parts/01-front.md`.
