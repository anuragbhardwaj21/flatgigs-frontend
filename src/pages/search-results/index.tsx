import QueryDetailSection from "@/views/search-results/query-detail-section";
import FiltersSection from "@/views/search-results/filters-section";
import MainContent from "@/views/search-results/main-content";

const SearchResults = () => {
  return (
    <div className="flex flex-col gap-4">
      <QueryDetailSection />
      <div className="flex gap-4 main-container pb-4">
        <FiltersSection />
        <MainContent />
      </div>
    </div>
  );
};

export default SearchResults;
