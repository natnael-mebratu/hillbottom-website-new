"""Slice official Urban Kaza glyphs out of the rasterised lockup."""
import numpy as np
from PIL import Image
L = Image.open(r"C:/Users/Ident/hillbottom-website/_build/kaza-fix/lockup-paths.png").convert("RGBA")
A = np.array(L)[:, :, 3]
S = 4126 / 1031.56

def row(y0, y1, merge):
    band = A[int(y0 * S):int(y1 * S)]
    cols = band.max(0) > 20
    segs, start = [], None
    for x, on in enumerate(cols):
        if on and start is None: start = x
        if not on and start is not None: segs.append([start, x]); start = None
    if start is not None: segs.append([start, len(cols)])
    out = [segs[0]]
    for s in segs[1:]:
        if s[0] - out[-1][1] < merge * S: out[-1][1] = s[1]
        else: out.append(s)
    return [Image.fromarray(band[:, a:b]) for a, b in out]

URBAN = dict(zip("URBAN", row(0, 92, 20)))
KAZA = row(190, 404, 60)
GLYPH = {"K": KAZA[0], "A": KAZA[1], "Z": KAZA[2], **{k: URBAN[k] for k in "URBN"}}
# row(...) returns alpha masks (L mode). Heights: URBAN row cap ~91u, KAZA row cap ~212u.

def glyph(ch, cap):
    g = GLYPH[ch]
    bb = g.getbbox(); g = g.crop(bb)
    w = max(1, round(g.width * cap / g.height))
    return g.resize((w, cap), Image.LANCZOS)

def lockup_rgba():
    """URBAN + KAZA paths only (text line rendered separately)."""
    return L
