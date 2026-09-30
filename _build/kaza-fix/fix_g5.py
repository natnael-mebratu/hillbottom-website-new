import sys, numpy as np, cv2
from PIL import Image
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from kit import stack_mask, halo_letters
R = r"C:/Users/Ident/hillbottom-website/"
im = np.array(Image.open(R + "_build/kaza-fix/originals/feedback-gallery-05.webp").convert("RGB")).astype(np.float32)
h, w = im.shape[:2]
k = 0.176
# strip following the lettering line
yy, xx = np.mgrid[0:h, 0:w]
cx = 272 + (yy - 568) * k
edge = 289 + (yy - 570) * 0.165
strip = (np.abs(xx - cx) < 16) & (yy > 535) & (yy < 985) & (xx < edge - 1)
lum = im.mean(2)
bg = cv2.medianBlur(np.clip(lum, 0, 255).astype(np.uint8), 21).astype(np.float32)
m = (strip & (np.abs(lum - bg) > 14)).astype(np.uint8) * 255
m = cv2.dilate(m, np.ones((7, 7), np.uint8)) * strip.astype(np.uint8)
u8 = np.clip(im, 0, 255).astype(np.uint8)
fixed = cv2.inpaint(u8[..., ::-1].copy(), m, 9, cv2.INPAINT_TELEA)[..., ::-1].astype(np.float32)
fixed += np.random.default_rng(2).normal(0, 2.2, fixed.shape) * (m[..., None] / 255)
im = fixed
# upright letters, then shear onto the facade line
up = stack_mask((w, h), "URBANKAZA", [0, 1, 2, 3, 4, 6, 7, 8, 9], 548, 42.2, 273, 24, 15)
up = up.transform(up.size, Image.AFFINE, (1, -k, 568 * k, 0, 1, 0), Image.BICUBIC)
halo_letters(im, up, face=(44, 40, 38), glow=0.8, wide=0.18, offset=(2, 1))
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(R + "assets/img/feedback-gallery-05.webp", quality=90, method=6)
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).crop((200, 500, 420, 1000)).save(R + "_build/vfix/g5fix.png")
