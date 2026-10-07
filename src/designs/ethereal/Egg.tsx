"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { pick, rand } from "../shared/eggKit";
import styles from "./egg.module.css";

const WISHES = [
  "may your build pass the first time",
  "no merge conflicts today",
  "a quiet stand-up",
  "may the bug be in the first place you look",
  "less YAML, more sleep",
  "a warm cache and a cold drink",
  "tests that fail for the right reasons",
  "may the deploy be boring",
  "everything works on the first run",
  "someone reads the README",
];
const MAX = 28;
const LIFE = 14000;

interface Lantern {
  id: number;
  x: number;
  text: string;
  hue: number;
  rise: number;
  drift: number;
  seconds: number;
}

/** Type "wish" (or tap the name five times): a night sky. Write a wish and release it as a lantern, or tap the sky for one. */
export default function EtherealEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "ethereal", word: "wish", duration: 0 });
  return (
    <EggDialog slug="ethereal" active={active} title="Wishing lanterns" onClose={dismiss} variant="stage" className={styles.stage}>
      <Sky />
    </EggDialog>
  );
}

function Sky() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [text, setText] = useState("");
  const [released, setReleased] = useState(0);
  const id = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const release = (wish: string, x = rand(8, 88)) => {
    const lantern: Lantern = { id: id.current++, x, text: wish, hue: Math.floor(rand(18, 48)), rise: rand(55, 78), drift: rand(-12, 12), seconds: rand(11, 14) };
    setLanterns((all) => [...all.slice(-(MAX - 1)), lantern]);
    setReleased((n) => n + 1);
    timers.current.push(setTimeout(() => setLanterns((all) => all.filter((l) => l.id !== lantern.id)), LIFE));
  };

  useEffect(() => {
    const pending = timers.current;
    // the sky is never empty: a few wishes from other visitors are already drifting up
    [0, 1, 2].forEach((i) => pending.push(setTimeout(() => release(pick(WISHES)), 300 + i * 900)));
    return () => pending.forEach(clearTimeout);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    release(text.trim() || pick(WISHES));
    setText("");
  };

  const tapSky = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    release(pick(WISHES), (e.clientX / window.innerWidth) * 100);
  };

  return (
    <div className={styles.sky} onPointerDown={tapSky}>
      {lanterns.map((l) => (
        <div key={l.id} aria-hidden className={styles.lantern} style={{ left: `${l.x}%`, "--rise": `${l.rise}vh`, "--drift": `${l.drift}vw`, "--hue": l.hue, animationDuration: `${l.seconds}s` } as React.CSSProperties}>
          <span className={styles.flame} />
          <span className={styles.body}>{l.text}</span>
        </div>
      ))}
      <div className={styles.bar}>
        <p className={styles.title}>
          Wishing lanterns <span role="status">{released} released</span>
        </p>
        <EggClose className={styles.close}>Done</EggClose>
        <form className={styles.form} onSubmit={submit}>
          <input data-autofocus value={text} onChange={(e) => setText(e.target.value)} maxLength={48} placeholder="Write a wish" aria-label="Your wish" autoComplete="off" enterKeyHint="send" />
          <button type="submit">Release</button>
        </form>
        <p className={styles.hint}>Or tap the sky for a lantern.</p>
      </div>
    </div>
  );
}
