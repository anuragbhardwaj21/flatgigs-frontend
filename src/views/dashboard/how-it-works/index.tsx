import { useIcon } from "@/hooks/use-icons";
import type { IconName } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { motion, useReducedMotion } from "motion/react";

type StepCardProps = {
  step: number;
  icon: IconName;
  title: string;
  description: string;
  index: number;
  reduceMotion: boolean | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const StepCard = ({
  step,
  icon,
  title,
  description,
  index,
  reduceMotion,
}: StepCardProps) => {
  const Icon = useIcon(icon);

  return (
    <motion.li
      custom={index}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardVariants}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-main/15 bg-background-paper p-5",
        "shadow-sm transition-[border-color,box-shadow,transform] duration-500 ease-out",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main transition-colors duration-300 group-hover:bg-main/15">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="rounded-full border border-main/20 bg-main/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-main/80">
          Step {step}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-black/85">{title}</h3>
        <p className="text-sm leading-relaxed text-black/55">{description}</p>
      </div>
    </motion.li>
  );
};

const STEPS = [
  {
    step: 1,
    icon: "chat" as const,
    title: "Describe your trip",
    description:
      "Tell us where, when, and what matters. Quiet street, great coffee, walkable — we listen.",
  },
  {
    step: 2,
    icon: "stars" as const,
    title: "Agents do the work",
    description:
      "Our concierge searches stays, reads reviews, and compares neighbourhoods in real time.",
  },
  {
    step: 3,
    icon: "map" as const,
    title: "Book with confidence",
    description:
      "See the map, the price breakdown, and a day-by-day plan. Reserve in one click.",
  },
];

const HowItWorks = () => {
  const RouteIcon = useIcon("location");
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full pt-2">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-main/20 bg-main/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-main">
          <RouteIcon className="size-3.5 shrink-0" aria-hidden />
          How it works
        </div>
        <h2 className="max-w-xl text-2xl font-bold leading-tight text-black/85 sm:text-3xl">
          A travel concierge that actually plans
        </h2>
        <p className="max-w-lg text-sm font-light leading-relaxed text-black/55 sm:text-base">
          Three steps from idea to itinerary — no endless tabs, no spreadsheet.
        </p>
      </div>

      <ol className="relative grid gap-4 md:grid-cols-3 md:gap-5">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] top-10 hidden h-px bg-linear-to-r from-transparent via-main/25 to-transparent md:block"
        />

        {STEPS.map((step, index) => (
          <StepCard
            key={step.step}
            {...step}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </ol>
    </section>
  );
};

export default HowItWorks;
