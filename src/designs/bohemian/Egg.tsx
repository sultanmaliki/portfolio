"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { clamp, pick, rand } from "../shared/eggKit";
import styles from "./egg.module.css";

const MAX = 40;
const PETALS = [
  { fill: "#c2674a", core: "#e9c46a", count: 6, round: true },
  { fill: "#fffaf0", core: "#e9c46a", count: 10, round: false },
  { fill: "#e9c46a", core: "#9e4a2f", count: 8, round: false },
  { fill: "#f0c9b8", core: "#c2674a", count: 5, round: true },
];

interface Flower {
  id: number;
  x: number;
  y: number;
  r: number;
  bend: number;
  kind: (typeof PETALS)[number];
  turn: number;
}

/** Type "bloom" (or tap the name five times): a garden. Tap to plant, and watch who visits. */
export default function BohemianEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "bohemian", word: "bloom", duration: 0 });
  return (
    <EggDialog slug="bohemian" active={active} title="The garden" onClose={dismiss} variant="stage" className={styles.stage}>
      <Garden />
    </EggDialog>
  );
}

function Garden() {
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [visit, setVisit] = useState<{ x: number; y: number } | null>(null);
  const id = useRef(1);
  const flowersRef = useRef<Flower[]>([]);

  useEffect(() => {
    flowersRef.current = flowers;
  }, [flowers]);

  useEffect(() => {
    const fit = () => stage.current && setSize({ w: stage.current.clientWidth, h: stage.current.clientHeight });
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const floor = size.h - 70;

  const plant = (x: number, y: number) => {
    const flower: Flower = { id: id.current++, x: clamp(x, 24, size.w - 24), y: clamp(y, 150, floor - 40), r: rand(15, 26), bend: rand(-40, 40), kind: pick(PETALS), turn: rand(0, 60) };
    setFlowers((all) => [...all.slice(-(MAX - 1)), flower]);
  };

  const water = () => {
    for (let i = 0; i < 6; i++) setTimeout(() => plant(rand(30, size.w - 30), rand(170, floor - 50)), i * 160);
  };

  // once there are a few flowers, a butterfly drops by
  useEffect(() => {
    const move = () => {
      const all = flowersRef.current;
      if (all.length < 4) return setVisit(null);
      const f = pick(all);
      setVisit({ x: f.x, y: f.y });
    };
    const t = setInterval(move, 2600);
    return () => clearInterval(t);
  }, []);

  const onStage = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest("svg")) return;
    const r = e.currentTarget.getBoundingClientRect();
    plant(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <div ref={stage} className={styles.garden} onPointerDown={onStage}>
      <svg className={styles.svg} viewBox={`0 0 ${size.w} ${size.h}`} width={size.w} height={size.h} aria-hidden>
        <rect x="0" y={floor} width={size.w} height={size.h - floor} fill="#9e4a2f" opacity="0.28" />
        {flowers.map((f) => (
          <g key={f.id}>
            <path d={`M${f.x} ${floor} Q${f.x + f.bend} ${(floor + f.y) / 2} ${f.x} ${f.y}`} pathLength={1} className={styles.stem} />
            <ellipse cx={f.x + f.bend * 0.55} cy={floor - (floor - f.y) * 0.4} rx="14" ry="5" fill="#3f6b4e" transform={`rotate(-30 ${f.x + f.bend * 0.55} ${floor - (floor - f.y) * 0.4})`} className={styles.leaf} />
            <ellipse cx={f.x + f.bend * 0.3 - 12} cy={floor - (floor - f.y) * 0.22} rx="12" ry="4" fill="#3f6b4e" transform={`rotate(25 ${f.x + f.bend * 0.3 - 12} ${floor - (floor - f.y) * 0.22})`} className={styles.leaf} />
            <g transform={`translate(${f.x} ${f.y}) rotate(${f.turn})`}>
              <g className={styles.head}>
                {Array.from({ length: f.kind.count }, (_, i) => (
                  <ellipse key={i} cx="0" cy={-f.r * 0.62} rx={f.kind.round ? f.r * 0.5 : f.r * 0.24} ry={f.r * 0.5} fill={f.kind.fill} stroke="#3b2a20" strokeWidth="1.2" transform={`rotate(${(360 / f.kind.count) * i})`} />
                ))}
                <circle r={f.r * 0.3} fill={f.kind.core} stroke="#3b2a20" strokeWidth="1.2" />
              </g>
            </g>
          </g>
        ))}
      </svg>
      {visit && (
        <div className={styles.butterfly} style={{ left: visit.x, top: visit.y - 30 } as CSSProperties} aria-hidden>
          <svg viewBox="0 0 40 30" width="38" height="28">
            <g className={styles.wings}>
              <ellipse cx="12" cy="10" rx="11" ry="8" fill="#e9c46a" stroke="#3b2a20" strokeWidth="1.2" />
              <ellipse cx="28" cy="10" rx="11" ry="8" fill="#e9c46a" stroke="#3b2a20" strokeWidth="1.2" />
              <ellipse cx="14" cy="21" rx="7" ry="5" fill="#c2674a" stroke="#3b2a20" strokeWidth="1.2" />
              <ellipse cx="26" cy="21" rx="7" ry="5" fill="#c2674a" stroke="#3b2a20" strokeWidth="1.2" />
            </g>
            <rect x="19" y="4" width="2.4" height="22" rx="1.2" fill="#3b2a20" />
          </svg>
        </div>
      )}
      <div className={styles.bar}>
        <p className={styles.title}>
          The garden <span role="status">{flowers.length} {flowers.length === 1 ? "flower" : "flowers"}</span>
        </p>
        <div className={styles.actions}>
          <button type="button" data-autofocus onClick={() => plant(rand(30, size.w - 30), rand(170, floor - 50))}>
            Plant one
          </button>
          <button type="button" onClick={water}>
            Water
          </button>
          <button type="button" onClick={() => setFlowers([])} disabled={!flowers.length}>
            Clear
          </button>
          <EggClose className={styles.close}>Done</EggClose>
        </div>
        <p className={styles.hint}>Tap anywhere to plant a flower. A visitor arrives after four.</p>
      </div>
    </div>
  );
}
