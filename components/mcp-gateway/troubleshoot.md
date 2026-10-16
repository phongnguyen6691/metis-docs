---
title: Troubleshoot the MCP gateway
summary: Where symptoms of the MCP gateway will be recorded, with the failure categories the BRD names and the risks the proposals name in advance.
component: mcp-gateway
type: how-to
status: draft
ids: []
---

# Troubleshoot the MCP gateway

Planned, not built: no symptom recorded yet.

This page will hold one row per symptom seen on the MCP gateway: what a person or a monitor sees, the cause that was measured, the fix, and where the measurement is kept. A row is added only after the symptom was seen and its cause measured. A fix that is a procedure (rotate a key, roll back) links its runbook in [operations/runbooks](../../operations/runbooks/README.md). The gateway is not built, so the table is empty.

| Symptom | Cause | Fix | Source |
|---|---|---|---|
| None recorded yet | | | |

## Categories the BRD already names

The BRD asks the connection page of the product to name the category of a failed test call and its fix (MCP-15). The categories are the first headings under which symptoms of the gateway will be sorted:

- an invalid or expired token;
- a missing scope;
- a workspace restriction;
- a client that the tenant's policy does not allow;
- a rate limit;
- a protocol version mismatch;
- the service being unavailable.

## Risks named in advance

These are risks the proposals name before any code exists. They are not symptoms, and nobody has measured them on Metis.

| Risk | Planned guard | Source |
|---|---|---|
| Two Keycloak features that serve MCP sign-in are still experimental [Unverified - confirm before applying] | The gateway checks the audience of the token itself, and the setup is tested with real LLM clients before go-live | backend proposals, line 224 of the original |
| The gateway brings the npm supply chain into a back end whose core is Java | The gateway stays very small and its versions are pinned; provenance checks alone are not enough | backend proposals, line 225 of the original |
| A token of tenant A is accepted at the endpoint of tenant B | The audience is checked on every call, and the isolation matrix has a negative test that expects HTTP 401 | BRD requirements TEN-02 and MCP-04 |
| The MCP clients in use do not speak the revision of the specification the gateway implements | Not settled in the sources; see [Each MCP request carries its own context](../../architecture/decisions/mcp-stateless-requests.md) | the same record |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 224 and 225 of the original.
- BRD rows MCP-04, MCP-15 and TEN-02, in `business/requirements/`.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.1, for the purpose of this page (line 137 of the original).
