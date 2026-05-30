import Filter from "./index";
import FilterChips from "./filter-chips";
import type { FilterOption } from "../types";

const ChipFilterRow = ({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string) => void;
}) => (
  <Filter title={title}>
    <FilterChips options={options} value={value} onChange={onChange} />
  </Filter>
);

export default ChipFilterRow;
