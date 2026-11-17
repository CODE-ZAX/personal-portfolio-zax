import { profile } from "../../data/profile";
import { MagneticLink } from "../../motion/MagneticLink";

export function ContactSection() {
  const primary = profile.contact.find((item) => item.href.startsWith("mailto:"));
  const rest = profile.contact.filter((item) => item !== primary);

  return (
    <section id="contact" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="topo pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-accent-text">Contact</p>
          <h2 className="mt-3 max-w-[10ch] font-display text-4xl tracking-tighter md:text-6xl">Write to Faraz.</h2>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-muted">{profile.contactIntro}</p>
          {primary ? (
            <MagneticLink
              href={primary.href}
              className="mt-8 inline-flex max-w-full items-center rounded-full bg-accent px-5 py-3 font-display text-base font-semibold text-accent-ink md:text-lg"
            >
              {primary.label === "Write to Faraz" ? "mianmuhammadfaraz@hotmail.com" : primary.label}
            </MagneticLink>
          ) : null}
        </div>
        <ul className="divide-y divide-line border-y border-line md:col-span-4 md:col-start-9">
          {rest.map((item) => (
            <li key={item.label}>
              <MagneticLink
                href={item.href}
                external={item.external}
                className="flex w-full items-center justify-between gap-4 py-4 font-display text-base text-ink"
              >
                <span>{item.label}</span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-accent-text">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </MagneticLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
