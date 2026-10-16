"""Static checks for wireframe screens (stdlib only). Usage: python3 check.py [files...]  (default: ../screens/*.html)
Fails on: mismatched or unclosed tags, missing wf:* meta, em or en dashes, missing shell script, annotation markers without a note."""
import re, sys
from html.parser import HTMLParser
from pathlib import Path

VOID = {"meta", "link", "br", "img", "input", "hr", "source", "col", "area", "base", "wbr", "param", "track", "embed"}
REQUIRED_META = ["id", "title", "area", "phase", "requirements", "summary"]

class Balance(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors = [], []
    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            top = self.stack[-1] if self.stack else ("nothing", 0)
            self.errors.append(f"line {self.getpos()[0]}: </{tag}> closes <{top[0]}> opened on line {top[1]}")
            # recover: pop to the matching tag if it exists
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break

def check(path):
    text = path.read_text(encoding="utf-8")
    problems = []
    b = Balance(); b.feed(text); b.close()
    problems += b.errors
    problems += [f"unclosed <{t}> from line {ln}" for t, ln in b.stack if t not in ("html", "body", "head")]
    for m in REQUIRED_META:
        if not re.search(r'<meta name="wf:%s" content="[^"]+"' % m, text):
            problems.append(f"missing or empty wf:{m} meta")
    if "\u2014" in text or "\u2013" in text:
        problems.append("contains an em dash or en dash")
    if '<script src="../assets/shell.js"></script>' not in text:
        problems.append("missing shell.js script")
    main = text.split("<section class=\"wf-notes\">")[0]
    notes = text.split("<section class=\"wf-notes\">")[1] if "<section class=\"wf-notes\">" in text else ""
    used = set(re.findall(r'class="anno" data-n="(\d+)"', main))
    noted = set(re.findall(r'class="anno" data-n="(\d+)"', notes))
    if used - noted:
        problems.append(f"annotation markers without a note: {sorted(used - noted, key=int)}")
    if noted - used:
        problems.append(f"notes without a marker on the screen: {sorted(noted - used, key=int)}")
    return problems

if __name__ == "__main__":
    here = Path(__file__).resolve().parent
    files = [Path(f) for f in sys.argv[1:]] or sorted((here.parent / "screens").glob("*.html"))
    bad = 0
    for f in files:
        p = check(f)
        if p:
            bad += 1
            print(f"FAIL {f.name}")
            for x in p:
                print(f"   - {x}")
        else:
            print(f"ok   {f.name}")
    print(f"{len(files) - bad}/{len(files)} screens pass")
    sys.exit(1 if bad else 0)
