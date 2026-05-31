import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/services/wishlist-api";
import { useCallback, type MouseEvent } from "react";

export const useWishlist = (listingId: string) => {
  const { data } = useGetWishlistQuery();
  const [addToWishlist, addState] = useAddToWishlistMutation();
  const [removeFromWishlist, removeState] = useRemoveFromWishlistMutation();

  const isSaved = data?.items.some((item) => item.id === listingId) ?? false;
  const isBusy = addState.isLoading || removeState.isLoading;

  const toggle = useCallback(
    (event?: MouseEvent) => {
      event?.stopPropagation();
      if (isBusy) return;
      if (isSaved) {
        void removeFromWishlist(listingId);
      } else {
        void addToWishlist({ listingId });
      }
    },
    [isBusy, isSaved, listingId, addToWishlist, removeFromWishlist],
  );

  return { isSaved, toggle, isBusy };
};
