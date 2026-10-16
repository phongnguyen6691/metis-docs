# Builds a BRD document (.md, and .docx on demand) from its parts, with generated traceability and wireframe references.
# Usage: python3 build.py [main|addendum-onboarding] [--md-only] [--out DIR]   (default main)
#        python3 build.py --ids   prints every identifier the main BRD and its addenda define, one per line
# The Markdown needs Python only; the Word file needs pandoc, plus LibreOffice soffice and poppler pdftotext to verify
# its table of contents page numbers. Word files are built on demand and never committed.
# main: parts/*.md, history/brd/legacy/brd_v2_v3_converted.md, design/wireframes/manifest.json -> the main BRD (NAME below)
# addendum-onboarding: addendum-onboarding/parts/*.md and the screens that cite ONB- requirements -> the onboarding addendum;
#   identifiers of the main BRD count as known references, and the main build ignores the addendum's screens.
# Each document may carry an evidence.tsv naming the requirements a wireframe cannot prove; build.py fills {{EVIDENCE_TABLE}} and reports the counts.
# Outputs: <NAME>.md in business/requirements/ (or --out DIR), and <NAME>.docx beside it unless --md-only.
import argparse, html, re, shutil, struct, subprocess, sys, tempfile
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
REQ = HERE.parent
DOCS = REQ.parent.parent
ARGS = argparse.ArgumentParser(description="Builds the BRD or one of its addenda.")
ARGS.add_argument("doc", nargs="?", default="main")
ARGS.add_argument("--md-only", action="store_true", help="write the Markdown edition only")
ARGS.add_argument("--out", type=Path, help="folder for the outputs (default: business/requirements)")
ARGS.add_argument("--ids", action="store_true", help="print the identifiers of the BRD and its addenda, then stop")
OPTS = ARGS.parse_args()
DOC = OPTS.doc
MAIN = DOC == "main"
ADDENDA = {  # name -> (output name, footer text, sentence that opens the body after the table of contents, page title, page summary)
    "addendum-onboarding": ("Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_Addendum_Onboarding_v1.1",
                            "Metis · Enterprise Portfolio Intelligence &amp; Governance Platform  |  BRD Addendum: Onboarding v1.1",
                            "This addendum supplements BRD v4.5 without editing it",
                            "BRD addendum, onboarding v1.1",
                            "The onboarding addendum to BRD v4.5, generated from source/addendum-onboarding by build.py."),
}
if not MAIN and DOC not in ADDENDA:
    sys.exit(f"unknown document: {DOC}; use main or one of {sorted(ADDENDA)}")
NAME, FOOTER, ANCHOR, TITLE, SUMMARY = (("Enterprise_Portfolio_Intelligence_Governance_Platform_BRD_v4.5",
                                         "Metis · Enterprise Portfolio Intelligence &amp; Governance Platform  |  Unified BRD v4.5",
                                         "The two supplied BRD files are", "BRD v4.5",
                                         "The business requirements of Metis, generated from source/parts by build.py.")
                                        if MAIN else ADDENDA[DOC])
# Absolute, because the pandoc calls below run in another working folder, where a relative path would point elsewhere.
OUT_DIR = (OPTS.out or REQ).resolve()
OUT_DOCX, OUT_MD = OUT_DIR / f"{NAME}.docx", OUT_DIR / f"{NAME}.md"
WF_DIR = DOCS / "design" / "wireframes"
LEGACY = DOCS / "history" / "brd" / "legacy" / "brd_v2_v3_converted.md"
MAIN_PARTS = sorted((HERE / "parts").glob("*.md"))
PARTS = MAIN_PARTS if MAIN else sorted((HERE / DOC / "parts").glob("*.md"))
if not PARTS:
    sys.exit(f"no parts for {DOC}")
FIGURES = ["04-tenant-admin-ai-access", "08-profile-ai-access", "11-lifecycle-framework-designer",
           "12-gate-review", "14-executive-cockpit", "15-workspace-dashboard", "38-my-approvals", "42-editor-states"]

md = "\n".join(p.read_text(encoding="utf-8") for p in PARTS)

PREFIXES = "PLT|TEN|WSP|GOV|MCP|CHR|WBS|BLD|PLN|OVW|CHG|RPT|RSK|MVP|EXE|REG|RMP|RES|INV|STR|ANL|AIC|ONB"
ADDENDUM_PREFIXES = {"ONB"}  # requirement prefixes defined by an addendum, never by the main BRD
ROW_ID = re.compile(r"^\|\s*((?:%s|BR|D|Q|A|C)-\d{2})\s*\|" % PREFIXES)
REQ_ID = re.compile(r"^(?:%s|BR)-\d{2}$" % PREFIXES)
cells = lambda line: [c.strip() for c in line.strip().strip("|").split("|")]
problems = []

