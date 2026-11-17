import { Component, useEffect, useState, type ReactNode } from "react";
import { media } from "../../data/media";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { Picture } from "../media/Picture";
import type { HeroScene as HeroSceneComponent } from "./HeroScene";

type SceneComponent = typeof HeroSceneComponent;

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function particleCount() {
  const width = window.innerWidth;
  if (width < 768) return 100;
  if (width < 1100) return 300;
  return 800;
}

export function HeroVisual() {
  const { reduced, paused, fine } = useMotionPrefs();
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  const enabled = fine && wide && !reduced && !paused;
  const [Scene, setScene] = useState<SceneComponent | null>(null);
  const [count, setCount] = useState(100);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => setWide(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setScene(null);
      return;
    }
    let dead = false;
    setCount(particleCount());
    import("./HeroScene").then((mod) => {
      if (!dead) setScene(() => mod.HeroScene);
    });
    return () => {
      dead = true;
    };
  }, [enabled]);

  return (
    <div className="hero-visual absolute inset-0 overflow-hidden rounded-[1.75rem] md:rounded-l-[2rem] md:rounded-r-none">
      <Picture image={media.hero} priority className="h-full w-full object-cover" />
      {Scene ? (
        <SceneBoundary>
          <div className="webgl-slot absolute inset-0" aria-hidden="true">
            <Scene count={count} />
          </div>
        </SceneBoundary>
      ) : null}
    </div>
  );
}
