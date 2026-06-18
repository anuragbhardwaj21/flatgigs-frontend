import { ThemeProvider } from "@mui/material/styles";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildMuiTheme } from ".";
import {
  brandPrimaryMap,
  brandSchemeKeys,
  colorSchemeMap,
  type BrandSchemeKey,
} from "./color-schemes";
import { useThemeFavicon } from "./use-theme-favicon";

const THEME_SCHEME_STORAGE_KEY = "zavo_theme_scheme";
const THEME_SCHEME_TRANSITION_MS = 150;
export const DEFAULT_THEME_SCHEME: BrandSchemeKey = "orange";

let transitionTimer: number | undefined;

type ThemeSchemeContextValue = {
  scheme: BrandSchemeKey;
  schemes: BrandSchemeKey[];
  setScheme: (scheme: BrandSchemeKey) => void;
};

const ThemeSchemeContext = createContext<ThemeSchemeContextValue | null>(null);

const isBrandSchemeKey = (value: unknown): value is BrandSchemeKey =>
  typeof value === "string" && value in colorSchemeMap;

const hexToRgbChannel = (hex: string) => {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  const numeric = Number.parseInt(normalized, 16);
  return `${(numeric >> 16) & 255} ${(numeric >> 8) & 255} ${numeric & 255}`;
};

const applyThemeSchemeVariables = (scheme: BrandSchemeKey) => {
  if (typeof document === "undefined") return;

  const [lightMain, darkMain] = brandPrimaryMap[scheme];
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--mui-palette-primary-main", lightMain);
  rootStyle.setProperty("--mui-palette-primary-mainChannel", hexToRgbChannel(lightMain));
  rootStyle.setProperty("--mui-palette-primary-light", lightMain);
  rootStyle.setProperty("--mui-palette-primary-lightChannel", hexToRgbChannel(lightMain));
  rootStyle.setProperty("--mui-palette-primary-dark", darkMain);
  rootStyle.setProperty("--mui-palette-primary-darkChannel", hexToRgbChannel(darkMain));
};

const runThemeSchemeTransition = (callback: () => void) => {
  if (typeof window === "undefined") {
    callback();
    return;
  }

  const root = document.documentElement;

  if (transitionTimer) window.clearTimeout(transitionTimer);

  root.dataset.themeSchemeTransition = "true";
  void root.offsetWidth;
  callback();

  transitionTimer = window.setTimeout(() => {
    delete root.dataset.themeSchemeTransition;
    transitionTimer = undefined;
  }, THEME_SCHEME_TRANSITION_MS);
};

const readStoredThemeScheme = (): BrandSchemeKey => {
  if (typeof window === "undefined") return DEFAULT_THEME_SCHEME;

  try {
    const stored = window.localStorage.getItem(THEME_SCHEME_STORAGE_KEY);
    const scheme = isBrandSchemeKey(stored) ? stored : DEFAULT_THEME_SCHEME;
    applyThemeSchemeVariables(scheme);
    return scheme;
  } catch {
    return DEFAULT_THEME_SCHEME;
  }
};

const persistThemeScheme = (scheme: BrandSchemeKey) => {
  try {
    window.localStorage.setItem(THEME_SCHEME_STORAGE_KEY, scheme);
  } catch {
    // Theme selection should still work if storage is unavailable.
  }
};

export const ThemeSchemeProvider = ({ children }: { children: ReactNode }) => {
  const [scheme, setSchemeState] = useState(readStoredThemeScheme);
  const theme = useMemo(() => buildMuiTheme(DEFAULT_THEME_SCHEME), []);
  useThemeFavicon(scheme);

  const value = useMemo<ThemeSchemeContextValue>(
    () => ({
      scheme,
      schemes: brandSchemeKeys,
      setScheme: (nextScheme) => {
        if (nextScheme === scheme) return;
        runThemeSchemeTransition(() => applyThemeSchemeVariables(nextScheme));
        setSchemeState(nextScheme);
        persistThemeScheme(nextScheme);
      },
    }),
    [scheme],
  );

  return (
    <ThemeSchemeContext.Provider value={value}>
      <ThemeProvider theme={theme} defaultMode="light">
        {children}
      </ThemeProvider>
    </ThemeSchemeContext.Provider>
  );
};

export const useThemeScheme = () => {
  const context = useContext(ThemeSchemeContext);
  if (!context) {
    throw new Error("useThemeScheme must be used within ThemeSchemeProvider");
  }
  return context;
};
