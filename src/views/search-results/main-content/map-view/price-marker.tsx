import cn from "@/utils/cn";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

type PriceMarkerProps = {
  price?: number;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const PriceMarker = ({
  price,
  count,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PriceMarkerProps) => {
  const isCluster = count != null;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "price-marker cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold shadow-md transition-all duration-200",
        isCluster
          ? "min-w-8 border-black/20 bg-black/85 text-white hover:scale-105"
          : active
            ? "z-20 scale-110 border-main bg-main text-white shadow-lg"
            : "border-black/10 bg-white/95 text-black/85 hover:scale-105 hover:border-main/40 hover:shadow-lg",
      )}
    >
      {isCluster ? count : formatPrice(price ?? 0)}
    </button>
  );
};

export default PriceMarker;
