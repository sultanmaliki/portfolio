"use client";

import { motion } from "framer-motion";
import { certifications, education } from "@/data/education";

export default function SectionEducation() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="relative z-20 bg-[#121212] px-6 pb-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          id="education-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-4xl font-light tracking-tight text-white md:text-5xl"
        >
          Education.
        </motion.h2>

        <ol className="list-none space-y-8">
          {education.map((entry) => (
            <motion.li
              key={`${entry.institution}-${entry.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-12"
            >
              <p className="text-sm font-light uppercase tracking-widest text-[#F5F5F5]/60 md:pt-8">
                {entry.period}
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{entry.degree}</h3>
                <p className="mt-1 mb-6 font-light text-[#6EA8FF]">{entry.institution}</p>
                <p className="mb-3 text-xs uppercase tracking-widest text-[#F5F5F5]/60">Coursework</p>
                <ul className="flex list-none flex-wrap gap-2">
                  {entry.coursework.map((course) => (
                    <li
                      key={course}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-[#F5F5F5]/80"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid gap-6 md:grid-cols-[13rem_1fr] md:gap-12"
        >
          <h3 className="text-sm font-light uppercase tracking-widest text-[#F5F5F5]/60">Certifications</h3>
          <ul className="list-none space-y-3">
            {certifications.map((cert) => (
              <li key={cert.name} className="font-light text-[#F5F5F5]/70">
                <span className="text-white">{cert.name}</span>
                {(cert.issuer || cert.year) && (
                  <span className="text-[#F5F5F5]/60">
                    {" · "}
                    {[cert.issuer, cert.year].filter(Boolean).join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
