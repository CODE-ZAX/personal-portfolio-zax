import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type MotionPrefs = {
  reduced: boolean;
  paused: boolean;
  fine: boolean;
  togglePause: () => void;
};

const MotionContext = createContext<MotionPrefs | null>(null);

function readReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readFine() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(readReduced);
  const [fine, setFine] = useState(readFine);
  const [paused, setPaused] = useState(() => readReduced() || document.documentElement.dataset.motion === "paused");

  useEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQuery = window.matchMedia("(pointer: fine)");
    const onReduce = () => {
      const next = reduceQuery.matches;
      setReduced(next);
      if (next) setPaused(true);
    };
    const onFine = () => setFine(fineQuery.matches);
    reduceQuery.addEventListener("change", onReduce);
    fineQuery.addEventListener("change", onFine);
    return () => {
      reduceQuery.removeEventListener("change", onReduce);
      fineQuery.removeEventListener("change", onFine);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? "paused" : "running";
    document.documentElement.dataset.reduce = reduced ? "true" : "false";
  }, [paused, reduced]);

  const value = useMemo<MotionPrefs>(
    () => ({
      reduced,
      paused: paused || reduced,
      fine,
      togglePause: () => {
        if (reduced) return;
        setPaused((current) => !current);
      },
    }),
    [reduced, paused, fine],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "user"}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionPrefs() {
  const value = useContext(MotionContext);
  if (!value) {
    throw new Error("useMotionPrefs must be used inside MotionProvider");
  }
  return value;
}
