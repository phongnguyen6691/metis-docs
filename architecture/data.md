---
title: Data architecture
summary: What the planned backend stores where, how records are shaped, and how data is backed up, restored, retained and located.
component: all
type: overview
status: draft
ids: []
---

# Data architecture

Planned, not built: no database, file store, cache or backup exists yet. Only the app is built, and its data comes from a mock server. This page describes what the owner's backend proposals plan to store and where, and marks what the owner has decided.

Sources and statuses are written as on [Architecture overview](overview.md). `[Source: ..., line N of the original]` names a line of a file in the owner's private store. "Decided" means a current decision record, and "proposed" means a draft one. "Carried over, confirm" marks a line of the system draft, which the backend proposals superseded and which was written for another stack. A platform statement cites the page and the date it was read, or carries `[Unverified - confirm before applying]`.

## What is stored where

| Store | What it holds | Notes | Source |
|---|---|---|---|
| PostgreSQL 18 with row-level security, with a standby | The business data of all tenants, in a shared schema; point-in-time restore | One managed PostgreSQL with a standby. Its line lists the database of the core, the database of Keycloak and the database of Temporal, and the Temporal one depends on the open choice of where Temporal runs | Component diagram data, lines 140 to 142 and 485 to 488, and backend proposals, lines 256 (column 1) and 285 (columns 1 to 3) of the original |
| Keycloak's database | The sign-in data | It stays in the backend's own database, in the same region | Backend proposals, lines 256 (column 1) and 283 (column 3) of the original |
| Temporal's store | The history of workflows | If Temporal Cloud is used, it stores the history, so Metis encrypts payloads before sending them | Backend proposals, line 127 of the original |
| Valkey | The cache, the pushes to screens and the counters of the rate limits | It holds no business data, so it needs no backup | Component diagram data, lines 143 and 144, and backend proposals, lines 33 and 286 of the original |
| Object storage (S3-style; Spaces as drawn) | The files that customers upload, kept for each tenant, with download links valid for 15 minutes | Presigned URLs for upload; ClamAV scans before download | Component diagram data, lines 145 and 146, and backend proposals, lines 34 and 287 of the original |
| Container registry | The images the containers run | As drawn: the DigitalOcean Container Registry | Component diagram data, lines 253 to 255 of the original |
| The audit log | Every audit entry | An append-only table in PostgreSQL, with a daily export to object storage (see Audit storage) | System draft, line 204 of the original, carried over, confirm |
| PDF snapshots | A PDF states its data as-of time, metric version and generator, and the file is kept so the same document can be downloaded again (PLT-16) | The system draft stores it unchanged in the object store, with a hash | System draft, line 280 of the original, carried over, confirm |
| Grafana Cloud | Logs, metrics and traces | Logs carry no record content | Backend proposals, line 291 of the original, column 3 |
| Amazon SES | The notification emails | Singapore region, as drawn | Backend proposals, lines 59 (column 1) and 290 of the original, columns 1 to 3 |
| The LLM provider | The content sent for AI processing, when a tenant switches it on | Processed outside Metis; see Data location | Backend proposals, line 289 of the original |
| HostHatch | Synthetic data only, and a second encrypted backup copy | It never holds real customer data | Backend brainstorm log, line 184, and backend proposals, line 218 of the original |

Proposed: [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) (draft) for the layout, and [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) (draft) for how tenants share the database.

## Record conventions

- The write path looks up an idempotency key and checks the version of each field. [Source: backend proposals, line 28 of the original] Each record keeps a `version` and a version for each field, so a conflict arises only when the same field is changed (PLT-06). [Source: system draft, line 144 of the original, carried over, confirm] The envelope of a write is on [The API contract](contract.md).
- Every row carries `tenant_id`. [Source: backend proposals, line 45 of the original]
- Keys are UUID version 7, made by the `uuidv7()` function that PostgreSQL 18 has built in. Each record also keeps who created and who last changed it, and when. [Source: system draft, line 202 of the original, carried over, confirm] `uuidv7()` generates a version 7 (time-ordered) UUID, and it appears only in the PostgreSQL 18 documentation. [Source: postgresql.org/docs/18/functions-uuid.html, read 12 Oct 2026]
- The work breakdown is a tree of parents and children, kept with an order and a path. A dependency table holds the four types (finish-to-start, start-to-start, finish-to-finish and start-to-finish) with a lag. The display code is renumbered when an item moves, and the internal key is permanent (D-05). A project holds at most 2,000 items, so the whole tree is read in one query. [Source: system draft, line 203 of the original, carried over, confirm]
- Times travel as UTC instants, and the time zone of the workspace travels with a project page. That is how the app's contract is written today; see [The API contract](contract.md).

