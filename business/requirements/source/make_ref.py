# Build the pandoc reference.docx: styles, page setup, footer, update-fields-on-open.
import re, shutil, sys, zipfile
from pathlib import Path

HERE = Path(__file__).parent
import subprocess, tempfile
_tmp = Path(tempfile.mkdtemp())
SRC = _tmp / "default-ref.docx"
subprocess.run(["pandoc", "-o", str(SRC), "--print-default-data-file", "reference.docx"], check=True)
# Optional arguments: footer text, output path (defaults: the BRD v4.3 footer and ./reference.docx)
FOOTER_TEXT = sys.argv[1] if len(sys.argv) > 1 else "Metis · Enterprise Portfolio Intelligence &amp; Governance Platform  |  Unified BRD v4.3"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "reference.docx"

files = {}
with zipfile.ZipFile(SRC) as z:
    for n in z.namelist():
        files[n] = z.read(n)

def sub_style(xml, style_id, new_block):
    pat = re.compile(r'<w:style [^>]*w:styleId="%s".*?</w:style>' % re.escape(style_id), re.S)
    assert pat.search(xml), style_id
    return pat.sub(new_block, xml, count=1)

FONT = '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/>'
NAVY, BLUE = "1F3864", "2E5597"

st = files["word/styles.xml"].decode("utf-8")
# document defaults: Calibri 10pt
st = re.sub(r'<w:rPrDefault>.*?</w:rPrDefault>',
            '<w:rPrDefault><w:rPr>%s<w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault>' % FONT,
            st, count=1, flags=re.S)

def para_style(sid, name, ppr, rpr, based="Normal", nxt="BodyText", extra=""):
    return ('<w:style w:type="paragraph" w:styleId="%s"><w:name w:val="%s"/><w:basedOn w:val="%s"/>'
            '<w:next w:val="%s"/>%s<w:pPr>%s</w:pPr><w:rPr>%s</w:rPr></w:style>') % (sid, name, based, nxt, extra, ppr, rpr)

for lvl, size, color, before in [(1, 30, NAVY, 360), (2, 24, BLUE, 280), (3, 21, BLUE, 200), (4, 20, BLUE, 160)]:
    st = sub_style(st, "Heading%d" % lvl, para_style(
        "Heading%d" % lvl, "heading %d" % lvl,
        '<w:keepNext/><w:keepLines/><w:spacing w:before="%d" w:after="100"/><w:outlineLvl w:val="%d"/>' % (before, lvl - 1),
        '%s<w:b/><w:bCs/><w:color w:val="%s"/><w:sz w:val="%d"/><w:szCs w:val="%d"/>' % (FONT, color, size, size),
        extra='<w:uiPriority w:val="9"/><w:qFormat/>'))

st = sub_style(st, "Title", para_style("Title", "Title",
    '<w:spacing w:before="600" w:after="120"/><w:jc w:val="left"/>',
    '%s<w:b/><w:color w:val="%s"/><w:sz w:val="44"/><w:szCs w:val="44"/>' % (FONT, NAVY), extra='<w:qFormat/>'))
st = sub_style(st, "Subtitle", para_style("Subtitle", "Subtitle",
    '<w:spacing w:before="60" w:after="240"/><w:jc w:val="left"/>',
    '%s<w:color w:val="%s"/><w:sz w:val="28"/><w:szCs w:val="28"/>' % (FONT, BLUE), extra='<w:qFormat/>'))
st = sub_style(st, "BodyText", para_style("BodyText", "Body Text",
    '<w:spacing w:before="0" w:after="120" w:line="264" w:lineRule="auto"/>', '', nxt="BodyText", extra='<w:qFormat/>'))
# table-cell paragraphs (pandoc uses Compact inside tables)
st = sub_style(st, "Compact", para_style("Compact", "Compact",
    '<w:spacing w:before="20" w:after="20" w:line="240" w:lineRule="auto"/>',
    '<w:sz w:val="17"/><w:szCs w:val="17"/>', based="BodyText", nxt="Compact"))
st = sub_style(st, "ImageCaption", para_style("ImageCaption", "Image Caption",
    '<w:spacing w:before="40" w:after="200"/><w:jc w:val="center"/>',
    '<w:i/><w:color w:val="595959"/><w:sz w:val="17"/><w:szCs w:val="17"/>', based="Caption"))
st = sub_style(st, "TableCaption", para_style("TableCaption", "Table Caption",
    '<w:keepNext/><w:spacing w:before="120" w:after="60"/>',
    '<w:b/><w:color w:val="%s"/><w:sz w:val="18"/><w:szCs w:val="18"/>' % BLUE, based="Caption"))
