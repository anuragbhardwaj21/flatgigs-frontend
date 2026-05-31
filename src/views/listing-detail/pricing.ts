import type { PriceQuote } from "@/store/types/listings";

const INCLUDED_GUESTS = 2;
const EXTRA_GUEST_NIGHTLY_RATE = 0.15;

export type AdjustedPriceQuote = PriceQuote & {
  guestCount: number;
  extraGuests: number;
  extraGuestCharge: number;
};

export const adjustQuoteForGuests = (
  quote: PriceQuote,
  guestCount: number,
): AdjustedPriceQuote => {
  const extraGuests = Math.max(0, guestCount - INCLUDED_GUESTS);
  const extraGuestCharge = Math.round(
    extraGuests * quote.nightlyRate * EXTRA_GUEST_NIGHTLY_RATE * quote.nights,
  );
  const subtotal = quote.subtotal + extraGuestCharge;
  const taxRatio =
    quote.subtotal > 0 ? quote.taxesFeesMock / quote.subtotal : 0.1;
  const taxesFeesMock = Math.round(quote.taxesFeesMock + extraGuestCharge * taxRatio);
  const total = subtotal + taxesFeesMock;

  return {
    ...quote,
    subtotal,
    taxesFeesMock,
    total,
    guestCount,
    extraGuests,
    extraGuestCharge,
  };
};
