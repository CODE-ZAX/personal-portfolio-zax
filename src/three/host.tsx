import { useEffect, useState, type ComponentType } from "react";
import { useMotionPrefs } from "../motion/MotionProvider";
import { useSceneDemand } from "./bridge";

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

function lowEndDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;
  return navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4;
}

export function WebGLHost() {
  const { reduced, paused, fine } = useMotionPrefs();
  const wide = useWide();
  const demand = useSceneDemand();
  const allowed = wide && fine && !reduced && !paused && !lowEndDevice() && demand > 0;
  const [Stage, setStage] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!allowed) {
      setStage(null);
      return;
    }
    let dead = false;
    import("./Stage").then((mod) => {
      if (!dead) setStage(() => mod.Stage);
    });
    return () => {
      dead = true;
    };
  }, [allowed]);

  return Stage ? <Stage /> : null;
}
