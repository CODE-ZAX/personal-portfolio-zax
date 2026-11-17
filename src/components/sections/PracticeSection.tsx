import { motion } from "motion/react";
import { profile } from "../../data/profile";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { SectionHeading } from "../../type/SectionHeading";

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
};

export function PracticeSection() {
  const { reduced } = useMotionPrefs();
  return (
    <section id="practice" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="topo pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="topo-drift" />
      </div>
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Practice</p>
          <SectionHeading className="mt-3 max-w-[12ch]">The published stack.</SectionHeading>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-muted">{profile.skillsIntro}</p>
        </div>
        <motion.ol
          className="divide-y divide-line border-y border-line md:col-span-7 md:col-start-6"
          variants={reduced ? undefined : list}
          initial={reduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {profile.skills.map((skill, index) => (
            <motion.li key={skill.label} className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:gap-6" variants={reduced ? undefined : row}>
              <span className="font-display text-sm text-accent-text">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-display text-xl tracking-tight text-ink">{skill.label}</span>
                <span className="mt-2 block max-w-[65ch] text-base leading-relaxed text-muted">{skill.detail}</span>
              </span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
