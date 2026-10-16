---
title: M22 AI Portfolio Copilot
summary: An in-app assistant that answers portfolio questions with cited records, recommends actions and drafts narratives, acting with the permissions of the person asking, planned for V3.
component: all
type: module
status: current
ids: [AIC-01, AIC-02, AIC-03, AIC-04, AIC-05, AIC-06]
---

# M22 AI Portfolio Copilot

Status in the app: not built yet, and planned for V3. This page describes the module as the BRD defines it, then what the development build shows today.

## What it is for

AI Portfolio Copilot is the in-app assistant for the portfolio in the BRD ([module M22 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m22-ai-portfolio-copilot-aic)), in the Portfolio Intelligence layer. People ask it questions in natural language across strategy, projects, resources, investment and risk, and each answer cites the portfolio records it rests on (AIC-01). It recommends whether to stop, accelerate, fund or delay work from configured decision rules, and each recommendation carries its evidence, assumptions and confidence (AIC-02). It turns what-if questions into scenario proposals (AIC-03), answers questions about workspace rules and gate readiness and suggests framework improvements that cite the analytics behind them (AIC-04), predicts delivery and gate risk from historical patterns and shows its confidence and contributing factors (AIC-05), and drafts the weekly and SteerCo narratives from data and journal entries for a person to review (AIC-06).

The module is where the BRD's principle of accountable AI applies: AI explains, predicts and recommends from traceable portfolio data, and people approve every action. A recommendation is advisory until an authorized executive approves it (BR-10). Scenario work never alters the approved baseline, and the scenario assistant proposes no baseline change without explicit human approval (BR-11, AIC-03). A narrative is never published without a person's approval (AIC-06). Approvals, decisions, baseline application, deletions and permission or token changes need a person acting in the application, and an MCP client can only prepare them (BR-35). No AI feature crosses a tenant (BR-33). The wireframe for the copilot, screen 23, shows the intent: the copilot acts as the signed-in user in the selected workspace, with the same permissions as the app and the MCP server; its totals come from server tools and not from the model; and its actions only create a scenario or prepare a decision, never execute one.

It builds on the MCP interface of module M05 and does not stand beside it. In the first release any LLM client that implements MCP can work with the platform under the user's permissions; hosting or training an LLM inside the platform is out of scope for the MVP, and customers bring their own client. The in-app copilot stays V3 and reuses the MCP tools (row C-33 of [BRD Appendix C](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#appendix-c-source-reconciliation-log)).

All six requirements are priority P2, which the BRD reads as V3, the release it calls the AI Portfolio Operating System; its scope names the AI copilot, predictive risk, automated narrative, the scenario assistant, the recommendation engine, the governance copilot and cross-workspace benchmarks (the last belongs to [module M21](M21-analytics-and-executive-reporting.md)). The delivery plan keeps an AI phase, "Later", for copilot, scenarios and predictive insights, with governed AI readiness as its exit criterion. The BRD lists "AI recommendations not trusted" as a product risk and answers it with evidence-linked recommendations, assumptions, confidence and human approval.

## What users can do today

Nothing yet. The development build has no assistant, no question box, no recommendation and no narrative drafting, and no back end serves it: it runs on mock data ([Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md)).

The only trace of the module is a label. The navigation of the development build comes from mock data, and its Portfolio group lists AI copilot as plain text tagged Planned V3. The item cannot be pressed and opens nothing: the app shows a destination of a later release as text and never as a disabled control ([Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md)). The mock data gives it the tag V3, in line with the phase column of the wireframe manifest, where screen 23 (AI portfolio copilot) is V3. The route table of the app has no route for the copilot. The label is in the sidebar, and in the drawer at narrower widths.

The AI drafting of the SteerCo narrative (AIC-06) is shown on screen 22 (SteerCo report), which the manifest marks V2 and which tags its AI part Planned V3. The app lists SteerCo as text tagged Planned V2 and opens nothing ([module M21](M21-analytics-and-executive-reporting.md)). The MCP interface that gives LLM access in the first release (module M05) is not built either.

## Where the app differs from the BRD

None yet. Nothing of this module is built, so there is no built behavior to compare with the BRD.

## Open questions

None recorded.

## Sources

- [BRD v4.5, module M22](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#m22-ai-portfolio-copilot-aic): the module and its six requirements are lines 91 to 102 of [part 3 of the BRD source](../requirements/source/parts/03-modules-c-rules.md); its row of the module catalogue is line 27 of [part 2](../requirements/source/parts/02-modules-a-b.md).
- [Part 3 of the BRD source](../requirements/source/parts/03-modules-c-rules.md): the business rules BR-10, BR-11, BR-33 and BR-35 (lines 204, 205, 227 and 229).
- [Part 1 of the BRD source](../requirements/source/parts/01-front.md): the reading of priorities P2 as V3 (line 55), the principle of accountable AI (line 283), open and governed AI access (line 285), the exclusion of an LLM hosted in the MVP (line 331) and the copilot using the MCP tools (lines 551 to 553).
- [Part 4 of the BRD source](../requirements/source/parts/04-roadmap-decisions.md): the scope of V3 (line 10), the AI phase of the delivery plan (line 73) and the risk of distrusted AI recommendations (line 204).
- [Part 5 of the BRD source](../requirements/source/parts/05-appendices.md): the reconciliation row C-33 on AI access (line 157).
- Wireframes: screens 22 and 23 are phases V2 and V3 in [the wireframe manifest](../../design/wireframes/manifest.json), and their notes and annotations are lines 1677 to 1813 of [the wireframe digest](../../design/wireframes/wireframes-digest.md).
- Decision records: [Final routes, drill filters in the URL, and unbuilt destinations](../../architecture/decisions/routes-and-unbuilt-destinations.md) and [Screens call the real API; a mock server answers in mock builds only](../../architecture/decisions/mock-server-behind-real-api.md).
- The app, in the repository `metis-app`: `src/core/routes.ts` (the route table `ROUTES` at lines 3 to 26 and the screen table `SCREENS` at lines 45 to 68), `src/mocks/fixtures/shell.ts` (the mock navigation, lines 20 to 23), `src/shell/strings/en.ts` (labels and tags, lines 44 to 50), `src/shell/model.ts` (planned items become text with a tag, lines 81 to 106), `src/shell/Sidebar.tsx` (text rows, lines 75 to 94) and `src/shell/Rail.tsx` (planned items live in the drawer, line 60).
