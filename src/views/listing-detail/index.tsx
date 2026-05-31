import CompareAddButton from "@/components/molecules/compare-add-button";
import WishlistButton from "@/components/molecules/wishlist-button";
import { useListingDetail } from "@/context/listing-detail";
import type { SearchListingItem } from "@/store/types/search";
import { useIcon } from "@/hooks/use-icons";
import type { AspectScores } from "@/store/types/listings";
import cn from "@/utils/cn";
import { Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingPanel from "./booking-panel";
import { formatLabel, splitDescription } from "./format";
import HeroGallery from "./hero-gallery";
import DetailLocationMap from "./detail-location-map";
import ReviewsSection from "./reviews-section";
import {
  divider,
  pill,
  pillAccent,
  section,
  sectionEyebrow,
  sectionTitle,
} from "./styles";

const AspectScoresPanel = ({ scores }: { scores: AspectScores }) => {
  const entries = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return (
    <section className={section}>
      <p className={sectionEyebrow}>Reviews breakdown</p>
      <h2 className={cn(sectionTitle, "mb-5")}>What guests mention</h2>
      <ul className="space-y-4">
        {entries.map(([key, score]) => (
          <li key={key}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="font-medium text-black/70">{formatLabel(key)}</span>
              <span className="tabular-nums text-black/40">
                {Math.round(score * 100)}%
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-black/6">
              <div
                className="h-full rounded-full bg-linear-to-r from-main/70 to-main transition-all duration-700 ease-out"
                style={{ width: `${Math.round(score * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const ListingDetailView = () => {
  const navigate = useNavigate();
  const { listing, isListingLoading } = useListingDetail();
  const StarsIcon = useIcon("stars");
  const LocationIcon = useIcon("location");
  const ChevronLeftIcon = useIcon("chevronLeft");

  if (isListingLoading) {
    return (
      <div className="main-container space-y-6 py-6">
        <Skeleton animation="wave" height={28} width={120} />
        <Skeleton animation="wave" className="aspect-16/7! rounded-[1.75rem]!" />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Skeleton animation="wave" height={36} width="70%" />
            <Skeleton animation="wave" height={20} width="40%" />
            <Skeleton animation="wave" height={120} />
          </div>
          <Skeleton animation="wave" height={360} className="rounded-[1.75rem]!" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="main-container flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold text-black/75">Listing not found</p>
        <Button variant="contained" onClick={() => navigate("/results")}>
          Back to results
        </Button>
      </div>
    );
  }

  const paragraphs = splitDescription(listing.description);
  const locationLabel = [listing.neighbourhood?.name, listing.city.name]
    .filter(Boolean)
    .join(", ");
  const listingForCompare: SearchListingItem = {
    id: listing.id,
    name: listing.name,
    photos: listing.photos,
    propertyType: listing.propertyType,
    roomType: listing.roomType,
    pricePerNight: listing.price ?? 0,
    totalForStay: listing.price ?? 0,
    rating: listing.ratingAvg,
    reviewCount: listing.reviewCount,
    amenities: listing.amenities,
    latitude: listing.latitude,
    longitude: listing.longitude,
  };

  const stats = [
    { label: "guests", value: listing.accommodates },
    listing.bedrooms != null && { label: "bedrooms", value: listing.bedrooms },
    listing.beds != null && { label: "beds", value: listing.beds },
    listing.bathrooms != null && { label: "baths", value: listing.bathrooms },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <div className="main-container pb-16 pt-3">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-0.5 rounded-full bg-white/80 px-3 py-1.5 text-[13px] font-medium text-black/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-black/6 backdrop-blur-md transition-all hover:text-black/85 hover:ring-black/12"
        >
          <ChevronLeftIcon className="text-[15px]" />
          Back
        </button>
        <div className="flex items-center gap-1">
          <CompareAddButton
            listing={listingForCompare}
            className="relative! bg-white/80! shadow-[0_1px_4px_rgba(0,0,0,0.06)]! ring-1! ring-black/6!"
          />
          <WishlistButton
            listingId={listing.id}
            listingName={listing.name}
            variant="surface"
            className="relative!"
          />
        </div>
      </div>

      <HeroGallery photos={listing.photos} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-5">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={pillAccent}>{formatLabel(listing.propertyType)}</span>
              <span className={pill}>{formatLabel(listing.roomType)}</span>
              {listing.ratingAvg != null && listing.ratingAvg > 0 && (
                <span className={cn(pill, "gap-1 font-semibold text-black/75")}>
                  <StarsIcon className="text-sm text-main" />
                  {listing.ratingAvg.toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-black/92 sm:text-[2.125rem]">
                {listing.name}
              </h1>
              <p className="inline-flex items-center gap-1 text-[13px] text-black/45">
                <LocationIcon className="shrink-0 text-sm text-main/80" />
                {locationLabel}
              </p>
            </div>

            <div className={divider} />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-black/50">
              {stats.map((stat, i) => (
                <span key={stat.label} className="inline-flex items-center gap-3">
                  {i > 0 && <span className="text-black/20">·</span>}
                  <span className="font-medium text-black/70">{stat.value}</span>
                  {stat.label}
                </span>
              ))}
              {listing.reviewCount > 0 && (
                <>
                  <span className="text-black/20">·</span>
                  <span>{listing.reviewCount.toLocaleString()} reviews</span>
                </>
              )}
            </div>

            {listing.reviewSummary && (
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-main/8 via-main/4 to-transparent px-4 py-3.5 ring-1 ring-main/10">
                <p className={cn(sectionEyebrow, "text-main/80")}>Guest insight</p>
                <p className="text-[13px] leading-relaxed text-black/62">
                  {listing.reviewSummary}
                </p>
              </div>
            )}
          </header>

          {paragraphs.length > 0 && (
            <section className={section}>
              <p className={sectionEyebrow}>Overview</p>
              <h2 className={cn(sectionTitle, "mb-4")}>About this stay</h2>
              <div className="space-y-3 text-[13px] leading-[1.7] text-black/58">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {listing.amenities.length > 0 && (
            <section className={section}>
              <p className={sectionEyebrow}>Included</p>
              <h2 className={cn(sectionTitle, "mb-4")}>Amenities</h2>
              <ul className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-full bg-black/4 px-3 py-1.5 text-[12px] font-medium text-black/58 ring-1 ring-black/5"
                  >
                    {formatLabel(amenity)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {listing.aspectScores && (
            <AspectScoresPanel scores={listing.aspectScores} />
          )}

          {listing.host.name && (
            <section className={section}>
              <p className={sectionEyebrow}>Your host</p>
              <h2 className={cn(sectionTitle, "mb-4")}>Hosted by</h2>
              <div className="flex items-center gap-3.5">
                <span className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-main/15 to-main/5 text-base font-semibold text-main ring-2 ring-white">
                  {listing.host.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-black/82">
                    {listing.host.name}
                  </p>
                  <p className="text-[12px] text-black/40">Verified host</p>
                </div>
              </div>
            </section>
          )}

          <section className={section}>
            <p className={sectionEyebrow}>Neighbourhood</p>
            <h2 className={cn(sectionTitle, "mb-1")}>Location</h2>
            <p className="mb-4 text-[13px] text-black/50">{locationLabel}</p>
            <DetailLocationMap
              latitude={listing.latitude}
              longitude={listing.longitude}
              label={locationLabel}
            />
          </section>

          <ReviewsSection />

          {listing.sourceUrl && (
            <div className="flex justify-center pt-1">
              <Button
                variant="text"
                color="primary"
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px]! font-medium! text-black/45! hover:text-main!"
              >
                View on Airbnb →
              </Button>
            </div>
          )}
        </div>

        <BookingPanel />
      </div>
    </div>
  );
};

export default ListingDetailView;
