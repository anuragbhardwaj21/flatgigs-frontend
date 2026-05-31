import AskAiBookingBar from "@/views/dashboard/ask-ai-booking-bar";
import { useSearch } from "@/context/search";
import {
  SEARCH_PRICE_MAX,
  SEARCH_PRICE_MIN,
} from "@/context/search/constants";
import type { SearchInputs } from "@/context/search/types";
import { chipValuesForApi } from "@/store/helper/chip-selection";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AssistantChipsRow from "./assistant-chips-row";
import FiltersSection from "./filters-section";
import SearchCriteriaBar from "./search-criteria-bar";

const countActiveFilters = (searchInputs: SearchInputs) => {
  let count = 0;
  const range = searchInputs.priceRange ?? [SEARCH_PRICE_MIN, SEARCH_PRICE_MAX];
  if (range[0] > SEARCH_PRICE_MIN || range[1] < SEARCH_PRICE_MAX) count += 1;
  if (!searchInputs.chips?.rating?.includes("any")) count += 1;
  count += chipValuesForApi(searchInputs.chips?.amenities ?? []).length;
  count += chipValuesForApi(searchInputs.chips?.propertyType ?? []).length;
  return count;
};

const QueryDetailSection = () => {
  const { searchInputs } = useSearch();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = useMemo(
    () => countActiveFilters(searchInputs),
    [searchInputs],
  );

  return (
    <section className="border-b border-black/5 bg-background-paper/60 px-4 py-2 backdrop-blur-sm">
      <div className="main-container flex flex-col gap-1.5">
        <SearchCriteriaBar
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((open) => !open)}
          activeFilterCount={activeFilterCount}
        />

        <AssistantChipsRow />

        <AskAiBookingBar compact className="max-w-full" />

        <AnimatePresence initial={false}>
          {filtersOpen ? (
            <motion.div
              key="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <FiltersSection />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QueryDetailSection;
