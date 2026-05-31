import { Skeleton } from "@mui/material";

const CompareColumnSkeleton = () => (
  <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-main/15 bg-white">
    <Skeleton
      animation="wave"
      variant="rectangular"
      className="aspect-4/3! w-full!"
    />
    <div className="flex flex-col gap-3 p-4">
      <Skeleton animation="wave" height={22} width="85%" />
      <Skeleton animation="wave" height={28} width="55%" />
      <Skeleton animation="wave" height={18} width="70%" />
      <div className="flex flex-wrap gap-1.5 pt-1">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton
            key={`compare-chip-skeleton-${i}`}
            animation="wave"
            width={64}
            height={22}
            className="rounded-md!"
          />
        ))}
      </div>
      <div className="mt-auto space-y-2 border-t border-black/6 pt-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={`compare-aspect-skeleton-${i}`}
            animation="wave"
            height={20}
            className="w-full!"
          />
        ))}
      </div>
    </div>
  </div>
);

const ComparePageSkeleton = () => (
  <div
    className="main-container pb-20 pt-8"
    aria-busy="true"
    aria-label="Loading compare"
  >
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton animation="wave" width={120} height={14} />
        <Skeleton animation="wave" width={220} height={36} />
        <Skeleton animation="wave" width={160} height={18} />
      </div>
      <Skeleton animation="wave" width={100} height={40} className="rounded-xl!" />
    </div>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <CompareColumnSkeleton />
      <CompareColumnSkeleton />
      <CompareColumnSkeleton />
    </div>

    <Skeleton
      animation="wave"
      className="mt-10! h-28! w-full! rounded-2xl!"
    />
  </div>
);

export default ComparePageSkeleton;
