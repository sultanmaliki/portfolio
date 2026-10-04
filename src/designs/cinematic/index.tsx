import ScrollyCanvas from "./ScrollyCanvas";
import SectionStory from "./SectionStory";
import SectionSkills from "./SectionSkills";
import SectionExperience from "./SectionExperience";
import SectionEducation from "./SectionEducation";
import SiteNav from "./SiteNav";
import Projects from "./Projects";
import SectionTimeline from "./SectionTimeline";
import SectionCuriosity from "./SectionCuriosity";
import SectionContact from "./SectionContact";
import CustomCursor from "./CustomCursor";
import NoiseBackground from "./NoiseBackground";
import KonamiCode from "./KonamiCode";

/**
 * The original design: a scroll-linked film intro, then glass panels on a dark stage.
 * All content comes from "@/data"; the resume reader, link viewer and design switcher are shared
 * chrome mounted by the root layout.
 */
export default function CinematicDesign() {
  return (
    <main
      id="top"
      data-design="cinematic"
      className="bg-[#121212] min-h-screen text-[#F5F5F5] selection:bg-[#6EA8FF] selection:text-black"
    >
      <a
        href="#story"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform focus:translate-y-0"
      >
        Skip intro
      </a>
      <SiteNav />
      <CustomCursor />
      <NoiseBackground />
      <KonamiCode />

      {/* 0. Scroll-linked cinematic intro */}
      <ScrollyCanvas />

      {/* 1. Story */}
      <SectionStory />

      {/* 2. Glass Panels - Skills */}
      <SectionSkills />

      {/* 3. Experience */}
      <SectionExperience />
      <SectionEducation />

      {/* 4. Projects - live from GitHub */}
      <Projects />

      {/* 5. Interactive Timeline */}
      <SectionTimeline />

      {/* 6. Curiosity Board */}
      <SectionCuriosity />

      {/* 7. Contact */}
      <SectionContact />
    </main>
  );
}
