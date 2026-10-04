"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { motion, useIsPresent, type Easing, type TargetAndTransition } from "framer-motion";
import { useViewerTheme, type ViewerEntrance } from "./viewerTheme";
import "./viewer.css";

export type ViewerKind = "browser" | "pdf" | "card";

type Entrance = { from: TargetAndTransition; duration: number; ease: Easing };

const ENTRANCES: Record<ViewerEntrance, Entrance> = {
  rise: { from: { opacity: 0, y: 40, scale: 0.97 }, duration: 0.3, ease: "easeOut" },
  pop: { from: { opacity: 0, y: 14, scale: 0.88 }, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  drop: { from: { opacity: 0, y: -36, scale: 0.98 }, duration: 0.3, ease: "easeOut" },
  slide: { from: { opacity: 0, x: 56 }, duration: 0.22, ease: "easeOut" },
  fade: { from: { opacity: 0 }, duration: 0.25, ease: "easeOut" },
  snap: { from: { opacity: 0, y: 8 }, duration: 0.16, ease: (t) => Math.floor(t * 4) / 4 },
};

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex="0"]';
const visible = (el: HTMLElement) => el.getClientRects().length > 0;

interface ViewerFrameProps {
  kind: ViewerKind;
  /** Accessible name of the dialog. */
  label: string;
  /** Stable hook for tests and for the viewers to find each other. */
  marker: "resume" | "link";
  onClose: () => void;
  /** Icon and text of the (decorative) browser tab in the title bar. */
  tabIcon: ReactNode;
  tabTitle: string;
  /** The `.vw-toolbar` element. Cards have none. */
  toolbar?: ReactNode;
  /** The `.vw-status` strip under the content. */
  status?: ReactNode;
  /** Element to focus on open; defaults to the window itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * The one window every themed viewer is built from: overlay, window frame, title bar with tab,
 * toolbar slot, content, status strip. It owns focus handling, Esc, the scroll lock and the enter and exit
 * animation, and it carries the active design's slug and fonts so that design's viewer.css can restyle
 * every part (see viewer.css for the class and token contract). Switching design while it is open
 * restyles it in place because the slug comes from the live theme store.
 */
export default function ViewerFrame({ kind, label, marker, onClose, tabIcon, tabTitle, toolbar, status, initialFocus, children }: ViewerFrameProps) {
  const theme = useViewerTheme();
  const present = useIsPresent();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const entrance = ENTRANCES[theme.entrance];
  const markerAttr = { [`data-${marker}-viewer`]: "" };

  // Focus handling, Esc to close, Tab kept inside the window (and the design switcher), page behind not scrollable
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    (initialFocus?.current ?? panelRef.current)?.focus({ preventScroll: true });

    // Only the topmost viewer reacts: a link viewer opened from the resume sits above it. One that is
    // animating out no longer counts, so a quick second Esc reaches the viewer underneath.
    const isTop = () => {
      const all = document.querySelectorAll("[data-viewer]:not([data-exiting])");
      return all[all.length - 1] === overlayRef.current;
    };
    const switcherOpen = () => !!document.querySelector('[data-design-switcher] [role="region"]');

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === "Escape") {
        if (switcherOpen()) return; // Esc closes the switcher panel first
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // The design switcher stays usable while a viewer is open, so it is part of the tab cycle.
      const scopes = [panelRef.current, document.querySelector<HTMLElement>("[data-design-switcher]")];
      const focusable = scopes.flatMap((s) => (s ? Array.from(s.querySelectorAll<HTMLElement>(FOCUSABLE)) : [])).filter(visible);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Only the content area scrolls; everything else must not move the page underneath.
    const keepPageStill = (e: Event) => {
      if (!(e.target as Element | null)?.closest?.("[data-vw-scroll]")) e.preventDefault();
    };
    const overlay = overlayRef.current;
    window.addEventListener("keydown", onKeyDown);
    overlay?.addEventListener("wheel", keepPageStill, { passive: false });
    overlay?.addEventListener("touchmove", keepPageStill, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      overlay?.removeEventListener("wheel", keepPageStill);
      overlay?.removeEventListener("touchmove", keepPageStill);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
    };
  }, [onClose, initialFocus]);

  return (
    <motion.div
      ref={overlayRef}
      data-viewer
      data-viewer-kind={kind}
      data-viewer-theme={theme.slug}
      data-exiting={present ? undefined : ""}
      {...markerAttr}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`vw-overlay ${theme.fonts}`}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={entrance.from}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={entrance.from}
        transition={{ duration: entrance.duration, ease: entrance.ease }}
        className="vw-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vw-inner">
          <div className="vw-titlebar" aria-hidden>
            <span className="vw-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="vw-tab">
              <span className="vw-tab-icon">{tabIcon}</span>
              <span className="vw-tab-title">{tabTitle}</span>
            </span>
          </div>
          {toolbar}
          <div className="vw-body">{children}</div>
          {status}
        </div>
      </motion.div>
    </motion.div>
  );
}
