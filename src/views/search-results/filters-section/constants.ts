import {
  DEFAULT_PRICE_RANGE,
  MAX_PRICE,
  MIN_PRICE,
} from "./filter/price-per-night";
import { CHIP_FILTER_KEYS, type ChipFiltersState, type FiltersState } from "./types";

export const createDefaultChipFilters = (): ChipFiltersState =>
  Object.fromEntries(CHIP_FILTER_KEYS.map((key) => [key, ["any"]])) as ChipFiltersState;

export const DEFAULT_FILTERS: FiltersState = {
  priceRange: DEFAULT_PRICE_RANGE,
  chips: createDefaultChipFilters(),
};

export const CLEAR_PRICE_RANGE: [number, number] = [MIN_PRICE, MAX_PRICE];
