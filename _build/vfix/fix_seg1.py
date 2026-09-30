import sys; sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/vfix"); sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")
from track import run
from kit import erase_sign, lockup_mask, place, halo_letters
def patch(im):
    erase_sign(im, (562, 446, 758, 519), thr=11, dil=3, below=lambda x: 514)
    m = lockup_mask(142, 27)
    place(im, m, 660 - m.width // 2, 462, halo_letters, face=(20, 24, 32), glow=1.0, wide=0.35, offset=(0, 2), face_alpha=0.95)
run(1, 75, patch, roi=(380, 380, 940, 640), mask_box=(540, 430, 780, 525), out_dir="_build/vfix/f1")
