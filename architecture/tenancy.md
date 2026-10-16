---
title: How tenants stay apart
summary: How the planned backend keeps tenants apart, covering limits, database isolation, identity, MCP endpoints, files, regions, restore and support access.
component: all
type: overview
status: draft
ids: []
---

# How tenants stay apart

Planned, not built: no backend runs yet, so no tenant is kept apart by anything on this page. The app only displays what a server returns. This page describes how the owner's backend proposals plan to keep tenants apart, and marks what the owner has decided.

Sources and statuses are written as on [Architecture overview](overview.md). `[Source: ..., line N of the original]` names a line of a file in the owner's private store. "Decided" means a current decision record, and "proposed" means a draft one. "Carried over, confirm" marks a line of the system draft, which the backend proposals superseded and which was written for another stack. A platform statement cites the page and the date it was read, or carries `[Unverified - confirm before applying]`.

## Tenants and limits

- A tenant is one customer company. The product is multi-tenant: one deployment of the backend serves many tenants. [Source: backend proposals, line 14 of the original]
- Size to serve: at least 5,000 users in phase one, and ten times that without changing the architecture. The 5,000 are read as the total of about 3 to 10 tenants. That reading is the proposal writer's assumption, which the owner left uncorrected on 10 Oct 2026. [Source: backend proposals, line 14 of the original; backend brainstorm log, lines 49 and 51 of the original]
- Limits for one tenant: up to 5,000 projects, 2,000 items in each project and 2,000 users, designed for ten times the volume measured in the pilot. These are the proposed starting values of BRD section 17.1, which D-26 confirms or adjusts. [Source: backend brainstorm log, line 27 of the original]
- A plan enables modules and sets limits (seats, workspaces, storage and monthly MCP calls), and the tenant admin sees the use against them (TEN-05). Fair-use quotas and rate limits protect the other tenants (TEN-10).
- The BRD's isolation model (D-28) is shared infrastructure with strict logical isolation for all plans in the MVP, and a dedicated database or region as an enterprise option later. The plan below follows it. A large tenant may later get a database of its own in the same region. [Source: system draft, line 201 of the original, carried over, confirm]

## Database isolation

Proposed: [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) (draft).

- Tenants share one schema, and every row carries `tenant_id`. PostgreSQL row-level security (RLS) filters the rows by tenant inside the database, so a filter forgotten in application code cannot return another tenant's rows. [Source: backend proposals, lines 29 and 45 of the original; system draft, line 201 of the original, carried over, confirm] The BRD asks for exactly this: a tenant id on every row, enforced by a row-level policy in the database and not only in application queries (TEN-02).
- The application connects with its own database role, which has no right to bypass the policies. Flyway runs the migrations under another role. [Source: backend proposals, line 29 of the original] Superusers and roles with the `BYPASSRLS` attribute always bypass row security. Table owners normally bypass it as well, though an owner can be made subject to it with `ALTER TABLE ... FORCE ROW LEVEL SECURITY`. [Source: postgresql.org/docs/current/ddl-rowsecurity.html, read 12 Oct 2026] The protection would disappear silently if the application connected as a superuser, as an owner without `FORCE`, or with a `BYPASSRLS` role.
- The tenant is set at the start of every transaction with `set_config('app.tenant_id', ..., true)`. The variable lives only in that transaction. [Source: backend proposals, line 28 of the original] With `is_local` true, the new value applies only during the current transaction. [Source: postgresql.org/docs/current/functions-admin.html, read 12 Oct 2026]
- The tenant comes from the token and never from the body of the request. [Source: backend proposals, line 28 of the original; system draft, line 107 of the original, carried over, confirm]
- The policies are enabled with `FORCE`, so even the table owner is subject to them. A record that does not exist and a record of another tenant go through the same code path, so they look the same, response time included (ONB-23). [Source: system draft, line 201 of the original, carried over, confirm]
- The BRD sets ten data paths for the isolation matrix, and it requires the database itself to enforce the policy. [Source: backend brainstorm log, line 32 of the original] The paths are listed under Proving isolation.

## Identity per tenant

Proposed: [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) (draft).

