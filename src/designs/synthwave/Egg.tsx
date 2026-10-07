"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { readBest, saveBest, useFrame } from "../shared/eggKit";
import { advance, draw, fresh, H, points, steer, W, type Run as RunState } from "./drive";
import styles from "./egg.module.css";

type Phase = "ready" | "play" | "over";

/** Type "drive" (or tap the name five times): outrun. Steer between lanes, dodge the barriers, grab the orbs. */
export default function SynthwaveEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "synthwave", word: "drive", duration: 0 });
  return (
    <EggDialog slug="synthwave" active={active} title="Outrun" onClose={dismiss} className={styles.backdrop}>
      <Drive />
    </EggDialog>
  );
}

function Drive() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const run = useRef<RunState>(fresh());
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhase] = useState<Phase>("ready");
  const [shown, setShown] = useState(0);
  const [best, setBest] = useState(() => readBest("synthwave"));

  const go = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const start = () => {
    run.current = fresh();
    setShown(0);
    go("play");
  };

  const turn = (dir: -1 | 1) => {
    if (phaseRef.current === "play") steer(run.current, dir);
  };
  const onTurn = useEffectEvent(turn);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        e.preventDefault();
        onTurn(-1);
      } else if (k === "arrowright" || k === "d") {
        e.preventDefault();
        onTurn(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFrame((dt) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const r = run.current;
    if (phaseRef.current === "play") {
      const crashed = advance(r, dt);
      const now = points(r);
      setShown(now);
      if (crashed) {
        setBest((b) => {
          if (now > b) saveBest("synthwave", now);
          return Math.max(b, now);
        });
        go("over");
      }
    }
    draw(ctx, r, phaseRef.current === "over");
  }, true);

  return (
    <div className={styles.cabinet}>
      <div className={styles.head}>
        <h2>Outrun</h2>
        <EggClose className={styles.close}>Exit</EggClose>
      </div>
      <p className={styles.hud} aria-hidden>
        <span>Score {shown}</span>
        <span>Best {best}</span>
      </p>
      <div className={styles.screen}>
        <canvas ref={canvas} width={W} height={H} className={styles.canvas} role="img" aria-label="Neon road driving game" />
        {phase !== "play" && (
          <div className={styles.overlay}>
            <p role="status">{phase === "over" ? `Crashed. Score ${shown}.` : "Ready to drive?"}</p>
            <button type="button" data-autofocus onClick={start}>
              {phase === "over" ? "Go again" : "Start engine"}
            </button>
          </div>
        )}
      </div>
      <div className={styles.pad}>
        <button type="button" onClick={() => turn(-1)}>
          Left
        </button>
        <button type="button" onClick={() => turn(1)}>
          Right
        </button>
      </div>
      <p className={styles.keys}>Arrow keys or A and D to change lane. Dodge pink barriers, grab cyan orbs.</p>
    </div>
  );
}
