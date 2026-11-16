import { GithubLogo } from "@phosphor-icons/react/GithubLogo";
import { GlobeSimple } from "@phosphor-icons/react/GlobeSimple";
import { LinkedinLogo } from "@phosphor-icons/react/LinkedinLogo";
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import { profile } from "../../data/profile";
import { MagneticLink } from "../../motion/MagneticLink";
import { Reveal } from "../../motion/Reveal";

const icons: Record<string, typeof EnvelopeSimple> = {
  "mailto:mianmuhammadfaraz@hotmail.com": EnvelopeSimple,
  "https://github.com/CODE-ZAX": GithubLogo,
  "https://www.linkedin.com/in/mian-muhammad-faraz-93584521a/": LinkedinLogo,
  "https://sirzaxx.com": GlobeSimple,
  "https://sirzaxx.info": GlobeSimple,
};

export function ContactSection() {
  const primary = profile.contact[0];
  const rest = profile.contact.slice(1);
  if (!primary) {
    return null;
  }

  return (
    <section id="contact" className="px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl tracking-tighter md:text-5xl">Contact</h2>
            <p className="mt-4 max-w-[36ch] leading-relaxed text-muted">{profile.contactIntro}</p>
            <MagneticLink
              href={primary.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-display text-base font-semibold text-surface"
            >
              <EnvelopeSimple size={18} aria-hidden="true" />
              {primary.label}
            </MagneticLink>
          </div>
          <ul className="border-t border-line lg:col-span-7">
            {rest.map((item) => {
              const Icon = icons[item.href] ?? GlobeSimple;
              return (
                <li key={item.href + item.label} className="border-b border-line">
                  <a
                    href={item.href}
                    className="flex items-center gap-3 py-4 text-lg"
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <Icon size={20} aria-hidden="true" className="text-accent" />
                    <span className="text-link">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
