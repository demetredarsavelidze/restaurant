export const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="h-48 animate-pulse bg-neutral-200" />
    <div className="space-y-4 p-5">
      <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
    </div>
  </div>
);
