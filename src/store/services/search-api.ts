import { api } from "../api";
import type { SearchData, SearchQuery } from "../types/search";

const SEARCH_CACHE_TTL = 300;

export const searchApi = api.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchData, SearchQuery>({
      query: (body) => ({
        url: "/v1/search",
        method: "POST",
        extraOptions: { httpCache: true },
        keepUnusedDataFor: SEARCH_CACHE_TTL,
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
