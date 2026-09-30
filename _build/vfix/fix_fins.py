import sys; sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/vfix"); sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from track import run
from kit import rebuild_fin, stack_mask, halo_letters, erase_sign, lockup_mask, place
SLOTS = [0, 1, 2, 3, 4, 6, 7, 8, 9]
def fin(fx0, fx1, y0, y1, cy0, cy1, top, pitch, cx, cap, maxw):
    def f(im):
        rebuild_fin(im, fx0, fx1, y0, y1, cy0, cy1)
        h, w = im.shape[:2]
        halo_letters(im, stack_mask((w, h), "URBANKAZA", SLOTS, top, pitch, cx, cap, maxw), face=(40, 36, 34), glow=0.85, wide=0.28)
    return f
which = sys.argv[1:]
if "0" in which:
    run(0, 151, fin(472, 505, 0, 446, 452, 572, 10, 44.4, 488, 27, 21), roi=(380, 0, 620, 600), mask_box=(466, 0, 510, 452), out_dir="_build/vfix/f0")
if "3" in which:
    run(3, 151, fin(671, 701, 0, 410, 420, 570, 20, 38.9, 688.5, 26, 19), roi=(560, 0, 820, 620), mask_box=(665, 0, 706, 416), out_dir="_build/vfix/f3a")
if "3s" in which:
    def sign(im):
        erase_sign(im, (428, 640, 476, 672), thr=14, dil=2)
        m = lockup_mask(38, 9)
        place(im, m, 451 - m.width // 2, 643, halo_letters, face=(22, 26, 34), glow=0.9, wide=0.25, offset=(0, 1), face_alpha=0.9)
    run(3, 0, sign, roi=(300, 560, 700, 720), mask_box=(420, 632, 484, 680), out_dir="_build/vfix/f3", src="_build/vfix/f3a")