## Audit storage

Carried over, confirm. [Source: system draft, line 204 of the original]

- The audit log is an append-only table, partitioned by month, with a hash chain for each tenant that exposes any edit.
- A daily export goes to object storage in a write-once mode: during the retention period nobody can delete or overwrite the export, the account owner included.
- The subject of an entry is a person, the AI through MCP, support staff, an automation or the system.
- The earlier draft used the write-once mode of one cloud's object store. Whether the object store of the chosen provider has an equivalent is not checked. [Unverified - confirm before applying]
- The BRD requires that audit entries cannot be edited or deleted and can be exported by authorized roles (PLT-11). The security side is on [Security architecture](security.md).

## Search

- The first release searches inside PostgreSQL: full-text and approximate search on names and codes, with row-level security applying. A separate search engine is added only if PostgreSQL is not enough. [Source: system draft, line 205 of the original, carried over, confirm]
- For AI features later, the draft names the pgvector extension. Whether the managed PostgreSQL of the chosen provider offers it is not checked. [Unverified - confirm before applying] [Source: system draft, line 206 of the original, carried over, confirm]
- The BRD asks for search of projects and items within the user's authorized scope (PLT-12), and for full-text search as a later priority (PLT-13).

## Recovery targets and backups

The targets are the proposed starting values of BRD section 17.1, which D-26 confirms or adjusts. [Source: backend brainstorm log, line 28 of the original; backend proposals, line 18 of the original]

| Target | Value |
|---|---|
| Recovery point | At most 15 minutes of data lost |
| Recovery time | Back in 4 hours |
| Availability | 99.9% a month |
| One tenant | Restored without affecting the others |

- PostgreSQL is a managed cluster with a standby, and it restores to a point in time. [Source: component diagram data, lines 485 to 491 of the original]
- DigitalOcean's page on restoring backups says backups run automatically once a day, are retained for seven days, and that the restore dialog offers the latest transaction available or a point in time. It states no maximum data-loss figure. [Source: docs.digitalocean.com/products/databases/postgresql/how-to/restore-from-backups/, read 12 Oct 2026] The proposals list a restore to any point in 7 days and say DigitalOcean does not publish the maximum data loss, so DigitalOcean has to be asked before the 15 minutes of the BRD are promised to a customer. [Source: backend proposals, lines 267 and 285 of the original]
- Valkey needs no backup, because it holds no business data. [Source: backend proposals, line 286 of the original]
- HostHatch keeps a second encrypted backup copy. It has no certification and no uptime commitment. [Source: backend proposals, line 218 of the original]
- The proposals expect an environment lost with its region to be rebuilt in another region from code and run again within the 4 hours of the BRD. [Source: backend proposals, line 293 of the original, column 3] Every environment is built as code in `metis-infra`, and the tool is proposed: [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) (current).

What the proposals list for the database in the two layouts they drew. [Unverified - confirm before applying] [Source: backend proposals, line 285 of the original, column 4; component diagram data, lines 485 to 491 of the original]

| Layout | Availability commitment | Restore | Maximum data loss |
|---|---|---|---|
| A separate managed PostgreSQL vendor (PlanetScale) | 99.99% | To 5 minutes before | Not listed as a figure |
| DigitalOcean, on the same private network as the containers | 99.95% | To any point within 7 days | Not published |

The BRD's recovery point is 15 minutes. A restore to 5 minutes before is inside that figure. For DigitalOcean the figure is not published, so the layout cannot yet be shown to meet the BRD. Which layout is drawn for production is open: [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) (draft).

