"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import { complete, PROMPT, run, type Line } from "./terminal";
import styles from "./egg.module.css";

const QUICK = ["help", "skills", "projects", "hire"];

/** Type "sudo" (or tap the name five times): a working terminal that answers questions about me. */
export default function CybercoreEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "cybercore", word: "sudo", duration: 0 });
  return (
    <EggDialog slug="cybercore" active={active} title="Terminal: ask me anything" onClose={dismiss} className={styles.backdrop}>
      <Terminal onExit={dismiss} />
    </EggDialog>
  );
}

function Terminal({ onExit }: { onExit: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "dim", text: "Connection established. Welcome, visitor." },
    { kind: "out", text: "Type help to see what I answer to." },
  ]);
  const [value, setValue] = useState("");
  const [typed, setTyped] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const submit = (text: string) => {
    const history = text.trim() ? [...typed, text.trim()] : typed;
    const result = run(text, history);
    setTyped(history);
    setCursor(-1);
    setValue("");
    setLines((current) => [...(result.clear ? [] : current), ...(result.clear ? [] : [{ kind: "in", text: `${PROMPT} ${text}` } as Line]), ...result.lines]);
    if (result.exit) setTimeout(onExit, 500);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && typed.length) {
      e.preventDefault();
      const next = cursor < 0 ? typed.length - 1 : Math.max(cursor - 1, 0);
      setCursor(next);
      setValue(typed[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next >= typed.length ? -1 : next);
      setValue(next >= typed.length ? "" : typed[next]);
    } else if (e.key === "Tab" && value && !e.shiftKey) {
      const done = complete(value);
      if (done !== value) {
        e.preventDefault();
        setValue(done);
      }
    }
  };

  return (
    <div className={styles.terminal} onClick={() => input.current?.focus()}>
      <div className={styles.bar}>
        <span>visitor@sultan: ~</span>
        <EggClose className={styles.close}>[ esc ] close</EggClose>
      </div>
      <div ref={screen} className={styles.screen} role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}>
        {lines.map((l, i) => (
          <p key={i} className={`${styles.line} ${styles[l.kind]}`}>
            {l.text}
          </p>
        ))}
      </div>
      <form className={styles.prompt} onSubmit={onSubmit}>
        <label htmlFor="cybercore-term">{PROMPT}</label>
        <input
          id="cybercore-term"
          ref={input}
          data-autofocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          aria-label="Terminal command"
        />
      </form>
      <div className={styles.quick}>
        {QUICK.map((c) => (
          <button key={c} type="button" onClick={() => submit(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
