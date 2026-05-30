import type { ThemeOptions } from "@mui/material/styles";
import { TEXT_PRIMARY } from "../color-schemes";
import { FONT_FAMILY } from "./mui-typography";

export const muiCssBaseline: NonNullable<
  ThemeOptions["components"]
>["MuiCssBaseline"] = {
  styleOverrides: {
    html: { fontFamily: FONT_FAMILY },
    body: {
      fontFamily: FONT_FAMILY,
      color: TEXT_PRIMARY,
    },
    "#root": { fontFamily: FONT_FAMILY },
  },
};
