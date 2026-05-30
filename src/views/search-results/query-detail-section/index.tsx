import AskAiBookingBar from "@/views/dashboard/ask-ai-booking-bar";
import ResultViewSelection from "./result-view-selection";

const QueryDetailSection = () => {
  return (
    <div className="border-b border-dashed border-black/20 bg-background p-4 shadow-md">
      <div className="flex gap-4 main-container flex-col items-center justify-center">
        <ResultViewSelection />
        <AskAiBookingBar className="max-w-full" />
      </div>
    </div>
  );
};

export default QueryDetailSection;
