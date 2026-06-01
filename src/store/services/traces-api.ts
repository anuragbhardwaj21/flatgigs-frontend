import { api } from "../api";

export type AgentTraceData = unknown;

/** Agent traces are immutable per requestId; cache aggressively in RTK + HTTP layer. */
export const TRACE_CACHE_TTL_SEC = 60 * 60 * 24;

export const tracesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAgentTrace: build.query<AgentTraceData, string>({
      query: (requestId) => `/v1/agents/traces/${encodeURIComponent(requestId)}`,
      extraOptions: { httpCache: true },
      keepUnusedDataFor: TRACE_CACHE_TTL_SEC,
      providesTags: (_result, _error, requestId) => [
        { type: "Traces", id: requestId },
      ],
    }),
  }),
});

export const { useGetAgentTraceQuery, useLazyGetAgentTraceQuery } = tracesApi;
