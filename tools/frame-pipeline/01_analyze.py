"""Locate the static Gemini sparkle by taking the temporal median of high-pass detail in the corner."""
import glob, os
import cv2
import numpy as np

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
SRC = os.path.join(WORK, "originals")  # the untouched 800x450 source frames
OUT = os.path.join(WORK, "analysis")
os.makedirs(OUT, exist_ok=True)

files = sorted(glob.glob(os.path.join(SRC, "*.webp")))
assert len(files) == 150, len(files)

X0, X1, Y0, Y1 = 660, 800, 320, 450  # generous bottom-right search window
stack = []
for f in files:
    img = cv2.imread(f, cv2.IMREAD_COLOR)
    assert img is not None and img.shape[:2] == (450, 800), (f, None if img is None else img.shape)
    roi = img[Y0:Y1, X0:X1].astype(np.float32)
    gray = roi.mean(axis=2)
    high = gray - cv2.GaussianBlur(gray, (0, 0), 7)
    stack.append(high)
stack = np.stack(stack)
med = np.median(stack, axis=0)
print("median high-pass range:", float(med.min()), float(med.max()))
ys, xs = np.unravel_index(np.argmax(med), med.shape)
print("peak at (x,y) =", X0 + xs, Y0 + ys, "value", float(med[ys, xs]))

# visualise: normalise the median high-pass, upscale 5x
vis = np.clip((med - med.min()) / (med.max() - med.min() + 1e-6) * 255, 0, 255).astype(np.uint8)
cv2.imwrite(os.path.join(OUT, "median_highpass.png"), cv2.resize(vis, None, fx=5, fy=5, interpolation=cv2.INTER_NEAREST))
np.save(os.path.join(OUT, "median_highpass.npy"), med)

# how consistently present is it? fraction of frames where the peak pixel is a local bright spot
peak_vals = stack[:, ys, xs]
print("peak-pixel high-pass across frames: min %.1f  p10 %.1f  median %.1f" % (peak_vals.min(), np.percentile(peak_vals, 10), np.median(peak_vals)))
