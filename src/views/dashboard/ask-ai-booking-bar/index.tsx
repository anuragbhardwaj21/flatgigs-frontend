import BrandIcon from "@/components/atoms/brand-icon";
import RenderInput from "@/components/molecules/render-input";
import { useChat } from "@/context/chat";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { Button } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const PLACEHOLDER_HINTS = [
  "Quiet 1-bed in Lisbon under €130, balcony if possible",
  "Family stay in Barcelona with a pool",
  "Romantic Paris weekend — Eiffel view preferred",
  "Solo work trip in Berlin, fast Wi‑Fi and desk",
];

const entrance = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
} as const;

const spring = { type: "spring", stiffness: 380, damping: 28 } as const;

type AskAiBookingBarProps = {
  className?: string;
  compact?: boolean;
  embedded?: boolean;
};

const AskAiBookingBar = ({
  className,
  compact = false,
  embedded = false,
}: AskAiBookingBarProps) => {
  const IconSend = useIcon("send");
  const IconStars = useIcon("stars");
  const reduceMotion = useReducedMotion();
  const { sendMessage, isWsReady, isBusy, lastError } = useChat();
  const [query, setQuery] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  const canSubmit = query.trim().length > 0 && isWsReady && !isBusy;

  useEffect(() => {
    if (query.trim() || reduceMotion) return;

    const id = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % PLACEHOLDER_HINTS.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [query, reduceMotion]);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed || !isWsReady || isBusy) return;
    sendMessage(trimmed);
    setQuery("");
  }, [query, sendMessage, isWsReady, isBusy]);

  if (compact) {
    return (
      <div
        className={cn(
          "relative w-full",
          className,
          !isWsReady &&
            "animate-pulse pointer-events-none cursor-not-allowed",
        )}
        aria-label="Ask AI concierge"
      >
        <div className="flex h-8 items-center gap-2 rounded-lg border border-black/6 bg-background-paper px-2">
          <IconStars className="size-3.5 shrink-0 text-main/80" aria-hidden />
          <div className="relative min-w-0 flex-1">
            <RenderInput
              render="search"
              className="min-h-0! h-7! min-w-0 rounded-none bg-transparent px-0 py-0 hover:bg-transparent [&_.MuiInputBase-input]:text-xs [&_.MuiInputBase-input]:font-medium [&_.MuiInputBase-input]:text-black/75"
              placeholder=""
              value={query}
              onValueChange={setQuery}
              onSubmit={handleSubmit}
            />
            {!query ? (
              <span className="pointer-events-none absolute inset-x-0 top-1/2 line-clamp-1 -translate-y-1/2 text-xs text-black/35">
                {PLACEHOLDER_HINTS[hintIndex]}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="text"
            color="primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
            aria-label="Send to AI concierge"
            className={cn(
              "h-6! min-w-6! shrink-0 rounded-md! p-0!",
              canSubmit ? "bg-main! text-white!" : "text-black/30!",
            )}
          >
            <IconSend size={14} />
          </Button>
        </div>
        {lastError ? (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {lastError}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative w-full",
        embedded ? "max-w-full" : "max-w-[64%] pt-2",
        className,
      )}
      {...(embedded || reduceMotion ? {} : entrance)}
    >
      {!embedded ? (
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
          className="absolute -top-0.5 left-5 z-10 inline-flex items-center gap-1 rounded-full border border-main/25 bg-background-paper px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-main shadow-sm"
        >
          <IconStars className="size-3 shrink-0" aria-hidden />
          AI Concierge
        </motion.span>
      ) : null}

      <div
        className={cn(
          "group/ai relative overflow-hidden",
          embedded ? "rounded-2xl" : "rounded-2xl p-[2px]",
          !isWsReady &&
            "opacity-80 animate-pulse pointer-events-none cursor-not-allowed",
        )}
        aria-label="Ask AI concierge"
      >
        {!embedded ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-3 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-main) 28%, transparent), transparent 70%)",
                filter: "blur(12px)",
              }}
              animate={
                reduceMotion ? undefined : { opacity: [0.45, 0.75, 0.45] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }
            />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-[-120%] opacity-50"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, color-mix(in srgb, var(--color-main) 70%, transparent) 18%, transparent 36%, color-mix(in srgb, var(--color-main) 55%, transparent) 54%, transparent 72%, color-mix(in srgb, var(--color-main) 70%, transparent) 90%, transparent 100%)",
              }}
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 7, repeat: Infinity, ease: "linear" }
              }
            />
          </>
        ) : null}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within/ai:opacity-100"
          style={{
            boxShadow: embedded
              ? "0 0 0 1px color-mix(in srgb, var(--color-main) 20%, transparent)"
              : "0 0 0 1px color-mix(in srgb, var(--color-main) 35%, transparent), 0 12px 40px -10px color-mix(in srgb, var(--color-main) 35%, transparent)",
          }}
        />

        {!reduceMotion && !embedded ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          >
            <motion.div
              className="absolute inset-y-0 w-2/5 bg-linear-to-r from-transparent via-white/35 to-transparent"
              animate={{ x: ["-120%", "280%"] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ) : null}

        <div
          className={cn(
            "relative flex h-14 items-center gap-2.5 rounded-2xl border px-3 py-1 backdrop-blur-sm",
            embedded
              ? "border-black/6 bg-black/2"
              : "rounded-[calc(1rem-2px)] border-main/10 bg-background-paper/95 shadow-lg shadow-[0_0_24px_-4px_color-mix(in_srgb,var(--color-main)_25%,transparent)] transition-shadow duration-300 group-focus-within/ai:shadow-[0_0_32px_0_color-mix(in_srgb,var(--color-main)_35%,transparent),0_16px_48px_-16px_color-mix(in_srgb,var(--color-main)_30%,transparent)]",
          )}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.06, 1], opacity: [0.88, 1, 0.88] }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            }
            className="shrink-0 [&_p]:rounded-lg! [&_p]:border-main/30! [&_p]:p-1.5! [&_svg]:text-base!"
          >
            <BrandIcon />
          </motion.div>

          <div className="h-8 w-px shrink-0 bg-main/15" aria-hidden />

          <div className="relative min-h-0 min-w-0 flex-1">
            <RenderInput
              render="search"
              className="min-h-0! h-10! min-w-0 rounded-none bg-transparent px-0 py-0 hover:bg-transparent [&_.MuiInputBase-input]:text-sm [&_.MuiInputBase-input]:font-medium [&_.MuiInputBase-input]:text-black/80"
              placeholder=""
              value={query}
              onValueChange={setQuery}
              onSubmit={handleSubmit}
            />

            <AnimatePresence mode="wait" initial={false}>
              {!query ? (
                <motion.span
                  key={hintIndex}
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-0 top-1/2 line-clamp-1 -translate-y-1/2 text-sm text-black/40"
                >
                  {PLACEHOLDER_HINTS[hintIndex]}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          <motion.div
            whileHover={canSubmit ? { scale: 1.04 } : undefined}
            whileTap={canSubmit ? { scale: 0.94 } : undefined}
            transition={spring}
          >
            <Button
              type="button"
              variant="text"
              color="primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
              aria-label="Send to AI concierge"
              className={cn(
                "h-10! min-w-10! shrink-0 rounded-xl! px-2.5! font-semibold! transition-all! duration-300!",
                canSubmit
                  ? "bg-main! text-white! shadow-[0_8px_20px_-6px_color-mix(in_srgb,var(--color-main)_55%,transparent)]!"
                  : "bg-main/20! text-black/35!",
              )}
            >
              <motion.span
                animate={
                  canSubmit && !reduceMotion
                    ? { x: [0, 1.5, 0], rotate: [0, -8, 0] }
                    : undefined
                }
                transition={
                  canSubmit && !reduceMotion
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
                className="inline-flex"
              >
                <IconSend size={18} />
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </div>

      {lastError ? (
        <p className="mt-2 text-center text-sm text-red-600" role="alert">
          {lastError}
        </p>
      ) : null}
    </motion.div>
  );
};

export default AskAiBookingBar;
