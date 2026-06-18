import type { CssVarsThemeOptions } from "@mui/material/styles";

type Schemes = NonNullable<CssVarsThemeOptions["colorSchemes"]>;

export const TEXT_PRIMARY = "rgba(0, 0, 0, 0.8)";

const baseLight = {
  text: {
    primary: TEXT_PRIMARY,
    secondary: TEXT_PRIMARY,
  },
  background: {
    default: "#FFFFFF",
    paper: "#F7F7F7",
  },
  success: {
    main: "#2E7D32",
    light: "#66BB6A",
    dark: "#1B5E20",
  },
  info: {
    main: "#1A7CFF",
    light: "#69AEFF",
    dark: "#0B4FD6",
  },
  warning: {
    main: "#E6A700",
    light: "#F5C542",
    dark: "#B77900",
  },
  error: {
    main: "#FC3838",
    light: "#FF6B6B",
    dark: "#9A1F1F",
  },
};

const baseDark = {
  background: {
    default: "#000000",
    paper: "#141414",
  },
  success: {
    main: "#4CAF50",
    light: "#7DFF8A",
    dark: "#2E7D32",
  },
  info: {
    main: "#4D9BFF",
    light: "#86C2FF",
    dark: "#1A7CFF",
  },
  warning: {
    main: "#FFB020",
    light: "#FFD27A",
    dark: "#D48A00",
  },
  error: {
    main: "#FF2929",
    light: "#FF7A7A",
    dark: "#C62828",
  },
};

const schemes = (lightMain: string, darkMain: string): Schemes => ({
  light: {
    palette: {
      primary: { main: lightMain },
      ...baseLight,
    },
  },
  dark: {
    palette: {
      primary: { main: darkMain },
      ...baseDark,
    },
  },
});

/** [lightModePrimary, darkModePrimary] */
export const brandPrimaryMap = {
  orange: ["#FFA500", "#FF5533"],
  blue: ["#2071f5", "#2071f5"],
  green: ["#00D100", "#00D100"],
  purple: ["#8B5CF6", "#8B5CF6"],
  red: ["#EF4444", "#EF4444"],
  yellow: ["#EAB308", "#EAB308"],

  cyan: ["#06B6D4", "#22D3EE"],
  teal: ["#14B8A6", "#2DD4BF"],
  emerald: ["#10B981", "#34FFB5"],
  lime: ["#84CC16", "#B7FF3C"],
  amber: ["#F59E0B", "#FFC14D"],
  rose: ["#F43F5E", "#FF5C8A"],
  pink: ["#EC4899", "#FF66C4"],
  indigo: ["#6366F1", "#818CF8"],
  sky: ["#0EA5E9", "#38BDF8"],
  violet: ["#7C3AED", "#A970FF"],

  coral: ["#FF6B6B", "#FF7F7F"],
  magenta: ["#D946EF", "#F05CFF"],
  neon: ["#39FF14", "#66FF66"],
  aqua: ["#00CFFF", "#33E1FF"],
  royal: ["#4169E1", "#5B8CFF"],
  sunset: ["#FF7E5F", "#FF9671"],
  gold: ["#E6B800", "#FFD700"],
  lava: ["#FF5722", "#FF784E"],

  mint: ["#4ADE80", "#7CFFB2"],
  berry: ["#C026D3", "#E879F9"],
  sapphire: ["#2563EB", "#4F8CFF"],
  ice: ["#67E8F9", "#A5F3FC"],
  peach: ["#FB923C", "#FDBA74"],
  flamingo: ["#FB7185", "#FF8FA3"],
  plasma: ["#A855F7", "#D580FF"],
  cyber: ["#00E5FF", "#5EFFF5"],
  toxic: ["#A3E635", "#D9FF66"],
  midnight: ["#334155", "#64748B"],
} as const;

export type BrandSchemeKey = keyof typeof brandPrimaryMap;

export const colorSchemeMap = Object.fromEntries(
  Object.entries(brandPrimaryMap).map(([key, value]) => [
    key,
    schemes(value[0], value[1]),
  ]),
) as Record<BrandSchemeKey, ReturnType<typeof schemes>>;

export const brandSchemeKeys = Object.keys(brandPrimaryMap) as BrandSchemeKey[];
