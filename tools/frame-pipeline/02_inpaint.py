"""Build the sparkle mask from the template and inpaint it out of the original frames.

usage:  python 02_inpaint.py preview            -> analysis/preview_inpaint.png (before/after crops)
        python 02_inpaint.py run                -> clean/frame_XXX.png for all frames (resumable)
"""
import glob, os, sys
import cv2
import numpy as np

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
SRC = os.path.join(WORK, "originals")  # the untouched 800x450 source frames
CLEAN = os.path.join(WORK, "clean")
X0, Y0 = 660, 320  # offset used by 01_analyze.py for the template
files = sorted(glob.glob(os.path.join(SRC, "*.webp")))

med = np.load(os.path.join(WORK, "analysis", "median_highpass.npy"))


def build_mask():
    m = (med > 22).astype(np.uint8)
    n, labels, stats, cents = cv2.connectedComponentsWithStats(m)
    ys, xs = np.unravel_index(np.argmax(med), med.shape)
    keep = labels[ys, xs]
    star = (labels == keep).astype(np.uint8)
    # cover the anti-aliased rim and soft glow
    star = cv2.dilate(star, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    full = np.zeros((450, 800), np.uint8)
    full[Y0:Y0 + star.shape[0], X0:X0 + star.shape[1]] = star * 255
    return full


MASK = build_mask()
ys, xs = np.where(MASK > 0)
BOX = (xs.min() - 14, ys.min() - 14, xs.max() + 15, ys.max() + 15)  # x0,y0,x1,y1 crop for viewing


def clean_frame(img):
    out = cv2.inpaint(img, MASK, 5, cv2.INPAINT_TELEA)
    # inpainting is smooth; restore matching sensor-like grain inside the patch so it doesn't read as a blur blob
    ring = cv2.dilate(MASK, np.ones((21, 21), np.uint8)) - cv2.dilate(MASK, np.ones((9, 9), np.uint8))
    ring_px = img[ring > 0].astype(np.float32)
    lum = ring_px.mean(axis=1)
    sigma = float(np.std(lum - cv2.GaussianBlur(lum.reshape(-1, 1), (0, 0), 2).ravel())) if len(lum) > 10 else 1.0
    rng = np.random.default_rng(1234)
    noise = rng.normal(0, min(0.4 * sigma, 0.8), size=(450, 800, 1)).astype(np.float32)
    soft = cv2.GaussianBlur(MASK, (0, 0), 1.5).astype(np.float32)[..., None] / 255.0
    out = np.clip(out.astype(np.float32) + noise * soft, 0, 255).astype(np.uint8)
    return out


def crop(img):
    x0, y0, x1, y1 = BOX
    return cv2.resize(img[y0:y1, x0:x1], None, fx=5, fy=5, interpolation=cv2.INTER_CUBIC)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "preview"
    print("mask pixels:", int((MASK > 0).sum()), "crop box:", BOX)
    if mode == "preview":
        rows = []
        for i in (0, 110, 149):
            img = cv2.imread(files[i])
            a, b = crop(img), crop(clean_frame(img))
            rows.append(np.hstack([a, np.full((a.shape[0], 6, 3), 255, np.uint8), b]))
        cv2.imwrite(os.path.join(WORK, "analysis", "preview_inpaint.png"), np.vstack(rows))
        print("wrote preview (left = original, right = cleaned)")
    else:
        os.makedirs(CLEAN, exist_ok=True)
        done = 0
        for i, f in enumerate(files):
            dst = os.path.join(CLEAN, f"frame_{i:03d}.png")
            if os.path.exists(dst):
                continue
            cv2.imwrite(dst, clean_frame(cv2.imread(f)))
            done += 1
        print(f"cleaned {done} new frames; total in clean/: {len(glob.glob(os.path.join(CLEAN, '*.png')))}")
