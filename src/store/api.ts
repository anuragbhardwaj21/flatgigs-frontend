import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithApiResponse } from "./helper/base-query";

export const api = createApi({
  reducerPath: "flatgigsApi",
  baseQuery: baseQueryWithApiResponse,
  tagTypes: ["Listings", "ListingReviews", "Search", "Wishlist"],
  endpoints: () => ({}),
});
