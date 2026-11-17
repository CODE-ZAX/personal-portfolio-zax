import { MagneticLink } from "../../motion/MagneticLink";
import { useMotionPrefs } from "../../motion/MotionProvider";

const links = [
  { href: "#work", label: "Work" },
  { href: "#practice", label: "Practice" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function GlassDock() {
  const { reduced, paused, togglePause } = useMotionPrefs();
  const label = reduced ? "Motion off" : paused ? "Play" : "Pause";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex w-full max-w-[1400px] items-center gap-1 rounded-full border border-white/10 bg-[#1c1a17]/75 px-1.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:w-max"
      >
        <a href="#top" className="tactile shrink-0 rounded-full px-2 py-2 font-display text-[13px] tracking-tight text-ink md:px-2.5 md:text-sm">
          Faraz
        </a>
        <div className="dock-scroll flex min-w-0 flex-1 items-center overflow-x-auto md:flex-none">
          {links.map((link) => (
            <MagneticLink
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-2 py-2 font-display text-[13px] text-muted hover:text-ink md:px-2.5 md:text-sm"
            >
              {link.label}
            </MagneticLink>
          ))}
        </div>
        <button
          type="button"
          className="tactile shrink-0 rounded-full border border-white/15 px-2.5 py-2 font-display text-[13px] text-ink md:px-3 md:text-sm"
          aria-pressed={paused}
          disabled={reduced}
          onClick={togglePause}
          aria-label={reduced ? "Motion is off because the system asked for less motion" : `${label} auto-playing motion`}
        >
          {label}
        </button>
      </nav>
    </header>
  );
}
