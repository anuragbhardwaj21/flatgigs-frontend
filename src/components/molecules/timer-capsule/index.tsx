import Timer from "./timer";
import { useDayjs } from "@/hooks/use-dayjs";
import cn from "@/utils/cn";
import { motion } from "framer-motion";
import { useState } from "react";

const recessShadow =
  "[box-shadow:inset_0_4px_14px_rgb(0_0_0/0.14),inset_0_2px_4px_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.35)]";

const recessShadowDark =
  "dark:[box-shadow:inset_0_6px_18px_rgb(0_0_0/0.55),inset_0_2px_6px_rgb(0_0_0/0.45),inset_0_1px_0_rgb(255_255_255/0.06)]";

const TimerCapsule = () => {
  const dayjs = useDayjs();
  const today = dayjs().format("DD MMMM YYYY");
  const [is24Hour, setIs24Hour] = useState(false);
  return (
    <motion.div
      className={cn(
        "text-main mx-auto flex w-fit cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-lg border-2 border-black/15 bg-background-paper p-2 text-md dark:border-white/10",
        recessShadow,
        recessShadowDark,
      )}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.22,
        ease: "easeInOut",
      }}
      onClick={() => setIs24Hour(!is24Hour)}
    >
      {today}
      <Timer is24Hour={is24Hour} />
    </motion.div>
  );
};

export default TimerCapsule;
