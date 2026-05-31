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
  hidden: { opacity: 0, y: 14 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: index * 0.07,
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
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/6",
        "bg-background-paper/80 p-4 backdrop-blur-sm",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 -right-1 text-6xl font-bold leading-none text-main/6"
      >
        {step}
      </span>

      <div className="relative flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
          Step {step}
        </span>
      </div>

      <div className="relative flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-black/85">{title}</h3>
        <p className="text-[13px] leading-relaxed text-black/50">{description}</p>
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
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full border-t border-black/5 pt-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-main/75">
            How it works
          </p>
          <h2 className="max-w-md text-xl font-bold tracking-tight text-black/85 sm:text-2xl">
            A travel concierge that actually plans
          </h2>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-black/45">
          Three steps from idea to itinerary — no endless tabs, no spreadsheet.
        </p>
      </div>

      <ol className="grid gap-3 md:grid-cols-3 md:gap-4">
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
