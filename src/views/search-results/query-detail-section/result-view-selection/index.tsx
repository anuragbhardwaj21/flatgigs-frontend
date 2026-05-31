import CustomTabs from "@/components/molecules/custom-tabs";
import { useSearch } from "@/context/search";
import type { SearchViewType } from "@/context/search";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import { Divider } from "@mui/material";
import { useState } from "react";

const DATE_DISPLAY_FORMAT = "MMM D";

const formatCityLabel = (city: string) =>
  city.trim().replace(/\b\w/g, (char) => char.toUpperCase());

const ResultViewSelection = () => {
  const [value, setValue] = useState("lisbon");
  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");
  const dayjs = useDayjs();
  const { searchData, searchInputs, viewType, setViewType } = useSearch();
  const total = searchData?.total ?? 0;

  const cityLabel = formatCityLabel(searchInputs.city);
  const dateRange = `${dayjs(searchInputs.checkIn).format(DATE_DISPLAY_FORMAT)} — ${dayjs(searchInputs.checkOut).format(DATE_DISPLAY_FORMAT)}`;
  const stayLabel = total === 1 ? "stay" : "stays";

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
        <CustomTabs
          value={viewType}
          onValueChange={(next) => setViewType(next as SearchViewType)}
          width={200}
        >
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
