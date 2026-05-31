import type { ListingDetail } from "./listings";

export type WishlistListing = ListingDetail & {
  savedAt: string;
};

export type WishlistData = {
  items: WishlistListing[];
  total: number;
};

export type AddWishlistResponse = {
  listingId: string;
};

export type RemoveWishlistResponse = {
  removed: string;
};
