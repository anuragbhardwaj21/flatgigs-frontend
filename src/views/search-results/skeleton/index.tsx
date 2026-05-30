import { Divider, Skeleton } from "@mui/material";
import { ListsViewSkeleton } from "./listing-card-skeleton";
import { FiltersSkeleton } from "@/views/search-results/query-detail-section/filters-section";

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

const MainContentSkeleton = () => (
  <div className="flex min-h-0 flex-1 gap-4 rounded-2xl border border-main/20 bg-white p-4 shadow-lg">
    <div className="min-w-0 flex-1">
      <ListsViewSkeleton />
    </div>
    <div className="min-h-[480px] w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-main/20">
      <Skeleton
        variant="rectangular"
        animation="wave"
        className="size-full min-h-[480px]!"
      />
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
      <div className="main-container flex flex-col gap-4">
        <QueryHeaderSkeleton />
        <AiBarSkeleton />
        <div className="w-full border-t border-dashed border-black/15 pt-4">
          <FiltersSkeleton />
        </div>
      </div>
    </div>

    <div className="main-container pb-4">
      <MainContentSkeleton />
    </div>
  </div>
);

export default SearchResultsSkeleton;
