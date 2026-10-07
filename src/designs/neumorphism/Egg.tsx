"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { readBest, saveBest } from "../shared/eggKit";
import { isSolved, press, remaining, scramble, SIZE, type Puzzle } from "./lightsout";
import styles from "./egg.module.css";

/** Type "press" (or tap the name five times): Lights Out. Each press flips a cell and its neighbours; turn every light off. */
export default function NeumorphismEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "neumorphism", word: "press", duration: 0 });
  return (
    <EggDialog slug="neumorphism" active={active} title="Lights out" onClose={dismiss} className={styles.backdrop}>
      <Board />
    </EggDialog>
  );
}

function Board() {
  const [level, setLevel] = useState(1);
  const [puzzle, setPuzzle] = useState<Puzzle>(() => scramble(1));
  const [board, setBoard] = useState(puzzle.board);
  const [pressed, setPressed] = useState<number[]>([]);
  const [hint, setHint] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const [best, setBest] = useState(() => readBest("neumorphism") || 1);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const solved = isSolved(board);

  const load = (lvl: number) => {
    const p = scramble(lvl);
    setLevel(lvl);
    setPuzzle(p);
    setBoard(p.board);
    setPressed([]);
    setHint(null);
  };

  const tap = (i: number) => {
    if (solved) return;
    const nextBoard = press(board, i);
    setBoard(nextBoard);
    setPressed((p) => [...p, i]);
    setHint(null);
    if (isSolved(nextBoard)) {
      setBest((b) => {
        if (level > b) saveBest("neumorphism", level);
        return Math.max(b, level);
      });
    }
  };

  const showHint = () => {
    const left = remaining(puzzle.presses, pressed);
    if (left.length) setHint(left[Math.floor(Math.random() * left.length)]);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const move: Record<string, number> = { ArrowLeft: i % SIZE ? -1 : 0, ArrowRight: i % SIZE < SIZE - 1 ? 1 : 0, ArrowUp: i >= SIZE ? -SIZE : 0, ArrowDown: i < SIZE * (SIZE - 1) ? SIZE : 0 };
    if (e.key in move) {
      e.preventDefault();
      const to = i + move[e.key];
      setFocus(to);
      cells.current[to]?.focus();
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h2>Lights out</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <p className={styles.stats} aria-hidden>
        <span>Level {level}</span>
        <span>Moves {pressed.length}</span>
        <span>Best {best}</span>
      </p>
      <div className={styles.grid} role="group" aria-label="Lights. Pressing one flips it and its four neighbours.">
        {board.map((lit, i) => (
          <button
            key={i}
            ref={(el) => {
              cells.current[i] = el;
            }}
            type="button"
            data-autofocus={i === 0 ? "" : undefined}
            tabIndex={i === focus ? 0 : -1}
            data-hint={hint === i ? "true" : undefined}
            aria-pressed={lit}
            aria-label={`Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}, ${lit ? "on" : "off"}`}
            className={`${styles.cell} ${lit ? styles.on : ""} ${hint === i ? styles.hint : ""}`}
            onClick={() => tap(i)}
            onFocus={() => setFocus(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span aria-hidden className={styles.led} />
          </button>
        ))}
      </div>
      <p className={styles.status} role="status">
        {solved ? `Level ${level} cleared in ${pressed.length} moves. Smooth.` : "Switch every light off."}
      </p>
      <div className={styles.actions}>
        {solved ? (
          <button type="button" onClick={() => load(level + 1)}>
            Next level
          </button>
        ) : (
          <>
            <button type="button" onClick={showHint}>
              Hint
            </button>
            <button type="button" onClick={() => load(level)}>
              New puzzle
            </button>
          </>
        )}
      </div>
    </div>
  );
}
