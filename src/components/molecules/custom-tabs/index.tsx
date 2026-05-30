import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  type TabProps as MuiTabProps,
} from "@mui/material";
import {
  useCallback,
  useState,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import cn from "@/utils/cn";

const INSET = 4;
const PILL_RADIUS = 9999;

const tabsSx = {
  minHeight: "unset",
  p: `${INSET}px`,
  borderRadius: PILL_RADIUS,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "rgba(0, 0, 0, 0.08)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  "& .MuiTabs-scroller": {
    overflow: "visible !important",
  },
  "& .MuiTabs-flexContainer": {
    gap: `${INSET}px`,
  },
  "& .MuiTabs-indicator": {
    top: 0,
    bottom: INSET,
    height: "100%",
    borderRadius: PILL_RADIUS,
    bgcolor: "primary.main",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.12)",
  },
};

const tabSx = {
  flex: 1,
  minHeight: 32,
  minWidth: 0,
  maxWidth: "none",
  px: 1.5,
  py: 0.75,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  lineHeight: 1.25,
  color: "rgba(0, 0, 0, 0.7)",
  zIndex: 1,
  borderRadius: PILL_RADIUS,
  transition: "color 0.2s ease",
  "&.Mui-selected": {
    color: "#fff",
  },
  "& .MuiTab-icon": {
    margin: 0,
    marginRight: 0.5,
  },
  "&.Mui-selected .MuiTab-icon": {
    color: "#fff",
  },
};

type CustomTabsProps = {
  className?: string;
  width?: number;
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const CustomTabs = ({
  className,
  width = 168,
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: CustomTabsProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;

  const handleChange = useCallback(
    (_: SyntheticEvent, next: string) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlledValue, onValueChange],
  );

  return (
    <MuiTabs
      value={value}
      onChange={handleChange}
      variant="fullWidth"
      className={className}
      sx={{ ...tabsSx, width }}
    >
      {children}
    </MuiTabs>
  );
};

type TabProps = Omit<MuiTabProps, "label" | "children" | "icon"> & {
  children?: ReactNode;
  startIcon?: ReactElement;
};

const Tab = ({
  className,
  children,
  startIcon,
  sx,
  iconPosition = "start",
  ...muiProps
}: TabProps) => (
  <MuiTab
    {...muiProps}
    icon={startIcon}
    iconPosition={startIcon ? (iconPosition ?? "start") : undefined}
    label={children}
    disableRipple
    className={cn(className)}
    sx={{ ...tabSx, ...sx }}
  />
);

CustomTabs.Tab = Tab;

export default CustomTabs;
export { Tab };
