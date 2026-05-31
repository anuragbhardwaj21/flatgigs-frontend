import CustomDialog from "@/components/molecules/custom-dialog";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import type { ListingDetail } from "@/store/types/listings";
import cn from "@/utils/cn";
import { Button } from "@mui/material";
import type { AdjustedPriceQuote } from "./pricing";
import { formatPrice } from "./format";

type StayDates = { checkIn: string; checkOut: string };

type BillRowProps = {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
};

const BillRow = ({ label, value, muted, strong }: BillRowProps) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4",
      strong ? "text-[15px] font-bold text-black/90" : "text-[13px]",
      muted && !strong && "text-black/52",
    )}
  >
    <span className="min-w-0">{label}</span>
    <span className="shrink-0 tabular-nums">{value}</span>
  </div>
);

const ReceiptDivider = () => (
  <div className="relative py-1">
    <div className="border-t border-dashed border-black/12" />
  </div>
);

type BookingBillProps = {
  listing: ListingDetail;
  stayDates: StayDates;
  guestCount: number;
  quote: AdjustedPriceQuote;
};

export const BookingBill = ({
  listing,
  stayDates,
  guestCount,
  quote,
}: BookingBillProps) => {
  const dayjs = useDayjs();
  const checkInLabel = dayjs(stayDates.checkIn).format("ddd, MMM D, YYYY");
  const checkOutLabel = dayjs(stayDates.checkOut).format("ddd, MMM D, YYYY");
  const location = [listing.neighbourhood?.name, listing.city.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-black/6">
      <div className="bg-linear-to-br from-main/8 to-transparent px-4 py-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-main/80">
          Booking receipt
        </p>
        <p className="mt-1 text-[15px] font-semibold leading-snug text-black/88">
          {listing.name}
        </p>
        <p className="text-[12px] text-black/45">{location}</p>
      </div>

      <div className="space-y-2.5 bg-white px-4 py-3.5">
        <BillRow label="Check-in" value={checkInLabel} muted />
        <BillRow label="Check-out" value={checkOutLabel} muted />
        <BillRow
          label="Guests"
          value={`${guestCount} guest${guestCount !== 1 ? "s" : ""}`}
          muted
        />
      </div>

      <ReceiptDivider />

      <div className="space-y-2.5 bg-white px-4 py-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
          Price breakdown
        </p>
        <BillRow
          label={`${formatPrice(quote.nightlyRate)} × ${quote.nights} nights`}
          value={formatPrice(quote.subtotal - quote.extraGuestCharge)}
          muted
        />
        {quote.extraGuestCharge > 0 && (
          <BillRow
            label={`Extra guest fee (${quote.extraGuests})`}
            value={formatPrice(quote.extraGuestCharge)}
            muted
          />
        )}
        <BillRow label="Subtotal" value={formatPrice(quote.subtotal)} muted />
        <BillRow
          label="Taxes & fees"
          value={formatPrice(quote.taxesFeesMock)}
          muted
        />
      </div>

      <div className="border-t border-black/8 bg-black/2 px-4 py-3.5">
        <BillRow label="Total due (EUR)" value={formatPrice(quote.total)} strong />
      </div>
    </div>
  );
};

type BookingConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listing: ListingDetail;
  stayDates: StayDates;
  guestCount: number;
  quote: AdjustedPriceQuote;
};

export const BookingConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  listing,
  stayDates,
  guestCount,
  quote,
}: BookingConfirmDialogProps) => (
  <CustomDialog
    open={open}
    onClose={onClose}
    title="Review & confirm"
    actions={
      <div className="flex w-full gap-2">
        <Button
          onClick={onClose}
          fullWidth
          className="rounded-xl! py-2! text-[13px]! font-medium! text-black/55!"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          fullWidth
          className="rounded-xl! py-2! text-[13px]! font-semibold! shadow-md!"
        >
          Confirm booking
        </Button>
      </div>
    }
  >
    <BookingBill
      listing={listing}
      stayDates={stayDates}
      guestCount={guestCount}
      quote={quote}
    />
  </CustomDialog>
);

type BookingSuccessDialogProps = {
  open: boolean;
  onClose: () => void;
  listingName: string;
  reference: string;
};

export const BookingSuccessDialog = ({
  open,
  onClose,
  listingName,
  reference,
}: BookingSuccessDialogProps) => {
  const StarsIcon = useIcon("stars");

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="You're booked"
      actions={
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          fullWidth
          className="rounded-xl! py-2.5! text-[13px]! font-semibold!"
        >
          Done
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-4 py-3 text-center">
        <span className="relative flex size-16 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-main/15 blur-md"
          />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-linear-to-br from-main/20 to-main/5 text-main ring-1 ring-main/15">
            <StarsIcon className="text-2xl" />
          </span>
        </span>
        <div className="space-y-1">
          <p className="text-[17px] font-semibold tracking-tight text-black/88">
            All set!
          </p>
          <p className="max-w-xs text-[13px] leading-relaxed text-black/50">
            Your stay at{" "}
            <span className="font-medium text-black/70">{listingName}</span> is
            confirmed.
          </p>
        </div>
        <div className="w-full rounded-xl bg-black/3 px-4 py-3 ring-1 ring-black/6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
            Reference
          </p>
          <p className="mt-0.5 font-mono text-[13px] font-medium text-black/70">
            {reference}
          </p>
        </div>
        <p className="text-[11px] text-black/38">
          Confirmation details will be sent to your email.
        </p>
      </div>
    </CustomDialog>
  );
};
