import {
  InputAdornment,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useIcon, type IconName } from "@/hooks/use-icons";
import cn from "@/utils/cn";

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  startIcon: IconName;
  className?: string;
  minWidth?: number;
};

const selectSx = {
  height: 40,
  minWidth: 200,
  borderRadius: 9999,
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "rgba(0, 0, 0, 0.8)",
  bgcolor: "background.paper",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(0, 0, 0, 0.14)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
    borderWidth: 1,
  },
  "& .MuiSelect-select": {
    py: 1,
    pr: 4,
    pl: 0.5,
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-icon": {
    color: "rgba(0, 0, 0, 0.5)",
    right: 12,
  },
};

const menuPaperSx = {
  mt: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  "& .MuiMenuItem-root": {
    fontSize: "0.875rem",
    fontWeight: 500,
    py: 1,
    "&.Mui-selected": {
      bgcolor: "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
      fontWeight: 600,
    },
    "&.Mui-selected:hover": {
      bgcolor: "color-mix(in srgb, var(--mui-palette-primary-main) 18%, transparent)",
    },
  },
};

const CustomSelect = ({
  value,
  onChange,
  options,
  startIcon,
  className,
  minWidth = 200,
}: CustomSelectProps) => {
  const Icon = useIcon(startIcon);

  return (
    <Select
      value={value}
      onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      className={cn(className)}
      startAdornment={
        <InputAdornment position="start" sx={{ ml: 0.75, mr: 0.5 }}>
          <Icon className="text-base text-black/60" />
        </InputAdornment>
      }
      sx={{ ...selectSx, minWidth }}
      MenuProps={{
        slotProps: {
          paper: { sx: menuPaperSx },
          list: { sx: { py: 0.5 } },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
