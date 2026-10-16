---
title: Troubleshoot the infrastructure
summary: Where symptoms of the environments will be recorded, with the risks the sources name in advance and the guard planned for each.
component: infra
type: how-to
status: draft
ids: []
---

# Troubleshoot the infrastructure

Planned, not built: no symptom recorded yet.

This page will hold one row per symptom seen on an environment: what a person or a monitor sees, the cause that was measured, the fix, and where the measurement is kept. A row is added only after the symptom was seen and its cause measured. A fix that is a procedure (deploy, roll back, restore, rotate a key) links its runbook in [operations/runbooks](../../operations/runbooks/README.md). No environment exists, so the table is empty.

| Symptom | Cause | Fix | Source |
|---|---|---|---|
| None recorded yet | | | |

## Risks named in advance

These are risks the sources name before any environment exists. They are not symptoms, and nobody has measured them on Metis.

| Risk | Planned guard | Source |
|---|---|---|
| The provider of the drawn layout publishes no maximum data loss for PostgreSQL, while the BRD asks for at most 15 minutes | Ask the provider before promising the 15 minutes to a customer | backend proposals, line 267 of the original; [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) |
| Keycloak runs as a single instance, because two instances need an internal-network link for their cache, which has not been verified on the managed container platform [Unverified - confirm before applying] | Verify it on the platform that is chosen | [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) |
| A deep link of the web build opens the home page instead of the page it names, because the host does not answer `index.html` for every path | The host must answer `index.html` for every path of the app, codes with dots included; a trial of the static export showed the symptom on 5 Oct 2026 | [The web build is a single page](../../architecture/decisions/web-build-single-page.md) |
| Real customer data reaches the development network | HostHatch holds synthetic data only: it has no certification and no uptime commitment | backend brainstorm log, line 184 of the original; [The development network on HostHatch, with synthetic data only](../../architecture/decisions/development-on-hosthatch.md) |
| A managed service of the production provider behaves differently from its open-source stand-in on HostHatch | A small test environment on the production provider checks what HostHatch cannot imitate: scale, the failover of the database standby and the provider's permission model | backend brainstorm log, line 236 of the original |

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 267 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 184 and 236 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 3.1, for the purpose of this page (line 137 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): line 68 of the original, through [The web build is a single page](../../architecture/decisions/web-build-single-page.md).
