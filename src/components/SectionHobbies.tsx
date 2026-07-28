"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Camera, Droplets, Gamepad2 } from "lucide-react";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const HOBBIES = [
  {
    id: "camera",
    icon: Camera,
    label: "Nature",
    content: (
      <div className="text-center">
        <p className="text-xl font-light text-white italic">&quot;If software disappeared tomorrow...&quot;</p>
        <p className="text-[#F5F5F5]/60 mt-2">&quot;I&apos;d probably be growing tomatoes somewhere.&quot;</p>
      </div>
    )
  },
  {
    id: "perfume",
    icon: Droplets,
    label: "Arabic Perfumery",
    content: (
      <div className="text-center">
        <p className="text-[#F5F5F5]/50 text-sm tracking-widest uppercase mb-2">Currently into</p>
        <p className="text-2xl font-light text-white">Dark Arabic fragrances.</p>
      </div>
    )
  },
  {
    id: "gaming",
    icon: Gamepad2,
    label: "Gaming",
    content: (
      <div className="flex flex-col gap-4 text-center text-xl font-light text-white">
        <span>VALORANT</span>
        <span>Marvel Rivals</span>
        <span>R.E.P.O.</span>
      </div>
    )
  }
];

const timeline = createTimeline([
  { id: "intro", duration: 0.5 },
  { id: "camera", duration: 1 },
  { id: "perfume", duration: 1 },
  { id: "gaming", duration: 1 },
]);

export default function SectionHobbies() {
  return (
    <ScrollTimeline 
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex flex-col justify-center"
    >
      {(progress) => <HobbiesContent progress={progress} />}
    </ScrollTimeline>
  );
}

function HobbiesContent({ progress }: { progress: MotionValue<number> }) {
  const [iStart, iEnd] = timeline.getPhase("intro");
  const introOpacity = useTransform(progress, [iStart, iEnd], [0, 1]);
  const introY = useTransform(progress, [iStart, iEnd], [20, 0]);

  return (
    <div className="max-w-4xl mx-auto px-6 text-center w-full">
      <motion.h2 
        style={{ opacity: introOpacity, y: introY }}
        className="text-4xl md:text-5xl font-light text-white tracking-tight mb-24"
      >
        Outside the screen.
      </motion.h2>

      <div className="flex justify-center gap-16 md:gap-32">
        {HOBBIES.map((hobby) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [start, end] = timeline.getPhase(hobby.id);
          // Scale up when active
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const scale = useTransform(progress, [start - 0.1, start, end, end + 0.1], [1, 1.1, 1.1, 1]);
          // Color highlight when active
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const color = useTransform(progress, [start - 0.1, start, end, end + 0.1], ["rgba(245,245,245,0.4)", "rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(245,245,245,0.4)"]);

          return (
            <motion.div
              key={hobby.id}
              style={{ scale, color }}
              className="flex flex-col items-center gap-4 transition-colors"
            >
              <div className="w-16 h-16 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
                <hobby.icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-sm tracking-wider font-light">{hobby.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Content Area */}
      <div className="h-64 mt-24 flex items-center justify-center relative">
        {HOBBIES.map((hobby) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [start, end] = timeline.getPhase(hobby.id);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(progress, [start, start + 0.1, end - 0.1, end], [20, 0, 0, -20]);

          return (
            <motion.div
              key={hobby.id}
              style={{ opacity, y }}
              className="absolute p-12 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] backdrop-blur-lg"
            >
              {hobby.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

