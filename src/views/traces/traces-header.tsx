import { useIcon } from "@/hooks/use-icons";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type TracesHeaderProps = {
  traceCount: number;
};

const TracesHeader = ({ traceCount }: TracesHeaderProps) => {
  const navigate = useNavigate();
  const GraphIcon = useIcon("graph");

  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-main/10">
          <GraphIcon className="text-xl text-main" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-main/80">
            Agent observability
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-black/90">Traces</h1>
          <p className="mt-1 text-sm text-black/45">
            {traceCount === 0
              ? "Runs from AI search appear here"
              : `${traceCount} saved run${traceCount === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      <Button variant="contained" onClick={() => navigate("/")}>
        New search
      </Button>
    </header>
  );
};

export default TracesHeader;
