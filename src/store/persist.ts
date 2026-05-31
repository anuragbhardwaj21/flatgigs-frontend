import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import compareReducer from "./slices/compare-slice";

const storage = createWebStorage("local");

export const comparePersistConfig = {
  key: "compare",
  storage,
  version: 1,
};

export const persistedCompareReducer = persistReducer(
  comparePersistConfig,
  compareReducer,
);
