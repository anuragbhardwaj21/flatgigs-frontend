import { Skeleton } from "@mui/material";

const WishlistCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-main/15 bg-white">
    <Skeleton
      animation="wave"
      variant="rectangular"
      className="aspect-5/3! w-full!"
    />
    <div className="flex flex-col gap-2 p-4">
      <Skeleton animation="wave" height={22} width="90%" />
      <Skeleton animation="wave" height={16} width="60%" />
      <div className="flex items-center justify-between gap-2 pt-1">
        <Skeleton animation="wave" height={18} width={80} />
        <Skeleton animation="wave" height={22} width={72} />
      </div>
      <Skeleton animation="wave" height={32} width="100%" />
    </div>
  </div>
);

const WishlistPageSkeleton = () => (
  <div
    className="main-container pb-16 pt-8"
    aria-busy="true"
    aria-label="Loading wishlist"
  >
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        <Skeleton animation="wave" variant="rounded" width={44} height={44} />
        <div className="space-y-2">
          <Skeleton animation="wave" width={100} height={14} />
          <Skeleton animation="wave" width={160} height={36} />
          <Skeleton animation="wave" width={120} height={18} />
        </div>
      </div>
      <Skeleton animation="wave" width={140} height={40} className="rounded-lg!" />
    </header>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <WishlistCardSkeleton key={`wishlist-card-skeleton-${i}`} />
      ))}
    </div>
  </div>
);

export default WishlistPageSkeleton;
