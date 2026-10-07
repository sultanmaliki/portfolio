"use client";

import { useEffect, useRef, useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { readBest, saveBest } from "../shared/eggKit";
import styles from "./egg.module.css";

const SECONDS = 20;
const GRACE = 700; // ms to let go of the mouse after pressing Start
const SLIPS = ["You moved.", "That was a twitch.", "Even breathing is too much movement.", "Less ambition. Try again.", "The mouse is not required."];

/** Type "less" (or tap the name five times): the do-nothing challenge. Twenty seconds without touching anything. */
export default function MinimalismEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "minimalism", word: "less", duration: 0 });
  return (
    <EggDialog slug="minimalism" active={active} title="Do nothing" onClose={dismiss} className={styles.backdrop}>
      <Nothing />
    </EggDialog>
  );
}

function Nothing() {
  const [phase, setPhase] = useState<"ready" | "doing" | "done">("ready");
  const [left, setLeft] = useState(SECONDS);
  const [slips, setSlips] = useState(0);
  const [note, setNote] = useState("Press start, then do nothing for twenty seconds. No mouse, no keys, no scrolling.");
  const [best, setBest] = useState(() => readBest("minimalism"));
  const startedAt = useRef(0);
  const slipsRef = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);

  const begin = () => {
    startedAt.current = Date.now();
    last.current = null;
    setLeft(SECONDS);
    setNote("Doing nothing...");
    setPhase("doing");
  };

  useEffect(() => {
    if (phase !== "doing") return;

    const slip = () => {
      const held = Math.floor((Date.now() - startedAt.current) / 1000);
      setBest((b) => {
        if (held > b) saveBest("minimalism", held);
        return Math.max(b, held);
      });
      setNote(`${SLIPS[slipsRef.current % SLIPS.length]} You lasted ${held}s.`);
      slipsRef.current += 1;
      setSlips(slipsRef.current);
      setPhase("ready");
    };

    const moved = (e: PointerEvent) => {
      if (Date.now() - startedAt.current < GRACE) return;
      // the first move only marks where the pointer rests; drifting more than a few pixels from there is a slip
      const rest = last.current;
      if (!rest) last.current = { x: e.clientX, y: e.clientY };
      else if (Math.hypot(e.clientX - rest.x, e.clientY - rest.y) > 6) slip();
    };
    const pressed = (e: Event) => {
      if (Date.now() - startedAt.current < GRACE) return;
      if (e instanceof KeyboardEvent && (e.key === "Escape" || e.key === "Tab")) return;
      slip();
    };

    const tick = setInterval(() => {
      const remaining = SECONDS - Math.floor((Date.now() - startedAt.current) / 1000);
      if (remaining <= 0) {
        setBest(SECONDS);
        saveBest("minimalism", SECONDS);
        setLeft(0);
        setPhase("done");
        setNote("Twenty seconds of nothing. That is the portfolio.");
      } else setLeft(remaining);
    }, 200);

    window.addEventListener("pointermove", moved);
    window.addEventListener("keydown", pressed);
    window.addEventListener("wheel", pressed, { passive: true });
    window.addEventListener("pointerdown", pressed);
    return () => {
      clearInterval(tick);
      window.removeEventListener("pointermove", moved);
      window.removeEventListener("keydown", pressed);
      window.removeEventListener("wheel", pressed);
      window.removeEventListener("pointerdown", pressed);
    };
  }, [phase]);

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <p>Do nothing</p>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <p className={styles.count} aria-hidden>
        {phase === "done" ? "0" : left}
      </p>
      <p className={styles.note} role="status">
        {note}
      </p>
      {phase !== "doing" && (
        <button type="button" className={styles.start} data-autofocus onClick={begin}>
          {phase === "done" ? "Again" : slips ? "Try again" : "Start"}
        </button>
      )}
      <p className={styles.meta}>
        Attempts {slips + (phase === "done" ? 1 : 0)} · Longest {best}s
      </p>
    </div>
  );
}
