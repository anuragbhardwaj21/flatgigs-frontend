import type { AppDispatch } from "../index";
import { api } from "../api";
import type {
  AddWishlistResponse,
  RemoveWishlistResponse,
  WishlistData,
} from "../types/wishlist";

const WISHLIST_TAG = { type: "Wishlist" as const, id: "LIST" };

const patchWishlistIds = (
  dispatch: AppDispatch,
  updater: (ids: string[]) => string[],
) =>
  dispatch(
    wishlistApi.util.updateQueryData("getWishlist", undefined, (draft) => {
      draft.listingIds = updater(draft.listingIds);
    }),
  );

export const wishlistApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<WishlistData, void>({
      query: () => "/v1/wishlist",
      providesTags: [WISHLIST_TAG],
    }),

    addToWishlist: build.mutation<AddWishlistResponse, { listingId: string }>({
      query: (body) => ({
        url: "/v1/wishlist",
        method: "POST",
        body,
      }),
      async onQueryStarted({ listingId }, { dispatch, queryFulfilled }) {
        const patch = patchWishlistIds(dispatch, (ids) =>
          ids.includes(listingId) ? ids : [...ids, listingId],
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    removeFromWishlist: build.mutation<RemoveWishlistResponse, string>({
      query: (listingId) => ({
        url: `/v1/wishlist/${listingId}`,
        method: "DELETE",
      }),
      async onQueryStarted(listingId, { dispatch, queryFulfilled }) {
        const patch = patchWishlistIds(dispatch, (ids) =>
          ids.filter((id) => id !== listingId),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
