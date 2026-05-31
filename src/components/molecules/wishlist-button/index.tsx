import { useWishlist } from "@/hooks/use-wishlist";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { IconButton, type IconButtonProps } from "@mui/material";
import { memo } from "react";

type WishlistButtonProps = {
  listingId: string;
  listingName?: string;
  variant?: "overlay" | "surface";
  className?: string;
  size?: IconButtonProps["size"];
};

const variantStyles: Record<NonNullable<WishlistButtonProps["variant"]>, string> = {
  overlay: "bg-black/25! text-white! hover:bg-black/40!",
  surface:
    "bg-white/80! shadow-[0_1px_4px_rgba(0,0,0,0.06)]! ring-1! ring-black/6! backdrop-blur-md!",
};

const WishlistButton = ({
  listingId,
  listingName,
  variant = "overlay",
  className,
  size = "small",
}: WishlistButtonProps) => {
  const { isSaved, toggle, isBusy } = useWishlist(listingId);
  const HeartIcon = useIcon("heart");
  const HeartFilledIcon = useIcon("heartFilled");
  const Icon = isSaved ? HeartFilledIcon : HeartIcon;
  const label = listingName?.trim() || "listing";

  return (
    <IconButton
      type="button"
      size={size}
      disabled={isBusy}
      aria-pressed={isSaved}
      aria-label={
        isSaved ? `Remove ${label} from wishlist` : `Save ${label} to wishlist`
      }
      onClick={toggle}
      className={cn(variantStyles[variant], className)}
    >
      <Icon
        className={cn(
          "text-main",
          variant === "surface" ? "text-base" : "text-lg",
        )}
      />
    </IconButton>
  );
};

export default memo(WishlistButton);
