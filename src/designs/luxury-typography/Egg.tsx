"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { portfolio } from "@/data";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import styles from "./egg.module.css";

const { profile } = portfolio;
const CLEAR_AT = 0.5; // how much must be scratched away before the rest falls off

/** Type "gold" (or tap the name five times): a gold scratch card. Scratch the foil to find the prize. */
export default function LuxuryEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "luxury-typography", word: "gold", duration: 0 });
  return (
    <EggDialog slug="luxury-typography" active={active} title="The gold card" onClose={dismiss} className={styles.backdrop}>
      <Card />
    </EggDialog>
  );
}

function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#8c6d12");
  g.addColorStop(0.25, "#e8c75a");
  g.addColorStop(0.5, "#b8921f");
  g.addColorStop(0.75, "#f3dc8a");
  g.addColorStop(1, "#9c7a17");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // brushed grain
  for (let i = 0; i < 520; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.12)" : "rgba(60,40,0,0.12)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 18 + Math.random() * 50, 1);
  }
  ctx.fillStyle = "rgba(60, 40, 0, 0.75)";
  ctx.font = "600 15px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "6px";
  ctx.fillText("SCRATCH HERE", w / 2, h / 2);
}

function Card() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const down = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = canvas.current;
    const wrap = box.current;
    const ctx = el?.getContext("2d");
    if (!el || !wrap || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    el.width = Math.round(width * dpr);
    el.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);
    paintFoil(ctx, width, height);
  }, []);

  /** Samples the foil to see how much is gone. */
  const measure = () => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, el.width, el.height);
    let clear = 0;
    let total = 0;
    const step = 4 * 12; // every twelfth pixel of each row is plenty
    for (let i = 3; i < data.length; i += step) {
      total++;
      if (data[i] < 40) clear++;
    }
    return clear / total;
  };

  const scratch = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || !down.current || revealed) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
    last.current = { x, y };
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    down.current = true;
    last.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    scratch(e);
  };

  const onUp = () => {
    down.current = false;
    const done = measure();
    setProgress(done);
    if (done >= CLEAR_AT) setRevealed(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <p>The Gold Card</p>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <div ref={box} className={styles.prize}>
        <div className={styles.under}>
          <p className={styles.small}>You have won</p>
          <p className={styles.big}>One excellent hire</p>
          <p className={styles.small}>
            {profile.name}, {profile.tagline[1]}. {profile.availability.detail}.
          </p>
        </div>
        <canvas ref={canvas} aria-hidden className={`${styles.foil} ${revealed ? styles.gone : ""}`} onPointerDown={onDown} onPointerMove={scratch} onPointerUp={onUp} onPointerCancel={onUp} />
      </div>
      <p className={styles.status} role="status">
        {revealed ? "Prize found. Terms: curiosity, mostly." : progress > 0.1 ? "Keep scratching..." : "Use your finger or mouse to scratch off the gold."}
      </p>
      <div className={styles.actions}>
        {revealed ? (
          <a data-autofocus className={styles.redeem} href={`mailto:${profile.email}?subject=${encodeURIComponent("Redeeming the gold card")}`}>
            Redeem the prize
          </a>
        ) : (
          <button type="button" data-autofocus onClick={() => setRevealed(true)}>
            Reveal without scratching
          </button>
        )}
      </div>
    </div>
  );
}
