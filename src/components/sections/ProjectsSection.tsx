import { useId, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { AnimatePresence, motion } from "motion/react";
import { profile, type Project } from "../../data/profile";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { Reveal } from "../../motion/Reveal";
import { EmptyState } from "../ui/EmptyState";

export default function ProjectsSection() {
  const [openRepo, setOpenRepo] = useState<string | null>(null);

  return (
    <section id="work" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display text-4xl tracking-tighter md:text-5xl">Work</h2>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-muted">
            Open a project for the longer note. Private repositories are labeled. GitHub asks you to
            sign in before those pages will open.
          </p>
        </Reveal>
        {profile.projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Add repositories in src/data/profile.ts and they will show up here."
          />
        ) : (
          <div className="mt-10 border-t border-line">
            {profile.projects.map((project) => (
              <ProjectRow
                key={project.repo}
                project={project}
                open={openRepo === project.repo}
                onToggle={() =>
                  setOpenRepo((current) => (current === project.repo ? null : project.repo))
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  const { reduced } = useMotionPrefs();
  const panelId = useId();
  const repoLabel =
    project.visibility === "private" ? "Open the private repository" : "Open the repository";

  return (
    <article className="border-b border-line py-6">
      <h3 className="font-display text-2xl tracking-tight md:text-3xl">
        <button
          type="button"
          className="tactile grid w-full gap-3 text-left md:grid-cols-12 md:items-start"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="text-base text-accent md:col-span-3">{project.surface}</span>
          <span className="md:col-span-8">
            <span className="block">{project.name}</span>
            <span className="mt-2 block max-w-[65ch] text-base font-sans font-normal leading-relaxed text-muted">
              {project.summary}
            </span>
          </span>
          <CaretDown
            size={20}
            aria-hidden="true"
            className={`mt-1 justify-self-end text-ink transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-live="polite"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 150, damping: 24 }
            }
            className="overflow-hidden md:pl-[25%]"
          >
            <div className="grid gap-4 pt-4">
              <p className="max-w-[65ch] leading-relaxed">{project.detail}</p>
              <p className="max-w-[65ch] leading-relaxed text-muted">{project.stack}</p>
              <p className="flex flex-wrap gap-x-6 gap-y-2">
                <a className="text-link" href={project.url} target="_blank" rel="noreferrer">
                  {repoLabel}
                </a>
                {project.homepage ? (
                  <a className="text-link" href={project.homepage.url} target="_blank" rel="noreferrer">
                    {project.homepage.label}
                  </a>
                ) : null}
                {project.extraLinks?.map((link) => (
                  <a key={link.url} className="text-link" href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
