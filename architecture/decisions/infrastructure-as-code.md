---
title: Every environment built as code in `metis-infra`
summary: Every environment is built as code in the metis-infra repository, whose workflows only the infrastructure team changes; OpenTofu is proposed as the tool and not yet chosen.
component: infra
type: decision
status: current
ids: []
---

# Every environment built as code in `metis-infra`

## Context

On 10 Oct 2026 the owner asked whether, instead of many separate components, Metis could rent one host (DigitalOcean, Google Cloud or AWS), build the infrastructure as code with Terraform and run the services as containers (web app, business core, MCP gateway, PostgreSQL, Redis), while still meeting the security compliance requirements. The reasons given were simplicity, less latency and fewer different services to manage (BE-13, translated). The log marks BE-13 as being calculated. [Source: backend brainstorm log, line 232 of the original]

The infrastructure pipeline holds the keys that can change or delete production (the tokens of the hosting and edge providers). Kept in its own repository (see [Three code repositories and one for every document](four-repositories.md)), only the infrastructure team can change the workflows that use those keys, and every production change is recorded in one place, which the repositories design says ISO 27001 change management asks for [Unverified - confirm before applying]. [Source: repositories design, section 2.2]

## Decision

Decided by the owner:

- Every environment (development, staging and production) is built as code, in the `metis-infra` repository. The owner asked for infrastructure as code (BE-13) and approved this repository (RD-05). [Source: backend brainstorm log, line 232 of the original; repositories design, section 2.1]
- Only the infrastructure team changes the workflows that hold the production keys. A backend developer who needs a new setting opens a small pull request in `metis-infra`. [Source: repositories design, section 2.2]
- The container images built from `metis-backend` are deployed to the environments that `metis-infra` creates. [Source: repositories design, section 2.1]
- The development network is built in `metis-infra` too; HostHatch for it is the owner's proposal, not confirmed, see [The development network on HostHatch, with synthetic data only](development-on-hosthatch.md). [Source: repositories design, section 2.1]

Proposed, not decided by the owner:

- The tool is OpenTofu. The repositories design and the backend proposals name it, while the owner's own question names Terraform and BE-13 is logged as being calculated. [Source: repositories design, section 2.1; backend proposals, lines 269 and 293; backend brainstorm log, line 232 of the original]
- OpenTofu has official providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud. [Source: backend proposals, lines 269 and 293 of the original] The OpenTofu registry lists a provider for each of the four under the namespaces digitalocean, cloudflare, temporalio and grafana. [Source: registry.opentofu.org, read 12 Oct 2026]
- `metis-infra` builds the resources of each environment at the providers the owner chooses (proposals: [Production on one provider, DigitalOcean as drawn, not confirmed](production-hosting.md), [Cloudflare at the edge](edge-cloudflare.md) and [OpenTelemetry sent to Grafana Cloud](observability-opentelemetry.md)). [Source: repositories design, section 2.1]

## Consequences

- The proposals expect an environment lost with its region to be rebuilt in another region and run again within the 4 hours that the BRD sets as the recovery time. [Source: backend proposals, line 293 of the original]
- Every production change goes through one repository and one team, so it is recorded in one place. [Source: repositories design, section 2.2]
- The infrastructure team is two or three people. [Source: repositories design, section 2.1]
- It rules out environments that exist only as hand-made settings in a provider console.
- Open: the tool. The owner's question names Terraform, the repositories design and the proposals name OpenTofu, and the sources do not say why; the choice is to be confirmed with the owner.

## Status

Current for the decision that every environment is built as code in `metis-infra`: the owner asked for infrastructure as code on 10 Oct 2026 (BE-13) and approved the repository on 11 Oct 2026 (RD-05). The tool is a proposal: OpenTofu in the repositories design and the backend proposals, Terraform in the owner's own question, and BE-13 is logged as being calculated (line 232 of the log). The owner has not chosen the tool or the providers.

## Sources

- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 232 of the original (BE-13).
- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: line 293 and the first clause of line 269 of the original.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 2.1 and 2.2, and the owner decision RD-05.
- Page read on 12 Oct 2026: registry.opentofu.org (the provider version lists of digitalocean/digitalocean, cloudflare/cloudflare, temporalio/temporalcloud and grafana/grafana).
