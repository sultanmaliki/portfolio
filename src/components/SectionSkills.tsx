"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent, useState } from "react";

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

function GlassCard({ category, index }: { category: typeof CATEGORIES[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
      className="group relative rounded-3xl overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl p-8 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)]"
      style={{ perspective: 1000 }}
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
    <section className="min-h-screen bg-[#121212] py-32 px-6 md:px-12 lg:px-24 relative z-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-24 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            Things I enjoy building.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, i) => (
            <GlassCard key={cat.title} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
