---
title: MCP gateway interfaces
summary: What the planned MCP gateway exposes to customers' LLM clients and the agent, what it calls, and the open points of each interface.
component: mcp-gateway
type: reference
status: draft
ids: []
---

# MCP gateway interfaces

Planned, not built: the interfaces of the MCP gateway. None exists yet.

## What it exposes

| Interface | Consumer | What it is | Source |
|---|---|---|---|
| The MCP endpoint of a tenant | A customer's LLM client; the [agent](../agent/README.md) | One HTTPS endpoint per tenant using the Streamable HTTP transport, which serves the tools generated from the command catalog | backend brainstorm log, line 34 of the original; backend proposals, lines 16 and 27 of the original |
| OAuth 2.1 sign-in for MCP clients | A customer's LLM client | The gateway acts as the resource server and checks the audience of every token; [Keycloak](../keycloak/README.md) is the authorization server. A client that cannot use OAuth uses a personal access token, a bearer token issued by the same authorization server, scoped and expiring (D-29) | backend proposals, line 30 of the original; BRD requirements MCP-02, MCP-03 and D-29 |
| Rate limits | A customer's LLM client | By default 60 MCP calls a minute for each token; going over the limit returns a clear error with retry guidance (MCP-12) | backend proposals, line 33 of the original; backend brainstorm log, line 29 of the original |

The statuses an MCP server answers with, in the specification of 2026-07-28 [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, section Error Handling, read 12 Oct 2026]:

| Status | Meaning in the specification | Use in Metis |
|---|---|---|
| 401 | Authorization required or token invalid; an invalid or expired token always gets it | A token of another tenant's endpoint is refused with 401 (isolation matrix of TEN-02) |
| 403 | Invalid scopes or insufficient permissions | A token whose scopes do not allow the tool (MCP-04: the effective permission is the intersection of the user's roles and the token's scopes) |
| 400 | Malformed authorization request | Not specific to Metis |

The status names and their meanings come from the specification; which of them the gateway answers for each Metis case is a reading of the BRD rows and is open until the gateway exists.

## What it calls

| Target | What for | Source |
|---|---|---|
| The core API | The command catalog, which the gateway reads, and every call that reads or writes data; the gateway never touches the database | backend proposals, line 30 of the original |
| Keycloak | The authorization server for MCP clients: it issues the tokens the gateway checks | backend proposals, line 30 of the original; [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) |
| Valkey | Rate-limit counters, if the gateway counts the calls | backend proposals, line 33 of the original |

## Open questions

- The address scheme of a tenant's endpoint. The superseded system draft put the tenant in the host name [Source: system draft, line 248 of the original, carried over, confirm].
- How the gateway reads the catalog from the core: the format, the endpoint and how often.
- How the gateway checks a personal access token, and where the client allowlist of the tenant (MCP-20) is enforced.
- Which scopes exist and how they map to the action classes.
- The format of the rate-limit error and of the retry guidance.
- Whether the gateway keeps any session ([Each MCP request carries its own context](../../architecture/decisions/mcp-stateless-requests.md), a reviewer's proposal).
- Two Keycloak features that serve MCP sign-in, Client ID Metadata Documents and resource indicators, are still experimental according to the proposals [Source: backend proposals, line 224 of the original] [Unverified - confirm before applying]. The release notes of Keycloak list the Client ID Metadata Document as experimental in 26.6.0 [Source: keycloak.org/docs/latest/release_notes, Keycloak 26.6.0, read 12 Oct 2026]. The gateway therefore checks the audience itself and is tested with real LLM clients before go-live.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 16, 27, 30, 33 and 224 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 29 and 34 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 248 of the original, carried over, confirm.
- BRD rows TEN-02, MCP-02, MCP-03, MCP-04, MCP-12, MCP-20 and D-29, in `business/requirements/`.
- Pages read on 12 Oct 2026: modelcontextprotocol.io/specification/2026-07-28/basic/authorization and keycloak.org/docs/latest/release_notes.
