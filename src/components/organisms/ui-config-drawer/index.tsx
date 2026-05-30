import { motion } from "motion/react";
import { useRef, useState, type RefObject } from "react";
import { FaGear } from "react-icons/fa6";
import { ButtonBase } from "@mui/material";
import CustomDrawer from "@/components/molecules/custom-drawer";

const UiConfigDrawer = ({
  dragConstraintsRef,
}: {
  dragConstraintsRef: RefObject<HTMLElement | null>;
}) => {
  const draggedRef = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const y = useMotionValue(uiConfigButtonY ?? 0);
  return (
    <>
      <motion.div
        className="fixed top-1/4 right-0 -translate-y-1/4 w-12 h-12 z-20 cursor-grab"
        drag="y"
        dragConstraints={dragConstraintsRef}
        dragElastic={0}
        animate={{ x: 0, scale: 1 }}
        whileHover={{ scale: 1.2, x: -5 }}
        whileDrag={{ scale: 1.5, x: -12 }}
        whileTap={{ scale: 0.9, x: 5 }}
        // style={{ y }}
        dragMomentum={false}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onPointerDown={() => {
          draggedRef.current = false;
        }}
        onDragStart={() => {
          draggedRef.current = true;
        }}
        // onDragEnd={() => setUiConfigButtonY(Math.round(y.get()))}
      >
        <ButtonBase
          className="w-12 h-12 rounded-l-full! bg-background-paper! shadow-lg! p-2! pl-3! cursor-grab!"
          onClick={() => {
            if (draggedRef.current) return;
            setDrawerOpen(true);
          }}
        >
          <FaGear className="text-main text-2xl" />
        </ButtonBase>
      </motion.div>
      <CustomDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="right"
        width={500}
      >
        <div className="border bg-background-paper p-4 h-full">
          <h1>UI Config</h1>
        </div>
      </CustomDrawer>
    </>
  );
};

export default UiConfigDrawer;
