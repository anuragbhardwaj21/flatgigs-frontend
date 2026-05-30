import { SEARCH_PRICE_MAX, SEARCH_PRICE_MIN } from "@/context/search/constants";
import type { SearchChipFilters, SearchInputPatch, SearchInputs } from "@/context/search/types";
import {
  CLEAR_PRICE_RANGE,
  createDefaultChipFilters,
  DEFAULT_FILTERS,
} from "./constants";
import { CHIP_FILTER_KEYS, type ChipFilterKey, type ChipFiltersState, type FiltersState } from "./types";

const mergeChipFilters = (chips?: SearchChipFilters): ChipFiltersState => {
  const merged = createDefaultChipFilters();

  if (!chips) return merged;

  for (const key of CHIP_FILTER_KEYS) {
    const selected = chips[key as ChipFilterKey];
    if (selected?.length) merged[key] = selected;
  }

  return merged;
};

const activeChipFilters = (chips: ChipFiltersState): SearchChipFilters => ({
  rating: chips.rating,
  propertyType: chips.propertyType,
  amenities: chips.amenities,
});

export const filtersStateFromSearchInputs = (
  inputs: SearchInputs,
): FiltersState => ({
  priceRange: inputs.priceRange ?? DEFAULT_FILTERS.priceRange,
  chips: mergeChipFilters(inputs.chips),
});

const isFullPriceRange = ([min, max]: [number, number]) =>
  min <= SEARCH_PRICE_MIN && max >= SEARCH_PRICE_MAX;

export const searchFilterPatchFromFiltersState = (
  filters: FiltersState,
): SearchInputPatch => ({
  priceRange: isFullPriceRange(filters.priceRange)
    ? undefined
    : filters.priceRange,
  chips: activeChipFilters(filters.chips),
});

export const clearedFiltersState = (): FiltersState => ({
  priceRange: CLEAR_PRICE_RANGE,
  chips: createDefaultChipFilters(),
});

export const clearedSearchFilterPatch = (): SearchInputPatch => ({
  priceRange: undefined,
  chips: createDefaultChipFilters(),
});
