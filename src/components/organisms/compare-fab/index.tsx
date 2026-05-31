import CustomTooltip from "@/components/atoms/custom-tooltip";
import { useIcon } from "@/hooks/use-icons";
import { useAppSelector } from "@/store/hooks";
import {
  MIN_COMPARE_TO_OPEN,
  selectCanOpenCompare,
  selectCompareCount,
} from "@/store/slices/compare-slice";
import cn from "@/utils/cn";
import { ButtonBase } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

const CompareFab = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ScaleIcon = useIcon("arrowUpDown");
  const count = useAppSelector(selectCompareCount);
  const canOpen = useAppSelector(selectCanOpenCompare);

  if (count === 0 || pathname === "/compare") return null;

  const label = canOpen ? `Compare ${count} stays` : `Add ${MIN_COMPARE_TO_OPEN - count} more to compare`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        className="fixed bottom-24 right-5 z-30"
      >
        <CustomTooltip title={canOpen ? "Open compare view" : `Select at least ${MIN_COMPARE_TO_OPEN} stays`}>
          <span>
            <ButtonBase
              type="button"
              disabled={!canOpen}
              onClick={() => canOpen && navigate("/compare")}
              aria-label={label}
              className={cn(
                "flex items-center gap-2 rounded-full! px-4! py-2.5! text-sm! font-semibold! shadow-lg! transition-all!",
                canOpen
                  ? "bg-main! text-white! shadow-[0_12px_32px_-10px_color-mix(in_srgb,var(--color-main)_55%,transparent)] hover:brightness-105"
                  : "cursor-not-allowed bg-black/75 text-white/70",
              )}
            >
              <ScaleIcon className="text-lg!" />
              <span>{count}</span>
              <span className="hidden sm:inline!">Compare</span>
            </ButtonBase>
          </span>
        </CustomTooltip>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFab;
