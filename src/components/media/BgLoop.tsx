import { useEffect, useState } from "react";
import { loops } from "../../data/media";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { LoopVideo } from "./LoopVideo";

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

export function BgLoop() {
  const { reduced, paused } = useMotionPrefs();
  const wide = useWide();
  const on = wide && !reduced && !paused;

  useEffect(() => {
    document.documentElement.dataset.bgLoop = on ? "on" : "off";
    return () => {
      document.documentElement.dataset.bgLoop = "off";
    };
  }, [on]);

  if (!on) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <LoopVideo loop={loops.texture} className="h-full w-full object-cover opacity-[0.22]" />
    </div>
  );
}
