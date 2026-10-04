"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const CURSOR_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], .cursor-pointer";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

function CursorDots() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const visible = useMotionValue(0);
  const hovering = useMotionValue(0);

  const dotX = useSpring(mouseX, { stiffness: 700, damping: 28, mass: 0.5 });
  const dotY = useSpring(mouseY, { stiffness: 700, damping: 28, mass: 0.5 });
  const ringX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.8 });
  const hoverSpring = useSpring(hovering, { stiffness: 400, damping: 28 });

  const dotScale = useTransform(hoverSpring, [0, 1], [1, 2.5]);
  const ringScale = useTransform(hoverSpring, [0, 1], [1, 1.5]);
  const ringOpacity = useTransform([visible, hoverSpring], ([v, h]: number[]) => v * (1 - h));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      visible.set(1);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      hovering.set(target?.closest(INTERACTIVE_SELECTOR) ? 1 : 0);
    };
    const onLeave = () => visible.set(0);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY, visible, hovering]);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 -ml-2 -mt-2 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, scale: dotScale, opacity: visible }}
      />
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 border border-white/30 rounded-full mix-blend-difference pointer-events-none z-[9998]"
        style={{ x: ringX, y: ringY, scale: ringScale, opacity: ringOpacity }}
      />
    </>
  );
}

export default function CustomCursor() {
  const finePointer = useMediaQuery(CURSOR_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  if (!finePointer || reducedMotion) return null;
  return <CursorDots />;
}
