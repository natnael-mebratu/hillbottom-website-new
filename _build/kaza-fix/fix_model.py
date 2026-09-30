import sys, numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from kit import rebuild_fin, stack_mask
R = r"C:/Users/Ident/hillbottom-website/"
im = np.array(Image.open(R + "_build/kaza-fix/originals/urban-kaza-model-reference.webp").convert("RGB")).astype(np.float32)
h, w = im.shape[:2]
rebuild_fin(im, 1098, 1144, 240, 1140, 1150, 1520, gain=1.0)
mask = stack_mask((w, h), "URBANKAZA", [0, 1, 2, 3, 4, 6, 7, 8, 9], 253, 90, 1121, 58, 34)
def shift(m, dx, dy): return m.transform(m.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy))
f = lambda m: np.array(m).astype(np.float32)[..., None] / 255
wall = im.copy()
# soft cast shadow, then the returned edge of the relief, then the lit face
sh = f(shift(mask, 5, 7).filter(ImageFilter.GaussianBlur(3.5)))
im *= 1 - sh * 0.30
for d in (3, 2, 1):
    e = f(shift(mask, d, d * 1.2))
    im = im * (1 - e) + (wall * 0.80) * e
face = f(mask)
im = im * (1 - face) + np.clip(wall * 1.05 + 4, 0, 255) * face
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(R + "assets/img/urban-kaza-model-reference.webp", quality=88, method=6)
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((1040, 200, 1220, 1200)).save(R + "_build/kaza-fix/stage-model.png")
print("ok")
