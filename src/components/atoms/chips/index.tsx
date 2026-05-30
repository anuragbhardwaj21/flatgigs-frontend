import CustomTooltip from "@/components/atoms/custom-tooltip";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";

export type ChipVariant = "outlined" | "contained";
export type ChipMaxWidth = "fit" | "sm" | "md" | "lg" | "xl" | "full";

export type ChipsProps = {
  text: string;
  startIcon?: string;
  variant?: ChipVariant;
  maxWidth?: ChipMaxWidth;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

const maxWidthClass: Record<ChipMaxWidth, string> = {
  fit: "w-fit",
  sm: "max-w-24",
  md: "max-w-32",
  lg: "max-w-40",
  xl: "max-w-52",
  full: "max-w-full",
};

const variantClass: Record<ChipVariant, string> = {
  outlined:
    "border-black/35 border-dashed bg-background-paper text-black/75 hover:border-main/45 hover:bg-main/5",
  contained: "border-main bg-main text-white shadow-sm hover:bg-main/90",
};

const Chips = ({
  text,
  startIcon,
  variant = "outlined",
  maxWidth = "md",
  selected,
  className,
  onClick,
  "aria-label": ariaLabel,
}: ChipsProps) => {
  const Icon = useIcon(startIcon);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? (ariaLabel ?? text) : undefined}
      aria-pressed={onClick ? selected : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none select-none",
        maxWidth === "fit" ? "w-fit" : "min-w-0",
        maxWidth !== "fit" && maxWidthClass[maxWidth],
        variantClass[variant],
        onClick &&
          "cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/35 focus-visible:ring-offset-1",
        className,
      )}
    >
      {startIcon ? (
        <Icon
          aria-hidden
          className={cn(
            "size-3.5 shrink-0",
            variant === "contained" ? "text-white" : "text-main",
          )}
        />
      ) : null}
      <CustomTooltip title={text}>
        <span
          className={cn(
            maxWidth === "fit" ? "whitespace-nowrap" : "min-w-0 flex-1 truncate",
          )}
        >
          {text}
        </span>
      </CustomTooltip>
    </Tag>
  );
};

export default Chips;
