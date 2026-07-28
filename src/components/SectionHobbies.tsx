"use client";

import { motion } from "framer-motion";
import { Camera, Droplets, Gamepad2 } from "lucide-react";
import { useState } from "react";

export default function SectionHobbies() {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const HOBBIES = [
    {
      id: "camera",
      icon: Camera,
      label: "Nature",
      content: (
        <div className="text-center">
          <p className="text-xl font-light text-white italic">&quot;If software disappeared tomorrow...&quot;</p>
          <p className="text-[#F5F5F5]/60 mt-2">&quot;I&apos;d probably be growing tomatoes somewhere.&quot;</p>
        </div>
      )
    },
    {
      id: "perfume",
      icon: Droplets,
      label: "Arabic Perfumery",
      content: (
        <div className="text-center">
          <p className="text-[#F5F5F5]/50 text-sm tracking-widest uppercase mb-2">Currently into</p>
          <p className="text-2xl font-light text-white">Dark Arabic fragrances.</p>
        </div>
      )
    },
    {
      id: "gaming",
      icon: Gamepad2,
      label: "Gaming",
      content: (
        <div className="flex flex-col gap-4 text-center text-xl font-light text-white">
          <span>VALORANT</span>
          <span>Marvel Rivals</span>
          <span>R.E.P.O.</span>
        </div>
      )
    }
  ];

  return (
    <section className="py-32 bg-[#121212] relative z-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-24">
          Outside the screen.
        </h2>

        <div className="flex justify-center gap-16 md:gap-32">
          {HOBBIES.map((hobby) => (
            <motion.button
              key={hobby.id}
              whileHover={{ y: -10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveNote(activeNote === hobby.id ? null : hobby.id)}
              className={`flex flex-col items-center gap-4 transition-colors ${activeNote === hobby.id ? 'text-white' : 'text-[#F5F5F5]/40 hover:text-white'}`}
            >
              <div className="w-16 h-16 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
                <hobby.icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-sm tracking-wider font-light">{hobby.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="h-64 mt-24 flex items-center justify-center">
          {HOBBIES.map((hobby) => (
            activeNote === hobby.id && (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-12 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] backdrop-blur-lg"
              >
                {hobby.content}
              </motion.div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
