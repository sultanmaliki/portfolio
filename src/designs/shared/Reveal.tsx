"use client";

import { useCallback, type CSSProperties, type ElementType, type ReactNode } from "react";
import { showOnView } from "./showOnView";
import styles from "./shared.module.css";

interface RevealProps {
  children: ReactNode;
  as?: "div" | "li" | "article" | "section" | "p" | "figure";
  /** Passed through so a revealed element can still be a labelled landmark or an anchor target. */
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  style?: CSSProperties;
  /** Seconds to wait before the reveal, for staggering siblings. */
  delay?: number;
  /** How far the element travels up while fading in (px). Keep it small; it is only a hint of arrival. */
  y?: number;
  /** Start scale; use < 1 for pop-in designs. */
  scale?: number;
  /** Start rotation (deg); settles to 0. Used by scrapbook-like designs. */
  rotate?: number;
  /** Seconds the reveal takes. Slow, quiet designs stretch it. */
  duration?: number;
  /** Also un-blur from this many px (misty designs). Leave at 0 elsewhere: filters are costly. */
  blur?: number;
}

/**
 * Fade-and-settle on first scroll into view. Motion is purposeful (it shows where the eye should go
 * next) and is switched off in CSS for visitors who prefer reduced motion and for print, so the
 * content is simply there for them from the first paint.
 *
 * It animates `transform` while it plays, so give a revealed element its resting tilt with the
 * individual `rotate`, `scale` and `translate` properties, never `transform`.
 */
export default function Reveal({
  children,
  as = "div",
  id,
  "aria-labelledby": labelledBy,
  className,
  style,
  delay = 0,
  y = 20,
  scale = 1,
  rotate = 0,
  duration = 0.6,
  blur = 0,
}: RevealProps) {
  // A ref callback with a cleanup (React 19): observed on mount, released on unmount
  const attach = useCallback((el: HTMLElement | null) => (el ? showOnView(el) : undefined), []);

  const vars = {
    "--r-y": `${y}px`,
    "--r-scale": scale,
    "--r-rot": `${rotate}deg`,
    "--r-dur": `${duration}s`,
    "--r-delay": `${delay}s`,
    "--r-blur": `${blur}px`,
  } as CSSProperties;

  const Tag: ElementType = as;
  return (
    <Tag
      ref={attach}
      id={id}
      aria-labelledby={labelledBy}
      className={`${blur ? styles.revealBlur : styles.reveal}${className ? ` ${className}` : ""}`}
      style={{ ...vars, ...style }}
    >
      {children}
    </Tag>
  );
}
