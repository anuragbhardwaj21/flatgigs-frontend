import CustomTooltip from "@/components/atoms/custom-tooltip";
import { useIcon } from "@/hooks/use-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addListing,
  MAX_COMPARE_ITEMS,
  removeListing,
  selectCompareIsFull,
  selectIsInCompare,
} from "@/store/slices/compare-slice";
import type { SearchListingItem } from "@/store/types/search";
import cn from "@/utils/cn";
import { IconButton } from "@mui/material";
import { memo, type MouseEvent } from "react";

type CompareAddButtonProps = {
  listing: SearchListingItem;
  className?: string;
  size?: "small" | "medium";
};

const CompareAddButton = ({
  listing,
  className,
  size = "small",
}: CompareAddButtonProps) => {
  const dispatch = useAppDispatch();
  const PlusIcon = useIcon("plus");
  const CheckIcon = useIcon("check");
  const isInCompare = useAppSelector(selectIsInCompare(listing.id));
  const isFull = useAppSelector(selectCompareIsFull);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (isInCompare) {
      dispatch(removeListing(listing.id));
      return;
    }
    if (isFull) return;
    dispatch(addListing(listing));
  };

  const tooltip = isInCompare
    ? "Remove from compare"
    : isFull
      ? `Compare list full (max ${MAX_COMPARE_ITEMS})`
      : "Add to compare";

  return (
    <CustomTooltip title={tooltip}>
      <span className="inline-flex">
        <IconButton
          type="button"
          size={size}
          aria-label={tooltip}
          aria-pressed={isInCompare}
          disabled={!isInCompare && isFull}
          onClick={handleClick}
          className={cn(
            "bg-black/25! text-white! hover:bg-black/40!",
            isInCompare && "bg-main/90! hover:bg-main!",
            className,
          )}
        >
          {isInCompare ? (
            <CheckIcon className="text-base text-white" />
          ) : (
            <PlusIcon className="text-base text-main" />
          )}
        </IconButton>
      </span>
    </CustomTooltip>
  );
};

export default memo(CompareAddButton);
