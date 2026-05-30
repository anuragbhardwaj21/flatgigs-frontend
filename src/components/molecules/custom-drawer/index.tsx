import { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

export type CustomDrawerAnchor = "left" | "right";

export type CustomDrawerProps = {
  open: boolean;
  onClose: () => void;
  anchor?: CustomDrawerAnchor;
  width?: number | string;
  children: React.ReactNode;
  keepMounted?: boolean;
  panelClassName?: string;
  backdropClassName?: string;
  zIndex?: number;
  disableBackdropClick?: boolean;
};

export default function CustomDrawer({
  open,
  onClose,
  anchor = "left",
  width = 300,
  children,
  keepMounted = true,
  panelClassName = "",
  backdropClassName = "bg-background-paper/30! backdrop-blur-[1px]!",
  zIndex = 2600,
  disableBackdropClick = false,
}: CustomDrawerProps) {
  const reactId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const portalRoot = useMemo(
    () => (typeof document === "undefined" ? null : document.body),
    [],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();

        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!portalRoot) return null;

  const sideStyle = anchor === "left" ? { left: 0 } : { right: 0 };
  const fromX = anchor === "left" ? "-100%" : "100%";

  if (!keepMounted && !open) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      inert={!open ? true : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <motion.div
        className={backdropClassName}
        initial={{ opacity: open ? 1 : 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.1, ease: "linear" }}
        onClick={() => {
          if (!disableBackdropClick) onClose();
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          pointerEvents: open ? "auto" : "none",
          touchAction: open ? "none" : "manipulation",
          willChange: "opacity",
        }}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`drawer-title-${reactId}`}
        className={panelClassName}
        initial={{ x: fromX }}
        animate={{ x: open ? 0 : fromX }}
        transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width,
          maxWidth: "100vw",
          ...sideStyle,
          height: "100dvh",
          maxHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pointerEvents: open ? "auto" : "none",
          touchAction: open ? "pan-y" : "manipulation",
          WebkitTransform: "translateZ(0)",
          willChange: "transform",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          id={`drawer-title-${reactId}`}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          Drawer
        </span>

        <div
          style={{
            minHeight: 0,
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>,
    portalRoot,
  );
}
