import { Divider, Skeleton } from "@mui/material";
import ListingCardSkeleton, {
  LISTING_SKELETON_COUNT,
} from "./listing-card-skeleton";

const pillClass = "rounded-full!";

const PillSkeleton = ({
  width,
  height = 40,
}: {
  width: number | string;
  height?: number;
}) => (
  <Skeleton
    variant="rounded"
    animation="wave"
    width={width}
    height={height}
    className={pillClass}
  />
);

const QueryHeaderSkeleton = () => (
  <div className="flex w-full flex-col gap-4 py-2 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex gap-2">
        <PillSkeleton width={88} />
        <PillSkeleton width={72} />
      </div>
      <Divider
        orientation="vertical"
        flexItem
        className="hidden! sm:block! mx-2! h-8! self-center! opacity-40!"
      />
      <div className="flex flex-col gap-1.5">
        <Skeleton variant="text" width={220} height={22} animation="wave" />
        <Skeleton variant="text" width={180} height={18} animation="wave" />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <PillSkeleton width={220} height={40} />
      <PillSkeleton width={200} height={40} />
    </div>
  </div>
);

const AiBarSkeleton = () => (
  <div className="flex h-12 w-full items-center gap-2 rounded-2xl border-2 border-main/10 bg-background-paper px-2 py-1">
    <Skeleton variant="circular" width={32} height={32} animation="wave" />
    <Skeleton
      variant="rounded"
      animation="wave"
      height={20}
      className="min-w-0 flex-1 rounded-lg!"
    />
    <Skeleton variant="rounded" width={36} height={36} animation="wave" />
  </div>
);

const FilterChipRowSkeleton = ({ chips }: { chips: number[] }) => (
  <div className="flex flex-col gap-2">
    <Skeleton variant="text" width="45%" height={20} animation="wave" />
    <div className="flex flex-wrap gap-2">
      {chips.map((width, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          animation="wave"
          width={width}
          height={28}
          className={pillClass}
        />
      ))}
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <aside className="flex w-60 shrink-0 flex-col gap-4 rounded-2xl border border-main/20 bg-white p-4 shadow-lg">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width={56} height={22} animation="wave" />
      <Skeleton variant="text" width={64} height={20} animation="wave" />
    </div>

    <div className="flex flex-col gap-1">
      <Skeleton variant="text" width="70%" height={20} animation="wave" />
      <Skeleton variant="text" width={100} height={16} animation="wave" />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={6}
        className="mt-2 rounded-full!"
      />
    </div>

    <Divider className="opacity-40! -my-1!" />
    <FilterChipRowSkeleton chips={[56, 48, 52, 44]} />

    <Divider className="opacity-40! -my-1!" />
    <FilterChipRowSkeleton chips={[72, 64, 80, 68, 56]} />

    <Divider className="opacity-40! -my-1!" />
    <FilterChipRowSkeleton chips={[52, 60, 48, 72, 56, 44]} />
  </aside>
);

const MainContentSkeleton = () => (
  <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-main/20 bg-white p-4 shadow-lg">
    <Skeleton variant="text" width={140} height={24} animation="wave" />
    <div className="flex flex-col gap-4">
      {Array.from({ length: LISTING_SKELETON_COUNT }, (_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

const SearchResultsSkeleton = () => (
  <div
    className="flex flex-col gap-4"
    aria-busy="true"
    aria-label="Loading search results"
  >
    <div className="border-b border-dashed border-black/20 bg-background p-4 shadow-md">
      <div className="main-container flex flex-col items-center justify-center gap-4">
        <QueryHeaderSkeleton />
        <AiBarSkeleton />
      </div>
    </div>

    <div className="main-container flex flex-col gap-4 pb-4 lg:flex-row">
      <FiltersSkeleton />
      <MainContentSkeleton />
    </div>
  </div>
);

export default SearchResultsSkeleton;
