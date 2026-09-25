"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RESUME_URL, handleResumeClick } from "@/lib/resume";

export default function SectionContact() {
  const LINKS = [
    {
      label: "GitHub",
      href: "https://github.com/sultanmaliki",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/syedmohammedsultan",
      external: true,
    },
    {
      label: "Email",
      href: "mailto:ssultanmaliki47@gmail.com",
      external: false,
    },
    {
      label: "Resume",
      href: RESUME_URL, // Lives in /public; a plain click opens the built-in reader
      external: true,
    },
  ];

  return (
    <section id="contact" className="min-h-dvh scroll-mt-16 bg-[#121212] py-32 px-6 flex flex-col justify-between relative z-20">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-8xl font-light text-white tracking-tighter mb-8 leading-tight">
            Let&rsquo;s build something <br />
            <span className="text-[#6EA8FF]">
              meaningful.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[#F5F5F5]/60 font-light max-w-2xl leading-relaxed mb-12">
            I&rsquo;m looking for entry-level software engineering roles where curiosity, engineering, and thoughtful products come together.
          </p>
          <p className="text-base md:text-lg text-[#F5F5F5]/60 font-light mb-16">
            Based in Bhatkal, Karnataka. Open to relocating to Bangalore.
          </p>

          <div className="flex flex-wrap gap-8">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(link.href === RESUME_URL ? { onClick: handleResumeClick } : {})}
                className="group flex items-center gap-2 text-xl md:text-3xl font-light text-[#F5F5F5]/60 hover:text-white transition-colors"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 duration-300" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pt-16 border-t border-[rgba(255,255,255,0.05)] text-[#F5F5F5]/60 text-sm font-light">
        <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Syed Mohammed Sultan.</p>
        <p className="hover:text-[#F5F5F5]/80 transition-colors [@media(pointer:coarse)]:hidden">Press <kbd className="px-2 py-1 bg-white/5 rounded mx-1">~</kbd> for terminal</p>
      </div>
    </section>
  );
}
