"use client";

import { useEffect } from "react";

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Long trips take longer so the scroll animation stays readable, but never drag on.
const durationFor = (distance: number) => Math.min(3000, Math.max(900, 700 + distance * 0.11));

const INTERRUPT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * In-page links (#skills, #contact, …) travel there through the page instead of teleporting,
 * so the scroll-driven story plays along the way. Any manual scroll input stops the trip,
 * and reduced-motion visitors keep the instant jump.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    let raf = 0;
    let stop: (() => void) | null = null;

    const cancel = () => {
      cancelAnimationFrame(raf);
      stop?.();
      stop = null;
    };

    const targetTop = (el: HTMLElement) => {
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(max, Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin));
    };

    const finish = (el: HTMLElement, id: string) => {
      if (window.location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link || (link.target && link.target !== "_self")) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el) return;

      e.preventDefault();
      cancel();

      const start = window.scrollY;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: targetTop(el), behavior: "instant" });
        finish(el, id);
        return;
      }

      const duration = durationFor(Math.abs(targetTop(el) - start));
      const t0 = performance.now();
      const interrupt = () => cancel();
      INTERRUPT_EVENTS.forEach((n) => window.addEventListener(n, interrupt, { passive: true }));
      stop = () => INTERRUPT_EVENTS.forEach((n) => window.removeEventListener(n, interrupt));

      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        // The target is re-read every frame so late layout changes (e.g. repos refreshing) can't cause a miss
        window.scrollTo({ top: start + (targetTop(el) - start) * easeInOutCubic(t), behavior: "instant" });
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          cancel();
          finish(el, id);
        }
      };
      raf = requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancel();
    };
  }, []);

  return null;
}
