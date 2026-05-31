import { useListingDetail } from "@/context/listing-detail";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import type { ReviewItem } from "@/store/types/listings";
import cn from "@/utils/cn";
import { Button, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { section, sectionEyebrow, sectionTitle } from "./styles";

const ReviewRow = ({ review }: { review: ReviewItem }) => {
  const dayjs = useDayjs();
  const StarsIcon = useIcon("stars");

  return (
    <article className="group py-4 first:pt-0">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-black/4 text-[12px] font-semibold text-black/55 ring-1 ring-black/5">
            {(review.reviewerName ?? "G").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-[13px] font-semibold text-black/78">
              {review.reviewerName ?? "Guest"}
            </p>
            <p className="text-[11px] text-black/38">
              {dayjs(review.date).format("MMMM YYYY")}
            </p>
          </div>
        </div>
        {review.rating != null && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-main/8 px-2 py-0.5 text-[12px] font-medium text-black/65">
            <StarsIcon className="text-[11px] text-main" />
            {review.rating.toFixed(1)}
          </span>
        )}
      </div>
      {review.text ? (
        <p className="text-[13px] leading-[1.65] text-black/55">{review.text}</p>
      ) : null}
      <div className="mt-4 h-px bg-linear-to-r from-transparent via-black/6 to-transparent group-last:hidden" />
    </article>
  );
};

const ReviewsSection = () => {
  const { listing, reviews, reviewsPage, isReviewsLoading, fetchReviews } =
    useListingDetail();
  const [items, setItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  useEffect(() => {
    setItems([]);
  }, [listing?.id]);

  useEffect(() => {
    if (!reviews?.items.length) return;
    setItems((prev) => {
      if (reviewsPage === 1) return reviews.items;
      const seen = new Set(prev.map((item) => item.id));
      return [...prev, ...reviews.items.filter((item) => !seen.has(item.id))];
    });
  }, [reviews, reviewsPage]);

  if (!listing) return null;

  const total = reviews?.total ?? listing.reviewCount;
  const hasMore = items.length < total;

  return (
    <section className={section}>
      <p className={sectionEyebrow}>Social proof</p>
      <h2 className={cn(sectionTitle, "mb-4")}>
        Reviews
        <span className="ml-1.5 font-normal text-black/38">
          ({total.toLocaleString()})
        </span>
      </h2>

      {listing.reviewSummary ? (
        <p className="mb-5 rounded-xl bg-black/3 px-3.5 py-3 text-[13px] leading-relaxed text-black/55 ring-1 ring-black/5">
          {listing.reviewSummary}
        </p>
      ) : null}

      {isReviewsLoading && items.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} animation="wave" height={72} className="rounded-xl!" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div>
          {items.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-black/45">No reviews yet.</p>
      )}

      {hasMore && (
        <Button
          type="button"
          variant="outlined"
          color="primary"
          disabled={isReviewsLoading}
          onClick={() => fetchReviews(reviewsPage + 1)}
          className="mt-3! w-full! rounded-xl! border-black/10! py-2! text-[13px]! font-medium! text-black/55! hover:border-main/25! hover:bg-main/5!"
        >
          {isReviewsLoading ? "Loading…" : "Load more reviews"}
        </Button>
      )}
    </section>
  );
};

export default ReviewsSection;
