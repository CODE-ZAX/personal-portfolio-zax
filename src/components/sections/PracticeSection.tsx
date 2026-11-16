import { profile } from "../../data/profile";
import { Reveal } from "../../motion/Reveal";
import { Stagger } from "../../motion/Stagger";

export function PracticeSection() {
  return (
    <section id="practice" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display text-4xl tracking-tighter md:text-5xl">Practice</h2>
          <p className="mt-4 max-w-[36ch] leading-relaxed text-muted">{profile.skillsIntro}</p>
        </Reveal>
        <Stagger className="border-t border-line lg:col-span-8">
          {profile.skills.map((group) => (
            <div key={group.label} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[11rem_1fr]">
              <h3 className="font-display text-lg tracking-tight">{group.label}</h3>
              <p className="max-w-[65ch] leading-relaxed text-muted">{group.detail}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
