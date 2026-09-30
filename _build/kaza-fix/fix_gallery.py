import sys, numpy as np
from PIL import Image
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from kit import *
R = r"C:/Users/Ident/hillbottom-website/"
O = R + "_build/kaza-fix/originals/"

def load(n): return np.array(Image.open(O + n).convert("RGB")).astype(np.float32)
def save(im, n):
    Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(R + "assets/img/" + n, quality=90, method=6)

# ---- gallery 01: vertical fin ----
im = load("feedback-gallery-01.webp")
rebuild_fin(im, 498, 537, 118, 664, 668, 836)
h, w = im.shape[:2]
pitch = (650 - 132 - 28) / 9
mask = stack_mask((w, h), "URBANKAZA", [0, 1, 2, 3, 4, 6, 7, 8, 9], 132, pitch, 516.5, 28, 23)
halo_letters(im, mask, face=(40, 36, 34))
save(im, "feedback-gallery-01.webp")

# ---- gallery 03: large halo sign on the podium band ----
im = load("feedback-gallery-03.webp")
erase_sign(im, (618, 659, 830, 733), thr=16, dil=3)
m = lockup_mask(164, 32)
x = 722 - m.width // 2; y = 664
place(im, m, x, y, halo_letters, face=(22, 26, 34), glow=1.0, wide=0.35, offset=(0, 2), face_alpha=0.95)
save(im, "feedback-gallery-03.webp")

# ---- gallery 02: sheared sign 'KAZA WING' ----
im = load("feedback-gallery-02.webp")
erase_sign(im, (250, 508, 346, 596), thr=22, dil=3, above=lambda x: 528 - (x - 230) * 0.16, below=lambda x: 592 - (x - 250) * 0.2)
m = lockup_mask(74, 22)
shear = -0.16
m = m.transform((m.width, m.height + 14), Image.AFFINE, (1, 0, 0, -shear, 1, -12), Image.BICUBIC)
place(im, m, 258, 528, halo_letters, face=(18, 22, 30), glow=1.0, wide=0.3, offset=(1, 2), face_alpha=0.95)
save(im, "feedback-gallery-02.webp")
print("ok")
