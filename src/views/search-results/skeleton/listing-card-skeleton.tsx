import { Skeleton } from "@mui/material";

export const LISTING_SKELETON_COUNT = 6;

const chipSkeletonWidths = [56, 68, 48, 60];

const ListingCardSkeleton = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-main/15 bg-background-paper sm:flex-row sm:items-stretch">
    <div className="relative aspect-5/3 w-full shrink-0 sm:aspect-auto sm:min-h-48 sm:w-56 md:w-64 lg:w-72">
      <Skeleton
        variant="rectangular"
        animation="wave"
        className="absolute! inset-0! size-full!"
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width={72}
        height={24}
        className="absolute! left-3! top-3! rounded-full!"
      />
      <Skeleton
        variant="circular"
        animation="wave"
        width={32}
        height={32}
        className="absolute! right-2! top-2!"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 p-3 sm:gap-3 sm:p-4 md:p-5">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton variant="rounded" width={80} height={22} animation="wave" />
          <Skeleton variant="text" width={96} height={18} animation="wave" />
        </div>
        <Skeleton variant="text" width="78%" height={28} animation="wave" />
        <Skeleton variant="text" width={132} height={20} animation="wave" />
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {chipSkeletonWidths.map((width) => (
            <Skeleton
              key={width}
              variant="rounded"
              animation="wave"
              width={width}
              height={24}
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-main/10 pt-2.5 sm:gap-3 sm:pt-3">
        <Skeleton variant="text" width={108} height={16} animation="wave" />
        <div className="flex flex-col items-end gap-1">
          <Skeleton variant="text" width={88} height={28} animation="wave" />
          <Skeleton variant="text" width={72} height={16} animation="wave" />
        </div>
      </div>
    </div>
  </div>
);

export const ListsViewSkeleton = () => (
  <div
    className="flex w-full min-w-0 flex-col gap-4"
    aria-busy="true"
    aria-label="Loading listings"
  >
    {Array.from({ length: LISTING_SKELETON_COUNT }, (_, index) => (
      <ListingCardSkeleton key={index} />
    ))}
  </div>
);

export default ListingCardSkeleton;
