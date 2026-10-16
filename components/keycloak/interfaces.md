---
title: Keycloak interfaces
summary: What the planned Keycloak service exposes to the app, the tenants and MCP clients, what it calls, and the open points of each interface.
component: keycloak
type: reference
status: draft
ids: []
---

# Keycloak interfaces

Planned, not built: the interfaces of the Keycloak service. None exists yet.

## What it exposes

| Interface | Consumer | What it is | Source |
|---|---|---|---|
| Sign-in for the web build | The browser, through the `api` of the [core](../core/README.md) | The web build uses a session cookie held by `api`, so the browser never holds a token | system draft, line 269 of the original, carried over, confirm |
| Sign-in for the iOS and Android builds | The app | OAuth 2.1 with PKCE through the system browser; the token is kept in the key store of the device | system draft, line 269 of the original, carried over, confirm |
| Per-tenant SSO | The identity provider of a tenant | SAML 2.0 or OIDC; each tenant is an organization of Keycloak with its own identity provider; the user is created and attached to the tenant at the first sign-in | backend proposals, line 283 of the original; system draft, line 263 of the original, carried over, confirm |
| Magic links | Guests from outside the tenant | Sign-in by a link sent to the guest's email address, issued by the authenticator that Metis writes | backend proposals, lines 222 and 283 of the original; system draft, line 265 of the original, carried over, confirm |
| The authorization server for MCP | MCP clients and the [MCP gateway](../mcp-gateway/README.md) | OAuth 2.1 with consent; it issues the tokens whose audience the gateway checks | backend proposals, lines 30 and 283 of the original |
| SCIM | A tenant's directory | Later. The SCIM API is supported in Keycloak 26.8.0 | pitch diagram data, line 477 of the original; keycloak.org/docs/latest/release_notes, Keycloak 26.8.0, read 12 Oct 2026 |
| The token | The core and the gateway | The core takes the tenant from the token and never from the body of a request; the claim that carries it is not named in the sources | backend proposals, line 28 of the original; system draft, line 107 of the original, carried over, confirm |

## What it calls

| Target | What for | Source |
|---|---|---|
| Its own PostgreSQL database | The sign-in data of Metis, in the same region | backend proposals, lines 256 (column 1 only) and 283 of the original |
| The identity providers of the tenants | Per-tenant SSO | backend proposals, line 283 of the original |
| DNS | Metis checks a DNS record that proves a tenant owns an email domain, before the domain is added to the tenant's organization | backend proposals, line 223 of the original |

## Open questions

- Client registration for MCP. The specification of 2026-07-28 says that authorization servers and MCP clients should support Client ID Metadata Documents and that dynamic client registration is deprecated and kept for backwards compatibility [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026]. The release notes of Keycloak list the Client ID Metadata Document as experimental in 26.6.0 [Source: keycloak.org/docs/latest/release_notes, Keycloak 26.6.0, read 12 Oct 2026], and the proposals say that it and the `resource` parameter of RFC 8707 are still experimental in 26.8 [Source: backend proposals, line 224 of the original] [Unverified - confirm before applying]. The superseded draft planned to launch with dynamic client registration and one client scope per tenant, and to turn the two features on when Keycloak supports them [Source: system draft, line 249 of the original, carried over, confirm]. Which registration the launch uses is open.
- The name of the token claim that carries the tenant, and the claims for the user and the roles.
- The sender of the magic-link email.
- The address scheme of the sign-in endpoints; the superseded draft used one host name per region for Keycloak [Source: system draft, line 194 of the original, carried over, confirm].

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 28, 30, 222, 223, 224, 256 (column 1 only) and 283 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 107, 194, 249, 263, 265 and 269 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: line 477 of the original.
- Pages read on 12 Oct 2026: modelcontextprotocol.io/specification/2026-07-28/basic/authorization and keycloak.org/docs/latest/release_notes.
