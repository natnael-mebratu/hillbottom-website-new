import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/vfix"); sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from track import run
from glyphs import glyph
R = r"C:/Users/Ident/hillbottom-website/"
def smooth_fill(im, S, L):
    SX0, SY0, SX1, SY1 = S; LX0, LY0, LX1, LY1 = L
    yy, xx = np.mgrid[SY0:SY1, SX0:SX1]
    keep = ~((xx >= LX0 - 3) & (xx < LX1 + 3) & (yy >= LY0 - 3) & (yy < LY1 + 3))
    X = (xx - (SX0 + SX1) / 2) / ((SX1 - SX0) / 2); Y = (yy - (SY0 + SY1) / 2) / ((SY1 - SY0) / 2)
    B = lambda X, Y: np.stack([np.ones_like(X), X, Y, X*X, X*Y, Y*Y, X**3, X*X*Y, X*Y*Y, Y**3], -1)
    reg = im[SY0:SY1, SX0:SX1]; fit = np.zeros_like(reg)
    for c in range(3):
        co, *_ = np.linalg.lstsq(B(X[keep], Y[keep]), reg[..., c][keep], rcond=None); fit[..., c] = B(X, Y) @ co
    a = np.zeros(reg.shape[:2], np.float32); a[(yy >= LY0) & (yy < LY1) & (xx >= LX0) & (xx < LX1)] = 1
    a = np.array(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(7))).astype(np.float32) / 255
    reg[:] = reg * (1 - a[..., None]) + (fit + np.random.default_rng(5).normal(0, 1.0, fit.shape)) * a[..., None]
def lockup_ink(im, cx, cy, W):
    SS = 8; w, h = W, int(W * 0.62)
    lay = Image.new("L", (w * SS, h * SS), 0)
    kc = int(w * SS * 0.2); kz = [glyph(c, kc) for c in "KAZA"]; gap = int(kc * .34)
    tot = sum(g.width for g in kz) + gap * 3; x = (w * SS - tot) // 2; ky = int(h * SS * .33)
    for g in kz: lay.paste(g, (x, ky), g); x += g.width + gap
    uc = int(kc * .43); ur = [glyph(c, uc) for c in "URBAN"]; ug = int(uc * .95); ut = sum(g.width for g in ur) + ug * 4; x = (w * SS - ut) // 2
    for g in ur: lay.paste(g, (x, ky - uc - int(uc * .75)), g); x += g.width + ug
    font = ImageFont.truetype(R + "assets/fonts/FuturaPTLight.otf", int(uc * .95)); d = ImageDraw.Draw(lay)
    txt = ""; tr = uc * .42; ws = [d.textlength(c, font=font) for c in txt]; tw = sum(ws) + tr * (len(txt) - 1)
    x = (w * SS - tw) / 2; ty = ky + kc + int(uc * .9)
    for c, cw in zip(txt, ws): d.text((x, ty), c, font=font, fill=255); x += cw + tr
    m = np.array(lay.resize((w, h), Image.LANCZOS)).astype(np.float32) / 255 * .85
    x0, y0 = int(cx - w / 2), int(cy - h / 2); r = im[y0:y0 + h, x0:x0 + w]
    r[:] = r * (1 - m[..., None]) + np.array([96, 84, 74], np.float32) * m[..., None]
def patch(im):
    smooth_fill(im, (482, 286, 708, 446), (540, 296, 664, 432))
    lockup_ink(im, 601, 368, 84)
run(6, 0, patch, roi=(400, 250, 780, 480), mask_box=(528, 292, 678, 440), out_dir="_build/vfix/f6")
