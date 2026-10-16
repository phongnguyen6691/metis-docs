---
title: Production on one provider, DigitalOcean as drawn, not confirmed
summary: Production runs at a single provider on one private network, drawn on DigitalOcean with managed PostgreSQL, Valkey, object storage and a registry, while the owner still chooses between DigitalOcean and Google Cloud.
component: infra
type: decision
status: draft
ids: []
---

# Production on one provider, DigitalOcean as drawn, not confirmed

## Context

The BRD sets service targets for the hosting: reading and saving in under 1 second at the 95th percentile, availability of 99.9%, at most 15 minutes of data lost in an incident and recovery within 4 hours. [Source: backend proposals, line 18 of the original]

The scattered layout of the proposals spreads the services over several suppliers and joins its database to the containers over the Internet with TLS. The single-provider layout keeps the containers, PostgreSQL and Valkey on one private network. [Source: backend proposals, line 264 of the original]

In BE-13 (10 Oct 2026) the owner added that they know Google Cloud and DigitalOcean, that development can run on HostHatch with the same network, and that production would use the services of DigitalOcean or Google Cloud. [Source: brainstorm log, line 236 of the original]

## Decision

Proposed, not yet decided by the owner:

- Production runs at one provider. The proposals draw it on DigitalOcean; the owner has not confirmed that and still chooses between DigitalOcean and Google Cloud. AWS stays only a point of comparison. [Source: brainstorm log, line 236 of the original]
- The drawn layout has the application containers on DigitalOcean App Platform (it runs the containers, balances load, deploys by rolling update and handles TLS), managed PostgreSQL with a standby (business data, row-level security, restore to a point in time), Valkey, Spaces for files and a Container Registry, all on one private network. [Source: backend proposals, lines 264, 265, 280 and 285 of the original]
- The application scales by adding container instances in App Platform. [Source: backend proposals, line 268 of the original]
- The infrastructure is built as code with OpenTofu, which has official providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud. [Source: backend proposals, line 269 of the original]
- Development runs on HostHatch with the same container images and the same versions of PostgreSQL, Keycloak, Temporal and ClamAV, with open-source stand-ins instead of managed services and synthetic data only. A small test environment on the production provider is added before launch to check what HostHatch cannot imitate: scale, the standby failover of the database and the cloud's permission model. [Source: brainstorm log, line 236 of the original]

## Consequences

- A small team does not patch operating systems for the application containers, and the containers can run at another provider without a change of application code. [Source: backend proposals, lines 120 and 280 of the original]
- Commitments DigitalOcean lists: availability of 99.95% for App Platform, Managed Databases and Container Registry, 99.9% for Spaces, and none stated for Valkey. [Source: backend proposals, line 265 of the original]
- Certifications listed: SOC 2 Type II, SOC 3 and CSA STAR level 1. ISO 27001 is stated only for the data centers DigitalOcean rents space in, which is supplier evidence to review under the supplier controls of ISO 27001, see [ISO 27001 first, SOC 2 Type II when customers ask](security-certification-path.md). [Source: backend proposals, lines 124 and 266 of the original]
- Recovery: PostgreSQL can be restored to any point in the last 7 days, but DigitalOcean does not publish the maximum data loss. The BRD target is 15 minutes, so DigitalOcean has to be asked before that figure is promised to a customer. [Source: backend proposals, lines 267 and 285 of the original]
- Containers share CPU, and autoscaling exists only for containers with dedicated CPU. [Source: backend proposals, line 123 of the original]
- Keycloak runs as a single instance: two instances need an internal-network link for their cache, which has not been verified on App Platform. [Unverified - confirm before applying] [Source: backend proposals, line 125 of the original]
- The scattered layout reached its database provider over the Internet with TLS, and the latency was not measured; on one private network that hop disappears. [Source: backend proposals, lines 126 and 264 of the original]
- Open: the choice between DigitalOcean and Google Cloud. The edge in front of this layout is described in [Cloudflare at the edge](edge-cloudflare.md).

## Status

Draft: proposed in the backend proposals of 10 Oct 2026, not decided by the owner. The provider is not confirmed: the owner still chooses between DigitalOcean and Google Cloud (BE-13).

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 18, 120, 123 (first sentence), 124, 125, 126, 264, 265, 266, 267, 268 (first clause), 269, 280 and 285 of the original.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 236 of the original (BE-13).
