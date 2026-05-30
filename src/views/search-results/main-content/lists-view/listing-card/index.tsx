import { useIcon } from "@/hooks/use-icons";
import type { SearchListingItem } from "@/store/types/search";
import cn from "@/utils/cn";
import CustomTooltip from "@/components/atoms/custom-tooltip";
import { IconButton } from "@mui/material";
import { motion } from "motion/react";
import { memo } from "react";

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

const cardHoverTransition = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.95,
} as const;

type ListingCardProps = {
  listing: SearchListingItem;
};

const ListingCard = ({ listing }: ListingCardProps) => {
  const StarsIcon = useIcon("stars");
  const HeartIcon = useIcon("heart");
  const LocationIcon = useIcon("location");

  const coverPhoto = listing.photos[0] ?? PLACEHOLDER_IMAGE;
  const visibleAmenities = listing.amenities.slice(0, MAX_VISIBLE_AMENITIES);
  const hiddenAmenities = listing.amenities.slice(MAX_VISIBLE_AMENITIES);
  const hasRating = listing.rating != null && listing.rating > 0;

  return (
    <motion.article
      initial={false}
      whileHover={{ y: -2 }}
      transition={cardHoverTransition}
      className={cn(
        "group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-main/15 bg-background-paper",
        "shadow-sm transition-[box-shadow,border-color] duration-500 ease-out hover:border-main/35 hover:shadow-lg",
        "sm:flex-row sm:items-stretch",
      )}
    >
      <div className="relative aspect-5/3 w-full shrink-0 overflow-hidden sm:aspect-auto sm:min-h-48 sm:w-56 md:w-64 lg:w-72">
        <img
          src={coverPhoto}
          alt={listing.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {formatLabel(listing.propertyType)}
          </span>
        </div>
        <IconButton
          type="button"
          aria-label={`Save ${listing.name}`}
          onClick={(event) => event.stopPropagation()}
          className="absolute! right-2! top-2! bg-black/25! text-white! hover:bg-black/40!"
          size="small"
        >
          <HeartIcon className="text-lg text-main" />
        </IconButton>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 p-3 sm:gap-3 sm:p-4 md:p-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="rounded-md bg-main/10 px-2 py-0.5 text-xs font-medium text-black/70">
              {formatLabel(listing.roomType)}
            </span>
            {listing.distanceKm != null && (
              <span className="inline-flex items-center gap-1 text-xs text-black/55">
                <LocationIcon className="shrink-0 text-sm text-main" />
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
            <h3 className="line-clamp-1 text-base font-semibold leading-snug text-black/85 sm:text-lg">
              {listing.name}
            </h3>
          </CustomTooltip>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/60">
            {hasRating ? (
              <span className="inline-flex items-center gap-1 font-medium text-black/75">
                <StarsIcon className="text-base text-main" />
                {listing.rating!.toFixed(1)}
                <span className="font-normal text-black/50">
                  <span className="sm:hidden">
                    ({listing.reviewCount.toLocaleString()})
                  </span>
                  <span className="hidden sm:inline">
                    ({listing.reviewCount.toLocaleString()} reviews)
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-black/45">New · No reviews yet</span>
            )}
          </div>

          {visibleAmenities.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-0.5">
              {visibleAmenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-md border border-main/15 bg-main/5 px-2 py-0.5 text-xs text-black/60"
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
                  <li className="cursor-default rounded-md border border-dashed border-main/20 px-2 py-0.5 text-xs text-black/45">
                    +{hiddenAmenities.length} more
                  </li>
                </CustomTooltip>
              )}
            </ul>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 border-t border-main/10 pt-2.5 sm:gap-3 sm:pt-3">
          <p className="text-xs text-black/45">Total for your stay</p>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-black/85 sm:text-xl">
              {formatPrice(listing.totalForStay)}
            </p>
            <p className="text-xs text-black/50 sm:text-sm">
              {formatPrice(listing.pricePerNight)} / night
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default memo(ListingCard);
