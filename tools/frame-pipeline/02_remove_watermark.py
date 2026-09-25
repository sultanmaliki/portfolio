"""Remove the semi-transparent Gemini sparkle from every frame.

Two methods, chosen per frame (see clean_frame):
  * Bright, busy backgrounds (the bokeh-lights opening): invert the alpha blend to recover the real background.
  * Everything else: a plain inpaint, which is already clean on calm/dark backgrounds.
Filling alone cannot work on the bokeh frames because the star sits on top of real lights that no fill can guess.

The watermark is composited as  observed = (1 - a) * background + a * W   (W ~ white, a = per-pixel opacity).
Fit `a` and `W` from frames whose background under the star is smooth (so it can be estimated by
inpainting), then solve for the true background in every frame:  background = (observed - a*W) / (1 - a).
That restores real detail (e.g. bokeh lights) that no fill method can guess.

usage: python 02_remove_watermark.py fit       -> analysis/alpha.npz + analysis/alpha_fit.png (fit opacity map)
       python 02_remove_watermark.py preview   -> analysis/preview_alpha.png (cleaned corners of 12 sample frames)
       python 02_remove_watermark.py run       -> clean/frame_XXX.png (all frames, overwrites)
"""
import glob, os, sys
import cv2
import numpy as np

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
SRC = os.path.join(WORK, "originals")
CLEAN = os.path.join(WORK, "clean")
AN = os.path.join(WORK, "analysis")
X0, Y0 = 660, 320  # window used by 01_analyze.py
files = sorted(glob.glob(os.path.join(SRC, "*.webp")))
med = np.load(os.path.join(AN, "median_highpass.npy"))


def build_mask(thresh=22, grow=9):
    m = (med > thresh).astype(np.uint8)
    _, labels, _, _ = cv2.connectedComponentsWithStats(m)
    ys, xs = np.unravel_index(np.argmax(med), med.shape)
    star = (labels == labels[ys, xs]).astype(np.uint8)
    star = cv2.dilate(star, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (grow, grow)))
    full = np.zeros((450, 800), np.uint8)
    full[Y0:Y0 + star.shape[0], X0:X0 + star.shape[1]] = star * 255
    return full


MASK = build_mask()
ys, xs = np.where(MASK > 0)
BX0, BY0, BX1, BY1 = int(xs.min()) - 14, int(ys.min()) - 14, int(xs.max()) + 15, int(ys.max()) + 15
ROI = (slice(BY0, BY1), slice(BX0, BX1))


def bg_estimate(img):
    """Background under the star estimated by inpainting (only trustworthy where the background is smooth)."""
    return cv2.inpaint(img, MASK, 5, cv2.INPAINT_TELEA)


def ring_complexity(img):
    """Std of luminance in an annulus around the star: low = smooth background."""
    ring = cv2.dilate(MASK, np.ones((25, 25), np.uint8)) - cv2.dilate(MASK, np.ones((9, 9), np.uint8))
    lum = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    return float(lum[ring > 0].std())


