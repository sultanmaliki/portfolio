"use client";

import { useState, type KeyboardEvent } from "react";
import { portfolio } from "@/data";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { readBest, saveBest } from "../shared/eggKit";
import { isSolved, neighbours, shuffle, slide, SIZE, solved, tileForArrow } from "./sliding";
import styles from "./egg.module.css";

// the eight tiles are skills from the portfolio itself, so the puzzle is a little bento of the stack
const LABELS = Array.from(new Set(portfolio.skills.flatMap((s) => s.items)))
  .filter((s) => s.length <= 10 && !s.includes("("))
  .slice(0, 8);
const TONES = ["tint", "warm", "dark", "accent", "warm", "tint", "accent", "dark"] as const;

/** Type "bento" (or tap the name five times): a sliding-tile puzzle. Rebuild the grid. */
export default function BentoEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "bento-grid", word: "bento", duration: 0 });
  return (
    <EggDialog slug="bento-grid" active={active} title="Rebuild the bento" onClose={dismiss} className={styles.backdrop}>
      <Puzzle />
    </EggDialog>
  );
}

function Puzzle() {
  const [order, setOrder] = useState<number[]>(() => shuffle());
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const [best, setBest] = useState(() => readBest("bento-grid"));
  const done = isSolved(order);
  const empty = order.indexOf(0);

  const tap = (pos: number) => {
    if (done) return;
    const next = slide(order, pos);
    if (!next) return;
    setOrder(next);
    setMoves((m) => m + 1);
    if (isSolved(next)) {
      setBest((b) => {
        if (!b || moves + 1 < b) {
          saveBest("bento-grid", moves + 1);
          return moves + 1;
        }
        return b;
      });
    }
  };

  const onKey = (e: KeyboardEvent) => {
    const pos = tileForArrow(order, e.key);
    if (pos !== null) {
      e.preventDefault();
      tap(pos);
    }
  };

  const again = () => {
    setOrder(shuffle());
    setMoves(0);
  };

  const shown = peek ? solved() : order;

  return (
    <div className={styles.panel} onKeyDown={onKey}>
      <div className={styles.head}>
        <h2>Rebuild the bento</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <p className={styles.stats} aria-hidden>
        <span>Moves {moves}</span>
        <span>Best {best || "–"}</span>
      </p>
      <div className={`${styles.board} ${done ? styles.done : ""}`} role="group" aria-label="Sliding tiles. Click a tile next to the gap, or use the arrow keys.">
        {Array.from({ length: SIZE * SIZE - 1 }, (_, n) => n + 1).map((id) => {
          const pos = shown.indexOf(id);
          const movable = !peek && !done && neighbours(empty).includes(pos);
          return (
            <button
              key={id}
              type="button"
              data-autofocus={id === 1 ? "" : undefined}
              className={`${styles.tile} ${styles[TONES[id - 1]]} ${movable ? styles.movable : ""}`}
              style={{ left: `${(pos % SIZE) * (100 / SIZE)}%`, top: `${Math.floor(pos / SIZE) * (100 / SIZE)}%` }}
              aria-label={`${LABELS[id - 1] ?? id}, tile ${id}, row ${Math.floor(pos / SIZE) + 1} column ${(pos % SIZE) + 1}${movable ? ", can slide" : ""}`}
              aria-disabled={!movable}
              onClick={() => tap(pos)}
            >
              <span className={styles.num} aria-hidden>
                {id}
              </span>
              <span aria-hidden>{LABELS[id - 1]}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.status} role="status">
        {done ? `Built in ${moves} moves. Everything in its place.` : "Slide the tiles into order, 1 to 8."}
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={again}>
          {done ? "Play again" : "Shuffle"}
        </button>
        <button type="button" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} onKeyDown={(e) => e.key === " " && setPeek(true)} onKeyUp={() => setPeek(false)} onBlur={() => setPeek(false)}>
          Hold to peek
        </button>
      </div>
    </div>
  );
}
