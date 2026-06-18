import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithApiResponse } from "./helper/base-query";

export const api = createApi({
  reducerPath: "zavoApi",
  baseQuery: baseQueryWithApiResponse,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  tagTypes: ["Listings", "ListingReviews", "Search", "Wishlist", "Traces"],
  keepUnusedDataFor: 900,
  endpoints: () => ({}),
});
