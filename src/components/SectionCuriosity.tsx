"use client";

import { motion, MotionValue } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";
import type { CSSProperties } from "react";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const NOTES = [
  { text: "Learning Motion Design", top: "10%", left: "10%", rotate: -5 },
  { text: "Creating 3D Websites", top: "20%", left: "60%", rotate: 4 },
  { text: "Video Editing", top: "50%", left: "15%", rotate: -3 },
  { text: "Content Creation", top: "60%", left: "75%", rotate: 6 },
  { text: "AI Experiments", top: "80%", left: "30%", rotate: -6 },
  { text: "Linux", top: "40%", left: "45%", rotate: 2 },
  { text: "Frontend Architecture", top: "75%", left: "55%", rotate: -4 },
];

const timeline = createTimeline([
  { id: "intro", duration: 1 },
  { id: "notes", duration: 2 },
]);

export default function SectionCuriosity() {
  return (
    <ScrollTimeline
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24"
    >
      {(progress) => <CuriosityContent progress={progress} />}
    </ScrollTimeline>
  );
}

function Note({
  note,
  index,
  progress,
}: {
  note: (typeof NOTES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const [nStart, nEnd] = timeline.getPhase("notes");
  // Calculate individual start and end for each note
  const itemStart = nStart + index * 0.1 * (nEnd - nStart);
  const itemEnd = itemStart + 0.3 * (nEnd - nStart);

  const opacity = useScrollTransform(progress, [itemStart, itemEnd], [0, 1]);
  const scale = useScrollTransform(progress, [itemStart, itemEnd], [0.8, 1]);

  return (
    // Scattered board on md+, wrapped chips on phones (absolute % positions clip off-screen there).
    <li
      style={{ "--top": note.top, "--left": note.left } as CSSProperties}
      className="md:absolute md:top-[var(--top)] md:left-[var(--left)]"
    >
      <motion.div
        style={{ opacity, scale }}
        animate={{
          y: [0, -15, 0],
          rotate: [note.rotate, note.rotate + 2, note.rotate],
        }}
        transition={{
          y: { repeat: Infinity, duration: 4 + (index % 3), ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 4 + (index % 3), ease: "easeInOut" },
        }}
        className="px-5 py-4 md:p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-2xl hover:bg-[rgba(255,255,255,0.08)] transition-colors"
      >
        <span className="text-[#F5F5F5]/90 font-light text-base md:text-lg md:whitespace-nowrap">
          {note.text}
        </span>
      </motion.div>
    </li>
  );
}

function CuriosityContent({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16 relative z-10 text-center shrink-0">
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
          Curiosity Board
        </h2>
      </div>

      <ul className="relative w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-4 md:block md:h-[600px] list-none">
        {NOTES.map((note, i) => (
          <Note key={note.text} note={note} index={i} progress={progress} />
        ))}
      </ul>
    </div>
  );
}
