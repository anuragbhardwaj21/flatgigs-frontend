import CompareAddButton from "@/components/molecules/compare-add-button";
import WishlistButton from "@/components/molecules/wishlist-button";
import CustomTooltip from "@/components/atoms/custom-tooltip";
import { useIcon } from "@/hooks/use-icons";
import type { SearchListingItem } from "@/store/types/search";
import cn from "@/utils/cn";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RenderImage from "@/components/molecules/render-image";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e8ebe9' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

const MAX_VISIBLE_AMENITIES = 4;

const formatLabel = (value: string) =>
  value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

type ListingCardProps = {
  listing: SearchListingItem;
  compact?: boolean;
  highlighted?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
};

const ListingCard = ({
  listing,
  compact = false,
  highlighted = false,
  onHover,
  onLeave,
}: ListingCardProps) => {
  const navigate = useNavigate();
  const StarsIcon = useIcon("stars");
  const LocationIcon = useIcon("location");

  const coverPhoto = listing.photos[0] ?? PLACEHOLDER_IMAGE;
  const visibleAmenities = listing.amenities.slice(0, MAX_VISIBLE_AMENITIES);
  const hiddenAmenities = listing.amenities.slice(MAX_VISIBLE_AMENITIES);
  const hasRating = listing.rating != null && listing.rating > 0;

  const openDetail = useCallback(() => {
    navigate(`/results/${listing.id}`);
  }, [navigate, listing.id]);

  return (
    <article
      onClick={openDetail}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${listing.name}`}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-background-paper sm:flex-row sm:items-stretch",
        "transition-[border-color,box-shadow] duration-200",
        highlighted
          ? "border-main/40 ring-1 ring-main/30"
          : "border-black/8 hover:border-black/14 hover:shadow-sm",
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-black/4",
          "aspect-5/3 sm:aspect-auto sm:min-h-[148px]",
          compact
            ? "sm:w-44 sm:min-h-[132px]"
            : "sm:w-56 sm:min-h-[148px] md:w-64 md:min-h-[160px] lg:w-72 lg:min-h-[168px]",
        )}
      >
        <RenderImage
          url={coverPhoto}
          className="absolute inset-0 size-full! object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:px-2.5 sm:text-xs">
            {formatLabel(listing.propertyType)}
          </span>
        </div>
        <div
          className="absolute right-2 top-2 flex gap-1"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CompareAddButton listing={listing} />
          <WishlistButton listingId={listing.id} listingName={listing.name} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="rounded-md bg-main/8 px-2 py-0.5 text-[11px] font-medium text-black/65 sm:text-xs">
              {formatLabel(listing.roomType)}
            </span>
            {listing.distanceKm != null && (
              <span className="inline-flex items-center gap-1 text-[11px] text-black/50 sm:text-xs">
                <LocationIcon className="shrink-0 text-sm text-main" aria-hidden />
                <span className="sm:hidden">
                  {listing.distanceKm.toFixed(1)} km
                </span>
                <span className="hidden sm:inline">
                  {listing.distanceKm.toFixed(1)} km from center
                </span>
              </span>
            )}
          </div>

          <CustomTooltip title={listing.name}>
            <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug text-black/88 sm:text-base">
              {listing.name}
            </h3>
          </CustomTooltip>

          {listing.rationale ? (
            <p className="line-clamp-2 text-xs leading-snug text-main/85 sm:text-sm">
              {listing.rationale}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/55 sm:text-sm">
            {hasRating ? (
              <span className="inline-flex items-center gap-1 font-medium text-black/70">
                <StarsIcon className="text-base text-main" aria-hidden />
                {listing.rating!.toFixed(1)}
                <span className="font-normal text-black/45">
                  <span className="sm:hidden">
                    ({listing.reviewCount.toLocaleString()})
                  </span>
                  <span className="hidden sm:inline">
                    ({listing.reviewCount.toLocaleString()} reviews)
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-black/40">New · No reviews yet</span>
            )}
          </div>

          {visibleAmenities.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-0.5">
              {visibleAmenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-md border border-main/12 bg-main/4 px-2 py-0.5 text-[11px] text-black/55 sm:text-xs"
                >
                  {formatLabel(amenity)}
                </li>
              ))}
              {hiddenAmenities.length > 0 && (
                <CustomTooltip
                  title={
                    <ul className="flex max-w-48 flex-col gap-1 py-0.5">
                      {hiddenAmenities.map((amenity) => (
                        <li key={amenity}>{formatLabel(amenity)}</li>
                      ))}
                    </ul>
                  }
                >
                  <li className="cursor-default rounded-md border border-dashed border-main/18 px-2 py-0.5 text-[11px] text-black/40 sm:text-xs">
                    +{hiddenAmenities.length} more
                  </li>
                </CustomTooltip>
              )}
            </ul>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 border-t border-black/6 pt-2.5 sm:pt-3">
          <p className="text-[11px] text-black/40 sm:text-xs">Total for your stay</p>
          <div className="shrink-0 text-right">
            <p className="text-base font-bold tabular-nums text-black/88 sm:text-lg">
              {formatPrice(listing.totalForStay)}
            </p>
            <p className="text-[11px] tabular-nums text-black/45 sm:text-xs">
              {formatPrice(listing.pricePerNight)} / night
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(ListingCard);
