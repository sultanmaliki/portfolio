"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { clamp, rand } from "../shared/eggKit";
import styles from "./egg.module.css";

const KINDS = ["star", "heart", "flower", "bolt", "smile", "arrow", "polaroid", "tape", "hire", "open", "ship"] as const;
type Kind = (typeof KINDS)[number];
const NAMES: Record<Kind, string> = {
  star: "Star",
  heart: "Heart",
  flower: "Flower",
  bolt: "Lightning bolt",
  smile: "Smiley",
  arrow: "Arrow",
  polaroid: "Polaroid",
  tape: "Tape",
  hire: "Hire me label",
  open: "Open to work label",
  ship: "Ships on Fridays label",
};
const LABELS: Partial<Record<Kind, string>> = { hire: "HIRE ME", open: "open to work", ship: "ships on fridays" };
const MAX = 60;

interface Placed {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  rot: number;
}

const outline = "#3d405b";

function Art({ kind }: { kind: Kind }) {
  const label = LABELS[kind];
  if (label) return <span className={`${styles.label} ${styles[kind]}`}>{label}</span>;
  switch (kind) {
    case "star":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="#ffd23f" stroke={outline} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d="M50 88C10 58 6 30 28 18 40 12 50 22 50 30 50 22 60 12 72 18 94 30 90 58 50 88Z" fill="#f7b7c3" stroke={outline} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case "flower":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={50 + 24 * Math.cos(((a - 90) * Math.PI) / 180)} cy={50 + 24 * Math.sin(((a - 90) * Math.PI) / 180)} r="17" fill="#b7d6f2" stroke={outline} strokeWidth="3" />
          ))}
          <circle cx="50" cy="50" r="13" fill="#ffe08a" stroke={outline} strokeWidth="3" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <polygon points="58,4 20,54 46,54 38,96 80,40 54,40" fill="#ffb84d" stroke={outline} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case "smile":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="40" fill="#ffe08a" stroke={outline} strokeWidth="3" />
          <circle cx="36" cy="42" r="5" fill={outline} />
          <circle cx="64" cy="42" r="5" fill={outline} />
          <path d="M30 60Q50 80 70 60" fill="none" stroke={outline} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <path d="M10 76C28 24 62 18 84 50M64 36 86 52 66 68" fill="none" stroke="#8a301a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "polaroid":
      return (
        <svg viewBox="0 0 100 100" aria-hidden>
          <rect x="14" y="8" width="72" height="86" fill="#fffdf7" stroke={outline} strokeWidth="3" />
          <rect x="22" y="16" width="56" height="54" fill="#b7d6f2" />
          <circle cx="60" cy="32" r="8" fill="#ffe08a" />
          <path d="M22 70 40 46 54 62 64 52 78 70Z" fill="#bfe3c0" />
        </svg>
      );
    case "tape":
      return (
        <svg viewBox="0 0 120 40" aria-hidden className={styles.tapeArt}>
          <path d="M2 4 8 10 2 16 8 22 2 28 8 34 2 38H118L112 34 118 28 112 22 118 16 112 10 118 4Z" fill="rgba(224,122,95,0.85)" />
          {[20, 44, 68, 92].map((x) => (
            <path key={x} d={`M${x} 4 ${x + 12} 38`} stroke="rgba(255,255,255,0.45)" strokeWidth="5" />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

/** Type "stick" (or tap the name five times): a sticker sheet. Pick one, tap the page to slap it down, drag to move it. */
export default function ScrapbookEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "scrapbook", word: "stick", duration: 0 });
  return (
    <EggDialog slug="scrapbook" active={active} title="Sticker sheet" onClose={dismiss} variant="stage" className={styles.stage}>
      <Sheet />
    </EggDialog>
  );
}

function Sheet() {
  const stage = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<Kind>("star");
  const [placed, setPlaced] = useState<Placed[]>([]);
  const next = useRef(1);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);

  const add = (x: number, y: number, k: Kind = kind) => {
    setPlaced((all) => [...all.slice(-(MAX - 1)), { id: next.current++, kind: k, x, y, rot: rand(-18, 18) }]);
  };

  const box = () => stage.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 800, height: 600 };

  const stampRandom = () => {
    const b = box();
    add(rand(80, b.width - 80), rand(120, b.height - 140));
  };

  const onStage = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const b = box();
    add(e.clientX - b.left, e.clientY - b.top);
  };

  const grab = (e: ReactPointerEvent<HTMLDivElement>, p: Placed) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = box();
    drag.current = { id: p.id, dx: p.x - (e.clientX - b.left), dy: p.y - (e.clientY - b.top) };
    // the sticker you pick up goes on top
    setPlaced((all) => [...all.filter((x) => x.id !== p.id), p]);
  };

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const b = box();
    const x = clamp(e.clientX - b.left + d.dx, 0, b.width);
    const y = clamp(e.clientY - b.top + d.dy, 0, b.height);
    setPlaced((all) => all.map((p) => (p.id === d.id ? { ...p, x, y } : p)));
  };

  return (
    <div ref={stage} className={styles.sheet} onPointerDown={onStage}>
      {placed.map((p) => (
        <div
          key={p.id}
          className={styles.placed}
          style={{ left: p.x, top: p.y, rotate: `${p.rot}deg` }}
          onPointerDown={(e) => grab(e, p)}
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <Art kind={p.kind} />
        </div>
      ))}
      <div className={styles.tray}>
        <p className={styles.title}>
          Sticker sheet <span role="status">{placed.length} stuck</span>
        </p>
        <div className={styles.picker} role="group" aria-label="Choose a sticker">
          {KINDS.map((k) => (
            <button key={k} type="button" className={styles.choice} aria-pressed={k === kind} aria-label={NAMES[k]} onClick={() => setKind(k)}>
              <Art kind={k} />
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" data-autofocus onClick={stampRandom}>
            Stick it
          </button>
          <button type="button" onClick={() => setPlaced((all) => all.slice(0, -1))} disabled={!placed.length}>
            Undo
          </button>
          <button type="button" onClick={() => setPlaced([])} disabled={!placed.length}>
            Clear
          </button>
          <EggClose className={styles.close}>Done</EggClose>
        </div>
        <p className={styles.hint}>Tap the page to place the chosen sticker. Drag one to move it.</p>
      </div>
    </div>
  );
}
