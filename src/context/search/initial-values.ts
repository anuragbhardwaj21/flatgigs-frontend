import { DEFAULT_SEARCH_SORT } from "./constants";
import dayjs from "dayjs";
import type { SearchInputs } from "./types";

export const createSearchInitialValues = (): SearchInputs => {
  const checkIn = dayjs().add(1, "day");
  return {
    city: "",
    checkIn: checkIn.format("YYYY-MM-DD"),
    checkOut: checkIn.add(7, "day").format("YYYY-MM-DD"),
    adults: 1,
    sort: DEFAULT_SEARCH_SORT,
  };
};
