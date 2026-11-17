import { useProfile, useSection } from "../../data/content";
import { projectPictureFor } from "../../data/media";
import { slug } from "../../lib/slug";
import { EmptyState } from "../ui/EmptyState";
import { ProjectCard } from "../projects/ProjectCard";
import { SectionHeading } from "../../type/SectionHeading";

export function ProjectStack({ onOpen }: { onOpen: (repo: string) => void }) {
  const profile = useProfile();
  const section = useSection("work");
  return (
    <section id="work" className="relative px-4 py-20 md:px-8" aria-label="Selected work">
      <div className="topo pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="topo-drift" />
      </div>
      <div className="relative mx-auto w-full max-w-[1400px]">
        <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Selected work</p>
        <SectionHeading travel="work" className="mt-2 max-w-[12ch]">
          {section?.heading || "The products he ships."}
        </SectionHeading>
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted">
          Each summary is taken from the repository README. Open a card for the longer note.
        </p>
        {profile.projects.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No projects listed" body="The profile file does not name a project yet." />
          </div>
        ) : (
          <ul className="mt-10 flex flex-col gap-6">
            {profile.projects.map((project) => {
              const image = projectPictureFor(project.repo);
              if (!image) return null;
              return (
                <li key={project.repo}>
                  <ProjectCard
                    project={project}
                    image={image}
                    layoutId={`work-${slug(project.repo)}`}
                    className="w-full"
                    onOpen={() => onOpen(project.repo)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
