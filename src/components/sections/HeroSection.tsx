import { useState } from "react";
import { motion } from "motion/react";
import { profile } from "../../data/profile";
import { LiveDot } from "../../motion/LiveDot";
import { MagneticLink } from "../../motion/MagneticLink";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { TiltFrame } from "../../motion/TiltFrame";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function HeroSection() {
  const { reduced } = useMotionPrefs();
  const [portraitFailed, setPortraitFailed] = useState(false);
  return (
    <section
      id="top"
      className="min-h-[calc(100dvh-4.5rem)] px-4 pb-16 pt-8 md:px-8 md:pt-12"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div
          className="lg:col-span-7"
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
          <motion.p
            className="flex items-center font-display text-lg text-accent"
            variants={reduced ? undefined : item}
          >
            <LiveDot />
            {profile.location}
          </motion.p>
          <motion.p className="mt-1 text-muted" variants={reduced ? undefined : item}>
            {profile.company}
          </motion.p>
          <motion.h1
            className="mt-4 max-w-[12ch] font-display text-4xl font-semibold tracking-tighter text-ink md:text-6xl"
            variants={reduced ? undefined : item}
          >
            {profile.name}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[22ch] font-display text-2xl tracking-tight text-ink md:text-3xl"
            variants={reduced ? undefined : item}
          >
            {profile.headline}
          </motion.p>
          <motion.p
            className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted"
            variants={reduced ? undefined : item}
          >
            {profile.lede}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" variants={reduced ? undefined : item}>
            <MagneticLink
              href="#work"
              className="inline-flex items-center rounded-full bg-accent px-5 py-3 font-display text-base font-semibold text-surface"
            >
              See the work
            </MagneticLink>
            <a
              href="https://github.com/CODE-ZAX"
              className="tactile inline-flex items-center rounded-full border border-ink/15 bg-surface px-5 py-3 font-display text-base font-medium"
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub
            </a>
          </motion.div>
        </motion.div>

        <figure className="lg:col-span-5 lg:justify-self-end">
          <div className="relative mx-auto max-w-md">
            <TiltFrame className="relative overflow-hidden rounded-[2.5rem] bg-surface shadow-[0_24px_60px_rgba(26,33,28,0.08)]">
              {portraitFailed ? (
                <div className="grid aspect-square place-items-center bg-soft font-display text-6xl text-accent">
                  MF
                </div>
              ) : (
                <img
                  src={profile.portrait.src}
                  alt={profile.portrait.alt}
                  width={460}
                  height={460}
                  decoding="async"
                  fetchPriority="high"
                  className="aspect-square h-auto w-full object-cover"
                  onError={() => setPortraitFailed(true)}
                />
              )}
            </TiltFrame>
          </div>
          <figcaption className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted">
            {profile.handle} on GitHub. The portrait is his profile photo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
