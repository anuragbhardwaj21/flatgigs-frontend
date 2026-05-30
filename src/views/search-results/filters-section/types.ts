export type FilterOption = { value: string; label: string };

export const CHIP_FILTER_KEYS = [
  "rating",
  "propertyType",
  "amenities",
] as const;

export type ChipFilterKey = (typeof CHIP_FILTER_KEYS)[number];

export type ChipFiltersState = Record<ChipFilterKey, string[]>;

export type FiltersState = {
  priceRange: [number, number];
  chips: ChipFiltersState;
};

export type ChipFilterConfig = {
  key: ChipFilterKey;
  title: string;
  options: FilterOption[];
};