- Sign-in is Keycloak 26.x, with a magic-link authenticator that Metis writes itself. Metis also verifies a tenant's email domain by a DNS record. [Source: backend proposals, line 50 of the original]
- Each tenant is a Keycloak Organization with an identity provider of its own. SSO is SAML 2.0 or OIDC for each tenant. The user is created and attached to the tenant at the first sign-in. Password sign-in comes with MFA (TOTP, WebAuthn, passkey and recovery codes), which can be made mandatory for a tenant. [Source: backend proposals, line 50 of the original; system draft, line 263 of the original, carried over, confirm] Keycloak lists Organizations as supported from 26.0.0. [Source: keycloak.org/docs/latest/release_notes/index.html, read 12 Oct 2026]
- Magic links for outside guests need a self-written authenticator, because Keycloak has no ready-made one. [Unverified - confirm before applying] [Source: backend proposals, line 222 of the original]
- Domain verification: Keycloak assigns organization members by email domain without proof that the tenant owns the domain, and an open bug (#53815, affecting 26.8.0) grants membership by domain without checking that the email is verified. [Unverified - confirm before applying] Metis therefore checks a DNS record before it adds a domain to a tenant, and accepts only users with a verified email. [Source: backend proposals, line 223 of the original; system draft, line 266 of the original, carried over, confirm]
- The sign-in data stays in the backend's own database, in the same region. [Source: backend proposals, line 283 of the original, column 3]
- SCIM provisioning comes later (TEN-11, priority P1). Keycloak lists its SCIM API as supported from 26.8.0. [Source: keycloak.org/docs/latest/release_notes/index.html, read 12 Oct 2026]
- The BRD requires one identity layer, so that adding or removing a sign-in method changes nothing else (D-03).

## MCP per tenant

Proposed: [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) (draft).

- Each tenant has one HTTPS endpoint for MCP, on the Streamable HTTP transport (MCP-01). [Source: backend proposals, lines 16 and 30 of the original; system draft, line 248 of the original, carried over, confirm]
- Each endpoint has an address of its own. The system draft used a host name for each tenant as an example, and the product's domain name is not chosen. [Source: system draft, lines 194 and 324 of the original, carried over, confirm]
- The gateway is a small service without state. It reads the command catalog from the core, checks the OAuth token and the audience of each tenant, and then calls the core API. It never touches the database. [Source: backend proposals, line 30 of the original]
- A token is issued for one tenant's endpoint, and its audience is checked on every call. The BRD's negative test is that a token of tenant A sent to the endpoint of tenant B gets HTTP 401 (TEN-02, MCP-04).
- The MCP specification requires a server to validate that an access token was issued specifically for it as the intended audience, and a client to send the `resource` parameter of RFC 8707 in its authorization and token requests. [Source: modelcontextprotocol.io/specification/2026-07-28/basic/authorization, read 12 Oct 2026]
- The permission of a call is the intersection of the roles of the user and the scopes of the token (MCP-04). The tenant admin keeps a list of the MCP clients that may connect (MCP-20). [Source: system draft, line 250 of the original, carried over, confirm] The authorization flow itself, with its open points, is on [Security architecture](security.md).
- Revision 2026-07-28 of the MCP specification removes protocol-level sessions and the `Mcp-Session-Id` header. [Source: modelcontextprotocol.io/specification/2026-07-28/changelog, read 12 Oct 2026] The BRD still speaks of an "MCP session" in TEN-02 and in its isolation matrix. A reviewer proposes that the server keep no session and that the BRD wording change to match. The owner has not decided: [Each MCP request carries its own context](decisions/mcp-stateless-requests.md) (draft).

## Noisy neighbours

One tenant's load must not push the other tenants outside the agreed service level (TEN-10, D-26).

- Valkey counts the calls for the rate limits, by token and by tenant. The default is 60 MCP commands a minute for each token (MCP-12). [Source: backend proposals, line 33 of the original; system draft, line 213 of the original, carried over, confirm]
- Heavy work, MCP, workflows and agents run in processes of their own, so they do not slow the people who are editing. In particular, one tenant's MCP load must not slow the app (TEN-10). [Source: backend brainstorm log, lines 128 and 135 of the original; system draft, line 121 of the original, carried over, confirm]
- The cache keys always carry the tenant. [Source: system draft, line 213 of the original, carried over, confirm]
- A cap on the number of workflows that one tenant runs at the same time. [Source: system draft, line 241 of the original, carried over, confirm]
- Proposed: [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) (draft).
- Open: the sources set no quota for exports and report generation, which TEN-10 also names, and no plan-based MCP limit beyond the default.

## Files

- Uploads go straight to the file store through presigned URLs. Each tenant's files are kept under a prefix of that tenant (the system draft uses `tenants/<tenantId>/`). A download link is signed for one tenant and one file and lives 15 minutes. The default size limit is 250 MB for a file, set for each workspace. [Source: backend proposals, lines 34 and 287 of the original; system draft, line 219 of the original, carried over, confirm]
- ClamAV scans every new file before it can be downloaded. [Source: backend proposals, line 34 of the original]
- The BRD's negative test: a link of tenant B and a guessed path both fail for a user of tenant A (TEN-02, PLT-07).
- Proposed: [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) (draft).

## Home region and tenant directory

Decided: [One region first, more regions per customer later](decisions/global-ready-release.md) (current), except where the first region is placed. The log reads the owner's answer as a region in Singapore, but the owner asked for both backend proposals to be drawn, a Singapore proposal and a Vietnam proposal, and withdrew the question of choosing between them (BE-08). [Source: backend brainstorm log, lines 73, 188, 220 and 222 of the original]

- Each region is a full, independent deployment, with a database, files, cache and workers of its own. Each tenant is tied to a home region when it is created (TEN-01 records the region at that moment). [Source: backend brainstorm log, line 77 of the original]
- A thin global layer holds only the directory from tenant to region, the domain names, the CDN and the sign-in entry point. [Source: backend brainstorm log, line 77 of the original]
- Adding a region, for a customer in another part of the world, is one more deployment and changes no architecture. The per-tenant data location that the BRD plans for a later release (TEN-13, priority P1) becomes the choice of the home region when the tenant is created. [Source: backend brainstorm log, line 78 of the original]
- The directory maps a tenant and its verified email domains to its home region. The app sends the domain part of the email address, not the whole address, so that the directory can say which region and which sign-in method apply. The draft assumed that the directory starts in Singapore, which depends on where the first region is placed. [Source: system draft, line 193 of the original, carried over, confirm]
- Open: where the directory is stored, and how a tenant moves to another region, are not described in the sources.

## Restoring one tenant

- The BRD requires that one tenant can be restored without touching the others. [Source: backend brainstorm log, line 28 of the original]
- Carried over, confirm: restore the database to a point in time on a temporary machine, export the data of that tenant with the tenant export tool, and load it back. The restore is rehearsed every quarter. [Source: system draft, line 207 of the original] The BRD asks for the export tool as a requirement: a full export restores into a new tenant with the same projects, files and history (TEN-07).
- The BRD's negative test: restore tenant A from backup and tenant B's data stays unchanged (TEN-02).
- The recovery targets and the backups are on [Data architecture](data.md).

## Support access

- Support access is break-glass only (TEN-09). The provider's staff have no standing access to tenant data. A tenant admin approves named staff, a scope and an expiry, and can revoke the grant at once. Every action is audited with the subject type "support". Outside this path, the provider's operators see no business data of a tenant. [Source: system draft, line 271 of the original, carried over, confirm]

## Proving isolation

- Cross-tenant tests run in continuous integration, and the application's database role cannot bypass row-level security. [Source: backend proposals, line 226 of the original]
- A negative test for each data path runs on every release and fails the release on any leak (TEN-02). [Source: system draft, lines 201 and 291 of the original, carried over, confirm]
- An independent penetration test precedes go-live. Its scope must include the cross-tenant check through row-level security. [Source: backend proposals, line 206 of the original, first sentence]

The BRD names ten data paths. The table sets the boundary the BRD names against what the plan says for each. The BRD's matrix is itself a draft, and the architecture decision confirms its mechanisms.

| Data path | Boundary the BRD names | What the plan says | Source |
|---|---|---|---|
| Database | A tenant id on every row, enforced by a row-level policy in the database | Row-level security on a shared schema, an application role that cannot bypass it, the tenant set for each transaction. Proposed | Backend proposals, lines 28, 29 and 45 of the original |
| File storage | A storage prefix for each tenant; download links signed for one tenant, one file and a short time | A prefix for each tenant, and signed links that live 15 minutes. Carried over, confirm | Backend proposals, line 287, and system draft, line 219 of the original |
| Search index | A tenant filter applied by the search service on every query | PostgreSQL full-text and fuzzy search on names and codes, with row-level security applying; a separate search engine only if PostgreSQL is not enough. Carried over, confirm | System draft, line 205 of the original |
| Caches | A tenant id in every cache key | The keys always carry the tenant. Carried over, confirm | System draft, line 213 of the original |
| Queues and background jobs | A tenant id in every job envelope; workers set the tenant context before work | Drag-and-drop workflow steps run commands under a service identity of the tenant, so the write path applies (carried over, confirm). Open: a job envelope that carries the tenant is not described for the other background jobs | System draft, line 238 of the original |
| Audit log | Partitioned by tenant; tenant admins and exports see only their partition | An append-only table partitioned by month, with a hash chain for each tenant (carried over, confirm). Open: the BRD says partitioned by tenant, and how an export is limited to one tenant is not described | System draft, line 204 of the original |
| Backups and restore | One tenant restored without touching the others | Restore to a point in time on a temporary machine, export the tenant, load it back, rehearse every quarter. Carried over, confirm | System draft, line 207 of the original |
| Application logs | A tenant id on each entry, and no record content | Logs carry no record content (proposed), and each entry carries the tenant id and the request id (carried over, confirm) | Backend proposals, line 291 (column 3), and system draft, line 284 of the original |
| Support tools | Access only through a break-glass grant (TEN-09) | A grant approved by the tenant admin for named staff, a scope and an expiry. Carried over, confirm | System draft, line 271 of the original |
| MCP sessions and tokens | A token issued for one tenant's endpoint, with its audience checked on every call (MCP-04) | The gateway checks the token and the audience of each tenant. Proposed | Backend proposals, lines 30 and 224 of the original |

## Open questions

1. How the background jobs and the Temporal workflows carry the tenant, apart from the workflows of the tenant's own automations (queues row of the table).
2. How an audit export is limited to one tenant when the table is partitioned by month (audit row of the table).
3. Where the tenant directory is stored, and how a tenant moves to another region.
4. The quotas for exports and report generation, and the plan-based MCP limits.
5. Whether the BRD's wording "MCP session" changes, because revision 2026-07-28 of the specification has no sessions: [Each MCP request carries its own context](decisions/mcp-stateless-requests.md) (draft).
6. When a large tenant gets a database of its own (D-28), and how.

## Decisions behind this page

| Decision | Status |
|---|---|
| [One region first, more regions per customer later](decisions/global-ready-release.md) | Current |
| [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) | Current |
| [Keycloak 26 for sign-in, with a magic-link authenticator](decisions/identity-keycloak.md) | Draft |
| [A thin, stateless MCP gateway in TypeScript](decisions/mcp-gateway-typescript.md) | Draft |
| [Each MCP request carries its own context](decisions/mcp-stateless-requests.md) | Draft |
| [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) | Draft |
| [Uploads scanned before use; PDFs rendered in a sandbox](decisions/files-and-sandbox.md) | Draft |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 14, 16, 28 to 30, 33, 34, 45, 50, 206 (first sentence only), 222 to 224, 226, 283 (column 3) and 287 and 291 (columns 1 to 3) of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 27, 28, 32, 49, 51, 73, 77, 78, 128, 135, 188, 220 and 222 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 107, 121, 193, 194, 201, 204, 205, 207, 213, 219, 238, 241, 248, 250, 263, 266, 271, 284, 291 and 324 of the original, carried over, confirm.
- BRD rows TEN-01, TEN-02, TEN-05, TEN-07, TEN-09, TEN-10, TEN-11, TEN-13, MCP-01, MCP-04, MCP-12, MCP-20, PLT-07, ONB-23, D-03, D-26 and D-28, and the tenant isolation matrix under TEN-02, in `business/requirements/`.
- Pages read on 12 Oct 2026: postgresql.org/docs/current/ddl-rowsecurity.html, postgresql.org/docs/current/functions-admin.html, keycloak.org/docs/latest/release_notes/index.html, modelcontextprotocol.io/specification/2026-07-28/basic/authorization and modelcontextprotocol.io/specification/2026-07-28/changelog.
