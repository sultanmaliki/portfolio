"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TIMELINE = [
  { year: "2021", desc: "Started Programming" },
  { year: "2022", desc: "Computer Science" },
  { year: "2025", desc: "Built QueryCraft" },
  { year: "2026", desc: "Graduated" },
  { year: "Now", desc: "Exploring motion, AI and immersive web experiences." },
];

export default function SectionTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-50%"]);

  return (
    <section ref={containerRef} className="h-[200vh] bg-[#121212] relative z-20">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            Places that shaped me.
          </h2>
        </div>

        <motion.div 
          style={{ x }}
          className="flex items-center gap-32 px-[20vw]"
        >
          {TIMELINE.map((item, index) => (
            <div key={item.year} className="flex flex-col items-start min-w-[300px]">
              <div className="flex items-center mb-8 w-full">
                <div className="w-4 h-4 rounded-full bg-[#6EA8FF] shadow-[0_0_15px_rgba(110,168,255,0.5)]" />
                {index !== TIMELINE.length - 1 && (
                  <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.2)] ml-4" />
                )}
              </div>
              <h3 className="text-5xl font-light text-white tracking-tighter mb-4">
                {item.year}
              </h3>
              <p className="text-xl text-[#F5F5F5]/70 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
