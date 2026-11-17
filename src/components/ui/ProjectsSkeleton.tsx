export function ProjectsSkeleton() {
  return (
    <section className="px-4 py-20 md:px-8" aria-hidden="true">
      <div className="mx-auto max-w-[1400px]">
        <div className="skeleton h-4 w-28 rounded-full" />
        <div className="skeleton mt-4 h-12 w-64 rounded-2xl" />
        <div className="mt-8 flex gap-5 overflow-hidden">
          <div className="skeleton h-80 w-[min(78vw,34rem)] shrink-0 rounded-[1.75rem]" />
          <div className="skeleton hidden h-80 w-[min(78vw,34rem)] shrink-0 rounded-[1.75rem] md:block" />
        </div>
      </div>
    </section>
  );
}
