import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { subscribeLenis } from "../motion/lenisBridge";
import type { HeadingProps } from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

function pieces(text: string) {
  return text.split(" ").map((char, index, list) => ({ char, gap: index < list.length - 1 }));
}

export function KineticHeading({ as = "h2", children, className, id, travel = "section" }: HeadingProps) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const parts = el.querySelectorAll<HTMLElement>("[data-piece]");
    const motion =
      travel === "hero"
        ? { x: "7vw", y: 12, scale: 0.84 }
        : travel === "work"
          ? { x: "2vw", y: 36, scale: 0.8 }
          : travel === "section"
            ? { x: "4vw", y: 18, scale: 0.88 }
            : null;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.028,
          ease: "power3.out",
          delay: 0.05,
        },
      );
      if (!motion) return;
      gsap.to(el, {
        ...motion,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 20%",
          scrub: 0.65,
        },
      });
    }, el);

    const unsubscribe = subscribeLenis(() => ScrollTrigger.update());
    return () => {
      unsubscribe();
      ctx.revert();
    };
  }, [children, travel]);

  const Tag = as;
  const units = pieces(children);

  return (
    <Tag ref={root} id={id} className={`display ${className ?? ""}`} aria-label={children}>
      <span aria-hidden="true">
        {units.map((unit, index) => (
          <span key={`${unit.char}-${index}`} className="k-mask">
            <span data-piece className="k-piece">
              {unit.char === " " ? "\u00a0" : unit.char}
            </span>
            {unit.gap ? <span className="k-gap"> </span> : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
