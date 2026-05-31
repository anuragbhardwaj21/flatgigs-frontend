import { useMapResults } from "@/context/map-results";
import { useSearch, type SearchViewType } from "@/context/search";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Popover } from "@mui/material";
import type { Dayjs } from "dayjs";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const CITY_TABS = ["lisbon", "barcelona"] as const;
type CityTab = (typeof CITY_TABS)[number];
type OpenDateField = "checkIn" | "checkOut";

type DateAnchor = {
  el: HTMLElement;
  field: OpenDateField;
};

const formatCityLabel = (city: string) =>
  city.trim().replace(/\b\w/g, (char) => char.toUpperCase());

const toCityTab = (city: string): CityTab => {
  const key = city.trim().toLowerCase();
  return CITY_TABS.includes(key as CityTab) ? (key as CityTab) : "lisbon";
};

const pillBase =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-black/6 bg-background-paper text-xs font-semibold text-black/70 transition-colors hover:bg-main/5";

type SearchCriteriaBarProps = {
  filtersOpen: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
};

const SearchCriteriaBar = ({
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
}: SearchCriteriaBarProps) => {
  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");
  const CalendarIcon = useIcon("calendar");
  const UsersIcon = useIcon("users");
  const FilterIcon = useIcon("filter");
  const ChevronIcon = useIcon("chevronRight");
  const dayjs = useDayjs();
  const { searchData, searchInputs, viewType, setViewType, fetchSearch } =
    useSearch();
  const { setMapExpanded, setMobileListOpen } = useMapResults();

  const [dateAnchor, setDateAnchor] = useState<DateAnchor | null>(null);
  const [guestAnchor, setGuestAnchor] = useState<HTMLElement | null>(null);

  const cityTab = useMemo(() => toCityTab(searchInputs.city), [searchInputs.city]);
  const total = searchData?.total ?? 0;
  const minCheckIn = dayjs().add(1, "day");
  const checkIn = dayjs(searchInputs.checkIn);
  const checkOut = dayjs(searchInputs.checkOut);
  const nights = Math.max(checkOut.diff(checkIn, "day"), 1);
  const guestSummary = `${searchInputs.adults}${searchInputs.children ? `+${searchInputs.children}` : ""}`;

  const handleViewTypeChange = useCallback(
    (next: SearchViewType) => {
      setViewType(next);
      setMapExpanded(false);
      setMobileListOpen(false);
      if (next === "list" && searchInputs.bounds) {
        fetchSearch({ bounds: undefined, page: 1 });
      }
    },
    [
      fetchSearch,
      searchInputs.bounds,
      setMapExpanded,
      setMobileListOpen,
      setViewType,
    ],
  );

  const handleCityChange = useCallback(
    (tab: CityTab) => {
      if (tab === cityTab) return;
      fetchSearch({
        city: formatCityLabel(tab),
        page: 1,
        bounds: undefined,
        lat: undefined,
        lng: undefined,
      });
    },
    [cityTab, fetchSearch],
  );

  const handleCheckInChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) return;
      const currentCheckOut = dayjs(searchInputs.checkOut);
      const nextCheckOut = currentCheckOut.isBefore(value, "day")
        ? value.add(Math.max(nights, 1), "day")
        : currentCheckOut;
      fetchSearch({
        checkIn: value.format("YYYY-MM-DD"),
        checkOut: nextCheckOut.format("YYYY-MM-DD"),
        page: 1,
        bounds: undefined,
      });
      setDateAnchor(null);
    },
    [dayjs, fetchSearch, nights, searchInputs.checkOut],
  );

  const handleCheckOutChange = useCallback(
    (value: Dayjs | null) => {
      if (!value) return;
      fetchSearch({
        checkOut: value.format("YYYY-MM-DD"),
        page: 1,
        bounds: undefined,
      });
      setDateAnchor(null);
    },
    [fetchSearch],
  );

  const openDatePicker = useCallback(
    (event: MouseEvent<HTMLButtonElement>, field: OpenDateField) => {
      setDateAnchor({ el: event.currentTarget, field });
    },
    [],
  );

  const handleCalendarChange = useCallback(
    (value: Dayjs | null) => {
      if (!value || !dateAnchor) return;
      if (dateAnchor.field === "checkIn") handleCheckInChange(value);
      else handleCheckOutChange(value);
    },
    [dateAnchor, handleCheckInChange, handleCheckOutChange],
  );

  const handleGuestChange = useCallback(
    (patch: { adults: number; children: number; rooms: number }) => {
      fetchSearch({ ...patch, page: 1 });
    },
    [fetchSearch],
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="inline-flex h-8 shrink-0 overflow-hidden rounded-lg border border-black/6 bg-background-paper p-0.5">
        {CITY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleCityChange(tab)}
            className={cn(
              "rounded-md px-2.5 text-xs font-semibold capitalize transition-colors",
              cityTab === tab
                ? "bg-main text-white shadow-sm"
                : "text-black/60 hover:bg-black/4 hover:text-black/80",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="inline-flex h-8 shrink-0 items-center overflow-hidden rounded-lg border border-black/6 bg-background-paper">
        <button
          type="button"
          onClick={(event) => openDatePicker(event, "checkIn")}
          className="inline-flex h-full items-center gap-1 px-2 text-xs font-semibold text-black/70 hover:bg-main/5"
        >
          <CalendarIcon className="size-3 text-main/70" aria-hidden />
          <span className="tabular-nums">{checkIn.format("MMM D")}</span>
        </button>
        <span className="text-[10px] text-black/25" aria-hidden>
          →
        </span>
        <button
          type="button"
          onClick={(event) => openDatePicker(event, "checkOut")}
          className="inline-flex h-full items-center px-2 text-xs font-semibold tabular-nums text-black/70 hover:bg-main/5"
        >
          {checkOut.format("MMM D")}
        </button>
      </div>

      <Popover
        open={Boolean(dateAnchor)}
        anchorEl={dateAnchor?.el ?? null}
        onClose={() => setDateAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: { mt: 0.5, borderRadius: 2, overflow: "hidden" } },
        }}
      >
        <DateCalendar
          value={dateAnchor?.field === "checkOut" ? checkOut : checkIn}
          minDate={
            dateAnchor?.field === "checkOut"
              ? checkIn.add(1, "day")
              : minCheckIn
          }
          onChange={handleCalendarChange}
        />
      </Popover>

      <button
        type="button"
        onClick={(e) => setGuestAnchor(e.currentTarget)}
        className={cn(pillBase, "gap-1.5 px-2.5")}
      >
        <UsersIcon className="size-3.5 text-main/80" aria-hidden />
        <span className="tabular-nums">{guestSummary}</span>
      </button>

      <Popover
        open={Boolean(guestAnchor)}
        anchorEl={guestAnchor}
        onClose={() => setGuestAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: { mt: 0.5, borderRadius: 2, p: 2, minWidth: 220 } },
        }}
      >
        {(
          [
            { key: "adults", label: "Adults", value: searchInputs.adults, min: 1 },
            {
              key: "children",
              label: "Children",
              value: searchInputs.children ?? 0,
              min: 0,
            },
            { key: "rooms", label: "Rooms", value: searchInputs.rooms ?? 1, min: 1 },
          ] as const
        ).map((row) => (
          <div
            key={row.key}
            className="mb-2 flex items-center justify-between gap-4 last:mb-0"
          >
            <span className="text-sm text-black/70">{row.label}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={row.value <= row.min}
                onClick={() =>
                  handleGuestChange({
                    adults: row.key === "adults" ? row.value - 1 : searchInputs.adults,
                    children:
                      row.key === "children"
                        ? row.value - 1
                        : (searchInputs.children ?? 0),
                    rooms:
                      row.key === "rooms" ? row.value - 1 : (searchInputs.rooms ?? 1),
                  })
                }
                className="flex size-7 items-center justify-center rounded-full border border-black/15 disabled:opacity-30"
              >
                <FiMinus />
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums">
                {row.value}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleGuestChange({
                    adults: row.key === "adults" ? row.value + 1 : searchInputs.adults,
                    children:
                      row.key === "children"
                        ? row.value + 1
                        : (searchInputs.children ?? 0),
                    rooms:
                      row.key === "rooms" ? row.value + 1 : (searchInputs.rooms ?? 1),
                  })
                }
                className="flex size-7 items-center justify-center rounded-full border border-black/15"
              >
                <FiPlus />
              </button>
            </div>
          </div>
        ))}
      </Popover>

      <span className="hidden h-8 items-center rounded-lg bg-black/4 px-2 text-[11px] font-medium text-black/50 sm:inline-flex">
        <span className="font-semibold tabular-nums text-black/75">
          {total.toLocaleString()}
        </span>
        <span className="mx-1 text-black/25">·</span>
        {nights}n
      </span>

      <div className="ml-auto flex items-center gap-1">
        <div className="inline-flex h-8 shrink-0 overflow-hidden rounded-lg border border-black/6 bg-background-paper p-0.5">
          <button
            type="button"
            aria-label="List view"
            onClick={() => handleViewTypeChange("list")}
            className={cn(
              "inline-flex h-full items-center gap-1 rounded-md px-2 text-xs font-semibold transition-colors",
              viewType === "list"
                ? "bg-main text-white"
                : "text-black/55 hover:bg-black/4 hover:text-black/75",
            )}
          >
            <GridIcon className="size-3.5" />
            List
          </button>
          <button
            type="button"
            aria-label="Map view"
            onClick={() => handleViewTypeChange("map")}
            className={cn(
              "inline-flex h-full items-center gap-1 rounded-md px-2 text-xs font-semibold transition-colors",
              viewType === "map"
                ? "bg-main text-white"
                : "text-black/55 hover:bg-black/4 hover:text-black/75",
            )}
          >
            <MapIcon className="size-3.5" />
            Map
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          className={cn(
            pillBase,
            "relative gap-1 px-2.5",
            filtersOpen && "border-main/30 bg-main/8 text-main",
            activeFilterCount > 0 && !filtersOpen && "border-main/25 bg-main/5",
          )}
        >
          <FilterIcon className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Filters</span>
          <ChevronIcon
            className={cn(
              "size-3 transition-transform",
              filtersOpen && "rotate-90",
            )}
            aria-hidden
          />
          {activeFilterCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-main text-[9px] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
};

export default SearchCriteriaBar;
