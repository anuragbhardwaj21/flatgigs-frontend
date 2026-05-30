import { createSearchInitialValues } from "./initial-values";
import type { SearchInputs } from "./types";

const STORAGE_KEY = "flatgigs_search_inputs";

const isSearchInputs = (value: unknown): value is SearchInputs => {
  if (!value || typeof value !== "object") return false;
  const inputs = value as SearchInputs;
  return (
    typeof inputs.city === "string" &&
    typeof inputs.checkIn === "string" &&
    typeof inputs.checkOut === "string" &&
    typeof inputs.adults === "number"
  );
};

export const loadPersistedSearchInputs = (): SearchInputs => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createSearchInitialValues();
    const parsed: unknown = JSON.parse(raw);
    return isSearchInputs(parsed) ? parsed : createSearchInitialValues();
  } catch {
    return createSearchInitialValues();
  }
};

export const persistSearchInputs = (inputs: SearchInputs) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
};
