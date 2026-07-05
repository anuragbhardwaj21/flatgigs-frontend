import BrandIcon from "@/components/atoms/brand-icon";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { Button } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { IoColorPaletteOutline } from "react-icons/io5";

const Header = () => {
  const reduceMotion = useReducedMotion();
  const showThemeHighlight = !reduceMotion;
  const IconHeart = useIcon("heart");
  const IconGraph = useIcon("graph");

  return (
    <div className="border-b border-dashed p-2 bg-background-paper">
      <div className="main-container flex items-center justify-between">
        <BrandIcon fullMode link />
        <div className="flex items-center gap-2">
          <span className="relative inline-flex">
            {showThemeHighlight ? (
              <>
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in srgb, var(--color-main) 45%, transparent), transparent 68%)",
                  }}
                  animate={{
                    opacity: [0.35, 0.7, 0.35],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {[0, 0.55].map((delay) => (
                  <motion.span
                    key={delay}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-lg border border-main/30"
                    initial={{ scale: 1, opacity: 0.55 }}
                    animate={{ scale: 1.55, opacity: 0 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay,
                    }}
                  />
                ))}
              </>
            ) : null}

            <Button
              component={Link}
              to="/theme"
              variant="text"
              color="primary"
              className={cn(
                "relative overflow-visible!",
                showThemeHighlight &&
                  "shadow-[0_4px_20px_-4px_color-mix(in_srgb,var(--color-main)_45%,transparent)]!",
              )}
              startIcon={
                <motion.span
                  className="relative inline-flex"
                  animate={
                    showThemeHighlight
                      ? { rotate: [0, -8, 8, 0] }
                      : undefined
                  }
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <IoColorPaletteOutline className="text-xl text-main" />
                </motion.span>
              }
            >
              {showThemeHighlight ? (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 color-mix(in srgb, var(--color-main) 40%, transparent)",
                      "0 0 0 6px color-mix(in srgb, var(--color-main) 0%, transparent)",
                    ],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ) : null}
              Theme
            </Button>

            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -right-1 -top-1.5 z-10 rounded-full bg-main px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.14em] text-white ring-2 ring-background-paper",
                showThemeHighlight &&
                  "shadow-[0_4px_12px_-4px_var(--color-main)]",
              )}
            >
              {showThemeHighlight ? (
                <motion.span
                  className="relative flex items-center"
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  New
                </motion.span>
              ) : (
                "New"
              )}
            </span>
          </span>
          <Button
            component={Link}
            to="/wishlist"
            variant="text"
            color="primary"
            startIcon={<IconHeart className="text-xl" />}
          >
            Wishlist
          </Button>
          <Button
            component={Link}
            to="/traces"
            variant="text"
            color="primary"
            startIcon={<IconGraph className="text-xl" />}
          >
            Traces
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
