import { useEffect, useRef, useState } from "react";
import type { LoopAsset } from "../../data/media";
import { useMotionPrefs } from "../../motion/MotionProvider";

export function LoopVideo({
  loop,
  className,
}: {
  loop: LoopAsset;
  className?: string;
}) {
  const { reduced, paused } = useMotionPrefs();
  const videoRef = useRef<HTMLVideoElement>(null);
  const motionOff = reduced || paused;
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (motionOff) {
      setArmed(false);
      return;
    }
    let dead = false;
    const arm = () => {
      if (!dead) setArmed(true);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      dead = true;
      window.removeEventListener("load", arm);
    };
  }, [motionOff]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed || motionOff) return;
    const play = () => {
      video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "120px", threshold: 0.2 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [armed, motionOff]);

  if (motionOff) return null;

  return (
    <video
      ref={videoRef}
      className={className}
      poster={loop.poster}
      muted
      autoPlay
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      {armed ? (
        <>
          <source src={loop.webmSmall} type="video/webm" media="(max-width: 767px)" />
          <source src={loop.webm} type="video/webm" />
          <source src={loop.mp4Small} type="video/mp4" media="(max-width: 767px)" />
          <source src={loop.mp4} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}
