import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import type { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import RollingDigit from "@/components/atoms/rolling-digit";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";

type RenderType = "search" | "date" | "guests";

const fieldSx = {
  m: 0,
  height: "100%",
  width: "100%",
  "& .MuiFormControl-root": { height: "100%" },
  "& .MuiInputBase-root, & .MuiPickersInputBase-root": {
    height: "100%",
    minHeight: 0,
    py: 0,
    alignItems: "center",
    border: "none !important",
    boxShadow: "none",
    "&::before, &::after": { display: "none" },
  },
  "& fieldset, & .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline":
    { border: "none !important" },
  "& .MuiInputBase-input": {
    py: 0,
    px: 0,
    height: "100%",
    fontSize: "0.875rem",
    lineHeight: 1.25,
    cursor: "pointer",
  },
};

const flatTextFieldProps = {
  variant: "standard" as const,
  margin: "none" as const,
  fullWidth: true,
  className: "h-full w-full",
  sx: fieldSx,
  slotProps: {
    input: { disableUnderline: true },
  },
};

const fieldWrap = "flex min-h-0 flex-1 w-full items-center";

type RenderInputProps = {
  label?: string;
  icon?: string;
  render: RenderType;
  className?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  dateValue?: Dayjs | null;
  onDateChange?: (value: Dayjs | null) => void;
  dateOpen?: boolean;
  onDateOpen?: () => void;
  onDateClose?: () => void;
  minDate?: Dayjs;
  guestCount?: number;
  onGuestCountChange?: (count: number) => void;
};

const RenderInput = ({
  label,
  icon,
  render,
  className,
  placeholder,
  value,
  onValueChange,
  onSubmit,
  dateValue,
  onDateChange,
  dateOpen = false,
  onDateOpen,
  onDateClose,
  minDate,
  guestCount,
  onGuestCountChange,
}: RenderInputProps) => {
  const Icon = useIcon(icon ?? "location");
  const inputRef = useRef<HTMLInputElement>(null);
  const [localGuests, setLocalGuests] = useState(1);
  const guests = guestCount ?? localGuests;
  const [searchValue, setSearchValue] = useState("");
  const query = value ?? searchValue;
  const showLabel = Boolean(label);

  const setQuery = (next: string) => {
    onValueChange?.(next);
    if (value === undefined) setSearchValue(next);
  };

  const setGuests = (next: number) => {
    const count = Math.max(1, next);
    onGuestCountChange?.(count);
    if (guestCount === undefined) setLocalGuests(count);
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
  };

  const activate = () => {
    if (render === "search") inputRef.current?.focus();
    if (render === "date" && !dateOpen) onDateOpen?.();
  };

  return (
    <div
      role={render !== "guests" ? "button" : undefined}
      tabIndex={render !== "guests" ? -1 : undefined}
      onClick={render !== "guests" ? activate : undefined}
      onKeyDown={
        render !== "guests"
          ? (e) => e.key === "Enter" && !onSubmit && activate()
          : undefined
      }
      className={cn(
        "flex h-full min-h-14 w-full cursor-pointer select-none flex-col items-start rounded-xl bg-background-paper px-4 py-2 hover:bg-main/10",
        !showLabel && "justify-center px-0 py-0",
        className,
      )}
    >
      {showLabel && icon && (
        <p className="flex shrink-0 items-center gap-0.5 text-xs font-semibold opacity-70">
          <Icon className="text-lg" />
          <span>{label}</span>
        </p>
      )}

      <div className={cn(fieldWrap, !showLabel && "flex-1")}>
        {render === "search" && (
          <TextField
            {...flatTextFieldProps}
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder ?? "Search destinations"}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitSearch();
              }
            }}
          />
        )}

        {render === "date" && (
          <DesktopDatePicker
            className="h-full w-full"
            sx={{ ...fieldSx, display: "flex", alignItems: "center" }}
            value={dateValue ?? null}
            onChange={(value, ctx) => {
              if (!ctx.validationError && value) onDateChange?.(value);
            }}
            open={dateOpen}
            onOpen={onDateOpen}
            onClose={onDateClose}
            format="MMM D"
            minDate={minDate}
            slotProps={{
              textField: { ...flatTextFieldProps, inputRef },
              openPickerButton: { sx: { display: "none" } },
            }}
          />
        )}

        {render === "guests" && (
          <div
            className="flex h-full w-full items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Decrease guests"
              disabled={guests <= 1}
              onClick={() => setGuests(guests - 1)}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white hover:bg-black/10 disabled:opacity-30"
            >
              <FiMinus />
            </button>
            <span
              className="inline-flex h-7 w-[4ch] shrink-0 items-center justify-center text-base font-medium leading-none tabular-nums"
              aria-live="polite"
              aria-label={`${guests} guests`}
            >
              {String(guests)
                .split("")
                .map((digit, i, arr) => (
                  <RollingDigit
                    key={arr.length - i}
                    value={digit}
                  />
                ))}
            </span>
            <button
              type="button"
              aria-label="Increase guests"
              onClick={() => setGuests(guests + 1)}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white hover:bg-black/10"
            >
              <FiPlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderInput;
