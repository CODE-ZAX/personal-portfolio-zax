import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMotionPrefs } from "./MotionProvider";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  external?: boolean;
};

export function MagneticLink({ href, className, children, external = false }: Props) {
  const { reduced, fine } = useMotionPrefs();
  if (reduced || !fine) {
    return (
      <a href={href} className={`tactile ${className ?? ""}`} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <MagneticAnchor href={href} className={className} external={external}>
      {children}
    </MagneticAnchor>
  );
}

function MagneticAnchor({ href, className, children, external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.98 }}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onMouseMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        x.set(dx * 0.28);
        y.set(dy * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}
