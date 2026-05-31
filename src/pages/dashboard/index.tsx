import AskAiBookingBar from "@/views/dashboard/ask-ai-booking-bar";
import BookingSearchForm from "@/views/dashboard/booking-search-form";
import HowItWorks from "@/views/dashboard/how-it-works";
import TopPicks from "@/views/dashboard/top-picks";
import { useIcon } from "@/hooks/use-icons";
import { motion, useReducedMotion } from "motion/react";

const EXAMPLE_PROMPT =
  "Quiet 1-bed in Lisbon near good restaurants under €130, balcony if possible";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Dashboard = () => {
  const StarsIcon = useIcon("stars");
  const ChatIcon = useIcon("chat");
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-full overflow-hidden pb-14 pt-6 sm:pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-main/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-20 h-56 w-56 rounded-full bg-main/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-32 -left-16 h-48 w-48 rounded-full bg-main/5 blur-3xl"
      />

      <div className="main-container relative z-10 flex flex-col gap-12 sm:gap-14">
        <motion.section
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          {...(reduceMotion ? {} : fadeUp(0))}
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-main/15 bg-background-paper/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-main/85 shadow-sm backdrop-blur-sm">
            <StarsIcon className="size-3 shrink-0" aria-hidden />
            AI-native travel
          </span>

          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-black/90 sm:text-5xl md:text-[3.25rem]">
            Find a stay you&apos;ll actually{" "}
            <span className="bg-linear-to-r from-main to-main/70 bg-clip-text text-transparent">
              love coming home to
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-black/50 sm:text-base">
            Describe the trip you want. Our concierge searches, compares
            reviews, and plans the days, so you just book.
          </p>
        </motion.section>

        <motion.section
          className="mx-auto w-full max-w-4xl"
          {...(reduceMotion ? {} : fadeUp(0.08))}
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-black/6 bg-background-paper/70 p-1 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <div className="rounded-[calc(1.75rem-4px)] bg-background-paper/90 px-3 py-4 sm:px-5 sm:py-5">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-main/10 text-main">
                  <StarsIcon className="size-3.5" aria-hidden />
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-black/85">
                    Plan your trip
                  </p>
                  <p className="text-[11px] text-black/45">
                    Search traditionally or ask the concierge
                  </p>
                </div>
              </div>

              <BookingSearchForm />

              <div className="my-4 flex items-center gap-3 px-1">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/8 to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">
                  or
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/8 to-transparent" />
              </div>

              <AskAiBookingBar embedded className="max-w-full pt-0" />

              <p className="mt-3 flex items-start justify-center gap-1.5 px-2 text-center text-[11px] leading-relaxed text-black/40">
                <ChatIcon
                  className="mt-0.5 size-3 shrink-0 text-main/60"
                  aria-hidden
                />
                <span>Try: &ldquo;{EXAMPLE_PROMPT}&rdquo;</span>
              </p>
            </div>
          </div>
        </motion.section>

        <motion.div {...(reduceMotion ? {} : fadeUp(0.16))}>
          <TopPicks />
        </motion.div>

        <motion.div {...(reduceMotion ? {} : fadeUp(0.22))}>
          <HowItWorks />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
