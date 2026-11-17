import { useState } from "react";
import { profile } from "../../data/profile";
import { SectionHeading } from "../../type/SectionHeading";

export function AboutSection() {
  const [portraitFailed, setPortraitFailed] = useState(false);
  return (
    <section id="about" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="topo pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="topo-drift" />
      </div>
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-12 md:grid-cols-12 md:items-start">
        <div className="hidden md:col-span-1 md:block" aria-hidden="true">
          <svg className="h-[32rem] w-full text-accent" viewBox="0 0 80 640" fill="none">
            <path
              className="draw-path"
              d="M40 8 C 72 90, 8 150, 40 230 S 74 340, 28 430 S 12 540, 46 632"
              stroke="currentColor"
              strokeWidth="1.5"
              pathLength="1"
            />
          </svg>
        </div>
        <div className="md:col-span-6">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">About</p>
          <SectionHeading className="mt-3 max-w-[14ch]">From architecture through the launch.</SectionHeading>
          <div className="mt-4 md:hidden" aria-hidden="true">
            <svg className="h-16 w-full text-accent" viewBox="0 0 320 64" fill="none">
              <path
                className="draw-path"
                d="M4 40 C 60 8, 110 58, 170 32 S 260 8, 316 36"
                stroke="currentColor"
                strokeWidth="1.5"
                pathLength="1"
              />
            </svg>
          </div>
          <div className="mt-6 space-y-5">
            {profile.about.map((paragraph) => (
              <p key={paragraph} className="max-w-[65ch] text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <blockquote className="mt-10 max-w-[28ch] border-l border-accent pl-5">
            <p className="font-display text-2xl tracking-tight text-ink md:text-3xl">{profile.quote}</p>
            <footer className="mt-4 text-sm text-muted">Muhammad Faraz</footer>
          </blockquote>
        </div>
        <figure className="md:col-span-4 md:col-start-9 md:mt-24">
          {portraitFailed ? (
            <div className="grid aspect-square place-items-center rounded-[1.75rem] bg-raised font-display text-5xl text-accent-text">MF</div>
          ) : (
            <img
              src={profile.portrait.src}
              srcSet={profile.portrait.srcSet}
              sizes="(max-width: 767px) 72vw, 280px"
              width={profile.portrait.width}
              height={profile.portrait.height}
              alt={profile.portrait.alt}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full rounded-[1.75rem] object-cover"
              onError={() => setPortraitFailed(true)}
            />
          )}
          <figcaption className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted">
            {profile.handle} on GitHub. The portrait is his profile photo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
