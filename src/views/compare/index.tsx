import { useSearch } from "@/context/search";
import { useIcon } from "@/hooks/use-icons";
import { useCompareListingsMutation } from "@/store/services/compare-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCompare,
  removeListing,
  selectCompareEntries,
} from "@/store/slices/compare-slice";
import type { CompareListingCard } from "@/store/types/compare";
import cn from "@/utils/cn";
import { Button, Skeleton } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import RenderImage from "@/components/molecules/render-image";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatLabel = (value: string) =>
  value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const AspectBar = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] text-black/50">
      <span>{formatLabel(label)}</span>
      <span className="tabular-nums">{Math.round(score * 100)}%</span>
    </div>
    <div className="h-1 overflow-hidden rounded-full bg-black/6">
      <div
        className="h-full rounded-full bg-main/70"
        style={{ width: `${Math.round(score * 100)}%` }}
      />
    </div>
  </div>
);

const CompareColumn = ({
  card,
  snapshotPhoto,
  onRemove,
}: {
  card: CompareListingCard;
  snapshotPhoto?: string;
  onRemove: () => void;
}) => {
  const StarsIcon = useIcon("stars");
  const aspects = card.aspectScores
    ? Object.entries(card.aspectScores).slice(0, 4)
    : [];

  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-main/15 bg-white shadow-sm">
      <div className="relative aspect-4/3 bg-black/5">
        <RenderImage
          url={snapshotPhoto ?? ""}
          className="size-full object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm hover:bg-black/65"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            to={`/results/${card.id}`}
            className="line-clamp-2 text-base font-semibold text-black/85 hover:text-main"
          >
            {card.name}
          </Link>
          <p className="mt-1 text-xl font-bold text-black/90">
            {formatPrice(card.price)}
            <span className="text-sm font-normal text-black/45"> / night</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm text-black/60">
          <StarsIcon className="text-main" />
          <span className="font-semibold">{card.rating.toFixed(2)}</span>
          <span className="text-black/40">
            ({card.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
        {card.reviewSummary ? (
          <p className="line-clamp-3 text-[13px] leading-relaxed text-black/55">
            {card.reviewSummary}
          </p>
        ) : null}
        {card.amenities.length > 0 ? (
          <ul className="flex flex-wrap gap-1">
            {card.amenities.slice(0, 6).map((amenity) => (
              <li
                key={amenity}
                className="rounded-md bg-main/8 px-2 py-0.5 text-[11px] text-black/55"
              >
                {formatLabel(amenity)}
              </li>
            ))}
          </ul>
        ) : null}
        {aspects.length > 0 ? (
          <div className="mt-auto space-y-2 border-t border-black/6 pt-3">
            {aspects.map(([key, score]) => (
              <AspectBar key={key} label={key} score={score} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

const CompareView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectCompareEntries);
  const { searchInputs } = useSearch();
  const [compareListings, { data, isLoading, isError }] =
    useCompareListingsMutation();

  const listingIds = useMemo(() => entries.map((e) => e.id), [entries]);

  useEffect(() => {
    if (listingIds.length < 2) return;
    void compareListings({
      listingIds,
      checkIn: searchInputs.checkIn,
      checkOut: searchInputs.checkOut,
    });
  }, [
    compareListings,
    listingIds,
    searchInputs.checkIn,
    searchInputs.checkOut,
  ]);

  const photoById = useMemo(
    () =>
      Object.fromEntries(
        entries.map((entry) => [entry.id, entry.listing.photos[0] ?? ""]),
      ),
    [entries],
  );

  if (entries.length < 2) {
    return (
      <div className="main-container flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold text-black/80">
          Add at least 2 stays to compare
        </p>
        <p className="max-w-md text-sm text-black/50">
          Use the + button on listing cards, then open compare from the floating
          button.
        </p>
        <Button variant="contained" onClick={() => navigate("/results")}>
          Browse stays
        </Button>
      </div>
    );
  }

  return (
    <div className="main-container pb-20 pt-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-main/80">
            Side by side
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-black/90">
            Compare stays
          </h1>
          <p className="mt-1 text-sm text-black/45">
            {entries.length} of 3 selected
            {searchInputs.checkIn && searchInputs.checkOut
              ? ` · ${searchInputs.checkIn} → ${searchInputs.checkOut}`
              : ""}
          </p>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatch(clearCompare())}
          className="rounded-xl!"
        >
          Clear all
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Skeleton
              key={entry.id}
              variant="rectangular"
              className="aspect-3/4! h-full! rounded-2xl!"
            />
          ))}
        </div>
      ) : isError || !data ? (
        <p className="text-center text-sm text-red-600">
          Could not load comparison. Try again shortly.
        </p>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-5",
              data.listings.length === 2 && "md:grid-cols-2",
              data.listings.length >= 3 && "lg:grid-cols-3",
            )}
          >
            {data.listings.map((card) => (
              <CompareColumn
                key={card.id}
                card={card}
                snapshotPhoto={photoById[card.id]}
                onRemove={() => dispatch(removeListing(card.id))}
              />
            ))}
          </div>

          {data.verdict ? (
            <div className="relative mt-10 overflow-hidden rounded-2xl p-px">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-main/40 via-main/10 to-transparent"
              />
              <div className="relative rounded-[calc(1rem-1px)] bg-white/95 px-6 py-5 backdrop-blur-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-main">
                  AI verdict
                </p>
                <p className="text-[15px] leading-relaxed text-black/70">
                  {data.verdict}
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CompareView;
