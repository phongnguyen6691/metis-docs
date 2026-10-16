---
title: Troubleshoot the agent
summary: Where symptoms of the agent will be recorded, with the risks the BRD and the proposals name in advance and the guard planned for each.
component: agent
type: how-to
status: draft
ids: []
---

# Troubleshoot the agent

Planned, not built: no symptom recorded yet.

This page will hold one row per symptom seen on the agent: what a person or a monitor sees, the cause that was measured, the fix, and where the measurement is kept. A row is added only after the symptom was seen and its cause measured. A fix that is a procedure (rotate a key, roll back) links its runbook in [operations/runbooks](../../operations/runbooks/README.md). The agent is not built, so the table is empty.

| Symptom | Cause | Fix | Source |
|---|---|---|---|
| None recorded yet | | | |

## Risks named in advance

These are risks the BRD and the proposals name before any code exists. They are not symptoms, and nobody has measured them on Metis.

| Risk | Planned guard | Source |
|---|---|---|
| Text in a document or a record that reads like an instruction steers the agent | The model sees document text as marked data and holds no tool that writes; text that reads like an instruction is quarantined with its source and reported | BRD requirement ONB-24 |
| A change of model, provider or prompt changes what the agent does | Three assurance suites run again on every such change and fail the release on any finding | BRD requirement ONB-25 |
| Customer content reaches a model provider that does not meet the BRD criteria | The BRD fixes the criteria (D-33: a no-training term, zero or short retention, regional processing, a data processing agreement, model version pinning) and the audit content (D-34). It is open that the provider named in the proposals routes requests globally by default, while D-33 lists regional processing | [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md) |
| The agent token is broader or lives longer than its run needs | The token is short-lived and narrow; its lifetime and scopes are not stated in the sources | backend proposals, line 31 of the original |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 31 of the original.
- BRD rows ONB-24, ONB-25, D-33 and D-34, in `business/requirements/`.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.1, for the purpose of this page (line 137 of the original).
