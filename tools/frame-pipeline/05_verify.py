"""Numeric verification of the staged frame sets: watermark residue, flicker, dimensions."""
import glob, os
import cv2
import numpy as np

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
ORIG = sorted(glob.glob(os.path.join(WORK, "originals", "*.webp")))
MD = sorted(glob.glob(os.path.join(WORK, "staging", "md", "*.webp")))
HD = sorted(glob.glob(os.path.join(WORK, "staging", "hd", "*.webp")))
assert len(ORIG) == len(MD) == len(HD) == 150, (len(ORIG), len(MD), len(HD))

X0, X1, Y0, Y1 = 660, 800, 320, 450
tmpl = np.load(os.path.join(WORK, "analysis", "median_highpass.npy"))
tmpl = (tmpl - tmpl.mean()) / (tmpl.std() + 1e-6)


def star_score(img800):
    """Normalised correlation between the corner's high-pass detail and the sparkle template."""
    g = cv2.cvtColor(img800, cv2.COLOR_BGR2GRAY).astype(np.float32)[Y0:Y1, X0:X1]
    h = g - cv2.GaussianBlur(g, (0, 0), 7)
    h = (h - h.mean()) / (h.std() + 1e-6)
    return float((h * tmpl).mean())


def to800(path):
    return cv2.resize(cv2.imread(path), (800, 450), interpolation=cv2.INTER_AREA)


so = np.array([star_score(cv2.imread(f)) for f in ORIG])
sm = np.array([star_score(to800(f)) for f in MD])
sh = np.array([star_score(to800(f)) for f in HD])
print("sparkle correlation  original: min %.2f median %.2f | cleaned 720p: max %.2f median %.2f | cleaned 1080p: max %.2f median %.2f"
      % (so.min(), np.median(so), sm.max(), np.median(sm), sh.max(), np.median(sh)))
print("frames where residue looks significant (score > 0.30):  720p:", int((sm > 0.30).sum()), " 1080p:", int((sh > 0.30).sum()),
      "  worst 720p frames:", [(int(i), round(float(sm[i]), 2)) for i in np.argsort(-sm)[:4]])

# dimensions
print("dims:", cv2.imread(MD[0]).shape[1::-1], cv2.imread(HD[0]).shape[1::-1])


# flicker: consecutive-frame mean abs difference at 400x225, original vs upscaled; spikes = inconsistent frames
def small(path):
    return cv2.resize(cv2.imread(path), (400, 225), interpolation=cv2.INTER_AREA).astype(np.float32)


def diffs(files):
    prev, out = None, []
    for f in files:
        cur = small(f)
        if prev is not None:
            out.append(float(np.abs(cur - prev).mean()))
        prev = cur
    return np.array(out)


do, dm = diffs(ORIG), diffs(MD)
ratio = dm / (do + 1e-6)
print("frame-to-frame change  original mean %.2f | upscaled mean %.2f | ratio median %.2f  max %.2f" % (do.mean(), dm.mean(), np.median(ratio), ratio.max()))
print("largest ratios (frame index, ratio):", [(int(i), round(float(ratio[i]), 2)) for i in np.argsort(-ratio)[:4]])

# contact sheet of the logo corner across 12 frames at 1080p (crop 160x160 around the sparkle location)
tiles = []
for i in range(0, 150, 13):
    im = cv2.imread(HD[i])
    cx, cy = int(725 * 2.4), int(375 * 2.4)
    tiles.append(im[cy - 90:cy + 90, cx - 90:cx + 90])
rows = [np.hstack(tiles[k:k + 6]) for k in (0, 6)]
cv2.imwrite(os.path.join(WORK, "analysis", "corner_sheet_hd.png"), np.vstack(rows))
print("wrote analysis/corner_sheet_hd.png")
