"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { MotionValue, motion, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";
import ScrollTimeline from "./ScrollTimeline";

const FRAME_COUNT = 150;
const MAX_DPR = 2;

const currentFrame = (index: number) =>
  `/sequence/frame_${index.toString().padStart(3, "0")}_delay-0.067s.webp`;

function CanvasStage({
  progress,
  imagesRef,
  ready,
}: {
  progress: MotionValue<number>;
  imagesRef: RefObject<HTMLImageElement[]>;
  ready: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDrawn = useRef(-1);

  const draw = useCallback(
    (force = false) => {
      const canvas = canvasRef.current;
      if (!canvas || !ready) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const idx = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress.get() * (FRAME_COUNT - 1)))
      );
      if (!force && idx === lastDrawn.current) return;

      // Fall back to the nearest frame that actually loaded.
      const images = imagesRef.current;
      const loaded = (i: number) => (images[i]?.naturalWidth ? images[i] : undefined);
      let img = loaded(idx);
      for (let d = 1; !img && d < FRAME_COUNT; d++) {
        img = loaded(idx - d) ?? loaded(idx + d);
      }
      if (!img) return;

      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const x = w / 2 - (img.naturalWidth / 2) * scale;
      const y = h / 2 - (img.naturalHeight / 2) * scale;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      lastDrawn.current = idx;
    },
    [imagesRef, progress, ready]
  );

  // Size the canvas only on resize (not every frame), DPR-aware.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      draw(true);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // Draw only when scroll progress changes.
  useMotionValueEvent(progress, "change", () => draw());

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const LAST_FRAME = FRAME_COUNT - 1;

type Connection = { saveData?: boolean };

/**
 * Decides which frames gate the loader ("gate") and which stream in afterwards ("rest").
 * The draw loop snaps to the nearest loaded frame, so a sparse set still maps
 * scroll progress onto the full 0..FRAME_COUNT-1 range correctly.
 */
function planFrames() {
  const saveData =
    (navigator as Navigator & { connection?: Connection }).connection?.saveData === true;
  const small = window.matchMedia("(max-width: 767px)").matches;

  const stride = saveData ? 3 : small ? 2 : 3;
  const gate: number[] = [];
  for (let i = 0; i < FRAME_COUNT; i += stride) gate.push(i);
  if (gate[gate.length - 1] !== LAST_FRAME) gate.push(LAST_FRAME);

  const rest: number[] = [];
  if (!saveData && !small) {
    const inGate = new Set(gate);
    for (let i = 0; i < FRAME_COUNT; i++) if (!inGate.has(i)) rest.push(i);
  }
  return { gate, rest };
}

export default function ScrollyCanvas() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [load, setLoad] = useState({ done: 0, total: 0 });
  const ready = load.total > 0 && load.done >= load.total;
  const percent = load.total ? Math.round((load.done / load.total) * 100) : 0;

  useEffect(() => {
    let cancelled = false;
    const { gate, rest } = planFrames();
    const total = gate.length;
    let done = 0;

    const list: HTMLImageElement[] = new Array<HTMLImageElement>(FRAME_COUNT);
    imagesRef.current = list;

    const loadFrame = (index: number, onSettle?: () => void) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        img.onload = img.onerror = null;
        if (!cancelled) onSettle?.();
      };
      img.src = currentFrame(index);
      list[index] = img;
    };

    // Count errors too, so one missing frame can never hang the loader.
    const onGateSettle = () => {
      done++;
      setLoad({ done, total });
      // Once the coarse pass is in, stream the remaining frames in the background.
      if (done === total) rest.forEach((i) => loadFrame(i));
    };
    gate.forEach((i) => loadFrame(i, onGateSettle));

    return () => {
      cancelled = true;
      list.forEach((img) => {
        if (img) img.onload = img.onerror = null;
      });
    };
  }, []);

  return (
    <ScrollTimeline
      duration={10}
      className="bg-[#121212]"
      stickyClassName="bg-[#121212]"
    >
      {(progress) => (
        <>
          <CanvasStage progress={progress} imagesRef={imagesRef} ready={ready} />

          {!ready && (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-50"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-sm font-light tracking-[0.3em] mb-6 uppercase"
              >
                Loading Experience
              </motion.div>
              <div className="text-[#6EA8FF] text-5xl font-extralight tracking-tight">
                {percent}
                <span className="text-[#F5F5F5]/50 text-3xl"> %</span>
              </div>
            </div>
          )}

          <Overlay progress={progress} />
        </>
      )}
    </ScrollTimeline>
  );
}
