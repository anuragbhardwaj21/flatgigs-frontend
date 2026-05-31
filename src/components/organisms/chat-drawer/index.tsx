import CustomDrawer from "@/components/molecules/custom-drawer";
import AgentStatusTimeline from "@/components/organisms/chat-drawer/agent-status-timeline";
import ChatComposer from "@/components/organisms/chat-drawer/chat-composer";
import ChatMessageList from "@/components/organisms/chat-drawer/chat-message-list";
import { useChat } from "@/context/chat";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { ButtonBase, IconButton } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, type RefObject } from "react";

const STATUS_LABEL: Record<string, string> = {
  connecting: "Connecting",
  ready: "Online",
  idle: "Ready",
  thinking: "Thinking",
  typing: "Typing",
  clarifying: "Needs details",
  searching: "Searching",
  error: "Error",
};

const ChatDrawer = ({
  dragConstraintsRef,
}: {
  dragConstraintsRef: RefObject<HTMLElement | null>;
}) => {
  const IconChat = useIcon("chat");
  const IconClose = useIcon("close");
  const IconStars = useIcon("stars");
  const reduceMotion = useReducedMotion();
  const draggedRef = useRef(false);

  const {
    messages,
    status,
    statusLabel: statusLabelFromServer,
    isBusy,
    drawerOpen,
    setDrawerOpen,
    closeDrawer,
  } = useChat();

  const showTyping = isBusy;
  const hasActivity =
    messages.length > 0 ||
    status === "clarifying" ||
    status === "thinking" ||
    status === "typing";
  const statusLabel = statusLabelFromServer ?? STATUS_LABEL[status] ?? "Online";
  const showFabMotion = !drawerOpen && !reduceMotion;
  const needsAttention = hasActivity || isBusy;

  return (
    <>
      <motion.div
        className="fixed top-1/3 right-0 z-20 -translate-y-1/3"
        drag="y"
        dragConstraints={dragConstraintsRef}
        dragElastic={0}
        dragMomentum={false}
        animate={
          showFabMotion
            ? {
                x: needsAttention ? [0, -10, -6, 0] : [0, -5, 0],
                scale: 1,
              }
            : { x: 0, scale: 1 }
        }
        transition={
          showFabMotion
            ? {
                x: {
                  duration: needsAttention ? 2.8 : 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: needsAttention ? [0, 0.12, 0.22, 1] : [0, 0.5, 1],
                },
              }
            : { type: "spring", stiffness: 500, damping: 22 }
        }
        whileHover={reduceMotion ? undefined : { x: -8, scale: 1.12 }}
        whileDrag={reduceMotion ? undefined : { scale: 1.08, x: -10 }}
        whileTap={reduceMotion ? undefined : { x: 2, scale: 0.94 }}
        onPointerDown={() => {
          draggedRef.current = false;
        }}
        onDragStart={() => {
          draggedRef.current = true;
        }}
      >
        {showFabMotion ? (
          <>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -left-1 top-1/2 size-14 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-main) 45%, transparent), transparent 68%)",
              }}
              animate={{
                scale: [0.85, 1.15, 0.85],
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{
                duration: needsAttention ? 1.6 : 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {[0, 0.55].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-l-2xl border border-main/30"
                initial={{ scale: 1, opacity: 0.55 }}
                animate={{ scale: 1.55, opacity: 0 }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}
          </>
        ) : null}

        <ButtonBase
          className={cn(
            "relative h-12! w-12! cursor-grab! overflow-visible rounded-l-2xl! border border-r-0 border-main/15 bg-background-paper! p-2! pl-3! shadow-lg! transition-shadow! duration-300!",
            drawerOpen &&
              "shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-main)_25%,transparent)]!",
            showFabMotion &&
              "shadow-[0_4px_20px_-4px_color-mix(in_srgb,var(--color-main)_45%,transparent)]!",
          )}
          onClick={() => {
            if (draggedRef.current) return;
            setDrawerOpen(true);
          }}
          aria-label="Open AI concierge chat"
        >
          {showFabMotion ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-l-2xl"
              animate={{
                boxShadow: [
                  "0 0 0 0 color-mix(in srgb, var(--color-main) 40%, transparent)",
                  "0 0 0 6px color-mix(in srgb, var(--color-main) 0%, transparent)",
                ],
              }}
              transition={{
                duration: needsAttention ? 1.4 : 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ) : null}

          <motion.span
            className="relative inline-flex"
            animate={
              showFabMotion
                ? {
                    rotate: needsAttention ? [0, -8, 8, 0] : [0, 0, 0],
                    scale: needsAttention ? [1, 1.08, 1] : [1, 1.04, 1],
                  }
                : undefined
            }
            transition={{
              duration: needsAttention ? 0.9 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconChat className="text-2xl text-main" />
          </motion.span>

          <AnimatePresence>
            {(hasActivity || isBusy) && !drawerOpen ? (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-1 top-1 flex size-2.5 items-center justify-center"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-main/40"
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative size-2 rounded-full bg-main ring-2 ring-background-paper" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </ButtonBase>
      </motion.div>

      <CustomDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        anchor="right"
        width={550}
        panelClassName="bg-background shadow-2xl"
        backdropClassName="bg-black/20! backdrop-blur-[2px]!"
      >
        <motion.div
          initial={false}
          animate={{ opacity: drawerOpen ? 1 : 0.98 }}
          className="flex h-full min-h-0 flex-col bg-linear-to-b from-main/5 via-background-paper to-background-paper"
        >
          <header className="relative shrink-0 overflow-hidden border-b border-main/10 px-4 py-4">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-main) 30%, transparent), transparent 70%)",
              }}
              animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <motion.div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-main/20 bg-white shadow-sm"
                  animate={reduceMotion ? undefined : { rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <IconStars className="text-lg text-main" />
                </motion.div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold tracking-tight text-black/90">
                    AI Concierge
                  </h2>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={statusLabel}
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                      className="text-xs text-black/50"
                    >
                      {statusLabel}
                      {status === "clarifying" ? " — reply below" : ""}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <IconButton
                type="button"
                aria-label="Close chat"
                onClick={closeDrawer}
                size="small"
                className="shrink-0! text-black/45! hover:bg-main/10! hover:text-black/70!"
              >
                <IconClose className="text-xl" />
              </IconButton>
            </div>

            <motion.span
              layout
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                (status === "searching" ||
                  status === "thinking" ||
                  status === "typing" ||
                  status === "summarizing") &&
                  "bg-main/15 text-main",
                status === "clarifying" && "bg-amber-500/15 text-amber-800",
                status === "error" && "bg-red-500/15 text-red-700",
                (status === "ready" || status === "connecting" || status === "idle") &&
                  "bg-main/10 text-main/90",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isBusy ? "bg-main animate-pulse" : "bg-main",
                )}
              />
              {statusLabel}
            </motion.span>
          </header>

          <AgentStatusTimeline />

          <ChatMessageList
            messages={messages}
            status={status}
            isSearching={showTyping}
          />

          <ChatComposer />
        </motion.div>
      </CustomDrawer>
    </>
  );
};

export default ChatDrawer;
