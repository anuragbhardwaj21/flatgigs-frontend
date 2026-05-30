import type { SearchQuery } from "@/store/types/search";

export type SearchChipFilterKey =
  | "rating"
  | "propertyType"
  | "amenities";

export type SearchChipFilters = Partial<
  Record<SearchChipFilterKey, string[]>
>;

export type SearchSort = NonNullable<SearchQuery["sort"]>;

export type SearchInputs = {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  priceRange?: [number, number];
  chips?: SearchChipFilters;
  sort?: SearchSort;
  page?: number;
  limit?: number;
  includeMapPins?: boolean;
  lat?: number;
  lng?: number;
  bounds?: string;
};

export type SearchInputPatch = Partial<SearchInputs>;
