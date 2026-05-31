import { api } from "../api";
import {
  buildSearchParams,
  serializeSearchQueryArgs,
} from "../helper/search-query-params";
import type { SearchData, SearchQuery } from "../types/search";

/** Match backend `CACHE_SEARCH_TTL_SECONDS` (15 min). */
export const SEARCH_CACHE_TTL_SEC = 900;

export const searchApi = api.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchData, SearchQuery>({
      query: (params) => ({
        url: "/v1/search",
        params: buildSearchParams(params),
      }),
      extraOptions: { httpCache: true },
      keepUnusedDataFor: SEARCH_CACHE_TTL_SEC,
      serializeQueryArgs: ({ queryArgs, endpointName }) =>
        `${endpointName}(${serializeSearchQueryArgs(queryArgs)})`,
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
