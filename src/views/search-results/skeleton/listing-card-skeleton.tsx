import { Skeleton } from "@mui/material";

export const LISTING_SKELETON_COUNT = 6;

const ListingCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-main/15 bg-background-paper sm:flex-row sm:items-stretch">
    <div className="relative aspect-5/3 w-full shrink-0 sm:aspect-auto sm:min-h-48 sm:w-56 md:w-64 lg:w-72">
      <Skeleton
        variant="rectangular"
        animation="wave"
        className="absolute! inset-0! size-full!"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4 md:p-5">
      <Skeleton variant="rounded" width="35%" height={22} animation="wave" />
      <Skeleton variant="text" width="85%" animation="wave" />
      <Skeleton variant="text" width="60%" animation="wave" />
      <Skeleton variant="rounded" width="70%" height={28} animation="wave" />
      <div className="mt-auto flex justify-end gap-2 border-t border-main/10 pt-3">
        <Skeleton variant="text" width={120} height={32} animation="wave" />
      </div>
    </div>
  </div>
);

export default ListingCardSkeleton;
