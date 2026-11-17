export function Meter({ label, value }: { label: string; value: number | null }) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-sm text-muted">{label}</p>
        <p className="font-display text-sm text-ink">{value === null ? "Unavailable" : `${pct.toFixed(0)}%`}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}

export function Spark({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const d = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 28 - (Math.max(0, Math.min(100, point)) / 100) * 26;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="mt-4 h-16 w-full" role="img" aria-label="Recent processor samples">
      <path d={d} fill="none" stroke="#c9844a" strokeWidth="1.4" />
    </svg>
  );
}
