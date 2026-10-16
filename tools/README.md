---
title: Checks and generators
summary: The checks every pull request of metis-docs runs, the generators of llms.txt and the record banners, and how to run them.
component: all
type: how-to
status: current
ids: []
---

# Checks and generators

Node 24 (`.nvmrc`) and Python 3 run everything here; nothing needs installing, except gitleaks for
the secret scan, for the BRD's Word edition the tools the table names, and for the diagrams a clone
of `metis-app` with its dependencies.

| Command | What it does |
|---|---|
| `node tools/check.mjs` | Every check below; one line per problem as `path:line: rule: message`; exit 1 when there is any |
| `node tools/generate.mjs` | Writes `llms.txt` from the page headers, each record's banner from `history/records.json`, and `business/requirements/ids.txt` from `build.py --ids`: the BRD ids, one per line, which `metis-backend` pins to check the ids its operations declare |
| `python3 business/requirements/source/build.py --md-only` | Writes the BRD's Markdown edition, which needs Python only; `addendum-onboarding` as first argument writes the addendum; without `--md-only` it also builds the Word edition, which needs pandoc, and LibreOffice and poppler to check its page numbers |
| `WIREFRAMES_DATE=<the date in manifest.json> node design/wireframes/tools/build-index.mjs` | Writes the wireframe `manifest.json`, `index.html` and `wireframes-digest.md` from the screens |
| `node architecture/diagrams/src/build.mjs <the root of a metis-app clone>` | Writes the eleven drawings of `architecture/diagrams/` from `src/data.mjs`, measuring every text in the Chromium that Playwright installs in that clone; [Architecture diagrams](../architecture/diagrams/README.md) has the rules |
| `gitleaks dir . --no-banner --redact` | The secret scan, which the pull-request workflow runs with a pinned gitleaks release |

`WIREFRAMES_DATE` is the date the wireframe builder writes into `manifest.json`, `index.html` and
`wireframes-digest.md`; without it the builder writes today's date. For a rebuild that changes no
screen, set it to the date `manifest.json` already carries: any other date rewrites all three files,
and the copy of `manifest.json` that `metis-app` pins then drifts from this one. When a screen
changes, leave it unset so that the files carry the date of the change. `node tools/check.mjs`
rebuilds with the date the committed manifest carries, so it does not catch a date changed by
accident.

## The checks

| Rule | What fails |
|---|---|
| `header` | A page without the header, a field missing, out of order or with a value outside its list; a record outside `history/`, or a page in `history/` that is not a record; a `generated_from` that names nothing |
| `id` | A header id that the BRD does not define; in a page outside `history/` that is not generated, an id or a screen number in the text that the BRD or the wireframe manifest does not have. A width written as `screen <width> points wide` reads as a screen number; write `a 390-point-wide screen`. |
| `link` | A link whose file does not exist, that leaves the repository, or whose `#anchor` names no heading |
| `non-ascii-letter` | A letter outside ASCII, except on the line after one holding `lang-exception:`; the reason after it is not checked |
| `dash` | An em dash or an en dash, in any text file |
| `generated` | `llms.txt`, a record banner, the BRD's Markdown editions, `business/requirements/ids.txt` or the wireframe outputs differ from what their generators write now |
| `record` | A page in `history/` without an entry in `history/records.json`, an entry without its page, an entry with a malformed `written`, `replacedBy` or `translation`, or a `replacedBy` that names a page that is not a current page (an empty list is allowed) |

A page is a Markdown file, except the root `CLAUDE.md` and the BRD parts under
`business/requirements/source/`, which are fragments of the generated BRD. Command names from the
core's generated catalog join the `id` rule when the core exists.

The drawings of `architecture/diagrams/` are generated too, but the `generated` rule does not
rebuild them, because their build needs a browser. The build guards them itself: it stops when a
drawing on its frozen list would change.

## Tests

`node --test --experimental-test-coverage --test-coverage-lines=100 --test-coverage-branches=100 --test-coverage-functions=100 --test-coverage-exclude='**/*.test.*' 'tools/*.test.mjs'`
