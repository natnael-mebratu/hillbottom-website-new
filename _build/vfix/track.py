"""Replace signage in a video segment: patch one reference frame, then carry the patch
through every other frame with a tracked homography (LK flow chain + ECC refinement)."""
import sys, os, numpy as np, cv2
from PIL import Image
sys.path.insert(0, r"C:/Users/Ident/hillbottom-website/_build/kaza-fix")

def load(d, i): return cv2.imread(f"{d}/{i:03d}.png")[..., ::-1].astype(np.float32)

def run(seg, ref, patch_fn, roi, mask_box, out_dir, n=152, src=None):
    src = src or f"_build/vfix/s{seg}"
    os.makedirs(out_dir, exist_ok=True)
    R = load(src, ref)
    P = R.copy(); patch_fn(P)
    diff = (np.abs(P - R).sum(2) > 3).astype(np.uint8)
    x0, y0, x1, y1 = mask_box
    box = np.zeros_like(diff); box[y0:y1, x0:x1] = 1
    diff = diff * box
    M = cv2.dilate(diff, np.ones((9, 9), np.uint8)).astype(np.float32)
    M = cv2.GaussianBlur(M, (0, 0), 3)
    M = np.clip(M * 1.6, 0, 1)
    ring = (cv2.dilate((M > 0.01).astype(np.uint8), np.ones((31, 31), np.uint8)) - (M > 0.01)).astype(bool)
    g = lambda im: cv2.cvtColor(np.clip(im, 0, 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    rx0, ry0, rx1, ry1 = roi
    roimask = np.zeros(R.shape[:2], np.uint8); roimask[ry0:ry1, rx0:rx1] = 255
    Rg = g(R)
    H = {ref: np.eye(3, dtype=np.float32)}
    for order in (range(ref + 1, n), range(ref - 1, -1, -1)):
        prev_i = ref; prev = Rg; Hp = np.eye(3, dtype=np.float32)
        for i in order:
            cur = g(load(src, i))
            # features inside the tracked ROI, carried into the previous frame's coordinates
            wm = cv2.warpPerspective(roimask, Hp, (cur.shape[1], cur.shape[0]))
            pts = cv2.goodFeaturesToTrack(prev, 600, 0.01, 6, mask=wm)
            Hs = np.eye(3, dtype=np.float32)
            if pts is not None and len(pts) > 12:
                nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, cur, pts, None, winSize=(21, 21), maxLevel=3)
                ok = st.ravel() == 1
                if ok.sum() > 10:
                    Hs, _ = cv2.findHomography(pts[ok], nxt[ok], cv2.RANSAC, 1.5)
                    if Hs is None: Hs = np.eye(3)
            Hc = (Hs @ Hp).astype(np.float32)
            # refine against the reference directly to cancel drift
            try:
                _, Hr = cv2.findTransformECC(Rg, cur, Hc.copy(), cv2.MOTION_HOMOGRAPHY,
                                             (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 60, 1e-5), roimask, 5)
                if np.abs(Hr - Hc).max() < 8: Hc = Hr
            except cv2.error:
                pass
            H[i] = Hc; Hp = Hc; prev = cur
    for i in range(n):
        F = load(src, i)
        h, w = F.shape[:2]
        Pw = cv2.warpPerspective(P, H[i], (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        Rw = cv2.warpPerspective(R, H[i], (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        Mw = cv2.warpPerspective(M, H[i], (w, h))[..., None]
        rw = cv2.warpPerspective(ring.astype(np.uint8), H[i], (w, h)).astype(bool)
        # match the frame's exposure/grade around the patch
        if rw.sum() > 50:
            gain = (F[rw].mean(0) + 1) / (Rw[rw].mean(0) + 1)
            Pw = Pw * gain
        out = F * (1 - Mw) + Pw * Mw
        cv2.imwrite(f"{out_dir}/{i:03d}.png", np.clip(out, 0, 255).astype(np.uint8)[..., ::-1])
    print("seg", seg, "done")