# ---- defined IDs and their Source cells
def table_ids(text):
    found = {}
    for line in text.splitlines():
        m = ROW_ID.match(line)
        if m:
            if m.group(1) in found:
                problems.append(f"duplicate ID {m.group(1)}")
            found[m.group(1)] = cells(line)
    return found
if OPTS.ids:  # every identifier the main BRD and its addenda define, for the checks of metis-docs
    every = MAIN_PARTS + [p for name in ADDENDA for p in sorted((HERE / name / "parts").glob("*.md"))]
    found = table_ids("\n".join(p.read_text(encoding="utf-8") for p in every))
    if problems:
        sys.exit("\n".join(problems))
    print("\n".join(sorted(found)))
    sys.exit(0)
defined = table_ids(md)
sources = {rid: c[-1] for rid, c in defined.items() if REQ_ID.match(rid)}
main_ids = set(defined) if MAIN else set(table_ids("\n".join(p.read_text(encoding="utf-8") for p in MAIN_PARTS)))
known = set(defined) | main_ids  # identifiers that text and screens may cite
if not MAIN:
    problems += [f"{rid} is already defined in the main BRD" for rid in defined if rid in main_ids]

def sort_key(i):
    p, n = i.rsplit("-", 1)
    order = PREFIXES.split("|") + ["BR"]
    return (order.index(p), int(n))

# ---- POC screenshot -> requirements (Appendix B.1)
def expand_poc(src):
    out = set()
    for m in re.finditer(r"POC ((?:\d{2})(?:\s*[\u2013-]\s*\d{2})?(?:,\s*\d{2}(?:\s*[\u2013-]\s*\d{2})?)*)", src):
        for part in m.group(1).split(","):
            a = re.findall(r"\d{2}", part)
            out.update(range(int(a[0]), int(a[-1]) + 1))
    return out
poc_map = defaultdict(list)
for rid, src in sources.items():
    for n in expand_poc(src):
        poc_map[n].append(rid)
for n in range(1, 37):
    md = md.replace("{{POC:%02d}}" % n, ", ".join(sorted(poc_map.get(n, []), key=sort_key)) or "NONE")
uncited = [n for n in range(1, 37) if not poc_map.get(n)]
if MAIN and uncited:
    problems.append(f"POC screens not cited: {uncited}")

# ---- legacy IDs -> v4 IDs (Appendix D)
legacy_src = LEGACY.read_text(encoding="utf-8")
legacy = sorted(set(re.findall(r"\bFR-\d{3,4}\b", legacy_src)), key=lambda x: int(x[3:]))
legacy += sorted(set(re.findall(r"\b(?:WS|GF|TPL)-\d{3}\b", legacy_src)), key=lambda x: (["WS", "GF", "TPL"].index(x.split("-")[0]), x))
legacy += ["BR-%02d" % i for i in range(1, 13)]
leg_map = defaultdict(set)
for rid, src in sources.items():
    for lid in re.findall(r"\b(?:FR-\d{3,4}|WS-\d{3}|GF-\d{3}|TPL-\d{3})\b", src):
        leg_map[lid].add(rid)
    for n in re.findall(r"v2 BR-(\d{2})", src):
        leg_map["BR-" + n].add(rid)
titles = {}
for line in legacy_src.splitlines():
    m = re.match(r"^\|\s*((?:FR-\d{3,4}|WS-\d{3}|GF-\d{3}|TPL-\d{3}|BR-\d{2}))\s*\|", line)
    if m:
        c = cells(line)
        titles.setdefault(m.group(1), (c[2] if m.group(1).startswith(("WS", "GF", "TPL")) else c[1]).replace("\u2014", "-"))
rows = ["| Legacy ID | Origin | Legacy requirement | v4 IDs |",
        "|--------------|----------|------------------------------------------------|------------------------------|"]
for lid in legacy:
    t = titles.get(lid, "")
    t = t[:90] + "…" if lid.startswith("BR") and len(t) > 90 else t
    ids = sorted(leg_map.get(lid, []), key=sort_key)
    rows.append(f"| {lid} | {'v2.0' if lid.startswith(('FR', 'BR')) else 'v3.0'} | {t} | {', '.join(ids) or 'NONE'} |")
