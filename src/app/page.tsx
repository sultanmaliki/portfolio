import ScrollyCanvas from "@/components/ScrollyCanvas";
import SectionStory from "@/components/SectionStory";
import SectionSkills from "@/components/SectionSkills";
import SectionExperience from "@/components/SectionExperience";
import SectionEducation from "@/components/SectionEducation";
import SiteNav from "@/components/SiteNav";
import Projects from "@/components/Projects";
import SectionTimeline from "@/components/SectionTimeline";
import SectionCuriosity from "@/components/SectionCuriosity";
import SectionContact from "@/components/SectionContact";
import ResumeViewer from "@/components/ResumeViewer";
import CustomCursor from "@/components/CustomCursor";
import NoiseBackground from "@/components/NoiseBackground";
import KonamiCode from "@/components/KonamiCode";

export default function Home() {
  return (
    <main id="top" className="bg-[#121212] min-h-screen text-[#F5F5F5] selection:bg-[#6EA8FF] selection:text-black">
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
      <ResumeViewer />

      {/* 0. Scroll-linked cinematic intro */}
      <ScrollyCanvas />
      
      {/* 1. Story */}
      <SectionStory />
      
      {/* 2. Glass Panels - Skills */}
      <SectionSkills />
      
      {/* 3. Experience */}
      <SectionExperience />
      <SectionEducation />

      {/* 4. Projects - live from GitHub (QueryCraft is listed here like any other repo) */}
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