## One tenant restored, one region lost

Carried over, confirm. The parts that belong to one cloud are left out. [Source: system draft, lines 207 and 208 of the original]

- One tenant: restore the database to a point in time on a temporary machine, export the data of that tenant with the tenant export tool (TEN-07), and load it back. The restore is rehearsed every quarter.
- A lost region: the automated backups and the logs of the database are copied continuously to another region, and can be restored to a point in time there. The infrastructure is rebuilt from code. The rebuild is rehearsed twice a year. The target region is chosen by the promises about data location made to customers.
- Open: whether the database of the chosen provider copies its backups to another region is not checked. The earlier draft named one cloud's service for it and a list of that cloud's regions, which do not apply to the drawn layout.

## Retention

- Scheduled jobs delete data that is past its retention period. [Source: backend brainstorm log, line 36 of the original; system draft, lines 122 and 228 of the original, carried over, confirm]
- Other scheduled work in the draft: reminders for due and overdue items, reminders for the weekly report, waiver expiry, support-access expiry, onboarding reminders, and a 14-day undo window. [Source: system draft, line 228 of the original, carried over, confirm]
- No retention period is set. The BRD asks which periods apply to business records, files, audit entries, MCP call records and backups, for each customer jurisdiction, and keeps that as an open question (Q-11).
- The BRD fixes the lifecycle: a deleted tenant has its data purged after the retention period, with a deletion record (TEN-06), a tenant can export all data and files on request and when cancelling (TEN-07), and a deleted project can be restored within a retention period (PLT-15).
- The BRD's data lifecycle row asks that deletion at tenant deletion reaches the backups within a stated period, and that a deletion offered to a customer states what audit retention and the backup purge period still hold.
- The LLM provider named in the proposals lists deletion of data within 30 days after termination and no use of API data for training. [Unverified - confirm before applying] [Source: backend proposals, line 289 of the original, column 4]

## Data location

- One region first. Each region is a full deployment, and each tenant has a home region from its creation. The BRD asks that data at rest and backups stay in the region the tenant chose (TEN-13, priority P1). [Source: backend brainstorm log, lines 73 and 77 of the original] Decided: [One region first, more regions per customer later](decisions/global-ready-release.md) (current), except where the first region is placed: a Singapore proposal and a Vietnam proposal exist, and the owner withdrew the question of choosing between them (BE-08). [Source: backend brainstorm log, lines 188, 220 and 222 of the original]
- The sign-in data stays in the backend's own database, in the same region. [Source: backend proposals, line 283 of the original, column 3]
- The LLM provider stores data in the United States, according to the proposals. [Unverified - confirm before applying] [Source: backend proposals, line 289 of the original, column 4] Its API routes requests globally by default. [Unverified - confirm before applying] [Source: backend proposals, line 128 of the original] D-33 lists regional processing as a criterion, so this is open until the provider is selected.
- Grafana Cloud has a Singapore region and needs a signed data processing agreement. Amazon SES is used in its Singapore region. These are as drawn in the Singapore proposal. [Unverified - confirm before applying] [Source: backend proposals, lines 59 (column 1) and 291 of the original, column 4]
- The BRD asks for a tenant data-processing matrix for every path that holds or moves customer data, with the retention, the region, the transfer mechanism and the sub-processor. The system draft lists such a matrix among its security and compliance items, with the data class, the retention, the region and the sub-processor for each path. The matrix itself is not written. [Source: system draft, line 293 of the original, carried over, confirm]
- HostHatch holds synthetic data only. [Source: backend brainstorm log, line 184 of the original] Proposed by the owner, not confirmed: [The development network on HostHatch, with synthetic data only](decisions/development-on-hosthatch.md) (draft).

## Migrations

