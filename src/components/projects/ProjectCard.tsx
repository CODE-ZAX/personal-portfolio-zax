import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { FocusEvent } from "react";
import type { Project } from "../../data/profile";
import type { Picture as PictureSource } from "../../data/media";
import { useMotionPrefs } from "../../motion/MotionProvider";
import { Picture } from "../media/Picture";

type Props = {
  project: Project;
  image: PictureSource;
  layoutId: string;
  onOpen: () => void;
  onReveal?: (node: HTMLElement) => void;
  className?: string;
};

export function ProjectCard({ project, image, layoutId, onOpen, onReveal, className }: Props) {
  const { reduced, fine } = useMotionPrefs();
  const tilt = fine && !reduced;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], tilt ? [7, -7] : [0, 0]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], tilt ? [-8, 8] : [0, 0]), { stiffness: 180, damping: 18 });

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      className={`group relative rounded-[1.75rem] p-px text-left [--mx:50%] [--my:40%] ${className ?? ""}`}
      whileTap={{ scale: 0.98 }}
      aria-haspopup="dialog"
      aria-label={`${project.name}. ${project.summary}`}
      onClick={onOpen}
      onFocus={(event: FocusEvent<HTMLButtonElement>) => onReveal?.(event.currentTarget)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        px.set(x);
        py.set(y);
        event.currentTarget.style.setProperty("--mx", `${x * 100}%`);
        event.currentTarget.style.setProperty("--my", `${y * 100}%`);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <motion.span className="block h-full" style={{ rotateX, rotateY, transformPerspective: 900 }}>
      <span className="spotlight-ring pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-raised">
        <Picture image={image} className="aspect-[4/3] w-full object-cover" />
        <span className="flex flex-1 flex-col px-5 py-4">
          <span className="font-display text-xs uppercase tracking-[0.16em] text-accent-text">
            {project.surface}
            <span aria-hidden="true"> · </span>
            {project.visibility}
          </span>
          <span className="mt-2 block font-display text-2xl tracking-tight text-ink">{project.name}</span>
          <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</span>
        </span>
      </span>
      </motion.span>
    </motion.button>
  );
}
