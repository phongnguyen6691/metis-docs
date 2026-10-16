---
title: Three code repositories and one for every document
summary: Metis keeps three code repositories, metis-app, metis-backend and metis-infra, and one repository, metis-docs, for every document.
component: all
type: decision
status: current
ids: []
---

# Three code repositories and one for every document

## Context

The owner asked for one repository for all documents, readable by every party and built for search by people and AI agents, as the single source of truth for building a feature in a component, understanding the current business and troubleshooting (RD-01). The first reading of that put code and documents in one repository. The owner corrected it: the request was about documents only, and the code base belongs in other repositories (RD-03). The code then needed a layout of its own, and the owner approved the recommendation of section 2 of the design spec: three code repositories plus the documents repository (RD-05).

Fewer repositories is the default; each boundary has to justify itself. The design spec compared three layouts:

| | One code repository | Three code repositories (chosen) | One repository per service |
|---|---|---|---|
| Repositories | `metis` (app, backend, infrastructure) and `metis-docs`, 2 in total | `metis-app`, `metis-backend`, `metis-infra` and `metis-docs`, 4 in total | `metis-app`, `metis-core`, `metis-mcp-gateway`, `metis-agent`, `metis-keycloak`, `metis-sandbox`, `metis-infra` and `metis-docs`, 8 in total |
| A change across app and backend | one pull request | two, joined by the contract | two or more |
| A new backend command (core, gateway, Keycloak, agent) | one pull request | one pull request | up to four, merged in order |
| Who can change the workflows that hold production keys | every developer with write access | the infrastructure team | the infrastructure team |
| Code access per team | not possible: GitHub grants access per repository, not per folder [Source: docs.github.com, Repository roles for an organization, read 11 Oct 2026] | yes | yes |
| Continuous integration | one workflow per area with path filters; a required check skipped by a path filter stays pending and blocks merging [Source: docs.github.com, Troubleshooting required status checks, read 11 Oct 2026], so an extra summary job is needed | one pipeline per repository | seven pipelines, mostly copies of each other |
| Repositories the documentation bot is wired into | one | three | seven |
| Contract copies a bot keeps in sync | none | one (`metis-app`) | three (`metis-app`, `metis-mcp-gateway`, `metis-agent`) |

## Decision

Metis uses four repositories. Three hold code, one per team; `metis-docs` holds every document and no product code.

| Repository | Holds |
|---|---|
| `metis-app` | The Metis app, one code base with three builds (web, iOS, Android); its automated checks; pinned copies of the brand files, the wireframe manifest and the API contract |
| `metis-backend` | The business core and the OpenAPI contract it generates; the MCP gateway; the AI agent; the Keycloak extensions; the sandbox images; a local stack that runs them all together |
| `metis-infra` | The infrastructure as code of every environment, and the development network |
| `metis-docs` | Every document of Metis, in English, read by the team and its AI agents |

What RD-05 decided about `metis-infra` is that infrastructure as code lives there. The tool is not part of this decision. The table of section 2.1 of the design spec names OpenTofu; the owner named Terraform in the question of BE-13, which is logged as still being calculated; the sources do not settle the choice. See [Every environment built as code in `metis-infra`](infrastructure-as-code.md) and [The development network on HostHatch, with synthetic data only](development-on-hosthatch.md).

The frontend team owns `metis-app`, the backend team `metis-backend`, and the infrastructure team (two or three people) `metis-infra`.

Why these boundaries:

1. **App apart from backend.** The toolchains and checks differ: the app's own automated checks against a Gradle build with JUnit and PIT. The release channels differ: Apple and Google review every app release and people update their phones at their own pace [Unverified - confirm before applying], so the backend must keep answering older app versions. With the app in its own repository, every change to the contract reaches another team as a pull request, which is the review that backward compatibility needs. It also matches team ownership.
2. **Infrastructure apart from backend.** The infrastructure pipeline holds the keys that can change or delete production. In its own repository only the infrastructure team can change the workflows that use those keys, and every production change is recorded in one place, which the spec says ISO 27001 change management asks for [Unverified - confirm before applying]. A backend developer who needs a new setting opens a small pull request there.
3. **Backend kept together.** The core, the MCP gateway, the agent, the Keycloak extensions and the sandbox images belong to one team and deploy together to the same environments. A new command usually touches the catalog in the core, the tools the gateway exposes, the Keycloak scopes for MCP and the agent that uses it: one pull request instead of four. One end-to-end test (agent, gateway, core and PostgreSQL, with Keycloak tokens) runs in one pipeline.
4. **Documents apart from code** (RD-03).

## Consequences

- Each team works in a repository with its own toolchain, checks and release rhythm. Only the infrastructure team can change the workflows that hold the production keys.
- A change that crosses the app and the backend is two pull requests, joined by the API contract. The core generates the contract, and a copy is kept in `metis-app`, in sync through a bot (see [The core generates `openapi.json`; oasdiff guards it; a bot copies it into `metis-app`](api-contract-flow.md)).
- Each code repository has its own pipeline, and the documentation bot of the design spec is wired into all three.
- Per-team code access (a team sees only its own code repository) comes from the owner's earlier choice that each team gets its own part. It is not confirmed after RD-03, and the boundaries above stand without it.
- If an AI team forms, the agent folder of `metis-backend` moves to its own repository with its history; the design spec names `git subtree split` for the move. No other split is planned.
- It rules out a single code repository for everything and one repository per service.
- What `metis-docs` holds and what it leaves out is settled in [Every document is English](documentation-english-only.md) and [Pitch diagrams in the documents, the rest of the pitch material out](pitch-diagrams-in-docs.md).

## Status

Current, decided by the owner on 11 Oct 2026 (RD-01, RD-03 and RD-05).

## Sources

- [Metis repositories and central documentation, design](../../proposals/2026-10-11-repos-and-docs-design.md): the owner decisions RD-01, RD-03 and RD-05 in its table of owner decisions, the correction of RD-01 recorded under that table, its Assumptions section (per-team code access), and sections 2.1 to 2.4. The design spec stays in `proposals/` until the work it describes ships, then moves to `history/`.
- The backend brainstorm log, `spec/2026-10-09-backend-brainstorm-log.md`, kept in the owner's private store: line 232 of the original (BE-13), the owner's question that names Terraform.
