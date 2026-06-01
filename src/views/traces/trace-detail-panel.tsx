import Spinner from "@/components/atoms/spinner";
import { useGetAgentTraceQuery } from "@/store/services/traces-api";
import { AnimatePresence, motion } from "motion/react";

const contentEase = [0.22, 1, 0.36, 1] as const;
const contentTransition = { duration: 0.22, ease: contentEase };

type TraceDetailPanelProps = {
  requestId: string;
};

const TraceDetailPanel = ({ requestId }: TraceDetailPanelProps) => {
  const { data, isFetching, isError, isLoading } = useGetAgentTraceQuery(
    requestId,
    { refetchOnMountOrArgChange: false },
  );

  const showLoading = isLoading || (isFetching && data == null);

  return (
    <motion.div layout transition={{ layout: contentTransition }}>
      <AnimatePresence mode="wait" initial={false}>
        {showLoading ? (
          <motion.div
            key="loading"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentTransition}
            className="flex flex-col items-center justify-center gap-3 px-4 py-10"
          >
            <div className="scale-150">
              <Spinner className="bg-main/70!" />
            </div>
            <p className="text-sm text-black/45">Loading agent trace…</p>
          </motion.div>
        ) : isError ? (
          <motion.p
            key="error"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentTransition}
            className="px-4 py-6 text-center text-sm text-error-main"
          >
            Could not load trace details. The session may have expired on the server.
          </motion.p>
        ) : (
          <motion.div
            key="content"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={contentTransition}
            className="px-4 py-4"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-main/70">
              Agent run
            </p>
            <pre className="overflow-x-auto rounded-xl border border-black/6 bg-black/3 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-black/70">
              {data != null ? JSON.stringify(data, null, 2) : "No trace data returned."}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TraceDetailPanel;
