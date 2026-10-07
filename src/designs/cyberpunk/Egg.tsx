"use client";

import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { allowed, BUFFER, generate, reachable, SIZE, uploaded, type Puzzle } from "./breach";
import styles from "./egg.module.css";

const SECONDS = 35;
const { profile } = portfolio;

/** Type "glitch" (or tap the name five times): breach protocol. Pick codes along the grid to upload daemons before time runs out. */
export default function CyberpunkEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "cyberpunk", word: "glitch", duration: 0 });
  return (
    <EggDialog slug="cyberpunk" active={active} title="Breach protocol" onClose={dismiss} className={styles.backdrop}>
      <Breach />
    </EggDialog>
  );
}

function Breach() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generate());
  const [path, setPath] = useState<number[]>([]);
  const [phase, setPhase] = useState<"ready" | "play" | "over">("ready");
  const [time, setTime] = useState(SECONDS);
  const startedAt = useRef(0);
  const buffer = path.map((i) => puzzle.grid[i]);
  const won = puzzle.daemons.filter((d) => uploaded(buffer, d));
  const next = phase === "play" ? allowed(path) : [];

  const start = () => {
    setPuzzle(generate());
    setPath([]);
    setTime(SECONDS);
    startedAt.current = Date.now();
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      const left = SECONDS - (Date.now() - startedAt.current) / 1000;
      if (left <= 0) {
        setTime(0);
        setPhase("over");
      } else setTime(left);
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const pick = (cell: number) => {
    if (phase !== "play" || !allowed(path).includes(cell)) return;
    const nextPath = [...path, cell];
    setPath(nextPath);
    const codes = nextPath.map((i) => puzzle.grid[i]);
    const all = puzzle.daemons.every((d) => uploaded(codes, d));
    if (all || nextPath.length >= BUFFER) setPhase("over");
  };

  const success = won.length > 0;

  return (
    <div className={styles.rig}>
      <div className={styles.top}>
        <h2 className={styles.title} data-text="BREACH PROTOCOL">
          Breach protocol
        </h2>
        <EggClose className={styles.close}>Abort</EggClose>
      </div>
      <div className={styles.timer} aria-hidden>
        <i style={{ width: `${(time / SECONDS) * 100}%` }} />
        <span>{time.toFixed(1)}s</span>
      </div>
      <div className={styles.body}>
        <div className={styles.grid} role="group" aria-label="Code matrix. Pick the highlighted codes.">
          {puzzle.grid.map((code, i) => {
            const used = path.indexOf(i);
            const can = next.includes(i);
            return (
              <button
                key={i}
                type="button"
                className={`${styles.cell} ${can ? styles.can : ""} ${used >= 0 ? styles.used : ""}`}
                tabIndex={can ? 0 : -1}
                aria-disabled={!can}
                aria-label={`Row ${Math.floor(i / SIZE) + 1} column ${(i % SIZE) + 1}, code ${code}${used >= 0 ? ", picked" : can ? ", available" : ""}`}
                onClick={() => pick(i)}
              >
                {code}
              </button>
            );
          })}
        </div>
        <div className={styles.side}>
          <p className={styles.label}>Buffer</p>
          <div className={styles.buffer} role="group" aria-label={`Buffer: ${buffer.join(" ") || "empty"}`}>
            {Array.from({ length: BUFFER }, (_, i) => (
              <span key={i}>{buffer[i] ?? ""}</span>
            ))}
          </div>
          <p className={styles.label}>Daemons</p>
          <ul className={styles.daemons}>
            {puzzle.daemons.map((d) => {
              const ok = uploaded(buffer, d);
              const dead = !ok && !reachable(buffer, d);
              return (
                <li key={d.name} className={ok ? styles.ok : dead ? styles.dead : ""}>
                  <span>{d.codes.join(" ")}</span>
                  <em>
                    {d.name} {ok ? "(uploaded)" : dead ? "(failed)" : ""}
                  </em>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className={styles.status} role="status">
        {phase === "over"
          ? success
            ? `Breach successful. ${won.length} of ${puzzle.daemons.length} daemons uploaded${won.some((d) => d.name === "HIRE_ME.EXE") ? ": HIRE_ME.EXE is running." : "."}`
            : "Breach failed. ICE wins this round."
          : phase === "play"
            ? "First pick from the top row, then alternate column and row."
            : "Upload the daemons by picking codes in order. The top row is first."}
      </p>
      <div className={styles.actions}>
        {phase !== "play" && (
          <button type="button" data-autofocus onClick={start}>
            {phase === "over" ? "Jack in again" : "Jack in"}
          </button>
        )}
        {phase === "over" && won.some((d) => d.name === "HIRE_ME.EXE") && (
          <a href={`mailto:${profile.email}?subject=${encodeURIComponent("HIRE_ME.EXE")}`}>Run HIRE_ME.EXE</a>
        )}
      </div>
    </div>
  );
}
