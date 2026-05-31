import RenderInput from "@/components/molecules/render-input";
import { useSearch } from "@/context/search";
import { useDayjs } from "@/hooks/use-dayjs";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { Button } from "@mui/material";
import type { Dayjs } from "dayjs";
import { useState } from "react";

type OpenDateField = "checkIn" | "checkOut" | null;

const BookingSearchForm = () => {
  const IconSearch = useIcon("search");
  const dayjs = useDayjs();
  const { searchInputs, setSearchInput, submitSearch, isSearching, formik } =
    useSearch();

  const minCheckIn = dayjs().add(1, "day");
  const checkIn = dayjs(searchInputs.checkIn);
  const checkOut = dayjs(searchInputs.checkOut);
  const canSearch = formik.isValid && !isSearching;

  const [openDate, setOpenDate] = useState<OpenDateField>(null);

  const handleCheckInChange = (value: Dayjs | null) => {
    if (!value) return;

    const currentCheckOut = dayjs(searchInputs.checkOut);
    const nextCheckOut = currentCheckOut.isBefore(value, "day")
      ? value.add(7, "day")
      : currentCheckOut;

    setSearchInput({
      checkIn: value.format("YYYY-MM-DD"),
      checkOut: nextCheckOut.format("YYYY-MM-DD"),
    });
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex h-14 min-w-[720px] items-stretch gap-1 rounded-2xl border border-black/6 bg-black/2 p-1 sm:min-w-0 sm:w-full">
        <RenderInput
          className="min-h-0! min-w-0 flex-1 rounded-xl! border-0! bg-background-paper! shadow-none! hover:bg-background-paper!"
          label="Where"
          icon="location"
          render="search"
          value={searchInputs.city}
          onValueChange={(city) => setSearchInput({ city })}
          onSubmit={submitSearch}
        />
        <RenderInput
          className="min-h-0! min-w-0 flex-1 rounded-xl! border-0! bg-background-paper! shadow-none! hover:bg-background-paper!"
          label="Check in"
          icon="calendar"
          render="date"
          dateValue={checkIn}
          onDateChange={handleCheckInChange}
          dateOpen={openDate === "checkIn"}
          onDateOpen={() => setOpenDate("checkIn")}
          onDateClose={() => setOpenDate(null)}
          minDate={minCheckIn}
        />
        <RenderInput
          className="min-h-0! min-w-0 flex-1 rounded-xl! border-0! bg-background-paper! shadow-none! hover:bg-background-paper!"
          label="Check out"
          icon="calendar"
          render="date"
          dateValue={checkOut}
          onDateChange={(value) =>
            value && setSearchInput({ checkOut: value.format("YYYY-MM-DD") })
          }
          dateOpen={openDate === "checkOut"}
          onDateOpen={() => setOpenDate("checkOut")}
          onDateClose={() => setOpenDate(null)}
          minDate={checkIn.add(1, "day")}
        />
        <RenderInput
          className="min-h-0! min-w-0 flex-1 rounded-xl! border-0! bg-background-paper! shadow-none! hover:bg-background-paper!"
          label="Guests"
          icon="users"
          render="guests"
          guestAdults={searchInputs.adults}
          guestChildren={searchInputs.children ?? 0}
          guestRooms={searchInputs.rooms ?? 1}
          onGuestBreakdownChange={({ adults, children, rooms }) =>
            setSearchInput({ adults, children, rooms })
          }
        />
        <Button
          type="button"
          variant="text"
          color="primary"
          disabled={!canSearch}
          onClick={submitSearch}
          startIcon={<IconSearch size={20} />}
          loading={isSearching}
          className={cn(
            "h-auto! min-w-[7.5rem]! shrink-0 rounded-xl! px-4! font-semibold! normal-case! shadow-sm!",
            canSearch
              ? "bg-main! text-white! hover:bg-main/90!"
              : "cursor-not-allowed! bg-black/5! text-black/35!",
          )}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default BookingSearchForm;
