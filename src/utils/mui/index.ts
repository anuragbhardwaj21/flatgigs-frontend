import { extendTheme } from "@mui/material/styles";
import type { CssVarsTheme } from "@mui/material/styles";

import { colorSchemeMap, type BrandSchemeKey } from "./color-schemes";
import { muiButton } from "./components/mui-button";
import { muiCssBaseline } from "./components/mui-css-baseline";
import { muiDialog } from "./components/mui-dialog";
import { muiInputLabel } from "./components/mui-input-label";
import { muiOutlinedInput, muiTextField } from "./components/mui-text-field";
import { muiTypography } from "./components/mui-typography";

export const buildMuiTheme = (
  colorScheme: BrandSchemeKey = "orange",
): CssVarsTheme => {

  return extendTheme({
    defaultColorScheme: "light",
    shape: {
      borderRadius: 8,
    },
    colorSchemes: colorSchemeMap[colorScheme],
    colorSchemeSelector: "class",
    typography: muiTypography,
    components: {
      MuiButton: muiButton,
      MuiCssBaseline: muiCssBaseline,
      MuiDialog: muiDialog,
      MuiInputLabel: muiInputLabel,
      MuiOutlinedInput: muiOutlinedInput,
      MuiTextField: muiTextField,
    },
  });
};
