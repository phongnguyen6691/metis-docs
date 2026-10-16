---
title: The development network on HostHatch, with synthetic data only
summary: The development network runs on HostHatch from the same images and versions as production, with open-source stand-ins for managed services and synthetic data only.
component: infra
type: decision
status: draft
ids: []
---

# The development network on HostHatch, with synthetic data only

## Context

The owner has experience with Google Cloud and DigitalOcean. On 10 Oct 2026 the owner wrote that development could use HostHatch to replicate an identical network, and that the services of DigitalOcean or Google Cloud would be used only when running for real (BE-13, translated). [Source: backend brainstorm log, line 236 of the original]

HostHatch is not suitable for real customer data: it has no certification and no uptime commitment, and its data processing terms do not fix where data is stored. It is therefore limited to the test environment with synthetic data, the automated test runners and a second encrypted backup copy. [Source: backend brainstorm log, line 184; backend proposals, line 218 of the original]

## Decision

Proposed by the owner, not yet confirmed:

- The development network runs on HostHatch with synthetic data only. HostHatch never holds real customer data. [Source: backend brainstorm log, lines 184 and 236 of the original]
- It uses the same container images and the same component versions as production. The log names PostgreSQL, Keycloak, Temporal and ClamAV as examples; the components themselves are proposals in draft records, see [Keycloak 26 for sign-in, with a magic-link authenticator](identity-keycloak.md), [Temporal for workflows, schedules and agent runs](durable-workflows-temporal.md) and [Uploads scanned before use; PDFs rendered in a sandbox](files-and-sandbox.md). The managed services of the production provider are replaced by open-source equivalents that speak the same protocol. [Source: backend brainstorm log, line 236 of the original]
- A small test environment on the production provider itself is added before launch, to check what HostHatch cannot simulate: scale, failover of the database standby and the provider's own permissions. [Source: backend brainstorm log, line 236 of the original]
- The production provider is chosen between Google Cloud and DigitalOcean; AWS remains only a point of comparison. That choice is not part of this record, see [Production on one provider, DigitalOcean as drawn, not confirmed](production-hosting.md). [Source: backend brainstorm log, line 236 of the original]
- The development network is built as code in `metis-infra`, like every other environment. The tool is not chosen yet, see [Every environment built as code in `metis-infra`](infrastructure-as-code.md). [Source: repositories design, section 2.1]

## Consequences

- Developers work against a network that mirrors production in layout and software versions, while HostHatch holds no real customer data.
- The stand-ins are not the managed services. Scale, standby failover and the provider's permission model show only on the real provider, which is why the extra pre-launch environment exists; it is one more environment to build and keep until launch. [Source: backend brainstorm log, line 236 of the original]
- It rules out real customer data on HostHatch. [Source: backend brainstorm log, line 184 of the original]
- Related: [Every environment built as code in `metis-infra`](infrastructure-as-code.md).

## Status

Draft: proposed by the owner on 10 Oct 2026 in BE-13 ("I think development could use HostHatch to replicate an identical network", translated), which the log keeps as being calculated (line 232 of the log). The repositories design that the owner approved on 11 Oct 2026 (RD-05) lists the development network on HostHatch among the contents of `metis-infra`; that approval decided the repositories, not the providers. To be confirmed by the owner.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: lines 184, 232 and 236 of the original (BE-13).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 218 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): section 2.1 and the owner decision RD-05.
