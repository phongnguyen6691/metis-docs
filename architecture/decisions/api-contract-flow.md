---
title: The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`
summary: The core generates the OpenAPI contract, oasdiff compares every change with main, and a bot opens a pull request that copies the contract into the app.
component: core
type: decision
status: current
ids: []
---

# The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`

## Context

The app is built and shipped apart from the back end. Apple and Google review every app release, and people update their phones at their own pace [Unverified - confirm before applying], so the back end must keep answering older app versions. With the app in its own repository (see [Three code repositories and one for every document](four-repositories.md)), every change to the contract reaches the frontend team as a pull request, which is the review that backward compatibility needs. [Source: repositories design, section 2.2]

The core generates an OpenAPI 3.1 contract, a bot copies it into `metis-app`, and the app generates its zod schemas from it. [Source: repositories design, section 1]

## Decision

- The core generates `contract/openapi.json` (OpenAPI 3.1) in `metis-backend`. The build fails when the committed file is stale. [Source: repositories design, section 4.5]
- On every backend pull request, oasdiff compares the contract with the one on `main`. [Source: repositories design, section 4.5] oasdiff is open source under the Apache-2.0 license and supports OpenAPI 3.1. [Source: github.com/oasdiff/oasdiff, read 12 Oct 2026]
- A breaking change, such as a removed field or a new required input, needs the label `contract: breaking`, set by the frontend lead. [Source: repositories design, section 4.5]
- When the backend pull request merges, a bot opens a pull request in `metis-app` that copies the contract. The app regenerates its zod schemas and its checks run. [Source: repositories design, section 4.5]
- The API reference reaches `metis-docs` through the backend pull request's own companion pull request. [Source: repositories design, section 4.5]

## Consequences

- A stale contract fails the build of the core, and a breaking change cannot merge without the frontend lead's label, because app versions already on phones keep calling the old shape. [Source: repositories design, section 4.5]
- The contract is the only thing the two sides share; see [The API contract is the only coupling between app and back end](api-contract-only-coupling.md).
- Effort: oasdiff runs on every backend pull request, a bot has to be wired from `metis-backend` to `metis-app`, and the frontend lead reviews every breaking change.
- Open: the oasdiff option that makes it exit with an error on a breaking change is not confirmed. [Unverified - confirm before applying]

## Status

Current, decided by the owner on 11 Oct 2026 (RD-07, section 4 of the repositories design approved).

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): sections 1, 2.2 and 4.5, and the owner decision RD-07.
- Page read on 12 Oct 2026: github.com/oasdiff/oasdiff.
