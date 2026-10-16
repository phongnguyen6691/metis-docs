---
title: Each MCP request carries its own context
summary: A draft proposal that the MCP server keeps no session, so each request carries its own context and the token's audience is checked on every request.
component: mcp-gateway
type: decision
status: draft
ids: [MCP-01, MCP-04, TEN-02]
---

# Each MCP request carries its own context

## Context

The BRD gives every tenant one MCP endpoint over the Streamable HTTP transport, with OAuth or personal access tokens, scopes, audit and the user's permissions (MCP-01 to MCP-05). Its tenant isolation requirement TEN-02 says that every MCP session belongs to exactly one tenant, and its isolation matrix names, for "MCP sessions and tokens", this tenant boundary: a token is issued for one tenant's endpoint and its audience is checked on every call (MCP-04).

The pre-feasibility review (2 Oct 2026) found the MCP design of the BRD on the right track. It added that the MCP specification of 2026-07-28 moves the protocol core to stateless request and response, with routing headers and authorization hardening, and that a stateless architecture would suit the gateway and rate limiting better. The review lists that specification release among its outside sources.

The draft [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md) read the transport page of that specification on 12 Oct 2026 and reports that it has no connection-scoped session, every request carrying its protocol version and client capabilities in its body [Source: modelcontextprotocol.io/specification/2026-07-28/basic/transports, read on 12 Oct 2026 for that draft]. The routing headers and the authorization hardening are the review's words and are not re-checked here [Unverified - confirm before applying].

## Decision

This is a proposal of a reviewer, not a decision of the owner. If it is adopted:

- The MCP server keeps no session between requests. Each request carries its own context.
- The tenant boundary stays what the isolation matrix of the BRD already says: a token issued for one tenant's endpoint, with its audience checked on every request.

## Consequences

- The reviewer expects a stateless server to suit the gateway and rate limiting better. The sources give no measurement.
- If adopted, the "MCP session" wording of TEN-02 and of the isolation matrix would need to change. Until the owner decides, the BRD keeps its wording and this page is a draft.
- The negative test of the isolation matrix does not change: a tenant A token sent to the tenant B endpoint gets HTTP 401.
- Whether the MCP clients the BRD targets speak the 2026-07-28 revision is not established in the sources. MCP-01 already asks the server to declare the protocol version it supports.
- The related draft [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md) proposes a gateway that keeps no state.

## Status

Draft: proposed in the pre-feasibility review (2 Oct 2026), not decided by the owner.

## Sources

- [Pre-feasibility review of the BRD, round 1](../../history/reviews/metis-review-tien-kha-thi.md): the finding on the MCP server (line 248 of the original) and the specification release among the outside sources (line 992).
- [BRD part 02, modules A and B](../../business/requirements/source/parts/02-modules-a-b.md): TEN-02 (line 71), MCP-01 (line 181), MCP-04 (line 184) and the isolation matrix (line 99).
- [A thin, stateless MCP gateway in TypeScript](mcp-gateway-typescript.md): its report of the transport page of the MCP specification of 2026-07-28, read on 12 Oct 2026 for that draft and not read again here.
