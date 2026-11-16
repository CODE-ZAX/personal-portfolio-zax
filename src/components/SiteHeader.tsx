import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import { Pause } from "@phosphor-icons/react/Pause";
import { Play } from "@phosphor-icons/react/Play";
import { profile } from "../data/profile";
import { MagneticLink } from "../motion/MagneticLink";
import { useMotionPrefs } from "../motion/MotionProvider";

const links = [
  { href: "#work", label: "Work" },
  { href: "#practice", label: "Practice" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const { reduced, paused, togglePaused } = useMotionPrefs();
  const PauseIcon = paused ? Play : Pause;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-3 px-4 py-3 md:grid-cols-[auto_1fr_auto] md:px-8">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-base text-ink">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="tactile inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-70"
            aria-pressed={paused}
            disabled={reduced}
            onClick={togglePaused}
          >
            <PauseIcon size={16} aria-hidden="true" />
            {reduced ? "Motion reduced" : paused ? "Play motion" : "Pause motion"}
          </button>
          <MagneticLink
            href="mailto:mianmuhammadfaraz@hotmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-display text-sm font-semibold text-surface"
          >
            <EnvelopeSimple size={16} aria-hidden="true" />
            Write to Faraz
          </MagneticLink>
        </div>
      </div>
    </header>
  );
}
