import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionPrefs } from "./MotionProvider";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { reduced } = useMotionPrefs();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
