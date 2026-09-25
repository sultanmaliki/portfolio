"use client";

import { motion, useMotionTemplate, useMotionValue, MotionValue } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";
import type { MouseEvent } from "react";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const CATEGORIES = [
  {
    title: "Frontend Experience",
    subtitle: "Modern Interfaces",
    tech: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    title: "Backend Systems",
    subtitle: "Robust Architecture",
    tech: ["Java", "Spring (learning)", "Node.js", "Express", "NestJS", "REST APIs", "JWT auth", "MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Artificial Intelligence",
    subtitle: "LLM Integration",
    tech: ["OpenAI APIs", "Gemini", "Ollama", "Prompt engineering"],
  },
  {
    title: "Mobile & Tools",
    subtitle: "Android & Workflow",
    tech: ["Kotlin", "Jetpack Compose", "Git", "Docker", "Linux", "Jest", "Canvas"],
  }
];

const timeline = createTimeline([
  { id: "title", duration: 1 },
  { id: "cards", duration: 3 },
]);

function GlassCard({ category, index, progress }: { category: typeof CATEGORIES[0], index: number, progress: MotionValue<number> }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [start, end] = timeline.getPhase("cards");
  const cardStart = start + (index * 0.1 * (end - start));
  const cardEnd = cardStart + 0.2 * (end - start);

  const opacity = useScrollTransform(progress, [cardStart, cardEnd], [0, 1]);
  const y = useScrollTransform(progress, [cardStart, cardEnd], [30, 0]);

  return (
    <motion.article
      style={{ opacity, y, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl p-3 [@media(max-width:359px)]:p-2 md:p-8 short:p-3 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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

      <div className="relative z-10 flex h-full flex-col gap-3 md:gap-8 short:gap-2">
        <div>
          <h3 className="text-base md:text-xl short:text-sm font-light text-white tracking-tight">{category.title}</h3>
          <p className="text-xs md:text-sm text-[#F5F5F5]/60 mt-1 font-light uppercase tracking-widest [@media(max-height:640px)]:hidden">{category.subtitle}</p>
        </div>

        {/* Skills are the content people scan for, so they are always visible */}
        <ul aria-label={`${category.title} technologies`} className="flex list-none flex-wrap gap-1.5 md:mt-auto md:gap-2 short:mt-0">
          {category.tech.map((t) => (
            <li key={t} className="px-2 py-0.5 text-[11px] [@media(max-width:359px)]:px-1.5 [@media(max-width:359px)]:text-[10px] md:px-3 md:py-1 md:text-xs short:px-2 short:py-0.5 short:text-[10px] font-medium text-[#F5F5F5]/80 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.1)]">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default function SectionSkills() {
  return (
    <ScrollTimeline 
      id="skills"
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex flex-col items-center justify-center p-4 md:p-12 lg:p-24 short:p-3"
    >
      {(progress) => <SkillsContent progress={progress} />}
    </ScrollTimeline>
  );
}

function SkillsContent({ progress }: { progress: MotionValue<number> }) {
  const [tTitleStart, tTitleEnd] = timeline.getPhase("title");
  const titleOpacity = useScrollTransform(progress, [tTitleStart, tTitleEnd], [0, 1]);
  const titleY = useScrollTransform(progress, [tTitleStart, tTitleEnd], [30, 0]);

  return (
    <div className="max-w-6xl w-full mx-auto relative h-full flex flex-col py-2 md:py-12 short:py-0 overflow-y-auto hide-scrollbar">
      <div className="my-auto">
      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="mb-4 md:mb-12 short:mb-2 text-center shrink-0"
      >
        <h2 className="text-3xl [@media(max-width:359px)]:text-2xl md:text-5xl short:text-2xl font-light text-white tracking-tight">
          Things I enjoy building.
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 land:grid-cols-4 gap-2 md:gap-6 short:gap-2 pb-4 md:pb-12 short:pb-0">
        {CATEGORIES.map((cat, i) => (
          <GlassCard key={cat.title} category={cat} index={i} progress={progress} />
        ))}
      </div>
      </div>
    </div>
  );
}

