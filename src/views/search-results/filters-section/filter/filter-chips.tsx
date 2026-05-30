import Chips from "@/components/atoms/chips";
import { toggleChipSelection } from "@/store/helper/chip-selection";
import cn from "@/utils/cn";
import type { FilterOption } from "../types";

export { toggleChipSelection };

const FilterChips = ({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value: string[];
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = value.includes(option.value);

      return (
        <Chips
          key={option.value}
          text={option.label}
          variant={isSelected ? "contained" : "outlined"}
          maxWidth="md"
          selected={isSelected}
          onClick={() => onChange(option.value)}
          className={cn(!isSelected && "opacity-90")}
        />
      );
    })}
  </div>
);

export default FilterChips;
