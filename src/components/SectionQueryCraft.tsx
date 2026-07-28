"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

export default function SectionQueryCraft() {
  const pipeline = [
    "Human Prompt",
    "LLM",
    "Query Generation",
    "Database",
    "Results",
  ];

  return (
    <section className="min-h-screen bg-[#121212] py-32 px-6 md:px-12 lg:px-24 relative z-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-32 text-center"
        >
          <h2 className="text-sm font-light text-[#F5F5F5]/50 tracking-[0.3em] uppercase mb-4">
            Experiments that became products
          </h2>
          <h3 className="text-5xl md:text-7xl font-light text-white tracking-tight">
            QueryCraft.
          </h3>
        </motion.div>

        <div className="space-y-48">
          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between"
          >
            <div className="text-sm text-[#F5F5F5]/40 tracking-widest uppercase font-light w-48">
              The Problem
            </div>
            <div className="flex-1 text-3xl md:text-5xl font-light text-white leading-tight">
              Databases speak <span className="text-[#6EA8FF]">SQL</span>.<br />
              People don&apos;t.
            </div>
          </motion.div>

          {/* The Idea */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between"
          >
            <div className="text-sm text-[#F5F5F5]/40 tracking-widest uppercase font-light w-48">
              The Idea
            </div>
            <div className="flex-1 text-3xl md:text-5xl font-light text-[#F5F5F5]/80 leading-tight">
              What if anyone could simply ask a question...<br />
              <span className="text-white">and the database understood?</span>
            </div>
          </motion.div>

          {/* The Solution & Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row gap-8 items-start justify-between"
          >
            <div className="text-sm text-[#F5F5F5]/40 tracking-widest uppercase font-light w-48 pt-4">
              The Solution
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-3xl p-8 backdrop-blur-sm">
                {pipeline.map((step, i) => (
                  <div key={step} className="flex flex-col md:flex-row items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                      className="text-center px-6 py-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F5F5F5] font-light text-sm"
                    >
                      {step}
                    </motion.div>
                    {i !== pipeline.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: (i * 0.2) + 0.1, duration: 0.5 }}
                        className="w-[1px] h-8 md:w-8 md:h-[1px] bg-[#6EA8FF]/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pivot & Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h4 className="text-2xl font-light text-white">Engineering Decisions</h4>
              <p className="text-[#F5F5F5]/70 font-light leading-relaxed text-lg">
                Initially we attempted building our own model. It wasn&apos;t practical.
              </p>
              <p className="text-[#F5F5F5]/70 font-light leading-relaxed text-lg">
                We pivoted toward integrating modern LLMs and optimizing prompts instead.
                That engineering decision became one of the project&apos;s biggest lessons.
              </p>
              <a href="https://github.com/sultanmaliki/QueryCraft-AI" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-white text-black hover:bg-[#F5F5F5] transition-colors font-medium text-sm">
                <GitBranch size={16} />
                View Source
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="p-8 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
            >
              <h4 className="text-sm font-light text-[#F5F5F5]/50 uppercase tracking-widest mb-6">Architecture</h4>
              <div className="flex flex-wrap gap-3">
                {["Node.js", "Next.js", "Gemini", "OpenRouter", "MongoDB", "PostgreSQL", "MySQL", "Neo4j", "Canvas", "Three.js", "Authentication"].map(tech => (
                  <span key={tech} className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-sm font-light text-[#F5F5F5]/90">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
