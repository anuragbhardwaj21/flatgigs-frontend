import QueryDetailSection from "@/views/search-results/query-detail-section";
import MainContent from "@/views/search-results/main-content";

const SearchResults = () => {
  return (
    <div className="flex flex-col gap-4">
      <QueryDetailSection />
      <div className="main-container pb-4">
        <MainContent />
      </div>
    </div>
  );
};

export default SearchResults;
