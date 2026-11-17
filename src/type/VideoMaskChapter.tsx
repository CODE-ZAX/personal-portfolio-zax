import { useEffect, useState, type ComponentType } from "react";
import type { LoopAsset } from "../data/media";
import { useMotionPrefs } from "../motion/MotionProvider";
import { LoopVideo } from "../components/media/LoopVideo";

type Props = {
  label: string;
  loop: LoopAsset;
};

function maskUrl(label: string) {
  const size = label.length < 12 ? 220 : 118;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 360'><text x='600' y='230' text-anchor='middle' font-family='Outfit,sans-serif' font-size='${size}' font-weight='600' fill='white'>${label}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

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

function StillFrame({ label, loop }: Props) {
  return (
    <section className="relative h-[58dvh] overflow-hidden" aria-label={label}>
      <h2 className="sr-only">{label}</h2>
      <img src={loop.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </section>
  );
}

function MaskStage({ label, loop, zoomClass }: Props & { zoomClass: string }) {
  const mask = maskUrl(label);
  return (
    <section className="mask-chapter relative h-[88dvh] overflow-hidden" aria-label={label}>
      <h2 className="sr-only">{label}</h2>
      <div className={`mask-zoom ${zoomClass}`} aria-hidden="true">
        <div className="video-letter-mask h-full w-full" style={{ ["--letter-mask" as string]: mask }}>
          <LoopVideo loop={loop} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mask-full absolute inset-0 opacity-0" aria-hidden="true">
        <LoopVideo loop={loop} className="h-full w-full object-cover" />
      </div>
    </section>
  );
}

export function VideoMaskChapter(props: Props) {
  const { reduced, paused, fine } = useMotionPrefs();
  const wide = useWide();
  const [Desktop, setDesktop] = useState<ComponentType<Props> | null>(null);
  const live = !reduced && !paused;

  useEffect(() => {
    if (!live || !wide || !fine) {
      setDesktop(null);
      return;
    }
    let dead = false;
    import("./VideoMaskDesktop").then((mod) => {
      if (!dead) setDesktop(() => mod.VideoMaskDesktop);
    });
    return () => {
      dead = true;
    };
  }, [live, wide, fine]);

  if (!live) return <StillFrame {...props} />;
  if (Desktop) return <Desktop {...props} />;
  return <MaskStage {...props} zoomClass="mask-zoom-css" />;
}
