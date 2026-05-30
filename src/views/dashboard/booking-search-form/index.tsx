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
    <div className="flex min-h-14 max-w-[1/2] items-stretch gap-2 rounded-2xl border-2 border-main/10 bg-background-paper p-2 shadow-lg">
      <RenderInput
        className="min-w-0 flex-1"
        label="WHERE"
        icon="location"
        render="search"
        value={searchInputs.city}
        onValueChange={(city) => setSearchInput({ city })}
        onSubmit={submitSearch}
      />
      <RenderInput
        className="min-w-0 flex-1"
        label="CHECK IN"
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
        className="min-w-0 flex-1"
        label="CHECK OUT"
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
        className="min-w-0 flex-1"
        label="GUESTS"
        icon="users"
        render="guests"
        guestCount={searchInputs.adults}
        onGuestCountChange={(adults) => setSearchInput({ adults })}
      />
      <Button
        type="button"
        variant="text"
        color="primary"
        disabled={!canSearch}
        onClick={submitSearch}
        startIcon={<IconSearch size={24} />}
        loading={isSearching}
        className={cn(
          "h-full! w-40! rounded-xl! bg-main/50! font-bold! text-black/70!",
          !canSearch && "cursor-not-allowed! opacity-50!",
        )}
      >
        Search
      </Button>
    </div>
  );
};

export default BookingSearchForm;
