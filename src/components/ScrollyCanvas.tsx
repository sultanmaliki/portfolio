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
      let img = images[idx];
      for (let d = 1; (!img || !img.naturalWidth) && d < FRAME_COUNT; d++) {
        img = images[idx - d] ?? images[idx + d];
      }
      if (!img || !img.naturalWidth) return;

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

export default function ScrollyCanvas() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [settled, setSettled] = useState(0);
  const ready = settled === FRAME_COUNT;

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const list: HTMLImageElement[] = [];

    // Count errors too, so one missing frame can never hang the loader.
    const onSettle = () => {
      if (cancelled) return;
      done++;
      setSettled(done);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = onSettle;
      img.onerror = onSettle;
      img.src = currentFrame(i);
      list.push(img);
    }
    imagesRef.current = list;

    return () => {
      cancelled = true;
      list.forEach((img) => {
        img.onload = null;
        img.onerror = null;
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-sm font-light tracking-[0.3em] mb-6 uppercase"
              >
                Loading Experience
              </motion.div>
              <div className="text-[#6EA8FF] text-5xl font-extralight tracking-tight">
                {settled} <span className="text-[#F5F5F5]/30 text-3xl">/ {FRAME_COUNT}</span>
              </div>
            </div>
          )}

          <Overlay progress={progress} />
        </>
      )}
    </ScrollTimeline>
  );
}
