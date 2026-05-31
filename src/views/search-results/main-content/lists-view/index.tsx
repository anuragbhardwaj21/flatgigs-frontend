import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import cn from "@/utils/cn";
import ListingCard from "@/views/search-results/main-content/lists-view/listing-card";
import { ListsViewSkeleton } from "@/views/search-results/skeleton/listing-card-skeleton";
import { Button } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const viewTransition = { duration: 0.45, ease: easeOut };

const viewMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: viewTransition,
};

const listStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const listItemStagger = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
};

type ListsViewProps = {
  variant?: "full" | "split";
};

const ListsView = ({ variant = "full" }: ListsViewProps) => {
  const {
    searchData,
    isSearching,
    hasMoreResults,
    isLoadingMore,
    loadMoreResults,
  } = useSearch();
  const { hoveredListingId, setHoveredListingId } = useMapResults();
  const listRef = useRef<HTMLUListElement>(null);
  const items = searchData?.items ?? [];
  const isInitialLoading = isSearching && items.length === 0;
  const view = isInitialLoading
    ? "loading"
    : items.length === 0
      ? "empty"
      : "list";

  useEffect(() => {
    if (!hoveredListingId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-listing-id="${hoveredListingId}"]`,
    );
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hoveredListingId]);

  const listClassName = cn(
    "flex w-full flex-col gap-4",
    variant === "split" && "gap-3",
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {view === "loading" && (
        <motion.div key="loading" className="w-full min-w-0" {...viewMotion}>
          <ListsViewSkeleton />
        </motion.div>
      )}

      {view === "empty" && (
        <motion.div
          key="empty"
          className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center"
          {...viewMotion}
        >
          <p className="text-lg font-semibold text-black/75">No stays found</p>
          <p className="max-w-sm text-sm text-black/50">
            Try adjusting your dates, destination, or filters to see more
            results.
          </p>
        </motion.div>
      )}

      {view === "list" && (
        <motion.div key="list" {...viewMotion} className="w-full min-w-0">
          <motion.ul
            ref={listRef}
            className={listClassName}
            variants={listStagger}
            initial="hidden"
            animate="visible"
          >
            {items.map((listing) => (
              <motion.li
                key={listing.id}
                variants={listItemStagger}
                data-listing-id={listing.id}
              >
                <ListingCard
                  listing={listing}
                  compact={variant === "split"}
                  highlighted={hoveredListingId === listing.id}
                  onHover={() => setHoveredListingId(listing.id)}
                  onLeave={() => setHoveredListingId(null)}
                />
              </motion.li>
            ))}
          </motion.ul>
          {hasMoreResults ? (
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outlined"
                color="primary"
                disabled={isLoadingMore}
                onClick={loadMoreResults}
                className="rounded-full! px-6! font-semibold!"
              >
                {isLoadingMore ? "Loading…" : "Load more stays"}
              </Button>
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ListsView;
