export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-y border-line py-10">
      <h3 className="font-display text-2xl tracking-tight">{title}</h3>
      <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
