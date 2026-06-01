import type { PersistedChatTrace } from "@/context/chat/persist-traces";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { useCallback, useState } from "react";
import TraceCollapse from "./trace-collapse";
import TraceDetailPanel from "./trace-detail-panel";
import { formatRequestId, formatTraceDate } from "./utils";

type TraceCardProps = {
  trace: PersistedChatTrace;
};

const TraceCard = ({ trace }: TraceCardProps) => {
  const ChevronIcon = useIcon("chevronRight");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRequestId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trace.requestId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [trace.requestId]);

  const toggleExpanded = () => setExpanded((open) => !open);

  return (
    <article
      className="overflow-hidden rounded-2xl border select-none border-main/15 bg-white shadow-sm transition-shadow hover:shadow-md"
      onClick={toggleExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded();
        }
      }}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4">
        <button
          type="button"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-main/10 transition-colors duration-200 hover:bg-main/15"
        >
          <ChevronIcon
            className={cn(
              "text-lg text-main transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              expanded && "rotate-90",
            )}
          />
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <div
            className="cursor-pointer space-y-2 text-left"
          >
            <div className="flex flex-wrap items-center gap-2">
              <time
                dateTime={trace.createdAt}
                className="text-xs font-medium text-black/45"
              >
                {formatTraceDate(trace.createdAt)}
              </time>
              <span className="rounded-full bg-main/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-main">
                Concierge
              </span>
            </div>

            {trace.message ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-black/75">
                {trace.message}
              </p>
            ) : (
              <p className="text-sm italic text-black/40">No summary message</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <code
              className="rounded-lg border border-black/8 bg-black/4 px-2 py-1 font-mono text-[11px] text-black/60"
              title={trace.requestId}
            >
              {formatRequestId(trace.requestId)}
            </code>
            <button
              type="button"
              onClick={() => void copyRequestId()}
              className="rounded-lg px-2 py-1 text-[11px] font-semibold text-main hover:bg-main/8"
            >
              {copied ? "Copied" : "Copy ID"}
            </button>
          </div>
        </div>
      </div>

      <TraceCollapse open={expanded}>
        <TraceDetailPanel requestId={trace.requestId} />
      </TraceCollapse>
    </article>
  );
};

export default TraceCard;
