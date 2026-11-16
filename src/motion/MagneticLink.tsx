import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionPrefs } from "./MotionProvider";

type MagneticLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  external?: boolean;
};

export function MagneticLink({ href, className, children, external = false }: MagneticLinkProps) {
  const { allowPointerMotion } = useMotionPrefs();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const externalProps = external
    ? { target: "_blank" as const, rel: "noreferrer" }
    : {};

  if (!allowPointerMotion) {
    return (
      <a href={href} className={`${className ?? ""} tactile`} {...externalProps}>
        {children}
      </a>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        const dx = event.clientX - (bounds.left + bounds.width / 2);
        const dy = event.clientY - (bounds.top + bounds.height / 2);
        x.set(dx * 0.25);
        y.set(dy * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...externalProps}
    >
      {children}
    </motion.a>
  );
}
