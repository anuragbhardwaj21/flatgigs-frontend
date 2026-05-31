import {
  useGetListingByIdQuery,
  useGetListingCalendarQuery,
  useGetListingPriceQuoteQuery,
  useGetListingReviewsQuery,
} from "@/store/services/listings-api";
import type {
  ListingCalendar,
  ListingDetail,
  ListingReviewsData,
  PriceQuote,
} from "@/store/types/listings";
import { adjustQuoteForGuests, type AdjustedPriceQuote } from "@/views/listing-detail/pricing";
import { useSearch } from "@/context/search";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router-dom";

const REVIEWS_PAGE_SIZE = 10;

type StayDates = { checkIn: string; checkOut: string };
type CalendarRange = { from?: string; to?: string };

type ListingDetailContextValue = {
  listingId: string;
  listing: ListingDetail | undefined;
  isListingLoading: boolean;
  reviews: ListingReviewsData | undefined;
  reviewsPage: number;
  isReviewsLoading: boolean;
  fetchReviews: (page?: number) => void;
  stayDates: StayDates | null;
  setStayDates: (checkIn: string, checkOut: string) => void;
  priceQuote: PriceQuote | undefined;
  adjustedPriceQuote: AdjustedPriceQuote | undefined;
  isPriceQuoteLoading: boolean;
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests: number;
  calendar: ListingCalendar | undefined;
  isCalendarLoading: boolean;
  loadCalendar: (range?: CalendarRange) => void;
};

const ListingDetailContext = createContext<ListingDetailContextValue | null>(
  null,
);

export const ListingDetailProvider = ({ children }: { children: ReactNode }) => {
  const { id: listingId = "" } = useParams<{ id: string }>();
  const { searchInputs } = useSearch();

  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsEnabled, setReviewsEnabled] = useState(false);
  const [stayDates, setStayDatesState] = useState<StayDates | null>(null);
  const [guestCount, setGuestCountState] = useState(
    Math.max(1, searchInputs.adults || 1),
  );
  const [calendarRange, setCalendarRange] = useState<CalendarRange | null>(
    null,
  );

  const { data: listing, isLoading: isListingLoading } =
    useGetListingByIdQuery(listingId, { skip: !listingId });

  const maxGuests = listing?.accommodates ?? 1;

  useEffect(() => {
    setReviewsPage(1);
    setReviewsEnabled(false);
    setCalendarRange(null);
    setGuestCountState(Math.max(1, searchInputs.adults || 1));
    setStayDatesState(
      searchInputs.checkIn && searchInputs.checkOut
        ? {
            checkIn: searchInputs.checkIn,
            checkOut: searchInputs.checkOut,
          }
        : null,
    );
  }, [listingId, searchInputs.checkIn, searchInputs.checkOut, searchInputs.adults]);

  const { data: reviews, isFetching: isReviewsLoading } =
    useGetListingReviewsQuery(
      { id: listingId, page: reviewsPage, limit: REVIEWS_PAGE_SIZE },
      { skip: !listingId || !reviewsEnabled },
    );

  const { data: priceQuote, isFetching: isPriceQuoteLoading } =
    useGetListingPriceQuoteQuery(
      {
        id: listingId,
        checkIn: stayDates?.checkIn ?? "",
        checkOut: stayDates?.checkOut ?? "",
      },
      { skip: !listingId || !stayDates },
    );

  const { data: calendar, isFetching: isCalendarLoading } =
    useGetListingCalendarQuery(
      { id: listingId, ...calendarRange },
      { skip: !listingId || !calendarRange },
    );

  const fetchReviews = useCallback((page = 1) => {
    setReviewsEnabled(true);
    setReviewsPage(page);
  }, []);

  const setStayDates = useCallback((checkIn: string, checkOut: string) => {
    setStayDatesState({ checkIn, checkOut });
  }, []);

  const setGuestCount = useCallback(
    (count: number) => {
      setGuestCountState(Math.min(Math.max(1, count), maxGuests));
    },
    [maxGuests],
  );

  const adjustedPriceQuote = useMemo(
    () =>
      priceQuote ? adjustQuoteForGuests(priceQuote, guestCount) : undefined,
    [priceQuote, guestCount],
  );

  const loadCalendar = useCallback((range: CalendarRange = {}) => {
    setCalendarRange(range);
  }, []);

  const value = useMemo<ListingDetailContextValue>(
    () => ({
      listingId,
      listing,
      isListingLoading,
      reviews,
      reviewsPage,
      isReviewsLoading,
      fetchReviews,
      stayDates,
      setStayDates,
      priceQuote,
      adjustedPriceQuote,
      isPriceQuoteLoading,
      guestCount,
      setGuestCount,
      maxGuests,
      calendar,
      isCalendarLoading,
      loadCalendar,
    }),
    [
      listingId,
      listing,
      isListingLoading,
      reviews,
      reviewsPage,
      isReviewsLoading,
      fetchReviews,
      stayDates,
      setStayDates,
      priceQuote,
      adjustedPriceQuote,
      isPriceQuoteLoading,
      guestCount,
      setGuestCount,
      maxGuests,
      calendar,
      isCalendarLoading,
      loadCalendar,
    ],
  );

  return (
    <ListingDetailContext.Provider value={value}>
      {children}
    </ListingDetailContext.Provider>
  );
};

export const useListingDetail = () => {
  const context = useContext(ListingDetailContext);
  if (!context) {
    throw new Error(
      "useListingDetail must be used within ListingDetailProvider",
    );
  }
  return context;
};
