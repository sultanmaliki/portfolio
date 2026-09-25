"""Resumable Real-ESRGAN x4 upscale of clean/ -> up4x/. Re-running only processes missing frames."""
import glob, os, shutil, subprocess, sys

WORK = os.path.abspath(os.environ.get("FRAMES_WORK", "frames-work"))  # working folder (see README)
CLEAN = os.path.join(WORK, "clean")
UP = os.path.join(WORK, "up4x")
TMP_IN = os.path.join(WORK, "_batch_in")
EXE = os.path.join(WORK, "esrgan", "realesrgan-ncnn-vulkan.exe")
MODELS = os.path.join(WORK, "esrgan", "models")
os.makedirs(UP, exist_ok=True)

# ONLY="0,1,2,38" re-processes just those frame indices (partial re-run after fixing specific frames)
ONLY = {int(x) for x in os.environ["ONLY"].split(",")} if os.environ.get("ONLY") else None
todo = [f for f in sorted(glob.glob(os.path.join(CLEAN, "*.png")))
        if not os.path.exists(os.path.join(UP, os.path.basename(f)))
        and (ONLY is None or int(os.path.basename(f)[6:9]) in ONLY)]
print(f"{len(todo)} frames to upscale", flush=True)

CHUNK = 30  # small chunks: a stop/crash loses at most one chunk of work
for start in range(0, len(todo), CHUNK):
    batch = todo[start:start + CHUNK]
    shutil.rmtree(TMP_IN, ignore_errors=True)
    os.makedirs(TMP_IN)
    for f in batch:
        shutil.copy(f, TMP_IN)
    tmp_out = os.path.join(WORK, "_batch_out")
    shutil.rmtree(tmp_out, ignore_errors=True)
    os.makedirs(tmp_out)
    r = subprocess.run([EXE, "-i", TMP_IN, "-o", tmp_out, "-n", "realesrgan-x4plus", "-s", "4", "-m", MODELS, "-f", "png"],
                       capture_output=True, text=True)
    made = sorted(os.listdir(tmp_out))
    if len(made) != len(batch):
        print("batch mismatch", len(made), len(batch), r.stderr[-300:], flush=True)
        sys.exit(1)
    for name in made:  # only move into up4x/ once the whole chunk is complete
        shutil.move(os.path.join(tmp_out, name), os.path.join(UP, name))
    print(f"done {min(start + CHUNK, len(todo))}/{len(todo)}", flush=True)

shutil.rmtree(TMP_IN, ignore_errors=True)
shutil.rmtree(os.path.join(WORK, "_batch_out"), ignore_errors=True)
print("ALL DONE", len(glob.glob(os.path.join(UP, "*.png"))), flush=True)
