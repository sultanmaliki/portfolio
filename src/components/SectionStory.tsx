"use client";

import { motion } from "framer-motion";

export default function SectionStory() {
  return (
    <section className="min-h-screen bg-[#121212] flex flex-col items-center justify-center py-32 px-6 md:px-12 lg:px-24 text-center relative z-20">
      <div className="max-w-3xl w-full mx-auto space-y-32">
        
        {/* Intro Thoughts */}
        <div className="space-y-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-tight">
              &quot;I don&apos;t spend every hour coding.&quot;
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-[#F5F5F5]/70 tracking-tight">
              &quot;But when an idea captures my curiosity...&quot;
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-[#6EA8FF] tracking-tight drop-shadow-[0_0_15px_rgba(110,168,255,0.3)]">
              &quot;...time quietly disappears.&quot;
            </h2>
          </motion.div>
        </div>

        {/* The Story Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="pt-32 text-left space-y-8 text-lg md:text-2xl text-[#F5F5F5]/80 font-light leading-relaxed max-w-2xl mx-auto"
        >
          <p>
            My journey into programming started in 2021 during pre-university.
          </p>
          <p>
            Technology fascinated me long before I understood everything behind it.
            Beautiful interfaces, interactive experiences, and the invisible logic powering them made me want to build things myself.
          </p>
          <p>
            Ironically, I didn&apos;t truly enjoy programming in classrooms.
          </p>
          <p>
            I discovered that passion while coding simply because I was bored.
          </p>
          <p className="pt-8">
            Curiosity eventually became habit.<br />
            Habit became experimentation.<br />
            Experimentation became <span className="text-white font-medium">engineering.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
