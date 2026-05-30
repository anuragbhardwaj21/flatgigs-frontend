import { useSearch } from "@/context/search";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { Divider } from "@mui/material";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  buildChipFilterConfig,
  hasSelectableOptions,
} from "./facet-options";
import ChipFilterRow from "./filter/chip-filter-row";
import { toggleChipSelection } from "./filter/filter-chips";
import Filter from "./filter";
import PricePerNight from "./filter/price-per-night";
import {
  clearedFiltersState,
  clearedSearchFilterPatch,
  filtersStateFromSearchInputs,
  searchFilterPatchFromFiltersState,
} from "./map-search-filters";
import type { ChipFilterKey, FiltersState } from "./types";

const FILTER_DEBOUNCE_MS = 400;

const FiltersSection = () => {
  const { searchInputs, searchData, setSearchInput, refreshSearch } = useSearch();
  const [filters, setFilters] = useState<FiltersState>(() =>
    filtersStateFromSearchInputs(searchInputs),
  );

  const chipFilterConfig = useMemo(
    () => buildChipFilterConfig(searchData?.facets),
    [searchData?.facets],
  );

  const visibleChipFilters = useMemo(
    () => chipFilterConfig.filter((config) => hasSelectableOptions(config.options)),
    [chipFilterConfig],
  );

  useEffect(() => {
    setFilters(filtersStateFromSearchInputs(searchInputs));
  }, [searchInputs.priceRange, searchInputs.chips]);

  const commitFilters = useCallback(
    (next: FiltersState) => {
      const patch = searchFilterPatchFromFiltersState(next);
      setSearchInput(patch);
      refreshSearch(patch);
    },
    [refreshSearch, setSearchInput],
  );

  const debouncedCommitFilters = useDebouncedCallback(
    commitFilters,
    FILTER_DEBOUNCE_MS,
  );

  const updateFilters = useCallback(
    (updater: (prev: FiltersState) => FiltersState) => {
      setFilters((prev) => {
        const next = updater(prev);
        debouncedCommitFilters(next);
        return next;
      });
    },
    [debouncedCommitFilters],
  );

  const setPriceRange = useCallback(
    (priceRange: [number, number]) => {
      updateFilters((prev) => ({ ...prev, priceRange }));
    },
    [updateFilters],
  );

  const handleChipChange = useCallback(
    (key: ChipFilterKey, value: string) => {
      updateFilters((prev) => ({
        ...prev,
        chips: {
          ...prev.chips,
          [key]: toggleChipSelection(prev.chips[key], value),
        },
      }));
    },
    [updateFilters],
  );

  const handleClear = useCallback(() => {
    const next = clearedFiltersState();
    const patch = clearedSearchFilterPatch();
    setFilters(next);
    setSearchInput(patch);
    refreshSearch(patch);
  }, [refreshSearch, setSearchInput]);

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-4 h-fit rounded-2xl border border-main/20 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-black/80">Filters</span>
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer select-none text-sm font-semibold text-main hover:underline"
        >
          Clear all
        </button>
      </div>

      <Filter title="Price per night">
        <PricePerNight value={filters.priceRange} onChange={setPriceRange} />
      </Filter>

      {visibleChipFilters.map(({ key, title, options }) => (
        <Fragment key={key}>
          <Divider className="opacity-40! -my-1!" />
          <ChipFilterRow
            title={title}
            options={options}
            value={filters.chips[key]}
            onChange={(value) => handleChipChange(key, value)}
          />
        </Fragment>
      ))}
    </aside>
  );
};

export default FiltersSection;
