---
title: A thin, stateless MCP gateway in TypeScript
summary: The MCP endpoint is served by a small stateless TypeScript service that checks the OAuth token and the tenant audience and never touches the database.
component: mcp-gateway
type: decision
status: draft
ids: [MCP-01, MCP-03, MCP-04, D-29]
---

# A thin, stateless MCP gateway in TypeScript

## Context

The BRD asks for one HTTPS endpoint per tenant using the Streamable HTTP transport (MCP-01), OAuth authorization that follows the MCP specification (MCP-03) and tokens issued for one tenant's endpoint, whose audience is checked on every call (MCP-04, in the isolation matrix of TEN-02). It offers OAuth and personal access tokens, both issued by the platform's authorization server (D-29). [Source: BRD requirements MCP-01, MCP-03 and MCP-04, and decision D-29]

The core is written in Java, and the MCP SDK for Java is at Tier 2, while the one for TypeScript is at Tier 1. A Tier 1 SDK commits to resolving critical bugs within 7 days. [Source: backend proposals, lines 48 and 87 of the original; modelcontextprotocol.io/docs/sdk and modelcontextprotocol.io/community/sdk-tiers, read 12 Oct 2026]

The MCP specification of 2026-07-28 has no connection-scoped session: every request carries its protocol version and client capabilities in its body. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/transports, read 12 Oct 2026; backend proposals, line 30 of the original]

The specification also requires a client to send the `resource` parameter in its authorization and token requests, and an MCP server to validate that a token was issued for it as the intended audience. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026] The proposals state that two features of Keycloak that serve this, Client ID Metadata Documents and resource indicators (RFC 8707), are still experimental in Keycloak 26.8; the Keycloak side is the draft [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md). [Unverified - confirm before applying] [Source: backend proposals, line 224 of the original]

## Decision

Proposed, not yet decided by the owner:

- A separate service, `mcp-gateway`, serves the MCP endpoint of each tenant. It is small and keeps no state. [Source: backend proposals, line 30 of the original]
- It is written in TypeScript on Node.js 24 LTS, with the version 2 packages of the TypeScript MCP SDK (`@modelcontextprotocol/server`). [Source: backend proposals, line 48 of the original; github.com/modelcontextprotocol/typescript-sdk, read 12 Oct 2026]
- It reads the command catalog from the core, checks the OAuth token and the audience of each tenant, and then calls the API of the core. It never touches the database. [Source: backend proposals, line 30 of the original]
- It checks the audience of the token itself, and it is tested with real LLM clients before going live. [Source: backend proposals, line 224 of the original]
- It is kept very small and its versions are pinned, because it brings the npm supply chain into a back end whose core is Java. [Source: backend proposals, line 225 of the original]

## Consequences

- The SDK of the gateway is at Tier 1, against Tier 2 for the one for Java. The alternative the proposals name is the MCP server of Spring AI. [Source: backend proposals, line 87 of the original]
- The SDK is at its version 2, which implements the 2026-07-28 specification. Version 1.x continues to receive bug fixes and security updates for at least six months after the release of version 2 on 2026-07-27. The SDK is licensed under Apache-2.0 for new contributions, with existing code under MIT. [Source: github.com/modelcontextprotocol/typescript-sdk, read 12 Oct 2026; backend proposals, line 48 of the original]
- Node.js 24 is supported until 30 Apr 2028, and Node.js 26 becomes an LTS release on 28 Oct 2026. [Source: github.com/nodejs/Release, schedule.json, read 12 Oct 2026; backend proposals, line 48 of the original]
- The back end has two languages. The proposals warn that provenance checks alone do not stop npm worms, which is why the gateway stays small. [Source: backend proposals, line 225 of the original]
- Effort: one more service to build, deploy and patch, and a test round with real LLM clients before the first customer connects. [Source: backend proposals, line 224 of the original]
- It rules out a gateway that keeps sessions or reads the database.
- The core that it calls is described in [The core in Java 25 LTS with Spring Boot 4; no C# or .NET](backend-language-java-spring-boot.md), and the tools it exposes come from [One catalog generates the API, the MCP tools, the workflow blocks and the permission tests](command-catalog.md).

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 30, 48, 87, 224 and 225 of the original.
- BRD requirements MCP-01, MCP-03, MCP-04 and TEN-02 and decision D-29, in `business/requirements/`.
- Pages read on 12 Oct 2026: modelcontextprotocol.io/docs/sdk, modelcontextprotocol.io/community/sdk-tiers, modelcontextprotocol.io/specification/2026-07-28/basic/transports, modelcontextprotocol.io/specification/2026-07-28/basic/authorization, github.com/modelcontextprotocol/typescript-sdk and github.com/nodejs/Release.
