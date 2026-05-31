import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import cn from "@/utils/cn";
import ListsView from "@/views/search-results/main-content/lists-view";
import Spinner from "@/components/atoms/spinner";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lazy, Suspense } from "react";

const MapView = lazy(
  () => import("@/views/search-results/main-content/map-view"),
);

const PULSE_DURATION = 2.4;

const MapViewFallback = () => (
  <div className="flex h-[calc(100dvh-220px)] min-h-[420px] items-center justify-center rounded-[1.25rem] bg-black/5 ring-1 ring-black/8">
    <Spinner />
  </div>
);

type SearchLoadingOverlayProps = {
  show: boolean;
  mapLayout?: boolean;
};

const overlayPositionClass = (mapLayout?: boolean) =>
  cn(
    "pointer-events-none z-50",
    mapLayout
      ? "max-lg:fixed max-lg:inset-x-0 max-lg:top-[220px] max-lg:bottom-0 lg:absolute lg:inset-0"
      : "absolute inset-0",
  );

const SearchLoadingOverlay = ({ show, mapLayout }: SearchLoadingOverlayProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="search-main-overlay"
          role="status"
          aria-live="polite"
          aria-label="Updating results"
          className={overlayPositionClass(mapLayout)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="size-full bg-white"
            initial={false}
            animate={
              reduceMotion ? { opacity: 0.12 } : { opacity: [0.1, 0.15, 0.1] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: PULSE_DURATION,
                    ease: "easeInOut",
                    repeat: Infinity,
                    times: [0, 0.5, 1],
                  }
            }
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const listPanelClass = (mapExpanded: boolean, mobileListOpen: boolean) =>
  cn(
    "min-h-0 shrink-0 overflow-hidden transition-[width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:rounded-t-2xl max-lg:bg-background-paper max-lg:shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
    mobileListOpen
      ? "max-lg:top-[38%] max-lg:block max-lg:w-full"
      : "max-lg:pointer-events-none max-lg:hidden max-lg:w-full",
    mapExpanded
      ? "lg:w-0 lg:min-w-0 lg:opacity-0 lg:pointer-events-none"
      : "lg:w-1/2 lg:opacity-100 lg:overflow-y-auto lg:pr-1",
  );

const mapPanelClass = (mapExpanded: boolean) =>
  cn(
    "transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    mapExpanded ? "lg:w-full" : "lg:w-1/2 lg:shrink-0 lg:sticky lg:top-24 lg:self-start",
    "max-lg:fixed max-lg:inset-x-0 max-lg:top-[220px] max-lg:z-20 max-lg:h-[calc(100dvh-220px)] max-lg:rounded-none max-lg:ring-0 max-lg:w-full",
  );

const MainContent = () => {
  const { viewType, isSearching, isLoadingMore, searchData } = useSearch();
  const { mapExpanded, mobileListOpen } = useMapResults();

  const showLoadingOverlay =
    isSearching && !isLoadingMore && searchData != null;

  if (viewType === "list") {
    return (
      <div className="relative flex min-h-0 flex-1">
        <ListsView />
        <SearchLoadingOverlay show={showLoadingOverlay} />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-4">
      <div className={listPanelClass(mapExpanded, mobileListOpen)}>
        <ListsView variant="split" />
      </div>

      <Suspense fallback={<MapViewFallback />}>
        <MapView
          className={cn(
            "relative min-h-[420px] overflow-hidden rounded-[1.25rem] ring-1 ring-black/8",
            "h-[calc(100dvh-220px)] lg:min-h-[520px]",
            mapPanelClass(mapExpanded),
          )}
        />
      </Suspense>

      <SearchLoadingOverlay show={showLoadingOverlay} mapLayout />
    </div>
  );
};

export default MainContent;
