import { DEFAULT_SEARCH_SORT, DEFAULT_VIEW_TYPE } from "./constants";
import dayjs from "dayjs";
import type { SearchInputs } from "./types";

export const createSearchInitialValues = (): SearchInputs => {
  const checkIn = dayjs().add(1, "day");
  return {
    city: "lisbon",
    checkIn: checkIn.format("YYYY-MM-DD"),
    checkOut: checkIn.add(7, "day").format("YYYY-MM-DD"),
    adults: 1,
    children: 0,
    rooms: 1,
    sort: DEFAULT_SEARCH_SORT,
    viewType: DEFAULT_VIEW_TYPE,
  };
};
