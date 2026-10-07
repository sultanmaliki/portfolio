"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "@/data";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";

const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const SCENE_MS = 3000;

const { profile, featuredProjects, skills, story } = portfolio;

interface Scene {
  kicker?: string;
  line: string;
  sub?: string;
  big?: boolean;
  cta?: boolean;
}

/** The trailer, written from the portfolio's own content. */
const SCENES: Scene[] = [
  { kicker: "A portfolio picture", line: "This year…" },
  { line: "One developer." },
  { kicker: "In a world where every build has a deadline", line: `${featuredProjects.length} projects. ${skills.length} stacks.`, sub: "Zero excuses." },
  { line: story.quotes[1].replace("…", ""), sub: "…time quietly disappears." },
  { line: profile.name, sub: profile.jobTitle, big: true },
  { kicker: "Rated R", line: "For ready to hire.", sub: profile.availability.detail },
  { kicker: "Starring", line: skills.flatMap((s) => s.items).filter((i) => !i.includes("(")).slice(0, 6).join(" · "), sub: "Coming soon to your team.", cta: true },
];

/** Type "action" (or tap the name five times, or enter the Konami code): a movie trailer for the portfolio. */
export default function KonamiCode() {
  const { active, dismiss, open } = useEasterEgg({ slug: "cinematic", word: "action", duration: 0 });
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  });

  // the Konami code opens it too
  useEffect(() => {
    let index = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[index]) {
        index++;
        if (index === KONAMI_CODE.length) {
          index = 0;
          openRef.current();
        }
      } else {
        index = e.key === KONAMI_CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <EggDialog slug="cinematic" active={active} title="Trailer" onClose={dismiss} variant="stage" className="bg-black text-[#F5F5F5] font-sans">
      <Trailer />
    </EggDialog>
  );
}

function Trailer() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const last = scene >= SCENES.length - 1;
  const s = SCENES[scene];

  useEffect(() => {
    if (!playing || last) return;
    const t = setTimeout(() => setScene((n) => n + 1), SCENE_MS);
    return () => clearTimeout(t);
  }, [playing, scene, last]);

  const next = () => setScene((n) => Math.min(n + 1, SCENES.length - 1));

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="h-[11vh] bg-black" />
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center" onClick={next}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(110,168,255,0.16),transparent_62%)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.7 }}
            className="relative max-w-4xl"
          >
            {s.kicker && <p className="mb-5 text-xs uppercase tracking-[0.4em] text-[#6EA8FF] sm:text-sm">{s.kicker}</p>}
            <p className={`font-semibold uppercase leading-[1.05] tracking-[0.12em] ${s.big ? "text-[clamp(2rem,8vw,5.5rem)]" : "text-[clamp(1.6rem,6vw,4rem)]"}`}>{s.line}</p>
            {s.sub && <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#F5F5F5]/75 sm:text-base">{s.sub}</p>}
            {s.cta && (
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("I saw the trailer")}`}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto mt-8 inline-block rounded-md border border-[#6EA8FF] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#6EA8FF] transition hover:bg-[#6EA8FF] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Book a screening
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex h-[11vh] min-h-16 items-center justify-between gap-3 bg-black px-4">
        <p className="text-xs uppercase tracking-[0.25em] text-[#F5F5F5]/70" role="status">
          Scene {scene + 1} of {SCENES.length}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying((p) => !p)} className="min-h-10 rounded-md border border-white/30 px-4 text-xs uppercase tracking-[0.2em] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" data-autofocus onClick={last ? () => setScene(0) : next} className="min-h-10 rounded-md border border-[#6EA8FF] px-4 text-xs uppercase tracking-[0.2em] text-[#6EA8FF] hover:bg-[#6EA8FF] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            {last ? "Replay" : "Next"}
          </button>
          <EggClose className="min-h-10 rounded-md border border-white/30 px-4 text-xs uppercase tracking-[0.2em] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Close</EggClose>
        </div>
      </div>
    </div>
  );
}
