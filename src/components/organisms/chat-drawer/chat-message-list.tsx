import BrandIcon from "@/components/atoms/brand-icon";
import Spinner from "@/components/atoms/spinner";
import AssistantMessageBubble, {
  AssistantAvatar,
} from "@/components/organisms/chat-drawer/assistant-message-bubble";
import type { ChatMessage, ChatStatus } from "@/store/types/chat";
import cn from "@/utils/cn";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const TypingIndicator = () => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    className="mr-auto flex max-w-[88%] items-end gap-2"
  >
    <AssistantAvatar />
    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-main/15 bg-main/5 px-4 py-3">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-main/50"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
      <span className="text-xs text-black/50">Concierge is working…</span>
    </div>
  </motion.div>
);

type ChatMessageListProps = {
  messages: ChatMessage[];
  status: ChatStatus;
  isSearching: boolean;
};

const ChatMessageList = ({
  messages,
  status,
  isSearching,
}: ChatMessageListProps) => {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages.length, isSearching, reduceMotion]);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
    >
      {messages.length === 0 && !isSearching ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-center"
        >
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl bg-main/5"
          >
            <BrandIcon />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-black/75">
              Your AI concierge
            </p>
            <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-black/45">
              Tell us where, when, and who is traveling. We will ask only what
              we need, then surface matching stays.
            </p>
          </div>
          {status === "connecting" ? (
            <div className="flex items-center gap-2 text-xs text-black/45">
              <Spinner />
              <span>Connecting…</span>
            </div>
          ) : null}
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <motion.li
                  key={message.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : "hidden"}
                  animate={reduceMotion ? undefined : "visible"}
                  variants={reduceMotion ? undefined : messageVariants}
                  transition={{
                    duration: 0.32,
                    ease: [0.22, 1, 0.36, 1],
                    delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.2),
                  }}
                  className={cn(
                    "flex gap-2",
                    isUser ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {isUser ? (
                    <div
                      className={cn(
                        "flex max-w-[85%] flex-col gap-1 items-end",
                      )}
                    >
                      <div className="rounded-2xl rounded-br-md bg-main px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--color-main)_55%,transparent)]">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <>
                      <AssistantAvatar />
                      <AssistantMessageBubble message={message} />
                    </>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {isSearching ? <TypingIndicator /> : null}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default ChatMessageList;
