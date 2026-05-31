import RenderInput from "@/components/molecules/render-input";
import { useListingDetail } from "@/context/listing-detail";
import { useDayjs } from "@/hooks/use-dayjs";
import cn from "@/utils/cn";
import { Button, Skeleton } from "@mui/material";
import type { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  BookingConfirmDialog,
  BookingSuccessDialog,
} from "./booking-dialogs";
import { formatPrice } from "./format";

type OpenDateField = "checkIn" | "checkOut" | null;

const PriceLine = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) => (
  <div className="flex justify-between text-[13px] text-black/50">
    <span>{label}</span>
    {loading ? (
      <Skeleton animation="wave" width={52} height={16} />
    ) : (
      <span className="tabular-nums text-black/68">{value}</span>
    )}
  </div>
);

const BookingPanel = () => {
  const dayjs = useDayjs();
  const {
    listing,
    stayDates,
    setStayDates,
    adjustedPriceQuote,
    isPriceQuoteLoading,
    guestCount,
    setGuestCount,
    maxGuests,
    loadCalendar,
  } = useListingDetail();

  const [openDate, setOpenDate] = useState<OpenDateField>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const checkIn = stayDates ? dayjs(stayDates.checkIn) : null;
  const checkOut = stayDates ? dayjs(stayDates.checkOut) : null;
  const minCheckIn = dayjs().add(1, "day");

  useEffect(() => {
    loadCalendar({
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().add(3, "month").format("YYYY-MM-DD"),
    });
  }, [dayjs, loadCalendar]);

  const handleCheckInChange = (value: Dayjs | null) => {
    if (!value) return;
    const nextCheckOut =
      checkOut && !checkOut.isBefore(value, "day")
        ? checkOut
        : value.add(7, "day");
    setStayDates(value.format("YYYY-MM-DD"), nextCheckOut.format("YYYY-MM-DD"));
  };

  const handleCheckOutChange = (value: Dayjs | null) => {
    if (!value || !checkIn) return;
    setStayDates(checkIn.format("YYYY-MM-DD"), value.format("YYYY-MM-DD"));
  };

  const handleReserve = () => {
    if (!stayDates || !adjustedPriceQuote || !listing) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setBookingRef(`FG-${Date.now().toString(36).toUpperCase()}`);
    setSuccessOpen(true);
  };

  const nightlyRate = useMemo(
    () => adjustedPriceQuote?.nightlyRate ?? listing?.price ?? 0,
    [adjustedPriceQuote, listing?.price],
  );

  if (!listing) return null;

  const canReserve = Boolean(stayDates && adjustedPriceQuote && !isPriceQuoteLoading);

  return (
    <>
      <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
        <div className="relative overflow-hidden rounded-[1.75rem] p-px shadow-[0_16px_48px_-20px_rgba(0,0,0,0.18)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-main/20 via-main/5 to-transparent opacity-60"
          />
          <div className="relative rounded-[calc(1.75rem-1px)] bg-white/90 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-end justify-between gap-2">
              <div>
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                  From
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[1.75rem] font-bold leading-none tracking-tight text-black/92">
                    {formatPrice(nightlyRate)}
                  </span>
                  <span className="text-[13px] text-black/40">/ night</span>
                </div>
              </div>
              {adjustedPriceQuote && (
                <span className="rounded-full bg-main/10 px-2.5 py-1 text-[11px] font-semibold text-main">
                  {adjustedPriceQuote.nights} nights
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl ring-1 ring-black/6">
              <div className="grid grid-cols-2 divide-x divide-black/6 bg-white/60">
                <RenderInput
                  className="min-h-[3rem]! rounded-none! bg-transparent! px-3! py-2! hover:bg-black/3!"
                  label="CHECK IN"
                  icon="calendar"
                  render="date"
                  dateValue={checkIn}
                  onDateChange={handleCheckInChange}
                  dateOpen={openDate === "checkIn"}
                  onDateOpen={() => setOpenDate("checkIn")}
                  onDateClose={() => setOpenDate(null)}
                  minDate={minCheckIn}
                />
                <RenderInput
                  className="min-h-[3rem]! rounded-none! bg-transparent! px-3! py-2! hover:bg-black/3!"
                  label="CHECK OUT"
                  icon="calendar"
                  render="date"
                  dateValue={checkOut}
                  onDateChange={handleCheckOutChange}
                  dateOpen={openDate === "checkOut"}
                  onDateOpen={() => setOpenDate("checkOut")}
                  onDateClose={() => setOpenDate(null)}
                  minDate={checkIn?.add(1, "day") ?? minCheckIn.add(1, "day")}
                />
              </div>
              <div className="border-t border-black/6 bg-white/60">
                <RenderInput
                  className="min-h-[3rem]! rounded-none! bg-transparent! px-3! py-2! hover:bg-black/3!"
                  label="GUESTS"
                  icon="users"
                  render="guests"
                  guestCount={guestCount}
                  maxGuests={maxGuests}
                  onGuestCountChange={setGuestCount}
                />
              </div>
            </div>

            {stayDates && (
              <div className="mt-4 space-y-2 border-t border-black/6 pt-4">
                <PriceLine
                  label={`${formatPrice(adjustedPriceQuote?.nightlyRate ?? nightlyRate)} × ${adjustedPriceQuote?.nights ?? "—"} nights`}
                  value={formatPrice(
                    (adjustedPriceQuote?.subtotal ?? 0) -
                      (adjustedPriceQuote?.extraGuestCharge ?? 0),
                  )}
                  loading={isPriceQuoteLoading}
                />
                {(adjustedPriceQuote?.extraGuestCharge ?? 0) > 0 && (
                  <PriceLine
                    label={`Extra guests (${adjustedPriceQuote?.extraGuests})`}
                    value={formatPrice(adjustedPriceQuote!.extraGuestCharge)}
                    loading={isPriceQuoteLoading}
                  />
                )}
                <PriceLine
                  label="Taxes & fees"
                  value={formatPrice(adjustedPriceQuote?.taxesFeesMock ?? 0)}
                  loading={isPriceQuoteLoading}
                />
                <div className="flex justify-between border-t border-black/6 pt-2.5">
                  <span className="text-[14px] font-semibold text-black/85">
                    Total
                  </span>
                  {isPriceQuoteLoading ? (
                    <Skeleton animation="wave" width={68} height={20} />
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={adjustedPriceQuote?.total}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-[15px] font-bold tabular-nums text-black/90"
                      >
                        {formatPrice(adjustedPriceQuote?.total ?? 0)}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!canReserve}
              onClick={handleReserve}
              className={cn(
                "mt-5! rounded-2xl! py-3! text-[13px]! font-semibold! tracking-wide!",
                canReserve &&
                  "shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--color-main)_60%,transparent)]!",
              )}
            >
              Reserve
            </Button>

            <p className="mt-2.5 text-center text-[10px] tracking-wide text-black/35">
              No charge until you confirm
            </p>
          </div>
        </div>
      </aside>

      {stayDates && adjustedPriceQuote && (
        <BookingConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          listing={listing}
          stayDates={stayDates}
          guestCount={guestCount}
          quote={adjustedPriceQuote}
        />
      )}

      <BookingSuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        listingName={listing.name}
        reference={bookingRef}
      />
    </>
  );
};

export default BookingPanel;
