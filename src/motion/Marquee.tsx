import { memo } from "react";

const items = [
  "Next.js",
  "NestJS",
  "Electron",
  "Flutter",
  "Prisma",
  "OpenAI",
  "Qt 6",
  "TypeScript",
  "Python",
  "Stripe",
  "Supabase",
  "SQLite",
];

export const Marquee = memo(function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line py-4" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 pr-10">
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="font-display text-sm uppercase tracking-[0.22em] text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
});
