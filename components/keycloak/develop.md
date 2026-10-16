---
title: Develop Keycloak
summary: The planned toolchain and checks for the Keycloak extensions of Metis, marked decided or proposed, with no command yet because nothing is built.
component: keycloak
type: how-to
status: draft
ids: []
---

# Develop Keycloak

Planned, not built: the toolchain and the checks of the Keycloak extensions. `metis-backend` has no build yet, so this page names no command. Each check below gets the command that runs it when the build exists.

## Toolchain

| Concern | Planned choice | Status |
|---|---|---|
| The server | Keycloak 26.x, run by Metis, with its version pinned | Proposed: [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) |
| The extensions | A magic-link authenticator, a login theme and the realm settings, in `metis-backend` | Where they live is decided: [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md). Keycloak and the authenticator are proposed: [Keycloak 26 for sign-in, with a magic-link authenticator](../../architecture/decisions/identity-keycloak.md) |
| The realm settings | Kept in code, so that the reference pages can show sign-in flows, clients and scopes without secrets | Named in the repositories design |
| The brand files | A copy kept in `metis-backend` for the login theme, emails and PDFs; a copy that differs from what `docs.lock` names fails the check | Named in the repositories design |
| Language, build and packaging of the extensions | Not stated in the sources. The proposals note that Keycloak belongs to the same Java ecosystem as the core | Open |

Sources: [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), sections 2.1, 3.2, 4.4 (lines 68, 161, 287 and 288 of the original); backend proposals, lines 80 and 222 of the original.

## Checks

None of these checks exists yet.

| Check | What it would prove | Source |
|---|---|---|
| Pin the Keycloak version | No upgrade happens without a decision | backend proposals, line 222 of the original |
| Run the tests of the authenticator on every new Keycloak version before upgrading | The authenticator still works. Keycloak documents its authentication SPI as internal and says that any new release can change it without prior notice [Source: keycloak.org/docs/latest/server_development, Authentication SPI, read 12 Oct 2026] | backend proposals, line 222 of the original |
| Test the OAuth setup for MCP with real LLM clients before go-live | The sign-in, the audience of the token and the clients work together | backend proposals, line 224 of the original |
| The penetration test | Its scope includes the hand-written authenticator | backend proposals, line 206 (first sentence) of the original |
| Brand copy check | A copy of the brand files that differs from `docs.lock` fails the code repository's check | the repositories design, section 4.4 (line 288 of the original) |

The proposals plan to upgrade Keycloak about every quarter, and the Red Hat build is considered as an option [Source: backend proposals, lines 215 and 222 of the original].

## Rules for code and documents

- Code, comments, test titles and tool output are English; this is the rule in the `AGENTS.md` of `metis-backend`.
- Read the decision records in [architecture/decisions](../../architecture/decisions/) before choosing a library or a pattern. A change of behaviour comes with its documentation change in `metis-docs`.
- The reference pages generated from the realm settings show sign-in flows, clients and scopes and never secrets [Source: repositories design, section 3.2, line 161 of the original].

## Open questions

- How the authenticator, the theme and the realm settings are built, tested and packaged into the Keycloak image.
- Which test tools run the tests of the authenticator.
- The details of the domain-verification flow by DNS record, and the component that runs it.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 80, 206 (first sentence), 215, 222 and 224 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 3.2 and 4.4 (lines 68, 161, 287 and 288 of the original).
- Page read on 12 Oct 2026: keycloak.org/docs/latest/server_development.
