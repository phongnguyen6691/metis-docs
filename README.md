---
title: Metis documentation
summary: What this repository holds, who reads it, and where to start for each reason to open it.
component: all
type: overview
status: current
ids: []
---

# Metis documentation

The single source of truth about Metis for the team that builds it: the product owner, the BA, the
designer, developers, QA, and the AI agents they work with. It holds no product code: the code lives
in `metis-app`, `metis-backend` and `metis-infra`.

## Where to start

| You want to | Start at |
|---|---|
| understand what Metis does today and for whom | [business/overview.md](business/overview.md) |
| build a feature in a component | that component's folder under [components/](components/), its `README.md` first, then `develop.md` |
| troubleshoot | the component's `troubleshoot.md`, then [operations/](operations/) |
| learn why something is the way it is | [architecture/decisions/](architecture/decisions/) |
| see every current page in one list | [llms.txt](llms.txt) |

## Folders

| Folder | Answers |
|---|---|
| [business/](business/) | What Metis does, for whom: the BRD and its addenda, one page per module and per key journey |
| [design/](design/) | The brand files and the wireframes, the source the code copies |
| [architecture/](architecture/) | How the parts fit, every decision with its reasons, and the [pitch diagrams](architecture/diagrams/README.md) of the stack and the hosting proposals |
| [components/](components/) | One folder per deployable part, each with the same entries: `README.md`, `develop.md`, `interfaces.md`, `troubleshoot.md` and `reference/`. `reference/`, written from the code, arrives with the generators of plan two (the documentation bot, its workflows and the generators of each code repository: section 4 of [the design](proposals/2026-10-11-repos-and-docs-design.md)); no component has one yet |
| [operations/](operations/) | Environments, runbooks and incident reviews |
| [proposals/](proposals/) | Specs and plans being worked on |
| [history/](history/) | Records: delivered plans, decision logs, reviews, old BRD versions; never current truth |
| [tools/](tools/) | The checks every pull request runs, and the generators of `llms.txt` and the record banners |

## Rules for every change

- English only. Every page opens with the header its folder's pages carry; [AGENTS.md](AGENTS.md)
  describes it.
- A current page tells how things are, not how they changed: git and the decision records keep that.
- `node tools/generate.mjs` rewrites `llms.txt` and the record banners; `node tools/check.mjs` runs
  every page check a pull request runs. A pull request also runs the tests of `tools/` and a secret
  scan (`gitleaks dir . --no-banner --redact`); [tools/README.md](tools/README.md) has the commands.
