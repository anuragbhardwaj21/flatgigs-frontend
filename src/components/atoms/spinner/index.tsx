import { motion } from "motion/react";
import cn from "@/utils/cn";

const OFFSET = 2;

const dots = [
  [OFFSET, OFFSET],
  [-OFFSET, OFFSET],
  [OFFSET, -OFFSET],
  [-OFFSET, -OFFSET],
];

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className="grid grid-cols-2 rounded-full gap-0.5 w-4 h-4 aspect-square shrink-0 animate-spin origin-center place-items-center">
      {dots.map(([x, y], i) => (
        <motion.div
          key={i}
          className={cn("w-1.5 h-1.5 bg-black/60 rounded-full", className)}
          initial={{ opacity: 0.5, x, y }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default Spinner;
