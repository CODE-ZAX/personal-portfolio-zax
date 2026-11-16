import { lazy, Suspense } from "react";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { ProjectsSkeleton } from "./components/ui/ProjectsSkeleton";
import { SectionBoundary } from "./components/ui/SectionBoundary";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { PracticeSection } from "./components/sections/PracticeSection";
import { MotionProvider } from "./motion/MotionProvider";

const ProjectsSection = lazy(() => import("./components/sections/ProjectsSection"));

export default function App() {
  return (
    <MotionProvider>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-y-0 left-0 hidden w-2 bg-accent md:block" aria-hidden="true" />
      <SiteHeader />
      <main id="content">
        <HeroSection />
        <AboutSection />
        <PracticeSection />
        <SectionBoundary>
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsSection />
          </Suspense>
        </SectionBoundary>
        <ContactSection />
      </main>
      <SiteFooter />
    </MotionProvider>
  );
}
