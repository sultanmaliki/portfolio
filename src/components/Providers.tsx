"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Honors the OS "reduce motion" setting for every Framer Motion transform animation. */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
