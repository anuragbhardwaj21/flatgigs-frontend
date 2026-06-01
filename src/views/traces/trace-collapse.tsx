import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

const collapseEase = [0.22, 1, 0.36, 1] as const;
const collapseTransition = {
  duration: 0.22,
  ease: collapseEase,
};

type TraceCollapseProps = {
  open: boolean;
  children: ReactNode;
};

const TraceCollapse = ({ open, children }: TraceCollapseProps) => (
  <AnimatePresence initial={false}>
    {open ? (
      <motion.div
        key="trace-collapse"
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{
          ...collapseTransition,
          layout: collapseTransition,
        }}
        className="overflow-hidden border-t border-main/10"
      >
        {children}
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default TraceCollapse;
