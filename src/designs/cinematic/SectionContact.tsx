"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { portfolio } from "@/data";
import { RESUME_URL, handleResumeClick } from "@/lib/resume";
import { linkHandler } from "@/lib/links";
import { useCopy } from "@/lib/useCopy";

const { profile } = portfolio;

export default function SectionContact() {
  const { copied, copy } = useCopy();

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
            {profile.contact.headline[0]} <br />
            <span className="text-[#6EA8FF]">
              {profile.contact.headline[1]}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[#F5F5F5]/60 font-light max-w-2xl leading-relaxed mb-12">
            {profile.contact.pitch}
          </p>
          <p className="text-base md:text-lg text-[#F5F5F5]/60 font-light mb-16">
            {profile.location.sentence}
          </p>

          <div className="flex flex-wrap gap-8">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...(link.id !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={link.preview ? linkHandler({ url: link.href, ...link.preview }) : link.href === RESUME_URL ? handleResumeClick : undefined}
                className="group flex items-center gap-2 text-xl md:text-3xl font-light text-[#F5F5F5]/60 hover:text-white transition-colors"
              >
                {link.label}
                <ArrowUpRight aria-hidden className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 duration-300" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-light text-[#F5F5F5]/60 md:text-base">
            <span translate="no" className="break-all">{profile.email}</span>
            <button
              type="button"
              onClick={() => copy(profile.email)}
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
        <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}.</p>
        <a href="#top" className="group inline-flex items-center gap-1.5 rounded transition-colors hover:text-white [@media(pointer:coarse)]:min-h-11">
          Back to top
          <ArrowUp aria-hidden size={14} className="transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
