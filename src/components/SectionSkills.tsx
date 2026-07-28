"use client";

import { motion, useMotionTemplate, useMotionValue, MotionValue, useTransform } from "framer-motion";
import { MouseEvent, useState } from "react";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const CATEGORIES = [
  {
    title: "Frontend Experience",
    subtitle: "Modern Interfaces",
    tech: ["React", "Next.js", "Tailwind", "TypeScript", "Framer Motion"],
  },
  {
    title: "Backend Systems",
    subtitle: "Robust Architecture",
    tech: ["Java", "Spring Boot", "Node.js", "Python", "MongoDB", "MySQL", "PostgreSQL", "SQLite"],
  },
  {
    title: "Artificial Intelligence",
    subtitle: "LLM Integration",
    tech: ["OpenAI APIs", "Gemini", "Ollama"],
  },
  {
    title: "Motion & Tools",
    subtitle: "Interactive Websites",
    tech: ["Git", "Docker", "Linux", "Canvas", "WebGL"],
  }
];

const timeline = createTimeline([
  { id: "title", duration: 1 },
  { id: "cards", duration: 3 },
]);

function GlassCard({ category, index, progress }: { category: typeof CATEGORIES[0], index: number, progress: MotionValue<number> }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [start, end] = timeline.getPhase("cards");
  const cardStart = start + (index * 0.1 * (end - start));
  const cardEnd = cardStart + 0.2 * (end - start);
  
  const opacity = useTransform(progress, [cardStart, cardEnd], [0, 1]);
  const y = useTransform(progress, [cardStart, cardEnd], [30, 0]);

  return (
    <motion.div
      style={{ opacity, y, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
      className="group relative rounded-3xl overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl p-8 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)]"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
        <div>
          <h3 className="text-xl font-light text-white tracking-tight">{category.title}</h3>
          <p className="text-sm text-[#F5F5F5]/50 mt-1 font-light uppercase tracking-widest">{category.subtitle}</p>
        </div>
        
        <motion.div 
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? 24 : 0 }}
          className="overflow-hidden flex flex-wrap gap-2"
        >
          {category.tech.map((t) => (
            <span key={t} className="px-3 py-1 text-xs font-medium text-[#F5F5F5]/80 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.1)]">
              {t}
            </span>
          ))}
        </motion.div>
        
        {!isOpen && (
          <div className="text-xs text-[#F5F5F5]/30 mt-8 group-hover:text-[#F5F5F5]/60 transition-colors">
            Click to reveal tech
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SectionSkills() {
  return (
    <ScrollTimeline 
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24"
    >
      {(progress) => <SkillsContent progress={progress} />}
    </ScrollTimeline>
  );
}

function SkillsContent({ progress }: { progress: MotionValue<number> }) {
  const [tTitleStart, tTitleEnd] = timeline.getPhase("title");
  const titleOpacity = useTransform(progress, [tTitleStart, tTitleEnd], [0, 1]);
  const titleY = useTransform(progress, [tTitleStart, tTitleEnd], [30, 0]);

  return (
    <div className="max-w-6xl w-full mx-auto relative h-full flex flex-col justify-center py-24 overflow-y-auto hide-scrollbar">
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="mb-16 md:mb-24 text-center shrink-0"
      >
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
          Things I enjoy building.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {CATEGORIES.map((cat, i) => (
          <GlassCard key={cat.title} category={cat} index={i} progress={progress} />
        ))}
      </div>
    </div>
  );
}

