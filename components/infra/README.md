---
title: Infrastructure
summary: The planned infrastructure of Metis as code for development, staging and production, with OpenTofu and the providers proposed, its team and its repository.
component: infra
type: overview
status: draft
ids: []
---

# Infrastructure

Planned, not built: the infrastructure of Metis as code in `metis-infra`, with OpenTofu proposed as the tool, for a development network on HostHatch, a staging environment and production. `metis-infra` holds no code yet and no environment exists, so nothing on this page can be run, called or tested today.

## What it does

- **Builds every environment as code.** The environments are development, staging and production [Source: repositories design, section 2.1, line 69 of the original]. This is decided: [Every environment built as code in `metis-infra`](../../architecture/decisions/infrastructure-as-code.md). The tool is not decided. The repositories design and the backend proposals name OpenTofu [Source: backend proposals, lines 269 and 293 of the original], the owner's own question named Terraform, and the owner has not chosen between them; the record holds that question.
- **Holds the production keys.** The infrastructure pipeline holds the keys that can change or delete production. In its own repository, only the infrastructure team can change the workflows that use those keys, and every production change is recorded in one place [Source: repositories design, section 2.2, line 81 of the original].
- **Creates the environments that the backend images are deployed to.** The images are built in `metis-backend` and published to a registry [Source: repositories design, section 2.1, line 68 of the original].

The design lists these resources for `metis-infra`: Cloudflare, DigitalOcean (App Platform, PostgreSQL, Valkey, Spaces and a registry), Grafana Cloud, Temporal Cloud when that variant is chosen, and the development network on HostHatch [Source: repositories design, section 2.1, line 69 of the original]. No provider is decided: HostHatch for development is the owner's own proposal, not confirmed, and every other provider below, and the tool, is a proposal that the owner has not chosen; each has a decision record.

| Part | Proposed provider | Status |
|---|---|---|
| Development | HostHatch, with synthetic data only: [The development network on HostHatch, with synthetic data only](../../architecture/decisions/development-on-hosthatch.md) | Proposed by the owner, not confirmed |
| The tool | OpenTofu, with providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud: [Every environment built as code in `metis-infra`](../../architecture/decisions/infrastructure-as-code.md) | Proposed |
| Production hosting | One provider, drawn on DigitalOcean (containers on App Platform, managed PostgreSQL with a standby, Valkey, object storage, a registry, one private network); the owner still chooses between DigitalOcean and Google Cloud: [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) | Proposed, not confirmed |
| The edge | Cloudflare for DNS, the CDN, a web firewall, protection against denial-of-service attacks and bot rules: [Cloudflare at the edge](../../architecture/decisions/edge-cloudflare.md) | Proposed |
| Observability | OpenTelemetry sent to Grafana Cloud: [OpenTelemetry sent to Grafana Cloud](../../architecture/decisions/observability-opentelemetry.md) | Proposed |
| Workflows | Temporal, run by Metis or hosted as Temporal Cloud: [Temporal for workflows, schedules and agent runs](../../architecture/decisions/durable-workflows-temporal.md) | Proposed, the variant is open |
| Email | Amazon SES: [Amazon SES for notification email](../../architecture/decisions/email-ses.md) | Proposed |
| The LLM gateway | Cloudflare AI Gateway: [The agent calls tools only through MCP; models through an LLM gateway](../../architecture/decisions/agent-and-llm.md) | Proposed |

Sources for the table: backend proposals, lines 56, 264 to 267, 269, 279, 280, 284, 285, 290, 291 and 293 of the original; backend brainstorm log, lines 184 and 236 of the original.

## Team and repository

- **Team:** the infrastructure team, two or three people [Source: repositories design, section 2.1, line 69 of the original].
- **Code repository:** `metis-infra`, which holds no code yet. A backend developer who needs a new setting opens a small pull request there [Source: repositories design, section 2.2, line 81 of the original]. See [Three code repositories and one for every document](../../architecture/decisions/four-repositories.md).
- **Reference pages:** `reference/` does not exist yet. It will hold the resources of each environment (sizes, regions, network) and never secrets and never state, generated from the infrastructure code [Source: repositories design, section 3.2, line 163 of the original].

## Read next

- [Develop the infrastructure](develop.md), [Infrastructure interfaces](interfaces.md) and [Troubleshoot the infrastructure](troubleshoot.md).
- [Environments](../../operations/environments.md), the [runbooks](../../operations/runbooks/README.md) and the [incident reviews](../../operations/incidents/README.md).
- The architecture pages [overview](../../architecture/overview.md) and [data](../../architecture/data.md).

## Open questions

- The tool: OpenTofu or Terraform (see [Every environment built as code in `metis-infra`](../../architecture/decisions/infrastructure-as-code.md)).
- The production provider: DigitalOcean or Google Cloud [Source: backend brainstorm log, line 236 of the original].
- Whether Temporal is hosted as Temporal Cloud or run by Metis, and who hosts PostgreSQL [Source: repositories design, section 2.1, line 69 of the original; backend proposals, lines 284 and 285 of the original].
- The recovery point that Metis can publish. The provider of the drawn layout does not publish a maximum data loss for PostgreSQL, so it has to be asked before the 15 minutes of the BRD are promised to a customer [Source: backend proposals, line 267 of the original].
- The secret store. The BRD asks for a store with rotation, and the proposals name none [Source: backend brainstorm log, line 30 of the original].
- Who provisions the email and the LLM gateway: Amazon SES belongs to another provider than those the design lists for `metis-infra`, and the sources do not say that `metis-infra` creates the Cloudflare AI Gateway [Source: repositories design, section 2.1, line 69 of the original].
- How the HostHatch network is built: the proposals name providers for OpenTofu for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud only [Source: backend proposals, lines 269 and 293 of the original].
- Where the infrastructure state is kept. The `AGENTS.md` of `metis-infra` says never to write a state file into the repository.
- The host of the web build must answer `index.html` for every path of the app, dots included; the service and who configures it are not decided (see [The web build is a single page](../../architecture/decisions/web-build-single-page.md)).

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 56, 264 to 267, 269, 279, 280, 284, 285, 290, 291 and 293 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 30, 184 and 236 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1, 2.2 and 3.2 (lines 68, 69, 81 and 163 of the original).
- [Front-end foundation spec](../../history/specs/2026-10-05-frontend-foundation-spec.md): line 717 of the original, through [The web build is a single page](../../architecture/decisions/web-build-single-page.md).
