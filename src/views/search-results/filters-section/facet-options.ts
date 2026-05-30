import type { SearchFacets } from "@/store/types/search";
import type { ChipFilterConfig, FilterOption } from "./types";

const ANY_OPTION: FilterOption = { value: "any", label: "Any" };

export const formatFacetLabel = (value: string) =>
  value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const facetRecordToOptions = (
  facets: Record<string, number> | undefined,
): FilterOption[] => {
  if (!facets) return [ANY_OPTION];

  const entries = Object.entries(facets)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  if (entries.length === 0) return [ANY_OPTION];

  return [
    ANY_OPTION,
    ...entries.map(([value]) => ({
      value,
      label: formatFacetLabel(value),
    })),
  ];
};

export const RATING_FILTER_CONFIG: ChipFilterConfig = {
  key: "rating",
  title: "Minimum rating",
  options: [
    ANY_OPTION,
    { value: "4.0", label: "4.0" },
    { value: "4.5", label: "4.5" },
    { value: "4.5+", label: "4.5+" },
  ],
};

export const buildChipFilterConfig = (
  facets?: SearchFacets | null,
): ChipFilterConfig[] => [
  RATING_FILTER_CONFIG,
  {
    key: "amenities",
    title: "Amenities",
    options: facetRecordToOptions(facets?.amenities),
  },
  {
    key: "propertyType",
    title: "Property type",
    options: facetRecordToOptions(facets?.propertyTypes),
  },
];

export const hasSelectableOptions = (options: FilterOption[]) =>
  options.length > 1;
