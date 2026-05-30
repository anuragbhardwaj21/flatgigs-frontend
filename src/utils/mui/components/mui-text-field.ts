import type { ThemeOptions } from "@mui/material/styles";
import { FONT_FAMILY } from "./mui-typography";

type MuiComponents = NonNullable<ThemeOptions["components"]>;

export const muiTextField: MuiComponents["MuiTextField"] = {
  defaultProps: {
    size: "medium",
    variant: "outlined",
  },
};

export const muiOutlinedInput: MuiComponents["MuiOutlinedInput"] = {
  defaultProps: {
    notched: false,
  },
  styleOverrides: {
    root: {
      border: "1px solid var(--mui-palette-divider)",
      borderRadius: "var(--mui-shape-borderRadius)",
      transition: "border-color 0.4s ease, box-shadow 0.4s ease",

      "&:not(.MuiInputBase-multiline)": {
        height: 40,
        "&.MuiInputBase-sizeSmall": { height: 32 },
      },

      "&:hover:not(.Mui-disabled)": {
        borderColor: "var(--mui-palette-text-primary)",
      },
      "&.Mui-focused:not(.Mui-error)": {
        borderColor: "var(--mui-palette-primary-main)",
        borderWidth: 1,
      },
      "&.Mui-error": {
        borderColor: "var(--mui-palette-error-main)",
      },
      "&.Mui-disabled": {
        borderColor: "var(--mui-palette-action-disabled)",
      },
    },
    notchedOutline: {
      border: "none !important",
      "& legend": {
        display: "none",
      },
    },
    input: {
      fontFamily: FONT_FAMILY,
      padding: "0 14px",
    },
    multiline: {
      height: "auto",
      "& textarea": {
        padding: "10px 14px",
      },
    },
  },
};
