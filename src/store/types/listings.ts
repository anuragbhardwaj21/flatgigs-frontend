export type ApiEnvelope<T> = {
  data: T | null;
  success: boolean;
  meta: {
    code: number;
    message: string;
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
};

export type AspectScores = Record<string, number>;

export type TopPickCity = {
  slug: string;
  name: string;
};

export type TopPick = {
  id: string;
  name: string;
  photo: string;
  propertyType: string;
  roomType: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  reviewSummary: string;
  city: TopPickCity;
  badge: string;
};

export type TopPicksData = {
  picks: TopPick[];
};

export type ListingDetail = {
  id: string;
  name: string;
  description: string | null;
  propertyType: string;
  roomType: string;
  accommodates: number;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  price: number | null;
  latitude: number;
  longitude: number;
  amenities: string[];
  photos: string[];
  host: {
    id: string | null;
    name: string | null;
  };
  ratingAvg: number | null;
  reviewCount: number;
  reviewSummary: string | null;
  aspectScores: AspectScores | null;
  city: {
    slug: string;
    name: string;
  };
  neighbourhood: {
    name: string;
    slug: string;
  } | null;
  sourceUrl: string | null;
};

export type ListingDetailResponse = ApiEnvelope<ListingDetail>;

export type ListingCalendarQuery = {
  from?: string;
  to?: string;
};

export type CalendarDay = {
  date: string;
  available: boolean;
  price: number | null;
};

export type ListingCalendar = {
  listingId: string;
  days: CalendarDay[];
};

export type ListingCalendarResponse = ApiEnvelope<ListingCalendar>;

export type PriceQuoteQuery = {
  checkIn: string;
  checkOut: string;
};

export type PriceQuote = {
  nights: number;
  nightlyRate: number;
  subtotal: number;
  taxesFeesMock: number;
  total: number;
  currency: "EUR";
};

export type PriceQuoteResponse = ApiEnvelope<PriceQuote>;

export type ListingReviewsQuery = {
  page?: number;
  limit?: number;
  topic?: string;
};

export type ReviewAspects = Record<string, number>;

export type ReviewItem = {
  id: string;
  date: string;
  reviewerName: string | null;
  rating: number | null;
  text: string | null;
  aspects: ReviewAspects | null;
};

export type ListingReviewsData = {
  items: ReviewItem[];
  total: number;
};

export type ListingReviewsResponse = ApiEnvelope<ListingReviewsData>;

export type ListingReviewsMeta = ApiEnvelope<ListingReviewsData>["meta"] & {
  page: number;
  limit: number;
  total: number;
};
