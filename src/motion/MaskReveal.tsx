import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionPrefs } from "./MotionProvider";

export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reduced } = useMotionPrefs();
  if (reduced) {
    return <span className={className}>{children}</span>;
  }
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.35 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}
