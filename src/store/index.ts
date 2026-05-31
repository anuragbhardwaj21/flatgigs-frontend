import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import "./services/listings-api";
import "./services/search-api";
import "./services/wishlist-api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [api.reducerPath],
        ignoredActionPaths: ["meta.arg", "meta.baseQueryMeta", "payload"],
      },
      immutableCheck: {
        ignoredPaths: [api.reducerPath],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
