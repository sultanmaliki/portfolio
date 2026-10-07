"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { clamp, rand } from "../shared/eggKit";
import { caption, FALLBACK, nounFor, type Noun } from "./magritte";
import styles from "./egg.module.css";

const WIN = 7;

interface Mark {
  id: number;
  noun: Noun;
  x: number;
  y: number;
  box: { left: number; top: number; width: number; height: number };
}

/** The thing under a point on the page itself (never the egg). */
function under(x: number, y: number): Element | null {
  const root = document.querySelector('[data-design="surrealism"]');
  return document.elementsFromPoint(x, y).find((el) => !!root && root.contains(el) && !el.closest("[data-egg]")) ?? null;
}

/** Type "ceci" (or tap the name five times): tap anything on the page and it is declared not to be what it is. */
export default function SurrealismEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "surrealism", word: "ceci", duration: 0 });
  return (
    <EggDialog slug="surrealism" active={active} title="Ceci n'est pas" onClose={dismiss} variant="stage" className={styles.stage}>
      <Gallery />
    </EggDialog>
  );
}

function Gallery() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [finale, setFinale] = useState(false);

  const name = (x: number, y: number) => {
    const el = under(x, y);
    const noun = el ? nounFor(el.tagName, el.getAttribute("role")) : FALLBACK;
    const r = el?.getBoundingClientRect();
    const box = r
      ? {
          left: clamp(r.left, 0, window.innerWidth),
          top: clamp(r.top, 0, window.innerHeight),
          width: clamp(r.right, 0, window.innerWidth) - clamp(r.left, 0, window.innerWidth),
          height: clamp(r.bottom, 0, window.innerHeight) - clamp(r.top, 0, window.innerHeight),
        }
      : { left: x - 40, top: y - 40, width: 80, height: 80 };
    const id = Date.now() + Math.random();
    setMarks((all) => [...all.slice(-4), { id, noun, x, y, box }]);
    setTimeout(() => setMarks((all) => all.filter((m) => m.id !== id)), 5500);
    setCount((n) => {
      if (n + 1 === WIN) {
        setDone(true);
        setFinale(true);
        setTimeout(() => setFinale(false), 4500);
      }
      return n + 1;
    });
  };

  const onPage = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) name(e.clientX, e.clientY);
  };

  const surprise = () => name(rand(40, window.innerWidth - 40), rand(80, window.innerHeight - 90));

  return (
    <div className={styles.page} onPointerDown={onPage}>
      {marks.map((m) => {
        const below = m.box.top + m.box.height + 90 < window.innerHeight;
        return (
          <div key={m.id} aria-hidden>
            <div className={styles.frame} style={m.box} />
            <p
              className={styles.plaque}
              style={{ left: clamp(m.x, 150, window.innerWidth - 150), top: below ? m.box.top + m.box.height + 12 : Math.max(m.box.top - 76, 70) }}
            >
              <b>{caption(m.noun)}</b>
              <i>This is not {m.noun.en}.</i>
            </p>
          </div>
        );
      })}
      <div className={styles.bar}>
        <p className={styles.title}>
          Ceci n’est pas… <span role="status">{done ? "Ceci n’est pas un portfolio. (It is.)" : `${count} of ${WIN} objects denied`}</span>
        </p>
        <div className={styles.actions}>
          <button type="button" data-autofocus onClick={surprise}>
            Name something
          </button>
          <EggClose className={styles.close}>Done</EggClose>
        </div>
        <p className={styles.hint}>Tap anything on the page.</p>
      </div>
      {finale && (
        <p className={styles.finale} aria-hidden>
          Ceci n’est pas un portfolio.
        </p>
      )}
    </div>
  );
}
