"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";
import { handleResumeClick } from "@/lib/resume";

interface OverlayProps {
  progress: MotionValue<number>;
}

export default function Overlay({ progress }: OverlayProps) {
  // Section 1: Intro (0% to 15%)
  const opacity1 = useScrollTransform(progress, [0, 0.1, 0.15], [1, 1, 0]);
  const y1 = useScrollTransform(progress, [0, 0.15], [0, -100]);
  // Once faded out, the buttons must stop catching clicks and keyboard focus. The heading stays in
  // the accessibility tree (screen readers still get the page's h1 after it has faded visually).
  const introPointer = useTransform(opacity1, (v) => (v > 0.4 ? "auto" : "none"));
  const introVisibility = useTransform(opacity1, (v) => (v > 0.02 ? "visible" : "hidden"));

  // Section 2: Building Software (20% to 35%)
  const opacity2 = useScrollTransform(progress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0]);
  const y2 = useScrollTransform(progress, [0.15, 0.35], [50, -50]);

  // Section 3: Curiosity (40% to 55%)
  const opacity3 = useScrollTransform(progress, [0.35, 0.4, 0.5, 0.55], [0, 1, 1, 0]);
  const y3 = useScrollTransform(progress, [0.35, 0.55], [50, -50]);

  // Scroll cue for the very start; gone once the visitor has begun to scroll
  const cueOpacity = useScrollTransform(progress, [0, 0.04], [1, 0]);

  // Section 4: Scroll to explore (60% to 90%)
  const opacity4 = useScrollTransform(progress, [0.6, 0.65, 0.85, 0.9], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Section 1 */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
      >
        <h1 className="text-4xl [@media(max-width:359px)]:text-3xl md:text-6xl font-light tracking-tight text-[#F5F5F5] drop-shadow-2xl">
          SYED MOHAMMED <span className="font-semibold text-white">SULTAN</span>
        </h1>
        <p className="mt-6 text-[#F5F5F5]/70 font-light tracking-widest uppercase text-sm md:text-xl">
          <span className="block sm:inline">Computer Science Graduate</span>
          <span aria-hidden className="mx-3 hidden opacity-50 sm:inline">|</span>
          <span className="block sm:inline">Full Stack Java Developer</span>
        </p>

        {/* The one thing a recruiter needs first: availability, then the three places they will go */}
        <motion.div
          style={{ pointerEvents: introPointer, visibility: introVisibility }}
          className="flex flex-col items-center"
        >
          <p className="mt-8 inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-xs text-[#F5F5F5]/90 backdrop-blur-md sm:rounded-full sm:text-sm short:hidden">
            <span aria-hidden className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>
              <span className="block sm:inline">Open to entry-level roles</span>
              <span aria-hidden className="mx-2 hidden opacity-40 sm:inline">&middot;</span>
              <span className="block sm:inline">Relocating to Bangalore</span>
            </span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 short:mt-4">
            <a
              href="#projects"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-xl sm:px-6 transition-colors hover:bg-[#F5F5F5]"
            >
              View projects
            </a>
            <a
              href="/resume.pdf"
              onClick={handleResumeClick}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 bg-black/30 px-5 py-2.5 text-sm text-white sm:px-6 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="rounded-full bg-black/30 px-4 py-2.5 text-sm text-[#F5F5F5]/90 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
            >
              Contact
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue (start of the page only) */}
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 [@media(max-height:640px)]:hidden"
      >
        <span className="text-xs font-light uppercase tracking-[0.3em] text-[#F5F5F5]/70">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-[#F5F5F5]/70 to-transparent"
        />
      </motion.div>

      {/* Section 2 */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-24"
      >
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#F5F5F5] max-w-3xl leading-tight">
          Building software<br/>that people remember.
        </h2>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-24"
      >
        <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#F5F5F5] max-w-3xl leading-tight">
          Curiosity<br/>became<br/>my greatest tool.
        </h2>
      </motion.div>
      
      {/* Final */}
      <motion.div
        style={{ opacity: opacity4 }}
        className="absolute inset-0 flex flex-col items-center justify-end pb-32 text-center p-8"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[#F5F5F5]/60 text-sm tracking-[0.2em] uppercase font-light">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#F5F5F5]/60 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}
