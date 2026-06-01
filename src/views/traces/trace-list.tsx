import type { PersistedChatTrace } from "@/context/chat/persist-traces";
import TraceCard from "./trace-card";

type TraceListProps = {
  traces: PersistedChatTrace[];
};

const TraceList = ({ traces }: TraceListProps) => (
  <ul className="flex flex-col gap-3">
    {traces.map((trace) => (
      <li key={trace.requestId}>
        <TraceCard trace={trace} />
      </li>
    ))}
  </ul>
);

export default TraceList;
