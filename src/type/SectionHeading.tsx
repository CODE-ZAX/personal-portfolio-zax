import { useEffect, useState, type ComponentType } from "react";
import { useMotionPrefs } from "../motion/MotionProvider";

type Travel = "hero" | "work" | "section" | "none";

export type HeadingProps = {
  as?: "h1" | "h2";
  children: string;
  className?: string;
  id?: string;
  travel?: Travel;
};

type KineticProps = HeadingProps;

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => setWide(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return wide;
}

export function SectionHeading({ as = "h2", children, className, id, travel = "section" }: HeadingProps) {
  const { reduced, paused, fine } = useMotionPrefs();
  const wide = useWide();
  const live = wide && fine && !reduced && !paused;
  const [Kinetic, setKinetic] = useState<ComponentType<KineticProps> | null>(null);

  useEffect(() => {
    if (!live) {
      setKinetic(null);
      return;
    }
    let dead = false;
    import("./KineticHeading").then((mod) => {
      if (!dead) setKinetic(() => mod.KineticHeading);
    });
    return () => {
      dead = true;
    };
  }, [live]);

  if (Kinetic) {
    return (
      <Kinetic as={as} className={className} id={id} travel={travel}>
        {children}
      </Kinetic>
    );
  }

  const Tag = as;
  return (
    <Tag id={id} className={`display ${className ?? ""}`} aria-label={children}>
      <span aria-hidden="true" className="display-rest">
        {children}
      </span>
    </Tag>
  );
}
