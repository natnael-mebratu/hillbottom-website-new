import sys, numpy as np
from PIL import Image
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from kit import erase_sign, lockup_mask, place, halo_letters
R = r"C:/Users/Ident/hillbottom-website/"
im = np.array(Image.open(R + "_build/kaza-fix/originals/urban-kaza-ext-2400.webp").convert("RGB")).astype(np.float32)
erase_sign(im, (1102, 1331, 1148, 1360), thr=10, dil=2, above=lambda x: 1329 + 0 * x, below=lambda x: 1357 + 0 * x)
m = lockup_mask(36, 9)
place(im, m, 1125 - m.width // 2, 1334, halo_letters, face=(24, 26, 30), glow=0.9, wide=0.25, offset=(0, 1), face_alpha=0.9)
out = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8))
out.save(R + "assets/img/urban-kaza-ext-2400.webp", quality=72, method=6)
for w in (1400, 800):
    out.resize((w, round(w * out.height / out.width)), Image.LANCZOS).save(R + f"assets/img/urban-kaza-ext-{w}.webp", quality=80, method=6)
out.crop((1040, 1290, 1210, 1390)).resize((680, 400)).save(R + "_build/vfix/extfix.png")
