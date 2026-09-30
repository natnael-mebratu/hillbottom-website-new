"""Rename the façade lettering on feedback-urban.webp from KAZA LIVING to URBAN KAZA."""
import sys, numpy as np
from PIL import Image, ImageFilter, ImageChops
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from glyphs import glyph
ROOT = r"C:/Users/Ident/hillbottom-website/"
src = Image.open(ROOT + "_build/kaza-fix/originals/feedback-urban.webp").convert("RGB")
im = np.array(src).astype(np.float32)

# ---- 1. rebuild the stone fin from its clean lower section -------------
FX0, FX1 = 735, 773          # fin face (inside its crisp edges)
Y0, Y1 = 118, 624            # lettered span
clean = im[630:826, FX0:FX1].copy()
tile = np.concatenate([clean, clean[::-1]], 0)
fill = np.concatenate([tile] * 3, 0)[: Y1 - Y0]
# match the fin's tone near the letters (wall lit a touch warmer higher up)
ref = im[Y0:Y1, FX0:FX1]
dark = ref.reshape(-1, 3)
lum = dark.mean(1)
base = dark[lum < np.percentile(lum, 45)].mean(0)
fill = fill * (base / fill.reshape(-1, 3).mean(0)) * 1.04
# feather horizontally 3px into the original edges, vertically 10px
h, w = fill.shape[:2]
a = np.ones((h, w), np.float32)
for i in range(3):
    a[:, i] = a[:, -1 - i] = (i + 1) / 4
for i in range(10):
    a[i, :] *= (i + 1) / 11; a[-1 - i, :] *= (i + 1) / 11
im[Y0:Y1, FX0:FX1] = fill * a[..., None] + ref * (1 - a[..., None])

# ---- 2. halo-lit letters, stacked like the original -------------------
SS = 4
cap = 27
text = "URBANKAZA"
slots = [0, 1, 2, 3, 4, 6, 7, 8, 9]  # slot 5 left open between the words
pitch = (608 - 134) / 9
cx = 755.5
layer = Image.new("L", (src.width * SS, src.height * SS), 0)
for ch, s in zip(text, slots):
    g = glyph(ch, cap * SS)
    if g.width > 22 * SS:  # the apex A/K/Z are wide; keep them on the fin
        g = g.resize((22 * SS, g.height), Image.LANCZOS)
    y = int((134 + s * pitch) * SS)
    x = int(cx * SS - g.width / 2)
    layer.paste(g, (x, y), g)
mask = layer.resize(src.size, Image.LANCZOS)
m = np.array(mask).astype(np.float32) / 255
# halo: the letters stand proud of the wall, lit from behind
halo = np.array(mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(2.2))).astype(np.float32) / 255
halo_wide = np.array(mask.filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255
warm = np.array([255, 196, 120], np.float32)
out = im.copy()
out = out + (warm - out) * np.clip(halo * 1.35, 0, 1)[..., None] * 0.92
out = out + warm * (halo_wide * 0.4)[..., None]
face = np.array([58, 46, 38], np.float32)
out = out * (1 - m[..., None] * 0.9) + face * (m[..., None] * 0.9)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(ROOT + "_build/kaza-fix/stage-fin.png")

# ---- 3. canopy sign: KAZA / LIVING -> official URBAN over KAZA ---------
im2 = out
SX0, SY0, SX1, SY1 = 482, 859, 525, 887
patch = im2[SY0:SY1, SX0:SX1]
# the sign sits on a flat slate band; rebuild it from the band beside the sign
bandL = im2[SY0:SY1, 440:SX0]
bandR = im2[SY0:SY1, SX1:SX1 + 40]
col = np.concatenate([bandL, bandR], 1)
rowmean = np.median(col, 1)  # per-row tone of the band
noise = np.random.default_rng(3).normal(0, 1.6, patch.shape)
im2[SY0:SY1, SX0:SX1] = rowmean[:, None, :] + noise
# lockup: URBAN (small, tracked) over KAZA
W = 34 * SS
lk = Image.new("L", (W, 20 * SS), 0)
kcap = 11 * SS
x = 0
kz = [glyph(c, kcap) for c in "KAZA"]
gap = int(0.42 * kcap)
tot = sum(g.width for g in kz) + gap * 3
scale = min(1, W / tot)
kz = [g.resize((max(1, int(g.width * scale)), int(g.height * scale)), Image.LANCZOS) for g in kz]
gap = int(gap * scale)
tot = sum(g.width for g in kz) + gap * 3
x = (W - tot) // 2
for g in kz:
    lk.paste(g, (x, 20 * SS - g.height), g); x += g.width + gap
ucap = int(kz[0].height * 0.36)
ur = [glyph(c, ucap) for c in "URBAN"]
ugap = int(ucap * 0.9)
utot = sum(g.width for g in ur) + ugap * 4
x = (W - utot) // 2
for g in ur:
    lk.paste(g, (x, 20 * SS - kz[0].height - ucap - int(ucap * 0.8)), g); x += g.width + ugap
lkm = np.array(lk.resize((34, 20), Image.LANCZOS)).astype(np.float32) / 255
gl = np.array(lk.resize((34, 20), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.1))).astype(np.float32) / 255
ox, oy = 486, 863
reg = im2[oy:oy + 20, ox:ox + 34]
lit = np.array([252, 228, 180], np.float32)
reg = reg + np.array([255, 190, 110], np.float32) * (gl * 0.35)[..., None]
reg = reg * (1 - lkm[..., None]) + lit * lkm[..., None]
im2[oy:oy + 20, ox:ox + 34] = reg
res = Image.fromarray(np.clip(im2, 0, 255).astype(np.uint8))
res.save(ROOT + "assets/img/feedback-urban.webp", quality=90, method=6)
res.save(ROOT + "_build/kaza-fix/stage-final.png")
print("done")
