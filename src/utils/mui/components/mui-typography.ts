import type { ThemeOptions } from "@mui/material/styles";
import { TEXT_PRIMARY } from "../color-schemes";

export const FONT_FAMILY = '"Manrope", sans-serif';

export const muiTypography: NonNullable<ThemeOptions["typography"]> = {
  fontFamily: FONT_FAMILY,
  fontSize: 14,
  htmlFontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  allVariants: {
    fontFamily: FONT_FAMILY,
    color: TEXT_PRIMARY,
  },
};
