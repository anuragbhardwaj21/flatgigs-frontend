import type { SearchListingItem } from "@/store/types/search";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const MAX_COMPARE_ITEMS = 3;
export const MIN_COMPARE_TO_OPEN = 2;

export type CompareEntry = {
  id: string;
  listing: SearchListingItem;
  addedAt: string;
};

type CompareState = {
  entries: CompareEntry[];
};

const initialState: CompareState = {
  entries: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addListing: (state, action: PayloadAction<SearchListingItem>) => {
      const listing = action.payload;
      if (state.entries.some((entry) => entry.id === listing.id)) return;
      if (state.entries.length >= MAX_COMPARE_ITEMS) return;
      state.entries.push({
        id: listing.id,
        listing,
        addedAt: new Date().toISOString(),
      });
    },
    removeListing: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
    clearCompare: (state) => {
      state.entries = [];
    },
  },
});

export const { addListing, removeListing, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;

export const selectCompareEntries = (state: RootState) => state.compare.entries;
export const selectCompareCount = (state: RootState) => state.compare.entries.length;
export const selectCompareIds = (state: RootState) =>
  state.compare.entries.map((entry) => entry.id);
export const selectIsInCompare = (id: string) => (state: RootState) =>
  state.compare.entries.some((entry) => entry.id === id);
export const selectCanOpenCompare = (state: RootState) =>
  state.compare.entries.length >= MIN_COMPARE_TO_OPEN;
export const selectCompareIsFull = (state: RootState) =>
  state.compare.entries.length >= MAX_COMPARE_ITEMS;
