"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

/** How the viewer window arrives and leaves. Each design picks the one that fits its character. */
export type ViewerEntrance = "rise" | "pop" | "drop" | "slide" | "fade" | "snap";

export interface ViewerThemeConfig {
  /** The design slug. The design's viewer.css styles `[data-viewer-theme="<slug>"]`. */
  slug: string;
  /** Font classes of the design (next/font `variable` classes). The viewer sits outside the design's root, so it needs them. */
  fonts: string;
  entrance: ViewerEntrance;
}

const FALLBACK: ViewerThemeConfig = { slug: "cinematic", fonts: "", entrance: "rise" };

let current = FALLBACK;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function publish(next: ViewerThemeConfig) {
  if (current.slug === next.slug && current.fonts === next.fonts && current.entrance === next.entrance) return;
  current = next;
  listeners.forEach((l) => l());
}

/** The theme of the design on screen. An open viewer re-renders the moment another design takes over. */
export const useViewerTheme = () => useSyncExternalStore(subscribe, () => current, () => FALLBACK);

/**
 * Every design renders one of these. The viewers (browser window, PDF reader) live in the root
 * layout, outside any design, so this is how they learn which design is active. The styling itself
 * is the design's own `viewer.css`, imported next to this call.
 */
export default function ViewerTheme({ slug, fonts = "", entrance = "rise" }: { slug: string; fonts?: string; entrance?: ViewerEntrance }) {
  useLayoutEffect(() => {
    publish({ slug, fonts, entrance });
  }, [slug, fonts, entrance]);
  return null;
}
