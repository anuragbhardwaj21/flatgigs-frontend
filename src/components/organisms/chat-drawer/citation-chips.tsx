import type { ChatCitation } from "@/store/types/chat";
import cn from "@/utils/cn";
import { Link } from "react-router-dom";

type CitationChipsProps = {
  citations: ChatCitation[];
  className?: string;
};

const CitationChips = ({ citations, className }: CitationChipsProps) => {
  if (!citations.length) return null;

  const unique = citations.filter(
    (item, index, arr) =>
      arr.findIndex((c) => c.listingId === item.listingId && c.reviewId === item.reviewId) ===
      index,
  );

  return (
    <ul className={cn("mt-2 flex flex-wrap gap-1.5", className)}>
      {unique.map((citation) => {
        const to = citation.reviewId
          ? `/results/${citation.listingId}#review-${citation.reviewId}`
          : `/results/${citation.listingId}`;
        const label = citation.excerpt
          ? citation.excerpt.slice(0, 48) + (citation.excerpt.length > 48 ? "…" : "")
          : `Listing ${citation.listingId}`;

        return (
          <li key={`${citation.listingId}-${citation.reviewId ?? "listing"}`}>
            <Link
              to={to}
              className="inline-block max-w-[220px] truncate rounded-full border border-main/20 bg-main/5 px-2.5 py-1 text-[11px] font-medium text-main hover:bg-main/12"
              title={citation.excerpt}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CitationChips;
