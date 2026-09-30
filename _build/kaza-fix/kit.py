"""Reusable pieces for re-signing Urban Kaza renders with the official letterforms."""
import sys, numpy as np, cv2
from PIL import Image, ImageFilter, ImageDraw
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from glyphs import glyph
WARM = np.array([255, 192, 115], np.float32)

def rebuild_fin(im, fx0, fx1, y0, y1, cy0, cy1, gain=1.04):
    """Replace a lettered stone fin with texture tiled from its clean lower run."""
    clean = im[cy0:cy1, fx0:fx1].copy()
    tile = np.concatenate([clean, clean[::-1]], 0)
    reps = (y1 - y0) // len(tile) + 2
    fill = np.concatenate([tile] * reps, 0)[: y1 - y0]
    ref = im[y0:y1, fx0:fx1]
    px = ref.reshape(-1, 3); lum = px.mean(1)
    base = px[lum < np.percentile(lum, 45)].mean(0)
    fill = fill * (base / fill.reshape(-1, 3).mean(0)) * gain
    h, w = fill.shape[:2]
    a = np.ones((h, w), np.float32)
    for i in range(3): a[:, i] = a[:, -1 - i] = (i + 1) / 4
    for i in range(10): a[i] *= (i + 1) / 11; a[-1 - i] *= (i + 1) / 11
    im[y0:y1, fx0:fx1] = fill * a[..., None] + ref * (1 - a[..., None])

def stack_mask(size, text, slots, top, pitch, cx, cap, maxw, SS=4):
    lay = Image.new("L", (size[0] * SS, size[1] * SS), 0)
    for ch, s in zip(text, slots):
        g = glyph(ch, cap * SS)
        if g.width > maxw * SS: g = g.resize((maxw * SS, g.height), Image.LANCZOS)
        lay.paste(g, (int(cx * SS - g.width / 2), int((top + s * pitch) * SS)), g)
    return lay.resize(size, Image.LANCZOS)

def lockup_mask(width, kcap, SS=6, ukscale=0.40, track=0.36):
    """URBAN over KAZA, official geometry; returns an L mask sized to `width`."""
    kc = kcap * SS
    kz = [glyph(c, kc) for c in "KAZA"]
    gap = int(kc * track)
    tot = sum(g.width for g in kz) + gap * 3
    uc = int(kc * ukscale)
    ur = [glyph(c, uc) for c in "URBAN"]
    ug = int(uc * 0.95)
    ut = sum(g.width for g in ur) + ug * 4
    W = max(tot, ut); H = kc + uc + int(uc * 0.8)
    lay = Image.new("L", (W, H), 0)
    x = (W - tot) // 2
    for g in kz: lay.paste(g, (x, H - kc), g); x += g.width + gap
    x = (W - ut) // 2
    for g in ur: lay.paste(g, (x, 0), g); x += g.width + ug
    h = round(H * width / W)
    return lay.resize((width, h), Image.LANCZOS)

def halo_letters(im, mask, face=(46, 38, 34), glow=1.0, wide=0.4, offset=(0, 0), face_alpha=0.9):
    m = np.array(mask).astype(np.float32) / 255
    sh = mask.transform(mask.size, Image.AFFINE, (1, 0, -offset[0], 0, 1, -offset[1]))
    halo = np.array(sh.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(2.0))).astype(np.float32) / 255
    hw = np.array(sh.filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255
    im += (WARM - im) * np.clip(halo * 1.35 * glow, 0, 1)[..., None] * 0.92
    im += WARM * (hw * wide)[..., None]
    f = np.array(face, np.float32)
    im[:] = im * (1 - m[..., None] * face_alpha) + f * (m[..., None] * face_alpha)

def erase_sign(im, box, thr=18, dil=4, grain=1.8, seed=1, above=None, below=None):
    """Inpaint lettering (dark faces + bright halos) out of a flat sign band."""
    x0, y0, x1, y1 = box
    reg = im[y0:y1, x0:x1]
    lum = reg.mean(2)
    med = np.median(lum)
    mask = (np.abs(lum - med) > thr).astype(np.uint8) * 255
    mask = cv2.dilate(mask, np.ones((dil * 2 + 1, dil * 2 + 1), np.uint8))
    if above is not None:  # keep everything above the band's top edge untouched
        yy, xx = np.mgrid[y0:y1, x0:x1]
        mask[yy < above(xx)] = 0
    if below is not None:
        yy, xx = np.mgrid[y0:y1, x0:x1]
        mask[yy > below(xx)] = 0
    u8 = np.clip(reg, 0, 255).astype(np.uint8)
    fixed = cv2.inpaint(u8[..., ::-1].copy(), mask, 7, cv2.INPAINT_TELEA)[..., ::-1].astype(np.float32)
    fixed = cv2.GaussianBlur(fixed, (0, 0), 1.2) * (mask[..., None] / 255) + fixed * (1 - mask[..., None] / 255)
    fixed += np.random.default_rng(seed).normal(0, grain, fixed.shape) * (mask[..., None] / 255)
    im[y0:y1, x0:x1] = fixed
    return mask

def place(im, mask, x, y, fn, **kw):
    """Run a letter-painting fn on a sub-region at (x, y)."""
    P = 16
    big = Image.new("L", (mask.width + 2 * P, mask.height + 2 * P), 0)
    big.paste(mask, (P, P))
    sub = im[y - P:y - P + big.height, x - P:x - P + big.width]
    fn(sub, big, **kw)
