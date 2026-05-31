import BrandIcon from "@/components/atoms/brand-icon";
import CitationChips from "@/components/organisms/chat-drawer/citation-chips";
import { useTypewriterText } from "@/hooks/use-typewriter-text";
import type { ChatMessage } from "@/store/types/chat";
import cn from "@/utils/cn";
import { Link } from "react-router-dom";

type AssistantMessageBubbleProps = {
  message: ChatMessage;
};

const AssistantMessageBubble = ({ message }: AssistantMessageBubbleProps) => {
  const { displayed } = useTypewriterText(
    message.content,
    Boolean(message.animate && message.role === "assistant"),
  );

  return (
    <div className="flex max-w-[85%] flex-col gap-1 items-start">
      <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-main/80">
        Concierge
      </span>
      <div
        className={cn(
          "rounded-2xl rounded-bl-md border border-main/12 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-black/80 shadow-sm",
        )}
      >
        {displayed}
        {message.kind === "results" && message.resultsTotal != null ? (
          <p className="mt-2 border-t border-main/10 pt-2 text-xs text-black/50">
            <Link to="/results" className="font-semibold text-main hover:underline">
              View {message.resultsTotal.toLocaleString()} matching stays →
            </Link>
          </p>
        ) : null}
      </div>
      {message.citations?.length ? (
        <CitationChips citations={message.citations} />
      ) : null}
    </div>
  );
};

export const AssistantAvatar = () => (
  <div className="mt-1 shrink-0 self-end rounded-lg bg-main/5">
    <BrandIcon />
  </div>
);

export default AssistantMessageBubble;
