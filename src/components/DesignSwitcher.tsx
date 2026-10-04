"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Palette, Shuffle } from "lucide-react";
import {
  SHOW_PLANNED_DESIGNS,
  designForPath,
  designPath,
  liveDesigns,
  plannedDesigns,
  type DesignMeta,
} from "@/designs/registry";
import { SECTION_IDS } from "@/designs/sections";

/** Where the thumbnails live; regenerate them with `npm run previews` after changing a design. */
const previewSrc = (slug: string) => `/design-previews/${slug}.jpg`;

/** The three palette colours as a diagonal fill: what a design shows until (or unless) its thumbnail loads. */
const swatchFill = ([a, b, c]: DesignMeta["palette"]) => `linear-gradient(135deg, ${a} 0 42%, ${b} 42% 72%, ${c} 72%)`;

function Thumbnail({ design }: { design: DesignMeta }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      aria-hidden
      className="relative block h-14 w-[5.5rem] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/25"
      style={{ background: swatchFill(design.palette) }}
    >
      {!failed && (
        <Image
          src={previewSrc(design.slug)}
          alt=""
          width={320}
          height={200}
          unoptimized
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
    </span>
  );
}

const rowClass = "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left";

/** The section the visitor is reading (the last one that has reached the upper third of the screen), if any. */
function sectionInView(): string | null {
  const line = window.innerHeight * 0.35;
  let best: { id: string; top: number } | null = null;
  for (const id of SECTION_IDS) {
    if (id === "top") continue;
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= line && (!best || top > best.top)) best = { id, top };
  }
  return best?.id ?? null;
}

const controlClass =
  "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#F5F5F5]/90 transition-colors hover:border-white/40 hover:text-white";

/**
 * Floating panel for switching between the portfolio's designs. It is neutral on purpose (dark
 * glass, high contrast) so it stays legible on top of every design. It lives in the root layout,
 * so no design has to know about it. Switching keeps your place: the links carry the section you
 * were reading, so you land on the same part of the next design.
 */
export default function DesignSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const current = designForPath(pathname);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const live = liveDesigns();
  const planned = SHOW_PLANNED_DESIGNS ? plannedDesigns() : [];
  const hrefFor = (design: DesignMeta) => designPath(design.slug) + (place ? `#${place}` : "");

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // With a single design and no roadmap to show there is nothing to switch to.
  if (live.length + planned.length < 2) return null;

  const go = (design: DesignMeta) => {
    setOpen(false);
    router.push(hrefFor(design));
  };
  const index = Math.max(0, live.findIndex((d) => d.slug === current?.slug));
  const step = (by: number) => go(live[(index + by + live.length) % live.length]);
  const surprise = () => {
    const others = live.filter((d) => d.slug !== current?.slug);
    go(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <div
      ref={rootRef}
      data-design-switcher
      className="fixed z-[90]"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", left: "max(1rem, env(safe-area-inset-left))" }}
      onBlur={(e) => {
        // Tabbing out of the panel closes it; clicks outside are handled by the pointer listener.
        if (open && e.relatedTarget && !rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="region"
            aria-label="Portfolio designs"
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-3 max-h-[min(76dvh,40rem)] w-[min(40rem,calc(100vw-2rem))] origin-bottom-left overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#161616]/95 p-2 text-[#F5F5F5] shadow-2xl outline-none backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 px-2 pb-2 pt-2">
              <div>
                <p className="text-sm font-medium text-white">Portfolio designs</p>
                <p className="mt-0.5 text-xs font-light text-[#F5F5F5]/70">Same content, {live.length} different looks. You stay on the section you are reading.</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => step(-1)} aria-label="Previous design" className={controlClass}>
                  <ChevronLeft aria-hidden size={14} />
                </button>
                <button type="button" onClick={surprise} className={controlClass}>
                  <Shuffle aria-hidden size={14} />
                  Surprise me
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next design" className={controlClass}>
                  <ChevronRight aria-hidden size={14} />
                </button>
              </div>
            </div>

            <ul aria-label="Available designs" className="grid list-none gap-x-1 sm:grid-cols-2">
              {live.map((design) => {
                const isCurrent = design.slug === current?.slug;
                return (
                  <li key={design.slug}>
                    <Link
                      href={hrefFor(design)}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      title={design.tagline}
                      className={`${rowClass} transition-colors hover:bg-white/10 ${isCurrent ? "bg-white/[0.07]" : ""}`}
                    >
                      <Thumbnail design={design} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-white">{design.name}</span>
                        <span className="line-clamp-2 block text-xs font-light text-[#F5F5F5]/70">{design.tagline}</span>
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full border border-[#6EA8FF]/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#6EA8FF]">
                          Current
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {planned.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-4 text-[11px] font-light uppercase tracking-widest text-[#F5F5F5]/60">
                  Coming soon ({planned.length})
                </p>
                <ul aria-label="Coming soon" className="grid list-none gap-x-1 sm:grid-cols-2">
                  {planned.map((design) => (
                    <li key={design.slug} className={`${rowClass} opacity-80`}>
                      <Thumbnail design={design} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-[#F5F5F5]/90">{design.name}</span>
                        <span className="line-clamp-2 block text-xs font-light text-[#F5F5F5]/60">{design.tagline}</span>
                      </span>
                      <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#F5F5F5]/70">
                        Soon
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (!open) setPlace(sectionInView());
          setOpen((v) => !v);
        }}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-[#121212]/85 px-3.5 py-2 text-xs text-[#F5F5F5]/90 shadow-lg backdrop-blur-md transition-colors hover:border-white/40 hover:text-white sm:text-sm"
      >
        <Palette aria-hidden size={16} className="text-[#6EA8FF]" />
        <span>Designs</span>
        {current && <span className="sr-only">, current: {current.name}</span>}
        {current && (
          <span aria-hidden className="hidden text-[#F5F5F5]/60 sm:inline">
            &middot; {current.name}
          </span>
        )}
      </button>
    </div>
  );
}
