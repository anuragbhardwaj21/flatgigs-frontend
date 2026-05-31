import Chips from "@/components/atoms/chips";
import { useSearch } from "@/context/search";
import { useIcon } from "@/hooks/use-icons";
import { AnimatePresence, motion } from "motion/react";

const AssistantChipsRow = () => {
  const StarsIcon = useIcon("stars");
  const { assistantChips } = useSearch();

  return (
    <AnimatePresence initial={false}>
      {assistantChips.length > 0 ? (
        <motion.div
          key="assistant-chips"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="inline-flex shrink-0 items-center gap-1 pr-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-main/75">
              <StarsIcon className="size-3 shrink-0" aria-hidden />
              Understood
            </span>
            {assistantChips.map((chip) => (
              <Chips
                key={chip.value}
                text={chip.label}
                variant="outlined"
                maxWidth="fit"
                className="h-7! shrink-0 border-main/15! bg-main/4! px-2! text-[11px]!"
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AssistantChipsRow;
