"use client";

import type { ReactNode } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";
import { GitBranch } from "lucide-react";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const timeline = createTimeline([
  { id: "intro", duration: 1.5 },
  { id: "problem", duration: 1.5 },
  { id: "idea", duration: 1.5 },
  { id: "solution", duration: 2 },
  { id: "architecture", duration: 1.5 },
]);

const pipeline = [
  "Human Prompt",
  "LLM",
  "Query Generation",
  "Database",
  "Results",
];

const ARCHITECTURE = [
  "Node.js", "Next.js", "Gemini", "OpenRouter", "MongoDB", "PostgreSQL",
  "MySQL", "Neo4j", "Canvas", "Three.js", "Authentication",
];

export default function SectionQueryCraft() {
  return (
    <ScrollTimeline
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex flex-col items-center justify-center p-6 md:p-12 lg:p-24"
    >
      {(progress) => <QueryCraftContent progress={progress} />}
    </ScrollTimeline>
  );
}

/**
 * One beat of the story. Each stage owns the whole viewport and cross-fades on
 * page scroll, so nothing needs an inner scroll container (which would trap the
 * wheel/touch scroll while the reveal animations are driven by page progress).
 */
function Stage({
  progress,
  phase,
  fadeIn = true,
  fadeOut = true,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  phase: string;
  fadeIn?: boolean;
  fadeOut?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [start, end] = timeline.getPhase(phase);
  const fade = (end - start) * 0.15;
  const opacity = useScrollTransform(
    progress,
    [start, start + fade, end - fade, end],
    [fadeIn ? 0 : 1, 1, 1, fadeOut ? 0 : 1]
  );
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

function PipelineStep({
  step,
  isLast,
  progress,
  start,
  end,
}: {
  step: string;
  isLast: boolean;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useScrollTransform(progress, [start, end], [0, 1]);
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <motion.div
        style={{ opacity }}
        className="text-center px-6 py-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F5F5F5] font-light text-sm"
      >
        {step}
      </motion.div>
      {!isLast && (
        <motion.div
          style={{ opacity }}
          className="w-[1px] h-8 lg:w-8 lg:h-[1px] bg-[#6EA8FF]/50"
        />
      )}
    </div>
  );
}

const ROW = "w-full flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between";
const LABEL = "text-sm text-[#F5F5F5]/60 tracking-widest uppercase font-light md:w-48 shrink-0";

function QueryCraftContent({ progress }: { progress: MotionValue<number> }) {
  const [sStart, sEnd] = timeline.getPhase("solution");

  return (
    <div className="relative w-full max-w-5xl h-full">
      {/* Intro: visible from the first pixel of the section */}
      <Stage progress={progress} phase="intro" fadeIn={false} className="text-center">
        <h2 className="text-sm font-light text-[#F5F5F5]/60 tracking-[0.3em] uppercase mb-4">
          Experiments that became products
        </h2>
        <h3 className="text-5xl md:text-7xl font-light text-white tracking-tight">
          QueryCraft.
        </h3>
      </Stage>

      {/* The Problem */}
      <Stage progress={progress} phase="problem">
        <div className={ROW}>
          <div className={LABEL}>The Problem</div>
          <div className="flex-1 text-3xl md:text-5xl font-light text-white leading-tight">
            Databases speak <span className="text-[#6EA8FF]">SQL</span>.<br />
            People don&apos;t.
          </div>
        </div>
      </Stage>

      {/* The Idea */}
      <Stage progress={progress} phase="idea">
        <div className={ROW}>
          <div className={LABEL}>The Idea</div>
          <div className="flex-1 text-3xl md:text-5xl font-light text-[#F5F5F5]/80 leading-tight">
            What if anyone could simply ask a question...<br />
            <span className="text-white">and the database understood?</span>
          </div>
        </div>
      </Stage>

      {/* The Solution & Pipeline */}
      <Stage progress={progress} phase="solution">
        <div className={ROW}>
          <div className={LABEL}>The Solution</div>
          <div className="flex-1 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0 justify-between w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-3xl p-8 backdrop-blur-sm">
              {pipeline.map((step, i) => (
                <PipelineStep
                  key={step}
                  step={step}
                  isLast={i === pipeline.length - 1}
                  progress={progress}
                  start={sStart + i * 0.1 * (sEnd - sStart)}
                  end={sStart + (i * 0.1 + 0.2) * (sEnd - sStart)}
                />
              ))}
            </div>
          </div>
        </div>
      </Stage>

      {/* Pivot & Architecture: stays up through the end of the section */}
      <Stage progress={progress} phase="architecture" fadeOut={false}>
        <div className="w-full max-h-full overflow-y-auto hide-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-start">
          <div className="space-y-6 md:space-y-8">
            <h4 className="text-2xl font-light text-white">Engineering Decisions</h4>
            <p className="text-[#F5F5F5]/70 font-light leading-relaxed text-lg">
              Initially we attempted building our own model. It wasn&apos;t practical.
            </p>
            <p className="text-[#F5F5F5]/70 font-light leading-relaxed text-lg">
              We pivoted toward integrating modern LLMs and optimizing prompts instead.
              That engineering decision became one of the project&apos;s biggest lessons.
            </p>
            <a
              href="https://github.com/sultanmaliki/QueryCraft-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-white text-black hover:bg-[#F5F5F5] transition-colors font-medium text-sm"
            >
              <GitBranch size={16} aria-hidden />
              View Source
            </a>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <h4 className="text-sm font-light text-[#F5F5F5]/60 uppercase tracking-widest mb-6">Architecture</h4>
            <ul className="flex flex-wrap gap-3 list-none">
              {ARCHITECTURE.map((tech) => (
                <li key={tech} className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-sm font-light text-[#F5F5F5]/90">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Stage>
    </div>
  );
}
