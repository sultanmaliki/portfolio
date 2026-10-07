"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { clamp, rand } from "../shared/eggKit";
import styles from "./egg.module.css";

type Pt = [number, number];

// A bowl in a 160 x 80 box, broken along five cracks that meet near the middle. Neighbouring shards share every crack point.
const C: Pt = [100, 72];
const SHARDS: Pt[][] = [
  [[20, 40], [62, 40], [76, 56], [88, 64], C, [88, 88], [76, 104], [72, 118], [68, 108], [50, 98], [34, 82], [24, 62]],
  [[62, 40], [128, 40], [118, 58], [108, 64], C, [88, 64], [76, 56]],
  [[128, 40], [180, 40], [176, 62], [169, 76], [146, 76], [122, 78], C, [108, 64], [118, 58]],
  [[169, 76], [166, 82], [150, 98], [132, 108], [128, 118], [124, 104], [112, 90], C, [122, 78], [146, 76]],
  [[128, 118], [72, 118], [76, 104], [88, 88], C, [112, 90], [124, 104]],
];
const TONES = ["#bdb6a3", "#c7c0ae", "#b3ab97", "#c2baa6", "#b8b09c"];
const SEAMS: Pt[][] = [
  [[62, 40], [76, 56], [88, 64], C],
  [[128, 40], [118, 58], [108, 64], C],
  [[169, 76], [146, 76], [122, 78], C],
  [[128, 118], [124, 104], [112, 90], C],
  [[72, 118], [76, 104], [88, 88], C],
];
const OUTLINE: Pt[] = [[20, 40], [180, 40], [176, 62], [166, 82], [150, 98], [132, 108], [128, 118], [72, 118], [68, 108], [50, 98], [34, 82], [24, 62]];
const SNAP = 11; // how close, in box units, counts as in place
const ORIGIN = { x: 40, y: 10 }; // where the whole bowl sits in the 240 x 260 picture

const path = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
const line = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join("L")}`;

const centre = (pts: Pt[]): Pt => [pts.reduce((a, [x]) => a + x, 0) / pts.length, pts.reduce((a, [, y]) => a + y, 0) / pts.length];
// where the shards wait, below the bowl: two rows, in the picture's own coordinates
const SLOTS: Pt[] = [[48, 175], [120, 172], [192, 175], [84, 232], [160, 232]];

/** Every shard to its own spot in the tray, in a different order each time, with a little jitter so it looks tossed. */
const scatter = () => {
  const order = SLOTS.map((slot) => ({ slot, k: Math.random() })).sort((a, b) => a.k - b.k).map((o) => o.slot);
  return SHARDS.map((pts, i) => {
    const [cx, cy] = centre(pts);
    return { dx: order[i][0] - (ORIGIN.x + cx) + rand(-5, 5), dy: order[i][1] - (ORIGIN.y + cy) + rand(-4, 4) };
  });
};

/** Type "kintsugi" (or tap the name five times): a broken bowl. Drag the shards back together; the cracks are mended with gold. */
export default function WabiEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "wabi-sabi", word: "kintsugi", duration: 0 });
  return (
    <EggDialog slug="wabi-sabi" active={active} title="Mend the bowl" onClose={dismiss} className={styles.backdrop}>
      <Bowl />
    </EggDialog>
  );
}

function Bowl() {
  const [pos, setPos] = useState(scatter);
  const [placed, setPlaced] = useState<boolean[]>(() => SHARDS.map(() => false));
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ i: number; x: number; y: number; dx: number; dy: number } | null>(null);
  const done = placed.every(Boolean);
  const count = placed.filter(Boolean).length;

  const settle = (i: number, dx: number, dy: number) => {
    if (Math.hypot(dx, dy) <= SNAP) {
      setPos((p) => p.map((v, k) => (k === i ? { dx: 0, dy: 0 } : v)));
      setPlaced((p) => p.map((v, k) => (k === i ? true : v)));
    }
  };

  const down = (e: ReactPointerEvent<SVGGElement>, i: number) => {
    if (placed[i]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, x: e.clientX, y: e.clientY, dx: pos[i].dx, dy: pos[i].dy };
  };

  const move = (e: ReactPointerEvent<SVGGElement>) => {
    const d = drag.current;
    const box = svg.current?.getBoundingClientRect();
    if (!d || !box) return;
    const scale = 240 / box.width;
    const dx = clamp(d.dx + (e.clientX - d.x) * scale, -ORIGIN.x - 20, 260);
    const dy = clamp(d.dy + (e.clientY - d.y) * scale, -ORIGIN.y - 20, 270);
    setPos((p) => p.map((v, k) => (k === d.i ? { dx, dy } : v)));
  };

  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (d) settle(d.i, pos[d.i].dx, pos[d.i].dy);
  };

  const key = (e: KeyboardEvent<SVGGElement>, i: number) => {
    if (placed[i]) return;
    const step = e.shiftKey ? 24 : 6;
    const by: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (e.key in by) {
      e.preventDefault();
      const [mx, my] = by[e.key];
      const dx = pos[i].dx + mx;
      const dy = pos[i].dy + my;
      setPos((p) => p.map((v, k) => (k === i ? { dx, dy } : v)));
      settle(i, dx, dy);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      settle(i, 0, 0);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.top}>
        <h2>Mend the bowl</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <svg ref={svg} viewBox="0 0 240 270" className={styles.picture} role="group" aria-label="A broken bowl. Drag each shard to its place, or focus one and press Enter.">
        <g transform={`translate(${ORIGIN.x} ${ORIGIN.y})`}>
          <path d={path(OUTLINE)} className={styles.ghost} />
          {SHARDS.map((pts, i) => (
            <g
              key={i}
              transform={`translate(${pos[i].dx} ${pos[i].dy})`}
              className={`${styles.shard} ${placed[i] ? styles.locked : ""}`}
              tabIndex={placed[i] ? -1 : 0}
              data-autofocus={i === 0 ? "" : undefined}
              role="button"
              aria-label={`Shard ${i + 1} of ${SHARDS.length}${placed[i] ? ", in place" : ""}`}
              aria-disabled={placed[i]}
              onPointerDown={(e) => down(e, i)}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onKeyDown={(e) => key(e, i)}
            >
              <path d={path(pts)} fill={TONES[i]} />
            </g>
          ))}
          {done && (
            <g className={styles.gold}>
              {SEAMS.map((s, i) => (
                <path key={i} d={line(s)} pathLength={1} style={{ animationDelay: `${i * 0.25}s` }} />
              ))}
            </g>
          )}
        </g>
      </svg>
      <p className={styles.status} role="status">
        {done ? "Mended with gold. The cracks are the best part." : `${count} of ${SHARDS.length} shards in place. Drag them back together.`}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => {
            setPos(scatter());
            setPlaced(SHARDS.map(() => false));
          }}
        >
          {done ? "Break it again" : "Scatter"}
        </button>
      </div>
    </div>
  );
}
