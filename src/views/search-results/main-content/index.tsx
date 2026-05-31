import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import cn from "@/utils/cn";
import ListsView from "@/views/search-results/main-content/lists-view";
import Spinner from "@/components/atoms/spinner";
import { lazy, Suspense } from "react";

const MapView = lazy(
  () => import("@/views/search-results/main-content/map-view"),
);

const MapViewFallback = () => (
  <div className="flex h-[calc(100dvh-220px)] min-h-[420px] items-center justify-center rounded-[1.25rem] bg-black/5 ring-1 ring-black/8">
    <Spinner />
  </div>
);

const MainContent = () => {
  const { viewType } = useSearch();
  const { mapExpanded, mobileListOpen } = useMapResults();

  if (viewType === "list") {
    return (
      <div className="flex min-h-0 flex-1">
        <ListsView />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-4">
      {!mapExpanded && (
        <div
          className={cn(
            "min-h-0 shrink-0 overflow-hidden",
            "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:rounded-t-2xl max-lg:bg-background-paper max-lg:shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
            mobileListOpen
              ? "max-lg:top-[38%] max-lg:block"
              : "max-lg:pointer-events-none max-lg:hidden",
            "lg:block lg:w-[42%] lg:overflow-y-auto lg:pr-1",
          )}
        >
          <ListsView variant="split" />
        </div>
      )}

      <Suspense fallback={<MapViewFallback />}>
        <MapView
          className={cn(
            mapExpanded ? "w-full" : "lg:w-[58%] lg:shrink-0 lg:sticky lg:top-24 lg:self-start",
            "max-lg:fixed max-lg:inset-x-0 max-lg:top-[220px] max-lg:z-20 max-lg:h-[calc(100dvh-220px)] max-lg:rounded-none max-lg:ring-0",
          )}
        />
      </Suspense>
    </div>
  );
};

export default MainContent;
