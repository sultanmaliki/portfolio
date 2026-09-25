"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

/**
 * Section navigation. The page is one long scroll story, so this gives recruiters a way
 * to jump straight to the parts they care about. It stays out of the way during the
 * opening animation and appears once the intro viewport has scrolled past.
 */
export default function SiteNav() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight;
    setVisible((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.nav
      aria-label="Primary"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // Hidden state must not be focusable or clickable.
      style={{ pointerEvents: visible ? "auto" : "none", visibility: visible ? "visible" : "hidden" }}
      className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-[#121212]/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-12">
        <a
          href="#top"
          className="hidden rounded text-sm font-light tracking-[0.2em] text-[#F5F5F5]/80 uppercase transition-colors hover:text-white lg:block"
        >
          Syed Mohammed Sultan
        </a>
        <ul className="flex w-full list-none items-center justify-between gap-1 md:justify-center md:gap-8 lg:w-auto lg:justify-end">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded px-2 py-1.5 text-xs font-light tracking-wide text-[#F5F5F5]/70 transition-colors hover:text-white sm:text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
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
