import { api } from "../api";
import type {
  ListingCalendar,
  ListingCalendarQuery,
  ListingDetail,
  ListingReviewsData,
  ListingReviewsQuery,
  PriceQuote,
  PriceQuoteQuery,
  TopPicksData,
} from "../types/listings";

const LISTINGS_CACHE_TTL = 300;

export type ListingCalendarArgs = { id: string } & ListingCalendarQuery;
export type ListingPriceQuoteArgs = { id: string } & PriceQuoteQuery;
export type ListingReviewsArgs = { id: string } & ListingReviewsQuery;

export const listingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTopPicks: build.query<TopPicksData, void>({
      query: () => "/v1/top-picks",
      extraOptions: { httpCache: true },
      keepUnusedDataFor: LISTINGS_CACHE_TTL,
      providesTags: [{ type: "Listings", id: "TOP_PICKS" }],
    }),

    getListingById: build.query<ListingDetail, string>({
      query: (id) => `/v1/listings/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Listings", id }],
    }),

    getListingCalendar: build.query<ListingCalendar, ListingCalendarArgs>({
      query: ({ id, from, to }) => ({
        url: `/v1/listings/${id}/calendar`,
        params: { from, to },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "Listings", id: `${id}-calendar` },
      ],
    }),

    getListingPriceQuote: build.query<PriceQuote, ListingPriceQuoteArgs>({
      query: ({ id, checkIn, checkOut }) => ({
        url: `/v1/listings/${id}/price-quote`,
        params: { checkIn, checkOut },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "Listings", id: `${id}-quote` },
      ],
    }),

    getListingReviews: build.query<ListingReviewsData, ListingReviewsArgs>({
      query: ({ id, page, limit, topic }) => ({
        url: `/v1/listings/${id}/reviews`,
        params: { page, limit, topic },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "ListingReviews", id },
      ],
    }),
  }),
});

export const {
  useGetTopPicksQuery,
  useGetListingByIdQuery,
  useGetListingCalendarQuery,
  useGetListingPriceQuoteQuery,
  useGetListingReviewsQuery,
} = listingsApi;

export type {
  ApiEnvelope,
  AspectScores,
  CalendarDay,
  ListingCalendar,
  ListingCalendarQuery,
  ListingCalendarResponse,
  ListingDetail,
  ListingDetailResponse,
  ListingReviewsData,
  ListingReviewsMeta,
  ListingReviewsQuery,
  ListingReviewsResponse,
  PriceQuote,
  PriceQuoteQuery,
  PriceQuoteResponse,
  ReviewAspects,
  ReviewItem,
  TopPick,
  TopPickCity,
  TopPicksData,
} from "../types/listings";
