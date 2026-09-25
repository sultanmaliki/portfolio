"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/data/experience";

export default function SectionExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative z-20 scroll-mt-16 bg-[#121212] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 id="experience-heading" className="text-4xl font-light tracking-tight text-white md:text-5xl">
            Experience.
          </h2>
        </motion.div>

        <ol className="list-none space-y-8">
          {experience.map((entry) => (
            <motion.li
              key={`${entry.company}-${entry.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-12"
            >
              <p className="text-sm font-light uppercase tracking-widest text-[#F5F5F5]/60 md:pt-8">
                {entry.period}
              </p>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors duration-300 focus-within:border-[#6EA8FF]/60 hover:border-[#6EA8FF]/40 md:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                  {entry.role}
                </h3>
                <p className="mt-1 mb-6 font-light text-[#6EA8FF]">{entry.company}</p>

                <ul className="mb-6 list-none space-y-3">
                  {entry.highlights.map((line) => (
                    <li key={line} className="flex gap-3 font-light leading-relaxed text-[#F5F5F5]/70">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6EA8FF]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <ul aria-label="Technologies" className="flex list-none flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-[#F5F5F5]/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {entry.link && (
                  <a
                    href={entry.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1 rounded text-sm text-[#F5F5F5]/70 underline underline-offset-4 transition-colors hover:text-white"
                  >
                    Code: {entry.link.label}
                    <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
