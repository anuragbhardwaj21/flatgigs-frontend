import Chips from "@/components/atoms/chips";
import BookingSearchForm from "@/views/dashboard/booking-search-form";
import AskAiBookingBar from "@/views/dashboard/ask-ai-booking-bar";
import HowItWorks from "@/views/dashboard/how-it-works";
import TopPicks from "@/views/dashboard/top-picks";

const Dashboard = () => {
  return (
    <div className="main-container select-none flex flex-col gap-6 items-center justify-start h-full py-10">
      <Chips
        startIcon="stars"
        maxWidth="fit"
        className="opacity-70!"
        text="AI-native travel, by FlatGigs"
      />
      <p className="flex flex-col items-center justify-center gap-2 text-5xl font-bold">
        <span>Find a stay you'll actually</span>
        <span className="text-main">love coming home to.</span>
      </p>
      <p className="flex items-center justify-center gap-2 text-md font-light opacity-70 -mt-2">
        Describe the trip you want. Our concierge searches, compares reviews,
        and plans the days — so you just book.
      </p>
      <BookingSearchForm />
      <AskAiBookingBar />
      <Chips
        startIcon="chat"
        maxWidth="fit"
        className="opacity-70! -mt-2"
        text="Try: 'Quiet 1-bed in Lisbon near good restaurants under €130, balcony if possible'"
      />
      <TopPicks />
      <HowItWorks />
    </div>
  );
};

export default Dashboard;
