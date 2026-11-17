import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { profile } from "../../data/profile";
import { EmptyState } from "../ui/EmptyState";
import { ProjectsSkeleton } from "../ui/ProjectsSkeleton";
import { ProjectModal } from "../projects/ProjectModal";
import { ProjectStack } from "./ProjectStack";

const ProjectRail = lazy(() => import("./ProjectRail"));

function useRail() {
  const [rail, setRail] = useState(
    () => window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const width = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setRail(width.matches && !reduce.matches);
    width.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      width.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return rail;
}

export default function ProjectsSection() {
  const rail = useRail();
  const [open, setOpen] = useState<string | null>(null);
  const onClose = useCallback(() => setOpen(null), []);
  const openName = profile.projects.find((project) => project.repo === open)?.name;

  if (profile.projects.length === 0) {
    return (
      <section id="work" className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <EmptyState title="No projects listed" body="The profile file does not name a project yet." />
        </div>
      </section>
    );
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {openName ? `${openName} details are open.` : ""}
      </p>
      {rail ? (
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectRail onOpen={setOpen} />
        </Suspense>
      ) : (
        <ProjectStack onOpen={setOpen} />
      )}
      <ProjectModal openRepo={open} onClose={onClose} />
    </>
  );
}
