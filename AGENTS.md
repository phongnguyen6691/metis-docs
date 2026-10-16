---
title: Instructions for AI agents
summary: How AI agents read and write metis-docs, the reading order, the trust order and the writing rules.
component: all
type: how-to
status: current
ids: []
---

# Instructions for AI agents

`metis-docs` is the documentation of Metis, in English, for the team and its AI agents. It holds no
product code. A coding agent in `metis-app`, `metis-backend` or `metis-infra` reads a clone of it
beside the code, at `../metis-docs`.

## Folder map

- `business/`: what Metis does today. `overview.md`, `glossary.md`; `requirements/` (the BRD and its
  addenda, generated from `requirements/source/`); `modules/` (one page per BRD module, M01 to M23);
  `journeys/` (one page per key user journey).
- `design/`: `brand/` (tokens, logos, style guide) and `wireframes/` (the screens, `manifest.json`).
- `architecture/`: `overview.md`, `tenancy.md`, `security.md`, `data.md`, `contract.md`,
  `decisions/`, one decision per file, and `diagrams/`, the pitch diagrams with the source that
  builds them (`diagrams/README.md` lists them).
- `components/<app|core|mcp-gateway|agent|keycloak|sandbox|infra>/`: `README.md` (what it does, what
  it depends on, its team, its code repository), `develop.md` (build, run, test, the checks it must
  pass), `interfaces.md` (what it exposes and what it calls), `troubleshoot.md` (symptom, cause,
  fix) and `reference/`, generated from the code and never edited by hand. No component has a
  `reference/` yet: it arrives with the generators of plan two (the documentation bot, its workflows
  and the generators of each code repository: section 4 of
  [the design](proposals/2026-10-11-repos-and-docs-design.md)).
- `operations/`: `environments.md`, `runbooks/`, `incidents/`.
- `proposals/`: specs and plans being worked on. `history/`: records.
- `tools/`: the checks and generators.

## Reading order

1. `llms.txt`: one line per current page, with its summary.
2. The `README.md` of the component you work on.
3. The pages it points to, then any page whose header `ids` holds the BRD id you work on.

## Trust order

1. A page whose `generated_from` reads `<repository>/<path>@<commit>` is exact: it comes from the
   code of that repository at that commit. A page generated inside this repository (the BRD
   editions, the wireframe digest) only repeats the BRD parts or the screens it is built from, so it
   ranks as they do, never above a module page, which records where the app differs from the BRD.
2. A current page (`status: current`) describes `main` of the code repositories as it is.
3. A draft page (`status: draft`) describes a part that is planned, not built.
4. A page under `history/` or with `status: superseded` is never current truth. Open it only to
   learn why, and say so when you cite it.

## Writing rules

- English only; no em dash and no en dash.
- Every page opens with this header, its fields in this order:

  ```yaml
  ---
  title: Change request
  summary: How a change request goes from logged to applied, and who decides.
  component: all
  type: journey
  status: current
  ids: [CHG-01, BR-42]
  ---
  ```

  `component` is one of app, core, mcp-gateway, agent, keycloak, sandbox, infra or all; `type` one of
  overview, module, journey, how-to, reference, runbook, decision, incident, proposal or record;
  `status` one of current, draft, superseded or record. `ids` lists the BRD ids the page covers. A
  generated page adds `generated_from`. No date and no owner: git and `.github/CODEOWNERS`
  hold them.

  `title` and `summary` are plain text. Write one in double quotes, as a JSON string (a double quote
  or a backslash inside takes a backslash before it), when it holds `: ` or ` #`, ends with a colon,
  or starts with one of `` - ? : , [ ] { } # & * ! | > ' " % @ ` ``. `Config:setup` and
  `Title with "inner" quotes` stay plain; `Why: a reason`, `Issue #12`, `` `llms.txt` format ``,
  `[Draft] plan` and `Title ending with colon:` need the quotes.
- One topic per file. Never edit a generated page or a record's banner: change the source and run
  `node tools/generate.mjs`, or the page's generator.
- No history inside a current page. A replaced decision keeps its file, with `status: superseded` and
  a line starting "Superseded by" that links the decision that replaced it.
- A link to a file outside this repository is plain text that names the file.
- Before you hand work back: `node tools/generate.mjs`, then `node tools/check.mjs` must print
  `check: clean (<n> pages, <m> files)`.