md = md.replace("{{LEGACY_TABLE}}", "\n".join(rows))
unmapped = [l for l in legacy if not leg_map.get(l)]
if MAIN and unmapped:
    problems.append(f"legacy IDs not mapped: {unmapped}")

# ---- wireframes (manifest built by wireframes/tools/build-index.mjs)
import json
manifest = json.loads((WF_DIR / "manifest.json").read_text(encoding="utf-8"))
in_addendum = lambda sc: any(r.split("-")[0] in ADDENDUM_PREFIXES for r in sc["requirements"])
screens = [sc for sc in manifest["screens"] if in_addendum(sc) != MAIN]  # each document lists only its own screens
for sc in screens:
    for f in ("html", "png"):
        if not (WF_DIR / sc[f]).exists():
            problems.append(f"wireframe file missing: {sc[f]}")
    bad = [r for r in sc["requirements"] if r not in known]
    if bad:
        problems.append(f"wireframe {sc['file']} cites IDs not in the BRD: {bad}")
def stem(sc):
    return Path(sc["html"]).stem
for prefix in [p for p in PREFIXES.split("|") if (p in ADDENDUM_PREFIXES) != MAIN]:
    hits = [stem(sc) for sc in screens if any(r.startswith(prefix + "-") for r in sc["requirements"])]
    if not hits:
        problems.append(f"no wireframe cites module {prefix}")
    md = md.replace("{{WF:%s}}" % prefix, ", ".join(hits) if hits else "none")
cited = {r for sc in screens for r in sc["requirements"]}
no_screen = [r for r, c in defined.items() if REQ_ID.match(r) and not r.startswith("BR") and c[-2].split()[0] == "P0" and r not in cited]
if no_screen:
    problems.append(f"P0 requirements without a wireframe: {sorted(no_screen, key=sort_key)}")
wt = ["| Screen | Area | Phase | Wireframe | Requirements | POC |",
      "|--------------------------|------------|-------|----------------------------|------------------------------------|--------|"]
for sc in screens:
    wt.append(f"| {sc['title']} | {sc['area']} | {sc['phase']} | {stem(sc)} | {', '.join(sc['requirements'])} | {', '.join(sc['poc']) or 'none'} |")
md = md.replace("{{WIREFRAME_TABLE}}", "\n".join(wt))

def png_size(path):
    with open(path, "rb") as f:
        head = f.read(24)
    return struct.unpack(">II", head[16:24])
figs = []
by_stem = {stem(sc): sc for sc in screens}
for st in (FIGURES if MAIN else [stem(sc) for sc in screens]):
    sc = by_stem.get(st)
    if not sc:
        problems.append(f"figure screen missing: {st}")
        continue
    if not (WF_DIR / sc["png"]).exists():
        problems.append(f"figure PNG missing: {sc['png']}")
        continue
    w, h = png_size(WF_DIR / sc["png"])
    size = "width=6.6in" if h / w * 6.6 <= 8.3 else "height=8.3in"
    figs.append(f"![Wireframe {st}: {sc['title']}. {sc['summary']}](../../design/wireframes/{sc['png']}){{{size}}}\n")
md = md.replace("{{WIREFRAME_FIGURES}}", "\n".join(figs))

# ---- evidence type per requirement: a screen proves a surface, not a behaviour (evidence.tsv, one row per requirement a wireframe cannot prove)
EV_FILE = (HERE if MAIN else HERE / DOC) / "evidence.tsv"
ev_rows, ev_types = [], defaultdict(int)
EV_KINDS = {"contract test", "security suite", "performance test", "legal decision"}
for ln in EV_FILE.read_text(encoding="utf-8").splitlines() if EV_FILE.exists() else []:
    if not ln.strip() or ln.startswith("#"):
        continue
    rid, kind, proof, what = (ln.split("\t") + ["", "", ""])[:4]
    if rid not in defined:
        problems.append(f"evidence.tsv names {rid}, which this document does not define")
    elif kind not in EV_KINDS:
        problems.append(f"evidence.tsv row {rid} has evidence type {kind!r}, not one of {sorted(EV_KINDS)}")
    elif not (proof and what):
        problems.append(f"evidence.tsv row {rid} is missing its proof or its screen note")
    ev_rows.append((rid, kind, proof, what)); ev_types[kind] += 1
