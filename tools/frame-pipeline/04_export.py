"""Downscale the 4x upscales and encode WebP sets. Resumable (skips existing files).

usage: python 04_export.py sizetest       -> sample file sizes at a few qualities
       python 04_export.py run [Q_HD Q_MD] -> writes staging/hd (1920x1080) and staging/md (1280x720)
"""
import glob, os, sys
import cv2

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
UP = os.path.join(WORK, "up4x")
STAGE = os.path.join(WORK, "staging")
SETS = {"hd": (1920, 1080), "md": (1280, 720)}


def out_name(i):
    return f"frame_{i:03d}_delay-0.067s.webp"


def encode(img, size, q):
    small = cv2.resize(img, size, interpolation=cv2.INTER_AREA)  # downscaling the 3200px result keeps it crisp
    ok, buf = cv2.imencode(".webp", small, [cv2.IMWRITE_WEBP_QUALITY, q])
    assert ok
    return buf


if __name__ == "__main__":
    mode = sys.argv[1]
    files = sorted(glob.glob(os.path.join(UP, "*.png")))
    if mode == "sizetest":
        for i in (0, len(files) // 2):
            img = cv2.imread(files[i])
            for name, size in SETS.items():
                print(name, size, {q: round(len(encode(img, size, q)) / 1024) for q in (72, 80, 86)}, "KB")
    else:
        q_hd = int(sys.argv[2]) if len(sys.argv) > 2 else 80
        q_md = int(sys.argv[3]) if len(sys.argv) > 3 else 82
        for name, q in (("hd", q_hd), ("md", q_md)):
            os.makedirs(os.path.join(STAGE, name), exist_ok=True)
        n = 0
        for i, f in enumerate(files):
            need = [k for k in SETS if not os.path.exists(os.path.join(STAGE, k, out_name(i)))]
            if not need:
                continue
            img = cv2.imread(f)
            for k in need:
                with open(os.path.join(STAGE, k, out_name(i)), "wb") as fh:
                    fh.write(encode(img, SETS[k], q_hd if k == "hd" else q_md))
            n += 1
        tot = {k: sum(os.path.getsize(p) for p in glob.glob(os.path.join(STAGE, k, "*.webp"))) / 1048576 for k in SETS}
        print(f"exported {n} frames;", {k: f"{v:.1f} MB ({len(glob.glob(os.path.join(STAGE, k, '*.webp')))} files)" for k, v in tot.items()})
