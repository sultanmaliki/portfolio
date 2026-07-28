"use client";

import { motion } from "framer-motion";

const NOTES = [
  { text: "Learning Motion Design", top: "10%", left: "10%", rotate: -5, delay: 0 },
  { text: "Creating 3D Websites", top: "20%", left: "60%", rotate: 4, delay: 0.2 },
  { text: "Video Editing", top: "50%", left: "15%", rotate: -3, delay: 0.4 },
  { text: "Content Creation", top: "60%", left: "75%", rotate: 6, delay: 0.6 },
  { text: "AI Experiments", top: "80%", left: "30%", rotate: -6, delay: 0.8 },
  { text: "Linux", top: "40%", left: "45%", rotate: 2, delay: 1.0 },
  { text: "Frontend Architecture", top: "75%", left: "55%", rotate: -4, delay: 1.2 },
];

export default function SectionCuriosity() {
  return (
    <section className="min-h-screen bg-[#121212] py-32 relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
          Curiosity Board
        </h2>
      </div>

      <div className="relative w-full h-[600px] max-w-6xl mx-auto">
        {NOTES.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            animate={{ 
              y: [0, -15, 0],
              rotate: [note.rotate, note.rotate + 2, note.rotate] 
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: note.delay },
              scale: { duration: 0.8, delay: note.delay },
              y: { repeat: Infinity, duration: 4 + (i % 3), ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4 + (i % 3), ease: "easeInOut" }
            }}
            className="absolute p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-2xl cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
            style={{ top: note.top, left: note.left }}
          >
            <span className="text-[#F5F5F5]/90 font-light text-lg whitespace-nowrap">
              {note.text}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
