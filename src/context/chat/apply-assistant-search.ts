import type { SearchChipFilters, SearchInputs } from "@/context/search/types";
import {
  SEARCH_PRICE_MAX,
  SEARCH_PRICE_MIN,
} from "@/context/search/constants";
import type {
  AssistantChip,
  AssistantResultsData,
  AssistantSelectedFacets,
} from "@/store/types/chat";
import type { SearchData } from "@/store/types/search";
import { normalizeAssistantResults } from "./normalize-chat-search";

const defaultChipState = (): SearchChipFilters => ({
  rating: ["any"],
  propertyType: ["any"],
  amenities: ["any"],
});

const parseChipValue = (
  value: string,
): { key: keyof SearchChipFilters; token: string } | null => {
  const colon = value.indexOf(":");
  if (colon <= 0) return null;
  const prefix = value.slice(0, colon);
  const token = value.slice(colon + 1);
  if (!token) return null;

  switch (prefix) {
    case "rating":
      return { key: "rating", token };
    case "propertyType":
    case "property":
    case "roomType":
      return { key: "propertyType", token };
    case "amenity":
    case "amenities":
      return { key: "amenities", token };
    default:
      return null;
  }
};

export const mapAssistantChipsToFilters = (
  chips?: AssistantChip[] | unknown,
): SearchChipFilters => {
  const merged = defaultChipState();
  if (!Array.isArray(chips)) return merged;

  for (const chip of chips) {
    if (!chip || typeof chip !== "object") continue;
    const value = "value" in chip ? String((chip as AssistantChip).value ?? "") : "";
    const parsed = parseChipValue(value);
    if (!parsed) continue;

    const current = merged[parsed.key] ?? ["any"];
    if (current.includes("any")) {
      merged[parsed.key] = [parsed.token];
    } else if (!current.includes(parsed.token)) {
      merged[parsed.key] = [...current, parsed.token];
    }
  }

  return merged;
};

export const partitionAssistantChips = (
  chips?: AssistantChip[] | unknown,
): { filterChips: AssistantChip[]; displayChips: AssistantChip[] } => {
  const filterChips: AssistantChip[] = [];
  const displayChips: AssistantChip[] = [];

  if (!Array.isArray(chips)) {
    return { filterChips, displayChips };
  }

  for (const chip of chips) {
    if (!chip || typeof chip !== "object") continue;
    const value = "value" in chip ? String((chip as AssistantChip).value ?? "") : "";
    if (parseChipValue(value)) {
      filterChips.push(chip as AssistantChip);
    } else {
      displayChips.push(chip as AssistantChip);
    }
  }

  return { filterChips, displayChips };
};

export type AssistantSearchInputs = Partial<SearchInputs> & {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
};

export const mapAssistantInputsToSearchInputs = (
  inputs?: AssistantSearchInputs | null,
): Partial<SearchInputs> => {
  if (!inputs || typeof inputs !== "object") return {};

  const patch: Partial<SearchInputs> = {};

  if (typeof inputs.city === "string" && inputs.city.trim()) {
    patch.city = inputs.city.trim();
  }
  if (typeof inputs.checkIn === "string") patch.checkIn = inputs.checkIn;
  if (typeof inputs.checkOut === "string") patch.checkOut = inputs.checkOut;
  if (typeof inputs.adults === "number") patch.adults = inputs.adults;
  if (typeof inputs.children === "number") patch.children = inputs.children;
  if (typeof inputs.rooms === "number") patch.rooms = inputs.rooms;

  if (inputs.priceMin != null || inputs.priceMax != null) {
    patch.priceRange = [
      inputs.priceMin ?? SEARCH_PRICE_MIN,
      inputs.priceMax ?? SEARCH_PRICE_MAX,
    ];
  }

  return patch;
};

const ratingTokenFromMin = (ratingMin: number): string => {
  if (ratingMin >= 4.5) return "4.5";
  if (ratingMin >= 4.0) return "4.0";
  return String(ratingMin);
};

