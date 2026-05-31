import RenderImage from "@/components/molecules/render-image";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import type { MapHoverCard } from "./map-hover-card";

/** Keep in sync with popover edge clamping in `map-pin-hover-overlay`. */
export const MAP_HOVER_CARD_WIDTH = 212;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

type MapPinCardProps = {
  card: MapHoverCard;
  loading?: boolean;
  className?: string;
};

const MapPinCard = ({ card, loading, className }: MapPinCardProps) => {
  const StarsIcon = useIcon("stars");
  const photo = card.photos[0];
  const hasRating = card.rating != null && card.rating > 0;
  const title = card.name.trim() || card.propertyType || "Stay";

  return (
    <div
      className={cn(
        "w-[212px] overflow-hidden rounded-2xl bg-white shadow-[0_14px_44px_rgba(0,0,0,0.16)] ring-1 ring-black/8",
        loading && "animate-pulse",
        className,
      )}
    >
      <div className="relative h-[112px] w-full">
        {photo ? (
          <RenderImage url={photo} className="absolute inset-0 size-full" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-main/20 via-main/8 to-black/5" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/5" />
        <div className="absolute inset-x-0 bottom-0 space-y-1 p-3">
          {card.propertyType ? (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              {card.propertyType}
            </p>
          ) : null}
          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {hasRating ? (
            <>
              <StarsIcon className="shrink-0 text-sm text-amber-500" />
              <span className="text-xs font-semibold tabular-nums text-black/70">
                {card.rating?.toFixed(1)}
              </span>
              {card.reviewCount > 0 ? (
                <span className="truncate text-[11px] text-black/40">
                  · {card.reviewCount} reviews
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-[11px] font-medium text-black/45">
              per night
            </span>
          )}
        </div>
        <span className="shrink-0 text-sm font-bold tabular-nums text-black/85">
          {formatPrice(card.pricePerNight)}
        </span>
      </div>
    </div>
  );
};

export default MapPinCard;