def fit(n_smooth=75):
    imgs = [cv2.imread(f) for f in files]
    comp = np.array([ring_complexity(im) for im in imgs])
    smooth_idx = np.argsort(comp)[:n_smooth]
    obs = np.stack([imgs[i][ROI].astype(np.float32) for i in smooth_idx])          # (N, h, w, 3)
    bg = np.stack([bg_estimate(imgs[i])[ROI].astype(np.float32) for i in smooth_idx])
    d = obs - bg                                                                     # = a * (W - bg)
    core = cv2.erode(MASK, np.ones((5, 5), np.uint8))[ROI] > 0

    # The watermark colour is white. (Regressing for it is ill-conditioned: the smoothest frames all share almost
    # the same background, so it is fixed here and only the per-pixel opacity is fitted.)
    # (A scan of W in 190..254 minimises the residual at W = 254, i.e. white.)
    W = np.array([254.0, 254.0, 254.0], np.float32)
    print("fit on %d smooth frames (ring std <= %.2f)" % (n_smooth, comp[smooth_idx].max()))

    # Per-pixel opacity map: least squares over frames and channels of  d = a * (W - bg)
    diff = W[None, None, None, :] - bg
    a_map = (d * diff).sum(axis=(0, 3)) / np.maximum((diff * diff).sum(axis=(0, 3)), 1e-6)
    a_map = np.clip(a_map, 0, 0.95)
    a_map[a_map < 0.015] = 0  # no watermark influence

    resid = np.sqrt(((d - a_map[None, ..., None] * diff) ** 2).mean())
    print("per-pixel model residual RMS: %.2f grey levels (signal std %.2f)" % (resid, d.std()))
    np.savez(os.path.join(AN, "alpha.npz"), a=a_map, W=W)
    vis = cv2.resize((np.clip(a_map, 0, 1) * 255).astype(np.uint8), None, fx=6, fy=6, interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(os.path.join(AN, "alpha_fit.png"), vis)
    return a_map, W


def load_model():
    z = np.load(os.path.join(AN, "alpha.npz"))
    return z["a"], z["W"]


def fringe_mask(a_map, grad_thresh=0.05, grow=5):
    """Narrow band along the star's edge, where opacity changes abruptly and the per-pixel estimate is noisy
    (compression blur), so the inversion leaves a speckled outline. Repaired with a small inpaint."""
    gx = cv2.Sobel(a_map, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(a_map, cv2.CV_32F, 0, 1, ksize=3)
    band = (np.hypot(gx, gy) > grad_thresh).astype(np.uint8)
    band = cv2.dilate(band, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (grow, grow)))
    full = np.zeros((450, 800), np.uint8)
    full[ROI] = band * 255
    return full


def _invert(roi, a_map, W, gain):
    a = np.clip(a_map * gain, 0, 0.95)[..., None]
    return (roi - a * W[None, None, :]) / np.maximum(1.0 - a, 0.05)


def edge_gain(roi, a_map, W):
    """Per-frame opacity gain (~1.0). The measured opacity wobbles by a few % between frames (codec noise); a wrong
    value leaves a light/dark diamond. Pick the gain at which the recovered star interior matches the untouched
    pixels just outside its edge (the background is continuous across the edge)."""
    k = np.ones((3, 3), np.uint8)
    A = (a_map > 0.15).astype(np.uint8)
    inner = (A - cv2.erode(A, k, iterations=2)) > 0
    outer = (cv2.dilate(A, k, iterations=4) - cv2.dilate(A, k, iterations=2)) > 0
    target = roi[outer].mean(axis=0)
    best = (1e9, 1.0)
    for g in np.linspace(0.8, 1.2, 81):
        rec = _invert(roi, a_map, W, g)
        err = float(np.abs(rec[inner].mean(axis=0) - target).mean())
        if err < best[0]:
            best = (err, float(g))
    return best[1]


def recover(img, a_map, W):
    out = img.astype(np.float32)
    roi = out[ROI]
    out[ROI] = np.clip(_invert(roi, a_map, W, edge_gain(roi, a_map, W)), 0, 255)
    out = np.clip(out, 0, 255).astype(np.uint8)
    return cv2.inpaint(out, fringe_mask(a_map), 3, cv2.INPAINT_TELEA)


def ring_stats(img):
    ring = cv2.dilate(MASK, np.ones((25, 25), np.uint8)) - cv2.dilate(MASK, np.ones((9, 9), np.uint8))
    lum = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)[ring > 0]
    return float(lum.mean()), float(lum.std())


# Method choice per frame. Alpha inversion restores the real structure under the star, which no fill can guess, but
# its few-level opacity error shows as a faint tint on calm or dark backgrounds, where a plain inpaint is already
# clean. So use inversion only where the background is BOTH bright and busy (the bokeh-lights opening), and blend in
# smoothly so frames never pop between methods.
def alpha_weight(img):
    lum, std = ring_stats(img)
    w_lum = np.clip((lum - 85.0) / (105.0 - 85.0), 0, 1)
    w_std = np.clip((std - 10.0) / (16.0 - 10.0), 0, 1)
    return float(w_lum * w_std)


def clean_frame(img, a_map, W):
    w = alpha_weight(img)
    if w == 0.0:
        return bg_estimate(img)
    rec = recover(img, a_map, W)
    if w == 1.0:
        return rec
    return np.clip(rec.astype(np.float32) * w + bg_estimate(img).astype(np.float32) * (1 - w), 0, 255).astype(np.uint8)


def crop(img, scale=5):
    return cv2.resize(img[ROI], None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "fit"
    os.makedirs(AN, exist_ok=True)
    if mode == "fit":
        fit()
    elif mode == "preview":
        a_map, W = load_model()
        idx = [0, 3, 6, 9, 12, 15, 20, 30, 50, 60, 75, 140]
        tiles = []
        for i in idx:
            im = cv2.imread(files[i])
            t = crop(clean_frame(im, a_map, W), 3)
            cv2.putText(t, str(i), (4, 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
            tiles.append(t)
        cols = 6
        rows = [np.hstack(tiles[k:k + cols]) for k in range(0, len(tiles), cols)]
        cv2.imwrite(os.path.join(AN, "preview_alpha.png"), np.vstack(rows))
        print("wrote analysis/preview_alpha.png: cleaned corners of frames", idx)
    else:
        a_map, W = load_model()
        os.makedirs(CLEAN, exist_ok=True)
        for i, f in enumerate(files):
            cv2.imwrite(os.path.join(CLEAN, f"frame_{i:03d}.png"), clean_frame(cv2.imread(f), a_map, W))
        print("recovered", len(files), "frames ->", CLEAN)