export const mapSelectedFacetsToSearchInputs = (
  selected?: AssistantSelectedFacets | null,
): Partial<SearchInputs> => {
  if (!selected || typeof selected !== "object") return {};

  const patch: Partial<SearchInputs> = {};

  if (typeof selected.city === "string" && selected.city.trim()) {
    patch.city = selected.city.trim();
  }

  if (selected.dates && typeof selected.dates === "object") {
    if (selected.dates.checkIn) patch.checkIn = selected.dates.checkIn;
    if (selected.dates.checkOut) patch.checkOut = selected.dates.checkOut;
  }

  if (selected.guests && typeof selected.guests === "object") {
    if (selected.guests.adults != null) patch.adults = selected.guests.adults;
    if (selected.guests.children != null) patch.children = selected.guests.children;
    if (selected.guests.rooms != null) patch.rooms = selected.guests.rooms;
  }

  const price = selected.priceRange;
  if (price && (price.min != null || price.max != null)) {
    patch.priceRange = [
      price.min ?? SEARCH_PRICE_MIN,
      price.max ?? SEARCH_PRICE_MAX,
    ];
  }

  const chips = defaultChipState();
  let hasActiveChips = false;

  if (selected.ratingMin != null && selected.ratingMin > 0) {
    chips.rating = [ratingTokenFromMin(selected.ratingMin)];
    hasActiveChips = true;
  }

  const propertyTypes = Object.entries(selected.propertyTypes ?? {})
    .filter(([, active]) => active)
    .map(([key]) => key);
  if (propertyTypes.length > 0) {
    chips.propertyType = propertyTypes;
    hasActiveChips = true;
  }

  const amenities = Object.entries(selected.amenities ?? {})
    .filter(([, active]) => active)
    .map(([key]) => key);
  if (amenities.length > 0) {
    chips.amenities = amenities;
    hasActiveChips = true;
  }

  if (hasActiveChips) {
    patch.chips = chips;
  }

  return patch;
};

export const mapSelectedFacetsToDisplayChips = (
  selected?: AssistantSelectedFacets | null,
): AssistantChip[] => {
  if (!selected || typeof selected !== "object") return [];

  const chips: AssistantChip[] = [];

  if (typeof selected.vibe === "string" && selected.vibe.trim()) {
    const vibe = selected.vibe.trim();
    chips.push({ label: vibe, value: `vibe:${vibe.toLowerCase()}` });
  }

  if (typeof selected.areaPreference === "string" && selected.areaPreference.trim()) {
    const area = selected.areaPreference.trim();
    chips.push({ label: area, value: `area:${area.toLowerCase()}` });
  }

  return chips;
};

const mergeDisplayChips = (...groups: AssistantChip[][]): AssistantChip[] => {
  const byValue = new Map<string, AssistantChip>();
  for (const group of groups) {
    for (const chip of group) {
      if (chip?.value) byValue.set(chip.value, chip);
    }
  }
  return [...byValue.values()];
};

export type AssistantSearchPayload = {
  searchData?: SearchData;
  inputPatch: Partial<SearchInputs>;
  displayChips: AssistantChip[];
};

export const buildAssistantSearchPayload = (
  data: Pick<
    AssistantResultsData,
    "items" | "total" | "chips" | "inputs" | "mapPins" | "facets" | "meta" | "selectedFacets"
  > & {
    items?: AssistantResultsData["items"];
    total?: number;
  },
): AssistantSearchPayload => {
  const { filterChips, displayChips: chipDisplayChips } = partitionAssistantChips(data.chips);
  const inputsPatch = mapAssistantInputsToSearchInputs(data.inputs);
  const selectedPatch = mapSelectedFacetsToSearchInputs(data.selectedFacets);
  const fallbackChipFilters = mapAssistantChipsToFilters(
    filterChips.length ? filterChips : data.chips,
  );

  const inputPatch: Partial<SearchInputs> = {
    ...inputsPatch,
    ...selectedPatch,
    chips: selectedPatch.chips ?? fallbackChipFilters,
    page: 1,
  };

  const displayChips = mergeDisplayChips(
    mapSelectedFacetsToDisplayChips(data.selectedFacets),
    chipDisplayChips,
  );

  const hasResultItems = Array.isArray(data.items) && data.items.length > 0;

  return {
    searchData: hasResultItems
      ? normalizeAssistantResults(data as AssistantResultsData)
      : undefined,
    inputPatch,
    displayChips,
  };
};
