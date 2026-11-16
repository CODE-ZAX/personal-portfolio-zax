import { profile } from "../../data/profile";
import { Reveal } from "../../motion/Reveal";

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-12">
          <h2 className="font-display text-4xl tracking-tighter md:text-5xl lg:col-span-4">About</h2>
          <div className="grid gap-5 lg:col-span-8">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="max-w-[65ch] text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
