"use client";

import { useEffect, useRef, useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { useFrame } from "../shared/eggKit";
import { draw, dragTo, makeBall, MAX, pickUp, shake, step, throwBall, type Ball } from "./pit";
import styles from "./egg.module.css";

interface Grab {
  ball: Ball;
  lx: number;
  ly: number;
  lt: number;
  vx: number;
  vy: number;
}

/** Type "boing" (or tap the name five times): a pit of squishy clay balls with faces. Tap to drop one, drag to throw. */
export default function ClayEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "claymorphism", word: "boing", duration: 0 });
  return (
    <EggDialog slug="claymorphism" active={active} title="Clay ball pit" onClose={dismiss} variant="stage" className={styles.stage}>
      <Pit />
    </EggDialog>
  );
}

function Pit() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);
  const size = useRef({ w: 800, h: 600, dpr: 1 });
  const grab = useRef<Grab | null>(null);
  const [count, setCount] = useState(0);

  const spawn = (x?: number, y?: number) => {
    const list = balls.current;
    if (list.length >= MAX) list.shift();
    list.push(makeBall(size.current.w, x, y));
    setCount(list.length);
  };

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      size.current = { w: el.clientWidth, h: el.clientHeight, dpr };
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
    };
    fit();
    window.addEventListener("resize", fit);
    // a few balls to start, unless motion is unwelcome (the visitor can still drop their own)
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = calm ? [] : [0, 1, 2, 3, 4].map((i) => setTimeout(() => spawn(), 120 + i * 220));
    return () => {
      window.removeEventListener("resize", fit);
      timers.forEach(clearTimeout);
    };
  }, []);

  useFrame((dt) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const { w, h, dpr } = size.current;
    step(balls.current, w, h, dt, grab.current?.ball);
    draw(ctx, balls.current, w, h, dpr, dt);
  }, true);

  const at = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = at(e);
    const hit = [...balls.current].reverse().find((b) => Math.hypot(b.x - p.x, b.y - p.y) <= b.r);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (hit) {
      pickUp(hit);
      grab.current = { ball: hit, lx: p.x, ly: p.y, lt: performance.now(), vx: 0, vy: 0 };
    } else {
      spawn(p.x, p.y);
    }
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = grab.current;
    if (!g) return;
    const p = at(e);
    const now = performance.now();
    const dt = Math.max((now - g.lt) / 1000, 0.001);
    g.vx = g.vx * 0.5 + ((p.x - g.lx) / dt) * 0.5;
    g.vy = g.vy * 0.5 + ((p.y - g.ly) / dt) * 0.5;
    g.lx = p.x;
    g.ly = p.y;
    g.lt = now;
    dragTo(g.ball, p.x, p.y, size.current.w, size.current.h);
  };

  const up = () => {
    const g = grab.current;
    if (!g) return;
    throwBall(g.ball, g.vx, g.vy);
    grab.current = null;
  };

  return (
    <>
      <canvas ref={canvas} className={styles.canvas} role="img" aria-label="Clay balls bouncing around" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <div className={styles.bar}>
        <p className={styles.title}>
          Ball pit{" "}
          <span role="status">
            {count} {count === 1 ? "ball" : "balls"}
          </span>
        </p>
        <p className={styles.hint}>Tap to drop one. Drag to throw.</p>
        <div className={styles.actions}>
          <button type="button" data-autofocus onClick={() => spawn()}>
            Drop one
          </button>
          <button type="button" onClick={() => shake(balls.current)}>
            Shake
          </button>
          <button
            type="button"
            onClick={() => {
              balls.current = [];
              setCount(0);
            }}
          >
            Clear
          </button>
          <EggClose className={styles.close}>Close</EggClose>
        </div>
      </div>
    </>
  );
}
