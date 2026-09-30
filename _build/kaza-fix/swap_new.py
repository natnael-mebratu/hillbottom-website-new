"""Client-supplied re-renders (29 Sep 2026) replace four site images."""
import sys, numpy as np
from PIL import Image
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from kit import erase_sign, lockup_mask, place, halo_letters
SRC = r"C:/Users/Ident/OneDrive/Desktop/3. Monthly Retainers/1. Hillbottom & Urban Kaza/5. Renders/"
OUT = r"C:/Users/Ident/hillbottom-website/assets/img/"
MAP = {"09453f1d-c2bf-415f-935d-f01478a1d795.png": "feedback-urban",
       "42efe176-b395-4847-bda1-4e82243895bf.png": "feedback-gallery-01",
       "5760b195-22e3-49e4-a213-ccad13188308.png": "feedback-gallery-03",
       "f3c7647a-0292-4105-bf63-28858b2b6d60.png": "feedback-gallery-02"}
for f, name in MAP.items():
    im = np.array(Image.open(SRC + f).convert("RGB")).astype(np.float32)
    if name == "feedback-urban":  # the render still carries KAZA LIVING on the podium sign
        erase_sign(im, (496, 880, 574, 914), thr=14, dil=2, below=lambda x: 908 + 0 * x)
        m = lockup_mask(56, 13)
        place(im, m, 535 - m.width // 2, 884, halo_letters, face=(30, 30, 34), glow=0.9, wide=0.3, offset=(0, 1), face_alpha=0.9)
        Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((440, 840, 640, 940)).resize((800, 400)).save(r"C:/Users/Ident/hillbottom-website/_build/vfix/n1fix.png")
    Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(OUT + name + ".webp", quality=88, method=6)
    print(name, "ok")
