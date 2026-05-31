import type { SearchChipFilters, SearchInputs } from "@/context/search/types";
import {
  SEARCH_PRICE_MAX,
  SEARCH_PRICE_MIN,
} from "@/context/search/constants";
import type { AssistantChip, AssistantResultsData } from "@/store/types/chat";
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

export type AssistantSearchPayload = {
  searchData: SearchData;
  inputPatch: Partial<SearchInputs>;
};

export const buildAssistantSearchPayload = (
  data: AssistantResultsData,
): AssistantSearchPayload => {
  const inputPatch: Partial<SearchInputs> = {
    ...mapAssistantInputsToSearchInputs(
      (data as AssistantResultsData & { inputs?: AssistantSearchInputs }).inputs,
    ),
    chips: mapAssistantChipsToFilters(data.chips),
    page: 1,
  };

  return {
    searchData: normalizeAssistantResults(data),
    inputPatch,
  };
};
