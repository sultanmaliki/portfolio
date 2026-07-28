"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  progress: MotionValue<number>;
}

export default function Overlay({ progress }: OverlayProps) {
  // Section 1: 0% to 20%
  const opacity1 = useTransform(progress, [0, 0.1, 0.2], [1, 1, 0]);
  const y1 = useTransform(progress, [0, 0.2], [0, -100]);

  // Section 2: 25% to 50%
  const opacity2 = useTransform(progress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(progress, [0.2, 0.5], [100, -100]);

  // Section 3: 55% to 80%
  const opacity3 = useTransform(progress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const y3 = useTransform(progress, [0.5, 0.8], [100, -100]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Section 1 */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          Nano Banana.
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300 font-light tracking-wide drop-shadow-md">
          Creative Developer.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-start justify-center text-left p-8 md:p-24"
      >
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white max-w-2xl drop-shadow-lg leading-tight">
          I build digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">experiences</span>.
        </h2>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-end justify-center text-right p-8 md:p-24"
      >
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white max-w-2xl drop-shadow-lg leading-tight">
          Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">design</span> and engineering.
        </h2>
      </motion.div>
    </div>
  );
}
