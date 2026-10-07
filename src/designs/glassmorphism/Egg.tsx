"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { readBest, saveBest } from "../shared/eggKit";
import styles from "./egg.module.css";

const COUNT = 40;

/** Type "pop" (or tap the name five times): a sheet of glass bubble wrap. Pop them all, as fast as you like. */
export default function GlassEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "glassmorphism", word: "pop", duration: 0 });
  return (
    <EggDialog slug="glassmorphism" active={active} title="Bubble wrap" onClose={dismiss} className={styles.backdrop}>
      <Sheet />
    </EggDialog>
  );
}

function Sheet() {
  const [popped, setPopped] = useState<boolean[]>(() => Array(COUNT).fill(false));
  const [rounds, setRounds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState(() => readBest("glassmorphism") / 10);
  const startedAt = useRef(0);
  const done = popped.every(Boolean);
  const left = popped.filter((p) => !p).length;

  const pop = (i: number) => {
    setPopped((current) => {
      if (current[i]) return current;
      if (!startedAt.current) startedAt.current = Date.now();
      navigator.vibrate?.(8);
      const next = current.slice();
      next[i] = true;
      return next;
    });
  };

  // finishing: freeze the time and keep the best (lower is better)
  useEffect(() => {
    if (!done) return;
    const seconds = Math.round((Date.now() - startedAt.current) / 100) / 10;
    setElapsed(seconds);
    setBest((b) => {
      if (!b || seconds < b) {
        saveBest("glassmorphism", Math.round(seconds * 10));
        return seconds;
      }
      return b;
    });
  }, [done]);

  const refill = () => {
    setPopped(Array(COUNT).fill(false));
    startedAt.current = 0;
    setRounds((r) => r + 1);
  };

  const popNext = () => {
    const i = popped.findIndex((p) => !p);
    if (i >= 0) pop(i);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      popNext();
    }
  };

  // swiping across the sheet pops everything you touch
  const sweep = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const i = hit instanceof HTMLElement ? hit.dataset.bubble : undefined;
    if (i !== undefined) pop(Number(i));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h2>Bubble wrap</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <div
        key={rounds}
        className={styles.sheet}
        role="group"
        tabIndex={0}
        data-autofocus
        aria-label="Bubble wrap. Press space to pop the next bubble."
        onKeyDown={onKey}
        onPointerMove={sweep}
      >
        {popped.map((p, i) => (
          <button key={i} type="button" tabIndex={-1} data-bubble={i} className={`${styles.bubble} ${p ? styles.popped : ""}`} aria-label={p ? "Popped bubble" : "Bubble"} onPointerDown={() => pop(i)} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} />
        ))}
      </div>
      <p className={styles.status} role="status">
        {done ? `All popped in ${elapsed} seconds. Satisfying. Best ${best || elapsed}s.` : `${left} left to pop`}
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={popNext} disabled={done}>
          Pop one
        </button>
        <button type="button" onClick={refill}>
          {done ? "Another sheet" : "New sheet"}
        </button>
      </div>
    </div>
  );
}
