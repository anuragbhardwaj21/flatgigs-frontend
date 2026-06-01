import { useIcon } from "@/hooks/use-icons";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const TracesEmptyState = () => {
  const GraphIcon = useIcon("graph");
  const ChatIcon = useIcon("chat");

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-main/20 bg-white/60 py-20 text-center shadow-sm">
      <GraphIcon className="text-4xl text-main/40" />
      <p className="text-lg font-semibold text-black/75">No traces yet</p>
      <p className="max-w-md text-sm leading-relaxed text-black/50">
        Complete a concierge search that returns results. Each run&apos;s request ID
        and message are saved locally for debugging.
      </p>
      <Button
        component={Link}
        to="/"
        variant="outlined"
        startIcon={<ChatIcon className="text-lg" />}
      >
        Ask the concierge
      </Button>
    </div>
  );
};

export default TracesEmptyState;
