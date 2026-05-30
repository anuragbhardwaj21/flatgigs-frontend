import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Slide,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IoCloseOutline } from "react-icons/io5";
import type { ReactNode } from "react";
import { forwardRef, useCallback, useRef } from "react";
import type { TransitionProps } from "@mui/material/transitions";
import type { SlideProps } from "@mui/material/Slide";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  transitionDirection?: SlideProps["direction"];
  fullScreen?: boolean;
};

const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  transitionDirection = "up",
  fullScreen,
}: Props) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const computedFullScreen = fullScreen ?? isSmDown;
  const paperRef = useRef<HTMLDivElement | null>(null);

  /** Avoid “Blocked aria-hidden on #root”: blur trigger before Modal hides #root, then focus dialog after Slide. */
  const onTransitionEnter = useCallback(() => {
    const a = document.activeElement;
    if (a instanceof HTMLElement && a.closest("#root")) {
      a.blur();
    }
  }, []);

  const onTransitionEntered = useCallback(() => {
    queueMicrotask(() => {
      paperRef.current?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={computedFullScreen}
      fullWidth
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          ref: paperRef,
          tabIndex: -1,
        },
        transition: {
          direction: transitionDirection,
          timeout: 220,
          onEnter: onTransitionEnter,
          onEntered: onTransitionEntered,
        } as Partial<SlideProps>,
      }}
    >
      <DialogTitle className="flex items-center justify-between pr-2">
        <span>{title}</span>
        <IconButton size="small" onClick={onClose}>
          <IoCloseOutline className="text-primary-contrast text-2xl" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CustomDialog;
