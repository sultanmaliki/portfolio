"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { rand, readBest, saveBest, useFrame } from "../shared/eggKit";
import { advance, draw, fresh, H, jumpIfGrounded, score, shortHop, W, type World } from "./runner";
import styles from "./egg.module.css";

type Phase = "ready" | "play" | "over";

/** Type "coin" (or tap the name five times): a tiny endless runner. Jump with space, up, or a tap. */
export default function PixelEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "pixel-art", word: "coin", duration: 0 });
  return (
    <EggDialog slug="pixel-art" active={active} title="Coin run" onClose={dismiss} className={styles.backdrop}>
      <Run />
    </EggDialog>
  );
}

function Run() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World>(fresh());
  const phaseRef = useRef<Phase>("ready");
  const [phase, setPhase] = useState<Phase>("ready");
  const [hud, setHud] = useState({ score: 0, coins: 0 });
  const [best, setBest] = useState(() => readBest("pixel-art"));
  const [hills] = useState(() => Array.from({ length: 14 }, () => rand(16, 46)));

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const jump = () => {
    if (phaseRef.current !== "play") {
      world.current = fresh();
      setHud({ score: 0, coins: 0 });
      go("play");
    }
    jumpIfGrounded(world.current);
  };

  const release = () => shortHop(world.current);

  const onJump = useEffectEvent(jump);
  const onRelease = useEffectEvent(release);

  useEffect(() => {
    const isJump = (e: KeyboardEvent) => e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w";
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || !isJump(e)) return;
      e.preventDefault();
      onJump();
    };
    const up = (e: KeyboardEvent) => isJump(e) && onRelease();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((dt) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const w = world.current;
    const playing = phaseRef.current === "play";
    if (playing) {
      const crashed = advance(w, dt);
      const now = score(w);
      if (crashed) {
        setBest((b) => {
          if (now > b) saveBest("pixel-art", now);
          return Math.max(b, now);
        });
        setHud({ score: now, coins: w.coins });
        go("over");
      } else {
        setHud((h) => (h.score === now ? h : { score: now, coins: w.coins }));
      }
    }
    draw(ctx, w, hills, playing);
  }, true);

  return (
    <div className={styles.cabinet}>
      <div className={styles.head}>
        <h2>Coin run</h2>
        <EggClose className={styles.close}>Quit</EggClose>
      </div>
      <div className={styles.hud} aria-hidden>
        <span>Score {String(hud.score).padStart(5, "0")}</span>
        <span>Coins {hud.coins}</span>
        <span>Best {String(best).padStart(5, "0")}</span>
      </div>
      <div className={styles.screen}>
        <canvas ref={canvas} width={W} height={H} className={styles.canvas} onPointerDown={jump} onPointerUp={release} onPointerCancel={release} role="img" aria-label="Pixel runner game" />
        {phase !== "play" && (
          <div className={styles.overlay}>
            <p role="status">{phase === "over" ? `Game over. Score ${hud.score}.` : "Ready?"}</p>
            <button type="button" data-autofocus onClick={jump}>
              {phase === "over" ? "Try again" : "Start"}
            </button>
          </div>
        )}
      </div>
      <p className={styles.keys}>Space, up arrow or tap to jump. Hold for a high jump. Grab coins, dodge the rest.</p>
    </div>
  );
}
