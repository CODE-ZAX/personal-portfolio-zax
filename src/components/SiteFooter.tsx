import { profile } from "../data/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name}
          <span aria-hidden="true"> · </span>
          {profile.location}
        </p>
        <p>{profile.company}</p>
      </div>
    </footer>
  );
}
