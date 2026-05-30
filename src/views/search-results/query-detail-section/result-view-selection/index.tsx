import CustomSelect from "@/components/molecules/custom-select";
import CustomTabs from "@/components/molecules/custom-tabs";
import {
  DEFAULT_SEARCH_SORT,
  useSearch,
  type SearchSort,
} from "@/context/search";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import { Divider } from "@mui/material";
import { useCallback, useState } from "react";

const DATE_DISPLAY_FORMAT = "MMM D";

const formatCityLabel = (city: string) =>
  city.trim().replace(/\b\w/g, (char) => char.toUpperCase());

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "popularity", label: "Popular" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
  { value: "distance", label: "Distance" },
];

const ResultViewSelection = () => {
  const [value, setValue] = useState("lisbon");
  const [mapValue, setMapValue] = useState("list");
  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");
  const dayjs = useDayjs();
  const { searchData, searchInputs, setSearchInput, refreshSearch } =
    useSearch();
  const total = searchData?.total ?? 0;
  const sort = searchInputs.sort ?? DEFAULT_SEARCH_SORT;

  const cityLabel = formatCityLabel(searchInputs.city);
  const dateRange = `${dayjs(searchInputs.checkIn).format(DATE_DISPLAY_FORMAT)} — ${dayjs(searchInputs.checkOut).format(DATE_DISPLAY_FORMAT)}`;
  const stayLabel = total === 1 ? "stay" : "stays";

  const handleSortChange = useCallback(
    (nextSort: string) => {
      const sortValue = nextSort as SearchSort;
      setSearchInput({ sort: sortValue });
      refreshSearch({ sort: sortValue });
    },
    [refreshSearch, setSearchInput],
  );

  return (
    <div className="flex w-full items-center justify-between rounded-xl py-2">
      <div className="flex items-center">
        <CustomTabs value={value} onValueChange={setValue}>
          <CustomTabs.Tab value="lisbon">Lisbon</CustomTabs.Tab>
          <CustomTabs.Tab value="porto">Porto</CustomTabs.Tab>
        </CustomTabs>
        <Divider
          orientation="vertical"
          flexItem
          className="mx-4! h-8! self-center!"
        />
        <p className="text-sm leading-snug text-black/80">
          <strong className="font-semibold text-black/90">
            {total.toLocaleString()} {stayLabel}
          </strong>{" "}
          in {cityLabel} · {dateRange}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <CustomSelect
          value={sort}
          onChange={handleSortChange}
          startIcon="arrowUpDown"
          options={SORT_OPTIONS}
          minWidth={220}
        />
        <CustomTabs value={mapValue} onValueChange={setMapValue} width={200}>
          <CustomTabs.Tab
            value="list"
            startIcon={<GridIcon className="text-base" />}
          >
            List
          </CustomTabs.Tab>
          <CustomTabs.Tab
            value="map"
            startIcon={<MapIcon className="text-base" />}
          >
            Map
          </CustomTabs.Tab>
        </CustomTabs>
      </div>
    </div>
  );
};

export default ResultViewSelection;
