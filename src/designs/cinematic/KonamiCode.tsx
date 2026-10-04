"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export default function KonamiCode() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[index]) {
        index++;
        if (index === KONAMI_CODE.length) {
          setUnlocked(true);
          index = 0;
          setTimeout(() => setUnlocked(false), 5000);
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-8 right-8 z-[100] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <div className="text-2xl">🎉</div>
          <div>
            <div className="text-sm font-semibold text-white">Achievement Unlocked</div>
            <div className="text-xs text-[#F5F5F5]/70">Curiosity Never Ends.</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
