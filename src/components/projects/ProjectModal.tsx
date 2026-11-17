import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { profile, type Project } from "../../data/profile";
import { loopForRepo, projectPictureFor } from "../../data/media";
import { slug } from "../../lib/slug";
import { getLenis } from "../../motion/lenisBridge";
import { sceneKindForRepo, useSceneView } from "../../three/bridge";
import { SectionHeading } from "../../type/SectionHeading";
import { LoopVideo } from "../media/LoopVideo";
import { Picture } from "../media/Picture";

export function ProjectModal({ openRepo, onClose }: { openRepo: string | null; onClose: () => void }) {
  const project = profile.projects.find((item) => item.repo === openRepo) ?? null;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const page = document.getElementById("page");
    const previously = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    page?.setAttribute("inert", "");
    const lenis = getLenis();
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-close]")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      page?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previously?.focus();
    };
  }, [project, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project ? <Dialog key={project.repo} project={project} dialogRef={dialogRef} onClose={onClose} /> : null}
    </AnimatePresence>,
    document.body,
  );
}

function Dialog({
  project,
  dialogRef,
  onClose,
}: {
  project: Project;
  dialogRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const image = projectPictureFor(project.repo);
  const SceneView = useSceneView();
  const kind = sceneKindForRepo(project.repo);
  const loop = loopForRepo(project.repo);
  const titleId = `title-${slug(project.repo)}`;
  const links = [
    { label: "Open the repository", url: project.url },
    ...(project.homepage ? [project.homepage] : []),
    ...(project.extraLinks ?? []),
  ];

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close project details"
        className="fixed inset-0 z-[60] bg-[#141311]/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        layoutId={`work-${slug(project.repo)}`}
        className="fixed inset-4 z-[70] flex flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_30px_80px_rgba(20,19,17,0.45)] md:inset-y-10 md:left-[16vw] md:right-[16vw]"
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="relative">
          {image ? (
            <Picture image={image} className="h-[34vh] w-full object-cover" />
          ) : null}
          {loop ? <LoopVideo loop={loop} className="absolute inset-0 h-full w-full object-cover" /> : null}
          {SceneView && kind ? <SceneView kind={kind} className="pointer-events-none absolute inset-0" /> : null}
          <button
            type="button"
            data-close
            className="tactile absolute right-4 top-4 z-30 rounded-full border border-white/20 bg-[#1c1a17]/80 px-4 py-2 font-display text-sm text-ink backdrop-blur"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-accent-text">
            {project.surface}
            <span aria-hidden="true"> · </span>
            {project.visibility}
          </p>
          <SectionHeading as="h2" id={titleId} travel="none" className="mt-3 max-w-[14ch] text-ink">
            {project.name}
          </SectionHeading>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted">{project.summary}</p>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-ink">{project.detail}</p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.16em] text-muted">Stack</p>
          <p className="mt-2 max-w-[65ch] leading-relaxed text-ink">{project.stack}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="text-link font-display text-base" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </>
  );
}
