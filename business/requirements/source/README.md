---
title: BRD source
summary: How the BRD and its addenda are built from their parts, and what the build checks.
component: all
type: how-to
status: current
ids: []
---

# BRD source

Source of the unified BRD and its onboarding addendum. The Markdown editions in `../` are generated from here; the Word editions are built on demand and never committed. Edit the parts, never the outputs.

| File | Role |
|---|---|
| `parts/01-front.md` to `parts/05-appendices.md` | Content in pandoc Markdown, in reading order |
| `../../../history/brd/legacy/brd_v2_v3_converted.md` | Text of the original BRD (v2.0 body and v3.0 addendum) converted with pandoc; used to prove every legacy ID is mapped |
| `build.py` | Assembles the parts, fills generated sections, runs the checks, writes the Markdown edition to `../` (or to `--out`), and the Word edition beside it unless `--md-only` |
| `evidence.tsv` | Requirements whose behaviour a wireframe cannot prove, with the evidence type and what proves it; fills `{{EVIDENCE_TABLE}}` and the per-type counts the build prints. The addendum has its own under `addendum-onboarding/` |
| `make_ref.py` | Builds `reference.docx` (styles, page setup, footer) used by pandoc; the Word build runs it into a temporary folder, so the file is not kept here |

## Build

```
python3 build.py [main|addendum-onboarding] [--md-only] [--out DIR]
python3 build.py --ids
```

`python3 build.py --md-only` writes the Markdown edition and needs Python only. `python3 build.py` also writes the Word edition, which needs pandoc; LibreOffice (`soffice`) and poppler (`pdftotext`) are needed only to verify the table of contents page numbers against a rendered PDF. Without them the build still writes the Word edition, leaves the table of contents as a field that Word fills on open, and says so in its output. `--out DIR` writes the outputs to DIR instead of `../` (a relative DIR is taken from the folder you run in). `--ids` prints every identifier the main BRD and its addenda define, one per line, and stops; `node tools/generate.mjs` keeps that list in `../ids.txt`, for the code repositories to pin. The build:

1. Fills generated content: POC screen to requirement table, legacy ID table (Appendix D), wireframe lists per module, the screen table and figures from `../../../design/wireframes/manifest.json`.
2. Checks that every POC screenshot the parts cite exists in `images/`. The cropped files are kept there; the VistaX screenshots they were cropped from stay in the owner's private store.
3. Fails if: an ID is defined twice or referenced but undefined, a legacy v2.0 or v3.0 ID is unmapped, a POC screenshot is uncited, a wireframe cites an unknown ID, a module has no wireframe, a P0 requirement is cited by no wireframe, a placeholder is left, or an em dash or an en dash appears, in the main build and in the addendum build alike (write a range with a hyphen); the addendum build also fails on an identifier that the main BRD already defines.
4. Writes the Markdown edition, with a page header (title, summary, component, type, status, ids, generated_from) above the text, then, unless `--md-only`, the .docx with a table of contents whose page numbers are checked against a rendered PDF (Word refreshes the field on open).

## Addendum

`python3 build.py addendum-onboarding` builds the onboarding addendum (`../Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1.md`, and the `.docx` beside it unless `--md-only`) from `addendum-onboarding/parts/`. Identifiers of the main BRD count as known references there; screens that cite an `ONB-` requirement belong to the addendum, and the main build ignores them, so the main BRD never shows addendum identifiers. The addendum's design spec, rulings, plan, option catalogue and research notes are records in `../../../history/brd/addendum-onboarding/`.

## Placeholders in the parts

`{{POC:NN}}`, `{{LEGACY_TABLE}}`, `{{WF:PREFIX}}`, `{{WIREFRAME_TABLE}}`, `{{WIREFRAME_FIGURES}}`, `{{EVIDENCE_TABLE}}`, `{{TOC}}`: filled by `build.py`.
