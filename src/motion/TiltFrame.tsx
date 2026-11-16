import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMotionPrefs } from "./MotionProvider";

export function TiltFrame({ children, className }: { children: ReactNode; className?: string }) {
  const { allowPointerMotion } = useMotionPrefs();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 });

  if (!allowPointerMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - bounds.left) / bounds.width);
        py.set((event.clientY - bounds.top) / bounds.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
