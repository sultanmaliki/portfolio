"use client";

import { useScroll, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollTimelineProps {
  id?: string; // Anchor target for the site nav
  duration: number; // The absolute duration representing the logical length of this section's timeline
  pixelsPerUnit?: number; // How many pixels of scroll 1 unit of duration equals
  className?: string;
  stickyClassName?: string;
  children: (progress: MotionValue<number>) => ReactNode;
  fallbackHeight?: string;
}

export default function ScrollTimeline({
  id,
  duration,
  pixelsPerUnit = 1000,
  className = "",
  stickyClassName = "",
  children,
  fallbackHeight,
}: ScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate pixel height independent of viewport height.
  // We use max with window.innerHeight (or 100vh) to ensure at least full screen.
  // Since we can't reliably use window.innerHeight in SSR, we'll set the total height directly.
  const totalHeight = duration * pixelsPerUnit;
  const computedHeightStyle = fallbackHeight ? fallbackHeight : `${totalHeight}px`;

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: computedHeightStyle }}
    >
      <div className={`sticky top-0 w-full h-screen overflow-hidden ${stickyClassName}`}>
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
