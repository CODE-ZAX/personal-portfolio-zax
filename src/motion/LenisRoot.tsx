import { useEffect } from "react";
import { notifyLenisScroll, setLenis } from "./lenisBridge";
import { useMotionPrefs } from "./MotionProvider";

export function LenisRoot() {
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop) return;

    let dead = false;
    let removeScroll: (() => void) | undefined;
    let frame = 0;
    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
      on: (event: "scroll", callback: () => void) => () => void;
      stop: () => void;
      start: () => void;
      scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean }) => void;
    } | null = null;

    import("lenis").then((mod) => {
      if (dead) return;
      lenis = new mod.default({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
      });
      setLenis(lenis);
      removeScroll = lenis.on("scroll", () => notifyLenisScroll());
      const loop = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(loop);
      };
      frame = window.requestAnimationFrame(loop);
    });

    return () => {
      dead = true;
      window.cancelAnimationFrame(frame);
      removeScroll?.();
      lenis?.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
