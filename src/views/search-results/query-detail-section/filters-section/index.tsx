import Chips from "@/components/atoms/chips";
import CustomSelect from "@/components/molecules/custom-select";
import {
  DEFAULT_SEARCH_SORT,
  useSearch,
  type SearchSort,
} from "@/context/search";
import {
  SEARCH_PRICE_MAX,
  SEARCH_PRICE_MIN,
} from "@/context/search/constants";
import type { SearchChipFilters, SearchInputs } from "@/context/search/types";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useIcon } from "@/hooks/use-icons";
import { chipValuesForApi, toggleChipSelection } from "@/store/helper/chip-selection";
import cn from "@/utils/cn";
import {
  Autocomplete,
  Button,
  Chip,
  Popover,
  Skeleton,
  Slider,
  TextField,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const MIN_PRICE = SEARCH_PRICE_MIN;
const MAX_PRICE = SEARCH_PRICE_MAX;
const FILTER_DEBOUNCE_MS = 400;
const PANEL_EASE = [0.22, 1, 0.36, 1] as const;

type FilterOption = { value: string; label: string; count?: number };
type ChipKey = "rating" | "propertyType" | "amenities";
type ChipState = Record<ChipKey, string[]>;
type FiltersState = { priceRange: [number, number]; chips: ChipState };

const CHIP_KEYS: ChipKey[] = ["rating", "propertyType", "amenities"];

const RATING_OPTIONS: FilterOption[] = [
  { value: "any", label: "Any rating" },
  { value: "4.0", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
  { value: "4.5+", label: "4.5+ (strict)" },
];

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "popularity", label: "Popular" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
  { value: "distance", label: "Distance" },
];

const defaultChips = (): ChipState =>
  Object.fromEntries(CHIP_KEYS.map((key) => [key, ["any"]])) as ChipState;

const formatFacetLabel = (value: string) =>
  value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const facetToOptions = (facets?: Record<string, number>): FilterOption[] =>
  Object.entries(facets ?? {})
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({
      value,
      label: formatFacetLabel(value),
      count,
    }));

const isFullPriceRange = ([min, max]: [number, number]) =>
  min <= MIN_PRICE && max >= MAX_PRICE;

const isPriceActive = (range: [number, number]) =>
  range[0] > MIN_PRICE || range[1] < MAX_PRICE;

const mergeChips = (chips?: SearchChipFilters): ChipState => {
  const merged = defaultChips();
  if (!chips) return merged;
  for (const key of CHIP_KEYS) {
    if (chips[key]?.length) merged[key] = chips[key]!;
  }
  return merged;
};

const filtersFromInputs = (inputs: SearchInputs): FiltersState => ({
  priceRange: inputs.priceRange ?? [MIN_PRICE, MAX_PRICE],
  chips: mergeChips(inputs.chips),
});

const patchFromFilters = (filters: FiltersState) => ({
  priceRange: isFullPriceRange(filters.priceRange)
    ? undefined
    : filters.priceRange,
  chips: filters.chips,
});

const optionsFromValues = (
  values: string[],
  options: FilterOption[],
): FilterOption[] =>
  chipValuesForApi(values)
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is FilterOption => Boolean(option));

const formatPrice = (value: number) =>
  value >= MAX_PRICE ? `€${value}+` : `€${value}`;

const fieldSx = {
  minWidth: 168,
  "& .MuiOutlinedInput-root": {
    minHeight: 40,
    borderRadius: 9999,
    fontSize: "0.875rem",
    fontWeight: 600,
    bgcolor: "background.paper",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.08)" },
    "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.14)" },
    "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1 },
  },
  "& .MuiAutocomplete-tag": { mx: 0.25 },
};

const sliderSx = {
  mt: 1,
  color: "primary.main",
  "& .MuiSlider-thumb": { width: 14, height: 14 },
  "& .MuiSlider-rail": { opacity: 0.25, bgcolor: "primary.main" },
  "& .MuiSlider-track": { border: "none" },
};

const panelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.42, ease: PANEL_EASE },
};

export const FiltersSkeleton = () => (
  <motion.div
    {...panelMotion}
    className="rounded-xl border border-black/6 bg-background-paper/90 px-3 py-2"
    aria-busy="true"
    aria-label="Loading filters"
  >
    <div className="mb-3 flex items-center justify-between">
      <Skeleton variant="text" width={72} height={22} animation="wave" />
      <Skeleton variant="text" width={64} height={20} animation="wave" />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {[88, 120, 168, 180].map((width, index) => (
          <Skeleton
            key={`filter-chip-skeleton-${index}`}
            variant="rounded"
            animation="wave"
            width={width}
            height={40}
            className="rounded-full!"
          />
        ))}
      </div>
      <Skeleton
        variant="rounded"
        animation="wave"
        width={220}
        height={40}
        className="rounded-full!"
      />
    </div>
  </motion.div>
);