ev_rows.sort(key=lambda r: sort_key(r[0]) if r[0] in defined else (99, 0))
ev_table = ["| Requirement | Evidence type | What proves the behaviour | What the screen does prove |", "|---|---|---|---|"]
ev_table += [f"| {r} | {k} | {e} | {w} |" for r, k, e, w in ev_rows]
md = md.replace("{{EVIDENCE_TABLE}}", "\n".join(ev_table))
ev_ui = sum(1 for r, c in defined.items() if REQ_ID.match(r) and not r.startswith("BR") and r not in {x[0] for x in ev_rows})

# ---- POC screenshots: cropped once from the VistaX POC survey, which stays in the owner's private store
for path, n in re.findall(r"\]\((source/images/poc-(\d{2})\.jpg)\)", md):
    if not (REQ / path).exists():
        problems.append(f"no POC screenshot {n}")

# ---- text oracles
if re.search("[\u2014]", md):
    problems.append("em dash present: " + str([l[:60] for l in md.splitlines() if "\u2014" in l][:5]))
if "\u2013" in md:
    problems.append("en dash present: " + str([l[:60] for l in md.splitlines() if "\u2013" in l][:5]))
if "{{" in md.replace("{{TOC}}", ""):
    problems.append("unfilled placeholder: " + str(re.findall(r"\{\{[^}]+\}\}", md.replace("{{TOC}}", ""))[:5]))
refs = set(re.findall(r"\b(?:%s|BR|D|Q|A|C)-\d{2}\b" % PREFIXES, md))
if refs - known:
    problems.append(f"referenced but undefined: {sorted(refs - known)}")
mods = {int(m) for m in re.findall(r"(?<!v2 )(?<!§14 \()\bM(\d{2})\b", md)}
if any(not 1 <= m <= (22 if MAIN else 23) for m in mods):
    problems.append(f"module refs out of range: {sorted(mods)}")

pri = defaultdict(int)
for rid, c in defined.items():
    if REQ_ID.match(rid) and not rid.startswith("BR"):
        pri[c[-2].split()[0]] += 1
print("requirements:", sum(pri.values()), dict(pri), "| rules:", sum(r.startswith("BR-") for r in defined),
      "| decisions:", sum(r.startswith("D-") for r in defined), *(("| legacy mapped:", len(legacy) - len(unmapped), "/", len(legacy)) if MAIN else ()),
      "| wireframes:", len(screens), "| figures:", len(figs))
print("evidence:", f"UI {ev_ui}", *[f"| {k}: {v}" for k, v in sorted(ev_types.items())])
if problems:
    print("PROBLEMS:"); [print(" -", p) for p in problems]; sys.exit(1)

# ---- Markdown edition (GitHub-flavoured, same content)
def slug(t):
    t = re.sub(r"[^\w\- ]", "", t.lower(), flags=re.UNICODE)
    return t.replace(" ", "-")
def headings(text):
    out, fence = [], False
    for ln in text.splitlines():
        if ln.startswith("```"):
            fence = not fence
            continue
        m = None if fence else re.match(r"^(#{1,2}) (.+)$", ln)
        if m:
            out.append((len(m.group(1)), m.group(2).strip()))
    return out
entries = headings(md)
toc_md = "## Contents\n\n" + "\n".join(("  " if lvl == 2 else "") + f"- [{t}](#{slug(t)})" for lvl, t in entries)
md_out = md.replace("```{=openxml}\n{{TOC}}\n```", toc_md)
md_out = re.sub(r'::: \{custom-style="Title"\}\n(.+?)\n:::', lambda m: "# " + m.group(1).title(), md_out)
md_out = re.sub(r'::: \{custom-style="Subtitle"\}\n(.+?)\n:::', r"**\1**", md_out)
md_out = re.sub(r"\)\{(?:width|height)=[^}]+\}", ")", md_out)
HEADER = (f"---\ntitle: {TITLE}\nsummary: {SUMMARY}\ncomponent: all\ntype: reference\nstatus: current\nids: []\n"
          f"generated_from: business/requirements/source/build.py\n---\n\n")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_MD.write_text(HEADER + md_out, encoding="utf-8")
missing = [p for p in re.findall(r"\]\(((?:source/images|\.\./)[^)]+)\)", md_out) if not (REQ / p).exists()]
if missing:
    sys.exit(f"Markdown edition links to missing files: {missing[:5]}")
if OPTS.md_only:
    print("wrote", OUT_MD.name)
    sys.exit(0)

