import { useSearch } from "@/context/search";
import ListsView from "@/views/search-results/main-content/lists-view";
import MapView from "@/views/search-results/main-content/map-view";

const MainContent = () => {
  const { viewType } = useSearch();

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <ListsView />
      {viewType === "map" && <MapView />}
    </div>
  );
};

export default MainContent;
