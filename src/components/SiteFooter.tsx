import { profile } from "../data/profile";

export function SiteFooter() {
  return (
    <footer className="px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-6 border-t border-line pt-8 lg:grid-cols-12">
        <blockquote className="max-w-[46ch] font-display text-xl leading-snug tracking-tight lg:col-span-8">
          {profile.quote}
        </blockquote>
        <p className="text-sm leading-relaxed text-muted lg:col-span-4 lg:text-right">
          {profile.name}
          <br />
          {profile.handle}
        </p>
      </div>
    </footer>
  );
}
