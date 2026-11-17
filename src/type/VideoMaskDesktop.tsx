import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LoopAsset } from "../data/media";
import { subscribeLenis } from "../motion/lenisBridge";
import { LoopVideo } from "../components/media/LoopVideo";

gsap.registerPlugin(ScrollTrigger);

function maskUrl(label: string) {
  const size = label.length < 12 ? 220 : 118;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 360'><text x='600' y='230' text-anchor='middle' font-family='Outfit,sans-serif' font-size='${size}' font-weight='600' fill='white'>${label}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function VideoMaskDesktop({ label, loop }: { label: string; loop: LoopAsset }) {
  const sectionRef = useRef<HTMLElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const mask = maskUrl(label);

  useEffect(() => {
    const section = sectionRef.current;
    const zoom = zoomRef.current;
    const full = fullRef.current;
    if (!section || !zoom || !full) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        zoom,
        { scale: 0.62 },
        {
          scale: 4.4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 18%",
            scrub: 0.7,
          },
        },
      );
      gsap.fromTo(
        full,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center 60%",
            end: "bottom 22%",
            scrub: 0.7,
          },
        },
      );
    }, section);

    const unsubscribe = subscribeLenis(() => ScrollTrigger.update());
    return () => {
      unsubscribe();
      ctx.revert();
    };
  }, [label]);

  return (
    <section ref={sectionRef} className="mask-chapter relative h-[100dvh] overflow-hidden" aria-label={label}>
      <h2 className="sr-only">{label}</h2>
      <div ref={zoomRef} className="mask-zoom absolute inset-0" aria-hidden="true">
        <div className="video-letter-mask h-full w-full" style={{ ["--letter-mask" as string]: mask }}>
          <LoopVideo loop={loop} className="h-full w-full object-cover" />
        </div>
      </div>
      <div ref={fullRef} className="absolute inset-0 opacity-0" aria-hidden="true">
        <LoopVideo loop={loop} className="h-full w-full object-cover" />
      </div>
    </section>
  );
}
