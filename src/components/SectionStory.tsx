"use client";

import { motion, MotionValue } from "framer-motion";
import { useScrollTransform } from "@/utils/scroll";
import ScrollTimeline from "./ScrollTimeline";
import { createTimeline } from "@/utils/timeline";

const timeline = createTimeline([
  { id: "phrase1", duration: 1 },
  { id: "phrase2", duration: 1 },
  { id: "phrase3", duration: 1 },
  { id: "story", duration: 3 },
]);

// Timeline phases are fractions of the whole section, so fades must scale with
// the phase width; fixed offsets make the range non-monotonic and crash WAAPI.
const fadeRange = (start: number, end: number): number[] => {
  const fade = (end - start) * 0.15;
  return [start, start + fade, end - fade, end];
};

export default function SectionStory() {
  return (
    <ScrollTimeline 
      id="story"
      duration={timeline.totalDuration}
      className="bg-[#121212] z-20"
      stickyClassName="flex items-center justify-center p-6 md:p-12 lg:p-24"
    >
      {(progress) => <StoryContent progress={progress} />}
    </ScrollTimeline>
  );
}

function StoryContent({ progress }: { progress: MotionValue<number> }) {
  // Phrase 1 (fade in/out, move up)
  const [p1s, p1e] = timeline.getPhase("phrase1");
  const opacity1 = useScrollTransform(progress, fadeRange(p1s, p1e), [0, 1, 1, 0]);
  const y1 = useScrollTransform(progress, [p1s, p1e], [30, -30]);

  // Phrase 2
  const [p2s, p2e] = timeline.getPhase("phrase2");
  const opacity2 = useScrollTransform(progress, fadeRange(p2s, p2e), [0, 1, 1, 0]);
  const y2 = useScrollTransform(progress, [p2s, p2e], [30, -30]);

  // Phrase 3
  const [p3s, p3e] = timeline.getPhase("phrase3");
  const opacity3 = useScrollTransform(progress, fadeRange(p3s, p3e), [0, 1, 1, 0]);
  const y3 = useScrollTransform(progress, [p3s, p3e], [30, -30]);

  // Story Reveal
  const [s1s, s1e] = timeline.getPhase("story");
  const opacityStory = useScrollTransform(progress, fadeRange(s1s, s1e), [0, 1, 1, 0]);
  const yStory = useScrollTransform(progress, [s1s, s1e], [50, -50]);

  return (
    <div className="max-w-3xl w-full mx-auto relative h-full flex items-center justify-center text-center">
      
      {/* Intro Thoughts */}
      <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-light text-[#F5F5F5] tracking-tight">
          &quot;I don&apos;t spend every hour coding.&quot;
        </h2>
      </motion.div>

      <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-light text-[#F5F5F5]/70 tracking-tight">
          &quot;But when an idea captures my curiosity...&quot;
        </h2>
      </motion.div>

      <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-light text-[#6EA8FF] tracking-tight drop-shadow-[0_0_15px_rgba(110,168,255,0.3)]">
          &quot;...time quietly disappears.&quot;
        </h2>
      </motion.div>

      {/* The Story Reveal */}
      <motion.div
        style={{ opacity: opacityStory, y: yStory }}
        className="absolute inset-0 flex flex-col justify-center text-left space-y-3 sm:space-y-6 md:space-y-8 text-[15px] sm:text-lg md:text-2xl text-[#F5F5F5]/80 font-light leading-relaxed max-w-2xl mx-auto"
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
        <p className="pt-2 sm:pt-4 md:pt-8">
          Curiosity eventually became habit.<br />
          Habit became experimentation.<br />
          Experimentation became <span className="text-white font-medium">engineering.</span>
        </p>
      </motion.div>
    </div>
  );
}
