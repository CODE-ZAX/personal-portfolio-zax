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
import { MotionProvider } from "./motion/MotionProvider";
import { BgLoop } from "./components/media/BgLoop";
import { WebGLHost } from "./three/host";

const ProjectsSection = lazy(() => import("./components/sections/ProjectsSection"));

export default function App() {
  return (
    <MotionProvider>
      <LenisRoot />
      <WebGLHost />
      <BgLoop />
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <div id="page">
        <GlassDock />
        <main id="content">
          <HeroSection />
          <Marquee />
          <SectionBoundary>
            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectsSection />
            </Suspense>
          </SectionBoundary>
          <PracticeSection />
          <AboutSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
