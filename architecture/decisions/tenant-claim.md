---
title: The tenant comes from one claim of the token, `tenant_id`
summary: The core takes the tenant of a request from tenant_id, a claim of its own that holds one Metis tenant id, and answers 401 to a token that does not name exactly one.
component: core
type: decision
status: current
ids: [TEN-02]
---

# The tenant comes from one claim of the token, `tenant_id`

## Context

The tenant of a request comes from the token and never from the body of the request ([One transactional write path for the app, MCP, workflows and agents](single-write-path.md)), but the documents left open which claim carries it ([Core interfaces](../../components/core/interfaces.md) listed the question). Keycloak's `organization` claim is a list of organization aliases by default, and an object that also carries the id and the attributes of each organization when its mapper is told to add them. [Source: keycloak.org/docs/latest/server_admin, read 14 Oct 2026, as section 9.1 of the design records it] The default shape was read in Keycloak's source and was not checked on a real token. [Unverified - confirm before applying] A claim of Metis's own keeps the core independent of how Keycloak models organizations. [Source: design, section 4.5, the row "Where the tenant comes from"]

## Decision

- The tenant of a request is the claim `tenant_id` of its token, which holds one Metis tenant id: one UUID, written in either case, or a list of exactly one UUID, which a multivalued mapper of Keycloak sends. The text must read back as the same UUID, since Java's parser also accepts short groups.
- A token without a subject, without the claim, with two tenants or with a value that is no such UUID cannot be trusted, and is answered 401 before any controller runs. A subject that the tenant does not know is answered 403.
- The tenant comes from the token alone, never from the body or the path of a request.
- The core receives the person of a token as `CurrentUser`, the subject and the tenant, as a parameter of the controller.
- The development realm of the local stack adds the claim with a user-attribute mapper set to multivalued, so that a person given two tenants reaches the core with both and is refused, and adds the audience `metis-core` with an audience mapper.

## Consequences

- The core depends on one claim and on no model of organizations; how Keycloak fills the claim in production belongs to the round that builds sign-in.
- The tenant that the database uses for a transaction is the tenant of this claim; see [Tenant isolation with PostgreSQL row-level security](tenant-isolation-rls.md).
- Tests prove each case: `TokensTest` (a tenant that is not one UUID written in full, a tenant in capitals, a list of one, a token without a tenant or with two, a token without a subject), `TokenTest` of the integration tests, and `KeycloakTest`, in which the token of `developer`, a list of one, opens the shell and the token of `two-tenants`, a list of two, is answered 401.

## Status

Current. Decided by the owner on 14 Oct 2026 (BK-03), who approved the backend skeleton design with the rows of its section 4. Plan two built it in `metis-backend`, which has no commit yet. It became current with plan four's last run, `./verify` green on the tree `bbfcdc216889` on 16 Oct 2026.

## Sources

- [Backend skeleton and the overview slice, design](../../history/specs/2026-10-14-backend-skeleton-design.md): [section 4.5](../../history/specs/2026-10-14-backend-skeleton-design.md#45-smaller-choices), the row "Where the tenant comes from"; sections 5.5 and 9.1; the [owner decisions](../../history/specs/2026-10-14-backend-skeleton-design.md#owner-decisions) BK-03.
- [Plan two, the backend platform and the first read](../../history/plans/2026-10-14-backend-platform-plan.md): Global Constraints (line 37), "Review round one" (lines 16230 and 16231) and "What the sandbox taught" (line 16331).
- Files of `metis-backend` read in the tree `7a5919cab5b4`: `core/src/main/java/dev/metis/core/platform/security/internal/Tokens.java` (lines 25 to 65), `core/src/main/java/dev/metis/core/platform/security/CurrentUser.java`, `core/src/main/java/dev/metis/core/workspace/internal/app/ShellReader.java` (line 36) and `stack/keycloak/metis.json` (its two mappers and two people).
- BRD row TEN-02, in `business/requirements/`.
- Page read on 14 Oct 2026, as the design cites it: keycloak.org/docs/latest/server_admin.
