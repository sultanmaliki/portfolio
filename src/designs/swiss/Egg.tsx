"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { clamp } from "../shared/eggKit";
import { mess, rank, RANGE, scoreOffsets, WORDS } from "./kerning";
import styles from "./egg.module.css";

const SLIDER = { "aria-orientation": "horizontal", "aria-valuemin": -RANGE, "aria-valuemax": RANGE } as const;

/** Type "baseline" (or tap the name five times): the kerning game. Space each word the way its typeface intended. */
export default function SwissEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "swiss", word: "baseline", duration: 0 });
  return (
    <EggDialog slug="swiss" active={active} title="Kerning game" onClose={dismiss} className={styles.backdrop}>
      <Game />
    </EggDialog>
  );
}

/** Where each letter of `word` sits (in em) when the font kerns it itself, and the word's width. Measured, not guessed. */
function measure(probe: HTMLElement): { xs: number[]; width: number } | null {
  const node = probe.firstChild;
  if (!node) return null;
  const size = parseFloat(getComputedStyle(probe).fontSize);
  const left = probe.getBoundingClientRect().left;
  const range = document.createRange();
  const text = node.textContent ?? "";
  const xs = [...text].map((_, i) => {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    return (range.getBoundingClientRect().left - left) / size;
  });
  return { xs, width: probe.getBoundingClientRect().width / size };
}

function Game() {
  const [round, setRound] = useState(0);
  const [offsets, setOffsets] = useState<number[]>(() => mess(WORDS[0].length));
  const [checked, setChecked] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [layout, setLayout] = useState<{ xs: number[]; width: number } | null>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [drag, setDrag] = useState<{ i: number; x: number; start: number; size: number } | null>(null);
  const word = WORDS[round] ?? WORDS[WORDS.length - 1];
  const finished = round >= WORDS.length;
  const total = scores.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (finished) return;
    const run = () => probe.current && setLayout(measure(probe.current));
    run();
    document.fonts?.ready.then(run);
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [round, finished]);

  const nudge = (i: number, by: number) => {
    if (checked || i === 0) return;
    setOffsets((o) => o.map((v, k) => (k === i ? clamp(v + by, -RANGE, RANGE) : v)));
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(i, -step);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(i, step);
    } else if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
  };

  const down = (e: ReactPointerEvent<HTMLElement>, i: number) => {
    if (checked || i === 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ i, x: e.clientX, start: offsets[i], size: parseFloat(getComputedStyle(e.currentTarget).fontSize) });
  };

  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag;
    if (!d) return;
    const value = clamp(d.start + (e.clientX - d.x) / d.size, -RANGE, RANGE);
    setOffsets((o) => o.map((v, k) => (k === d.i ? value : v)));
  };

  const check = () => {
    if (checked || finished) return;
    setScores((s) => [...s, scoreOffsets(offsets)]);
    setChecked(true);
  };

  const next = () => {
    const nextRound = round + 1;
    setRound(nextRound);
    setChecked(false);
    setLayout(null);
    if (nextRound < WORDS.length) setOffsets(mess(WORDS[nextRound].length));
  };

  const restart = () => {
    setRound(0);
    setScores([]);
    setChecked(false);
    setLayout(null);
    setOffsets(mess(WORDS[0].length));
  };

  const last = scores[scores.length - 1];

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h2>Kerning</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      {finished ? (
        <div className={styles.result}>
          <p className={styles.big}>
            {total}
            <span> / {WORDS.length * 100}</span>
          </p>
          <p role="status">{rank(total, WORDS.length)}</p>
          <button type="button" data-autofocus className={styles.primary} onClick={restart}>
            Play again
          </button>
        </div>
      ) : (
        <>
          <p className={styles.round} aria-hidden>
            Word {round + 1} of {WORDS.length}
          </p>
          <div className={styles.arena}>
            <span ref={probe} className={styles.probe} aria-hidden>
              {word}
            </span>
            <div className={styles.word} style={{ width: layout ? `${layout.width}em` : undefined }} role="group" aria-label={`Spacing for the word ${word}. Move each letter with the arrow keys or by dragging.`}>
              {layout &&
                [...word].map((ch, i) => {
                  const off = offsets[i];
                  const bad = checked && Math.abs(off) > 0.03;
                  return (
                    <span key={i}>
                      {checked && <i className={styles.guide} style={{ left: `${layout.xs[i]}em` }} aria-hidden />}
                      <span
                        role="slider"
                        tabIndex={i === 0 ? -1 : 0}
                        data-autofocus={i === 1 ? "" : undefined}
                        aria-label={`Letter ${ch}${i === 0 ? ", fixed" : ""}`}
                        {...SLIDER}
                        aria-valuenow={Math.round(off * 100) / 100}
                        aria-valuetext={`${Math.abs(Math.round(off * 100))} hundredths of an em ${off < 0 ? "left" : "right"} of its place`}
                        className={`${styles.letter} ${i === 0 ? styles.fixed : ""} ${bad ? styles.bad : ""}`}
                        style={{ left: `${layout.xs[i] + off}em` }}
                        onPointerDown={(e) => down(e, i)}
                        onPointerMove={move}
                        onPointerUp={() => setDrag(null)}
                        onPointerCancel={() => setDrag(null)}
                        onKeyDown={(e) => onKey(e, i)}
                      >
                        {ch}
                      </span>
                    </span>
                  );
                })}
            </div>
          </div>
          <p className={styles.status} role="status">
            {checked ? `${last} out of 100. Red ticks show where each letter belonged.` : "Drag the letters, or use the arrow keys, until the spacing looks even."}
          </p>
          <div className={styles.actions}>
            {checked ? (
              <button type="button" className={styles.primary} onClick={next}>
                {round + 1 >= WORDS.length ? "See score" : "Next word"}
              </button>
            ) : (
              <>
                <button type="button" className={styles.primary} onClick={check}>
                  Check
                </button>
                <button type="button" onClick={() => setOffsets(mess(word.length))}>
                  Re-mess
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
