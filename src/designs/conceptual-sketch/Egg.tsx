"use client";

import { useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import styles from "./egg.module.css";

/** A light bulb, drawn dot to dot in a 100 x 120 box. 1 to 20 trace the outline (closing back to 1); 21 to 25 are the filament. */
const DOTS: [number, number][] = [
  [38, 78], [30, 66], [22, 54], [20, 40], [26, 26], [36, 15], [50, 10], [64, 15], [74, 26], [80, 40],
  [78, 54], [70, 66], [62, 78], [62, 88], [62, 98], [56, 108], [50, 112], [44, 108], [38, 98], [38, 88],
  [36, 62], [43, 44], [50, 62], [57, 44], [64, 62],
];
const OUTLINE = 20;

/** A slightly wobbly pencil stroke between two dots. The wobble depends only on the dots, so it never jumps around. */
function stroke(a: [number, number], b: [number, number], n: number) {
  const wobble = Math.sin(n * 12.9898) * 1.4;
  const mx = (a[0] + b[0]) / 2 + wobble;
  const my = (a[1] + b[1]) / 2 - wobble;
  return `M${a[0]} ${a[1]} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b[0]} ${b[1]}`;
}

/** Type "draw" (or tap the name five times): connect the dots, 1 to 25, and see what the idea is. */
export default function SketchEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "conceptual-sketch", word: "draw", duration: 0 });
  return (
    <EggDialog slug="conceptual-sketch" active={active} title="Connect the dots" onClose={dismiss} className={styles.backdrop}>
      <Dots />
    </EggDialog>
  );
}

function Dots() {
  const [next, setNext] = useState(1); // the dot to find next
  const [wrong, setWrong] = useState<number | null>(null);
  const done = next > DOTS.length;

  const tap = (n: number) => {
    if (n === next) {
      setNext(next + 1);
      setWrong(null);
    } else if (n > next) {
      setWrong(n);
      setTimeout(() => setWrong(null), 450);
    }
  };

  // segments drawn so far: 1 to 20 in order, the closing line, then the separate filament 21 to 25
  const segments: [number, number][] = [];
  for (let n = 2; n < next && n <= OUTLINE; n++) segments.push([n - 1, n]);
  if (next > OUTLINE) segments.push([OUTLINE, 1]);
  for (let n = OUTLINE + 2; n < next && n <= DOTS.length; n++) segments.push([n - 1, n]);

  return (
    <div className={styles.paper}>
      <div className={styles.top}>
        <h2>Connect the dots</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <div className={styles.drawing}>
        <svg viewBox="0 0 100 120" className={styles.lines} aria-hidden>
          {done && (
            <g className={styles.rays}>
              {[-70, -40, -10, 20, 50].map((a, i) => {
                const r = (a * Math.PI) / 180;
                return <path key={i} d={`M${50 + Math.sin(r) * 42} ${44 - Math.cos(r) * 42} L${50 + Math.sin(r) * 50} ${44 - Math.cos(r) * 50}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }} />;
              })}
              {[70, 100].map((a, i) => {
                const r = (a * Math.PI) / 180;
                return <path key={a} d={`M${50 + Math.sin(r) * 42} ${44 - Math.cos(r) * 42} L${50 + Math.sin(r) * 50} ${44 - Math.cos(r) * 50}`} style={{ animationDelay: `${0.8 + i * 0.1}s` }} />;
              })}
            </g>
          )}
          {segments.map(([a, b]) => (
            <path key={`${a}-${b}`} d={stroke(DOTS[a - 1], DOTS[b - 1], a)} pathLength={1} className={styles.pencil} />
          ))}
        </svg>
        {DOTS.map(([x, y], i) => {
          const n = i + 1;
          const reached = n < next;
          return (
            <button
              key={n}
              type="button"
              data-autofocus={n === 1 ? "" : undefined}
              className={`${styles.dot} ${reached ? styles.reached : ""} ${n === next ? styles.next : ""} ${wrong === n ? styles.wrong : ""}`}
              style={{ left: `${x}%`, top: `${(y / 120) * 100}%` }}
              aria-label={`Dot ${n}${reached ? ", joined" : n === next ? ", next" : ""}`}
              aria-disabled={reached}
              onClick={() => tap(n)}
            >
              {n}
            </button>
          );
        })}
        {done && <p className={styles.caption}>an idea!</p>}
      </div>
      <p className={styles.status} role="status">
        {done ? "A light bulb. The best things start as a few dots." : wrong ? `Not yet. Find dot ${next}.` : `Find dot ${next}.`}
      </p>
      <div className={styles.actions}>
        {done && (
          <button type="button" onClick={() => setNext(1)}>
            Draw it again
          </button>
        )}
      </div>
    </div>
  );
}
