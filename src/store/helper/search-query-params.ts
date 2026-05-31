import type { SearchQuery } from "@/store/types/search";

const appendParam = (
  params: URLSearchParams,
  key: string,
  value: string | number | boolean,
) => {
  params.append(key, String(value));
};

const appendArray = (params: URLSearchParams, key: string, values: string[]) => {
  const sorted = [...values].sort();
  for (const item of sorted) {
    params.append(key, item);
  }
};

/** Builds GET query params for `/api/v1/search` (repeated keys for arrays). */
export const buildSearchParams = (
  query: SearchQuery,
): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {
    city: query.city,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
  };

  if (query.adults != null) params.adults = String(query.adults);
  if (query.children != null) params.children = String(query.children);
  if (query.rooms != null) params.rooms = String(query.rooms);
  if (query.priceMin != null) params.priceMin = String(query.priceMin);
  if (query.priceMax != null) params.priceMax = String(query.priceMax);
  if (query.ratingMin != null) params.ratingMin = String(query.ratingMin);
  if (query.propertyTypes?.length) {
    params.propertyTypes = [...query.propertyTypes].sort();
  }
  if (query.amenities?.length) {
    params.amenities = [...query.amenities].sort();
  }
  if (query.sort) params.sort = query.sort;
  if (query.lat != null) params.lat = String(query.lat);
  if (query.lng != null) params.lng = String(query.lng);
  if (query.bounds) params.bounds = query.bounds;
  if (query.page != null) params.page = String(query.page);
  if (query.limit != null) params.limit = String(query.limit);
  if (query.includeMapPins != null) {
    params.includeMapPins = query.includeMapPins ? "true" : "false";
  }

  return params;
};

/** Stable cache key string (sorted keys + array values). */
export const serializeSearchQueryArgs = (query: SearchQuery): string => {
  const params = new URLSearchParams();
  const built = buildSearchParams(query);
  const keys = Object.keys(built).sort();

  for (const key of keys) {
    const value = built[key];
    if (Array.isArray(value)) appendArray(params, key, value);
    else appendParam(params, key, value);
  }

  return params.toString();
};
