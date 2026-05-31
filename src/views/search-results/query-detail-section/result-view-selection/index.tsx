import CustomTabs from "@/components/molecules/custom-tabs";
import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import type { SearchViewType } from "@/context/search";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import { Divider } from "@mui/material";
import { useCallback, useMemo } from "react";

const DATE_DISPLAY_FORMAT = "MMM D";
const CITY_TABS = ["lisbon", "barcelona"] as const;
type CityTab = (typeof CITY_TABS)[number];

const formatCityLabel = (city: string) =>
  city.trim().replace(/\b\w/g, (char) => char.toUpperCase());

const toCityTab = (city: string): CityTab => {
  const key = city.trim().toLowerCase();
  return CITY_TABS.includes(key as CityTab) ? (key as CityTab) : "lisbon";
};

const ResultViewSelection = () => {
  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");
  const dayjs = useDayjs();
  const { searchData, searchInputs, viewType, setViewType, setSearchInput, refreshSearch } =
    useSearch();
  const { setMapExpanded, setMobileListOpen } = useMapResults();
  const total = searchData?.total ?? 0;

  const cityTab = useMemo(() => toCityTab(searchInputs.city), [searchInputs.city]);
  const cityLabel = formatCityLabel(searchInputs.city);
  const dateRange = `${dayjs(searchInputs.checkIn).format(DATE_DISPLAY_FORMAT)} — ${dayjs(searchInputs.checkOut).format(DATE_DISPLAY_FORMAT)}`;
  const stayLabel = total === 1 ? "stay" : "stays";

  const handleViewTypeChange = useCallback(
    (next: string) => {
      const nextView = next as SearchViewType;
      setViewType(nextView);
      setMapExpanded(false);
      setMobileListOpen(false);
      if (nextView === "list" && searchInputs.bounds) {
        const patch = { bounds: undefined, page: 1 };
        setSearchInput(patch);
        refreshSearch(patch);
      }
    },
    [
      refreshSearch,
      searchInputs.bounds,
      setMapExpanded,
      setMobileListOpen,
      setSearchInput,
      setViewType,
    ],
  );

  const handleCityTabChange = useCallback(
    (tab: string) => {
      const nextTab = toCityTab(tab);
      if (nextTab === cityTab) return;

      const patch = {
        city: formatCityLabel(nextTab),
        page: 1,
        bounds: undefined,
        lat: undefined,
        lng: undefined,
      };
      setSearchInput(patch);
      refreshSearch(patch);
    },
    [cityTab, refreshSearch, setSearchInput],
  );

  return (
    <div className="flex w-full items-center justify-between rounded-xl py-2">
      <div className="flex items-center">
        <CustomTabs value={cityTab} onValueChange={handleCityTabChange}>
          <CustomTabs.Tab value="lisbon">Lisbon</CustomTabs.Tab>
          <CustomTabs.Tab value="barcelona">Barcelona</CustomTabs.Tab>
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
        <CustomTabs value={viewType} onValueChange={handleViewTypeChange} width={200}>
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
