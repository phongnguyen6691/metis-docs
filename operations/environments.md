---
title: Environments
summary: The planned development, staging and production environments of Metis, where each one runs, who deploys to them and what is still open.
component: infra
type: overview
status: draft
ids: []
---

# Environments

Planned, not built: three environments of Metis, development, staging and production. None exists yet, so no part of Metis is deployed anywhere. This page records where each environment is planned to run, what it is for, who deploys to it and what is still open.

| Environment | Where | What it is for | State |
|---|---|---|---|
| Development | HostHatch, proposed by the owner, not confirmed | A replica of the production network, built from the same container images and the same component versions as production, with open-source stand-ins instead of managed services. The log names PostgreSQL, Keycloak, Temporal and ClamAV as examples, and those components are proposals. It also hosts the runners of the automated checks and a second encrypted backup. It holds synthetic data only, and HostHatch never holds real customer data | Does not exist yet |
| Staging | A small test environment built before launch at the production provider, which is not chosen yet | Checks what HostHatch cannot imitate: scale, the failover of the database standby and the permission model of the provider | Does not exist yet |
| Production | One provider in one region. The log reads the owner's answer as a region in Singapore, but where the first region is placed is not final. Drawn on DigitalOcean: managed PostgreSQL with a standby, Valkey, object storage and a registry on one private network, and Cloudflare in front. Not confirmed: the owner still chooses between DigitalOcean and Google Cloud | The real service, with real customer data | Does not exist yet |

Sources for the table: backend brainstorm log, lines 73, 184, 188, 220, 222 and 236 of the original; backend proposals, lines 218, 264 and 280 of the original.

Development, and the small test environment before launch, are proposed together by the owner, not confirmed: [The development network on HostHatch, with synthetic data only](../architecture/decisions/development-on-hosthatch.md). Having one region first is decided, and where it is placed is not final: [One region first, more regions per customer later](../architecture/decisions/global-ready-release.md). The provider of production, the layout drawn on it and the edge are proposals that the owner has not chosen: [Production on one provider, DigitalOcean as drawn, not confirmed](../architecture/decisions/production-hosting.md) and [Cloudflare at the edge](../architecture/decisions/edge-cloudflare.md).

## Who deploys

- **The infrastructure team** builds every environment as code in `metis-infra` and holds the production keys. Only it changes the workflows that use those keys. A backend developer who needs a new setting opens a small pull request in `metis-infra` [Source: repositories design, section 2.2, line 81 of the original]. See [Every environment built as code in `metis-infra`](../architecture/decisions/infrastructure-as-code.md), which leaves the tool open.
- **The backend team** builds the container images in `metis-backend`. They are deployed to the environments that `metis-infra` creates [Source: repositories design, section 2.1, line 68 of the original]. Which pipeline performs the deployment is open.
- **The frontend team** ships the web build to static hosting behind Cloudflare, and the releases to the App Store and Google Play [Source: repositories design, section 2.1, line 67 of the original].

## Open questions

- **The first region and the production provider:** where the first region is placed is not final, and the provider is DigitalOcean or Google Cloud [Source: backend brainstorm log, lines 188 and 236 of the original].
- **Temporal and PostgreSQL hosting:** whether Temporal is run by Metis or hosted as Temporal Cloud, and which supplier hosts PostgreSQL [Source: repositories design, section 2.1, line 69 of the original; backend proposals, lines 284 and 285 of the original].
- **The published recovery point:** the provider of the drawn layout does not publish a maximum data loss for PostgreSQL, so it has to be asked before the 15 minutes of the BRD are promised to a customer [Source: backend proposals, line 267 of the original].
- **The secret store:** the BRD asks for a store with rotation, and the sources name none [Source: backend brainstorm log, line 30 of the original].
- **Email and the LLM gateway:** who provisions them. Amazon SES and Cloudflare AI Gateway are not in the list of resources that the design gives `metis-infra` [Source: repositories design, section 2.1, line 69 of the original].
- **The host of the web build:** it must answer `index.html` for every path of the app, dots included, such as `wbs/item-1.1.1`; which service does it and who configures it are not decided (line 717 of the original of the [Front-end foundation spec](../history/specs/2026-10-05-frontend-foundation-spec.md)). See [The web build is a single page](../architecture/decisions/web-build-single-page.md).

## Read next

- [Infrastructure](../components/infra/README.md), the component page of `metis-infra`.
- [Runbooks](runbooks/README.md) and [incident reviews](incidents/README.md), which hold nothing yet.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 218, 264, 267, 280, 284 and 285 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 30, 73, 184, 188, 220, 222 and 236 of the original.
- [Metis repositories and central documentation, design](../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1 and 2.2 (lines 67, 68, 69 and 81 of the original).
- [Front-end foundation spec](../history/specs/2026-10-05-frontend-foundation-spec.md): line 717 of the original.
