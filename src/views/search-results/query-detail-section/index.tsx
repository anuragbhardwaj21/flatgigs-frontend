import AskAiBookingBar from "@/views/dashboard/ask-ai-booking-bar";
import FiltersSection from "@/views/search-results/query-detail-section/filters-section";
import ResultViewSelection from "./result-view-selection";

const QueryDetailSection = () => {
  return (
    <div className="border-b border-dashed border-black/20 bg-background p-4 shadow-md">
      <div className="main-container flex flex-col gap-4">
        <ResultViewSelection />
        <AskAiBookingBar className="mx-auto max-w-full" />
        <FiltersSection />
      </div>
    </div>
  );
};

export default QueryDetailSection;
