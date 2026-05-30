import { buttonClasses } from "@mui/material/Button";
import type { ThemeOptions } from "@mui/material/styles";
import { createElement } from "react";
import Spinner from "../../../components/atoms/spinner";
import { FONT_FAMILY } from "./mui-typography";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

const loadingPositions = `&.${buttonClasses.loadingPositionStart}, &.${buttonClasses.loadingPositionEnd}`;
const loadingIcons = `& .${buttonClasses.startIcon}, & .${buttonClasses.endIcon}`;

export const muiButton: NonNullable<ThemeOptions["components"]>["MuiButton"] = {
  defaultProps: {
    loadingIndicator: createElement(Spinner),
    loadingPosition: "start",
  },
  styleOverrides: {
    root: {
      fontFamily: FONT_FAMILY,
      height: 40,

      [loadingPositions]: {
        columnGap: 8,
        "&::before": {
          display: "none",
        },
        [loadingIcons]: {
          display: "none",
        },
        [`& .${buttonClasses.loadingIndicator}`]: {
          position: "static",
          transform: "none",
        },
      },

      [`&.${buttonClasses.sizeSmall}`]: {
        height: 32,
      },
      [`&.${buttonClasses.sizeLarge}`]: {
        height: 48,
      },
    },
  },
  variants: [
    {
      props: { variant: "dashed" },
      style: {
        color: "var(--mui-palette-primary-main)",
        border: "1px dashed currentColor",
        backgroundColor: "transparent",

        "&:hover": {
          backgroundColor:
            "color-mix(in srgb, var(--mui-palette-primary-main) 8%, transparent)",
        },
        [`&.${buttonClasses.disabled}`]: {
          color: "var(--mui-palette-action-disabled)",
        },
      },
    },
  ],
};
