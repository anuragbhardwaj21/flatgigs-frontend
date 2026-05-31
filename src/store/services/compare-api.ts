import { api } from "../api";
import type { CompareRequest, CompareResponse } from "../types/compare";

export const compareApi = api.injectEndpoints({
  endpoints: (build) => ({
    compareListings: build.mutation<CompareResponse, CompareRequest>({
      query: (body) => ({
        url: "/v1/compare",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCompareListingsMutation } = compareApi;
