import QueryDetailSection from "@/views/search-results/query-detail-section";
import MainContent from "@/views/search-results/main-content";
import { MapResultsProvider } from "@/context/map-results";

const SearchResults = () => {
  return (
    <MapResultsProvider>
      <div className="flex flex-col gap-4">
        <QueryDetailSection />
        <div className="main-container pb-4">
          <MainContent />
        </div>
      </div>
    </MapResultsProvider>
  );
};

export default SearchResults;
