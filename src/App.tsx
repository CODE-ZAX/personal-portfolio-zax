import { lazy, Suspense } from "react";
import { GlassDock } from "./components/nav/GlassDock";
import { SiteFooter } from "./components/SiteFooter";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { PracticeSection } from "./components/sections/PracticeSection";
import { ProjectsSkeleton } from "./components/ui/ProjectsSkeleton";
import { SectionBoundary } from "./components/ui/SectionBoundary";
import { LenisRoot } from "./motion/LenisRoot";
import { Marquee } from "./motion/Marquee";
import { ContentProvider } from "./data/content";
import { MotionProvider } from "./motion/MotionProvider";
import { BgLoop } from "./components/media/BgLoop";
import { loops } from "./data/media";
import { VideoMaskChapter } from "./type/VideoMaskChapter";
import { WebGLHost } from "./three/host";

const ProjectsSection = lazy(() => import("./components/sections/ProjectsSection"));

export default function App() {
  return (
    <ContentProvider>
    <MotionProvider>
      <LenisRoot />
      <WebGLHost />
      <BgLoop />
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <div id="page" className="relative z-[1]">
        <GlassDock />
        <main id="content">
          <HeroSection />
          <Marquee />
          <VideoMaskChapter label="Selected work" loop={loops.hero} />
          <SectionBoundary>
            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectsSection />
            </Suspense>
          </SectionBoundary>
          <PracticeSection />
          <AboutSection />
          <VideoMaskChapter label="Write" loop={loops.chatli} />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </MotionProvider>
    </ContentProvider>
  );
}
