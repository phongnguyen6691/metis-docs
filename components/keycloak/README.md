---
title: Keycloak
summary: The planned sign-in service of Metis, Keycloak 26 run by Metis with a magic-link authenticator, a login theme and realm settings kept in code.
component: keycloak
type: overview
status: draft
ids: []
---

# Keycloak

Planned, not built: the sign-in service of Metis, Keycloak 26 run by Metis itself, with three pieces of Metis code on top of it, a magic-link authenticator, a login theme and the realm settings. `metis-backend` holds no code yet, so nothing on this page can be run, called or tested today.

## What it does

Everything in this section is the plan; the table under Decided and proposed gives the status of each choice. Keycloak is meant to be the one identity layer behind every way of signing in, as the BRD asks (TEN-03 and D-03).

- **Per-tenant SSO** with SAML 2.0 or OIDC, and the user created and attached to the tenant at the first sign-in [Source: backend proposals, line 283 of the original; system draft, line 263 of the original, carried over, confirm].
- **Passwords with MFA**: TOTP, WebAuthn, passkeys and recovery codes, which can be made mandatory for a tenant [Source: system draft, line 263 of the original, carried over, confirm].
- **Magic links for guests** from outside the tenant [Source: backend proposals, line 283 of the original]. The proposals say that Keycloak has no ready-made magic link, so Metis writes its own authenticator [Source: backend proposals, line 222 of the original] [Unverified - confirm before applying]. The risks of that choice are in [Troubleshoot Keycloak](troubleshoot.md).
- **The OAuth 2.1 authorization server for MCP**, for the [MCP gateway](../mcp-gateway/README.md) and the clients that connect to it [Source: backend proposals, line 283 of the original].
- **SCIM later**: the BRD puts it in V2 [Source: backend brainstorm log, line 31 of the original; pitch diagram data, lines 476 to 479 of the original]. The release notes of Keycloak list the SCIM API as supported in 26.8.0 [Source: keycloak.org/docs/latest/release_notes, Keycloak 26.8.0, read 12 Oct 2026].

Keycloak keeps the sign-in data in Metis's own database, in the same region [Source: backend proposals, line 283 of the original]. In the single-provider layout as drawn, one PostgreSQL server with a standby holds the databases of the core, Keycloak and Temporal [Source: backend proposals, line 256 of the original, column 1 only].

Keycloak is open-source software of the CNCF; because Metis runs it, it has no certification of its own and is covered by Metis's own controls and by the penetration test, whose scope includes the hand-written authenticator [Source: backend proposals, lines 206 (first sentence) and 283 of the original].

## What this folder owns

The `metis-backend` repository holds, for Keycloak, a magic-link authenticator, a login theme and the realm settings [Source: repositories design, section 2.1, line 68 of the original]. The realm settings are kept in code, and the reference pages will show sign-in flows, clients and scopes, never secrets [Source: repositories design, section 3.2, line 161 of the original]. Later, `metis-backend` keeps a copy of the brand files for the login theme, emails and PDFs [Source: repositories design, section 4.4, line 287 of the original].

## Decided and proposed

| Record | Status |
|---|---|
| [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md) | Decided: the Keycloak extensions live in `metis-backend` |
| [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) | Proposed |
| [A thin, stateless MCP gateway in TypeScript](../../architecture/decisions/mcp-gateway-typescript.md) | Proposed: the gateway checks the audience of the tokens Keycloak issues |
| [ISO 27001 first, SOC 2 Type II when customers ask](../../architecture/decisions/security-certification-path.md) | Proposed: the penetration test covers the authenticator |
| [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) | Proposed: where Keycloak runs |

## What it depends on

| Dependency | What Keycloak uses it for |
|---|---|
| PostgreSQL | Its own database |
| The identity providers of the tenants | Per-tenant SSO |
| DNS records of the tenants | Metis verifies a tenant's email domain by a DNS record before the domain is added to the tenant's organization in Keycloak |
| The Cloudflare edge | Sits in front of the sign-in endpoints, as drawn [Source: pitch diagram data, lines 119, 120 and 164 of the original] |

## Team and repository

- **Team:** the backend team [Source: repositories design, section 2.1, line 68 of the original].
- **Code repository:** `metis-backend`, which holds no code yet.

## Read next

- [Develop Keycloak](develop.md), [Keycloak interfaces](interfaces.md) and [Troubleshoot Keycloak](troubleshoot.md).
- The architecture pages [security](../../architecture/security.md) and [tenancy](../../architecture/tenancy.md).

## Open questions

- How many instances of Keycloak run: the record on production hosting notes that two instances need an internal-network link for their cache, which has not been verified on the managed container platform [Unverified - confirm before applying] (see [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md)).
- Which component runs the DNS check of a tenant's email domain: the sources say that Metis does it and name no component [Source: backend proposals, line 223 of the original].
- How the magic-link email is sent: the sources name no sender.
- Whether to use the Red Hat build of Keycloak, which the proposals say is worth considering [Source: backend proposals, line 222 of the original].
- Whether to use the ready-made magic-link extension of one vendor instead of writing the authenticator: it is under the Elastic License 2.0, and the superseded system draft says it needs legal review before use in a SaaS [Source: backend proposals, line 222 of the original; system draft, line 265 of the original, carried over, confirm].

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 206 (first sentence), 222, 223, 256 (column 1 only) and 283 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 31 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 263 and 265 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: lines 119, 120, 164 and 476 to 479 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 3.2 and 4.4 (lines 68, 161 and 287 of the original).
- BRD rows TEN-03 and D-03, in `business/requirements/`.
- Page read on 12 Oct 2026: keycloak.org/docs/latest/release_notes.
