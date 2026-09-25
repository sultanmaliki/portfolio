# Scroll-frame pipeline

How the 150 scroll-animation frames were cleaned and upscaled. The site ships two sets:

| Folder | Size | Used by |
|---|---|---|
| `public/sequence-hd-v2/` | 1920×1080 | desktop (≥ 1024px wide) |
| `public/sequence-720-v2/` | 1280×720 | phones, tablets, data-saver / 2g-3g |

The source was 800×450 with a Gemini sparkle watermark at about (725, 375). The steps below remove
the watermark and upscale with Real-ESRGAN (`realesrgan-x4plus`, deliberately **no** face-restoration model).

The original frames are in git history: commit `c394bb3` is the last one that has the untouched
800×450 set in `public/sequence/`.

## Requirements

Windows + a Vulkan-capable GPU, Python 3.10+, `pip install opencv-python-headless numpy`, and the
[Real-ESRGAN ncnn-vulkan](https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0) Windows build.
Everything runs in a working folder (`FRAMES_WORK`, default `./frames-work`, git-ignored):

```bash
export FRAMES_WORK="$PWD/frames-work"

# 0. originals + upscaler
mkdir -p "$FRAMES_WORK/originals" "$FRAMES_WORK/esrgan"
git archive c394bb3 public/sequence | tar -x -C "$FRAMES_WORK/originals" --strip-components=2
gh release download v0.2.5.0 -R xinntao/Real-ESRGAN -p "realesrgan-ncnn-vulkan-20220424-windows.zip" -D "$FRAMES_WORK"
unzip -q "$FRAMES_WORK/realesrgan-ncnn-vulkan-20220424-windows.zip" -d "$FRAMES_WORK/esrgan"
```

## Steps

```bash
python tools/frame-pipeline/01_analyze.py               # find the static watermark (temporal median of corner detail)
python tools/frame-pipeline/02_remove_watermark.py fit  # fit the watermark's per-pixel opacity (constant white overlay, alpha ~0.4)
python tools/frame-pipeline/02_remove_watermark.py preview  # optional: cleaned crops of 12 sample frames in analysis/
python tools/frame-pipeline/02_remove_watermark.py run  # remove it from all 150 frames -> clean/
python tools/frame-pipeline/03_upscale.py          # Real-ESRGAN x4 (~12 min on an RTX 4060), resumable -> up4x/
python tools/frame-pipeline/04_export.py run 90 90 # downscale + WebP q90 -> staging/hd, staging/md
python tools/frame-pipeline/05_verify.py           # residual-watermark + flicker checks
```

Why two methods: the sparkle is a semi-transparent white overlay (`observed = (1-a)*bg + a*white`). On calm or
dark backgrounds a plain inpaint is already clean. On the bright bokeh opening (frames 0-14, 38-39) it is not:
fills leave streaks and hard blocks because the star covers real lights, so there the alpha blend is inverted to
recover them. `clean_frame()` picks per frame from the brightness and busyness of the ring around the star.

To redo only some frames (e.g. after tuning), `ONLY="0,1,2,38"` limits steps 03 and 04 to those indices; then copy the
staged files over the installed ones (see "Installing new frames").

Expected verify output: sparkle correlation drops from ~0.89 to ≤ 0.08 on every frame, and
frame-to-frame change stays at ≈ 1.0× the original (no flicker added).

## Installing new frames

The frame URLs are **not** content-hashed and `public/_headers` caches them for 30 days, so when
replacing frames, put them in a **new folder name** (the current folders are `-v2`; the next would be `-v3`) and update
`STANDARD_DIR` / `HD_DIR` in `src/components/ScrollyCanvas.tsx` plus the paths in `public/_headers`.
Otherwise returning visitors keep seeing the cached old frames.

```bash
cp "$FRAMES_WORK"/staging/md/*.webp public/sequence-720-v2/
cp "$FRAMES_WORK"/staging/hd/*.webp public/sequence-hd-v2/
```
