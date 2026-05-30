import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getSessionToken } from "@/hooks/use-session-id";
import type { ApiEnvelope } from "../types/listings";
import getDeviceDetails from "./get-device-details";

export type ApiResponse<T = unknown> = ApiEnvelope<T>;

type BackendError = FetchBaseQueryError & {
  data?: ApiResponse<unknown> | unknown;
};

/** Set `httpCache: true` on an endpoint to enable HTTP disk cache for that GET. */
export type BaseQueryExtraOptions = {
  httpCache?: boolean;
};

const HTTP_CACHE_HEADER = "X-Http-Cache";

const getApiBaseUrl = () => {
  const base = (import.meta.env.VITE_BASE_URL_UAPI ?? "").trim().replace(/\/$/, "");
  return base ? `${base}/api` : "/api";
};

const withFetchCache = (
  args: string | FetchArgs,
  httpCache?: boolean,
): string | FetchArgs => {
  const method =
    (typeof args === "object" ? args.method : undefined)?.toUpperCase() ?? "GET";
  const cache = httpCache === true && method === "GET" ? "default" : "no-store";

  return typeof args === "string" ? { url: args, cache } : { ...args, cache };
};

export const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { extraOptions }) => {
    headers.set("Accept-Language", navigator.language || "en");

    const device = getDeviceDetails();
    if (device?.device_id) headers.set("X-Device-Id", device.device_id);
    headers.set(
      "X-Device-Type",
      device?.device_details?.mobile ? "mobile" : "desktop",
    );
    headers.set("Accept", "application/json");

    const token = getSessionToken();
    if (token) headers.set("X-Token", token);

    if ((extraOptions as BaseQueryExtraOptions | undefined)?.httpCache) {
      headers.set(HTTP_CACHE_HEADER, "1");
    }

    return headers;
  },
});

const unwrapApiData = (
  data: unknown,
): { data: unknown } | { error: BackendError } => {
  if (!data || typeof data !== "object") return { data };

  const maybe = data as Partial<ApiResponse<unknown>>;

  if (maybe.success === false) {
    const message = maybe.meta?.message || "Request failed";
    if (typeof window !== "undefined") console.error(message);
    return {
      error: {
        status: maybe.meta?.code ?? 400,
        data,
      } satisfies BackendError,
    };
  }

  if (maybe.success === true && "data" in maybe) {
    return { data: maybe.data ?? null };
  }

  return { data };
};

export const baseQueryWithApiResponse: BaseQueryFn<
  string | FetchArgs,
  unknown,
  BackendError,
  object,
  BaseQueryExtraOptions
> = async (args, api, extraOptions) => {
  const opts = extraOptions as BaseQueryExtraOptions | undefined;
  const result = await baseQuery(withFetchCache(args, opts?.httpCache), api, extraOptions);

  if ("error" in result && result.error) {
    if (import.meta.env.DEV) console.log("rtk-base-query-error", result.error);
    return result as { error: BackendError };
  }

  if (!("data" in result)) return result as { error: BackendError };

  return unwrapApiData(result.data);
};
