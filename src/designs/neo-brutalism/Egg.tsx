"use client";

import { useEffect, useRef, useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { pick, readBest, saveBest } from "../shared/eggKit";
import styles from "./egg.module.css";

const ROUND = 30; // seconds
const HOLES = [7, 8, 9, 4, 5, 6, 1, 2, 3]; // laid out like a numpad, so the number keys hit the matching hole

interface Critter {
  kind: "bug" | "feature";
  until: number;
}

/** Type "bam" (or tap the name five times): squash the bugs, but spare the features. */
export default function NeoBrutalismEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "neo-brutalism", word: "bam", duration: 0 });
  return (
    <EggDialog slug="neo-brutalism" active={active} title="Squash the bugs" onClose={dismiss} className={styles.backdrop}>
      <Game />
    </EggDialog>
  );
}

function verdict(score: number) {
  if (score >= 22) return "Production is safe. Promote this person.";
  if (score >= 14) return "Senior debugger energy.";
  if (score >= 7) return "Solid. The backlog fears you.";
  return "Every great dev starts with a few unsquashed bugs.";
}

function Game() {
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const [cells, setCells] = useState<(Critter | null)[]>(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND);
  const [note, setNote] = useState("Hit the red BUGs. Never hit a FEATURE.");
  const [best, setBest] = useState(() => readBest("neo-brutalism"));
  const started = useRef(0);
  const scoreRef = useRef(0);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setCells(Array(9).fill(null));
    setLeft(ROUND);
    setNote("Go!");
    started.current = Date.now();
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - started.current) / 1000;
      if (elapsed >= ROUND) {
        setPhase("over");
        setCells(Array(9).fill(null));
        setBest((b) => {
          if (scoreRef.current > b) {
            saveBest("neo-brutalism", scoreRef.current);
            return scoreRef.current;
          }
          return b;
        });
        return;
      }
      setLeft(Math.ceil(ROUND - elapsed));
      const life = 1100 - Math.min(elapsed / ROUND, 1) * 500; // they get quicker
      setCells((current) => {
        const next = current.map((c) => (c && c.until > now ? c : null));
        const live = next.filter(Boolean).length;
        if (live < 1 + Math.floor(elapsed / 10) && Math.random() < 0.55) {
          const free = next.flatMap((c, i) => (c ? [] : [i]));
          if (free.length) next[pick(free)] = { kind: Math.random() < 0.22 ? "feature" : "bug", until: now + life };
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [phase]);

  const hit = (index: number) => {
    if (phase !== "play") return;
    const target = cells[index];
    if (!target) return;
    setCells((c) => c.map((x, i) => (i === index ? null : x)));
    if (target.kind === "bug") {
      scoreRef.current += 1;
      setNote("SPLAT.");
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 3);
      setNote("That was a FEATURE! -3");
    }
    setScore(scoreRef.current);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) hit(HOLES.indexOf(Number(e.key)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h2>Squash the bugs</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <div className={styles.stats} aria-hidden>
        <span>Score {score}</span>
        <span>Time {left}</span>
        <span>Best {best}</span>
      </div>
      <p className={styles.note} role="status">
        {phase === "over" ? `Time. ${score} ${score === 1 ? "bug" : "bugs"} squashed. ${verdict(score)}` : note}
      </p>
      <div className={styles.grid}>
        {HOLES.map((n, i) => {
          const c = cells[i];
          return (
            <button
              key={n}
              type="button"
              className={`${styles.hole} ${c ? (c.kind === "bug" ? styles.bug : styles.feature) : ""}`}
              onClick={() => hit(i)}
              aria-label={c ? `${c.kind} in hole ${n}` : `Empty hole ${n}`}
            >
              {c ? (c.kind === "bug" ? "BUG" : "FEATURE") : <span aria-hidden>{n}</span>}
            </button>
          );
        })}
      </div>
      {phase !== "play" && (
        <button type="button" className={styles.start} data-autofocus onClick={start}>
          {phase === "over" ? "Again" : "Start"}
        </button>
      )}
      <p className={styles.keys}>Keys 1 to 9 work too.</p>
    </div>
  );
}
