import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { persistedCompareReducer } from "./persist";
import "./services/compare-api";
import "./services/listings-api";
import "./services/search-api";
import "./services/wishlist-api";
import "./services/traces-api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  compare: persistedCompareReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [api.reducerPath],
        ignoredActionPaths: ["meta.arg", "meta.baseQueryMeta", "payload"],
      },
      immutableCheck: {
        ignoredPaths: [api.reducerPath],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
