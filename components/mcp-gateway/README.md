---
title: MCP gateway
summary: The planned TypeScript service that gives each tenant one MCP endpoint, checks OAuth tokens and calls the core API, with its dependencies and team.
component: mcp-gateway
type: overview
status: draft
ids: []
---

# MCP gateway

Planned, not built: the MCP gateway, a small stateless TypeScript service that gives each tenant one MCP endpoint for the tenant's own LLM, checks the OAuth token and the tenant, and calls the core API. `metis-backend` holds no code yet, so nothing on this page can be run, called or tested today.

## What it does

Everything in this section is the plan; the table under Decided and proposed gives the status of each choice.

MCP is the protocol that lets a customer's LLM read and write Metis data. The gateway is its front door [Source: backend proposals, line 16 of the original]. As drawn, it is TypeScript on Node.js 24 [Source: pitch diagram data, lines 128 to 130 of the original].

- **One endpoint per tenant**, over HTTPS with the Streamable HTTP transport; the BRD asks for it in MCP-01 [Source: backend brainstorm log, line 34 of the original].
- **Sign-in through Keycloak.** MCP clients connect with OAuth 2.1, and personal access tokens also exist (MCP-02, MCP-03 and D-29 in the BRD). The gateway checks the OAuth token and the audience of each tenant, then calls the API of the core [Source: backend proposals, line 30 of the original]. Authorization is optional in MCP; when it is supported, the specification of 2026-07-28 requires an MCP server to implement OAuth 2.0 Protected Resource Metadata (RFC 9728) and to validate that a token was issued specifically for it as the audience (RFC 8707) [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026].
- **Tools from the command catalog.** It reads the catalog from the core, and the tool list is generated from it [Source: backend proposals, lines 27 and 30 of the original]. The BRD sets 17 tools in four action classes (read, append-only, reversible write and prepare-only). MCP never approves, decides, changes a baseline, deletes or changes permissions: a tool can only prepare such an action and return a link for a person to confirm in the application (MCP-08 and D-30) [Source: backend brainstorm log, line 34 of the original].
- **Rate limits per token.** The default is 60 MCP calls a minute for each token, counted in Valkey [Source: backend proposals, lines 33 and 282 of the original; backend brainstorm log, line 29 of the original].
- **No database.** It calls the core API only and never touches the database [Source: backend proposals, line 30 of the original].

As drawn, a customer's LLM reaches the gateway over MCP through the Cloudflare edge, and the agent reaches it too, over MCP only [Source: pitch diagram data, lines 161, 166 and 169 of the original].

## Decided and proposed

| Record | Status |
|---|---|
| [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md) | Decided: the gateway lives in `metis-backend` |
| [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](../../architecture/decisions/backend-language-java-spring-boot.md) | Decided for the core only (Java 25 with Spring Boot 4); the separate TypeScript gateway is a draft proposal, see the next row |
| [A thin, stateless MCP gateway in TypeScript](../../architecture/decisions/mcp-gateway-typescript.md) | Proposed |
| [Each MCP request carries its own context](../../architecture/decisions/mcp-stateless-requests.md) | Proposed by a reviewer |
| [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](../../architecture/decisions/command-catalog.md) | Proposed |
| [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) | Proposed |
| [Push updates and rate limits on Valkey](../../architecture/decisions/realtime-and-rate-limits.md) | Proposed |

## What it depends on

| Dependency | What the gateway uses it for |
|---|---|
| The [core](../core/README.md) | The command catalog and every call that reads or writes data |
| [Keycloak](../keycloak/README.md) | Issues the OAuth tokens and acts as the authorization server for MCP clients |
| Valkey | Counts the calls for the rate limits (the sources do not say whether the gateway or the core counts) |
| The Cloudflare edge | Sits in front of the gateway, as drawn [Source: pitch diagram data, lines 119, 120 and 166 of the original] |

The [agent](../agent/README.md) is a client of the gateway: it reaches Metis data only through the tools the gateway serves.

## Team and repository

- **Team:** the backend team [Source: repositories design, section 2.1, line 68 of the original].
- **Code repository:** `metis-backend`, which holds no code yet. See [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md).
- **Reference pages:** `reference/` does not exist yet. It will hold the MCP tools with their scopes and rate limits, generated from the command catalog the gateway reads [Source: repositories design, section 3.2, line 159 of the original].

## Read next

- [Develop the MCP gateway](develop.md), [MCP gateway interfaces](interfaces.md) and [Troubleshoot the MCP gateway](troubleshoot.md).
- The architecture pages [overview](../../architecture/overview.md), [security](../../architecture/security.md), [tenancy](../../architecture/tenancy.md) and [contract](../../architecture/contract.md).

## Open questions

- Whether the gateway keeps no session at all. The proposals call it stateless and a reviewer proposes that each request carries its own context, but the BRD still says "MCP session" until the owner decides ([Each MCP request carries its own context](../../architecture/decisions/mcp-stateless-requests.md)).
- Which of the gateway and the core counts the calls for the rate limit, and where the counter lives.
- How the gateway checks a personal access token: the BRD asks for hashed, revocable tokens with scopes and an expiry (MCP-02), and the proposals describe only the check of the OAuth token and its audience.
- Whether the MCP clients the BRD targets speak the 2026-07-28 revision of the specification (see [Each MCP request carries its own context](../../architecture/decisions/mcp-stateless-requests.md)).
- The address scheme of a tenant's endpoint. The superseded system draft put the tenant in the host name [Source: system draft, line 248 of the original, carried over, confirm].
- The proposals name one alternative to a separate TypeScript gateway, the MCP server of Spring AI [Source: backend proposals, line 87 of the original]; the owner has not chosen between the two.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 16, 27, 30, 33, 87 and 282 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 29 and 34 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 248 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: lines 119, 120, 128 to 130, 161, 166 and 169 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1 and 3.2 (lines 68 and 159 of the original).
- BRD rows MCP-01, MCP-02, MCP-03, MCP-08, D-29 and D-30, in `business/requirements/`.
- Page read on 12 Oct 2026: modelcontextprotocol.io/specification/2026-07-28/basic/authorization.
