---
title: Connect an LLM through MCP
summary: How a user connects an LLM client to the tenant's MCP server, and what the client can and cannot do.
component: all
type: journey
status: current
ids: [MCP-15, MCP-01, MCP-20, MCP-03, MCP-02, MCP-04, MCP-05, MCP-06, MCP-07, MCP-10, BR-32, MCP-08, BR-35, MCP-11]
---

# Connect an LLM through MCP

Status in the app: not built yet. This page describes the journey as the BRD defines it, then says what works today.

In the BRD, the Model Context Protocol (MCP) is the open protocol that connects LLM applications to external data and tools. Each tenant has an MCP server, and a user connects an LLM client to it to ask questions and log updates in natural language. The server always acts as the user who owns the token. The steps below are those of [section 7.9 of BRD v4.5](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys).

## Steps

1. Open My profile, AI access. The page shows the tenant's endpoint, the OAuth connection, token creation, example client configurations, a test call, the list of tools and the clients that have been verified (MCP-15, MCP-01). Module [M05](../modules/M05-mcp-server-and-access-tokens.md), screen 8.
2. Connect a client with OAuth, or create a personal access token with scopes, workspace restriction and expiry, within the clients and workspaces the tenant allows (MCP-20). An OAuth sign-in needs no copied token (MCP-03). A token is shown once, stored hashed and revocable (MCP-02). The tenant admin chooses the clients that may connect, the workspaces MCP may reach, the maximum token lifetime and the scopes each role may grant (MCP-20). Module [M05](../modules/M05-mcp-server-and-access-tokens.md), screens 8 and 4.
3. Add the endpoint and token to the LLM client; a test call names the cause of any failure (MCP-15). The failure categories are an invalid or expired token, a missing scope, a workspace restriction, a client the tenant policy does not allow, a rate limit, a protocol version mismatch and an unavailable service (MCP-15). Module [M05](../modules/M05-mcp-server-and-access-tokens.md), screen 8.
4. Ask questions or log updates in natural language; answers use the figures the platform computes. Every request runs as the token's user within the tenant (MCP-04). Read tools answer questions (MCP-05), append-only tools add journal entries and comments (MCP-06), and update tools change WBS items (MCP-07). Answers carry figures computed by the platform with the definitions of BRD section 12 (MCP-10, BR-32). The conversation happens in the LLM client, so no wireframe shows it; screen 8 lists the tools and what the client may do. Module [M05](../modules/M05-mcp-server-and-access-tokens.md), screen 8.
5. Decisions the LLM prepares wait for confirmation in the application; every call appears in the audit log. Approvals, decisions, baseline application, deletions and permission and token changes can only be prepared through MCP, never executed (MCP-08, BR-35). Each call is logged with the user, the token, the client, the tool and the result (MCP-11). Module [M05](../modules/M05-mcp-server-and-access-tokens.md), screens 38 and 6.

## What works today

Nothing yet.

## Modules and screens

| Step | Module page | Screen |
| --- | --- | --- |
| 1. Open My profile, AI access | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [8 My profile: AI access (MCP)](../../design/wireframes/wireframes-digest.md#08-my-profile-ai-access-mcp) |
| 2. Connect a client with OAuth or a personal access token | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [8 My profile: AI access (MCP)](../../design/wireframes/wireframes-digest.md#08-my-profile-ai-access-mcp); [4 Tenant admin: AI access (MCP)](../../design/wireframes/wireframes-digest.md#04-tenant-admin-ai-access-mcp) |
| 3. Add the endpoint and token to the LLM client | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [8 My profile: AI access (MCP)](../../design/wireframes/wireframes-digest.md#08-my-profile-ai-access-mcp) |
| 4. Ask questions or log updates in natural language | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [8 My profile: AI access (MCP)](../../design/wireframes/wireframes-digest.md#08-my-profile-ai-access-mcp) |
| 5. Decisions the LLM prepares wait for confirmation | [M05 Natural-Language Interface for LLMs: MCP Server and Access Tokens](../modules/M05-mcp-server-and-access-tokens.md) | [38 My approvals](../../design/wireframes/wireframes-digest.md#38-my-approvals); [6 Tenant admin: audit log](../../design/wireframes/wireframes-digest.md#06-tenant-admin-audit-log) |

## Sources

- The journey: the paragraph "Connect an LLM through MCP" of section 7.9 of the BRD, line 525 of `business/requirements/source/parts/01-front.md` ([BRD v4.5, 7.9 Key user journeys](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#79-key-user-journeys)).
- The persona of section 6 of the BRD, in `business/requirements/source/parts/01-front.md`: LLM-assisted user (line 374) ([BRD v4.5, 6 Stakeholders and Personas](../requirements/Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5.md#6-stakeholders--personas)).
- The requirements of M05 (lines 165 to 219), in `business/requirements/source/parts/02-modules-a-b.md`.
- The business rules BR-32 (line 226) and BR-35 (line 229), in `business/requirements/source/parts/03-modules-c-rules.md`.
- The screens: the title and phase of screens 4, 6, 8 and 38 are in `design/wireframes/manifest.json`, in the entries with those order numbers; what each screen shows is in the [wireframe digest](../../design/wireframes/wireframes-digest.md).
- The connection page, the failure table and the tool list: the [wireframe digest](../../design/wireframes/wireframes-digest.md#08-my-profile-ai-access-mcp), screen 8. The decision prepared through MCP and not decided: the [digest of screen 38](../../design/wireframes/wireframes-digest.md#38-my-approvals). The terms MCP, MCP client and MCP server: lines 31 to 33 of `business/requirements/source/parts/05-appendices.md`.
