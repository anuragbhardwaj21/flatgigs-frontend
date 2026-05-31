import { useChat } from "@/context/chat";
import type { AssistantAgent } from "@/store/types/chat";
import cn from "@/utils/cn";
import { useEffect, useRef } from "react";

const AGENT_LABELS: Record<string, string> = {
  concierge: "Concierge",
  retrieval: "Retrieval",
  review: "Review",
};

const MAX_HISTORY_STEPS = 3;

const agentColor = (agent?: AssistantAgent) => {
  switch (agent) {
    case "retrieval":
      return "bg-blue-500/15 text-blue-800";
    case "review":
      return "bg-violet-500/15 text-violet-800";
    case "concierge":
    default:
      return "bg-main/12 text-main";
  }
};

const AgentStatusTimeline = () => {
  const { agentTimeline, activeStatus, isBusy, statusLabel } = useChat();
  const listRef = useRef<HTMLOListElement>(null);

  const currentLabel = activeStatus?.label ?? (isBusy ? statusLabel : null);
  const progress = activeStatus?.progress;
  const historySteps = agentTimeline
    .filter((step) => step.status === "done")
    .slice(-MAX_HISTORY_STEPS);
  const isVisible = isBusy || agentTimeline.length > 0;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [agentTimeline.length, currentLabel]);

  if (!isVisible) return null;

  return (
    <div className="shrink-0 border-b border-main/10 bg-main/3 px-4 py-2.5">
      {(currentLabel || activeStatus?.agent || progress != null) && (
        <div className="flex min-w-0 items-start gap-2">
          {activeStatus?.agent ? (
            <span
              className={cn(
                "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                agentColor(activeStatus.agent),
              )}
            >
              {AGENT_LABELS[activeStatus.agent] ?? activeStatus.agent}
            </span>
          ) : null}

          <div className="min-w-0 flex-1">
            {activeStatus?.detail ? (
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-black/45">
                {activeStatus.detail}
              </p>
            ) : null}
          </div>

          {progress != null ? (
            <span className="shrink-0 pt-0.5 text-[10px] tabular-nums text-black/40">
              {progress}%
            </span>
          ) : null}
        </div>
      )}

      {progress != null ? (
        <div
          className="mt-2 h-0.5 overflow-hidden rounded-full bg-black/6"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-main transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}

      {historySteps.length > 0 ? (
        <ol
          ref={listRef}
          className="mt-2 max-h-16 space-y-1 overflow-hidden"
          aria-label="Completed steps"
        >
          {historySteps.map((step) => (
            <li
              key={step.id}
              className="flex min-w-0 items-start gap-2 text-[10px] leading-snug text-black/40"
            >
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-black/20"
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate">{step.label}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
};

export default AgentStatusTimeline;
