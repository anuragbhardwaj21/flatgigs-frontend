import { api } from "../api";
import type { SearchData, SearchQuery } from "../types/search";

export const searchApi = api.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchData, SearchQuery>({
      query: (body) => ({
        url: "/v1/search",
        method: "POST",
        body,
      }),
      providesTags: [{ type: "Search", id: "RESULTS" }],
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = searchApi;

export type {
  SearchData,
  SearchFacets,
  SearchListingItem,
  SearchMapPin,
  SearchQuery,
  SearchResponse,
  SearchSort,
} from "../types/search";
