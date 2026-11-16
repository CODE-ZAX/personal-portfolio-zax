import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

type MotionPrefs = {
  reduced: boolean;
  paused: boolean;
  allowPointerMotion: boolean;
  togglePaused: () => void;
};

const MotionPrefsContext = createContext<MotionPrefs | null>(null);

function readReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(readReduced);
  const [finePointer, setFinePointer] = useState(readFinePointer);
  const [paused, setPaused] = useState(readReduced);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const onMotion = () => {
      setReduced(motionQuery.matches);
      if (motionQuery.matches) setPaused(true);
    };
    const onPointer = () => setFinePointer(pointerQuery.matches);
    motionQuery.addEventListener("change", onMotion);
    pointerQuery.addEventListener("change", onPointer);
    return () => {
      motionQuery.removeEventListener("change", onMotion);
      pointerQuery.removeEventListener("change", onPointer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? "paused" : "running";
  }, [paused, reduced]);

  const value = useMemo<MotionPrefs>(
    () => ({
      reduced,
      paused: paused || reduced,
      allowPointerMotion: !reduced && finePointer,
      togglePaused: () => {
        if (reduced) return;
        setPaused((current) => !current);
      },
    }),
    [reduced, paused, finePointer],
  );

  return (
    <MotionPrefsContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionPrefsContext.Provider>
  );
}

export function useMotionPrefs() {
  const value = useContext(MotionPrefsContext);
  if (!value) {
    throw new Error("useMotionPrefs must be used inside MotionProvider");
  }
  return value;
}
