import { useChat } from "@/context/chat";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { IconButton, TextField } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

const QUICK_PROMPTS = [
  "2 adults in Lisbon, June 1–5",
  "Barcelona with a pool",
  "Just show me what's available",
];

const spring = { type: "spring", stiffness: 420, damping: 26 } as const;
const DRAWER_FOCUS_DELAY_MS = 380;

const ChatComposer = () => {
  const IconSend = useIcon("send");
  const reduceMotion = useReducedMotion();
  const { sendMessage, status, isWsReady, isBusy, lastError, drawerOpen } = useChat();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const focusInput = useCallback(() => {
    const node = inputRef.current;
    if (!node || node.disabled) return;
    node.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const id = window.setTimeout(focusInput, DRAWER_FOCUS_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [drawerOpen, focusInput]);

  useEffect(() => {
    if (!drawerOpen || isBusy) return;
    focusInput();
  }, [drawerOpen, isBusy, focusInput]);

  const canSend = draft.trim().length > 0 && isWsReady && !isBusy;

  const submit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed || !isWsReady || isBusy) return;
    sendMessage(trimmed);
    setDraft("");
    window.requestAnimationFrame(focusInput);
  }, [draft, sendMessage, isWsReady, isBusy, focusInput]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    submit();
  };

  const applyQuickPrompt = (text: string) => {
    if (isWsReady && !isBusy) {
      sendMessage(text);
      return;
    }
    setDraft(text);
  };

  return (
    <div className="shrink-0 border-t border-main/10 bg-linear-to-t from-background-paper via-background-paper to-background-paper/95 px-4 pb-4 pt-3">
      <AnimatePresence initial={false}>
        {lastError ? (
          <motion.p
            key="error"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            className="mb-2 rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 text-xs text-red-700"
            role="alert"
          >
            {lastError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border w-full bg-white/80 p-1.5 shadow-sm transition-[border-color,box-shadow] duration-300",
          canSend
            ? "border-main/35 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--color-main)_40%,transparent)]"
            : "border-main",
        )}
      >
        <TextField
          inputRef={inputRef}
          multiline
          maxRows={4}
          minRows={1}
          fullWidth
          placeholder={
            isBusy
              ? status === "searching"
                ? "Finding matching stays…"
                : "Concierge is thinking…"
              : status === "clarifying"
                ? "Answer the question above…"
                : "Describe your trip or ask a follow-up…"
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!isWsReady || isBusy}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              className: "text-sm! leading-snug! text-black/80! px-2! py-2!",
            },
          }}
          sx={{ "& .MuiInputBase-root": { alignItems: "flex-end" } }}
        />
        <motion.div whileHover={canSend ? { scale: 1.05 } : undefined} whileTap={canSend ? { scale: 0.92 } : undefined} transition={spring}>
          <IconButton
            type="button"
            aria-label="Send message"
            disabled={!canSend}
            onClick={submit}
            className={cn(
              "mb-0.5! shrink-0! rounded-xl! transition-colors! duration-300!",
              canSend ? "bg-main! text-white!" : "bg-main/15! text-black/35!",
            )}
            size="small"
          >
            <IconSend className="text-lg" />
          </IconButton>
        </motion.div>
      </div>

      <p className="mt-2 text-center text-[10px] tracking-wide text-black/40">
        Enter to send · Shift+Enter for new line
      </p>

      {draft.length === 0 && !isBusy ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2.5 flex flex-wrap gap-1.5"
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => applyQuickPrompt(prompt)}
              className="rounded-full border border-main/20 bg-main/5 px-2.5 py-1 text-[11px] font-medium text-black/55 transition-colors hover:border-main/35 hover:bg-main/10 hover:text-black/75"
            >
              {prompt}
            </button>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
};

export default ChatComposer;
