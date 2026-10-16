---
title: Troubleshoot Keycloak
summary: Where symptoms of the Keycloak service will be recorded, with the three gaps and the risks the proposals name in advance and the guard planned for each.
component: keycloak
type: how-to
status: draft
ids: []
---

# Troubleshoot Keycloak

Planned, not built: no symptom recorded yet.

This page will hold one row per symptom seen on the sign-in service: what a person or a monitor sees, the cause that was measured, the fix, and where the measurement is kept. A row is added only after the symptom was seen and its cause measured. A fix that is a procedure (restore, roll back, rotate a key) links its runbook in [operations/runbooks](../../operations/runbooks/README.md). Keycloak is not built, so the table is empty.

| Symptom | Cause | Fix | Source |
|---|---|---|---|
| None recorded yet | | | |

## Gaps and risks named in advance

These are gaps and risks the proposals name before any code exists. They are not symptoms, and nobody has measured them on Metis. The claims about Keycloak's behaviour come from the proposals and are not verified here unless a source is given.

| Gap or risk | Planned guard | Source |
|---|---|---|
| **Magic link.** Keycloak has no ready-made magic link [Unverified - confirm before applying]. The extension of one vendor is under the Elastic License 2.0. Metis writes its own authenticator on the authentication SPI, which Keycloak documents as internal, so that any new release can change it without prior notice [Source: keycloak.org/docs/latest/server_development, Authentication SPI, read 12 Oct 2026]. The community build is supported only until the next minor version ships [Unverified - confirm before applying] | Pin the Keycloak version and run the tests of the authenticator on every new version before upgrading; consider the Red Hat build | backend proposals, line 222 of the original |
| **Domain verification.** Keycloak assigns organization members by email domain without proof that the tenant owns the domain, and an open bug, number 53815 of Keycloak and affecting 26.8.0, grants membership by domain without checking that the email is verified [Unverified - confirm before applying] | Metis checks a DNS record before the domain is added to the organization, and accepts only users with a verified email | backend proposals, line 223 of the original; system draft, line 266 of the original, carried over, confirm |
| **OAuth for MCP.** Client ID Metadata Documents and the `resource` parameter of RFC 8707 are still experimental in Keycloak 26.8, while the MCP specification makes clients send `resource` and servers check the audience [Unverified - confirm before applying] | The MCP gateway checks the audience itself, and the setup is tested with real LLM clients before go-live | backend proposals, line 224 of the original; system draft, line 267 of the original, carried over, confirm |
| **A hand-written authenticator** is an attack surface of Metis's own | The scope of the independent penetration test includes it | backend proposals, line 206 (first sentence) of the original |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 206 (first sentence), 222, 223 and 224 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 266 and 267 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.1, for the purpose of this page (line 137 of the original).
- Page read on 12 Oct 2026: keycloak.org/docs/latest/server_development.
