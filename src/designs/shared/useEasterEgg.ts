"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TAPS = 5;
const TAP_WINDOW = 2000;
const TYPING_IDLE = 1800;

const hinted = new Set<string>();

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

interface Options {
  /** The design slug: the egg marks `<main data-design="<slug>">` with `data-egg-active` while it plays. */
  slug: string;
  /** The secret word. Typing it anywhere on the page (not in a field) sets the egg off. */
  word: string;
  /** How long the egg plays before it goes away on its own, in ms. 0 keeps it until dismissed. */
  duration?: number;
}

/**
 * Trigger and lifecycle of a design's easter egg. Two ways in, so it works with and without a keyboard: type the
 * secret word, or tap the name (the h1) five times quickly. While it plays, Esc dismisses it, it is ignored if a
 * viewer is open, and `main[data-design]` carries `data-egg-active="<word>"` so the design's CSS can restyle the page
 * itself. Pair it with `<EggDialog>`; `duration: 0` keeps a game open until the visitor closes it.
 */
export function useEasterEgg({ slug, word, duration = 4500 }: Options) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    activeRef.current = false;
    setActive(false);
  }, []);

  const trigger = useCallback(() => {
    if (activeRef.current || document.querySelector("[data-viewer]")) return;
    activeRef.current = true;
    setActive(true);
    if (duration > 0) timer.current = setTimeout(dismiss, duration);
  }, [dismiss, duration]);

  useEffect(() => {
    if (!hinted.has(slug)) {
      hinted.add(slug);
      console.info(`%c psst %c type "${word}", or tap the name five times, for a little game.`, "background:#6ea8ff;color:#000;border-radius:3px", "");
    }

    let typed = "";
    let idle: ReturnType<typeof setTimeout> | undefined;
    let taps = 0;
    let tapTimer: ReturnType<typeof setTimeout> | undefined;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1 || isTyping(e.target)) return;
      typed = (typed + e.key.toLowerCase()).slice(-word.length);
      clearTimeout(idle);
      idle = setTimeout(() => (typed = ""), TYPING_IDLE);
      if (typed === word) {
        typed = "";
        trigger();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.(`[data-design="${slug}"] h1`)) return;
      taps += 1;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (taps = 0), TAP_WINDOW);
      if (taps >= TAPS) {
        taps = 0;
        trigger();
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      clearTimeout(idle);
      clearTimeout(tapTimer);
      clearTimeout(timer.current);
    };
  }, [slug, word, trigger]);

  // let the design restyle the page itself while the egg plays
  useEffect(() => {
    if (!active) return;
    const root = document.querySelector(`[data-design="${slug}"]`);
    root?.setAttribute("data-egg-active", word);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      root?.removeAttribute("data-egg-active");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, slug, word, dismiss]);

  return { active, dismiss, open: trigger };
}
