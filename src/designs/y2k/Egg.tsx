"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { usePortfolio } from "../shared/usePortfolio";
import { useEasterEgg } from "../shared/useEasterEgg";
import { reply, typingTime } from "./bot";
import styles from "./egg.module.css";

const QUICK = ["asl?", "skills", "projects", "are you available?", "tell me a joke"];

type Message = { who: "me" | "them" | "sys"; text: string };

/** Type "msn" (or tap the name five times): an instant-messenger chat with me. Ask anything; there is a nudge button. */
export default function Y2kEgg() {
  const { active, dismiss } = useEasterEgg({ slug: "y2k", word: "msn", duration: 0 });
  return (
    <EggDialog slug="y2k" active={active} title="Messenger conversation" onClose={dismiss} className={styles.backdrop}>
      <Chat />
    </EggDialog>
  );
}

function Chat() {
  const { profile } = usePortfolio();
  const first = profile.givenName;
  const [messages, setMessages] = useState<Message[]>([{ who: "sys", text: `You have been nudged by ${first}!` }]);
  const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [value, setValue] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const log = useRef<HTMLDivElement>(null);

  const say = (lines: string[], delay = 0) => {
    let at = delay;
    lines.forEach((text, i) => {
      timers.current.push(setTimeout(() => setTyping(true), at));
      at += typingTime(text);
      timers.current.push(
        setTimeout(() => {
          setMessages((m) => [...m, { who: "them", text }]);
          setTyping(i < lines.length - 1);
        }, at)
      );
      at += 250;
    });
  };

  useEffect(() => {
    say(["hi!! :-)", "ask me anything, or try asl?"], 500);
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { who: "me", text: t }]);
    setValue("");
    say(reply(t), 300);
  };

  const nudge = () => {
    setShake(true);
    setTimeout(() => setShake(false), 650);
    setMessages((m) => [...m, { who: "sys", text: "You have just sent a nudge." }]);
    say(["OMG A NUDGE!!! hi hi hi :-D"], 400);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(value);
  };

  return (
    <div className={`${styles.window} ${shake ? styles.shake : ""}`}>
      <div className={styles.title}>
        <span>{first} - Conversation</span>
        <EggClose className={styles.x}>
          <span aria-hidden>x</span>
          <span className="sr-only">Close conversation</span>
        </EggClose>
      </div>
      <div className={styles.who}>
        <span className={styles.avatar} aria-hidden>
          {first[0]}
        </span>
        <span>
          <b>{profile.name}</b>
          <br />
          <i>(Online) {profile.availability.status}</i>
        </span>
      </div>
      <div ref={log} className={styles.chat} role="log" aria-live="polite" aria-label="Conversation" tabIndex={0}>
        {messages.map((m, i) => (
          <p key={i} className={`${styles.msg} ${m.who === "sys" ? styles.system : ""}`}>
            {m.who !== "sys" && <b>{m.who === "me" ? "You say:" : `${first} says:`} </b>}
            {m.text}
          </p>
        ))}
      </div>
      <p className={styles.typing}>{typing ? `${first} is typing a message...` : " "}</p>
      <div className={styles.quick}>
        {QUICK.map((q) => (
          <button key={q} type="button" onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
      <form className={styles.compose} onSubmit={onSubmit}>
        <input
          data-autofocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type a message..."
          aria-label="Message"
          autoComplete="off"
          enterKeyHint="send"
          maxLength={120}
        />
        <button type="submit">Send</button>
        <button type="button" onClick={nudge}>
          Nudge
        </button>
      </form>
    </div>
  );
}
