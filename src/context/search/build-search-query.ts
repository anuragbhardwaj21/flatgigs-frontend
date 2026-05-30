import { chipValuesForApi } from "@/store/helper/chip-selection";
import type { SearchQuery } from "@/store/types/search";
import { SEARCH_PRICE_MAX, SEARCH_PRICE_MIN } from "./constants";
import type { SearchInputs } from "./types";

const resolveRatingMin = (rating?: string[]): number | undefined => {
  if (!rating) return undefined;
  const values = chipValuesForApi(rating);
  if (values.length === 0) return undefined;
  if (values.includes("4.5+") || values.includes("4.5")) return 4.5;
  if (values.includes("4.0")) return 4.0;
  return undefined;
};

export const buildSearchQuery = (inputs: SearchInputs): SearchQuery | null => {
  const city = inputs.city.trim().toLowerCase();
  if (!city || !inputs.checkIn || !inputs.checkOut) return null;

  const query: SearchQuery = {
    city,
    checkIn: inputs.checkIn,
    checkOut: inputs.checkOut,
  };

  query.adults = inputs.adults;
  if (inputs.children != null) query.children = inputs.children;
  if (inputs.rooms != null) query.rooms = inputs.rooms;

  if (inputs.priceRange) {
    const [priceMin, priceMax] = inputs.priceRange;
    if (priceMin > SEARCH_PRICE_MIN) query.priceMin = priceMin;
    if (priceMax < SEARCH_PRICE_MAX) query.priceMax = priceMax;
  }

  const ratingMin = resolveRatingMin(inputs.chips?.rating);
  if (ratingMin != null) query.ratingMin = ratingMin;

  const propertyTypes = chipValuesForApi(inputs.chips?.propertyType ?? []);
  if (propertyTypes.length > 0) query.propertyTypes = propertyTypes;

  const amenities = chipValuesForApi(inputs.chips?.amenities ?? []);
  if (amenities.length > 0) query.amenities = amenities;

  if (inputs.sort) query.sort = inputs.sort;
  if (inputs.lat != null) query.lat = inputs.lat;
  if (inputs.lng != null) query.lng = inputs.lng;
  if (inputs.bounds) query.bounds = inputs.bounds;
  if (inputs.page != null) query.page = inputs.page;
  if (inputs.limit != null) query.limit = inputs.limit;
  if (inputs.includeMapPins != null) {
    query.includeMapPins = inputs.includeMapPins;
  }

  return query;
};
