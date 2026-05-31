import WishlistButton from "@/components/molecules/wishlist-button";
import CompareAddButton from "@/components/molecules/compare-add-button";
import { useIcon } from "@/hooks/use-icons";
import { useGetWishlistQuery } from "@/store/services/wishlist-api";
import type { WishlistListing } from "@/store/types/wishlist";
import type { SearchListingItem } from "@/store/types/search";
import cn from "@/utils/cn";
import { Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RenderImage from "@/components/molecules/render-image";
import CustomTooltip from "@/components/atoms/custom-tooltip";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

const toSearchListingItem = (item: WishlistListing): SearchListingItem => ({
  id: item.id,
  name: item.name,
  photos: item.photos,
  propertyType: item.propertyType,
  roomType: item.roomType,
  pricePerNight: item.price ?? 0,
  totalForStay: item.price ?? 0,
  rating: item.ratingAvg,
  reviewCount: item.reviewCount,
  amenities: item.amenities,
  latitude: item.latitude,
  longitude: item.longitude,
});

const WishlistCard = ({ item }: { item: WishlistListing }) => {
  const navigate = useNavigate();
  const StarsIcon = useIcon("stars");
  const LocationIcon = useIcon("location");
  const listing = toSearchListingItem(item);
  const locationLabel = [item.neighbourhood?.name, item.city.name]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/results/${item.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/results/${item.id}`);
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-main/15 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-5/3">
        <RenderImage
          url={item.photos[0] ?? ""}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <CompareAddButton listing={listing} />
          </span>
          <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <WishlistButton listingId={item.id} listingName={item.name} />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CustomTooltip title={item.name}>
          <h3 className="line-clamp-1 text-base font-semibold text-black/85">
            {item.name}
          </h3>
        </CustomTooltip>
        <p className="inline-flex items-center gap-1 text-xs text-black/50">
          <LocationIcon className="shrink-0 text-sm text-main" />
          {locationLabel}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm">
            {item.ratingAvg != null && item.ratingAvg > 0 ? (
              <>
                <StarsIcon className="text-main" />
                <span className="font-semibold text-black/75">
                  {item.ratingAvg.toFixed(1)}
                </span>
                <span className="text-black/40">
                  ({item.reviewCount.toLocaleString()})
                </span>
              </>
            ) : (
              <span className="text-black/40">New listing</span>
            )}
          </div>
          <p className="text-right font-bold text-black/85">
            {formatPrice(item.price ?? 0)}
            <span className="text-xs font-normal text-black/45"> / night</span>
          </p>
        </div>
        {item.reviewSummary ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-black/50">
            {item.reviewSummary}
          </p>
        ) : null}
      </div>
    </article>
  );
};

const WishlistView = () => {
  const navigate = useNavigate();
  const HeartIcon = useIcon("heartFilled");
  const { data, isLoading, isError } = useGetWishlistQuery();
  const items = data?.items ?? [];

  return (
    <div className="main-container pb-16 pt-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-main/10">
            <HeartIcon className="text-xl text-main" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-main/80">
              Saved for later
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-black/90">
              Wishlist
            </h1>
            {!isLoading && (
              <p className="mt-1 text-sm text-black/45">
                {data?.total ?? items.length} stays saved
              </p>
            )}
          </div>
        </div>
        <Button variant="contained" onClick={() => navigate("/results")}>
          Find more stays
        </Button>
      </header>

      {isLoading ? (
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" className="aspect-4/5! rounded-2xl!" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-sm text-red-600">Could not load wishlist.</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <HeartIcon className="text-4xl text-main/40" />
          <p className="text-lg font-semibold text-black/75">No saved stays yet</p>
          <p className="max-w-sm text-sm text-black/50">
            Tap the heart on any listing to save it here.
          </p>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Start exploring
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;
