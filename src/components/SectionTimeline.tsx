"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import ScrollTimeline from "./ScrollTimeline";

const TIMELINE = [
  { year: "2021", desc: "Started Programming" },
  { year: "2022", desc: "Computer Science" },
  { year: "2025", desc: "Built QueryCraft" },
  { year: "Feb 2026", desc: "Full Stack Developer Intern (Java & AI) at Vstand4U" },
  { year: "2026", desc: "Graduated in Computer Science Engineering (VTU)" },
  { year: "Now", desc: "Open to entry-level software engineering roles, and exploring AI and immersive web experiences." },
];

export default function SectionTimeline() {
  return (
    <ScrollTimeline id="timeline" duration={3} className="bg-[#121212] z-20" stickyClassName="flex flex-col justify-center">
      {(progress) => <TimelineContent progress={progress} />}
    </ScrollTimeline>
  );
}

function TimelineContent({ progress }: { progress: MotionValue<number> }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [maxShift, setMaxShift] = useState(0);

  // Scroll distance = however much of the track overflows the viewport, so the
  // last entry is always reachable regardless of screen width.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setMaxShift(Math.max(0, track.scrollWidth - window.innerWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(progress, [0, 1], [0, -maxShift]);

  return (
    <>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 mb-16 shrink-0">
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
          Places that shaped me.
        </h2>
      </div>

      <motion.ol
        ref={trackRef}
        style={{ x }}
        className="flex w-max items-center gap-32 px-6 md:px-12 lg:px-24 list-none"
      >
        {TIMELINE.map((item, index) => (
          <li key={item.year} className="flex flex-col items-start w-[min(300px,calc(100vw-3rem))] shrink-0">
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
          </li>
        ))}
      </motion.ol>
    </>
  );
}
