"use client";

import { useEffect, useRef } from "react";

/** Small helpers the easter-egg games share. */

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
export const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
export const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

/** Calls `step(dtSeconds)` every animation frame while `running`. dt is capped so a background tab cannot teleport things. */
export function useFrame(step: (dt: number) => void, running: boolean) {
  const latest = useRef(step);
  useEffect(() => {
    latest.current = step;
  });
  useEffect(() => {
    if (!running) return;
    let id = 0;
    let last = performance.now();
    const tick = (now: number) => {
      latest.current(Math.min((now - last) / 1000, 0.05));
      last = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running]);
}

/** A personal best, remembered in this browser only; storage may be blocked, so every access is guarded. */
export function readBest(key: string): number {
  try {
    return Number(window.localStorage.getItem(`egg:${key}`)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(key: string, value: number) {
  try {
    window.localStorage.setItem(`egg:${key}`, String(value));
  } catch {
    /* private mode or blocked storage: the best simply is not kept */
  }
}
