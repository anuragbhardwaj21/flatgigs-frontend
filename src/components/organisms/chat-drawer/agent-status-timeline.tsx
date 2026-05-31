import { useChat } from "@/context/chat";
import type { AssistantAgent } from "@/store/types/chat";
import cn from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";

const AGENT_LABELS: Record<string, string> = {
  concierge: "Concierge",
  retrieval: "Retrieval",
  review: "Review",
};

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

  if (!isBusy && agentTimeline.length === 0) return null;

  const showActive = activeStatus?.label || statusLabel;

  return (
    <div className="border-b border-main/10 bg-main/3 px-4 py-3">
      {showActive ? (
        <div className="mb-2 flex items-center gap-2">
          {activeStatus?.agent ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                agentColor(activeStatus.agent),
              )}
            >
              {AGENT_LABELS[activeStatus.agent] ?? activeStatus.agent}
            </span>
          ) : null}
          <span className="text-xs font-medium text-black/65">{showActive}</span>
          {activeStatus?.progress != null ? (
            <span className="ml-auto text-[10px] tabular-nums text-black/40">
              {activeStatus.progress}%
            </span>
          ) : null}
        </div>
      ) : null}

      {activeStatus?.progress != null ? (
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-black/6">
          <motion.div
            className="h-full rounded-full bg-main"
            initial={{ width: 0 }}
            animate={{ width: `${activeStatus.progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      ) : null}

      {activeStatus?.detail ? (
        <p className="mb-2 line-clamp-1 text-[11px] text-black/45">
          {activeStatus.detail}
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        <ul className="max-h-28 space-y-1 overflow-y-auto">
          {agentTimeline.slice(-6).map((step) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 text-[11px]"
            >
              <span
                className={cn(
                  "mt-1 size-1.5 shrink-0 rounded-full",
                  step.status === "active" ? "bg-main" : "bg-black/25",
                )}
              />
              <span className="text-black/55">{step.label}</span>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};

export default AgentStatusTimeline;
