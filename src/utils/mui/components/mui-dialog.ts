import type { ThemeOptions } from "@mui/material/styles";

export const muiDialog: NonNullable<ThemeOptions["components"]>["MuiDialog"] = {
  defaultProps: {
    scroll: "paper",
    fullWidth: true,
    maxWidth: "sm",
  },

  styleOverrides: {
    root: {
      "& .MuiBackdrop-root": {
        backgroundColor:
          "color-mix(in srgb, var(--mui-palette-common-black) 40%, transparent)",
      },
    },

    paper: ({ theme }) => ({
      backgroundImage: "none",
      backgroundColor: "var(--mui-palette-background-paper)",
      color: "var(--mui-palette-text-primary)",
      border: "1px solid var(--mui-palette-divider)",
      // borderRadius: "calc(var(--mui-shape-borderRadius) * 2)",
      boxShadow: "var(--mui-shadows-24)",
      outline:
        "8px solid color-mix(in srgb, var(--mui-palette-shadeLight-15) 20%, transparent)",
      "&:focus-visible": {
        outline: "none",
        boxShadow:
          "0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 22%, transparent), var(--mui-shadows-24)",
      },

      [theme.breakpoints.down("sm")]: {
        margin: 0,
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "100%",
        borderRadius: 0,
      },
    }),
  },
};
