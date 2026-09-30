"""Replace the garbled 'URBRNKAZA / HOTEL APARTMENTS' screen graphic in kaza-apt-01 with the official Urban Kaza lockup."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from glyphs import glyph
ROOT = r"C:/Users/Ident/hillbottom-website/"
src = Image.open(ROOT + "_build/kaza-fix/originals/kaza-apt-01-1400.webp").convert("RGB")
im = np.array(src).astype(np.float32)

SX0, SY0, SX1, SY1 = 530, 366, 772, 526     # screen interior sample area
LX0, LY0, LX1, LY1 = 604, 368, 720, 506     # old graphic
yy, xx = np.mgrid[SY0:SY1, SX0:SX1]
keep = ~((xx >= LX0 - 4) & (xx < LX1 + 4) & (yy >= LY0 - 4) & (yy < LY1 + 4))
X = (xx - 650) / 120.0; Y = (yy - 446) / 80.0
def basis(X, Y):
    return np.stack([np.ones_like(X), X, Y, X*X, X*Y, Y*Y, X**3, X*X*Y, X*Y*Y, Y**3], -1)
B = basis(X[keep], Y[keep])
reg = im[SY0:SY1, SX0:SX1]
fit = np.zeros_like(reg)
for c in range(3):
    coef, *_ = np.linalg.lstsq(B, reg[..., c][keep], rcond=None)
    fit[..., c] = basis(X, Y) @ coef
noise = np.random.default_rng(7).normal(0, 1.3, fit.shape)
a = np.zeros(reg.shape[:2], np.float32)
a[(yy >= LY0) & (yy < LY1) & (xx >= LX0) & (xx < LX1)] = 1
a = np.array(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255
reg[:] = reg * (1 - a[..., None]) + (fit + noise) * a[..., None]

# ---- official lockup, printed in the screen's warm taupe ----
SS = 6
W, H = 96 * SS, 70 * SS
lay = Image.new("L", (W, H), 0)
kcap = 17 * SS
kz = [glyph(c, kcap) for c in "KAZA"]
gap = int(kcap * 0.34)
tot = sum(g.width for g in kz) + gap * 3
x = (W - tot) // 2; ky = 22 * SS
for g in kz: lay.paste(g, (x, ky), g); x += g.width + gap
ucap = int(kcap * 0.43)
ur = [glyph(c, ucap) for c in "URBAN"]
ug = int(ucap * 0.95)
ut = sum(g.width for g in ur) + ug * 4
x = (W - ut) // 2
for g in ur: lay.paste(g, (x, ky - ucap - int(ucap * 0.75)), g); x += g.width + ug
font = ImageFont.truetype(ROOT + "assets/fonts/FuturaPTLight.otf", int(ucap * 0.95))
d = ImageDraw.Draw(lay)
txt = "LIVING ACTIVATED"
track = ucap * 0.42
widths = [d.textlength(ch, font=font) for ch in txt]
tw = sum(widths) + track * (len(txt) - 1)
x = (W - tw) / 2; ty = ky + kcap + int(ucap * 0.9)
for ch, w in zip(txt, widths):
    d.text((x, ty), ch, font=font, fill=255); x += w + track
lay = lay.transform(lay.size, Image.AFFINE, (1, 0, 0, -0.03, 1, 0), Image.BICUBIC)
m = np.array(lay.resize((96, 70), Image.LANCZOS)).astype(np.float32) / 255 * 0.86
ox, oy = 662 - 48, 444 - 35
ink = np.array([104, 92, 80], np.float32)
r = im[oy:oy + 70, ox:ox + 96]
r[:] = r * (1 - m[..., None]) + ink * m[..., None]
out = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8))
out.save(ROOT + "assets/img/kaza-apt-01-1400.webp", quality=88, method=6)
out.resize((800, round(800 * out.height / out.width)), Image.LANCZOS).save(ROOT + "assets/img/kaza-apt-01-800.webp", quality=86, method=6)
out.crop((500, 320, 800, 560)).resize((750, 600), Image.LANCZOS).save(ROOT + "_build/kaza-fix/stage-apt.png")
print("ok")
