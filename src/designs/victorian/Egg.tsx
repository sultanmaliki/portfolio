"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { useFrame } from "../shared/eggKit";
import { GUESTS, rank, rate, type Verdict } from "./tea";
import styles from "./egg.module.css";

const POUR_SPEED = 0.38; // cups per second

/** Type "tea" (or tap the name five times): pour tea for five guests, each with their own idea of "a cup". */
export default function VictorianEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "victorian", word: "tea", duration: 0 });
  return (
    <EggDialog slug="victorian" active={active} title="A proper cup of tea" onClose={dismiss} className={styles.backdrop}>
      <Parlour />
    </EggDialog>
  );
}

function Parlour() {
  const [guest, setGuest] = useState(0);
  const [phase, setPhase] = useState<"ready" | "pouring" | "served" | "over">("ready");
  const [fill, setFill] = useState(0);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const fillRef = useRef(0);
  const phaseRef = useRef<typeof phase>("ready");
  const g = GUESTS[Math.min(guest, GUESTS.length - 1)];
  const total = verdicts.reduce((sum, v) => sum + v.points, 0);

  const go = (p: typeof phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const serve = () => {
    if (phaseRef.current !== "pouring") return;
    const verdict = rate(fillRef.current, GUESTS[guest].target);
    const all = [...verdicts, verdict];
    setVerdicts(all);
    go(guest + 1 >= GUESTS.length ? "over" : "served");
  };

  useFrame((dt) => {
    if (phaseRef.current !== "pouring") return;
    fillRef.current += POUR_SPEED * dt;
    setFill(fillRef.current);
    if (fillRef.current > 1.12) serve(); // it has run over; no point holding on
  }, true);

  const begin = () => {
    // the main button does a different job each time: pour, then move on, then start again
    if (phaseRef.current === "ready") {
      fillRef.current = 0;
      setFill(0);
      go("pouring");
    } else if (phaseRef.current === "served") {
      setGuest((n) => n + 1);
      setFill(0);
      fillRef.current = 0;
      go("ready");
    } else if (phaseRef.current === "over") {
      setGuest(0);
      setVerdicts([]);
      setFill(0);
      fillRef.current = 0;
      go("ready");
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      begin();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      serve();
    }
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    begin();
  };

  const last = verdicts[verdicts.length - 1];
  const level = Math.min(fill, 1.1);
  const liquidY = 90 - 70 * Math.min(level, 1);
  const targetY = 90 - 70 * g.target;
  const spilled = fill > 1;

  return (
    <div className={styles.parlour}>
      <div className={styles.top}>
        <h2>A proper cup of tea</h2>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <p className={styles.guest} aria-hidden>
        Guest {Math.min(guest + 1, GUESTS.length)} of {GUESTS.length} · {total} {total === 1 ? "point" : "points"}
      </p>
      <p className={styles.request}>
        <b>{g.name}</b> asks: <i>“{g.request}”</i>
      </p>
      <svg viewBox="0 0 140 110" className={styles.cup} role="img" aria-label={`Teacup, ${Math.round(Math.min(fill, 1) * 100)} percent full`}>
        <defs>
          <clipPath id="vic-cup">
            <path d="M10 20H110L98 80Q96 90 86 90H34Q24 90 22 80Z" />
          </clipPath>
        </defs>
        {phase === "pouring" && <path className={styles.stream} d={`M60 0V${liquidY}`} />}
        <g clipPath="url(#vic-cup)">
          <rect x="0" y={liquidY} width="140" height="100" fill="#8a4b1f" />
          <rect x="0" y={liquidY} width="140" height="3" fill="#b6773a" />
        </g>
        <path d="M10 20H110L98 80Q96 90 86 90H34Q24 90 22 80Z" fill="none" stroke="#2a1a14" strokeWidth="3" strokeLinejoin="round" />
        <path d="M109 30Q134 30 130 52Q126 72 100 70" fill="none" stroke="#2a1a14" strokeWidth="3" />
        <path d="M18 98H102" stroke="#8a6a2a" strokeWidth="4" strokeLinecap="round" />
        <path d={`M4 ${targetY}H116`} stroke="#8a6a2a" strokeWidth="1.6" strokeDasharray="4 3" />
        {spilled && <path className={styles.spill} d="M20 92Q40 108 70 100Q96 108 112 94" fill="#8a4b1f" />}
      </svg>
      <p className={styles.status} role="status">
        {phase === "over"
          ? `All served. ${total} out of ${GUESTS.length * 3}. ${rank(total, GUESTS.length)}`
          : phase === "served" && last
            ? `${last.label} Next guest, please.`
            : phase === "pouring"
              ? "Pouring... release to serve."
              : "Hold the button to pour. Let go at the dashed line."}
      </p>
      <button type="button" data-autofocus className={styles.pour} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onPointerDown={onPointerDown} onPointerUp={serve} onPointerCancel={serve} onClick={(e) => e.preventDefault()}>
        {phase === "ready" ? "Hold to pour" : phase === "pouring" ? "Pouring..." : phase === "served" ? "Next guest" : "Pour again"}
      </button>
    </div>
  );
}
