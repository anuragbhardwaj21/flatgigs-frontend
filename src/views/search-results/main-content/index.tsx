import ListsView from "@/views/search-results/main-content/lists-view";
import MapView from "@/views/search-results/main-content/map-view";

const MainContent = () => {
  return (
    <div className="flex min-h-0 flex-1 gap-4 rounded-2xl border border-main/20 bg-white p-4 shadow-lg">
      <ListsView />
      <MapView />
    </div>
  );
};

export default MainContent;
