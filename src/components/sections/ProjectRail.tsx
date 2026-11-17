import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../../data/profile";
import { projectPictureFor } from "../../data/media";
import { slug } from "../../lib/slug";
import { getLenis, subscribeLenis } from "../../motion/lenisBridge";
import { ProjectCard } from "../projects/ProjectCard";
import { SectionHeading } from "../../type/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectRail({ onOpen }: { onOpen: (repo: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${distance()}`,
          onToggle: (self) => {
            track.style.willChange = self.isActive ? "transform" : "auto";
          },
        },
      });
    }, section);

    const unsubscribe = subscribeLenis(() => ScrollTrigger.update());
    const images = [...track.querySelectorAll("img")];
    const refresh = () => ScrollTrigger.refresh();
    images.forEach((image) => image.addEventListener("load", refresh));
    window.addEventListener("resize", refresh);

    return () => {
      images.forEach((image) => image.removeEventListener("load", refresh));
      window.removeEventListener("resize", refresh);
      unsubscribe();
      track.style.willChange = "auto";
      ctx.revert();
    };
  }, []);

  const reveal = (node: HTMLElement) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const trigger = ScrollTrigger.getAll().find((item) => item.trigger === section);
    if (!trigger) return;
    const offset = node.offsetLeft;
    const distance = Math.max(1, track.scrollWidth - window.innerWidth);
    const progress = Math.min(1, Math.max(0, (offset - 32) / distance));
    const top = trigger.start + (trigger.end - trigger.start) * progress;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="work" className="relative h-[100dvh] overflow-hidden" aria-label="Selected work">
      <div className="flex h-full flex-col justify-center">
        <header className="flex items-end justify-between gap-8 px-4 md:px-8">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Selected work</p>
            <SectionHeading travel="work" className="mt-2 max-w-[12ch]">
              The products he ships.
            </SectionHeading>
          </div>
          <p className="hidden max-w-[36ch] text-sm leading-relaxed text-muted lg:block">
            Scroll to move across the set. Each summary is taken from the repository README. Open a card for the longer note.
          </p>
        </header>
        <ul ref={trackRef} className="mt-8 flex w-max items-stretch gap-5 pl-4 pr-[10vw] md:pl-8">
          {profile.projects.map((project) => {
            const image = projectPictureFor(project.repo);
            if (!image) return null;
            return (
              <li key={project.repo} className="w-[min(78vw,34rem)] shrink-0">
                <ProjectCard
                  project={project}
                  image={image}
                  layoutId={`work-${slug(project.repo)}`}
                  className="h-full w-full"
                  onOpen={() => onOpen(project.repo)}
                  onReveal={reveal}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