st = sub_style(st, "Table", (
    '<w:style w:type="table" w:default="1" w:styleId="Table"><w:name w:val="Table"/><w:basedOn w:val="TableNormal"/>'
    '<w:uiPriority w:val="59"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>'
    '<w:rPr><w:sz w:val="17"/><w:szCs w:val="17"/></w:rPr>'
    '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/>'
    '<w:tblBorders>' + ''.join('<w:%s w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/>' % b
                              for b in ("top", "left", "bottom", "right", "insideH", "insideV")) + '</w:tblBorders>'
    '<w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/>'
    '<w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr>'
    '<w:tblStylePr w:type="firstRow"><w:pPr><w:keepNext/></w:pPr><w:rPr><w:b/><w:bCs/><w:color w:val="1F3864"/></w:rPr>'
    '<w:tblPr/><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>'
    '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="D9EAF7"/><w:vAlign w:val="bottom"/></w:tcPr></w:tblStylePr>'
    '</w:style>'))

# code blocks (pandoc "Source Code" paragraph style) used for diagrams and wireframes
if 'w:styleId="SourceCode"' not in st:
    st = st.replace('</w:styles>', para_style("SourceCode", "Source Code",
        '<w:keepLines/><w:wordWrap w:val="off"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>'
        '<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="BFC8D6"/><w:left w:val="single" w:sz="4" w:space="4" w:color="BFC8D6"/>'
        '<w:bottom w:val="single" w:sz="4" w:space="4" w:color="BFC8D6"/><w:right w:val="single" w:sz="4" w:space="4" w:color="BFC8D6"/></w:pBdr>'
        '<w:shd w:val="clear" w:color="auto" w:fill="F5F7FA"/>',
        '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New" w:cs="Courier New"/><w:sz w:val="15"/><w:szCs w:val="15"/>',
        nxt="BodyText") + '</w:styles>')
st = re.sub(r'(<w:style w:type="character" [^>]*w:styleId="VerbatimChar">.*?<w:rPr>).*?(</w:rPr>)',
            r'\1<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New" w:cs="Courier New"/><w:sz w:val="15"/><w:szCs w:val="15"/>\2',
            st, count=1, flags=re.S)
# TOC entry styles for the static table of contents (Word regenerates it on open)
for sid, name, ind, bold, before in [("TOC1", "toc 1", 0, True, 80), ("TOC2", "toc 2", 220, False, 0)]:
    if 'w:styleId="%s"' % sid not in st:
        st = st.replace('</w:styles>', para_style(sid, name,
            '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="10070"/></w:tabs><w:spacing w:before="%d" w:after="20"/><w:ind w:left="%d"/>' % (before, ind),
            ('<w:b/>' if bold else '') + '<w:sz w:val="19"/><w:szCs w:val="19"/>', nxt="BodyText", extra='<w:uiPriority w:val="39"/>') + '</w:styles>')
files["word/styles.xml"] = st.encode("utf-8")

# page setup (US Letter, 0.75in margins) + footer reference
doc = files["word/document.xml"].decode("utf-8")
sect = ('<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter1"/>'
        '<w:footnotePr><w:numRestart w:val="eachSect"/></w:footnotePr>'
        '<w:pgSz w:w="12240" w:h="15840"/>'
        '<w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="576" w:footer="576" w:gutter="0"/></w:sectPr>')
doc = re.sub(r'<w:sectPr>.*?</w:sectPr>', sect, doc, count=1, flags=re.S)
if 'xmlns:r=' not in doc[:2000]:
    doc = doc.replace('<w:document ', '<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)
files["word/document.xml"] = doc.encode("utf-8")

def fld(code):
    return ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> %s </w:instrText></w:r>'
            '<w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>') % code
rpr = '<w:rPr><w:color w:val="7F7F7F"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr>'
footer = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          '<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
          'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
          '<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="BFBFBF"/></w:pBdr>'
          '<w:tabs><w:tab w:val="right" w:pos="10080"/></w:tabs>%s</w:pPr>'
          '<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r><w:r>%s<w:tab/><w:t xml:space="preserve">Page </w:t></w:r>%s'
          '<w:r>%s<w:t xml:space="preserve"> of </w:t></w:r>%s</w:p></w:ftr>') % (
    rpr, rpr, FOOTER_TEXT, rpr, fld("PAGE").replace('<w:r>', '<w:r>' + rpr), rpr,
    fld("NUMPAGES").replace('<w:r>', '<w:r>' + rpr))
files["word/footer1.xml"] = footer.encode("utf-8")

rels = files["word/_rels/document.xml.rels"].decode("utf-8")
if "rIdFooter1" not in rels:
    rels = rels.replace('</Relationships>',
        '<Relationship Id="rIdFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>')
files["word/_rels/document.xml.rels"] = rels.encode("utf-8")

ct = files["[Content_Types].xml"].decode("utf-8")
if "footer1.xml" not in ct:
    ct = ct.replace('</Types>', '<Override PartName="/word/footer1.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>')
files["[Content_Types].xml"] = ct.encode("utf-8")

se = files["word/settings.xml"].decode("utf-8")
if "updateFields" not in se:
    se = se.replace('<w:zoom w:percent="100" />', '<w:zoom w:percent="100" /><w:updateFields w:val="true"/>')
files["word/settings.xml"] = se.encode("utf-8")

with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for n, b in files.items():
        z.writestr(n, b)
print("wrote", OUT)