- Flyway, in its Community edition, creates the tables, the row-level security policies and the roles. It runs the migrations under a database role other than the application's. [Source: backend proposals, lines 29 and 44 of the original, columns 1 to 3 of line 44]
- Carried over, confirm: the migrations are SQL files written by hand, for the policies and for the partitioning of tables, and they run in continuous integration in an expand-then-contract order, so no downtime is needed. [Source: system draft, line 209 of the original]
- Proposed: [The core's libraries](decisions/core-libraries.md) (draft).

## Workflow history and caches

- Temporal Cloud stores the history of workflows, so Metis should encrypt payloads on its own side before sending them. [Source: backend proposals, line 127 of the original] Temporal's page on data conversion says custom codecs, such as for encryption or compression, can be applied to payloads. It names no SDK language for codecs, and it lists Java among the SDKs with data converters. [Source: docs.temporal.io/dataconversion, read 12 Oct 2026] The proposals say the codec feature is confirmed for another SDK and not checked for the Java SDK. [Unverified - confirm before applying] [Source: backend proposals, line 127 of the original]
- Valkey holds no business data and needs no backup. Its keys always carry the tenant. [Source: backend proposals, line 286 of the original; system draft, line 213 of the original, carried over, confirm]
- Proposed: [Temporal for workflows, schedules and agent runs](decisions/durable-workflows-temporal.md) (draft) and [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) (draft).

## The generated data model

The data model of the core (tables, row-level security policies and a diagram) is to be generated from the Flyway migrations, applied to a throwaway PostgreSQL. It is a generated reference page of the core, and it arrives with the generators of the second plan. No such page exists yet. [Source: the repositories design, section 3.2]

## Open questions

1. The recovery point that can be promised: DigitalOcean does not publish its maximum data loss, and its page states daily backups. [Source: backend proposals, line 267 of the original]
2. Whether the database of the chosen provider copies its backups to another region.
3. The retention periods for each kind of data (Q-11).
4. A write-once mode for the audit export, and the pgvector extension, on the chosen provider.
5. Regional processing at the LLM provider (D-33).
6. Whether the Temporal Java SDK supports a payload codec, and where Temporal's store lives.
7. The tenant data-processing matrix of the BRD.
8. Where the first region is placed (BE-08).
9. Where PDF snapshots are stored. The BRD requires that they are kept, and only the system draft names a place.

## Decisions behind this page

| Decision | Status |
|---|---|
| [One region first, more regions per customer later](decisions/global-ready-release.md) | Current |
| [The development network on HostHatch, with synthetic data only](decisions/development-on-hosthatch.md) | Draft |
| [Every environment built as code in `metis-infra`](decisions/infrastructure-as-code.md) | Current; the tool is proposed |
| [Tenant isolation with PostgreSQL row-level security](decisions/tenant-isolation-rls.md) | Current |
| [One transactional write path for the app, MCP, workflows and agents](decisions/single-write-path.md) | Draft |
| [The core's libraries](decisions/core-libraries.md) | Current |
| [Temporal for workflows, schedules and agent runs](decisions/durable-workflows-temporal.md) | Draft |
| [Push updates and rate limits on Valkey](decisions/realtime-and-rate-limits.md) | Draft |
| [Production on one provider, DigitalOcean as drawn, not confirmed](decisions/production-hosting.md) | Draft |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 18, 28, 29, 33, 34, 44 (columns 1 to 3 only), 45, 59 (column 1 only), 127, 128, 218, 256 (column 1 only), 267, 283 and 285 to 293 (columns 1 to 4 where named above) of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 28, 36, 73, 77, 184, 188, 220 and 222 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: lines 122, 144, 202 to 209, 213, 228, 280 and 293 of the original, carried over, confirm.
- The component diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store, used for its technical content only: lines 140 to 146, 253 to 255 and 485 to 491 of the original.
- [Metis repositories and central documentation, design](../proposals/2026-10-11-repos-and-docs-design.md): section 3.2.
- BRD rows PLT-06, PLT-11, PLT-12, PLT-13, PLT-15, PLT-16, TEN-06, TEN-07, TEN-13, D-05, D-26, D-33 and Q-11, section 17.1 and the data lifecycle row of section 17, in `business/requirements/`.
- Pages read on 12 Oct 2026: postgresql.org/docs/18/functions-uuid.html, docs.digitalocean.com/products/databases/postgresql/how-to/restore-from-backups/ and docs.temporal.io/dataconversion.
