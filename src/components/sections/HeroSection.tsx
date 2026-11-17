import { useProfile } from "../../data/content";
import { LiveDot } from "../../motion/LiveDot";
import { MagneticLink } from "../../motion/MagneticLink";
import { MaskReveal } from "../../motion/MaskReveal";
import { ScrambleText } from "../../motion/ScrambleText";
import { HeroVisual } from "../hero/HeroVisual";
import { SectionHeading } from "../../type/SectionHeading";

export function HeroSection() {
  const profile = useProfile();
  return (
    <section id="top" className="relative min-h-[100dvh] px-4 pb-8 pt-28 md:px-8 md:pb-10">
      <div className="mx-auto grid w-full max-w-[1400px] items-end gap-8 md:min-h-[calc(100dvh-8rem)] md:grid-cols-12 md:items-center md:gap-6">
        <div className="relative z-10 md:col-span-5 md:pb-6">
          <p className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.18em] text-accent-text">
            <LiveDot />
            <ScrambleText text={profile.handle} />
          </p>
          <p className="mt-4 text-sm text-muted">
            {profile.location}
            <span aria-hidden="true"> · </span>
            {profile.company}
          </p>
          <SectionHeading as="h1" travel="hero" className="mt-6 max-w-[12ch] text-ink">
            {profile.name}
          </SectionHeading>
          <p className="mt-4 max-w-[18ch] font-display text-2xl tracking-tight text-ink md:text-3xl">
            <MaskReveal delay={0.12}>{profile.headline}</MaskReveal>
          </p>
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted">{profile.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticLink
              href="#work"
              className="inline-flex items-center rounded-full bg-accent px-5 py-3 font-display text-base font-semibold text-accent-ink"
            >
              See the selected work
            </MagneticLink>
            <MagneticLink
              href="https://github.com/CODE-ZAX"
              external
              className="inline-flex items-center rounded-full border border-line px-5 py-3 font-display text-base text-ink"
            >
              Open GitHub
            </MagneticLink>
          </div>
        </div>
        <div className="relative min-h-[52dvh] md:col-span-7 md:-mr-8 md:min-h-[78dvh]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
