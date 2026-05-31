import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import cn from "@/utils/cn";
import ListingCard from "@/views/search-results/main-content/lists-view/listing-card";
import { ListsViewSkeleton } from "@/views/search-results/skeleton/listing-card-skeleton";
import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!hoveredListingId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-listing-id="${hoveredListingId}"]`,
    );
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hoveredListingId]);

  if (isInitialLoading) {
    return (
      <div className="w-full min-w-0">
        <ListsViewSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-lg font-semibold text-black/75">No stays found</p>
        <p className="max-w-sm text-sm text-black/50">
          Try adjusting your dates, destination, or filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <ul
        ref={listRef}
        className={cn(
          "flex w-full flex-col gap-3",
          variant === "split" && "gap-2.5",
        )}
      >
        {items.map((listing) => (
          <li key={listing.id} data-listing-id={listing.id}>
            <ListingCard
              listing={listing}
              compact={variant === "split"}
              highlighted={hoveredListingId === listing.id}
              onHover={() => setHoveredListingId(listing.id)}
              onLeave={() => setHoveredListingId(null)}
            />
          </li>
        ))}
      </ul>
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
    </div>
  );
};

export default ListsView;
