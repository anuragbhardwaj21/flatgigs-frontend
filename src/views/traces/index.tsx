import { loadPersistedChatTraces } from "@/context/chat/persist-traces";
import { useEffect, useState } from "react";
import TraceList from "./trace-list";
import TracesEmptyState from "./traces-empty-state";
import TracesHeader from "./traces-header";

const TracesView = () => {
  const [traces, setTraces] = useState(() => loadPersistedChatTraces());

  useEffect(() => {
    setTraces(loadPersistedChatTraces());
  }, []);

  return (
    <div className="main-container pb-16 pt-8">
      <TracesHeader traceCount={traces.length} />
      {traces.length === 0 ? <TracesEmptyState /> : <TraceList traces={traces} />}
    </div>
  );
};

export default TracesView;
