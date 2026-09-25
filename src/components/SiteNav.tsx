"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { handleResumeClick } from "@/lib/resume";

const LINKS = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Sections without their own link belong to the link above them.
const BELONGS_TO: Record<string, string> = { education: "experience" };
const OBSERVED = [...LINKS.map((l) => l.id), ...Object.keys(BELONGS_TO)];

/**
 * Section navigation. The page is one long scroll story, so this gives recruiters a way
 * to jump straight to the parts they care about. It stays out of the way during the
 * opening animation and appears once the intro viewport has scrolled past.
 */
export default function SiteNav() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight;
    setVisible((prev) => (prev === next ? prev : next));
  });

  // Highlight the section crossing the middle band of the viewport.
  useEffect(() => {
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        }
        const current = OBSERVED.find((id) => inView.has(id)) ?? null;
        setActive(current ? BELONGS_TO[current] ?? current : null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    OBSERVED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label="Primary"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // Hidden state must not be focusable or clickable.
      style={{ pointerEvents: visible ? "auto" : "none", visibility: visible ? "visible" : "hidden" }}
      className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-[#121212]/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-12">
        <a
          href="#top"
          className="hidden rounded text-sm font-light tracking-[0.2em] text-[#F5F5F5]/80 uppercase transition-colors hover:text-white lg:block"
        >
          Syed Mohammed Sultan
        </a>
        <ul className="flex w-full list-none items-center justify-between gap-1 md:justify-center md:gap-6 lg:w-auto lg:justify-end">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                className={`rounded px-2 py-1.5 text-xs font-light tracking-wide transition-colors sm:text-sm ${
                  active === link.id ? "text-[#6EA8FF]" : "text-[#F5F5F5]/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
              onClick={handleResumeClick}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#6EA8FF]/40 px-3 py-1.5 text-xs text-[#6EA8FF] transition-colors hover:bg-[#6EA8FF]/10 sm:text-sm"
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}
