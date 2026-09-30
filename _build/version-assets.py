"""Give replaced media new filenames so browsers holding year-long immutable
copies fetch the new versions. py _build/version-assets.py"""
import os, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
RENAME = {  # base name -> versioned base name
    "feedback-urban": "urban-kaza-dusk-v2",
    "feedback-gallery-01": "urban-kaza-elevation-v2",
    "feedback-gallery-02": "urban-kaza-street-v2",
    "feedback-gallery-03": "urban-kaza-podium-v2",
    "feedback-gallery-05": "urban-kaza-aerial-v2",
    "kaza-apt-01": "kaza-apt-01-v2",
    "urban-kaza-ext": "urban-kaza-ext-v2",
    "urban-kaza-model-reference": "urban-kaza-model-reference-v2",
    "urban-kaza-showcase": "urban-kaza-showcase-v2",
}
# 1. rename files on disk
for d in ("assets/img", "assets/video"):
    for f in os.listdir(R / d):
        for old, new in RENAME.items():
            m = re.fullmatch(re.escape(old) + r"(-\d+)?\.(webp|mp4)", f)
            if m:
                os.rename(R / d / f, R / d / (new + (m.group(1) or "") + "." + m.group(2)))
                print(f, "->", new + (m.group(1) or "") + "." + m.group(2))
# 2. rewrite references in sources (whole-name matches only)
pat = re.compile(r"(?<![\w-])(" + "|".join(map(re.escape, sorted(RENAME, key=len, reverse=True))) + r")(?![\w])(?!-v2)")
for p in list((R / "_build").glob("*.mjs")) + list((R / "_build/pages").glob("*.mjs")) + [R / "_build/images.json"]:
    s = p.read_text(encoding="utf8")
    t = pat.sub(lambda m: RENAME[m.group(1)], s)
    if t != s:
        p.write_text(t, encoding="utf8"); print("updated", p.name)
