export function ProjectsSkeleton() {
  return (
    <section className="px-4 py-16 md:px-8" aria-busy="true" aria-live="polite" aria-label="Loading work">
      <div className="mx-auto grid max-w-[1400px] gap-4">
        <div className="skeleton h-10 w-40 rounded-md" />
        <div className="skeleton h-24 w-full rounded-md" />
        <div className="skeleton h-24 w-full rounded-md" />
        <div className="skeleton h-24 w-full rounded-md" />
      </div>
    </section>
  );
}