const FiltersSection = () => {
  const ChevronIcon = useIcon("chevronRight");
  const { searchInputs, searchData, fetchSearch, isSearching, inputsRevision } =
    useSearch();
  const [filters, setFilters] = useState<FiltersState>(() =>
    filtersFromInputs(searchInputs),
  );
  const [priceAnchor, setPriceAnchor] = useState<HTMLElement | null>(null);

  const amenityOptions = useMemo(
    () => facetToOptions(searchData?.facets?.amenities),
    [searchData?.facets?.amenities],
  );
  const propertyOptions = useMemo(
    () => facetToOptions(searchData?.facets?.propertyTypes),
    [searchData?.facets?.propertyTypes],
  );

  const sort = searchInputs.sort ?? DEFAULT_SEARCH_SORT;
  const showSkeleton = isSearching && !searchData;

  const commitFilters = useCallback(
    (next: FiltersState) => {
      fetchSearch(patchFromFilters(next));
    },
    [fetchSearch],
  );

  const { debounced: debouncedCommit, cancel: cancelDebouncedCommit } =
    useDebouncedCallback(commitFilters, FILTER_DEBOUNCE_MS);

  useEffect(() => {
    cancelDebouncedCommit();
    setFilters(filtersFromInputs(searchInputs));
  }, [inputsRevision, cancelDebouncedCommit, searchInputs]);

  const updateFilters = useCallback(
    (updater: (prev: FiltersState) => FiltersState) => {
      setFilters((prev) => {
        const next = updater(prev);
        debouncedCommit(next);
        return next;
      });
    },
    [debouncedCommit],
  );

  const setPriceRange = useCallback(
    (priceRange: [number, number]) => {
      updateFilters((prev) => ({ ...prev, priceRange }));
    },
    [updateFilters],
  );

  const setChipValues = useCallback(
    (key: ChipKey, values: string[]) => {
      updateFilters((prev) => ({
        ...prev,
        chips: { ...prev.chips, [key]: values.length ? values : ["any"] },
      }));
    },
    [updateFilters],
  );

  const handleClear = useCallback(() => {
    const next: FiltersState = {
      priceRange: [MIN_PRICE, MAX_PRICE],
      chips: defaultChips(),
    };
    setFilters(next);
    fetchSearch({ priceRange: undefined, chips: defaultChips() });
  }, [fetchSearch]);

  const handleSortChange = useCallback(
    (nextSort: string) => {
      fetchSearch({ sort: nextSort as SearchSort });
    },
    [fetchSearch],
  );

  const activeCount = useMemo(() => {
    let count = 0;
    if (isPriceActive(filters.priceRange)) count += 1;
    if (!filters.chips.rating.includes("any")) count += 1;
    count += chipValuesForApi(filters.chips.amenities).length;
    count += chipValuesForApi(filters.chips.propertyType).length;
    return count;
  }, [filters]);

  const ratingValue =
    filters.chips.rating.find((value) => value !== "any") ?? "any";
  const selectedAmenities = useMemo(
    () => optionsFromValues(filters.chips.amenities, amenityOptions),
    [filters.chips.amenities, amenityOptions],
  );
  const selectedPropertyTypes = useMemo(
    () => optionsFromValues(filters.chips.propertyType, propertyOptions),
    [filters.chips.propertyType, propertyOptions],
  );

  const priceOpen = Boolean(priceAnchor);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {showSkeleton ? (
          <FiltersSkeleton key="filters-skeleton" />
        ) : (
          <motion.div
            key="filters-content"
            {...panelMotion}
            className="rounded-xl border border-black/6 bg-background-paper/90 px-3 py-2"
          >
            <div className="mb-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleClear}
                disabled={activeCount === 0}
                className="cursor-pointer select-none text-xs font-semibold text-main hover:underline disabled:cursor-default disabled:text-black/30 disabled:no-underline"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outlined"
                onClick={(event) => setPriceAnchor(event.currentTarget)}
                className={cn(
                  "h-8! shrink-0 rounded-full! border-black/8! bg-background-paper! px-3! text-xs! font-semibold! normal-case! text-black/80!",
                  isPriceActive(filters.priceRange) &&
                    "border-main/45! bg-main/5! text-black/90!",
                  priceOpen && "border-main! ring-2! ring-main/15!",
                )}
                endIcon={
                  <ChevronIcon
                    className={cn(
                      "size-3.5 text-black/45 transition-transform",
                      priceOpen && "rotate-90",
                    )}
                  />
                }
              >
                Price
                {isPriceActive(filters.priceRange) ? (
                  <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-main px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    1
                  </span>
                ) : null}
              </Button>

              <Popover
                open={priceOpen}
                anchorEl={priceAnchor}
                onClose={() => setPriceAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 0.75,
                      width: 280,
                      borderRadius: 3,
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)",
                      p: 2,
                    },
                  },
                }}
              >
                <p className="mb-1 text-xs font-semibold tracking-wide text-black/55 uppercase">
                  Price per night
                </p>
                <span className="text-xs font-medium text-black/55">
                  {formatPrice(filters.priceRange[0])} –{" "}
                  {formatPrice(filters.priceRange[1])}
                </span>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, next) =>
                    setPriceRange(next as [number, number])
                  }
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={10}
                  disableSwap
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                  sx={sliderSx}
                />
              </Popover>

              <CustomSelect
                value={ratingValue}
                onChange={(value) =>
                  setChipValues("rating", value === "any" ? [] : [value])
                }
                startIcon="star"
                options={RATING_OPTIONS}
                minWidth={220}
              />

              {amenityOptions.length > 0 ? (
                <Autocomplete
                  multiple
                  size="small"
                  options={amenityOptions}
                  value={selectedAmenities}
                  onChange={(_, next) =>
                    setChipValues(
                      "amenities",
                      next.map((option) => option.value),
                    )
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  disableCloseOnSelect
                  limitTags={1}
                  sx={{ ...fieldSx, minWidth: 180, maxWidth: 260 }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.count != null ? (
                        <span className="ml-2 text-xs text-black/40 tabular-nums">
                          {option.count}
                        </span>
                      ) : null}
                    </li>
                  )}
                  renderValue={(value, getItemProps) =>
                    (value as FilterOption[]).map((option, index) => (
                      <Chip
                        {...getItemProps({ index })}
                        key={option.value}
                        label={option.label}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        selectedAmenities.length === 0 ? "Amenities" : undefined
                      }
                    />
                  )}
                />
              ) : null}

              {propertyOptions.length > 0 ? (
                <Autocomplete
                  multiple
                  size="small"
                  options={propertyOptions}
                  value={selectedPropertyTypes}
                  onChange={(_, next) =>
                    setChipValues(
                      "propertyType",
                      next.map((option) => option.value),
                    )
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  disableCloseOnSelect
                  limitTags={1}
                  sx={{ ...fieldSx, minWidth: 180, maxWidth: 260 }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.count != null ? (
                        <span className="ml-2 text-xs text-black/40 tabular-nums">
                          {option.count}
                        </span>
                      ) : null}
                    </li>
                  )}
                  renderValue={(value, getItemProps) =>
                    (value as FilterOption[]).map((option, index) => (
                      <Chip
                        {...getItemProps({ index })}
                        key={option.value}
                        label={option.label}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        selectedPropertyTypes.length === 0
                          ? "Property type"
                          : undefined
                      }
                    />
                  )}
                />
              ) : null}

              <div className="ml-auto shrink-0">
                <CustomSelect
                  value={sort}
                  onChange={handleSortChange}
                  startIcon="arrowUpDown"
                  options={SORT_OPTIONS}
                  minWidth={220}
                />
              </div>
            </div>

            {activeCount > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-dashed border-black/10 pt-3">
                {isPriceActive(filters.priceRange) ? (
                  <Chips
                    text={`${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`}
                    variant="contained"
                    maxWidth="fit"
                    startIcon="close"
                    onClick={() => setPriceRange([MIN_PRICE, MAX_PRICE])}
                    aria-label="Remove price filter"
                  />
                ) : null}
                {!filters.chips.rating.includes("any") ? (
                  <Chips
                    text={`Rating ${ratingValue}`}
                    variant="contained"
                    maxWidth="fit"
                    startIcon="close"
                    onClick={() => setChipValues("rating", [])}
                    aria-label="Remove rating filter"
                  />
                ) : null}
                {chipValuesForApi(filters.chips.amenities).map((value) => (
                  <Chips
                    key={`amenity-${value}`}
                    text={formatFacetLabel(value)}
                    variant="contained"
                    maxWidth="lg"
                    startIcon="close"
                    onClick={() =>
                      setChipValues(
                        "amenities",
                        toggleChipSelection(filters.chips.amenities, value),
                      )
                    }
                    aria-label={`Remove ${formatFacetLabel(value)} filter`}
                  />
                ))}
                {chipValuesForApi(filters.chips.propertyType).map((value) => (
                  <Chips
                    key={`property-${value}`}
                    text={formatFacetLabel(value)}
                    variant="contained"
                    maxWidth="lg"
                    startIcon="close"
                    onClick={() =>
                      setChipValues(
                        "propertyType",
                        toggleChipSelection(filters.chips.propertyType, value),
                      )
                    }
                    aria-label={`Remove ${formatFacetLabel(value)} filter`}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiltersSection;
