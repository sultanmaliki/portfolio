"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { CONTACT_EMAIL } from "@/data/config";
import { RESUME_URL, handleResumeClick } from "@/lib/resume";
import { linkHandler } from "@/lib/links";

export default function SectionContact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Not everyone has a mail app set up, so the address can be copied as well as clicked.
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      const field = document.createElement("textarea");
      field.value = CONTACT_EMAIL;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      if (!ok) return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  const LINKS = [
    {
      label: "GitHub",
      href: "https://github.com/sultanmaliki",
      external: true,
      preview: { title: "GitHub: sultanmaliki", description: "Everything I've built in public: source code, commit history and READMEs." },
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/syedmohammedsultan",
      external: true,
      preview: { title: "Syed Mohammed Sultan on LinkedIn", description: "My professional profile: experience, education and the best way to get in touch." },
    },
    {
      label: "Email",
      href: `mailto:${CONTACT_EMAIL}`,
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
                onClick={link.preview ? linkHandler({ url: link.href, ...link.preview }) : link.href === RESUME_URL ? handleResumeClick : undefined}
                className="group flex items-center gap-2 text-xl md:text-3xl font-light text-[#F5F5F5]/60 hover:text-white transition-colors"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 duration-300" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-light text-[#F5F5F5]/60 md:text-base">
            <span translate="no" className="break-all">{CONTACT_EMAIL}</span>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-[#F5F5F5]/80 transition-colors hover:border-white/40 hover:text-white"
            >
              {copied ? <Check aria-hidden size={13} className="text-emerald-400" /> : <Copy aria-hidden size={13} />}
              {copied ? "Copied" : "Copy"}
              <span className="sr-only"> email address</span>
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto w-full mt-20 flex items-center justify-between pt-8 border-t border-[rgba(255,255,255,0.05)] text-[#F5F5F5]/60 text-sm font-light">
        <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Syed Mohammed Sultan.</p>
        <a href="#top" className="group inline-flex items-center gap-1.5 rounded transition-colors hover:text-white">
          Back to top
          <ArrowUp aria-hidden size={14} className="transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
