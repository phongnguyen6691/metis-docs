---
title: Develop the infrastructure
summary: The planned toolchain, rules and checks for the metis-infra repository, with OpenTofu proposed as the tool and no command yet because nothing is built.
component: infra
type: how-to
status: draft
ids: []
---

# Develop the infrastructure

Planned, not built: the toolchain and the rules for working in `metis-infra`. The repository holds no code yet, so this page names no command. Each check below gets the command that runs it when the code exists.

## Toolchain

| Concern | Planned choice | Status |
|---|---|---|
| Approach | Every environment built as code in `metis-infra` | Decided: [Every environment built as code in `metis-infra`](../../architecture/decisions/infrastructure-as-code.md) |
| The tool | OpenTofu, named in the repositories design and the backend proposals. The owner's own question named Terraform | Proposed; the owner has not chosen the tool |
| Providers | The proposals name official providers for DigitalOcean, Cloudflare, Temporal Cloud and Grafana Cloud. The OpenTofu registry lists a provider for each, under digitalocean/digitalocean, cloudflare/cloudflare, temporalio/temporalcloud and grafana/grafana [Source: registry.opentofu.org/v1/providers, one versions list for each of the four, read 12 Oct 2026] | The services behind them are proposals: see [Production on one provider, DigitalOcean as drawn, not confirmed](../../architecture/decisions/production-hosting.md) |
| The HostHatch network | Built as code like every other environment; the sources name no provider for it | Open |
| State | Never written into the repository; where it is kept is not stated | Open |

Sources: backend proposals, lines 269 and 293 of the original; the `AGENTS.md` of `metis-infra`; [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md), section 2.1 (line 69 of the original).

## Rules

- Never write a secret, a token or a state file into `metis-infra`; this is the rule in its `AGENTS.md`.
- Only the infrastructure team changes the workflows that use the production keys. A backend developer who needs a new setting opens a small pull request in `metis-infra` [Source: repositories design, section 2.2, line 81 of the original].
- A change to an environment comes with its documentation change in `metis-docs`: this is the rule in the `AGENTS.md` of `metis-infra`. The design plans that a pull request that changes behaviour gets a companion pull request there, opened by a documentation bot that plan two builds [Source: repositories design, section 1, line 57 of the original].
- Code, comments and tool output are English.

## Checks

None of these checks exists yet, and the sources name no check of the infrastructure code itself. The ones they do name are:

| Check | What it would prove | Source |
|---|---|---|
| A rebuild drill | The infrastructure rebuilt as code runs again in another region within the 4 hours of the BRD. The superseded draft planned to drill it twice a year | backend proposals, line 293 of the original; system draft, line 208 of the original, carried over, confirm |
| Documentation generator | One command writes the resources of each environment (sizes, regions, network), never secrets and never state, into `build/docs/` | the repositories design, sections 3.2 and 4.2 (lines 163 and 234 of the original) |

## Open questions

- The tool, and the checks of the infrastructure code before a change is applied, and the workflow that applies it.
- Where the state is kept, and how the keys of each environment are stored and rotated.
- How the HostHatch network is built.

## Sources

- The backend proposals of 10 Oct 2026, `spec/2026-10-10-backend-two-proposals.md`, kept in the owner's private store: lines 269 and 293 of the original.
- The system draft of 10 Oct 2026, `spec/2026-10-10-backend-system-draft.md`, kept in the owner's private store, superseded by the backend proposals and cited only where it is independent of the stack: line 208 of the original, carried over, confirm.
- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 1, 2.1, 2.2, 3.2 and 4.2 (lines 57, 69, 81, 163 and 234 of the original).
- Pages read on 12 Oct 2026: registry.opentofu.org/v1/providers/digitalocean/digitalocean/versions, registry.opentofu.org/v1/providers/cloudflare/cloudflare/versions, registry.opentofu.org/v1/providers/temporalio/temporalcloud/versions and registry.opentofu.org/v1/providers/grafana/grafana/versions.
