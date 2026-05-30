import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";

const TOOLTIP_BG = "rgba(18, 26, 22, 0.94)";

const baseTooltipSx: SxProps<Theme> = (theme) => ({
  bgcolor: TOOLTIP_BG,
  color: theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.45)}`,
  boxShadow: `0 10px 28px ${alpha(theme.palette.common.black, 0.22)}`,
  fontSize: "0.8125rem",
  fontWeight: 500,
  lineHeight: 1.5,
  maxWidth: 280,
  px: 1.5,
  py: 1,
  borderRadius: "10px",
  backdropFilter: "blur(10px)",
});

const baseArrowSx: SxProps<Theme> = {
  color: TOOLTIP_BG,
};

const toSxArray = (sx?: SxProps<Theme>) =>
  sx ? (Array.isArray(sx) ? sx : [sx]) : [];

const mergeSlotProps = (
  slotProps?: TooltipProps["slotProps"],
): TooltipProps["slotProps"] => {
  const tooltipSlot = slotProps?.tooltip as { sx?: SxProps<Theme> } | undefined;
  const arrowSlot = slotProps?.arrow as { sx?: SxProps<Theme> } | undefined;

  const popperSlot = slotProps?.popper as
    | { modifiers?: { name: string; options?: Record<string, unknown> }[] }
    | undefined;

  return {
    ...slotProps,
    popper: {
      ...slotProps?.popper,
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, -8] },
        },
        ...(popperSlot?.modifiers ?? []),
      ],
    },
    tooltip: {
      ...slotProps?.tooltip,
      sx: [...toSxArray(baseTooltipSx), ...toSxArray(tooltipSlot?.sx)],
    },
    arrow: {
      ...slotProps?.arrow,
      sx: [...toSxArray(baseArrowSx), ...toSxArray(arrowSlot?.sx)],
    },
  };
};

const CustomTooltip = ({
  arrow = true,
  placement = "top",
  slotProps,
  ...props
}: TooltipProps) => (
  <Tooltip
    arrow={arrow}
    placement={placement}
    slotProps={mergeSlotProps(slotProps)}
    {...props}
  />
);

export default CustomTooltip;
