"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { dailyWord, keyMarks, LENGTH, score, TRIES, WORDS, type Mark } from "./wordle";
import styles from "./egg.module.css";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

/** Type "extra" (or tap the name five times): The Daily Word, a newspaper word puzzle in developer vocabulary. */
export default function EditorialEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "editorial", word: "extra", duration: 0 });
  return (
    <EggDialog slug="editorial" active={active} title="The Daily Word" onClose={dismiss} className={styles.backdrop}>
      <Daily />
    </EggDialog>
  );
}

function Daily() {
  const [answer, setAnswer] = useState(() => dailyWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [note, setNote] = useState("Five letters, six tries. The theme: a developer's vocabulary.");
  const [shake, setShake] = useState(false);
  const [dateline] = useState(() => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const lastGuess = guesses[guesses.length - 1];
  const won = lastGuess === answer;
  const lost = !won && guesses.length >= TRIES;
  const over = won || lost;
  const marks = keyMarks(guesses, answer);
  const board = useRef<HTMLDivElement>(null);

  const type = (letter: string) => {
    if (over || current.length >= LENGTH) return;
    setCurrent((c) => c + letter);
  };

  const erase = () => setCurrent((c) => c.slice(0, -1));

  const submit = () => {
    if (over) return;
    if (current.length < LENGTH) {
      setNote("Not enough letters.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const next = [...guesses, current];
    setGuesses(next);
    setCurrent("");
    if (current === answer) setNote(`Solved in ${next.length} of ${TRIES}. Stop the presses.`);
    else if (next.length >= TRIES) setNote(`The word was ${answer.toUpperCase()}. Tomorrow is another day.`);
    else {
      const m = score(current, answer);
      setNote(`${m.filter((x) => x === "correct").length} in place, ${m.filter((x) => x === "present").length} elsewhere.`);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const onButton = (e.target as HTMLElement).closest("button");
    if (e.key === "Enter" && !onButton) {
      e.preventDefault();
      submit();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      erase();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      type(e.key.toLowerCase());
    }
  };

  useEffect(() => {
    board.current?.focus();
  }, []);

  const again = () => {
    const rest = WORDS.filter((w) => w !== answer);
    setAnswer(rest[Math.floor(Math.random() * rest.length)]);
    setGuesses([]);
    setCurrent("");
    setNote("A fresh word, from the archive.");
  };

  const rows = Array.from({ length: TRIES }, (_, r) => {
    const text = r < guesses.length ? guesses[r] : r === guesses.length ? current : "";
    const done = r < guesses.length;
    const m = done ? score(text, answer) : null;
    return { text, m };
  });

  return (
    <div className={styles.paper} onKeyDown={onKey}>
      <div className={styles.top}>
        <p className={styles.dateline}>{dateline}</p>
        <EggClose className={styles.close}>Close</EggClose>
      </div>
      <h2 className={styles.masthead}>The Daily Word</h2>
      <p className={styles.sub}>All the news that fits, five letters at a time</p>
      <div ref={board} data-autofocus tabIndex={0} className={`${styles.board} ${shake ? styles.shake : ""}`} role="group" aria-label={`Guess grid. Type letters, Enter to submit. ${guesses.length} of ${TRIES} guesses used.`}>
        {rows.map((row, r) => (
          <div key={r} className={styles.row}>
            {Array.from({ length: LENGTH }, (_, i) => {
              const m: Mark | undefined = row.m?.[i];
              return (
                <span key={i} role="img" className={`${styles.tile} ${m ? styles[m] : ""} ${row.text[i] && !m ? styles.filled : ""}`} style={{ animationDelay: `${i * 0.12}s` }} aria-label={row.text[i] ? `${row.text[i]}${m ? `, ${m === "present" ? "in the word, wrong place" : m === "correct" ? "correct" : "not in the word"}` : ""}` : "empty"}>
                  {row.text[i]?.toUpperCase()}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className={styles.note} role="status">
        {note}
      </p>
      <div className={styles.keys}>
        {ROWS.map((row, i) => (
          <div key={row} className={styles.keyrow}>
            {i === 2 && (
              <button type="button" className={styles.wide} onClick={submit}>
                Enter
              </button>
            )}
            {[...row].map((k) => (
              <button key={k} type="button" className={marks[k] ? styles[`k_${marks[k]}`] : ""} onClick={() => type(k)} aria-label={`${k}${marks[k] ? `, ${marks[k]}` : ""}`}>
                {k.toUpperCase()}
              </button>
            ))}
            {i === 2 && (
              <button type="button" className={styles.wide} onClick={erase} aria-label="Backspace">
                Del
              </button>
            )}
          </div>
        ))}
      </div>
      {over && (
        <button type="button" className={styles.again} onClick={again}>
          Another word
        </button>
      )}
    </div>
  );
}
