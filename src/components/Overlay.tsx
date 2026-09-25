"use client";

import { motion, MotionValue } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";

interface OverlayProps {
  progress: MotionValue<number>;
}

export default function Overlay({ progress }: OverlayProps) {
  // Section 1: Intro (0% to 15%)
  const opacity1 = useScrollTransform(progress, [0, 0.1, 0.15], [1, 1, 0]);
  const y1 = useScrollTransform(progress, [0, 0.15], [0, -100]);

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
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-auto"
      >
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#F5F5F5] drop-shadow-2xl">
          SYED MOHAMMED <span className="font-semibold text-white group relative cursor-help">
            SULTAN
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 border border-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-light tracking-wide rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              Open to opportunities.
            </span>
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[#F5F5F5]/70 font-light tracking-widest uppercase text-sm">
          <span className="block sm:inline">Computer Science Graduate</span>
          <span aria-hidden className="mx-3 hidden opacity-50 sm:inline">|</span>
          <span className="block sm:inline">Full Stack Java Developer</span>
        </p>
      </motion.div>

      {/* Scroll cue (start of the page only) */}
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
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
