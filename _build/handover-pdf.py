"""HANDOVER.md -> styled HTML -> PDF (headless Edge). py _build/handover-pdf.py <out.pdf>"""
import markdown, subprocess, sys, os, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
md = (root / "HANDOVER.md").read_text(encoding="utf8")
body = markdown.markdown(md, extensions=["tables", "fenced_code"])
fonts = (root / "assets" / "fonts").as_uri()
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>Developer Handover - Hill Bottom Properties</title>
<style>
@font-face{{font-family:Inter;src:url({fonts}/Inter-Regular.ttf);font-weight:400}}
@font-face{{font-family:Inter;src:url({fonts}/Inter-Medium.ttf);font-weight:500}}
@font-face{{font-family:Inter;src:url({fonts}/Inter-Semibold.ttf);font-weight:600}}
@page{{size:A4;margin:18mm 17mm 20mm}}
body{{font:400 9.6pt/1.55 Inter,sans-serif;color:#1F2A3A}}
h1{{font-size:21pt;font-weight:600;color:#0D1B30;margin:0 0 14pt;padding-bottom:10pt;border-bottom:2pt solid #907B46}}
h2{{font-size:12.5pt;font-weight:600;color:#0D1B30;margin:20pt 0 6pt;break-after:avoid}}
h3{{font-size:10.5pt;font-weight:600;color:#907B46;margin:14pt 0 4pt;break-after:avoid}}
table{{width:100%;border-collapse:collapse;margin:6pt 0 10pt;font-size:8.8pt;break-inside:auto}}
th,td{{text-align:left;vertical-align:top;padding:5pt 7pt;border-bottom:.5pt solid #D9DCE2}}
th{{font-weight:600;color:#0D1B30;background:#F1F2F5}}
tr{{break-inside:avoid}}
thead:has(th:empty){{display:none}}
code{{font-family:Consolas,monospace;font-size:8.6pt;background:#F1F2F5;padding:0 3pt}}
pre{{background:#0D1B30;color:#E8DBB8;padding:9pt 11pt;font-size:8.4pt;line-height:1.5;break-inside:avoid}}
pre code{{background:none;color:inherit;padding:0}}
hr{{border:0;border-top:.5pt solid #D9DCE2;margin:14pt 0}}
a{{color:#6E5A2C}}
li{{margin:2pt 0}}
</style></head><body>{body}</body></html>"""
tmp = root / "_build" / "_scratch" / "handover.html"
tmp.parent.mkdir(exist_ok=True)
tmp.write_text(html, encoding="utf8")
out = os.path.abspath(sys.argv[1])
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
subprocess.run([edge, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={out}", tmp.as_uri()], check=True, timeout=120)
print("wrote", out)
