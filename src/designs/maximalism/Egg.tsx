"use client";

import { useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { pick, rand, readBest, saveBest } from "../shared/eggKit";
import styles from "./egg.module.css";

const COLORS = ["#ff3cac", "#ffd600", "#2b86c5", "#6a00f4", "#00d68f", "#ff6b1a", "#111111"];
const WORDS = ["MORE!", "WOW", "!!!", "YES", "AND MORE", "BIGGER", "LOUDER", "AGAIN", "OOOH"];
const SHAPES = ["circle", "star", "squiggle", "word", "square", "blob"] as const;
const MAX_SHAPES = 110;

/** Each five clicks unlock another layer; the messages say which. */
const UNLOCKS = [
  "Press the button.",
  "Unlocked: polka dots.",
  "Unlocked: stripes.",
  "Unlocked: checkerboard.",
  "Unlocked: zigzag.",
  "Unlocked: the marquee.",
  "Unlocked: wobble.",
  "Unlocked: a bigger button.",
  "Unlocked: every colour at once.",
  "Unlocked: enough? Never.",
];

interface Shape {
  id: number;
  kind: (typeof SHAPES)[number];
  x: number;
  y: number;
  size: number;
  rot: number;
  color: string;
  word: string;
}

/** Type "more" (or tap the name five times): a MORE button. Every press adds more, and unlocks something louder. */
export default function MaximalismEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "maximalism", word: "more", duration: 0 });
  return (
    <EggDialog slug="maximalism" active={active} title="The MORE machine" onClose={dismiss} variant="stage" className={styles.stage}>
      <Machine />
    </EggDialog>
  );
}

function Machine() {
  const [count, setCount] = useState(0);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [denied, setDenied] = useState(false);
  const [best, setBest] = useState(() => readBest("maximalism"));
  const level = Math.min(Math.floor(count / 5), UNLOCKS.length - 1);

  const more = () => {
    const n = count + 1;
    setCount(n);
    if (n > best) {
      setBest(n);
      saveBest("maximalism", n);
    }
    const burst = 1 + Math.floor(n / 8);
    setShapes((all) => [
      ...all.slice(-(MAX_SHAPES - burst)),
      ...Array.from({ length: burst }, (_, i) => ({
        id: n * 10 + i,
        kind: pick(SHAPES),
        x: rand(2, 96),
        y: rand(10, 92),
        size: rand(2.5, 8) + n / 40,
        rot: rand(-45, 45),
        color: pick(COLORS),
        word: pick(WORDS),
      })),
    ]);
  };

  const less = () => {
    setDenied(true);
    setTimeout(() => setDenied(false), 1400);
  };

  return (
    <div className={styles.world} data-level={level}>
      {level >= 1 && <div className={styles.dots} />}
      {level >= 2 && <div className={styles.stripes} />}
      {level >= 3 && <div className={styles.checks} />}
      {level >= 4 && <div className={styles.zigzag} />}
      {shapes.map((s) => (
        <span key={s.id} aria-hidden className={`${styles.shape} ${styles[s.kind]} ${level >= 6 ? styles.wobble : ""}`} style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}rem`, rotate: `${s.rot}deg`, color: s.color, background: s.kind === "square" || s.kind === "circle" || s.kind === "blob" ? s.color : undefined }}>
          {s.kind === "word" ? s.word : s.kind === "star" ? "✶" : s.kind === "squiggle" ? "~~~" : ""}
        </span>
      ))}
      {level >= 5 && (
        <div className={styles.marquee} aria-hidden>
          <span>MORE MORE MORE MORE MORE MORE MORE MORE MORE MORE MORE MORE&nbsp;</span>
        </div>
      )}
      <div className={styles.panel}>
        <div className={styles.top}>
          <p className={styles.count} aria-hidden>
            MORE x {count}
          </p>
          <EggClose className={styles.close}>Done</EggClose>
        </div>
        <button type="button" data-autofocus className={`${styles.more} ${level >= 7 ? styles.huge : ""}`} onClick={more}>
          {count === 0 ? "MORE" : count < 10 ? "MORE!" : count < 25 ? "MOOORE!!" : "EVEN MORE!!!"}
        </button>
        <p className={styles.unlock} role="status">
          {denied ? "Request denied. This is maximalism." : `${count} so far. ${UNLOCKS[level]}`}
        </p>
        <button type="button" className={styles.less} onClick={less}>
          less?
        </button>
      </div>
    </div>
  );
}
