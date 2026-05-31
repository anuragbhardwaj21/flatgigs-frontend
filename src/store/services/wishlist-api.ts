import type { AppDispatch } from "../index";
import { api } from "../api";
import type {
  AddWishlistResponse,
  RemoveWishlistResponse,
  WishlistData,
  WishlistListing,
} from "../types/wishlist";

const WISHLIST_TAG = { type: "Wishlist" as const, id: "LIST" };

const patchWishlistItems = (
  dispatch: AppDispatch,
  updater: (items: WishlistListing[]) => WishlistListing[],
) =>
  dispatch(
    wishlistApi.util.updateQueryData("getWishlist", undefined, (draft) => {
      draft.items = updater(draft.items);
      draft.total = draft.items.length;
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
      invalidatesTags: [WISHLIST_TAG],
    }),

    removeFromWishlist: build.mutation<RemoveWishlistResponse, string>({
      query: (listingId) => ({
        url: `/v1/wishlist/${listingId}`,
        method: "DELETE",
      }),
      async onQueryStarted(listingId, { dispatch, queryFulfilled }) {
        const patch = patchWishlistItems(dispatch, (items) =>
          items.filter((item) => item.id !== listingId),
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
