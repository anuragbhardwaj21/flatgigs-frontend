import type { ThemeOptions } from "@mui/material/styles";

export const muiInputLabel: NonNullable<
  ThemeOptions["components"]
>["MuiInputLabel"] = {
  defaultProps: {
    shrink: true,
  },
  styleOverrides: {
    root: {
      fontSize: "12px",
      fontWeight: 400,
      position: "static",
      transform: "none",
      maxWidth: "100%",
      marginBottom: "4px",
      pointerEvents: "auto",

      "&.MuiInputLabel-outlined": {
        position: "static",
        transform: "none",
        maxWidth: "100%",
      },
    },
    shrink: {
      position: "relative",
      display: "flex",
      marginBottom: "1px",
      marginLeft: "4px",
      transform: "none",
    },
  },
};
