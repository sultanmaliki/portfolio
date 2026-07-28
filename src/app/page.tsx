import ScrollyCanvas from "@/components/ScrollyCanvas";
import SectionStory from "@/components/SectionStory";
import SectionSkills from "@/components/SectionSkills";
import SectionQueryCraft from "@/components/SectionQueryCraft";
import SectionTimeline from "@/components/SectionTimeline";
import SectionCuriosity from "@/components/SectionCuriosity";
import SectionHobbies from "@/components/SectionHobbies";
import SectionContact from "@/components/SectionContact";
import Terminal from "@/components/Terminal";
import CustomCursor from "@/components/CustomCursor";
import NoiseBackground from "@/components/NoiseBackground";
import KonamiCode from "@/components/KonamiCode";

export const metadata = {
  title: "Syed Mohammed Sultan | Creative Developer",
  description: "Portfolio of Syed Mohammed Sultan. Exploring motion, AI, and immersive web experiences.",
};

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen text-[#F5F5F5] selection:bg-[#6EA8FF] selection:text-black">
      <CustomCursor />
      <NoiseBackground />
      <KonamiCode />
      <Terminal />
      
      {/* 0. Scroll-linked cinematic intro */}
      <ScrollyCanvas />
      
      {/* 1. Story */}
      <SectionStory />
      
      {/* 2. Glass Panels - Skills */}
      <SectionSkills />
      
      {/* 3. QueryCraft - The Product */}
      <SectionQueryCraft />
      
      {/* 4. Interactive Timeline */}
      <SectionTimeline />
      
      {/* 5. Curiosity Board */}
      <SectionCuriosity />
      
      {/* 6. Hobbies - Outside the screen */}
      <SectionHobbies />
      
      {/* 7. Contact */}
      <SectionContact />
      
    </main>
  );
}