# ---- .docx with a static table of contents whose page numbers are verified against the rendered PDF
def toc_xml(pages):
    paras = []
    for i, ((lvl, text), pg) in enumerate(zip(entries, pages)):
        runs = f'<w:r><w:t xml:space="preserve">{html.escape(text, quote=False)}</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>{pg}</w:t></w:r>'
        if i == 0:
            runs = ('<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve">'
                    ' TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>') + runs
        if i == len(entries) - 1:
            runs += '<w:r><w:fldChar w:fldCharType="end"/></w:r>'
        paras.append(f'<w:p><w:pPr><w:pStyle w:val="TOC{lvl}"/></w:pPr>{runs}</w:p>')
    return ('<w:p><w:r><w:br w:type="page"/></w:r></w:p><w:sdt><w:sdtPr><w:docPartObj><w:docPartGallery w:val="Table of Contents"/>'
            '<w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent><w:p><w:pPr><w:pStyle w:val="TOCHeading"/></w:pPr><w:r><w:t>Contents</w:t></w:r></w:p>'
            + "".join(paras) + '</w:sdtContent></w:sdt><w:p><w:r><w:br w:type="page"/></w:r></w:p>')

tmp = Path(tempfile.mkdtemp(prefix="brd-build-"))
REF = tmp / "reference.docx"
subprocess.run([sys.executable, str(HERE / "make_ref.py"), FOOTER, str(REF)], check=True, capture_output=True)
PAGE_TOOLS = [t for t in ("soffice", "pdftotext") if not shutil.which(t)]  # both are needed to verify the TOC page numbers
def render(pages):
    src = tmp / "brd-docx-source.md"
    src.write_text(md.replace("{{TOC}}", toc_xml(pages)), encoding="utf-8")
    subprocess.run(["pandoc", str(src), "-f", "markdown", "-o", str(OUT_DOCX), "--reference-doc", str(REF),
                    "--resource-path", str(REQ)], check=True, cwd=REQ)
    out = tmp / "pdf"; shutil.rmtree(out, ignore_errors=True); out.mkdir()
    subprocess.run(["soffice", f"-env:UserInstallation=file://{tmp}/lo", "--headless", "--convert-to", "pdf", "--outdir", str(out), str(OUT_DOCX)],
                   check=True, capture_output=True)
    pdf = next(out.glob("*.pdf"))
    subprocess.run(["pdftotext", "-layout", str(pdf), str(out / "brd.txt")], check=True)
    return pdf, (out / "brd.txt").read_text(encoding="utf-8").split("\f")
def find_pages(page_texts):
    smart = {0x2018: "'", 0x2019: "'", 0x201C: '"', 0x201D: '"', 0x2026: "..."}  # pandoc smart typography, as written into the PDF
    norm = lambda s: re.sub(r"\s+", " ", s.translate(smart))
    P = [norm(p) for p in page_texts]
    cur = next((i for i, p in enumerate(P) if ANCHOR in p), None)
    if cur is None:
        sys.exit("opening sentence not found in the PDF: " + ANCHOR)
    res = []
    for _, text in entries:
        j = next((k for k in range(cur, len(P)) if norm(text) in P[k]), None)
        if j is None:
            sys.exit("heading not found in PDF: " + text)
        res.append(str(j + 1)); cur = j
    return res
if PAGE_TOOLS:  # no renderer on this machine: write the field and let Word fill the numbers on open, and say so
    src = tmp / "brd-docx-source.md"
    src.write_text(md.replace("{{TOC}}", toc_xml([""] * len(entries))), encoding="utf-8")
    subprocess.run(["pandoc", str(src), "-f", "markdown", "-o", str(OUT_DOCX), "--reference-doc", str(REF),
                    "--resource-path", str(REQ)], check=True, cwd=REQ)
    print(f"toc entries: {len(entries)} | page numbers NOT verified: {', '.join(PAGE_TOOLS)} missing; "
          "the table of contents is a field that Word fills on open. Install LibreOffice and poppler to verify them")
else:
    pages = ["0"] * len(entries)
    for attempt in range(3):
        pdf, texts = render(pages)
        found = find_pages(texts)
        if found == pages:
            break
        pages = found
    else:
        sys.exit("TOC page numbers did not converge")
    shutil.copy(pdf, tmp / "last.pdf")
    print(f"toc entries: {len(entries)} | verified on pass {attempt + 1} | pages: {len(texts) - 1} | pdf: {tmp / 'last.pdf'}")
print("wrote", OUT_DOCX.name, "and", OUT_MD.name)
