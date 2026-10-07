"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import styles from "./egg.module.css";

const CloseContext = createContext<() => void>(() => {});

/** The close button every egg must show; style it to match the design. Esc closes too. */
export function EggClose({ className, children = "Close" }: { className?: string; children?: ReactNode }) {
  const close = useContext(CloseContext);
  return (
    <button type="button" className={className} onClick={close} data-egg-close>
      {children}
    </button>
  );
}

interface Props {
  slug: string;
  active: boolean;
  /** The dialog's accessible name; read out when it opens. */
  title: string;
  onClose: () => void;
  /** "window" centres a panel over a backdrop; "stage" gives the egg the whole viewport to play on. */
  variant?: "window" | "stage";
  /** Styles the backdrop (window) or the stage (stage). */
  className: string;
  children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The frame of an interactive easter egg: a modal dialog (focus moves in, Tab stays inside, Esc and the close button
 * leave, focus goes back to where it was). The egg itself only mounts while it is open, so every play starts fresh.
 * `data-egg="<slug>"` marks it for tests. Put the game inside; start it only on a user action so reduced-motion
 * visitors are never surprised, and mark result text `role="status"` so it is announced.
 */
export default function EggDialog({ slug, active, title, onClose, variant = "window", className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (node.querySelector<HTMLElement>("[data-autofocus]") ?? node).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      if (before?.isConnected) before.focus({ preventScroll: true });
    };
  }, [active]);

  if (!active) return null;
  return (
    <CloseContext.Provider value={onClose}>
      <div
        ref={ref}
        data-egg={slug}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`${variant === "stage" ? styles.stage : styles.window} ${className}`}
      >
        {children}
      </div>
    </CloseContext.Provider>
  );
}
