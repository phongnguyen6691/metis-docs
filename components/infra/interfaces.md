---
title: Infrastructure interfaces
summary: What the planned infrastructure exposes to the backend images and the app, what the infrastructure code calls, and the open interface points.
component: infra
type: reference
status: draft
ids: []
---

# Infrastructure interfaces

Planned, not built: the interfaces of `metis-infra`. None exists yet, and no environment exists.

## What it exposes

| Interface | Consumer | What it is | Source |
|---|---|---|---|
| The environments | The backend images and the web build | Development, staging and production. The container images built in `metis-backend` are deployed to the environments that `metis-infra` creates. The web build goes to static hosting behind Cloudflare | repositories design, section 2.1 (lines 67 to 69 of the original) |
| The image registry | The pipelines of `metis-backend` | The place where the container images are published; drawn as the registry of the production provider | repositories design, section 2.1 (lines 68 and 69 of the original); [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) |
| The edge | Every client of Metis | DNS, the CDN, a web firewall, protection against denial-of-service attacks and bot rules in front of the app, the API, the sign-in service and the MCP gateway, as drawn. Cloudflare as the edge is proposed: [Cloudflare at the edge](../../architecture/decisions/edge-cloudflare.md) | backend proposals, line 279 of the original; pitch diagram data, lines 119, 120 and 163 to 166 of the original |
| Parity between environments | Developers | Development uses the same container images and the same component versions as production, with open-source stand-ins instead of managed services. The log names PostgreSQL, Keycloak, Temporal and ClamAV as examples, and those components are proposals | backend brainstorm log, line 236 of the original |

The real domain name is chosen by the owner; the superseded draft used an example domain with one host name for the app, the API, Keycloak and each tenant's MCP endpoint [Source: system draft, line 194 of the original, carried over, confirm].

What the environments hand to the services that run in them (database addresses, secrets, private-network names) is open.

## What it calls

The infrastructure code calls the APIs of the providers. The tool proposed for it is OpenTofu, which does so through a provider for each service (see [Every environment built as code in `metis-infra`](../../architecture/decisions/infrastructure-as-code.md)).

| Provider | Used for | Status |
|---|---|---|
| HostHatch | The development network | Proposed by the owner, not confirmed: [The development network on HostHatch, with synthetic data only](../../architecture/decisions/development-on-hosthatch.md) |
| Cloudflare | The edge | Proposed: [Cloudflare at the edge](../../architecture/decisions/edge-cloudflare.md) |
| DigitalOcean | Production hosting, as drawn | Proposed, not confirmed: [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) |
| Grafana Cloud | Logs, metrics, traces and alerts | Proposed: [OpenTelemetry sent to Grafana Cloud](../../architecture/decisions/observability-opentelemetry.md) |
| Temporal Cloud | Workflows, only if that variant is chosen | Proposed: [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md) |

Sources: repositories design, section 2.1 (line 69 of the original); backend proposals, lines 269 and 293 of the original.

## Open questions

- The values the environments hand to the services, and how secrets reach them.
- The tool, and how it reaches HostHatch: the proposals name providers for OpenTofu for the other four only.
- Where the infrastructure state is kept.
- The names of the hosts, which depend on the domain the owner chooses.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 269, 279 and 293 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 236 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 194 of the original, carried over, confirm.
- The diagram data of the pitch, `spec/diagrams/2026-10-10-pitch/src/data.mjs`, kept in the owner's private store: lines 119, 120 and 163 to 166 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 2.1 (lines 67 to 69 of the original).
