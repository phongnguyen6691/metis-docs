---
title: Product Director portfolio review
summary: How the Product Director filters the portfolio, weighs trade-offs with a scenario and sends a recommendation to governance.
component: all
type: journey
status: current
ids: [REG-02, REG-03, RMP-01, MVP-03, RES-02, RSK-03, STR-02, INV-02, STR-03, STR-04, BR-11, BR-10]
---

# Product Director portfolio review

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

The Product Director reviews the portfolio to build the right products and manage trade-offs, from a filtered view of the portfolio to a recommendation sent to governance. Steps 1 to 3 rely on requirements of priority P0, which belong to Release 1. Steps 4 to 6 rely on requirements of priority P1, which are planned for V2. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Filter the portfolio by strategic objective or product. The registry lists every project of the workspace and filters it by workspace, portfolio, program, owner, health, lifecycle stage, strategic objective, business unit and status (REG-02). Projects are grouped under portfolios and under programs or products (REG-03). Module [M16](../modules/M16-portfolio-and-project-registry.md), screen 16.
2. Review roadmap and MVP delivery. The roadmap shows projects, MVPs and major milestones over 12 to 24 months (RMP-01), and each MVP has its own progress and health (MVP-03). Modules [M17](../modules/M17-portfolio-roadmap.md) (screen 17) and [M14](../modules/M14-mvp-and-product-delivery.md) (screen 35).
3. Identify capacity conflicts and dependencies. Bottleneck detection flags the resources and capabilities above their utilization thresholds (RES-02), and the dependency map shows what a delay does to the items downstream (RSK-03). Modules [M18](../modules/M18-resource-and-capacity.md) (screen 18) and [M13](../modules/M13-risk-and-dependency.md) (screen 19).
4. Review project score and expected value. The portfolio score weighs strategic alignment, customer value, financial value, risk, urgency and feasibility (STR-02), and expected and realized benefits are linked to KPIs (INV-02). Planned for V2: both modules have priority P1, and screens 20 and 21 are marked V2 in the wireframe manifest. Modules [M20](../modules/M20-strategy-prioritization-and-scenarios.md) (screen 21) and [M19](../modules/M19-investment-and-benefits.md) (screen 20).
5. Create a scenario if trade-offs are required. A scenario models a budget or a capacity change on a copy of the portfolio and compares it with the baseline (STR-03, STR-04). It never alters approved baseline data (BR-11). Planned for V2. Module [M20](../modules/M20-strategy-prioritization-and-scenarios.md), screen 21.
6. Submit the recommendation to governance. In the wireframe, Apply as proposal turns the scenario into a decision proposal for an authorized executive. A portfolio recommendation stays advisory until that executive approves it (BR-10). Planned for V2. Module [M20](../modules/M20-strategy-prioritization-and-scenarios.md), screen 21.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Filter the portfolio by strategic objective or product | [M16 Portfolio and Project Registry](../modules/M16-portfolio-and-project-registry.md) | [16 Portfolio and project registry](../../design/wireframes/wireframes-digest.md#16-portfolio-and-project-registry) |
| 2. Review roadmap and MVP delivery | [M17 Portfolio Roadmap](../modules/M17-portfolio-roadmap.md) | [17 Portfolio roadmap](../../design/wireframes/wireframes-digest.md#17-portfolio-roadmap) |
| 2. Review roadmap and MVP delivery | [M14 MVP and Product Delivery](../modules/M14-mvp-and-product-delivery.md) | [35 MVP detail](../../design/wireframes/wireframes-digest.md#35-mvp-detail) |
| 3. Identify capacity conflicts and dependencies | [M18 Resource and Capacity](../modules/M18-resource-and-capacity.md) | [18 Capacity control tower](../../design/wireframes/wireframes-digest.md#18-capacity-control-tower) |
| 3. Identify capacity conflicts and dependencies | [M13 Risk and Dependency](../modules/M13-risk-and-dependency.md) | [19 Risk and dependency control tower](../../design/wireframes/wireframes-digest.md#19-risk-and-dependency-control-tower) |
| 4. Review project score and expected value | [M20 Strategy, Prioritization and Scenario Planning](../modules/M20-strategy-prioritization-and-scenarios.md) | [21 Scenario planner](../../design/wireframes/wireframes-digest.md#21-scenario-planner) |
| 4. Review project score and expected value | [M19 Investment and Benefits](../modules/M19-investment-and-benefits.md) | [20 Investment and benefits](../../design/wireframes/wireframes-digest.md#20-investment-and-benefits) |
| 5. Create a scenario if trade-offs are required | [M20 Strategy, Prioritization and Scenario Planning](../modules/M20-strategy-prioritization-and-scenarios.md) | [21 Scenario planner](../../design/wireframes/wireframes-digest.md#21-scenario-planner) |
| 6. Submit the recommendation to governance | [M20 Strategy, Prioritization and Scenario Planning](../modules/M20-strategy-prioritization-and-scenarios.md) | [21 Scenario planner](../../design/wireframes/wireframes-digest.md#21-scenario-planner) |

## Sources

- The journey: the paragraph "Product Director portfolio review" of section 7.9 of the BRD, line 509 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: Product Director (line 360) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M13 (lines 391 to 402) and M14 (lines 403 to 413), in `business/requirements/source/parts/02-modules-a-b.md`.
- The requirements of M16 (lines 19 to 28), M17 (lines 29 to 39), M18 (lines 40 to 53), M19 (lines 54 to 66) and M20 (lines 67 to 78), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The business rules BR-11 (line 205) and BR-10 (line 204), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 16, 17, 18, 19, 20, 21 and 35 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The proposal of step 6 and the scenario of step 5: the [wireframe digest](../../design/wireframes/wireframes-digest.md#21-scenario-planner), screen 21.
- The release of a requirement follows its priority, P0 for Release 1, P1 for V2 and P2 for V3: line 55 of `business/requirements/source/parts/01-front.md`.
