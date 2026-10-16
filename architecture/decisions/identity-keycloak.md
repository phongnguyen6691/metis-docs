---
title: Keycloak 26 for sign-in, with a magic-link authenticator
summary: Keycloak 26.x run by Metis handles sign-in, per-tenant SSO, provisioning, MFA and the OAuth server for MCP, with a custom magic-link authenticator; adopted so far is Keycloak as the issuer of the tokens the core checks, in the local stack and in its tests.
component: keycloak
type: decision
status: draft
ids: [TEN-03, D-03, MCP-03, D-29]
---

# Keycloak 26 for sign-in, with a magic-link authenticator

## Context

The BRD asks for sign-in methods chosen per tenant: SSO (SAML 2.0 or OIDC) with verified domains and just-in-time provisioning, email and password with MFA, and magic links for invited external users, all through one identity layer (TEN-03, D-03). MCP clients that support it connect through the platform's own OAuth 2.1 authorization server (MCP-03, D-29). The proposals keep the login data in Metis's own database, in the same region. [Source: backend proposals, line 283 of the original]

The first code of the core checks tokens before it answers a read, so it needs an issuer of real tokens before sign-in itself is built; the backend skeleton design leaves the sign-in screens, the sessions of the web build, the tokens of the native builds, the magic-link authenticator, the login theme and the realm settings for production to the round that builds sign-in. [Source: design, section 2]

## Decision

Proposed in the backend proposals, not decided by the owner:

- Metis runs Keycloak 26.x and adds a magic-link authenticator that it writes itself. Metis also verifies a tenant's email domain by a DNS record. [Source: backend proposals, line 50 of the original]
- Keycloak handles sign-in, SSO per organization, just-in-time provisioning, MFA (TOTP, WebAuthn, passkey, recovery codes), SCIM and the OAuth server for MCP. [Source: backend proposals, lines 50 and 283 of the original]
- Keycloak is open-source software of the CNCF (Incubating). Because Metis runs it, it has no certification of its own and is covered by Metis's controls and by the penetration test. [Source: backend proposals, lines 50 and 283 of the original]
- Carried over from the superseded system draft, to be confirmed: each tenant is a Keycloak organization with its own identity provider; SSO is SAML 2.0 or OIDC per tenant; the user is created and attached to the tenant at the first sign-in; MFA can be made mandatory per tenant; the SCIM server that receives user sync is supported from 26.8. [Source: system draft, line 263 of the original]

Adopted by the owner on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design): Keycloak issues the tokens the core checks, in the local stack and in one test. As plan two built it in `metis-backend`:

- The local stack runs `quay.io/keycloak/keycloak:26.8.1`, pinned by digest, in development mode, and imports the realm `metis` of `stack/keycloak/metis.json`. The realm has one public client for development, `metis-dev`, which grants a token for a password; a mapper that copies the attribute `tenant_id` of a person into the claim `tenant_id`, multivalued; and a mapper that adds the audience `metis-core`. It has two people: `developer`, with one tenant, and `two-tenants`, whose token names two and is refused. Their password comes from the environment, never from a file.
- The core trusts the issuer `http://keycloak:8080/realms/metis` inside the stack, reads its keys from it at the first token, and refuses a token of any other issuer.
- The integration tests start the same image with the same realm as a generic container of Testcontainers. `KeycloakTest` proves that the token of `developer` opens the shell and that the token of `two-tenants` is answered 401; the image check reads the shell with a token that Keycloak issues inside the running stack.

The claim the core reads is decided in [The tenant comes from one claim of the token, `tenant_id`](tenant-claim.md).

## Consequences

Three gaps of Keycloak, and how each is closed in the proposal:

- Magic link. Keycloak has no ready-made magic link, and the extension of one vendor is under the Elastic License 2.0, which the system draft says needs legal review before use in a SaaS. Metis writes its own authenticator on an interface that Keycloak itself calls internal: "any new release of Keycloak can change it without prior notice". The community build is supported only until the next minor version ships. Cover: pin the Keycloak version and run the authenticator's tests on every new version before upgrading. [Source: backend proposals, line 222; system draft, line 265 of the original]
- Domain verification. Keycloak assigns organization members by email domain without proof that the tenant owns the domain, and an open bug (#53815, affecting 26.8.0) grants membership by domain without checking that the email is verified. Cover: Metis checks the DNS record before adding the domain to the organization and accepts only users with a verified email. [Source: backend proposals, line 223; system draft, line 266 of the original]
- OAuth for MCP. Client ID Metadata Documents and the RFC 8707 `resource` parameter are still experimental in Keycloak 26.8. [Unverified - confirm before applying] The MCP specification makes clients send `resource` and servers check the audience. Cover: the MCP gateway checks the audience itself, and the setup is tested with real LLM clients before going live. [Source: backend proposals, line 224; system draft, line 267 of the original]

Other consequences:

- The community build has no long-term support release: each minor version ends its support when the next one ships, about every three months. Eight of the 11 maintainers belong to IBM. [Source: backend proposals, line 50 of the original]
- The penetration test has to cover the hand-written authenticator, see [ISO 27001 first, SOC 2 Type II when customers ask](security-certification-path.md). [Source: backend proposals, line 206 of the original]
- The realm of the local stack is for development only: a public client with a password grant and people whose password the environment gives. Measured traps of the realm (a placeholder password, a person without an email or names, a health check without curl, the issuer of a token asked from the host) are in [Troubleshoot the core](../../components/core/troubleshoot.md#keycloak-and-the-local-stack).
- The Keycloak module of Testcontainers is not used: it brings Jackson 2 with a known vulnerability, which the dependency check refuses.
- Effort: writing and maintaining the authenticator, running its tests on every Keycloak release, the DNS domain-verification flow, and testing OAuth with real clients.

## Status

Draft. The owner adopted Keycloak as the issuer of the tokens the core checks, in the local stack and in one test, on 14 Oct 2026 (BK-03, section 3 of the backend skeleton design), and plan two built it in `metis-backend`, which has no commit yet. Everything else is still the proposal of 10 Oct 2026, not decided by the owner, and the parts taken from the superseded system draft are carried over and have to be confirmed. It stays a draft for the part the owner has not decided; the part adopted passed plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 50, 206 (first sentence), 222, 223, 224 and 283 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals: lines 263 to 267 of the original, carried over, confirm.
- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): sections 2, [3](../../history/specs/2026-10-14-backend-skeleton-design.md#3-drafts-this-spec-turns-into-decisions), 5.5 and 9.1, and the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Task 7, "Review round one" (lines 16231 and 16253) and "What the sandbox taught" (lines 16306, 16309, 16310 and 16331).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `stack/compose.yaml` (lines 23 to 39 and 53), `stack/keycloak/metis.json` and `core/src/integrationTest/java/dev/metis/core/KeycloakTest.java` (lines 115 to 166).
- BRD rows TEN-03, D-03, MCP-03 and D-29, in `business/requirements/`.
